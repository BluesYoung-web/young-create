#! /usr/bin/env node
const json = require('./package.json');
const { program } = require('commander');
const shell = require('shelljs');
const fs = require('fs');

//检查控制台是否以运行`git `开头的命令
if (!shell.which('git')) {
  //在控制台输出内容
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}
program.version(json.version)
  .requiredOption('-F, --folder-name <name>', '请输入你想创建的目录名称')
  .requiredOption('-T, --template-name <name>', '请输入所需的项目模板名称')
  .parse(process.argv);

const options = program.opts();
const { folderName, templateName } = options;
const template = `https://gitee.com/BluseYoung-web/${templateName}.git`;

// 如果当前目录存在与模板名称相同的目录，删除
try {
  fs.statSync(templateName);
  shell.rm('-rf', templateName)
} catch (error) {
  null;
}

console.log('---开始下载模板文件---');
if (shell.exec(`git clone ${template}`).code === 0) {
  console.log('---下载成功---');
  // 如果当前目录存在
  try {
    fs.statSync(folderName);
    shell.rm('-rf', folderName);
  } catch (error) {
    null;
  }
  fs.renameSync(templateName, folderName);
  // 进入目标目录
  shell.cd(folderName);
  shell.exec('yarn');
  shell.echo(`
    # 进入项目目录
    cd ${folderName}
    # 运行项目
    yarn dev
  `);
} else {
  console.log('---下载失败---');
  shell.exec(1);
}
