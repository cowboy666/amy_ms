(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/scripts/page/subject_add.js":[function(require,module,exports){
var $ = require("../lib/jquery.js");
var Uploader = require("../lib/iupload.js");
var http = require("../mod/http.js");
require("../lib/iform.js");
var url_params = require("../lib/search_params.js").params;
$(function(){
    $("#operation-nav").addClass("active");
    $("#op-add-subject").addClass("active");

    initUpload();
    addSubject();
    var subject_id = url_params.subject_id;
    if (subject_id !== void 0) {
        $("button.add-subject").html("更新专题").after($('<a href="/m/operation/subject_item_edit?subject_id='+subject_id+'" class="btn btn-info" >专题详情</a>'));

        http.get({
            url : "/api/getAlbum.htm",
            data : {
                id : subject_id
            }
        }).done(function(rs){
           var data = rs.album;
           if (data) {
               $("#subject_name").val(data.name);
                $("#subject_logo").val(data.imageUrl);
                $("#upload-img").removeClass("hide").find("img").attr("src", data.imageUrl) 
                $("#upload-img h4").html("专题头图");
                if (data.detailImageUrl) {
                    $("#detail-subject_logo").val(data.detailImageUrl);
                    $("#detail-upload-img").removeClass("hide").find("img").attr("src", data.detailImageUrl); 
                    $("#detail-upload-img h4").html("详情页头图");
                }
               return;
           }
            alert("获取专题基本信息失败");
        }).fail(function(){
            alert("获取专题基本信息失败");
        })

    }
       
});

function addSubject(){
    var $form = $("#subject_form");
    $form.form({
        data_map : {
            name : "#subject_name",
            imageUrl : "#subject_logo",
            detailImageUrl : "#detail-subject_logo",
            startDate : "#start_date",
            endDate : "#end_date"
        }
    });
    $form.on("form-submit",function(e,form_data){
        e.preventDefault();
        if (!(form_data.name && form_data.imageUrl)) {
            alert("没有填写完数据");
            return;
        }
        http.post({
            url : "/api/addAlbum.htm",
            data : form_data,
            async : false

        }).done(function(rs){
            if (rs.ret == 1) {
                var album = rs.album;
                window.location.href="/m/operation/subject_item_edit?subject_id="+ album.id;
            } else {
                alert("添加失败");
            }
        }).fail(function(){
            alert("添加失败");
        });
    })
}

function initUpload(){
    Uploader.create_upload({
        dom : $("#logo-upload")[0],
        multi_selection : false,
        callback : function(data){
            var pathList = data.pathList;
            if (pathList && pathList.length) {
                $("#subject_logo").val(pathList[0]);
                $("#upload-img").removeClass("hide").find("img").attr("src", pathList[0]) 
                $("#upload-img h4").html("专题头图");
            }
        }
    });
    Uploader.create_upload({
        dom : $("#detail-logo-upload")[0],
        multi_selection : false,
        callback : function(data){
            var pathList = data.pathList;
            if (pathList && pathList.length) {
                $("#detail-subject_logo").val(pathList[0]);
                $("#detail-upload-img").removeClass("hide").find("img").attr("src", pathList[0]) 
                $("#detail-upload-img h4").html("详情页头图");
            }
        }
    });

}

},{"../lib/iform.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/iform.js","../lib/iupload.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/iupload.js","../lib/jquery.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jquery.js","../lib/search_params.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/search_params.js","../mod/http.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/mod/http.js"}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/cookies.js":[function(require,module,exports){
var docCookie = (function(undefined) {
  /*\
  |*|
  |*|  :: cookies.js ::
  |*|
  |*|  A complete cookies reader/writer framework with full unicode support.
  |*|
  |*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
  |*|
  |*|  This framework is released under the GNU Public License, version 3 or later.
  |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
  |*|
  |*|  Syntaxes:
  |*|
  |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
  |*|  * docCookies.getItem(name)
  |*|  * docCookies.removeItem(name[, path], domain)
  |*|  * docCookies.hasItem(name)
  |*|  * docCookies.keys()
  |*|
  \*/

  var docCookies = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },


    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };
  return docCookies;
})();
module.exports =  docCookie;


},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/icheckbox.js":[function(require,module,exports){
var $ = require('./jquery');

var Checkbox = function(dom){
    this._$dom = dom;
    this._$checkbox = dom.find("input[type=checkbox]");
    this.init();
}

Checkbox.prototype.init = function(){
    var checked = this._$checkbox.attr("checked");
    if (checked) {
        this._$dom.addClass("checked");
    } else {
        this._$dom.removeClass("checked");
    }
    this._listen_dom_event();
}
Checkbox.prototype._listen_dom_event = function(){
    var me = this , checkbox = this._$checkbox;
    this._$dom.click(function(e){
        if (checkbox.attr("checked")) {
            me.uncheck();
        } else {
            me.check();
        }
    });
}

Checkbox.prototype.uncheck = function(){
    this._$checkbox.removeAttr("checked");
    this._$dom.removeClass("checked");
}

Checkbox.prototype.check = function(){
    this._$checkbox.attr("checked",true);
    this._$dom.addClass("checked");
}

$.fn.checkbox = function(){
    this.each(function(){
        var $this = $(this),
            data = $this.data("icheckbox");
        
        if (!data) {
            $this.data("icheckbox",(data = new Checkbox($this)));    
        }
    });
}

},{"./jquery":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jquery.js"}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/iform.js":[function(require,module,exports){
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




},{"./icheckbox":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/icheckbox.js","./jquery":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jquery.js","./jquery.placeholder.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jquery.placeholder.js","./jvalidator/src/index.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/index.js","./y-selector":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/y-selector.js"}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/iupload.js":[function(require,module,exports){

function create_upload(opt){
    var exts = opt.extensions || ["jpg","png","jpeg"];
    var exts_str = exts.join(",");
    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,html4',
         
        browse_button : opt.dom, // you can pass in id...
        //container: opt.container, // ... or DOM Element itself
         
        url : opt.url || "/api/upload",
        
        filters : {
            max_file_size : opt.size || '10mb',
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
                    }
                } else {
                    uploader.start();
                    opt.start && opt.start(up,files); 
                }
            },
     
            UploadProgress: function(up, file) {
                //console.log("progress===",file.percent);
               // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            },
     
            Error: function(up, err) {
                console.log("err===",err.code,err.message);
                //document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                
            },
            UploadFile : function(up,flie){
            },
            FileUploaded : function(up,files,res){
                var _status = res.status;
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


},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jquery.js":[function(require,module,exports){
var $ = window.jQuery;
module.exports = $;

},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jquery.placeholder.js":[function(require,module,exports){
/*! http://mths.be/placeholder v2.0.8 by @mathias */
;(function(window, document, $) {

	// Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
	var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
	var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
	var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != safeActiveElement()) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

	function safeActiveElement() {
		// Avoid IE9 `document.activeElement` of death
		// https://github.com/mathiasbynens/jquery-placeholder/pull/99
		try {
			return document.activeElement;
		} catch (exception) {}
	}

}(this, document, jQuery));

},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/AsyncRequest.js":[function(require,module,exports){
var AsyncRequest = function(){
    this.reqs = [];
    this.status = 0;    //0-waithing,1-running
}

AsyncRequest.prototype.addRequest = function(func){
    if(this.status!=0) return;
    this.reqs.push(func);
}

AsyncRequest.prototype.go = function(){
    if(this.status!=0) return;
    
    this.status = 1;    
    var self = this;
    var reqs = this.reqs;
    var len = this.reqs.length;
    
    for(var i=0;i<reqs.length;i++){
        var req = reqs[i];

        if(this.status==0) return;
        req(function(){
            //async_continue
            len--;
            if(len==0){
                self.finish();
            } 
        });
        
    }
}

AsyncRequest.prototype.finish = function(){
    this.status = 0;
    if(this.onfinished){
        this.onfinished();
    }
}

AsyncRequest.prototype.clear = function(){
    if(this.status!=0) return;
    this.reqs = [];
}

module.exports = AsyncRequest;
},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/RuleParser.js":[function(require,module,exports){
var PARSER = {};

function _tokenized( str ) {
    var s = [];
    for( var i = 0; i < str.length; i++ ) {
        var chr = str.charAt(i);
        switch( chr ) {
            case '(':
            case ')':
            case '!':
            case '&':
            case '|':
                s.push(chr);
                s.push('');
                break;
            default:
                s.length ? s[s.length-1] += chr : s.push(chr);
                break;
        }
    }
    return s;
}

var regName = /^(@?[\w\-]+)(\[.+\])?$/;

function _parse( tokens ) {
    var ast = [];
    var o = null;
    var token; 
    while( (token = tokens.shift() ) !== void 0 ) {
        if( !token ) {
            continue;
        }
        switch( token ) {
            case '(':
            case ')':
            case '!':
            case '&':
            case '|':
                ast.push(token);
                break;
            default: 
                var a = token.match( regName );
                if( !a ) continue;
                if( a[1].charAt(0) == '@' ) {
                    o = { name : '@' , elemName : a[1].replace('@','') };
                } else {
                    o = { name : a[1] };
                }
                if( !PARSER[o.name] ) {
                    throw "not found parser's name : " + o.name;
                }
                if( a[2] ) o.value = a[2].replace('[','').replace(']','');
                ast.push( o );
                o = null;
                break;
        }
    }
    return ast;
}

// 增加解析器
// *name* 解析器名称
// *options.argument* 带有参数，默认没有
exports.add = function( name , options ) {
    PARSER[name] = options || {};
    PARSER[name].name = name;
}

exports.parse = function( str ) {
    var tokens = _tokenized( str );
    var ast = _parse( tokens );
    return ast;
}
},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/Validator.js":[function(require,module,exports){
var Async = require('./AsyncRequest.js');
var parser = require('./RuleParser.js');

var PATTERNS = {}
var CONSTANT = {
    PATTERN : "jvalidator-pattern" , 
    PLACEHOLDER : "jvalidator-placeholder" , 
    CNAME : "jvalidator-cname" , 
    MESSAGE_ATTR : "__jvalidator_messages__" , 
    FIELD_EVENTS : "__jvalidator_events__" , 
    DEBUG : "jvalidator-debug"
}

// ## 字段检查器
// 绑定到某个字段后，对其进行检查等操作
function FieldChecker( element ) {
    this.element = element;
    this.$element = $(element);
    this.$form = this.$element.closest('form');
    this.async = new Async();
}

FieldChecker.prototype = {

    _getPatternMessage : function( results ) {  
        var rstr = [];
        for( var i = 0; i < results.length; i++ ) {
            var p = results[i];
            if( p.name ) {
                rstr.push( p.getMessage() );
            } else {
                switch( p ) {
                    case '&&':
                        rstr.push(' 并且 ');
                        break;
                    case '||':
                        rstr.push(' 或者 ');
                        break;
                    case '!':
                        rstr.push('不');
                        break;
                }
            }
        }
        return rstr.join('');
    } ,

    // 检查生成结果并返回错误信息
    // return errors
    _checkPatternResult : function( str , results ) {
        var self = this;
        var rstr = [];
        for( var i = 0; i < results.length; i++ ) {
            var p = results[i];
            if( p.name ) {
                rstr.push( p.result );
            } else {
                rstr.push( p );
            }
        }

        if( this.$form.attr( "data-" + CONSTANT.DEBUG) ) {
            console.info( this , this.element , str , rstr.join('') )
        }

        var all = eval( rstr.join('') );
        if( all ) {
            return [];
        } else {
            var arr = $.grep( results , function( e , idx ){
                return e.name && e.result === false;
            });
            arr.getMessage = function(){
                return self._getPatternMessage( results );
            }
            return arr;
        }
    },

    // 验证自身的 pattern 是否合法以及是否满足所有项，以供开发自测使用
    checkPattern : function(){
        var $e = this.$element;
        var rule_str = $e.attr( "data-" +  CONSTANT.PATTERN );
        try {
            var patterns = parser.parse( rule_str );
        } catch(e) {
            console.error( this.element , '验证器语法有错误，请检查' , rule_str );
            console.error( '错误可能是：' , e );
        }
    } ,

    // * done *
    //  可以不传，即为触发检查 
    //  `checkResult` boolean 检查结果 
    //  `evt` 为触发的事件，可以没有
    //  `errors` array 错误信息
    check : function( $event , checkCallback ) {

        var self = this;
        var async = new Async();
        var e = this.element;
        var $e = this.$element;
        var value = this.value();
        var rule_str = $e.attr( "data-" +  CONSTANT.PATTERN );
        var patterns = parser.parse( rule_str );

        async.clear();
        async.onfinished = function(){
            var errors = self._checkPatternResult( rule_str , patterns );
            
            self.after_check( errors.length == 0 , errors , $event );
            if ( checkCallback ) { checkCallback( errors.length == 0 , errors ); }
        };

        $.each( patterns , function(){
            // 跳过所有计算变量
            if( !this.name ) return;

            // p 其中包括
            // argument - 可能有
            // message - 原始的message设置 
            // validate - 验证规则 
            // rule_str解析出来的内容 name(同patternName) , elemName(@才会有) , value(pattern的属性值)
            // element - 对应的 element
            // result - 验证后，会对该项设置 true 或 false
            var p = $.extend( this , {
                element : self.element ,
                $element : self.$element , 
                $form : self.$form , 
                getMessage : function(){
                    return self._getMessage.call( this , value );
                } , 
                // 用来解析 parsedstr(它是带有@的内容) 的值，解析成功就返回那个 element ，否则返回 null
                parseNameSymbol : function( parsedstr ){
                    if( parsedstr.charAt(0) !== '@' ) return null;
                    return this.$form.find( _parse_selector_syntax( parsedstr ) )[0];
                } , 

                // 当 pattern 是 @xx[xx] 时， 则可以通过该方法取得 @ 对应的元素
                getNameSymbol : function(){
                    return this.parseNameSymbol( '@' + this.elemName );
                },

                // 当 pattern 是 xx[xx] 时， 则可以通过该方法取得括号中的值
                // 如果值为 @xxx , 则返回该元素
                // 否则返回值
                getValueSymbol : function(){
                    var el = this.parseNameSymbol( this.value );
                    return el ? el : this.value;
                } , 

                getElementValue : function( el ){
                    el = $(el)[0]
                    if( !el ) return "";
                    var jv = _getFieldValidator( el )
                    return jv ? jv.value() : self.value.call({
                        element : el , 
                        $element : $(el) , 
                        $form : self.$form
                    });
                } , 

                // 得到元素的 cname 或 name
                getElementName : function ( el ) {
                    var $el = $(el);
                    if( $el.attr( "data-" +  CONSTANT.CNAME ) ) {
                        return $el.attr( "data-" +  CONSTANT.CNAME )
                    } else {
                        return $el.attr('name');    
                    }
                    return "";
                }

            } , PATTERNS[ this.name ] );

            (function(p){ async.addRequest(function( async_continue ){
                // isvalid - 是否验证成功
                p.validate( value , function( is_valid ){
                    p.result = is_valid;
                    async_continue();
                }, $event );

            }); })(p);
        })

        async.go();

    } , 

    // 根据 patternName 得到错误信息
    // 优先级为：字段的message设置 > pg的message设置 > pattern的标准设置 
    // * value * 为值，如果不传则重新获取
    // * 由 p 进行调用
    _getMessage : function( value ) {

        var self = this;
        var patternName = this.name;
        var e = this.element;
        var $e = this.$element;
        var $f = this.$form;
        var v = value || _getFieldValidator(e).value();
        var msg_tmpl = $e.attr('data-jvalidator-message')
                       || ( e[ CONSTANT.MESSAGE_ATTR ] ? e[ CONSTANT.MESSAGE_ATTR ][ patternName ] : null )
                       || ( $f[0][ CONSTANT.MESSAGE_ATTR ] ? $f[0][ CONSTANT.MESSAGE_ATTR ][ patternName ] : null )
                       || ( PATTERNS[ patternName ].message );

        msg_tmpl = msg_tmpl.replace( /%val\b/g , v ) 
        msg_tmpl = msg_tmpl.replace( /%name\b/g , e.name )
        msg_tmpl = msg_tmpl.replace( /%cname\b/g , $e.attr( "data-" +  CONSTANT.CNAME) ) 
        msg_tmpl = msg_tmpl.replace( /=%argu\b/g , function(){
                            var v = self.parseNameSymbol( self.value );
                            return v && v.tagName ? self.getElementValue( v ) : self.value;
                       })
        msg_tmpl = msg_tmpl.replace( /%argu\b/g , function(){
                            var v = self.parseNameSymbol( self.value );
                            return v && v.tagName ? self.getElementName( v ) : self.value;
                       })
        msg_tmpl = msg_tmpl.replace( /@@/g , function( $0 , $1 ){
                            var el = $f.find( _parse_selector_syntax("@" + self.elemName) )[0]
                            if( !el ) {
                                return "";
                            } else {
                                var $el = $(el);
                                if( $el.attr( "data-" +  CONSTANT.CNAME ) ) {
                                    return $el.attr( "data-" +  CONSTANT.CNAME )
                                } else {
                                    return $el.attr('name');    
                                }
                            }
                       })
        msg_tmpl = msg_tmpl.replace( /=@([^\s]*)\b/g , function( $0 , $1 ){
                            return self.getElementValue( $f.find('[name=' + $1 + ']') )
                       })
        msg_tmpl = msg_tmpl.replace( /@([^\s]*)\b/g , function( $0 , $1 ){
                            return self.getElementName( $f.find('[name=' + $1 + ']') ) || "" ;
                       })
        return msg_tmpl;

    },

    // 根据不同的字段类型，取得 element 的值
    value : function() {
        var e = this.element , $e = this.$element , $form = this.$form , placeholdertext ;
        switch( e.tagName.toLowerCase() ) {
            case 'input':
                switch( e.type ) {
                    case 'radio':
                        return $form.find('input[name=' + e.name + ']:radio:checked').val()
                    case 'checkbox':
                        return $form.find('input[name=' + e.name + ']:checkbox:checked').map(function(){
                            return this.value;
                        }).toArray().join(',');
                    case 'text':
                        placeholdertext = $e.attr( "data-" +  CONSTANT.PLACEHOLDER );
                        return placeholdertext === e.value ? "" : e.value;
                    case 'hidden':
                    case 'password':
                        return e.value;
                }
                break;
            case 'select':
                return e.value;
            case 'textarea':
                placeholdertext = $e.attr( "data-" +  CONSTANT.PLACEHOLDER );
                return placeholdertext === e.value ? "" : e.value;
            default:
                var r;
                r = $e.attr('data-value');
                if( typeof r != 'undefined' ) return r;
                r = e.value;
                if( typeof r != 'undefined' ) return r;
                return r;
        }
    } , 

    // 触发自验证行为
    after_check : function( is_valid , errors , $event ) {
        var type = is_valid ? 'success' : 'fail';
        var evt = this.$element.data( CONSTANT.FIELD_EVENTS + type );
        if( !evt ) evt = this.$form.data( CONSTANT.FIELD_EVENTS + type );
        if( !evt || typeof evt != 'function') return;

        evt.call( this , $event , errors );
    }

};


// ## 表单验证器

function FormValidator( form ) {
    if( !form ) throw "[ERROR] form 参数必须存在."
    if( form.tagName !== 'FORM' ) throw "[ERROR] 参数 form 必须是个表单元素."
    this.form = form;
    this.$form = $(form);
    this.async = new Async();
}

// 判断元素可见并存在
function _exists( el ){
    return $(el).closest('body').size() > 0 && $(el).is(":visible");
}

// 得到指定元素的jvalidator
function _getFieldValidator( el ){
    if( el.nodeName == "INPUT" && ( el.type == "checkbox" || el.type == "radio" ) ) {
        el = $(el).closest("form").find("input[data-" + CONSTANT.PATTERN + "][name=" + el.name + "]")[0];
    }
    if( !el || el.disabled ) return;
    if( !$(el).attr( "data-" +  CONSTANT.PATTERN ) ) return;
    return el._field_validator ? el._field_validator : ( el._field_validator = new FieldChecker( el ) );
}

// 解析 when 中的支持 @name 的 selector 语法 
function _parse_selector_syntax( selector ) {
    return ( selector || "" ).replace(/@([a-z][a-z0-9]*)\b/ig,'[name=$1]');
}

FormValidator.prototype = {

    // 得到所有需要验证的字段（非隐藏且不为disabled）
    _getAllFieldValidator : function() {
        var self = this;
        return this.$form.find('[data-' + CONSTANT.PATTERN + ']').filter(function(){
            return _exists(this) && !this.disabled;
        }).map(function(){
            return _getFieldValidator(this);
        }).toArray();
    } ,

    // 验证本表单中所有元素的 pattern 是否正确
    checkAllPatterns : function(){
        var _jvs = this._getAllFieldValidator();
        $.each( _jvs , function(){
            this.checkPattern();
        });
    } ,

    // 验证表单内所有字段
    validateAll : function( validateAllCallback ){
        var $form = this.$form;
        var async = new Async();
        var _jvs = this._getAllFieldValidator();
        var errors = [];

        async.clear();
        async.onfinished = function(){
            validateAllCallback && validateAllCallback( errors.length == 0 , errors ); 
        }

        // 当没有任何可以验证的字段时直接返回
        if( !_jvs.length ) {
            return validateAllCallback( true , [] );
        }

        for( var i = 0; i < _jvs.length; i++ ) {
            var jv = _jvs[i];
            
            (function(jv){
                async.addRequest(function(async_continue){
                    jv.check( null , function( checkResult , error ){
                        if( !checkResult ){ errors.push( error ) }
                        async_continue();
                    });
                });
            })(jv);

        }

        async.go();
    } , 

    // 当你需要字段自触发验证时，比如：input blur时需要验证，请使用该方法.
    // selector 是需要自触发验证的字段 - 如果不写则默认全部。<br />
    // evts 有两种写法:
    // ##### 第一种：
    // > [ 'blur' , 'focus' , 'keypress' ] 
    // 
    // 代表 selector 的 [ 'blur' , 'focus' , 'keypress' ] 事件会触发 selector 的验证
    // 
    // ##### 第二种：
    // > \{ <br />
    // >     '@sel' : [ 'blur' , 'keypress' ]
    // > \} <br />
    // 
    // 代表 由@sel 的 [ 'blur' , 'keypress' ] 事件会触发 selector 的验证

    when : function( selector , evts ) {
        if( typeof selector != 'string' ) {
            evts = selector;
            selector = "";
        }

        var events = {};
        var sel = selector || "[data-" + CONSTANT.PATTERN + "]";

        // 处理 checkbox 和 radio
        var chks = this.$form.find(sel).filter('input:checkbox');
        if( chks.length ) {
            chks.each(function(){
                sel += "," + _parse_selector_syntax( "@" + this.name )
            });
        }

        var rdos = this.$form.find(sel).filter('input:radio');
        if( rdos.length ) {
            rdos.each(function(){
                sel += "," + _parse_selector_syntax( "@" + this.name )
            });
        }

        if( $.isArray(evts) ) {  
            events[ sel ] = evts ;
        } else if( $.isPlainObject(evts) ) {
            $.extend( events , evts );
        }

        for( var targetSelector in events ) {
            var _sel = _parse_selector_syntax( targetSelector );
            var _evts = ( events[targetSelector] || [] );
            if( !_evts.length ) continue;
            _evts = _evts.join(' ');

            this.$form.undelegate( _sel , _evts );

            this.$form.delegate( _sel , _evts , function($event){
                var jv = _getFieldValidator( this );
                jv && jv.check( $event );
            })
        }

    },

    setMessage : function( selector , patternName , msg ) { 

        if( arguments.length == 2 ) {
            msg = patternName;
            patternName = selector;
            selector = null;
        }

        var c , f = this.$form[0];

        if( !selector ) {
            c = f[ CONSTANT.MESSAGE_ATTR ] = f[ CONSTANT.MESSAGE_ATTR ] || {};
            c[patternName] = msg;
        } else {
            this.$form.find( _parse_selector_syntax( selector ) ).each(function(){
                var e = this;
                c = e[ CONSTANT.MESSAGE_ATTR ] = e[ CONSTANT.MESSAGE_ATTR ] || {};
                c[patternName] = msg;
            });
        }

    } ,

    success : function( selector , fn ) {
        this._bind_field_event( 'success' , selector , fn );
    } ,

    fail : function( selector , fn ) {
        this._bind_field_event( 'fail' , selector , fn );
    } ,

    _bind_field_event : function( type , selector , fn ) {
        
        if( !type ) return;

        if( typeof selector == 'function' ) {
            fn = selector;
            selector = null;
        }

        if( selector ) {
            var sel = _parse_selector_syntax( selector );
            this.$form.find(sel).each(function(){
                $(this).data( CONSTANT.FIELD_EVENTS + type , fn );
            })
        } else {
            this.$form.data( CONSTANT.FIELD_EVENTS + type , fn );
        }

    }

}

$.fn.jvalidator = function(){
    var form = $(this).first();
    if( form.data('FormValidator') ) return form.data('FormValidator');
    var fv = new FormValidator( form[0] );
    form.data('FormValidator', fv );
    return fv;
};


// 设置增加自定义 pattern 的入口

function addPattern( name , options ) {

    if(!name) throw "[ERROR] add pattern - no name";
    if(!options) throw "[ERROR] add pattern - no options"
    if(!options.message) throw "[ERROR] add pattern - no message"
    if(!options.validate) throw "[ERROR] add pattern - no validate";
    
    PATTERNS[name] = $.extend({
        name : name 
    } , options );

    parser.add( name , options );

}

exports.addPattern = addPattern;

$.extend({
    jvalidator: {
        addPattern : addPattern ,
        PATTERNS : PATTERNS , 
        getFieldValidator : function( el ) {
            return _getFieldValidator( el );
        }
    }
});

},{"./AsyncRequest.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/AsyncRequest.js","./RuleParser.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/RuleParser.js"}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/index.js":[function(require,module,exports){
var v = require('./Validator.js');

var validFunc = {
    
    /***
     * 值:
     * 1 无错误 
     * -1 长度错误
     * -2 验证错误 
     */
    ID : function( num ) {  

        num = num.toUpperCase();  
        
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
        if (!(/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(num))) { 
            return -1; 
        }
        
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
        //下面分别分析出生日期和校验位 
        
        var len, re; 
        len = num.length; 
        if (len == 15) {
            
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/); 
            var arrSplit = num.match(re); 

            //检查生日日期是否正确 
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]); 
            var bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 
            
            if (!bGoodDay) { 
                return -2; 
            } else {                
                return 1;
            }   
        }
        
        if (len == 18) {
            
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})(\d|X)$/); 
            var arrSplit = num.match(re); 

            //检查生日日期是否正确 
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]); 
            var bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 

            if (!bGoodDay) { 
                return -2; 
            } else { 
                //检验18位身份证的校验码是否正确。 
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
                var valnum; 
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
                var nTemp = 0, i; 
                for(i = 0; i < 17; i ++) { 
                    nTemp += num.substr(i, 1) * arrInt[i]; 
                } 
                
                valnum = arrCh[nTemp % 11];
                
                if (valnum != num.substr(17, 1)) { 
                    return -2; 
                } 
                
                return 1; 
            } 
        }
        
        return -2; 
        
    }
    
};

v.addPattern('required',{
    message : '不能为空' , 
    validate : function( value , done ) {
        done( value !== "" ); 
    }
});

v.addPattern('non-required',{
    message : '允许为空' , 
    validate : function( value , done ) {
        done( value === "" ); 
    }
});

v.addPattern('numeric',{
    message : '必须是数字' , 
    validate : function( value , done ) {
        done( /^\d+$/.test( value ) );
    }
});


v.addPattern('int',{
    message : '必须是整数' , 
    validate : function( value , done ) {
        done( /^\-?\d+$/.test( value ) );
    }
});

v.addPattern('decimal',{
    message : '必须是小数' , 
    validate : function( value , done ) {
        done( /^\-?\d*\.?\d+$/.test( value ) );
    }
});


v.addPattern('alpha',{
    message : '必须是字母' , 
    validate : function( value , done ) {
        done( /^[a-z]+$/i.test( value ) );
    }
});

v.addPattern('alpha_numeric',{
    message : '必须为字母或数字' , 
    validate : function( value , done ) {
        done( /^[a-z0-9]+$/i.test( value ) );
    }
});

v.addPattern('alpha_dash',{
    message : '必须为字母或数字及下划线等特殊字符' , 
    validate : function( value , done ) {
        done( /^[a-z0-9_\-]+$/i.test( value ) );
    }
});

v.addPattern('chs',{
    message : '必须是中文字符',
    validate : function( value , done ) {
        done( /^[\\u4E00-\\u9FFF]+$/i.test( value ) );
    }
});

v.addPattern('chs_numeric',{
    message : '必须是中文字符或数字',
    validate : function( value , done ) {
        done( /^[\\u4E00-\\u9FFF0-9]+$/i.test( value ) );
    }
});

v.addPattern('chs_numeric',{
    message : '必须是中文字符或数字及下划线等特殊字符' , 
    validate : function( value , done ) {
        done( /^[\\u4E00-\\u9FFF0-9_\-]+$/i.test( value ) );
    }
});


v.addPattern('match',{
    argument : true , 
    message : '必须与 %argu 相同' , 
    validate : function( value , done ) {
        var v = this.getValueSymbol();
        var vv = v && v.tagName ? this.getElementValue(v) : v;
        done( vv === value );
    }
});

v.addPattern('contain',{
    argument : true , 
    message : '必须包含"%argu"的内容' , 
    validate : function( value , done ) {
        var v = this.getValueSymbol();
        var vv = v && v.tagName ? this.getElementValue(v) : v;
        done( !!~value.indexOf(vv) );
    }
});


v.addPattern('@',{
    argument : true , 
    message : '@@必须为 %argu' , 
    validate : function( value , done ) {
        var v = this.getValueSymbol();
        var at = this.getNameSymbol();
        if( v === null || at === null ) {
            done( false );
        } else {
            var vv = v && v.tagName ? this.getElementValue(v) : v;
            var vat = at && at.tagName ? this.getElementValue(at) : at;
            done( vv === vat );
        }
        
    }
});


v.addPattern('idcard',{
    message : '身份证格式错误' , 
    validate : function( value , done ) {
        done( validFunc.ID(value) === 1 ); 
    }
});


v.addPattern('passport',{
    message : '护照格式错误或过长',
    validate : function( value , done ) {
        done( /^[a-zA-Z0-9]{0,20}$/i.test( value ) ); 
    }
});

v.addPattern('email',{
    message : '邮件地址错误',
    validate : function( value , done ) {
        done( /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/.test( value ) );
    }
});

v.addPattern('min_length',{
    argument : true , 
    message : '最少输入%argu个字', 
    validate : function( value , done ) {
        var n = parseInt( this.value , 10 );
        done( value.length >= n );
    }
});

v.addPattern('max_length',{
    argument : true , 
    message : '最多输入%argu个字', 
    validate : function( value , done ) {
        var n = parseInt( this.value , 10 );
        done( value.length <= n );
    }
});


v.addPattern('length',{
    argument : true , 
    message : '长度必须为%argu个字符', 
    validate : function( value , done ) {
        var n = parseInt( this.value , 10 );
        done( value.length === n );
    }
});


v.addPattern('greater_than',{
    argument : true , 
    message : '必须大于%argu',
    validate : function( value , done ){
        var v = parseInt( value , 10 );
        var n = this.parseNameSymbol( this.value );
        n = parseFloat( n && n.tagName ? this.getElementValue( n ) : this.value );
        done( v > n )
    }
});

v.addPattern('less_than',{
    argument : true , 
    message : '必须小于%argu',
    validate : function( value , done ){
        var v = parseInt( value , 10 );
        var n = this.parseNameSymbol( this.value );
        n = parseFloat( n && n.tagName ? this.getElementValue( n ) : this.value );
        done( v < n )
    }
});

v.addPattern('equal',{
    argument : true , 
    message : '必须等于%argu',
    validate : function( value , done ){
        var v = parseInt( value , 10 );
        var n = this.parseNameSymbol( this.value );
        n = parseFloat( n && n.tagName ? this.getElementValue( n ) : this.value );
        done( v == n )
    }
});

v.addPattern('ip',{ 
    message : '必须符合ip格式',
    validate : function( value , done ){
        done( /^((25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.){3}(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/i.test(value) );
    }
});

v.addPattern('date',{
    message : '必须符合日期格式 YYYY-MM-DD',
    validate : function( value , done ) {
        done( /^\d\d\d\d\-\d\d\-\d\d$/.test(value) );
    }
});
 

},{"./Validator.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/jvalidator/src/Validator.js"}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/search_params.js":[function(require,module,exports){
var search  = window.location.search,
    decode = decodeURIComponent;
var S= {}; 
    function parse(is_now){
        var _s , params = {} ;
        if (!is_now) {
            _s = search;
        } else {
            _s = window.location.search;
        } 
        _s =  _s.replace(/^\?/,"").split("&");
        if (_s.forEach) {
            _s.forEach(function(s,i){
                var t = s.split("=");
                params[t[0]] = decode(t[1]);
            });
        } else {
            for (var i = 0, l = _s.length; i < l; i++) {
                var t = _s[i].split("=");
                params[t[0]] = decode(t[1]);
            }
        }
        return params;
    }
    var params = parse();
    var is_empty = function(){
        var em = true;
        for(var i in params){
            if (params.hasOwnProperty(i)) {
                em = false;
                break;
            }
        };
        return em;
    }();
    S.params = params;
    S.is_empty = is_empty;
    S.now = function(){
        return parse(true);
    }

module.exports = S;

},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/y-selector.js":[function(require,module,exports){
/**
 * @requires yselector.css
 * 位置:styles/common/yselector.css
 *
 * TODO 键盘导航 滚动条跟随滚动
 * TODO IPHONE 使用原生控件
 *
 * @param {Object} config
 * @param {Boolean} config.emptyHidden 当自定义select没有选项时是否隐藏 true隐藏
 * @param {Boolean} config.maxRows
 * @param {Boolean} config.index 初始化时指定选择第几个option 如果没指定 默认选择原生select元素当前选择的option
 * @param {String} config.direction option下拉框出现位置
 * top select title的上方  bottom select title的下方
 * @param {Function} config.onchange(obj) 选项更改时会触发此函数
 * @param {Object} obj
 *
 * @param {Function} config.onselect(text) 更换选项时会触发此函数
 * 此函数可以对当前选择的option text进行处理 自定义select title上显示的是处理后的text
 * @param {String} text 当前选择的option text
 *
 * @example
 * $("select").yselector(config);
 *
 *
 * $($.fn.yselector.events).trigger("change", [ self, obj, self.option("holder")]);
 */

(function($){

    var SELECTOR_DATA_KEY = "YSELECTOR",
        SELECTOR_EVENT    =  ".SELECTOR_EVENT",
        HOVER             = "hover";

    var Selector = function(){};

    Selector.options = {
        emptyHidden: false,
        maxRows    : 10,
        index      : null,
        // direction  : "bottom",
        onchange   : function() {},
        onselect   : function(t) { return t || ""; }
    };

    Selector.prototype = {
        _init: function(config){
            var self = this;

            self._setOptions(config || {});
            self._bindEvents();
        },
        _bindEvents: function(){
            var self    = this,
                jquery  = self.option("jquery"),
                showing = false;

            function toggleEvent(e){

                if (self.option("disable")) {
                    return;
                }

                if (showing) {
                    self._hide();
                } else {
                    self._show();
                }

                showing = !showing;
            }

            // fix capture not release(mousedown and drag out);
            var _cur = null;
            $(document).mouseup(function() {
               _cur && _cur.releaseCapture && _cur.releaseCapture();
            });

            jquery.delegate(".ysel-input", "click" + SELECTOR_EVENT, toggleEvent)
                .delegate(".ysel-arraw", "mousedown" + SELECTOR_EVENT, function(e){
                    self.option("input").focus();
                    e.preventDefault();
                    if (this.setCapture) { this.setCapture(); }
                    toggleEvent(e);
                })
                .delegate(".ysel-arraw", "click" + SELECTOR_EVENT, function(e){
                    if (this.releaseCapture) { this.releaseCapture(); }
                })
                .delegate(".ysel-input", "focusout" + SELECTOR_EVENT, function(){
                    if (showing) {
                        self._hide();
                        showing = false;
                    }

                    var val = self.val(),
                        obj = self._getByValue(val);

                    // for exteral bind
                    $($.fn.yselector.events).trigger("blur", [ self, obj, self.option("holder")]);
                })
                .delegate(".ysel-sug ul", "mousedown" + SELECTOR_EVENT, function(e){
                    e.preventDefault();

                    if (this.setCapture) {
                        this.setCapture();
                        _cur = this; // fix capture not release(mousedown and drag out);
                    }

                    var target = e.target, index;

                    if (target.tagName === "A") {
                        index = $(target).data("index");
                    } else {
                        var a = $(target).parentsUntil(".ysel-sug","a");
                        if(a.length == 0) { return; }
                        index = a.data("index");
                    }

                    self.index(index);

                    toggleEvent(e);
                })
                .delegate(".ysel-sug ul", "click" + SELECTOR_EVENT, function(e){
                    if (this.releaseCapture) { this.releaseCapture(); }
                })
                .delegate(".ysel-sug ul", "mouseenter" + SELECTOR_EVENT, function(e){
                    self._cur().removeClass(HOVER);
                })
                .delegate(".ysel-input", "keydown" + SELECTOR_EVENT, function(e){

                    if (self.option("disable")) {
                        return;
                    }

                    var code = e.keyCode;

                    if(code === 37 || code === 38){
                        self.previous();
                        return false;
                    } else if(code === 39 || code === 40){
                        self.next();
                        return false;
                    } else if(code === 13){
                        toggleEvent(e);
                    } else if(code === 8){
                        return false;
                    }
                });
        },
        _cur: function(i){
            var self    = this,
                current = (i == null) ? self.option("index") : i,
                cur     = self.option("suggest").find("a:eq(" + current + ")");

            return cur;
        },
        /**
         * 创建自定义select组件
         * 保存select组件,select组件下拉元素,select组件title
         */
        _drawHtml: function(){

            var self = this;

            var fullHTML = ['<div class="ui-yselector">',
                                '<div class="ysel-box">',
                                    '<div class="ysel-arraw"><b></b></div>',
                                    '<span class="ysel-input" tabindex="0"></span>',
                                '</div>',
                                '<div style="display:none;" class="ysel-sug">',
                                    '<ul></ul>',
                                '</div>',
                            '</div>'];

            var jquery = $(fullHTML.join("\n")),
                holder = self.option("holder").hide();

            holder.after(jquery);
            self.option("jquery", jquery);
            self.option("suggest", $(".ysel-sug", jquery));
            self.option("input", $(".ysel-input", jquery));
        },
        _drawSuggest: function(){
            var listHtmlArray = [], item,
                self = this,
                list = self.option("data");

            for (var i = 0, l = list.length; i < l; i++) {
                item = list[i];
                listHtmlArray.push('<li class="js-search-type"><a data-value="' + item.value + '" hidefocus="on" data-index="' + i + '"');
                listHtmlArray.push(' onclick="return false;" href="javascript:;" tabindex="-1">' + item.text );
                listHtmlArray.push('</a></li>');
            }

            self.option("suggest").html("<ul>" + listHtmlArray.join("\n") + "</ul>");
        },
        _setOptions: function(obj){
            var self = this;

            self.options = $.extend({}, Selector.options, obj);

            var rawSelect = obj.rawSelect,
                options = rawSelect.options,
                index = rawSelect.selectedIndex,
                dataList = [], item;

            for (var i = 0, l = options.length; i < l; i++) {
                item = options[i];
                dataList.push({
                    value: item.value || item.text,
                    text: item.text
                });
            }

            self.option("holder", $(rawSelect));
            self.option("index", obj.index != null ? obj.index : index);
            self._drawHtml();
            self.setOptions(dataList);

        },
        _getByValue: function(value, key){

            if (!value) {
                return;
            }

            var list = this.option("data"),
                item;

            key = key || "value";

            for (var i = 0, l = list.length; i < l; i++) {
                item = list[i];

                if (item[key] == value) {
                    return item;
                }
            }
        },
        /**
         * 根据obj 更新select组件选项
         * @param {Object} obj
         * @param {int} obj.index
         * @param {String} obj.value
         * @param {String} obj.text
         * @param {Boolean} force
         */
        _setByObject: function(obj, force){

            obj = obj || {};

            if (!force && this.option("index") === obj.index) {
                return;
            }

            var self = this,
                onselect = self.option("onselect"),
                onchange = self.option("onchange");

            var text = onselect ? onselect(obj.text) : (obj.text || "");

            self.option("value", obj.value || "");
            self.option("text", text);
            self.option("index", obj.index || 0);

            var holder = self.option("holder"),
                input = self.option("input");

            if (holder) { holder[0].selectedIndex = obj.index; }
            if (input) { self.option("input").text(text); }

            if (onchange) { onchange.call(self, obj); }

            // for exteral bind
            $($.fn.yselector.events).trigger("change", [ self, obj, self.option("holder")]);
        },
        _triggerClass: function(i, j){
            var self = this;

            if (i === j) {
                return;
            }

            self._cur(i).removeClass(HOVER);
            self._cur(j).addClass(HOVER);
        },
        _show: function(){
            var self = this,
                suggest = self.option("suggest"),
                index = self.option("index"),
                direction = self.option("direction");

            self._drawSuggest();

            var list = suggest.find("a");

            list.eq(index).addClass(HOVER);

            suggest.show();

            var maxRows = self.option("maxRows");
            var height = Math.min(list.size(), maxRows) * list.height();
            var prev = self.option("jquery"), top;
            switch(direction){
                case "top":
                    top = 0 - height - prev.height() - 2;
                    break;
                case "bottom":
                    top = 5;
                    break;
                default: // 根据下方空间决定在bottom还是top展示
                    var win =$(window),
                        prevTop = prev.offset().top + prev.height() + 3,
                        st = win.scrollTop(),
                        wh = win.height();

                    if(prevTop + height > st + wh){
                        top = 0 - height - prev.height() - 2;
                    } else {
                        top = 5;
                    }
                    break;
            }

            suggest.find("ul").css("height", height).css("top", top).scrollTop(self.option('index') * list.height());
        },
        _hide: function(){
            this.option("suggest").hide();
        },
        /**
         * 清空原生select 并将list转换为Option添加到select中
         * 并根据this.option("index")的值 选择对应的option选项
         * @param {Object} list select option数据对象
         * @param {String} list.value
         * @param {String} list.text
         */
        setOptions: function(list){
            var self = this,
                jquery = self.option("jquery");

            list = list || [];

            var select = self.option("holder")[0];
            //清空原生select选项
                select.length = 0;

            for (var i = 0, l = list.length, temp; i < l; i++) {
                temp = list[i];
                temp.index = i;
                select.options.add(new Option(temp.text, temp.value));
            }

            self.option("data", list);

            if (!list.length && self.option("emptyHidden")) {
                jquery.hide();
            } else {
                jquery.show();
            }

            self._setByObject(list[self.option("index")] || list[0], true);
        },
        first: function(){
            return this.option("data")[0] || {};
        },
        /**
         * 读取或更新配置参数(this.options)
         * @param {String} key 配置参数key
         * @param {Object} val 更新时 要设置的配置参数对应的值
         */
        option: function(key, val){

            if (val != null) {
                this.options[key] = val;
            } else {
                return this.options[key];
            }
        },
        previous: function(){
            var self = this,
                index = self.index() - 1;

            if(index < 0){
                index = self.option("data").length + index;
            }

            self.index(index);
        },
        next: function(){
            var self = this;

            self.index(self.option("index") + 1);
        },
        index: function(i){
            var self = this;

            if (i == null) {
                return self.option("index");
            }

            var data = self.option("data"),
                obj = data[i],
                index = self.option("index");

            if (!obj) {
                obj = self.first();
                i = 0;
            }

            self._setByObject(obj);
        },
        val: function(value, force){
            var self = this;

            if (value == null) {
                return self.option("value");
            }

            var obj = self._getByValue(value);

            if (obj == null) {
                obj = self.first();
            }

            self._setByObject(obj, force);

        },
        text: function(text){
            var self = this;

            if (text == null) {
                return self.option("text");
            }

            var obj = self._getByValue(text, "text");

            if (obj == null) {
                obj = self.first();
            }

            self._setByObject(obj);

        },
        disable: function(){
            this.option("jquery")
                .addClass("disble");

            this.option("disable", true);
        },
        enable: function(){
            this.option("jquery")
                .removeClass("disble");

            this.option("disable", false);
        },
        _redrawList: function() {

            var rawSelect = this.option('holder')[0],
                options = rawSelect.options,
                dataList = [], item;

            for (var i = 0, l = options.length; i < l; i++) {
                item = options[i];
                dataList.push({
                    value: item.value || item.text,
                    text: item.text
                });
            }
            this.setOptions(dataList);
        },
        remove: function(index) {
            var sel = this.option('holder')[0],
                options = sel.options;
            options.remove(index);
            this._redrawList();
        },
        add: function(option) {
            var sel = this.option('holder')[0],
                options = sel.options;
            options.add(option);
            this._redrawList();
        }
    };
    $.fn.extend({
        yselector: function(config){

            $.fn.yselector.events = {};

            this.each(function(i, item){
                var self = $(this);

                var inst = self.data(SELECTOR_DATA_KEY);

                if (!inst) {
                    config = config || {};
                    config.rawSelect = self[0];
                    inst = new Selector();
                    self.data(SELECTOR_DATA_KEY, inst);
                    inst._init(config);
                }

                return inst;
            });
        }
    });

})(jQuery);



},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/mod/http.js":[function(require,module,exports){
var cookies = require('../lib/cookies');
var $ = window.jQuery;
var def_opt = {
    cache : false,
    dataType : "json"
};

var ajax = function(opt){
    opt = $.extend(def_opt , opt );
    var data = opt.data || {};
    data.csrftoken = cookies.getItem("csrftoken");
    opt.data = data;
    return $.ajax(opt);
}

var http = {
    get : function(opt){
        opt.type = "get";
        return ajax(opt);
    },
    post : function(opt){
        opt.type = "post";
        return ajax(opt);
    }
};

module.exports = http;

},{"../lib/cookies":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/cookies.js"}]},{},["./src/scripts/page/subject_add.js"]);

//# sourceMappingURL=subject_add.js.map