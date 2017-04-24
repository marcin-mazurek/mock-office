import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classnames from 'classnames';
import { getScene } from '../../entities/scenes/selectors';
import { init } from '../removeScene/actions';
import { getScenes } from '../../entities/scenarios/selectors';
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
                        finished,
                        running
                      }) => {
  let quantityInfo = null;

  if (reuse) {
    if (reuse === 'infinite') {
      quantityInfo = <i className="fa fa-repeat" />;
    } else if (reuse === 'fixed') {
      quantityInfo = <div>{quantity}<i className="fa fa-repeat" /></div>;
    }
  }

  const sceneClassNames = classnames({
    scene: true,
    'scene--finished': finished,
    'scene--running': running
  });

  return (
    <div className={sceneClassNames}>
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
        <button className="scene__remove-button" onClick={() => remove(serverId, id)}>
          remove
        </button>
      </div>
      <div className="scene__parts">
        <ScenePartsConnect sceneId={id} />
      </div>
    </div>
  );
};

Scene.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  serverId: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  reuse: PropTypes.string,
  quantity: PropTypes.number,
  requirements: PropTypes.shape({}),
  runCount: PropTypes.number.isRequired,
  lastDuration: PropTypes.number,
  finished: PropTypes.bool.isRequired,
  running: PropTypes.bool.isRequired
};

const sceneSelector = createSelector(
  getScene,
  scene => ({
    title: scene.title,
    reuse: scene.reuse,
    quantity: scene.quantity,
    requirements: scene.requirements,
    finished: scene.finished,
    runCount: scene.runCount,
    lastDuration: scene.lastDuration,
    running: scene.running
  })
);

const sceneMapStateToProps = (initialState, ownProps) => state => sceneSelector(state, ownProps);

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
  sceneIds: PropTypes.shape({}).isRequired,
  serverId: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  sceneIds: getScenes(ownProps.serverId, state)
});

export default connect(mapStateToProps)(Scenes);
