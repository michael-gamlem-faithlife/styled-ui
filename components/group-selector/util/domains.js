// Mostly a clone of validation from https://git/Logos/SitesApi/blob/aa9ba9316b930f9f0a19adcee206158f6d401f90/src/Faithlife.Sites/Sites/Domain.cs

// Validates the syntax of a domain but does not verify its availability
export function isValidDomain(domain) {
	if (typeof domain !== 'string' || !domain.length) {
		return false;
	}

	// Full domain length is limited to 255 characters https://tools.ietf.org/html/rfc2181#page-13
	if (domain.length > 255) {
		return false;
	}

	// Naively assume that a two (or more) part domain has a valid TLD
	const parts = domain.split('.');
	if (parts.length < 2) {
		return false;
	}

	if (!parts.every(part => isValidLabel(part))) {
		return false;
	}

	return true;
}

// Validates the syntax of a label but does not verify its availability
function isValidLabel(label) {
	if (typeof label !== 'string') {
		return false;
	}

	// Labels must be between 1 and 63 chars https://tools.ietf.org/html/rfc2181#section-11
	if (label.length < 1 || label.length > 63) {
		return false;
	}

	// Labels may only contain alphanumeric characters and hyphen https://tools.ietf.org/html/rfc1035#section-2.3.1
	const labelRegex = /^[a-z0-9-]+$/;
	if (!labelRegex.test(label.toLowerCase())) {
		return false;
	}

	// Labels must start and end with a letter or digit https://tools.ietf.org/html/rfc1035#section-2.3.1
	if (label.startsWith('-') || label.endsWith('-')) {
		return false;
	}

	return true;
}
