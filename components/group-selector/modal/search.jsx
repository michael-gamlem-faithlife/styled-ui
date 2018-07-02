import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../../text-input/text-input.jsx';
import Group from '../group.jsx';
import { Close } from '../../icons';
import styles from '../styles.m.less';
import uiStrings from '../ui-strings.json';

export default class Search extends React.PureComponent {
	static propTypes = {
		onGroupCreation: PropTypes.func.isRequired,
		onInputChange: PropTypes.func.isRequired,
		onModalViewChange: PropTypes.func.isRequired,
		onGroupClaim: PropTypes.func.isRequired,
		onSiteCreation: PropTypes.func.isRequired,
		searchedGroups: PropTypes.arrayOf(
			PropTypes.shape({
				availableActions: PropTypes.shape({}),
			}),
		),
		showLoadingIndicator: PropTypes.bool.isRequired,
		inputValue: PropTypes.string,
	};

	state = {
		isCreateGroupFocused: false,
		newGroupName: '',
		newGroupLocation: '',
	};

	getGroupComponents = groupList => {
		const { onModalViewChange, onSiteCreation } = this.props;

		const groups = groupList.map(group => (
			<Group
				key={group.groupId}
				id={group.groupId}
				location={group.city}
				name={group.name}
				kind={group.kind}
				userMembership={group.membershipKind || 'none'}
				onModalViewChange={onModalViewChange}
				onSiteCreation={onSiteCreation}
				avatarUrl={group.avatarUrl}
				claimable={group.availableActions.claim}
			/>
		));

		if (groups.length === 0) {
			groups.push(
				<p key="noresults" className={styles.searchNoResults}>
					No results.
				</p>,
			);
		}

		return groups;
	};

	handleGroupClaim = groupId => {
		const { searchedGroups, onGroupClaim } = this.props;
		const selectedGroup = searchedGroups.find(group => group.groupId === groupId);
		if (selectedGroup) onGroupClaim(selectedGroup);
	};

	handleGroupCreation = e => {
		e.stopPropagation();
		const { newGroupName, newGroupLocation } = this.state;
		if (newGroupName && newGroupLocation) {
			this.setState({ newGroupName: '', newGroupLocation: '', isCreateGroupFocused: false });
			this.props.onGroupCreation(newGroupName, newGroupLocation);
		}
	};

	handleCreateGroupBlur = () => {
		this.setState({ isCreateGroupFocused: false });
	};

	handleCreateGroupFocus = e => {
		e.stopPropagation();
		this.setState({ isCreateGroupFocused: true });
	};

	handleModalClose = () => {
		this.props.onModalViewChange(null);
	};

	handleNewGroupLocationChange = newGroupLocation => {
		this.setState({ newGroupLocation });
	};

	handleNewGroupNameChange = newGroupName => {
		this.setState({ newGroupName });
	};

	handleCreateChurchNameFocus = () => {
		if (this.state.newGroupName) return;
		this.setState({ newGroupName: this.props.inputValue });
	};

	render() {
		const { inputValue, searchedGroups, onInputChange, showLoadingIndicator } = this.props;
		const { newGroupName, newGroupLocation, isCreateGroupFocused } = this.state;

		return (
			<div className={styles.search} onClick={this.handleCreateGroupBlur}>
				<div>
					<button className={styles.searchClose} onClick={this.handleModalClose}>
						<Close />
					</button>
					<p className={styles.searchTitle}>{uiStrings.searchTitle}</p>
					<p className={styles.searchSubtitle}>{uiStrings.searchSubtitle}</p>
					<TextInput
						autoFocus
						className={styles.searchInputLabel}
						inputValue={inputValue}
						inputClass="search__input"
						placeholder={uiStrings.searchPlaceholder}
						onChange={onInputChange}
					/>
				</div>
				<div className={styles.searchResultsContainer}>
					{showLoadingIndicator} ?
					<div className="loader" />
					: {this.getGroupComponents(searchedGroups)}
				</div>
				<div
					className={isCreateGroupFocused ? styles.createGroupActive : styles.createGroup}
					onClick={this.handleCreateGroupFocus}
				>
					<p className={styles.createGroupTitle}>{uiStrings.addYourChurch}</p>
					<TextInput
						onFocus={this.handleCreateChurchNameFocus}
						title={isCreateGroupFocused ? uiStrings.churchName : null}
						inputValue={newGroupName}
						inputClass="create-group-input"
						placeholder={inputValue ? `e.g. ${inputValue}` : uiStrings.churchNamePlaceholder}
						onChange={this.handleNewGroupNameChange}
					/>
					<TextInput
						title={uiStrings.churchLocation}
						inputValue={newGroupLocation}
						inputClass="create-group-input"
						placeholder={uiStrings.churchLocationPlaceholder}
						onChange={this.handleNewGroupLocationChange}
					/>
					<button
						className={styles.createGroupButton}
						disabled={!newGroupName || !newGroupLocation}
						onClick={this.handleGroupCreation}
					>
						{uiStrings.done}
					</button>
				</div>
			</div>
		);
	}
}
