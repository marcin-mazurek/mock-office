import { connect } from 'react-redux';
import { scenarioSelector } from '../../app/entities';
import MockList from './MockList';

const mapStateToProps = (state, ownProps) => {
  const scenario = scenarioSelector(state, ownProps.scenario);

  return {
    mocks: scenario.mocks
  };
};

export default connect(mapStateToProps)(MockList);
