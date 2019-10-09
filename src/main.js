const program = require('commander');
const path = require('path');
const chalk =require('chalk');

const { version, actionsMap } = require('./util/constants');

// 循环创建命令
Object.keys(actionsMap).forEach((action) => {
  program
    .command(action) // 命令的名称
    .alias(actionsMap[action].alias) // 命令的别名
    .description(actionsMap[action].description) // 命令的描述
    .action((cmd) => {
      if (action === '*') {
        console.log(`  ` + chalk.red(`${actionsMap[action].description} ${chalk.yellow(cmd)}`));
        console.log(`  Run ${chalk.cyan(`sam-cli <command> --help`)} for detailed usage of given command.`);
        console.log(`  `)
        console.log(`---------------------------------------`);
        console.log(`  `)
        program.outputHelp()
        // suggestCommands(cmd)
      } else {
        // 此处会自动截取输入的命令sam-cli command args.js的文件函数
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});

// sam-cli --help命令 给出帮助信息
program.on('--help', () => {
  console.log('Examples');
  Object.keys(actionsMap).forEach((action) => {
    (actionsMap[action].examples || []).forEach((example) => {
      console.log()
      console.log(`  Run ${chalk.cyan(`sam-cli <command> --help`)} for detailed usage of given command.`)
      console.log(`  ${chalk.cyan(`${example}`)}`);
      console.log()
    });
  });
});

// 获取版本号 sam-cli -V 这个代码需要放在下面上面的命令才会生效
program.version(version)
  .parse(process.argv);
