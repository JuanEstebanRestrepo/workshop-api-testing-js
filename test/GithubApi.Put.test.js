const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Follow a github user', () => {
  const urlBase = 'https://api.github.com';
  const username = 'aperdomob';

  describe('Follow a user', () => {
    let followQueryResponse;

    before(async () => {
      followQueryResponse = await agent.put(`${urlBase}/user/following/${username}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('response from follow a user', () => {
      expect(followQueryResponse.status).to.eql(statusCode.NO_CONTENT);
      expect(followQueryResponse.body).to.eql({});
    });

    describe('List who follow', () => {
      let user;

      before(async () => {
        const response = await agent.get(`${urlBase}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        user = response.body.find((list) => list.login === username);
      });

      it(`response from followed to ${username}`, () => assert.exists(user));
    });

    describe('Follow a user again', () => {
      let followUserAgainQueryResponse;

      before(async () => {
        followUserAgainQueryResponse = await agent.put(`${urlBase}/user/following/${username}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('Verify the idempotent', () => {
        expect(followUserAgainQueryResponse.status).to.eql(statusCode.NO_CONTENT);
        expect(followUserAgainQueryResponse.body).to.eql({});
      });

      describe('List who follow again', () => {
        let user;

        before(async () => {
          const userFollowQuery = await agent.get(`${urlBase}/user/following`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);

          user = userFollowQuery.body.find((list) => list.login === username);
        });

        it(`response from followed again to ${username}`, () => assert.exists(user));
      });
    });
  });
});
