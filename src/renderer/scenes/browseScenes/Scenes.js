import React from 'react';
import { connect } from 'react-redux';
import { getScene } from '../selectors';
import { init } from '../removeScene/actions';
import { getQueueSceneIds } from '../../scenarios/selectors';

export const Scene = ({
                        id,
                        title,
                        serverId,
                        remove,
                        interval,
                        reuse,
                        quantity,
                        delay,
                        requirements,
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
    <div className="scene">
      <div className="scene__title">{title}</div>
      <div className="scene-spec">
        {
          requirements
            ? <div className="scene-spec__tag"><i className="fa fa-handshake-o" /></div>
            : null
        }
        {
          delay
            ? (
              <div className="scene-spec__tag">
                <i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          interval
            ? (
              <div className="scene-spec__tag">
                <i className="fa fa-history" />{' '}{interval / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          reuse
            ? <div className="scene-spec__tag">{quantityInfo}</div>
            : null
        }
      </div>
      <button className="scene__remove-button" onClick={() => remove(serverId, id)}>
        <i className="fa fa-times" />
      </button>
    </div>
  );
};

Scene.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  serverId: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired,
  interval: React.PropTypes.number,
  reuse: React.PropTypes.string,
  quantity: React.PropTypes.number,
  delay: React.PropTypes.number,
  requirements: React.PropTypes.shape({})
};

const sceneMapStateToProps = (initialState, ownProps) => (state) => {
  const {
    title, interval, reuse, quantity, delay, requirements
  } = getScene(state, ownProps);
  return { title, interval, reuse, quantity, delay, requirements };
};

const sceneMapDispatchToProps = {
  remove: init
};

export const SceneConnect =
  connect(sceneMapStateToProps, sceneMapDispatchToProps)(Scene);

export const Scenes = ({ sceneIds, serverId }) => (
  <ul className="scenes">
    {
      sceneIds.map(sceneId =>
        <li className="scenes__item" key={sceneId}>
          <SceneConnect serverId={serverId} id={sceneId} />
        </li>
      )
    }
  </ul>
);

Scenes.propTypes = {
  sceneIds: React.PropTypes.shape({}).isRequired,
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  sceneIds: getQueueSceneIds(ownProps.serverId, state)
});

export default connect(mapStateToProps)(Scenes);
