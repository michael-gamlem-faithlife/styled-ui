import { fetch } from './util';
import { assertIsNumberOrString } from './sites-client.js';

// createGroup({ name: 'Created via Sites.Admin client', kind: 'church', rawLocation: 'Laguna Niguel, CA' });
export async function createGroup(group) {
	if (typeof group !== 'object') {
		throw new Error('group argument must be an object');
	}

	return await fetch.postWithBody({ url: '/proxy/accounts/groups', body: group });
}

// updateGroup(9439166, { kind: 'school' });
export async function updateGroup(groupId, updates) {
	if (!groupId) {
		throw new Error('groupId argument cannot be falsy');
	}

	if (typeof updates !== 'object') {
		throw new Error('group argument must be an object');
	}

	const getResponse = await fetch.get({ url: `/proxy/accounts/groups/${groupId}`, body: group });
	let group = getResponse.status === 200 ? await getResponse.json() : null;
	if (!group) {
		return null;
	}

	const update = {
		...group,
		...updates,
	};

	const updateResponse = await fetch.putWithBody({
		url: `/proxy/accounts/groups/${groupId}`,
		body: update,
	});

	group = updateResponse.status === 200 ? await updateResponse.json() : null;
	return group;
}

export async function claimGroup(groupId) {
	assertIsNumberOrString(groupId);

	const response = await fetch.get({ url: `/groups/claim/${groupId}` });

	return response;
}
