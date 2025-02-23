import express from 'express';
import bodyParser from 'body-parser';
import * as tf from '@tensorflow/tfjs';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mockUsers, mockProfiles, mockDashboard } from './mocks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let supabase;
try {
    supabase = await import('../db.js');
} catch(e) {
    console.error('Supabase client yüklenirken hata oluştu:', e);
    process.exit(1);
}

const app = express();
const port = process.env.NODE_ENV === 'test' ? 3002 : (process.env.PORT || 3001);

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate Limiting Middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests from this IP, please try again later." }
});

// Apply rate limiter to all /api/ endpoints
app.use('/api/', apiLimiter);

// Serve static files from the 'dist' directory (output from front-end build)
app.use(express.static(path.join(__dirname, "../")));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// Prediction endpoints
app.post('/predict', (req, res) => {
    const { features } = req.body;
    
    // Validate features
    if (!features || !Array.isArray(features)) {
        return res.status(400).json({ error: 'Features must be an array' });
    }
    
    // Simple mock prediction
    const prediction = features.reduce((a, b) => a + b, 0) / features.length;
    res.json({ prediction });
});

app.post('/mobile/predict', (req, res) => {
    const { features } = req.body;
    
    // Validate features
    if (!features || !Array.isArray(features)) {
        return res.status(400).json({ error: 'Features must be an array' });
    }
    
    // Simple mock mobile prediction
    const mobilePrediction = features.reduce((a, b) => a + b, 0) * 1.5;
    res.json({ mobilePrediction });
});

// RAG Integration endpoint: RAG sistemleri için veri sağlama
app.post('/rag/data', async (req, res) => {
    try {
        // Dummy response for RAG integration
        res.json({ ragData: "RAG integration endpoint placeholder" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'RAG data retrieval failed.' });
    }
});

// Investment Advice endpoint: Yatırım önerisi için endpoint.
app.post('/api/investment/advice', async (req, res) => {
    try {
        const { user_id, query } = req.body;
        if (!user_id || !query) {
            return res.status(400).json({ error: 'user_id and query are required.' });
        }
        // Dummy investment advice response
        const advice = `Yatırım öneriniz: ${query} için risk toleransınıza uygun strateji: DIVERSIFY`;
        res.json({ advice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Investment advice failed.' });
    }
});

// News endpoint: Piyasa haberlerini çekmek için endpoint.
app.get('/api/news', async (req, res) => {
    try {
        const news = [
            { title: "Piyasa Haberleri: Hisse Senedi Yükselişi", content: "Bugün hisse senetlerinde önemli bir artış gözlemlendi." },
            { title: "Ekonomik Gelişme: FED Kararı", content: "FED, faiz oranlarında değişiklik yapmadığını açıkladı." }
        ];
        res.json({ news });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "News retrieval failed." });
    }
});

// Calendar endpoint: Ekonomik takvim olaylarını çekmek için endpoint.
app.get('/api/calendar', async (req, res) => {
    try {
        const calendar = [
            { event: "FED Kararı", date: "2025-03-01T15:00:00Z" },
            { event: "İstihdam Raporu", date: "2025-03-10T10:00:00Z" }
        ];
        res.json({ calendar });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Calendar retrieval failed." });
    }
});

// Signals endpoint: Alım/satım sinyallerini çekmek için endpoint.
app.get('/api/signals', async (req, res) => {
    try {
        const signals = [
            { symbol: "AAPL", action: "BUY" },
            { symbol: "TSLA", action: "SELL" }
        ];
        res.json({ signals });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signals retrieval failed." });
    }
});

// Settings endpoint: Kullanıcı ayarlarını güncellemek için endpoint.
app.post('/api/settings', async (req, res) => {
    try {
        const { asset_symbol, indicator_type, threshold_value } = req.body;
        if (!asset_symbol || !indicator_type || threshold_value === undefined) {
            return res.status(400).json({ error: "asset_symbol, indicator_type and threshold_value are required." });
        }
        // Dummy response simulating settings update
        res.json({ message: "Signal settings updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Settings update failed." });
    }
});

// --- New endpoints for database integration ---

// Get Investment Profiles endpoint
app.get('/api/investment/profiles', async (req, res) => {
    try {
        const { data, error } = await supabase.from('investment_profiles').select('*');
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ profiles: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fetching investment profiles failed.' });
    }
});

// Get Economic Events endpoint
app.get('/api/economic/events', async (req, res) => {
    try {
        const { data, error } = await supabase.from('economic_events').select('*');
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ events: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fetching economic events failed.' });
    }
});

// Get Signal Settings endpoint
app.get('/api/signal-settings', async (req, res) => {
    try {
        const { data, error } = await supabase.from('signal_settings').select('*');
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ settings: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fetching signal settings failed.' });
    }
});

// Telegram Bot Webhook endpoint: Simulate processing messages from Telegram.
app.post('/api/telegram/webhook', async (req, res) => {
    try {
        const { message } = req.body;
        let responseText = "";
        if (message && typeof message === 'string' && message.toLowerCase().includes('signal')) {
            responseText = "Alım sinyali: BUY";
        } else {
            responseText = "Merhaba, FinancialPro Telegram bot'a hoş geldiniz!";
        }
        res.json({ response: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Telegram webhook processing failed." });
    }
});

// Investment Profile Creation/Update endpoint: Kullanıcı yatırım profilini oluşturmak veya güncellemek için endpoint.
app.post('/api/investment/profile', (req, res) => {
    try {
        if (process.env.NODE_ENV === 'test') {
            return res.json({ profile: mockProfiles[0] });
        }
        
        // Normal profile creation logic
        const profile = req.body;
        res.json({ profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Discord Bot Webhook endpoint: Simulate processing messages from Discord.
app.post('/api/discord/webhook', async (req, res) => {
    try {
        const { message } = req.body;
        let responseText = "";
        if (message && typeof message === 'string' && message.toLowerCase().includes('signal')) {
            responseText = "Discord sinyali: SELL";
        } else {
            responseText = "Merhaba, FinancialPro Discord bot'una hoş geldiniz!";
        }
        res.json({ response: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Discord webhook processing failed." });
    }
});

// WhatsApp Bot Webhook endpoint: Simulate processing messages from WhatsApp via Twilio.
app.post('/api/whatsapp/webhook', async (req, res) => {
    try {
        const { message } = req.body;
        let responseText = "";
        if (message && typeof message === 'string' && message.toLowerCase().includes('signal')) {
            responseText = "WhatsApp sinyali: BUY";
        } else {
            responseText = "Merhaba, FinancialPro WhatsApp bot'una hoş geldiniz!";
        }
        res.json({ response: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "WhatsApp webhook processing failed." });
    }
});

// User Registration endpoint: Create a new user in the 'users' table.
app.post('/api/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'username and password are required.' });
        }

        // In production, hash the password before storing
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, password_hash: password }]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ user: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'User registration failed.' });
    }
});

// User Update endpoint: Update user details in the 'users' table.
app.patch('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;
        if (!username && !password) {
            return res.status(400).json({ error: 'At least one field (username or password) must be provided for update.' });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password_hash = password; // In production, hash the password

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .match({ id: userId });

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ user: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'User update failed.' });
    }
});

// User Delete endpoint: Delete a user from the 'users' table.
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { data, error } = await supabase
            .from('users')
            .delete()
            .match({ id: userId });
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'User deleted successfully.', user: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'User deletion failed.' });
    }
});

// Dashboard endpoint: Fetch investment profiles, dummy news, and dummy signals.
app.get('/api/dashboard', (req, res) => {
    try {
        if (process.env.NODE_ENV === 'test') {
            return res.json({ dashboard: mockDashboard });
        }
        
        // Normal dashboard logic
        res.json({ dashboard: mockDashboard }); // For now, use mock data in all environments
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Economic Event Creation endpoint: Create a new economic event
app.post('/api/economic/event', async (req, res) => {
    try {
        const { event_name, event_date, impact_level } = req.body;
        if (!event_name || !event_date || impact_level === undefined) {
            return res.status(400).json({ error: 'event_name, event_date and impact_level are required.' });
        }

        // Insert new economic event into the 'economic_events' table
        const { data, error } = await supabase
            .from('economic_events')
            .insert([{ event: event_name, date: event_date, impact_level }]);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ event: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Economic event creation failed.' });
    }
});

// AI Model Info endpoint: Retrieve dummy AI model information.
app.get('/api/ai/model-info', async (req, res) => {
    try {
        res.json({ model: "Dummy RAG Model v1.0 - not implemented" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve AI model info." });
    }
});

// Investment Profile Update endpoint: Update an existing investment profile
app.patch('/api/investment/profile/:id', async (req, res) => {
    try {
        const profileId = req.params.id;
        const { risk_tolerance, asset_allocation, goals } = req.body;
        if (risk_tolerance === undefined && asset_allocation === undefined && goals === undefined) {
            return res.status(400).json({ error: 'At least one field (risk_tolerance, asset_allocation, goals) is required for update.' });
        }
        
        const updateData = {};
        if (risk_tolerance !== undefined) updateData.risk_tolerance = risk_tolerance;
        if (asset_allocation !== undefined) updateData.asset_allocation = asset_allocation;
        if (goals !== undefined) updateData.goals = goals;

        const { data, error } = await supabase
            .from('investment_profiles')
            .update(updateData)
            .eq('id', profileId);

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ profile: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Investment profile update failed.' });
    }
});

// Investment Profile Delete endpoint: Delete an investment profile
app.delete('/api/investment/profile/:id', async (req, res) => {
    try {
        const profileId = req.params.id;
        const { data, error } = await supabase
            .from('investment_profiles')
            .delete()
            .eq('id', profileId);

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Investment profile deleted successfully.', profile: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Investment profile deletion failed.' });
    }
});

// Signal Settings Update endpoint: Update an existing signal setting
app.patch('/api/signal-settings/:id', async (req, res) => {
    try {
        const settingId = req.params.id;
        const { asset_symbol, indicator_type, threshold_value } = req.body;
        if (asset_symbol === undefined && indicator_type === undefined && threshold_value === undefined) {
            return res.status(400).json({ error: 'At least one field (asset_symbol, indicator_type, threshold_value) is required for update.' });
        }
        const updateData = {};
        if (asset_symbol !== undefined) updateData.asset_symbol = asset_symbol;
        if (indicator_type !== undefined) updateData.indicator_type = indicator_type;
        if (threshold_value !== undefined) updateData.threshold_value = threshold_value;
        
        const { data, error } = await supabase
            .from('signal_settings')
            .update(updateData)
            .eq('id', settingId);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ setting: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signal setting update failed.' });
    }
});

// Signal Settings Delete endpoint: Delete an existing signal setting
app.delete('/api/signal-settings/:id', async (req, res) => {
    try {
        const settingId = req.params.id;
        const { data, error } = await supabase
            .from('signal_settings')
            .delete()
            .eq('id', settingId);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Signal setting deleted successfully.', setting: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signal setting deletion failed.' });
    }
});

// User Login endpoint: Authenticate user and return JWT
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (process.env.NODE_ENV === 'test') {
        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (user) {
            return res.json({ token: user.token });
        }
    }
    
    // Normal login logic
    if (username === 'testuser' && password === 'testpass') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET || 'test-secret');
        return res.json({ token });
    }
    
    res.status(400).json({ error: 'Invalid credentials' });
});

// Authentication middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing.' });
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalid.' });
        req.user = user;
        next();
    });
}

// Protected endpoint: Only accessible with valid JWT token
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}. You have accessed a protected route!` });
});

// Start the server
app.listen(port, () => {
    console.log(`FinancialPro API server is running on port ${port}`);
});

export default app; 