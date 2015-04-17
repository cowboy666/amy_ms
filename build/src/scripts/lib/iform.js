var $ = require('./jquery');
require('./jvalidator/src/index.js');
require("./icheckbox");
require("./y-selector");
require("./jquery.placeholder.js");
var undef;
var create_tip = function(){
    var html = '<div class="m-tip m-up-tip m-alert-tip hide">\
            <div class="m-tip-trg">\
                <div class="trg-out"></div>\
                <div class="trg-in"></div>\
            </div>\
            <div class="m-tip-content">\
                <p></p>\
            </div>\
        </div>';
    var dom = $(html);
    return dom; 
}

var Form = function(opt){
    this._$form = opt.dom;
    this._data_map = opt.data_map;    
    this._jv_suc = opt.jv_suc;
    this._jv_err = opt.jv_err;
    this._cus_jv = opt.jv_custom || $.noop;
    this.init();
}

Form.prototype.init = function(){
    var me = this ,
        jv = this._$form.jvalidator();
    this._jv = jv;
    jv.when(["blur"]);
    jv.success(me._jv_suc || function(){
        var $d = $(this.element);
        if ($d.data("show-error")) {
            var err_dom = $d.data('error-dom');
            err_dom && err_dom.hide();
        }
        $(this.element).removeClass("error");
    });

    jv.fail(function( $event , errors ){
        var $d = $(this.element);
        var msg = "";
        for(var i=0,l=errors.length ;i < l;i++){
            if (!errors[i].result) {
                msg = errors[i].getMessage();
                break;
            }
        }
        me.show_error($d,msg);
    }); 

    this._cus_jv(jv);
    this._$form.find("select").yselector();
    this._$form.find("div[data-checkbox]").checkbox();
    this._$form.find("input[placeholder],textarea[placeholder]").placeholder();
    this._listen_dom_event();
}

Form.prototype.show_error = function($d,msg){
    var t;
    if (t = $d.data("show-error")) {
        var err_dom = $d.data("error-dom");
        if (!err_dom) {
            $d.data("error-dom",(err_dom = create_tip()));
            var $p = $d.parent();
            var $w = $p.width();
            err_dom.width($w);
            $p.append(err_dom);
        }
        err_dom.find("p").text(msg);
        err_dom.show();
    }
    $d.addClass("error");

}

Form.prototype._listen_dom_event = function(){
    var me = this;
    this._$form.on("submit",function(e){
        e.preventDefault();
        me.submit();
    })
}

Form.prototype._prase_form_val = function(){
    var data_map = this._data_map,
        $form = this._$form;
    var data = {};
    for(var key in data_map ){
        var obj = data_map[key];
        if($.type(obj) === "string"){
           data[key] = $form.find(obj).val() || undef;
        } else if ($.type(obj) === "object") {
           data[key] = obj.val($form.find(obj.cls));
        }
    }
    return data;
}
Form.prototype.submit = function(args_obj){
     var me = this;
     me._jv.validateAll(function( result , elements ){
        if( result ) {
            var data = me._prase_form_val();
            me._$form.trigger("form-submit",[data,args_obj]);
        } 
    });

}

$.fn.form = function(opt){
    opt = opt || {};
    this.each(function () {
        var $this = $(this),
            data = $this.data("iform");

        if (!data) {
            var _opt = $.extend({
                dom : $this
            },opt);
            $this.data("iform",(data = (new Form(_opt))));
        }
    });   
}



