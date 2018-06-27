import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { fetch } from './util';
import { trackEvents } from './util/analytics';
import { getPremiumSpoid } from './util/globals';
import { createGroup, updateGroup, claimGroup } from './accounts-client.js';
import GroupDropdown from './dropdown.jsx';
import GroupInput from './input.jsx';
import GroupKindDialog from './modal/group-kind-dialog.jsx';
import RequestAdminDialog from './modal/request-admin-dialog.jsx';
import ConfirmClaimDialog from './modal/confirm-claim.jsx';
import ErrorMessageDialog from './modal/error-message.jsx';
import Modal from './modal/index.jsx';
import Search from './modal/search.jsx';
import Signin from './signin.jsx';
import './global-styles.less';
import styles from './styles.less';

export default class GroupSelector extends React.PureComponent {
	static propTypes = {
		modalContainerSelector: PropTypes.string.isRequired,
		groups: PropTypes.arrayOf(
			PropTypes.shape({
				avatarUrl: PropTypes.string,
				city: PropTypes.string,
				email: PropTypes.string,
				availableActions: PropTypes.shape({
					relationship: PropTypes.string,
					claim: PropTypes.bool,
					join: PropTypes.bool,
				}),
				groupId: PropTypes.number,
				kind: PropTypes.string,
				membershipKind: PropTypes.string,
				name: PropTypes.string,
				privacy: PropTypes.string,
				token: PropTypes.string,
			}),
		),
		userId: PropTypes.string,
		userEmail: PropTypes.string,
		handleSignInClick: PropTypes.func.isRequired,
	};

	static views = {
		signin: {
			component: Signin,
		},
		dropdown: {
			component: GroupDropdown,
		},
		input: {
			component: GroupInput,
		},
	};

	static modalViews = {
		search: {
			component: Search,
		},
		groupKindDialog: {
			component: GroupKindDialog,
		},
		requestAdminDialog: {
			component: RequestAdminDialog,
		},
		confirmClaimDialog: {
			component: ConfirmClaimDialog,
		},
		errorMessageDialog: {
			component: ErrorMessageDialog,
		},
	};

	constructor(props) {
		super(props);

		const adminChurchGroups = props.groups
			? props.groups.filter(group => group.kind === 'church' && group.membershipKind === 'admin')
			: [];

		let view = 'signin';
		if (props.userId && adminChurchGroups.length) {
			view = 'dropdown';
		} else if (props.userId) {
			view = 'input';
		}

		this.state = {
			userGroups: props.groups,
			searchedGroups: props.groups,
			showLoadingIndicator: false,
			adminChurchGroups,
			view,
			errorMessage: '',
		};
	}

	fetchSearchedGroups = debounce(search => {
		fetch
			.get({ url: `/groups/search?q=${encodeURIComponent(search)}&count=15` })
			.catch(() => {
				this.setState({
					errorMessage: (
						<span>
							We're sorry! There was an error searching for ` `
							<span className={styles.searchResultBoldText}>{search}</span>. Have you tried checking{' '}
							your internet connection?
						</span>
					),
					modalView: 'errorMessageDialog',
				});
			})
			.then(response => response.ok && response.json())
			.then(results => {
				if (results) {
					const { searchInputValue } = this.state;
					if (!searchInputValue) return;

					this.setState({
						searchedGroups: results,
						showLoadingIndicator: false,
					});
				} else {
					this.setState({
						errorMessage: (
							<span>
								We're sorry! There was an error searching for{' '}
								<span className={styles.searchResultBoldText}>{search}</span>.
							</span>
						),
						modalView: 'errorMessageDialog',
					});
				}
			});
	}, 200);

	handleDropdownSelection = groupId => {
		const selectedGroup = this.props.groups.find(group => group.groupId === groupId);
		this.setState({ selectedGroup });
	};

	handleGroupCreation = (name, rawLocation) => {
		createGroup({ name, rawLocation, kind: 'church' })
			.then(response => (response.ok ? response.json() : null))
			.then(groupResponse => {
				this.handleSiteCreation(groupResponse.groupId);
			});
	};

	handleGroupKindChange = selectedGroup => {
		updateGroup(selectedGroup.groupId, { kind: 'church' }).then(response => {
			const { userGroups, adminChurchGroups } = this.state;
			const index = userGroups.map(group => group.groupId).indexOf(selectedGroup.groupId);
			this.state.selectedGroup.kind.setState(response.kind);
			userGroups.splice(index, 1, selectedGroup);
			adminChurchGroups.push(selectedGroup);
			this.setState({ userGroups, adminChurchGroups, modalView: 'search' });
		});
	};

	handleAdminRequest = selectedGroup => {
		window.open(`https://faithlife.com/${selectedGroup.token}`);
	};

	handleModalClose = () => {
		this.setState({ modalView: null });
	};

	handleModalViewChange = (modalView = 'search', selectedGroupId = null) => {
		this.setState({ modalView, selectedGroupId });
	};

	handleSearchInputChange = searchInputValue => {
		this.setState({
			searchInputValue,
			showLoadingIndicator: true,
		});

		if (searchInputValue) {
			this.fetchSearchedGroups(searchInputValue);
		} else {
			const { userGroups } = this.state;
			this.setState({
				searchedGroups: userGroups,
				showLoadingIndicator: false,
			});
		}
	};

	handleGroupClaim = selectedGroup => {
		claimGroup(selectedGroup.groupId)
			.catch(() => {
				this.setState({
					errorMessage: (
						<span>
							We're sorry! There was an error claiming{' '}
							<span className={styles.searchResultBoldText}>{selectedGroup.name}</span>. Have you{' '}
							tried checking your internet connection?
						</span>
					),
					modalView: 'errorMessageDialog',
				});
			})
			.then(response => {
				if (response && response.ok) {
					trackEvents('faithlife group claimed', {
						groupId: selectedGroup.groupId,
						kind: selectedGroup.kind,
					});
					if (selectedGroup.kind === 'church') {
						this.handleSiteCreation(selectedGroup.groupId);
						return;
					}

					this.state.selectedGroup.availableActions.claim.setState(false);
					this.state.selectedGroup.membershipKind.setState('admin');

					const { userGroups } = this.state;
					userGroups.push(selectedGroup);

					this.setState({
						selectedGroupId: selectedGroup.groupId,
						modalView: 'groupKindDialog',
						userGroups,
					});
				} else {
					this.setState({
						errorMessage: (
							<span>
								We're sorry! There was an error claiming
								<span className={styles.searchResultBoldText}>{selectedGroup.name}</span>. Have you{' '}
								tried checking your internet connection?
							</span>
						),
						modalView: 'errorMessageDialog',
					});
				}
			});
	};

	handleSiteCreation = groupId => {
		const premiumSpoid = getPremiumSpoid();
		trackEvents('church site created', { groupId, premiumSpoid });
		window.location.href = `${window.location.origin}/onboard/${groupId}${
			premiumSpoid ? `?premiumSpoid=${premiumSpoid}` : ''
		}`;
	};

	render() {
		const {
			adminChurchGroups,
			modalView,
			searchInputValue,
			selectedGroupId,
			searchedGroups,
			showLoadingIndicator,
			errorMessage,
		} = this.state;

		const view = GroupSelector.views[this.state.view];
		const View = view.component;

		let ModalContent;
		if (modalView) {
			ModalContent = GroupSelector.modalViews[modalView].component;
		}

		return (
			<div className={styles.groupSelect}>
				<View
					{...this.props}
					adminChurchGroups={adminChurchGroups}
					inputValue={searchInputValue}
					onGroupKindChange={this.handleGroupKindChange}
					onInputChange={this.handleSearchInputChange}
					onModalViewChange={this.handleModalViewChange}
					onSiteCreation={this.handleSiteCreation}
					onClick={this.props.handleSignInClick}
				/>
				{modalView && (
					<Modal container={this.props.modalContainerSelector}>
						<ModalContent
							searchedGroups={searchedGroups}
							inputValue={searchInputValue}
							showLoadingIndicator={showLoadingIndicator}
							onGroupCreation={this.handleGroupCreation}
							onGroupKindChange={this.handleGroupKindChange}
							onRequestAdminPrivileges={this.handleAdminRequest}
							onInputChange={this.handleSearchInputChange}
							onSearchedGroupsChange={() => this.setState({ searchedGroups })}
							onModalViewChange={this.handleModalViewChange}
							onSiteCreation={this.handleSiteCreation}
							onGroupClaim={this.handleGroupClaim}
							selectedGroupId={selectedGroupId}
							errorMessage={errorMessage}
						/>
					</Modal>
				)}
			</div>
		);
	}
}
