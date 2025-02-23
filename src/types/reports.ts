export interface ReportData {
  id: string;
  title: string;
  type: 'performance' | 'tax' | 'portfolio' | 'risk' | 'transaction';
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'ready' | 'generating' | 'failed';
  downloadUrl?: string;
  fileSize?: number;
  format: 'pdf' | 'excel' | 'csv';
}

export interface ReportFilter {
  type: ReportData['type'] | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  status: ReportData['status'] | 'all';
  format: ReportData['format'] | 'all';
}

export interface ReportGenerationOptions {
  type: ReportData['type'];
  dateRange: {
    start: string;
    end: string;
  };
  format: ReportData['format'];
  includeCharts: boolean;
  includeSummary: boolean;
  includeTransactions: boolean;
}

export interface ReportMetrics {
  totalReports: number;
  generatedToday: number;
  storageUsed: number;
  storageLimit: number;
  generationQuota: {
    used: number;
    limit: number;
    resetDate: string;
  };
}

export interface ReportState {
  loading: boolean;
  error: string | null;
  success: string | null;
  reports: ReportData[];
  filters: ReportFilter;
  metrics: ReportMetrics;
  selectedReport: ReportData | null;
  isGenerating: boolean;
}

export interface ReportProps {
  initialData?: {
    reports?: ReportData[];
    metrics?: ReportMetrics;
  };
} 