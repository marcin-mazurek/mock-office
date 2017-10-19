import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { ServerViewHeaderConnect } from '../ServerViewHeader';
import { HttpMockListItemConnect } from '../HttpMockListItem';
import { WsMockListItemConnect } from '../WsMockListItem';
import { MockListConnect } from '../MockList';

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
            <MockListConnect
              server={id}
              scenario={scenario}
              render={
                type === 'http'
                  ? mock => <HttpMockListItemConnect server={id} scenario={scenario} id={mock} />
                  : mock => <WsMockListItemConnect server={id} scenario={scenario} id={mock} />
              }
            />
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
