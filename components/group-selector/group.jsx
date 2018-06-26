import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.less';
import uiStrings from './ui-strings.json';
import icons from './icons';

export default class Group extends React.PureComponent {
	static propTypes = {
		id: PropTypes.number.isRequired,
		kind: PropTypes.string.isRequired,
		location: PropTypes.string,
		name: PropTypes.string.isRequired,
		userMembership: PropTypes.string.isRequired,
		onModalViewChange: PropTypes.func.isRequired,
		onSiteCreation: PropTypes.func.isRequired,
		avatarUrl: PropTypes.string,
		claimable: PropTypes.bool,
	};

	handleButtonClick = () => {
		const { id, kind, onModalViewChange, onSiteCreation, userMembership, claimable } = this.props;

		if (claimable) {
			onModalViewChange('confirmClaimDialog', id);
		} else if (userMembership !== 'admin') {
			onModalViewChange('requestAdminDialog', id);
		} else if (kind !== 'church') {
			onModalViewChange('groupKindDialog', id);
		} else {
			onSiteCreation(id);
		}
	};

	render() {
		const { location, name, userMembership, avatarUrl, claimable } = this.props;
		let { kind } = this.props;

		let message = <p className={styles.searchResultMessage} />;
		let membershipLine = <p className={styles.searchResultMembershipLine} />;
		let buttonText = uiStrings.getStarted;

		if (claimable) {
			message = <p className={styles.searchResultMessage}>This is an empty group</p>;
			buttonText = uiStrings.claimGroup;
		} else if (userMembership === 'none') {
			message = (
				<p className={styles.searchResultMessage}>
					<span className={styles.searchResultHighlightText}>Admin</span> membership required
				</p>
			);
			membershipLine = (
				<p className={styles.searchResultMembershipLine}>
					You are <span className={styles.searchResultBoldText}>not</span> a member
				</p>
			);
			buttonText = uiStrings.joinGroup;
		} else if (userMembership !== 'admin') {
			message = (
				<p className={styles.searchResultMessage}>
					<span className={styles.searchResultHighlightText}>Admin</span> membership required
				</p>
			);
			membershipLine = (
				<p className={styles.searchResultMembershipLine}>
					You are a <span className={styles.searchResultBoldText}>Member</span>
				</p>
			);
			buttonText = uiStrings.request;
		} else if (kind !== 'church') {
			message = (
				<p className={styles.searchResultMessage}>
					Group must be a <span className={styles.searchResultHighlightText}>Church</span>
				</p>
			);
			membershipLine = (
				<p className={styles.searchResultMembershipLine}>
					You are an <span className={styles.searchResultBoldText}>Admin</span>
				</p>
			);
			buttonText = uiStrings.edit;
		}

		kind = `${kind.charAt(0).toUpperCase()}${kind.slice(1)}`;
		const Icon = icons[kind] || icons.General;

		return (
			<div className={styles.searchResult}>
				{avatarUrl && userMembership !== 'none' ? (
					<img src={avatarUrl} className={styles.searchResultIcon} alt={name} />
				) : (
					<div className={styles.searchResultIcon}>
						<Icon viewBox="0 0 76 76" className={styles.searchResultIcon} />
					</div>
				)}
				<div className={styles.searchResultInfo}>
					<p className={styles.searchResultName}>{name}</p>
					<p>
						<span className={styles.searchResultGroupKind}>{kind}</span>
						{location && <span className={styles.searchResultLocation}> &bull; {location}</span>}
					</p>
					<div className={styles.searchResultAction}>
						{membershipLine}
						{message}
						<button className={styles.searchResultButton} onClick={this.handleButtonClick}>
							{buttonText}
						</button>
					</div>
				</div>
			</div>
		);
	}
}
