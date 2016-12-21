import { connect } from 'react-redux';
import MockList from './MockList';
import { getLoadedByServer } from '../../mocks/selectors';
import { requestUnload } from '../../mocks/actions';
import { getSelected } from '../../servers/selectors';

const mapStateToProps = state => ({
  mocks: getLoadedByServer(state),
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  action: requestUnload
};

export default connect(mapStateToProps, mapDispatchToProps)(MockList);
