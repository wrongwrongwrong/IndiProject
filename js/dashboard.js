// Dashboard-specific JavaScript functionality

// Dashboard data
let dashboardData = {
    totalDescriptions: 0,
    totalViews: 0,
    totalShares: 0,
    recentDescriptions: []
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard page loaded');
    checkAuth();
    loadDashboardData();
    initializeDashboardCharts();
    updateDashboardUI();
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

// Load dashboard data from localStorage
async function loadDashboardData() {
    try {
        console.log('Loading dashboard data from API...');
        
        // API call helper function
        const apiCall = async (endpoint, options = {}) => {
            const baseUrl = window.location.port === '5500' ? 'http://localhost:3000' : '';
            const url = `${baseUrl}${endpoint}`;
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        };
        
        // Fetch dashboard data from API
        const response = await apiCall('/api/dashboard');
        
        if (response.success) {
            const apiData = response.data;
            
            // Load descriptions from localStorage
            const savedDescriptions = localStorage.getItem('gameserverpro_descriptions');
            let recentDescriptions = [];
            if (savedDescriptions) {
                recentDescriptions = JSON.parse(savedDescriptions);
            }
            
            // Update dashboard data with API response
            dashboardData = {
                totalDescriptions: recentDescriptions.length,
                totalViews: Math.floor(Math.random() * 1000) + 500, // Mock views
                totalShares: Math.floor(Math.random() * 100) + 50, // Mock shares
                recentDescriptions: recentDescriptions.slice(-5), // Last 5 descriptions
                // Add wallet data from API - use API data, not localStorage
                walletBalance: apiData.balance,
                totalDeposits: apiData.stats.totalDeposits,
                totalTransfers: apiData.stats.totalTransfers,
                totalSpent: apiData.stats.totalSpent,
                totalEarned: apiData.stats.totalEarned,
                recentTransactions: apiData.recentTransactions, // Use API transactions, not localStorage
                totalTransactions: apiData.totalTransactions
            };
            
            console.log('Dashboard data updated with API:', {
                balance: dashboardData.walletBalance,
                totalDeposits: dashboardData.totalDeposits,
                totalTransfers: dashboardData.totalTransfers,
                recentTransactions: dashboardData.recentTransactions.length
            });
            
            console.log('Loaded dashboard data from API:', dashboardData);
        } else {
            console.error('API returned error:', response.error);
            // Fallback to localStorage
            loadDashboardDataFromStorage();
        }
    } catch (error) {
        console.error('Error loading dashboard data from API:', error);
        // Fallback to localStorage
        loadDashboardDataFromStorage();
    }
}

// Fallback function to load from localStorage
function loadDashboardDataFromStorage() {
    const savedData = localStorage.getItem('gameserverpro_dashboard');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Only load description-related data, not wallet data
        dashboardData.totalDescriptions = parsedData.totalDescriptions || 0;
        dashboardData.totalViews = parsedData.totalViews || 0;
        dashboardData.totalShares = parsedData.totalShares || 0;
        dashboardData.recentDescriptions = parsedData.recentDescriptions || [];
    }
    
    // Load descriptions from localStorage
    const savedDescriptions = localStorage.getItem('gameserverpro_descriptions');
    if (savedDescriptions) {
        dashboardData.recentDescriptions = JSON.parse(savedDescriptions);
        dashboardData.totalDescriptions = dashboardData.recentDescriptions.length;
    }
    
    // Set default wallet values for fallback
    dashboardData.walletBalance = 0;
    dashboardData.totalDeposits = 0;
    dashboardData.totalTransfers = 0;
    dashboardData.totalSpent = 0;
    dashboardData.totalEarned = 0;
    dashboardData.recentTransactions = [];
    dashboardData.totalTransactions = 0;
}

// Save dashboard data to localStorage
function saveDashboardData() {
    localStorage.setItem('gameserverpro_dashboard', JSON.stringify(dashboardData));
}

// Update dashboard UI
function updateDashboardUI() {
    // Update stats
    document.getElementById('totalDescriptions').textContent = dashboardData.totalDescriptions;
    document.getElementById('totalViews').textContent = dashboardData.totalViews;
    document.getElementById('totalShares').textContent = dashboardData.totalShares;
    
    // Update wallet stats if available
    if (dashboardData.walletBalance !== undefined) {
        const walletBalanceElement = document.getElementById('walletBalance');
        if (walletBalanceElement) {
            walletBalanceElement.textContent = `$${dashboardData.walletBalance.toFixed(2)}`;
        }
        
        const totalDepositsElement = document.getElementById('totalDeposits');
        if (totalDepositsElement) {
            totalDepositsElement.textContent = `$${dashboardData.totalDeposits.toFixed(2)}`;
        }
        
        const totalTransfersElement = document.getElementById('totalTransfers');
        if (totalTransfersElement) {
            totalTransfersElement.textContent = `$${dashboardData.totalTransfers.toFixed(2)}`;
        }
        
        const totalSpentElement = document.getElementById('totalSpent');
        if (totalSpentElement) {
            totalSpentElement.textContent = `$${dashboardData.totalSpent.toFixed(2)}`;
        }
        
        const totalEarnedElement = document.getElementById('totalEarned');
        if (totalEarnedElement) {
            totalEarnedElement.textContent = `$${dashboardData.totalEarned.toFixed(2)}`;
        }
    }
    
    // Update descriptions list
    updateDescriptionsList();
    
    // Update transactions list if available
    if (dashboardData.recentTransactions) {
        updateTransactionsList();
    }
}

// Update descriptions list
function updateDescriptionsList() {
    const descriptionsList = document.getElementById('descriptionsList');
    
    if (dashboardData.recentDescriptions.length === 0) {
        descriptionsList.innerHTML = `
            <div class="no-descriptions">
                <i class="fas fa-file-alt"></i>
                <p>No descriptions created yet</p>
                <button class="btn-create-first" onclick="openDescriptionGenerator()">Create Your First Description</button>
            </div>
        `;
    } else {
        descriptionsList.innerHTML = dashboardData.recentDescriptions.map((desc, index) => `
            <div class="description-item">
                <div class="description-info">
                    <h4>${desc.serverName}</h4>
                    <p>${desc.gameType} • ${desc.style}</p>
                    <span class="description-date">${new Date(desc.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="description-stats">
                    <div class="stat">
                        <i class="fas fa-eye"></i>
                        <span>${desc.views || 0}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-share"></i>
                        <span>${desc.shares || 0}</span>
                    </div>
                </div>
                <div class="description-actions">
                    <button class="action-btn" onclick="viewDescription(${index})">
                        <i class="fas fa-eye"></i>
                        <span>View</span>
                    </button>
                    <button class="action-btn" onclick="shareDescription(${index})">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </button>
                    <button class="action-btn" onclick="editDescription(${index})">
                        <i class="fas fa-edit"></i>
                        <span>Edit</span>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Update transactions list
function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    if (dashboardData.recentTransactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="no-transactions">
                <i class="fas fa-wallet"></i>
                <p>No transactions yet</p>
            </div>
        `;
    } else {
        transactionsList.innerHTML = dashboardData.recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-type ${transaction.type}">
                        <i class="fas fa-${transaction.type === 'deposit' ? 'plus' : 'minus'}"></i>
                        <span>${transaction.type === 'deposit' ? 'Deposit' : 'Transfer'}</span>
                    </div>
                    <div class="transaction-details">
                        <p class="transaction-description">${transaction.description}</p>
                        <p class="transaction-date">${new Date(transaction.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'deposit' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                </div>
            </div>
        `).join('');
    }
}

// Initialize dashboard charts
function initializeDashboardCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Descriptions Created',
                    data: [0, 0, 0, 0, 0, dashboardData.totalDescriptions],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Total Views',
                    data: [0, 0, 0, 0, 0, dashboardData.totalViews],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Activity Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Professional', 'Casual', 'Competitive', 'Roleplay'],
                datasets: [{
                    data: [
                        dashboardData.recentDescriptions.filter(d => d.style === 'professional').length,
                        dashboardData.recentDescriptions.filter(d => d.style === 'casual').length,
                        dashboardData.recentDescriptions.filter(d => d.style === 'competitive').length,
                        dashboardData.recentDescriptions.filter(d => d.style === 'roleplay').length
                    ],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

// Open description generator
function openDescriptionGenerator() {
    // Redirect to main page with description modal
    window.location.href = 'index.html#description';
}

// View description
function viewDescription(index) {
    const description = dashboardData.recentDescriptions[index];
    if (description) {
        // Increment view count
        description.views = (description.views || 0) + 1;
        dashboardData.totalViews++;
        saveDashboardData();
        updateDashboardUI();
        
        // Show description in modal
        showDescriptionModal(description);
    }
}

// Share description
function shareDescription(index) {
    const description = dashboardData.recentDescriptions[index];
    if (description) {
        // Increment share count
        description.shares = (description.shares || 0) + 1;
        dashboardData.totalShares++;
        saveDashboardData();
        updateDashboardUI();
        
        // Copy to clipboard
        navigator.clipboard.writeText(description.description).then(() => {
            showMessage('Description copied to clipboard!', 'success');
        }).catch(() => {
            showMessage('Failed to copy description', 'error');
        });
    }
}

// Edit description
function editDescription(index) {
    const description = dashboardData.recentDescriptions[index];
    if (description) {
        // Redirect to main page with pre-filled form
        localStorage.setItem('gameserverpro_edit_description', JSON.stringify({index, description}));
        window.location.href = 'index.html#description';
    }
}

// Show description modal
function showDescriptionModal(description) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${description.serverName}</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="description-preview" style="white-space: pre-wrap; max-height: none;">${description.description}</div>
                <div class="description-actions" style="margin-top: 1rem;">
                    <button class="btn-secondary" onclick="shareDescription(${dashboardData.recentDescriptions.indexOf(description)})">
                        <i class="fas fa-share"></i> Share
                    </button>
                    <button class="btn-primary" onclick="navigator.clipboard.writeText('${description.description.replace(/'/g, "\\'")}').then(() => showMessage('Copied!', 'success'))">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Global function to refresh dashboard data (can be called from wallet page)
window.refreshDashboardData = async function() {
    console.log('Refreshing dashboard data...');
    await loadDashboardData();
    updateDashboardUI();
};

// Global function to get current dashboard data
window.getDashboardData = function() {
    return dashboardData;
};

// Logout function
function logout() {
    localStorage.removeItem('gameserverpro_user');
    localStorage.removeItem('gameserverpro_token');
    localStorage.removeItem('gameserverpro_descriptions');
    localStorage.removeItem('gameserverpro_dashboard');
    window.location.href = 'index.html';
}

// Message function (if not defined in script.js)
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'success') {
        messageDiv.style.background = '#d1fae5';
        messageDiv.style.color = '#065f46';
        messageDiv.style.border = '1px solid #a7f3d0';
    } else {
        messageDiv.style.background = '#fee2e2';
        messageDiv.style.color = '#991b1b';
        messageDiv.style.border = '1px solid #fca5a5';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('gameserverpro_user');
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize auth check
if (!checkAuth()) {
    // Redirect will happen in checkAuth
}
