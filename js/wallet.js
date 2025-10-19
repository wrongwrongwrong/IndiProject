// Helper functions for UI feedback
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.wallet-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `wallet-message message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="hideMessage()">&times;</button>
        </div>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
        ${getMessageStyles(type)}
    `;
    
    document.body.appendChild(messageDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

function hideMessage() {
    const message = document.querySelector('.wallet-message');
    if (message) {
        message.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            message.remove();
        }, 300);
    }
}

function getMessageIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        default:
            return 'fa-info-circle';
    }
}

function getMessageStyles(type) {
    switch (type) {
        case 'success':
            return 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;';
        case 'error':
            return 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;';
        case 'warning':
            return 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;';
        default:
            return 'background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;';
    }
}

function showLoading(button) {
    if (!button) return;
    
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
}

function hideLoading(button) {
    if (!button) return;
    
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .message-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
    }
    
    .message-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Wallet-specific JavaScript functionality

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';
    const url = `${API_BASE_URL}${endpoint}`;
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
}

// Wallet data
let walletData = {
    balance: 0.00,
    transactions: [],
    paymentMethods: [],
    friends: [],
    totalSpent: 0.00,
    totalEarned: 0.00
};

// Initialize wallet page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wallet page loaded');
    checkAuth();
    loadWalletData();
    initializeWalletEventListeners();
    updateWalletUI();
    
    // Force refresh balance from API after a short delay
    setTimeout(() => {
        console.log('Force refreshing balance from API...');
        updateBalance();
    }, 500);
});

// Check authentication
function checkAuth() {
    const user = localStorage.getItem('gameserverpro_user');
    const token = localStorage.getItem('gameserverpro_token');
    
    console.log('Auth check:', { user: !!user, token: !!token });
    
    if (!user || !token) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = 'index.html';
        return false;
    }
    
    // Update user name in UI
    try {
        const userData = JSON.parse(user);
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = `Welcome, ${userData.name}`;
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
    
    return true;
}

// Load wallet data from localStorage
function loadWalletData() {
    const savedData = localStorage.getItem('gameserverpro_wallet');
    if (savedData) {
        try {
            walletData = JSON.parse(savedData);
            console.log('Loaded wallet data:', walletData);
        } catch (error) {
            console.error('Error parsing wallet data:', error);
            walletData = {
                balance: 0.00,
                transactions: [],
                paymentMethods: [],
                friends: [],
                totalSpent: 0.00,
                totalEarned: 0.00
            };
        }
    } else {
        console.log('No saved wallet data found, using defaults');
    }
}

// Save wallet data to localStorage
function saveWalletData() {
    localStorage.setItem('gameserverpro_wallet', JSON.stringify(walletData));
}

// Initialize wallet event listeners
function initializeWalletEventListeners() {
    // Add funds form
    const addFundsForm = document.getElementById('addFundsForm');
    console.log('Add funds form found:', !!addFundsForm);
    console.log('Add funds form element:', addFundsForm);
    if (addFundsForm) {
        addFundsForm.addEventListener('submit', function(e) {
            console.log('Form submit event triggered');
            handleAddFunds(e);
        });
        console.log('Add funds event listener added');
        
        // Test if the form can be found by clicking the submit button
        const submitBtn = addFundsForm.querySelector('.btn-submit');
        console.log('Submit button found:', !!submitBtn);
    } else {
        console.error('Add funds form not found!');
    }
    
    // Transfer form
    const transferForm = document.getElementById('transferForm');
    console.log('Transfer form found:', !!transferForm);
    if (transferForm) {
        transferForm.addEventListener('submit', handleTransfer);
        console.log('Transfer event listener added');
    } else {
        console.error('Transfer form not found!');
    }
    
    // Add friend form
    const addFriendForm = document.getElementById('addFriendForm');
    console.log('Add friend form found:', !!addFriendForm);
    if (addFriendForm) {
        addFriendForm.addEventListener('submit', handleAddFriend);
        console.log('Add friend event listener added');
    } else {
        console.error('Add friend form not found!');
    }
    
    // Add payment method form
    const addPaymentMethodForm = document.getElementById('addPaymentMethodForm');
    if (addPaymentMethodForm) {
        addPaymentMethodForm.addEventListener('submit', handleAddPaymentMethod);
    }
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', formatExpiryDate);
    }
}

// Update wallet UI
function updateWalletUI() {
    updateBalance();
    updateStats();
    updateTransactionsList();
    updatePaymentMethodsList();
    updateFriendsList();
}

// Update balance display
function updateBalance() {
    const balanceElement = document.getElementById('currentBalance');
    if (!balanceElement) {
        console.error('Balance element not found!');
        return;
    }
    
    console.log('Updating balance... Current local balance:', walletData.balance);
    
    // First update with local data immediately
    balanceElement.textContent = walletData.balance.toFixed(2);
    console.log('Set balance element to:', balanceElement.textContent);
    
    // Then fetch from API to ensure sync
    apiCall('/api/wallet/balance')
        .then(response => {
            console.log('Balance API response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Balance API data:', data);
            const newBalance = data.balance !== undefined ? data.balance : walletData.balance;
            console.log('New balance from API:', newBalance);
            
            balanceElement.textContent = newBalance.toFixed(2);
            walletData.balance = newBalance;
            
            console.log('Updated balance element to:', balanceElement.textContent);
            console.log('Updated walletData.balance to:', walletData.balance);
            
            // Save updated balance to localStorage
            saveWalletData();
        })
        .catch(error => {
            console.error('Error fetching balance:', error);
            // Keep the local balance if API fails
            balanceElement.textContent = walletData.balance.toFixed(2);
            console.log('Fallback balance set to:', balanceElement.textContent);
        });
}

// Update stats
function updateStats() {
    const totalSpentElement = document.getElementById('totalSpent');
    const totalEarnedElement = document.getElementById('totalEarned');
    const transactionCountElement = document.getElementById('transactionCount');
    
    if (totalSpentElement) {
        totalSpentElement.textContent = `$${walletData.totalSpent.toFixed(2)}`;
    }
    if (totalEarnedElement) {
        totalEarnedElement.textContent = `$${walletData.totalEarned.toFixed(2)}`;
    }
    if (transactionCountElement) {
        transactionCountElement.textContent = walletData.transactions.length;
    }
}

// Update transactions list
function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    if (walletData.transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="no-transactions">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    const recentTransactions = walletData.transactions.slice(-5).reverse();
    transactionsList.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-icon">
                <i class="fas ${getTransactionIcon(transaction.type)}"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'credit' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Update friends list
function updateFriendsList() {
    const friendsList = document.getElementById('friendsList');
    if (!friendsList) return;
    
    if (walletData.friends.length === 0) {
        friendsList.innerHTML = `
            <div class="no-friends">
                <i class="fas fa-user-plus"></i>
                <p>No friends added yet</p>
                <button class="btn-add-friend" onclick="openAddFriendModal()">Add Friend</button>
            </div>
        `;
        return;
    }
    
    friendsList.innerHTML = walletData.friends.map(friend => `
        <div class="friend-item">
            <div class="friend-avatar">
                ${friend.name.charAt(0).toUpperCase()}
            </div>
            <div class="friend-details">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-email">${friend.email}</div>
            </div>
            <div class="friend-actions">
                <button class="btn-transfer-to-friend" onclick="transferToFriend('${friend.id}')">
                    <i class="fas fa-exchange-alt"></i> Transfer
                </button>
                <button class="btn-remove-friend" onclick="removeFriend('${friend.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update recipient dropdown in transfer modal
    updateRecipientDropdown();
}

// Update payment methods list
function updatePaymentMethodsList() {
    const paymentMethodsList = document.getElementById('paymentMethodsList');
    if (!paymentMethodsList) return;
    
    if (walletData.paymentMethods.length === 0) {
        paymentMethodsList.innerHTML = `
            <div class="no-methods">
                <i class="fas fa-plus-circle"></i>
                <p>No payment methods added</p>
                <button class="btn-add-method" onclick="openAddPaymentMethodModal()">Add Payment Method</button>
            </div>
        `;
        return;
    }
    
    paymentMethodsList.innerHTML = walletData.paymentMethods.map(method => `
        <div class="payment-method-item">
            <div class="method-icon">
                <i class="fas ${getPaymentMethodIcon(method.type)}"></i>
            </div>
            <div class="method-details">
                <div class="method-type">${method.type.toUpperCase()}</div>
                <div class="method-number">**** **** **** ${method.lastFour}</div>
            </div>
            <div class="method-actions">
                <button class="btn-remove-method" onclick="removePaymentMethod('${method.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Update recipient dropdown
function updateRecipientDropdown() {
    const recipientSelect = document.getElementById('recipient');
    if (!recipientSelect) return;
    
    // Clear existing options except the first one
    recipientSelect.innerHTML = '<option value="">Select a friend</option>';
    
    // Add friends as options
    walletData.friends.forEach(friend => {
        const option = document.createElement('option');
        option.value = friend.id;
        option.textContent = `${friend.name} (${friend.email})`;
        recipientSelect.appendChild(option);
    });
}

function updatePaymentMethodDropdown() {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    if (!paymentMethodSelect) return;
    
    paymentMethodSelect.innerHTML = '<option value="">Select Payment Method</option>';
    
    if (walletData.paymentMethods && walletData.paymentMethods.length > 0) {
        walletData.paymentMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method.id;
            option.textContent = `${method.type} ending in ${method.lastFour}`;
            paymentMethodSelect.appendChild(option);
        });
    }
}

// Handle add funds
function handleAddFunds(e) {
    console.log('handleAddFunds called');
    console.log('Event:', e);
    console.log('Event type:', e.type);
    console.log('Event target:', e.target);
    
    e.preventDefault();
    e.stopPropagation();
    
    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('amount'));
    const paymentMethod = formData.get('paymentMethod');
    
    console.log('Form data:', { amount, paymentMethod });
    console.log('Form validation:', e.target.checkValidity());
    
    if (amount <= 0) {
        showMessage('Please enter a valid amount.', 'error');
        return;
    }
    
    if (!paymentMethod) {
        showMessage('Please select a payment method.', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('.btn-submit');
    showLoading(submitBtn);
    
    // Call local API
    apiCall('/api/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount, paymentMethod })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading(submitBtn);
        
        if (data.success) {
            // Add transaction to local data
            const transaction = {
                id: data.transactionId,
                type: 'credit',
                amount: amount,
                description: `Added funds via ${paymentMethod}`,
                date: new Date(),
                paymentMethod: paymentMethod
            };
            
            walletData.transactions.push(transaction);
            walletData.balance = data.newBalance;
            walletData.totalEarned += amount;
            
            // Update balance display immediately
            const balanceElement = document.getElementById('currentBalance');
            if (balanceElement) {
                balanceElement.textContent = data.newBalance.toFixed(2);
            }
            
            saveWalletData();
            updateWalletUI();
            
            // Refresh dashboard data if dashboard is open
            if (typeof window.refreshDashboardData === 'function') {
                window.refreshDashboardData();
            }
            
            closeAddFundsModal();
            e.target.reset();
            
            showMessage(`Successfully added $${amount.toFixed(2)} to your wallet!`, 'success');
        } else {
            showMessage(data.error || 'Failed to add funds', 'error');
        }
    })
    .catch(error => {
        hideLoading(submitBtn);
        console.error('Add funds error:', error);
        showMessage('Failed to add funds. Please try again.', 'error');
    });
}

// Handle transfer
function handleTransfer(e) {
    console.log('handleTransfer called');
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('transferAmount'));
    const recipientId = formData.get('recipient');
    const note = formData.get('transferNote');
    
    console.log('Transfer data:', { amount, recipientId, note });
    
    if (amount <= 0) {
        showMessage('Please enter a valid amount.', 'error');
        return;
    }
    
    if (amount > walletData.balance) {
        showMessage('Insufficient funds.', 'error');
        return;
    }
    
    if (!recipientId) {
        showMessage('Please select a recipient.', 'error');
        return;
    }
    
    // Find recipient details
    const recipient = walletData.friends.find(friend => friend.id === recipientId);
    if (!recipient) {
        showMessage('Recipient not found.', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('.btn-submit');
    showLoading(submitBtn);
    
    // Call transfer API
    apiCall('/api/wallet/transfer', {
        method: 'POST',
        body: JSON.stringify({ 
            amount, 
            recipientId, 
            recipientEmail: recipient.email,
            note 
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading(submitBtn);
        
        if (data.success) {
            // Add transaction to local data
            const transaction = {
                id: data.transactionId,
                type: 'debit',
                amount: amount,
                description: `Transfer to ${recipient.name}${note ? ` - ${note}` : ''}`,
                date: new Date(),
                recipientId: recipientId,
                recipientName: recipient.name,
                note: note
            };
            
            walletData.transactions.push(transaction);
            walletData.balance = data.newBalance;
            walletData.totalSpent += amount;
            
            // Update balance display immediately
            const balanceElement = document.getElementById('currentBalance');
            if (balanceElement) {
                balanceElement.textContent = data.newBalance.toFixed(2);
            }
            
            saveWalletData();
            updateWalletUI();
            
            // Refresh dashboard data if dashboard is open
            if (typeof window.refreshDashboardData === 'function') {
                window.refreshDashboardData();
            }
            
            closeTransferModal();
            e.target.reset();
            
            showMessage(`Successfully transferred $${amount.toFixed(2)} to ${recipient.name}!`, 'success');
        } else {
            showMessage(data.error || 'Failed to transfer funds', 'error');
        }
    })
    .catch(error => {
        hideLoading(submitBtn);
        console.error('Transfer error:', error);
        showMessage('Failed to transfer funds. Please try again.', 'error');
    });
}

// Handle add friend
function handleAddFriend(e) {
    console.log('handleAddFriend called');
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('friendEmail');
    const name = formData.get('friendName');
    const note = formData.get('friendNote');
    
    console.log('Friend data:', { email, name, note });
    
    // Check if friend already exists
    const existingFriend = walletData.friends.find(friend => friend.email === email);
    if (existingFriend) {
        showMessage('This friend is already in your list.', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('.btn-submit');
    showLoading(submitBtn);
    
    // Simulate adding friend
    setTimeout(() => {
        hideLoading(submitBtn);
        
        const friend = {
            id: Date.now().toString(),
            email: email,
            name: name,
            note: note,
            addedDate: new Date()
        };
        
        walletData.friends.push(friend);
        
        saveWalletData();
        updateWalletUI();
        
        closeAddFriendModal();
        e.target.reset();
        
        showMessage(`Successfully added ${name} to your friends list!`, 'success');
    }, 1500);
}

// Handle add payment method
function handleAddPaymentMethod(e) {
    e.preventDefault();
    
    // Clear any existing modal errors
    clearModalErrors('addPaymentMethodModal');
    
    const formData = new FormData(e.target);
    const cardNumber = formData.get('cardNumber').replace(/\s/g, '');
    const cardType = formData.get('cardType');
    const expiryDate = formData.get('expiryDate');
    const cvv = formData.get('cvv');
    const cardholderName = formData.get('cardholderName');
    
    // Validate required fields
    if (!cardType) {
        showModalError('addPaymentMethodModal', 'Please select a card type.');
        return;
    }
    
    if (!cardNumber || cardNumber.length < 13) {
        showModalError('addPaymentMethodModal', 'Please enter a valid card number.');
        return;
    }
    
    if (!expiryDate) {
        showModalError('addPaymentMethodModal', 'Please enter the expiry date.');
        return;
    }
    
    if (!cvv || cvv.length < 3) {
        showModalError('addPaymentMethodModal', 'Please enter a valid CVV.');
        return;
    }
    
    if (!cardholderName) {
        showModalError('addPaymentMethodModal', 'Please enter the cardholder name.');
        return;
    }
    
    // Validate card number
    if (!validateCardNumber(cardNumber)) {
        showModalError('addPaymentMethodModal', 'Please enter a valid card number.');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('.btn-submit');
    showLoading(submitBtn);
    
    // Simulate adding payment method
    setTimeout(() => {
        hideLoading(submitBtn);
        
        const paymentMethod = {
            id: Date.now().toString(),
            type: cardType,
            lastFour: cardNumber.slice(-4),
            expiryDate: expiryDate,
            cardholderName: cardholderName,
            addedDate: new Date()
        };
        
        walletData.paymentMethods.push(paymentMethod);
        
        saveWalletData();
        updateWalletUI();
        
        closeAddPaymentMethodModal();
        e.target.reset();
        
        showMessage('Payment method added successfully!', 'success');
    }, 1500);
}

// Modal functions
function openAddFundsModal() {
    console.log('Opening add funds modal');
    
    // Clear any existing errors
    clearModalErrors('addFundsModal');
    
    // Check if user has payment methods
    if (!walletData.paymentMethods || walletData.paymentMethods.length === 0) {
        showMessage('Please add a payment method first before adding funds.', 'error');
        setTimeout(() => {
            openAddPaymentMethodModal();
        }, 1000);
        return;
    }
    
    const modal = document.getElementById('addFundsModal');
    console.log('Modal element:', modal);
    if (modal) {
        modal.style.display = 'block';
        console.log('Modal display set to block');
        
        // Update payment method dropdown
        updatePaymentMethodDropdown();
        
        // Check if form is accessible
        const form = document.getElementById('addFundsForm');
        console.log('Form in modal:', form);
    } else {
        console.error('Add funds modal not found!');
    }
}

function closeAddFundsModal() {
    document.getElementById('addFundsModal').style.display = 'none';
}

function openAddPaymentMethodModal() {
    // Clear any existing errors
    clearModalErrors('addPaymentMethodModal');
    
    document.getElementById('addPaymentMethodModal').style.display = 'block';
}

function closeAddPaymentMethodModal() {
    document.getElementById('addPaymentMethodModal').style.display = 'none';
}

function openTransferModal() {
    // Clear any existing errors
    clearModalErrors('transferModal');
    
    document.getElementById('transferModal').style.display = 'block';
}

function closeTransferModal() {
    document.getElementById('transferModal').style.display = 'none';
}

function openAddFriendModal() {
    // Clear any existing errors
    clearModalErrors('addFriendModal');
    
    document.getElementById('addFriendModal').style.display = 'block';
}

function closeAddFriendModal() {
    document.getElementById('addFriendModal').style.display = 'none';
}

function openAddFriendModal() {
    document.getElementById('addFriendModal').style.display = 'block';
}

function closeAddFriendModal() {
    document.getElementById('addFriendModal').style.display = 'none';
}

function openAddPaymentMethodModal() {
    document.getElementById('addPaymentMethodModal').style.display = 'block';
}

function closeAddPaymentMethodModal() {
    document.getElementById('addPaymentMethodModal').style.display = 'none';
}

// Utility functions
function setAmount(amount) {
    document.getElementById('amount').value = amount;
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) {
        formattedValue = formattedValue.substr(0, 19);
    }
    e.target.value = formattedValue;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function validateCardNumber(cardNumber) {
    // Simple Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        
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

function getTransactionIcon(type) {
    switch (type) {
        case 'credit':
            return 'fa-plus-circle';
        case 'debit':
            return 'fa-minus-circle';
        case 'purchase':
            return 'fa-shopping-cart';
        case 'refund':
            return 'fa-undo';
        default:
            return 'fa-exchange-alt';
    }
}

function getPaymentMethodIcon(type) {
    switch (type) {
        case 'visa':
            return 'fa-cc-visa';
        case 'mastercard':
            return 'fa-cc-mastercard';
        case 'amex':
            return 'fa-cc-amex';
        case 'discover':
            return 'fa-cc-discover';
        case 'paypal':
            return 'fa-paypal';
        default:
            return 'fa-credit-card';
    }
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function removePaymentMethod(methodId) {
    if (confirm('Are you sure you want to remove this payment method?')) {
        walletData.paymentMethods = walletData.paymentMethods.filter(method => method.id !== methodId);
        saveWalletData();
        updateWalletUI();
        showMessage('Payment method removed successfully!', 'success');
    }
}

function removeFriend(friendId) {
    if (confirm('Are you sure you want to remove this friend?')) {
        walletData.friends = walletData.friends.filter(friend => friend.id !== friendId);
        saveWalletData();
        updateWalletUI();
        showMessage('Friend removed successfully!', 'success');
    }
}

function transferToFriend(friendId) {
    const friend = walletData.friends.find(f => f.id === friendId);
    if (friend) {
        // Pre-fill the transfer modal
        document.getElementById('recipient').value = friendId;
        openTransferModal();
    }
}

function viewAllTransactions() {
    // In a real app, this would navigate to a full transactions page
    showMessage('Full transaction history coming soon!', 'success');
}

// Modal error display functions
function showModalError(modalId, message) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Clear existing errors
    clearModalErrors(modalId);
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal-error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert error message at the top of modal body
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.insertBefore(errorDiv, modalBody.firstChild);
    }
}

function clearModalErrors(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const existingErrors = modal.querySelectorAll('.modal-error-message');
    existingErrors.forEach(error => error.remove());
}

// Helper functions
function getPaymentMethodIcon(type) {
    const icons = {
        'visa': 'fa-cc-visa',
        'mastercard': 'fa-cc-mastercard',
        'amex': 'fa-cc-amex',
        'discover': 'fa-cc-discover',
        'paypal': 'fa-paypal'
    };
    return icons[type.toLowerCase()] || 'fa-credit-card';
}

function validateCardNumber(cardNumber) {
    // Simple Luhn algorithm validation
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        
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

function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) {
        formattedValue = formattedValue.substr(0, 19);
    }
    input.value = formattedValue;
}

// Global functions for external access
window.refreshBalance = function() {
    console.log('Manual balance refresh requested');
    updateBalance();
};

window.getCurrentBalance = function() {
    return walletData.balance;
};

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = ['addFundsModal', 'transferModal', 'addFriendModal', 'addPaymentMethodModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Close modals with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = ['addFundsModal', 'transferModal', 'addFriendModal', 'addPaymentMethodModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Export functions for global access
window.openAddFundsModal = openAddFundsModal;
window.closeAddFundsModal = closeAddFundsModal;
window.openTransferModal = openTransferModal;
window.closeTransferModal = closeTransferModal;
window.openAddFriendModal = openAddFriendModal;
window.closeAddFriendModal = closeAddFriendModal;
window.openAddPaymentMethodModal = openAddPaymentMethodModal;
window.closeAddPaymentMethodModal = closeAddPaymentMethodModal;
window.setAmount = setAmount;
window.removePaymentMethod = removePaymentMethod;
window.removeFriend = removeFriend;
window.transferToFriend = transferToFriend;
window.viewAllTransactions = viewAllTransactions;
