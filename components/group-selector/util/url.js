export function rejectUnsuccessfulResponse(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	const error = new Error(response.statusText);
	error.response = response;

	throw error;
}

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
export function getQueryStringParameter(name, url) {
	const regex = new RegExp(`[?&]${name.replace(/[[]]/g, '\\$&')}(=([^&#]*)|&|#|$)`);
	const results = regex.exec(url || window.location.href);
	if (!results) {
		return null;
	}

	if (!results[2]) {
		return null;
	}

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
