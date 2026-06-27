import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';

export type { AxiosError };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const createApiManager = () => {
  let instance: AxiosInstance | null = null;

  return {
    initializeApi: (baseURL: string) => {
      if (instance) {
        return;
      }

      instance = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          const status = error.response?.status ?? 0;
          const body = error.response?.data;

          return Promise.reject(new ApiError(error.message || `Request failed with status ${status}`, status, body));
        }
      );
    },
    get apiInstance(): AxiosInstance {
      if (!instance) {
        throw new Error('API instance not initialized. Call initializeApi first.');
      }

      return instance;
    }
  };
};

export const apiManager = createApiManager();
