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

// Add to global scope for easy debugging
window.debugRegistrationError = debugRegistrationError;
window.testAPI = testAPI;

console.log('🔧 Debug helpers loaded!');
console.log('📝 Available functions:');
console.log('  - debugRegistrationError() - Test registration API');
console.log('  - testAPI() - Test all API endpoints');
