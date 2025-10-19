// Automated Test Suite for GameServer Pro
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Test configuration
const testConfig = {
    timeout: 10000,
    retries: 3
};

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@gameserverpro.com',
    password: 'testpassword123'
};

const testDescription = {
    serverName: 'Test Gaming Server',
    gameType: 'minecraft',
    descriptionStyle: 'professional',
    serverFeatures: 'High performance, 24/7 uptime, friendly community'
};

// Test results tracking
let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
};

// Utility functions
function logTest(testName, status, message = '') {
    testResults.total++;
    if (status === 'PASS') {
        testResults.passed++;
        console.log(`✅ ${testName}: PASSED ${message}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${testName}: FAILED ${message}`);
    }
    testResults.details.push({ testName, status, message });
}

async function makeRequest(method, url, data = null, headers = {}) {
    try {
        const config = {
            method,
            url: `${API_BASE}${url}`,
            timeout: testConfig.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message,
            status: error.response?.status || 500
        };
    }
}

// Test functions
async function testHealthCheck() {
    console.log('\n🔍 Testing Health Check...');
    
    const result = await makeRequest('GET', '/health');
    if (result.success && result.data.status === 'healthy') {
        logTest('Health Check', 'PASS', `Status: ${result.data.status}`);
    } else {
        logTest('Health Check', 'FAIL', result.error);
    }
}

async function testUserRegistration() {
    console.log('\n👤 Testing User Registration...');
    
    const result = await makeRequest('POST', '/users/register', testUser);
    if (result.success && result.data.success) {
        logTest('User Registration', 'PASS', `User ID: ${result.data.user.id}`);
        return result.data.user;
    } else {
        logTest('User Registration', 'FAIL', result.error);
        return null;
    }
}

async function testUserLogin() {
    console.log('\n🔐 Testing User Login...');
    
    const result = await makeRequest('POST', '/users/login', {
        email: testUser.email,
        password: testUser.password
    });
    
    if (result.success && result.data.success) {
        logTest('User Login', 'PASS', `Token received`);
        return result.data.token;
    } else {
        logTest('User Login', 'FAIL', result.error);
        return null;
    }
}

async function testWalletBalance() {
    console.log('\n💰 Testing Wallet Balance...');
    
    const result = await makeRequest('GET', '/wallet/balance');
    if (result.success && typeof result.data.balance === 'number') {
        logTest('Wallet Balance', 'PASS', `Balance: $${result.data.balance}`);
        return result.data.balance;
    } else {
        logTest('Wallet Balance', 'FAIL', result.error);
        return null;
    }
}

async function testWalletDeposit() {
    console.log('\n💳 Testing Wallet Deposit...');
    
    const depositAmount = 50.00;
    const result = await makeRequest('POST', '/wallet/deposit', {
        amount: depositAmount,
        paymentMethod: 'credit_card'
    });
    
    if (result.success && result.data.success) {
        logTest('Wallet Deposit', 'PASS', `Deposited: $${depositAmount}, New Balance: $${result.data.newBalance}`);
        return result.data.newBalance;
    } else {
        logTest('Wallet Deposit', 'FAIL', result.error);
        return null;
    }
}

async function testWalletWithdraw() {
    console.log('\n💸 Testing Wallet Withdrawal...');
    
    const withdrawAmount = 25.00;
    const result = await makeRequest('POST', '/wallet/withdraw', {
        amount: withdrawAmount,
        withdrawMethod: 'bank_transfer',
        accountDetails: 'Test Bank Account'
    });
    
    if (result.success && result.data.success) {
        logTest('Wallet Withdrawal', 'PASS', `Withdrawn: $${withdrawAmount}, New Balance: $${result.data.newBalance}`);
        return result.data.newBalance;
    } else {
        logTest('Wallet Withdrawal', 'FAIL', result.error);
        return null;
    }
}

async function testDescriptionGeneration() {
    console.log('\n🎮 Testing Description Generation...');
    
    const result = await makeRequest('POST', '/descriptions/generate', testDescription);
    if (result.success && result.data.success && result.data.description) {
        logTest('Description Generation', 'PASS', `Generated description for: ${result.data.description.serverName}`);
        return result.data.description;
    } else {
        logTest('Description Generation', 'FAIL', result.error);
        return null;
    }
}

async function testInvalidInputs() {
    console.log('\n🚫 Testing Invalid Input Handling...');
    
    // Test invalid login
    const invalidLogin = await makeRequest('POST', '/users/login', {
        email: 'invalid@email.com',
        password: 'wrongpassword'
    });
    
    if (!invalidLogin.success && invalidLogin.status === 401) {
        logTest('Invalid Login Handling', 'PASS', 'Correctly rejected invalid credentials');
    } else {
        logTest('Invalid Login Handling', 'FAIL', 'Should reject invalid credentials');
    }
    
    // Test invalid deposit amount
    const invalidDeposit = await makeRequest('POST', '/wallet/deposit', {
        amount: -10,
        paymentMethod: 'credit_card'
    });
    
    if (!invalidDeposit.success) {
        logTest('Invalid Deposit Handling', 'PASS', 'Correctly rejected negative amount');
    } else {
        logTest('Invalid Deposit Handling', 'FAIL', 'Should reject negative amounts');
    }
    
    // Test insufficient funds withdrawal
    const insufficientWithdraw = await makeRequest('POST', '/wallet/withdraw', {
        amount: 10000,
        withdrawMethod: 'bank_transfer',
        accountDetails: 'Test Account'
    });
    
    if (!insufficientWithdraw.success) {
        logTest('Insufficient Funds Handling', 'PASS', 'Correctly rejected insufficient funds');
    } else {
        logTest('Insufficient Funds Handling', 'FAIL', 'Should reject insufficient funds');
    }
}

async function testFrontendPages() {
    console.log('\n🌐 Testing Frontend Pages...');
    
    const pages = [
        { name: 'Home Page', url: '/' },
        { name: 'Wallet Page', url: '/wallet' },
        { name: 'Dashboard Page', url: '/dashboard' }
    ];
    
    for (const page of pages) {
        try {
            const response = await axios.get(`${BASE_URL}${page.url}`, { timeout: 5000 });
            if (response.status === 200) {
                logTest(`${page.name} Load`, 'PASS', `Status: ${response.status}`);
            } else {
                logTest(`${page.name} Load`, 'FAIL', `Status: ${response.status}`);
            }
        } catch (error) {
            logTest(`${page.name} Load`, 'FAIL', error.message);
        }
    }
}

async function testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    const startTime = Date.now();
    
    // Test multiple concurrent requests
    const promises = [];
    for (let i = 0; i < 10; i++) {
        promises.push(makeRequest('GET', '/wallet/balance'));
    }
    
    const results = await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const successCount = results.filter(r => r.success).length;
    
    if (successCount === 10 && duration < 5000) {
        logTest('Performance Test', 'PASS', `10 concurrent requests completed in ${duration}ms`);
    } else {
        logTest('Performance Test', 'FAIL', `${successCount}/10 requests succeeded in ${duration}ms`);
    }
}

// Main test runner
async function runAllTests() {
    console.log('🧪 GameServer Pro - Automated Test Suite');
    console.log('==========================================');
    console.log(`Testing server at: ${BASE_URL}`);
    console.log(`Test timeout: ${testConfig.timeout}ms`);
    
    try {
        // Core functionality tests
        await testHealthCheck();
        await testUserRegistration();
        await testUserLogin();
        await testWalletBalance();
        await testWalletDeposit();
        await testWalletWithdraw();
        await testDescriptionGeneration();
        
        // Error handling tests
        await testInvalidInputs();
        
        // Frontend tests
        await testFrontendPages();
        
        // Performance tests
        await testPerformance();
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
    }
    
    // Print results
    console.log('\n📊 Test Results Summary');
    console.log('======================');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        testResults.details
            .filter(test => test.status === 'FAIL')
            .forEach(test => console.log(`  - ${test.testName}: ${test.message}`));
    }
    
    console.log('\n🎉 Test suite completed!');
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    runAllTests,
    testHealthCheck,
    testUserRegistration,
    testUserLogin,
    testWalletBalance,
    testWalletDeposit,
    testWalletWithdraw,
    testDescriptionGeneration
};
