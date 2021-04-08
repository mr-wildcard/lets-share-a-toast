export default function getAppURL() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  } else if (typeof document !== 'undefined') {
    return document.location.origin;
  } else {
    return '/';
  }
}
