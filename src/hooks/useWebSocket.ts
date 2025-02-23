import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { websocketService } from '@/services/websocket';
import type {
  WebSocketOptions,
  WebSocketConnectionState,
  MarketDataMessage,
  PortfolioUpdateMessage,
  TradeNotificationMessage,
  PriceAlertMessage,
  SystemNotificationMessage,
} from '@/types/websocket';

const DEFAULT_OPTIONS: Partial<WebSocketOptions> = {
  autoReconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
};

export function useWebSocket(options: WebSocketOptions = {}) {
  const { user } = useAuth();
  const {
    onMarketData,
    onPortfolioUpdate,
    onTradeNotification,
    onPriceAlert,
    onSystemNotification,
    symbols = [],
    autoReconnect = DEFAULT_OPTIONS.autoReconnect,
    reconnectInterval = DEFAULT_OPTIONS.reconnectInterval,
    maxReconnectAttempts = DEFAULT_OPTIONS.maxReconnectAttempts,
  } = options;

  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>({
    connected: false,
    lastConnected: null,
    reconnectAttempts: 0,
    error: null,
  });

  // Bağlantı durumunu kontrol et
  const checkConnection = useCallback(async () => {
    const isConnected = await websocketService.checkConnection();
    setConnectionState(prev => ({
      ...prev,
      connected: isConnected,
      lastConnected: isConnected ? new Date().toISOString() : prev.lastConnected,
      error: isConnected ? null : prev.error,
    }));
    return isConnected;
  }, []);

  // Bağlantıyı yeniden kur
  const reconnect = useCallback(async () => {
    if (connectionState.reconnectAttempts >= (maxReconnectAttempts || 0)) {
      setConnectionState(prev => ({
        ...prev,
        error: 'Maksimum yeniden bağlanma denemesi sayısına ulaşıldı',
      }));
      return;
    }

    try {
      await websocketService.reconnect();
      const isConnected = await checkConnection();
      if (isConnected) {
        setConnectionState({
          connected: true,
          lastConnected: new Date().toISOString(),
          reconnectAttempts: 0,
          error: null,
        });
      } else {
        throw new Error('Bağlantı kurulamadı');
      }
    } catch (error) {
      setConnectionState(prev => ({
        ...prev,
        connected: false,
        reconnectAttempts: prev.reconnectAttempts + 1,
        error: error instanceof Error ? error.message : 'Bağlantı hatası',
      }));

      if (autoReconnect) {
        setTimeout(reconnect, reconnectInterval);
      }
    }
  }, [
    autoReconnect,
    reconnectInterval,
    maxReconnectAttempts,
    connectionState.reconnectAttempts,
    checkConnection,
  ]);

  // İlk bağlantıyı kur
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Subscription'ları yönet
  useEffect(() => {
    if (!user || !connectionState.connected) return;

    // Market verisi subscription'ları
    symbols.forEach((symbol) => {
      if (onMarketData) {
        websocketService.subscribeToMarketData(symbol, onMarketData);
      }
    });

    // Portföy güncellemeleri subscription'ı
    if (onPortfolioUpdate) {
      websocketService.subscribeToPortfolioUpdates(user.id, onPortfolioUpdate);
    }

    // İşlem bildirimleri subscription'ı
    if (onTradeNotification) {
      websocketService.subscribeToTradeNotifications(user.id, onTradeNotification);
    }

    // Fiyat alarmları subscription'ı
    if (onPriceAlert) {
      websocketService.subscribeToPriceAlerts(user.id, onPriceAlert);
    }

    // Sistem bildirimleri subscription'ı
    if (onSystemNotification) {
      websocketService.subscribeToSystemNotifications(user.id, onSystemNotification);
    }

    // Cleanup
    return () => {
      // Market verisi subscription'larını kaldır
      symbols.forEach((symbol) => {
        websocketService.unsubscribe(`market-data-${symbol}`);
      });

      // Diğer subscription'ları kaldır
      if (user) {
        websocketService.unsubscribe(`portfolio-${user.id}`);
        websocketService.unsubscribe(`trades-${user.id}`);
        websocketService.unsubscribe(`price-alerts-${user.id}`);
        websocketService.unsubscribe(`system-notifications-${user.id}`);
      }
    };
  }, [
    user,
    symbols,
    onMarketData,
    onPortfolioUpdate,
    onTradeNotification,
    onPriceAlert,
    onSystemNotification,
    connectionState.connected,
  ]);

  return {
    ...connectionState,
    checkConnection,
    reconnect,
  };
}