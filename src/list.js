const chalk =require('chalk');

const {
    wrapFetchAddLoading,
    fetchRepoList
} = require('./util/methods-utils');

module.exports = async function() {
    let repos = await wrapFetchAddLoading(fetchRepoList, '获取项目模板列表')();
    if (repos && repos.length) {
        // console.log(`可用的项目模板列表：`)
        repos.forEach(item => {
            const { name, description } = item;
            console.log(chalk.green(`  * ${name} - ${description}`));
        });
    } else {
        console.log(chalk.red('  暂无可用的项目模板'));
    }
};