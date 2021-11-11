const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');

chai.use(require('chai-subset'));

const { expect } = chai;

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

const urlBase = 'https://api.github.com';

describe('Get the logged in user to Github', () => {
  describe('Create a gist', () => {
    let gist;

    const createGist = {
      description: 'this is an example about promise',
      public: true,
      files: {
        'promise.js': {
          content: jsCode
        }
      }
    };

    let newGistQueryResponse;

    before(async () => {
      newGistQueryResponse = await agent
        .post(`${urlBase}/gists`, createGist)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      gist = newGistQueryResponse.body;
    });

    it('Gist should be created', () => {
      expect(newGistQueryResponse.status).to.equal(statusCode.CREATED);
      expect(gist).to.containSubset(createGist);
    });

    describe('Get the new gist', () => {
      let gistQueryResponse;

      before(async () => {
        gistQueryResponse = await agent
          .get(gist.url)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('Gits should be accessible', () => expect(gistQueryResponse.status).to.equal(statusCode.OK));

      describe('Delete a gist', () => {
        let deleteGistQuery;

        before(async () => {
          deleteGistQuery = await agent
            .del(gist.url)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('Gist should be deleted', () => expect(deleteGistQuery.status).to.equal(statusCode.NO_CONTENT));
      });

      describe('Try to get the delete gist', () => {
        let responseStatus;

        before(async () => {
          try {
            await agent
              .get(gist.url)
              .set('User-Agent', 'agent')
              .auth('token', process.env.ACCESS_TOKEN);
          } catch (response) {
            responseStatus = response.status;
          }
        });

        it('Gits should not be accessible', () => {
          expect(responseStatus).to.equal(statusCode.NOT_FOUND);
        });
      });
    });
  });
});
