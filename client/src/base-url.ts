// These will be used via fetch(baseUrl + '/api/...')
//
// So:
// - These URLs should not have a trailing slash
// - Leaving a URL blank turns these requests into root-relative URLs

// todo Delete this file now it's not needed
const localBaseUrl = "";
const prodBaseUrl = "";
export const baseUrl = import.meta.env.DEV ? localBaseUrl : prodBaseUrl;
