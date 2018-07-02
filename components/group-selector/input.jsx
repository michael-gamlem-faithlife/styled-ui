import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../text-input/text-input.jsx';
import styles from './styles.m.less';
import uiStrings from './ui-strings.json';

export default class GroupInput extends React.PureComponent {
	static propTypes = {
		onInputChange: PropTypes.func.isRequired,
		onModalViewChange: PropTypes.func.isRequired,
		inputValue: PropTypes.string,
	};

	handleButtonClick = () => {
		this.props.onModalViewChange();
	};

	render() {
		const { inputValue, onInputChange } = this.props;
		return (
			<div>
				<div className={styles.groupSelectInputContainer}>
					<TextInput
						inputValue={inputValue}
						inputClass="group-select__input"
						placeholder={uiStrings.inputPlaceholder}
						onChange={onInputChange}
					/>
				</div>
				<button className={styles.groupSelect__Btn} onClick={this.handleButtonClick}>
					{uiStrings.getStarted}
				</button>
			</div>
		);
	}
}
