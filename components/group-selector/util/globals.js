import { getQueryStringParameter } from './url';

// TODO: Inject query string parameters into components via props https://faithlife.atlassian.net/browse/CW-591
export function getPremiumSpoid() {
	return getQueryStringParameter('premiumSpoid');
}
