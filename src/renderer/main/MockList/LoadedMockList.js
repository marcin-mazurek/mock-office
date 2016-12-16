import { connect } from 'react-redux';
import MockList from './MockList';
import { getLoadedMocks } from '../../mocks/selectors';
import { unload } from '../../mocks/actions';

const mapStateToProps = state => ({
  mocks: getLoadedMocks(state)
});

const mapDispatchToProps = {
  action: unload
};

export default connect(mapStateToProps, mapDispatchToProps)(MockList);
