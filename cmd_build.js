/**
 * 实现Markdown文件到HTML文件的转换。
 */

let markdowner = require('markdown-it');
let rd = require('rd');
let path = require('path');
let fs = require('fs');

var md = new markdowner({
    html: true,
    langPrefix: 'code-',
})


module.exports = function(dir) {
    dir = dir || '.';
    console.log('当前文件路径为：', dir);

    // 读取出给定目录下的所有的文件
    // 将所有Markdown文件依次转成HTML页面，并进行保存操作。
    get_files_by_dir(dir);
}

function get_files_by_dir(dir) {
    // 计算出源文件的路径
    var sourcedir = path.resolve(dir, '_posts');
    var publicdir = path.resolve(dir, 'public');
    rd.readFile(sourcedir, function(err, files){
        if(err){
            console.log('读取文件夹内容失败！');
            return;
        }
        // 遍历文件夹列表，对每一个文件执行渲染操作。
        files.forEach(function(file){
            var html = md2html(file);
            var filename = get_filename_by_path(file);
            var output = path.resolve(publicdir, filename+'.html');
            console.log('保存路径为：', output);
            save_html_content(html, output);
            console.log('%s.html 生成成功！', filename);
        });
    });
}

function md2html(filepath){
    var content = fs.readFileSync(filepath);
    var html = md.render(content.toString()||'');
    return "<html><head><meta charset='UTF-8'><title>"+get_filename_by_path(filepath)+"</title></head>"+html+"</html>";
}

function save_html_content(content, outpath){
    fs.writeFile(outpath, content, function(err){
        if(err){
            console.log('save_html_content: 保存文件内容失败！');
            return;
        }
        console.log('save_html_content: %s 保存成功！', outpath);
    });
}

function get_filename_by_path(filepath){
    var paths = filepath.toString().split('\\');
    return paths[paths.length-1].split('.')[0];
}