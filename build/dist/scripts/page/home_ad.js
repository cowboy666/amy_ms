(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
//浏览器判断
var ua  = window.navigator.userAgent.toLowerCase(),
    check = function(r){
        return r.test(ua);
    };
var isOpera  =  check(/opera/),
    isChrome = check(/\bchrome\b/),
    isWebKit = check(/webkit/),
    isSafari = !isChrome && isWebKit,
    isIE     = check(/msie/) && document.all && !isOpera,
    isIE7    = check(/msie 7/),
    isIE8    = check(/msie 8/),
    isIE9    = check(/msie 9/),
    isIE10    = check(/msie 10/),
    isIE6    = isIE && !isIE7 && !isIE8 && !isIE9 && !isIE10,
    isIE11   = check(/trident/) && ua.match(/rv:([\d.]+)/)?true:false,
    isGecko  = check(/gecko/) && !isWebKit,
    isMac    = check(/mac/);

var Browser = {
    isOpera : isOpera,
    isChrome : isChrome,
    isWebKit : isWebKit,
    isSafari : isSafari,
    isIE     : isIE,
    isIE7    : isIE7,
    isIE8    : isIE8,
    isIE9    : isIE9,
    isIE6    : isIE6,
    isIE11    :isIE11,
    isGecko  : isGecko,
    isMac    : isMac
};
module.exports = Browser;

},{}],3:[function(require,module,exports){
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

},{"./jquery":7}],4:[function(require,module,exports){
var Browser = require("./ibrowser");
var Dialog  = (function($,window){
		var _isIE  = Browser.isIE,
		    _isIE6 = Browser.isIE6,
			$doc   = $(window.document),
			$body  = $('body'),
			$win   = $(window); 
        var IE6_LEFT_OFFSET = 16; //IE6下滑动条的宽度
		var _isMac = Browser.isMac;
		var hasScroll = false;
        //防止引用JS文件在head 里取不到body
        if (!$body[0]) {
            $(function(){
                $body =  $('body'); 
            });
        }
        //背景 前景 
		var dlg_mask_html = '<div class="g-pop-bg"></div>',
			dlg_box_html = '<div class="g_dlg_box g-pop"></div>';

		var dlgid = "dlg",
            mids=0 , 
            ids = 0,
			_d_zindex = 100000;

		var def_config = {
			content:'',
			maskVisible : true,
			top:0,
			left:0,
			width:0,
			height:0,
			newMask : false,
			contentStyle : "",
			borderStyle :"",  // border样式 
			titleStyle : "", //标题样式
			closeCls  : "", //关闭按钮 class 如果有会替换掉 原来的 dlg_close 
            close_fn : function(){},
			hideCloseBtn: false
		};
		// mix config setting.
		var mix_cfg = function(n, d) {
			var cfg = {},
				i;
			for (i in d) {
				if (d.hasOwnProperty(i)) {
					cfg[i] = typeof n[i] !== 'undefined' ? n[i] : d[i];
				}
			}
			return cfg;
		}
		var getWinRect = function(){
				var win = $win;
				return {
					scrollTop :  $doc.scrollTop(),
					scrollLeft : $doc.scrollLeft(),
					width : win.width(),
                    height : win.height()
                    //width: win[0].innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
					//height: win[0].innerHeight || document.documentElement.clientHeight || document.body.clientHeight
				}
		}
		var _mask_id = "dlg_mask_";
		var Mask = function(){
		    this.id = _mask_id+(++mids);
			this._dom = $('<div id="'+(this.id)+'" class="g-pop-bg" style="z-index:'+(++_d_zindex)+'"></div>');
			this._init();
		};
	 	Mask.prototype = {
			_init : function(){
				$body.append(this._dom);
				this._dom.hide();
				this._initEvents();
				this.adaptWin();
				if(this._needIframe()){
					this._createIframe();
				}

			},
			_initEvents : function(){
				var me = this;
			},
			_createIframe: function(){
				this._iframe = $('<iframe class="dlg_miframe" frameborder="0" src="about:blank"></iframe>');
				this._dom.append(this._iframe);
			},
			addClass : function( clsName){
				this._dom.addClass(clsName);
			},
			/**
			 * 检测自动生成iframe条件
			 *
			 * @method
			 * @protected
			 * @param void
			 * @return {bool}
			 */
			_needIframe: function () {
				var useIframe = !!window.ActiveXObject
								&& ((_isIE6 && $('select').length)
								|| $('object').length);
				return useIframe;
			},
			adaptWin : function(){
				if(_isIE6){
					this._dom.css({
                        top : $doc.scrollTop(), 
                        left : $doc.scrollLeft(),
						height: $win.height(),
						width: $win.width()
					});
				}
			},
			hide : function(){
				this._dom.hide();
                var html_dom = $('html').css("overflow","");
				if(_isMac == false || 1){
					if(hasScroll){
	                    html_dom.css("padding-right","0px");
					}
				}
			},
			show : function(){
                var me = this;
				var wa = $win.width();
                var html_dom = $('html').css("overflow","hidden");
				var wb = $win.width();
                me._dom.show();
				if(_isMac == false || 1){
					if(wa != wb){
						hasScroll = true;
						html_dom.css("padding-right",IE6_LEFT_OFFSET+"px");
					}
				}
			},
			getDom : function(){
				return this._dom;
			},
			remove: function(){
				this._dom.remove();
			}
		}

		var most_mask; //公共的Mask
		var Dialog =  function(cfg){
			var c = cfg || {};
			this.config =  mix_cfg(c,def_config);
			this._init();
		}
		Dialog.prototype = {
			constructor : Dialog,
			_init : function(){
				if(!this.config){
					return ;
				}
				
				this.id = dlgid +(++ids);
				var cfg =  this.config;

				if(cfg.newMask){
					this._mask =  new Mask();
				}else{
					if(!most_mask){
						most_mask =  new Mask();
						this._mask = most_mask;
					}else{
						this._mask =  most_mask;
					}
				}
				this._creatDialog();
				this._initEvents();
				this.inited = true;
			},
			_initEvents : function(){
				var me = this,id=this.id;

				this._closeBtn.bind({
					click : function(e){
						e.preventDefault();
                        me.close();
						me.config.close_fn.call(me,me);
					}
				});
				
				$win.bind("resize."+id,resize);
				
				me._unbindEvents = function(){
					$win.unbind("resize."+id);
				}

				function resize(){
                    if (_isIE6) {
                        me._dlg_container.css({
                            top : $doc.scrollTop(), 
                            left : $doc.scrollLeft(),
						    width : $win.width(),
						    height : $win.height()
					    });
  
                    } else {
                        me._dlg_container.css({
                            width : $win.width(),
                            height : $win.height()
                        });
                    }
					me.toCenter();
					me._mask.adaptWin();
				};
			},
			_creatDialog : function(){
				var cfg = this.config;
				var dlg_container = this._dlg_container = $(dlg_box_html).attr("id",this.id).css("z-index",(_d_zindex += 10));
				if(cfg.content instanceof $){
					this._dialog = cfg.content;
				}else{
					this._dialog = $(cfg.content);
				}
				var dlg = this._dialog;
				dlg.addClass("g_dlg_wrap_css3");	
				dlg_container.html(dlg);
				this._content = $(".js_content",dlg);
				this._closeBtn = $('.js_close',dlg);
				$body.append(dlg_container);

				if(cfg.hideCloseBtn){
					this._closeBtn.hide();
				}
				var pos =  "fixed";
				if(_isIE6){
					dlg_container.css({
                        top : $doc.scrollTop(), 
                        left : $doc.scrollLeft(),
						width : $win.width(),
						height : $win.height()
					});
					pos = "absoulte";
			    } else {
                    dlg_container.css({
						width : $win.width(),
						height : $win.height()
                    });
                }
                dlg.css("position","absolute");
				this.setPos(pos);				
				//this.toCenter();
			},
			setPos : function(pos){
				this._dlg_container.css("position",pos);
			},
			//得到content 返回jQuery 对象
			getContainer : function(){
				return this._dlg_container;
			},
			getContent : function(){
				return this._content;
			},
			setContent : function(dom){
				this._content.empty();
				this._content.html(dom);	
			},
            getDlgDom : function(){
              return this._dialog; 
            },
			getCloseBtn : function(){
				return this._closeBtn;
			},
			_setStyle : function(dom,css){
				if(typeof css == "string"){
					if(_isIE){
						dom[0].style.cssText = css;
					}else{
						dom.attr("style",css);
					}
				}else{
					dom.css(css);
				}
			},
			toCenter : function(){
				var winRect =  getWinRect(),
					w = this._dialog.width(),
					h = this._dialog.height(),
					t = 0,l =0;
                var top = Math.max((winRect.height / 2 - h / 2) >>0 + t,0) ;
                var left  = (winRect.width / 2 - w / 2) >>0 + l;
                if (_isIE6) {
                    left -= IE6_LEFT_OFFSET/2;
                }
				var rect = {
					left :	left,
				   	top :  top
				}
				this._dialog.css(rect);
				return this;
			},
		    show : function(callback,context){
				var me = this;
				if(me.config.maskVisible){
					me._mask.show();
				}
                //IE8 以下计算窗口宽度
                me._dlg_container.css({width:"100%",height:"100%"});
				me._dlg_container.show();
				me.toCenter();
				if(callback){
					callback.call(context || me,me);
				}
				me.showed = true;
				return this;
			},
			close : function(callback,context){
				var me = this;
				this._mask.hide();
				this._dlg_container.hide();
				if(callback){
					callback.call(context || me,me);
				}
				this.showed = false;
				return this;
			},
			destory : function(){
				this.close();
				this._unbindEvents();
				this.config.newMask && this._mask.remove();
				this._dlg_container.remove();
				this._dialog.remove();
				for(var i in this){
					delete this[i]
				}
			},
			getMask : function(){
				return this._mask;
			}


		}
		Dialog.prototype.In = Dialog.prototype.show;
		Dialog.prototype.out = Dialog.prototype.close;
		Dialog.prototype.hide = Dialog.prototype.close;
		Dialog.prototype.remove = Dialog.prototype.destory;
		
	    
    return Dialog;

})(jQuery,window);

module.exports = Dialog;

},{"./ibrowser":2}],5:[function(require,module,exports){
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

Form.prototype.get_submit_data = Form.prototype._prase_form_val;

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




},{"./icheckbox":3,"./jquery":7,"./jquery.placeholder.js":8,"./jvalidator/src/index.js":13,"./y-selector":15}],6:[function(require,module,exports){


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


},{"../mod/pop.js":17,"./idialog":4}],7:[function(require,module,exports){
var $ = window.jQuery;
module.exports = $;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
(function (global){
/*
    ********** Juicer **********
    ${A Fast template engine}
    Project Home: http://juicer.name

    Author: Guokai
    Gtalk: badkaikai@gmail.com
    Blog: http://benben.cc
    Licence: MIT License
    Version: 0.6.8-stable
*/

(function() {

    // This is the main function for not only compiling but also rendering.
    // there's at least two parameters need to be provided, one is the tpl, 
    // another is the data, the tpl can either be a string, or an id like #id.
    // if only tpl was given, it'll return the compiled reusable function.
    // if tpl and data were given at the same time, it'll return the rendered 
    // result immediately.

    var juicer = function() {
        var args = [].slice.call(arguments);

        args.push(juicer.options);

        if(args[0].match(/^\s*#([\w:\-\.]+)\s*$/igm)) {
            args[0].replace(/^\s*#([\w:\-\.]+)\s*$/igm, function($, $id) {
                var _document = document;
                var elem = _document && _document.getElementById($id);
                args[0] = elem ? (elem.value || elem.innerHTML) : $;
            });
        }

        if(typeof(document) !== 'undefined' && document.body) {
            juicer.compile.call(juicer, document.body.innerHTML);
        }

        if(arguments.length == 1) {
            return juicer.compile.apply(juicer, args);
        }

        if(arguments.length >= 2) {
            return juicer.to_html.apply(juicer, args);
        }
    };

    var __escapehtml = {
        escapehash: {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2f;'
        },
        escapereplace: function(k) {
            return __escapehtml.escapehash[k];
        },
        escaping: function(str) {
            return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm, this.escapereplace);
        },
        detection: function(data) {
            return typeof(data) === 'undefined' ? '' : data;
        }
    };

    var __throw = function(error) {
        if(typeof(console) !== 'undefined') {
            if(console.warn) {
                console.warn(error);
                return;
            }

            if(console.log) {
                console.log(error);
                return;
            }
        }

        throw(error);
    };

    var __creator = function(o, proto) {
        o = o !== Object(o) ? {} : o;

        if(o.__proto__) {
            o.__proto__ = proto;
            return o;
        }

        var empty = function() {};
        var n = Object.create ? 
            Object.create(proto) : 
            new(empty.prototype = proto, empty);

        for(var i in o) {
            if(o.hasOwnProperty(i)) {
                n[i] = o[i];
            }
        }

        return n;
    };

    var annotate = function(fn) {
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var FN_BODY = /^function[^{]+{([\s\S]*)}/m;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var args = [],
            fnText,
            fnBody,
            argDecl;

        if (typeof fn === 'function') {
            if (fn.length) {
                fnText = fn.toString();
            }
        } else if(typeof fn === 'string') {
            fnText = fn;
        }

        fnText = fnText.replace(STRIP_COMMENTS, '');
        fnText = fnText.trim();
        argDecl = fnText.match(FN_ARGS);
        fnBody = fnText.match(FN_BODY)[1].trim();

        for(var i = 0; i < argDecl[1].split(FN_ARG_SPLIT).length; i++) {
            var arg = argDecl[1].split(FN_ARG_SPLIT)[i];
            arg.replace(FN_ARG, function(all, underscore, name) {
                args.push(name);
            });
        }

        return [args, fnBody];
    };

    juicer.__cache = {};
    juicer.version = '0.6.8-stable';
    juicer.settings = {};

    juicer.tags = {
        operationOpen: '{@',
        operationClose: '}',
        interpolateOpen: '\\${',
        interpolateClose: '}',
        noneencodeOpen: '\\$\\${',
        noneencodeClose: '}',
        commentOpen: '\\{#',
        commentClose: '\\}'
    };

    juicer.options = {
        cache: true,
        strip: true,
        errorhandling: true,
        detection: true,
        _method: __creator({
            __escapehtml: __escapehtml,
            __throw: __throw,
            __juicer: juicer
        }, {})
    };

    juicer.tagInit = function() {
        var forstart = juicer.tags.operationOpen + 'each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?' + juicer.tags.operationClose;
        var forend = juicer.tags.operationOpen + '\\/each' + juicer.tags.operationClose;
        var ifstart = juicer.tags.operationOpen + 'if\\s*([^}]*?)' + juicer.tags.operationClose;
        var ifend = juicer.tags.operationOpen + '\\/if' + juicer.tags.operationClose;
        var elsestart = juicer.tags.operationOpen + 'else' + juicer.tags.operationClose;
        var elseifstart = juicer.tags.operationOpen + 'else if\\s*([^}]*?)' + juicer.tags.operationClose;
        var interpolate = juicer.tags.interpolateOpen + '([\\s\\S]+?)' + juicer.tags.interpolateClose;
        var noneencode = juicer.tags.noneencodeOpen + '([\\s\\S]+?)' + juicer.tags.noneencodeClose;
        var inlinecomment = juicer.tags.commentOpen + '[^}]*?' + juicer.tags.commentClose;
        var rangestart = juicer.tags.operationOpen + 'each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)' + juicer.tags.operationClose;
        var include = juicer.tags.operationOpen + 'include\\s*([^}]*?)\\s*,\\s*([^}]*?)' + juicer.tags.operationClose;
        var helperRegisterStart = juicer.tags.operationOpen + 'helper\\s*([^}]*?)\\s*' + juicer.tags.operationClose;
        var helperRegisterBody = '([\\s\\S]*?)';
        var helperRegisterEnd = juicer.tags.operationOpen + '\\/helper' + juicer.tags.operationClose;

        juicer.settings.forstart = new RegExp(forstart, 'igm');
        juicer.settings.forend = new RegExp(forend, 'igm');
        juicer.settings.ifstart = new RegExp(ifstart, 'igm');
        juicer.settings.ifend = new RegExp(ifend, 'igm');
        juicer.settings.elsestart = new RegExp(elsestart, 'igm');
        juicer.settings.elseifstart = new RegExp(elseifstart, 'igm');
        juicer.settings.interpolate = new RegExp(interpolate, 'igm');
        juicer.settings.noneencode = new RegExp(noneencode, 'igm');
        juicer.settings.inlinecomment = new RegExp(inlinecomment, 'igm');
        juicer.settings.rangestart = new RegExp(rangestart, 'igm');
        juicer.settings.include = new RegExp(include, 'igm');
        juicer.settings.helperRegister = new RegExp(helperRegisterStart + helperRegisterBody + helperRegisterEnd, 'igm');
    };

    juicer.tagInit();

    // Using this method to set the options by given conf-name and conf-value,
    // you can also provide more than one key-value pair wrapped by an object.
    // this interface also used to custom the template tag delimater, for this
    // situation, the conf-name must begin with tag::, for example: juicer.set
    // ('tag::operationOpen', '{@').

    juicer.set = function(conf, value) {
        var that = this;

        var escapePattern = function(v) {
            return v.replace(/[\$\(\)\[\]\+\^\{\}\?\*\|\.]/igm, function($) {
                return '\\' + $;
            });
        };

        var set = function(conf, value) {
            var tag = conf.match(/^tag::(.*)$/i);

            if(tag) {
                that.tags[tag[1]] = escapePattern(value);
                that.tagInit();
                return;
            }

            that.options[conf] = value;
        };

        if(arguments.length === 2) {
            set(conf, value);
            return;
        }

        if(conf === Object(conf)) {
            for(var i in conf) {
                if(conf.hasOwnProperty(i)) {
                    set(i, conf[i]);
                }
            }
        }
    };

    // Before you're using custom functions in your template like ${name | fnName},
    // you need to register this fn by juicer.register('fnName', fn).

    juicer.register = function(fname, fn) {
        var _method = this.options._method;

        if(_method.hasOwnProperty(fname)) {
            return false;
        }

        return _method[fname] = fn;
    };

    // remove the registered function in the memory by the provided function name.
    // for example: juicer.unregister('fnName').

    juicer.unregister = function(fname) {
        var _method = this.options._method;

        if(_method.hasOwnProperty(fname)) {
            return delete _method[fname];
        }
    };

    juicer.template = function(options) {
        var that = this;

        this.options = options;

        this.__interpolate = function(_name, _escape, options) {
            var _define = _name.split('|'), _fn = _define[0] || '', _cluster;

            if(_define.length > 1) {
                _name = _define.shift();
                _cluster = _define.shift().split(',');
                _fn = '_method.' + _cluster.shift() + '.call({}, ' + [_name].concat(_cluster) + ')';
            }

            return '<%= ' + (_escape ? '_method.__escapehtml.escaping' : '') + '(' +
                        (!options || options.detection !== false ? '_method.__escapehtml.detection' : '') + '(' +
                            _fn +
                        ')' +
                    ')' +
                ' %>';
        };

        this.__removeShell = function(tpl, options) {
            var _counter = 0;

            tpl = tpl
                // inline helper register
                .replace(juicer.settings.helperRegister, function($, helperName, fnText) {
                    var anno = annotate(fnText);
                    var fnArgs = anno[0];
                    var fnBody = anno[1];
                    var fn = new Function(fnArgs.join(','), fnBody);

                    juicer.register(helperName, fn);
                    return $;
                })

                // for expression
                .replace(juicer.settings.forstart, function($, _name, alias, key) {
                    var alias = alias || 'value', key = key && key.substr(1);
                    var _iterate = 'i' + _counter++;
                    return '<% ~function() {' +
                                'for(var ' + _iterate + ' in ' + _name + ') {' +
                                    'if(' + _name + '.hasOwnProperty(' + _iterate + ')) {' +
                                        'var ' + alias + '=' + _name + '[' + _iterate + '];' +
                                        (key ? ('var ' + key + '=' + _iterate + ';') : '') +
                            ' %>';
                })
                .replace(juicer.settings.forend, '<% }}}(); %>')

                // if expression
                .replace(juicer.settings.ifstart, function($, condition) {
                    return '<% if(' + condition + ') { %>';
                })
                .replace(juicer.settings.ifend, '<% } %>')

                // else expression
                .replace(juicer.settings.elsestart, function($) {
                    return '<% } else { %>';
                })

                // else if expression
                .replace(juicer.settings.elseifstart, function($, condition) {
                    return '<% } else if(' + condition + ') { %>';
                })

                // interpolate without escape
                .replace(juicer.settings.noneencode, function($, _name) {
                    return that.__interpolate(_name, false, options);
                })

                // interpolate with escape
                .replace(juicer.settings.interpolate, function($, _name) {
                    return that.__interpolate(_name, true, options);
                })

                // clean up comments
                .replace(juicer.settings.inlinecomment, '')

                // range expression
                .replace(juicer.settings.rangestart, function($, _name, start, end) {
                    var _iterate = 'j' + _counter++;
                    return '<% ~function() {' +
                                'for(var ' + _iterate + '=' + start + ';' + _iterate + '<' + end + ';' + _iterate + '++) {{' +
                                    'var ' + _name + '=' + _iterate + ';' +
                            ' %>';
                })

                // include sub-template
                .replace(juicer.settings.include, function($, tpl, data) {
                    // compatible for node.js
                    if(tpl.match(/^file\:\/\//igm)) return $;
                    return '<%= _method.__juicer(' + tpl + ', ' + data + '); %>';
                });

            // exception handling
            if(!options || options.errorhandling !== false) {
                tpl = '<% try { %>' + tpl;
                tpl += '<% } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} %>';
            }

            return tpl;
        };

        this.__toNative = function(tpl, options) {
            return this.__convert(tpl, !options || options.strip);
        };

        this.__lexicalAnalyze = function(tpl) {
            var buffer = [];
            var method = [];
            var prefix = '';
            var reserved = [
                'if', 'each', '_', '_method', 'console', 
                'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 
                'finally', 'for', 'function', 'in', 'instanceof', 'new', 'return', 'switch', 
                'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'typeof', 
                'class', 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface', 
                'let', 'package', 'private', 'protected', 'public', 'static', 'yield', 'const', 'arguments', 
                'true', 'false', 'undefined', 'NaN'
            ];

            var indexOf = function(array, item) {
                if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) {
                    return array.indexOf(item);
                }

                for(var i=0; i < array.length; i++) {
                    if(array[i] === item) return i;
                }

                return -1;
            };

            var variableAnalyze = function($, statement) {
                statement = statement.match(/\w+/igm)[0];

                if(indexOf(buffer, statement) === -1 && indexOf(reserved, statement) === -1 && indexOf(method, statement) === -1) {

                    // avoid re-declare native function, if not do this, template 
                    // `{@if encodeURIComponent(name)}` could be throw undefined.

                    if(typeof(window) !== 'undefined' && typeof(window[statement]) === 'function' && window[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // compatible for node.js
                    if(typeof(global) !== 'undefined' && typeof(global[statement]) === 'function' && global[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // avoid re-declare registered function, if not do this, template 
                    // `{@if registered_func(name)}` could be throw undefined.

                    if(typeof(juicer.options._method[statement]) === 'function' || juicer.options._method.hasOwnProperty(statement)) {
                        method.push(statement);
                        return $;
                    }

                    buffer.push(statement); // fuck ie
                }

                return $;
            };

            tpl.replace(juicer.settings.forstart, variableAnalyze).
                replace(juicer.settings.interpolate, variableAnalyze).
                replace(juicer.settings.ifstart, variableAnalyze).
                replace(juicer.settings.elseifstart, variableAnalyze).
                replace(juicer.settings.include, variableAnalyze).
                replace(/[\+\-\*\/%!\?\|\^&~<>=,\(\)\[\]]\s*([A-Za-z_]+)/igm, variableAnalyze);

            for(var i = 0;i < buffer.length; i++) {
                prefix += 'var ' + buffer[i] + '=_.' + buffer[i] + ';';
            }

            for(var i = 0;i < method.length; i++) {
                prefix += 'var ' + method[i] + '=_method.' + method[i] + ';';
            }

            return '<% ' + prefix + ' %>';
        };

        this.__convert=function(tpl, strip) {
            var buffer = [].join('');

            buffer += "'use strict';"; // use strict mode
            buffer += "var _=_||{};";
            buffer += "var _out='';_out+='";

            if(strip !== false) {
                buffer += tpl
                    .replace(/\\/g, "\\\\")
                    .replace(/[\r\t\n]/g, " ")
                    .replace(/'(?=[^%]*%>)/g, "\t")
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                    .split("<%").join("';")
                    .split("%>").join("_out+='")+
                    "';return _out;";

                return buffer;
            }

            buffer += tpl
                    .replace(/\\/g, "\\\\")
                    .replace(/[\r]/g, "\\r")
                    .replace(/[\t]/g, "\\t")
                    .replace(/[\n]/g, "\\n")
                    .replace(/'(?=[^%]*%>)/g, "\t")
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                    .split("<%").join("';")
                    .split("%>").join("_out+='")+
                    "';return _out.replace(/[\\r\\n]\\s+[\\r\\n]/g, '\\r\\n');";

            return buffer;
        };

        this.parse = function(tpl, options) {
            var _that = this;

            if(!options || options.loose !== false) {
                tpl = this.__lexicalAnalyze(tpl) + tpl;
            }

            tpl = this.__removeShell(tpl, options);
            tpl = this.__toNative(tpl, options);

            this._render = new Function('_, _method', tpl);

            this.render = function(_, _method) {
                if(!_method || _method !== that.options._method) {
                    _method = __creator(_method, that.options._method);
                }

                return _that._render.call(this, _, _method);
            };

            return this;
        };
    };

    juicer.compile = function(tpl, options) {
        if(!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        try {
            var engine = this.__cache[tpl] ? 
                this.__cache[tpl] : 
                new this.template(this.options).parse(tpl, options);

            if(!options || options.cache !== false) {
                this.__cache[tpl] = engine;
            }

            return engine;

        } catch(e) {
            __throw('Juicer Compile Exception: ' + e.message);

            return {
                render: function() {} // noop
            };
        }
    };

    juicer.to_html = function(tpl, data, options) {
        if(!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        return this.compile(tpl, options).render(data, options._method);
    };
    window.juicer = juicer;
    typeof(module) !== 'undefined' && module.exports ? module.exports = juicer : this.juicer = juicer;

})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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

},{"./AsyncRequest.js":10,"./RuleParser.js":11}],13:[function(require,module,exports){
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
 

},{"./Validator.js":12}],14:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) lodash.com/license | Underscore.js 1.5.2 underscorejs.org/LICENSE
 * Build: `lodash -o ./dist/lodash.compat.js`
 */
;(function(){function n(n,t,e){e=(e||0)-1;for(var r=n?n.length:0;++e<r;)if(n[e]===t)return e;return-1}function t(t,e){var r=typeof e;if(t=t.l,"boolean"==r||null==e)return t[e]?0:-1;"number"!=r&&"string"!=r&&(r="object");var u="number"==r?e:b+e;return t=(t=t[r])&&t[u],"object"==r?t&&-1<n(t,e)?0:-1:t?0:-1}function e(n){var t=this.l,e=typeof n;if("boolean"==e||null==n)t[n]=true;else{"number"!=e&&"string"!=e&&(e="object");var r="number"==e?n:b+n,t=t[e]||(t[e]={});"object"==e?(t[r]||(t[r]=[])).push(n):t[r]=true
}}function r(n){return n.charCodeAt(0)}function u(n,t){for(var e=n.m,r=t.m,u=-1,o=e.length;++u<o;){var a=e[u],i=r[u];if(a!==i){if(a>i||typeof a=="undefined")return 1;if(a<i||typeof i=="undefined")return-1}}return n.n-t.n}function o(n){var t=-1,r=n.length,u=n[0],o=n[r/2|0],a=n[r-1];if(u&&typeof u=="object"&&o&&typeof o=="object"&&a&&typeof a=="object")return false;for(u=l(),u["false"]=u["null"]=u["true"]=u.undefined=false,o=l(),o.k=n,o.l=u,o.push=e;++t<r;)o.push(n[t]);return o}function a(n){return"\\"+Y[n]
}function i(){return v.pop()||[]}function l(){return y.pop()||{k:null,l:null,m:null,"false":false,n:0,"null":false,number:null,object:null,push:null,string:null,"true":false,undefined:false,o:null}}function f(n){return typeof n.toString!="function"&&typeof(n+"")=="string"}function c(n){n.length=0,v.length<w&&v.push(n)}function p(n){var t=n.l;t&&p(t),n.k=n.l=n.m=n.object=n.number=n.string=n.o=null,y.length<w&&y.push(n)}function s(n,t,e){t||(t=0),typeof e=="undefined"&&(e=n?n.length:0);var r=-1;e=e-t||0;for(var u=Array(0>e?0:e);++r<e;)u[r]=n[t+r];
return u}function g(e){function v(n){return n&&typeof n=="object"&&!qe(n)&&we.call(n,"__wrapped__")?n:new y(n)}function y(n,t){this.__chain__=!!t,this.__wrapped__=n}function w(n){function t(){if(r){var n=s(r);je.apply(n,arguments)}if(this instanceof t){var o=nt(e.prototype),n=e.apply(o,n||arguments);return xt(n)?n:o}return e.apply(u,n||arguments)}var e=n[0],r=n[2],u=n[4];return ze(t,n),t}function Y(n,t,e,r,u){if(e){var o=e(n);if(typeof o!="undefined")return o}if(!xt(n))return n;var a=he.call(n);if(!V[a]||!Le.nodeClass&&f(n))return n;
var l=Te[a];switch(a){case L:case z:return new l(+n);case W:case M:return new l(n);case J:return o=l(n.source,S.exec(n)),o.lastIndex=n.lastIndex,o}if(a=qe(n),t){var p=!r;r||(r=i()),u||(u=i());for(var g=r.length;g--;)if(r[g]==n)return u[g];o=a?l(n.length):{}}else o=a?s(n):Ye({},n);return a&&(we.call(n,"index")&&(o.index=n.index),we.call(n,"input")&&(o.input=n.input)),t?(r.push(n),u.push(o),(a?Xe:tr)(n,function(n,a){o[a]=Y(n,t,e,r,u)}),p&&(c(r),c(u)),o):o}function nt(n){return xt(n)?Se(n):{}}function tt(n,t,e){if(typeof n!="function")return Ht;
if(typeof t=="undefined"||!("prototype"in n))return n;var r=n.__bindData__;if(typeof r=="undefined"&&(Le.funcNames&&(r=!n.name),r=r||!Le.funcDecomp,!r)){var u=be.call(n);Le.funcNames||(r=!A.test(u)),r||(r=B.test(u),ze(n,r))}if(false===r||true!==r&&1&r[1])return n;switch(e){case 1:return function(e){return n.call(t,e)};case 2:return function(e,r){return n.call(t,e,r)};case 3:return function(e,r,u){return n.call(t,e,r,u)};case 4:return function(e,r,u,o){return n.call(t,e,r,u,o)}}return Mt(n,t)}function et(n){function t(){var n=l?a:this;
if(u){var h=s(u);je.apply(h,arguments)}return(o||c)&&(h||(h=s(arguments)),o&&je.apply(h,o),c&&h.length<i)?(r|=16,et([e,p?r:-4&r,h,null,a,i])):(h||(h=arguments),f&&(e=n[g]),this instanceof t?(n=nt(e.prototype),h=e.apply(n,h),xt(h)?h:n):e.apply(n,h))}var e=n[0],r=n[1],u=n[2],o=n[3],a=n[4],i=n[5],l=1&r,f=2&r,c=4&r,p=8&r,g=e;return ze(t,n),t}function rt(e,r){var u=-1,a=ht(),i=e?e.length:0,l=i>=_&&a===n,f=[];if(l){var c=o(r);c?(a=t,r=c):l=false}for(;++u<i;)c=e[u],0>a(r,c)&&f.push(c);return l&&p(r),f}function ot(n,t,e,r){r=(r||0)-1;
for(var u=n?n.length:0,o=[];++r<u;){var a=n[r];if(a&&typeof a=="object"&&typeof a.length=="number"&&(qe(a)||dt(a))){t||(a=ot(a,t,e));var i=-1,l=a.length,f=o.length;for(o.length+=l;++i<l;)o[f++]=a[i]}else e||o.push(a)}return o}function at(n,t,e,r,u,o){if(e){var a=e(n,t);if(typeof a!="undefined")return!!a}if(n===t)return 0!==n||1/n==1/t;if(n===n&&!(n&&X[typeof n]||t&&X[typeof t]))return false;if(null==n||null==t)return n===t;var l=he.call(n),p=he.call(t);if(l==T&&(l=G),p==T&&(p=G),l!=p)return false;switch(l){case L:case z:return+n==+t;
case W:return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case J:case M:return n==ie(t)}if(p=l==$,!p){var s=we.call(n,"__wrapped__"),g=we.call(t,"__wrapped__");if(s||g)return at(s?n.__wrapped__:n,g?t.__wrapped__:t,e,r,u,o);if(l!=G||!Le.nodeClass&&(f(n)||f(t)))return false;if(l=!Le.argsObject&&dt(n)?oe:n.constructor,s=!Le.argsObject&&dt(t)?oe:t.constructor,l!=s&&!(jt(l)&&l instanceof l&&jt(s)&&s instanceof s)&&"constructor"in n&&"constructor"in t)return false}for(l=!u,u||(u=i()),o||(o=i()),s=u.length;s--;)if(u[s]==n)return o[s]==t;
var h=0,a=true;if(u.push(n),o.push(t),p){if(s=n.length,h=t.length,(a=h==s)||r)for(;h--;)if(p=s,g=t[h],r)for(;p--&&!(a=at(n[p],g,e,r,u,o)););else if(!(a=at(n[h],g,e,r,u,o)))break}else nr(t,function(t,i,l){return we.call(l,i)?(h++,a=we.call(n,i)&&at(n[i],t,e,r,u,o)):void 0}),a&&!r&&nr(n,function(n,t,e){return we.call(e,t)?a=-1<--h:void 0});return u.pop(),o.pop(),l&&(c(u),c(o)),a}function it(n,t,e,r,u){(qe(t)?Dt:tr)(t,function(t,o){var a,i,l=t,f=n[o];if(t&&((i=qe(t))||er(t))){for(l=r.length;l--;)if(a=r[l]==t){f=u[l];
break}if(!a){var c;e&&(l=e(f,t),c=typeof l!="undefined")&&(f=l),c||(f=i?qe(f)?f:[]:er(f)?f:{}),r.push(t),u.push(f),c||it(f,t,e,r,u)}}else e&&(l=e(f,t),typeof l=="undefined"&&(l=t)),typeof l!="undefined"&&(f=l);n[o]=f})}function lt(n,t){return n+de(Fe()*(t-n+1))}function ft(e,r,u){var a=-1,l=ht(),f=e?e.length:0,s=[],g=!r&&f>=_&&l===n,h=u||g?i():s;for(g&&(h=o(h),l=t);++a<f;){var v=e[a],y=u?u(v,a,e):v;(r?!a||h[h.length-1]!==y:0>l(h,y))&&((u||g)&&h.push(y),s.push(v))}return g?(c(h.k),p(h)):u&&c(h),s}function ct(n){return function(t,e,r){var u={};
if(e=v.createCallback(e,r,3),qe(t)){r=-1;for(var o=t.length;++r<o;){var a=t[r];n(u,a,e(a,r,t),t)}}else Xe(t,function(t,r,o){n(u,t,e(t,r,o),o)});return u}}function pt(n,t,e,r,u,o){var a=1&t,i=4&t,l=16&t,f=32&t;if(!(2&t||jt(n)))throw new le;l&&!e.length&&(t&=-17,l=e=false),f&&!r.length&&(t&=-33,f=r=false);var c=n&&n.__bindData__;return c&&true!==c?(c=s(c),c[2]&&(c[2]=s(c[2])),c[3]&&(c[3]=s(c[3])),!a||1&c[1]||(c[4]=u),!a&&1&c[1]&&(t|=8),!i||4&c[1]||(c[5]=o),l&&je.apply(c[2]||(c[2]=[]),e),f&&Ee.apply(c[3]||(c[3]=[]),r),c[1]|=t,pt.apply(null,c)):(1==t||17===t?w:et)([n,t,e,r,u,o])
}function st(){Q.h=F,Q.b=Q.c=Q.g=Q.i="",Q.e="t",Q.j=true;for(var n,t=0;n=arguments[t];t++)for(var e in n)Q[e]=n[e];t=Q.a,Q.d=/^[^,]+/.exec(t)[0],n=ee,t="return function("+t+"){",e=Q;var r="var n,t="+e.d+",E="+e.e+";if(!t)return E;"+e.i+";";e.b?(r+="var u=t.length;n=-1;if("+e.b+"){",Le.unindexedChars&&(r+="if(s(t)){t=t.split('')}"),r+="while(++n<u){"+e.g+";}}else{"):Le.nonEnumArgs&&(r+="var u=t.length;n=-1;if(u&&p(t)){while(++n<u){n+='';"+e.g+";}}else{"),Le.enumPrototypes&&(r+="var G=typeof t=='function';"),Le.enumErrorProps&&(r+="var F=t===k||t instanceof Error;");
var u=[];if(Le.enumPrototypes&&u.push('!(G&&n=="prototype")'),Le.enumErrorProps&&u.push('!(F&&(n=="message"||n=="name"))'),e.j&&e.f)r+="var C=-1,D=B[typeof t]&&v(t),u=D?D.length:0;while(++C<u){n=D[C];",u.length&&(r+="if("+u.join("&&")+"){"),r+=e.g+";",u.length&&(r+="}"),r+="}";else if(r+="for(n in t){",e.j&&u.push("m.call(t, n)"),u.length&&(r+="if("+u.join("&&")+"){"),r+=e.g+";",u.length&&(r+="}"),r+="}",Le.nonEnumShadows){for(r+="if(t!==A){var i=t.constructor,r=t===(i&&i.prototype),f=t===J?I:t===k?j:L.call(t),x=y[f];",k=0;7>k;k++)r+="n='"+e.h[k]+"';if((!(r&&x[n])&&m.call(t,n))",e.j||(r+="||(!x[n]&&t[n]!==A[n])"),r+="){"+e.g+"}";
r+="}"}return(e.b||Le.nonEnumArgs)&&(r+="}"),r+=e.c+";return E",n("d,j,k,m,o,p,q,s,v,A,B,y,I,J,L",t+r+"}")(tt,q,ce,we,d,dt,qe,kt,Q.f,pe,X,$e,M,se,he)}function gt(n){return Ve[n]}function ht(){var t=(t=v.indexOf)===zt?n:t;return t}function vt(n){return typeof n=="function"&&ve.test(n)}function yt(n){var t,e;return!n||he.call(n)!=G||(t=n.constructor,jt(t)&&!(t instanceof t))||!Le.argsClass&&dt(n)||!Le.nodeClass&&f(n)?false:Le.ownLast?(nr(n,function(n,t,r){return e=we.call(r,t),false}),false!==e):(nr(n,function(n,t){e=t
}),typeof e=="undefined"||we.call(n,e))}function mt(n){return He[n]}function dt(n){return n&&typeof n=="object"&&typeof n.length=="number"&&he.call(n)==T||false}function bt(n,t,e){var r=We(n),u=r.length;for(t=tt(t,e,3);u--&&(e=r[u],false!==t(n[e],e,n)););return n}function _t(n){var t=[];return nr(n,function(n,e){jt(n)&&t.push(e)}),t.sort()}function wt(n){for(var t=-1,e=We(n),r=e.length,u={};++t<r;){var o=e[t];u[n[o]]=o}return u}function jt(n){return typeof n=="function"}function xt(n){return!(!n||!X[typeof n])
}function Ct(n){return typeof n=="number"||n&&typeof n=="object"&&he.call(n)==W||false}function kt(n){return typeof n=="string"||n&&typeof n=="object"&&he.call(n)==M||false}function Et(n){for(var t=-1,e=We(n),r=e.length,u=Zt(r);++t<r;)u[t]=n[e[t]];return u}function Ot(n,t,e){var r=-1,u=ht(),o=n?n.length:0,a=false;return e=(0>e?Be(0,o+e):e)||0,qe(n)?a=-1<u(n,t,e):typeof o=="number"?a=-1<(kt(n)?n.indexOf(t,e):u(n,t,e)):Xe(n,function(n){return++r<e?void 0:!(a=n===t)}),a}function St(n,t,e){var r=true;if(t=v.createCallback(t,e,3),qe(n)){e=-1;
for(var u=n.length;++e<u&&(r=!!t(n[e],e,n)););}else Xe(n,function(n,e,u){return r=!!t(n,e,u)});return r}function At(n,t,e){var r=[];if(t=v.createCallback(t,e,3),qe(n)){e=-1;for(var u=n.length;++e<u;){var o=n[e];t(o,e,n)&&r.push(o)}}else Xe(n,function(n,e,u){t(n,e,u)&&r.push(n)});return r}function It(n,t,e){if(t=v.createCallback(t,e,3),!qe(n)){var r;return Xe(n,function(n,e,u){return t(n,e,u)?(r=n,false):void 0}),r}e=-1;for(var u=n.length;++e<u;){var o=n[e];if(t(o,e,n))return o}}function Dt(n,t,e){if(t&&typeof e=="undefined"&&qe(n)){e=-1;
for(var r=n.length;++e<r&&false!==t(n[e],e,n););}else Xe(n,t,e);return n}function Nt(n,t,e){var r=n,u=n?n.length:0;if(t=t&&typeof e=="undefined"?t:tt(t,e,3),qe(n))for(;u--&&false!==t(n[u],u,n););else{if(typeof u!="number")var o=We(n),u=o.length;else Le.unindexedChars&&kt(n)&&(r=n.split(""));Xe(n,function(n,e,a){return e=o?o[--u]:--u,t(r[e],e,a)})}return n}function Bt(n,t,e){var r=-1,u=n?n.length:0,o=Zt(typeof u=="number"?u:0);if(t=v.createCallback(t,e,3),qe(n))for(;++r<u;)o[r]=t(n[r],r,n);else Xe(n,function(n,e,u){o[++r]=t(n,e,u)
});return o}function Pt(n,t,e){var u=-1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&qe(n)){e=-1;for(var a=n.length;++e<a;){var i=n[e];i>o&&(o=i)}}else t=null==t&&kt(n)?r:v.createCallback(t,e,3),Xe(n,function(n,e,r){e=t(n,e,r),e>u&&(u=e,o=n)});return o}function Rt(n,t,e,r){var u=3>arguments.length;if(t=v.createCallback(t,r,4),qe(n)){var o=-1,a=n.length;for(u&&(e=n[++o]);++o<a;)e=t(e,n[o],o,n)}else Xe(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)});return e}function Ft(n,t,e,r){var u=3>arguments.length;
return t=v.createCallback(t,r,4),Nt(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)}),e}function Tt(n){var t=-1,e=n?n.length:0,r=Zt(typeof e=="number"?e:0);return Dt(n,function(n){var e=lt(0,++t);r[t]=r[e],r[e]=n}),r}function $t(n,t,e){var r;if(t=v.createCallback(t,e,3),qe(n)){e=-1;for(var u=n.length;++e<u&&!(r=t(n[e],e,n)););}else Xe(n,function(n,e,u){return!(r=t(n,e,u))});return!!r}function Lt(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=-1;for(t=v.createCallback(t,e,3);++o<u&&t(n[o],o,n);)r++
}else if(r=t,null==r||e)return n?n[0]:h;return s(n,0,Pe(Be(0,r),u))}function zt(t,e,r){if(typeof r=="number"){var u=t?t.length:0;r=0>r?Be(0,u+r):r||0}else if(r)return r=Kt(t,e),t[r]===e?r:-1;return n(t,e,r)}function qt(n,t,e){if(typeof t!="number"&&null!=t){var r=0,u=-1,o=n?n.length:0;for(t=v.createCallback(t,e,3);++u<o&&t(n[u],u,n);)r++}else r=null==t||e?1:Be(0,t);return s(n,r)}function Kt(n,t,e,r){var u=0,o=n?n.length:u;for(e=e?v.createCallback(e,r,1):Ht,t=e(t);u<o;)r=u+o>>>1,e(n[r])<t?u=r+1:o=r;
return u}function Wt(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(e=v.createCallback(e,r,3)),ft(n,t,e)}function Gt(){for(var n=1<arguments.length?arguments:arguments[0],t=-1,e=n?Pt(ar(n,"length")):0,r=Zt(0>e?0:e);++t<e;)r[t]=ar(n,t);return r}function Jt(n,t){var e=-1,r=n?n.length:0,u={};for(t||!r||qe(n[0])||(t=[]);++e<r;){var o=n[e];t?u[o]=t[e]:o&&(u[o[0]]=o[1])}return u}function Mt(n,t){return 2<arguments.length?pt(n,17,s(arguments,2),null,t):pt(n,1,null,null,t)
}function Vt(n,t,e){var r,u,o,a,i,l,f,c=0,p=false,s=true;if(!jt(n))throw new le;if(t=Be(0,t)||0,true===e)var g=true,s=false;else xt(e)&&(g=e.leading,p="maxWait"in e&&(Be(t,e.maxWait)||0),s="trailing"in e?e.trailing:s);var v=function(){var e=t-(ir()-a);0<e?l=Ce(v,e):(u&&me(u),e=f,u=l=f=h,e&&(c=ir(),o=n.apply(i,r),l||u||(r=i=null)))},y=function(){l&&me(l),u=l=f=h,(s||p!==t)&&(c=ir(),o=n.apply(i,r),l||u||(r=i=null))};return function(){if(r=arguments,a=ir(),i=this,f=s&&(l||!g),false===p)var e=g&&!l;else{u||g||(c=a);
var h=p-(a-c),m=0>=h;m?(u&&(u=me(u)),c=a,o=n.apply(i,r)):u||(u=Ce(y,h))}return m&&l?l=me(l):l||t===p||(l=Ce(v,t)),e&&(m=true,o=n.apply(i,r)),!m||l||u||(r=i=null),o}}function Ht(n){return n}function Ut(n,t,e){var r=true,u=t&&_t(t);t&&(e||u.length)||(null==e&&(e=t),o=y,t=n,n=v,u=_t(t)),false===e?r=false:xt(e)&&"chain"in e&&(r=e.chain);var o=n,a=jt(o);Dt(u,function(e){var u=n[e]=t[e];a&&(o.prototype[e]=function(){var t=this.__chain__,e=this.__wrapped__,a=[e];if(je.apply(a,arguments),a=u.apply(n,a),r||t){if(e===a&&xt(a))return this;
a=new o(a),a.__chain__=t}return a})})}function Qt(){}function Xt(n){return function(t){return t[n]}}function Yt(){return this.__wrapped__}e=e?ut.defaults(Z.Object(),e,ut.pick(Z,R)):Z;var Zt=e.Array,ne=e.Boolean,te=e.Date,ee=e.Function,re=e.Math,ue=e.Number,oe=e.Object,ae=e.RegExp,ie=e.String,le=e.TypeError,fe=[],ce=e.Error.prototype,pe=oe.prototype,se=ie.prototype,ge=e._,he=pe.toString,ve=ae("^"+ie(he).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),ye=re.ceil,me=e.clearTimeout,de=re.floor,be=ee.prototype.toString,_e=vt(_e=oe.getPrototypeOf)&&_e,we=pe.hasOwnProperty,je=fe.push,xe=pe.propertyIsEnumerable,Ce=e.setTimeout,ke=fe.splice,Ee=fe.unshift,Oe=function(){try{var n={},t=vt(t=oe.defineProperty)&&t,e=t(n,n,n)&&t
}catch(r){}return e}(),Se=vt(Se=oe.create)&&Se,Ae=vt(Ae=Zt.isArray)&&Ae,Ie=e.isFinite,De=e.isNaN,Ne=vt(Ne=oe.keys)&&Ne,Be=re.max,Pe=re.min,Re=e.parseInt,Fe=re.random,Te={};Te[$]=Zt,Te[L]=ne,Te[z]=te,Te[K]=ee,Te[G]=oe,Te[W]=ue,Te[J]=ae,Te[M]=ie;var $e={};$e[$]=$e[z]=$e[W]={constructor:true,toLocaleString:true,toString:true,valueOf:true},$e[L]=$e[M]={constructor:true,toString:true,valueOf:true},$e[q]=$e[K]=$e[J]={constructor:true,toString:true},$e[G]={constructor:true},function(){for(var n=F.length;n--;){var t,e=F[n];
for(t in $e)we.call($e,t)&&!we.call($e[t],e)&&($e[t][e]=false)}}(),y.prototype=v.prototype;var Le=v.support={};!function(){var n=function(){this.x=1},t={0:1,length:1},r=[];n.prototype={valueOf:1,y:1};for(var u in new n)r.push(u);for(u in arguments);Le.argsClass=he.call(arguments)==T,Le.argsObject=arguments.constructor==oe&&!(arguments instanceof Zt),Le.enumErrorProps=xe.call(ce,"message")||xe.call(ce,"name"),Le.enumPrototypes=xe.call(n,"prototype"),Le.funcDecomp=!vt(e.WinRTError)&&B.test(g),Le.funcNames=typeof ee.name=="string",Le.nonEnumArgs=0!=u,Le.nonEnumShadows=!/valueOf/.test(r),Le.ownLast="x"!=r[0],Le.spliceObjects=(fe.splice.call(t,0,1),!t[0]),Le.unindexedChars="xx"!="x"[0]+oe("x")[0];
try{Le.nodeClass=!(he.call(document)==G&&!({toString:0}+""))}catch(o){Le.nodeClass=true}}(1),v.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:I,variable:"",imports:{_:v}},Se||(nt=function(){function n(){}return function(t){if(xt(t)){n.prototype=t;var r=new n;n.prototype=null}return r||e.Object()}}());var ze=Oe?function(n,t){U.value=t,Oe(n,"__bindData__",U)}:Qt;Le.argsClass||(dt=function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&we.call(n,"callee")&&!xe.call(n,"callee")||false
});var qe=Ae||function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&he.call(n)==$||false},Ke=st({a:"z",e:"[]",i:"if(!(B[typeof z]))return E",g:"E.push(n)"}),We=Ne?function(n){return xt(n)?Le.enumPrototypes&&typeof n=="function"||Le.nonEnumArgs&&n.length&&dt(n)?Ke(n):Ne(n):[]}:Ke,Ge={a:"g,e,K",i:"e=e&&typeof K=='undefined'?e:d(e,K,3)",b:"typeof u=='number'",v:We,g:"if(e(t[n],n,g)===false)return E"},Je={a:"z,H,l",i:"var a=arguments,b=0,c=typeof l=='number'?2:a.length;while(++b<c){t=a[b];if(t&&B[typeof t]){",v:We,g:"if(typeof E[n]=='undefined')E[n]=t[n]",c:"}}"},Me={i:"if(!B[typeof t])return E;"+Ge.i,b:false},Ve={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},He=wt(Ve),Ue=ae("("+We(He).join("|")+")","g"),Qe=ae("["+We(Ve).join("")+"]","g"),Xe=st(Ge),Ye=st(Je,{i:Je.i.replace(";",";if(c>3&&typeof a[c-2]=='function'){var e=d(a[--c-1],a[c--],2)}else if(c>2&&typeof a[c-1]=='function'){e=a[--c]}"),g:"E[n]=e?e(E[n],t[n]):t[n]"}),Ze=st(Je),nr=st(Ge,Me,{j:false}),tr=st(Ge,Me);
jt(/x/)&&(jt=function(n){return typeof n=="function"&&he.call(n)==K});var er=_e?function(n){if(!n||he.call(n)!=G||!Le.argsClass&&dt(n))return false;var t=n.valueOf,e=vt(t)&&(e=_e(t))&&_e(e);return e?n==e||_e(n)==e:yt(n)}:yt,rr=ct(function(n,t,e){we.call(n,e)?n[e]++:n[e]=1}),ur=ct(function(n,t,e){(we.call(n,e)?n[e]:n[e]=[]).push(t)}),or=ct(function(n,t,e){n[e]=t}),ar=Bt,ir=vt(ir=te.now)&&ir||function(){return(new te).getTime()},lr=8==Re(j+"08")?Re:function(n,t){return Re(kt(n)?n.replace(D,""):n,t||0)};
return v.after=function(n,t){if(!jt(t))throw new le;return function(){return 1>--n?t.apply(this,arguments):void 0}},v.assign=Ye,v.at=function(n){var t=arguments,e=-1,r=ot(t,true,false,1),t=t[2]&&t[2][t[1]]===n?1:r.length,u=Zt(t);for(Le.unindexedChars&&kt(n)&&(n=n.split(""));++e<t;)u[e]=n[r[e]];return u},v.bind=Mt,v.bindAll=function(n){for(var t=1<arguments.length?ot(arguments,true,false,1):_t(n),e=-1,r=t.length;++e<r;){var u=t[e];n[u]=pt(n[u],1,null,null,n)}return n},v.bindKey=function(n,t){return 2<arguments.length?pt(t,19,s(arguments,2),null,n):pt(t,3,null,null,n)
},v.chain=function(n){return n=new y(n),n.__chain__=true,n},v.compact=function(n){for(var t=-1,e=n?n.length:0,r=[];++t<e;){var u=n[t];u&&r.push(u)}return r},v.compose=function(){for(var n=arguments,t=n.length;t--;)if(!jt(n[t]))throw new le;return function(){for(var t=arguments,e=n.length;e--;)t=[n[e].apply(this,t)];return t[0]}},v.constant=function(n){return function(){return n}},v.countBy=rr,v.create=function(n,t){var e=nt(n);return t?Ye(e,t):e},v.createCallback=function(n,t,e){var r=typeof n;if(null==n||"function"==r)return tt(n,t,e);
if("object"!=r)return Xt(n);var u=We(n),o=u[0],a=n[o];return 1!=u.length||a!==a||xt(a)?function(t){for(var e=u.length,r=false;e--&&(r=at(t[u[e]],n[u[e]],null,true)););return r}:function(n){return n=n[o],a===n&&(0!==a||1/a==1/n)}},v.curry=function(n,t){return t=typeof t=="number"?t:+t||n.length,pt(n,4,null,null,null,t)},v.debounce=Vt,v.defaults=Ze,v.defer=function(n){if(!jt(n))throw new le;var t=s(arguments,1);return Ce(function(){n.apply(h,t)},1)},v.delay=function(n,t){if(!jt(n))throw new le;var e=s(arguments,2);
return Ce(function(){n.apply(h,e)},t)},v.difference=function(n){return rt(n,ot(arguments,true,true,1))},v.filter=At,v.flatten=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(n=Bt(n,e,r)),ot(n,t)},v.forEach=Dt,v.forEachRight=Nt,v.forIn=nr,v.forInRight=function(n,t,e){var r=[];nr(n,function(n,t){r.push(t,n)});var u=r.length;for(t=tt(t,e,3);u--&&false!==t(r[u--],r[u],n););return n},v.forOwn=tr,v.forOwnRight=bt,v.functions=_t,v.groupBy=ur,v.indexBy=or,v.initial=function(n,t,e){var r=0,u=n?n.length:0;
if(typeof t!="number"&&null!=t){var o=u;for(t=v.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else r=null==t||e?1:t||r;return s(n,0,Pe(Be(0,u-r),u))},v.intersection=function(){for(var e=[],r=-1,u=arguments.length,a=i(),l=ht(),f=l===n,s=i();++r<u;){var g=arguments[r];(qe(g)||dt(g))&&(e.push(g),a.push(f&&g.length>=_&&o(r?e[r]:s)))}var f=e[0],h=-1,v=f?f.length:0,y=[];n:for(;++h<v;){var m=a[0],g=f[h];if(0>(m?t(m,g):l(s,g))){for(r=u,(m||s).push(g);--r;)if(m=a[r],0>(m?t(m,g):l(e[r],g)))continue n;y.push(g)
}}for(;u--;)(m=a[u])&&p(m);return c(a),c(s),y},v.invert=wt,v.invoke=function(n,t){var e=s(arguments,2),r=-1,u=typeof t=="function",o=n?n.length:0,a=Zt(typeof o=="number"?o:0);return Dt(n,function(n){a[++r]=(u?t:n[t]).apply(n,e)}),a},v.keys=We,v.map=Bt,v.mapValues=function(n,t,e){var r={};return t=v.createCallback(t,e,3),tr(n,function(n,e,u){r[e]=t(n,e,u)}),r},v.max=Pt,v.memoize=function(n,t){if(!jt(n))throw new le;var e=function(){var r=e.cache,u=t?t.apply(this,arguments):b+arguments[0];return we.call(r,u)?r[u]:r[u]=n.apply(this,arguments)
};return e.cache={},e},v.merge=function(n){var t=arguments,e=2;if(!xt(n))return n;if("number"!=typeof t[2]&&(e=t.length),3<e&&"function"==typeof t[e-2])var r=tt(t[--e-1],t[e--],2);else 2<e&&"function"==typeof t[e-1]&&(r=t[--e]);for(var t=s(arguments,1,e),u=-1,o=i(),a=i();++u<e;)it(n,t[u],r,o,a);return c(o),c(a),n},v.min=function(n,t,e){var u=1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&qe(n)){e=-1;for(var a=n.length;++e<a;){var i=n[e];i<o&&(o=i)}}else t=null==t&&kt(n)?r:v.createCallback(t,e,3),Xe(n,function(n,e,r){e=t(n,e,r),e<u&&(u=e,o=n)
});return o},v.omit=function(n,t,e){var r={};if(typeof t!="function"){var u=[];nr(n,function(n,t){u.push(t)});for(var u=rt(u,ot(arguments,true,false,1)),o=-1,a=u.length;++o<a;){var i=u[o];r[i]=n[i]}}else t=v.createCallback(t,e,3),nr(n,function(n,e,u){t(n,e,u)||(r[e]=n)});return r},v.once=function(n){var t,e;if(!jt(n))throw new le;return function(){return t?e:(t=true,e=n.apply(this,arguments),n=null,e)}},v.pairs=function(n){for(var t=-1,e=We(n),r=e.length,u=Zt(r);++t<r;){var o=e[t];u[t]=[o,n[o]]}return u
},v.partial=function(n){return pt(n,16,s(arguments,1))},v.partialRight=function(n){return pt(n,32,null,s(arguments,1))},v.pick=function(n,t,e){var r={};if(typeof t!="function")for(var u=-1,o=ot(arguments,true,false,1),a=xt(n)?o.length:0;++u<a;){var i=o[u];i in n&&(r[i]=n[i])}else t=v.createCallback(t,e,3),nr(n,function(n,e,u){t(n,e,u)&&(r[e]=n)});return r},v.pluck=ar,v.property=Xt,v.pull=function(n){for(var t=arguments,e=0,r=t.length,u=n?n.length:0;++e<r;)for(var o=-1,a=t[e];++o<u;)n[o]===a&&(ke.call(n,o--,1),u--);
return n},v.range=function(n,t,e){n=+n||0,e=typeof e=="number"?e:+e||1,null==t&&(t=n,n=0);var r=-1;t=Be(0,ye((t-n)/(e||1)));for(var u=Zt(t);++r<t;)u[r]=n,n+=e;return u},v.reject=function(n,t,e){return t=v.createCallback(t,e,3),At(n,function(n,e,r){return!t(n,e,r)})},v.remove=function(n,t,e){var r=-1,u=n?n.length:0,o=[];for(t=v.createCallback(t,e,3);++r<u;)e=n[r],t(e,r,n)&&(o.push(e),ke.call(n,r--,1),u--);return o},v.rest=qt,v.shuffle=Tt,v.sortBy=function(n,t,e){var r=-1,o=qe(t),a=n?n.length:0,f=Zt(typeof a=="number"?a:0);
for(o||(t=v.createCallback(t,e,3)),Dt(n,function(n,e,u){var a=f[++r]=l();o?a.m=Bt(t,function(t){return n[t]}):(a.m=i())[0]=t(n,e,u),a.n=r,a.o=n}),a=f.length,f.sort(u);a--;)n=f[a],f[a]=n.o,o||c(n.m),p(n);return f},v.tap=function(n,t){return t(n),n},v.throttle=function(n,t,e){var r=true,u=true;if(!jt(n))throw new le;return false===e?r=false:xt(e)&&(r="leading"in e?e.leading:r,u="trailing"in e?e.trailing:u),H.leading=r,H.maxWait=t,H.trailing=u,Vt(n,t,H)},v.times=function(n,t,e){n=-1<(n=+n)?n:0;var r=-1,u=Zt(n);
for(t=tt(t,e,1);++r<n;)u[r]=t(r);return u},v.toArray=function(n){return n&&typeof n.length=="number"?Le.unindexedChars&&kt(n)?n.split(""):s(n):Et(n)},v.transform=function(n,t,e,r){var u=qe(n);if(null==e)if(u)e=[];else{var o=n&&n.constructor;e=nt(o&&o.prototype)}return t&&(t=v.createCallback(t,r,4),(u?Xe:tr)(n,function(n,r,u){return t(e,n,r,u)})),e},v.union=function(){return ft(ot(arguments,true,true))},v.uniq=Wt,v.values=Et,v.where=At,v.without=function(n){return rt(n,s(arguments,1))},v.wrap=function(n,t){return pt(t,16,[n])
},v.xor=function(){for(var n=-1,t=arguments.length;++n<t;){var e=arguments[n];if(qe(e)||dt(e))var r=r?ft(rt(r,e).concat(rt(e,r))):e}return r||[]},v.zip=Gt,v.zipObject=Jt,v.collect=Bt,v.drop=qt,v.each=Dt,v.eachRight=Nt,v.extend=Ye,v.methods=_t,v.object=Jt,v.select=At,v.tail=qt,v.unique=Wt,v.unzip=Gt,Ut(v),v.clone=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=t,t=false),Y(n,t,typeof e=="function"&&tt(e,r,1))},v.cloneDeep=function(n,t,e){return Y(n,true,typeof t=="function"&&tt(t,e,1))},v.contains=Ot,v.escape=function(n){return null==n?"":ie(n).replace(Qe,gt)
},v.every=St,v.find=It,v.findIndex=function(n,t,e){var r=-1,u=n?n.length:0;for(t=v.createCallback(t,e,3);++r<u;)if(t(n[r],r,n))return r;return-1},v.findKey=function(n,t,e){var r;return t=v.createCallback(t,e,3),tr(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},v.findLast=function(n,t,e){var r;return t=v.createCallback(t,e,3),Nt(n,function(n,e,u){return t(n,e,u)?(r=n,false):void 0}),r},v.findLastIndex=function(n,t,e){var r=n?n.length:0;for(t=v.createCallback(t,e,3);r--;)if(t(n[r],r,n))return r;
return-1},v.findLastKey=function(n,t,e){var r;return t=v.createCallback(t,e,3),bt(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},v.has=function(n,t){return n?we.call(n,t):false},v.identity=Ht,v.indexOf=zt,v.isArguments=dt,v.isArray=qe,v.isBoolean=function(n){return true===n||false===n||n&&typeof n=="object"&&he.call(n)==L||false},v.isDate=function(n){return n&&typeof n=="object"&&he.call(n)==z||false},v.isElement=function(n){return n&&1===n.nodeType||false},v.isEmpty=function(n){var t=true;if(!n)return t;var e=he.call(n),r=n.length;
return e==$||e==M||(Le.argsClass?e==T:dt(n))||e==G&&typeof r=="number"&&jt(n.splice)?!r:(tr(n,function(){return t=false}),t)},v.isEqual=function(n,t,e,r){return at(n,t,typeof e=="function"&&tt(e,r,2))},v.isFinite=function(n){return Ie(n)&&!De(parseFloat(n))},v.isFunction=jt,v.isNaN=function(n){return Ct(n)&&n!=+n},v.isNull=function(n){return null===n},v.isNumber=Ct,v.isObject=xt,v.isPlainObject=er,v.isRegExp=function(n){return n&&X[typeof n]&&he.call(n)==J||false},v.isString=kt,v.isUndefined=function(n){return typeof n=="undefined"
},v.lastIndexOf=function(n,t,e){var r=n?n.length:0;for(typeof e=="number"&&(r=(0>e?Be(0,r+e):Pe(e,r-1))+1);r--;)if(n[r]===t)return r;return-1},v.mixin=Ut,v.noConflict=function(){return e._=ge,this},v.noop=Qt,v.now=ir,v.parseInt=lr,v.random=function(n,t,e){var r=null==n,u=null==t;return null==e&&(typeof n=="boolean"&&u?(e=n,n=1):u||typeof t!="boolean"||(e=t,u=true)),r&&u&&(t=1),n=+n||0,u?(t=n,n=0):t=+t||0,e||n%1||t%1?(e=Fe(),Pe(n+e*(t-n+parseFloat("1e-"+((e+"").length-1))),t)):lt(n,t)},v.reduce=Rt,v.reduceRight=Ft,v.result=function(n,t){if(n){var e=n[t];
return jt(e)?n[t]():e}},v.runInContext=g,v.size=function(n){var t=n?n.length:0;return typeof t=="number"?t:We(n).length},v.some=$t,v.sortedIndex=Kt,v.template=function(n,t,e){var r=v.templateSettings;n=ie(n||""),e=Ze({},e,r);var u,o=Ze({},e.imports,r.imports),r=We(o),o=Et(o),i=0,l=e.interpolate||N,f="__p+='",l=ae((e.escape||N).source+"|"+l.source+"|"+(l===I?O:N).source+"|"+(e.evaluate||N).source+"|$","g");n.replace(l,function(t,e,r,o,l,c){return r||(r=o),f+=n.slice(i,c).replace(P,a),e&&(f+="'+__e("+e+")+'"),l&&(u=true,f+="';"+l+";\n__p+='"),r&&(f+="'+((__t=("+r+"))==null?'':__t)+'"),i=c+t.length,t
}),f+="';",l=e=e.variable,l||(e="obj",f="with("+e+"){"+f+"}"),f=(u?f.replace(x,""):f).replace(C,"$1").replace(E,"$1;"),f="function("+e+"){"+(l?"":e+"||("+e+"={});")+"var __t,__p='',__e=_.escape"+(u?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+f+"return __p}";try{var c=ee(r,"return "+f).apply(h,o)}catch(p){throw p.source=f,p}return t?c(t):(c.source=f,c)},v.unescape=function(n){return null==n?"":ie(n).replace(Ue,mt)},v.uniqueId=function(n){var t=++m;return ie(null==n?"":n)+t
},v.all=St,v.any=$t,v.detect=It,v.findWhere=It,v.foldl=Rt,v.foldr=Ft,v.include=Ot,v.inject=Rt,Ut(function(){var n={};return tr(v,function(t,e){v.prototype[e]||(n[e]=t)}),n}(),false),v.first=Lt,v.last=function(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=u;for(t=v.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[u-1]:h;return s(n,Be(0,u-r))},v.sample=function(n,t,e){return n&&typeof n.length!="number"?n=Et(n):Le.unindexedChars&&kt(n)&&(n=n.split("")),null==t||e?n?n[lt(0,n.length-1)]:h:(n=Tt(n),n.length=Pe(Be(0,t),n.length),n)
},v.take=Lt,v.head=Lt,tr(v,function(n,t){var e="sample"!==t;v.prototype[t]||(v.prototype[t]=function(t,r){var u=this.__chain__,o=n(this.__wrapped__,t,r);return u||null!=t&&(!r||e&&typeof t=="function")?new y(o,u):o})}),v.VERSION="2.4.1",v.prototype.chain=function(){return this.__chain__=true,this},v.prototype.toString=function(){return ie(this.__wrapped__)},v.prototype.value=Yt,v.prototype.valueOf=Yt,Xe(["join","pop","shift"],function(n){var t=fe[n];v.prototype[n]=function(){var n=this.__chain__,e=t.apply(this.__wrapped__,arguments);
return n?new y(e,n):e}}),Xe(["push","reverse","sort","unshift"],function(n){var t=fe[n];v.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),Xe(["concat","slice","splice"],function(n){var t=fe[n];v.prototype[n]=function(){return new y(t.apply(this.__wrapped__,arguments),this.__chain__)}}),Le.spliceObjects||Xe(["pop","shift","splice"],function(n){var t=fe[n],e="splice"==n;v.prototype[n]=function(){var n=this.__chain__,r=this.__wrapped__,u=t.apply(r,arguments);return 0===r.length&&delete r[0],n||e?new y(u,n):u
}}),v}var h,v=[],y=[],m=0,d={},b=+new Date+"",_=75,w=40,j=" \t\x0B\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",x=/\b__p\+='';/g,C=/\b(__p\+=)''\+/g,E=/(__e\(.*?\)|\b__t\))\+'';/g,O=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,S=/\w*$/,A=/^\s*function[ \n\r\t]+\w/,I=/<%=([\s\S]+?)%>/g,D=RegExp("^["+j+"]*0+(?=.$)"),N=/($^)/,B=/\bthis\b/,P=/['\n\r\t\u2028\u2029\\]/g,R="Array Boolean Date Error Function Math Number Object RegExp String _ attachEvent clearTimeout isFinite isNaN parseInt setTimeout".split(" "),F="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),T="[object Arguments]",$="[object Array]",L="[object Boolean]",z="[object Date]",q="[object Error]",K="[object Function]",W="[object Number]",G="[object Object]",J="[object RegExp]",M="[object String]",V={};
V[K]=false,V[T]=V[$]=V[L]=V[z]=V[W]=V[G]=V[J]=V[M]=true;var H={leading:false,maxWait:0,trailing:false},U={configurable:false,enumerable:false,value:null,writable:false},Q={a:"",b:null,c:"",d:"",e:"",v:null,g:"",h:null,support:null,i:"",j:false},X={"boolean":false,"function":true,object:true,number:false,string:false,undefined:false},Y={"\\":"\\","'":"'","\n":"n","\r":"r","\t":"t","\u2028":"u2028","\u2029":"u2029"},Z=X[typeof window]&&window||this,nt=X[typeof exports]&&exports&&!exports.nodeType&&exports,tt=X[typeof module]&&module&&!module.nodeType&&module,et=tt&&tt.exports===nt&&nt,rt=X[typeof global]&&global;
!rt||rt.global!==rt&&rt.window!==rt||(Z=rt);var ut=g();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(Z._=ut, define(function(){return ut})):nt&&tt?et?(tt.exports=ut)._=ut:nt._=ut:Z._=ut}).call(this);
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
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



},{}],16:[function(require,module,exports){
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

},{"../lib/cookies":1}],17:[function(require,module,exports){
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



},{"../lib/idialog":4}],18:[function(require,module,exports){
var http = require("../mod/http.js");
var _ = require("../lib/lodash.compat.min.js");
require("../lib/juicer.js");
var $ = require("../lib/jquery.js");
require("../lib/iform.js");
var AD_TPL = require("./operation/tmpl/home_ad_item.js");
var Uploader = require("../lib/iupload.js");


$(function(){
    
    var $container = $("#js-container");
    var cur_index = 0; 
    getOnlineData();

    $("#lined-btn").click(function(e){
        getOnlineData();
    });
    $("#draft-btn").click(function(e){
       getDraftData(); 
    });
    $("#add-btn").click(function(e){
        e.preventDefault();
        createItemDom(null);
    });
    $("#save-btn").click(function(e){
        var nf = false;
        var $doms = $container.find("div.ai-item");
        var datas = _.map($doms,function(dom,i){
            var data = $(dom).data("get_data")();
            if (!(data.imageUrl && data.entityId)) {
                alert("第"+(i+1)+"个项目，没有填写完整");
                nf = true;
                return null;
            }
            return data;
        });
            
        if (!nf && datas.length) {
            http.post({
                url : "/api/saveAdvertise.htm",
                data : { data : JSON.stringify(datas) }
            }).done(function(rs){
                 if (rs.list && rs.list.length) {
                    $doms.each(function(i,d){
                        $(d).find("input[name=ad_id]").val(rs.list[i].id);
                    });
                    alert("保存成功");
                 } else {
                    alert("服务器错误");
                    return;
                 }
            }).fail(function(){
                alert("服务器错误");
                return;
            })
        }
    });
    $("#online-btn").click(function(e){
        var f = window.confirm("确认要上线推送到首页么？");
        if (!f) {
            return ;
        }
        var nf = false;
        var $doms = $container.find("div.ai-item");
        var datas = _.map($doms,function(dom,i){
            var data = $(dom).data("get_data")();
            if (!data.id ) {
                alert("第"+(i+1)+"个项目，没有ID，没有存入数据库");
                nf = true;
                return null;
            }
            return data.id;
        });

        if (!nf && datas.length) {
            http.post({
                url : "/api/setAdvertiseOnline.htm",
                data : { id : datas.join(",") }
            }).done(function(rs){
                if (rs.ret == 1 ) {
                    alert("上线成功");
                } else {
                    alert("上线失败");
                }
            }).fail(function(){
                alert("服务器错误");
                return;
            })
        }

 
    });
    $container.delegate(".tools a.fa-times","click",function(e){
        e.preventDefault();
        $(this).closest("div.ai-item").remove();
    });
    function getOnlineData(){
        http.get({
            url : "/api/getAdvertiseList.htm"
        }).done(function(rs){
            $container.empty().append('<h2>线上数据</h2>');
            var list = rs.list;
            if (list && list.length) {
               _.forEach(list,function(l,i){
                 createItemDom(l);
               }); 
            } else {
                alert("目前首页轮播无数据");
            }
        }).fail(function(){
            alert("获取首页推荐信息错误");
        })
    }
    function getDraftData(){
        $container.empty().append('<h2>草稿数据</h2>');
        http.get({
            url : "/api/getDraftsAdvertiseList.htm"
        }).done(function(rs){
            var list = rs.list;
            if (list && list.length) {
               _.forEach(list,function(l,i){
                 createItemDom(l);
               }); 
            } else {
                alert("目前暂无草稿无数据");
            }
        }).fail(function(){
            alert("获取首页推荐信息错误");
        });
    }
    
    function createItemDom(data){
        var html = AD_TPL({
            index : cur_index+1
        });
        cur_index ++;
        var dom = $(html);
        var up_load = dom.find(".js-upload");
        $container.append(dom); 

        Uploader.create_upload({
            dom : up_load[0],
            multi_selection : false,
            callback : function(data,files){
                var pathList = data.pathList;
                if (pathList && pathList.length) {
                    var img = pathList[0];
                    dom.find("div.js-imgbox").html('<img src="'+img+'" >');
                    dom.find("input[name=image_url]").val(img);
                }
            }
        });
        var $form = dom.find("form")
        $form.form({
            data_map : {
                id : "input[name=ad_id]",
                imageUrl : "input[name=image_url]",
                /**
                status :{cls:"input[type=radio]" , val : function($ele){
                        var val ;
                        if ($ele[0].checked) {
                            val = $ele[0].value;
                        } else {
                            val = $ele[1].value;
                        }
                        return val;
                    }
                },
                **/
                adType : "select.js-type" ,
                entityId : "input[name=id]"
            } 
        });

        $form.on("form-submit",function(e,data){
            
        });
        dom.data("get_data",function(){
           return $form.data("iform").get_submit_data(); 
        });
        if (data) {
            dom.data("item",data);
            dom.find("input[name=ad_id]").val(data.id);
            if (data.imageUrl) {
                var img = data.imageUrl;
                dom.find("div.js-imgbox").html('<img src="'+img+'" >');
                dom.find("input[name=image_url]").val(img);
            }
            if (data.adType !== void 0) {
                dom.find("select.js-type").val(data.adType);
            }
            if (data.entityId) {
               dom.find("input[name=id]").val(data.entityId);
            }

        }
        
    }

});

},{"../lib/iform.js":5,"../lib/iupload.js":6,"../lib/jquery.js":7,"../lib/juicer.js":9,"../lib/lodash.compat.min.js":14,"../mod/http.js":16,"./operation/tmpl/home_ad_item.js":19}],19:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['home_ad_item.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var div=_.div;var item=_.item;var lg=_.lg;var heading=_.heading;var span=_.span;var right=_.right;var a=_.a;var times=_.times;var body=_.body;var sm=_.sm;var form=_.form;var horizontal=_.horizontal;var input=_.input;var group=_.group;var label=_.label;var control=_.control;var btn=_.btn;var button=_.button;var primary=_.primary;var upload=_.upload;var align=_.align;var left=_.left;var select=_.select;var type=_.type;var not=_.not;var init=_.init;var option=_.option;var ul=_.ul;var pills=_.pills;var stacked=_.stacked;var li=_.li;var ID=_.ID;var wrap=_.wrap;var imgbox=_.imgbox; _out+=' <div class="row ai-item">     <div class="col-lg-12">         <div class="panel clearfix">             <div class="panel-heading">                 首页轮播                 <span class="tools pull-right">                         <a class="fa fa-times" href="javascript:;"></a>                 </span>             </div>             <div class="panel-body">                 <div class="col-sm-7">                     <div class="m-form " style="margin-right:20px;">                         <form class="form-horizontal" id="subject_form">                             <input type="hidden" name="ad_id" value="" >                             <div class="form-group">                                 <label for="subject_logo" class="col-sm-3 control-label" >图片</label>                                 <div class="col-sm-9 input-group">                                     <input type="text" class="form-control" name="image_url" placeholder="可以填链接也可以上传">                                     <span class="input-group-btn">                                         <button class="btn btn-primary js-upload"  type="button" >上传图片</button>                                      </span>                                 </div>                             </div>                             <div class="form-group hide">                                 <label  class="col-sm-3 control-label" >上下线状态</label>                                 <div class="col-sm-4  control-label" style="text-align:left;">                                     <label for="status_1_0">                                     下线                                     <input type="radio" value="0" name ="status_0" id="status_1_0">                                     </label>                                     <label for="statis_1_1" style="margin-left:20px;">                                     上线                                     <input type="radio" value="1" name ="status_0" id="status_1_1">                                     </label>                                 </div>                             </div>                             <div class="form-group">                                 <div class="col-sm-3 control-label" >类型</div>                                 <div class="col-sm-2 control-label" style="text-align:left;">                                     <select class="js-type" data-not-init="true">                                         <option value="2">专题</option>                                         <option value="0">产品</option>                                         <option value="1" >商铺</option>                                     </select>                                     </div>                                 <div class="col-sm-5 control-label" style="text-align:left;">                                     <ul class="nav nav-pills nav-stacked">                                         <li> ID:<input type="text" value="" name="id" ></li>                                     </ul>                                     </div>                             </div>                             <div class="form-group hide">                                 <div  class="col-sm-3 control-label" >备注：</div>                                 <div class="col-sm-9 input-group">                                     <input type="text" class="form-control" name="text">                                 </div>                             </div>                         </form>                     </div>                    </div>                  <div class="col-sm-5">                      <div class="img-wrap js-imgbox">                      </div>                  </div>                 </div>         </div>     </div> </div>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['home_ad_item.tmpl'];
},{}]},{},[18])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9jb29raWVzLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2licm93c2VyLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2ljaGVja2JveC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9pZGlhbG9nLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2lmb3JtLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2l1cGxvYWQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanF1ZXJ5LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2pxdWVyeS5wbGFjZWhvbGRlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9qdWljZXIuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanZhbGlkYXRvci9zcmMvQXN5bmNSZXF1ZXN0LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2p2YWxpZGF0b3Ivc3JjL1J1bGVQYXJzZXIuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanZhbGlkYXRvci9zcmMvVmFsaWRhdG9yLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2p2YWxpZGF0b3Ivc3JjL2luZGV4LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2xvZGFzaC5jb21wYXQubWluLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL3ktc2VsZWN0b3IuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9tb2QvaHR0cC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL21vZC9wb3AuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL2Zha2VfOWEwZWJjMjkuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi90bXBsL2hvbWVfYWRfaXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBkb2NDb29raWUgPSAoZnVuY3Rpb24odW5kZWZpbmVkKSB7XG4gIC8qXFxcbiAgfCp8XG4gIHwqfCAgOjogY29va2llcy5qcyA6OlxuICB8KnxcbiAgfCp8ICBBIGNvbXBsZXRlIGNvb2tpZXMgcmVhZGVyL3dyaXRlciBmcmFtZXdvcmsgd2l0aCBmdWxsIHVuaWNvZGUgc3VwcG9ydC5cbiAgfCp8XG4gIHwqfCAgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vZG9jdW1lbnQuY29va2llXG4gIHwqfFxuICB8KnwgIFRoaXMgZnJhbWV3b3JrIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgUHVibGljIExpY2Vuc2UsIHZlcnNpb24gMyBvciBsYXRlci5cbiAgfCp8ICBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTMuMC1zdGFuZGFsb25lLmh0bWxcbiAgfCp8XG4gIHwqfCAgU3ludGF4ZXM6XG4gIHwqfFxuICB8KnwgICogZG9jQ29va2llcy5zZXRJdGVtKG5hbWUsIHZhbHVlWywgZW5kWywgcGF0aFssIGRvbWFpblssIHNlY3VyZV1dXV0pXG4gIHwqfCAgKiBkb2NDb29raWVzLmdldEl0ZW0obmFtZSlcbiAgfCp8ICAqIGRvY0Nvb2tpZXMucmVtb3ZlSXRlbShuYW1lWywgcGF0aF0sIGRvbWFpbilcbiAgfCp8ICAqIGRvY0Nvb2tpZXMuaGFzSXRlbShuYW1lKVxuICB8KnwgICogZG9jQ29va2llcy5rZXlzKClcbiAgfCp8XG4gIFxcKi9cblxuICB2YXIgZG9jQ29va2llcyA9IHtcbiAgICBnZXRJdGVtOiBmdW5jdGlvbiAoc0tleSkge1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKD86KD86XnwuKjspXFxcXHMqXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc0tleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XFxcXHMqKFteO10qKS4qJCl8Xi4qJFwiKSwgXCIkMVwiKSkgfHwgbnVsbDtcbiAgICB9LFxuICAgIHNldEl0ZW06IGZ1bmN0aW9uIChzS2V5LCBzVmFsdWUsIHZFbmQsIHNQYXRoLCBzRG9tYWluLCBiU2VjdXJlKSB7XG4gICAgICBpZiAoIXNLZXkgfHwgL14oPzpleHBpcmVzfG1heFxcLWFnZXxwYXRofGRvbWFpbnxzZWN1cmUpJC9pLnRlc3Qoc0tleSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICB2YXIgc0V4cGlyZXMgPSBcIlwiO1xuICAgICAgaWYgKHZFbmQpIHtcbiAgICAgICAgc3dpdGNoICh2RW5kLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgY2FzZSBOdW1iZXI6XG4gICAgICAgICAgICBzRXhwaXJlcyA9IHZFbmQgPT09IEluZmluaXR5ID8gXCI7IGV4cGlyZXM9RnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBHTVRcIiA6IFwiOyBtYXgtYWdlPVwiICsgdkVuZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgU3RyaW5nOlxuICAgICAgICAgICAgc0V4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIHZFbmQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIERhdGU6XG4gICAgICAgICAgICBzRXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgdkVuZC50b1VUQ1N0cmluZygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChzS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNWYWx1ZSkgKyBzRXhwaXJlcyArIChzRG9tYWluID8gXCI7IGRvbWFpbj1cIiArIHNEb21haW4gOiBcIlwiKSArIChzUGF0aCA/IFwiOyBwYXRoPVwiICsgc1BhdGggOiBcIlwiKSArIChiU2VjdXJlID8gXCI7IHNlY3VyZVwiIDogXCJcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG5cbiAgICByZW1vdmVJdGVtOiBmdW5jdGlvbiAoc0tleSwgc1BhdGgsIHNEb21haW4pIHtcbiAgICAgIGlmICghc0tleSB8fCAhdGhpcy5oYXNJdGVtKHNLZXkpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgZG9jdW1lbnQuY29va2llID0gZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpICsgXCI9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UXCIgKyAoIHNEb21haW4gPyBcIjsgZG9tYWluPVwiICsgc0RvbWFpbiA6IFwiXCIpICsgKCBzUGF0aCA/IFwiOyBwYXRoPVwiICsgc1BhdGggOiBcIlwiKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaGFzSXRlbTogZnVuY3Rpb24gKHNLZXkpIHtcbiAgICAgIHJldHVybiAobmV3IFJlZ0V4cChcIig/Ol58O1xcXFxzKilcIiArIGVuY29kZVVSSUNvbXBvbmVudChzS2V5KS5yZXBsYWNlKC9bXFwtXFwuXFwrXFwqXS9nLCBcIlxcXFwkJlwiKSArIFwiXFxcXHMqXFxcXD1cIikpLnRlc3QoZG9jdW1lbnQuY29va2llKTtcbiAgICB9LFxuICAgIGtleXM6IC8qIG9wdGlvbmFsIG1ldGhvZDogeW91IGNhbiBzYWZlbHkgcmVtb3ZlIGl0ISAqLyBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYUtleXMgPSBkb2N1bWVudC5jb29raWUucmVwbGFjZSgvKCg/Ol58XFxzKjspW15cXD1dKykoPz07fCQpfF5cXHMqfFxccyooPzpcXD1bXjtdKik/KD86XFwxfCQpL2csIFwiXCIpLnNwbGl0KC9cXHMqKD86XFw9W147XSopPztcXHMqLyk7XG4gICAgICBmb3IgKHZhciBuSWR4ID0gMDsgbklkeCA8IGFLZXlzLmxlbmd0aDsgbklkeCsrKSB7IGFLZXlzW25JZHhdID0gZGVjb2RlVVJJQ29tcG9uZW50KGFLZXlzW25JZHhdKTsgfVxuICAgICAgcmV0dXJuIGFLZXlzO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGRvY0Nvb2tpZXM7XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSAgZG9jQ29va2llO1xuXG4iLCIvL+a1j+iniOWZqOWIpOaWrVxudmFyIHVhICA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCksXG4gICAgY2hlY2sgPSBmdW5jdGlvbihyKXtcbiAgICAgICAgcmV0dXJuIHIudGVzdCh1YSk7XG4gICAgfTtcbnZhciBpc09wZXJhICA9ICBjaGVjaygvb3BlcmEvKSxcbiAgICBpc0Nocm9tZSA9IGNoZWNrKC9cXGJjaHJvbWVcXGIvKSxcbiAgICBpc1dlYktpdCA9IGNoZWNrKC93ZWJraXQvKSxcbiAgICBpc1NhZmFyaSA9ICFpc0Nocm9tZSAmJiBpc1dlYktpdCxcbiAgICBpc0lFICAgICA9IGNoZWNrKC9tc2llLykgJiYgZG9jdW1lbnQuYWxsICYmICFpc09wZXJhLFxuICAgIGlzSUU3ICAgID0gY2hlY2soL21zaWUgNy8pLFxuICAgIGlzSUU4ICAgID0gY2hlY2soL21zaWUgOC8pLFxuICAgIGlzSUU5ICAgID0gY2hlY2soL21zaWUgOS8pLFxuICAgIGlzSUUxMCAgICA9IGNoZWNrKC9tc2llIDEwLyksXG4gICAgaXNJRTYgICAgPSBpc0lFICYmICFpc0lFNyAmJiAhaXNJRTggJiYgIWlzSUU5ICYmICFpc0lFMTAsXG4gICAgaXNJRTExICAgPSBjaGVjaygvdHJpZGVudC8pICYmIHVhLm1hdGNoKC9ydjooW1xcZC5dKykvKT90cnVlOmZhbHNlLFxuICAgIGlzR2Vja28gID0gY2hlY2soL2dlY2tvLykgJiYgIWlzV2ViS2l0LFxuICAgIGlzTWFjICAgID0gY2hlY2soL21hYy8pO1xuXG52YXIgQnJvd3NlciA9IHtcbiAgICBpc09wZXJhIDogaXNPcGVyYSxcbiAgICBpc0Nocm9tZSA6IGlzQ2hyb21lLFxuICAgIGlzV2ViS2l0IDogaXNXZWJLaXQsXG4gICAgaXNTYWZhcmkgOiBpc1NhZmFyaSxcbiAgICBpc0lFICAgICA6IGlzSUUsXG4gICAgaXNJRTcgICAgOiBpc0lFNyxcbiAgICBpc0lFOCAgICA6IGlzSUU4LFxuICAgIGlzSUU5ICAgIDogaXNJRTksXG4gICAgaXNJRTYgICAgOiBpc0lFNixcbiAgICBpc0lFMTEgICAgOmlzSUUxMSxcbiAgICBpc0dlY2tvICA6IGlzR2Vja28sXG4gICAgaXNNYWMgICAgOiBpc01hY1xufTtcbm1vZHVsZS5leHBvcnRzID0gQnJvd3NlcjtcbiIsInZhciAkID0gcmVxdWlyZSgnLi9qcXVlcnknKTtcblxudmFyIENoZWNrYm94ID0gZnVuY3Rpb24oZG9tKXtcbiAgICB0aGlzLl8kZG9tID0gZG9tO1xuICAgIHRoaXMuXyRjaGVja2JveCA9IGRvbS5maW5kKFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIik7XG4gICAgdGhpcy5pbml0KCk7XG59XG5cbkNoZWNrYm94LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgY2hlY2tlZCA9IHRoaXMuXyRjaGVja2JveC5hdHRyKFwiY2hlY2tlZFwiKTtcbiAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgICB0aGlzLl8kZG9tLmFkZENsYXNzKFwiY2hlY2tlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl8kZG9tLnJlbW92ZUNsYXNzKFwiY2hlY2tlZFwiKTtcbiAgICB9XG4gICAgdGhpcy5fbGlzdGVuX2RvbV9ldmVudCgpO1xufVxuQ2hlY2tib3gucHJvdG90eXBlLl9saXN0ZW5fZG9tX2V2ZW50ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbWUgPSB0aGlzICwgY2hlY2tib3ggPSB0aGlzLl8kY2hlY2tib3g7XG4gICAgdGhpcy5fJGRvbS5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgaWYgKGNoZWNrYm94LmF0dHIoXCJjaGVja2VkXCIpKSB7XG4gICAgICAgICAgICBtZS51bmNoZWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZS5jaGVjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbkNoZWNrYm94LnByb3RvdHlwZS51bmNoZWNrID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLl8kY2hlY2tib3gucmVtb3ZlQXR0cihcImNoZWNrZWRcIik7XG4gICAgdGhpcy5fJGRvbS5yZW1vdmVDbGFzcyhcImNoZWNrZWRcIik7XG59XG5cbkNoZWNrYm94LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5fJGNoZWNrYm94LmF0dHIoXCJjaGVja2VkXCIsdHJ1ZSk7XG4gICAgdGhpcy5fJGRvbS5hZGRDbGFzcyhcImNoZWNrZWRcIik7XG59XG5cbiQuZm4uY2hlY2tib3ggPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoXCJpY2hlY2tib3hcIik7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICR0aGlzLmRhdGEoXCJpY2hlY2tib3hcIiwoZGF0YSA9IG5ldyBDaGVja2JveCgkdGhpcykpKTsgICAgXG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsInZhciBCcm93c2VyID0gcmVxdWlyZShcIi4vaWJyb3dzZXJcIik7XHJcbnZhciBEaWFsb2cgID0gKGZ1bmN0aW9uKCQsd2luZG93KXtcclxuXHRcdHZhciBfaXNJRSAgPSBCcm93c2VyLmlzSUUsXHJcblx0XHQgICAgX2lzSUU2ID0gQnJvd3Nlci5pc0lFNixcclxuXHRcdFx0JGRvYyAgID0gJCh3aW5kb3cuZG9jdW1lbnQpLFxyXG5cdFx0XHQkYm9keSAgPSAkKCdib2R5JyksXHJcblx0XHRcdCR3aW4gICA9ICQod2luZG93KTsgXHJcbiAgICAgICAgdmFyIElFNl9MRUZUX09GRlNFVCA9IDE2OyAvL0lFNuS4i+a7keWKqOadoeeahOWuveW6plxyXG5cdFx0dmFyIF9pc01hYyA9IEJyb3dzZXIuaXNNYWM7XHJcblx0XHR2YXIgaGFzU2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgLy/pmLLmraLlvJXnlKhKU+aWh+S7tuWcqGhlYWQg6YeM5Y+W5LiN5YiwYm9keVxyXG4gICAgICAgIGlmICghJGJvZHlbMF0pIHtcclxuICAgICAgICAgICAgJChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJGJvZHkgPSAgJCgnYm9keScpOyBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v6IOM5pmvIOWJjeaZryBcclxuXHRcdHZhciBkbGdfbWFza19odG1sID0gJzxkaXYgY2xhc3M9XCJnLXBvcC1iZ1wiPjwvZGl2PicsXHJcblx0XHRcdGRsZ19ib3hfaHRtbCA9ICc8ZGl2IGNsYXNzPVwiZ19kbGdfYm94IGctcG9wXCI+PC9kaXY+JztcclxuXHJcblx0XHR2YXIgZGxnaWQgPSBcImRsZ1wiLFxyXG4gICAgICAgICAgICBtaWRzPTAgLCBcclxuICAgICAgICAgICAgaWRzID0gMCxcclxuXHRcdFx0X2RfemluZGV4ID0gMTAwMDAwO1xyXG5cclxuXHRcdHZhciBkZWZfY29uZmlnID0ge1xyXG5cdFx0XHRjb250ZW50OicnLFxyXG5cdFx0XHRtYXNrVmlzaWJsZSA6IHRydWUsXHJcblx0XHRcdHRvcDowLFxyXG5cdFx0XHRsZWZ0OjAsXHJcblx0XHRcdHdpZHRoOjAsXHJcblx0XHRcdGhlaWdodDowLFxyXG5cdFx0XHRuZXdNYXNrIDogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRTdHlsZSA6IFwiXCIsXHJcblx0XHRcdGJvcmRlclN0eWxlIDpcIlwiLCAgLy8gYm9yZGVy5qC35byPIFxyXG5cdFx0XHR0aXRsZVN0eWxlIDogXCJcIiwgLy/moIfpopjmoLflvI9cclxuXHRcdFx0Y2xvc2VDbHMgIDogXCJcIiwgLy/lhbPpl63mjInpkq4gY2xhc3Mg5aaC5p6c5pyJ5Lya5pu/5o2i5o6JIOWOn+adpeeahCBkbGdfY2xvc2UgXHJcbiAgICAgICAgICAgIGNsb3NlX2ZuIDogZnVuY3Rpb24oKXt9LFxyXG5cdFx0XHRoaWRlQ2xvc2VCdG46IGZhbHNlXHJcblx0XHR9O1xyXG5cdFx0Ly8gbWl4IGNvbmZpZyBzZXR0aW5nLlxyXG5cdFx0dmFyIG1peF9jZmcgPSBmdW5jdGlvbihuLCBkKSB7XHJcblx0XHRcdHZhciBjZmcgPSB7fSxcclxuXHRcdFx0XHRpO1xyXG5cdFx0XHRmb3IgKGkgaW4gZCkge1xyXG5cdFx0XHRcdGlmIChkLmhhc093blByb3BlcnR5KGkpKSB7XHJcblx0XHRcdFx0XHRjZmdbaV0gPSB0eXBlb2YgbltpXSAhPT0gJ3VuZGVmaW5lZCcgPyBuW2ldIDogZFtpXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNmZztcclxuXHRcdH1cclxuXHRcdHZhciBnZXRXaW5SZWN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgd2luID0gJHdpbjtcclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG9wIDogICRkb2Muc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRzY3JvbGxMZWZ0IDogJGRvYy5zY3JvbGxMZWZ0KCksXHJcblx0XHRcdFx0XHR3aWR0aCA6IHdpbi53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA6IHdpbi5oZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vd2lkdGg6IHdpblswXS5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxyXG5cdFx0XHRcdFx0Ly9oZWlnaHQ6IHdpblswXS5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0XHJcblx0XHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIF9tYXNrX2lkID0gXCJkbGdfbWFza19cIjtcclxuXHRcdHZhciBNYXNrID0gZnVuY3Rpb24oKXtcclxuXHRcdCAgICB0aGlzLmlkID0gX21hc2tfaWQrKCsrbWlkcyk7XHJcblx0XHRcdHRoaXMuX2RvbSA9ICQoJzxkaXYgaWQ9XCInKyh0aGlzLmlkKSsnXCIgY2xhc3M9XCJnLXBvcC1iZ1wiIHN0eWxlPVwiei1pbmRleDonKygrK19kX3ppbmRleCkrJ1wiPjwvZGl2PicpO1xyXG5cdFx0XHR0aGlzLl9pbml0KCk7XHJcblx0XHR9O1xyXG5cdCBcdE1hc2sucHJvdG90eXBlID0ge1xyXG5cdFx0XHRfaW5pdCA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JGJvZHkuYXBwZW5kKHRoaXMuX2RvbSk7XHJcblx0XHRcdFx0dGhpcy5fZG9tLmhpZGUoKTtcclxuXHRcdFx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0XHRcdFx0dGhpcy5hZGFwdFdpbigpO1xyXG5cdFx0XHRcdGlmKHRoaXMuX25lZWRJZnJhbWUoKSl7XHJcblx0XHRcdFx0XHR0aGlzLl9jcmVhdGVJZnJhbWUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfaW5pdEV2ZW50cyA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0X2NyZWF0ZUlmcmFtZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGlzLl9pZnJhbWUgPSAkKCc8aWZyYW1lIGNsYXNzPVwiZGxnX21pZnJhbWVcIiBmcmFtZWJvcmRlcj1cIjBcIiBzcmM9XCJhYm91dDpibGFua1wiPjwvaWZyYW1lPicpO1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5hcHBlbmQodGhpcy5faWZyYW1lKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YWRkQ2xhc3MgOiBmdW5jdGlvbiggY2xzTmFtZSl7XHJcblx0XHRcdFx0dGhpcy5fZG9tLmFkZENsYXNzKGNsc05hbWUpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICog5qOA5rWL6Ieq5Yqo55Sf5oiQaWZyYW1l5p2h5Lu2XHJcblx0XHRcdCAqXHJcblx0XHRcdCAqIEBtZXRob2RcclxuXHRcdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0XHQgKiBAcGFyYW0gdm9pZFxyXG5cdFx0XHQgKiBAcmV0dXJuIHtib29sfVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0X25lZWRJZnJhbWU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgdXNlSWZyYW1lID0gISF3aW5kb3cuQWN0aXZlWE9iamVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgKChfaXNJRTYgJiYgJCgnc2VsZWN0JykubGVuZ3RoKVxyXG5cdFx0XHRcdFx0XHRcdFx0fHwgJCgnb2JqZWN0JykubGVuZ3RoKTtcclxuXHRcdFx0XHRyZXR1cm4gdXNlSWZyYW1lO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhZGFwdFdpbiA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYoX2lzSUU2KXtcclxuXHRcdFx0XHRcdHRoaXMuX2RvbS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgOiAkZG9jLnNjcm9sbFRvcCgpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICR3aW4uaGVpZ2h0KCksXHJcblx0XHRcdFx0XHRcdHdpZHRoOiAkd2luLndpZHRoKClcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0aGlkZSA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5fZG9tLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sX2RvbSA9ICQoJ2h0bWwnKS5jc3MoXCJvdmVyZmxvd1wiLFwiXCIpO1xyXG5cdFx0XHRcdGlmKF9pc01hYyA9PSBmYWxzZSB8fCAxKXtcclxuXHRcdFx0XHRcdGlmKGhhc1Njcm9sbCl7XHJcblx0ICAgICAgICAgICAgICAgICAgICBodG1sX2RvbS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIsXCIwcHhcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaG93IDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHdhID0gJHdpbi53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWxfZG9tID0gJCgnaHRtbCcpLmNzcyhcIm92ZXJmbG93XCIsXCJoaWRkZW5cIik7XHJcblx0XHRcdFx0dmFyIHdiID0gJHdpbi53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgbWUuX2RvbS5zaG93KCk7XHJcblx0XHRcdFx0aWYoX2lzTWFjID09IGZhbHNlIHx8IDEpe1xyXG5cdFx0XHRcdFx0aWYod2EgIT0gd2Ipe1xyXG5cdFx0XHRcdFx0XHRoYXNTY3JvbGwgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRodG1sX2RvbS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIsSUU2X0xFRlRfT0ZGU0VUK1wicHhcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXREb20gOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9kb207XHJcblx0XHRcdH0sXHJcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGlzLl9kb20ucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbW9zdF9tYXNrOyAvL+WFrOWFseeahE1hc2tcclxuXHRcdHZhciBEaWFsb2cgPSAgZnVuY3Rpb24oY2ZnKXtcclxuXHRcdFx0dmFyIGMgPSBjZmcgfHwge307XHJcblx0XHRcdHRoaXMuY29uZmlnID0gIG1peF9jZmcoYyxkZWZfY29uZmlnKTtcclxuXHRcdFx0dGhpcy5faW5pdCgpO1xyXG5cdFx0fVxyXG5cdFx0RGlhbG9nLnByb3RvdHlwZSA9IHtcclxuXHRcdFx0Y29uc3RydWN0b3IgOiBEaWFsb2csXHJcblx0XHRcdF9pbml0IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighdGhpcy5jb25maWcpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dGhpcy5pZCA9IGRsZ2lkICsoKytpZHMpO1xyXG5cdFx0XHRcdHZhciBjZmcgPSAgdGhpcy5jb25maWc7XHJcblxyXG5cdFx0XHRcdGlmKGNmZy5uZXdNYXNrKXtcclxuXHRcdFx0XHRcdHRoaXMuX21hc2sgPSAgbmV3IE1hc2soKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKCFtb3N0X21hc2spe1xyXG5cdFx0XHRcdFx0XHRtb3N0X21hc2sgPSAgbmV3IE1hc2soKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWFzayA9IG1vc3RfbWFzaztcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9tYXNrID0gIG1vc3RfbWFzaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5fY3JlYXREaWFsb2coKTtcclxuXHRcdFx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0XHRcdFx0dGhpcy5pbml0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRfaW5pdEV2ZW50cyA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG1lID0gdGhpcyxpZD10aGlzLmlkO1xyXG5cclxuXHRcdFx0XHR0aGlzLl9jbG9zZUJ0bi5iaW5kKHtcclxuXHRcdFx0XHRcdGNsaWNrIDogZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUuY2xvc2UoKTtcclxuXHRcdFx0XHRcdFx0bWUuY29uZmlnLmNsb3NlX2ZuLmNhbGwobWUsbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdCR3aW4uYmluZChcInJlc2l6ZS5cIitpZCxyZXNpemUpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdG1lLl91bmJpbmRFdmVudHMgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0JHdpbi51bmJpbmQoXCJyZXNpemUuXCIraWQpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gcmVzaXplKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9pc0lFNikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5fZGxnX2NvbnRhaW5lci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wIDogJGRvYy5zY3JvbGxUb3AoKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IDogJGRvYy5zY3JvbGxMZWZ0KCksXHJcblx0XHRcdFx0XHRcdCAgICB3aWR0aCA6ICR3aW4ud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0ICAgIGhlaWdodCA6ICR3aW4uaGVpZ2h0KClcclxuXHRcdFx0XHRcdCAgICB9KTtcclxuICBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5fZGxnX2NvbnRhaW5lci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggOiAkd2luLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgOiAkd2luLmhlaWdodCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0XHRcdG1lLnRvQ2VudGVyKCk7XHJcblx0XHRcdFx0XHRtZS5fbWFzay5hZGFwdFdpbigpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0sXHJcblx0XHRcdF9jcmVhdERpYWxvZyA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGNmZyA9IHRoaXMuY29uZmlnO1xyXG5cdFx0XHRcdHZhciBkbGdfY29udGFpbmVyID0gdGhpcy5fZGxnX2NvbnRhaW5lciA9ICQoZGxnX2JveF9odG1sKS5hdHRyKFwiaWRcIix0aGlzLmlkKS5jc3MoXCJ6LWluZGV4XCIsKF9kX3ppbmRleCArPSAxMCkpO1xyXG5cdFx0XHRcdGlmKGNmZy5jb250ZW50IGluc3RhbmNlb2YgJCl7XHJcblx0XHRcdFx0XHR0aGlzLl9kaWFsb2cgPSBjZmcuY29udGVudDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoaXMuX2RpYWxvZyA9ICQoY2ZnLmNvbnRlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgZGxnID0gdGhpcy5fZGlhbG9nO1xyXG5cdFx0XHRcdGRsZy5hZGRDbGFzcyhcImdfZGxnX3dyYXBfY3NzM1wiKTtcdFxyXG5cdFx0XHRcdGRsZ19jb250YWluZXIuaHRtbChkbGcpO1xyXG5cdFx0XHRcdHRoaXMuX2NvbnRlbnQgPSAkKFwiLmpzX2NvbnRlbnRcIixkbGcpO1xyXG5cdFx0XHRcdHRoaXMuX2Nsb3NlQnRuID0gJCgnLmpzX2Nsb3NlJyxkbGcpO1xyXG5cdFx0XHRcdCRib2R5LmFwcGVuZChkbGdfY29udGFpbmVyKTtcclxuXHJcblx0XHRcdFx0aWYoY2ZnLmhpZGVDbG9zZUJ0bil7XHJcblx0XHRcdFx0XHR0aGlzLl9jbG9zZUJ0bi5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBwb3MgPSAgXCJmaXhlZFwiO1xyXG5cdFx0XHRcdGlmKF9pc0lFNil7XHJcblx0XHRcdFx0XHRkbGdfY29udGFpbmVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA6ICRkb2Muc2Nyb2xsVG9wKCksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IDogJGRvYy5zY3JvbGxMZWZ0KCksXHJcblx0XHRcdFx0XHRcdHdpZHRoIDogJHdpbi53aWR0aCgpLFxyXG5cdFx0XHRcdFx0XHRoZWlnaHQgOiAkd2luLmhlaWdodCgpXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHBvcyA9IFwiYWJzb3VsdGVcIjtcclxuXHRcdFx0ICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGxnX2NvbnRhaW5lci5jc3Moe1xyXG5cdFx0XHRcdFx0XHR3aWR0aCA6ICR3aW4ud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0aGVpZ2h0IDogJHdpbi5oZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGxnLmNzcyhcInBvc2l0aW9uXCIsXCJhYnNvbHV0ZVwiKTtcclxuXHRcdFx0XHR0aGlzLnNldFBvcyhwb3MpO1x0XHRcdFx0XHJcblx0XHRcdFx0Ly90aGlzLnRvQ2VudGVyKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldFBvcyA6IGZ1bmN0aW9uKHBvcyl7XHJcblx0XHRcdFx0dGhpcy5fZGxnX2NvbnRhaW5lci5jc3MoXCJwb3NpdGlvblwiLHBvcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdC8v5b6X5YiwY29udGVudCDov5Tlm55qUXVlcnkg5a+56LGhXHJcblx0XHRcdGdldENvbnRhaW5lciA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2RsZ19jb250YWluZXI7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldENvbnRlbnQgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9jb250ZW50O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXRDb250ZW50IDogZnVuY3Rpb24oZG9tKXtcclxuXHRcdFx0XHR0aGlzLl9jb250ZW50LmVtcHR5KCk7XHJcblx0XHRcdFx0dGhpcy5fY29udGVudC5odG1sKGRvbSk7XHRcclxuXHRcdFx0fSxcclxuICAgICAgICAgICAgZ2V0RGxnRG9tIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGlhbG9nOyBcclxuICAgICAgICAgICAgfSxcclxuXHRcdFx0Z2V0Q2xvc2VCdG4gOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9jbG9zZUJ0bjtcclxuXHRcdFx0fSxcclxuXHRcdFx0X3NldFN0eWxlIDogZnVuY3Rpb24oZG9tLGNzcyl7XHJcblx0XHRcdFx0aWYodHlwZW9mIGNzcyA9PSBcInN0cmluZ1wiKXtcclxuXHRcdFx0XHRcdGlmKF9pc0lFKXtcclxuXHRcdFx0XHRcdFx0ZG9tWzBdLnN0eWxlLmNzc1RleHQgPSBjc3M7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0ZG9tLmF0dHIoXCJzdHlsZVwiLGNzcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRkb20uY3NzKGNzcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0b0NlbnRlciA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHdpblJlY3QgPSAgZ2V0V2luUmVjdCgpLFxyXG5cdFx0XHRcdFx0dyA9IHRoaXMuX2RpYWxvZy53aWR0aCgpLFxyXG5cdFx0XHRcdFx0aCA9IHRoaXMuX2RpYWxvZy5oZWlnaHQoKSxcclxuXHRcdFx0XHRcdHQgPSAwLGwgPTA7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wID0gTWF0aC5tYXgoKHdpblJlY3QuaGVpZ2h0IC8gMiAtIGggLyAyKSA+PjAgKyB0LDApIDtcclxuICAgICAgICAgICAgICAgIHZhciBsZWZ0ICA9ICh3aW5SZWN0LndpZHRoIC8gMiAtIHcgLyAyKSA+PjAgKyBsO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9pc0lFNikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgLT0gSUU2X0xFRlRfT0ZGU0VULzI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0dmFyIHJlY3QgPSB7XHJcblx0XHRcdFx0XHRsZWZ0IDpcdGxlZnQsXHJcblx0XHRcdFx0ICAgXHR0b3AgOiAgdG9wXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuX2RpYWxvZy5jc3MocmVjdCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHQgICAgc2hvdyA6IGZ1bmN0aW9uKGNhbGxiYWNrLGNvbnRleHQpe1xyXG5cdFx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdFx0aWYobWUuY29uZmlnLm1hc2tWaXNpYmxlKXtcclxuXHRcdFx0XHRcdG1lLl9tYXNrLnNob3coKTtcclxuXHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAvL0lFOCDku6XkuIvorqHnrpfnqpflj6Plrr3luqZcclxuICAgICAgICAgICAgICAgIG1lLl9kbGdfY29udGFpbmVyLmNzcyh7d2lkdGg6XCIxMDAlXCIsaGVpZ2h0OlwiMTAwJVwifSk7XHJcblx0XHRcdFx0bWUuX2RsZ19jb250YWluZXIuc2hvdygpO1xyXG5cdFx0XHRcdG1lLnRvQ2VudGVyKCk7XHJcblx0XHRcdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChjb250ZXh0IHx8IG1lLG1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bWUuc2hvd2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2xvc2UgOiBmdW5jdGlvbihjYWxsYmFjayxjb250ZXh0KXtcclxuXHRcdFx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cdFx0XHRcdHRoaXMuX21hc2suaGlkZSgpO1xyXG5cdFx0XHRcdHRoaXMuX2RsZ19jb250YWluZXIuaGlkZSgpO1xyXG5cdFx0XHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBtZSxtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuc2hvd2VkID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlc3RvcnkgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHR0aGlzLl91bmJpbmRFdmVudHMoKTtcclxuXHRcdFx0XHR0aGlzLmNvbmZpZy5uZXdNYXNrICYmIHRoaXMuX21hc2sucmVtb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5fZGxnX2NvbnRhaW5lci5yZW1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLl9kaWFsb2cucmVtb3ZlKCk7XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoaXMpe1xyXG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXNbaV1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldE1hc2sgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9tYXNrO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdH1cclxuXHRcdERpYWxvZy5wcm90b3R5cGUuSW4gPSBEaWFsb2cucHJvdG90eXBlLnNob3c7XHJcblx0XHREaWFsb2cucHJvdG90eXBlLm91dCA9IERpYWxvZy5wcm90b3R5cGUuY2xvc2U7XHJcblx0XHREaWFsb2cucHJvdG90eXBlLmhpZGUgPSBEaWFsb2cucHJvdG90eXBlLmNsb3NlO1xyXG5cdFx0RGlhbG9nLnByb3RvdHlwZS5yZW1vdmUgPSBEaWFsb2cucHJvdG90eXBlLmRlc3Rvcnk7XHJcblx0XHRcclxuXHQgICAgXHJcbiAgICByZXR1cm4gRGlhbG9nO1xyXG5cclxufSkoalF1ZXJ5LHdpbmRvdyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpYWxvZztcclxuIiwidmFyICQgPSByZXF1aXJlKCcuL2pxdWVyeScpO1xucmVxdWlyZSgnLi9qdmFsaWRhdG9yL3NyYy9pbmRleC5qcycpO1xucmVxdWlyZShcIi4vaWNoZWNrYm94XCIpO1xucmVxdWlyZShcIi4veS1zZWxlY3RvclwiKTtcbnJlcXVpcmUoXCIuL2pxdWVyeS5wbGFjZWhvbGRlci5qc1wiKTtcbnZhciB1bmRlZjtcbnZhciBjcmVhdGVfdGlwID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibS10aXAgbS11cC10aXAgbS1hbGVydC10aXAgaGlkZVwiPlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS10aXAtdHJnXCI+XFxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidHJnLW91dFwiPjwvZGl2PlxcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRyZy1pblwiPjwvZGl2PlxcXG4gICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tdGlwLWNvbnRlbnRcIj5cXFxuICAgICAgICAgICAgICAgIDxwPjwvcD5cXFxuICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgPC9kaXY+JztcbiAgICB2YXIgZG9tID0gJChodG1sKTtcbiAgICByZXR1cm4gZG9tOyBcbn1cblxudmFyIEZvcm0gPSBmdW5jdGlvbihvcHQpe1xuICAgIHRoaXMuXyRmb3JtID0gb3B0LmRvbTtcbiAgICB0aGlzLl9kYXRhX21hcCA9IG9wdC5kYXRhX21hcDsgICAgXG4gICAgdGhpcy5fanZfc3VjID0gb3B0Lmp2X3N1YztcbiAgICB0aGlzLl9qdl9lcnIgPSBvcHQuanZfZXJyO1xuICAgIHRoaXMuX2N1c19qdiA9IG9wdC5qdl9jdXN0b20gfHwgJC5ub29wO1xuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5Gb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbWUgPSB0aGlzICxcbiAgICAgICAganYgPSB0aGlzLl8kZm9ybS5qdmFsaWRhdG9yKCk7XG4gICAgdGhpcy5fanYgPSBqdjtcbiAgICBqdi53aGVuKFtcImJsdXJcIl0pO1xuICAgIGp2LnN1Y2Nlc3MobWUuX2p2X3N1YyB8fCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgJGQgPSAkKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIGlmICgkZC5kYXRhKFwic2hvdy1lcnJvclwiKSkge1xuICAgICAgICAgICAgdmFyIGVycl9kb20gPSAkZC5kYXRhKCdlcnJvci1kb20nKTtcbiAgICAgICAgICAgIGVycl9kb20gJiYgZXJyX2RvbS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLmVsZW1lbnQpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XG4gICAgfSk7XG5cbiAgICBqdi5mYWlsKGZ1bmN0aW9uKCAkZXZlbnQgLCBlcnJvcnMgKXtcbiAgICAgICAgdmFyICRkID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB2YXIgbXNnID0gXCJcIjtcbiAgICAgICAgZm9yKHZhciBpPTAsbD1lcnJvcnMubGVuZ3RoIDtpIDwgbDtpKyspe1xuICAgICAgICAgICAgaWYgKCFlcnJvcnNbaV0ucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgbXNnID0gZXJyb3JzW2ldLmdldE1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtZS5zaG93X2Vycm9yKCRkLG1zZyk7XG4gICAgfSk7IFxuXG4gICAgdGhpcy5fY3VzX2p2KGp2KTtcbiAgICB0aGlzLl8kZm9ybS5maW5kKFwiZGl2W2RhdGEtY2hlY2tib3hdXCIpLmNoZWNrYm94KCk7XG4gICAgdGhpcy5fJGZvcm0uZmluZChcImlucHV0W3BsYWNlaG9sZGVyXSx0ZXh0YXJlYVtwbGFjZWhvbGRlcl1cIikucGxhY2Vob2xkZXIoKTtcbiAgICB0aGlzLl9saXN0ZW5fZG9tX2V2ZW50KCk7XG59XG5cbkZvcm0ucHJvdG90eXBlLnNob3dfZXJyb3IgPSBmdW5jdGlvbigkZCxtc2cpe1xuICAgIHZhciB0O1xuICAgIGlmICh0ID0gJGQuZGF0YShcInNob3ctZXJyb3JcIikpIHtcbiAgICAgICAgdmFyIGVycl9kb20gPSAkZC5kYXRhKFwiZXJyb3ItZG9tXCIpO1xuICAgICAgICBpZiAoIWVycl9kb20pIHtcbiAgICAgICAgICAgICRkLmRhdGEoXCJlcnJvci1kb21cIiwoZXJyX2RvbSA9IGNyZWF0ZV90aXAoKSkpO1xuICAgICAgICAgICAgdmFyICRwID0gJGQucGFyZW50KCk7XG4gICAgICAgICAgICB2YXIgJHcgPSAkcC53aWR0aCgpO1xuICAgICAgICAgICAgZXJyX2RvbS53aWR0aCgkdyk7XG4gICAgICAgICAgICAkcC5hcHBlbmQoZXJyX2RvbSk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyX2RvbS5maW5kKFwicFwiKS50ZXh0KG1zZyk7XG4gICAgICAgIGVycl9kb20uc2hvdygpO1xuICAgIH1cbiAgICAkZC5hZGRDbGFzcyhcImVycm9yXCIpO1xuXG59XG5cbkZvcm0ucHJvdG90eXBlLl9saXN0ZW5fZG9tX2V2ZW50ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbWUgPSB0aGlzO1xuICAgIHRoaXMuXyRmb3JtLm9uKFwic3VibWl0XCIsZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbWUuc3VibWl0KCk7XG4gICAgfSlcbn1cblxuRm9ybS5wcm90b3R5cGUuX3ByYXNlX2Zvcm1fdmFsID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgZGF0YV9tYXAgPSB0aGlzLl9kYXRhX21hcCxcbiAgICAgICAgJGZvcm0gPSB0aGlzLl8kZm9ybTtcbiAgICB2YXIgZGF0YSA9IHt9O1xuICAgIGZvcih2YXIga2V5IGluIGRhdGFfbWFwICl7XG4gICAgICAgIHZhciBvYmogPSBkYXRhX21hcFtrZXldO1xuICAgICAgICBpZigkLnR5cGUob2JqKSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgICAgIGRhdGFba2V5XSA9ICRmb3JtLmZpbmQob2JqKS52YWwoKSB8fCB1bmRlZjtcbiAgICAgICAgfSBlbHNlIGlmICgkLnR5cGUob2JqKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICBkYXRhW2tleV0gPSBvYmoudmFsKCRmb3JtLmZpbmQob2JqLmNscykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuRm9ybS5wcm90b3R5cGUuc3VibWl0ID0gZnVuY3Rpb24oYXJnc19vYmope1xuICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICBtZS5fanYudmFsaWRhdGVBbGwoZnVuY3Rpb24oIHJlc3VsdCAsIGVsZW1lbnRzICl7XG4gICAgICAgIGlmKCByZXN1bHQgKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IG1lLl9wcmFzZV9mb3JtX3ZhbCgpO1xuICAgICAgICAgICAgbWUuXyRmb3JtLnRyaWdnZXIoXCJmb3JtLXN1Ym1pdFwiLFtkYXRhLGFyZ3Nfb2JqXSk7XG4gICAgICAgIH0gXG4gICAgfSk7XG5cbn1cblxuRm9ybS5wcm90b3R5cGUuZ2V0X3N1Ym1pdF9kYXRhID0gRm9ybS5wcm90b3R5cGUuX3ByYXNlX2Zvcm1fdmFsO1xuXG4kLmZuLmZvcm0gPSBmdW5jdGlvbihvcHQpe1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoXCJpZm9ybVwiKTtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHZhciBfb3B0ID0gJC5leHRlbmQoe1xuICAgICAgICAgICAgICAgIGRvbSA6ICR0aGlzXG4gICAgICAgICAgICB9LG9wdCk7XG4gICAgICAgICAgICAkdGhpcy5kYXRhKFwiaWZvcm1cIiwoZGF0YSA9IChuZXcgRm9ybShfb3B0KSkpKTtcbiAgICAgICAgfVxuICAgIH0pOyAgIFxufVxuXG5cblxuIiwiXG5cbnZhciBwb3AgPSByZXF1aXJlKFwiLi4vbW9kL3BvcC5qc1wiKTtcbnZhciBEaWFsb2cgPSByZXF1aXJlKFwiLi9pZGlhbG9nXCIpO1xudmFyIGxvYWRpbmcgPSB7XG4gICAgX2NyZWF0ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJtLWxvYWRpbmdcIj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYWRpbmctYm94XCIgPjxpbWcgc3JjPVwiaHR0cDovL2FtaWx5c3RhdGljLm1lL2ltYWdlL2xvYWRpbmcuZ2lmXCIgPjwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9hZGluZy10ZXh0LWJveFwiPjxwIGNsYXNzPVwibG9hZGluZy10ZXh0XCI+5q2j5Zyo5LiK5LygLOivt+eojeWQji4uLjwvcD48L2Rpdj5cXFxuICAgICAgICA8L2Rpdj4nO1xuICAgICAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgICAgICBjb250ZW50IDogaHRtbFxuICAgICAgICB9KVxuICAgICAgICBkbGcuaGlkZSgpO1xuICAgICAgICByZXR1cm4gZGxnO1xuICAgIH0sXG4gICAgc2hvdyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICghdGhpcy5fZGxnKSB7XG4gICAgICAgICAgICB0aGlzLl9kbGcgPSB0aGlzLl9jcmVhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kbGcuc2hvdygpO1xuICAgIH0sXG4gICAgaGlkZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX2RsZy5oaWRlKCk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZV91cGxvYWQob3B0KXtcbiAgICB2YXIgZXh0cyA9IG9wdC5leHRlbnNpb25zIHx8IFtcImpwZ1wiLFwicG5nXCIsXCJqcGVnXCJdO1xuICAgIHZhciBleHRzX3N0ciA9IGV4dHMuam9pbihcIixcIik7XG4gICAgdmFyIHVwbG9hZGVyID0gbmV3IHBsdXBsb2FkLlVwbG9hZGVyKHtcbiAgICAgICAgcnVudGltZXMgOiAnaHRtbDUsZmxhc2gsaHRtbDQnLFxuICAgICAgICAgXG4gICAgICAgIGJyb3dzZV9idXR0b24gOiBvcHQuZG9tLCAvLyB5b3UgY2FuIHBhc3MgaW4gaWQuLi5cbiAgICAgICAgLy9jb250YWluZXI6IG9wdC5jb250YWluZXIsIC8vIC4uLiBvciBET00gRWxlbWVudCBpdHNlbGZcbiAgICAgICAgIFxuICAgICAgICB1cmwgOiBvcHQudXJsIHx8IFwiL2FwaS91cGxvYWRcIixcbiAgICAgICAgcmVzaXplIDoge1xuICAgICAgICAgICAgcXVhbGl0eSA6IDUwXG4gICAgICAgIH0sIFxuICAgICAgICBmaWx0ZXJzIDoge1xuICAgICAgICAgICAgbWF4X2ZpbGVfc2l6ZSA6IG9wdC5zaXplIHx8ICcyMG1iJyxcbiAgICAgICAgICAgIHByZXZlbnRfZHVwbGljYXRlczogdHJ1ZSxcbiAgICAgICAgICAgIG1pbWVfdHlwZXM6IFtcbiAgICAgICAgICAgICAgICB7dGl0bGUgOiBcIumAieaLqShcIitleHRzX3N0citcIinmoLzlvI/nmoTmlofku7ZcIiwgZXh0ZW5zaW9ucyA6IGV4dHNfc3RyIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgXG4gICAgICAgIC8vIEZsYXNoIHNldHRpbmdzXG4gICAgICAgIGZsYXNoX3N3Zl91cmwgOiAnL3VwbG9hZC9Nb3hpZS5zd2YnLFxuICAgICAgICBtdWx0aV9zZWxlY3Rpb24gOiBvcHQubXVsdGlfc2VsZWN0aW9uID09IHZvaWQgMCA/IHRydWUgOiBvcHQubXVsdGlfc2VsZWN0aW9uLFxuICAgICBcbiAgICAgICAgaW5pdDoge1xuICAgICAgICAgICAgUG9zdEluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICBcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkZmlsZXMnKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGVyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICoqL1xuICAgICAgICAgICAgfSxcbiAgICAgXG4gICAgICAgICAgICBGaWxlc0FkZGVkOiBmdW5jdGlvbih1cCwgZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAvL3BsdXBsb2FkLmVhY2goZmlsZXMsIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZyhcImZpbGVcIixmaWxlLmlkKTtcbiAgICAgICAgICAgICAgICAvL30pO1xuICAgICAgICAgICAgICAgIGlmIChvcHQuY2hlY2sgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdC5jaGVjayhmaWxlcyx1cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZGVyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQuc3RhcnQgJiYgb3B0LnN0YXJ0KHVwLGZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmcuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkZXIuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0LnN0YXJ0ICYmIG9wdC5zdGFydCh1cCxmaWxlcyk7IFxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICBcbiAgICAgICAgICAgIFVwbG9hZFByb2dyZXNzOiBmdW5jdGlvbih1cCwgZmlsZSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwcm9ncmVzcz09PVwiLGZpbGUucGVyY2VudCk7XG4gICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlLmlkKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYicpWzBdLmlubmVySFRNTCA9ICc8c3Bhbj4nICsgZmlsZS5wZXJjZW50ICsgXCIlPC9zcGFuPlwiO1xuICAgICAgICAgICAgfSxcbiAgICAgXG4gICAgICAgICAgICBFcnJvcjogZnVuY3Rpb24odXAsIGVycikge1xuICAgICAgICAgICAgICAgIGxvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25zb2xlJykuaW5uZXJIVE1MICs9IFwiXFxuRXJyb3IgI1wiICsgZXJyLmNvZGUgKyBcIjogXCIgKyBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBVcGxvYWRGaWxlIDogZnVuY3Rpb24odXAsZmxpZSl7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRmlsZVVwbG9hZGVkIDogZnVuY3Rpb24odXAsZmlsZXMscmVzKXtcbiAgICAgICAgICAgICAgICB2YXIgX3N0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICAgICAgICAgICAgbG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKF9zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eHQgPSByZXMucmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXZhbChcIihcIit0eHQrXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICBvcHQuY2FsbGJhY2sgJiYgb3B0LmNhbGxiYWNrKGRhdGEsZmlsZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidGhpcyAgPT09PVwiLGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgXG4gICAgdXBsb2FkZXIuaW5pdCgpO1xuXG4gICAgcmV0dXJuIHVwbG9hZGVyO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZV91cGxvYWQgOiBjcmVhdGVfdXBsb2FkXG59XG5cbiIsInZhciAkID0gd2luZG93LmpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gJDtcbiIsIi8qISBodHRwOi8vbXRocy5iZS9wbGFjZWhvbGRlciB2Mi4wLjggYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCkge1xuXG5cdC8vIE9wZXJhIE1pbmkgdjcgZG9lc27igJl0IHN1cHBvcnQgcGxhY2Vob2xkZXIgYWx0aG91Z2ggaXRzIERPTSBzZWVtcyB0byBpbmRpY2F0ZSBzb1xuXHR2YXIgaXNPcGVyYU1pbmkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwod2luZG93Lm9wZXJhbWluaSkgPT0gJ1tvYmplY3QgT3BlcmFNaW5pXSc7XG5cdHZhciBpc0lucHV0U3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpICYmICFpc09wZXJhTWluaTtcblx0dmFyIGlzVGV4dGFyZWFTdXBwb3J0ZWQgPSAncGxhY2Vob2xkZXInIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJykgJiYgIWlzT3BlcmFNaW5pO1xuXHR2YXIgcHJvdG90eXBlID0gJC5mbjtcblx0dmFyIHZhbEhvb2tzID0gJC52YWxIb29rcztcblx0dmFyIHByb3BIb29rcyA9ICQucHJvcEhvb2tzO1xuXHR2YXIgaG9va3M7XG5cdHZhciBwbGFjZWhvbGRlcjtcblxuXHRpZiAoaXNJbnB1dFN1cHBvcnRlZCAmJiBpc1RleHRhcmVhU3VwcG9ydGVkKSB7XG5cblx0XHRwbGFjZWhvbGRlciA9IHByb3RvdHlwZS5wbGFjZWhvbGRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHBsYWNlaG9sZGVyLmlucHV0ID0gcGxhY2Vob2xkZXIudGV4dGFyZWEgPSB0cnVlO1xuXG5cdH0gZWxzZSB7XG5cblx0XHRwbGFjZWhvbGRlciA9IHByb3RvdHlwZS5wbGFjZWhvbGRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gdGhpcztcblx0XHRcdCR0aGlzXG5cdFx0XHRcdC5maWx0ZXIoKGlzSW5wdXRTdXBwb3J0ZWQgPyAndGV4dGFyZWEnIDogJzppbnB1dCcpICsgJ1twbGFjZWhvbGRlcl0nKVxuXHRcdFx0XHQubm90KCcucGxhY2Vob2xkZXInKVxuXHRcdFx0XHQuYmluZCh7XG5cdFx0XHRcdFx0J2ZvY3VzLnBsYWNlaG9sZGVyJzogY2xlYXJQbGFjZWhvbGRlcixcblx0XHRcdFx0XHQnYmx1ci5wbGFjZWhvbGRlcic6IHNldFBsYWNlaG9sZGVyXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJywgdHJ1ZSlcblx0XHRcdFx0LnRyaWdnZXIoJ2JsdXIucGxhY2Vob2xkZXInKTtcblx0XHRcdHJldHVybiAkdGhpcztcblx0XHR9O1xuXG5cdFx0cGxhY2Vob2xkZXIuaW5wdXQgPSBpc0lucHV0U3VwcG9ydGVkO1xuXHRcdHBsYWNlaG9sZGVyLnRleHRhcmVhID0gaXNUZXh0YXJlYVN1cHBvcnRlZDtcblxuXHRcdGhvb2tzID0ge1xuXHRcdFx0J2dldCc6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdFx0dmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcblxuXHRcdFx0XHR2YXIgJHBhc3N3b3JkSW5wdXQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xuXHRcdFx0XHRpZiAoJHBhc3N3b3JkSW5wdXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gJHBhc3N3b3JkSW5wdXRbMF0udmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcpICYmICRlbGVtZW50Lmhhc0NsYXNzKCdwbGFjZWhvbGRlcicpID8gJycgOiBlbGVtZW50LnZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdCdzZXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSkge1xuXHRcdFx0XHR2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXG5cdFx0XHRcdHZhciAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XG5cdFx0XHRcdGlmICgkcGFzc3dvcmRJbnB1dCkge1xuXHRcdFx0XHRcdHJldHVybiAkcGFzc3dvcmRJbnB1dFswXS52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCEkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJykpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2YWx1ZSA9PSAnJykge1xuXHRcdFx0XHRcdGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHQvLyBJc3N1ZSAjNTY6IFNldHRpbmcgdGhlIHBsYWNlaG9sZGVyIGNhdXNlcyBwcm9ibGVtcyBpZiB0aGUgZWxlbWVudCBjb250aW51ZXMgdG8gaGF2ZSBmb2N1cy5cblx0XHRcdFx0XHRpZiAoZWxlbWVudCAhPSBzYWZlQWN0aXZlRWxlbWVudCgpKSB7XG5cdFx0XHRcdFx0XHQvLyBXZSBjYW4ndCB1c2UgYHRyaWdnZXJIYW5kbGVyYCBoZXJlIGJlY2F1c2Ugb2YgZHVtbXkgdGV4dC9wYXNzd29yZCBpbnB1dHMgOihcblx0XHRcdFx0XHRcdHNldFBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCRlbGVtZW50Lmhhc0NsYXNzKCdwbGFjZWhvbGRlcicpKSB7XG5cdFx0XHRcdFx0Y2xlYXJQbGFjZWhvbGRlci5jYWxsKGVsZW1lbnQsIHRydWUsIHZhbHVlKSB8fCAoZWxlbWVudC52YWx1ZSA9IHZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtZW50LnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gYHNldGAgY2FuIG5vdCByZXR1cm4gYHVuZGVmaW5lZGA7IHNlZSBodHRwOi8vanNhcGkuaW5mby9qcXVlcnkvMS43LjEvdmFsI0wyMzYzXG5cdFx0XHRcdHJldHVybiAkZWxlbWVudDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKCFpc0lucHV0U3VwcG9ydGVkKSB7XG5cdFx0XHR2YWxIb29rcy5pbnB1dCA9IGhvb2tzO1xuXHRcdFx0cHJvcEhvb2tzLnZhbHVlID0gaG9va3M7XG5cdFx0fVxuXHRcdGlmICghaXNUZXh0YXJlYVN1cHBvcnRlZCkge1xuXHRcdFx0dmFsSG9va3MudGV4dGFyZWEgPSBob29rcztcblx0XHRcdHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xuXHRcdH1cblxuXHRcdCQoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBMb29rIGZvciBmb3Jtc1xuXHRcdFx0JChkb2N1bWVudCkuZGVsZWdhdGUoJ2Zvcm0nLCAnc3VibWl0LnBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIENsZWFyIHRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgc28gdGhleSBkb24ndCBnZXQgc3VibWl0dGVkXG5cdFx0XHRcdHZhciAkaW5wdXRzID0gJCgnLnBsYWNlaG9sZGVyJywgdGhpcykuZWFjaChjbGVhclBsYWNlaG9sZGVyKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXRzLmVhY2goc2V0UGxhY2Vob2xkZXIpO1xuXHRcdFx0XHR9LCAxMCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIENsZWFyIHBsYWNlaG9sZGVyIHZhbHVlcyB1cG9uIHBhZ2UgcmVsb2FkXG5cdFx0JCh3aW5kb3cpLmJpbmQoJ2JlZm9yZXVubG9hZC5wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLnBsYWNlaG9sZGVyJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy52YWx1ZSA9ICcnO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGFyZ3MoZWxlbSkge1xuXHRcdC8vIFJldHVybiBhbiBvYmplY3Qgb2YgZWxlbWVudCBhdHRyaWJ1dGVzXG5cdFx0dmFyIG5ld0F0dHJzID0ge307XG5cdFx0dmFyIHJpbmxpbmVqUXVlcnkgPSAvXmpRdWVyeVxcZCskLztcblx0XHQkLmVhY2goZWxlbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihpLCBhdHRyKSB7XG5cdFx0XHRpZiAoYXR0ci5zcGVjaWZpZWQgJiYgIXJpbmxpbmVqUXVlcnkudGVzdChhdHRyLm5hbWUpKSB7XG5cdFx0XHRcdG5ld0F0dHJzW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBdHRycztcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyUGxhY2Vob2xkZXIoZXZlbnQsIHZhbHVlKSB7XG5cdFx0dmFyIGlucHV0ID0gdGhpcztcblx0XHR2YXIgJGlucHV0ID0gJChpbnB1dCk7XG5cdFx0aWYgKGlucHV0LnZhbHVlID09ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpICYmICRpbnB1dC5oYXNDbGFzcygncGxhY2Vob2xkZXInKSkge1xuXHRcdFx0aWYgKCRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpKSB7XG5cdFx0XHRcdCRpbnB1dCA9ICRpbnB1dC5oaWRlKCkubmV4dCgpLnNob3coKS5hdHRyKCdpZCcsICRpbnB1dC5yZW1vdmVBdHRyKCdpZCcpLmRhdGEoJ3BsYWNlaG9sZGVyLWlkJykpO1xuXHRcdFx0XHQvLyBJZiBgY2xlYXJQbGFjZWhvbGRlcmAgd2FzIGNhbGxlZCBmcm9tIGAkLnZhbEhvb2tzLmlucHV0LnNldGBcblx0XHRcdFx0aWYgKGV2ZW50ID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICRpbnB1dFswXS52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRpbnB1dC5mb2N1cygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5wdXQudmFsdWUgPSAnJztcblx0XHRcdFx0JGlucHV0LnJlbW92ZUNsYXNzKCdwbGFjZWhvbGRlcicpO1xuXHRcdFx0XHRpbnB1dCA9PSBzYWZlQWN0aXZlRWxlbWVudCgpICYmIGlucHV0LnNlbGVjdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldFBsYWNlaG9sZGVyKCkge1xuXHRcdHZhciAkcmVwbGFjZW1lbnQ7XG5cdFx0dmFyIGlucHV0ID0gdGhpcztcblx0XHR2YXIgJGlucHV0ID0gJChpbnB1dCk7XG5cdFx0dmFyIGlkID0gdGhpcy5pZDtcblx0XHRpZiAoaW5wdXQudmFsdWUgPT0gJycpIHtcblx0XHRcdGlmIChpbnB1dC50eXBlID09ICdwYXNzd29yZCcpIHtcblx0XHRcdFx0aWYgKCEkaW5wdXQuZGF0YSgncGxhY2Vob2xkZXItdGV4dGlucHV0JykpIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0JHJlcGxhY2VtZW50ID0gJGlucHV0LmNsb25lKCkuYXR0cih7ICd0eXBlJzogJ3RleHQnIH0pO1xuXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdFx0JHJlcGxhY2VtZW50ID0gJCgnPGlucHV0PicpLmF0dHIoJC5leHRlbmQoYXJncyh0aGlzKSwgeyAndHlwZSc6ICd0ZXh0JyB9KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCRyZXBsYWNlbWVudFxuXHRcdFx0XHRcdFx0LnJlbW92ZUF0dHIoJ25hbWUnKVxuXHRcdFx0XHRcdFx0LmRhdGEoe1xuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItcGFzc3dvcmQnOiAkaW5wdXQsXG5cdFx0XHRcdFx0XHRcdCdwbGFjZWhvbGRlci1pZCc6IGlkXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmJpbmQoJ2ZvY3VzLnBsYWNlaG9sZGVyJywgY2xlYXJQbGFjZWhvbGRlcik7XG5cdFx0XHRcdFx0JGlucHV0XG5cdFx0XHRcdFx0XHQuZGF0YSh7XG5cdFx0XHRcdFx0XHRcdCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnOiAkcmVwbGFjZW1lbnQsXG5cdFx0XHRcdFx0XHRcdCdwbGFjZWhvbGRlci1pZCc6IGlkXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmJlZm9yZSgkcmVwbGFjZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRpbnB1dCA9ICRpbnB1dC5yZW1vdmVBdHRyKCdpZCcpLmhpZGUoKS5wcmV2KCkuYXR0cignaWQnLCBpZCkuc2hvdygpO1xuXHRcdFx0XHQvLyBOb3RlOiBgJGlucHV0WzBdICE9IGlucHV0YCBub3chXG5cdFx0XHR9XG5cdFx0XHQkaW5wdXQuYWRkQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0XHQkaW5wdXRbMF0udmFsdWUgPSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGlucHV0LnJlbW92ZUNsYXNzKCdwbGFjZWhvbGRlcicpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNhZmVBY3RpdmVFbGVtZW50KCkge1xuXHRcdC8vIEF2b2lkIElFOSBgZG9jdW1lbnQuYWN0aXZlRWxlbWVudGAgb2YgZGVhdGhcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9qcXVlcnktcGxhY2Vob2xkZXIvcHVsbC85OVxuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHR9IGNhdGNoIChleGNlcHRpb24pIHt9XG5cdH1cblxufSh0aGlzLCBkb2N1bWVudCwgalF1ZXJ5KSk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKlxuICAgICoqKioqKioqKiogSnVpY2VyICoqKioqKioqKipcbiAgICAke0EgRmFzdCB0ZW1wbGF0ZSBlbmdpbmV9XG4gICAgUHJvamVjdCBIb21lOiBodHRwOi8vanVpY2VyLm5hbWVcblxuICAgIEF1dGhvcjogR3Vva2FpXG4gICAgR3RhbGs6IGJhZGthaWthaUBnbWFpbC5jb21cbiAgICBCbG9nOiBodHRwOi8vYmVuYmVuLmNjXG4gICAgTGljZW5jZTogTUlUIExpY2Vuc2VcbiAgICBWZXJzaW9uOiAwLjYuOC1zdGFibGVcbiovXG5cbihmdW5jdGlvbigpIHtcblxuICAgIC8vIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gZm9yIG5vdCBvbmx5IGNvbXBpbGluZyBidXQgYWxzbyByZW5kZXJpbmcuXG4gICAgLy8gdGhlcmUncyBhdCBsZWFzdCB0d28gcGFyYW1ldGVycyBuZWVkIHRvIGJlIHByb3ZpZGVkLCBvbmUgaXMgdGhlIHRwbCwgXG4gICAgLy8gYW5vdGhlciBpcyB0aGUgZGF0YSwgdGhlIHRwbCBjYW4gZWl0aGVyIGJlIGEgc3RyaW5nLCBvciBhbiBpZCBsaWtlICNpZC5cbiAgICAvLyBpZiBvbmx5IHRwbCB3YXMgZ2l2ZW4sIGl0J2xsIHJldHVybiB0aGUgY29tcGlsZWQgcmV1c2FibGUgZnVuY3Rpb24uXG4gICAgLy8gaWYgdHBsIGFuZCBkYXRhIHdlcmUgZ2l2ZW4gYXQgdGhlIHNhbWUgdGltZSwgaXQnbGwgcmV0dXJuIHRoZSByZW5kZXJlZCBcbiAgICAvLyByZXN1bHQgaW1tZWRpYXRlbHkuXG5cbiAgICB2YXIganVpY2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgIGFyZ3MucHVzaChqdWljZXIub3B0aW9ucyk7XG5cbiAgICAgICAgaWYoYXJnc1swXS5tYXRjaCgvXlxccyojKFtcXHc6XFwtXFwuXSspXFxzKiQvaWdtKSkge1xuICAgICAgICAgICAgYXJnc1swXS5yZXBsYWNlKC9eXFxzKiMoW1xcdzpcXC1cXC5dKylcXHMqJC9pZ20sIGZ1bmN0aW9uKCQsICRpZCkge1xuICAgICAgICAgICAgICAgIHZhciBfZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IF9kb2N1bWVudCAmJiBfZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJGlkKTtcbiAgICAgICAgICAgICAgICBhcmdzWzBdID0gZWxlbSA/IChlbGVtLnZhbHVlIHx8IGVsZW0uaW5uZXJIVE1MKSA6ICQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZihkb2N1bWVudCkgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGp1aWNlci5jb21waWxlLmNhbGwoanVpY2VyLCBkb2N1bWVudC5ib2R5LmlubmVySFRNTCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBqdWljZXIuY29tcGlsZS5hcHBseShqdWljZXIsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4ganVpY2VyLnRvX2h0bWwuYXBwbHkoanVpY2VyLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX19lc2NhcGVodG1sID0ge1xuICAgICAgICBlc2NhcGVoYXNoOiB7XG4gICAgICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgICAgICc+JzogJyZndDsnLFxuICAgICAgICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAgICAgICAnLyc6ICcmI3gyZjsnXG4gICAgICAgIH0sXG4gICAgICAgIGVzY2FwZXJlcGxhY2U6IGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIHJldHVybiBfX2VzY2FwZWh0bWwuZXNjYXBlaGFzaFtrXTtcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBpbmc6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihzdHIpICE9PSAnc3RyaW5nJyA/IHN0ciA6IHN0ci5yZXBsYWNlKC9bJjw+XCJdL2lnbSwgdGhpcy5lc2NhcGVyZXBsYWNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGV0ZWN0aW9uOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRhdGEpID09PSAndW5kZWZpbmVkJyA/ICcnIDogZGF0YTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX190aHJvdyA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGlmKHR5cGVvZihjb25zb2xlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmKGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyhlcnJvcik7XG4gICAgfTtcblxuICAgIHZhciBfX2NyZWF0b3IgPSBmdW5jdGlvbihvLCBwcm90bykge1xuICAgICAgICBvID0gbyAhPT0gT2JqZWN0KG8pID8ge30gOiBvO1xuXG4gICAgICAgIGlmKG8uX19wcm90b19fKSB7XG4gICAgICAgICAgICBvLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW1wdHkgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB2YXIgbiA9IE9iamVjdC5jcmVhdGUgPyBcbiAgICAgICAgICAgIE9iamVjdC5jcmVhdGUocHJvdG8pIDogXG4gICAgICAgICAgICBuZXcoZW1wdHkucHJvdG90eXBlID0gcHJvdG8sIGVtcHR5KTtcblxuICAgICAgICBmb3IodmFyIGkgaW4gbykge1xuICAgICAgICAgICAgaWYoby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIG5baV0gPSBvW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfTtcblxuICAgIHZhciBhbm5vdGF0ZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIHZhciBGTl9BUkdTID0gL15mdW5jdGlvblxccypbXlxcKF0qXFwoXFxzKihbXlxcKV0qKVxcKS9tO1xuICAgICAgICB2YXIgRk5fQVJHX1NQTElUID0gLywvO1xuICAgICAgICB2YXIgRk5fQVJHID0gL15cXHMqKF8/KShcXFMrPylcXDFcXHMqJC87XG4gICAgICAgIHZhciBGTl9CT0RZID0gL15mdW5jdGlvbltee10reyhbXFxzXFxTXSopfS9tO1xuICAgICAgICB2YXIgU1RSSVBfQ09NTUVOVFMgPSAvKChcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKSkvbWc7XG4gICAgICAgIHZhciBhcmdzID0gW10sXG4gICAgICAgICAgICBmblRleHQsXG4gICAgICAgICAgICBmbkJvZHksXG4gICAgICAgICAgICBhcmdEZWNsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChmbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmblRleHQgPSBmbi50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGZuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZm5UZXh0ID0gZm47XG4gICAgICAgIH1cblxuICAgICAgICBmblRleHQgPSBmblRleHQucmVwbGFjZShTVFJJUF9DT01NRU5UUywgJycpO1xuICAgICAgICBmblRleHQgPSBmblRleHQudHJpbSgpO1xuICAgICAgICBhcmdEZWNsID0gZm5UZXh0Lm1hdGNoKEZOX0FSR1MpO1xuICAgICAgICBmbkJvZHkgPSBmblRleHQubWF0Y2goRk5fQk9EWSlbMV0udHJpbSgpO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcmdEZWNsWzFdLnNwbGl0KEZOX0FSR19TUExJVCkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdEZWNsWzFdLnNwbGl0KEZOX0FSR19TUExJVClbaV07XG4gICAgICAgICAgICBhcmcucmVwbGFjZShGTl9BUkcsIGZ1bmN0aW9uKGFsbCwgdW5kZXJzY29yZSwgbmFtZSkge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFthcmdzLCBmbkJvZHldO1xuICAgIH07XG5cbiAgICBqdWljZXIuX19jYWNoZSA9IHt9O1xuICAgIGp1aWNlci52ZXJzaW9uID0gJzAuNi44LXN0YWJsZSc7XG4gICAganVpY2VyLnNldHRpbmdzID0ge307XG5cbiAgICBqdWljZXIudGFncyA9IHtcbiAgICAgICAgb3BlcmF0aW9uT3BlbjogJ3tAJyxcbiAgICAgICAgb3BlcmF0aW9uQ2xvc2U6ICd9JyxcbiAgICAgICAgaW50ZXJwb2xhdGVPcGVuOiAnXFxcXCR7JyxcbiAgICAgICAgaW50ZXJwb2xhdGVDbG9zZTogJ30nLFxuICAgICAgICBub25lZW5jb2RlT3BlbjogJ1xcXFwkXFxcXCR7JyxcbiAgICAgICAgbm9uZWVuY29kZUNsb3NlOiAnfScsXG4gICAgICAgIGNvbW1lbnRPcGVuOiAnXFxcXHsjJyxcbiAgICAgICAgY29tbWVudENsb3NlOiAnXFxcXH0nXG4gICAgfTtcblxuICAgIGp1aWNlci5vcHRpb25zID0ge1xuICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgc3RyaXA6IHRydWUsXG4gICAgICAgIGVycm9yaGFuZGxpbmc6IHRydWUsXG4gICAgICAgIGRldGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgX21ldGhvZDogX19jcmVhdG9yKHtcbiAgICAgICAgICAgIF9fZXNjYXBlaHRtbDogX19lc2NhcGVodG1sLFxuICAgICAgICAgICAgX190aHJvdzogX190aHJvdyxcbiAgICAgICAgICAgIF9fanVpY2VyOiBqdWljZXJcbiAgICAgICAgfSwge30pXG4gICAgfTtcblxuICAgIGp1aWNlci50YWdJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb3JzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWFjaFxcXFxzKihbXn1dKj8pXFxcXHMqYXNcXFxccyooXFxcXHcqPylcXFxccyooLFxcXFxzKlxcXFx3Kj8pPycgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGZvcmVuZCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnXFxcXC9lYWNoJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaWZzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnaWZcXFxccyooW159XSo/KScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGlmZW5kID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdcXFxcL2lmJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgZWxzZXN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdlbHNlJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgZWxzZWlmc3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2Vsc2UgaWZcXFxccyooW159XSo/KScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGludGVycG9sYXRlID0ganVpY2VyLnRhZ3MuaW50ZXJwb2xhdGVPcGVuICsgJyhbXFxcXHNcXFxcU10rPyknICsganVpY2VyLnRhZ3MuaW50ZXJwb2xhdGVDbG9zZTtcbiAgICAgICAgdmFyIG5vbmVlbmNvZGUgPSBqdWljZXIudGFncy5ub25lZW5jb2RlT3BlbiArICcoW1xcXFxzXFxcXFNdKz8pJyArIGp1aWNlci50YWdzLm5vbmVlbmNvZGVDbG9zZTtcbiAgICAgICAgdmFyIGlubGluZWNvbW1lbnQgPSBqdWljZXIudGFncy5jb21tZW50T3BlbiArICdbXn1dKj8nICsganVpY2VyLnRhZ3MuY29tbWVudENsb3NlO1xuICAgICAgICB2YXIgcmFuZ2VzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWFjaFxcXFxzKihcXFxcdyo/KVxcXFxzKmluXFxcXHMqcmFuZ2VcXFxcKChbXn1dKz8pXFxcXHMqLFxcXFxzKihbXn1dKz8pXFxcXCknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBpbmNsdWRlID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdpbmNsdWRlXFxcXHMqKFtefV0qPylcXFxccyosXFxcXHMqKFtefV0qPyknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBoZWxwZXJSZWdpc3RlclN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdoZWxwZXJcXFxccyooW159XSo/KVxcXFxzKicgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGhlbHBlclJlZ2lzdGVyQm9keSA9ICcoW1xcXFxzXFxcXFNdKj8pJztcbiAgICAgICAgdmFyIGhlbHBlclJlZ2lzdGVyRW5kID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdcXFxcL2hlbHBlcicgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcblxuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQgPSBuZXcgUmVnRXhwKGZvcnN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5mb3JlbmQgPSBuZXcgUmVnRXhwKGZvcmVuZCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaWZzdGFydCA9IG5ldyBSZWdFeHAoaWZzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaWZlbmQgPSBuZXcgUmVnRXhwKGlmZW5kLCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5lbHNlc3RhcnQgPSBuZXcgUmVnRXhwKGVsc2VzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZWxzZWlmc3RhcnQgPSBuZXcgUmVnRXhwKGVsc2VpZnN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5pbnRlcnBvbGF0ZSA9IG5ldyBSZWdFeHAoaW50ZXJwb2xhdGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLm5vbmVlbmNvZGUgPSBuZXcgUmVnRXhwKG5vbmVlbmNvZGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmlubGluZWNvbW1lbnQgPSBuZXcgUmVnRXhwKGlubGluZWNvbW1lbnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLnJhbmdlc3RhcnQgPSBuZXcgUmVnRXhwKHJhbmdlc3RhcnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmluY2x1ZGUgPSBuZXcgUmVnRXhwKGluY2x1ZGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmhlbHBlclJlZ2lzdGVyID0gbmV3IFJlZ0V4cChoZWxwZXJSZWdpc3RlclN0YXJ0ICsgaGVscGVyUmVnaXN0ZXJCb2R5ICsgaGVscGVyUmVnaXN0ZXJFbmQsICdpZ20nKTtcbiAgICB9O1xuXG4gICAganVpY2VyLnRhZ0luaXQoKTtcblxuICAgIC8vIFVzaW5nIHRoaXMgbWV0aG9kIHRvIHNldCB0aGUgb3B0aW9ucyBieSBnaXZlbiBjb25mLW5hbWUgYW5kIGNvbmYtdmFsdWUsXG4gICAgLy8geW91IGNhbiBhbHNvIHByb3ZpZGUgbW9yZSB0aGFuIG9uZSBrZXktdmFsdWUgcGFpciB3cmFwcGVkIGJ5IGFuIG9iamVjdC5cbiAgICAvLyB0aGlzIGludGVyZmFjZSBhbHNvIHVzZWQgdG8gY3VzdG9tIHRoZSB0ZW1wbGF0ZSB0YWcgZGVsaW1hdGVyLCBmb3IgdGhpc1xuICAgIC8vIHNpdHVhdGlvbiwgdGhlIGNvbmYtbmFtZSBtdXN0IGJlZ2luIHdpdGggdGFnOjosIGZvciBleGFtcGxlOiBqdWljZXIuc2V0XG4gICAgLy8gKCd0YWc6Om9wZXJhdGlvbk9wZW4nLCAne0AnKS5cblxuICAgIGp1aWNlci5zZXQgPSBmdW5jdGlvbihjb25mLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGVzY2FwZVBhdHRlcm4gPSBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICByZXR1cm4gdi5yZXBsYWNlKC9bXFwkXFwoXFwpXFxbXFxdXFwrXFxeXFx7XFx9XFw/XFwqXFx8XFwuXS9pZ20sIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1xcXFwnICsgJDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzZXQgPSBmdW5jdGlvbihjb25mLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHRhZyA9IGNvbmYubWF0Y2goL150YWc6OiguKikkL2kpO1xuXG4gICAgICAgICAgICBpZih0YWcpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRhZ3NbdGFnWzFdXSA9IGVzY2FwZVBhdHRlcm4odmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoYXQudGFnSW5pdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC5vcHRpb25zW2NvbmZdID0gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgc2V0KGNvbmYsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNvbmYgPT09IE9iamVjdChjb25mKSkge1xuICAgICAgICAgICAgZm9yKHZhciBpIGluIGNvbmYpIHtcbiAgICAgICAgICAgICAgICBpZihjb25mLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldChpLCBjb25mW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQmVmb3JlIHlvdSdyZSB1c2luZyBjdXN0b20gZnVuY3Rpb25zIGluIHlvdXIgdGVtcGxhdGUgbGlrZSAke25hbWUgfCBmbk5hbWV9LFxuICAgIC8vIHlvdSBuZWVkIHRvIHJlZ2lzdGVyIHRoaXMgZm4gYnkganVpY2VyLnJlZ2lzdGVyKCdmbk5hbWUnLCBmbikuXG5cbiAgICBqdWljZXIucmVnaXN0ZXIgPSBmdW5jdGlvbihmbmFtZSwgZm4pIHtcbiAgICAgICAgdmFyIF9tZXRob2QgPSB0aGlzLm9wdGlvbnMuX21ldGhvZDtcblxuICAgICAgICBpZihfbWV0aG9kLmhhc093blByb3BlcnR5KGZuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9tZXRob2RbZm5hbWVdID0gZm47XG4gICAgfTtcblxuICAgIC8vIHJlbW92ZSB0aGUgcmVnaXN0ZXJlZCBmdW5jdGlvbiBpbiB0aGUgbWVtb3J5IGJ5IHRoZSBwcm92aWRlZCBmdW5jdGlvbiBuYW1lLlxuICAgIC8vIGZvciBleGFtcGxlOiBqdWljZXIudW5yZWdpc3RlcignZm5OYW1lJykuXG5cbiAgICBqdWljZXIudW5yZWdpc3RlciA9IGZ1bmN0aW9uKGZuYW1lKSB7XG4gICAgICAgIHZhciBfbWV0aG9kID0gdGhpcy5vcHRpb25zLl9tZXRob2Q7XG5cbiAgICAgICAgaWYoX21ldGhvZC5oYXNPd25Qcm9wZXJ0eShmbmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgX21ldGhvZFtmbmFtZV07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAganVpY2VyLnRlbXBsYXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgICAgICB0aGlzLl9faW50ZXJwb2xhdGUgPSBmdW5jdGlvbihfbmFtZSwgX2VzY2FwZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIF9kZWZpbmUgPSBfbmFtZS5zcGxpdCgnfCcpLCBfZm4gPSBfZGVmaW5lWzBdIHx8ICcnLCBfY2x1c3RlcjtcblxuICAgICAgICAgICAgaWYoX2RlZmluZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgX25hbWUgPSBfZGVmaW5lLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgX2NsdXN0ZXIgPSBfZGVmaW5lLnNoaWZ0KCkuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBfZm4gPSAnX21ldGhvZC4nICsgX2NsdXN0ZXIuc2hpZnQoKSArICcuY2FsbCh7fSwgJyArIFtfbmFtZV0uY29uY2F0KF9jbHVzdGVyKSArICcpJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICc8JT0gJyArIChfZXNjYXBlID8gJ19tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nJyA6ICcnKSArICcoJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAoIW9wdGlvbnMgfHwgb3B0aW9ucy5kZXRlY3Rpb24gIT09IGZhbHNlID8gJ19tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbicgOiAnJykgKyAnKCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKScgK1xuICAgICAgICAgICAgICAgICAgICAnKScgK1xuICAgICAgICAgICAgICAgICcgJT4nO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19yZW1vdmVTaGVsbCA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIF9jb3VudGVyID0gMDtcblxuICAgICAgICAgICAgdHBsID0gdHBsXG4gICAgICAgICAgICAgICAgLy8gaW5saW5lIGhlbHBlciByZWdpc3RlclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5oZWxwZXJSZWdpc3RlciwgZnVuY3Rpb24oJCwgaGVscGVyTmFtZSwgZm5UZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbm5vID0gYW5ub3RhdGUoZm5UZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuQXJncyA9IGFubm9bMF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbkJvZHkgPSBhbm5vWzFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oZm5BcmdzLmpvaW4oJywnKSwgZm5Cb2R5KTtcblxuICAgICAgICAgICAgICAgICAgICBqdWljZXIucmVnaXN0ZXIoaGVscGVyTmFtZSwgZm4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gZm9yIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQsIGZ1bmN0aW9uKCQsIF9uYW1lLCBhbGlhcywga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGlhcyA9IGFsaWFzIHx8ICd2YWx1ZScsIGtleSA9IGtleSAmJiBrZXkuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdGUgPSAnaScgKyBfY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH5mdW5jdGlvbigpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcih2YXIgJyArIF9pdGVyYXRlICsgJyBpbiAnICsgX25hbWUgKyAnKSB7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWYoJyArIF9uYW1lICsgJy5oYXNPd25Qcm9wZXJ0eSgnICsgX2l0ZXJhdGUgKyAnKSkgeycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YXIgJyArIGFsaWFzICsgJz0nICsgX25hbWUgKyAnWycgKyBfaXRlcmF0ZSArICddOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXkgPyAoJ3ZhciAnICsga2V5ICsgJz0nICsgX2l0ZXJhdGUgKyAnOycpIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICU+JztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5mb3JlbmQsICc8JSB9fX0oKTsgJT4nKVxuXG4gICAgICAgICAgICAgICAgLy8gaWYgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pZnN0YXJ0LCBmdW5jdGlvbigkLCBjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSBpZignICsgY29uZGl0aW9uICsgJykgeyAlPic7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaWZlbmQsICc8JSB9ICU+JylcblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlc3RhcnQsIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSB9IGVsc2UgeyAlPic7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgaWYgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlaWZzdGFydCwgZnVuY3Rpb24oJCwgY29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCUgfSBlbHNlIGlmKCcgKyBjb25kaXRpb24gKyAnKSB7ICU+JztcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gaW50ZXJwb2xhdGUgd2l0aG91dCBlc2NhcGVcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3Mubm9uZWVuY29kZSwgZnVuY3Rpb24oJCwgX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuX19pbnRlcnBvbGF0ZShfbmFtZSwgZmFsc2UsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBpbnRlcnBvbGF0ZSB3aXRoIGVzY2FwZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbnRlcnBvbGF0ZSwgZnVuY3Rpb24oJCwgX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuX19pbnRlcnBvbGF0ZShfbmFtZSwgdHJ1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGNsZWFuIHVwIGNvbW1lbnRzXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmlubGluZWNvbW1lbnQsICcnKVxuXG4gICAgICAgICAgICAgICAgLy8gcmFuZ2UgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5yYW5nZXN0YXJ0LCBmdW5jdGlvbigkLCBfbmFtZSwgc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdGUgPSAnaicgKyBfY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH5mdW5jdGlvbigpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcih2YXIgJyArIF9pdGVyYXRlICsgJz0nICsgc3RhcnQgKyAnOycgKyBfaXRlcmF0ZSArICc8JyArIGVuZCArICc7JyArIF9pdGVyYXRlICsgJysrKSB7eycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhciAnICsgX25hbWUgKyAnPScgKyBfaXRlcmF0ZSArICc7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAlPic7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGluY2x1ZGUgc3ViLXRlbXBsYXRlXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmluY2x1ZGUsIGZ1bmN0aW9uKCQsIHRwbCwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYXRpYmxlIGZvciBub2RlLmpzXG4gICAgICAgICAgICAgICAgICAgIGlmKHRwbC5tYXRjaCgvXmZpbGVcXDpcXC9cXC8vaWdtKSkgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCU9IF9tZXRob2QuX19qdWljZXIoJyArIHRwbCArICcsICcgKyBkYXRhICsgJyk7ICU+JztcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZXhjZXB0aW9uIGhhbmRsaW5nXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmVycm9yaGFuZGxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdHBsID0gJzwlIHRyeSB7ICU+JyArIHRwbDtcbiAgICAgICAgICAgICAgICB0cGwgKz0gJzwlIH0gY2F0Y2goZSkge19tZXRob2QuX190aHJvdyhcIkp1aWNlciBSZW5kZXIgRXhjZXB0aW9uOiBcIitlLm1lc3NhZ2UpO30gJT4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHBsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX190b05hdGl2ZSA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19jb252ZXJ0KHRwbCwgIW9wdGlvbnMgfHwgb3B0aW9ucy5zdHJpcCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX2xleGljYWxBbmFseXplID0gZnVuY3Rpb24odHBsKSB7XG4gICAgICAgICAgICB2YXIgYnVmZmVyID0gW107XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gW107XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICB2YXIgcmVzZXJ2ZWQgPSBbXG4gICAgICAgICAgICAgICAgJ2lmJywgJ2VhY2gnLCAnXycsICdfbWV0aG9kJywgJ2NvbnNvbGUnLCBcbiAgICAgICAgICAgICAgICAnYnJlYWsnLCAnY2FzZScsICdjYXRjaCcsICdjb250aW51ZScsICdkZWJ1Z2dlcicsICdkZWZhdWx0JywgJ2RlbGV0ZScsICdkbycsIFxuICAgICAgICAgICAgICAgICdmaW5hbGx5JywgJ2ZvcicsICdmdW5jdGlvbicsICdpbicsICdpbnN0YW5jZW9mJywgJ25ldycsICdyZXR1cm4nLCAnc3dpdGNoJywgXG4gICAgICAgICAgICAgICAgJ3RoaXMnLCAndGhyb3cnLCAndHJ5JywgJ3R5cGVvZicsICd2YXInLCAndm9pZCcsICd3aGlsZScsICd3aXRoJywgJ251bGwnLCAndHlwZW9mJywgXG4gICAgICAgICAgICAgICAgJ2NsYXNzJywgJ2VudW0nLCAnZXhwb3J0JywgJ2V4dGVuZHMnLCAnaW1wb3J0JywgJ3N1cGVyJywgJ2ltcGxlbWVudHMnLCAnaW50ZXJmYWNlJywgXG4gICAgICAgICAgICAgICAgJ2xldCcsICdwYWNrYWdlJywgJ3ByaXZhdGUnLCAncHJvdGVjdGVkJywgJ3B1YmxpYycsICdzdGF0aWMnLCAneWllbGQnLCAnY29uc3QnLCAnYXJndW1lbnRzJywgXG4gICAgICAgICAgICAgICAgJ3RydWUnLCAnZmFsc2UnLCAndW5kZWZpbmVkJywgJ05hTidcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHZhciBpbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlQW5hbHl6ZSA9IGZ1bmN0aW9uKCQsIHN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHN0YXRlbWVudC5tYXRjaCgvXFx3Ky9pZ20pWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5kZXhPZihidWZmZXIsIHN0YXRlbWVudCkgPT09IC0xICYmIGluZGV4T2YocmVzZXJ2ZWQsIHN0YXRlbWVudCkgPT09IC0xICYmIGluZGV4T2YobWV0aG9kLCBzdGF0ZW1lbnQpID09PSAtMSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIHJlLWRlY2xhcmUgbmF0aXZlIGZ1bmN0aW9uLCBpZiBub3QgZG8gdGhpcywgdGVtcGxhdGUgXG4gICAgICAgICAgICAgICAgICAgIC8vIGB7QGlmIGVuY29kZVVSSUNvbXBvbmVudChuYW1lKX1gIGNvdWxkIGJlIHRocm93IHVuZGVmaW5lZC5cblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Yod2luZG93KSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mKHdpbmRvd1tzdGF0ZW1lbnRdKSA9PT0gJ2Z1bmN0aW9uJyAmJiB3aW5kb3dbc3RhdGVtZW50XS50b1N0cmluZygpLm1hdGNoKC9eXFxzKj9mdW5jdGlvbiBcXHcrXFwoXFwpIFxce1xccyo/XFxbbmF0aXZlIGNvZGVcXF1cXHMqP1xcfVxccyo/JC9pKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYXRpYmxlIGZvciBub2RlLmpzXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihnbG9iYWwpICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YoZ2xvYmFsW3N0YXRlbWVudF0pID09PSAnZnVuY3Rpb24nICYmIGdsb2JhbFtzdGF0ZW1lbnRdLnRvU3RyaW5nKCkubWF0Y2goL15cXHMqP2Z1bmN0aW9uIFxcdytcXChcXCkgXFx7XFxzKj9cXFtuYXRpdmUgY29kZVxcXVxccyo/XFx9XFxzKj8kL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIHJlLWRlY2xhcmUgcmVnaXN0ZXJlZCBmdW5jdGlvbiwgaWYgbm90IGRvIHRoaXMsIHRlbXBsYXRlIFxuICAgICAgICAgICAgICAgICAgICAvLyBge0BpZiByZWdpc3RlcmVkX2Z1bmMobmFtZSl9YCBjb3VsZCBiZSB0aHJvdyB1bmRlZmluZWQuXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKGp1aWNlci5vcHRpb25zLl9tZXRob2Rbc3RhdGVtZW50XSkgPT09ICdmdW5jdGlvbicgfHwganVpY2VyLm9wdGlvbnMuX21ldGhvZC5oYXNPd25Qcm9wZXJ0eShzdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBidWZmZXIucHVzaChzdGF0ZW1lbnQpOyAvLyBmdWNrIGllXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0cGwucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaW50ZXJwb2xhdGUsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaWZzdGFydCwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlaWZzdGFydCwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbmNsdWRlLCB2YXJpYWJsZUFuYWx5emUpLlxuICAgICAgICAgICAgICAgIHJlcGxhY2UoL1tcXCtcXC1cXCpcXC8lIVxcP1xcfFxcXiZ+PD49LFxcKFxcKVxcW1xcXV1cXHMqKFtBLVphLXpfXSspL2lnbSwgdmFyaWFibGVBbmFseXplKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ICs9ICd2YXIgJyArIGJ1ZmZlcltpXSArICc9Xy4nICsgYnVmZmVyW2ldICsgJzsnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2kgPCBtZXRob2QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggKz0gJ3ZhciAnICsgbWV0aG9kW2ldICsgJz1fbWV0aG9kLicgKyBtZXRob2RbaV0gKyAnOyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAnPCUgJyArIHByZWZpeCArICcgJT4nO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19jb252ZXJ0PWZ1bmN0aW9uKHRwbCwgc3RyaXApIHtcbiAgICAgICAgICAgIHZhciBidWZmZXIgPSBbXS5qb2luKCcnKTtcblxuICAgICAgICAgICAgYnVmZmVyICs9IFwiJ3VzZSBzdHJpY3QnO1wiOyAvLyB1c2Ugc3RyaWN0IG1vZGVcbiAgICAgICAgICAgIGJ1ZmZlciArPSBcInZhciBfPV98fHt9O1wiO1xuICAgICAgICAgICAgYnVmZmVyICs9IFwidmFyIF9vdXQ9Jyc7X291dCs9J1wiO1xuXG4gICAgICAgICAgICBpZihzdHJpcCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIgKz0gdHBsXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJyg/PVteJV0qJT4pL2csIFwiXFx0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIidcIikuam9pbihcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIlxcdFwiKS5qb2luKFwiJ1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPCU9KC4rPyklPi9nLCBcIic7X291dCs9JDE7X291dCs9J1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCI8JVwiKS5qb2luKFwiJztcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJT5cIikuam9pbihcIl9vdXQrPSdcIikrXG4gICAgICAgICAgICAgICAgICAgIFwiJztyZXR1cm4gX291dDtcIjtcblxuICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1ZmZlciArPSB0cGxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xccl0vZywgXCJcXFxcclwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcdF0vZywgXCJcXFxcdFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcbl0vZywgXCJcXFxcblwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJyg/PVteJV0qJT4pL2csIFwiXFx0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIidcIikuam9pbihcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIlxcdFwiKS5qb2luKFwiJ1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPCU9KC4rPyklPi9nLCBcIic7X291dCs9JDE7X291dCs9J1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCI8JVwiKS5qb2luKFwiJztcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJT5cIikuam9pbihcIl9vdXQrPSdcIikrXG4gICAgICAgICAgICAgICAgICAgIFwiJztyZXR1cm4gX291dC5yZXBsYWNlKC9bXFxcXHJcXFxcbl1cXFxccytbXFxcXHJcXFxcbl0vZywgJ1xcXFxyXFxcXG4nKTtcIjtcblxuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmxvb3NlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRwbCA9IHRoaXMuX19sZXhpY2FsQW5hbHl6ZSh0cGwpICsgdHBsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cGwgPSB0aGlzLl9fcmVtb3ZlU2hlbGwodHBsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRwbCA9IHRoaXMuX190b05hdGl2ZSh0cGwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIgPSBuZXcgRnVuY3Rpb24oJ18sIF9tZXRob2QnLCB0cGwpO1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKF8sIF9tZXRob2QpIHtcbiAgICAgICAgICAgICAgICBpZighX21ldGhvZCB8fCBfbWV0aG9kICE9PSB0aGF0Lm9wdGlvbnMuX21ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBfbWV0aG9kID0gX19jcmVhdG9yKF9tZXRob2QsIHRoYXQub3B0aW9ucy5fbWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoYXQuX3JlbmRlci5jYWxsKHRoaXMsIF8sIF9tZXRob2QpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGp1aWNlci5jb21waWxlID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgIGlmKCFvcHRpb25zIHx8IG9wdGlvbnMgIT09IHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IF9fY3JlYXRvcihvcHRpb25zLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBlbmdpbmUgPSB0aGlzLl9fY2FjaGVbdHBsXSA/IFxuICAgICAgICAgICAgICAgIHRoaXMuX19jYWNoZVt0cGxdIDogXG4gICAgICAgICAgICAgICAgbmV3IHRoaXMudGVtcGxhdGUodGhpcy5vcHRpb25zKS5wYXJzZSh0cGwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmNhY2hlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19jYWNoZVt0cGxdID0gZW5naW5lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZW5naW5lO1xuXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgX190aHJvdygnSnVpY2VyIENvbXBpbGUgRXhjZXB0aW9uOiAnICsgZS5tZXNzYWdlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge30gLy8gbm9vcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBqdWljZXIudG9faHRtbCA9IGZ1bmN0aW9uKHRwbCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zICE9PSB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfX2NyZWF0b3Iob3B0aW9ucywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUodHBsLCBvcHRpb25zKS5yZW5kZXIoZGF0YSwgb3B0aW9ucy5fbWV0aG9kKTtcbiAgICB9O1xuICAgIHdpbmRvdy5qdWljZXIgPSBqdWljZXI7XG4gICAgdHlwZW9mKG1vZHVsZSkgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBqdWljZXIgOiB0aGlzLmp1aWNlciA9IGp1aWNlcjtcblxufSkoKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgQXN5bmNSZXF1ZXN0ID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLnJlcXMgPSBbXTtcbiAgICB0aGlzLnN0YXR1cyA9IDA7ICAgIC8vMC13YWl0aGluZywxLXJ1bm5pbmdcbn1cblxuQXN5bmNSZXF1ZXN0LnByb3RvdHlwZS5hZGRSZXF1ZXN0ID0gZnVuY3Rpb24oZnVuYyl7XG4gICAgaWYodGhpcy5zdGF0dXMhPTApIHJldHVybjtcbiAgICB0aGlzLnJlcXMucHVzaChmdW5jKTtcbn1cblxuQXN5bmNSZXF1ZXN0LnByb3RvdHlwZS5nbyA9IGZ1bmN0aW9uKCl7XG4gICAgaWYodGhpcy5zdGF0dXMhPTApIHJldHVybjtcbiAgICBcbiAgICB0aGlzLnN0YXR1cyA9IDE7ICAgIFxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVxcyA9IHRoaXMucmVxcztcbiAgICB2YXIgbGVuID0gdGhpcy5yZXFzLmxlbmd0aDtcbiAgICBcbiAgICBmb3IodmFyIGk9MDtpPHJlcXMubGVuZ3RoO2krKyl7XG4gICAgICAgIHZhciByZXEgPSByZXFzW2ldO1xuXG4gICAgICAgIGlmKHRoaXMuc3RhdHVzPT0wKSByZXR1cm47XG4gICAgICAgIHJlcShmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9hc3luY19jb250aW51ZVxuICAgICAgICAgICAgbGVuLS07XG4gICAgICAgICAgICBpZihsZW49PTApe1xuICAgICAgICAgICAgICAgIHNlbGYuZmluaXNoKCk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxufVxuXG5Bc3luY1JlcXVlc3QucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5zdGF0dXMgPSAwO1xuICAgIGlmKHRoaXMub25maW5pc2hlZCl7XG4gICAgICAgIHRoaXMub25maW5pc2hlZCgpO1xuICAgIH1cbn1cblxuQXN5bmNSZXF1ZXN0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCl7XG4gICAgaWYodGhpcy5zdGF0dXMhPTApIHJldHVybjtcbiAgICB0aGlzLnJlcXMgPSBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBc3luY1JlcXVlc3Q7IiwidmFyIFBBUlNFUiA9IHt9O1xuXG5mdW5jdGlvbiBfdG9rZW5pemVkKCBzdHIgKSB7XG4gICAgdmFyIHMgPSBbXTtcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgdmFyIGNociA9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIHN3aXRjaCggY2hyICkge1xuICAgICAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgICBjYXNlICcpJzpcbiAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgICAgICBzLnB1c2goY2hyKTtcbiAgICAgICAgICAgICAgICBzLnB1c2goJycpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBzLmxlbmd0aCA/IHNbcy5sZW5ndGgtMV0gKz0gY2hyIDogcy5wdXNoKGNocik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHM7XG59XG5cbnZhciByZWdOYW1lID0gL14oQD9bXFx3XFwtXSspKFxcWy4rXFxdKT8kLztcblxuZnVuY3Rpb24gX3BhcnNlKCB0b2tlbnMgKSB7XG4gICAgdmFyIGFzdCA9IFtdO1xuICAgIHZhciBvID0gbnVsbDtcbiAgICB2YXIgdG9rZW47IFxuICAgIHdoaWxlKCAodG9rZW4gPSB0b2tlbnMuc2hpZnQoKSApICE9PSB2b2lkIDAgKSB7XG4gICAgICAgIGlmKCAhdG9rZW4gKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2goIHRva2VuICkge1xuICAgICAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgICBjYXNlICcpJzpcbiAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgICAgICBhc3QucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiBcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHRva2VuLm1hdGNoKCByZWdOYW1lICk7XG4gICAgICAgICAgICAgICAgaWYoICFhICkgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYoIGFbMV0uY2hhckF0KDApID09ICdAJyApIHtcbiAgICAgICAgICAgICAgICAgICAgbyA9IHsgbmFtZSA6ICdAJyAsIGVsZW1OYW1lIDogYVsxXS5yZXBsYWNlKCdAJywnJykgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvID0geyBuYW1lIDogYVsxXSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiggIVBBUlNFUltvLm5hbWVdICkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIm5vdCBmb3VuZCBwYXJzZXIncyBuYW1lIDogXCIgKyBvLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCBhWzJdICkgby52YWx1ZSA9IGFbMl0ucmVwbGFjZSgnWycsJycpLnJlcGxhY2UoJ10nLCcnKTtcbiAgICAgICAgICAgICAgICBhc3QucHVzaCggbyApO1xuICAgICAgICAgICAgICAgIG8gPSBudWxsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhc3Q7XG59XG5cbi8vIOWinuWKoOino+aekOWZqFxuLy8gKm5hbWUqIOino+aekOWZqOWQjeensFxuLy8gKm9wdGlvbnMuYXJndW1lbnQqIOW4puacieWPguaVsO+8jOm7mOiupOayoeaciVxuZXhwb3J0cy5hZGQgPSBmdW5jdGlvbiggbmFtZSAsIG9wdGlvbnMgKSB7XG4gICAgUEFSU0VSW25hbWVdID0gb3B0aW9ucyB8fCB7fTtcbiAgICBQQVJTRVJbbmFtZV0ubmFtZSA9IG5hbWU7XG59XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiggc3RyICkge1xuICAgIHZhciB0b2tlbnMgPSBfdG9rZW5pemVkKCBzdHIgKTtcbiAgICB2YXIgYXN0ID0gX3BhcnNlKCB0b2tlbnMgKTtcbiAgICByZXR1cm4gYXN0O1xufSIsInZhciBBc3luYyA9IHJlcXVpcmUoJy4vQXN5bmNSZXF1ZXN0LmpzJyk7XG52YXIgcGFyc2VyID0gcmVxdWlyZSgnLi9SdWxlUGFyc2VyLmpzJyk7XG5cbnZhciBQQVRURVJOUyA9IHt9XG52YXIgQ09OU1RBTlQgPSB7XG4gICAgUEFUVEVSTiA6IFwianZhbGlkYXRvci1wYXR0ZXJuXCIgLCBcbiAgICBQTEFDRUhPTERFUiA6IFwianZhbGlkYXRvci1wbGFjZWhvbGRlclwiICwgXG4gICAgQ05BTUUgOiBcImp2YWxpZGF0b3ItY25hbWVcIiAsIFxuICAgIE1FU1NBR0VfQVRUUiA6IFwiX19qdmFsaWRhdG9yX21lc3NhZ2VzX19cIiAsIFxuICAgIEZJRUxEX0VWRU5UUyA6IFwiX19qdmFsaWRhdG9yX2V2ZW50c19fXCIgLCBcbiAgICBERUJVRyA6IFwianZhbGlkYXRvci1kZWJ1Z1wiXG59XG5cbi8vICMjIOWtl+auteajgOafpeWZqFxuLy8g57uR5a6a5Yiw5p+Q5Liq5a2X5q615ZCO77yM5a+55YW26L+b6KGM5qOA5p+l562J5pON5L2cXG5mdW5jdGlvbiBGaWVsZENoZWNrZXIoIGVsZW1lbnQgKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB0aGlzLiRmb3JtID0gdGhpcy4kZWxlbWVudC5jbG9zZXN0KCdmb3JtJyk7XG4gICAgdGhpcy5hc3luYyA9IG5ldyBBc3luYygpO1xufVxuXG5GaWVsZENoZWNrZXIucHJvdG90eXBlID0ge1xuXG4gICAgX2dldFBhdHRlcm5NZXNzYWdlIDogZnVuY3Rpb24oIHJlc3VsdHMgKSB7ICBcbiAgICAgICAgdmFyIHJzdHIgPSBbXTtcbiAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgdmFyIHAgPSByZXN1bHRzW2ldO1xuICAgICAgICAgICAgaWYoIHAubmFtZSApIHtcbiAgICAgICAgICAgICAgICByc3RyLnB1c2goIHAuZ2V0TWVzc2FnZSgpICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN3aXRjaCggcCApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJiYnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcnN0ci5wdXNoKCcg5bm25LiUICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3x8JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJzdHIucHVzaCgnIOaIluiAhSAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJzdHIucHVzaCgn5LiNJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJzdHIuam9pbignJyk7XG4gICAgfSAsXG5cbiAgICAvLyDmo4Dmn6XnlJ/miJDnu5Pmnpzlubbov5Tlm57plJnor6/kv6Hmga9cbiAgICAvLyByZXR1cm4gZXJyb3JzXG4gICAgX2NoZWNrUGF0dGVyblJlc3VsdCA6IGZ1bmN0aW9uKCBzdHIgLCByZXN1bHRzICkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciByc3RyID0gW107XG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIHZhciBwID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgIGlmKCBwLm5hbWUgKSB7XG4gICAgICAgICAgICAgICAgcnN0ci5wdXNoKCBwLnJlc3VsdCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByc3RyLnB1c2goIHAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0aGlzLiRmb3JtLmF0dHIoIFwiZGF0YS1cIiArIENPTlNUQU5ULkRFQlVHKSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyggdGhpcyAsIHRoaXMuZWxlbWVudCAsIHN0ciAsIHJzdHIuam9pbignJykgKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFsbCA9IGV2YWwoIHJzdHIuam9pbignJykgKTtcbiAgICAgICAgaWYoIGFsbCApIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSAkLmdyZXAoIHJlc3VsdHMgLCBmdW5jdGlvbiggZSAsIGlkeCApe1xuICAgICAgICAgICAgICAgIHJldHVybiBlLm5hbWUgJiYgZS5yZXN1bHQgPT09IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhcnIuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2dldFBhdHRlcm5NZXNzYWdlKCByZXN1bHRzICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOmqjOivgeiHqui6q+eahCBwYXR0ZXJuIOaYr+WQpuWQiOazleS7peWPiuaYr+WQpua7oei2s+aJgOaciemhue+8jOS7peS+m+W8gOWPkeiHqua1i+S9v+eUqFxuICAgIGNoZWNrUGF0dGVybiA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnQ7XG4gICAgICAgIHZhciBydWxlX3N0ciA9ICRlLmF0dHIoIFwiZGF0YS1cIiArICBDT05TVEFOVC5QQVRURVJOICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcGF0dGVybnMgPSBwYXJzZXIucGFyc2UoIHJ1bGVfc3RyICk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciggdGhpcy5lbGVtZW50ICwgJ+mqjOivgeWZqOivreazleaciemUmeivr++8jOivt+ajgOafpScgLCBydWxlX3N0ciApO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciggJ+mUmeivr+WPr+iDveaYr++8micgLCBlICk7XG4gICAgICAgIH1cbiAgICB9ICxcblxuICAgIC8vICogZG9uZSAqXG4gICAgLy8gIOWPr+S7peS4jeS8oO+8jOWNs+S4uuinpuWPkeajgOafpSBcbiAgICAvLyAgYGNoZWNrUmVzdWx0YCBib29sZWFuIOajgOafpee7k+aenCBcbiAgICAvLyAgYGV2dGAg5Li66Kem5Y+R55qE5LqL5Lu277yM5Y+v5Lul5rKh5pyJXG4gICAgLy8gIGBlcnJvcnNgIGFycmF5IOmUmeivr+S/oeaBr1xuICAgIGNoZWNrIDogZnVuY3Rpb24oICRldmVudCAsIGNoZWNrQ2FsbGJhY2sgKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYXN5bmMgPSBuZXcgQXN5bmMoKTtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnQ7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMudmFsdWUoKTtcbiAgICAgICAgdmFyIHJ1bGVfc3RyID0gJGUuYXR0ciggXCJkYXRhLVwiICsgIENPTlNUQU5ULlBBVFRFUk4gKTtcbiAgICAgICAgdmFyIHBhdHRlcm5zID0gcGFyc2VyLnBhcnNlKCBydWxlX3N0ciApO1xuXG4gICAgICAgIGFzeW5jLmNsZWFyKCk7XG4gICAgICAgIGFzeW5jLm9uZmluaXNoZWQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGVycm9ycyA9IHNlbGYuX2NoZWNrUGF0dGVyblJlc3VsdCggcnVsZV9zdHIgLCBwYXR0ZXJucyApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLmFmdGVyX2NoZWNrKCBlcnJvcnMubGVuZ3RoID09IDAgLCBlcnJvcnMgLCAkZXZlbnQgKTtcbiAgICAgICAgICAgIGlmICggY2hlY2tDYWxsYmFjayApIHsgY2hlY2tDYWxsYmFjayggZXJyb3JzLmxlbmd0aCA9PSAwICwgZXJyb3JzICk7IH1cbiAgICAgICAgfTtcblxuICAgICAgICAkLmVhY2goIHBhdHRlcm5zICwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vIOi3s+i/h+aJgOacieiuoeeul+WPmOmHj1xuICAgICAgICAgICAgaWYoICF0aGlzLm5hbWUgKSByZXR1cm47XG5cbiAgICAgICAgICAgIC8vIHAg5YW25Lit5YyF5ousXG4gICAgICAgICAgICAvLyBhcmd1bWVudCAtIOWPr+iDveaciVxuICAgICAgICAgICAgLy8gbWVzc2FnZSAtIOWOn+Wni+eahG1lc3NhZ2Xorr7nva4gXG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSAtIOmqjOivgeinhOWImSBcbiAgICAgICAgICAgIC8vIHJ1bGVfc3Ry6Kej5p6Q5Ye65p2l55qE5YaF5a65IG5hbWUo5ZCMcGF0dGVybk5hbWUpICwgZWxlbU5hbWUoQOaJjeS8muaciSkgLCB2YWx1ZShwYXR0ZXJu55qE5bGe5oCn5YC8KVxuICAgICAgICAgICAgLy8gZWxlbWVudCAtIOWvueW6lOeahCBlbGVtZW50XG4gICAgICAgICAgICAvLyByZXN1bHQgLSDpqozor4HlkI7vvIzkvJrlr7nor6Xpobnorr7nva4gdHJ1ZSDmiJYgZmFsc2VcbiAgICAgICAgICAgIHZhciBwID0gJC5leHRlbmQoIHRoaXMgLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA6IHNlbGYuZWxlbWVudCAsXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgOiBzZWxmLiRlbGVtZW50ICwgXG4gICAgICAgICAgICAgICAgJGZvcm0gOiBzZWxmLiRmb3JtICwgXG4gICAgICAgICAgICAgICAgZ2V0TWVzc2FnZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9nZXRNZXNzYWdlLmNhbGwoIHRoaXMgLCB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH0gLCBcbiAgICAgICAgICAgICAgICAvLyDnlKjmnaXop6PmnpAgcGFyc2Vkc3RyKOWug+aYr+W4puaciUDnmoTlhoXlrrkpIOeahOWAvO+8jOino+aekOaIkOWKn+Wwsei/lOWbnumCo+S4qiBlbGVtZW50IO+8jOWQpuWImei/lOWbniBudWxsXG4gICAgICAgICAgICAgICAgcGFyc2VOYW1lU3ltYm9sIDogZnVuY3Rpb24oIHBhcnNlZHN0ciApe1xuICAgICAgICAgICAgICAgICAgICBpZiggcGFyc2Vkc3RyLmNoYXJBdCgwKSAhPT0gJ0AnICkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRmb3JtLmZpbmQoIF9wYXJzZV9zZWxlY3Rvcl9zeW50YXgoIHBhcnNlZHN0ciApIClbMF07XG4gICAgICAgICAgICAgICAgfSAsIFxuXG4gICAgICAgICAgICAgICAgLy8g5b2TIHBhdHRlcm4g5pivIEB4eFt4eF0g5pe277yMIOWImeWPr+S7pemAmui/h+ivpeaWueazleWPluW+lyBAIOWvueW6lOeahOWFg+e0oFxuICAgICAgICAgICAgICAgIGdldE5hbWVTeW1ib2wgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU5hbWVTeW1ib2woICdAJyArIHRoaXMuZWxlbU5hbWUgKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLy8g5b2TIHBhdHRlcm4g5pivIHh4W3h4XSDml7bvvIwg5YiZ5Y+v5Lul6YCa6L+H6K+l5pa55rOV5Y+W5b6X5ous5Y+35Lit55qE5YC8XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5YC85Li6IEB4eHggLCDliJnov5Tlm57or6XlhYPntKBcbiAgICAgICAgICAgICAgICAvLyDlkKbliJnov5Tlm57lgLxcbiAgICAgICAgICAgICAgICBnZXRWYWx1ZVN5bWJvbCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHRoaXMucGFyc2VOYW1lU3ltYm9sKCB0aGlzLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbCA/IGVsIDogdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICB9ICwgXG5cbiAgICAgICAgICAgICAgICBnZXRFbGVtZW50VmFsdWUgOiBmdW5jdGlvbiggZWwgKXtcbiAgICAgICAgICAgICAgICAgICAgZWwgPSAkKGVsKVswXVxuICAgICAgICAgICAgICAgICAgICBpZiggIWVsICkgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBqdiA9IF9nZXRGaWVsZFZhbGlkYXRvciggZWwgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganYgPyBqdi52YWx1ZSgpIDogc2VsZi52YWx1ZS5jYWxsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgOiBlbCAsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQgOiAkKGVsKSAsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0gOiBzZWxmLiRmb3JtXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gLCBcblxuICAgICAgICAgICAgICAgIC8vIOW+l+WIsOWFg+e0oOeahCBjbmFtZSDmiJYgbmFtZVxuICAgICAgICAgICAgICAgIGdldEVsZW1lbnROYW1lIDogZnVuY3Rpb24gKCBlbCApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiggJGVsLmF0dHIoIFwiZGF0YS1cIiArICBDT05TVEFOVC5DTkFNRSApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRlbC5hdHRyKCBcImRhdGEtXCIgKyAgQ09OU1RBTlQuQ05BTUUgKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRlbC5hdHRyKCduYW1lJyk7ICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSAsIFBBVFRFUk5TWyB0aGlzLm5hbWUgXSApO1xuXG4gICAgICAgICAgICAoZnVuY3Rpb24ocCl7IGFzeW5jLmFkZFJlcXVlc3QoZnVuY3Rpb24oIGFzeW5jX2NvbnRpbnVlICl7XG4gICAgICAgICAgICAgICAgLy8gaXN2YWxpZCAtIOaYr+WQpumqjOivgeaIkOWKn1xuICAgICAgICAgICAgICAgIHAudmFsaWRhdGUoIHZhbHVlICwgZnVuY3Rpb24oIGlzX3ZhbGlkICl7XG4gICAgICAgICAgICAgICAgICAgIHAucmVzdWx0ID0gaXNfdmFsaWQ7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jX2NvbnRpbnVlKCk7XG4gICAgICAgICAgICAgICAgfSwgJGV2ZW50ICk7XG5cbiAgICAgICAgICAgIH0pOyB9KShwKTtcbiAgICAgICAgfSlcblxuICAgICAgICBhc3luYy5nbygpO1xuXG4gICAgfSAsIFxuXG4gICAgLy8g5qC55o2uIHBhdHRlcm5OYW1lIOW+l+WIsOmUmeivr+S/oeaBr1xuICAgIC8vIOS8mOWFiOe6p+S4uu+8muWtl+auteeahG1lc3NhZ2Xorr7nva4gPiBwZ+eahG1lc3NhZ2Xorr7nva4gPiBwYXR0ZXJu55qE5qCH5YeG6K6+572uIFxuICAgIC8vICogdmFsdWUgKiDkuLrlgLzvvIzlpoLmnpzkuI3kvKDliJnph43mlrDojrflj5ZcbiAgICAvLyAqIOeUsSBwIOi/m+ihjOiwg+eUqFxuICAgIF9nZXRNZXNzYWdlIDogZnVuY3Rpb24oIHZhbHVlICkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHBhdHRlcm5OYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICB2YXIgZSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgdmFyICRlID0gdGhpcy4kZWxlbWVudDtcbiAgICAgICAgdmFyICRmID0gdGhpcy4kZm9ybTtcbiAgICAgICAgdmFyIHYgPSB2YWx1ZSB8fCBfZ2V0RmllbGRWYWxpZGF0b3IoZSkudmFsdWUoKTtcbiAgICAgICAgdmFyIG1zZ190bXBsID0gJGUuYXR0cignZGF0YS1qdmFsaWRhdG9yLW1lc3NhZ2UnKVxuICAgICAgICAgICAgICAgICAgICAgICB8fCAoIGVbIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdID8gZVsgQ09OU1RBTlQuTUVTU0FHRV9BVFRSIF1bIHBhdHRlcm5OYW1lIF0gOiBudWxsIClcbiAgICAgICAgICAgICAgICAgICAgICAgfHwgKCAkZlswXVsgQ09OU1RBTlQuTUVTU0FHRV9BVFRSIF0gPyAkZlswXVsgQ09OU1RBTlQuTUVTU0FHRV9BVFRSIF1bIHBhdHRlcm5OYW1lIF0gOiBudWxsIClcbiAgICAgICAgICAgICAgICAgICAgICAgfHwgKCBQQVRURVJOU1sgcGF0dGVybk5hbWUgXS5tZXNzYWdlICk7XG5cbiAgICAgICAgbXNnX3RtcGwgPSBtc2dfdG1wbC5yZXBsYWNlKCAvJXZhbFxcYi9nICwgdiApIFxuICAgICAgICBtc2dfdG1wbCA9IG1zZ190bXBsLnJlcGxhY2UoIC8lbmFtZVxcYi9nICwgZS5uYW1lIClcbiAgICAgICAgbXNnX3RtcGwgPSBtc2dfdG1wbC5yZXBsYWNlKCAvJWNuYW1lXFxiL2cgLCAkZS5hdHRyKCBcImRhdGEtXCIgKyAgQ09OU1RBTlQuQ05BTUUpICkgXG4gICAgICAgIG1zZ190bXBsID0gbXNnX3RtcGwucmVwbGFjZSggLz0lYXJndVxcYi9nICwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IHNlbGYucGFyc2VOYW1lU3ltYm9sKCBzZWxmLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHYgJiYgdi50YWdOYW1lID8gc2VsZi5nZXRFbGVtZW50VmFsdWUoIHYgKSA6IHNlbGYudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIG1zZ190bXBsID0gbXNnX3RtcGwucmVwbGFjZSggLyVhcmd1XFxiL2cgLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gc2VsZi5wYXJzZU5hbWVTeW1ib2woIHNlbGYudmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdiAmJiB2LnRhZ05hbWUgPyBzZWxmLmdldEVsZW1lbnROYW1lKCB2ICkgOiBzZWxmLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICBtc2dfdG1wbCA9IG1zZ190bXBsLnJlcGxhY2UoIC9AQC9nICwgZnVuY3Rpb24oICQwICwgJDEgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSAkZi5maW5kKCBfcGFyc2Vfc2VsZWN0b3Jfc3ludGF4KFwiQFwiICsgc2VsZi5lbGVtTmFtZSkgKVswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhZWwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoICRlbC5hdHRyKCBcImRhdGEtXCIgKyAgQ09OU1RBTlQuQ05BTUUgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkZWwuYXR0ciggXCJkYXRhLVwiICsgIENPTlNUQU5ULkNOQU1FIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkZWwuYXR0cignbmFtZScpOyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgbXNnX3RtcGwgPSBtc2dfdG1wbC5yZXBsYWNlKCAvPUAoW15cXHNdKilcXGIvZyAsIGZ1bmN0aW9uKCAkMCAsICQxICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0RWxlbWVudFZhbHVlKCAkZi5maW5kKCdbbmFtZT0nICsgJDEgKyAnXScpIClcbiAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgbXNnX3RtcGwgPSBtc2dfdG1wbC5yZXBsYWNlKCAvQChbXlxcc10qKVxcYi9nICwgZnVuY3Rpb24oICQwICwgJDEgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5nZXRFbGVtZW50TmFtZSggJGYuZmluZCgnW25hbWU9JyArICQxICsgJ10nKSApIHx8IFwiXCIgO1xuICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbXNnX3RtcGw7XG5cbiAgICB9LFxuXG4gICAgLy8g5qC55o2u5LiN5ZCM55qE5a2X5q6157G75Z6L77yM5Y+W5b6XIGVsZW1lbnQg55qE5YC8XG4gICAgdmFsdWUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmVsZW1lbnQgLCAkZSA9IHRoaXMuJGVsZW1lbnQgLCAkZm9ybSA9IHRoaXMuJGZvcm0gLCBwbGFjZWhvbGRlcnRleHQgO1xuICAgICAgICBzd2l0Y2goIGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuICAgICAgICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICAgICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZvcm0uZmluZCgnaW5wdXRbbmFtZT0nICsgZS5uYW1lICsgJ106cmFkaW86Y2hlY2tlZCcpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkZm9ybS5maW5kKCdpbnB1dFtuYW1lPScgKyBlLm5hbWUgKyAnXTpjaGVja2JveDpjaGVja2VkJykubWFwKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS50b0FycmF5KCkuam9pbignLCcpO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVydGV4dCA9ICRlLmF0dHIoIFwiZGF0YS1cIiArICBDT05TVEFOVC5QTEFDRUhPTERFUiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYWNlaG9sZGVydGV4dCA9PT0gZS52YWx1ZSA/IFwiXCIgOiBlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdoaWRkZW4nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdwYXNzd29yZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiBlLnZhbHVlO1xuICAgICAgICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVydGV4dCA9ICRlLmF0dHIoIFwiZGF0YS1cIiArICBDT05TVEFOVC5QTEFDRUhPTERFUiApO1xuICAgICAgICAgICAgICAgIHJldHVybiBwbGFjZWhvbGRlcnRleHQgPT09IGUudmFsdWUgPyBcIlwiIDogZS52YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdmFyIHI7XG4gICAgICAgICAgICAgICAgciA9ICRlLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHIgIT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gcjtcbiAgICAgICAgICAgICAgICByID0gZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHIgIT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gcjtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgIH0gLCBcblxuICAgIC8vIOinpuWPkeiHqumqjOivgeihjOS4ulxuICAgIGFmdGVyX2NoZWNrIDogZnVuY3Rpb24oIGlzX3ZhbGlkICwgZXJyb3JzICwgJGV2ZW50ICkge1xuICAgICAgICB2YXIgdHlwZSA9IGlzX3ZhbGlkID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnO1xuICAgICAgICB2YXIgZXZ0ID0gdGhpcy4kZWxlbWVudC5kYXRhKCBDT05TVEFOVC5GSUVMRF9FVkVOVFMgKyB0eXBlICk7XG4gICAgICAgIGlmKCAhZXZ0ICkgZXZ0ID0gdGhpcy4kZm9ybS5kYXRhKCBDT05TVEFOVC5GSUVMRF9FVkVOVFMgKyB0eXBlICk7XG4gICAgICAgIGlmKCAhZXZ0IHx8IHR5cGVvZiBldnQgIT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgICAgIGV2dC5jYWxsKCB0aGlzICwgJGV2ZW50ICwgZXJyb3JzICk7XG4gICAgfVxuXG59O1xuXG5cbi8vICMjIOihqOWNlemqjOivgeWZqFxuXG5mdW5jdGlvbiBGb3JtVmFsaWRhdG9yKCBmb3JtICkge1xuICAgIGlmKCAhZm9ybSApIHRocm93IFwiW0VSUk9SXSBmb3JtIOWPguaVsOW/hemhu+WtmOWcqC5cIlxuICAgIGlmKCBmb3JtLnRhZ05hbWUgIT09ICdGT1JNJyApIHRocm93IFwiW0VSUk9SXSDlj4LmlbAgZm9ybSDlv4XpobvmmK/kuKrooajljZXlhYPntKAuXCJcbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICAgIHRoaXMuJGZvcm0gPSAkKGZvcm0pO1xuICAgIHRoaXMuYXN5bmMgPSBuZXcgQXN5bmMoKTtcbn1cblxuLy8g5Yik5pat5YWD57Sg5Y+v6KeB5bm25a2Y5ZyoXG5mdW5jdGlvbiBfZXhpc3RzKCBlbCApe1xuICAgIHJldHVybiAkKGVsKS5jbG9zZXN0KCdib2R5Jykuc2l6ZSgpID4gMCAmJiAkKGVsKS5pcyhcIjp2aXNpYmxlXCIpO1xufVxuXG4vLyDlvpfliLDmjIflrprlhYPntKDnmoRqdmFsaWRhdG9yXG5mdW5jdGlvbiBfZ2V0RmllbGRWYWxpZGF0b3IoIGVsICl7XG4gICAgaWYoIGVsLm5vZGVOYW1lID09IFwiSU5QVVRcIiAmJiAoIGVsLnR5cGUgPT0gXCJjaGVja2JveFwiIHx8IGVsLnR5cGUgPT0gXCJyYWRpb1wiICkgKSB7XG4gICAgICAgIGVsID0gJChlbCkuY2xvc2VzdChcImZvcm1cIikuZmluZChcImlucHV0W2RhdGEtXCIgKyBDT05TVEFOVC5QQVRURVJOICsgXCJdW25hbWU9XCIgKyBlbC5uYW1lICsgXCJdXCIpWzBdO1xuICAgIH1cbiAgICBpZiggIWVsIHx8IGVsLmRpc2FibGVkICkgcmV0dXJuO1xuICAgIGlmKCAhJChlbCkuYXR0ciggXCJkYXRhLVwiICsgIENPTlNUQU5ULlBBVFRFUk4gKSApIHJldHVybjtcbiAgICByZXR1cm4gZWwuX2ZpZWxkX3ZhbGlkYXRvciA/IGVsLl9maWVsZF92YWxpZGF0b3IgOiAoIGVsLl9maWVsZF92YWxpZGF0b3IgPSBuZXcgRmllbGRDaGVja2VyKCBlbCApICk7XG59XG5cbi8vIOino+aekCB3aGVuIOS4reeahOaUr+aMgSBAbmFtZSDnmoQgc2VsZWN0b3Ig6K+t5rOVIFxuZnVuY3Rpb24gX3BhcnNlX3NlbGVjdG9yX3N5bnRheCggc2VsZWN0b3IgKSB7XG4gICAgcmV0dXJuICggc2VsZWN0b3IgfHwgXCJcIiApLnJlcGxhY2UoL0AoW2Etel1bYS16MC05XSopXFxiL2lnLCdbbmFtZT0kMV0nKTtcbn1cblxuRm9ybVZhbGlkYXRvci5wcm90b3R5cGUgPSB7XG5cbiAgICAvLyDlvpfliLDmiYDmnInpnIDopoHpqozor4HnmoTlrZfmrrXvvIjpnZ7pmpDol4/kuJTkuI3kuLpkaXNhYmxlZO+8iVxuICAgIF9nZXRBbGxGaWVsZFZhbGlkYXRvciA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLiRmb3JtLmZpbmQoJ1tkYXRhLScgKyBDT05TVEFOVC5QQVRURVJOICsgJ10nKS5maWx0ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBfZXhpc3RzKHRoaXMpICYmICF0aGlzLmRpc2FibGVkO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBfZ2V0RmllbGRWYWxpZGF0b3IodGhpcyk7XG4gICAgICAgIH0pLnRvQXJyYXkoKTtcbiAgICB9ICxcblxuICAgIC8vIOmqjOivgeacrOihqOWNleS4reaJgOacieWFg+e0oOeahCBwYXR0ZXJuIOaYr+WQpuato+ehrlxuICAgIGNoZWNrQWxsUGF0dGVybnMgOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX2p2cyA9IHRoaXMuX2dldEFsbEZpZWxkVmFsaWRhdG9yKCk7XG4gICAgICAgICQuZWFjaCggX2p2cyAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLmNoZWNrUGF0dGVybigpO1xuICAgICAgICB9KTtcbiAgICB9ICxcblxuICAgIC8vIOmqjOivgeihqOWNleWGheaJgOacieWtl+autVxuICAgIHZhbGlkYXRlQWxsIDogZnVuY3Rpb24oIHZhbGlkYXRlQWxsQ2FsbGJhY2sgKXtcbiAgICAgICAgdmFyICRmb3JtID0gdGhpcy4kZm9ybTtcbiAgICAgICAgdmFyIGFzeW5jID0gbmV3IEFzeW5jKCk7XG4gICAgICAgIHZhciBfanZzID0gdGhpcy5fZ2V0QWxsRmllbGRWYWxpZGF0b3IoKTtcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xuXG4gICAgICAgIGFzeW5jLmNsZWFyKCk7XG4gICAgICAgIGFzeW5jLm9uZmluaXNoZWQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFsaWRhdGVBbGxDYWxsYmFjayAmJiB2YWxpZGF0ZUFsbENhbGxiYWNrKCBlcnJvcnMubGVuZ3RoID09IDAgLCBlcnJvcnMgKTsgXG4gICAgICAgIH1cblxuICAgICAgICAvLyDlvZPmsqHmnInku7vkvZXlj6/ku6Xpqozor4HnmoTlrZfmrrXml7bnm7TmjqXov5Tlm55cbiAgICAgICAgaWYoICFfanZzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0ZUFsbENhbGxiYWNrKCB0cnVlICwgW10gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgX2p2cy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIHZhciBqdiA9IF9qdnNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIChmdW5jdGlvbihqdil7XG4gICAgICAgICAgICAgICAgYXN5bmMuYWRkUmVxdWVzdChmdW5jdGlvbihhc3luY19jb250aW51ZSl7XG4gICAgICAgICAgICAgICAgICAgIGp2LmNoZWNrKCBudWxsICwgZnVuY3Rpb24oIGNoZWNrUmVzdWx0ICwgZXJyb3IgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhY2hlY2tSZXN1bHQgKXsgZXJyb3JzLnB1c2goIGVycm9yICkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNfY29udGludWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KShqdik7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jLmdvKCk7XG4gICAgfSAsIFxuXG4gICAgLy8g5b2T5L2g6ZyA6KaB5a2X5q616Ieq6Kem5Y+R6aqM6K+B5pe277yM5q+U5aaC77yaaW5wdXQgYmx1cuaXtumcgOimgemqjOivge+8jOivt+S9v+eUqOivpeaWueazlS5cbiAgICAvLyBzZWxlY3RvciDmmK/pnIDopoHoh6rop6blj5Hpqozor4HnmoTlrZfmrrUgLSDlpoLmnpzkuI3lhpnliJnpu5jorqTlhajpg6jjgII8YnIgLz5cbiAgICAvLyBldnRzIOacieS4pOenjeWGmeazlTpcbiAgICAvLyAjIyMjIyDnrKzkuIDnp43vvJpcbiAgICAvLyA+IFsgJ2JsdXInICwgJ2ZvY3VzJyAsICdrZXlwcmVzcycgXSBcbiAgICAvLyBcbiAgICAvLyDku6Pooaggc2VsZWN0b3Ig55qEIFsgJ2JsdXInICwgJ2ZvY3VzJyAsICdrZXlwcmVzcycgXSDkuovku7bkvJrop6blj5Egc2VsZWN0b3Ig55qE6aqM6K+BXG4gICAgLy8gXG4gICAgLy8gIyMjIyMg56ys5LqM56eN77yaXG4gICAgLy8gPiBcXHsgPGJyIC8+XG4gICAgLy8gPiAgICAgJ0BzZWwnIDogWyAnYmx1cicgLCAna2V5cHJlc3MnIF1cbiAgICAvLyA+IFxcfSA8YnIgLz5cbiAgICAvLyBcbiAgICAvLyDku6Pooagg55SxQHNlbCDnmoQgWyAnYmx1cicgLCAna2V5cHJlc3MnIF0g5LqL5Lu25Lya6Kem5Y+RIHNlbGVjdG9yIOeahOmqjOivgVxuXG4gICAgd2hlbiA6IGZ1bmN0aW9uKCBzZWxlY3RvciAsIGV2dHMgKSB7XG4gICAgICAgIGlmKCB0eXBlb2Ygc2VsZWN0b3IgIT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBldnRzID0gc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXZlbnRzID0ge307XG4gICAgICAgIHZhciBzZWwgPSBzZWxlY3RvciB8fCBcIltkYXRhLVwiICsgQ09OU1RBTlQuUEFUVEVSTiArIFwiXVwiO1xuXG4gICAgICAgIC8vIOWkhOeQhiBjaGVja2JveCDlkowgcmFkaW9cbiAgICAgICAgdmFyIGNoa3MgPSB0aGlzLiRmb3JtLmZpbmQoc2VsKS5maWx0ZXIoJ2lucHV0OmNoZWNrYm94Jyk7XG4gICAgICAgIGlmKCBjaGtzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGNoa3MuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNlbCArPSBcIixcIiArIF9wYXJzZV9zZWxlY3Rvcl9zeW50YXgoIFwiQFwiICsgdGhpcy5uYW1lIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJkb3MgPSB0aGlzLiRmb3JtLmZpbmQoc2VsKS5maWx0ZXIoJ2lucHV0OnJhZGlvJyk7XG4gICAgICAgIGlmKCByZG9zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJkb3MuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNlbCArPSBcIixcIiArIF9wYXJzZV9zZWxlY3Rvcl9zeW50YXgoIFwiQFwiICsgdGhpcy5uYW1lIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoICQuaXNBcnJheShldnRzKSApIHsgIFxuICAgICAgICAgICAgZXZlbnRzWyBzZWwgXSA9IGV2dHMgO1xuICAgICAgICB9IGVsc2UgaWYoICQuaXNQbGFpbk9iamVjdChldnRzKSApIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKCBldmVudHMgLCBldnRzICk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoIHZhciB0YXJnZXRTZWxlY3RvciBpbiBldmVudHMgKSB7XG4gICAgICAgICAgICB2YXIgX3NlbCA9IF9wYXJzZV9zZWxlY3Rvcl9zeW50YXgoIHRhcmdldFNlbGVjdG9yICk7XG4gICAgICAgICAgICB2YXIgX2V2dHMgPSAoIGV2ZW50c1t0YXJnZXRTZWxlY3Rvcl0gfHwgW10gKTtcbiAgICAgICAgICAgIGlmKCAhX2V2dHMubGVuZ3RoICkgY29udGludWU7XG4gICAgICAgICAgICBfZXZ0cyA9IF9ldnRzLmpvaW4oJyAnKTtcblxuICAgICAgICAgICAgdGhpcy4kZm9ybS51bmRlbGVnYXRlKCBfc2VsICwgX2V2dHMgKTtcblxuICAgICAgICAgICAgdGhpcy4kZm9ybS5kZWxlZ2F0ZSggX3NlbCAsIF9ldnRzICwgZnVuY3Rpb24oJGV2ZW50KXtcbiAgICAgICAgICAgICAgICB2YXIganYgPSBfZ2V0RmllbGRWYWxpZGF0b3IoIHRoaXMgKTtcbiAgICAgICAgICAgICAgICBqdiAmJiBqdi5jaGVjayggJGV2ZW50ICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgc2V0TWVzc2FnZSA6IGZ1bmN0aW9uKCBzZWxlY3RvciAsIHBhdHRlcm5OYW1lICwgbXNnICkgeyBcblxuICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAyICkge1xuICAgICAgICAgICAgbXNnID0gcGF0dGVybk5hbWU7XG4gICAgICAgICAgICBwYXR0ZXJuTmFtZSA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGMgLCBmID0gdGhpcy4kZm9ybVswXTtcblxuICAgICAgICBpZiggIXNlbGVjdG9yICkge1xuICAgICAgICAgICAgYyA9IGZbIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdID0gZlsgQ09OU1RBTlQuTUVTU0FHRV9BVFRSIF0gfHwge307XG4gICAgICAgICAgICBjW3BhdHRlcm5OYW1lXSA9IG1zZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm0uZmluZCggX3BhcnNlX3NlbGVjdG9yX3N5bnRheCggc2VsZWN0b3IgKSApLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgYyA9IGVbIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdID0gZVsgQ09OU1RBTlQuTUVTU0FHRV9BVFRSIF0gfHwge307XG4gICAgICAgICAgICAgICAgY1twYXR0ZXJuTmFtZV0gPSBtc2c7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfSAsXG5cbiAgICBzdWNjZXNzIDogZnVuY3Rpb24oIHNlbGVjdG9yICwgZm4gKSB7XG4gICAgICAgIHRoaXMuX2JpbmRfZmllbGRfZXZlbnQoICdzdWNjZXNzJyAsIHNlbGVjdG9yICwgZm4gKTtcbiAgICB9ICxcblxuICAgIGZhaWwgOiBmdW5jdGlvbiggc2VsZWN0b3IgLCBmbiApIHtcbiAgICAgICAgdGhpcy5fYmluZF9maWVsZF9ldmVudCggJ2ZhaWwnICwgc2VsZWN0b3IgLCBmbiApO1xuICAgIH0gLFxuXG4gICAgX2JpbmRfZmllbGRfZXZlbnQgOiBmdW5jdGlvbiggdHlwZSAsIHNlbGVjdG9yICwgZm4gKSB7XG4gICAgICAgIFxuICAgICAgICBpZiggIXR5cGUgKSByZXR1cm47XG5cbiAgICAgICAgaWYoIHR5cGVvZiBzZWxlY3RvciA9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICAgICAgZm4gPSBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBzZWxlY3RvciApIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSBfcGFyc2Vfc2VsZWN0b3Jfc3ludGF4KCBzZWxlY3RvciApO1xuICAgICAgICAgICAgdGhpcy4kZm9ybS5maW5kKHNlbCkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSggQ09OU1RBTlQuRklFTERfRVZFTlRTICsgdHlwZSAsIGZuICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZm9ybS5kYXRhKCBDT05TVEFOVC5GSUVMRF9FVkVOVFMgKyB0eXBlICwgZm4gKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbiQuZm4uanZhbGlkYXRvciA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGZvcm0gPSAkKHRoaXMpLmZpcnN0KCk7XG4gICAgaWYoIGZvcm0uZGF0YSgnRm9ybVZhbGlkYXRvcicpICkgcmV0dXJuIGZvcm0uZGF0YSgnRm9ybVZhbGlkYXRvcicpO1xuICAgIHZhciBmdiA9IG5ldyBGb3JtVmFsaWRhdG9yKCBmb3JtWzBdICk7XG4gICAgZm9ybS5kYXRhKCdGb3JtVmFsaWRhdG9yJywgZnYgKTtcbiAgICByZXR1cm4gZnY7XG59O1xuXG5cbi8vIOiuvue9ruWinuWKoOiHquWumuS5iSBwYXR0ZXJuIOeahOWFpeWPo1xuXG5mdW5jdGlvbiBhZGRQYXR0ZXJuKCBuYW1lICwgb3B0aW9ucyApIHtcblxuICAgIGlmKCFuYW1lKSB0aHJvdyBcIltFUlJPUl0gYWRkIHBhdHRlcm4gLSBubyBuYW1lXCI7XG4gICAgaWYoIW9wdGlvbnMpIHRocm93IFwiW0VSUk9SXSBhZGQgcGF0dGVybiAtIG5vIG9wdGlvbnNcIlxuICAgIGlmKCFvcHRpb25zLm1lc3NhZ2UpIHRocm93IFwiW0VSUk9SXSBhZGQgcGF0dGVybiAtIG5vIG1lc3NhZ2VcIlxuICAgIGlmKCFvcHRpb25zLnZhbGlkYXRlKSB0aHJvdyBcIltFUlJPUl0gYWRkIHBhdHRlcm4gLSBubyB2YWxpZGF0ZVwiO1xuICAgIFxuICAgIFBBVFRFUk5TW25hbWVdID0gJC5leHRlbmQoe1xuICAgICAgICBuYW1lIDogbmFtZSBcbiAgICB9ICwgb3B0aW9ucyApO1xuXG4gICAgcGFyc2VyLmFkZCggbmFtZSAsIG9wdGlvbnMgKTtcblxufVxuXG5leHBvcnRzLmFkZFBhdHRlcm4gPSBhZGRQYXR0ZXJuO1xuXG4kLmV4dGVuZCh7XG4gICAganZhbGlkYXRvcjoge1xuICAgICAgICBhZGRQYXR0ZXJuIDogYWRkUGF0dGVybiAsXG4gICAgICAgIFBBVFRFUk5TIDogUEFUVEVSTlMgLCBcbiAgICAgICAgZ2V0RmllbGRWYWxpZGF0b3IgOiBmdW5jdGlvbiggZWwgKSB7XG4gICAgICAgICAgICByZXR1cm4gX2dldEZpZWxkVmFsaWRhdG9yKCBlbCApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJ2YXIgdiA9IHJlcXVpcmUoJy4vVmFsaWRhdG9yLmpzJyk7XG5cbnZhciB2YWxpZEZ1bmMgPSB7XG4gICAgXG4gICAgLyoqKlxuICAgICAqIOWAvDpcbiAgICAgKiAxIOaXoOmUmeivryBcbiAgICAgKiAtMSDplb/luqbplJnor69cbiAgICAgKiAtMiDpqozor4HplJnor68gXG4gICAgICovXG4gICAgSUQgOiBmdW5jdGlvbiggbnVtICkgeyAgXG5cbiAgICAgICAgbnVtID0gbnVtLnRvVXBwZXJDYXNlKCk7ICBcbiAgICAgICAgXG4gICAgICAgIC8v6Lqr5Lu96K+B5Y+356CB5Li6MTXkvY3miJbogIUxOOS9je+8jDE15L2N5pe25YWo5Li65pWw5a2X77yMMTjkvY3liY0xN+S9jeS4uuaVsOWtl++8jOacgOWQjuS4gOS9jeaYr+agoemqjOS9je+8jOWPr+iDveS4uuaVsOWtl+aIluWtl+espljjgIIgICBcbiAgICAgICAgaWYgKCEoLyheXFxkezE1fSQpfCheXFxkezE3fShcXGR8WCkkKS8udGVzdChudW0pKSkgeyBcbiAgICAgICAgICAgIHJldHVybiAtMTsgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8v5qCh6aqM5L2N5oyJ54WnSVNPIDcwNjQ6MTk4My5NT0QgMTEtMueahOinhOWumueUn+aIkO+8jFjlj6/ku6XorqTkuLrmmK/mlbDlrZcxMOOAgiBcbiAgICAgICAgLy/kuIvpnaLliIbliKvliIbmnpDlh7rnlJ/ml6XmnJ/lkozmoKHpqozkvY0gXG4gICAgICAgIFxuICAgICAgICB2YXIgbGVuLCByZTsgXG4gICAgICAgIGxlbiA9IG51bS5sZW5ndGg7IFxuICAgICAgICBpZiAobGVuID09IDE1KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlID0gbmV3IFJlZ0V4cCgvXihcXGR7Nn0pKFxcZHsyfSkoXFxkezJ9KShcXGR7Mn0pKFxcZHszfSkkLyk7IFxuICAgICAgICAgICAgdmFyIGFyclNwbGl0ID0gbnVtLm1hdGNoKHJlKTsgXG5cbiAgICAgICAgICAgIC8v5qOA5p+l55Sf5pel5pel5pyf5piv5ZCm5q2j56GuIFxuICAgICAgICAgICAgdmFyIGR0bUJpcnRoID0gbmV3IERhdGUoJzE5JyArIGFyclNwbGl0WzJdICsgJy8nICsgYXJyU3BsaXRbM10gKyAnLycgKyBhcnJTcGxpdFs0XSk7IFxuICAgICAgICAgICAgdmFyIGJHb29kRGF5ID0gKGR0bUJpcnRoLmdldFllYXIoKSA9PSBOdW1iZXIoYXJyU3BsaXRbMl0pKSAmJiAoKGR0bUJpcnRoLmdldE1vbnRoKCkgKyAxKSA9PSBOdW1iZXIoYXJyU3BsaXRbM10pKSAmJiAoZHRtQmlydGguZ2V0RGF0ZSgpID09IE51bWJlcihhcnJTcGxpdFs0XSkpOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFiR29vZERheSkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gLTI7IFxuICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChsZW4gPT0gMTgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmUgPSBuZXcgUmVnRXhwKC9eKFxcZHs2fSkoXFxkezR9KShcXGR7Mn0pKFxcZHsyfSkoXFxkezN9KShcXGR8WCkkLyk7IFxuICAgICAgICAgICAgdmFyIGFyclNwbGl0ID0gbnVtLm1hdGNoKHJlKTsgXG5cbiAgICAgICAgICAgIC8v5qOA5p+l55Sf5pel5pel5pyf5piv5ZCm5q2j56GuIFxuICAgICAgICAgICAgdmFyIGR0bUJpcnRoID0gbmV3IERhdGUoYXJyU3BsaXRbMl0gKyBcIi9cIiArIGFyclNwbGl0WzNdICsgXCIvXCIgKyBhcnJTcGxpdFs0XSk7IFxuICAgICAgICAgICAgdmFyIGJHb29kRGF5ID0gKGR0bUJpcnRoLmdldEZ1bGxZZWFyKCkgPT0gTnVtYmVyKGFyclNwbGl0WzJdKSkgJiYgKChkdG1CaXJ0aC5nZXRNb250aCgpICsgMSkgPT0gTnVtYmVyKGFyclNwbGl0WzNdKSkgJiYgKGR0bUJpcnRoLmdldERhdGUoKSA9PSBOdW1iZXIoYXJyU3BsaXRbNF0pKTsgXG5cbiAgICAgICAgICAgIGlmICghYkdvb2REYXkpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0yOyBcbiAgICAgICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgICAgIC8v5qOA6aqMMTjkvY3ouqvku73or4HnmoTmoKHpqoznoIHmmK/lkKbmraPnoa7jgIIgXG4gICAgICAgICAgICAgICAgLy/moKHpqozkvY3mjInnhadJU08gNzA2NDoxOTgzLk1PRCAxMS0y55qE6KeE5a6a55Sf5oiQ77yMWOWPr+S7peiupOS4uuaYr+aVsOWtlzEw44CCIFxuICAgICAgICAgICAgICAgIHZhciB2YWxudW07IFxuICAgICAgICAgICAgICAgIHZhciBhcnJJbnQgPSBuZXcgQXJyYXkoNywgOSwgMTAsIDUsIDgsIDQsIDIsIDEsIDYsIDMsIDcsIDksIDEwLCA1LCA4LCA0LCAyKTsgXG4gICAgICAgICAgICAgICAgdmFyIGFyckNoID0gbmV3IEFycmF5KCcxJywgJzAnLCAnWCcsICc5JywgJzgnLCAnNycsICc2JywgJzUnLCAnNCcsICczJywgJzInKTsgXG4gICAgICAgICAgICAgICAgdmFyIG5UZW1wID0gMCwgaTsgXG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgMTc7IGkgKyspIHsgXG4gICAgICAgICAgICAgICAgICAgIG5UZW1wICs9IG51bS5zdWJzdHIoaSwgMSkgKiBhcnJJbnRbaV07IFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFsbnVtID0gYXJyQ2hbblRlbXAgJSAxMV07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHZhbG51bSAhPSBudW0uc3Vic3RyKDE3LCAxKSkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0yOyBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiAxOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiAtMjsgXG4gICAgICAgIFxuICAgIH1cbiAgICBcbn07XG5cbnYuYWRkUGF0dGVybigncmVxdWlyZWQnLHtcbiAgICBtZXNzYWdlIDogJ+S4jeiDveS4uuepuicgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIHZhbHVlICE9PSBcIlwiICk7IFxuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ25vbi1yZXF1aXJlZCcse1xuICAgIG1lc3NhZ2UgOiAn5YWB6K645Li656m6JyAsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgZG9uZSggdmFsdWUgPT09IFwiXCIgKTsgXG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignbnVtZXJpYycse1xuICAgIG1lc3NhZ2UgOiAn5b+F6aG75piv5pWw5a2XJyAsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgZG9uZSggL15cXGQrJC8udGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG5cbnYuYWRkUGF0dGVybignaW50Jyx7XG4gICAgbWVzc2FnZSA6ICflv4XpobvmmK/mlbTmlbAnICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXlxcLT9cXGQrJC8udGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ2RlY2ltYWwnLHtcbiAgICBtZXNzYWdlIDogJ+W/hemhu+aYr+Wwj+aVsCcgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eXFwtP1xcZCpcXC4/XFxkKyQvLnRlc3QoIHZhbHVlICkgKTtcbiAgICB9XG59KTtcblxuXG52LmFkZFBhdHRlcm4oJ2FscGhhJyx7XG4gICAgbWVzc2FnZSA6ICflv4XpobvmmK/lrZfmr40nICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXlthLXpdKyQvaS50ZXN0KCB2YWx1ZSApICk7XG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignYWxwaGFfbnVtZXJpYycse1xuICAgIG1lc3NhZ2UgOiAn5b+F6aG75Li65a2X5q+N5oiW5pWw5a2XJyAsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgZG9uZSggL15bYS16MC05XSskL2kudGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ2FscGhhX2Rhc2gnLHtcbiAgICBtZXNzYWdlIDogJ+W/hemhu+S4uuWtl+avjeaIluaVsOWtl+WPiuS4i+WIkue6v+etieeJueauiuWtl+espicgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eW2EtejAtOV9cXC1dKyQvaS50ZXN0KCB2YWx1ZSApICk7XG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignY2hzJyx7XG4gICAgbWVzc2FnZSA6ICflv4XpobvmmK/kuK3mloflrZfnrKYnLFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgZG9uZSggL15bXFxcXHU0RTAwLVxcXFx1OUZGRl0rJC9pLnRlc3QoIHZhbHVlICkgKTtcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdjaHNfbnVtZXJpYycse1xuICAgIG1lc3NhZ2UgOiAn5b+F6aG75piv5Lit5paH5a2X56ym5oiW5pWw5a2XJyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eW1xcXFx1NEUwMC1cXFxcdTlGRkYwLTldKyQvaS50ZXN0KCB2YWx1ZSApICk7XG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignY2hzX251bWVyaWMnLHtcbiAgICBtZXNzYWdlIDogJ+W/hemhu+aYr+S4reaWh+Wtl+espuaIluaVsOWtl+WPiuS4i+WIkue6v+etieeJueauiuWtl+espicgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eW1xcXFx1NEUwMC1cXFxcdTlGRkYwLTlfXFwtXSskL2kudGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG5cbnYuYWRkUGF0dGVybignbWF0Y2gnLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ+W/hemhu+S4jiAlYXJndSDnm7jlkIwnICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICB2YXIgdiA9IHRoaXMuZ2V0VmFsdWVTeW1ib2woKTtcbiAgICAgICAgdmFyIHZ2ID0gdiAmJiB2LnRhZ05hbWUgPyB0aGlzLmdldEVsZW1lbnRWYWx1ZSh2KSA6IHY7XG4gICAgICAgIGRvbmUoIHZ2ID09PSB2YWx1ZSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ2NvbnRhaW4nLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ+W/hemhu+WMheWQq1wiJWFyZ3VcIueahOWGheWuuScgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIHZhciB2ID0gdGhpcy5nZXRWYWx1ZVN5bWJvbCgpO1xuICAgICAgICB2YXIgdnYgPSB2ICYmIHYudGFnTmFtZSA/IHRoaXMuZ2V0RWxlbWVudFZhbHVlKHYpIDogdjtcbiAgICAgICAgZG9uZSggISF+dmFsdWUuaW5kZXhPZih2dikgKTtcbiAgICB9XG59KTtcblxuXG52LmFkZFBhdHRlcm4oJ0AnLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ0BA5b+F6aG75Li6ICVhcmd1JyAsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgdmFyIHYgPSB0aGlzLmdldFZhbHVlU3ltYm9sKCk7XG4gICAgICAgIHZhciBhdCA9IHRoaXMuZ2V0TmFtZVN5bWJvbCgpO1xuICAgICAgICBpZiggdiA9PT0gbnVsbCB8fCBhdCA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgIGRvbmUoIGZhbHNlICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdnYgPSB2ICYmIHYudGFnTmFtZSA/IHRoaXMuZ2V0RWxlbWVudFZhbHVlKHYpIDogdjtcbiAgICAgICAgICAgIHZhciB2YXQgPSBhdCAmJiBhdC50YWdOYW1lID8gdGhpcy5nZXRFbGVtZW50VmFsdWUoYXQpIDogYXQ7XG4gICAgICAgICAgICBkb25lKCB2diA9PT0gdmF0ICk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxufSk7XG5cblxudi5hZGRQYXR0ZXJuKCdpZGNhcmQnLHtcbiAgICBtZXNzYWdlIDogJ+i6q+S7veivgeagvOW8j+mUmeivrycgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIHZhbGlkRnVuYy5JRCh2YWx1ZSkgPT09IDEgKTsgXG4gICAgfVxufSk7XG5cblxudi5hZGRQYXR0ZXJuKCdwYXNzcG9ydCcse1xuICAgIG1lc3NhZ2UgOiAn5oqk54Wn5qC85byP6ZSZ6K+v5oiW6L+H6ZW/JyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eW2EtekEtWjAtOV17MCwyMH0kL2kudGVzdCggdmFsdWUgKSApOyBcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdlbWFpbCcse1xuICAgIG1lc3NhZ2UgOiAn6YKu5Lu25Zyw5Z2A6ZSZ6K+vJyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eW2EtekEtWjAtOS4hIyQlJmFtcDsnKitcXC1cXC89P1xcXl9ge3x9flxcLV0rQFthLXpBLVowLTlcXC1dKyg/OlxcLlthLXpBLVowLTlcXC1dKykqJC8udGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ21pbl9sZW5ndGgnLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ+acgOWwkei+k+WFpSVhcmd15Liq5a2XJywgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICB2YXIgbiA9IHBhcnNlSW50KCB0aGlzLnZhbHVlICwgMTAgKTtcbiAgICAgICAgZG9uZSggdmFsdWUubGVuZ3RoID49IG4gKTtcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdtYXhfbGVuZ3RoJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICfmnIDlpJrovpPlhaUlYXJndeS4quWtlycsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgdmFyIG4gPSBwYXJzZUludCggdGhpcy52YWx1ZSAsIDEwICk7XG4gICAgICAgIGRvbmUoIHZhbHVlLmxlbmd0aCA8PSBuICk7XG4gICAgfVxufSk7XG5cblxudi5hZGRQYXR0ZXJuKCdsZW5ndGgnLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ+mVv+W6puW/hemhu+S4uiVhcmd15Liq5a2X56ymJywgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICB2YXIgbiA9IHBhcnNlSW50KCB0aGlzLnZhbHVlICwgMTAgKTtcbiAgICAgICAgZG9uZSggdmFsdWUubGVuZ3RoID09PSBuICk7XG4gICAgfVxufSk7XG5cblxudi5hZGRQYXR0ZXJuKCdncmVhdGVyX3RoYW4nLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ+W/hemhu+Wkp+S6jiVhcmd1JyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKXtcbiAgICAgICAgdmFyIHYgPSBwYXJzZUludCggdmFsdWUgLCAxMCApO1xuICAgICAgICB2YXIgbiA9IHRoaXMucGFyc2VOYW1lU3ltYm9sKCB0aGlzLnZhbHVlICk7XG4gICAgICAgIG4gPSBwYXJzZUZsb2F0KCBuICYmIG4udGFnTmFtZSA/IHRoaXMuZ2V0RWxlbWVudFZhbHVlKCBuICkgOiB0aGlzLnZhbHVlICk7XG4gICAgICAgIGRvbmUoIHYgPiBuIClcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdsZXNzX3RoYW4nLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ+W/hemhu+Wwj+S6jiVhcmd1JyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKXtcbiAgICAgICAgdmFyIHYgPSBwYXJzZUludCggdmFsdWUgLCAxMCApO1xuICAgICAgICB2YXIgbiA9IHRoaXMucGFyc2VOYW1lU3ltYm9sKCB0aGlzLnZhbHVlICk7XG4gICAgICAgIG4gPSBwYXJzZUZsb2F0KCBuICYmIG4udGFnTmFtZSA/IHRoaXMuZ2V0RWxlbWVudFZhbHVlKCBuICkgOiB0aGlzLnZhbHVlICk7XG4gICAgICAgIGRvbmUoIHYgPCBuIClcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdlcXVhbCcse1xuICAgIGFyZ3VtZW50IDogdHJ1ZSAsIFxuICAgIG1lc3NhZ2UgOiAn5b+F6aG7562J5LqOJWFyZ3UnLFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApe1xuICAgICAgICB2YXIgdiA9IHBhcnNlSW50KCB2YWx1ZSAsIDEwICk7XG4gICAgICAgIHZhciBuID0gdGhpcy5wYXJzZU5hbWVTeW1ib2woIHRoaXMudmFsdWUgKTtcbiAgICAgICAgbiA9IHBhcnNlRmxvYXQoIG4gJiYgbi50YWdOYW1lID8gdGhpcy5nZXRFbGVtZW50VmFsdWUoIG4gKSA6IHRoaXMudmFsdWUgKTtcbiAgICAgICAgZG9uZSggdiA9PSBuIClcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdpcCcseyBcbiAgICBtZXNzYWdlIDogJ+W/hemhu+espuWQiGlw5qC85byPJyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKXtcbiAgICAgICAgZG9uZSggL14oKDI1WzAtNV18MlswLTRdXFxkfDFcXGR7Mn18XFxkezEsMn0pXFwuKXszfSgyNVswLTVdfDJbMC00XVxcZHwxXFxkezJ9fFxcZHsxLDJ9KSQvaS50ZXN0KHZhbHVlKSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ2RhdGUnLHtcbiAgICBtZXNzYWdlIDogJ+W/hemhu+espuWQiOaXpeacn+agvOW8jyBZWVlZLU1NLUREJyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eXFxkXFxkXFxkXFxkXFwtXFxkXFxkXFwtXFxkXFxkJC8udGVzdCh2YWx1ZSkgKTtcbiAgICB9XG59KTtcbiBcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgbG9kYXNoLmNvbS9saWNlbnNlIHwgVW5kZXJzY29yZS5qcyAxLjUuMiB1bmRlcnNjb3JlanMub3JnL0xJQ0VOU0VcbiAqIEJ1aWxkOiBgbG9kYXNoIC1vIC4vZGlzdC9sb2Rhc2guY29tcGF0LmpzYFxuICovXG47KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbihuLHQsZSl7ZT0oZXx8MCktMTtmb3IodmFyIHI9bj9uLmxlbmd0aDowOysrZTxyOylpZihuW2VdPT09dClyZXR1cm4gZTtyZXR1cm4tMX1mdW5jdGlvbiB0KHQsZSl7dmFyIHI9dHlwZW9mIGU7aWYodD10LmwsXCJib29sZWFuXCI9PXJ8fG51bGw9PWUpcmV0dXJuIHRbZV0/MDotMTtcIm51bWJlclwiIT1yJiZcInN0cmluZ1wiIT1yJiYocj1cIm9iamVjdFwiKTt2YXIgdT1cIm51bWJlclwiPT1yP2U6YitlO3JldHVybiB0PSh0PXRbcl0pJiZ0W3VdLFwib2JqZWN0XCI9PXI/dCYmLTE8bih0LGUpPzA6LTE6dD8wOi0xfWZ1bmN0aW9uIGUobil7dmFyIHQ9dGhpcy5sLGU9dHlwZW9mIG47aWYoXCJib29sZWFuXCI9PWV8fG51bGw9PW4pdFtuXT10cnVlO2Vsc2V7XCJudW1iZXJcIiE9ZSYmXCJzdHJpbmdcIiE9ZSYmKGU9XCJvYmplY3RcIik7dmFyIHI9XCJudW1iZXJcIj09ZT9uOmIrbix0PXRbZV18fCh0W2VdPXt9KTtcIm9iamVjdFwiPT1lPyh0W3JdfHwodFtyXT1bXSkpLnB1c2gobik6dFtyXT10cnVlXG59fWZ1bmN0aW9uIHIobil7cmV0dXJuIG4uY2hhckNvZGVBdCgwKX1mdW5jdGlvbiB1KG4sdCl7Zm9yKHZhciBlPW4ubSxyPXQubSx1PS0xLG89ZS5sZW5ndGg7Kyt1PG87KXt2YXIgYT1lW3VdLGk9clt1XTtpZihhIT09aSl7aWYoYT5pfHx0eXBlb2YgYT09XCJ1bmRlZmluZWRcIilyZXR1cm4gMTtpZihhPGl8fHR5cGVvZiBpPT1cInVuZGVmaW5lZFwiKXJldHVybi0xfX1yZXR1cm4gbi5uLXQubn1mdW5jdGlvbiBvKG4pe3ZhciB0PS0xLHI9bi5sZW5ndGgsdT1uWzBdLG89bltyLzJ8MF0sYT1uW3ItMV07aWYodSYmdHlwZW9mIHU9PVwib2JqZWN0XCImJm8mJnR5cGVvZiBvPT1cIm9iamVjdFwiJiZhJiZ0eXBlb2YgYT09XCJvYmplY3RcIilyZXR1cm4gZmFsc2U7Zm9yKHU9bCgpLHVbXCJmYWxzZVwiXT11W1wibnVsbFwiXT11W1widHJ1ZVwiXT11LnVuZGVmaW5lZD1mYWxzZSxvPWwoKSxvLms9bixvLmw9dSxvLnB1c2g9ZTsrK3Q8cjspby5wdXNoKG5bdF0pO3JldHVybiBvfWZ1bmN0aW9uIGEobil7cmV0dXJuXCJcXFxcXCIrWVtuXVxufWZ1bmN0aW9uIGkoKXtyZXR1cm4gdi5wb3AoKXx8W119ZnVuY3Rpb24gbCgpe3JldHVybiB5LnBvcCgpfHx7azpudWxsLGw6bnVsbCxtOm51bGwsXCJmYWxzZVwiOmZhbHNlLG46MCxcIm51bGxcIjpmYWxzZSxudW1iZXI6bnVsbCxvYmplY3Q6bnVsbCxwdXNoOm51bGwsc3RyaW5nOm51bGwsXCJ0cnVlXCI6ZmFsc2UsdW5kZWZpbmVkOmZhbHNlLG86bnVsbH19ZnVuY3Rpb24gZihuKXtyZXR1cm4gdHlwZW9mIG4udG9TdHJpbmchPVwiZnVuY3Rpb25cIiYmdHlwZW9mKG4rXCJcIik9PVwic3RyaW5nXCJ9ZnVuY3Rpb24gYyhuKXtuLmxlbmd0aD0wLHYubGVuZ3RoPHcmJnYucHVzaChuKX1mdW5jdGlvbiBwKG4pe3ZhciB0PW4ubDt0JiZwKHQpLG4uaz1uLmw9bi5tPW4ub2JqZWN0PW4ubnVtYmVyPW4uc3RyaW5nPW4ubz1udWxsLHkubGVuZ3RoPHcmJnkucHVzaChuKX1mdW5jdGlvbiBzKG4sdCxlKXt0fHwodD0wKSx0eXBlb2YgZT09XCJ1bmRlZmluZWRcIiYmKGU9bj9uLmxlbmd0aDowKTt2YXIgcj0tMTtlPWUtdHx8MDtmb3IodmFyIHU9QXJyYXkoMD5lPzA6ZSk7KytyPGU7KXVbcl09blt0K3JdO1xucmV0dXJuIHV9ZnVuY3Rpb24gZyhlKXtmdW5jdGlvbiB2KG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmIXFlKG4pJiZ3ZS5jYWxsKG4sXCJfX3dyYXBwZWRfX1wiKT9uOm5ldyB5KG4pfWZ1bmN0aW9uIHkobix0KXt0aGlzLl9fY2hhaW5fXz0hIXQsdGhpcy5fX3dyYXBwZWRfXz1ufWZ1bmN0aW9uIHcobil7ZnVuY3Rpb24gdCgpe2lmKHIpe3ZhciBuPXMocik7amUuYXBwbHkobixhcmd1bWVudHMpfWlmKHRoaXMgaW5zdGFuY2VvZiB0KXt2YXIgbz1udChlLnByb3RvdHlwZSksbj1lLmFwcGx5KG8sbnx8YXJndW1lbnRzKTtyZXR1cm4geHQobik/bjpvfXJldHVybiBlLmFwcGx5KHUsbnx8YXJndW1lbnRzKX12YXIgZT1uWzBdLHI9blsyXSx1PW5bNF07cmV0dXJuIHplKHQsbiksdH1mdW5jdGlvbiBZKG4sdCxlLHIsdSl7aWYoZSl7dmFyIG89ZShuKTtpZih0eXBlb2YgbyE9XCJ1bmRlZmluZWRcIilyZXR1cm4gb31pZigheHQobikpcmV0dXJuIG47dmFyIGE9aGUuY2FsbChuKTtpZighVlthXXx8IUxlLm5vZGVDbGFzcyYmZihuKSlyZXR1cm4gbjtcbnZhciBsPVRlW2FdO3N3aXRjaChhKXtjYXNlIEw6Y2FzZSB6OnJldHVybiBuZXcgbCgrbik7Y2FzZSBXOmNhc2UgTTpyZXR1cm4gbmV3IGwobik7Y2FzZSBKOnJldHVybiBvPWwobi5zb3VyY2UsUy5leGVjKG4pKSxvLmxhc3RJbmRleD1uLmxhc3RJbmRleCxvfWlmKGE9cWUobiksdCl7dmFyIHA9IXI7cnx8KHI9aSgpKSx1fHwodT1pKCkpO2Zvcih2YXIgZz1yLmxlbmd0aDtnLS07KWlmKHJbZ109PW4pcmV0dXJuIHVbZ107bz1hP2wobi5sZW5ndGgpOnt9fWVsc2Ugbz1hP3Mobik6WWUoe30sbik7cmV0dXJuIGEmJih3ZS5jYWxsKG4sXCJpbmRleFwiKSYmKG8uaW5kZXg9bi5pbmRleCksd2UuY2FsbChuLFwiaW5wdXRcIikmJihvLmlucHV0PW4uaW5wdXQpKSx0PyhyLnB1c2gobiksdS5wdXNoKG8pLChhP1hlOnRyKShuLGZ1bmN0aW9uKG4sYSl7b1thXT1ZKG4sdCxlLHIsdSl9KSxwJiYoYyhyKSxjKHUpKSxvKTpvfWZ1bmN0aW9uIG50KG4pe3JldHVybiB4dChuKT9TZShuKTp7fX1mdW5jdGlvbiB0dChuLHQsZSl7aWYodHlwZW9mIG4hPVwiZnVuY3Rpb25cIilyZXR1cm4gSHQ7XG5pZih0eXBlb2YgdD09XCJ1bmRlZmluZWRcInx8IShcInByb3RvdHlwZVwiaW4gbikpcmV0dXJuIG47dmFyIHI9bi5fX2JpbmREYXRhX187aWYodHlwZW9mIHI9PVwidW5kZWZpbmVkXCImJihMZS5mdW5jTmFtZXMmJihyPSFuLm5hbWUpLHI9cnx8IUxlLmZ1bmNEZWNvbXAsIXIpKXt2YXIgdT1iZS5jYWxsKG4pO0xlLmZ1bmNOYW1lc3x8KHI9IUEudGVzdCh1KSkscnx8KHI9Qi50ZXN0KHUpLHplKG4scikpfWlmKGZhbHNlPT09cnx8dHJ1ZSE9PXImJjEmclsxXSlyZXR1cm4gbjtzd2l0Y2goZSl7Y2FzZSAxOnJldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gbi5jYWxsKHQsZSl9O2Nhc2UgMjpyZXR1cm4gZnVuY3Rpb24oZSxyKXtyZXR1cm4gbi5jYWxsKHQsZSxyKX07Y2FzZSAzOnJldHVybiBmdW5jdGlvbihlLHIsdSl7cmV0dXJuIG4uY2FsbCh0LGUscix1KX07Y2FzZSA0OnJldHVybiBmdW5jdGlvbihlLHIsdSxvKXtyZXR1cm4gbi5jYWxsKHQsZSxyLHUsbyl9fXJldHVybiBNdChuLHQpfWZ1bmN0aW9uIGV0KG4pe2Z1bmN0aW9uIHQoKXt2YXIgbj1sP2E6dGhpcztcbmlmKHUpe3ZhciBoPXModSk7amUuYXBwbHkoaCxhcmd1bWVudHMpfXJldHVybihvfHxjKSYmKGh8fChoPXMoYXJndW1lbnRzKSksbyYmamUuYXBwbHkoaCxvKSxjJiZoLmxlbmd0aDxpKT8ocnw9MTYsZXQoW2UscD9yOi00JnIsaCxudWxsLGEsaV0pKTooaHx8KGg9YXJndW1lbnRzKSxmJiYoZT1uW2ddKSx0aGlzIGluc3RhbmNlb2YgdD8obj1udChlLnByb3RvdHlwZSksaD1lLmFwcGx5KG4saCkseHQoaCk/aDpuKTplLmFwcGx5KG4saCkpfXZhciBlPW5bMF0scj1uWzFdLHU9blsyXSxvPW5bM10sYT1uWzRdLGk9bls1XSxsPTEmcixmPTImcixjPTQmcixwPTgmcixnPWU7cmV0dXJuIHplKHQsbiksdH1mdW5jdGlvbiBydChlLHIpe3ZhciB1PS0xLGE9aHQoKSxpPWU/ZS5sZW5ndGg6MCxsPWk+PV8mJmE9PT1uLGY9W107aWYobCl7dmFyIGM9byhyKTtjPyhhPXQscj1jKTpsPWZhbHNlfWZvcig7Kyt1PGk7KWM9ZVt1XSwwPmEocixjKSYmZi5wdXNoKGMpO3JldHVybiBsJiZwKHIpLGZ9ZnVuY3Rpb24gb3Qobix0LGUscil7cj0ocnx8MCktMTtcbmZvcih2YXIgdT1uP24ubGVuZ3RoOjAsbz1bXTsrK3I8dTspe3ZhciBhPW5bcl07aWYoYSYmdHlwZW9mIGE9PVwib2JqZWN0XCImJnR5cGVvZiBhLmxlbmd0aD09XCJudW1iZXJcIiYmKHFlKGEpfHxkdChhKSkpe3R8fChhPW90KGEsdCxlKSk7dmFyIGk9LTEsbD1hLmxlbmd0aCxmPW8ubGVuZ3RoO2ZvcihvLmxlbmd0aCs9bDsrK2k8bDspb1tmKytdPWFbaV19ZWxzZSBlfHxvLnB1c2goYSl9cmV0dXJuIG99ZnVuY3Rpb24gYXQobix0LGUscix1LG8pe2lmKGUpe3ZhciBhPWUobix0KTtpZih0eXBlb2YgYSE9XCJ1bmRlZmluZWRcIilyZXR1cm4hIWF9aWYobj09PXQpcmV0dXJuIDAhPT1ufHwxL249PTEvdDtpZihuPT09biYmIShuJiZYW3R5cGVvZiBuXXx8dCYmWFt0eXBlb2YgdF0pKXJldHVybiBmYWxzZTtpZihudWxsPT1ufHxudWxsPT10KXJldHVybiBuPT09dDt2YXIgbD1oZS5jYWxsKG4pLHA9aGUuY2FsbCh0KTtpZihsPT1UJiYobD1HKSxwPT1UJiYocD1HKSxsIT1wKXJldHVybiBmYWxzZTtzd2l0Y2gobCl7Y2FzZSBMOmNhc2UgejpyZXR1cm4rbj09K3Q7XG5jYXNlIFc6cmV0dXJuIG4hPStuP3QhPSt0OjA9PW4/MS9uPT0xL3Q6bj09K3Q7Y2FzZSBKOmNhc2UgTTpyZXR1cm4gbj09aWUodCl9aWYocD1sPT0kLCFwKXt2YXIgcz13ZS5jYWxsKG4sXCJfX3dyYXBwZWRfX1wiKSxnPXdlLmNhbGwodCxcIl9fd3JhcHBlZF9fXCIpO2lmKHN8fGcpcmV0dXJuIGF0KHM/bi5fX3dyYXBwZWRfXzpuLGc/dC5fX3dyYXBwZWRfXzp0LGUscix1LG8pO2lmKGwhPUd8fCFMZS5ub2RlQ2xhc3MmJihmKG4pfHxmKHQpKSlyZXR1cm4gZmFsc2U7aWYobD0hTGUuYXJnc09iamVjdCYmZHQobik/b2U6bi5jb25zdHJ1Y3RvcixzPSFMZS5hcmdzT2JqZWN0JiZkdCh0KT9vZTp0LmNvbnN0cnVjdG9yLGwhPXMmJiEoanQobCkmJmwgaW5zdGFuY2VvZiBsJiZqdChzKSYmcyBpbnN0YW5jZW9mIHMpJiZcImNvbnN0cnVjdG9yXCJpbiBuJiZcImNvbnN0cnVjdG9yXCJpbiB0KXJldHVybiBmYWxzZX1mb3IobD0hdSx1fHwodT1pKCkpLG98fChvPWkoKSkscz11Lmxlbmd0aDtzLS07KWlmKHVbc109PW4pcmV0dXJuIG9bc109PXQ7XG52YXIgaD0wLGE9dHJ1ZTtpZih1LnB1c2gobiksby5wdXNoKHQpLHApe2lmKHM9bi5sZW5ndGgsaD10Lmxlbmd0aCwoYT1oPT1zKXx8cilmb3IoO2gtLTspaWYocD1zLGc9dFtoXSxyKWZvcig7cC0tJiYhKGE9YXQobltwXSxnLGUscix1LG8pKTspO2Vsc2UgaWYoIShhPWF0KG5baF0sZyxlLHIsdSxvKSkpYnJlYWt9ZWxzZSBucih0LGZ1bmN0aW9uKHQsaSxsKXtyZXR1cm4gd2UuY2FsbChsLGkpPyhoKyssYT13ZS5jYWxsKG4saSkmJmF0KG5baV0sdCxlLHIsdSxvKSk6dm9pZCAwfSksYSYmIXImJm5yKG4sZnVuY3Rpb24obix0LGUpe3JldHVybiB3ZS5jYWxsKGUsdCk/YT0tMTwtLWg6dm9pZCAwfSk7cmV0dXJuIHUucG9wKCksby5wb3AoKSxsJiYoYyh1KSxjKG8pKSxhfWZ1bmN0aW9uIGl0KG4sdCxlLHIsdSl7KHFlKHQpP0R0OnRyKSh0LGZ1bmN0aW9uKHQsbyl7dmFyIGEsaSxsPXQsZj1uW29dO2lmKHQmJigoaT1xZSh0KSl8fGVyKHQpKSl7Zm9yKGw9ci5sZW5ndGg7bC0tOylpZihhPXJbbF09PXQpe2Y9dVtsXTtcbmJyZWFrfWlmKCFhKXt2YXIgYztlJiYobD1lKGYsdCksYz10eXBlb2YgbCE9XCJ1bmRlZmluZWRcIikmJihmPWwpLGN8fChmPWk/cWUoZik/ZjpbXTplcihmKT9mOnt9KSxyLnB1c2godCksdS5wdXNoKGYpLGN8fGl0KGYsdCxlLHIsdSl9fWVsc2UgZSYmKGw9ZShmLHQpLHR5cGVvZiBsPT1cInVuZGVmaW5lZFwiJiYobD10KSksdHlwZW9mIGwhPVwidW5kZWZpbmVkXCImJihmPWwpO25bb109Zn0pfWZ1bmN0aW9uIGx0KG4sdCl7cmV0dXJuIG4rZGUoRmUoKSoodC1uKzEpKX1mdW5jdGlvbiBmdChlLHIsdSl7dmFyIGE9LTEsbD1odCgpLGY9ZT9lLmxlbmd0aDowLHM9W10sZz0hciYmZj49XyYmbD09PW4saD11fHxnP2koKTpzO2ZvcihnJiYoaD1vKGgpLGw9dCk7KythPGY7KXt2YXIgdj1lW2FdLHk9dT91KHYsYSxlKTp2OyhyPyFhfHxoW2gubGVuZ3RoLTFdIT09eTowPmwoaCx5KSkmJigodXx8ZykmJmgucHVzaCh5KSxzLnB1c2godikpfXJldHVybiBnPyhjKGguaykscChoKSk6dSYmYyhoKSxzfWZ1bmN0aW9uIGN0KG4pe3JldHVybiBmdW5jdGlvbih0LGUscil7dmFyIHU9e307XG5pZihlPXYuY3JlYXRlQ2FsbGJhY2soZSxyLDMpLHFlKHQpKXtyPS0xO2Zvcih2YXIgbz10Lmxlbmd0aDsrK3I8bzspe3ZhciBhPXRbcl07bih1LGEsZShhLHIsdCksdCl9fWVsc2UgWGUodCxmdW5jdGlvbih0LHIsbyl7bih1LHQsZSh0LHIsbyksbyl9KTtyZXR1cm4gdX19ZnVuY3Rpb24gcHQobix0LGUscix1LG8pe3ZhciBhPTEmdCxpPTQmdCxsPTE2JnQsZj0zMiZ0O2lmKCEoMiZ0fHxqdChuKSkpdGhyb3cgbmV3IGxlO2wmJiFlLmxlbmd0aCYmKHQmPS0xNyxsPWU9ZmFsc2UpLGYmJiFyLmxlbmd0aCYmKHQmPS0zMyxmPXI9ZmFsc2UpO3ZhciBjPW4mJm4uX19iaW5kRGF0YV9fO3JldHVybiBjJiZ0cnVlIT09Yz8oYz1zKGMpLGNbMl0mJihjWzJdPXMoY1syXSkpLGNbM10mJihjWzNdPXMoY1szXSkpLCFhfHwxJmNbMV18fChjWzRdPXUpLCFhJiYxJmNbMV0mJih0fD04KSwhaXx8NCZjWzFdfHwoY1s1XT1vKSxsJiZqZS5hcHBseShjWzJdfHwoY1syXT1bXSksZSksZiYmRWUuYXBwbHkoY1szXXx8KGNbM109W10pLHIpLGNbMV18PXQscHQuYXBwbHkobnVsbCxjKSk6KDE9PXR8fDE3PT09dD93OmV0KShbbix0LGUscix1LG9dKVxufWZ1bmN0aW9uIHN0KCl7US5oPUYsUS5iPVEuYz1RLmc9US5pPVwiXCIsUS5lPVwidFwiLFEuaj10cnVlO2Zvcih2YXIgbix0PTA7bj1hcmd1bWVudHNbdF07dCsrKWZvcih2YXIgZSBpbiBuKVFbZV09bltlXTt0PVEuYSxRLmQ9L15bXixdKy8uZXhlYyh0KVswXSxuPWVlLHQ9XCJyZXR1cm4gZnVuY3Rpb24oXCIrdCtcIil7XCIsZT1RO3ZhciByPVwidmFyIG4sdD1cIitlLmQrXCIsRT1cIitlLmUrXCI7aWYoIXQpcmV0dXJuIEU7XCIrZS5pK1wiO1wiO2UuYj8ocis9XCJ2YXIgdT10Lmxlbmd0aDtuPS0xO2lmKFwiK2UuYitcIil7XCIsTGUudW5pbmRleGVkQ2hhcnMmJihyKz1cImlmKHModCkpe3Q9dC5zcGxpdCgnJyl9XCIpLHIrPVwid2hpbGUoKytuPHUpe1wiK2UuZytcIjt9fWVsc2V7XCIpOkxlLm5vbkVudW1BcmdzJiYocis9XCJ2YXIgdT10Lmxlbmd0aDtuPS0xO2lmKHUmJnAodCkpe3doaWxlKCsrbjx1KXtuKz0nJztcIitlLmcrXCI7fX1lbHNle1wiKSxMZS5lbnVtUHJvdG90eXBlcyYmKHIrPVwidmFyIEc9dHlwZW9mIHQ9PSdmdW5jdGlvbic7XCIpLExlLmVudW1FcnJvclByb3BzJiYocis9XCJ2YXIgRj10PT09a3x8dCBpbnN0YW5jZW9mIEVycm9yO1wiKTtcbnZhciB1PVtdO2lmKExlLmVudW1Qcm90b3R5cGVzJiZ1LnB1c2goJyEoRyYmbj09XCJwcm90b3R5cGVcIiknKSxMZS5lbnVtRXJyb3JQcm9wcyYmdS5wdXNoKCchKEYmJihuPT1cIm1lc3NhZ2VcInx8bj09XCJuYW1lXCIpKScpLGUuaiYmZS5mKXIrPVwidmFyIEM9LTEsRD1CW3R5cGVvZiB0XSYmdih0KSx1PUQ/RC5sZW5ndGg6MDt3aGlsZSgrK0M8dSl7bj1EW0NdO1wiLHUubGVuZ3RoJiYocis9XCJpZihcIit1LmpvaW4oXCImJlwiKStcIil7XCIpLHIrPWUuZytcIjtcIix1Lmxlbmd0aCYmKHIrPVwifVwiKSxyKz1cIn1cIjtlbHNlIGlmKHIrPVwiZm9yKG4gaW4gdCl7XCIsZS5qJiZ1LnB1c2goXCJtLmNhbGwodCwgbilcIiksdS5sZW5ndGgmJihyKz1cImlmKFwiK3Uuam9pbihcIiYmXCIpK1wiKXtcIikscis9ZS5nK1wiO1wiLHUubGVuZ3RoJiYocis9XCJ9XCIpLHIrPVwifVwiLExlLm5vbkVudW1TaGFkb3dzKXtmb3Iocis9XCJpZih0IT09QSl7dmFyIGk9dC5jb25zdHJ1Y3RvcixyPXQ9PT0oaSYmaS5wcm90b3R5cGUpLGY9dD09PUo/STp0PT09az9qOkwuY2FsbCh0KSx4PXlbZl07XCIsaz0wOzc+aztrKyspcis9XCJuPSdcIitlLmhba10rXCInO2lmKCghKHImJnhbbl0pJiZtLmNhbGwodCxuKSlcIixlLmp8fChyKz1cInx8KCF4W25dJiZ0W25dIT09QVtuXSlcIikscis9XCIpe1wiK2UuZytcIn1cIjtcbnIrPVwifVwifXJldHVybihlLmJ8fExlLm5vbkVudW1BcmdzKSYmKHIrPVwifVwiKSxyKz1lLmMrXCI7cmV0dXJuIEVcIixuKFwiZCxqLGssbSxvLHAscSxzLHYsQSxCLHksSSxKLExcIix0K3IrXCJ9XCIpKHR0LHEsY2Usd2UsZCxkdCxxZSxrdCxRLmYscGUsWCwkZSxNLHNlLGhlKX1mdW5jdGlvbiBndChuKXtyZXR1cm4gVmVbbl19ZnVuY3Rpb24gaHQoKXt2YXIgdD0odD12LmluZGV4T2YpPT09enQ/bjp0O3JldHVybiB0fWZ1bmN0aW9uIHZ0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJmdW5jdGlvblwiJiZ2ZS50ZXN0KG4pfWZ1bmN0aW9uIHl0KG4pe3ZhciB0LGU7cmV0dXJuIW58fGhlLmNhbGwobikhPUd8fCh0PW4uY29uc3RydWN0b3IsanQodCkmJiEodCBpbnN0YW5jZW9mIHQpKXx8IUxlLmFyZ3NDbGFzcyYmZHQobil8fCFMZS5ub2RlQ2xhc3MmJmYobik/ZmFsc2U6TGUub3duTGFzdD8obnIobixmdW5jdGlvbihuLHQscil7cmV0dXJuIGU9d2UuY2FsbChyLHQpLGZhbHNlfSksZmFsc2UhPT1lKToobnIobixmdW5jdGlvbihuLHQpe2U9dFxufSksdHlwZW9mIGU9PVwidW5kZWZpbmVkXCJ8fHdlLmNhbGwobixlKSl9ZnVuY3Rpb24gbXQobil7cmV0dXJuIEhlW25dfWZ1bmN0aW9uIGR0KG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiJiZoZS5jYWxsKG4pPT1UfHxmYWxzZX1mdW5jdGlvbiBidChuLHQsZSl7dmFyIHI9V2UobiksdT1yLmxlbmd0aDtmb3IodD10dCh0LGUsMyk7dS0tJiYoZT1yW3VdLGZhbHNlIT09dChuW2VdLGUsbikpOyk7cmV0dXJuIG59ZnVuY3Rpb24gX3Qobil7dmFyIHQ9W107cmV0dXJuIG5yKG4sZnVuY3Rpb24obixlKXtqdChuKSYmdC5wdXNoKGUpfSksdC5zb3J0KCl9ZnVuY3Rpb24gd3Qobil7Zm9yKHZhciB0PS0xLGU9V2Uobikscj1lLmxlbmd0aCx1PXt9OysrdDxyOyl7dmFyIG89ZVt0XTt1W25bb11dPW99cmV0dXJuIHV9ZnVuY3Rpb24ganQobil7cmV0dXJuIHR5cGVvZiBuPT1cImZ1bmN0aW9uXCJ9ZnVuY3Rpb24geHQobil7cmV0dXJuISghbnx8IVhbdHlwZW9mIG5dKVxufWZ1bmN0aW9uIEN0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJudW1iZXJcInx8biYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PVd8fGZhbHNlfWZ1bmN0aW9uIGt0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJzdHJpbmdcInx8biYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PU18fGZhbHNlfWZ1bmN0aW9uIEV0KG4pe2Zvcih2YXIgdD0tMSxlPVdlKG4pLHI9ZS5sZW5ndGgsdT1adChyKTsrK3Q8cjspdVt0XT1uW2VbdF1dO3JldHVybiB1fWZ1bmN0aW9uIE90KG4sdCxlKXt2YXIgcj0tMSx1PWh0KCksbz1uP24ubGVuZ3RoOjAsYT1mYWxzZTtyZXR1cm4gZT0oMD5lP0JlKDAsbytlKTplKXx8MCxxZShuKT9hPS0xPHUobix0LGUpOnR5cGVvZiBvPT1cIm51bWJlclwiP2E9LTE8KGt0KG4pP24uaW5kZXhPZih0LGUpOnUobix0LGUpKTpYZShuLGZ1bmN0aW9uKG4pe3JldHVybisrcjxlP3ZvaWQgMDohKGE9bj09PXQpfSksYX1mdW5jdGlvbiBTdChuLHQsZSl7dmFyIHI9dHJ1ZTtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHFlKG4pKXtlPS0xO1xuZm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1JiYocj0hIXQobltlXSxlLG4pKTspO31lbHNlIFhlKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiByPSEhdChuLGUsdSl9KTtyZXR1cm4gcn1mdW5jdGlvbiBBdChuLHQsZSl7dmFyIHI9W107aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxxZShuKSl7ZT0tMTtmb3IodmFyIHU9bi5sZW5ndGg7KytlPHU7KXt2YXIgbz1uW2VdO3QobyxlLG4pJiZyLnB1c2gobyl9fWVsc2UgWGUobixmdW5jdGlvbihuLGUsdSl7dChuLGUsdSkmJnIucHVzaChuKX0pO3JldHVybiByfWZ1bmN0aW9uIEl0KG4sdCxlKXtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLCFxZShuKSl7dmFyIHI7cmV0dXJuIFhlKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiB0KG4sZSx1KT8ocj1uLGZhbHNlKTp2b2lkIDB9KSxyfWU9LTE7Zm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1Oyl7dmFyIG89bltlXTtpZih0KG8sZSxuKSlyZXR1cm4gb319ZnVuY3Rpb24gRHQobix0LGUpe2lmKHQmJnR5cGVvZiBlPT1cInVuZGVmaW5lZFwiJiZxZShuKSl7ZT0tMTtcbmZvcih2YXIgcj1uLmxlbmd0aDsrK2U8ciYmZmFsc2UhPT10KG5bZV0sZSxuKTspO31lbHNlIFhlKG4sdCxlKTtyZXR1cm4gbn1mdW5jdGlvbiBOdChuLHQsZSl7dmFyIHI9bix1PW4/bi5sZW5ndGg6MDtpZih0PXQmJnR5cGVvZiBlPT1cInVuZGVmaW5lZFwiP3Q6dHQodCxlLDMpLHFlKG4pKWZvcig7dS0tJiZmYWxzZSE9PXQoblt1XSx1LG4pOyk7ZWxzZXtpZih0eXBlb2YgdSE9XCJudW1iZXJcIil2YXIgbz1XZShuKSx1PW8ubGVuZ3RoO2Vsc2UgTGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pJiYocj1uLnNwbGl0KFwiXCIpKTtYZShuLGZ1bmN0aW9uKG4sZSxhKXtyZXR1cm4gZT1vP29bLS11XTotLXUsdChyW2VdLGUsYSl9KX1yZXR1cm4gbn1mdW5jdGlvbiBCdChuLHQsZSl7dmFyIHI9LTEsdT1uP24ubGVuZ3RoOjAsbz1adCh0eXBlb2YgdT09XCJudW1iZXJcIj91OjApO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykscWUobikpZm9yKDsrK3I8dTspb1tyXT10KG5bcl0scixuKTtlbHNlIFhlKG4sZnVuY3Rpb24obixlLHUpe29bKytyXT10KG4sZSx1KVxufSk7cmV0dXJuIG99ZnVuY3Rpb24gUHQobix0LGUpe3ZhciB1PS0xLzAsbz11O2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCImJmUmJmVbdF09PT1uJiYodD1udWxsKSxudWxsPT10JiZxZShuKSl7ZT0tMTtmb3IodmFyIGE9bi5sZW5ndGg7KytlPGE7KXt2YXIgaT1uW2VdO2k+byYmKG89aSl9fWVsc2UgdD1udWxsPT10JiZrdChuKT9yOnYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLFhlKG4sZnVuY3Rpb24obixlLHIpe2U9dChuLGUsciksZT51JiYodT1lLG89bil9KTtyZXR1cm4gb31mdW5jdGlvbiBSdChuLHQsZSxyKXt2YXIgdT0zPmFyZ3VtZW50cy5sZW5ndGg7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsciw0KSxxZShuKSl7dmFyIG89LTEsYT1uLmxlbmd0aDtmb3IodSYmKGU9blsrK29dKTsrK288YTspZT10KGUsbltvXSxvLG4pfWVsc2UgWGUobixmdW5jdGlvbihuLHIsbyl7ZT11Pyh1PWZhbHNlLG4pOnQoZSxuLHIsbyl9KTtyZXR1cm4gZX1mdW5jdGlvbiBGdChuLHQsZSxyKXt2YXIgdT0zPmFyZ3VtZW50cy5sZW5ndGg7XG5yZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsciw0KSxOdChuLGZ1bmN0aW9uKG4scixvKXtlPXU/KHU9ZmFsc2Usbik6dChlLG4scixvKX0pLGV9ZnVuY3Rpb24gVHQobil7dmFyIHQ9LTEsZT1uP24ubGVuZ3RoOjAscj1adCh0eXBlb2YgZT09XCJudW1iZXJcIj9lOjApO3JldHVybiBEdChuLGZ1bmN0aW9uKG4pe3ZhciBlPWx0KDAsKyt0KTtyW3RdPXJbZV0scltlXT1ufSkscn1mdW5jdGlvbiAkdChuLHQsZSl7dmFyIHI7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxxZShuKSl7ZT0tMTtmb3IodmFyIHU9bi5sZW5ndGg7KytlPHUmJiEocj10KG5bZV0sZSxuKSk7KTt9ZWxzZSBYZShuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4hKHI9dChuLGUsdSkpfSk7cmV0dXJuISFyfWZ1bmN0aW9uIEx0KG4sdCxlKXt2YXIgcj0wLHU9bj9uLmxlbmd0aDowO2lmKHR5cGVvZiB0IT1cIm51bWJlclwiJiZudWxsIT10KXt2YXIgbz0tMTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK288dSYmdChuW29dLG8sbik7KXIrK1xufWVsc2UgaWYocj10LG51bGw9PXJ8fGUpcmV0dXJuIG4/blswXTpoO3JldHVybiBzKG4sMCxQZShCZSgwLHIpLHUpKX1mdW5jdGlvbiB6dCh0LGUscil7aWYodHlwZW9mIHI9PVwibnVtYmVyXCIpe3ZhciB1PXQ/dC5sZW5ndGg6MDtyPTA+cj9CZSgwLHUrcik6cnx8MH1lbHNlIGlmKHIpcmV0dXJuIHI9S3QodCxlKSx0W3JdPT09ZT9yOi0xO3JldHVybiBuKHQsZSxyKX1mdW5jdGlvbiBxdChuLHQsZSl7aWYodHlwZW9mIHQhPVwibnVtYmVyXCImJm51bGwhPXQpe3ZhciByPTAsdT0tMSxvPW4/bi5sZW5ndGg6MDtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK3U8byYmdChuW3VdLHUsbik7KXIrK31lbHNlIHI9bnVsbD09dHx8ZT8xOkJlKDAsdCk7cmV0dXJuIHMobixyKX1mdW5jdGlvbiBLdChuLHQsZSxyKXt2YXIgdT0wLG89bj9uLmxlbmd0aDp1O2ZvcihlPWU/di5jcmVhdGVDYWxsYmFjayhlLHIsMSk6SHQsdD1lKHQpO3U8bzspcj11K28+Pj4xLGUobltyXSk8dD91PXIrMTpvPXI7XG5yZXR1cm4gdX1mdW5jdGlvbiBXdChuLHQsZSxyKXtyZXR1cm4gdHlwZW9mIHQhPVwiYm9vbGVhblwiJiZudWxsIT10JiYocj1lLGU9dHlwZW9mIHQhPVwiZnVuY3Rpb25cIiYmciYmclt0XT09PW4/bnVsbDp0LHQ9ZmFsc2UpLG51bGwhPWUmJihlPXYuY3JlYXRlQ2FsbGJhY2soZSxyLDMpKSxmdChuLHQsZSl9ZnVuY3Rpb24gR3QoKXtmb3IodmFyIG49MTxhcmd1bWVudHMubGVuZ3RoP2FyZ3VtZW50czphcmd1bWVudHNbMF0sdD0tMSxlPW4/UHQoYXIobixcImxlbmd0aFwiKSk6MCxyPVp0KDA+ZT8wOmUpOysrdDxlOylyW3RdPWFyKG4sdCk7cmV0dXJuIHJ9ZnVuY3Rpb24gSnQobix0KXt2YXIgZT0tMSxyPW4/bi5sZW5ndGg6MCx1PXt9O2Zvcih0fHwhcnx8cWUoblswXSl8fCh0PVtdKTsrK2U8cjspe3ZhciBvPW5bZV07dD91W29dPXRbZV06byYmKHVbb1swXV09b1sxXSl9cmV0dXJuIHV9ZnVuY3Rpb24gTXQobix0KXtyZXR1cm4gMjxhcmd1bWVudHMubGVuZ3RoP3B0KG4sMTcscyhhcmd1bWVudHMsMiksbnVsbCx0KTpwdChuLDEsbnVsbCxudWxsLHQpXG59ZnVuY3Rpb24gVnQobix0LGUpe3ZhciByLHUsbyxhLGksbCxmLGM9MCxwPWZhbHNlLHM9dHJ1ZTtpZighanQobikpdGhyb3cgbmV3IGxlO2lmKHQ9QmUoMCx0KXx8MCx0cnVlPT09ZSl2YXIgZz10cnVlLHM9ZmFsc2U7ZWxzZSB4dChlKSYmKGc9ZS5sZWFkaW5nLHA9XCJtYXhXYWl0XCJpbiBlJiYoQmUodCxlLm1heFdhaXQpfHwwKSxzPVwidHJhaWxpbmdcImluIGU/ZS50cmFpbGluZzpzKTt2YXIgdj1mdW5jdGlvbigpe3ZhciBlPXQtKGlyKCktYSk7MDxlP2w9Q2UodixlKToodSYmbWUodSksZT1mLHU9bD1mPWgsZSYmKGM9aXIoKSxvPW4uYXBwbHkoaSxyKSxsfHx1fHwocj1pPW51bGwpKSl9LHk9ZnVuY3Rpb24oKXtsJiZtZShsKSx1PWw9Zj1oLChzfHxwIT09dCkmJihjPWlyKCksbz1uLmFwcGx5KGksciksbHx8dXx8KHI9aT1udWxsKSl9O3JldHVybiBmdW5jdGlvbigpe2lmKHI9YXJndW1lbnRzLGE9aXIoKSxpPXRoaXMsZj1zJiYobHx8IWcpLGZhbHNlPT09cCl2YXIgZT1nJiYhbDtlbHNle3V8fGd8fChjPWEpO1xudmFyIGg9cC0oYS1jKSxtPTA+PWg7bT8odSYmKHU9bWUodSkpLGM9YSxvPW4uYXBwbHkoaSxyKSk6dXx8KHU9Q2UoeSxoKSl9cmV0dXJuIG0mJmw/bD1tZShsKTpsfHx0PT09cHx8KGw9Q2Uodix0KSksZSYmKG09dHJ1ZSxvPW4uYXBwbHkoaSxyKSksIW18fGx8fHV8fChyPWk9bnVsbCksb319ZnVuY3Rpb24gSHQobil7cmV0dXJuIG59ZnVuY3Rpb24gVXQobix0LGUpe3ZhciByPXRydWUsdT10JiZfdCh0KTt0JiYoZXx8dS5sZW5ndGgpfHwobnVsbD09ZSYmKGU9dCksbz15LHQ9bixuPXYsdT1fdCh0KSksZmFsc2U9PT1lP3I9ZmFsc2U6eHQoZSkmJlwiY2hhaW5cImluIGUmJihyPWUuY2hhaW4pO3ZhciBvPW4sYT1qdChvKTtEdCh1LGZ1bmN0aW9uKGUpe3ZhciB1PW5bZV09dFtlXTthJiYoby5wcm90b3R5cGVbZV09ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9fY2hhaW5fXyxlPXRoaXMuX193cmFwcGVkX18sYT1bZV07aWYoamUuYXBwbHkoYSxhcmd1bWVudHMpLGE9dS5hcHBseShuLGEpLHJ8fHQpe2lmKGU9PT1hJiZ4dChhKSlyZXR1cm4gdGhpcztcbmE9bmV3IG8oYSksYS5fX2NoYWluX189dH1yZXR1cm4gYX0pfSl9ZnVuY3Rpb24gUXQoKXt9ZnVuY3Rpb24gWHQobil7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0W25dfX1mdW5jdGlvbiBZdCgpe3JldHVybiB0aGlzLl9fd3JhcHBlZF9ffWU9ZT91dC5kZWZhdWx0cyhaLk9iamVjdCgpLGUsdXQucGljayhaLFIpKTpaO3ZhciBadD1lLkFycmF5LG5lPWUuQm9vbGVhbix0ZT1lLkRhdGUsZWU9ZS5GdW5jdGlvbixyZT1lLk1hdGgsdWU9ZS5OdW1iZXIsb2U9ZS5PYmplY3QsYWU9ZS5SZWdFeHAsaWU9ZS5TdHJpbmcsbGU9ZS5UeXBlRXJyb3IsZmU9W10sY2U9ZS5FcnJvci5wcm90b3R5cGUscGU9b2UucHJvdG90eXBlLHNlPWllLnByb3RvdHlwZSxnZT1lLl8saGU9cGUudG9TdHJpbmcsdmU9YWUoXCJeXCIraWUoaGUpLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLFwiXFxcXCQmXCIpLnJlcGxhY2UoL3RvU3RyaW5nfCBmb3IgW15cXF1dKy9nLFwiLio/XCIpK1wiJFwiKSx5ZT1yZS5jZWlsLG1lPWUuY2xlYXJUaW1lb3V0LGRlPXJlLmZsb29yLGJlPWVlLnByb3RvdHlwZS50b1N0cmluZyxfZT12dChfZT1vZS5nZXRQcm90b3R5cGVPZikmJl9lLHdlPXBlLmhhc093blByb3BlcnR5LGplPWZlLnB1c2gseGU9cGUucHJvcGVydHlJc0VudW1lcmFibGUsQ2U9ZS5zZXRUaW1lb3V0LGtlPWZlLnNwbGljZSxFZT1mZS51bnNoaWZ0LE9lPWZ1bmN0aW9uKCl7dHJ5e3ZhciBuPXt9LHQ9dnQodD1vZS5kZWZpbmVQcm9wZXJ0eSkmJnQsZT10KG4sbixuKSYmdFxufWNhdGNoKHIpe31yZXR1cm4gZX0oKSxTZT12dChTZT1vZS5jcmVhdGUpJiZTZSxBZT12dChBZT1adC5pc0FycmF5KSYmQWUsSWU9ZS5pc0Zpbml0ZSxEZT1lLmlzTmFOLE5lPXZ0KE5lPW9lLmtleXMpJiZOZSxCZT1yZS5tYXgsUGU9cmUubWluLFJlPWUucGFyc2VJbnQsRmU9cmUucmFuZG9tLFRlPXt9O1RlWyRdPVp0LFRlW0xdPW5lLFRlW3pdPXRlLFRlW0tdPWVlLFRlW0ddPW9lLFRlW1ddPXVlLFRlW0pdPWFlLFRlW01dPWllO3ZhciAkZT17fTskZVskXT0kZVt6XT0kZVtXXT17Y29uc3RydWN0b3I6dHJ1ZSx0b0xvY2FsZVN0cmluZzp0cnVlLHRvU3RyaW5nOnRydWUsdmFsdWVPZjp0cnVlfSwkZVtMXT0kZVtNXT17Y29uc3RydWN0b3I6dHJ1ZSx0b1N0cmluZzp0cnVlLHZhbHVlT2Y6dHJ1ZX0sJGVbcV09JGVbS109JGVbSl09e2NvbnN0cnVjdG9yOnRydWUsdG9TdHJpbmc6dHJ1ZX0sJGVbR109e2NvbnN0cnVjdG9yOnRydWV9LGZ1bmN0aW9uKCl7Zm9yKHZhciBuPUYubGVuZ3RoO24tLTspe3ZhciB0LGU9RltuXTtcbmZvcih0IGluICRlKXdlLmNhbGwoJGUsdCkmJiF3ZS5jYWxsKCRlW3RdLGUpJiYoJGVbdF1bZV09ZmFsc2UpfX0oKSx5LnByb3RvdHlwZT12LnByb3RvdHlwZTt2YXIgTGU9di5zdXBwb3J0PXt9OyFmdW5jdGlvbigpe3ZhciBuPWZ1bmN0aW9uKCl7dGhpcy54PTF9LHQ9ezA6MSxsZW5ndGg6MX0scj1bXTtuLnByb3RvdHlwZT17dmFsdWVPZjoxLHk6MX07Zm9yKHZhciB1IGluIG5ldyBuKXIucHVzaCh1KTtmb3IodSBpbiBhcmd1bWVudHMpO0xlLmFyZ3NDbGFzcz1oZS5jYWxsKGFyZ3VtZW50cyk9PVQsTGUuYXJnc09iamVjdD1hcmd1bWVudHMuY29uc3RydWN0b3I9PW9lJiYhKGFyZ3VtZW50cyBpbnN0YW5jZW9mIFp0KSxMZS5lbnVtRXJyb3JQcm9wcz14ZS5jYWxsKGNlLFwibWVzc2FnZVwiKXx8eGUuY2FsbChjZSxcIm5hbWVcIiksTGUuZW51bVByb3RvdHlwZXM9eGUuY2FsbChuLFwicHJvdG90eXBlXCIpLExlLmZ1bmNEZWNvbXA9IXZ0KGUuV2luUlRFcnJvcikmJkIudGVzdChnKSxMZS5mdW5jTmFtZXM9dHlwZW9mIGVlLm5hbWU9PVwic3RyaW5nXCIsTGUubm9uRW51bUFyZ3M9MCE9dSxMZS5ub25FbnVtU2hhZG93cz0hL3ZhbHVlT2YvLnRlc3QociksTGUub3duTGFzdD1cInhcIiE9clswXSxMZS5zcGxpY2VPYmplY3RzPShmZS5zcGxpY2UuY2FsbCh0LDAsMSksIXRbMF0pLExlLnVuaW5kZXhlZENoYXJzPVwieHhcIiE9XCJ4XCJbMF0rb2UoXCJ4XCIpWzBdO1xudHJ5e0xlLm5vZGVDbGFzcz0hKGhlLmNhbGwoZG9jdW1lbnQpPT1HJiYhKHt0b1N0cmluZzowfStcIlwiKSl9Y2F0Y2gobyl7TGUubm9kZUNsYXNzPXRydWV9fSgxKSx2LnRlbXBsYXRlU2V0dGluZ3M9e2VzY2FwZTovPCUtKFtcXHNcXFNdKz8pJT4vZyxldmFsdWF0ZTovPCUoW1xcc1xcU10rPyklPi9nLGludGVycG9sYXRlOkksdmFyaWFibGU6XCJcIixpbXBvcnRzOntfOnZ9fSxTZXx8KG50PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe31yZXR1cm4gZnVuY3Rpb24odCl7aWYoeHQodCkpe24ucHJvdG90eXBlPXQ7dmFyIHI9bmV3IG47bi5wcm90b3R5cGU9bnVsbH1yZXR1cm4gcnx8ZS5PYmplY3QoKX19KCkpO3ZhciB6ZT1PZT9mdW5jdGlvbihuLHQpe1UudmFsdWU9dCxPZShuLFwiX19iaW5kRGF0YV9fXCIsVSl9OlF0O0xlLmFyZ3NDbGFzc3x8KGR0PWZ1bmN0aW9uKG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiJiZ3ZS5jYWxsKG4sXCJjYWxsZWVcIikmJiF4ZS5jYWxsKG4sXCJjYWxsZWVcIil8fGZhbHNlXG59KTt2YXIgcWU9QWV8fGZ1bmN0aW9uKG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiJiZoZS5jYWxsKG4pPT0kfHxmYWxzZX0sS2U9c3Qoe2E6XCJ6XCIsZTpcIltdXCIsaTpcImlmKCEoQlt0eXBlb2Ygel0pKXJldHVybiBFXCIsZzpcIkUucHVzaChuKVwifSksV2U9TmU/ZnVuY3Rpb24obil7cmV0dXJuIHh0KG4pP0xlLmVudW1Qcm90b3R5cGVzJiZ0eXBlb2Ygbj09XCJmdW5jdGlvblwifHxMZS5ub25FbnVtQXJncyYmbi5sZW5ndGgmJmR0KG4pP0tlKG4pOk5lKG4pOltdfTpLZSxHZT17YTpcImcsZSxLXCIsaTpcImU9ZSYmdHlwZW9mIEs9PSd1bmRlZmluZWQnP2U6ZChlLEssMylcIixiOlwidHlwZW9mIHU9PSdudW1iZXInXCIsdjpXZSxnOlwiaWYoZSh0W25dLG4sZyk9PT1mYWxzZSlyZXR1cm4gRVwifSxKZT17YTpcInosSCxsXCIsaTpcInZhciBhPWFyZ3VtZW50cyxiPTAsYz10eXBlb2YgbD09J251bWJlcic/MjphLmxlbmd0aDt3aGlsZSgrK2I8Yyl7dD1hW2JdO2lmKHQmJkJbdHlwZW9mIHRdKXtcIix2OldlLGc6XCJpZih0eXBlb2YgRVtuXT09J3VuZGVmaW5lZCcpRVtuXT10W25dXCIsYzpcIn19XCJ9LE1lPXtpOlwiaWYoIUJbdHlwZW9mIHRdKXJldHVybiBFO1wiK0dlLmksYjpmYWxzZX0sVmU9e1wiJlwiOlwiJmFtcDtcIixcIjxcIjpcIiZsdDtcIixcIj5cIjpcIiZndDtcIiwnXCInOlwiJnF1b3Q7XCIsXCInXCI6XCImIzM5O1wifSxIZT13dChWZSksVWU9YWUoXCIoXCIrV2UoSGUpLmpvaW4oXCJ8XCIpK1wiKVwiLFwiZ1wiKSxRZT1hZShcIltcIitXZShWZSkuam9pbihcIlwiKStcIl1cIixcImdcIiksWGU9c3QoR2UpLFllPXN0KEplLHtpOkplLmkucmVwbGFjZShcIjtcIixcIjtpZihjPjMmJnR5cGVvZiBhW2MtMl09PSdmdW5jdGlvbicpe3ZhciBlPWQoYVstLWMtMV0sYVtjLS1dLDIpfWVsc2UgaWYoYz4yJiZ0eXBlb2YgYVtjLTFdPT0nZnVuY3Rpb24nKXtlPWFbLS1jXX1cIiksZzpcIkVbbl09ZT9lKEVbbl0sdFtuXSk6dFtuXVwifSksWmU9c3QoSmUpLG5yPXN0KEdlLE1lLHtqOmZhbHNlfSksdHI9c3QoR2UsTWUpO1xuanQoL3gvKSYmKGp0PWZ1bmN0aW9uKG4pe3JldHVybiB0eXBlb2Ygbj09XCJmdW5jdGlvblwiJiZoZS5jYWxsKG4pPT1LfSk7dmFyIGVyPV9lP2Z1bmN0aW9uKG4pe2lmKCFufHxoZS5jYWxsKG4pIT1HfHwhTGUuYXJnc0NsYXNzJiZkdChuKSlyZXR1cm4gZmFsc2U7dmFyIHQ9bi52YWx1ZU9mLGU9dnQodCkmJihlPV9lKHQpKSYmX2UoZSk7cmV0dXJuIGU/bj09ZXx8X2Uobik9PWU6eXQobil9Onl0LHJyPWN0KGZ1bmN0aW9uKG4sdCxlKXt3ZS5jYWxsKG4sZSk/bltlXSsrOm5bZV09MX0pLHVyPWN0KGZ1bmN0aW9uKG4sdCxlKXsod2UuY2FsbChuLGUpP25bZV06bltlXT1bXSkucHVzaCh0KX0pLG9yPWN0KGZ1bmN0aW9uKG4sdCxlKXtuW2VdPXR9KSxhcj1CdCxpcj12dChpcj10ZS5ub3cpJiZpcnx8ZnVuY3Rpb24oKXtyZXR1cm4obmV3IHRlKS5nZXRUaW1lKCl9LGxyPTg9PVJlKGorXCIwOFwiKT9SZTpmdW5jdGlvbihuLHQpe3JldHVybiBSZShrdChuKT9uLnJlcGxhY2UoRCxcIlwiKTpuLHR8fDApfTtcbnJldHVybiB2LmFmdGVyPWZ1bmN0aW9uKG4sdCl7aWYoIWp0KHQpKXRocm93IG5ldyBsZTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gMT4tLW4/dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6dm9pZCAwfX0sdi5hc3NpZ249WWUsdi5hdD1mdW5jdGlvbihuKXt2YXIgdD1hcmd1bWVudHMsZT0tMSxyPW90KHQsdHJ1ZSxmYWxzZSwxKSx0PXRbMl0mJnRbMl1bdFsxXV09PT1uPzE6ci5sZW5ndGgsdT1adCh0KTtmb3IoTGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pJiYobj1uLnNwbGl0KFwiXCIpKTsrK2U8dDspdVtlXT1uW3JbZV1dO3JldHVybiB1fSx2LmJpbmQ9TXQsdi5iaW5kQWxsPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD0xPGFyZ3VtZW50cy5sZW5ndGg/b3QoYXJndW1lbnRzLHRydWUsZmFsc2UsMSk6X3QobiksZT0tMSxyPXQubGVuZ3RoOysrZTxyOyl7dmFyIHU9dFtlXTtuW3VdPXB0KG5bdV0sMSxudWxsLG51bGwsbil9cmV0dXJuIG59LHYuYmluZEtleT1mdW5jdGlvbihuLHQpe3JldHVybiAyPGFyZ3VtZW50cy5sZW5ndGg/cHQodCwxOSxzKGFyZ3VtZW50cywyKSxudWxsLG4pOnB0KHQsMyxudWxsLG51bGwsbilcbn0sdi5jaGFpbj1mdW5jdGlvbihuKXtyZXR1cm4gbj1uZXcgeShuKSxuLl9fY2hhaW5fXz10cnVlLG59LHYuY29tcGFjdD1mdW5jdGlvbihuKXtmb3IodmFyIHQ9LTEsZT1uP24ubGVuZ3RoOjAscj1bXTsrK3Q8ZTspe3ZhciB1PW5bdF07dSYmci5wdXNoKHUpfXJldHVybiByfSx2LmNvbXBvc2U9ZnVuY3Rpb24oKXtmb3IodmFyIG49YXJndW1lbnRzLHQ9bi5sZW5ndGg7dC0tOylpZighanQoblt0XSkpdGhyb3cgbmV3IGxlO3JldHVybiBmdW5jdGlvbigpe2Zvcih2YXIgdD1hcmd1bWVudHMsZT1uLmxlbmd0aDtlLS07KXQ9W25bZV0uYXBwbHkodGhpcyx0KV07cmV0dXJuIHRbMF19fSx2LmNvbnN0YW50PWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBufX0sdi5jb3VudEJ5PXJyLHYuY3JlYXRlPWZ1bmN0aW9uKG4sdCl7dmFyIGU9bnQobik7cmV0dXJuIHQ/WWUoZSx0KTplfSx2LmNyZWF0ZUNhbGxiYWNrPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj10eXBlb2YgbjtpZihudWxsPT1ufHxcImZ1bmN0aW9uXCI9PXIpcmV0dXJuIHR0KG4sdCxlKTtcbmlmKFwib2JqZWN0XCIhPXIpcmV0dXJuIFh0KG4pO3ZhciB1PVdlKG4pLG89dVswXSxhPW5bb107cmV0dXJuIDEhPXUubGVuZ3RofHxhIT09YXx8eHQoYSk/ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXUubGVuZ3RoLHI9ZmFsc2U7ZS0tJiYocj1hdCh0W3VbZV1dLG5bdVtlXV0sbnVsbCx0cnVlKSk7KTtyZXR1cm4gcn06ZnVuY3Rpb24obil7cmV0dXJuIG49bltvXSxhPT09biYmKDAhPT1hfHwxL2E9PTEvbil9fSx2LmN1cnJ5PWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHQ9dHlwZW9mIHQ9PVwibnVtYmVyXCI/dDordHx8bi5sZW5ndGgscHQobiw0LG51bGwsbnVsbCxudWxsLHQpfSx2LmRlYm91bmNlPVZ0LHYuZGVmYXVsdHM9WmUsdi5kZWZlcj1mdW5jdGlvbihuKXtpZighanQobikpdGhyb3cgbmV3IGxlO3ZhciB0PXMoYXJndW1lbnRzLDEpO3JldHVybiBDZShmdW5jdGlvbigpe24uYXBwbHkoaCx0KX0sMSl9LHYuZGVsYXk9ZnVuY3Rpb24obix0KXtpZighanQobikpdGhyb3cgbmV3IGxlO3ZhciBlPXMoYXJndW1lbnRzLDIpO1xucmV0dXJuIENlKGZ1bmN0aW9uKCl7bi5hcHBseShoLGUpfSx0KX0sdi5kaWZmZXJlbmNlPWZ1bmN0aW9uKG4pe3JldHVybiBydChuLG90KGFyZ3VtZW50cyx0cnVlLHRydWUsMSkpfSx2LmZpbHRlcj1BdCx2LmZsYXR0ZW49ZnVuY3Rpb24obix0LGUscil7cmV0dXJuIHR5cGVvZiB0IT1cImJvb2xlYW5cIiYmbnVsbCE9dCYmKHI9ZSxlPXR5cGVvZiB0IT1cImZ1bmN0aW9uXCImJnImJnJbdF09PT1uP251bGw6dCx0PWZhbHNlKSxudWxsIT1lJiYobj1CdChuLGUscikpLG90KG4sdCl9LHYuZm9yRWFjaD1EdCx2LmZvckVhY2hSaWdodD1OdCx2LmZvckluPW5yLHYuZm9ySW5SaWdodD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9W107bnIobixmdW5jdGlvbihuLHQpe3IucHVzaCh0LG4pfSk7dmFyIHU9ci5sZW5ndGg7Zm9yKHQ9dHQodCxlLDMpO3UtLSYmZmFsc2UhPT10KHJbdS0tXSxyW3VdLG4pOyk7cmV0dXJuIG59LHYuZm9yT3duPXRyLHYuZm9yT3duUmlnaHQ9YnQsdi5mdW5jdGlvbnM9X3Qsdi5ncm91cEJ5PXVyLHYuaW5kZXhCeT1vcix2LmluaXRpYWw9ZnVuY3Rpb24obix0LGUpe3ZhciByPTAsdT1uP24ubGVuZ3RoOjA7XG5pZih0eXBlb2YgdCE9XCJudW1iZXJcIiYmbnVsbCE9dCl7dmFyIG89dTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTtvLS0mJnQobltvXSxvLG4pOylyKyt9ZWxzZSByPW51bGw9PXR8fGU/MTp0fHxyO3JldHVybiBzKG4sMCxQZShCZSgwLHUtciksdSkpfSx2LmludGVyc2VjdGlvbj1mdW5jdGlvbigpe2Zvcih2YXIgZT1bXSxyPS0xLHU9YXJndW1lbnRzLmxlbmd0aCxhPWkoKSxsPWh0KCksZj1sPT09bixzPWkoKTsrK3I8dTspe3ZhciBnPWFyZ3VtZW50c1tyXTsocWUoZyl8fGR0KGcpKSYmKGUucHVzaChnKSxhLnB1c2goZiYmZy5sZW5ndGg+PV8mJm8ocj9lW3JdOnMpKSl9dmFyIGY9ZVswXSxoPS0xLHY9Zj9mLmxlbmd0aDowLHk9W107bjpmb3IoOysraDx2Oyl7dmFyIG09YVswXSxnPWZbaF07aWYoMD4obT90KG0sZyk6bChzLGcpKSl7Zm9yKHI9dSwobXx8cykucHVzaChnKTstLXI7KWlmKG09YVtyXSwwPihtP3QobSxnKTpsKGVbcl0sZykpKWNvbnRpbnVlIG47eS5wdXNoKGcpXG59fWZvcig7dS0tOykobT1hW3VdKSYmcChtKTtyZXR1cm4gYyhhKSxjKHMpLHl9LHYuaW52ZXJ0PXd0LHYuaW52b2tlPWZ1bmN0aW9uKG4sdCl7dmFyIGU9cyhhcmd1bWVudHMsMikscj0tMSx1PXR5cGVvZiB0PT1cImZ1bmN0aW9uXCIsbz1uP24ubGVuZ3RoOjAsYT1adCh0eXBlb2Ygbz09XCJudW1iZXJcIj9vOjApO3JldHVybiBEdChuLGZ1bmN0aW9uKG4pe2FbKytyXT0odT90Om5bdF0pLmFwcGx5KG4sZSl9KSxhfSx2LmtleXM9V2Usdi5tYXA9QnQsdi5tYXBWYWx1ZXM9ZnVuY3Rpb24obix0LGUpe3ZhciByPXt9O3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHRyKG4sZnVuY3Rpb24obixlLHUpe3JbZV09dChuLGUsdSl9KSxyfSx2Lm1heD1QdCx2Lm1lbW9pemU9ZnVuY3Rpb24obix0KXtpZighanQobikpdGhyb3cgbmV3IGxlO3ZhciBlPWZ1bmN0aW9uKCl7dmFyIHI9ZS5jYWNoZSx1PXQ/dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6Yithcmd1bWVudHNbMF07cmV0dXJuIHdlLmNhbGwocix1KT9yW3VdOnJbdV09bi5hcHBseSh0aGlzLGFyZ3VtZW50cylcbn07cmV0dXJuIGUuY2FjaGU9e30sZX0sdi5tZXJnZT1mdW5jdGlvbihuKXt2YXIgdD1hcmd1bWVudHMsZT0yO2lmKCF4dChuKSlyZXR1cm4gbjtpZihcIm51bWJlclwiIT10eXBlb2YgdFsyXSYmKGU9dC5sZW5ndGgpLDM8ZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgdFtlLTJdKXZhciByPXR0KHRbLS1lLTFdLHRbZS0tXSwyKTtlbHNlIDI8ZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgdFtlLTFdJiYocj10Wy0tZV0pO2Zvcih2YXIgdD1zKGFyZ3VtZW50cywxLGUpLHU9LTEsbz1pKCksYT1pKCk7Kyt1PGU7KWl0KG4sdFt1XSxyLG8sYSk7cmV0dXJuIGMobyksYyhhKSxufSx2Lm1pbj1mdW5jdGlvbihuLHQsZSl7dmFyIHU9MS8wLG89dTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiJiZlJiZlW3RdPT09biYmKHQ9bnVsbCksbnVsbD09dCYmcWUobikpe2U9LTE7Zm9yKHZhciBhPW4ubGVuZ3RoOysrZTxhOyl7dmFyIGk9bltlXTtpPG8mJihvPWkpfX1lbHNlIHQ9bnVsbD09dCYma3Qobik/cjp2LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxYZShuLGZ1bmN0aW9uKG4sZSxyKXtlPXQobixlLHIpLGU8dSYmKHU9ZSxvPW4pXG59KTtyZXR1cm4gb30sdi5vbWl0PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj17fTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiKXt2YXIgdT1bXTtucihuLGZ1bmN0aW9uKG4sdCl7dS5wdXNoKHQpfSk7Zm9yKHZhciB1PXJ0KHUsb3QoYXJndW1lbnRzLHRydWUsZmFsc2UsMSkpLG89LTEsYT11Lmxlbmd0aDsrK288YTspe3ZhciBpPXVbb107cltpXT1uW2ldfX1lbHNlIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksbnIobixmdW5jdGlvbihuLGUsdSl7dChuLGUsdSl8fChyW2VdPW4pfSk7cmV0dXJuIHJ9LHYub25jZT1mdW5jdGlvbihuKXt2YXIgdCxlO2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQ/ZToodD10cnVlLGU9bi5hcHBseSh0aGlzLGFyZ3VtZW50cyksbj1udWxsLGUpfX0sdi5wYWlycz1mdW5jdGlvbihuKXtmb3IodmFyIHQ9LTEsZT1XZShuKSxyPWUubGVuZ3RoLHU9WnQocik7Kyt0PHI7KXt2YXIgbz1lW3RdO3VbdF09W28sbltvXV19cmV0dXJuIHVcbn0sdi5wYXJ0aWFsPWZ1bmN0aW9uKG4pe3JldHVybiBwdChuLDE2LHMoYXJndW1lbnRzLDEpKX0sdi5wYXJ0aWFsUmlnaHQ9ZnVuY3Rpb24obil7cmV0dXJuIHB0KG4sMzIsbnVsbCxzKGFyZ3VtZW50cywxKSl9LHYucGljaz1mdW5jdGlvbihuLHQsZSl7dmFyIHI9e307aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIilmb3IodmFyIHU9LTEsbz1vdChhcmd1bWVudHMsdHJ1ZSxmYWxzZSwxKSxhPXh0KG4pP28ubGVuZ3RoOjA7Kyt1PGE7KXt2YXIgaT1vW3VdO2kgaW4gbiYmKHJbaV09bltpXSl9ZWxzZSB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLG5yKG4sZnVuY3Rpb24obixlLHUpe3QobixlLHUpJiYocltlXT1uKX0pO3JldHVybiByfSx2LnBsdWNrPWFyLHYucHJvcGVydHk9WHQsdi5wdWxsPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD1hcmd1bWVudHMsZT0wLHI9dC5sZW5ndGgsdT1uP24ubGVuZ3RoOjA7KytlPHI7KWZvcih2YXIgbz0tMSxhPXRbZV07KytvPHU7KW5bb109PT1hJiYoa2UuY2FsbChuLG8tLSwxKSx1LS0pO1xucmV0dXJuIG59LHYucmFuZ2U9ZnVuY3Rpb24obix0LGUpe249K258fDAsZT10eXBlb2YgZT09XCJudW1iZXJcIj9lOitlfHwxLG51bGw9PXQmJih0PW4sbj0wKTt2YXIgcj0tMTt0PUJlKDAseWUoKHQtbikvKGV8fDEpKSk7Zm9yKHZhciB1PVp0KHQpOysrcjx0Oyl1W3JdPW4sbis9ZTtyZXR1cm4gdX0sdi5yZWplY3Q9ZnVuY3Rpb24obix0LGUpe3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLEF0KG4sZnVuY3Rpb24obixlLHIpe3JldHVybiF0KG4sZSxyKX0pfSx2LnJlbW92ZT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9LTEsdT1uP24ubGVuZ3RoOjAsbz1bXTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK3I8dTspZT1uW3JdLHQoZSxyLG4pJiYoby5wdXNoKGUpLGtlLmNhbGwobixyLS0sMSksdS0tKTtyZXR1cm4gb30sdi5yZXN0PXF0LHYuc2h1ZmZsZT1UdCx2LnNvcnRCeT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9LTEsbz1xZSh0KSxhPW4/bi5sZW5ndGg6MCxmPVp0KHR5cGVvZiBhPT1cIm51bWJlclwiP2E6MCk7XG5mb3Iob3x8KHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykpLER0KG4sZnVuY3Rpb24obixlLHUpe3ZhciBhPWZbKytyXT1sKCk7bz9hLm09QnQodCxmdW5jdGlvbih0KXtyZXR1cm4gblt0XX0pOihhLm09aSgpKVswXT10KG4sZSx1KSxhLm49cixhLm89bn0pLGE9Zi5sZW5ndGgsZi5zb3J0KHUpO2EtLTspbj1mW2FdLGZbYV09bi5vLG98fGMobi5tKSxwKG4pO3JldHVybiBmfSx2LnRhcD1mdW5jdGlvbihuLHQpe3JldHVybiB0KG4pLG59LHYudGhyb3R0bGU9ZnVuY3Rpb24obix0LGUpe3ZhciByPXRydWUsdT10cnVlO2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7cmV0dXJuIGZhbHNlPT09ZT9yPWZhbHNlOnh0KGUpJiYocj1cImxlYWRpbmdcImluIGU/ZS5sZWFkaW5nOnIsdT1cInRyYWlsaW5nXCJpbiBlP2UudHJhaWxpbmc6dSksSC5sZWFkaW5nPXIsSC5tYXhXYWl0PXQsSC50cmFpbGluZz11LFZ0KG4sdCxIKX0sdi50aW1lcz1mdW5jdGlvbihuLHQsZSl7bj0tMTwobj0rbik/bjowO3ZhciByPS0xLHU9WnQobik7XG5mb3IodD10dCh0LGUsMSk7KytyPG47KXVbcl09dChyKTtyZXR1cm4gdX0sdi50b0FycmF5PWZ1bmN0aW9uKG4pe3JldHVybiBuJiZ0eXBlb2Ygbi5sZW5ndGg9PVwibnVtYmVyXCI/TGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pP24uc3BsaXQoXCJcIik6cyhuKTpFdChuKX0sdi50cmFuc2Zvcm09ZnVuY3Rpb24obix0LGUscil7dmFyIHU9cWUobik7aWYobnVsbD09ZSlpZih1KWU9W107ZWxzZXt2YXIgbz1uJiZuLmNvbnN0cnVjdG9yO2U9bnQobyYmby5wcm90b3R5cGUpfXJldHVybiB0JiYodD12LmNyZWF0ZUNhbGxiYWNrKHQsciw0KSwodT9YZTp0cikobixmdW5jdGlvbihuLHIsdSl7cmV0dXJuIHQoZSxuLHIsdSl9KSksZX0sdi51bmlvbj1mdW5jdGlvbigpe3JldHVybiBmdChvdChhcmd1bWVudHMsdHJ1ZSx0cnVlKSl9LHYudW5pcT1XdCx2LnZhbHVlcz1FdCx2LndoZXJlPUF0LHYud2l0aG91dD1mdW5jdGlvbihuKXtyZXR1cm4gcnQobixzKGFyZ3VtZW50cywxKSl9LHYud3JhcD1mdW5jdGlvbihuLHQpe3JldHVybiBwdCh0LDE2LFtuXSlcbn0sdi54b3I9ZnVuY3Rpb24oKXtmb3IodmFyIG49LTEsdD1hcmd1bWVudHMubGVuZ3RoOysrbjx0Oyl7dmFyIGU9YXJndW1lbnRzW25dO2lmKHFlKGUpfHxkdChlKSl2YXIgcj1yP2Z0KHJ0KHIsZSkuY29uY2F0KHJ0KGUscikpKTplfXJldHVybiByfHxbXX0sdi56aXA9R3Qsdi56aXBPYmplY3Q9SnQsdi5jb2xsZWN0PUJ0LHYuZHJvcD1xdCx2LmVhY2g9RHQsdi5lYWNoUmlnaHQ9TnQsdi5leHRlbmQ9WWUsdi5tZXRob2RzPV90LHYub2JqZWN0PUp0LHYuc2VsZWN0PUF0LHYudGFpbD1xdCx2LnVuaXF1ZT1XdCx2LnVuemlwPUd0LFV0KHYpLHYuY2xvbmU9ZnVuY3Rpb24obix0LGUscil7cmV0dXJuIHR5cGVvZiB0IT1cImJvb2xlYW5cIiYmbnVsbCE9dCYmKHI9ZSxlPXQsdD1mYWxzZSksWShuLHQsdHlwZW9mIGU9PVwiZnVuY3Rpb25cIiYmdHQoZSxyLDEpKX0sdi5jbG9uZURlZXA9ZnVuY3Rpb24obix0LGUpe3JldHVybiBZKG4sdHJ1ZSx0eXBlb2YgdD09XCJmdW5jdGlvblwiJiZ0dCh0LGUsMSkpfSx2LmNvbnRhaW5zPU90LHYuZXNjYXBlPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsPT1uP1wiXCI6aWUobikucmVwbGFjZShRZSxndClcbn0sdi5ldmVyeT1TdCx2LmZpbmQ9SXQsdi5maW5kSW5kZXg9ZnVuY3Rpb24obix0LGUpe3ZhciByPS0xLHU9bj9uLmxlbmd0aDowO2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpOysrcjx1OylpZih0KG5bcl0scixuKSlyZXR1cm4gcjtyZXR1cm4tMX0sdi5maW5kS2V5PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcjtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSx0cihuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gdChuLGUsdSk/KHI9ZSxmYWxzZSk6dm9pZCAwfSkscn0sdi5maW5kTGFzdD1mdW5jdGlvbihuLHQsZSl7dmFyIHI7cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksTnQobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQobixlLHUpPyhyPW4sZmFsc2UpOnZvaWQgMH0pLHJ9LHYuZmluZExhc3RJbmRleD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9bj9uLmxlbmd0aDowO2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpO3ItLTspaWYodChuW3JdLHIsbikpcmV0dXJuIHI7XG5yZXR1cm4tMX0sdi5maW5kTGFzdEtleT1mdW5jdGlvbihuLHQsZSl7dmFyIHI7cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksYnQobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQobixlLHUpPyhyPWUsZmFsc2UpOnZvaWQgMH0pLHJ9LHYuaGFzPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/d2UuY2FsbChuLHQpOmZhbHNlfSx2LmlkZW50aXR5PUh0LHYuaW5kZXhPZj16dCx2LmlzQXJndW1lbnRzPWR0LHYuaXNBcnJheT1xZSx2LmlzQm9vbGVhbj1mdW5jdGlvbihuKXtyZXR1cm4gdHJ1ZT09PW58fGZhbHNlPT09bnx8biYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PUx8fGZhbHNlfSx2LmlzRGF0ZT1mdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PXp8fGZhbHNlfSx2LmlzRWxlbWVudD1mdW5jdGlvbihuKXtyZXR1cm4gbiYmMT09PW4ubm9kZVR5cGV8fGZhbHNlfSx2LmlzRW1wdHk9ZnVuY3Rpb24obil7dmFyIHQ9dHJ1ZTtpZighbilyZXR1cm4gdDt2YXIgZT1oZS5jYWxsKG4pLHI9bi5sZW5ndGg7XG5yZXR1cm4gZT09JHx8ZT09TXx8KExlLmFyZ3NDbGFzcz9lPT1UOmR0KG4pKXx8ZT09RyYmdHlwZW9mIHI9PVwibnVtYmVyXCImJmp0KG4uc3BsaWNlKT8hcjoodHIobixmdW5jdGlvbigpe3JldHVybiB0PWZhbHNlfSksdCl9LHYuaXNFcXVhbD1mdW5jdGlvbihuLHQsZSxyKXtyZXR1cm4gYXQobix0LHR5cGVvZiBlPT1cImZ1bmN0aW9uXCImJnR0KGUsciwyKSl9LHYuaXNGaW5pdGU9ZnVuY3Rpb24obil7cmV0dXJuIEllKG4pJiYhRGUocGFyc2VGbG9hdChuKSl9LHYuaXNGdW5jdGlvbj1qdCx2LmlzTmFOPWZ1bmN0aW9uKG4pe3JldHVybiBDdChuKSYmbiE9K259LHYuaXNOdWxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsPT09bn0sdi5pc051bWJlcj1DdCx2LmlzT2JqZWN0PXh0LHYuaXNQbGFpbk9iamVjdD1lcix2LmlzUmVnRXhwPWZ1bmN0aW9uKG4pe3JldHVybiBuJiZYW3R5cGVvZiBuXSYmaGUuY2FsbChuKT09Snx8ZmFsc2V9LHYuaXNTdHJpbmc9a3Qsdi5pc1VuZGVmaW5lZD1mdW5jdGlvbihuKXtyZXR1cm4gdHlwZW9mIG49PVwidW5kZWZpbmVkXCJcbn0sdi5sYXN0SW5kZXhPZj1mdW5jdGlvbihuLHQsZSl7dmFyIHI9bj9uLmxlbmd0aDowO2Zvcih0eXBlb2YgZT09XCJudW1iZXJcIiYmKHI9KDA+ZT9CZSgwLHIrZSk6UGUoZSxyLTEpKSsxKTtyLS07KWlmKG5bcl09PT10KXJldHVybiByO3JldHVybi0xfSx2Lm1peGluPVV0LHYubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBlLl89Z2UsdGhpc30sdi5ub29wPVF0LHYubm93PWlyLHYucGFyc2VJbnQ9bHIsdi5yYW5kb209ZnVuY3Rpb24obix0LGUpe3ZhciByPW51bGw9PW4sdT1udWxsPT10O3JldHVybiBudWxsPT1lJiYodHlwZW9mIG49PVwiYm9vbGVhblwiJiZ1PyhlPW4sbj0xKTp1fHx0eXBlb2YgdCE9XCJib29sZWFuXCJ8fChlPXQsdT10cnVlKSksciYmdSYmKHQ9MSksbj0rbnx8MCx1Pyh0PW4sbj0wKTp0PSt0fHwwLGV8fG4lMXx8dCUxPyhlPUZlKCksUGUobitlKih0LW4rcGFyc2VGbG9hdChcIjFlLVwiKygoZStcIlwiKS5sZW5ndGgtMSkpKSx0KSk6bHQobix0KX0sdi5yZWR1Y2U9UnQsdi5yZWR1Y2VSaWdodD1GdCx2LnJlc3VsdD1mdW5jdGlvbihuLHQpe2lmKG4pe3ZhciBlPW5bdF07XG5yZXR1cm4ganQoZSk/blt0XSgpOmV9fSx2LnJ1bkluQ29udGV4dD1nLHYuc2l6ZT1mdW5jdGlvbihuKXt2YXIgdD1uP24ubGVuZ3RoOjA7cmV0dXJuIHR5cGVvZiB0PT1cIm51bWJlclwiP3Q6V2UobikubGVuZ3RofSx2LnNvbWU9JHQsdi5zb3J0ZWRJbmRleD1LdCx2LnRlbXBsYXRlPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj12LnRlbXBsYXRlU2V0dGluZ3M7bj1pZShufHxcIlwiKSxlPVplKHt9LGUscik7dmFyIHUsbz1aZSh7fSxlLmltcG9ydHMsci5pbXBvcnRzKSxyPVdlKG8pLG89RXQobyksaT0wLGw9ZS5pbnRlcnBvbGF0ZXx8TixmPVwiX19wKz0nXCIsbD1hZSgoZS5lc2NhcGV8fE4pLnNvdXJjZStcInxcIitsLnNvdXJjZStcInxcIisobD09PUk/TzpOKS5zb3VyY2UrXCJ8XCIrKGUuZXZhbHVhdGV8fE4pLnNvdXJjZStcInwkXCIsXCJnXCIpO24ucmVwbGFjZShsLGZ1bmN0aW9uKHQsZSxyLG8sbCxjKXtyZXR1cm4gcnx8KHI9byksZis9bi5zbGljZShpLGMpLnJlcGxhY2UoUCxhKSxlJiYoZis9XCInK19fZShcIitlK1wiKSsnXCIpLGwmJih1PXRydWUsZis9XCInO1wiK2wrXCI7XFxuX19wKz0nXCIpLHImJihmKz1cIicrKChfX3Q9KFwiK3IrXCIpKT09bnVsbD8nJzpfX3QpKydcIiksaT1jK3QubGVuZ3RoLHRcbn0pLGYrPVwiJztcIixsPWU9ZS52YXJpYWJsZSxsfHwoZT1cIm9ialwiLGY9XCJ3aXRoKFwiK2UrXCIpe1wiK2YrXCJ9XCIpLGY9KHU/Zi5yZXBsYWNlKHgsXCJcIik6ZikucmVwbGFjZShDLFwiJDFcIikucmVwbGFjZShFLFwiJDE7XCIpLGY9XCJmdW5jdGlvbihcIitlK1wiKXtcIisobD9cIlwiOmUrXCJ8fChcIitlK1wiPXt9KTtcIikrXCJ2YXIgX190LF9fcD0nJyxfX2U9Xy5lc2NhcGVcIisodT9cIixfX2o9QXJyYXkucHJvdG90eXBlLmpvaW47ZnVuY3Rpb24gcHJpbnQoKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyl9XCI6XCI7XCIpK2YrXCJyZXR1cm4gX19wfVwiO3RyeXt2YXIgYz1lZShyLFwicmV0dXJuIFwiK2YpLmFwcGx5KGgsbyl9Y2F0Y2gocCl7dGhyb3cgcC5zb3VyY2U9ZixwfXJldHVybiB0P2ModCk6KGMuc291cmNlPWYsYyl9LHYudW5lc2NhcGU9ZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PW4/XCJcIjppZShuKS5yZXBsYWNlKFVlLG10KX0sdi51bmlxdWVJZD1mdW5jdGlvbihuKXt2YXIgdD0rK207cmV0dXJuIGllKG51bGw9PW4/XCJcIjpuKSt0XG59LHYuYWxsPVN0LHYuYW55PSR0LHYuZGV0ZWN0PUl0LHYuZmluZFdoZXJlPUl0LHYuZm9sZGw9UnQsdi5mb2xkcj1GdCx2LmluY2x1ZGU9T3Qsdi5pbmplY3Q9UnQsVXQoZnVuY3Rpb24oKXt2YXIgbj17fTtyZXR1cm4gdHIodixmdW5jdGlvbih0LGUpe3YucHJvdG90eXBlW2VdfHwobltlXT10KX0pLG59KCksZmFsc2UpLHYuZmlyc3Q9THQsdi5sYXN0PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0wLHU9bj9uLmxlbmd0aDowO2lmKHR5cGVvZiB0IT1cIm51bWJlclwiJiZudWxsIT10KXt2YXIgbz11O2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpO28tLSYmdChuW29dLG8sbik7KXIrK31lbHNlIGlmKHI9dCxudWxsPT1yfHxlKXJldHVybiBuP25bdS0xXTpoO3JldHVybiBzKG4sQmUoMCx1LXIpKX0sdi5zYW1wbGU9ZnVuY3Rpb24obix0LGUpe3JldHVybiBuJiZ0eXBlb2Ygbi5sZW5ndGghPVwibnVtYmVyXCI/bj1FdChuKTpMZS51bmluZGV4ZWRDaGFycyYma3QobikmJihuPW4uc3BsaXQoXCJcIikpLG51bGw9PXR8fGU/bj9uW2x0KDAsbi5sZW5ndGgtMSldOmg6KG49VHQobiksbi5sZW5ndGg9UGUoQmUoMCx0KSxuLmxlbmd0aCksbilcbn0sdi50YWtlPUx0LHYuaGVhZD1MdCx0cih2LGZ1bmN0aW9uKG4sdCl7dmFyIGU9XCJzYW1wbGVcIiE9PXQ7di5wcm90b3R5cGVbdF18fCh2LnByb3RvdHlwZVt0XT1mdW5jdGlvbih0LHIpe3ZhciB1PXRoaXMuX19jaGFpbl9fLG89bih0aGlzLl9fd3JhcHBlZF9fLHQscik7cmV0dXJuIHV8fG51bGwhPXQmJighcnx8ZSYmdHlwZW9mIHQ9PVwiZnVuY3Rpb25cIik/bmV3IHkobyx1KTpvfSl9KSx2LlZFUlNJT049XCIyLjQuMVwiLHYucHJvdG90eXBlLmNoYWluPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX19jaGFpbl9fPXRydWUsdGhpc30sdi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gaWUodGhpcy5fX3dyYXBwZWRfXyl9LHYucHJvdG90eXBlLnZhbHVlPVl0LHYucHJvdG90eXBlLnZhbHVlT2Y9WXQsWGUoW1wiam9pblwiLFwicG9wXCIsXCJzaGlmdFwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXTt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3ZhciBuPXRoaXMuX19jaGFpbl9fLGU9dC5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLGFyZ3VtZW50cyk7XG5yZXR1cm4gbj9uZXcgeShlLG4pOmV9fSksWGUoW1wicHVzaFwiLFwicmV2ZXJzZVwiLFwic29ydFwiLFwidW5zaGlmdFwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXTt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3JldHVybiB0LmFwcGx5KHRoaXMuX193cmFwcGVkX18sYXJndW1lbnRzKSx0aGlzfX0pLFhlKFtcImNvbmNhdFwiLFwic2xpY2VcIixcInNwbGljZVwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXTt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3JldHVybiBuZXcgeSh0LmFwcGx5KHRoaXMuX193cmFwcGVkX18sYXJndW1lbnRzKSx0aGlzLl9fY2hhaW5fXyl9fSksTGUuc3BsaWNlT2JqZWN0c3x8WGUoW1wicG9wXCIsXCJzaGlmdFwiLFwic3BsaWNlXCJdLGZ1bmN0aW9uKG4pe3ZhciB0PWZlW25dLGU9XCJzcGxpY2VcIj09bjt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3ZhciBuPXRoaXMuX19jaGFpbl9fLHI9dGhpcy5fX3dyYXBwZWRfXyx1PXQuYXBwbHkocixhcmd1bWVudHMpO3JldHVybiAwPT09ci5sZW5ndGgmJmRlbGV0ZSByWzBdLG58fGU/bmV3IHkodSxuKTp1XG59fSksdn12YXIgaCx2PVtdLHk9W10sbT0wLGQ9e30sYj0rbmV3IERhdGUrXCJcIixfPTc1LHc9NDAsaj1cIiBcXHRcXHgwQlxcZlxceGEwXFx1ZmVmZlxcblxcclxcdTIwMjhcXHUyMDI5XFx1MTY4MFxcdTE4MGVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwYVxcdTIwMmZcXHUyMDVmXFx1MzAwMFwiLHg9L1xcYl9fcFxcKz0nJzsvZyxDPS9cXGIoX19wXFwrPSknJ1xcKy9nLEU9LyhfX2VcXCguKj9cXCl8XFxiX190XFwpKVxcKycnOy9nLE89L1xcJFxceyhbXlxcXFx9XSooPzpcXFxcLlteXFxcXH1dKikqKVxcfS9nLFM9L1xcdyokLyxBPS9eXFxzKmZ1bmN0aW9uWyBcXG5cXHJcXHRdK1xcdy8sST0vPCU9KFtcXHNcXFNdKz8pJT4vZyxEPVJlZ0V4cChcIl5bXCIraitcIl0qMCsoPz0uJClcIiksTj0vKCReKS8sQj0vXFxidGhpc1xcYi8sUD0vWydcXG5cXHJcXHRcXHUyMDI4XFx1MjAyOVxcXFxdL2csUj1cIkFycmF5IEJvb2xlYW4gRGF0ZSBFcnJvciBGdW5jdGlvbiBNYXRoIE51bWJlciBPYmplY3QgUmVnRXhwIFN0cmluZyBfIGF0dGFjaEV2ZW50IGNsZWFyVGltZW91dCBpc0Zpbml0ZSBpc05hTiBwYXJzZUludCBzZXRUaW1lb3V0XCIuc3BsaXQoXCIgXCIpLEY9XCJjb25zdHJ1Y3RvciBoYXNPd25Qcm9wZXJ0eSBpc1Byb3RvdHlwZU9mIHByb3BlcnR5SXNFbnVtZXJhYmxlIHRvTG9jYWxlU3RyaW5nIHRvU3RyaW5nIHZhbHVlT2ZcIi5zcGxpdChcIiBcIiksVD1cIltvYmplY3QgQXJndW1lbnRzXVwiLCQ9XCJbb2JqZWN0IEFycmF5XVwiLEw9XCJbb2JqZWN0IEJvb2xlYW5dXCIsej1cIltvYmplY3QgRGF0ZV1cIixxPVwiW29iamVjdCBFcnJvcl1cIixLPVwiW29iamVjdCBGdW5jdGlvbl1cIixXPVwiW29iamVjdCBOdW1iZXJdXCIsRz1cIltvYmplY3QgT2JqZWN0XVwiLEo9XCJbb2JqZWN0IFJlZ0V4cF1cIixNPVwiW29iamVjdCBTdHJpbmddXCIsVj17fTtcblZbS109ZmFsc2UsVltUXT1WWyRdPVZbTF09Vlt6XT1WW1ddPVZbR109VltKXT1WW01dPXRydWU7dmFyIEg9e2xlYWRpbmc6ZmFsc2UsbWF4V2FpdDowLHRyYWlsaW5nOmZhbHNlfSxVPXtjb25maWd1cmFibGU6ZmFsc2UsZW51bWVyYWJsZTpmYWxzZSx2YWx1ZTpudWxsLHdyaXRhYmxlOmZhbHNlfSxRPXthOlwiXCIsYjpudWxsLGM6XCJcIixkOlwiXCIsZTpcIlwiLHY6bnVsbCxnOlwiXCIsaDpudWxsLHN1cHBvcnQ6bnVsbCxpOlwiXCIsajpmYWxzZX0sWD17XCJib29sZWFuXCI6ZmFsc2UsXCJmdW5jdGlvblwiOnRydWUsb2JqZWN0OnRydWUsbnVtYmVyOmZhbHNlLHN0cmluZzpmYWxzZSx1bmRlZmluZWQ6ZmFsc2V9LFk9e1wiXFxcXFwiOlwiXFxcXFwiLFwiJ1wiOlwiJ1wiLFwiXFxuXCI6XCJuXCIsXCJcXHJcIjpcInJcIixcIlxcdFwiOlwidFwiLFwiXFx1MjAyOFwiOlwidTIwMjhcIixcIlxcdTIwMjlcIjpcInUyMDI5XCJ9LFo9WFt0eXBlb2Ygd2luZG93XSYmd2luZG93fHx0aGlzLG50PVhbdHlwZW9mIGV4cG9ydHNdJiZleHBvcnRzJiYhZXhwb3J0cy5ub2RlVHlwZSYmZXhwb3J0cyx0dD1YW3R5cGVvZiBtb2R1bGVdJiZtb2R1bGUmJiFtb2R1bGUubm9kZVR5cGUmJm1vZHVsZSxldD10dCYmdHQuZXhwb3J0cz09PW50JiZudCxydD1YW3R5cGVvZiBnbG9iYWxdJiZnbG9iYWw7XG4hcnR8fHJ0Lmdsb2JhbCE9PXJ0JiZydC53aW5kb3chPT1ydHx8KFo9cnQpO3ZhciB1dD1nKCk7dHlwZW9mIGRlZmluZT09XCJmdW5jdGlvblwiJiZ0eXBlb2YgZGVmaW5lLmFtZD09XCJvYmplY3RcIiYmZGVmaW5lLmFtZD8oWi5fPXV0LCBkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gdXR9KSk6bnQmJnR0P2V0Pyh0dC5leHBvcnRzPXV0KS5fPXV0Om50Ll89dXQ6Wi5fPXV0fSkuY2FsbCh0aGlzKTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLyoqXG4gKiBAcmVxdWlyZXMgeXNlbGVjdG9yLmNzc1xuICog5L2N572uOnN0eWxlcy9jb21tb24veXNlbGVjdG9yLmNzc1xuICpcbiAqIFRPRE8g6ZSu55uY5a+86IiqIOa7muWKqOadoei3n+maj+a7muWKqFxuICogVE9ETyBJUEhPTkUg5L2/55So5Y6f55Sf5o6n5Lu2XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtIHtCb29sZWFufSBjb25maWcuZW1wdHlIaWRkZW4g5b2T6Ieq5a6a5LmJc2VsZWN05rKh5pyJ6YCJ6aG55pe25piv5ZCm6ZqQ6JePIHRydWXpmpDol49cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY29uZmlnLm1heFJvd3NcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY29uZmlnLmluZGV4IOWIneWni+WMluaXtuaMh+WumumAieaLqeesrOWHoOS4qm9wdGlvbiDlpoLmnpzmsqHmjIflrpog6buY6K6k6YCJ5oup5Y6f55Sfc2VsZWN05YWD57Sg5b2T5YmN6YCJ5oup55qEb3B0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnLmRpcmVjdGlvbiBvcHRpb27kuIvmi4nmoYblh7rnjrDkvY3nva5cbiAqIHRvcCBzZWxlY3QgdGl0bGXnmoTkuIrmlrkgIGJvdHRvbSBzZWxlY3QgdGl0bGXnmoTkuIvmlrlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmZpZy5vbmNoYW5nZShvYmopIOmAiemhueabtOaUueaXtuS8muinpuWPkeatpOWHveaVsFxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmZpZy5vbnNlbGVjdCh0ZXh0KSDmm7TmjaLpgInpobnml7bkvJrop6blj5HmraTlh73mlbBcbiAqIOatpOWHveaVsOWPr+S7peWvueW9k+WJjemAieaLqeeahG9wdGlvbiB0ZXh06L+b6KGM5aSE55CGIOiHquWumuS5iXNlbGVjdCB0aXRsZeS4iuaYvuekuueahOaYr+WkhOeQhuWQjueahHRleHRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IOW9k+WJjemAieaLqeeahG9wdGlvbiB0ZXh0XG4gKlxuICogQGV4YW1wbGVcbiAqICQoXCJzZWxlY3RcIikueXNlbGVjdG9yKGNvbmZpZyk7XG4gKlxuICpcbiAqICQoJC5mbi55c2VsZWN0b3IuZXZlbnRzKS50cmlnZ2VyKFwiY2hhbmdlXCIsIFsgc2VsZiwgb2JqLCBzZWxmLm9wdGlvbihcImhvbGRlclwiKV0pO1xuICovXG5cbihmdW5jdGlvbigkKXtcblxuICAgIHZhciBTRUxFQ1RPUl9EQVRBX0tFWSA9IFwiWVNFTEVDVE9SXCIsXG4gICAgICAgIFNFTEVDVE9SX0VWRU5UICAgID0gIFwiLlNFTEVDVE9SX0VWRU5UXCIsXG4gICAgICAgIEhPVkVSICAgICAgICAgICAgID0gXCJob3ZlclwiO1xuXG4gICAgdmFyIFNlbGVjdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgU2VsZWN0b3Iub3B0aW9ucyA9IHtcbiAgICAgICAgZW1wdHlIaWRkZW46IGZhbHNlLFxuICAgICAgICBtYXhSb3dzICAgIDogMTAsXG4gICAgICAgIGluZGV4ICAgICAgOiBudWxsLFxuICAgICAgICAvLyBkaXJlY3Rpb24gIDogXCJib3R0b21cIixcbiAgICAgICAgb25jaGFuZ2UgICA6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgIG9uc2VsZWN0ICAgOiBmdW5jdGlvbih0KSB7IHJldHVybiB0IHx8IFwiXCI7IH1cbiAgICB9O1xuXG4gICAgU2VsZWN0b3IucHJvdG90eXBlID0ge1xuICAgICAgICBfaW5pdDogZnVuY3Rpb24oY29uZmlnKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2VsZi5fc2V0T3B0aW9ucyhjb25maWcgfHwge30pO1xuICAgICAgICAgICAgc2VsZi5fYmluZEV2ZW50cygpO1xuICAgICAgICB9LFxuICAgICAgICBfYmluZEV2ZW50czogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBzZWxmICAgID0gdGhpcyxcbiAgICAgICAgICAgICAgICBqcXVlcnkgID0gc2VsZi5vcHRpb24oXCJqcXVlcnlcIiksXG4gICAgICAgICAgICAgICAgc2hvd2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB0b2dnbGVFdmVudChlKXtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbihcImRpc2FibGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzaG93aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2hpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2hvd2luZyA9ICFzaG93aW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXggY2FwdHVyZSBub3QgcmVsZWFzZShtb3VzZWRvd24gYW5kIGRyYWcgb3V0KTtcbiAgICAgICAgICAgIHZhciBfY3VyID0gbnVsbDtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICBfY3VyICYmIF9jdXIucmVsZWFzZUNhcHR1cmUgJiYgX2N1ci5yZWxlYXNlQ2FwdHVyZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGpxdWVyeS5kZWxlZ2F0ZShcIi55c2VsLWlucHV0XCIsIFwiY2xpY2tcIiArIFNFTEVDVE9SX0VWRU5ULCB0b2dnbGVFdmVudClcbiAgICAgICAgICAgICAgICAuZGVsZWdhdGUoXCIueXNlbC1hcnJhd1wiLCBcIm1vdXNlZG93blwiICsgU0VMRUNUT1JfRVZFTlQsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbihcImlucHV0XCIpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0Q2FwdHVyZSkgeyB0aGlzLnNldENhcHR1cmUoKTsgfVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVFdmVudChlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kZWxlZ2F0ZShcIi55c2VsLWFycmF3XCIsIFwiY2xpY2tcIiArIFNFTEVDVE9SX0VWRU5ULCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVsZWFzZUNhcHR1cmUpIHsgdGhpcy5yZWxlYXNlQ2FwdHVyZSgpOyB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZGVsZWdhdGUoXCIueXNlbC1pbnB1dFwiLCBcImZvY3Vzb3V0XCIgKyBTRUxFQ1RPUl9FVkVOVCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3dpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX2hpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBzZWxmLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gc2VsZi5fZ2V0QnlWYWx1ZSh2YWwpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBleHRlcmFsIGJpbmRcbiAgICAgICAgICAgICAgICAgICAgJCgkLmZuLnlzZWxlY3Rvci5ldmVudHMpLnRyaWdnZXIoXCJibHVyXCIsIFsgc2VsZiwgb2JqLCBzZWxmLm9wdGlvbihcImhvbGRlclwiKV0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRlbGVnYXRlKFwiLnlzZWwtc3VnIHVsXCIsIFwibW91c2Vkb3duXCIgKyBTRUxFQ1RPUl9FVkVOVCwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXRDYXB0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENhcHR1cmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jdXIgPSB0aGlzOyAvLyBmaXggY2FwdHVyZSBub3QgcmVsZWFzZShtb3VzZWRvd24gYW5kIGRyYWcgb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldCwgaW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC50YWdOYW1lID09PSBcIkFcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKHRhcmdldCkuZGF0YShcImluZGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSAkKHRhcmdldCkucGFyZW50c1VudGlsKFwiLnlzZWwtc3VnXCIsXCJhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYS5sZW5ndGggPT0gMCkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gYS5kYXRhKFwiaW5kZXhcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmluZGV4KGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVFdmVudChlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kZWxlZ2F0ZShcIi55c2VsLXN1ZyB1bFwiLCBcImNsaWNrXCIgKyBTRUxFQ1RPUl9FVkVOVCwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbGVhc2VDYXB0dXJlKSB7IHRoaXMucmVsZWFzZUNhcHR1cmUoKTsgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRlbGVnYXRlKFwiLnlzZWwtc3VnIHVsXCIsIFwibW91c2VlbnRlclwiICsgU0VMRUNUT1JfRVZFTlQsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9jdXIoKS5yZW1vdmVDbGFzcyhIT1ZFUik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZGVsZWdhdGUoXCIueXNlbC1pbnB1dFwiLCBcImtleWRvd25cIiArIFNFTEVDVE9SX0VWRU5ULCBmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb24oXCJkaXNhYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZSA9IGUua2V5Q29kZTtcblxuICAgICAgICAgICAgICAgICAgICBpZihjb2RlID09PSAzNyB8fCBjb2RlID09PSAzOCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByZXZpb3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjb2RlID09PSAzOSB8fCBjb2RlID09PSA0MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNvZGUgPT09IDEzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUV2ZW50KGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY29kZSA9PT0gOCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgX2N1cjogZnVuY3Rpb24oaSl7XG4gICAgICAgICAgICB2YXIgc2VsZiAgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IChpID09IG51bGwpID8gc2VsZi5vcHRpb24oXCJpbmRleFwiKSA6IGksXG4gICAgICAgICAgICAgICAgY3VyICAgICA9IHNlbGYub3B0aW9uKFwic3VnZ2VzdFwiKS5maW5kKFwiYTplcShcIiArIGN1cnJlbnQgKyBcIilcIik7XG5cbiAgICAgICAgICAgIHJldHVybiBjdXI7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7roh6rlrprkuYlzZWxlY3Tnu4Tku7ZcbiAgICAgICAgICog5L+d5a2Yc2VsZWN057uE5Lu2LHNlbGVjdOe7hOS7tuS4i+aLieWFg+e0oCxzZWxlY3Tnu4Tku7Z0aXRsZVxuICAgICAgICAgKi9cbiAgICAgICAgX2RyYXdIdG1sOiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBmdWxsSFRNTCA9IFsnPGRpdiBjbGFzcz1cInVpLXlzZWxlY3RvclwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwieXNlbC1ib3hcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ5c2VsLWFycmF3XCI+PGI+PC9iPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ5c2VsLWlucHV0XCIgdGFiaW5kZXg9XCIwXCI+PC9zcGFuPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIiBjbGFzcz1cInlzZWwtc3VnXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dWw+PC91bD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+J107XG5cbiAgICAgICAgICAgIHZhciBqcXVlcnkgPSAkKGZ1bGxIVE1MLmpvaW4oXCJcXG5cIikpLFxuICAgICAgICAgICAgICAgIGhvbGRlciA9IHNlbGYub3B0aW9uKFwiaG9sZGVyXCIpLmhpZGUoKTtcblxuICAgICAgICAgICAgaG9sZGVyLmFmdGVyKGpxdWVyeSk7XG4gICAgICAgICAgICBzZWxmLm9wdGlvbihcImpxdWVyeVwiLCBqcXVlcnkpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJzdWdnZXN0XCIsICQoXCIueXNlbC1zdWdcIiwganF1ZXJ5KSk7XG4gICAgICAgICAgICBzZWxmLm9wdGlvbihcImlucHV0XCIsICQoXCIueXNlbC1pbnB1dFwiLCBqcXVlcnkpKTtcbiAgICAgICAgfSxcbiAgICAgICAgX2RyYXdTdWdnZXN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGxpc3RIdG1sQXJyYXkgPSBbXSwgaXRlbSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBsaXN0ID0gc2VsZi5vcHRpb24oXCJkYXRhXCIpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGxpc3RbaV07XG4gICAgICAgICAgICAgICAgbGlzdEh0bWxBcnJheS5wdXNoKCc8bGkgY2xhc3M9XCJqcy1zZWFyY2gtdHlwZVwiPjxhIGRhdGEtdmFsdWU9XCInICsgaXRlbS52YWx1ZSArICdcIiBoaWRlZm9jdXM9XCJvblwiIGRhdGEtaW5kZXg9XCInICsgaSArICdcIicpO1xuICAgICAgICAgICAgICAgIGxpc3RIdG1sQXJyYXkucHVzaCgnIG9uY2xpY2s9XCJyZXR1cm4gZmFsc2U7XCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIHRhYmluZGV4PVwiLTFcIj4nICsgaXRlbS50ZXh0ICk7XG4gICAgICAgICAgICAgICAgbGlzdEh0bWxBcnJheS5wdXNoKCc8L2E+PC9saT4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJzdWdnZXN0XCIpLmh0bWwoXCI8dWw+XCIgKyBsaXN0SHRtbEFycmF5LmpvaW4oXCJcXG5cIikgKyBcIjwvdWw+XCIpO1xuICAgICAgICB9LFxuICAgICAgICBfc2V0T3B0aW9uczogZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2VsZi5vcHRpb25zID0gJC5leHRlbmQoe30sIFNlbGVjdG9yLm9wdGlvbnMsIG9iaik7XG5cbiAgICAgICAgICAgIHZhciByYXdTZWxlY3QgPSBvYmoucmF3U2VsZWN0LFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSByYXdTZWxlY3Qub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBpbmRleCA9IHJhd1NlbGVjdC5zZWxlY3RlZEluZGV4LFxuICAgICAgICAgICAgICAgIGRhdGFMaXN0ID0gW10sIGl0ZW07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICBkYXRhTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0udmFsdWUgfHwgaXRlbS50ZXh0LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpdGVtLnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJob2xkZXJcIiwgJChyYXdTZWxlY3QpKTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwiaW5kZXhcIiwgb2JqLmluZGV4ICE9IG51bGwgPyBvYmouaW5kZXggOiBpbmRleCk7XG4gICAgICAgICAgICBzZWxmLl9kcmF3SHRtbCgpO1xuICAgICAgICAgICAgc2VsZi5zZXRPcHRpb25zKGRhdGFMaXN0KTtcblxuICAgICAgICB9LFxuICAgICAgICBfZ2V0QnlWYWx1ZTogZnVuY3Rpb24odmFsdWUsIGtleSl7XG5cbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5vcHRpb24oXCJkYXRhXCIpLFxuICAgICAgICAgICAgICAgIGl0ZW07XG5cbiAgICAgICAgICAgIGtleSA9IGtleSB8fCBcInZhbHVlXCI7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gbGlzdFtpXTtcblxuICAgICAgICAgICAgICAgIGlmIChpdGVtW2tleV0gPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICog5qC55o2ub2JqIOabtOaWsHNlbGVjdOe7hOS7tumAiemhuVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICAgICAqIEBwYXJhbSB7aW50fSBvYmouaW5kZXhcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9iai52YWx1ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb2JqLnRleHRcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBmb3JjZVxuICAgICAgICAgKi9cbiAgICAgICAgX3NldEJ5T2JqZWN0OiBmdW5jdGlvbihvYmosIGZvcmNlKXtcblxuICAgICAgICAgICAgb2JqID0gb2JqIHx8IHt9O1xuXG4gICAgICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMub3B0aW9uKFwiaW5kZXhcIikgPT09IG9iai5pbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIG9uc2VsZWN0ID0gc2VsZi5vcHRpb24oXCJvbnNlbGVjdFwiKSxcbiAgICAgICAgICAgICAgICBvbmNoYW5nZSA9IHNlbGYub3B0aW9uKFwib25jaGFuZ2VcIik7XG5cbiAgICAgICAgICAgIHZhciB0ZXh0ID0gb25zZWxlY3QgPyBvbnNlbGVjdChvYmoudGV4dCkgOiAob2JqLnRleHQgfHwgXCJcIik7XG5cbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwidmFsdWVcIiwgb2JqLnZhbHVlIHx8IFwiXCIpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJ0ZXh0XCIsIHRleHQpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJpbmRleFwiLCBvYmouaW5kZXggfHwgMCk7XG5cbiAgICAgICAgICAgIHZhciBob2xkZXIgPSBzZWxmLm9wdGlvbihcImhvbGRlclwiKSxcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHNlbGYub3B0aW9uKFwiaW5wdXRcIik7XG5cbiAgICAgICAgICAgIGlmIChob2xkZXIpIHsgaG9sZGVyWzBdLnNlbGVjdGVkSW5kZXggPSBvYmouaW5kZXg7IH1cbiAgICAgICAgICAgIGlmIChpbnB1dCkgeyBzZWxmLm9wdGlvbihcImlucHV0XCIpLnRleHQodGV4dCk7IH1cblxuICAgICAgICAgICAgaWYgKG9uY2hhbmdlKSB7IG9uY2hhbmdlLmNhbGwoc2VsZiwgb2JqKTsgfVxuXG4gICAgICAgICAgICAvLyBmb3IgZXh0ZXJhbCBiaW5kXG4gICAgICAgICAgICAkKCQuZm4ueXNlbGVjdG9yLmV2ZW50cykudHJpZ2dlcihcImNoYW5nZVwiLCBbIHNlbGYsIG9iaiwgc2VsZi5vcHRpb24oXCJob2xkZXJcIildKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3RyaWdnZXJDbGFzczogZnVuY3Rpb24oaSwgail7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChpID09PSBqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLl9jdXIoaSkucmVtb3ZlQ2xhc3MoSE9WRVIpO1xuICAgICAgICAgICAgc2VsZi5fY3VyKGopLmFkZENsYXNzKEhPVkVSKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3Nob3c6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgc3VnZ2VzdCA9IHNlbGYub3B0aW9uKFwic3VnZ2VzdFwiKSxcbiAgICAgICAgICAgICAgICBpbmRleCA9IHNlbGYub3B0aW9uKFwiaW5kZXhcIiksXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gc2VsZi5vcHRpb24oXCJkaXJlY3Rpb25cIik7XG5cbiAgICAgICAgICAgIHNlbGYuX2RyYXdTdWdnZXN0KCk7XG5cbiAgICAgICAgICAgIHZhciBsaXN0ID0gc3VnZ2VzdC5maW5kKFwiYVwiKTtcblxuICAgICAgICAgICAgbGlzdC5lcShpbmRleCkuYWRkQ2xhc3MoSE9WRVIpO1xuXG4gICAgICAgICAgICBzdWdnZXN0LnNob3coKTtcblxuICAgICAgICAgICAgdmFyIG1heFJvd3MgPSBzZWxmLm9wdGlvbihcIm1heFJvd3NcIik7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gTWF0aC5taW4obGlzdC5zaXplKCksIG1heFJvd3MpICogbGlzdC5oZWlnaHQoKTtcbiAgICAgICAgICAgIHZhciBwcmV2ID0gc2VsZi5vcHRpb24oXCJqcXVlcnlcIiksIHRvcDtcbiAgICAgICAgICAgIHN3aXRjaChkaXJlY3Rpb24pe1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gMCAtIGhlaWdodCAtIHByZXYuaGVpZ2h0KCkgLSAyO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IDU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IC8vIOagueaNruS4i+aWueepuumXtOWGs+WumuWcqGJvdHRvbei/mOaYr3RvcOWxleekulxuICAgICAgICAgICAgICAgICAgICB2YXIgd2luID0kKHdpbmRvdyksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2VG9wID0gcHJldi5vZmZzZXQoKS50b3AgKyBwcmV2LmhlaWdodCgpICsgMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ID0gd2luLnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2ggPSB3aW4uaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYocHJldlRvcCArIGhlaWdodCA+IHN0ICsgd2gpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gMCAtIGhlaWdodCAtIHByZXYuaGVpZ2h0KCkgLSAyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gNTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3VnZ2VzdC5maW5kKFwidWxcIikuY3NzKFwiaGVpZ2h0XCIsIGhlaWdodCkuY3NzKFwidG9wXCIsIHRvcCkuc2Nyb2xsVG9wKHNlbGYub3B0aW9uKCdpbmRleCcpICogbGlzdC5oZWlnaHQoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIF9oaWRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5vcHRpb24oXCJzdWdnZXN0XCIpLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa4heepuuWOn+eUn3NlbGVjdCDlubblsIZsaXN06L2s5o2i5Li6T3B0aW9u5re75Yqg5Yiwc2VsZWN05LitXG4gICAgICAgICAqIOW5tuagueaNrnRoaXMub3B0aW9uKFwiaW5kZXhcIinnmoTlgLwg6YCJ5oup5a+55bqU55qEb3B0aW9u6YCJ6aG5XG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0IHNlbGVjdCBvcHRpb27mlbDmja7lr7nosaFcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGxpc3QudmFsdWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGxpc3QudGV4dFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0T3B0aW9uczogZnVuY3Rpb24obGlzdCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAganF1ZXJ5ID0gc2VsZi5vcHRpb24oXCJqcXVlcnlcIik7XG5cbiAgICAgICAgICAgIGxpc3QgPSBsaXN0IHx8IFtdO1xuXG4gICAgICAgICAgICB2YXIgc2VsZWN0ID0gc2VsZi5vcHRpb24oXCJob2xkZXJcIilbMF07XG4gICAgICAgICAgICAvL+a4heepuuWOn+eUn3NlbGVjdOmAiemhuVxuICAgICAgICAgICAgICAgIHNlbGVjdC5sZW5ndGggPSAwO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoLCB0ZW1wOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IGxpc3RbaV07XG4gICAgICAgICAgICAgICAgdGVtcC5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgc2VsZWN0Lm9wdGlvbnMuYWRkKG5ldyBPcHRpb24odGVtcC50ZXh0LCB0ZW1wLnZhbHVlKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwiZGF0YVwiLCBsaXN0KTtcblxuICAgICAgICAgICAgaWYgKCFsaXN0Lmxlbmd0aCAmJiBzZWxmLm9wdGlvbihcImVtcHR5SGlkZGVuXCIpKSB7XG4gICAgICAgICAgICAgICAganF1ZXJ5LmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAganF1ZXJ5LnNob3coKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5fc2V0QnlPYmplY3QobGlzdFtzZWxmLm9wdGlvbihcImluZGV4XCIpXSB8fCBsaXN0WzBdLCB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb24oXCJkYXRhXCIpWzBdIHx8IHt9O1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICog6K+75Y+W5oiW5pu05paw6YWN572u5Y+C5pWwKHRoaXMub3B0aW9ucylcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSDphY3nva7lj4LmlbBrZXlcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHZhbCDmm7TmlrDml7Yg6KaB6K6+572u55qE6YWN572u5Y+C5pWw5a+55bqU55qE5YC8XG4gICAgICAgICAqL1xuICAgICAgICBvcHRpb246IGZ1bmN0aW9uKGtleSwgdmFsKXtcblxuICAgICAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSB2YWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHJldmlvdXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSBzZWxmLmluZGV4KCkgLSAxO1xuXG4gICAgICAgICAgICBpZihpbmRleCA8IDApe1xuICAgICAgICAgICAgICAgIGluZGV4ID0gc2VsZi5vcHRpb24oXCJkYXRhXCIpLmxlbmd0aCArIGluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmluZGV4KGluZGV4KTtcbiAgICAgICAgfSxcbiAgICAgICAgbmV4dDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2VsZi5pbmRleChzZWxmLm9wdGlvbihcImluZGV4XCIpICsgMSk7XG4gICAgICAgIH0sXG4gICAgICAgIGluZGV4OiBmdW5jdGlvbihpKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKGkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLm9wdGlvbihcImluZGV4XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHNlbGYub3B0aW9uKFwiZGF0YVwiKSxcbiAgICAgICAgICAgICAgICBvYmogPSBkYXRhW2ldLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gc2VsZi5vcHRpb24oXCJpbmRleFwiKTtcblxuICAgICAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgICAgICBvYmogPSBzZWxmLmZpcnN0KCk7XG4gICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuX3NldEJ5T2JqZWN0KG9iaik7XG4gICAgICAgIH0sXG4gICAgICAgIHZhbDogZnVuY3Rpb24odmFsdWUsIGZvcmNlKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5vcHRpb24oXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG9iaiA9IHNlbGYuX2dldEJ5VmFsdWUodmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvYmogPSBzZWxmLmZpcnN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuX3NldEJ5T2JqZWN0KG9iaiwgZm9yY2UpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYub3B0aW9uKFwidGV4dFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG9iaiA9IHNlbGYuX2dldEJ5VmFsdWUodGV4dCwgXCJ0ZXh0XCIpO1xuXG4gICAgICAgICAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvYmogPSBzZWxmLmZpcnN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuX3NldEJ5T2JqZWN0KG9iaik7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uKFwianF1ZXJ5XCIpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiZGlzYmxlXCIpO1xuXG4gICAgICAgICAgICB0aGlzLm9wdGlvbihcImRpc2FibGVcIiwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uKFwianF1ZXJ5XCIpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiZGlzYmxlXCIpO1xuXG4gICAgICAgICAgICB0aGlzLm9wdGlvbihcImRpc2FibGVcIiwgZmFsc2UpO1xuICAgICAgICB9LFxuICAgICAgICBfcmVkcmF3TGlzdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciByYXdTZWxlY3QgPSB0aGlzLm9wdGlvbignaG9sZGVyJylbMF0sXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHJhd1NlbGVjdC5vcHRpb25zLFxuICAgICAgICAgICAgICAgIGRhdGFMaXN0ID0gW10sIGl0ZW07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICBkYXRhTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0udmFsdWUgfHwgaXRlbS50ZXh0LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpdGVtLnRleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhTGlzdCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSB0aGlzLm9wdGlvbignaG9sZGVyJylbMF0sXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHNlbC5vcHRpb25zO1xuICAgICAgICAgICAgb3B0aW9ucy5yZW1vdmUoaW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5fcmVkcmF3TGlzdCgpO1xuICAgICAgICB9LFxuICAgICAgICBhZGQ6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgdmFyIHNlbCA9IHRoaXMub3B0aW9uKCdob2xkZXInKVswXSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gc2VsLm9wdGlvbnM7XG4gICAgICAgICAgICBvcHRpb25zLmFkZChvcHRpb24pO1xuICAgICAgICAgICAgdGhpcy5fcmVkcmF3TGlzdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAkLmZuLmV4dGVuZCh7XG4gICAgICAgIHlzZWxlY3RvcjogZnVuY3Rpb24oY29uZmlnKXtcblxuICAgICAgICAgICAgJC5mbi55c2VsZWN0b3IuZXZlbnRzID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKXtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW5zdCA9IHNlbGYuZGF0YShTRUxFQ1RPUl9EQVRBX0tFWSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWluc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICBjb25maWcucmF3U2VsZWN0ID0gc2VsZlswXTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdCA9IG5ldyBTZWxlY3RvcigpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmRhdGEoU0VMRUNUT1JfREFUQV9LRVksIGluc3QpO1xuICAgICAgICAgICAgICAgICAgICBpbnN0Ll9pbml0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KShqUXVlcnkpO1xuXG5cbiIsInZhciBjb29raWVzID0gcmVxdWlyZSgnLi4vbGliL2Nvb2tpZXMnKTtcbnZhciAkID0gd2luZG93LmpRdWVyeTtcbnZhciBkZWZfb3B0ID0ge1xuICAgIGNhY2hlIDogZmFsc2UsXG4gICAgZGF0YVR5cGUgOiBcImpzb25cIlxufTtcblxudmFyIGFqYXggPSBmdW5jdGlvbihvcHQpe1xuICAgIG9wdCA9ICQuZXh0ZW5kKGRlZl9vcHQgLCBvcHQgKTtcbiAgICB2YXIgZGF0YSA9IG9wdC5kYXRhIHx8IHt9O1xuICAgIGRhdGEuY3NyZnRva2VuID0gY29va2llcy5nZXRJdGVtKFwiY3NyZnRva2VuXCIpO1xuICAgIG9wdC5kYXRhID0gZGF0YTtcbiAgICByZXR1cm4gJC5hamF4KG9wdCk7XG59XG5cbnZhciBodHRwID0ge1xuICAgIGdldCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIG9wdC50eXBlID0gXCJnZXRcIjtcbiAgICAgICAgcmV0dXJuIGFqYXgob3B0KTtcbiAgICB9LFxuICAgIHBvc3QgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBvcHQudHlwZSA9IFwicG9zdFwiO1xuICAgICAgICByZXR1cm4gYWpheChvcHQpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaHR0cDtcbiIsInZhciBEaWFsb2cgPSByZXF1aXJlKFwiLi4vbGliL2lkaWFsb2dcIik7XG5cblxudmFyIHBvcCA9IGZ1bmN0aW9uKGNvbnRlbnQpe1xuICAgIHZhciBkbGcgPSBuZXcgRGlhbG9nKHtcbiAgICAgICAgY29udGVudCA6IGNvbnRlbnRcbiAgICB9KTtcbiAgICBkbGcuaGlkZSgpO1xuICAgIHJldHVybiBkbGc7XG59XG5cblxudmFyIGFsZXJ0X2RsZyAsIGNvbmZpcm1fZGxnIDtcbnZhciBvYmogPSB7XG5cbiAgICBhbGVydCA6IGZ1bmN0aW9uKG1zZyl7XG4gICAgICAgIGlmICghYWxlcnRfZGxnKSB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibS1wb3AgbS1wb3AtYWxlcnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtYmQgXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiYWxlcnQtY3QganNfY29udGVudFwiPicrbXNnKyc8L3A+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWZ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4td3JhcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1jZnIganNfY2xvc2VcIj7noa7lrpo8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgYWxlcnRfZGxnID0gcG9wKGh0bWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnRfZGxnLmdldENvbnRlbnQoKS50ZXh0KG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgYWxlcnRfZGxnLnNob3coKTtcbiAgICAgICAgcmV0dXJuIGFsZXJ0X2RsZztcbiAgICB9LFxuICAgIGNvbmZpcm0gOiBmdW5jdGlvbihtc2csc3VjLGVycil7XG4gICAgICAgICAgc3VjID0gc3VjIHx8IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgICBlcnIgPSBlcnIgfHwgZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgaWYgKCFjb25maXJtX2RsZykge1xuICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIm0tcG9wIG0tcG9wLWFsZXJ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWJkIFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFsZXJ0LWN0IGpzX2NvbnRlbnRcIj4nK21zZysnPC9wPlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1mdFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tY2ZyXCI+56Gu5a6aPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWNhbmNlbFwiPuWPlua2iDwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICBjb25maXJtX2RsZyA9IHBvcChodG1sKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpcm1fZGxnLmdldENvbnRlbnQoKS50ZXh0KG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyICRkMSA9IGNvbmZpcm1fZGxnLmdldERsZ0RvbSgpLmZpbmQoXCIuYnRuLWNmclwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uZmlybV9kbGcuaGlkZSgpO1xuICAgICAgICAgICAgc3VjICYmIHN1YygpOyBcbiAgICAgICAgICAgICRkMS51bmJpbmQoKTsgXG4gICAgICAgICAgICAkZDIudW5iaW5kKCk7IFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyICRkMiA9IGNvbmZpcm1fZGxnLmdldERsZ0RvbSgpLmZpbmQoXCIuYnRuLWNhbmNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uZmlybV9kbGcuaGlkZSgpO1xuICAgICAgICAgICAgJGQxLnVuYmluZCgpOyBcbiAgICAgICAgICAgICRkMi51bmJpbmQoKTsgXG4gICAgICAgICAgICBlcnIgJiYgZXJyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25maXJtX2RsZy5zaG93KCk7IFxuICAgIH0sXG4gICAgaGRfZGxnIDogZnVuY3Rpb24oJGRvbSx0aXRsZSxjYixjbG9zZV9mbil7XG4gICAgICAgIHZhciAkd3JhcCA9ICAkKCc8ZGl2IGNsYXNzPVwibS1wb3BcIj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtaGRcIj48YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJoZC1jbG9zZSBqc19jbG9zZVwiPiZ0aW1lczs8L2E+PGg0PicrdGl0bGUrJzwvaDQ+PC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWJkIFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwianNfY29udGVudFwiPjwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1mdFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tY2ZyXCI+56Gu5a6aPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+Jyk7ICAgXG4gICAgICAgIHZhciBkbGcgPSBuZXcgRGlhbG9nKHtcbiAgICAgICAgICAgIGNvbnRlbnQgOiAkd3JhcCxcbiAgICAgICAgICAgIGNsb3NlX2ZuIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkbGcucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgY2xvc2VfZm4gJiYgY2xvc2VfZm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICR3cmFwLmZpbmQoXCIuYnRuLWNmclwiKS5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNiICYmIGNiKGRsZy5nZXRDb250ZW50KCksZGxnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRsZy5nZXRDb250ZW50KCkuaHRtbCgkZG9tKTtcbiAgICAgICAgZGxnLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIGRsZztcbiAgICB9LFxuICAgIGRsZyA6IGZ1bmN0aW9uKGNvbnRlbnQsbWFza1Zpc2libGUpe1xuICAgICAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgICAgICBjb250ZW50IDogY29udGVudCxcbiAgICAgICAgICAgIG1hc2tWaXNpYmxlIDogISFtYXNrVmlzaWJsZVxuICAgICAgICB9KTtcbiAgICAgICAgZGxnLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIGRsZztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqO1xuXG5cbiIsInZhciBodHRwID0gcmVxdWlyZShcIi4uL21vZC9odHRwLmpzXCIpO1xudmFyIF8gPSByZXF1aXJlKFwiLi4vbGliL2xvZGFzaC5jb21wYXQubWluLmpzXCIpO1xucmVxdWlyZShcIi4uL2xpYi9qdWljZXIuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCIuLi9saWIvanF1ZXJ5LmpzXCIpO1xucmVxdWlyZShcIi4uL2xpYi9pZm9ybS5qc1wiKTtcbnZhciBBRF9UUEwgPSByZXF1aXJlKFwiLi9vcGVyYXRpb24vdG1wbC9ob21lX2FkX2l0ZW0uanNcIik7XG52YXIgVXBsb2FkZXIgPSByZXF1aXJlKFwiLi4vbGliL2l1cGxvYWQuanNcIik7XG5cblxuJChmdW5jdGlvbigpe1xuICAgIFxuICAgIHZhciAkY29udGFpbmVyID0gJChcIiNqcy1jb250YWluZXJcIik7XG4gICAgdmFyIGN1cl9pbmRleCA9IDA7IFxuICAgIGdldE9ubGluZURhdGEoKTtcblxuICAgICQoXCIjbGluZWQtYnRuXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICBnZXRPbmxpbmVEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIiNkcmFmdC1idG5cIikuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgZ2V0RHJhZnREYXRhKCk7IFxuICAgIH0pO1xuICAgICQoXCIjYWRkLWJ0blwiKS5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjcmVhdGVJdGVtRG9tKG51bGwpO1xuICAgIH0pO1xuICAgICQoXCIjc2F2ZS1idG5cIikuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciBuZiA9IGZhbHNlO1xuICAgICAgICB2YXIgJGRvbXMgPSAkY29udGFpbmVyLmZpbmQoXCJkaXYuYWktaXRlbVwiKTtcbiAgICAgICAgdmFyIGRhdGFzID0gXy5tYXAoJGRvbXMsZnVuY3Rpb24oZG9tLGkpe1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkKGRvbSkuZGF0YShcImdldF9kYXRhXCIpKCk7XG4gICAgICAgICAgICBpZiAoIShkYXRhLmltYWdlVXJsICYmIGRhdGEuZW50aXR5SWQpKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCLnrKxcIisoaSsxKStcIuS4qumhueebru+8jOayoeacieWhq+WGmeWujOaVtFwiKTtcbiAgICAgICAgICAgICAgICBuZiA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKCFuZiAmJiBkYXRhcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGh0dHAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsIDogXCIvYXBpL3NhdmVBZHZlcnRpc2UuaHRtXCIsXG4gICAgICAgICAgICAgICAgZGF0YSA6IHsgZGF0YSA6IEpTT04uc3RyaW5naWZ5KGRhdGFzKSB9XG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgICAgICAgaWYgKHJzLmxpc3QgJiYgcnMubGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRvbXMuZWFjaChmdW5jdGlvbihpLGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJChkKS5maW5kKFwiaW5wdXRbbmFtZT1hZF9pZF1cIikudmFsKHJzLmxpc3RbaV0uaWQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLkv53lrZjmiJDlip9cIik7XG4gICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5pyN5Yqh5Zmo6ZSZ6K+vXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIuacjeWKoeWZqOmUmeivr1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgJChcIiNvbmxpbmUtYnRuXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgZiA9IHdpbmRvdy5jb25maXJtKFwi56Gu6K6k6KaB5LiK57q/5o6o6YCB5Yiw6aaW6aG15LmI77yfXCIpO1xuICAgICAgICBpZiAoIWYpIHtcbiAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5mID0gZmFsc2U7XG4gICAgICAgIHZhciAkZG9tcyA9ICRjb250YWluZXIuZmluZChcImRpdi5haS1pdGVtXCIpO1xuICAgICAgICB2YXIgZGF0YXMgPSBfLm1hcCgkZG9tcyxmdW5jdGlvbihkb20saSl7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICQoZG9tKS5kYXRhKFwiZ2V0X2RhdGFcIikoKTtcbiAgICAgICAgICAgIGlmICghZGF0YS5pZCApIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIuesrFwiKyhpKzEpK1wi5Liq6aG555uu77yM5rKh5pyJSUTvvIzmsqHmnInlrZjlhaXmlbDmja7lupNcIik7XG4gICAgICAgICAgICAgICAgbmYgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghbmYgJiYgZGF0YXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBodHRwLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybCA6IFwiL2FwaS9zZXRBZHZlcnRpc2VPbmxpbmUuaHRtXCIsXG4gICAgICAgICAgICAgICAgZGF0YSA6IHsgaWQgOiBkYXRhcy5qb2luKFwiLFwiKSB9XG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgICAgICBpZiAocnMucmV0ID09IDEgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5LiK57q/5oiQ5YqfXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5LiK57q/5aSx6LSlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIuacjeWKoeWZqOmUmeivr1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiBcbiAgICB9KTtcbiAgICAkY29udGFpbmVyLmRlbGVnYXRlKFwiLnRvb2xzIGEuZmEtdGltZXNcIixcImNsaWNrXCIsZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiZGl2LmFpLWl0ZW1cIikucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gZ2V0T25saW5lRGF0YSgpe1xuICAgICAgICBodHRwLmdldCh7XG4gICAgICAgICAgICB1cmwgOiBcIi9hcGkvZ2V0QWR2ZXJ0aXNlTGlzdC5odG1cIlxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgICRjb250YWluZXIuZW1wdHkoKS5hcHBlbmQoJzxoMj7nur/kuIrmlbDmja48L2gyPicpO1xuICAgICAgICAgICAgdmFyIGxpc3QgPSBycy5saXN0O1xuICAgICAgICAgICAgaWYgKGxpc3QgJiYgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0LGZ1bmN0aW9uKGwsaSl7XG4gICAgICAgICAgICAgICAgIGNyZWF0ZUl0ZW1Eb20obCk7XG4gICAgICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwi55uu5YmN6aaW6aG16L2u5pKt5peg5pWw5o2uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBhbGVydChcIuiOt+WPlummlumhteaOqOiNkOS/oeaBr+mUmeivr1wiKTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RHJhZnREYXRhKCl7XG4gICAgICAgICRjb250YWluZXIuZW1wdHkoKS5hcHBlbmQoJzxoMj7ojYnnqL/mlbDmja48L2gyPicpO1xuICAgICAgICBodHRwLmdldCh7XG4gICAgICAgICAgICB1cmwgOiBcIi9hcGkvZ2V0RHJhZnRzQWR2ZXJ0aXNlTGlzdC5odG1cIlxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgIHZhciBsaXN0ID0gcnMubGlzdDtcbiAgICAgICAgICAgIGlmIChsaXN0ICYmIGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICBfLmZvckVhY2gobGlzdCxmdW5jdGlvbihsLGkpe1xuICAgICAgICAgICAgICAgICBjcmVhdGVJdGVtRG9tKGwpO1xuICAgICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIuebruWJjeaaguaXoOiNieeov+aXoOaVsOaNrlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgYWxlcnQoXCLojrflj5bpppbpobXmjqjojZDkv6Hmga/plJnor69cIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjcmVhdGVJdGVtRG9tKGRhdGEpe1xuICAgICAgICB2YXIgaHRtbCA9IEFEX1RQTCh7XG4gICAgICAgICAgICBpbmRleCA6IGN1cl9pbmRleCsxXG4gICAgICAgIH0pO1xuICAgICAgICBjdXJfaW5kZXggKys7XG4gICAgICAgIHZhciBkb20gPSAkKGh0bWwpO1xuICAgICAgICB2YXIgdXBfbG9hZCA9IGRvbS5maW5kKFwiLmpzLXVwbG9hZFwiKTtcbiAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoZG9tKTsgXG5cbiAgICAgICAgVXBsb2FkZXIuY3JlYXRlX3VwbG9hZCh7XG4gICAgICAgICAgICBkb20gOiB1cF9sb2FkWzBdLFxuICAgICAgICAgICAgbXVsdGlfc2VsZWN0aW9uIDogZmFsc2UsXG4gICAgICAgICAgICBjYWxsYmFjayA6IGZ1bmN0aW9uKGRhdGEsZmlsZXMpe1xuICAgICAgICAgICAgICAgIHZhciBwYXRoTGlzdCA9IGRhdGEucGF0aExpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGhMaXN0ICYmIHBhdGhMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gcGF0aExpc3RbMF07XG4gICAgICAgICAgICAgICAgICAgIGRvbS5maW5kKFwiZGl2LmpzLWltZ2JveFwiKS5odG1sKCc8aW1nIHNyYz1cIicraW1nKydcIiA+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGRvbS5maW5kKFwiaW5wdXRbbmFtZT1pbWFnZV91cmxdXCIpLnZhbChpbWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciAkZm9ybSA9IGRvbS5maW5kKFwiZm9ybVwiKVxuICAgICAgICAkZm9ybS5mb3JtKHtcbiAgICAgICAgICAgIGRhdGFfbWFwIDoge1xuICAgICAgICAgICAgICAgIGlkIDogXCJpbnB1dFtuYW1lPWFkX2lkXVwiLFxuICAgICAgICAgICAgICAgIGltYWdlVXJsIDogXCJpbnB1dFtuYW1lPWltYWdlX3VybF1cIixcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICBzdGF0dXMgOntjbHM6XCJpbnB1dFt0eXBlPXJhZGlvXVwiICwgdmFsIDogZnVuY3Rpb24oJGVsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsIDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkZWxlWzBdLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSAkZWxlWzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSAkZWxlWzFdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKiovXG4gICAgICAgICAgICAgICAgYWRUeXBlIDogXCJzZWxlY3QuanMtdHlwZVwiICxcbiAgICAgICAgICAgICAgICBlbnRpdHlJZCA6IFwiaW5wdXRbbmFtZT1pZF1cIlxuICAgICAgICAgICAgfSBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGZvcm0ub24oXCJmb3JtLXN1Ym1pdFwiLGZ1bmN0aW9uKGUsZGF0YSl7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbS5kYXRhKFwiZ2V0X2RhdGFcIixmdW5jdGlvbigpe1xuICAgICAgICAgICByZXR1cm4gJGZvcm0uZGF0YShcImlmb3JtXCIpLmdldF9zdWJtaXRfZGF0YSgpOyBcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkb20uZGF0YShcIml0ZW1cIixkYXRhKTtcbiAgICAgICAgICAgIGRvbS5maW5kKFwiaW5wdXRbbmFtZT1hZF9pZF1cIikudmFsKGRhdGEuaWQpO1xuICAgICAgICAgICAgaWYgKGRhdGEuaW1hZ2VVcmwpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1nID0gZGF0YS5pbWFnZVVybDtcbiAgICAgICAgICAgICAgICBkb20uZmluZChcImRpdi5qcy1pbWdib3hcIikuaHRtbCgnPGltZyBzcmM9XCInK2ltZysnXCIgPicpO1xuICAgICAgICAgICAgICAgIGRvbS5maW5kKFwiaW5wdXRbbmFtZT1pbWFnZV91cmxdXCIpLnZhbChpbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGEuYWRUeXBlICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBkb20uZmluZChcInNlbGVjdC5qcy10eXBlXCIpLnZhbChkYXRhLmFkVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YS5lbnRpdHlJZCkge1xuICAgICAgICAgICAgICAgZG9tLmZpbmQoXCJpbnB1dFtuYW1lPWlkXVwiKS52YWwoZGF0YS5lbnRpdHlJZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn0pO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgdGVtcGxhdGUgPSBqdWljZXIudGVtcGxhdGUsIHRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzIHx8IHt9O1xudmFyIHRwbCA9IHRlbXBsYXRlc1snaG9tZV9hZF9pdGVtLnRtcGwnXSA9IGZ1bmN0aW9uKF8sIF9tZXRob2QpIHtfbWV0aG9kID0ganVpY2VyLm9wdGlvbnMuX21ldGhvZDtcbid1c2Ugc3RyaWN0Jzt2YXIgXz1ffHx7fTt2YXIgX291dD0nJztfb3V0Kz0nJzsgdHJ5IHsgX291dCs9Jyc7IHZhciBkaXY9Xy5kaXY7dmFyIGl0ZW09Xy5pdGVtO3ZhciBsZz1fLmxnO3ZhciBoZWFkaW5nPV8uaGVhZGluZzt2YXIgc3Bhbj1fLnNwYW47dmFyIHJpZ2h0PV8ucmlnaHQ7dmFyIGE9Xy5hO3ZhciB0aW1lcz1fLnRpbWVzO3ZhciBib2R5PV8uYm9keTt2YXIgc209Xy5zbTt2YXIgZm9ybT1fLmZvcm07dmFyIGhvcml6b250YWw9Xy5ob3Jpem9udGFsO3ZhciBpbnB1dD1fLmlucHV0O3ZhciBncm91cD1fLmdyb3VwO3ZhciBsYWJlbD1fLmxhYmVsO3ZhciBjb250cm9sPV8uY29udHJvbDt2YXIgYnRuPV8uYnRuO3ZhciBidXR0b249Xy5idXR0b247dmFyIHByaW1hcnk9Xy5wcmltYXJ5O3ZhciB1cGxvYWQ9Xy51cGxvYWQ7dmFyIGFsaWduPV8uYWxpZ247dmFyIGxlZnQ9Xy5sZWZ0O3ZhciBzZWxlY3Q9Xy5zZWxlY3Q7dmFyIHR5cGU9Xy50eXBlO3ZhciBub3Q9Xy5ub3Q7dmFyIGluaXQ9Xy5pbml0O3ZhciBvcHRpb249Xy5vcHRpb247dmFyIHVsPV8udWw7dmFyIHBpbGxzPV8ucGlsbHM7dmFyIHN0YWNrZWQ9Xy5zdGFja2VkO3ZhciBsaT1fLmxpO3ZhciBJRD1fLklEO3ZhciB3cmFwPV8ud3JhcDt2YXIgaW1nYm94PV8uaW1nYm94OyBfb3V0Kz0nIDxkaXYgY2xhc3M9XCJyb3cgYWktaXRlbVwiPiAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMlwiPiAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBjbGVhcmZpeFwiPiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiAgICAgICAgICAgICAgICAg6aaW6aG16L2u5pKtICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvb2xzIHB1bGwtcmlnaHRcIj4gICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJmYSBmYS10aW1lc1wiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj48L2E+ICAgICAgICAgICAgICAgICA8L3NwYW4+ICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS03XCI+ICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tZm9ybSBcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDoyMHB4O1wiPiAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzcz1cImZvcm0taG9yaXpvbnRhbFwiIGlkPVwic3ViamVjdF9mb3JtXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJhZF9pZFwiIHZhbHVlPVwiXCIgPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic3ViamVjdF9sb2dvXCIgY2xhc3M9XCJjb2wtc20tMyBjb250cm9sLWxhYmVsXCIgPuWbvueJhzwvbGFiZWw+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS05IGlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cImltYWdlX3VybFwiIHBsYWNlaG9sZGVyPVwi5Y+v5Lul5aGr6ZO+5o6l5Lmf5Y+v5Lul5LiK5LygXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGpzLXVwbG9hZFwiICB0eXBlPVwiYnV0dG9uXCIgPuS4iuS8oOWbvueJhzwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBoaWRlXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsICBjbGFzcz1cImNvbC1zbS0zIGNvbnRyb2wtbGFiZWxcIiA+5LiK5LiL57q/54q25oCBPC9sYWJlbD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTQgIGNvbnRyb2wtbGFiZWxcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDtcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInN0YXR1c18xXzBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg5LiL57q/ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cIjBcIiBuYW1lID1cInN0YXR1c18wXCIgaWQ9XCJzdGF0dXNfMV8wXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzdGF0aXNfMV8xXCIgc3R5bGU9XCJtYXJnaW4tbGVmdDoyMHB4O1wiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDkuIrnur8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwiMVwiIG5hbWUgPVwic3RhdHVzXzBcIiBpZD1cInN0YXR1c18xXzFcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiID7nsbvlnos8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTIgY29udHJvbC1sYWJlbFwiIHN0eWxlPVwidGV4dC1hbGlnbjpsZWZ0O1wiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwianMtdHlwZVwiIGRhdGEtbm90LWluaXQ9XCJ0cnVlXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMlwiPuS4k+mimDwvb3B0aW9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjBcIj7kuqflk4E8L29wdGlvbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxXCIgPuWVhumTujwvb3B0aW9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS01IGNvbnRyb2wtbGFiZWxcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDtcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi1waWxscyBuYXYtc3RhY2tlZFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPiBJRDo8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cIlwiIG5hbWU9XCJpZFwiID48L2xpPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgaGlkZVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgIGNsYXNzPVwiY29sLXNtLTMgY29udHJvbC1sYWJlbFwiID7lpIfms6jvvJo8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTkgaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwidGV4dFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT4gICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNVwiPiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW1nLXdyYXAganMtaW1nYm94XCI+ICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgPC9kaXY+ICAgICA8L2Rpdj4gPC9kaXY+ICAnOyB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9IF9vdXQrPScnO3JldHVybiBfb3V0O1xufTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGp1aWNlci50ZW1wbGF0ZXNbJ2hvbWVfYWRfaXRlbS50bXBsJ107Il19
