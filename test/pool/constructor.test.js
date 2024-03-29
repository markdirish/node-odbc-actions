/* eslint-env node, mocha */
const assert         = require('assert');
const odbc           = require('../../lib/odbc');
const { Connection } = require('../../lib/Connection');

const delay = t => new Promise(resolve => setTimeout(resolve, t));

describe('odbc.pool...', () => {
  describe('...with callbacks...', () => {
    it('...should return the default number of open connections when no config passed.', (done) => {
      odbc.pool(`${process.env.CONNECTION_STRING}`, (error, pool) => {
        assert.deepEqual(error, null);
        assert.notDeepEqual(pool, null);
        setTimeout(() => {
          assert.deepEqual(pool.freeConnections.length, 10);
          pool.close();
          done();
        }, 20000);
      });
    });
    it('...should open as many connections as passed with `initialSize` key...', (done) => {
      const poolConfig = {
        connectionString: `${process.env.CONNECTION_STRING}`,
        initialSize: 5,
      };
      odbc.pool(poolConfig, (error, pool) => {
        assert.deepEqual(error, null);
        assert.notDeepEqual(pool, null);
        setTimeout(() => {
          assert.deepEqual(pool.freeConnections.length, 5);
          pool.close();
          done();
        }, 3000);
      });
    });
    it('...should have at least one free connection when .connect is called', (done) => {
      odbc.pool(`${process.env.CONNECTION_STRING}`, (error1, pool) => {
        assert.deepEqual(error1, null);
        pool.connect((error2, connection) => {
          assert.deepEqual(error2, null);
          assert.deepEqual(connection instanceof Connection, true);
          done();
        });
      });
    });
  }); // ...with callbacks...
  describe('...with promises...', () => {
    it('...should return the default number of open connections when no config passed.', async () => {
      const pool = await odbc.pool(`${process.env.CONNECTION_STRING}`);
      assert.notDeepEqual(pool, null);
      await delay(8000);
      assert.deepEqual(pool.freeConnections.length, 10);
      pool.close();
    });
    it('...should open as many connections as passed with `initialSize` key...', async () => {
      const poolConfig = {
        connectionString: `${process.env.CONNECTION_STRING}`,
        initialSize: 5,
      };
      const pool = await odbc.pool(poolConfig);
      assert.notDeepEqual(pool, null);
      await delay(5000);
      assert.deepEqual(pool.freeConnections.length, 5);
      pool.close();
    });
    it('...should have at least one free connection when .connect is called', async () => {
      const pool = await odbc.pool(`${process.env.CONNECTION_STRING}`);
      const connection = await pool.connect();
      assert.deepEqual(connection instanceof Connection, true);
      pool.close();
    });
  }); // ...with promises...
});
