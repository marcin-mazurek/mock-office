import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';

const createModal = (types) => {
  class Modal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: []
      };
    }

    componentWillReceiveProps(props) {
      const { component } = props;
      const ModalComponent = types[component];
      const isOpen = !!ModalComponent;

      if (isOpen) {
        this.setState({
          items: this.state.items.concat([{ key: 'modal', style: { opacity: spring(1) } }])
        });
      } else {
        this.setState({
          items: []
        });
      }
    }

    willEnter() {
      return { opacity: 0 };
    }

    willLeave() {
      return { opacity: spring(0) };
    }

    render() {
      const { component, onOverlayClick } = this.props;
      const ModalComponent = types[component];
      const isOpen = !!ModalComponent;

      return (
        <TransitionMotion
          willEnter={this.willEnter}
          willLeave={this.willLeave}
          styles={this.state.items}
        >
          {
            interpolatingStyles =>
              <div>
                {
                  interpolatingStyles.map(config =>
                    <div
                      key={config.key}
                      className="modal"
                      style={config.style}
                    >
                      <button className="modal__overlay" onClick={onOverlayClick} />
                      <div className="modal__content">
                        {
                          isOpen ? <ModalComponent /> : null
                        }
                      </div>
                    </div>
                  )
                }
              </div>
          }
        </TransitionMotion>
      );
    }
  }

  Modal.propTypes = {
    component: PropTypes.string,
    onOverlayClick: PropTypes.func.isRequired
  };

  return Modal;
};

export default createModal;
