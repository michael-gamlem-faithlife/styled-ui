import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Modal extends React.Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
		container: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);
		this.root = document.querySelector(props.container);
		this.container = document.createElement('div');
		this.container.classList.add('modal');
	}

	componentDidMount() {
		this.root.appendChild(this.container);
		const pickerFocusEvent = new Event('pickerFocus');
		document.dispatchEvent(pickerFocusEvent);
	}

	componentWillUnmount() {
		this.root.removeChild(this.container);
		const pickerBlurEvent = new Event('pickerBlur');
		document.dispatchEvent(pickerBlurEvent);
	}

	render() {
		return ReactDOM.createPortal(this.props.children, this.container);
	}
}
