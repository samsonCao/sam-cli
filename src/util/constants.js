const { name, version } = require('../../package.json');
// const org_name = 'vuejs';
// const org_repos_url = `https://api.github.com/orgs/${org_name}/repos`;

const org_name = 'sam-cli-org';
const org_repos_url = `https://api.github.com/orgs/${org_name}/repos`;

module.exports = {
    name,
    version,
    org_name,
    org_repos_url
};
