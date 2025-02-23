declare module 'newrelic' {
  interface NewRelic {
    addCustomAttribute(key: string, value: any): void;
    addCustomAttributes(attributes: Record<string, any>): void;
    getCustomAttribute(key: string): any;
    noticeError(error: Error, customAttributes?: Record<string, any>): void;
    recordMetric(name: string, value: number): void;
    recordCustomEvent(eventType: string, attributes?: Record<string, any>): void;
    setTransactionName(name: string): void;
    startSegment(name: string, record?: boolean): any;
    endSegment(): void;
    startWebTransaction(name: string, handle: () => void): void;
    endTransaction(): void;
    getBrowserTimingHeader(): string;
    setPageViewName(name: string, host?: string): void;
  }

  const newrelic: NewRelic;
  export = newrelic;
} 