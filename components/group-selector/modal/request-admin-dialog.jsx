import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '../../icons';
import styles from '../styles.m.less';
import uiStrings from '../ui-strings.json';

const RequestAdminDialog = ({
	searchedGroups,
	onRequestAdminPrivileges,
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
				<span className={styles.searchResultBoldText}>Admin</span> membership for{' '}
				{selectedGroup.name} is necessary to edit the group's Faithlife Site.
			</p>
			<p className={styles.modalText}>{uiStrings.contactAdmin}</p>
			<div className={styles.modalButtonContainer}>
				<button className={styles.modalSecondaryButton} onClick={() => onModalViewChange()}>
					{uiStrings.cancel}
				</button>
				<button
					className={styles.modalPrimaryButton}
					onClick={() => onRequestAdminPrivileges(selectedGroup)}
				>
					{uiStrings.goToGroup}
				</button>
			</div>
		</div>
	);
};

RequestAdminDialog.propTypes = {
	searchedGroups: PropTypes.array.isRequired,
	onRequestAdminPrivileges: PropTypes.func.isRequired,
	onModalViewChange: PropTypes.func.isRequired,
	selectedGroupId: PropTypes.number.isRequired,
};

export default RequestAdminDialog;
