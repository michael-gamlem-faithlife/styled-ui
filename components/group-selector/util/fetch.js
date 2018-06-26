import { rejectUnsuccessfulResponse } from './url';

const defaults = {
	credentials: 'same-origin',
	headers: {
		Accept: 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		'X-Profile': 'true',
	},
};

const getParamsString = object => {
	if (object == null) {
		return '';
	}

	let encodedString = '?';
	Object.keys(object).forEach(prop => {
		if (Object.prototype.hasOwnProperty.call(object, prop) && typeof object[prop] === 'object') {
			if (encodedString.length !== 0) {
				encodedString += '&';
			}
			encodedString += `${encodeURIComponent(prop)}=${encodeURIComponent(object[prop])}`;
		}
	});

	return encodedString;
};

const sendToMiniProfiler = response => {
	if (window.MiniProfiler && window.performance.timing.loadEventEnd !== 0) {
		const stringIds = response.headers.get('X-MiniProfiler-Ids');
		if (stringIds) {
			const ids = JSON.parse(stringIds);
			window.MiniProfiler.fetchResults(ids);
		}
	}

	return response;
};

export const fetch = {
	get: ({ url, params }) =>
		window
			.fetch(url + getParamsString(params), {
				...defaults,
				method: 'GET',
			})
			.then(rejectUnsuccessfulResponse)
			.then(sendToMiniProfiler),
	post: ({ url, params }) =>
		window
			.fetch(url + getParamsString(params), {
				...defaults,
				method: 'POST',
			})
			.then(rejectUnsuccessfulResponse)
			.then(sendToMiniProfiler),
	postWithBody: ({ url, body }) =>
		window
			.fetch(url, {
				...defaults,
				method: 'POST',
				body: JSON.stringify(body),
			})
			.then(rejectUnsuccessfulResponse)
			.then(sendToMiniProfiler),
	putWithBody: ({ url, body }) =>
		window
			.fetch(url, {
				...defaults,
				method: 'PUT',
				body: JSON.stringify(body),
			})
			.then(rejectUnsuccessfulResponse)
			.then(sendToMiniProfiler),
	postWithForm: ({ url, formData }) =>
		window
			.fetch(url, {
				credentials: 'same-origin',
				method: 'POST',
				body: formData,
			})
			.then(rejectUnsuccessfulResponse)
			.then(sendToMiniProfiler),
	delete: ({ url, params }) =>
		window
			.fetch(url + getParamsString(params), {
				...defaults,
				method: 'DELETE',
			})
			.then(rejectUnsuccessfulResponse)
			.then(sendToMiniProfiler),
};

export default fetch;
