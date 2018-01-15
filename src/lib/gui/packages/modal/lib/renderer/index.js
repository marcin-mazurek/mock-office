import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';
import classnames from 'classnames';

export default class Renderer extends React.Component {
  static willEnter(styleThatLeft) {
    if (styleThatLeft.key === 'modalo-renderer-content') {
      return { translateY: 100 };
    } else if (styleThatLeft.key === 'modalo-renderer-overlay') {
      return { opacity: 0 };
    }

    return null;
  }

  static willLeave(styleThatLeft) {
    if (styleThatLeft.key === 'modalo-renderer-content') {
      return { translateY: spring(100), opacity: spring(0) };
    } else if (styleThatLeft.key === 'modalo-renderer-overlay') {
      return { opacity: spring(0) };
    }

    return null;
  }

  static renderContent(modalContentConfig) {
    const transform = `translateY(${modalContentConfig.style.translateY}px)`;
    const ComponentClass = modalContentConfig.data.component;

    return (
      <div
        className="modalo-renderer__content"
        key={modalContentConfig.key}
        style={{ ...modalContentConfig.style, transform }}
      >
        <ComponentClass />
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      styles: []
    };
  }

  componentWillReceiveProps(props) {
    const { ComponentClass, isOpen } = props;

    if (isOpen) {
      this.setState({
        styles: [
          {
            key: 'modalo-renderer-content',
            style: {
              translateY: spring(0),
              opacity: 1
            },
            data: {
              component: ComponentClass
            }
          },
          {
            key: 'modalo-renderer-overlay',
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
        className="modalo-renderer__overlay"
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
        willLeave={Renderer.willLeave}
        willEnter={Renderer.willEnter}
      >
        {
          (currentItems) => {
            const overlayConfig = currentItems.find(item => item.key === 'modalo-renderer-overlay');
            const contentConfig = currentItems.find(item => item.key === 'modalo-renderer-content');
            const modalClassnames = classnames(
              'modalo-renderer',
              {
                'modalo-renderer--visible': currentItems.length
              }
            );

            return (
              <div className={modalClassnames}>
                {overlayConfig && this.renderOverlay(overlayConfig)}
                {contentConfig && Renderer.renderContent(contentConfig)}
              </div>
            );
          }
        }
      </TransitionMotion>
    );
  }
}

Renderer.propTypes = {
  ComponentClass: PropTypes.func,
  onOverlayClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

Renderer.defaultProps = {
  ComponentClass: null
};
