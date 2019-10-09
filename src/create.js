const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra'); // fs的升级版
const chalk = require('chalk');

// 将异步api快速转成promise的形式~
const { promisify } = require('util');
let downLoadGit = require('download-git-repo');

downLoadGit = promisify(downLoadGit);

// 拷贝下载的文件
let ncp = require('ncp');

ncp = promisify(ncp);

// 遍历文件夹
const MetalSmith = require('metalsmith');
let { render } = require('consolidate').ejs;

render = promisify(render); // 包装渲染方法

// 1).获取仓库列表
const fetchRepoList = async () => {
// 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  const { data } = await axios.get('https://api.github.com/repos/samsonCao/react-iframe');
  return data;
};

// 获取tag
const fetchTagList = async (repo) => {
  // repo = react-iframe
  // https://api.github.com/repos/samsonCao/react-iframe/tags
  const { data } = await axios.get(`https://api.github.com/repos/samsonCao/${repo}/tags`);
  return data; // 是一个tag数组 [{tag: 'xx', ...rest}, {tag: 'xx', ...rest}]
};

// 将文件下载到当前用户下的.template文件中，由于系统的不同目录获取方式不一样，
// process.platform 在windows下获取的是 win32 ，我这里是mac 所以获取的值是 darwin，
// 再根据对应的环境变量获取到用户目录
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

const download = async (repo, tag) => {
  let api = `samsonCao/${repo}`; // samsonCao/react-iframe#v1.0.0或者v2.0.0 用户选择
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
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


module.exports = async (projectName) => {
  
  // 获取仓库信息，并获取仓库名字
  let repos = await wrapFetchAddLoading(fetchRepoList, 'fetching repo list')();
  // console.log(repos, 'repos')
  // repos = repos.map((item) => item.name);
  repos = [repos.name];
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: repos,
  });
  // 打印出被选中的项目模板名称给用户看
  console.log(`  ` + chalk.green(`选择了版本`+ repo));


  // 获取tag信息 确定使用哪个版本的仓库
  let tags = await wrapFetchAddLoading(fetchTagList, 'fetching tag list')(repo);
  tags = tags.map((item) => item.name);
  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choice tag template to create project',
    choices: tags,
  });
  // 打印出被选中的tag给用户看
  console.log(`  ` + chalk.green(`选择了tag ` + tag));

  // 获取当前路径下的文件夹列表，判断当前命名的projecrName是否存在
  const currentFiles = fs.readdirSync(path.resolve()) || [];
  const currentDicts = currentFiles.filter(item => fs.lstatSync(path.resolve() + `/${item}`).isDirectory())
  const hasProjecrName = currentDicts.includes(projectName);
  console.log(hasProjecrName,'hasProjecrName');

  // 如果是当前目录创建项目，给个confirm提示
  if (hasProjecrName) {
    const { ok } = await Inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `Generate project in current directory?/已存在该文件夹，是否创建`
      }
    ])
    if (!ok) {
      return
    } else {
      const { action } = await Inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(path.join(path.resolve(), projectName))} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(path.join(path.resolve(), projectName))}...`)
        await fs.remove(path.join(path.resolve(), projectName));
        console.log(chalk.cyan(`删除成功，正在下载新模板`))
      }
    }
  }

  // 下载项目
  const target = await wrapFetchAddLoading(download, 'download template')(repo, tag);

  // 将下载的文件拷贝到当前执行命令的目录下
  await ncp(target, path.join(path.resolve(), projectName));

  // 没有ask文件说明不需要编译
  if (!fs.existsSync(path.join(target, 'ask.js'))) {
    await ncp(target, path.join(path.resolve(), projectName));
  } else {
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname)
        .source(target) // 遍历下载的目录
        .destination(path.join(path.resolve(), projectName)) // 输出渲染后的结果
        .use(async (files, metal, done) => {
          // 弹框询问用户
          const result = await Inquirer.prompt(require(path.join(target, 'ask.js')));
          console.log(result, 'ask-result')
          const data = metal.metadata();
          console.log(data, 'ask-data-metal.metadata')
          Object.assign(data, result); // 将询问的结果放到metadata中保证在下一个中间件中 可以获取到
          delete files['ask.js'];
          done();
        })
        .use((files, metal, done) => {
          // 类似Object.keys 但是包括方法属性
          Reflect.ownKeys(files).forEach(async (file) => {
            let content = files[file].contents.toString(); // 获取文件中的内容
            if (file.includes('.js') || file.includes('.json')) { // 如果是js或者 json才有可能是模板
              if (content.includes('<%')) { // 文件中用<% 我才需要编译
                content = await render(content, metal.metadata()); // 用数据渲染模板
                files[file].contents = Buffer.from(content); // 渲染好的结果替换即可
              }
            }
          });
          done();
        })
        .build((err) => {
          if (!err) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }
};
