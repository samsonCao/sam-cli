const program = require('commander');
const path = require('path');

const { version } = require('./util/constants');

// 创建模板
const actionsMap = {
  create: {
    description: 'create project',
    alias: 'cr',
    examples: [
      'sam-cli create <template-name>',
    ],
  },
  '*': {
    description: 'command not found',
  },
};

// 循环创建命令
Object.keys(actionsMap).forEach((action) => {
  program
    .command(action) // 命令的名称
    .alias(actionsMap[action].alias) // 命令的别名
    .description(actionsMap[action].description) // 命令的描述
    .action(() => {
      if (action === '*') {
        console.log(actionsMap[action].description);
      } else {
        // 此处会自动截取输入的命令sam-cli create project，然后执行create.js的文件函数
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});

// sam-cli --help命令 给出帮助信息
program.on('--help', () => {
  console.log('Examples');
  Object.keys(actionsMap).forEach((action) => {
    (actionsMap[action].examples || []).forEach((example) => {
      console.log(`  ${example}`);
    });
  });
});

// 获取版本号 sam-cli -V 这个代码需要放在下面上面的命令才会生效
program.version(version)
  .parse(process.argv);
