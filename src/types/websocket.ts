// WebSocket mesaj tipleri
export type WebSocketMessageType =
  | 'market-update'
  | 'portfolio-update'
  | 'trade-notification'
  | 'price-alert'
  | 'system-notification';

// Market verisi mesajı
export interface MarketDataMessage {
  type: 'market-update';
  payload: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  };
}

// Portföy güncelleme mesajı
export interface PortfolioUpdateMessage {
  type: 'portfolio-update';
  payload: {
    userId: string;
    totalValue: number;
    dailyChange: number;
    dailyChangePercent: number;
    holdings: Array<{
      symbol: string;
      quantity: number;
      averagePrice: number;
      currentPrice: number;
      value: number;
      change: number;
      changePercent: number;
    }>;
    timestamp: string;
  };
}

// İşlem bildirimi mesajı
export interface TradeNotificationMessage {
  type: 'trade-notification';
  payload: {
    userId: string;
    tradeId: string;
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    total: number;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
  };
}

// Fiyat alarmı mesajı
export interface PriceAlertMessage {
  type: 'price-alert';
  payload: {
    userId: string;
    alertId: string;
    symbol: string;
    condition: 'above' | 'below';
    targetPrice: number;
    currentPrice: number;
    timestamp: string;
  };
}

// Sistem bildirimi mesajı
export interface SystemNotificationMessage {
  type: 'system-notification';
  payload: {
    userId: string;
    notificationId: string;
    title: string;
    message: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    action?: {
      label: string;
      url: string;
    };
    timestamp: string;
  };
}

// Tüm mesaj tipleri birleşimi
export type WebSocketMessage =
  | MarketDataMessage
  | PortfolioUpdateMessage
  | TradeNotificationMessage
  | PriceAlertMessage
  | SystemNotificationMessage;

// WebSocket bağlantı durumu
export interface WebSocketConnectionState {
  connected: boolean;
  lastConnected: string | null;
  reconnectAttempts: number;
  error: string | null;
}

// WebSocket subscription
export interface WebSocketSubscription {
  unsubscribe: () => void;
}

// WebSocket servis konfigürasyonu
export interface WebSocketConfig {
  reconnectInterval: number;
  maxReconnectAttempts: number;
  pingInterval: number;
  pongTimeout: number;
}

// WebSocket hook seçenekleri
export interface WebSocketOptions {
  onMarketData?: (data: MarketDataMessage['payload']) => void;
  onPortfolioUpdate?: (data: PortfolioUpdateMessage['payload']) => void;
  onTradeNotification?: (data: TradeNotificationMessage['payload']) => void;
  onPriceAlert?: (data: PriceAlertMessage['payload']) => void;
  onSystemNotification?: (data: SystemNotificationMessage['payload']) => void;
  symbols?: string[];
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// WebSocket servis arayüzü
export interface WebSocketService {
  subscribeToMarketData(symbol: string, callback: (data: MarketDataMessage['payload']) => void): void;
  subscribeToPortfolioUpdates(userId: string, callback: (data: PortfolioUpdateMessage['payload']) => void): void;
  subscribeToTradeNotifications(userId: string, callback: (data: TradeNotificationMessage['payload']) => void): void;
  subscribeToPriceAlerts(userId: string, callback: (data: PriceAlertMessage['payload']) => void): void;
  subscribeToSystemNotifications(userId: string, callback: (data: SystemNotificationMessage['payload']) => void): void;
  unsubscribe(subscriptionKey: string): void;
  unsubscribeAll(): void;
  checkConnection(): Promise<boolean>;
  reconnect(): Promise<void>;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface PortfolioUpdate {
  userId: string;
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  holdings: {
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    value: number;
    change: number;
    changePercent: number;
  }[];
  timestamp: string;
}

export interface TradeUpdate {
  userId: string;
  tradeId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

export interface PriceAlertUpdate {
  userId: string;
  alertId: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  timestamp: string;
}

export interface NotificationEvent {
  userId: string;
  notificationId: string;
  title: string;
  message: string;
  severity: 'info' | 'error' | 'success' | 'warning';
  action?: {
    label: string;
    url: string;
  };
  timestamp: string;
}