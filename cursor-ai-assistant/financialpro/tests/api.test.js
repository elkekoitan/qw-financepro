const request = require('supertest');
const app = require('../src/api');

// Test öncesi mock verileri
const mockUser = {
    username: 'testuser',
    password: 'testpass'
};

// Her test öncesi çalışacak
beforeAll(async () => {
    // Test veritabanı bağlantısı ve hazırlığı
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001'; // Test için farklı port
});

// Her test sonrası çalışacak
afterAll(async () => {
    // Test sonrası temizlik
    await new Promise(resolve => setTimeout(resolve, 500));
    process.env.NODE_ENV = 'development';
});

describe('FinancialPro API Tests', () => {
    describe('Authentication Endpoints', () => {
        test('POST /api/auth/login should return token with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(mockUser);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });

    describe('Prediction Endpoints', () => {
        test('POST /predict should return prediction for valid features', async () => {
            const res = await request(app)
                .post('/predict')
                .send({
                    features: [1, 2, 3]
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('prediction');
        });

        test('POST /mobile/predict should return mobile prediction', async () => {
            const res = await request(app)
                .post('/mobile/predict')
                .send({
                    features: [1, 2, 3]
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('mobilePrediction');
        });
    });

    describe('Investment Profile Endpoints', () => {
        test('POST /api/investment/profile should create profile', async () => {
            const res = await request(app)
                .post('/api/investment/profile')
                .send({
                    user_id: 1,
                    risk_tolerance: 'high',
                    asset_allocation: 'aggressive',
                    goals: 'growth'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('profile');
        });
    });

    describe('Dashboard Endpoints', () => {
        test('GET /api/dashboard should return dashboard data', async () => {
            const res = await request(app)
                .get('/api/dashboard');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('dashboard');
            expect(res.body.dashboard).toHaveProperty('profiles');
            expect(res.body.dashboard).toHaveProperty('news');
            expect(res.body.dashboard).toHaveProperty('signals');
        });
    });
}); 