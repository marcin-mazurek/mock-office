import { connect } from 'react-redux';
import { paramsSelector } from '../../app/addBehaviour/selectors';
import AddBehaviourModal from './AddBehaviourModal';

const mapStateToProps = (state) => {
  const params = paramsSelector(state);

  return {
    serverType: params.get('serverType'),
    serverId: params.get('serverId')
  };
};

export default connect(mapStateToProps)(AddBehaviourModal);
