

var pop = require("../mod/pop.js");
var Dialog = require("./idialog");
var loading = {
    _create : function(){
        var html = '<div class="m-loading">\
            <div class="loading-box" ><img src="http://amilystatic.me/image/loading.gif" ></div>\
            <div class="loading-text-box"><p class="loading-text">正在上传,请稍后...</p></div>\
        </div>';
        var dlg = new Dialog({
            content : html
        })
        dlg.hide();
        return dlg;
    },
    show : function(){
        if (!this._dlg) {
            this._dlg = this._create();
        }
        this._dlg.show();
    },
    hide : function(){
        this._dlg.hide();
    }
}


function create_upload(opt){
    var exts = opt.extensions || ["jpg","png","jpeg"];
    var exts_str = exts.join(",");
    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,html4',
         
        browse_button : opt.dom, // you can pass in id...
        //container: opt.container, // ... or DOM Element itself
         
        url : opt.url || "/api/upload",
        resize : {
            quality : 50
        }, 
        filters : {
            max_file_size : opt.size || '20mb',
            prevent_duplicates: true,
            mime_types: [
                {title : "选择("+exts_str+")格式的文件", extensions : exts_str }
            ]
        },
     
        // Flash settings
        flash_swf_url : '/upload/Moxie.swf',
        multi_selection : opt.multi_selection == void 0 ? true : opt.multi_selection,
     
        init: {
            PostInit: function() {
     
                /**
                document.getElementById('uploadfiles').onclick = function() {
                    uploader.start();
                    return false;
                };
                **/
            },
     
            FilesAdded: function(up, files) {
                //plupload.each(files, function(file) {
                //    console.log("file",file.id);
                //});
                if (opt.check ){
                    if( opt.check(files,up)) {
                        uploader.start();
                        opt.start && opt.start(up,files);
                        loading.show();
                    }
                } else {
                    uploader.start();
                    opt.start && opt.start(up,files); 
                    loading.show();
                }
            },
     
            UploadProgress: function(up, file) {
                //console.log("progress===",file.percent);
               // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            },
     
            Error: function(up, err) {
                loading.hide();
                alert(err.message);
                //document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                
            },
            UploadFile : function(up,flie){
            },
            FileUploaded : function(up,files,res){
                var _status = res.status;
                loading.hide();
                if (_status == 200) {
                    var txt = res.response;
                    var data = eval("("+txt+")");
                    opt.callback && opt.callback(data,files);
                }
                //console.log("this  ====",arguments);
            }
        }
    });
     
    uploader.init();

    return uploader;
}


module.exports = {
    create_upload : create_upload
}

