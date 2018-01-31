/**
 * 关于预览实现相关的代码。
 */

let express = require('express');
let path = require('path');
let markdowner = require('markdown-it');
let fs = require('fs');
let rd = require('rd');

var md = new markdowner({
    html: true,
    langPrefix: 'code-',
});




module.exports = function(dir) {
    dir = dir || '.';

    // 初始化服务器
    var app = express();
    var router = express.Router();
    app.use(router);

    // 渲染文章
    router.get('/posts/*', function(req, res, next){
        
        var name = stripExtname(req.params[0]);
        var file = path.resolve(dir, '_posts', name+'.md');
        console.log('---dir--', dir);
        console.log('---name--', name);
        console.log('---file--', file); 

        fs.readFile(file, function(err, content){
            if(err){
                console.log('读取文件失败！');
                res.end(JSON.stringify(err)+"\n");
                return next(err);
            }
            res.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
            var html = markdownTOHTML(content.toString());
            console.log('读取文件成功， 解析后的内容为：\n', html);
            res.end(html);
        });

        // res.end(req.params[0]);
    });

    // 渲染列表
    router.get('/', function(req, res, next){
        var sourcefolder = path.resolve(dir, '_posts');
        rd.readFile(sourcefolder, function(err, files){
            if(err){
                console.log('读取文件夹内文件失败！');
                return next(err);
            }
            res.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
            var html = "<html><h1>Markdown 转 HTML 实时预览</h1><hr><br />";
            files.forEach(function(filepath){
                html += "<a href='/posts/"+ get_file_name(filepath) +".md' target='_blank'>"+get_file_name(filepath)+"</a><br /><br />";
            });
            html += "</html>";
            res.end(html);
        }); 


        // res.end('list of articles.');
    });

    app.listen(8080);
};


function stripExtname(name) {
    var i = 0-path.extname(name).length;
    if(i==0) i=name.length;
    return name.slice(0, i);
}

function get_file_name(fullname){
    var ls = fullname.toString().split('\\');
    var filename =  ls[ls.length-1].split('.');
    // console.log('ls--', ls);
    // console.log('filename--', filename);
    return filename[0];
}

function markdownTOHTML(content) {
    return md.render(content||'');
}