const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Routes to match cloud deployment
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', '03-index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', '02-dashboard.html'));
});

app.get('/wallet', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', '04-wallet.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', '05-services.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', '06-about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', '07-contact.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', '01-admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Local development server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`💰 Wallet: http://localhost:${PORT}/wallet`);
    console.log(`🔧 Services: http://localhost:${PORT}/services`);
});
