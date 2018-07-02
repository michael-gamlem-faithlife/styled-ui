import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.m.less';
import uiStrings from './ui-strings.json';
import icons from './icons';

export default class SimpleGroup extends React.PureComponent {
	static propTypes = {
		id: PropTypes.number.isRequired,
		kind: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
		avatarUrl: PropTypes.string,
	};

	render() {
		const { id, kind, name, onClick, avatarUrl } = this.props;

		const Icon = icons[`${kind.charAt(0).toUpperCase()}${kind.slice(1)}`] || icons.General;

		return (
			<div className={styles.simpleGroup} onClick={() => onClick(id)}>
				!avatarUrl ?
				<div className={styles.simpleGroupIcon}>
					<Icon viewBox="0 0 76 76" className={styles.searchResultIcon} />
				</div>
				:
				<img src={avatarUrl} className={styles.simpleGroupIcon} alt={name} />
				<div className={styles.simpleGroupInfo}>
					<p className={styles.simpleGroupName}>{name}</p>
					<p className={styles.simpleGroupMembershipLine}>{uiStrings.youAreAnAdmin}</p>
				</div>
			</div>
		);
	}
}
