import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createSelector } from 'reselect';
import getSceneParts, { getScenePart } from '../../entities/sceneParts/selectors';
import expandIcon from '../../assets/icons_green_expand@3x.svg';

export const ScenePartListItem = ({
                                    title,
                                    interval,
                                    reuse,
                                    quantity,
                                    delay
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
    <li className="scene-part-list-item">
      <img src={expandIcon} role="presentation" />
      <div className="scene-part-list-item-title">{title}</div>
      <div className="scene-part-list-item-spec">
        {
          delay
            ? (
              <div className="scene-part-list-item-spec__tag">
                <i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          interval
            ? (
              <div className="scene-part-list-item-spec__tag">
                <i className="fa fa-history" />{' '}{interval / 1000}{'s'}
              </div>
            )
            : null
        }
        {
          reuse
            ? <div className="scene-part-list-item-spec__tag">{quantityInfo}</div>
            : null
        }
      </div>
    </li>
  );
};

ScenePartListItem.propTypes = {
  title: PropTypes.string.isRequired,
  interval: PropTypes.number,
  reuse: PropTypes.bool,
  quantity: PropTypes.number,
  delay: PropTypes.number
};

const scenePartSelector = createSelector(
  getScenePart,
  scenePart => ({
    title: scenePart.title,
    interval: scenePart.interval,
    reuse: scenePart.reuse,
    quantity: scenePart.quantity,
    delay: scenePart.delay,
  })
);

const ScenePartListItemMapStateToProps = (state, ownProps) =>
  scenePartSelector(state, ownProps);

export const ScenePartListItemConnect =
  connect(ScenePartListItemMapStateToProps)(ScenePartListItem);

export const ScenePartList = ({ sceneParts }) => (
  <ul className="scene-part-list">
    {
      sceneParts.map(scenePartId =>
        <ScenePartListItemConnect key={scenePartId} id={scenePartId} />
      )
    }
  </ul>
);

ScenePartList.propTypes = {
  sceneParts: ImmutablePropTypes.listOf(PropTypes.string)
};

const mapStateToProps = (state, ownProps) => ({
  sceneParts: getSceneParts(state, ownProps)
});

export default connect(mapStateToProps)(ScenePartList);
