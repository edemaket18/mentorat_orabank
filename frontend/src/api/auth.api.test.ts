import { API } from './auth.api';

describe('auth interceptor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds the bearer token to requests made through the API instance', () => {
    localStorage.setItem('authToken', 'test-token');

    const interceptor = (API.interceptors.request as any).handlers.find(
      (handler: any) => typeof handler.fulfilled === 'function'
    );

    const config = { headers: {} } as any;
    const result = interceptor?.fulfilled?.(config);

    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('does not add an Authorization header when no token is stored', () => {
    const interceptor = (API.interceptors.request as any).handlers.find(
      (handler: any) => typeof handler.fulfilled === 'function'
    );

    const config = { headers: {} } as any;
    const result = interceptor?.fulfilled?.(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});