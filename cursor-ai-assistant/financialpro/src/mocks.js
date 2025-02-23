// Mock kullanıcı verileri
export const mockUsers = [
    {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        token: 'mock-jwt-token'
    }
];

// Mock yatırım profilleri
export const mockProfiles = [
    {
        id: 1,
        user_id: 1,
        risk_tolerance: 'high',
        asset_allocation: 'aggressive',
        goals: 'growth'
    }
];

// Mock dashboard verileri
export const mockDashboard = {
    totalAssets: 100000,
    monthlyReturn: 5.2,
    portfolioAllocation: {
        stocks: 60,
        bonds: 30,
        cash: 10
    },
    recentTransactions: [
        {
            id: 1,
            type: 'buy',
            asset: 'AAPL',
            amount: 1000,
            date: '2024-02-11'
        }
    ]
}; 