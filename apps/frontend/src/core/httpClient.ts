import { NextPageContext } from 'next';

import { APIPaths } from 'frontend/core/constants';

const httpClient = (apiURL: string) => (
  nextContext?: NextPageContext
) => async (request: RequestInfo, config: RequestInit = {}) => {
  // config.credentials = 'include';

  const response = await fetch(apiURL + request, config);

  if (response.status === 401) {
    const authRedirectURL = apiURL + APIPaths.OAUTH;

    if (typeof document !== 'undefined') {
      return document.location.replace(authRedirectURL);
    } else if (nextContext?.res) {
      nextContext.res.writeHead(302, {
        Location: authRedirectURL,
      });

      nextContext.res.end();
    }
  } else if (response.headers.get('Content-Type') === 'application/json') {
    return response.json();
  } else {
    return response;
  }
};

export default httpClient(process.env.API_URL);
