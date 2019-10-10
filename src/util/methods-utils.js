const axios = require('axios');           // 请求github仓库
const ora = require('ora');               // Node.js 终端加载动画效果
const { promisify } = require('util');     // 将异步api快速转成promise的形式
// 从节点下载并提取一个git存储库（GitHub，GitLab）
let downLoadGit = require('download-git-repo');
downLoadGit = promisify(downLoadGit);

const { org_repos_url, org_name } = require('./constants');

// 将文件下载到当前用户下的.template文件中，由于系统的不同目录获取方式不一样，
// process.platform 在windows下获取的是 win32 ，我这里是mac 所以获取的值是 darwin，
// 再根据对应的环境变量获取到用户目录
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;


// 根据选择的repo获取对应的tags列表
const getOrgRepoTagsUrl = (repo) => `https://api.github.com/repos/${org_name}/${repo}/tags`;

//获取仓库列表
const fetchRepoList = async () => {
// 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    try {
        const { data } = await axios.get(org_repos_url);
        return data;
    } catch (e) {
        console.log('请求当前github repos 失败');
        return false;
    }
};

// 获取tag
const fetchTagList = async (repo) => {
    const { data } = await axios.get(getOrgRepoTagsUrl(repo));
    return data; // 是一个tag数组 [{tag: 'xx', ...rest}, {tag: 'xx', ...rest}]
};

// 下载
const download = async (repo, tag) => {
    let api = `${org_name}/${repo}`;
    if (tag) {
        api += `#${tag}`;
    }
    const dest = `${downloadDirectory}/${repo}`; ///Users/iyb-caoyouzhi/.template/repo;
    await downLoadGit(api, dest);
    return dest;
};

// 函数柯里化，执行fn时做一些美化处理
const wrapFetchAddLoading = (fn, message) => async (...args) => {
    const spinner = ora(message);
    spinner.start(); // 开始loading
    try{
        const result = await fn(...args);
        if (!result) {
            spinner.fail('获取数据失败');
            return false;
        }
        spinner.succeed(); // 结束loading
        return result;
    }catch (e) {
        spinner.fail('获取数据失败');
    }
};

// 中文转码encodeURIComponent
const utf8ToEncodeURI = (str) => {
    if (!str) {
        return;
    }
    return String(str).replace(/([\u4e00-\u9fa5])/g, (str) => encodeURIComponent(str));
};

module.exports = {
    wrapFetchAddLoading,
    download,
    fetchTagList,
    fetchRepoList,
    utf8ToEncodeURI
};