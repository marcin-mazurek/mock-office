import React from 'react';
import { connect } from 'react-redux';
import { getScene } from '../selectors';
import { init } from '../removeScene/actions';
import { getQueueSceneIds } from '../../scenarios/selectors';
import ScenePartsConnect from '../../sceneParts/browse/ScenePartList';

export const Scene = ({
                        id,
                        title,
                        serverId,
                        remove,
                        reuse,
                        quantity,
                        requirements,
                        runCount,
                        lastDuration,
                        finished
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
      <div className="scene-details">
        <div className="scene__title">{title}</div>
        <div className="scene-spec">
          <div className="scene-spec__tag">{requirements.event}</div>
          {
            reuse
              ? <div className="scene-spec__tag">{quantityInfo}</div>
              : null
          }
          {
            runCount > 0
              ? (
                <div className="scene-status__tag" title="Run count">
                  <i className="fa fa-flash" /> {runCount}
                </div>
              )
              : null
          }
          {
            lastDuration
              ? (
                <div className="scene-status__tag" title="Last duration">
                  <i className="fa fa-clock-o" /> {lastDuration}{'ms'}
                </div>
              )
              : null
          }
        </div>
        {
          finished
            ? (
              <div className="scene-status__tag">
                <i className="fa fa-check" />{' Finished'}
              </div>
            )
            : null
        }
        <button className="scene__remove-button" onClick={() => remove(serverId, id)}>
          <i className="fa fa-times" />
        </button>
      </div>
      <div className="scene__parts">
        <ScenePartsConnect sceneId={id} />
      </div>
    </div>
  );
};

Scene.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  serverId: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired,
  reuse: React.PropTypes.string,
  quantity: React.PropTypes.number,
  requirements: React.PropTypes.shape({}),
  runCount: React.PropTypes.number.isRequired,
  lastDuration: React.PropTypes.number,
  finished: React.PropTypes.bool.isRequired
};

const sceneMapStateToProps = (initialState, ownProps) => (state) => {
  const {
    title, interval, reuse, quantity, delay, requirements, finished, runCount, lastDuration
  } = getScene(state, ownProps);
  return {
    title,
    interval,
    reuse,
    quantity,
    delay,
    requirements,
    finished,
    runCount,
    lastDuration
  };
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
