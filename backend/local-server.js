// Simple API Gateway for Local Development
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Balance persistence file
const BALANCE_FILE = path.join(__dirname, 'wallet-balance.json');

// Load balance from file or use default
function loadBalance() {
    try {
        if (fs.existsSync(BALANCE_FILE)) {
            const data = fs.readFileSync(BALANCE_FILE, 'utf8');
            const balanceData = JSON.parse(data);
            console.log('Loaded balance from file:', balanceData.balance);
            return balanceData.balance;
        }
    } catch (error) {
        console.error('Error loading balance file:', error);
    }
    // Default balance if no file exists
    return 400.00; // User deposited $400, no trial amount
}

// Save balance to file
function saveBalance(balance) {
    try {
        const balanceData = { balance: balance, lastUpdated: new Date().toISOString() };
        fs.writeFileSync(BALANCE_FILE, JSON.stringify(balanceData, null, 2));
        console.log('Saved balance to file:', balance);
    } catch (error) {
        console.error('Error saving balance file:', error);
    }
}

// Mock data for development
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Admin User', email: 'admin123@redtech.com', isAdmin: true }
];

const mockDescriptions = [
    {
        id: 1,
        serverName: 'Epic Gaming Server',
        gameType: 'Minecraft',
        description: 'Welcome to our amazing Minecraft server!',
        style: 'casual'
    }
];

const mockContactMessages = [];

// API Routes (must come before static file serving)
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/users', (req, res) => {
    res.json({ users: mockUsers });
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    
    // Check for admin login first
    if (email === 'admin123@redtech.com' && password === '123456') {
        const user = mockUsers.find(u => u.email === email);
        res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, isAdmin: true },
            token: 'mock-admin-jwt-token-' + user.id
        });
    } else if (email === 'admin123@redtech.com') {
        // Admin email but wrong password
        res.status(401).json({ error: 'Invalid admin credentials' });
    } else {
        // Regular user authentication
        const user = mockUsers.find(u => u.email === email && !u.isAdmin);
        if (user && password) { // Password check is very basic here
            res.json({
                success: true,
                user: { id: user.id, name: user.name, email: user.email },
                token: 'mock-jwt-token-' + user.id
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
});

app.post('/api/users/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Comprehensive validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    // Password validation
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Name validation
    if (name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ error: 'This email is already registered. Please use a different email or try logging in.' });
    }
    
    const newUser = {
        id: mockUsers.length + 1,
        name: name.trim(),
        email: email.toLowerCase().trim()
    };
    
    mockUsers.push(newUser);
    
    res.json({
        success: true,
        user: newUser,
        token: 'mock-jwt-token-' + newUser.id
    });
});

// Wallet API (Mock)
// Mock wallet data - Load from file or use default
let mockWalletBalance = loadBalance();

// Mock transactions array to track all wallet transactions
let mockTransactions = [
    {
        id: 1,
        type: 'deposit',
        amount: 400.00,
        description: 'Initial deposit',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'completed'
    },
    {
        id: 2,
        type: 'deposit',
        amount: 100.00,
        description: 'Additional deposit',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        status: 'completed'
    },
    {
        id: 3,
        type: 'deposit',
        amount: 100.00,
        description: 'Additional deposit',
        timestamp: new Date().toISOString(), // Just now
        status: 'completed'
    }
];

app.get('/api/wallet/balance', (req, res) => {
    res.json({ balance: mockWalletBalance, currency: 'USD' });
});

app.post('/api/wallet/deposit', (req, res) => {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Update the mock balance
    mockWalletBalance += amount;
    
    // Add transaction to history
    const transaction = {
        id: mockTransactions.length + 1,
        type: 'deposit',
        amount: amount,
        description: 'Wallet deposit',
        timestamp: new Date().toISOString(),
        status: 'completed'
    };
    mockTransactions.push(transaction);
    
    // Save balance to file
    saveBalance(mockWalletBalance);
    
    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            transactionId: 'txn-' + Date.now(),
            newBalance: mockWalletBalance
        });
    }, 1000);
});

app.post('/api/wallet/transfer', (req, res) => {
    const { amount, recipientId, recipientEmail, note } = req.body;
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid amount' });
    }
    
    if (!recipientId || !recipientEmail) {
        return res.status(400).json({ success: false, error: 'Recipient information required' });
    }
    
    // Check if recipient exists (in a real app, this would check the database)
    const recipientExists = mockUsers.some(user => user.email === recipientEmail);
    if (!recipientExists) {
        return res.status(404).json({ success: false, error: 'Recipient not found' });
    }
    
    if (amount > mockWalletBalance) {
        return res.status(400).json({ success: false, error: 'Insufficient funds' });
    }
    
    // Update the mock balance
    mockWalletBalance -= amount;
    
    // Add transaction to history
    const transaction = {
        id: mockTransactions.length + 1,
        type: 'transfer',
        amount: amount,
        description: `Transfer to ${recipientEmail}`,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };
    mockTransactions.push(transaction);
    
    // Save balance to file
    saveBalance(mockWalletBalance);
    
    // Simulate transfer processing
    const transactionId = 'txn-' + Date.now();
    const newBalance = mockWalletBalance;
    
    res.json({
        success: true,
        transactionId: transactionId,
        newBalance: newBalance,
        recipientName: mockUsers.find(u => u.email === recipientEmail)?.name || 'Unknown'
    });
});

// Dashboard API
app.get('/api/dashboard', (req, res) => {
    // Calculate stats from transactions
    const totalDeposits = mockTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalTransfers = mockTransactions
        .filter(t => t.type === 'transfer')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const recentTransactions = mockTransactions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5); // Last 5 transactions
    
    res.json({
        success: true,
        data: {
            balance: mockWalletBalance,
            currency: 'USD',
            stats: {
                totalDeposits: totalDeposits,
                totalTransfers: totalTransfers,
                totalSpent: totalTransfers,
                totalEarned: totalDeposits
            },
            recentTransactions: recentTransactions,
            totalTransactions: mockTransactions.length
        }
    });
});

// Contact form API
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            error: 'All fields are required' 
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid email format' 
        });
    }
    
    // Create contact message
    const contactMessage = {
        id: mockContactMessages.length + 1,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    // Add to mock storage
    mockContactMessages.push(contactMessage);
    
    console.log('New contact message received:', contactMessage);
    
    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            messageId: contactMessage.id,
            message: 'Thank you for your message! We will get back to you within 24 hours.'
        });
    }, 500);
});

// Get all contact messages (for admin purposes)
app.get('/api/contact/messages', (req, res) => {
    res.json({
        success: true,
        messages: mockContactMessages,
        total: mockContactMessages.length
    });
});

// Description API (Mock)
app.get('/api/descriptions', (req, res) => {
    res.json({ descriptions: mockDescriptions });
});

app.post('/api/descriptions/generate', (req, res) => {
    const { serverName, gameType, descriptionStyle, serverFeatures, customRequirements } = req.body;
    
    console.log('Received description generation request:', req.body);
    
    // More flexible validation - only serverName is truly required
    if (!serverName || serverName.trim() === '') {
        return res.status(400).json({ 
            success: false,
            error: 'Server name is required' 
        });
    }
    
    // Set defaults for missing fields
    const finalGameType = gameType || 'minecraft';
    const finalDescriptionStyle = descriptionStyle || 'casual';
    const finalServerFeatures = serverFeatures || '';
    const finalCustomRequirements = customRequirements || '';
    
    // Generate mock description based on style
    const templates = {
        professional: `🏆 **${serverName}** - Professional Gaming Experience

Welcome to ${serverName}, where competitive gaming meets professional standards. Our ${finalGameType} server offers:

${finalServerFeatures || '• High-performance dedicated hardware\n• 24/7 uptime guarantee\n• Professional moderation team\n• Regular tournaments and events'}

**Why Choose Us:**
• Low latency, high performance
• Fair play enforcement
• Active community management
• Regular updates and maintenance

Join ${serverName} today and experience gaming at its finest!`,

        casual: `🎮 **${serverName}** - Your Friendly Gaming Home

Hey there, fellow gamer! Welcome to ${serverName}, the most welcoming ${finalGameType} community around!

${finalServerFeatures || '• Friendly, helpful community\n• No pressure, just fun\n• Beginner-friendly environment\n• Regular community events'}

**What Makes Us Special:**
• Everyone is welcome here
• Helpful staff and players
• Fun events and activities
• Chill atmosphere

Come hang out with us at ${serverName} - we'd love to have you! 😊`,

        competitive: `⚡ **${serverName}** - Elite Competitive Gaming

Ready to prove your skills? ${serverName} is the ultimate ${finalGameType} competitive platform.

${finalServerFeatures || '• Ranked matchmaking system\n• Professional tournaments\n• Skill-based progression\n• Competitive leaderboards'}

**Competitive Features:**
• High-stakes tournaments
• Skill-based matchmaking
• Professional coaching available
• Prize pools and rewards

Challenge yourself at ${serverName} - only the best survive!`,

        roleplay: `🎭 **${serverName}** - Immersive Roleplay Experience

Step into a world of endless possibilities at ${serverName}, the premier ${finalGameType} roleplay server.

${finalServerFeatures || '• Rich, detailed lore\n• Character development system\n• Interactive storylines\n• Professional roleplay events'}

**Roleplay Features:**
• Deep character customization
• Dynamic storylines
• Professional roleplay coaching
• Community-driven narratives

Begin your adventure at ${serverName} - where stories come to life!`
    };
    
    const generatedDescription = templates[finalDescriptionStyle] || templates.casual;
    
    // Simulate AI generation delay
    setTimeout(() => {
        const newDescription = {
            id: mockDescriptions.length + 1,
            serverName,
            gameType: finalGameType,
            description: generatedDescription,
            style: finalDescriptionStyle,
            features: finalServerFeatures,
            customRequirements: finalCustomRequirements,
            createdAt: new Date().toISOString()
        };
        
        mockDescriptions.push(newDescription);
        
        console.log('Generated description:', newDescription);
        
        res.json({
            success: true,
            description: newDescription
        });
    }, 2000);
});

app.post('/api/users/verify-admin-password', (req, res) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }
    
    // Find admin user (assuming admin123@redtech.com with password 123456)
    const adminUser = mockUsers.find(user => user.isAdmin);
    
    if (!adminUser) {
        return res.status(404).json({ success: false, message: 'Admin user not found' });
    }
    
    // In a real application, you would hash and compare passwords properly
    // For this demo, we're using the hardcoded admin password
    const isValidPassword = password === '123456';
    
    res.json({ 
        success: true, 
        valid: isValidPassword,
        message: isValidPassword ? 'Password verified' : 'Invalid password'
    });
});

// DELETE API Endpoints for Admin
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    // Find user index
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if trying to delete admin user
    if (mockUsers[userIndex].isAdmin) {
        return res.status(403).json({ success: false, message: 'Cannot delete admin user' });
    }
    
    // Remove user
    mockUsers.splice(userIndex, 1);
    
    res.json({ success: true, message: 'User deleted successfully' });
});

app.delete('/api/descriptions/:id', (req, res) => {
    const descriptionId = parseInt(req.params.id);
    
    // Find description index
    const descIndex = mockDescriptions.findIndex(desc => desc.id === descriptionId);
    
    if (descIndex === -1) {
        return res.status(404).json({ success: false, message: 'Description not found' });
    }
    
    // Remove description
    mockDescriptions.splice(descIndex, 1);
    
    res.json({ success: true, message: 'Description deleted successfully' });
});

app.delete('/api/servers/:id', (req, res) => {
    const serverId = parseInt(req.params.id);
    
    // Find server index (servers are the same as descriptions in this mock)
    const serverIndex = mockDescriptions.findIndex(server => server.id === serverId);
    
    if (serverIndex === -1) {
        return res.status(404).json({ success: false, message: 'Game server not found' });
    }
    
    // Remove server
    mockDescriptions.splice(serverIndex, 1);
    
    res.json({ success: true, message: 'Game server deleted successfully' });
});

app.delete('/api/contact/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    
    // Find message index
    const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
        return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    // Remove message
    mockMessages.splice(messageIndex, 1);
    
    res.json({ success: true, message: 'Message deleted successfully' });
});

// Static file serving (must come after API routes)
app.use(express.static(path.join(__dirname, './')));

// Serve CSS files from css folder
app.use('/css', express.static(path.join(__dirname, './css')));

// Serve JS files from js folder
app.use('/js', express.static(path.join(__dirname, './js')));

// Serve HTML files from html folder
app.use('/html', express.static(path.join(__dirname, './html')));

// Redirect old file names to proper routes
app.get('/03-index.html', (req, res) => {
    const hash = req.url.includes('#') ? req.url.substring(req.url.indexOf('#')) : '';
    res.redirect('/' + hash);
});

app.get('/05-services.html', (req, res) => {
    res.redirect('/services');
});

app.get('/06-about.html', (req, res) => {
    res.redirect('/about');
});

app.get('/07-contact.html', (req, res) => {
    res.redirect('/contact');
});

app.get('/02-dashboard.html', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/04-wallet.html', (req, res) => {
    res.redirect('/wallet');
});

app.get('/01-admin.html', (req, res) => {
    res.redirect('/admin');
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './html/03-index.html'));
});

app.get('/wallet', (req, res) => {
    res.sendFile(path.join(__dirname, './html/04-wallet.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, './html/02-dashboard.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, './html/01-admin.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, './html/06-about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, './html/07-contact.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, './html/05-services.html'));
});

// Start server
app.listen(port, () => {
    console.log(`🚀 GameServer Pro API Gateway running on http://localhost:${port}`);
    console.log(`📱 Frontend available at: http://localhost:${port}`);
    console.log(`💰 Wallet page: http://localhost:${port}/wallet`);
    console.log(`📊 Dashboard: http://localhost:${port}/dashboard`);
    console.log(`🔧 Admin Panel: http://localhost:${port}/admin`);
    console.log(`🔧 API Health: http://localhost:${port}/health`);
});

module.exports = app;
