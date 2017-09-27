import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';
import classnames from 'classnames';

const createModal = (types) => {
  class Modal extends React.Component {
    static willEnter(styleThatLeft) {
      if (styleThatLeft.key === 'modal-content') {
        return { translateY: 100 };
      } else if (styleThatLeft.key === 'modal-overlay') {
        return { opacity: 0 };
      }

      return null;
    }

    static willLeave(styleThatLeft) {
      if (styleThatLeft.key === 'modal-content') {
        return { translateY: spring(100), opacity: spring(0) };
      } else if (styleThatLeft.key === 'modal-overlay') {
        return { opacity: spring(0) };
      }

      return null;
    }

    static renderContent(modalContentConfig) {
      const transform = `translateY(${modalContentConfig.style.translateY}px)`;
      const ModalComponent = modalContentConfig.data.component;

      return (
        <div
          className="modal__content"
          key={modalContentConfig.key}
          style={{ ...modalContentConfig.style, transform }}
        >
          <ModalComponent />
        </div>
      );
    }

    constructor() {
      super();
      this.state = {
        styles: []
      };
    }

    componentWillReceiveProps(props) {
      const { component } = props;
      const ModalComponent = types[component];
      const isOpen = !!ModalComponent;

      if (isOpen) {
        this.setState({
          styles: [
            {
              key: 'modal-content',
              style: {
                translateY: spring(0),
                opacity: 1
              },
              data: {
                component: ModalComponent
              }
            },
            {
              key: 'modal-overlay',
              style: {
                opacity: spring(1)
              }
            },
          ]
        });
      } else {
        this.setState({
          styles: []
        });
      }
    }

    renderOverlay(modalOverlayConfig) {
      const { onOverlayClick } = this.props;

      return (
        <button
          className="modal__overlay"
          onClick={onOverlayClick}
          key={modalOverlayConfig.key}
          style={modalOverlayConfig.style}
        />
      );
    }

    render() {
      return (
        <TransitionMotion
          styles={this.state.styles}
          willLeave={Modal.willLeave}
          willEnter={Modal.willEnter}
        >
          {
            (currentItems) => {
              const overlayConfig = currentItems.find(item => item.key === 'modal-overlay');
              const contentConfig = currentItems.find(item => item.key === 'modal-content');
              const modalClassnames = classnames({
                modal: true,
                'modal--visible': currentItems.length
              });

              return (
                <div className={modalClassnames} key="modal">
                  {overlayConfig && this.renderOverlay(overlayConfig)}
                  {contentConfig && Modal.renderContent(contentConfig)}
                </div>
              );
            }
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
