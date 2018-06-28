import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.less';
import uiStrings from './ui-strings.json';

const Signin = ({ onClick }) => (
	<div>
		<span className={styles.groupSelectCtaText}>{uiStrings.signInCta}</span>
		<button className={styles.groupSelectBtn} onClick={onClick}>
			{uiStrings.signIn}
		</button>
	</div>
);

Signin.propTypes = {
	onClick: PropTypes.func.isRequired,
};

export default Signin;
