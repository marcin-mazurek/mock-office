import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ScenePart } from '../sceneParts/reducer';
import { getSceneParts } from './selectors';

export const SceneParts = ({ sceneParts }) => (
  <div>
    <ul>
      {
        sceneParts.map(scenePart =>
          <li key={scenePart.id}>{scenePart.title}</li>
        )
      }
    </ul>
  </div>
);

SceneParts.propTypes = {
  sceneParts: ImmutablePropTypes.listOf(ScenePart)
};

const mapStateToProps = (state, ownProps) => ({
  sceneParts: getSceneParts(state, ownProps.sceneId)
});

export default connect(mapStateToProps)(SceneParts);
