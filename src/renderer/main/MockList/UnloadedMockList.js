import { connect } from 'react-redux';
import MockList from './MockList';
import { getUnloadedMocks } from '../../mocks/selectors';
import { load } from '../../mocks/actions';

const mapStateToProps = state => ({
  mocks: getUnloadedMocks(state)
});

const mapDispatchToProps = {
  action: load
};

export default connect(mapStateToProps, mapDispatchToProps)(MockList);
