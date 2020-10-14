/* Extract query param from url.
 * location object comes from react-router.
 */
export function getQueryParam(location, baseUrl, queryKey) {
  if(location && location.pathname === baseUrl) {
      const query = new URLSearchParams(location.search);
      return query.get(queryKey);
  }
  return null;
}

/* Get the current epoch time */
export function getEpochNow(){
  let d = new Date();
  return (d.getTime()-d.getMilliseconds())/1000;
}
