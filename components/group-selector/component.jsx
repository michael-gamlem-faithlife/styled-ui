import React from 'react';
import PropTypes from 'prop-types';
import Bootstrap from '../bootstrap';
import * as styled from './styled.less';

const { Button, InputGroup, Input } = Bootstrap;

export default class GroupSelector extends React.Component {
	static propTypes = {
		state: PropTypes.string.isRequired,
		handleSignInClick: PropTypes.func.isRequired,
		handleCreateGroup: PropTypes.func.isRequired,
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
	};

	constructor(props) {
		super(props);
		this.state = {
			newGroupName: '',
		};
	}

	onCreateGroupClick = () => {
		this.props.handleCreateGroup(this.state.newGroupName);
	};

	handleTextInput = event => {
		this.setState({
			newGroupName: event.target.value,
		});
	};

	render() {
		const groups = this.props.groups === undefined ? [{ name: 'JLS' }] : this.props.groups;

		const rows = [];
		for (let i = 0; i < groups.length; i++) {
			rows.push(<option key={i}>{groups[i].name}</option>);
		}

		return (
			<div>
				{this.props.state === 'groups' && (
					<div>
						<Input className={styled.input} type="select">
							{rows}
						</Input>
					</div>
				)}
				{this.props.state === 'no-groups' && (
					<div>
						<InputGroup>
							<Input
								type="text"
								className={styled.input}
								placeholder="Create Group"
								value={this.state.value}
								onChange={this.handleTextInput}
							/>
						</InputGroup>
						<Button className={styled.button} onClick={this.onCreateGroupClick}>
							Create Group
						</Button>
					</div>
				)}
				{this.props.state === 'sign-in' && (
					<div>
						<InputGroup>
							<Input className={styled.input} type="select" disabled placeholder="select group">
								<option>Select Group</option>
							</Input>
						</InputGroup>
						<Button
							color="primary"
							className={styled.button}
							onClick={this.props.handleSignInClick}
						>
							Sign In
						</Button>
					</div>
				)}
			</div>
		);
	}
}
