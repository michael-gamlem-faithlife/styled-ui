import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '../../icons';
import styles from '../styles.less';
import uiStrings from '../ui-strings.json';

const ConfirmClaimDialog = ({
	searchedGroups,
	onGroupClaim,
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
				Are you sure you want to claim
				<span className={styles.searchResultBoldText}>{selectedGroup.name}</span>
				?
			</p>
			<div className={styles.modalButtonContainer}>
				<button className={styles.modalSecondaryButton} onClick={() => onModalViewChange()}>
					{uiStrings.cancel}
				</button>
				<button className={styles.modalPrimaryButton} onClick={() => onGroupClaim(selectedGroup)}>
					Claim group{selectedGroup.kind === 'church' ? ' and get started' : ''}
				</button>
			</div>
		</div>
	);
};

ConfirmClaimDialog.propTypes = {
	searchedGroups: PropTypes.array.isRequired,
	onGroupClaim: PropTypes.func.isRequired,
	onModalViewChange: PropTypes.func.isRequired,
	selectedGroupId: PropTypes.number.isRequired,
};

export default ConfirmClaimDialog;
