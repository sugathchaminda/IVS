const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../app');

chai.should();

chai.use(chaiHttp);

describe('User info API with invalid JSON', () => {
    it('with invalid json returns a 400', done => {
        request(app).get('/echo')
            .send('{"invalid"}')
            .type('json')
            .expect('Content-Type', /json/)
            .end((_err, res) => {
                done();
            });
    });
});

describe('User Info API', () => {
    describe('GET /echo', () => {
        it('It should GET user response', done => {
            chai.request(app)
                .get('/echo')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.data.ipAddress.should.be.eq('::ffff:127.0.0.1');
                    done();
                });
        });

        it('It should GET user agent and ip address', done => {
            chai.request(app)
                .get('/echo')
                .end((err, response) => {
                    response.body.data.ipAddress.should.be.eq('::ffff:127.0.0.1');
                    response.body.data.userAgent.should.be.eq('node-superagent/3.8.3');
                    done();
                });
        });

        it('It should NOT GET user response', done => {
            chai.request(app)
                .get('/echos')
                .end((err, response) => {
                    response.should.have.status(500);
                    done();
                });
        });
    });
});
