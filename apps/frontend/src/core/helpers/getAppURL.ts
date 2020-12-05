export default function getAppURL() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  } else if (typeof document !== 'undefined') {
    return document.location.origin;
  } else {
    return '/';
  }
}
