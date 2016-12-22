import { connect } from 'react-redux';
import MockList from './MockList';
import { getSelectedServerLoadedExpectations } from '../../mocks/selectors';
import { requestUnload } from '../../mocks/actions';
import { getSelected } from '../../servers/selectors';

const mapStateToProps = state => ({
  mocks: getSelectedServerLoadedExpectations(state),
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  action: requestUnload
};

export default connect(mapStateToProps, mapDispatchToProps)(MockList);
