import Button from 'elementor-app/ui/molecules/button';
import Grid from 'elementor-app/ui/grid/grid';
import Icon from "elementor-app/ui/atoms/icon";

import './modal.scss';

export default class ModalProvider extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			hideModal: this.hideModal,
			show: false,
			showModal: this.showModal,
		};
	}

	hideModal = () => {
		this.setState( {
			show: false,
		} );
	};

	showModal = () => {
		this.setState( {
			show: true,
		} );
	};

	render() {
		return (
			<>
				<Button { ... this.props.toggleButtonProps } onClick={ this.state.showModal } />
				<Modal modalProps={this.state} title={ this.props.title }>
					{ this.props.children }
				</Modal>
			</>
		);
	}
}

ModalProvider.propTypes = {
	children: PropTypes.node.isRequired,
	toggleButtonProps: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
};

class Modal extends React.Component {
	modalRef = React.createRef();
	closeRef = React.createRef();

	closeModal = ( e ) => {
		const { modalProps } = this.props;
		const node = this.modalRef.current,
			closeNode = this.closeRef.current,
			isInCloseNode = closeNode && closeNode.contains( e.target );
		// ignore if click is inside the modal
		if ( node && node.contains( e.target ) && ! isInCloseNode ) {
			return;
		}

		modalProps.hideModal();
	};

	componentDidMount() {
		document.addEventListener( 'mousedown', this.closeModal, false );
	}

	componentWillUnmount() {
		document.removeEventListener( 'mousedown', this.closeModal, false );
	}

	render() {
		const { modalProps, children } = this.props;
		return modalProps.show ? (
			<div className="modal__overlay" onClick={ this.closeModal }>
				<div className="modal" ref={ this.modalRef } >
					<Grid container className="modal__header" justify="space-between" alignItems="center">
						<Grid item>
							<Icon className="eicon-info-circle"/>
							{ this.props.title }
						</Grid>
						<Grid item>
							<div className="modal-close-wrapper" ref={ this.closeRef }>
								<Button text={ __( 'Close', 'elementor' ) } hideText icon="eicon-close" onClick={ this.closeModal } />
							</div>
						</Grid>
					</Grid>
					{children}
				</div>
			</div>
		) : null;
	}
}

Modal.propTypes = {
	modalProps: PropTypes.object.isRequired,
	children: PropTypes.any.isRequired,
	title: PropTypes.string.isRequired,
};
