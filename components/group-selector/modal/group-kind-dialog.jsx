import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '../../icons';
import styles from '../styles.less';
import uiStrings from '../ui-strings.json';

const GroupKindDialog = ({
	searchedGroups,
	onGroupKindChange,
	onModalViewChange,
	selectedGroupId,
}) => {
	const selectedGroup = searchedGroups.find(group => group.groupId === selectedGroupId);

	return (
		<div className={styles.modal}>
			<button className={styles.searchClose} onClick={() => onModalViewChange()}>
				<Close />
			</button>
			<p className={styles.modalText}>
				The group type for <span className={styles.searchResultBoldText}>{selectedGroup.name}</span>{' '}
				must be set to &ldquo;Church.&rdquo;
			</p>
			<p className={styles.modalText}>Visit the group settings page to change</p>
			<div className={styles.modalButtonContainer}>
				<button className={styles.modalSecondaryButton} onClick={() => onModalViewChange()}>
					{uiStrings.cancel}
				</button>
				<button
					className={styles.modalPrimaryButton}
					onClick={() => onGroupKindChange(selectedGroup)}
				>
					{uiStrings.setGroupToChurch}
				</button>
			</div>
		</div>
	);
};

GroupKindDialog.propTypes = {
	searchedGroups: PropTypes.array.isRequired,
	onGroupKindChange: PropTypes.func.isRequired,
	onModalViewChange: PropTypes.func.isRequired,
	selectedGroupId: PropTypes.number.isRequired,
};

export default GroupKindDialog;
