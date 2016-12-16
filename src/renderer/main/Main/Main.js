import React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import Server from '../Server';
import ServerList from '../ServerList';
import { SERVER_START, SERVER_STOP } from '../../../common/messageNames';
import { getSelected } from '../../servers/selectors';
import AddServer from '../AddServer';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLive = this.toggleLive.bind(this);
    this.state = {
      live: false
    };
  }

  toggleLive() {
    const currentLive = !this.state.live;
    const message = currentLive ? SERVER_START : SERVER_STOP;
    ipcRenderer.send(message);

    this.setState({
      live: currentLive
    });
  }

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
                  buttonText={
                    this.state.live
                      ? 'Stop'
                      : 'Start'
                  }
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
