import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ScenePart } from '../sceneParts/reducer';
import { getSceneParts } from './selectors';

export const SceneParts = ({ sceneParts }) => (
  <ul className="scene-parts">
    {
      sceneParts.map((scenePart) => {
        const {
          id,
          title,
          interval,
          reuse,
          quantity,
          delay
        } = scenePart;

        let quantityInfo = null;

        if (reuse) {
          if (reuse === 'infinite') {
            quantityInfo = <i className="fa fa-repeat" />;
          } else if (reuse === 'fixed') {
            quantityInfo = <div>{quantity}<i className="fa fa-repeat" /></div>;
          }
        }

        return (
          <li key={id} className="scene-part">
            <i className="fa fa-circle-o" />
            <div className="scene-part-title">{title}</div>
            <div className="scene-part-spec">
              {
                delay
                  ? (
                    <div className="scene-part-spec__tag">
                      <i className="fa fa-hourglass-o" />{' '}{delay / 1000}{'s'}
                    </div>
                  )
                  : null
              }
              {
                interval
                  ? (
                    <div className="scene-part-spec__tag">
                      <i className="fa fa-history" />{' '}{interval / 1000}{'s'}
                    </div>
                  )
                  : null
              }
              {
                reuse
                  ? <div className="scene-part-spec__tag">{quantityInfo}</div>
                  : null
              }
            </div>
          </li>
        );
      })
    }
  </ul>
);

SceneParts.propTypes = {
  sceneParts: ImmutablePropTypes.listOf(ScenePart)
};

const mapStateToProps = (state, ownProps) => ({
  sceneParts: getSceneParts(state, ownProps.sceneId)
});

export default connect(mapStateToProps)(SceneParts);
