'use strict';

exports.config = {
  app_name: ['FinancePro'],
  license_key: 'NRJS-e8b9******',  // Browser key
  account_id: '6468422',
  distributed_tracing: {
    enabled: true,
    exclude_newrelic_header: false,
  },
  logging: {
    level: 'info',
    enabled: true,
    filepath: 'logs/newrelic.log'
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    record_sql: 'obfuscated',
    explain_threshold: 500
  },
  error_collector: {
    enabled: true,
    ignore_status_codes: [404, 401]
  },
  apdex_t: 0.5,
  browser_monitoring: {
    enable: true,
    debug: process.env.NODE_ENV !== 'production',
    ssl_for_http: true
  },
  cross_application_tracer: {
    enabled: true
  },
  slow_sql: {
    enabled: true
  }
}; 