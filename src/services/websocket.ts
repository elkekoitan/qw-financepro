import { createClient } from '@supabase/supabase-js';
import type { RealtimePostgresChangesPayload, RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import type { PriceUpdate, PortfolioUpdate, TradeUpdate, PriceAlertUpdate, NotificationEvent } from '@/types/websocket';
import type {
  WebSocketService,
  WebSocketSubscription,
  MarketDataMessage,
  PortfolioUpdateMessage,
  TradeNotificationMessage,
  PriceAlertMessage,
  SystemNotificationMessage,
  WebSocketConfig,
} from '@/types/websocket';

const DEFAULT_CONFIG: WebSocketConfig = {
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  pingInterval: 30000,
  pongTimeout: 10000,
};

class WebSocketServiceImpl implements WebSocketService {
  private supabase;
  private subscriptions: Map<string, WebSocketSubscription>;
  private config: WebSocketConfig;

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.subscriptions = new Map();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Market verisi için subscription
  subscribeToMarketData(
    symbol: string,
    callback: (data: PriceUpdate) => void
  ): void {
    const channel = this.supabase.channel(`market-data-${symbol}`);

    channel.on('broadcast', { event: 'price-update' }, (payload) => {
      const typedPayload = payload as unknown as PriceUpdate;

      if (
        typeof typedPayload.symbol === 'string' &&
        typeof typedPayload.price === 'number' &&
        typeof typedPayload.change === 'number' &&
        typeof typedPayload.changePercent === 'number' &&
        typeof typedPayload.volume === 'number' &&
        typeof typedPayload.timestamp === 'string'
      ) {
        callback(typedPayload);
      } else {
        console.error('Invalid price update payload:', payload);
      }
    });

    this.subscriptions.set(`market-data-${symbol}`, {
      unsubscribe: () => channel.unsubscribe(),
    });
  }

  // Portföy güncellemeleri için subscription
  subscribeToPortfolioUpdates(
    userId: string,
    callback: (data: PortfolioUpdate) => void
  ): void {
    const channel = this.supabase.channel(`portfolio-${userId}`);

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'portfolios' }, (payload) => {
      const typedPayload = payload as unknown as RealtimePostgresChangesPayload<PortfolioUpdate>;

      if (
        typedPayload.eventType === 'UPDATE' &&
        typeof typedPayload.new.userId === 'string' &&
        typeof typedPayload.new.totalValue === 'number' &&
        typeof typedPayload.new.dailyChange === 'number' &&
        typeof typedPayload.new.dailyChangePercent === 'number' &&
        Array.isArray(typedPayload.new.holdings) &&
        typedPayload.new.holdings.every((holding: PortfolioUpdate['holdings'][number]) =>
          typeof holding.symbol === 'string' &&
          typeof holding.quantity === 'number' &&
          typeof holding.averagePrice === 'number' &&
          typeof holding.currentPrice === 'number' &&
          typeof holding.value === 'number' &&
          typeof holding.change === 'number' &&
          typeof holding.changePercent === 'number'
        ) &&
        typeof typedPayload.new.timestamp === 'string'
      ) {
        callback(typedPayload.new);
      } else {
        console.error('Invalid portfolio update payload:', payload);
      }
    });

    this.subscriptions.set(`portfolio-${userId}`, {
      unsubscribe: () => channel.unsubscribe(),
    });
  }

  // İşlem bildirimleri için subscription
  subscribeToTradeNotifications(
    userId: string,
    callback: (data: TradeUpdate) => void
  ): void {
    const channel = this.supabase.channel(`trades-${userId}`);

    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trades' }, (payload) => {
      const typedPayload = payload as unknown as RealtimePostgresInsertPayload<TradeUpdate>;

      if (
        typeof typedPayload.new.userId === 'string' &&
        typeof typedPayload.new.tradeId === 'string' &&
        typeof typedPayload.new.symbol === 'string' &&
        (typedPayload.new.type === 'buy' || typedPayload.new.type === 'sell') &&
        typeof typedPayload.new.quantity === 'number' &&
        typeof typedPayload.new.price === 'number' &&
        typeof typedPayload.new.total === 'number' &&
        (typedPayload.new.status === 'pending' || typedPayload.new.status === 'completed' || typedPayload.new.status === 'failed') &&
        typeof typedPayload.new.timestamp === 'string'
      ) {
        callback(typedPayload.new);
      } else {
        console.error('Invalid trade update payload:', payload);
      }
    });

    this.subscriptions.set(`trades-${userId}`, {
      unsubscribe: () => channel.unsubscribe(),
    });
  }

  // Fiyat alarmları için subscription
  subscribeToPriceAlerts(
    userId: string,
    callback: (data: PriceAlertUpdate) => void
  ): void {
    const channel = this.supabase.channel(`price-alerts-${userId}`);

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'price_alerts' }, (payload) => {
      const typedPayload = payload as unknown as RealtimePostgresChangesPayload<PriceAlertUpdate>;

      if (
        (typedPayload.eventType === 'INSERT' || typedPayload.eventType === 'UPDATE') &&
        typeof typedPayload.new.userId === 'string' &&
        typeof typedPayload.new.alertId === 'string' &&
        typeof typedPayload.new.symbol === 'string' &&
        (typedPayload.new.condition === 'above' || typedPayload.new.condition === 'below') &&
        typeof typedPayload.new.targetPrice === 'number' &&
        typeof typedPayload.new.currentPrice === 'number' &&
        typeof typedPayload.new.timestamp === 'string'
      ) {
        callback(typedPayload.new);
      } else {
        console.error('Invalid price alert update payload:', payload);
      }
    });

    this.subscriptions.set(`price-alerts-${userId}`, {
      unsubscribe: () => channel.unsubscribe(),
    });
  }

  // Genel sistem bildirimleri için subscription
  subscribeToSystemNotifications(
    userId: string,
    callback: (data: NotificationEvent) => void
  ): void {
    const channel = this.supabase.channel(`notifications-${userId}`);

    channel.on('broadcast', { event: 'notification' }, (payload) => {
      const typedPayload = payload as unknown as NotificationEvent;

      if (
        typeof typedPayload.userId === 'string' &&
        typeof typedPayload.notificationId === 'string' &&
        typeof typedPayload.title === 'string' &&
        typeof typedPayload.message === 'string' &&
        (typedPayload.severity === 'info' || typedPayload.severity === 'error' || typedPayload.severity === 'success' || typedPayload.severity === 'warning') &&
        (!typedPayload.action || (typeof typedPayload.action.label === 'string' && typeof typedPayload.action.url === 'string')) &&
        typeof typedPayload.timestamp === 'string'  
      ) {
        callback(typedPayload);
      } else {
        console.error('Invalid notification payload:', payload);
      }
    });

    this.subscriptions.set(`notifications-${userId}`, {
      unsubscribe: () => channel.unsubscribe(),
    });
  }

  // Belirli bir subscription'ı kaldır
  unsubscribe(subscriptionKey: string): void {
    const subscription = this.subscriptions.get(subscriptionKey);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  }

  // Tüm subscription'ları kaldır
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  // Bağlantı durumunu kontrol et
  async checkConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('healthcheck').select('*').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  // Bağlantıyı yeniden kur
  async reconnect(): Promise<void> {
    // Mevcut subscription'ları kaydet
    const currentSubscriptions = Array.from(this.subscriptions.entries());

    // Tüm subscription'ları kaldır
    this.unsubscribeAll();

    // Yeni Supabase client oluştur
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Subscription'ları yeniden oluştur
    currentSubscriptions.forEach(([key, _]) => {
      const [type, id] = key.split('-');
      switch (type) {
        case 'market-data':
          this.subscribeToMarketData(id, () => {});
          break;
        case 'portfolio':
          this.subscribeToPortfolioUpdates(id, () => {});
          break;
        case 'trades':
          this.subscribeToTradeNotifications(id, () => {});
          break;
        case 'price-alerts':
          this.subscribeToPriceAlerts(id, () => {});
          break;
        case 'notifications':
          this.subscribeToSystemNotifications(id, () => {});
          break;
      }
    });
  }
}

// Singleton instance
export const websocketService = new WebSocketServiceImpl(); 