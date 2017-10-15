import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { MockListConnect } from '../MockList';
import { ServerViewHeaderConnect } from '../ServerViewHeader';
import { HttpMockListItemConnect } from '../HttpMockListItem';

const ServerView = ({
  scenario,
  id,
  running,
  type,
  name,
  port
}) =>
  <div className="server-view">
    <header className="server-view__header">
      <ServerViewHeaderConnect
        running={running}
        id={id}
        type={type}
        name={name}
        port={port}
        scenario={scenario}
      />
    </header>
    <main className="server-view-main server-view__main">
      <div className="server-view__mocks">
        <div className="server-view__mocks-scroll-container">
          <Scrollbars>
            <MockListConnect server={id} scenario={scenario} Renderer={type === 'http' ? HttpMockListItemConnect : MockListConnect} />
          </Scrollbars>
        </div>
      </div>
    </main>
  </div>;

ServerView.propTypes = {
  scenario: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  running: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  port: PropTypes.number.isRequired
};

export default ServerView;
