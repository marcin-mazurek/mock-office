import React from 'react';
import { connect } from 'react-redux';
import { getDescription } from '../selectors';
import { init } from '../removeDescription/actions';
import { getQueueDescriptionIds } from '../../scenarios/selectors';

export const Description = ({
                              id,
                              title,
                              serverId,
                              remove,
                              interval,
                              reuse,
                              quantity,
                              delay,
                              requirements,
                              blocking
                            }) => {
  let quantityInfo = null;

  if (reuse) {
    if (reuse === 'infinite') {
      quantityInfo = <i className="fa fa-repeat" />;
    } else if (reuse === 'fixed') {
      quantityInfo = <div>{quantity}<i className="fa fa-repeat" /></div>;
    }
  }

  return (
    <div className="description">
      <div className="description__title">{title}</div>
      <div className="description-spec">
        {
          blocking
            ? <div className="description-spec__tag"><i className="fa fa-lock" /></div>
            : null
        }
        {
          requirements
            ? <div className="description-spec__tag"><i className="fa fa-handshake-o" /></div>
            : null
        }
        {
          delay
            ? (
              <div className="description-spec__tag">
                <i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}
              </div>
          )
            : null
        }
        {
          interval
            ? (
              <div className="description-spec__tag">
                <i className="fa fa-history" />{' '}{interval / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          reuse
            ? <div className="description-spec__tag">{quantityInfo}</div>
            : null
        }
      </div>
      <button className="description__remove-button" onClick={() => remove(serverId, id)}>
        <i className="fa fa-times" />
      </button>
    </div>
  );
};

Description.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  serverId: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired,
  interval: React.PropTypes.number,
  reuse: React.PropTypes.string,
  quantity: React.PropTypes.number,
  delay: React.PropTypes.number,
  requirements: React.PropTypes.shape({}),
  blocking: React.PropTypes.bool
};

const descriptionMapStateToProps = (initialState, ownProps) => (state) => {
  const {
    title, interval, reuse, quantity, delay, requirements, blocking
  } = getDescription(state, ownProps);
  return { title, interval, reuse, quantity, delay, requirements, blocking };
};

const descriptionMapDispatchToProps = {
  remove: init
};

export const DescriptionConnect =
  connect(descriptionMapStateToProps, descriptionMapDispatchToProps)(Description);

export const Descriptions = ({ descriptionIds, serverId }) => (
  <ul className="descriptions">
    {
      descriptionIds.map(descriptionId =>
        <li className="descriptions__item" key={descriptionId}>
          <DescriptionConnect serverId={serverId} id={descriptionId} />
        </li>
      )
    }
  </ul>
);

Descriptions.propTypes = {
  descriptionIds: React.PropTypes.shape({}).isRequired,
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  descriptionIds: getQueueDescriptionIds(ownProps.serverId, state)
});

export default connect(mapStateToProps)(Descriptions);
