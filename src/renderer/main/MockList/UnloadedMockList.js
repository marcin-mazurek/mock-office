import { connect } from 'react-redux';
import MockList from './MockList';
import { getAllAsList } from '../../mocks/selectors';
import { getSelected } from '../../servers/selectors';
import { requestLoad } from '../../mocks/actions';

const mapStateToProps = state => ({
  mocks: getAllAsList(state),
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  action: requestLoad
};

export default connect(mapStateToProps, mapDispatchToProps)(MockList);
