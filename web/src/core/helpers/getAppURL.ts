export default function getAppURL() {
  if (import.meta.env.VITE_APP_URL) {
    return import.meta.env.VITE_APP_URL;
  } else if (typeof document !== 'undefined') {
    return document.location.origin;
  } else {
    return '/';
  }
}
