
'use strict';

var path = require('path');
var fs = require('fs');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('3. Event loop unavailability, e. express, streams', function() {
  var child, agent;
  var baseDir = path.join(__dirname, '../../../demos/3. Event loop unavailability/');
  var loadData = function(file) {
    return JSON.parse(fs.readFileSync(file).toString());
  };

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(baseDir, 'e. express, streams');

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

  it('returns 200 on upload of big file', function(done) {
    var data = loadData(path.join(baseDir, 'data/big.json'));

    agent
      .post('/uploadData')
      .send(data)
      .expect({length: 110})
      .expect(200, done);
  });

  it('returns 200 on upload of huge file', function(done) {
    var data = loadData(path.join(baseDir, 'data/huge.json'));

    agent
      .post('/uploadData')
      .send(data)
      .expect({length: 6300})
      .expect(200, done);
  });

  it('download returns 200 and huge.json as it exists on disk', function(done) {
    var data = loadData(path.join(baseDir, 'data/huge.json'));

    agent
      .get('/downloadData')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
        if (err) {
          return done(err);
        }

        expect(data).to.deep.equal(res.body);
        done();
      });
  });

  it('process shuts down', function(done) {
    child.kill();

    child.on('close', function() {
      expect(child).to.have.property('result');

      done();
    });
  });

});
