const request = require('supertest');
const app = require('../src/api');

// FinancialPro API testi

describe('FinancialPro API', () => {
  test('GET / returns HTML content', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html>');
    expect(response.text).toContain('<title>FinancialPro - Tahmin Sistemi</title>');
  });

  test('POST /predict returns prediction for valid features', async () => {
    const response = await request(app)
      .post('/predict')
      .send({ features: [1, 2, 3] });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('prediction');
  });

  test('POST /predict returns 400 for invalid features', async () => {
    const response = await request(app)
      .post('/predict')
      .send({ features: 'invalid' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /mobile/predict returns mobile prediction for valid features', async () => {
    const response = await request(app)
      .post('/mobile/predict')
      .send({ features: [1, 2, 3] });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mobilePrediction');
  });

  test('POST /rag/data returns ragData property', async () => {
    const response = await request(app)
      .post('/rag/data')
      .send({});
    expect(response.body).toHaveProperty('ragData');
  });

  test('User login flow', async () => {
    // Login with test credentials
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ 
        username: 'testuser',
        password: 'testpass'
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    // Use token to access protected endpoint
    const token = loginResponse.body.token;
    const protectedResponse = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body).toHaveProperty('dashboard');
  });
}); 