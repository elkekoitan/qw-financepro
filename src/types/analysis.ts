export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: string;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

export interface ChartData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  publishedAt: string;
}

export interface AnalysisFilter {
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD';
  indicators: string[];
  newsSource: string[];
}

export interface AnalysisState {
  loading: boolean;
  error: string | null;
  marketData: MarketData | null;
  technicalIndicators: TechnicalIndicator[];
  chartData: ChartData[];
  news: NewsItem[];
  filters: AnalysisFilter;
}

export interface AnalysisProps {
  symbol?: string;
  initialData?: {
    marketData?: MarketData;
    technicalIndicators?: TechnicalIndicator[];
    chartData?: ChartData[];
    news?: NewsItem[];
  };
}

export interface ChartOptions {
  type: 'candlestick' | 'line' | 'area';
  showVolume: boolean;
  showGrid: boolean;
  showTooltip: boolean;
  showLegend: boolean;
  height: number;
} 