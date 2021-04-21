interface SupportedVisiblityAPI {
  documentHiddenProperty: string;
  visibilityChangeEventName: string;
}

export default function getSupportedVisibilityAPI(): SupportedVisiblityAPI {
  if ('hidden' in document) {
    return {
      documentHiddenProperty: 'hidden',
      visibilityChangeEventName: 'visibilitychange',
    };
  }

  if ('msHidden' in document) {
    return {
      documentHiddenProperty: 'msHidden',
      visibilityChangeEventName: 'msvisibilitychange',
    };
  }

  return {
    documentHiddenProperty: 'webkitHidden',
    visibilityChangeEventName: 'webkitvisibilitychange',
  };
}
