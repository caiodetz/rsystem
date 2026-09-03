/**
 * Utilitário universal para sincronização e manipulação de parâmetros de URL (Search Params)
 * Seguro para SSR e integrado com window.history do navegador sem recarregar a aplicação.
 */

export function getUrlParam(key: string, defaultValue = ''): string {
  if (typeof window === 'undefined') return defaultValue;
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? defaultValue;
}

export function getAllUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function updateUrlParams(updates: Record<string, string | number | boolean | null | undefined>): void {
  if (typeof window === 'undefined') return;

  const currentUrl = new URL(window.location.href);
  const params = currentUrl.searchParams;

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  const queryStr = params.toString();
  const newUrl = queryStr ? `${currentUrl.pathname}?${queryStr}` : currentUrl.pathname;

  if (`${window.location.pathname}${window.location.search}` !== newUrl) {
    window.history.replaceState(window.history.state, '', newUrl);
  }
}

export function clearUrlParams(...keys: string[]): void {
  if (typeof window === 'undefined') return;

  const currentUrl = new URL(window.location.href);
  const params = currentUrl.searchParams;

  keys.forEach((k) => params.delete(k));

  const queryStr = params.toString();
  const newUrl = queryStr ? `${currentUrl.pathname}?${queryStr}` : currentUrl.pathname;

  if (`${window.location.pathname}${window.location.search}` !== newUrl) {
    window.history.replaceState(window.history.state, '', newUrl);
  }
}
