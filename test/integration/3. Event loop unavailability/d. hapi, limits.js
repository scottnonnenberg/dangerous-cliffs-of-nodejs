
'use strict';

var path = require('path');
var fs = require('fs');
var stripAnsi = require('strip-ansi');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('3. Event loop unavailability, d. hapi, limits', function() {
  var child, agent;
  var baseDir = path.join(__dirname, '../../../demos/3. Event loop unavailability/');
  var loadData = function(file) {
    return JSON.parse(fs.readFileSync(file).toString());
  };

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(baseDir, 'd. hapi, limits');

    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('returns 200 for root', function(done) {
    agent
      .get('/')
      .expect(200, done);
  });

  it('returns 200 on upload of small file', function(done) {
    var data = loadData(path.join(baseDir, 'data/small.json'));

    agent
      .post('/uploadData')
      .send(data)
      .expect({length: 1})
      .expect(200, done);
  });

  it('returns 413 on upload of big file', function(done) {
    var data = loadData(path.join(baseDir, 'data/big.json'));

    agent
      .post('/uploadData')
      .send(data)
      .expect(400, done);
  });

  it('returns 503 after longSyncTask blocks event loop', function(done) {
    this.timeout(4000);

    agent
      .get('/longSyncTask')
      .expect(/complete!/)
      .expect(200, function(err) {
        if (err) {
          done(err);
        }
      });

    setTimeout(function() {
      agent
        .get('/')
        .expect(503, done);
    }, 500);
  });

  it('process shuts down', function(done) {
    child.kill();

    child.on('close', function() {
      expect(child).to.have.property('result');
      var result = stripAnsi(child.result);

      expect(result).to.match(/ get \/ {} 503 /);

      done();
    });
  });

});
