export function getSubDomain() {
  const subdomain = window.location.hostname.split('.').slice(0, -2).join('.');
  return subdomain? subdomain+'.':''
}
