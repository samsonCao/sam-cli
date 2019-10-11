这是一个练习开发脚手架的项目

#### 全局安装
```markdown
npm install -g samtest-cli
```

#### 目前实现了的功能

- 查看代码仓库的项目列表 `sam-cli list`
- 从git仓库拉取项目模板到本地  `sam -cli create <project-name>`
- 查看帮助信息 `sam-cli --help`
- 查看版本信息 `sam-cli -V`


#### 用到的第三方依赖包
- axios： ajax请求的工具
- chalk： 用于高亮终端打印出来的信息
- commander： 用来处理命令行的工具
- consolidate： 支持各种模板引擎的渲染
- download-git-repo： 用于下载远程仓库至本地 支持GitHub、GitLab、Bitbucket
- ejs： 一种模板库
- fs-extra： fs的升级版
- inquirer： 用于命令行与开发者交互
- metalsmith： 静态网站生成器
- ncp：拷贝下载的文件
- ora： 用于命令行上的加载效果
- path： 获取路径
- util： 将异步api快速转成promise的形式


#### 说明：
-  通过`package.json`下的 `bin` 字段定义命令名和关联执行文件
。本项目定义的命令名是 `sam-cli`,关联的可执行文件时 `./bin/www`
-  经过这样配置的nodejs项目，在使用-g选项进行全局安装的时候，会自动在系统的[prefix]/bin目录下创建相应的符号链接（symlink）关联到执行文件。如果是本地安装，这个符号链接会生成在./node_modules/.bin目录下
-  本地开发时执行 `npm link ` 关联相关的命令
-  通过 `npm list -g --depth 0` 可查看到全局的命令，其中包含了
`sam-cli` 说明本地链接成功了，此时可以执行 `sam-cli` 命令


#### 用于测试的自建代码仓库：
-  https://github.com/sam-cli-org

参考资料:
-  https://github.com/vuejs-templates
-  https://juejin.im/post/5ac1e8036fb9a028bb192789#heading-26
-  https://juejin.im/post/5d650613f265da03951a0364#comment
-  https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli

bugs:

- v1.x.xtag标签的描述，描述2 tag标签存在中文逗号 `，`时，选择tag解析错误
