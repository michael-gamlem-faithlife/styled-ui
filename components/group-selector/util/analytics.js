export const initializeTracking = (userId, domain, groupId) => {
	if (window.amplitude == null) {
		return;
	}

	const amplitude = window.amplitude.getInstance();
	if (amplitude) {
		amplitude.setUserId(userId);
		amplitude.setDomain(domain);
		amplitude.setGroup('groupId', groupId);
	}
};

export const trackEvents = (name, values) => {
	if (window.amplitude == null) {
		return;
	}

	const amplitude = window.amplitude.getInstance();
	if (amplitude) {
		amplitude.logEvent(name, values);
	}
};

export const logModalTracking = trackingInfo => {
	if (trackingInfo) {
		trackEvents(`widget edited: ${trackingInfo.widget}`, {
			'widget name': trackingInfo.widget,
			page: trackingInfo.page,
			section: trackingInfo.sectionName,
			properties: trackingInfo.properties,
		});
	}
};

export default trackEvents;
