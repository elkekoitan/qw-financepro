import * as Sentry from '@sentry/nextjs';
import newrelic from 'newrelic';

// Global type declarations
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
  }
}

// Custom metric types
export type MetricType = 'portfolio' | 'investment' | 'user' | 'system';
export type MetricName = 'value' | 'performance' | 'latency' | 'error_rate';

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  // Sentry'ye hata gönder
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }

  // New Relic'e hata gönder
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      // Hata detaylarını kaydet
      newrelic.noticeError(error, {
        ...context,
        errorType: error.name,
        errorMessage: error.message,
        stackTrace: error.stack,
        timestamp: new Date().toISOString()
      });

      // Hata metriğini artır
      newrelic.recordMetric('Errors/Count', 1);
      
      // Hata türüne göre özel metrik
      newrelic.recordMetric(`Errors/${error.name}/Count`, 1);
    } catch (e) {
      console.error('Failed to send error to New Relic:', e);
    }
  }

  // Console'a hata logla (development ortamında)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', error);
    if (context) {
      console.error('Context:', context);
    }
  }
};

// Performance monitoring
export const trackPerformance = (name: string, duration: number, attributes?: Record<string, any>) => {
  // New Relic'e performans metriği gönder
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      // Ana metrik
      newrelic.recordMetric(`Custom/${name}`, duration);

      // Performans segmentleri
      if (duration < 100) {
        newrelic.recordMetric(`Custom/${name}/Fast`, duration);
      } else if (duration < 1000) {
        newrelic.recordMetric(`Custom/${name}/Medium`, duration);
      } else {
        newrelic.recordMetric(`Custom/${name}/Slow`, duration);
      }

      // Özel öznitelikleri ekle
      if (attributes) {
        newrelic.addCustomAttributes({
          ...attributes,
          duration,
          timestamp: new Date().toISOString(),
          performanceCategory: name
        });
      }
    } catch (e) {
      console.error('Failed to send performance metric to New Relic:', e);
    }
  }

  // Sentry'ye performans metriği gönder
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.withScope((scope) => {
      scope.setTransactionName(name);
      scope.setTag('duration_ms', String(duration));
      
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          scope.setTag(key, String(value));
        });
      }

      Sentry.captureMessage('Performance Metric', {
        level: 'info',
        extra: {
          duration,
          ...attributes,
        },
      });
    });
  }
};

// Custom business metrics
export const trackBusinessMetric = (
  type: MetricType,
  name: MetricName,
  value: number,
  attributes?: Record<string, any>
) => {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      // Ana metrik
      newrelic.recordMetric(`Business/${type}/${name}`, value);

      // Trend analizi için kümülatif metrik
      newrelic.recordMetric(`Business/${type}/${name}/Cumulative`, value);

      // Özel öznitelikleri ekle
      if (attributes) {
        newrelic.addCustomAttributes({
          ...attributes,
          metricType: type,
          metricName: name,
          value,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Failed to send business metric to New Relic:', e);
    }
  }
};

// Transaction tracking
export const startTransaction = (name: string, attributes?: Record<string, any>) => {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      // İşlem başlat
      newrelic.addCustomAttribute('transactionName', name);
      newrelic.addCustomAttribute('transactionStartTime', Date.now());
      
      if (attributes) {
        newrelic.addCustomAttributes(attributes);
      }
    } catch (e) {
      console.error('Failed to start transaction in New Relic:', e);
    }
  }
};

export const endTransaction = (name: string, status: 'success' | 'failure', attributes?: Record<string, any>) => {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      const startTime = newrelic.getCustomAttribute('transactionStartTime');
      if (startTime) {
        const duration = Date.now() - startTime;
        
        // İşlem metriklerini kaydet
        newrelic.recordMetric(`Transaction/${name}/Duration`, duration);
        newrelic.recordMetric(`Transaction/${name}/${status === 'success' ? 'Success' : 'Failure'}`, 1);

        // Özel öznitelikleri ekle
        newrelic.addCustomAttributes({
          ...attributes,
          transactionName: name,
          transactionStatus: status,
          transactionDuration: duration,
          transactionEndTime: Date.now()
        });
      }
    } catch (e) {
      console.error('Failed to end transaction in New Relic:', e);
    }
  }
};

// Analytics tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Google Analytics event tracking
  if (typeof window !== 'undefined' && window.gtag && process.env.GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, properties);
  }

  // New Relic custom event tracking
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      newrelic.recordCustomEvent(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    } catch (e) {
      console.error('Failed to send event to New Relic:', e);
    }
  }
};

// Initialize monitoring
export const initMonitoring = () => {
  // Sentry is initialized in sentry.client.config.ts and sentry.server.config.ts
  
  // Initialize New Relic
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      // Temel öznitelikleri ayarla
      newrelic.addCustomAttribute('appName', process.env.NEW_RELIC_APP_NAME || 'FinancePro');
      newrelic.addCustomAttribute('environment', process.env.NODE_ENV || 'development');
      newrelic.addCustomAttribute('region', process.env.NEW_RELIC_REGION || 'EU');

      // Uygulama başlangıç metriklerini kaydet
      newrelic.recordMetric('Application/Start', 1);
      newrelic.recordCustomEvent('ApplicationStart', {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        region: process.env.NEW_RELIC_REGION
      });

      console.log('New Relic initialized successfully');
    } catch (error) {
      console.error('Failed to initialize New Relic:', error);
    }
  } else {
    console.warn('New Relic license key not found');
  }
}; 