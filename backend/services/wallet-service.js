// Secure Wallet Service - Node.js/Express
// Handles all financial transactions with proper security measures

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const validator = require('validator');

const app = express();
const port = process.env.PORT || 3002;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for wallet operations
const walletLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many wallet requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

// Encryption utilities
class EncryptionService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    }

    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher(this.algorithm, this.key);
        cipher.setAAD(Buffer.from('gameserver-pro', 'utf8'));
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encryptedData) {
        const decipher = crypto.createDecipher(this.algorithm, this.key);
        decipher.setAAD(Buffer.from('gameserver-pro', 'utf8'));
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }
}

const encryptionService = new EncryptionService();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user still exists and is active
        const userResult = await pool.query(
            'SELECT id, is_active FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
            return res.status(401).json({ error: 'Invalid or inactive user' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Input validation middleware
const validateWalletInput = (req, res, next) => {
    const { amount, currency } = req.body;
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
    }
    
    if (amount > 10000) {
        return res.status(400).json({ error: 'Amount exceeds maximum limit' });
    }
    
    if (currency && !['USD', 'EUR', 'GBP'].includes(currency)) {
        return res.status(400).json({ error: 'Invalid currency' });
    }
    
    next();
};

// Audit logging
const logAuditEvent = async (userId, action, resourceType, resourceId, oldValues, newValues, req) => {
    try {
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                userId,
                action,
                resourceType,
                resourceId,
                oldValues ? JSON.stringify(oldValues) : null,
                newValues ? JSON.stringify(newValues) : null,
                req.ip,
                req.get('User-Agent')
            ]
        );
    } catch (error) {
        console.error('Audit logging failed:', error);
    }
};

// Security event logging
const logSecurityEvent = async (userId, eventType, severity, description, req, metadata = {}) => {
    try {
        await pool.query(
            `INSERT INTO security_events (user_id, event_type, severity, description, ip_address, user_agent, metadata)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                userId,
                eventType,
                severity,
                description,
                req.ip,
                req.get('User-Agent'),
                JSON.stringify(metadata)
            ]
        );
    } catch (error) {
        console.error('Security event logging failed:', error);
    }
};

// Health check endpoints
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/ready', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(503).json({ status: 'not ready', error: error.message });
    }
});

// Get wallet balance
app.get('/api/wallet/balance', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT balance, currency FROM wallets WHERE user_id = $1 AND is_active = true',
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json({
            balance: parseFloat(result.rows[0].balance),
            currency: result.rows[0].currency
        });
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get wallet transactions
app.get('/api/wallet/transactions', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, type } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT t.id, t.type, t.amount, t.currency, t.status, t.description, t.created_at
            FROM transactions t
            JOIN wallets w ON t.wallet_id = w.id
            WHERE w.user_id = $1
        `;
        const params = [req.user.userId];
        
        if (type) {
            query += ' AND t.type = $2';
            params.push(type);
        }
        
        query += ' ORDER BY t.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
        
        const result = await pool.query(query, params);
        
        res.json({
            transactions: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: result.rows.length === parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add funds to wallet
app.post('/api/wallet/deposit', authenticateToken, walletLimiter, validateWalletInput, async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { amount, currency = 'USD', paymentMethodId } = req.body;
        
        // Get user's wallet
        const walletResult = await client.query(
            'SELECT id, balance FROM wallets WHERE user_id = $1 AND currency = $2',
            [req.user.userId, currency]
        );
        
        if (walletResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Wallet not found' });
        }
        
        const wallet = walletResult.rows[0];
        
        // Create transaction record
        const transactionResult = await client.query(
            `INSERT INTO transactions (wallet_id, user_id, type, amount, currency, status, description, payment_method_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id`,
            [
                wallet.id,
                req.user.userId,
                'deposit',
                amount,
                currency,
                'processing',
                `Deposit of ${currency} ${amount}`,
                paymentMethodId
            ]
        );
        
        const transactionId = transactionResult.rows[0].id;
        
        // Simulate payment gateway processing
        // In production, integrate with actual payment gateway (Stripe, PayPal, etc.)
        const paymentSuccess = await simulatePaymentGateway(amount, paymentMethodId);
        
        if (paymentSuccess) {
            // Update transaction status
            await client.query(
                'UPDATE transactions SET status = $1, processed_at = CURRENT_TIMESTAMP WHERE id = $2',
                ['completed', transactionId]
            );
            
            // Update wallet balance
            await client.query(
                'UPDATE wallets SET balance = balance + $1 WHERE id = $2',
                [amount, wallet.id]
            );
            
            await client.query('COMMIT');
            
            // Log audit event
            await logAuditEvent(
                req.user.userId,
                'DEPOSIT',
                'wallet',
                wallet.id,
                { balance: parseFloat(wallet.balance) },
                { balance: parseFloat(wallet.balance) + amount },
                req
            );
            
            res.json({
                success: true,
                transactionId,
                newBalance: parseFloat(wallet.balance) + amount
            });
        } else {
            await client.query('ROLLBACK');
            
            // Log security event for failed payment
            await logSecurityEvent(
                req.user.userId,
                'PAYMENT_FAILED',
                'medium',
                `Failed deposit attempt for ${amount} ${currency}`,
                req,
                { amount, currency, paymentMethodId }
            );
            
            res.status(400).json({ error: 'Payment processing failed' });
        }
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing deposit:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Withdraw funds from wallet
app.post('/api/wallet/withdraw', authenticateToken, strictLimiter, validateWalletInput, async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { amount, currency = 'USD', withdrawMethod, accountDetails } = req.body;
        
        // Get user's wallet
        const walletResult = await client.query(
            'SELECT id, balance FROM wallets WHERE user_id = $1 AND currency = $2',
            [req.user.userId, currency]
        );
        
        if (walletResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Wallet not found' });
        }
        
        const wallet = walletResult.rows[0];
        
        // Check sufficient balance
        if (parseFloat(wallet.balance) < amount) {
            await client.query('ROLLBACK');
            
            // Log security event for insufficient funds
            await logSecurityEvent(
                req.user.userId,
                'INSUFFICIENT_FUNDS',
                'low',
                `Withdrawal attempt with insufficient funds: ${amount} ${currency}`,
                req,
                { amount, currency, currentBalance: wallet.balance }
            );
            
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        
        // Create transaction record
        const transactionResult = await client.query(
            `INSERT INTO transactions (wallet_id, user_id, type, amount, currency, status, description, metadata)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id`,
            [
                wallet.id,
                req.user.userId,
                'withdrawal',
                amount,
                currency,
                'processing',
                `Withdrawal of ${currency} ${amount}`,
                JSON.stringify({ withdrawMethod, accountDetails })
            ]
        );
        
        const transactionId = transactionResult.rows[0].id;
        
        // Simulate withdrawal processing
        const withdrawalSuccess = await simulateWithdrawalProcessing(amount, withdrawMethod, accountDetails);
        
        if (withdrawalSuccess) {
            // Update transaction status
            await client.query(
                'UPDATE transactions SET status = $1, processed_at = CURRENT_TIMESTAMP WHERE id = $2',
                ['completed', transactionId]
            );
            
            // Update wallet balance
            await client.query(
                'UPDATE wallets SET balance = balance - $1 WHERE id = $2',
                [amount, wallet.id]
            );
            
            await client.query('COMMIT');
            
            // Log audit event
            await logAuditEvent(
                req.user.userId,
                'WITHDRAWAL',
                'wallet',
                wallet.id,
                { balance: parseFloat(wallet.balance) },
                { balance: parseFloat(wallet.balance) - amount },
                req
            );
            
            res.json({
                success: true,
                transactionId,
                newBalance: parseFloat(wallet.balance) - amount
            });
        } else {
            await client.query('ROLLBACK');
            
            // Log security event for failed withdrawal
            await logSecurityEvent(
                req.user.userId,
                'WITHDRAWAL_FAILED',
                'medium',
                `Failed withdrawal attempt for ${amount} ${currency}`,
                req,
                { amount, currency, withdrawMethod }
            );
            
            res.status(400).json({ error: 'Withdrawal processing failed' });
        }
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing withdrawal:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Add payment method
app.post('/api/wallet/payment-methods', authenticateToken, async (req, res) => {
    try {
        const { type, cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = req.body;
        
        // Validate input
        if (!type || !cardNumber || !expiryMonth || !expiryYear || !cvv || !cardholderName) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Validate card number (Luhn algorithm)
        if (!validateCardNumber(cardNumber)) {
            return res.status(400).json({ error: 'Invalid card number' });
        }
        
        // Encrypt sensitive data
        const encryptedData = encryptionService.encrypt(JSON.stringify({
            cardNumber,
            cvv,
            expiryMonth,
            expiryYear
        }));
        
        // Store payment method
        const result = await pool.query(
            `INSERT INTO payment_methods (user_id, type, encrypted_data, last_four_digits, expiry_month, expiry_year, cardholder_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [
                req.user.userId,
                type,
                JSON.stringify(encryptedData),
                cardNumber.slice(-4),
                expiryMonth,
                expiryYear,
                cardholderName
            ]
        );
        
        // Log audit event
        await logAuditEvent(
            req.user.userId,
            'ADD_PAYMENT_METHOD',
            'payment_method',
            result.rows[0].id,
            null,
            { type, lastFour: cardNumber.slice(-4) },
            req
        );
        
        res.json({
            success: true,
            paymentMethodId: result.rows[0].id
        });
        
    } catch (error) {
        console.error('Error adding payment method:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get payment methods
app.get('/api/wallet/payment-methods', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, type, last_four_digits, expiry_month, expiry_year, cardholder_name, is_default, created_at
             FROM payment_methods
             WHERE user_id = $1 AND is_active = true
             ORDER BY is_default DESC, created_at DESC`,
            [req.user.userId]
        );
        
        res.json({
            paymentMethods: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Utility functions
function validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

async function simulatePaymentGateway(amount, paymentMethodId) {
    // Simulate payment gateway processing
    // In production, integrate with actual payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 95% success rate
    return Math.random() > 0.05;
}

async function simulateWithdrawalProcessing(amount, withdrawMethod, accountDetails) {
    // Simulate withdrawal processing
    // In production, integrate with actual banking/payment systems
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate 90% success rate
    return Math.random() > 0.1;
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
    console.log(`Wallet service running on port ${port}`);
});

module.exports = app;
