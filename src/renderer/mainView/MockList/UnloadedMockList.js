import { connect } from 'react-redux';
import MockList from './MockList';
import { getSelectedServerExpectations } from '../../mocks/selectors';
import { getSelected } from '../../servers/selectors';
import { requestLoad } from '../../mocks/actions';

const mapStateToProps = state => ({
  mocks: getSelectedServerExpectations(state),
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  action: requestLoad
};

export default connect(mapStateToProps, mapDispatchToProps)(MockList);
