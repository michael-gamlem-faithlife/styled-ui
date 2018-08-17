import React from 'react';
import PropTypes from 'prop-types';
import { Bootstrap } from '../../components/main.js';
import * as Styled from './styled.jsx';
import { GroupDropdown } from './dropdown.jsx';
import { GroupSelectorModal } from './modal/component.jsx';

const { Button } = Bootstrap;
const defaultGroup = {
	name: '',
	groupId: -1,
	kind: '',
};

/** Styled group selector control */
export class GroupSelector extends React.Component {
	static propTypes = {
		/** Selects view state of group selector */
		groupSelectorView: PropTypes.oneOf(['groups', 'sign-in', 'no-groups', 'fetching']).isRequired,
		/** function that is called when "Sign In" is clicked by the user */
		handleSignInClick: PropTypes.func.isRequired,
		/** returns data to application for group creation */
		handleCreateGroup: PropTypes.func.isRequired,
		/** function that is called every time user chooses a different group */
		handleSelectionChange: PropTypes.func.isRequired,
		/** returns search string to application */
		executeSearch: PropTypes.func.isRequired,
		/** -1 if no previous selected group */
		selectedGroupId: PropTypes.number.isRequired,
		/** all groups that should be displayed on the dropdown */
		// groups: PropTypes.arrayOf(
		// 	PropTypes.shape({
		// 		name: PropTypes.string,
		// 		groupId: PropTypes.number,
		// 		kind: PropTypes.string,
		// 		avatarUrl: PropTypes.string,
		// 		membershipKind: PropTypes.string,
		//		claimable: string,
		// 	}),
		// ).isRequired,
		groups: PropTypes.array.isRequired,
		/** undefined or empty if no search has been executed yet */
		// searchedGroups: PropTypes.arrayOf(
		// 	PropTypes.shape({
		// 		name: PropTypes.string,
		// 		groupId: PropTypes.number,
		// 		kind: PropTypes.string,
		// 		avatarUrl: PropTypes.string,
		// 		membershipKind: PropTypes.string,
		//		claimable: string,
		// 	}),
		// ),
		groupSearchResults: PropTypes.array,
		/** action that should be taken when user selects group with proper permissions */
		handleGetStartedClick: PropTypes.func.isRequired,
		/** action that should be taken when user claims group */
		handleClaimGroupClick: PropTypes.func.isRequired,
		/** is the dropdown on a mobile view */
		isMobile: PropTypes.bool.isRequired,
	};
	state = {
		newGroupName: '',
		isModalOpen: false,
	};

	getGroup = groupId =>
		(this.props.groups || []).find(group => group.groupId === groupId) || defaultGroup;

	handleChangeModalState = () => {
		this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
	};

	handleKeyPress = event => {
		if (event.key === 'Enter') {
			this.props.handleCreateGroup(this.state.newGroupName, 'church');
		}
	};

	handleTextInput = event => {
		this.setState({
			newGroupName: event.target.value,
		});
	};

	render() {
		const selectedGroup = this.getGroup(this.props.selectedGroupId);
		return (
			<div>
				<Styled.GroupSelector tabIndex="0">
					{this.props.groupSelectorView === 'fetching' && (
						<Styled.SelectedGroupContainer>
							<Styled.SelectedGroup>
								<Styled.LoadingText>Loading...</Styled.LoadingText>
							</Styled.SelectedGroup>
						</Styled.SelectedGroupContainer>
					)}
					{this.props.groupSelectorView === 'groups' && (
						<GroupDropdown
							groups={this.props.groups}
							selectedGroup={selectedGroup}
							handleSelectionChange={this.props.handleSelectionChange}
							handleFindChurchButtonClick={this.handleChangeModalState}
							isMobile={this.props.isMobile}
						/>
					)}
					{this.props.groupSelectorView === 'no-groups' && (
						<Button color="primary" onClick={this.handleChangeModalState}>
							Find or add Church
						</Button>
					)}
					{this.props.groupSelectorView === 'sign-in' && (
						<Styled.GroupSelectorSignInAlert color="primary" style={{ lineHeight: 0.9 }}>
							<Button
								color="link"
								size="sm"
								onClick={this.props.handleSignInClick}
								style={{ padding: 0, paddingBottom: 1, fontSize: 9 }}
							>
								Sign In
							</Button>{' '}
							to add items to your catalog.
						</Styled.GroupSelectorSignInAlert>
					)}
				</Styled.GroupSelector>
				<GroupSelectorModal
					isOpen={this.state.isModalOpen}
					changeModalState={this.handleChangeModalState}
					executeSearch={this.props.executeSearch}
					groups={this.props.groups}
					groupSearchResults={this.props.groupSearchResults}
					handleCreateGroup={this.props.handleCreateGroup}
					handleGetStartedClick={this.props.handleGetStartedClick}
					handleClaimGroupClick={this.props.handleClaimGroupClick}
				/>
			</div>
		);
	}
}