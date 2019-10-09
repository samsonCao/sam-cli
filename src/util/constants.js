const { name, version } = require('../../package.json');

const repositoryUrl = 'https://api.github.com/repos/samsonCao';
const repositoryName = 'react-iframe';
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
  repositoryUrl,
  repositoryName,
  actionsMap
};
