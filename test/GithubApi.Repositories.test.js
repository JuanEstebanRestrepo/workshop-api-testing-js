const agent = require('superagent');
const statusCode = require('http-status-codes');

const md5 = require('md5');

const chai = require('chai');
chai.use(require('chai-subset'));

const { expect, assert } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
let responseReposURL;
let repository;
const expectedRepository = 'jasmine-awesome-report';

describe('Github Api Test', () => {
  describe('Repositories', () => {
    it('Via OAuth2 aperdomob', async () => {
      const response = await agent.get(`${urlBase}/users/${githubUserName}`)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).equal('Alejandro Perdomo');
      expect(response.body.company).equal('Perficient Latam');
      expect(response.body.location).equal('Colombia');

      responseReposURL = response.body.repos_url;
    });

    it('Via OAuth2 aperdomob Repos URl', async () => {
      const responseRepos = await agent.get(responseReposURL)
        .set('User-Agent', 'agent');

      repository = responseRepos.body.find((element) => element.name === expectedRepository);

      it(`then should have ${expectedRepository} repository`, () => {
        assert.exists(repository);
        expect(repository.full_name).equal('aperdomob/jasmine-awesome-report');
        expect(repository.private).equal(false);
        expect(repository.description).equal('An awesome html report for Jasmine');
      });

      describe('Download repository', () => {
        const noExpectedMd5 = 'd41d8cd98f00b204e9800998ecf8427e';
        let zip;
        before(async () => {
          const downloadQueryResponse = await agent.get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent')
            .buffer(true);

          zip = downloadQueryResponse.text;
        });

        it('then the repository should be downloaded', () => {
          expect(md5(zip)).to.not.equal(noExpectedMd5);
        });
      });

      describe('Get file list', () => {
        const format = {
          name: 'README.md',
          path: 'README.md',
          sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
        };

        let files;
        let readme;

        before(async () => {
          const readmeFileQueryResponse = await agent.get(`${repository.url}/contents`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');

          files = readmeFileQueryResponse.body;
          readme = files.find((file) => file.name === 'README.md');
        });

        it('README.md file', () => {
          assert.exists(readme);
          expect(readme).containSubset(format);
        });

        describe('File content', () => {
          const expectedMd5 = '97ee7616a991aa6535f24053957596b1';
          let fileContent;

          before(async () => {
            const downloadReadmeQuery = await agent.get(readme.download_url);
            fileContent = downloadReadmeQuery.text;
          });

          it('File should be downloaded', () => {
            expect(md5(fileContent)).to.equal(expectedMd5);
          });
        });
      });
    });
  });
});
