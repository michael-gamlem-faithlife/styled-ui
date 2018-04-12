import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../components';
import styles from './story-styles.less';

export default class DemoContainer extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		onClick: PropTypes.func,
		theme: PropTypes.object,
	};

	state = {
		clicked: false,
	};

	onChange = newState => {
		this.setState(
			{
				...newState,
			},
			this.props.onClick,
		);
	};

	render() {
		const variationExamples = [
			['primary', 'small'],
			['primary', 'large'],
			['primary', 'extraLarge'],
			['secondary', 'small'],
			['secondary', 'large'],
			['secondary', 'extraLarge'],
		];

		return (
			<div className={styles.demos}>
				{variationExamples.map((variation, index) => (
					<div key={index} className={styles.demoRow}>
						<Button
							clicked={this.state.clicked}
							onChange={this.onChange}
							theme={this.props.theme}
							variations={[...variation, this.state.clicked && 'clicked']}
						>
							{this.props.children}
						</Button>
					</div>
				))}
			</div>
		);
	}
}