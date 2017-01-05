import React from 'react';
import { connect } from 'react-redux';
import Server from '../Server';
import { getSelected } from '../../servers/selectors';
import AddServer from '../../servers/addServer/AddServer';
import NavBar from '../NavBar';

class Main extends React.Component {
  render() {
    const { selected, children } = this.props;

    return (
      <div className="main">
        <NavBar />
        {children}
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
  selected: React.PropTypes.string,
  children: React.PropTypes.node
};

const mapStateToProps = state => ({
  selected: getSelected(state)
});

export default connect(mapStateToProps)(Main);
