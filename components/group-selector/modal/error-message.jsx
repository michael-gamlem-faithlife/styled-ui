import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '../../icons';
import styles from '../styles.less';
import uiStrings from '../ui-strings.json';

const ConfirmClaimDialog = ({ errorMessage, onModalViewChange }) => (
	<div className={styles.modal}>
		<button className={styles.searchClose} onClick={() => onModalViewChange()}>
			<Close />
		</button>
		<p className={styles.modalText}>{errorMessage}</p>
		<div className={styles.modalButtonContainer}>
			<button className={styles.modalPrimaryButton} onClick={() => onModalViewChange()}>
				{uiStrings.back}
			</button>
		</div>
	</div>
);

ConfirmClaimDialog.propTypes = {
	onModalViewChange: PropTypes.func.isRequired,
	errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default ConfirmClaimDialog;
