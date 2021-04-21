import { APIPaths } from '@web/core/constants';

const httpClient = (apiURL: string) => () => async (
  request: RequestInfo,
  config: RequestInit = {}
) => {
  // config.credentials = 'include';

  const response = await fetch(apiURL + request, config);

  return response.json();
};

export default httpClient(import.meta.env.VITE_API_URL as string);
