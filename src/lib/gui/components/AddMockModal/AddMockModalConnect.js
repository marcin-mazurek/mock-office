import { connect } from 'react-redux';
import { paramsSelector } from '../../app/addMock/selectors';
import AddMockModal from './AddMockModal';

const mapStateToProps = (state) => {
  const params = paramsSelector(state);

  return {
    serverType: params.get('serverType'),
    scenario: params.get('scenario'),
    server: params.get('server')
  };
};

export default connect(mapStateToProps)(AddMockModal);
