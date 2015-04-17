var gulp = require('gulp');
var connect = require("gulp-connect");
var url = require("url");
var sass = require("node-sass");
var path = require("path");
var browserify = require('browserify-middleware');

var SASS_REG = /styles\/exports\/(.+)\.scss$/;
var JS_REG = /scripts\/page\/(.+)\.js$/;

var sass_middle = function(req, res, next){
    var qurl = req.url;
    var url_obj = url.parse(qurl);
    if (url_obj.pathname.match(SASS_REG)) {
        var file_path = path.join(__dirname,'../src',url_obj.pathname);
        sass.render({
            file : file_path,
            success: function(result) {
                res.setHeader("Content-Type", "text/css");
                // result is an object: v2 change 
                res.write(result.css);
                res.end();
            },
            error: function(error) {
                // error is an object: v2 change 
                console.log(error.message);
                console.log(error.code);
                console.log(error.line);
                console.log(error.column); // new in v2 
            }

        });
    } else {
        next();
    }
    //res.send('USER');
    //next();
}
 
module.exports = {
    init : function(){
        var file_path = path.join(__dirname,'../src/');
        connect.server({
            root : "src",
            port: 8321,
            middleware : function(connect, opt){
                return [sass_middle,browserify("./src/scripts/page/",{
                   grep : JS_REG,
                   path : file_path
                })];
            }
        })
    }

}


