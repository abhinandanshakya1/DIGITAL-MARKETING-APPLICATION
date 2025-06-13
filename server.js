const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// In-memory storage for demo purposes
let contacts = [];
let newsletters = [];

// API Routes
app.post('/api/contacts', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        const contact = {
            id: Date.now(),
            name,
            email,
            subject,
            message,
            createdAt: new Date().toISOString()
        };
        
        contacts.push(contact);
        
        res.status(201).json({ 
            success: true, 
            message: 'Contact form submitted successfully',
            contact 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

app.get('/api/contacts', (req, res) => {
    res.json({ contacts });
});

app.post('/api/newsletter', (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        // Check if already subscribed
        const existingSubscription = newsletters.find(sub => sub.email === email);
        if (existingSubscription) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already subscribed' 
            });
        }
        
        const subscription = {
            id: Date.now(),
            email,
            createdAt: new Date().toISOString()
        };
        
        newsletters.push(subscription);
        
        res.status(201).json({ 
            success: true, 
            message: 'Successfully subscribed to newsletter',
            subscription 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

app.get('/api/newsletter', (req, res) => {
    res.json({ newsletters });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Marketing Pro Hub server running on http://localhost:${PORT}`);
});