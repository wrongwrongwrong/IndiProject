// Debug Helper for Registration Errors
function debugRegistrationError() {
    console.log('🔍 Registration Debug Helper');
    console.log('============================');
    
    // Test the API endpoint directly
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: 'Debug Test', 
            email: 'debug@test.com', 
            password: 'test123' 
        })
    })
    .then(response => {
        console.log('✅ Response Status:', response.status);
        console.log('✅ Response OK:', response.ok);
        console.log('✅ Response Headers:', response.headers);
        
        return response.text();
    })
    .then(text => {
        console.log('✅ Response Text:', text);
        
        try {
            const data = JSON.parse(text);
            console.log('✅ Parsed JSON:', data);
        } catch (error) {
            console.error('❌ JSON Parse Error:', error);
            console.error('❌ Raw Text:', text);
        }
    })
    .catch(error => {
        console.error('❌ Fetch Error:', error);
        console.error('❌ Error Name:', error.name);
        console.error('❌ Error Message:', error.message);
        console.error('❌ Error Stack:', error.stack);
    });
}

// Quick API test
function testAPI() {
    console.log('🧪 Testing API endpoints...');
    
    // Test health endpoint
    fetch('/health')
        .then(r => r.json())
        .then(data => console.log('✅ Health check:', data))
        .catch(err => console.error('❌ Health check failed:', err));
    
    // Test registration endpoint
    fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: 'test@test.com', password: 'test123' })
    })
    .then(r => r.json())
    .then(data => console.log('✅ Registration test:', data))
    .catch(err => console.error('❌ Registration test failed:', err));
}

function testAuth() {
    const resultDiv = document.getElementById('auth-result');
    if (!resultDiv) {
        console.log('❌ auth-result div not found');
        return;
    }
    
    resultDiv.innerHTML = 'Testing authentication...';
    
    // Test if AuthManager is available
    if (typeof AuthManager !== 'undefined') {
        const currentUser = AuthManager.getCurrentUser();
        if (currentUser) {
            resultDiv.innerHTML = `✅ Auth working - User: ${currentUser.email}`;
        } else {
            resultDiv.innerHTML = '⚠️ No user logged in';
        }
    } else {
        resultDiv.innerHTML = '❌ AuthManager not found';
    }
}

function testDescription() {
    const resultDiv = document.getElementById('description-result');
    if (!resultDiv) {
        console.log('❌ description-result div not found');
        return;
    }
    
    resultDiv.innerHTML = 'Testing description generation...';
    
    // Test description generation
    const testData = {
        serverName: 'Test Server',
        gameType: 'minecraft',
        descriptionStyle: 'casual'
    };
    
    fetch('/api/descriptions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resultDiv.innerHTML = `✅ Description generated: ${data.description.description.substring(0, 100)}...`;
        } else {
            resultDiv.innerHTML = `❌ Description failed: ${data.message || 'Unknown error'}`;
        }
    })
    .catch(error => {
        resultDiv.innerHTML = `❌ Description error: ${error.message}`;
    });
}

function testWallet() {
    const resultDiv = document.getElementById('wallet-result');
    if (!resultDiv) {
        console.log('❌ wallet-result div not found');
        return;
    }
    
    resultDiv.innerHTML = 'Testing wallet...';
    
    // Test wallet balance
    fetch('/api/wallet/balance')
    .then(response => response.json())
    .then(data => {
        if (data.balance !== undefined) {
            resultDiv.innerHTML = `✅ Wallet working - Balance: $${data.balance}`;
        } else {
            resultDiv.innerHTML = `❌ Wallet failed: ${data.message || 'Unknown error'}`;
        }
    })
    .catch(error => {
        resultDiv.innerHTML = `❌ Wallet error: ${error.message}`;
    });
}

function testDashboard() {
    const resultDiv = document.getElementById('dashboard-result');
    if (!resultDiv) {
        console.log('❌ dashboard-result div not found');
        return;
    }
    
    resultDiv.innerHTML = 'Testing dashboard...';
    
    // Test dashboard data
    fetch('/api/dashboard')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resultDiv.innerHTML = `✅ Dashboard working - Balance: $${data.data.balance}`;
        } else {
            resultDiv.innerHTML = `❌ Dashboard failed: ${data.message || 'Unknown error'}`;
        }
    })
    .catch(error => {
        resultDiv.innerHTML = `❌ Dashboard error: ${error.message}`;
    });
}

// Add to global scope for easy debugging
window.debugRegistrationError = debugRegistrationError;
window.testAPI = testAPI;
window.testAuth = testAuth;
window.testDescription = testDescription;
window.testWallet = testWallet;
window.testDashboard = testDashboard;

console.log('🔧 Debug helpers loaded!');
console.log('📝 Available functions:');
console.log('  - debugRegistrationError() - Test registration API');
console.log('  - testAPI() - Test all API endpoints');
console.log('  - testAuth() - Test authentication');
console.log('  - testDescription() - Test description generation');
console.log('  - testWallet() - Test wallet functionality');
console.log('  - testDashboard() - Test dashboard functionality');
