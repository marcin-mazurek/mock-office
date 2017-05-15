import { handleEditServer } from './appServer';
import ServersManager from '../serversManager/index';

describe('handleEditServer', () => {
  it('should change name', () => {
    const changeNameMock = jest.fn();
    const serversManager = {
      find() {
        return {
          changeName: changeNameMock
        };
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const req = {
      body: {
        id: 'id',
        name: 'new name'
      }
    };
    handleEditServer(serversManager)(req, res);
    expect(changeNameMock).toHaveBeenCalledWith('new name');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should validate name param', () => {
    const serversManager = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const req = {
      body: {
        id: 'id',
        name: 1232
      }
    };
    handleEditServer(serversManager)(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'name should be string' });
  });

  it('should change port', () => {
    const changePortMock = jest.fn();
    const serversManager = {
      find() {
        return {
          isLive: () => false,
          changePort: changePortMock
        };
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const req = {
      body: {
        id: 'id',
        port: 3000
      }
    };
    handleEditServer(serversManager)(req, res);
    expect(changePortMock).toHaveBeenCalledWith(3000);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should validate port param', () => {
    const serversManager = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const req = {
      body: {
        id: 'id',
        port: 'dsadsa'
      }
    };
    handleEditServer(serversManager)(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'port should be number' });
  });

  it('should work even with no params', () => {
    const serversManager = {
      find() { return {}; }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const req = {
      body: {
        id: 'id'
      }
    };
    handleEditServer(serversManager)(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should change name', () => {
    const serversManager = new ServersManager();
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const serverId = serversManager.add('name', 3000, 'http');
    const req = {
      body: {
        id: serverId,
        name: 'new name'
      }
    };
    handleEditServer(serversManager)(req, res);
    expect(serversManager.find(serverId).name).toEqual('new name');
  });

  it('should change port', () => {
    const serversManager = new ServersManager();
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const serverId = serversManager.add('name', 3000, 'http');
    const req = {
      body: {
        id: serverId,
        port: 3001
      }
    };
    handleEditServer(serversManager)(req, res);
    expect(serversManager.find(serverId).port).toEqual(3001);
  });

  it('should change port is server is listening and start it again', (done) => {
    const serversManager = new ServersManager();
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const serverId = serversManager.add('name', 3000, 'http');
    const server = serversManager.find(serverId);
    server.start(() => {
      const req = {
        body: {
          id: serverId,
          port: 3001
        }
      };
      handleEditServer(serversManager)(req, res);
      setTimeout(() => {
        expect(server.port).toEqual(3001);
        expect(server.isLive()).toBeTruthy();
        server.stop(done);
      }, 100);
    });
  });
});
