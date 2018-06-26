import React from 'react';
import styles from './styles.less';
import uiStrings from './ui-strings.json';

const Signin = () => (
	<div>
		<span className={styles.groupSelectCtaText}>{uiStrings.signInCta}</span>
		<button
			className={styles.groupSelectBtn}
			onClick={() => {
				window.location.href = '/signin';
			}}
		>
			{uiStrings.signIn}
		</button>
	</div>
);

export default Signin;
