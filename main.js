/**
 * 一个命令行工具库。
 */

let commander = require('commander');

// help 命令
commander.command('help')
         .description('显示工具如何使用的帮助信息')
         .action(function(){
             commander.outputHelp();
         });

// create 命令
commander.command('create [dirname]')
         .description('创建一个空的博客')
         .action(function(dirname){
            console.log(dirname+' 创建完成。')
         });

// preview 命令
commander.command('preview [dirname]')
         .description('预览获取到的Markdown文件夹内容')
        //  .action(function(dirname){
        //     console.log(' preview of %s', dirname);
        //  });
         .action(require('./cmd_preview'));

// build 命令
commander.command('build [dirname]')
         .description('根据给定的文件夹路径生成HTML内容.')
         .option('-o OR --output <dirname>', '导出生成的HTML存放的路径')
        //  .action(function(dirname){
        //     console.log('build based on %s', dirname);
        //  });
        .action(require('./cmd_build'));

// 解析相关命令
commander.parse(process.argv);