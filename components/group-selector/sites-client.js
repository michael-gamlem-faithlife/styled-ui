import { fetch } from './util';

export async function updateSitePreview(siteId, siteChangeSet) {
	assertIsNumberOrString(siteId);

	return await fetch.postWithBody({ url: `/sites/${siteId}/preview`, body: siteChangeSet });
}

export async function updateGroup(siteId, group) {
	assertIsNumberOrString(siteId);

	return await fetch.postWithBody({ url: `/sites/${siteId}/group`, body: group });
}

export async function publishSite(siteId) {
	assertIsNumberOrString(siteId);

	const response = await fetch.post({ url: `/sites/${siteId}/publish` });
	if (!response.ok) {
		throw new Error(`Unexpected response code ${response.status}.`);
	}

	return await response.json();
}

export async function requestDomain(siteId, domain) {
	assertIsNumberOrString(siteId);

	const response = await fetch.post({ url: `/sites/${siteId}/domainrequest?domain=${domain}` });

	if (!response.ok) {
		throw new Error(`Unexpected response code ${response.status}.`);
	}
}

export async function getDomainAvailability(domain) {
	const response = await fetch.get({ url: `/domains/${domain}` });

	if (!response.ok) {
		throw new Error(`Unexpected response code ${response.status}.`);
	}

	return response.json();
}

export async function getSectionsForPage(siteId, pageId) {
	assertIsNumberOrString(siteId);
	assertIsNumberOrString(pageId);

	const response = await fetch.get({ url: `/sites/${siteId}/pages/${pageId}/sections` });

	if (!response.ok) {
		throw new Error(`Unexpected response code ${response.status}.`);
	}

	return response.json();
}

export async function updatePage(siteId, pageId, page) {
	assertIsNumberOrString(siteId);
	assertIsNumberOrString(pageId);

	const response = await fetch.postWithBody({
		url: `/sites/${siteId}/pages/${pageId}`,
		body: page,
	});
	if (!response.ok) {
		throw new Error(`Unexpected response code ${response.status}.`);
	}

	return response.status === 200 ? await response.json() : null;
}

export async function updateSection(
	siteId,
	pageId,
	sectionName,
	fragmentToken,
	pageSectionChangeSet,
	sectionId,
) {
	assertIsNumberOrString(siteId);
	assertIsNumberOrString(pageId);

	const response = sectionId
		? await fetch.postWithBody({
				url: `/sites/${siteId}/section/${sectionId}`,
				body: { ...pageSectionChangeSet, sectionId },
		  })
		: await fetch.postWithBody({
				url: `/sites/${siteId}/pages/${pageId}/section/${sectionName}/fragmentToken/${fragmentToken}`,
				body: pageSectionChangeSet,
		  });

	if (!response.ok) {
		throw new Error(`Unexpected response code ${response.status}.`);
	}

	return await response.json();
}

export async function deleteSection(siteId, pageId, sectionName, sectionId) {
	assertIsNumberOrString(siteId);
	assertIsNumberOrString(pageId);
	assertIsNumberOrString(sectionName);

	const response = sectionId
		? await fetch.delete({ url: `/sites/${siteId}/section/${sectionId}` })
		: await fetch.delete({ url: `/sites/${siteId}/pages/${pageId}/section/${sectionName}` });

	if (!response.ok) {
		throw new Error(`Unexpected response code ${response.status}.`);
	}

	return response.status === 200 ? await response.json() : null;
}

export function assertIsNumberOrString(id) {
	if (typeof id !== 'number' && typeof id !== 'string') {
		throw new Error('id must be a string or number');
	}
}
