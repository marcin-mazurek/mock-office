import React from 'react';
import { connect } from 'react-redux';
import { getSceneParts } from './selectors';

export const SceneParts = ({ sceneParts }) => (
  <div>
    <ul>
      {
        sceneParts.map(scenePart =>
          <li>{scenePart.title}</li>
        )
      }
    </ul>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  sceneParts: getSceneParts(state, ownProps.sceneId)
});

export default connect(mapStateToProps)(SceneParts);
