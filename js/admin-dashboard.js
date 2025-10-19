/**
 * Admin Dashboard JavaScript - GameServer Pro
 * Handles all admin dashboard functionality including data loading, charts, and UI interactions
 */

// Global data storage
let adminData = {
    users: [],
    descriptions: [],
    transactions: [],
    messages: [],
    stats: {}
};

// API Base URL
const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';

/**
 * Tab management functionality
 * @param {string} tabName - The name of the tab to show
 */
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for the tab
    switch(tabName) {
        case 'overview':
            loadOverview();
            break;
        case 'users':
            loadUsers();
            break;
        case 'descriptions':
            loadDescriptions();
            break;
        case 'revenue':
            loadRevenue();
            break;
        case 'servers':
            loadGameServers();
            break;
        case 'messages':
            loadMessages();
            break;
    }
}

/**
 * Load overview data and initialize charts
 */
async function loadOverview() {
    try {
        await Promise.all([
            loadUsers(),
            loadDescriptions(),
            loadRevenue(),
            loadGameServers()
        ]);
        
        updateOverviewStats();
        createCharts();
    } catch (error) {
        console.error('Error loading overview:', error);
    }
}

/**
 * Update overview statistics display
 */
function updateOverviewStats() {
    document.getElementById('totalUsers').textContent = adminData.users.length;
    document.getElementById('totalDescriptions').textContent = adminData.descriptions.length;
    
    const totalRevenue = adminData.transactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    
    document.getElementById('totalServers').textContent = adminData.descriptions.length;
}

/**
 * Create all charts for the overview tab
 */
function createCharts() {
    createUserGrowthChart();
    createRevenueChart();
}

/**
 * Create user growth line chart
 */
function createUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart').getContext('2d');
    const userGrowthData = generateUserGrowthData();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: userGrowthData.labels,
            datasets: [{
                label: 'Users',
                data: userGrowthData.data,
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e5e5e5'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                },
                y: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                }
            }
        }
    });
}

/**
 * Create revenue bar chart
 */
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const revenueData = generateRevenueData();
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: revenueData.labels,
            datasets: [{
                label: 'Revenue ($)',
                data: revenueData.data,
                backgroundColor: '#16a34a',
                borderColor: '#15803d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e5e5e5'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                },
                y: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                }
            }
        }
    });
}

/**
 * Generate mock user growth data for charts
 * @returns {Object} Object containing labels and data arrays
 */
function generateUserGrowthData() {
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
        data.push(Math.floor(Math.random() * 10) + adminData.users.length - 3);
    }
    
    return { labels, data };
}

/**
 * Generate mock revenue data for charts
 * @returns {Object} Object containing labels and data arrays
 */
function generateRevenueData() {
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
        data.push(Math.floor(Math.random() * 500) + 100);
    }
    
    return { labels, data };
}

/**
 * Load users from API
 */
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const data = await response.json();
        
        if (data.users) {
            adminData.users = data.users;
            displayUsers();
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersList').innerHTML = '<div class="loading">Error loading users</div>';
    }
}

/**
 * Display users in the users tab
 */
function displayUsers() {
    const usersList = document.getElementById('usersList');
    
    if (adminData.users.length === 0) {
        usersList.innerHTML = '<div class="loading">No users found</div>';
        return;
    }
    
    usersList.innerHTML = adminData.users.map(user => `
        <div class="data-item">
            <div class="data-info">
                <h4>${user.name}</h4>
                <p>${user.email}</p>
                ${user.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
            </div>
            <div class="data-meta">
                <span>ID: ${user.id}</span>
                <span>Active</span>
            </div>
            <div class="data-actions">
                <button class="btn-delete" onclick="deleteUser(${user.id}, '${user.name}')" ${user.isAdmin ? 'disabled title="Cannot delete admin user"' : ''}>
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Load descriptions from API
 */
async function loadDescriptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/descriptions`);
        const data = await response.json();
        
        if (data.descriptions) {
            adminData.descriptions = data.descriptions;
            displayDescriptions();
        }
    } catch (error) {
        console.error('Error loading descriptions:', error);
        document.getElementById('descriptionsList').innerHTML = '<div class="loading">Error loading descriptions</div>';
    }
}

/**
 * Display descriptions in the descriptions tab
 */
function displayDescriptions() {
    const descriptionsList = document.getElementById('descriptionsList');
    
    if (adminData.descriptions.length === 0) {
        descriptionsList.innerHTML = '<div class="loading">No descriptions found</div>';
        return;
    }
    
    descriptionsList.innerHTML = adminData.descriptions.map(desc => `
        <div class="data-item">
            <div class="data-info">
                <h4>${desc.serverName}</h4>
                <p>${desc.gameType} - ${desc.style}</p>
                <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #6b7280;">
                    ${desc.description.substring(0, 100)}...
                </p>
            </div>
            <div class="data-meta">
                <span>ID: ${desc.id}</span>
                <span>${desc.style}</span>
            </div>
            <div class="data-actions">
                <button class="btn-delete" onclick="deleteDescription(${desc.id}, '${desc.serverName}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Load revenue data (mock data for demo)
 */
async function loadRevenue() {
    try {
        // Mock transaction data for demo
        adminData.transactions = [
            { id: 1, type: 'deposit', amount: 100, status: 'completed', timestamp: new Date().toISOString() },
            { id: 2, type: 'deposit', amount: 50, status: 'completed', timestamp: new Date().toISOString() },
            { id: 3, type: 'deposit', amount: 200, status: 'completed', timestamp: new Date().toISOString() },
            { id: 4, type: 'deposit', amount: 75, status: 'completed', timestamp: new Date().toISOString() }
        ];
        
        displayRevenue();
    } catch (error) {
        console.error('Error loading revenue:', error);
        document.getElementById('transactionsList').innerHTML = '<div class="loading">Error loading revenue data</div>';
    }
}

/**
 * Display revenue data in the revenue tab
 */
function displayRevenue() {
    const totalRevenue = adminData.transactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyRevenue = totalRevenue * 0.3; // Mock monthly calculation
    const avgTransaction = totalRevenue / adminData.transactions.length;
    
    document.getElementById('totalRevenueAmount').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('monthlyRevenue').textContent = `$${monthlyRevenue.toFixed(2)}`;
    document.getElementById('avgTransaction').textContent = `$${avgTransaction.toFixed(2)}`;
    
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = adminData.transactions.map(transaction => `
        <div class="data-item">
            <div class="data-info">
                <h4>${transaction.type.toUpperCase()}</h4>
                <p>$${transaction.amount.toFixed(2)} - ${transaction.status}</p>
                <p style="font-size: 0.8rem; color: #6b7280;">
                    ${new Date(transaction.timestamp).toLocaleString()}
                </p>
            </div>
            <div class="data-meta">
                <span>ID: ${transaction.id}</span>
                <span>${transaction.status}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Load game servers from API
 */
async function loadGameServers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/descriptions`);
        const data = await response.json();
        
        if (data.descriptions) {
            displayGameServers(data.descriptions);
        }
    } catch (error) {
        console.error('Error loading game servers:', error);
        document.getElementById('serversList').innerHTML = '<div class="loading">Error loading game servers</div>';
    }
}

/**
 * Display game servers in the servers tab
 * @param {Array} servers - Array of server objects
 */
function displayGameServers(servers) {
    const serversList = document.getElementById('serversList');
    
    if (servers.length === 0) {
        serversList.innerHTML = '<div class="loading">No game servers found</div>';
        return;
    }
    
    serversList.innerHTML = servers.map(server => `
        <div class="data-item">
            <div class="data-info">
                <h4>${server.serverName}</h4>
                <p>Game: ${server.gameType}</p>
                <p>Style: ${server.style}</p>
                <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #6b7280;">
                    ${server.description.substring(0, 150)}...
                </p>
            </div>
            <div class="data-meta">
                <span>ID: ${server.id}</span>
                <span>${server.gameType}</span>
                <span>${server.style}</span>
            </div>
            <div class="data-actions">
                <button class="btn-delete" onclick="deleteGameServer(${server.id}, '${server.serverName}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Load messages from API
 */
async function loadMessages() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact/messages`);
        const data = await response.json();
        
        if (data.success) {
            adminData.messages = data.messages;
            displayMessages();
        } else {
            document.getElementById('messagesList').innerHTML = '<div class="loading">Failed to load messages</div>';
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        document.getElementById('messagesList').innerHTML = '<div class="loading">Error loading messages</div>';
    }
}

/**
 * Display messages in the messages tab
 */
function displayMessages() {
    const messagesList = document.getElementById('messagesList');
    
    if (adminData.messages.length === 0) {
        messagesList.innerHTML = '<div class="loading">No messages found</div>';
        return;
    }
    
    messagesList.innerHTML = adminData.messages.map(message => `
        <div class="data-item">
            <div class="data-info">
                <h4>${message.name}</h4>
                <p>${message.email}</p>
                <p><strong>Subject:</strong> ${message.subject}</p>
                <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #6b7280;">
                    ${message.message.substring(0, 100)}...
                </p>
            </div>
            <div class="data-meta">
                <span>ID: ${message.id}</span>
                <span>${message.status}</span>
                <span>${new Date(message.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="data-actions">
                <button class="btn-delete" onclick="deleteMessage(${message.id}, '${message.subject}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Delete user function
 */
async function deleteUser(userId, userName) {
    // Check if this is the current admin trying to delete themselves
    const currentAdmin = JSON.parse(localStorage.getItem('gameserverpro_admin') || '{}');
    const isSelfDeletion = currentAdmin.id === userId && currentAdmin.isAdmin;
    
    if (isSelfDeletion) {
        // Show password confirmation modal for admin self-deletion
        showPasswordConfirmationModal(userId, userName, 'user');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification(`User "${userName}" deleted successfully`, 'success');
            loadUsers(); // Refresh the users list
        } else {
            const error = await response.json();
            showNotification(`Error deleting user: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user. Please try again.', 'error');
    }
}

/**
 * Delete description function
 */
async function deleteDescription(descriptionId, serverName) {
    if (!confirm(`Are you sure you want to delete description for "${serverName}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/descriptions/${descriptionId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification(`Description for "${serverName}" deleted successfully`, 'success');
            loadDescriptions(); // Refresh the descriptions list
        } else {
            const error = await response.json();
            showNotification(`Error deleting description: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting description:', error);
        showNotification('Error deleting description. Please try again.', 'error');
    }
}

/**
 * Delete game server function
 */
async function deleteGameServer(serverId, serverName) {
    if (!confirm(`Are you sure you want to delete game server "${serverName}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/servers/${serverId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification(`Game server "${serverName}" deleted successfully`, 'success');
            loadGameServers(); // Refresh the servers list
        } else {
            const error = await response.json();
            showNotification(`Error deleting game server: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting game server:', error);
        showNotification('Error deleting game server. Please try again.', 'error');
    }
}

/**
 * Delete message function
 */
async function deleteMessage(messageId, subject) {
    if (!confirm(`Are you sure you want to delete message "${subject}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact/messages/${messageId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification(`Message "${subject}" deleted successfully`, 'success');
            loadMessages(); // Refresh the messages list
        } else {
            const error = await response.json();
            showNotification(`Error deleting message: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        showNotification('Error deleting message. Please try again.', 'error');
    }
}

/**
 * Show notification function
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Show password confirmation modal for admin self-deletion
 */
function showPasswordConfirmationModal(itemId, itemName, itemType) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('passwordConfirmationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'passwordConfirmationModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-shield-alt"></i> Admin Authentication Required</h2>
                    <span class="close" onclick="closePasswordConfirmationModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="auth-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>You are attempting to delete your own admin account. This action is irreversible and will remove all your admin privileges.</p>
                    </div>
                    <form id="passwordConfirmationForm">
                        <div class="form-group">
                            <label for="adminPasswordConfirm">Enter your admin password to confirm:</label>
                            <input type="password" id="adminPasswordConfirm" name="password" required 
                                   placeholder="Enter your admin password">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closePasswordConfirmationModal()">Cancel</button>
                            <button type="submit" class="btn-danger">Confirm Deletion</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Store the deletion context
    modal.dataset.itemId = itemId;
    modal.dataset.itemName = itemName;
    modal.dataset.itemType = itemType;
    
    // Show modal
    modal.classList.add('active');
    
    // Focus on password input
    setTimeout(() => {
        document.getElementById('adminPasswordConfirm').focus();
    }, 100);
    
    // Handle form submission
    const form = document.getElementById('passwordConfirmationForm');
    form.onsubmit = handlePasswordConfirmation;
}

/**
 * Handle password confirmation form submission
 */
async function handlePasswordConfirmation(e) {
    e.preventDefault();
    
    const modal = document.getElementById('passwordConfirmationModal');
    const password = document.getElementById('adminPasswordConfirm').value;
    const itemId = modal.dataset.itemId;
    const itemName = modal.dataset.itemName;
    const itemType = modal.dataset.itemType;
    
    if (!password) {
        showNotification('Please enter your admin password', 'error');
        return;
    }
    
    try {
        // Verify admin password
        const response = await fetch(`${API_BASE_URL}/api/users/verify-admin-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.valid) {
                // Password is correct, proceed with deletion
                await performAdminSelfDeletion(itemId, itemName, itemType);
                closePasswordConfirmationModal();
            } else {
                showNotification('Invalid admin password. Please try again.', 'error');
            }
        } else {
            showNotification('Password verification failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Password verification error:', error);
        showNotification('Password verification failed. Please try again.', 'error');
    }
}

/**
 * Perform admin self-deletion after password verification
 */
async function performAdminSelfDeletion(itemId, itemName, itemType) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${itemId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification(`Admin account "${itemName}" deleted successfully`, 'success');
            
            // Clear admin session and redirect to login
            localStorage.removeItem('gameserverpro_admin');
            localStorage.removeItem('gameserverpro_admin_token');
            
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            const error = await response.json();
            showNotification(`Error deleting admin account: ${error.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting admin account:', error);
        showNotification('Error deleting admin account. Please try again.', 'error');
    }
}

/**
 * Close password confirmation modal
 */
function closePasswordConfirmationModal() {
    const modal = document.getElementById('passwordConfirmationModal');
    if (modal) {
        modal.classList.remove('active');
        // Clear form
        document.getElementById('passwordConfirmationForm').reset();
    }
}

// Export functions for global access
window.deleteUser = deleteUser;
window.deleteDescription = deleteDescription;
window.deleteGameServer = deleteGameServer;
window.deleteMessage = deleteMessage;
window.closePasswordConfirmationModal = closePasswordConfirmationModal;

/**
 * Initialize dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    loadOverview();
});
