import React from 'react';
import { connect } from 'react-redux';
import Server from '../Server';
import ServerList from '../ServerList';
import { getSelected } from '../../servers/selectors';
import AddServer from '../../addServer/AddServer';

class Main extends React.Component {
  render() {
    const { selected } = this.props;

    return (
      <div className="main">
        <div className="main-server-list">
          <div>List of servers:</div>
          <ServerList />
        </div>
        <div>
          <AddServer />
          {
            selected
              ? (
                <Server
                  toggleLive={this.toggleLive}
                />
              )
              : null
          }
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  selected: React.PropTypes.string
};

const mapStateToProps = state => ({
  selected: getSelected(state)
});

export default connect(mapStateToProps)(Main);
