import axios from 'axios';

export const getDynamicBackendBaseUrl = (): string => {
  const envUrl = (import.meta as any)?.env?.VITE_API_BASE_URL || (import.meta as any)?.env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const getDirectBackendUrl = (): string => {
  return getDynamicBackendBaseUrl();
};

export const getPythonAiBackendUrl = (): string => {
  const envAi = (import.meta as any)?.env?.VITE_PYTHON_AI_URL;
  if (envAi && typeof envAi === 'string' && envAi.trim().length > 0) {
    return envAi.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:8000`;
  }
  return 'http://localhost:8000';
};

export const collectLiveUiUxContext = (overrideRole?: string) => {
  if (typeof window === 'undefined') {
    return { role: overrideRole || 'GUEST', path: '/', timestamp: new Date().toISOString() };
  }
  return {
    role: overrideRole || localStorage.getItem('labtrack_role') || 'USER',
    path: window.location.pathname,
    campus: localStorage.getItem('labtrack_selected_campus') || 'Main Campus (Dapitan)',
    timestamp: new Date().toISOString(),
  };
};

export const apiClient = axios.create({
  baseURL: getDynamicBackendBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        sessionStorage.getItem('labtrack_token') ||
        localStorage.getItem('labtrack_token') ||
        localStorage.getItem('jrmsu_labtrack_auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const unwrapApiData = <T = any>(res: any): T => {
  if (!res) return res;
  if (res.data !== undefined && res.data?.data !== undefined) return res.data.data as T;
  if (res.data !== undefined) return res.data as T;
  return res as T;
};

export const unwrapPaginatedItems = <T = any>(res: any): T[] => {
  const data = unwrapApiData<any>(res);
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.items)) return data.items as T[];
  if (Array.isArray(data?.results)) return data.results as T[];
  if (Array.isArray(data?.data)) return data.data as T[];
  return [];
};

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  campus?: string;
  status?: string;
  [key: string]: any;
}

export interface AiChatPayload {
  sessionId?: string;
  [key: string]: any;
  prompt?: string;
  message?: string;
  query?: string;
  role?: string;
  campus?: string;
  mode?: string;
  context?: any;
  history?: any[];
  image?: string | null;
}

export interface AiChatNormalizedResult {
  response?: string;
  message?: string;
  text?: string;
  [key: string]: any;
  reply: string;
  mode?: string;
  suggestions?: string[];
  mediaUrl?: string;
  raw?: any;
}

export const AuthApi = {
  login: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/auth/login', payload)),
  register: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/auth/register', payload)),
  me: async () => unwrapApiData(await apiClient.get('/api/v1/auth/me')),
  logout: async () => unwrapApiData(await apiClient.post('/api/v1/auth/logout')),
};

export const AiApi = {
  chat: async (payload: AiChatPayload): Promise<AiChatNormalizedResult> => {
    const textPrompt = payload.prompt || payload.message || payload.query || '';
    try {
      const res = await apiClient.post('/api/v1/ai/chat', {
        ...payload,
        prompt: textPrompt,
        message: textPrompt,
        uiContext: collectLiveUiUxContext(payload.role),
      });
      const data = unwrapApiData<any>(res);
      return {
        reply: data?.reply || data?.response || data?.message || data?.text || 'AI response received.',
        mode: data?.mode || payload.mode || 'text',
        suggestions: data?.suggestions || [],
        mediaUrl: data?.mediaUrl || data?.imageUrl,
        raw: data,
      };
    } catch {
      const pyRes = await axios.post(`${getPythonAiBackendUrl()}/api/ai/chat`, {
        ...payload,
        prompt: textPrompt,
        message: textPrompt,
      });
      const data = pyRes.data;
      return {
        reply: data?.reply || data?.response || data?.message || 'AI Assistant is ready.',
        mode: data?.mode || payload.mode || 'text',
        suggestions: data?.suggestions || [],
        raw: data,
      };
    }
  },
};

export const LaboratoriesApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/laboratories', { params })),
  getById: async (id: string) => unwrapApiData(await apiClient.get(`/api/v1/laboratories/${id}`)),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/laboratories', payload)),
  update: async (id: string, payload: any) => unwrapApiData(await apiClient.put(`/api/v1/laboratories/${id}`, payload)),
  remove: async (id: string) => unwrapApiData(await apiClient.delete(`/api/v1/laboratories/${id}`)),
};

export const WorkstationsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/workstations', { params })),
  getById: async (id: string) => unwrapApiData(await apiClient.get(`/api/v1/workstations/${id}`)),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/workstations', payload)),
  update: async (id: string, payload: any) => unwrapApiData(await apiClient.put(`/api/v1/workstations/${id}`, payload)),
  remove: async (id: string) => unwrapApiData(await apiClient.delete(`/api/v1/workstations/${id}`)),
};

export const AssetsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/assets', { params })),
  getById: async (id: string) => unwrapApiData(await apiClient.get(`/api/v1/assets/${id}`)),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/assets', payload)),
  update: async (id: string, payload: any) => unwrapApiData(await apiClient.put(`/api/v1/assets/${id}`, payload)),
  remove: async (id: string) => unwrapApiData(await apiClient.delete(`/api/v1/assets/${id}`)),
};

export const PcUsageApi = {
  getActiveSessions: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/sessions', { params })),
  startSession: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/sessions/start', payload)),
  endSession: async (id: string, payload?: any) => unwrapApiData(await apiClient.post(`/api/v1/sessions/${id}/end`, payload)),
};

export const ProblemReportsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/problem-reports', { params })),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/problem-reports', payload)),
  updateStatus: async (id: string, status: string) => unwrapApiData(await apiClient.patch(`/api/v1/problem-reports/${id}/status`, { status })),
};

export const RepairTicketsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/repair-tickets', { params })),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/repair-tickets', payload)),
  update: async (id: string, payload: any) => unwrapApiData(await apiClient.put(`/api/v1/repair-tickets/${id}`, payload)),
};

export const MaintenanceApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/maintenance', { params })),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/maintenance', payload)),
  update: async (id: string, payload: any) => unwrapApiData(await apiClient.put(`/api/v1/maintenance/${id}`, payload)),
};

export const ReservationsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/reservations', { params })),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/reservations', payload)),
  update: async (id: string, payload: any) => unwrapApiData(await apiClient.put(`/api/v1/reservations/${id}`, payload)),
  remove: async (id: string) => unwrapApiData(await apiClient.delete(`/api/v1/reservations/${id}`)),
};

export const NotificationsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/notifications', { params })),
  markAsRead: async (id: string) => unwrapApiData(await apiClient.patch(`/api/v1/notifications/${id}/read`)),
};

export const UsersApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/users', { params })),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/users', payload)),
  update: async (id: string, payload: any) => unwrapApiData(await apiClient.put(`/api/v1/users/${id}`, payload)),
  remove: async (id: string) => unwrapApiData(await apiClient.delete(`/api/v1/users/${id}`)),
};

export const AnalyticsApi = {
  getSummary: async (params?: any) => unwrapApiData(await apiClient.get('/api/v1/analytics/summary', { params })),
};

export const FinancialsApi = {
  getSummary: async () => unwrapApiData(await apiClient.get('/api/v1/financials/summary')),
  getTransactions: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/financials/transactions', { params })),
  getTransactionById: async (id: string) => unwrapApiData(await apiClient.get(`/api/v1/financials/transactions/${id}`)),
  createTransaction: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/financials/transactions', payload)),
};

export const AuditLogsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/audit-logs', { params })),
};

export const NetworkApi = {
  getStatus: async () => unwrapApiData(await apiClient.get('/api/v1/network/status')),
};

export const QrApi = {
  verifyToken: async (token: string) => unwrapApiData(await apiClient.post('/api/v1/qr/verify', { token })),
  generateToken: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/qr/generate', payload)),
};

export const ReplacementsApi = {
  getAll: async (params?: PaginationQuery) => unwrapPaginatedItems(await apiClient.get('/api/v1/replacements', { params })),
  create: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/replacements', payload)),
};

export const CommunicationsApi = {
  sendBroadcast: async (payload: any) => unwrapApiData(await apiClient.post('/api/v1/communications/broadcast', payload)),
};

export const LabTrackApi = {
  auth: AuthApi,
  ai: AiApi,
  laboratories: LaboratoriesApi,
  workstations: WorkstationsApi,
  assets: AssetsApi,
  pcUsage: PcUsageApi,
  problemReports: ProblemReportsApi,
  repairTickets: RepairTicketsApi,
  maintenance: MaintenanceApi,
  reservations: ReservationsApi,
  notifications: NotificationsApi,
  users: UsersApi,
  analytics: AnalyticsApi,
  financials: FinancialsApi,
  auditLogs: AuditLogsApi,
  network: NetworkApi,
  qr: QrApi,
  replacements: ReplacementsApi,
  communications: CommunicationsApi,
};

export default apiClient;