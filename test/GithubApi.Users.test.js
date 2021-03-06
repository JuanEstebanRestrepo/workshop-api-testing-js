const agent = require('superagent');
const responseTime = require('superagent-response-time');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Get the logged in user to Github', () => {
  describe('when gets all users', () => {
    let queryTime;
    let allUsersResponse;

    before(async () => {
      allUsersResponse = await agent
        .get(`${urlBase}/users`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      const usersQuery = await agent
        .get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .use(responseTime((request, time) => {
          queryTime = time;
        }));

      return usersQuery;
    });

    it('Have a quick response', () => expect(queryTime).to.be.at.below(5000));
    it('Contain thirty users by default pagination', () => expect(allUsersResponse.body.length).to.equal(30));

    describe('Filters the number of users to 10', () => {
      let users;

      before(async () => {
        const queryResponse = await agent
          .get(`${urlBase}/users`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent')
          .query({ per_page: 10 });

        users = queryResponse.body;
      });

      it('Number of filtered users should be equals to 10', () => expect(users.length).to.equal(10));
    });

    describe('Filters the number of users to 100', () => {
      let users;

      before(async () => {
        const oneHundredUsersQuery = await agent
          .get(`${urlBase}/users`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent')
          .query({ per_page: 100 });

        users = oneHundredUsersQuery.body;
      });

      it('Number of filtered users should be equals to 100', () => expect(users.length).to.equal(100));
    });
  });
});
