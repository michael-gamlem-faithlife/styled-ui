import React from 'react';
import PropTypes from 'prop-types';
import SimpleGroup from './simple-group.jsx';
import styles from './styles.m.less';
import icons from './icons';

export default class GroupDropdown extends React.PureComponent {
	static propTypes = {
		adminChurchGroups: PropTypes.arrayOf(
			PropTypes.shape({
				groupAvailableActions: PropTypes.shape({}),
			}),
		).isRequired,
		onModalViewChange: PropTypes.func.isRequired,
		onSiteCreation: PropTypes.func.isRequired,
	};

	state = {
		isDropdownOpen: false,
		selectedGroup: this.props.adminChurchGroups[0],
	};

	handleCreateSiteButtonClick = () => {
		const { selectedGroup } = this.state;
		this.props.onSiteCreation(selectedGroup.groupId);
	};

	handleDropdownToggle = () => {
		this.setState(({ isDropdownOpen }) => ({ isDropdownOpen: !isDropdownOpen }));
	};

	handleSearchButtonClick = () => {
		this.props.onModalViewChange();
		this.setState({ isDropdownOpen: false });
	};

	handleGroupSelection = groupId => {
		const selectedGroup = this.props.adminChurchGroups.find(group => group.groupId === groupId);
		this.setState({ selectedGroup, isDropdownOpen: false });
	};

	render() {
		const { adminChurchGroups } = this.props;
		const { isDropdownOpen, selectedGroup } = this.state;

		const groups = adminChurchGroups.map(group => (
			<SimpleGroup
				key={group.groupId}
				id={group.groupId}
				kind={group.kind}
				location={group.city}
				name={group.name}
				onClick={this.handleGroupSelection}
				userMembership={group.membershipKind}
				avatarUrl={group.avatarUrl}
			/>
		));

		const Icon =
			icons[`${selectedGroup.kind.charAt(0).toUpperCase()}${selectedGroup.kind.slice(1)}`] ||
			icons.General;

		return (
			<div>
				<div className={styles.groupSelectInputContainer}>
					<div className={styles.select}>
						<div className={styles.selectedGroup} onClick={this.handleDropdownToggle}>
							selectedGroup.avatarUrl ?
							<img src={selectedGroup.avatarUrl} className={styles.selectedGroupImage} alt={name} />
							:
							<div className={styles.selectedGroupImage}>
								<Icon viewBox="0 0 76 76" className={styles.searchResultIcon} />
							</div>
							<span className={styles.selectedGroupText}>{selectedGroup.name}</span>
						</div>
						{isDropdownOpen && (
							<div className={styles.dropdownContainer}>
								{groups}
								<div className={styles.dropdownButtonContainer}>
									<button className={styles.dropdownButton} onClick={this.handleSearchButtonClick}>
										uiStrings.findOrAddChurch
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
				<button className={styles.groupSelectBtn} onClick={this.handleCreateSiteButtonClick}>
					uiStrings.getStarted
				</button>
			</div>
		);
	}
}
