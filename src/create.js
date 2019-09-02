const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');

// 1).获取仓库列表
const fetchRepoList = async () => {
// 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    const { data } = await axios.get('https://api.github.com/repos/samsonCao/react-iframe');
    return data;
};

const fetchTagList = async (repo) => {
    const { data } = await axios.get(`https://api.github.com/repos/samsonCao/${repo}/tags`);
    return data;
};

const wrapFetchAddLoading = (fn, message) => async (...args) => {
    const spinner = ora(message);
    spinner.start(); // 开始loading
    const result = await fn(...args);
    spinner.succeed(); // 结束loading
    return result;
};


module.exports = async (projectName) => {

    // 获取仓库信息，并获取仓库名字
    let repos = await wrapFetchAddLoading(fetchRepoList, 'fetching repo list')();

    // console.log(repos, 'repos')
    // repos = repos.map((item) => item.name);
    repos = [ repos.name ];

    const { repo } = await  Inquirer.prompt({
        name: 'repo',
        type: 'list',
        message: 'please chilce repo template to create project',
        choices: repos
    });

    // 打印出被选中的项目模板名称
    console.log(repo);

    // 获取tag信息 确定使用哪个版本的仓库
    let tags = await wrapFetchAddLoading(fetchTagList, 'fetching tag list')(repo);

    tags = tags.map(item => item.name);
    console.log(tags,12312);

    const { tag } = await  Inquirer.prompt({
        name: 'tag',
        type: 'list',
        message: 'please choice tag template to create project',
        choices: tags
    })
    // 打印出被选中的tag
    console.log(tag);
};
