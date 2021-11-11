const agent = require('superagent');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Get the logged in user to Github', () => {
  let user;

  before(async () => {
    const response = await agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    user = response.body;
  });

  it('Have public repositories', () => {
    expect(user.public_repos).to.be.above(0);
  });

  describe('List of all repositories', () => {
    let firstRepository;

    before(async () => {
      const response = await agent.get(user.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      const { body } = response;
      firstRepository = body.pop();
    });

    it('First repository', () => {
      expect(firstRepository).to.not.equal(undefined);
    });
    describe('Create a new issue', () => {
      const newIssue = { title: 'This is the title of the issue' };
      const updateIssue = { body: 'This is the body of the issue' };
      let issue;

      before(async () => {
        const response = await agent.post(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues`, newIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        issue = response.body;
      });

      it('Issue was created', () => {
        expect(issue.id).to.not.equal(undefined);
        expect(issue.title).to.equal(newIssue.title);
        expect(issue.body).to.equal(null);
      });

      describe('Issue was modified', () => {
        let modifiedIssue;

        before(async () => {
          const response = await agent.patch(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues/${issue.number}`, updateIssue)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');

          modifiedIssue = response.body;
        });

        it('The body was added', () => {
          expect(modifiedIssue.title).to.equal(newIssue.title);
          expect(modifiedIssue.body).to.equal(updateIssue.body);
        });
      });
    });
  });
});
