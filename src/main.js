const program = require('commander');
const path = require('path');
const chalk =require('chalk');

const { version } = require('./util/constants');

program
    .command('create') // 命令的名称
    .alias('cr') // 命令的别名
    .description('新建一个项目') // 命令的描述
    .action(() => {
        require(path.resolve(__dirname, 'create'))(...process.argv.slice(3));
    });

program
    .command('list') // 命令的名称
    .alias('ls') // 命令的别名
    .description('查看所有模板的列表和描述信息') // 命令的描述
    .action(() => {
        require(path.resolve(__dirname, 'list'))(...process.argv.slice(3));
    });

// 执行sam-cli时，没有输入参数，显示的description帮助信息
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// sam-cli --help命令 给出帮助信息
program.on('--help', () => {
    console.log('Examples');
    console.log(`  执行 ${chalk.cyan('sam-cli create <project-name>')} 创建新项目`);
    console.log(`  执行 ${chalk.cyan('sam-cli list')} 查看现有的项目模板列表`);
    console.log();
});

// 获取版本号 sam-cli -V
program.version(version)
    .parse(process.argv);
