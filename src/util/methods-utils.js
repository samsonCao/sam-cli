const axios = require('axios');           // 请求github仓库
const ora = require('ora');               // Node.js 终端加载动画效果
const { promisify } = require('util');     // 将异步api快速转成promise的形式
// 从节点下载并提取一个git存储库（GitHub，GitLab，Bitbucket）
let downLoadGit = require('download-git-repo');
downLoadGit = promisify(downLoadGit);

const { repositoryUrl, repositoryName} = require('./constants');

//获取仓库列表
const fetchRepoList = async () => {
// 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    const { data } = await axios.get( `${repositoryUrl}/${repositoryName}`);
    return data;
};

// 获取tag
const fetchTagList = async (repo) => {
    const { data } = await axios.get(`${repositoryUrl}/${repo}/tags`);
    return data; // 是一个tag数组 [{tag: 'xx', ...rest}, {tag: 'xx', ...rest}]
};

// 将文件下载到当前用户下的.template文件中，由于系统的不同目录获取方式不一样，
// process.platform 在windows下获取的是 win32 ，我这里是mac 所以获取的值是 darwin，
// 再根据对应的环境变量获取到用户目录
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

// 下载
const download = async (repo, tag) => {
    let api = `samsonCao/${repo}`; // samsonCao/react-iframe#v1.0.0或者v2.0.0 用户选择
    if (tag) {
        api += `#${tag}`;
    }
    const dest = `${downloadDirectory}/${repo}`; ///Users/iyb-caoyouzhi/.template/react-iframe
    await downLoadGit(api, dest);
    return dest;
};

const wrapFetchAddLoading = (fn, message) => async (...args) => {
    const spinner = ora(message);
    spinner.start(); // 开始loading
    const result = await fn(...args);
    spinner.succeed(); // 结束loading
    return result;
};

module.exports = {
    wrapFetchAddLoading,
    download,
    fetchTagList,
    fetchRepoList
}