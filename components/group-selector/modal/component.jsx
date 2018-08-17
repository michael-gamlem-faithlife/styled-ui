import React from 'react';
import PropTypes from 'prop-types';
import { Bootstrap } from '../../../components/main.js';
import * as Styled from '../styled.jsx';
import { Avatar } from '../avatar.jsx';
import { SearchResult } from './search-result.jsx';
import { CreateGroup } from './create-group.jsx';

const { Modal, Button } = Bootstrap;

export class GroupSelectorModal extends React.Component {
	static propTypes = {
		changeModalState: PropTypes.func.isRequired,
		isOpen: PropTypes.bool.isRequired,
		executeSearch: PropTypes.func.isRequired,
		// groups: PropTypes.arrayOf(
		// 	PropTypes.shape({
		// 		name: PropTypes.string.isRequired,
		// 		groupId: PropTypes.number.isRequired,
		// 		kind: PropTypes.string.isRequired,
		// 		avatarUrl: PropTypes.string,
		// 		membershipKind: PropTypes.string,
		// 		relationshipKind: PropTypes.string,
		//		claimable: string,
		// 	}),
		// ).isRequired,
		groups: PropTypes.array.isRequired,
		// searchedGroups: PropTypes.arrayOf(
		// 	PropTypes.shape({
		// 		name: PropTypes.string.isRequired,
		// 		groupId: PropTypes.number.isRequired,
		// 		kind: PropTypes.string.isRequired,
		// 		avatarUrl: PropTypes.string,
		// 		membershipKind: PropTypes.string,
		// 		relationshipKind: PropTypes.string,
		//		claimable: string,
		// 	}),
		// ),
		groupSearchResults: PropTypes.array,
		handleCreateGroup: PropTypes.func.isRequired,
		handleGetStartedClick: PropTypes.func.isRequired,
		handleClaimGroupClick: PropTypes.func.isRequired,
	};

	state = {
		searchInputValue: '',
		newChurchName: '',
		newChurchLocation: '',
		isCreateGroupOpen: false,
		modalContent: 'main',
		selectedGroupId: -1,
	};

	createGroupClick = () => {
		this.toggle();
		this.props.handleCreateGroup(this.state.newChurchName, this.state.newChurchLocation);
	};

	clearSearchInput = () => {
		this.setState({
			searchInputValue: '',
		});
	};

	getDefaultGroups() {
		return this.props.groups.map(group => (
			<SearchResult
				key={group.groupId}
				groupId={group.groupId}
				kind={group.kind}
				name={group.name}
				avatar={<Avatar group={group} size="40px" />}
				membershipKind={group.membershipKind}
				relationshipKind={group.relationshipKind}
				handleGetStartedClick={this.handleGetStarted}
				handleRequestClick={this.redirectToGroup}
				handleEditClick={this.redirectToGroup}
				handleJoinGroupClick={this.redirectToGroup}
				handleClaimGroupClick={this.handleClaimGroup}
				setModalState={this.setModalState}
				setSelectedGroupId={this.setSelectedGroupId}
				handleGetStarted={this.handleGetStarted}
				toggle={this.toggle}
			/>
		));
	}

	getSearchResults = () => {
		let groups;
		if (this.props.groupSearchResults) {
			groups = this.props.groupSearchResults.map(group => (
				<SearchResult
					key={group.groupId}
					groupId={group.groupId}
					kind={group.kind}
					name={group.name}
					avatar={<Avatar group={group} size="40px" />}
					membershipKind={group.membershipKind}
					relationshipKind={group.relationshipKind}
					handleGetStartedClick={this.handleGetStarted}
					handleRequestClick={this.redirectToGroup}
					handleEditClick={this.handleEdit}
					handleJoinGroupClick={this.redirectToGroup}
					handleClaimGroupClick={this.handleClaimGroup}
					setModalState={this.setModalState}
					setSelectedGroupId={this.setSelectedGroupId}
					handleGetStarted={this.handleGetStarted}
					toggle={this.toggle}
				/>
			));
		} else {
			groups = this.getDefaultGroups();
		}
		return groups;
	};

	toggleCreateGroupState = () => {
		this.setState(({ isCreateGroupOpen }) => ({ isCreateGroupOpen: !isCreateGroupOpen }));
	};

	openCreateGroup = () => {
		this.setState({ isCreateGroupOpen: true });
	};

	closeCreateGroup = () => {
		this.setState({ isCreateGroupOpen: false });
	};

	toggle = () => {
		this.props.changeModalState();
	};

	setModalState = state => {
		this.setState({ modalContent: state });
	};

	setSelectedGroupId = id => {
		this.setState({ selectedGroupId: id });
	};

	resetModalState = () => {
		this.setState({ modalContent: 'main' });
	};

	onChurchNameInputChange = event => {
		this.setState({ newChurchName: event.target.value });
	};

	onChurchLocationInputChange = event => {
		this.setState({ newChurchLocation: event.target.value });
	};

	redirectToGroup = () => {
		this.setModalState('main');
		window.open(`https://www.faithlife.com/${this.state.selectedGroupId}`, 'noopener, noreferrer');
	};

	handleSearchInput = event => {
		this.setState({
			searchInputValue: event.target.value,
		});
		if (
			event.target.value !== undefined &&
			event.target.value !== ' ' &&
			event.target.value !== ''
		) {
			this.props.executeSearch(event.target.value);
		}
	};

	handleKeyPress = event => {
		if (event.key === 'Enter') {
			if (
				event.target.value !== undefined &&
				event.target.value !== ' ' &&
				event.target.value !== ''
			) {
				this.props.executeSearch(this.state.searchInputValue);
			}
		}
	};

	handleGetStarted = groupId => {
		this.props.handleGetStartedClick(groupId);
	};

	handleClaimGroup = groupId => {
		this.props.handleClaimGroupClick(groupId);
	};

	render() {
		return (
			<Styled.GroupSelectorModalContainer>
				<Modal centered isOpen={this.props.isOpen} backdrop toggle={this.toggle}>
					<Styled.GroupSelectorModalBody>
						{this.state.modalContent === 'main' && (
							<div>
								<div onClick={this.closeCreateGroup}>
									<Styled.ModalCloseButtonContainer>
										<Button color="link" onClick={this.toggle}>
											<Styled.xButton />
										</Button>
									</Styled.ModalCloseButtonContainer>
									<Styled.ModalTitle>Find Your Church</Styled.ModalTitle>
									<Styled.ModalSubtitle>in the Faithlife Church Directory</Styled.ModalSubtitle>
									<Styled.SearchInputGroup>
										<Styled.SearchInput
											placeholder="Your church name and city"
											value={this.state.searchInputValue}
											onChange={this.handleSearchInput}
											onKeyPress={this.handleKeyPress}
										/>
										<Styled.SearchInputAddon addonType="append">
											<Button color="link" onClick={this.clearSearchInput}>
												{this.state.searchInputValue ? <Styled.xButton /> : <Styled.SearchGlass />}
											</Button>
										</Styled.SearchInputAddon>
									</Styled.SearchInputGroup>
									<Styled.SearchResultsContainer>
										{this.getSearchResults()}
									</Styled.SearchResultsContainer>
								</div>
								<Styled.CreateGroupWrapper position={this.state.isCreateGroupOpen ? '0' : '-109px'}>
									<CreateGroup
										onClick={this.toggleCreateGroupState}
										isCreateGroupOpen={this.state.isCreateGroupOpen}
										searchInputValue={this.state.searchInputValue}
										handleCreateGroup={this.createGroupClick}
										onChurchNameInputChange={this.onChurchNameInputChange}
										onChurchLocationInputChange={this.onChurchLocationInputChange}
										newChurchName={this.state.newChurchName}
										newChurchLocation={this.state.newChurchLocation}
										openCreateGroup={this.openCreateGroup}
									/>
								</Styled.CreateGroupWrapper>
							</div>
						)}
						{this.state.modalContent === 'admin' && (
							<div>
								<Styled.ModalCloseButtonContainer>
									<Button color="link" onClick={this.resetModalState}>
										<Styled.xButton />
									</Button>
								</Styled.ModalCloseButtonContainer>
								<Styled.SecondaryModalContent>
									<Styled.SecondaryModalText>
										<Styled.SearchResultBoldText>Admin</Styled.SearchResultBoldText>
										<span> membership is neccessarry to perform this action.</span>
									</Styled.SecondaryModalText>
									<Styled.SecondaryModalText>
										Contact a group administrator to request Admin membership
									</Styled.SecondaryModalText>
									<Styled.SecondaryModalButtonContainer>
										<Button color="primary" onClick={this.redirectToGroup}>
											Continue
										</Button>
									</Styled.SecondaryModalButtonContainer>
									<Styled.SecondaryModalButtonContainer>
										<Button onClick={this.resetModalState}>Cancel</Button>
									</Styled.SecondaryModalButtonContainer>
								</Styled.SecondaryModalContent>
							</div>
						)}
						{this.state.modalContent === 'change' && (
							<div>
								<Styled.ModalCloseButtonContainer>
									<Button color="link" onClick={this.resetModalState}>
										<Styled.xButton />
									</Button>
								</Styled.ModalCloseButtonContainer>
								<Styled.SecondaryModalContent>
									<Styled.SecondaryModalText>
										This group type must be set to{' '}
										<Styled.SearchResultBoldText>"Church"</Styled.SearchResultBoldText>
									</Styled.SecondaryModalText>
									<Styled.SecondaryModalText>
										Visit the group settings page to change
									</Styled.SecondaryModalText>
									<Styled.SecondaryModalButtonContainer>
										<Button color="primary" onClick={this.redirectToGroup}>
											Change to Church
										</Button>
									</Styled.SecondaryModalButtonContainer>
									<Styled.SecondaryModalButtonContainer>
										<Button onClick={this.resetModalState}>Cancel</Button>
									</Styled.SecondaryModalButtonContainer>
								</Styled.SecondaryModalContent>
							</div>
						)}
					</Styled.GroupSelectorModalBody>
				</Modal>
			</Styled.GroupSelectorModalContainer>
		);
	}
}