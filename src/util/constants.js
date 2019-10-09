const { name, version } = require('../../package.json');
const org_name = 'vuejs';
const org_repos_url = `https://api.github.com/orgs/${org_name}/repos`;

// 创建模板
const actionsMap = {
  create: {
    description: 'create project',
    alias: 'cr',
    examples: [
      'sam-cli create <template-name>',
    ],
  },
  add: {
    description: 'add demo',
    alias: 'ad',
    examples: [
      'sam-cli add <command>',
    ],
  },
  '*': {
    description: 'Unknown command',
  },
};
module.exports = {
  name,
  version,
  org_name,
  org_repos_url,
  actionsMap
};
