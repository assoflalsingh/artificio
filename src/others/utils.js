export function getQueryParam(location, baseUrl, queryKey) {
  if(location && location.pathname === baseUrl) {
      const query = new URLSearchParams(location.search);
      return query.get(queryKey);
  }
  return null;
}