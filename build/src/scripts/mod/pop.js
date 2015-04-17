var Dialog = require("../lib/idialog");


var pop = function(content){
    var dlg = new Dialog({
        content : content
    });
    dlg.hide();
    return dlg;
}


var alert_dlg , confirm_dlg ;
var obj = {

    alert : function(msg){
        if (!alert_dlg) {
            var html = '<div class="m-pop m-pop-alert">\
                    <div class="m-pop-bd ">\
                        <p class="alert-ct js_content">'+msg+'</p>\
                    </div>\
                    <div class="m-pop-ft">\
                        <div class="btn-wrap">\
                            <button class="btn-cfr js_close">确定</button>\
                        </div>\
                    </div>\
                </div>';
            alert_dlg = pop(html);
        } else {
            alert_dlg.getContent().text(msg);
        }
        alert_dlg.show();
        return alert_dlg;
    },
    confirm : function(msg,suc,err){
          suc = suc || function(){};
          err = err || function(){};

          if (!confirm_dlg) {
            var html = '<div class="m-pop m-pop-alert">\
                    <div class="m-pop-bd ">\
                        <p class="alert-ct js_content">'+msg+'</p>\
                    </div>\
                    <div class="m-pop-ft">\
                        <div class="btn-wrap">\
                            <button class="btn-cfr">确定</button>\
                            <button class="btn-cancel">取消</button>\
                        </div>\
                    </div>\
                </div>';
            confirm_dlg = pop(html);
        } else {
            confirm_dlg.getContent().text(msg);
        }
        var $d1 = confirm_dlg.getDlgDom().find(".btn-cfr").click(function(){
            confirm_dlg.hide();
            suc && suc(); 
            $d1.unbind(); 
            $d2.unbind(); 
        });
        var $d2 = confirm_dlg.getDlgDom().find(".btn-cancel").click(function(){
            confirm_dlg.hide();
            $d1.unbind(); 
            $d2.unbind(); 
            err && err();
        });
        confirm_dlg.show(); 
    },
    hd_dlg : function($dom,title,cb,close_fn){
        var $wrap =  $('<div class="m-pop">\
                    <div class="m-pop-hd"><a href="javascript:;" class="hd-close js_close">&times;</a><h4>'+title+'</h4></div>\
                    <div class="m-pop-bd ">\
                        <div class="js_content"></div>\
                    </div>\
                    <div class="m-pop-ft">\
                        <div class="btn-wrap">\
                            <button class="btn-cfr">确定</button>\
                        </div>\
                    </div>\
                </div>');   
        var dlg = new Dialog({
            content : $wrap,
            close_fn : function(){
                dlg.remove();
                close_fn && close_fn();
            }
        });
        $wrap.find(".btn-cfr").click(function(e){
            e.preventDefault();
            cb && cb(dlg.getContent(),dlg);
        });
        dlg.getContent().html($dom);
        dlg.hide();
        return dlg;
    },
    dlg : function(content,maskVisible){
        var dlg = new Dialog({
            content : content,
            maskVisible : !!maskVisible
        });
        dlg.hide();
        return dlg;
    }
}

module.exports = obj;


