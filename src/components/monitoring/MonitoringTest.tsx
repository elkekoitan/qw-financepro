import { useState } from 'react';
import {
  trackError,
  trackPerformance,
  trackEvent,
  trackBusinessMetric,
  startTransaction,
  endTransaction
} from '@/utils/monitoring';

export const MonitoringTest = () => {
  const [loading, setLoading] = useState(false);

  const handleTestError = () => {
    try {
      throw new Error('Test error from MonitoringTest component');
    } catch (error) {
      if (error instanceof Error) {
        trackError(error, {
          component: 'MonitoringTest',
          action: 'handleTestError',
          severity: 'high',
          userId: '123',
          sessionId: 'test-session'
        });
      }
    }
  };

  const handleTestPerformance = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      // İşlem başlat
      startTransaction('test-operation', {
        component: 'MonitoringTest',
        action: 'handleTestPerformance'
      });

      // İş mantığını simüle et
      await new Promise(resolve => setTimeout(resolve, 2000));

      // İş metriğini kaydet
      trackBusinessMetric('system', 'performance', 100, {
        component: 'MonitoringTest',
        operation: 'test-operation'
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      trackPerformance('test-operation', duration, {
        component: 'MonitoringTest',
        action: 'handleTestPerformance',
        result: 'success'
      });

      // İşlemi başarıyla bitir
      endTransaction('test-operation', 'success', {
        duration,
        result: 'success'
      });
    } catch (error) {
      // Hata durumunda işlemi başarısız olarak bitir
      endTransaction('test-operation', 'failure', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEvent = () => {
    // İşlem başlat
    startTransaction('test-event', {
      component: 'MonitoringTest',
      action: 'handleTestEvent'
    });

    // Kullanıcı etkileşimini kaydet
    trackEvent('test-button-click', {
      component: 'MonitoringTest',
      action: 'handleTestEvent',
      timestamp: new Date().toISOString(),
      userId: '123',
      sessionId: 'test-session'
    });

    // İş metriğini kaydet
    trackBusinessMetric('user', 'latency', 50, {
      component: 'MonitoringTest',
      action: 'handleTestEvent'
    });

    // İşlemi başarıyla bitir
    endTransaction('test-event', 'success', {
      result: 'success'
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">İzleme Sistemi Testi</h2>
      
      <div className="space-y-2">
        <button
          onClick={handleTestError}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Hata Testi
        </button>

        <button
          onClick={handleTestPerformance}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'İşlem Yapılıyor...' : 'Performans Testi'}
        </button>

        <button
          onClick={handleTestEvent}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Olay Testi
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Bu komponent, izleme sisteminin farklı özelliklerini test etmek için kullanılır:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Hata İzleme: Sentry ve New Relic'e hata gönderir</li>
          <li>Performans İzleme: İşlem süresini ölçer ve izleme sistemlerine gönderir</li>
          <li>Olay İzleme: Kullanıcı etkileşimlerini izler</li>
          <li>İş Metrikleri: Özel iş metriklerini kaydeder</li>
          <li>İşlem İzleme: İşlem başlangıç ve bitiş noktalarını izler</li>
        </ul>
      </div>
    </div>
  );
}; 