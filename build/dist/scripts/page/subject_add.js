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




},{"./icheckbox":3,"./jquery":7,"./jquery.placeholder.js":8,"./jvalidator/src/index.js":12,"./y-selector":14}],6:[function(require,module,exports){


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


},{"../mod/pop.js":16,"./idialog":4}],7:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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

},{"./AsyncRequest.js":9,"./RuleParser.js":10}],12:[function(require,module,exports){
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
 

},{"./Validator.js":11}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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



},{}],15:[function(require,module,exports){
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

},{"../lib/cookies":1}],16:[function(require,module,exports){
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



},{"../lib/idialog":4}],17:[function(require,module,exports){
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
        $("button.add-subject").html("保存").after($('<a href="/m/operation/subject_item_edit?subject_id='+subject_id+'" class="btn btn-info" >专题详情</a>'));

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
                $("#content").val(data.content);
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
       

function addSubject(){
    var $form = $("#subject_form");
    $form.form({
        data_map : {
            name : "#subject_name",
            imageUrl : "#subject_logo",
            detailImageUrl : "#detail-subject_logo",
            startDate : "#start_date",
            endDate : "#end_date",
            content : "#content"
        }
    });
    $form.on("form-submit",function(e,form_data){
        e.preventDefault();
        if (!(form_data.name && form_data.imageUrl)) {
            alert("没有填写完数据");
            return;
        }
        if (subject_id === void 0) {
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
        } else {
           form_data.id = subject_id;
           http.post({
                url : "/api/updateAlbum.htm",
                data : form_data,
                async : false

            }).done(function(rs){
                if (rs.ret == 1) {
                    var album = rs.album;
                    alert("更新专题成功");
                } else {
                    alert("添加失败");
                }
            }).fail(function(){
                alert("添加失败");
            }); 
        }
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
});

},{"../lib/iform.js":5,"../lib/iupload.js":6,"../lib/jquery.js":7,"../lib/search_params.js":13,"../mod/http.js":15}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9jb29raWVzLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2licm93c2VyLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2ljaGVja2JveC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9pZGlhbG9nLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2lmb3JtLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2l1cGxvYWQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanF1ZXJ5LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2pxdWVyeS5wbGFjZWhvbGRlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9qdmFsaWRhdG9yL3NyYy9Bc3luY1JlcXVlc3QuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanZhbGlkYXRvci9zcmMvUnVsZVBhcnNlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9qdmFsaWRhdG9yL3NyYy9WYWxpZGF0b3IuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanZhbGlkYXRvci9zcmMvaW5kZXguanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvc2VhcmNoX3BhcmFtcy5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi95LXNlbGVjdG9yLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbW9kL2h0dHAuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9tb2QvcG9wLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvcGFnZS9mYWtlX2VjOTViYjZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZG9jQ29va2llID0gKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAvKlxcXG4gIHwqfFxuICB8KnwgIDo6IGNvb2tpZXMuanMgOjpcbiAgfCp8XG4gIHwqfCAgQSBjb21wbGV0ZSBjb29raWVzIHJlYWRlci93cml0ZXIgZnJhbWV3b3JrIHdpdGggZnVsbCB1bmljb2RlIHN1cHBvcnQuXG4gIHwqfFxuICB8KnwgIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvRE9NL2RvY3VtZW50LmNvb2tpZVxuICB8KnxcbiAgfCp8ICBUaGlzIGZyYW1ld29yayBpcyByZWxlYXNlZCB1bmRlciB0aGUgR05VIFB1YmxpYyBMaWNlbnNlLCB2ZXJzaW9uIDMgb3IgbGF0ZXIuXG4gIHwqfCAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXG4gIHwqfFxuICB8KnwgIFN5bnRheGVzOlxuICB8KnxcbiAgfCp8ICAqIGRvY0Nvb2tpZXMuc2V0SXRlbShuYW1lLCB2YWx1ZVssIGVuZFssIHBhdGhbLCBkb21haW5bLCBzZWN1cmVdXV1dKVxuICB8KnwgICogZG9jQ29va2llcy5nZXRJdGVtKG5hbWUpXG4gIHwqfCAgKiBkb2NDb29raWVzLnJlbW92ZUl0ZW0obmFtZVssIHBhdGhdLCBkb21haW4pXG4gIHwqfCAgKiBkb2NDb29raWVzLmhhc0l0ZW0obmFtZSlcbiAgfCp8ICAqIGRvY0Nvb2tpZXMua2V5cygpXG4gIHwqfFxuICBcXCovXG5cbiAgdmFyIGRvY0Nvb2tpZXMgPSB7XG4gICAgZ2V0SXRlbTogZnVuY3Rpb24gKHNLZXkpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZG9jdW1lbnQuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChcIig/Oig/Ol58Lio7KVxcXFxzKlwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICsgXCJcXFxccypcXFxcPVxcXFxzKihbXjtdKikuKiQpfF4uKiRcIiksIFwiJDFcIikpIHx8IG51bGw7XG4gICAgfSxcbiAgICBzZXRJdGVtOiBmdW5jdGlvbiAoc0tleSwgc1ZhbHVlLCB2RW5kLCBzUGF0aCwgc0RvbWFpbiwgYlNlY3VyZSkge1xuICAgICAgaWYgKCFzS2V5IHx8IC9eKD86ZXhwaXJlc3xtYXhcXC1hZ2V8cGF0aHxkb21haW58c2VjdXJlKSQvaS50ZXN0KHNLZXkpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgdmFyIHNFeHBpcmVzID0gXCJcIjtcbiAgICAgIGlmICh2RW5kKSB7XG4gICAgICAgIHN3aXRjaCAodkVuZC5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICAgICAgc0V4cGlyZXMgPSB2RW5kID09PSBJbmZpbml0eSA/IFwiOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMjM6NTk6NTkgR01UXCIgOiBcIjsgbWF4LWFnZT1cIiArIHZFbmQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFN0cmluZzpcbiAgICAgICAgICAgIHNFeHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyB2RW5kO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBEYXRlOlxuICAgICAgICAgICAgc0V4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIHZFbmQudG9VVENTdHJpbmcoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBlbmNvZGVVUklDb21wb25lbnQoc0tleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChzVmFsdWUpICsgc0V4cGlyZXMgKyAoc0RvbWFpbiA/IFwiOyBkb21haW49XCIgKyBzRG9tYWluIDogXCJcIikgKyAoc1BhdGggPyBcIjsgcGF0aD1cIiArIHNQYXRoIDogXCJcIikgKyAoYlNlY3VyZSA/IFwiOyBzZWN1cmVcIiA6IFwiXCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuXG4gICAgcmVtb3ZlSXRlbTogZnVuY3Rpb24gKHNLZXksIHNQYXRoLCBzRG9tYWluKSB7XG4gICAgICBpZiAoIXNLZXkgfHwgIXRoaXMuaGFzSXRlbShzS2V5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChzS2V5KSArIFwiPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVFwiICsgKCBzRG9tYWluID8gXCI7IGRvbWFpbj1cIiArIHNEb21haW4gOiBcIlwiKSArICggc1BhdGggPyBcIjsgcGF0aD1cIiArIHNQYXRoIDogXCJcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhc0l0ZW06IGZ1bmN0aW9uIChzS2V5KSB7XG4gICAgICByZXR1cm4gKG5ldyBSZWdFeHAoXCIoPzpefDtcXFxccyopXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc0tleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XCIpKS50ZXN0KGRvY3VtZW50LmNvb2tpZSk7XG4gICAgfSxcbiAgICBrZXlzOiAvKiBvcHRpb25hbCBtZXRob2Q6IHlvdSBjYW4gc2FmZWx5IHJlbW92ZSBpdCEgKi8gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFLZXlzID0gZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLygoPzpefFxccyo7KVteXFw9XSspKD89O3wkKXxeXFxzKnxcXHMqKD86XFw9W147XSopPyg/OlxcMXwkKS9nLCBcIlwiKS5zcGxpdCgvXFxzKig/OlxcPVteO10qKT87XFxzKi8pO1xuICAgICAgZm9yICh2YXIgbklkeCA9IDA7IG5JZHggPCBhS2V5cy5sZW5ndGg7IG5JZHgrKykgeyBhS2V5c1tuSWR4XSA9IGRlY29kZVVSSUNvbXBvbmVudChhS2V5c1tuSWR4XSk7IH1cbiAgICAgIHJldHVybiBhS2V5cztcbiAgICB9XG4gIH07XG4gIHJldHVybiBkb2NDb29raWVzO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gIGRvY0Nvb2tpZTtcblxuIiwiLy/mtY/op4jlmajliKTmlq1cbnZhciB1YSAgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLFxuICAgIGNoZWNrID0gZnVuY3Rpb24ocil7XG4gICAgICAgIHJldHVybiByLnRlc3QodWEpO1xuICAgIH07XG52YXIgaXNPcGVyYSAgPSAgY2hlY2soL29wZXJhLyksXG4gICAgaXNDaHJvbWUgPSBjaGVjaygvXFxiY2hyb21lXFxiLyksXG4gICAgaXNXZWJLaXQgPSBjaGVjaygvd2Via2l0LyksXG4gICAgaXNTYWZhcmkgPSAhaXNDaHJvbWUgJiYgaXNXZWJLaXQsXG4gICAgaXNJRSAgICAgPSBjaGVjaygvbXNpZS8pICYmIGRvY3VtZW50LmFsbCAmJiAhaXNPcGVyYSxcbiAgICBpc0lFNyAgICA9IGNoZWNrKC9tc2llIDcvKSxcbiAgICBpc0lFOCAgICA9IGNoZWNrKC9tc2llIDgvKSxcbiAgICBpc0lFOSAgICA9IGNoZWNrKC9tc2llIDkvKSxcbiAgICBpc0lFMTAgICAgPSBjaGVjaygvbXNpZSAxMC8pLFxuICAgIGlzSUU2ICAgID0gaXNJRSAmJiAhaXNJRTcgJiYgIWlzSUU4ICYmICFpc0lFOSAmJiAhaXNJRTEwLFxuICAgIGlzSUUxMSAgID0gY2hlY2soL3RyaWRlbnQvKSAmJiB1YS5tYXRjaCgvcnY6KFtcXGQuXSspLyk/dHJ1ZTpmYWxzZSxcbiAgICBpc0dlY2tvICA9IGNoZWNrKC9nZWNrby8pICYmICFpc1dlYktpdCxcbiAgICBpc01hYyAgICA9IGNoZWNrKC9tYWMvKTtcblxudmFyIEJyb3dzZXIgPSB7XG4gICAgaXNPcGVyYSA6IGlzT3BlcmEsXG4gICAgaXNDaHJvbWUgOiBpc0Nocm9tZSxcbiAgICBpc1dlYktpdCA6IGlzV2ViS2l0LFxuICAgIGlzU2FmYXJpIDogaXNTYWZhcmksXG4gICAgaXNJRSAgICAgOiBpc0lFLFxuICAgIGlzSUU3ICAgIDogaXNJRTcsXG4gICAgaXNJRTggICAgOiBpc0lFOCxcbiAgICBpc0lFOSAgICA6IGlzSUU5LFxuICAgIGlzSUU2ICAgIDogaXNJRTYsXG4gICAgaXNJRTExICAgIDppc0lFMTEsXG4gICAgaXNHZWNrbyAgOiBpc0dlY2tvLFxuICAgIGlzTWFjICAgIDogaXNNYWNcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEJyb3dzZXI7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4vanF1ZXJ5Jyk7XG5cbnZhciBDaGVja2JveCA9IGZ1bmN0aW9uKGRvbSl7XG4gICAgdGhpcy5fJGRvbSA9IGRvbTtcbiAgICB0aGlzLl8kY2hlY2tib3ggPSBkb20uZmluZChcImlucHV0W3R5cGU9Y2hlY2tib3hdXCIpO1xuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5DaGVja2JveC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGNoZWNrZWQgPSB0aGlzLl8kY2hlY2tib3guYXR0cihcImNoZWNrZWRcIik7XG4gICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgdGhpcy5fJGRvbS5hZGRDbGFzcyhcImNoZWNrZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fJGRvbS5yZW1vdmVDbGFzcyhcImNoZWNrZWRcIik7XG4gICAgfVxuICAgIHRoaXMuX2xpc3Rlbl9kb21fZXZlbnQoKTtcbn1cbkNoZWNrYm94LnByb3RvdHlwZS5fbGlzdGVuX2RvbV9ldmVudCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG1lID0gdGhpcyAsIGNoZWNrYm94ID0gdGhpcy5fJGNoZWNrYm94O1xuICAgIHRoaXMuXyRkb20uY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgIGlmIChjaGVja2JveC5hdHRyKFwiY2hlY2tlZFwiKSkge1xuICAgICAgICAgICAgbWUudW5jaGVjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWUuY2hlY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5DaGVja2JveC5wcm90b3R5cGUudW5jaGVjayA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5fJGNoZWNrYm94LnJlbW92ZUF0dHIoXCJjaGVja2VkXCIpO1xuICAgIHRoaXMuXyRkb20ucmVtb3ZlQ2xhc3MoXCJjaGVja2VkXCIpO1xufVxuXG5DaGVja2JveC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuXyRjaGVja2JveC5hdHRyKFwiY2hlY2tlZFwiLHRydWUpO1xuICAgIHRoaXMuXyRkb20uYWRkQ2xhc3MoXCJjaGVja2VkXCIpO1xufVxuXG4kLmZuLmNoZWNrYm94ID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGRhdGEgPSAkdGhpcy5kYXRhKFwiaWNoZWNrYm94XCIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAkdGhpcy5kYXRhKFwiaWNoZWNrYm94XCIsKGRhdGEgPSBuZXcgQ2hlY2tib3goJHRoaXMpKSk7ICAgIFxuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJ2YXIgQnJvd3NlciA9IHJlcXVpcmUoXCIuL2licm93c2VyXCIpO1xyXG52YXIgRGlhbG9nICA9IChmdW5jdGlvbigkLHdpbmRvdyl7XHJcblx0XHR2YXIgX2lzSUUgID0gQnJvd3Nlci5pc0lFLFxyXG5cdFx0ICAgIF9pc0lFNiA9IEJyb3dzZXIuaXNJRTYsXHJcblx0XHRcdCRkb2MgICA9ICQod2luZG93LmRvY3VtZW50KSxcclxuXHRcdFx0JGJvZHkgID0gJCgnYm9keScpLFxyXG5cdFx0XHQkd2luICAgPSAkKHdpbmRvdyk7IFxyXG4gICAgICAgIHZhciBJRTZfTEVGVF9PRkZTRVQgPSAxNjsgLy9JRTbkuIvmu5HliqjmnaHnmoTlrr3luqZcclxuXHRcdHZhciBfaXNNYWMgPSBCcm93c2VyLmlzTWFjO1xyXG5cdFx0dmFyIGhhc1Njcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgIC8v6Ziy5q2i5byV55SoSlPmlofku7blnKhoZWFkIOmHjOWPluS4jeWIsGJvZHlcclxuICAgICAgICBpZiAoISRib2R5WzBdKSB7XHJcbiAgICAgICAgICAgICQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRib2R5ID0gICQoJ2JvZHknKTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+iDjOaZryDliY3mma8gXHJcblx0XHR2YXIgZGxnX21hc2tfaHRtbCA9ICc8ZGl2IGNsYXNzPVwiZy1wb3AtYmdcIj48L2Rpdj4nLFxyXG5cdFx0XHRkbGdfYm94X2h0bWwgPSAnPGRpdiBjbGFzcz1cImdfZGxnX2JveCBnLXBvcFwiPjwvZGl2Pic7XHJcblxyXG5cdFx0dmFyIGRsZ2lkID0gXCJkbGdcIixcclxuICAgICAgICAgICAgbWlkcz0wICwgXHJcbiAgICAgICAgICAgIGlkcyA9IDAsXHJcblx0XHRcdF9kX3ppbmRleCA9IDEwMDAwMDtcclxuXHJcblx0XHR2YXIgZGVmX2NvbmZpZyA9IHtcclxuXHRcdFx0Y29udGVudDonJyxcclxuXHRcdFx0bWFza1Zpc2libGUgOiB0cnVlLFxyXG5cdFx0XHR0b3A6MCxcclxuXHRcdFx0bGVmdDowLFxyXG5cdFx0XHR3aWR0aDowLFxyXG5cdFx0XHRoZWlnaHQ6MCxcclxuXHRcdFx0bmV3TWFzayA6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50U3R5bGUgOiBcIlwiLFxyXG5cdFx0XHRib3JkZXJTdHlsZSA6XCJcIiwgIC8vIGJvcmRlcuagt+W8jyBcclxuXHRcdFx0dGl0bGVTdHlsZSA6IFwiXCIsIC8v5qCH6aKY5qC35byPXHJcblx0XHRcdGNsb3NlQ2xzICA6IFwiXCIsIC8v5YWz6Zet5oyJ6ZKuIGNsYXNzIOWmguaenOacieS8muabv+aNouaOiSDljp/mnaXnmoQgZGxnX2Nsb3NlIFxyXG4gICAgICAgICAgICBjbG9zZV9mbiA6IGZ1bmN0aW9uKCl7fSxcclxuXHRcdFx0aGlkZUNsb3NlQnRuOiBmYWxzZVxyXG5cdFx0fTtcclxuXHRcdC8vIG1peCBjb25maWcgc2V0dGluZy5cclxuXHRcdHZhciBtaXhfY2ZnID0gZnVuY3Rpb24obiwgZCkge1xyXG5cdFx0XHR2YXIgY2ZnID0ge30sXHJcblx0XHRcdFx0aTtcclxuXHRcdFx0Zm9yIChpIGluIGQpIHtcclxuXHRcdFx0XHRpZiAoZC5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG5cdFx0XHRcdFx0Y2ZnW2ldID0gdHlwZW9mIG5baV0gIT09ICd1bmRlZmluZWQnID8gbltpXSA6IGRbaV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjZmc7XHJcblx0XHR9XHJcblx0XHR2YXIgZ2V0V2luUmVjdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHdpbiA9ICR3aW47XHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcCA6ICAkZG9jLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0c2Nyb2xsTGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0d2lkdGggOiB3aW4ud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgOiB3aW4uaGVpZ2h0KClcclxuICAgICAgICAgICAgICAgICAgICAvL3dpZHRoOiB3aW5bMF0uaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCxcclxuXHRcdFx0XHRcdC8vaGVpZ2h0OiB3aW5bMF0uaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodFxyXG5cdFx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBfbWFza19pZCA9IFwiZGxnX21hc2tfXCI7XHJcblx0XHR2YXIgTWFzayA9IGZ1bmN0aW9uKCl7XHJcblx0XHQgICAgdGhpcy5pZCA9IF9tYXNrX2lkKygrK21pZHMpO1xyXG5cdFx0XHR0aGlzLl9kb20gPSAkKCc8ZGl2IGlkPVwiJysodGhpcy5pZCkrJ1wiIGNsYXNzPVwiZy1wb3AtYmdcIiBzdHlsZT1cInotaW5kZXg6JysoKytfZF96aW5kZXgpKydcIj48L2Rpdj4nKTtcclxuXHRcdFx0dGhpcy5faW5pdCgpO1xyXG5cdFx0fTtcclxuXHQgXHRNYXNrLnByb3RvdHlwZSA9IHtcclxuXHRcdFx0X2luaXQgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCRib2R5LmFwcGVuZCh0aGlzLl9kb20pO1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5oaWRlKCk7XHJcblx0XHRcdFx0dGhpcy5faW5pdEV2ZW50cygpO1xyXG5cdFx0XHRcdHRoaXMuYWRhcHRXaW4oKTtcclxuXHRcdFx0XHRpZih0aGlzLl9uZWVkSWZyYW1lKCkpe1xyXG5cdFx0XHRcdFx0dGhpcy5fY3JlYXRlSWZyYW1lKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0X2luaXRFdmVudHMgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdF9jcmVhdGVJZnJhbWU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5faWZyYW1lID0gJCgnPGlmcmFtZSBjbGFzcz1cImRsZ19taWZyYW1lXCIgZnJhbWVib3JkZXI9XCIwXCIgc3JjPVwiYWJvdXQ6YmxhbmtcIj48L2lmcmFtZT4nKTtcclxuXHRcdFx0XHR0aGlzLl9kb20uYXBwZW5kKHRoaXMuX2lmcmFtZSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFkZENsYXNzIDogZnVuY3Rpb24oIGNsc05hbWUpe1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5hZGRDbGFzcyhjbHNOYW1lKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIOajgOa1i+iHquWKqOeUn+aIkGlmcmFtZeadoeS7tlxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBAbWV0aG9kXHJcblx0XHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdFx0ICogQHBhcmFtIHZvaWRcclxuXHRcdFx0ICogQHJldHVybiB7Ym9vbH1cclxuXHRcdFx0ICovXHJcblx0XHRcdF9uZWVkSWZyYW1lOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIHVzZUlmcmFtZSA9ICEhd2luZG93LkFjdGl2ZVhPYmplY3RcclxuXHRcdFx0XHRcdFx0XHRcdCYmICgoX2lzSUU2ICYmICQoJ3NlbGVjdCcpLmxlbmd0aClcclxuXHRcdFx0XHRcdFx0XHRcdHx8ICQoJ29iamVjdCcpLmxlbmd0aCk7XHJcblx0XHRcdFx0cmV0dXJuIHVzZUlmcmFtZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YWRhcHRXaW4gOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmKF9pc0lFNil7XHJcblx0XHRcdFx0XHR0aGlzLl9kb20uY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wIDogJGRvYy5zY3JvbGxUb3AoKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgOiAkZG9jLnNjcm9sbExlZnQoKSxcclxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAkd2luLmhlaWdodCgpLFxyXG5cdFx0XHRcdFx0XHR3aWR0aDogJHdpbi53aWR0aCgpXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGhpZGUgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbF9kb20gPSAkKCdodG1sJykuY3NzKFwib3ZlcmZsb3dcIixcIlwiKTtcclxuXHRcdFx0XHRpZihfaXNNYWMgPT0gZmFsc2UgfHwgMSl7XHJcblx0XHRcdFx0XHRpZihoYXNTY3JvbGwpe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaHRtbF9kb20uY3NzKFwicGFkZGluZy1yaWdodFwiLFwiMHB4XCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0c2hvdyA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG5cdFx0XHRcdHZhciB3YSA9ICR3aW4ud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sX2RvbSA9ICQoJ2h0bWwnKS5jc3MoXCJvdmVyZmxvd1wiLFwiaGlkZGVuXCIpO1xyXG5cdFx0XHRcdHZhciB3YiA9ICR3aW4ud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIG1lLl9kb20uc2hvdygpO1xyXG5cdFx0XHRcdGlmKF9pc01hYyA9PSBmYWxzZSB8fCAxKXtcclxuXHRcdFx0XHRcdGlmKHdhICE9IHdiKXtcclxuXHRcdFx0XHRcdFx0aGFzU2Nyb2xsID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0aHRtbF9kb20uY3NzKFwicGFkZGluZy1yaWdodFwiLElFNl9MRUZUX09GRlNFVCtcInB4XCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RG9tIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZG9tO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5fZG9tLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1vc3RfbWFzazsgLy/lhazlhbHnmoRNYXNrXHJcblx0XHR2YXIgRGlhbG9nID0gIGZ1bmN0aW9uKGNmZyl7XHJcblx0XHRcdHZhciBjID0gY2ZnIHx8IHt9O1xyXG5cdFx0XHR0aGlzLmNvbmZpZyA9ICBtaXhfY2ZnKGMsZGVmX2NvbmZpZyk7XHJcblx0XHRcdHRoaXMuX2luaXQoKTtcclxuXHRcdH1cclxuXHRcdERpYWxvZy5wcm90b3R5cGUgPSB7XHJcblx0XHRcdGNvbnN0cnVjdG9yIDogRGlhbG9nLFxyXG5cdFx0XHRfaW5pdCA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYoIXRoaXMuY29uZmlnKXtcclxuXHRcdFx0XHRcdHJldHVybiA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMuaWQgPSBkbGdpZCArKCsraWRzKTtcclxuXHRcdFx0XHR2YXIgY2ZnID0gIHRoaXMuY29uZmlnO1xyXG5cclxuXHRcdFx0XHRpZihjZmcubmV3TWFzayl7XHJcblx0XHRcdFx0XHR0aGlzLl9tYXNrID0gIG5ldyBNYXNrKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZighbW9zdF9tYXNrKXtcclxuXHRcdFx0XHRcdFx0bW9zdF9tYXNrID0gIG5ldyBNYXNrKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuX21hc2sgPSBtb3N0X21hc2s7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWFzayA9ICBtb3N0X21hc2s7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuX2NyZWF0RGlhbG9nKCk7XHJcblx0XHRcdFx0dGhpcy5faW5pdEV2ZW50cygpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdGVkID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0X2luaXRFdmVudHMgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBtZSA9IHRoaXMsaWQ9dGhpcy5pZDtcclxuXHJcblx0XHRcdFx0dGhpcy5fY2xvc2VCdG4uYmluZCh7XHJcblx0XHRcdFx0XHRjbGljayA6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmNsb3NlKCk7XHJcblx0XHRcdFx0XHRcdG1lLmNvbmZpZy5jbG9zZV9mbi5jYWxsKG1lLG1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQkd2luLmJpbmQoXCJyZXNpemUuXCIraWQscmVzaXplKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRtZS5fdW5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCR3aW4udW5iaW5kKFwicmVzaXplLlwiK2lkKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIHJlc2l6ZSgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfaXNJRTYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RsZ19jb250YWluZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA6ICRkb2Muc2Nyb2xsVG9wKCksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0XHQgICAgd2lkdGggOiAkd2luLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdCAgICBoZWlnaHQgOiAkd2luLmhlaWdodCgpXHJcblx0XHRcdFx0XHQgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RsZ19jb250YWluZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoIDogJHdpbi53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogJHdpbi5oZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0XHRtZS50b0NlbnRlcigpO1xyXG5cdFx0XHRcdFx0bWUuX21hc2suYWRhcHRXaW4oKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRfY3JlYXREaWFsb2cgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBjZmcgPSB0aGlzLmNvbmZpZztcclxuXHRcdFx0XHR2YXIgZGxnX2NvbnRhaW5lciA9IHRoaXMuX2RsZ19jb250YWluZXIgPSAkKGRsZ19ib3hfaHRtbCkuYXR0cihcImlkXCIsdGhpcy5pZCkuY3NzKFwiei1pbmRleFwiLChfZF96aW5kZXggKz0gMTApKTtcclxuXHRcdFx0XHRpZihjZmcuY29udGVudCBpbnN0YW5jZW9mICQpe1xyXG5cdFx0XHRcdFx0dGhpcy5fZGlhbG9nID0gY2ZnLmNvbnRlbnQ7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0aGlzLl9kaWFsb2cgPSAkKGNmZy5jb250ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGRsZyA9IHRoaXMuX2RpYWxvZztcclxuXHRcdFx0XHRkbGcuYWRkQ2xhc3MoXCJnX2RsZ193cmFwX2NzczNcIik7XHRcclxuXHRcdFx0XHRkbGdfY29udGFpbmVyLmh0bWwoZGxnKTtcclxuXHRcdFx0XHR0aGlzLl9jb250ZW50ID0gJChcIi5qc19jb250ZW50XCIsZGxnKTtcclxuXHRcdFx0XHR0aGlzLl9jbG9zZUJ0biA9ICQoJy5qc19jbG9zZScsZGxnKTtcclxuXHRcdFx0XHQkYm9keS5hcHBlbmQoZGxnX2NvbnRhaW5lcik7XHJcblxyXG5cdFx0XHRcdGlmKGNmZy5oaWRlQ2xvc2VCdG4pe1xyXG5cdFx0XHRcdFx0dGhpcy5fY2xvc2VCdG4uaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgcG9zID0gIFwiZml4ZWRcIjtcclxuXHRcdFx0XHRpZihfaXNJRTYpe1xyXG5cdFx0XHRcdFx0ZGxnX2NvbnRhaW5lci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgOiAkZG9jLnNjcm9sbFRvcCgpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0XHR3aWR0aCA6ICR3aW4ud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0aGVpZ2h0IDogJHdpbi5oZWlnaHQoKVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRwb3MgPSBcImFic291bHRlXCI7XHJcblx0XHRcdCAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRsZ19jb250YWluZXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0d2lkdGggOiAkd2luLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdGhlaWdodCA6ICR3aW4uaGVpZ2h0KClcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRsZy5jc3MoXCJwb3NpdGlvblwiLFwiYWJzb2x1dGVcIik7XHJcblx0XHRcdFx0dGhpcy5zZXRQb3MocG9zKTtcdFx0XHRcdFxyXG5cdFx0XHRcdC8vdGhpcy50b0NlbnRlcigpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXRQb3MgOiBmdW5jdGlvbihwb3Mpe1xyXG5cdFx0XHRcdHRoaXMuX2RsZ19jb250YWluZXIuY3NzKFwicG9zaXRpb25cIixwb3MpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvL+W+l+WIsGNvbnRlbnQg6L+U5ZuealF1ZXJ5IOWvueixoVxyXG5cdFx0XHRnZXRDb250YWluZXIgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9kbGdfY29udGFpbmVyO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRDb250ZW50IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY29udGVudDtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0Q29udGVudCA6IGZ1bmN0aW9uKGRvbSl7XHJcblx0XHRcdFx0dGhpcy5fY29udGVudC5lbXB0eSgpO1xyXG5cdFx0XHRcdHRoaXMuX2NvbnRlbnQuaHRtbChkb20pO1x0XHJcblx0XHRcdH0sXHJcbiAgICAgICAgICAgIGdldERsZ0RvbSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RpYWxvZzsgXHJcbiAgICAgICAgICAgIH0sXHJcblx0XHRcdGdldENsb3NlQnRuIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY2xvc2VCdG47XHJcblx0XHRcdH0sXHJcblx0XHRcdF9zZXRTdHlsZSA6IGZ1bmN0aW9uKGRvbSxjc3Mpe1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBjc3MgPT0gXCJzdHJpbmdcIil7XHJcblx0XHRcdFx0XHRpZihfaXNJRSl7XHJcblx0XHRcdFx0XHRcdGRvbVswXS5zdHlsZS5jc3NUZXh0ID0gY3NzO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGRvbS5hdHRyKFwic3R5bGVcIixjc3MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZG9tLmNzcyhjc3MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0dG9DZW50ZXIgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciB3aW5SZWN0ID0gIGdldFdpblJlY3QoKSxcclxuXHRcdFx0XHRcdHcgPSB0aGlzLl9kaWFsb2cud2lkdGgoKSxcclxuXHRcdFx0XHRcdGggPSB0aGlzLl9kaWFsb2cuaGVpZ2h0KCksXHJcblx0XHRcdFx0XHR0ID0gMCxsID0wO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcCA9IE1hdGgubWF4KCh3aW5SZWN0LmhlaWdodCAvIDIgLSBoIC8gMikgPj4wICsgdCwwKSA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGVmdCAgPSAod2luUmVjdC53aWR0aCAvIDIgLSB3IC8gMikgPj4wICsgbDtcclxuICAgICAgICAgICAgICAgIGlmIChfaXNJRTYpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0IC09IElFNl9MRUZUX09GRlNFVC8yO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdHZhciByZWN0ID0ge1xyXG5cdFx0XHRcdFx0bGVmdCA6XHRsZWZ0LFxyXG5cdFx0XHRcdCAgIFx0dG9wIDogIHRvcFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9kaWFsb2cuY3NzKHJlY3QpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cdFx0ICAgIHNob3cgOiBmdW5jdGlvbihjYWxsYmFjayxjb250ZXh0KXtcclxuXHRcdFx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKG1lLmNvbmZpZy5tYXNrVmlzaWJsZSl7XHJcblx0XHRcdFx0XHRtZS5fbWFzay5zaG93KCk7XHJcblx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgLy9JRTgg5Lul5LiL6K6h566X56qX5Y+j5a695bqmXHJcbiAgICAgICAgICAgICAgICBtZS5fZGxnX2NvbnRhaW5lci5jc3Moe3dpZHRoOlwiMTAwJVwiLGhlaWdodDpcIjEwMCVcIn0pO1xyXG5cdFx0XHRcdG1lLl9kbGdfY29udGFpbmVyLnNob3coKTtcclxuXHRcdFx0XHRtZS50b0NlbnRlcigpO1xyXG5cdFx0XHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBtZSxtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG1lLnNob3dlZCA9IHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNsb3NlIDogZnVuY3Rpb24oY2FsbGJhY2ssY29udGV4dCl7XHJcblx0XHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0XHR0aGlzLl9tYXNrLmhpZGUoKTtcclxuXHRcdFx0XHR0aGlzLl9kbGdfY29udGFpbmVyLmhpZGUoKTtcclxuXHRcdFx0XHRpZihjYWxsYmFjayl7XHJcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKGNvbnRleHQgfHwgbWUsbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnNob3dlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZXN0b3J5IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdFx0dGhpcy5fdW5iaW5kRXZlbnRzKCk7XHJcblx0XHRcdFx0dGhpcy5jb25maWcubmV3TWFzayAmJiB0aGlzLl9tYXNrLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMuX2RsZ19jb250YWluZXIucmVtb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5fZGlhbG9nLnJlbW92ZSgpO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiB0aGlzKXtcclxuXHRcdFx0XHRcdGRlbGV0ZSB0aGlzW2ldXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRNYXNrIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fbWFzaztcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9XHJcblx0XHREaWFsb2cucHJvdG90eXBlLkluID0gRGlhbG9nLnByb3RvdHlwZS5zaG93O1xyXG5cdFx0RGlhbG9nLnByb3RvdHlwZS5vdXQgPSBEaWFsb2cucHJvdG90eXBlLmNsb3NlO1xyXG5cdFx0RGlhbG9nLnByb3RvdHlwZS5oaWRlID0gRGlhbG9nLnByb3RvdHlwZS5jbG9zZTtcclxuXHRcdERpYWxvZy5wcm90b3R5cGUucmVtb3ZlID0gRGlhbG9nLnByb3RvdHlwZS5kZXN0b3J5O1xyXG5cdFx0XHJcblx0ICAgIFxyXG4gICAgcmV0dXJuIERpYWxvZztcclxuXHJcbn0pKGpRdWVyeSx3aW5kb3cpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEaWFsb2c7XHJcbiIsInZhciAkID0gcmVxdWlyZSgnLi9qcXVlcnknKTtcbnJlcXVpcmUoJy4vanZhbGlkYXRvci9zcmMvaW5kZXguanMnKTtcbnJlcXVpcmUoXCIuL2ljaGVja2JveFwiKTtcbnJlcXVpcmUoXCIuL3ktc2VsZWN0b3JcIik7XG5yZXF1aXJlKFwiLi9qcXVlcnkucGxhY2Vob2xkZXIuanNcIik7XG52YXIgdW5kZWY7XG52YXIgY3JlYXRlX3RpcCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIm0tdGlwIG0tdXAtdGlwIG0tYWxlcnQtdGlwIGhpZGVcIj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tdGlwLXRyZ1wiPlxcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRyZy1vdXRcIj48L2Rpdj5cXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0cmctaW5cIj48L2Rpdj5cXFxuICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXRpcC1jb250ZW50XCI+XFxcbiAgICAgICAgICAgICAgICA8cD48L3A+XFxcbiAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgIDwvZGl2Pic7XG4gICAgdmFyIGRvbSA9ICQoaHRtbCk7XG4gICAgcmV0dXJuIGRvbTsgXG59XG5cbnZhciBGb3JtID0gZnVuY3Rpb24ob3B0KXtcbiAgICB0aGlzLl8kZm9ybSA9IG9wdC5kb207XG4gICAgdGhpcy5fZGF0YV9tYXAgPSBvcHQuZGF0YV9tYXA7ICAgIFxuICAgIHRoaXMuX2p2X3N1YyA9IG9wdC5qdl9zdWM7XG4gICAgdGhpcy5fanZfZXJyID0gb3B0Lmp2X2VycjtcbiAgICB0aGlzLl9jdXNfanYgPSBvcHQuanZfY3VzdG9tIHx8ICQubm9vcDtcbiAgICB0aGlzLmluaXQoKTtcbn1cblxuRm9ybS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG1lID0gdGhpcyAsXG4gICAgICAgIGp2ID0gdGhpcy5fJGZvcm0uanZhbGlkYXRvcigpO1xuICAgIHRoaXMuX2p2ID0ganY7XG4gICAganYud2hlbihbXCJibHVyXCJdKTtcbiAgICBqdi5zdWNjZXNzKG1lLl9qdl9zdWMgfHwgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyICRkID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBpZiAoJGQuZGF0YShcInNob3ctZXJyb3JcIikpIHtcbiAgICAgICAgICAgIHZhciBlcnJfZG9tID0gJGQuZGF0YSgnZXJyb3ItZG9tJyk7XG4gICAgICAgICAgICBlcnJfZG9tICYmIGVycl9kb20uaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy5lbGVtZW50KS5yZW1vdmVDbGFzcyhcImVycm9yXCIpO1xuICAgIH0pO1xuXG4gICAganYuZmFpbChmdW5jdGlvbiggJGV2ZW50ICwgZXJyb3JzICl7XG4gICAgICAgIHZhciAkZCA9ICQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgdmFyIG1zZyA9IFwiXCI7XG4gICAgICAgIGZvcih2YXIgaT0wLGw9ZXJyb3JzLmxlbmd0aCA7aSA8IGw7aSsrKXtcbiAgICAgICAgICAgIGlmICghZXJyb3JzW2ldLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgIG1zZyA9IGVycm9yc1tpXS5nZXRNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWUuc2hvd19lcnJvcigkZCxtc2cpO1xuICAgIH0pOyBcblxuICAgIHRoaXMuX2N1c19qdihqdik7XG4gICAgdGhpcy5fJGZvcm0uZmluZChcImRpdltkYXRhLWNoZWNrYm94XVwiKS5jaGVja2JveCgpO1xuICAgIHRoaXMuXyRmb3JtLmZpbmQoXCJpbnB1dFtwbGFjZWhvbGRlcl0sdGV4dGFyZWFbcGxhY2Vob2xkZXJdXCIpLnBsYWNlaG9sZGVyKCk7XG4gICAgdGhpcy5fbGlzdGVuX2RvbV9ldmVudCgpO1xufVxuXG5Gb3JtLnByb3RvdHlwZS5zaG93X2Vycm9yID0gZnVuY3Rpb24oJGQsbXNnKXtcbiAgICB2YXIgdDtcbiAgICBpZiAodCA9ICRkLmRhdGEoXCJzaG93LWVycm9yXCIpKSB7XG4gICAgICAgIHZhciBlcnJfZG9tID0gJGQuZGF0YShcImVycm9yLWRvbVwiKTtcbiAgICAgICAgaWYgKCFlcnJfZG9tKSB7XG4gICAgICAgICAgICAkZC5kYXRhKFwiZXJyb3ItZG9tXCIsKGVycl9kb20gPSBjcmVhdGVfdGlwKCkpKTtcbiAgICAgICAgICAgIHZhciAkcCA9ICRkLnBhcmVudCgpO1xuICAgICAgICAgICAgdmFyICR3ID0gJHAud2lkdGgoKTtcbiAgICAgICAgICAgIGVycl9kb20ud2lkdGgoJHcpO1xuICAgICAgICAgICAgJHAuYXBwZW5kKGVycl9kb20pO1xuICAgICAgICB9XG4gICAgICAgIGVycl9kb20uZmluZChcInBcIikudGV4dChtc2cpO1xuICAgICAgICBlcnJfZG9tLnNob3coKTtcbiAgICB9XG4gICAgJGQuYWRkQ2xhc3MoXCJlcnJvclwiKTtcblxufVxuXG5Gb3JtLnByb3RvdHlwZS5fbGlzdGVuX2RvbV9ldmVudCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG1lID0gdGhpcztcbiAgICB0aGlzLl8kZm9ybS5vbihcInN1Ym1pdFwiLGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1lLnN1Ym1pdCgpO1xuICAgIH0pXG59XG5cbkZvcm0ucHJvdG90eXBlLl9wcmFzZV9mb3JtX3ZhbCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGRhdGFfbWFwID0gdGhpcy5fZGF0YV9tYXAsXG4gICAgICAgICRmb3JtID0gdGhpcy5fJGZvcm07XG4gICAgdmFyIGRhdGEgPSB7fTtcbiAgICBmb3IodmFyIGtleSBpbiBkYXRhX21hcCApe1xuICAgICAgICB2YXIgb2JqID0gZGF0YV9tYXBba2V5XTtcbiAgICAgICAgaWYoJC50eXBlKG9iaikgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICBkYXRhW2tleV0gPSAkZm9ybS5maW5kKG9iaikudmFsKCkgfHwgdW5kZWY7XG4gICAgICAgIH0gZWxzZSBpZiAoJC50eXBlKG9iaikgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgZGF0YVtrZXldID0gb2JqLnZhbCgkZm9ybS5maW5kKG9iai5jbHMpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cbkZvcm0ucHJvdG90eXBlLnN1Ym1pdCA9IGZ1bmN0aW9uKGFyZ3Nfb2JqKXtcbiAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgbWUuX2p2LnZhbGlkYXRlQWxsKGZ1bmN0aW9uKCByZXN1bHQgLCBlbGVtZW50cyApe1xuICAgICAgICBpZiggcmVzdWx0ICkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBtZS5fcHJhc2VfZm9ybV92YWwoKTtcbiAgICAgICAgICAgIG1lLl8kZm9ybS50cmlnZ2VyKFwiZm9ybS1zdWJtaXRcIixbZGF0YSxhcmdzX29ial0pO1xuICAgICAgICB9IFxuICAgIH0pO1xuXG59XG5cbkZvcm0ucHJvdG90eXBlLmdldF9zdWJtaXRfZGF0YSA9IEZvcm0ucHJvdG90eXBlLl9wcmFzZV9mb3JtX3ZhbDtcblxuJC5mbi5mb3JtID0gZnVuY3Rpb24ob3B0KXtcbiAgICBvcHQgPSBvcHQgfHwge307XG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGRhdGEgPSAkdGhpcy5kYXRhKFwiaWZvcm1cIik7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICB2YXIgX29wdCA9ICQuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICBkb20gOiAkdGhpc1xuICAgICAgICAgICAgfSxvcHQpO1xuICAgICAgICAgICAgJHRoaXMuZGF0YShcImlmb3JtXCIsKGRhdGEgPSAobmV3IEZvcm0oX29wdCkpKSk7XG4gICAgICAgIH1cbiAgICB9KTsgICBcbn1cblxuXG5cbiIsIlxuXG52YXIgcG9wID0gcmVxdWlyZShcIi4uL21vZC9wb3AuanNcIik7XG52YXIgRGlhbG9nID0gcmVxdWlyZShcIi4vaWRpYWxvZ1wiKTtcbnZhciBsb2FkaW5nID0ge1xuICAgIF9jcmVhdGUgOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibS1sb2FkaW5nXCI+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2FkaW5nLWJveFwiID48aW1nIHNyYz1cImh0dHA6Ly9hbWlseXN0YXRpYy5tZS9pbWFnZS9sb2FkaW5nLmdpZlwiID48L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYWRpbmctdGV4dC1ib3hcIj48cCBjbGFzcz1cImxvYWRpbmctdGV4dFwiPuato+WcqOS4iuS8oCzor7fnqI3lkI4uLi48L3A+PC9kaXY+XFxcbiAgICAgICAgPC9kaXY+JztcbiAgICAgICAgdmFyIGRsZyA9IG5ldyBEaWFsb2coe1xuICAgICAgICAgICAgY29udGVudCA6IGh0bWxcbiAgICAgICAgfSlcbiAgICAgICAgZGxnLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIGRsZztcbiAgICB9LFxuICAgIHNob3cgOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoIXRoaXMuX2RsZykge1xuICAgICAgICAgICAgdGhpcy5fZGxnID0gdGhpcy5fY3JlYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGxnLnNob3coKTtcbiAgICB9LFxuICAgIGhpZGUgOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9kbGcuaGlkZSgpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVfdXBsb2FkKG9wdCl7XG4gICAgdmFyIGV4dHMgPSBvcHQuZXh0ZW5zaW9ucyB8fCBbXCJqcGdcIixcInBuZ1wiLFwianBlZ1wiXTtcbiAgICB2YXIgZXh0c19zdHIgPSBleHRzLmpvaW4oXCIsXCIpO1xuICAgIHZhciB1cGxvYWRlciA9IG5ldyBwbHVwbG9hZC5VcGxvYWRlcih7XG4gICAgICAgIHJ1bnRpbWVzIDogJ2h0bWw1LGZsYXNoLGh0bWw0JyxcbiAgICAgICAgIFxuICAgICAgICBicm93c2VfYnV0dG9uIDogb3B0LmRvbSwgLy8geW91IGNhbiBwYXNzIGluIGlkLi4uXG4gICAgICAgIC8vY29udGFpbmVyOiBvcHQuY29udGFpbmVyLCAvLyAuLi4gb3IgRE9NIEVsZW1lbnQgaXRzZWxmXG4gICAgICAgICBcbiAgICAgICAgdXJsIDogb3B0LnVybCB8fCBcIi9hcGkvdXBsb2FkXCIsXG4gICAgICAgIHJlc2l6ZSA6IHtcbiAgICAgICAgICAgIHF1YWxpdHkgOiA1MFxuICAgICAgICB9LCBcbiAgICAgICAgZmlsdGVycyA6IHtcbiAgICAgICAgICAgIG1heF9maWxlX3NpemUgOiBvcHQuc2l6ZSB8fCAnMjBtYicsXG4gICAgICAgICAgICBwcmV2ZW50X2R1cGxpY2F0ZXM6IHRydWUsXG4gICAgICAgICAgICBtaW1lX3R5cGVzOiBbXG4gICAgICAgICAgICAgICAge3RpdGxlIDogXCLpgInmi6koXCIrZXh0c19zdHIrXCIp5qC85byP55qE5paH5Lu2XCIsIGV4dGVuc2lvbnMgOiBleHRzX3N0ciB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgIFxuICAgICAgICAvLyBGbGFzaCBzZXR0aW5nc1xuICAgICAgICBmbGFzaF9zd2ZfdXJsIDogJy91cGxvYWQvTW94aWUuc3dmJyxcbiAgICAgICAgbXVsdGlfc2VsZWN0aW9uIDogb3B0Lm11bHRpX3NlbGVjdGlvbiA9PSB2b2lkIDAgPyB0cnVlIDogb3B0Lm11bHRpX3NlbGVjdGlvbixcbiAgICAgXG4gICAgICAgIGluaXQ6IHtcbiAgICAgICAgICAgIFBvc3RJbml0OiBmdW5jdGlvbigpIHtcbiAgICAgXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwbG9hZGZpbGVzJykub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRlci5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAqKi9cbiAgICAgICAgICAgIH0sXG4gICAgIFxuICAgICAgICAgICAgRmlsZXNBZGRlZDogZnVuY3Rpb24odXAsIGZpbGVzKSB7XG4gICAgICAgICAgICAgICAgLy9wbHVwbG9hZC5lYWNoKGZpbGVzLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coXCJmaWxlXCIsZmlsZS5pZCk7XG4gICAgICAgICAgICAgICAgLy99KTtcbiAgICAgICAgICAgICAgICBpZiAob3B0LmNoZWNrICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHQuY2hlY2soZmlsZXMsdXApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlci5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0LnN0YXJ0ICYmIG9wdC5zdGFydCh1cCxmaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGVyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIG9wdC5zdGFydCAmJiBvcHQuc3RhcnQodXAsZmlsZXMpOyBcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZy5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgXG4gICAgICAgICAgICBVcGxvYWRQcm9ncmVzczogZnVuY3Rpb24odXAsIGZpbGUpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicHJvZ3Jlc3M9PT1cIixmaWxlLnBlcmNlbnQpO1xuICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlsZS5pZCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2InKVswXS5pbm5lckhUTUwgPSAnPHNwYW4+JyArIGZpbGUucGVyY2VudCArIFwiJTwvc3Bhbj5cIjtcbiAgICAgICAgICAgIH0sXG4gICAgIFxuICAgICAgICAgICAgRXJyb3I6IGZ1bmN0aW9uKHVwLCBlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBhbGVydChlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uc29sZScpLmlubmVySFRNTCArPSBcIlxcbkVycm9yICNcIiArIGVyci5jb2RlICsgXCI6IFwiICsgZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVXBsb2FkRmlsZSA6IGZ1bmN0aW9uKHVwLGZsaWUpe1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEZpbGVVcGxvYWRlZCA6IGZ1bmN0aW9uKHVwLGZpbGVzLHJlcyl7XG4gICAgICAgICAgICAgICAgdmFyIF9zdGF0dXMgPSByZXMuc3RhdHVzO1xuICAgICAgICAgICAgICAgIGxvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGlmIChfc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHh0ID0gcmVzLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2YWwoXCIoXCIrdHh0K1wiKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0LmNhbGxiYWNrICYmIG9wdC5jYWxsYmFjayhkYXRhLGZpbGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInRoaXMgID09PT1cIixhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgIFxuICAgIHVwbG9hZGVyLmluaXQoKTtcblxuICAgIHJldHVybiB1cGxvYWRlcjtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVfdXBsb2FkIDogY3JlYXRlX3VwbG9hZFxufVxuXG4iLCJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCIvKiEgaHR0cDovL210aHMuYmUvcGxhY2Vob2xkZXIgdjIuMC44IGJ5IEBtYXRoaWFzICovXG47KGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQpIHtcblxuXHQvLyBPcGVyYSBNaW5pIHY3IGRvZXNu4oCZdCBzdXBwb3J0IHBsYWNlaG9sZGVyIGFsdGhvdWdoIGl0cyBET00gc2VlbXMgdG8gaW5kaWNhdGUgc29cblx0dmFyIGlzT3BlcmFNaW5pID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHdpbmRvdy5vcGVyYW1pbmkpID09ICdbb2JqZWN0IE9wZXJhTWluaV0nO1xuXHR2YXIgaXNJbnB1dFN1cHBvcnRlZCA9ICdwbGFjZWhvbGRlcicgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSAmJiAhaXNPcGVyYU1pbmk7XG5cdHZhciBpc1RleHRhcmVhU3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpICYmICFpc09wZXJhTWluaTtcblx0dmFyIHByb3RvdHlwZSA9ICQuZm47XG5cdHZhciB2YWxIb29rcyA9ICQudmFsSG9va3M7XG5cdHZhciBwcm9wSG9va3MgPSAkLnByb3BIb29rcztcblx0dmFyIGhvb2tzO1xuXHR2YXIgcGxhY2Vob2xkZXI7XG5cblx0aWYgKGlzSW5wdXRTdXBwb3J0ZWQgJiYgaXNUZXh0YXJlYVN1cHBvcnRlZCkge1xuXG5cdFx0cGxhY2Vob2xkZXIgPSBwcm90b3R5cGUucGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwbGFjZWhvbGRlci5pbnB1dCA9IHBsYWNlaG9sZGVyLnRleHRhcmVhID0gdHJ1ZTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0cGxhY2Vob2xkZXIgPSBwcm90b3R5cGUucGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9IHRoaXM7XG5cdFx0XHQkdGhpc1xuXHRcdFx0XHQuZmlsdGVyKChpc0lucHV0U3VwcG9ydGVkID8gJ3RleHRhcmVhJyA6ICc6aW5wdXQnKSArICdbcGxhY2Vob2xkZXJdJylcblx0XHRcdFx0Lm5vdCgnLnBsYWNlaG9sZGVyJylcblx0XHRcdFx0LmJpbmQoe1xuXHRcdFx0XHRcdCdmb2N1cy5wbGFjZWhvbGRlcic6IGNsZWFyUGxhY2Vob2xkZXIsXG5cdFx0XHRcdFx0J2JsdXIucGxhY2Vob2xkZXInOiBzZXRQbGFjZWhvbGRlclxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcsIHRydWUpXG5cdFx0XHRcdC50cmlnZ2VyKCdibHVyLnBsYWNlaG9sZGVyJyk7XG5cdFx0XHRyZXR1cm4gJHRoaXM7XG5cdFx0fTtcblxuXHRcdHBsYWNlaG9sZGVyLmlucHV0ID0gaXNJbnB1dFN1cHBvcnRlZDtcblx0XHRwbGFjZWhvbGRlci50ZXh0YXJlYSA9IGlzVGV4dGFyZWFTdXBwb3J0ZWQ7XG5cblx0XHRob29rcyA9IHtcblx0XHRcdCdnZXQnOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHRcdHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cblx0XHRcdFx0dmFyICRwYXNzd29yZElucHV0ID0gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKTtcblx0XHRcdFx0aWYgKCRwYXNzd29yZElucHV0KSB7XG5cdFx0XHRcdFx0cmV0dXJuICRwYXNzd29yZElucHV0WzBdLnZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSAmJiAkZWxlbWVudC5oYXNDbGFzcygncGxhY2Vob2xkZXInKSA/ICcnIDogZWxlbWVudC52YWx1ZTtcblx0XHRcdH0sXG5cdFx0XHQnc2V0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUpIHtcblx0XHRcdFx0dmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcblxuXHRcdFx0XHR2YXIgJHBhc3N3b3JkSW5wdXQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xuXHRcdFx0XHRpZiAoJHBhc3N3b3JkSW5wdXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gJHBhc3N3b3JkSW5wdXRbMF0udmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodmFsdWUgPT0gJycpIHtcblx0XHRcdFx0XHRlbGVtZW50LnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0Ly8gSXNzdWUgIzU2OiBTZXR0aW5nIHRoZSBwbGFjZWhvbGRlciBjYXVzZXMgcHJvYmxlbXMgaWYgdGhlIGVsZW1lbnQgY29udGludWVzIHRvIGhhdmUgZm9jdXMuXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQgIT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSkge1xuXHRcdFx0XHRcdFx0Ly8gV2UgY2FuJ3QgdXNlIGB0cmlnZ2VySGFuZGxlcmAgaGVyZSBiZWNhdXNlIG9mIGR1bW15IHRleHQvcGFzc3dvcmQgaW5wdXRzIDooXG5cdFx0XHRcdFx0XHRzZXRQbGFjZWhvbGRlci5jYWxsKGVsZW1lbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygncGxhY2Vob2xkZXInKSkge1xuXHRcdFx0XHRcdGNsZWFyUGxhY2Vob2xkZXIuY2FsbChlbGVtZW50LCB0cnVlLCB2YWx1ZSkgfHwgKGVsZW1lbnQudmFsdWUgPSB2YWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGBzZXRgIGNhbiBub3QgcmV0dXJuIGB1bmRlZmluZWRgOyBzZWUgaHR0cDovL2pzYXBpLmluZm8vanF1ZXJ5LzEuNy4xL3ZhbCNMMjM2M1xuXHRcdFx0XHRyZXR1cm4gJGVsZW1lbnQ7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmICghaXNJbnB1dFN1cHBvcnRlZCkge1xuXHRcdFx0dmFsSG9va3MuaW5wdXQgPSBob29rcztcblx0XHRcdHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xuXHRcdH1cblx0XHRpZiAoIWlzVGV4dGFyZWFTdXBwb3J0ZWQpIHtcblx0XHRcdHZhbEhvb2tzLnRleHRhcmVhID0gaG9va3M7XG5cdFx0XHRwcm9wSG9va3MudmFsdWUgPSBob29rcztcblx0XHR9XG5cblx0XHQkKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gTG9vayBmb3IgZm9ybXNcblx0XHRcdCQoZG9jdW1lbnQpLmRlbGVnYXRlKCdmb3JtJywgJ3N1Ym1pdC5wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBDbGVhciB0aGUgcGxhY2Vob2xkZXIgdmFsdWVzIHNvIHRoZXkgZG9uJ3QgZ2V0IHN1Ym1pdHRlZFxuXHRcdFx0XHR2YXIgJGlucHV0cyA9ICQoJy5wbGFjZWhvbGRlcicsIHRoaXMpLmVhY2goY2xlYXJQbGFjZWhvbGRlcik7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0cy5lYWNoKHNldFBsYWNlaG9sZGVyKTtcblx0XHRcdFx0fSwgMTApO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBDbGVhciBwbGFjZWhvbGRlciB2YWx1ZXMgdXBvbiBwYWdlIHJlbG9hZFxuXHRcdCQod2luZG93KS5iaW5kKCdiZWZvcmV1bmxvYWQucGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5wbGFjZWhvbGRlcicpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMudmFsdWUgPSAnJztcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBhcmdzKGVsZW0pIHtcblx0XHQvLyBSZXR1cm4gYW4gb2JqZWN0IG9mIGVsZW1lbnQgYXR0cmlidXRlc1xuXHRcdHZhciBuZXdBdHRycyA9IHt9O1xuXHRcdHZhciByaW5saW5lalF1ZXJ5ID0gL15qUXVlcnlcXGQrJC87XG5cdFx0JC5lYWNoKGVsZW0uYXR0cmlidXRlcywgZnVuY3Rpb24oaSwgYXR0cikge1xuXHRcdFx0aWYgKGF0dHIuc3BlY2lmaWVkICYmICFyaW5saW5lalF1ZXJ5LnRlc3QoYXR0ci5uYW1lKSkge1xuXHRcdFx0XHRuZXdBdHRyc1thdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXR0cnM7XG5cdH1cblxuXHRmdW5jdGlvbiBjbGVhclBsYWNlaG9sZGVyKGV2ZW50LCB2YWx1ZSkge1xuXHRcdHZhciBpbnB1dCA9IHRoaXM7XG5cdFx0dmFyICRpbnB1dCA9ICQoaW5wdXQpO1xuXHRcdGlmIChpbnB1dC52YWx1ZSA9PSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSAmJiAkaW5wdXQuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyJykpIHtcblx0XHRcdGlmICgkaW5wdXQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKSkge1xuXHRcdFx0XHQkaW5wdXQgPSAkaW5wdXQuaGlkZSgpLm5leHQoKS5zaG93KCkuYXR0cignaWQnLCAkaW5wdXQucmVtb3ZlQXR0cignaWQnKS5kYXRhKCdwbGFjZWhvbGRlci1pZCcpKTtcblx0XHRcdFx0Ly8gSWYgYGNsZWFyUGxhY2Vob2xkZXJgIHdhcyBjYWxsZWQgZnJvbSBgJC52YWxIb29rcy5pbnB1dC5zZXRgXG5cdFx0XHRcdGlmIChldmVudCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybiAkaW5wdXRbMF0udmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkaW5wdXQuZm9jdXMoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlucHV0LnZhbHVlID0gJyc7XG5cdFx0XHRcdCRpbnB1dC5yZW1vdmVDbGFzcygncGxhY2Vob2xkZXInKTtcblx0XHRcdFx0aW5wdXQgPT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSAmJiBpbnB1dC5zZWxlY3QoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRQbGFjZWhvbGRlcigpIHtcblx0XHR2YXIgJHJlcGxhY2VtZW50O1xuXHRcdHZhciBpbnB1dCA9IHRoaXM7XG5cdFx0dmFyICRpbnB1dCA9ICQoaW5wdXQpO1xuXHRcdHZhciBpZCA9IHRoaXMuaWQ7XG5cdFx0aWYgKGlucHV0LnZhbHVlID09ICcnKSB7XG5cdFx0XHRpZiAoaW5wdXQudHlwZSA9PSAncGFzc3dvcmQnKSB7XG5cdFx0XHRcdGlmICghJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXRleHRpbnB1dCcpKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdCRyZXBsYWNlbWVudCA9ICRpbnB1dC5jbG9uZSgpLmF0dHIoeyAndHlwZSc6ICd0ZXh0JyB9KTtcblx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRcdCRyZXBsYWNlbWVudCA9ICQoJzxpbnB1dD4nKS5hdHRyKCQuZXh0ZW5kKGFyZ3ModGhpcyksIHsgJ3R5cGUnOiAndGV4dCcgfSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkcmVwbGFjZW1lbnRcblx0XHRcdFx0XHRcdC5yZW1vdmVBdHRyKCduYW1lJylcblx0XHRcdFx0XHRcdC5kYXRhKHtcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLXBhc3N3b3JkJzogJGlucHV0LFxuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItaWQnOiBpZFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5iaW5kKCdmb2N1cy5wbGFjZWhvbGRlcicsIGNsZWFyUGxhY2Vob2xkZXIpO1xuXHRcdFx0XHRcdCRpbnB1dFxuXHRcdFx0XHRcdFx0LmRhdGEoe1xuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItdGV4dGlucHV0JzogJHJlcGxhY2VtZW50LFxuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItaWQnOiBpZFxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5iZWZvcmUoJHJlcGxhY2VtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkaW5wdXQgPSAkaW5wdXQucmVtb3ZlQXR0cignaWQnKS5oaWRlKCkucHJldigpLmF0dHIoJ2lkJywgaWQpLnNob3coKTtcblx0XHRcdFx0Ly8gTm90ZTogYCRpbnB1dFswXSAhPSBpbnB1dGAgbm93IVxuXHRcdFx0fVxuXHRcdFx0JGlucHV0LmFkZENsYXNzKCdwbGFjZWhvbGRlcicpO1xuXHRcdFx0JGlucHV0WzBdLnZhbHVlID0gJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRpbnB1dC5yZW1vdmVDbGFzcygncGxhY2Vob2xkZXInKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzYWZlQWN0aXZlRWxlbWVudCgpIHtcblx0XHQvLyBBdm9pZCBJRTkgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIG9mIGRlYXRoXG5cdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvanF1ZXJ5LXBsYWNlaG9sZGVyL3B1bGwvOTlcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdFx0fSBjYXRjaCAoZXhjZXB0aW9uKSB7fVxuXHR9XG5cbn0odGhpcywgZG9jdW1lbnQsIGpRdWVyeSkpO1xuIiwidmFyIEFzeW5jUmVxdWVzdCA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5yZXFzID0gW107XG4gICAgdGhpcy5zdGF0dXMgPSAwOyAgICAvLzAtd2FpdGhpbmcsMS1ydW5uaW5nXG59XG5cbkFzeW5jUmVxdWVzdC5wcm90b3R5cGUuYWRkUmVxdWVzdCA9IGZ1bmN0aW9uKGZ1bmMpe1xuICAgIGlmKHRoaXMuc3RhdHVzIT0wKSByZXR1cm47XG4gICAgdGhpcy5yZXFzLnB1c2goZnVuYyk7XG59XG5cbkFzeW5jUmVxdWVzdC5wcm90b3R5cGUuZ28gPSBmdW5jdGlvbigpe1xuICAgIGlmKHRoaXMuc3RhdHVzIT0wKSByZXR1cm47XG4gICAgXG4gICAgdGhpcy5zdGF0dXMgPSAxOyAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlcXMgPSB0aGlzLnJlcXM7XG4gICAgdmFyIGxlbiA9IHRoaXMucmVxcy5sZW5ndGg7XG4gICAgXG4gICAgZm9yKHZhciBpPTA7aTxyZXFzLmxlbmd0aDtpKyspe1xuICAgICAgICB2YXIgcmVxID0gcmVxc1tpXTtcblxuICAgICAgICBpZih0aGlzLnN0YXR1cz09MCkgcmV0dXJuO1xuICAgICAgICByZXEoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vYXN5bmNfY29udGludWVcbiAgICAgICAgICAgIGxlbi0tO1xuICAgICAgICAgICAgaWYobGVuPT0wKXtcbiAgICAgICAgICAgICAgICBzZWxmLmZpbmlzaCgpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cbn1cblxuQXN5bmNSZXF1ZXN0LnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuc3RhdHVzID0gMDtcbiAgICBpZih0aGlzLm9uZmluaXNoZWQpe1xuICAgICAgICB0aGlzLm9uZmluaXNoZWQoKTtcbiAgICB9XG59XG5cbkFzeW5jUmVxdWVzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpe1xuICAgIGlmKHRoaXMuc3RhdHVzIT0wKSByZXR1cm47XG4gICAgdGhpcy5yZXFzID0gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXN5bmNSZXF1ZXN0OyIsInZhciBQQVJTRVIgPSB7fTtcblxuZnVuY3Rpb24gX3Rva2VuaXplZCggc3RyICkge1xuICAgIHZhciBzID0gW107XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHZhciBjaHIgPSBzdHIuY2hhckF0KGkpO1xuICAgICAgICBzd2l0Y2goIGNociApIHtcbiAgICAgICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgICAgY2FzZSAnKSc6XG4gICAgICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgcy5wdXNoKGNocik7XG4gICAgICAgICAgICAgICAgcy5wdXNoKCcnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcy5sZW5ndGggPyBzW3MubGVuZ3RoLTFdICs9IGNociA6IHMucHVzaChjaHIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzO1xufVxuXG52YXIgcmVnTmFtZSA9IC9eKEA/W1xcd1xcLV0rKShcXFsuK1xcXSk/JC87XG5cbmZ1bmN0aW9uIF9wYXJzZSggdG9rZW5zICkge1xuICAgIHZhciBhc3QgPSBbXTtcbiAgICB2YXIgbyA9IG51bGw7XG4gICAgdmFyIHRva2VuOyBcbiAgICB3aGlsZSggKHRva2VuID0gdG9rZW5zLnNoaWZ0KCkgKSAhPT0gdm9pZCAwICkge1xuICAgICAgICBpZiggIXRva2VuICkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoKCB0b2tlbiApIHtcbiAgICAgICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgICAgY2FzZSAnKSc6XG4gICAgICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgYXN0LnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogXG4gICAgICAgICAgICAgICAgdmFyIGEgPSB0b2tlbi5tYXRjaCggcmVnTmFtZSApO1xuICAgICAgICAgICAgICAgIGlmKCAhYSApIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmKCBhWzFdLmNoYXJBdCgwKSA9PSAnQCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIG8gPSB7IG5hbWUgOiAnQCcgLCBlbGVtTmFtZSA6IGFbMV0ucmVwbGFjZSgnQCcsJycpIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbyA9IHsgbmFtZSA6IGFbMV0gfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoICFQQVJTRVJbby5uYW1lXSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJub3QgZm91bmQgcGFyc2VyJ3MgbmFtZSA6IFwiICsgby5uYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiggYVsyXSApIG8udmFsdWUgPSBhWzJdLnJlcGxhY2UoJ1snLCcnKS5yZXBsYWNlKCddJywnJyk7XG4gICAgICAgICAgICAgICAgYXN0LnB1c2goIG8gKTtcbiAgICAgICAgICAgICAgICBvID0gbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXN0O1xufVxuXG4vLyDlop7liqDop6PmnpDlmahcbi8vICpuYW1lKiDop6PmnpDlmajlkI3np7Bcbi8vICpvcHRpb25zLmFyZ3VtZW50KiDluKbmnInlj4LmlbDvvIzpu5jorqTmsqHmnIlcbmV4cG9ydHMuYWRkID0gZnVuY3Rpb24oIG5hbWUgLCBvcHRpb25zICkge1xuICAgIFBBUlNFUltuYW1lXSA9IG9wdGlvbnMgfHwge307XG4gICAgUEFSU0VSW25hbWVdLm5hbWUgPSBuYW1lO1xufVxuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oIHN0ciApIHtcbiAgICB2YXIgdG9rZW5zID0gX3Rva2VuaXplZCggc3RyICk7XG4gICAgdmFyIGFzdCA9IF9wYXJzZSggdG9rZW5zICk7XG4gICAgcmV0dXJuIGFzdDtcbn0iLCJ2YXIgQXN5bmMgPSByZXF1aXJlKCcuL0FzeW5jUmVxdWVzdC5qcycpO1xudmFyIHBhcnNlciA9IHJlcXVpcmUoJy4vUnVsZVBhcnNlci5qcycpO1xuXG52YXIgUEFUVEVSTlMgPSB7fVxudmFyIENPTlNUQU5UID0ge1xuICAgIFBBVFRFUk4gOiBcImp2YWxpZGF0b3ItcGF0dGVyblwiICwgXG4gICAgUExBQ0VIT0xERVIgOiBcImp2YWxpZGF0b3ItcGxhY2Vob2xkZXJcIiAsIFxuICAgIENOQU1FIDogXCJqdmFsaWRhdG9yLWNuYW1lXCIgLCBcbiAgICBNRVNTQUdFX0FUVFIgOiBcIl9fanZhbGlkYXRvcl9tZXNzYWdlc19fXCIgLCBcbiAgICBGSUVMRF9FVkVOVFMgOiBcIl9fanZhbGlkYXRvcl9ldmVudHNfX1wiICwgXG4gICAgREVCVUcgOiBcImp2YWxpZGF0b3ItZGVidWdcIlxufVxuXG4vLyAjIyDlrZfmrrXmo4Dmn6Xlmahcbi8vIOe7keWumuWIsOafkOS4quWtl+auteWQju+8jOWvueWFtui/m+ihjOajgOafpeetieaTjeS9nFxuZnVuY3Rpb24gRmllbGRDaGVja2VyKCBlbGVtZW50ICkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnZm9ybScpO1xuICAgIHRoaXMuYXN5bmMgPSBuZXcgQXN5bmMoKTtcbn1cblxuRmllbGRDaGVja2VyLnByb3RvdHlwZSA9IHtcblxuICAgIF9nZXRQYXR0ZXJuTWVzc2FnZSA6IGZ1bmN0aW9uKCByZXN1bHRzICkgeyAgXG4gICAgICAgIHZhciByc3RyID0gW107XG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIHZhciBwID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgIGlmKCBwLm5hbWUgKSB7XG4gICAgICAgICAgICAgICAgcnN0ci5wdXNoKCBwLmdldE1lc3NhZ2UoKSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2goIHAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyYmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJzdHIucHVzaCgnIOW5tuS4lCAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd8fCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByc3RyLnB1c2goJyDmiJbogIUgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgICAgICAgICAgICAgICByc3RyLnB1c2goJ+S4jScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByc3RyLmpvaW4oJycpO1xuICAgIH0gLFxuXG4gICAgLy8g5qOA5p+l55Sf5oiQ57uT5p6c5bm26L+U5Zue6ZSZ6K+v5L+h5oGvXG4gICAgLy8gcmV0dXJuIGVycm9yc1xuICAgIF9jaGVja1BhdHRlcm5SZXN1bHQgOiBmdW5jdGlvbiggc3RyICwgcmVzdWx0cyApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcnN0ciA9IFtdO1xuICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICB2YXIgcCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICBpZiggcC5uYW1lICkge1xuICAgICAgICAgICAgICAgIHJzdHIucHVzaCggcC5yZXN1bHQgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcnN0ci5wdXNoKCBwICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy4kZm9ybS5hdHRyKCBcImRhdGEtXCIgKyBDT05TVEFOVC5ERUJVRykgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oIHRoaXMgLCB0aGlzLmVsZW1lbnQgLCBzdHIgLCByc3RyLmpvaW4oJycpIClcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbGwgPSBldmFsKCByc3RyLmpvaW4oJycpICk7XG4gICAgICAgIGlmKCBhbGwgKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYXJyID0gJC5ncmVwKCByZXN1bHRzICwgZnVuY3Rpb24oIGUgLCBpZHggKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5uYW1lICYmIGUucmVzdWx0ID09PSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXJyLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9nZXRQYXR0ZXJuTWVzc2FnZSggcmVzdWx0cyApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDpqozor4Hoh6rouqvnmoQgcGF0dGVybiDmmK/lkKblkIjms5Xku6Xlj4rmmK/lkKbmu6HotrPmiYDmnInpobnvvIzku6XkvpvlvIDlj5Hoh6rmtYvkvb/nlKhcbiAgICBjaGVja1BhdHRlcm4gOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50O1xuICAgICAgICB2YXIgcnVsZV9zdHIgPSAkZS5hdHRyKCBcImRhdGEtXCIgKyAgQ09OU1RBTlQuUEFUVEVSTiApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHBhdHRlcm5zID0gcGFyc2VyLnBhcnNlKCBydWxlX3N0ciApO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoIHRoaXMuZWxlbWVudCAsICfpqozor4Hlmajor63ms5XmnInplJnor6/vvIzor7fmo4Dmn6UnICwgcnVsZV9zdHIgKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoICfplJnor6/lj6/og73mmK/vvJonICwgZSApO1xuICAgICAgICB9XG4gICAgfSAsXG5cbiAgICAvLyAqIGRvbmUgKlxuICAgIC8vICDlj6/ku6XkuI3kvKDvvIzljbPkuLrop6blj5Hmo4Dmn6UgXG4gICAgLy8gIGBjaGVja1Jlc3VsdGAgYm9vbGVhbiDmo4Dmn6Xnu5PmnpwgXG4gICAgLy8gIGBldnRgIOS4uuinpuWPkeeahOS6i+S7tu+8jOWPr+S7peayoeaciVxuICAgIC8vICBgZXJyb3JzYCBhcnJheSDplJnor6/kv6Hmga9cbiAgICBjaGVjayA6IGZ1bmN0aW9uKCAkZXZlbnQgLCBjaGVja0NhbGxiYWNrICkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGFzeW5jID0gbmV3IEFzeW5jKCk7XG4gICAgICAgIHZhciBlID0gdGhpcy5lbGVtZW50O1xuICAgICAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50O1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnZhbHVlKCk7XG4gICAgICAgIHZhciBydWxlX3N0ciA9ICRlLmF0dHIoIFwiZGF0YS1cIiArICBDT05TVEFOVC5QQVRURVJOICk7XG4gICAgICAgIHZhciBwYXR0ZXJucyA9IHBhcnNlci5wYXJzZSggcnVsZV9zdHIgKTtcblxuICAgICAgICBhc3luYy5jbGVhcigpO1xuICAgICAgICBhc3luYy5vbmZpbmlzaGVkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSBzZWxmLl9jaGVja1BhdHRlcm5SZXN1bHQoIHJ1bGVfc3RyICwgcGF0dGVybnMgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VsZi5hZnRlcl9jaGVjayggZXJyb3JzLmxlbmd0aCA9PSAwICwgZXJyb3JzICwgJGV2ZW50ICk7XG4gICAgICAgICAgICBpZiAoIGNoZWNrQ2FsbGJhY2sgKSB7IGNoZWNrQ2FsbGJhY2soIGVycm9ycy5sZW5ndGggPT0gMCAsIGVycm9ycyApOyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJC5lYWNoKCBwYXR0ZXJucyAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvLyDot7Pov4fmiYDmnInorqHnrpflj5jph49cbiAgICAgICAgICAgIGlmKCAhdGhpcy5uYW1lICkgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBwIOWFtuS4reWMheaLrFxuICAgICAgICAgICAgLy8gYXJndW1lbnQgLSDlj6/og73mnIlcbiAgICAgICAgICAgIC8vIG1lc3NhZ2UgLSDljp/lp4vnmoRtZXNzYWdl6K6+572uIFxuICAgICAgICAgICAgLy8gdmFsaWRhdGUgLSDpqozor4Hop4TliJkgXG4gICAgICAgICAgICAvLyBydWxlX3N0cuino+aekOWHuuadpeeahOWGheWuuSBuYW1lKOWQjHBhdHRlcm5OYW1lKSAsIGVsZW1OYW1lKEDmiY3kvJrmnIkpICwgdmFsdWUocGF0dGVybueahOWxnuaAp+WAvClcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgLSDlr7nlupTnmoQgZWxlbWVudFxuICAgICAgICAgICAgLy8gcmVzdWx0IC0g6aqM6K+B5ZCO77yM5Lya5a+56K+l6aG56K6+572uIHRydWUg5oiWIGZhbHNlXG4gICAgICAgICAgICB2YXIgcCA9ICQuZXh0ZW5kKCB0aGlzICwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgOiBzZWxmLmVsZW1lbnQgLFxuICAgICAgICAgICAgICAgICRlbGVtZW50IDogc2VsZi4kZWxlbWVudCAsIFxuICAgICAgICAgICAgICAgICRmb3JtIDogc2VsZi4kZm9ybSAsIFxuICAgICAgICAgICAgICAgIGdldE1lc3NhZ2UgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZ2V0TWVzc2FnZS5jYWxsKCB0aGlzICwgdmFsdWUgKTtcbiAgICAgICAgICAgICAgICB9ICwgXG4gICAgICAgICAgICAgICAgLy8g55So5p2l6Kej5p6QIHBhcnNlZHN0cijlroPmmK/luKbmnIlA55qE5YaF5a65KSDnmoTlgLzvvIzop6PmnpDmiJDlip/lsLHov5Tlm57pgqPkuKogZWxlbWVudCDvvIzlkKbliJnov5Tlm54gbnVsbFxuICAgICAgICAgICAgICAgIHBhcnNlTmFtZVN5bWJvbCA6IGZ1bmN0aW9uKCBwYXJzZWRzdHIgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHBhcnNlZHN0ci5jaGFyQXQoMCkgIT09ICdAJyApIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZm9ybS5maW5kKCBfcGFyc2Vfc2VsZWN0b3Jfc3ludGF4KCBwYXJzZWRzdHIgKSApWzBdO1xuICAgICAgICAgICAgICAgIH0gLCBcblxuICAgICAgICAgICAgICAgIC8vIOW9kyBwYXR0ZXJuIOaYryBAeHhbeHhdIOaXtu+8jCDliJnlj6/ku6XpgJrov4for6Xmlrnms5Xlj5blvpcgQCDlr7nlupTnmoTlhYPntKBcbiAgICAgICAgICAgICAgICBnZXROYW1lU3ltYm9sIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VOYW1lU3ltYm9sKCAnQCcgKyB0aGlzLmVsZW1OYW1lICk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIOW9kyBwYXR0ZXJuIOaYryB4eFt4eF0g5pe277yMIOWImeWPr+S7pemAmui/h+ivpeaWueazleWPluW+l+aLrOWPt+S4reeahOWAvFxuICAgICAgICAgICAgICAgIC8vIOWmguaenOWAvOS4uiBAeHh4ICwg5YiZ6L+U5Zue6K+l5YWD57SgXG4gICAgICAgICAgICAgICAgLy8g5ZCm5YiZ6L+U5Zue5YC8XG4gICAgICAgICAgICAgICAgZ2V0VmFsdWVTeW1ib2wgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSB0aGlzLnBhcnNlTmFtZVN5bWJvbCggdGhpcy52YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwgPyBlbCA6IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgfSAsIFxuXG4gICAgICAgICAgICAgICAgZ2V0RWxlbWVudFZhbHVlIDogZnVuY3Rpb24oIGVsICl7XG4gICAgICAgICAgICAgICAgICAgIGVsID0gJChlbClbMF1cbiAgICAgICAgICAgICAgICAgICAgaWYoICFlbCApIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIganYgPSBfZ2V0RmllbGRWYWxpZGF0b3IoIGVsIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGp2ID8ganYudmFsdWUoKSA6IHNlbGYudmFsdWUuY2FsbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50IDogZWwgLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50IDogJChlbCkgLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtIDogc2VsZi4kZm9ybVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9ICwgXG5cbiAgICAgICAgICAgICAgICAvLyDlvpfliLDlhYPntKDnmoQgY25hbWUg5oiWIG5hbWVcbiAgICAgICAgICAgICAgICBnZXRFbGVtZW50TmFtZSA6IGZ1bmN0aW9uICggZWwgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoICRlbC5hdHRyKCBcImRhdGEtXCIgKyAgQ09OU1RBTlQuQ05BTUUgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkZWwuYXR0ciggXCJkYXRhLVwiICsgIENPTlNUQU5ULkNOQU1FIClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkZWwuYXR0cignbmFtZScpOyAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gLCBQQVRURVJOU1sgdGhpcy5uYW1lIF0gKTtcblxuICAgICAgICAgICAgKGZ1bmN0aW9uKHApeyBhc3luYy5hZGRSZXF1ZXN0KGZ1bmN0aW9uKCBhc3luY19jb250aW51ZSApe1xuICAgICAgICAgICAgICAgIC8vIGlzdmFsaWQgLSDmmK/lkKbpqozor4HmiJDlip9cbiAgICAgICAgICAgICAgICBwLnZhbGlkYXRlKCB2YWx1ZSAsIGZ1bmN0aW9uKCBpc192YWxpZCApe1xuICAgICAgICAgICAgICAgICAgICBwLnJlc3VsdCA9IGlzX3ZhbGlkO1xuICAgICAgICAgICAgICAgICAgICBhc3luY19jb250aW51ZSgpO1xuICAgICAgICAgICAgICAgIH0sICRldmVudCApO1xuXG4gICAgICAgICAgICB9KTsgfSkocCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgYXN5bmMuZ28oKTtcblxuICAgIH0gLCBcblxuICAgIC8vIOagueaNriBwYXR0ZXJuTmFtZSDlvpfliLDplJnor6/kv6Hmga9cbiAgICAvLyDkvJjlhYjnuqfkuLrvvJrlrZfmrrXnmoRtZXNzYWdl6K6+572uID4gcGfnmoRtZXNzYWdl6K6+572uID4gcGF0dGVybueahOagh+WHhuiuvue9riBcbiAgICAvLyAqIHZhbHVlICog5Li65YC877yM5aaC5p6c5LiN5Lyg5YiZ6YeN5paw6I635Y+WXG4gICAgLy8gKiDnlLEgcCDov5vooYzosIPnlKhcbiAgICBfZ2V0TWVzc2FnZSA6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwYXR0ZXJuTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgdmFyIGUgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnQ7XG4gICAgICAgIHZhciAkZiA9IHRoaXMuJGZvcm07XG4gICAgICAgIHZhciB2ID0gdmFsdWUgfHwgX2dldEZpZWxkVmFsaWRhdG9yKGUpLnZhbHVlKCk7XG4gICAgICAgIHZhciBtc2dfdG1wbCA9ICRlLmF0dHIoJ2RhdGEtanZhbGlkYXRvci1tZXNzYWdlJylcbiAgICAgICAgICAgICAgICAgICAgICAgfHwgKCBlWyBDT05TVEFOVC5NRVNTQUdFX0FUVFIgXSA/IGVbIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdWyBwYXR0ZXJuTmFtZSBdIDogbnVsbCApXG4gICAgICAgICAgICAgICAgICAgICAgIHx8ICggJGZbMF1bIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdID8gJGZbMF1bIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdWyBwYXR0ZXJuTmFtZSBdIDogbnVsbCApXG4gICAgICAgICAgICAgICAgICAgICAgIHx8ICggUEFUVEVSTlNbIHBhdHRlcm5OYW1lIF0ubWVzc2FnZSApO1xuXG4gICAgICAgIG1zZ190bXBsID0gbXNnX3RtcGwucmVwbGFjZSggLyV2YWxcXGIvZyAsIHYgKSBcbiAgICAgICAgbXNnX3RtcGwgPSBtc2dfdG1wbC5yZXBsYWNlKCAvJW5hbWVcXGIvZyAsIGUubmFtZSApXG4gICAgICAgIG1zZ190bXBsID0gbXNnX3RtcGwucmVwbGFjZSggLyVjbmFtZVxcYi9nICwgJGUuYXR0ciggXCJkYXRhLVwiICsgIENPTlNUQU5ULkNOQU1FKSApIFxuICAgICAgICBtc2dfdG1wbCA9IG1zZ190bXBsLnJlcGxhY2UoIC89JWFyZ3VcXGIvZyAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSBzZWxmLnBhcnNlTmFtZVN5bWJvbCggc2VsZi52YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2ICYmIHYudGFnTmFtZSA/IHNlbGYuZ2V0RWxlbWVudFZhbHVlKCB2ICkgOiBzZWxmLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICBtc2dfdG1wbCA9IG1zZ190bXBsLnJlcGxhY2UoIC8lYXJndVxcYi9nICwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IHNlbGYucGFyc2VOYW1lU3ltYm9sKCBzZWxmLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHYgJiYgdi50YWdOYW1lID8gc2VsZi5nZXRFbGVtZW50TmFtZSggdiApIDogc2VsZi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgbXNnX3RtcGwgPSBtc2dfdG1wbC5yZXBsYWNlKCAvQEAvZyAsIGZ1bmN0aW9uKCAkMCAsICQxICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gJGYuZmluZCggX3BhcnNlX3NlbGVjdG9yX3N5bnRheChcIkBcIiArIHNlbGYuZWxlbU5hbWUpIClbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggIWVsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAkZWwuYXR0ciggXCJkYXRhLVwiICsgIENPTlNUQU5ULkNOQU1FICkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGVsLmF0dHIoIFwiZGF0YS1cIiArICBDT05TVEFOVC5DTkFNRSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGVsLmF0dHIoJ25hbWUnKTsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIG1zZ190bXBsID0gbXNnX3RtcGwucmVwbGFjZSggLz1AKFteXFxzXSopXFxiL2cgLCBmdW5jdGlvbiggJDAgLCAkMSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldEVsZW1lbnRWYWx1ZSggJGYuZmluZCgnW25hbWU9JyArICQxICsgJ10nKSApXG4gICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIG1zZ190bXBsID0gbXNnX3RtcGwucmVwbGFjZSggL0AoW15cXHNdKilcXGIvZyAsIGZ1bmN0aW9uKCAkMCAsICQxICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0RWxlbWVudE5hbWUoICRmLmZpbmQoJ1tuYW1lPScgKyAkMSArICddJykgKSB8fCBcIlwiIDtcbiAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIG1zZ190bXBsO1xuXG4gICAgfSxcblxuICAgIC8vIOagueaNruS4jeWQjOeahOWtl+auteexu+Wei++8jOWPluW+lyBlbGVtZW50IOeahOWAvFxuICAgIHZhbHVlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlID0gdGhpcy5lbGVtZW50ICwgJGUgPSB0aGlzLiRlbGVtZW50ICwgJGZvcm0gPSB0aGlzLiRmb3JtICwgcGxhY2Vob2xkZXJ0ZXh0IDtcbiAgICAgICAgc3dpdGNoKCBlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSApIHtcbiAgICAgICAgICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgICAgICAgICAgICBzd2l0Y2goIGUudHlwZSApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmb3JtLmZpbmQoJ2lucHV0W25hbWU9JyArIGUubmFtZSArICddOnJhZGlvOmNoZWNrZWQnKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZvcm0uZmluZCgnaW5wdXRbbmFtZT0nICsgZS5uYW1lICsgJ106Y2hlY2tib3g6Y2hlY2tlZCcpLm1hcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudG9BcnJheSgpLmpvaW4oJywnKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcnRleHQgPSAkZS5hdHRyKCBcImRhdGEtXCIgKyAgQ09OU1RBTlQuUExBQ0VIT0xERVIgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwbGFjZWhvbGRlcnRleHQgPT09IGUudmFsdWUgPyBcIlwiIDogZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaGlkZGVuJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncGFzc3dvcmQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZS52YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcnRleHQgPSAkZS5hdHRyKCBcImRhdGEtXCIgKyAgQ09OU1RBTlQuUExBQ0VIT0xERVIgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxhY2Vob2xkZXJ0ZXh0ID09PSBlLnZhbHVlID8gXCJcIiA6IGUudmFsdWU7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHZhciByO1xuICAgICAgICAgICAgICAgIHIgPSAkZS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiByICE9ICd1bmRlZmluZWQnICkgcmV0dXJuIHI7XG4gICAgICAgICAgICAgICAgciA9IGUudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiByICE9ICd1bmRlZmluZWQnICkgcmV0dXJuIHI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICB9ICwgXG5cbiAgICAvLyDop6blj5Hoh6rpqozor4HooYzkuLpcbiAgICBhZnRlcl9jaGVjayA6IGZ1bmN0aW9uKCBpc192YWxpZCAsIGVycm9ycyAsICRldmVudCApIHtcbiAgICAgICAgdmFyIHR5cGUgPSBpc192YWxpZCA/ICdzdWNjZXNzJyA6ICdmYWlsJztcbiAgICAgICAgdmFyIGV2dCA9IHRoaXMuJGVsZW1lbnQuZGF0YSggQ09OU1RBTlQuRklFTERfRVZFTlRTICsgdHlwZSApO1xuICAgICAgICBpZiggIWV2dCApIGV2dCA9IHRoaXMuJGZvcm0uZGF0YSggQ09OU1RBTlQuRklFTERfRVZFTlRTICsgdHlwZSApO1xuICAgICAgICBpZiggIWV2dCB8fCB0eXBlb2YgZXZ0ICE9ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgICAgICBldnQuY2FsbCggdGhpcyAsICRldmVudCAsIGVycm9ycyApO1xuICAgIH1cblxufTtcblxuXG4vLyAjIyDooajljZXpqozor4HlmahcblxuZnVuY3Rpb24gRm9ybVZhbGlkYXRvciggZm9ybSApIHtcbiAgICBpZiggIWZvcm0gKSB0aHJvdyBcIltFUlJPUl0gZm9ybSDlj4LmlbDlv4XpobvlrZjlnKguXCJcbiAgICBpZiggZm9ybS50YWdOYW1lICE9PSAnRk9STScgKSB0aHJvdyBcIltFUlJPUl0g5Y+C5pWwIGZvcm0g5b+F6aG75piv5Liq6KGo5Y2V5YWD57SgLlwiXG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICB0aGlzLiRmb3JtID0gJChmb3JtKTtcbiAgICB0aGlzLmFzeW5jID0gbmV3IEFzeW5jKCk7XG59XG5cbi8vIOWIpOaWreWFg+e0oOWPr+ingeW5tuWtmOWcqFxuZnVuY3Rpb24gX2V4aXN0cyggZWwgKXtcbiAgICByZXR1cm4gJChlbCkuY2xvc2VzdCgnYm9keScpLnNpemUoKSA+IDAgJiYgJChlbCkuaXMoXCI6dmlzaWJsZVwiKTtcbn1cblxuLy8g5b6X5Yiw5oyH5a6a5YWD57Sg55qEanZhbGlkYXRvclxuZnVuY3Rpb24gX2dldEZpZWxkVmFsaWRhdG9yKCBlbCApe1xuICAgIGlmKCBlbC5ub2RlTmFtZSA9PSBcIklOUFVUXCIgJiYgKCBlbC50eXBlID09IFwiY2hlY2tib3hcIiB8fCBlbC50eXBlID09IFwicmFkaW9cIiApICkge1xuICAgICAgICBlbCA9ICQoZWwpLmNsb3Nlc3QoXCJmb3JtXCIpLmZpbmQoXCJpbnB1dFtkYXRhLVwiICsgQ09OU1RBTlQuUEFUVEVSTiArIFwiXVtuYW1lPVwiICsgZWwubmFtZSArIFwiXVwiKVswXTtcbiAgICB9XG4gICAgaWYoICFlbCB8fCBlbC5kaXNhYmxlZCApIHJldHVybjtcbiAgICBpZiggISQoZWwpLmF0dHIoIFwiZGF0YS1cIiArICBDT05TVEFOVC5QQVRURVJOICkgKSByZXR1cm47XG4gICAgcmV0dXJuIGVsLl9maWVsZF92YWxpZGF0b3IgPyBlbC5fZmllbGRfdmFsaWRhdG9yIDogKCBlbC5fZmllbGRfdmFsaWRhdG9yID0gbmV3IEZpZWxkQ2hlY2tlciggZWwgKSApO1xufVxuXG4vLyDop6PmnpAgd2hlbiDkuK3nmoTmlK/mjIEgQG5hbWUg55qEIHNlbGVjdG9yIOivreazlSBcbmZ1bmN0aW9uIF9wYXJzZV9zZWxlY3Rvcl9zeW50YXgoIHNlbGVjdG9yICkge1xuICAgIHJldHVybiAoIHNlbGVjdG9yIHx8IFwiXCIgKS5yZXBsYWNlKC9AKFthLXpdW2EtejAtOV0qKVxcYi9pZywnW25hbWU9JDFdJyk7XG59XG5cbkZvcm1WYWxpZGF0b3IucHJvdG90eXBlID0ge1xuXG4gICAgLy8g5b6X5Yiw5omA5pyJ6ZyA6KaB6aqM6K+B55qE5a2X5q6177yI6Z2e6ZqQ6JeP5LiU5LiN5Li6ZGlzYWJsZWTvvIlcbiAgICBfZ2V0QWxsRmllbGRWYWxpZGF0b3IgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcy4kZm9ybS5maW5kKCdbZGF0YS0nICsgQ09OU1RBTlQuUEFUVEVSTiArICddJykuZmlsdGVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gX2V4aXN0cyh0aGlzKSAmJiAhdGhpcy5kaXNhYmxlZDtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gX2dldEZpZWxkVmFsaWRhdG9yKHRoaXMpO1xuICAgICAgICB9KS50b0FycmF5KCk7XG4gICAgfSAsXG5cbiAgICAvLyDpqozor4HmnKzooajljZXkuK3miYDmnInlhYPntKDnmoQgcGF0dGVybiDmmK/lkKbmraPnoa5cbiAgICBjaGVja0FsbFBhdHRlcm5zIDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF9qdnMgPSB0aGlzLl9nZXRBbGxGaWVsZFZhbGlkYXRvcigpO1xuICAgICAgICAkLmVhY2goIF9qdnMgLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5jaGVja1BhdHRlcm4oKTtcbiAgICAgICAgfSk7XG4gICAgfSAsXG5cbiAgICAvLyDpqozor4HooajljZXlhoXmiYDmnInlrZfmrrVcbiAgICB2YWxpZGF0ZUFsbCA6IGZ1bmN0aW9uKCB2YWxpZGF0ZUFsbENhbGxiYWNrICl7XG4gICAgICAgIHZhciAkZm9ybSA9IHRoaXMuJGZvcm07XG4gICAgICAgIHZhciBhc3luYyA9IG5ldyBBc3luYygpO1xuICAgICAgICB2YXIgX2p2cyA9IHRoaXMuX2dldEFsbEZpZWxkVmFsaWRhdG9yKCk7XG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcblxuICAgICAgICBhc3luYy5jbGVhcigpO1xuICAgICAgICBhc3luYy5vbmZpbmlzaGVkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhbGlkYXRlQWxsQ2FsbGJhY2sgJiYgdmFsaWRhdGVBbGxDYWxsYmFjayggZXJyb3JzLmxlbmd0aCA9PSAwICwgZXJyb3JzICk7IFxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5b2T5rKh5pyJ5Lu75L2V5Y+v5Lul6aqM6K+B55qE5a2X5q615pe255u05o6l6L+U5ZueXG4gICAgICAgIGlmKCAhX2p2cy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVBbGxDYWxsYmFjayggdHJ1ZSAsIFtdICk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9qdnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICB2YXIganYgPSBfanZzW2ldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAoZnVuY3Rpb24oanYpe1xuICAgICAgICAgICAgICAgIGFzeW5jLmFkZFJlcXVlc3QoZnVuY3Rpb24oYXN5bmNfY29udGludWUpe1xuICAgICAgICAgICAgICAgICAgICBqdi5jaGVjayggbnVsbCAsIGZ1bmN0aW9uKCBjaGVja1Jlc3VsdCAsIGVycm9yICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggIWNoZWNrUmVzdWx0ICl7IGVycm9ycy5wdXNoKCBlcnJvciApIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jX2NvbnRpbnVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkoanYpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBhc3luYy5nbygpO1xuICAgIH0gLCBcblxuICAgIC8vIOW9k+S9oOmcgOimgeWtl+auteiHquinpuWPkemqjOivgeaXtu+8jOavlOWmgu+8mmlucHV0IGJsdXLml7bpnIDopoHpqozor4HvvIzor7fkvb/nlKjor6Xmlrnms5UuXG4gICAgLy8gc2VsZWN0b3Ig5piv6ZyA6KaB6Ieq6Kem5Y+R6aqM6K+B55qE5a2X5q61IC0g5aaC5p6c5LiN5YaZ5YiZ6buY6K6k5YWo6YOo44CCPGJyIC8+XG4gICAgLy8gZXZ0cyDmnInkuKTnp43lhpnms5U6XG4gICAgLy8gIyMjIyMg56ys5LiA56eN77yaXG4gICAgLy8gPiBbICdibHVyJyAsICdmb2N1cycgLCAna2V5cHJlc3MnIF0gXG4gICAgLy8gXG4gICAgLy8g5Luj6KGoIHNlbGVjdG9yIOeahCBbICdibHVyJyAsICdmb2N1cycgLCAna2V5cHJlc3MnIF0g5LqL5Lu25Lya6Kem5Y+RIHNlbGVjdG9yIOeahOmqjOivgVxuICAgIC8vIFxuICAgIC8vICMjIyMjIOesrOS6jOenje+8mlxuICAgIC8vID4gXFx7IDxiciAvPlxuICAgIC8vID4gICAgICdAc2VsJyA6IFsgJ2JsdXInICwgJ2tleXByZXNzJyBdXG4gICAgLy8gPiBcXH0gPGJyIC8+XG4gICAgLy8gXG4gICAgLy8g5Luj6KGoIOeUsUBzZWwg55qEIFsgJ2JsdXInICwgJ2tleXByZXNzJyBdIOS6i+S7tuS8muinpuWPkSBzZWxlY3RvciDnmoTpqozor4FcblxuICAgIHdoZW4gOiBmdW5jdGlvbiggc2VsZWN0b3IgLCBldnRzICkge1xuICAgICAgICBpZiggdHlwZW9mIHNlbGVjdG9yICE9ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgZXZ0cyA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV2ZW50cyA9IHt9O1xuICAgICAgICB2YXIgc2VsID0gc2VsZWN0b3IgfHwgXCJbZGF0YS1cIiArIENPTlNUQU5ULlBBVFRFUk4gKyBcIl1cIjtcblxuICAgICAgICAvLyDlpITnkIYgY2hlY2tib3gg5ZKMIHJhZGlvXG4gICAgICAgIHZhciBjaGtzID0gdGhpcy4kZm9ybS5maW5kKHNlbCkuZmlsdGVyKCdpbnB1dDpjaGVja2JveCcpO1xuICAgICAgICBpZiggY2hrcy5sZW5ndGggKSB7XG4gICAgICAgICAgICBjaGtzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzZWwgKz0gXCIsXCIgKyBfcGFyc2Vfc2VsZWN0b3Jfc3ludGF4KCBcIkBcIiArIHRoaXMubmFtZSApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZG9zID0gdGhpcy4kZm9ybS5maW5kKHNlbCkuZmlsdGVyKCdpbnB1dDpyYWRpbycpO1xuICAgICAgICBpZiggcmRvcy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZG9zLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzZWwgKz0gXCIsXCIgKyBfcGFyc2Vfc2VsZWN0b3Jfc3ludGF4KCBcIkBcIiArIHRoaXMubmFtZSApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCAkLmlzQXJyYXkoZXZ0cykgKSB7ICBcbiAgICAgICAgICAgIGV2ZW50c1sgc2VsIF0gPSBldnRzIDtcbiAgICAgICAgfSBlbHNlIGlmKCAkLmlzUGxhaW5PYmplY3QoZXZ0cykgKSB7XG4gICAgICAgICAgICAkLmV4dGVuZCggZXZlbnRzICwgZXZ0cyApO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKCB2YXIgdGFyZ2V0U2VsZWN0b3IgaW4gZXZlbnRzICkge1xuICAgICAgICAgICAgdmFyIF9zZWwgPSBfcGFyc2Vfc2VsZWN0b3Jfc3ludGF4KCB0YXJnZXRTZWxlY3RvciApO1xuICAgICAgICAgICAgdmFyIF9ldnRzID0gKCBldmVudHNbdGFyZ2V0U2VsZWN0b3JdIHx8IFtdICk7XG4gICAgICAgICAgICBpZiggIV9ldnRzLmxlbmd0aCApIGNvbnRpbnVlO1xuICAgICAgICAgICAgX2V2dHMgPSBfZXZ0cy5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgIHRoaXMuJGZvcm0udW5kZWxlZ2F0ZSggX3NlbCAsIF9ldnRzICk7XG5cbiAgICAgICAgICAgIHRoaXMuJGZvcm0uZGVsZWdhdGUoIF9zZWwgLCBfZXZ0cyAsIGZ1bmN0aW9uKCRldmVudCl7XG4gICAgICAgICAgICAgICAgdmFyIGp2ID0gX2dldEZpZWxkVmFsaWRhdG9yKCB0aGlzICk7XG4gICAgICAgICAgICAgICAganYgJiYganYuY2hlY2soICRldmVudCApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHNldE1lc3NhZ2UgOiBmdW5jdGlvbiggc2VsZWN0b3IgLCBwYXR0ZXJuTmFtZSAsIG1zZyApIHsgXG5cbiAgICAgICAgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMiApIHtcbiAgICAgICAgICAgIG1zZyA9IHBhdHRlcm5OYW1lO1xuICAgICAgICAgICAgcGF0dGVybk5hbWUgPSBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjICwgZiA9IHRoaXMuJGZvcm1bMF07XG5cbiAgICAgICAgaWYoICFzZWxlY3RvciApIHtcbiAgICAgICAgICAgIGMgPSBmWyBDT05TVEFOVC5NRVNTQUdFX0FUVFIgXSA9IGZbIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdIHx8IHt9O1xuICAgICAgICAgICAgY1twYXR0ZXJuTmFtZV0gPSBtc2c7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtLmZpbmQoIF9wYXJzZV9zZWxlY3Rvcl9zeW50YXgoIHNlbGVjdG9yICkgKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGMgPSBlWyBDT05TVEFOVC5NRVNTQUdFX0FUVFIgXSA9IGVbIENPTlNUQU5ULk1FU1NBR0VfQVRUUiBdIHx8IHt9O1xuICAgICAgICAgICAgICAgIGNbcGF0dGVybk5hbWVdID0gbXNnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0gLFxuXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uKCBzZWxlY3RvciAsIGZuICkge1xuICAgICAgICB0aGlzLl9iaW5kX2ZpZWxkX2V2ZW50KCAnc3VjY2VzcycgLCBzZWxlY3RvciAsIGZuICk7XG4gICAgfSAsXG5cbiAgICBmYWlsIDogZnVuY3Rpb24oIHNlbGVjdG9yICwgZm4gKSB7XG4gICAgICAgIHRoaXMuX2JpbmRfZmllbGRfZXZlbnQoICdmYWlsJyAsIHNlbGVjdG9yICwgZm4gKTtcbiAgICB9ICxcblxuICAgIF9iaW5kX2ZpZWxkX2V2ZW50IDogZnVuY3Rpb24oIHR5cGUgLCBzZWxlY3RvciAsIGZuICkge1xuICAgICAgICBcbiAgICAgICAgaWYoICF0eXBlICkgcmV0dXJuO1xuXG4gICAgICAgIGlmKCB0eXBlb2Ygc2VsZWN0b3IgPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgIGZuID0gc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggc2VsZWN0b3IgKSB7XG4gICAgICAgICAgICB2YXIgc2VsID0gX3BhcnNlX3NlbGVjdG9yX3N5bnRheCggc2VsZWN0b3IgKTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm0uZmluZChzZWwpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmRhdGEoIENPTlNUQU5ULkZJRUxEX0VWRU5UUyArIHR5cGUgLCBmbiApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm0uZGF0YSggQ09OU1RBTlQuRklFTERfRVZFTlRTICsgdHlwZSAsIGZuICk7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG4kLmZuLmp2YWxpZGF0b3IgPSBmdW5jdGlvbigpe1xuICAgIHZhciBmb3JtID0gJCh0aGlzKS5maXJzdCgpO1xuICAgIGlmKCBmb3JtLmRhdGEoJ0Zvcm1WYWxpZGF0b3InKSApIHJldHVybiBmb3JtLmRhdGEoJ0Zvcm1WYWxpZGF0b3InKTtcbiAgICB2YXIgZnYgPSBuZXcgRm9ybVZhbGlkYXRvciggZm9ybVswXSApO1xuICAgIGZvcm0uZGF0YSgnRm9ybVZhbGlkYXRvcicsIGZ2ICk7XG4gICAgcmV0dXJuIGZ2O1xufTtcblxuXG4vLyDorr7nva7lop7liqDoh6rlrprkuYkgcGF0dGVybiDnmoTlhaXlj6NcblxuZnVuY3Rpb24gYWRkUGF0dGVybiggbmFtZSAsIG9wdGlvbnMgKSB7XG5cbiAgICBpZighbmFtZSkgdGhyb3cgXCJbRVJST1JdIGFkZCBwYXR0ZXJuIC0gbm8gbmFtZVwiO1xuICAgIGlmKCFvcHRpb25zKSB0aHJvdyBcIltFUlJPUl0gYWRkIHBhdHRlcm4gLSBubyBvcHRpb25zXCJcbiAgICBpZighb3B0aW9ucy5tZXNzYWdlKSB0aHJvdyBcIltFUlJPUl0gYWRkIHBhdHRlcm4gLSBubyBtZXNzYWdlXCJcbiAgICBpZighb3B0aW9ucy52YWxpZGF0ZSkgdGhyb3cgXCJbRVJST1JdIGFkZCBwYXR0ZXJuIC0gbm8gdmFsaWRhdGVcIjtcbiAgICBcbiAgICBQQVRURVJOU1tuYW1lXSA9ICQuZXh0ZW5kKHtcbiAgICAgICAgbmFtZSA6IG5hbWUgXG4gICAgfSAsIG9wdGlvbnMgKTtcblxuICAgIHBhcnNlci5hZGQoIG5hbWUgLCBvcHRpb25zICk7XG5cbn1cblxuZXhwb3J0cy5hZGRQYXR0ZXJuID0gYWRkUGF0dGVybjtcblxuJC5leHRlbmQoe1xuICAgIGp2YWxpZGF0b3I6IHtcbiAgICAgICAgYWRkUGF0dGVybiA6IGFkZFBhdHRlcm4gLFxuICAgICAgICBQQVRURVJOUyA6IFBBVFRFUk5TICwgXG4gICAgICAgIGdldEZpZWxkVmFsaWRhdG9yIDogZnVuY3Rpb24oIGVsICkge1xuICAgICAgICAgICAgcmV0dXJuIF9nZXRGaWVsZFZhbGlkYXRvciggZWwgKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwidmFyIHYgPSByZXF1aXJlKCcuL1ZhbGlkYXRvci5qcycpO1xuXG52YXIgdmFsaWRGdW5jID0ge1xuICAgIFxuICAgIC8qKipcbiAgICAgKiDlgLw6XG4gICAgICogMSDml6DplJnor68gXG4gICAgICogLTEg6ZW/5bqm6ZSZ6K+vXG4gICAgICogLTIg6aqM6K+B6ZSZ6K+vIFxuICAgICAqL1xuICAgIElEIDogZnVuY3Rpb24oIG51bSApIHsgIFxuXG4gICAgICAgIG51bSA9IG51bS50b1VwcGVyQ2FzZSgpOyAgXG4gICAgICAgIFxuICAgICAgICAvL+i6q+S7veivgeWPt+eggeS4ujE15L2N5oiW6ICFMTjkvY3vvIwxNeS9jeaXtuWFqOS4uuaVsOWtl++8jDE45L2N5YmNMTfkvY3kuLrmlbDlrZfvvIzmnIDlkI7kuIDkvY3mmK/moKHpqozkvY3vvIzlj6/og73kuLrmlbDlrZfmiJblrZfnrKZY44CCICAgXG4gICAgICAgIGlmICghKC8oXlxcZHsxNX0kKXwoXlxcZHsxN30oXFxkfFgpJCkvLnRlc3QobnVtKSkpIHsgXG4gICAgICAgICAgICByZXR1cm4gLTE7IFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL+agoemqjOS9jeaMieeFp0lTTyA3MDY0OjE5ODMuTU9EIDExLTLnmoTop4TlrprnlJ/miJDvvIxY5Y+v5Lul6K6k5Li65piv5pWw5a2XMTDjgIIgXG4gICAgICAgIC8v5LiL6Z2i5YiG5Yir5YiG5p6Q5Ye655Sf5pel5pyf5ZKM5qCh6aqM5L2NIFxuICAgICAgICBcbiAgICAgICAgdmFyIGxlbiwgcmU7IFxuICAgICAgICBsZW4gPSBudW0ubGVuZ3RoOyBcbiAgICAgICAgaWYgKGxlbiA9PSAxNSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZSA9IG5ldyBSZWdFeHAoL14oXFxkezZ9KShcXGR7Mn0pKFxcZHsyfSkoXFxkezJ9KShcXGR7M30pJC8pOyBcbiAgICAgICAgICAgIHZhciBhcnJTcGxpdCA9IG51bS5tYXRjaChyZSk7IFxuXG4gICAgICAgICAgICAvL+ajgOafpeeUn+aXpeaXpeacn+aYr+WQpuato+ehriBcbiAgICAgICAgICAgIHZhciBkdG1CaXJ0aCA9IG5ldyBEYXRlKCcxOScgKyBhcnJTcGxpdFsyXSArICcvJyArIGFyclNwbGl0WzNdICsgJy8nICsgYXJyU3BsaXRbNF0pOyBcbiAgICAgICAgICAgIHZhciBiR29vZERheSA9IChkdG1CaXJ0aC5nZXRZZWFyKCkgPT0gTnVtYmVyKGFyclNwbGl0WzJdKSkgJiYgKChkdG1CaXJ0aC5nZXRNb250aCgpICsgMSkgPT0gTnVtYmVyKGFyclNwbGl0WzNdKSkgJiYgKGR0bUJpcnRoLmdldERhdGUoKSA9PSBOdW1iZXIoYXJyU3BsaXRbNF0pKTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghYkdvb2REYXkpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0yOyBcbiAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAobGVuID09IDE4KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlID0gbmV3IFJlZ0V4cCgvXihcXGR7Nn0pKFxcZHs0fSkoXFxkezJ9KShcXGR7Mn0pKFxcZHszfSkoXFxkfFgpJC8pOyBcbiAgICAgICAgICAgIHZhciBhcnJTcGxpdCA9IG51bS5tYXRjaChyZSk7IFxuXG4gICAgICAgICAgICAvL+ajgOafpeeUn+aXpeaXpeacn+aYr+WQpuato+ehriBcbiAgICAgICAgICAgIHZhciBkdG1CaXJ0aCA9IG5ldyBEYXRlKGFyclNwbGl0WzJdICsgXCIvXCIgKyBhcnJTcGxpdFszXSArIFwiL1wiICsgYXJyU3BsaXRbNF0pOyBcbiAgICAgICAgICAgIHZhciBiR29vZERheSA9IChkdG1CaXJ0aC5nZXRGdWxsWWVhcigpID09IE51bWJlcihhcnJTcGxpdFsyXSkpICYmICgoZHRtQmlydGguZ2V0TW9udGgoKSArIDEpID09IE51bWJlcihhcnJTcGxpdFszXSkpICYmIChkdG1CaXJ0aC5nZXREYXRlKCkgPT0gTnVtYmVyKGFyclNwbGl0WzRdKSk7IFxuXG4gICAgICAgICAgICBpZiAoIWJHb29kRGF5KSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiAtMjsgXG4gICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICAvL+ajgOmqjDE45L2N6Lqr5Lu96K+B55qE5qCh6aqM56CB5piv5ZCm5q2j56Gu44CCIFxuICAgICAgICAgICAgICAgIC8v5qCh6aqM5L2N5oyJ54WnSVNPIDcwNjQ6MTk4My5NT0QgMTEtMueahOinhOWumueUn+aIkO+8jFjlj6/ku6XorqTkuLrmmK/mlbDlrZcxMOOAgiBcbiAgICAgICAgICAgICAgICB2YXIgdmFsbnVtOyBcbiAgICAgICAgICAgICAgICB2YXIgYXJySW50ID0gbmV3IEFycmF5KDcsIDksIDEwLCA1LCA4LCA0LCAyLCAxLCA2LCAzLCA3LCA5LCAxMCwgNSwgOCwgNCwgMik7IFxuICAgICAgICAgICAgICAgIHZhciBhcnJDaCA9IG5ldyBBcnJheSgnMScsICcwJywgJ1gnLCAnOScsICc4JywgJzcnLCAnNicsICc1JywgJzQnLCAnMycsICcyJyk7IFxuICAgICAgICAgICAgICAgIHZhciBuVGVtcCA9IDAsIGk7IFxuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IDE3OyBpICsrKSB7IFxuICAgICAgICAgICAgICAgICAgICBuVGVtcCArPSBudW0uc3Vic3RyKGksIDEpICogYXJySW50W2ldOyBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhbG51bSA9IGFyckNoW25UZW1wICUgMTFdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh2YWxudW0gIT0gbnVtLnN1YnN0cigxNywgMSkpIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMjsgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gMTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gLTI7IFxuICAgICAgICBcbiAgICB9XG4gICAgXG59O1xuXG52LmFkZFBhdHRlcm4oJ3JlcXVpcmVkJyx7XG4gICAgbWVzc2FnZSA6ICfkuI3og73kuLrnqbonICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCB2YWx1ZSAhPT0gXCJcIiApOyBcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdub24tcmVxdWlyZWQnLHtcbiAgICBtZXNzYWdlIDogJ+WFgeiuuOS4uuepuicgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIHZhbHVlID09PSBcIlwiICk7IFxuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ251bWVyaWMnLHtcbiAgICBtZXNzYWdlIDogJ+W/hemhu+aYr+aVsOWtlycgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eXFxkKyQvLnRlc3QoIHZhbHVlICkgKTtcbiAgICB9XG59KTtcblxuXG52LmFkZFBhdHRlcm4oJ2ludCcse1xuICAgIG1lc3NhZ2UgOiAn5b+F6aG75piv5pW05pWwJyAsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgZG9uZSggL15cXC0/XFxkKyQvLnRlc3QoIHZhbHVlICkgKTtcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdkZWNpbWFsJyx7XG4gICAgbWVzc2FnZSA6ICflv4XpobvmmK/lsI/mlbAnICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXlxcLT9cXGQqXFwuP1xcZCskLy50ZXN0KCB2YWx1ZSApICk7XG4gICAgfVxufSk7XG5cblxudi5hZGRQYXR0ZXJuKCdhbHBoYScse1xuICAgIG1lc3NhZ2UgOiAn5b+F6aG75piv5a2X5q+NJyAsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgZG9uZSggL15bYS16XSskL2kudGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ2FscGhhX251bWVyaWMnLHtcbiAgICBtZXNzYWdlIDogJ+W/hemhu+S4uuWtl+avjeaIluaVsOWtlycgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eW2EtejAtOV0rJC9pLnRlc3QoIHZhbHVlICkgKTtcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdhbHBoYV9kYXNoJyx7XG4gICAgbWVzc2FnZSA6ICflv4XpobvkuLrlrZfmr43miJbmlbDlrZflj4rkuIvliJLnur/nrYnnibnmrorlrZfnrKYnICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXlthLXowLTlfXFwtXSskL2kudGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ2Nocycse1xuICAgIG1lc3NhZ2UgOiAn5b+F6aG75piv5Lit5paH5a2X56ymJyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIGRvbmUoIC9eW1xcXFx1NEUwMC1cXFxcdTlGRkZdKyQvaS50ZXN0KCB2YWx1ZSApICk7XG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignY2hzX251bWVyaWMnLHtcbiAgICBtZXNzYWdlIDogJ+W/hemhu+aYr+S4reaWh+Wtl+espuaIluaVsOWtlycsXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXltcXFxcdTRFMDAtXFxcXHU5RkZGMC05XSskL2kudGVzdCggdmFsdWUgKSApO1xuICAgIH1cbn0pO1xuXG52LmFkZFBhdHRlcm4oJ2Noc19udW1lcmljJyx7XG4gICAgbWVzc2FnZSA6ICflv4XpobvmmK/kuK3mloflrZfnrKbmiJbmlbDlrZflj4rkuIvliJLnur/nrYnnibnmrorlrZfnrKYnICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXltcXFxcdTRFMDAtXFxcXHU5RkZGMC05X1xcLV0rJC9pLnRlc3QoIHZhbHVlICkgKTtcbiAgICB9XG59KTtcblxuXG52LmFkZFBhdHRlcm4oJ21hdGNoJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICflv4XpobvkuI4gJWFyZ3Ug55u45ZCMJyAsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgdmFyIHYgPSB0aGlzLmdldFZhbHVlU3ltYm9sKCk7XG4gICAgICAgIHZhciB2diA9IHYgJiYgdi50YWdOYW1lID8gdGhpcy5nZXRFbGVtZW50VmFsdWUodikgOiB2O1xuICAgICAgICBkb25lKCB2diA9PT0gdmFsdWUgKTtcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdjb250YWluJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICflv4XpobvljIXlkKtcIiVhcmd1XCLnmoTlhoXlrrknICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICB2YXIgdiA9IHRoaXMuZ2V0VmFsdWVTeW1ib2woKTtcbiAgICAgICAgdmFyIHZ2ID0gdiAmJiB2LnRhZ05hbWUgPyB0aGlzLmdldEVsZW1lbnRWYWx1ZSh2KSA6IHY7XG4gICAgICAgIGRvbmUoICEhfnZhbHVlLmluZGV4T2YodnYpICk7XG4gICAgfVxufSk7XG5cblxudi5hZGRQYXR0ZXJuKCdAJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICdAQOW/hemhu+S4uiAlYXJndScgLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIHZhciB2ID0gdGhpcy5nZXRWYWx1ZVN5bWJvbCgpO1xuICAgICAgICB2YXIgYXQgPSB0aGlzLmdldE5hbWVTeW1ib2woKTtcbiAgICAgICAgaWYoIHYgPT09IG51bGwgfHwgYXQgPT09IG51bGwgKSB7XG4gICAgICAgICAgICBkb25lKCBmYWxzZSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZ2ID0gdiAmJiB2LnRhZ05hbWUgPyB0aGlzLmdldEVsZW1lbnRWYWx1ZSh2KSA6IHY7XG4gICAgICAgICAgICB2YXIgdmF0ID0gYXQgJiYgYXQudGFnTmFtZSA/IHRoaXMuZ2V0RWxlbWVudFZhbHVlKGF0KSA6IGF0O1xuICAgICAgICAgICAgZG9uZSggdnYgPT09IHZhdCApO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbn0pO1xuXG5cbnYuYWRkUGF0dGVybignaWRjYXJkJyx7XG4gICAgbWVzc2FnZSA6ICfouqvku73or4HmoLzlvI/plJnor68nICwgXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCB2YWxpZEZ1bmMuSUQodmFsdWUpID09PSAxICk7IFxuICAgIH1cbn0pO1xuXG5cbnYuYWRkUGF0dGVybigncGFzc3BvcnQnLHtcbiAgICBtZXNzYWdlIDogJ+aKpOeFp+agvOW8j+mUmeivr+aIlui/h+mVvycsXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXlthLXpBLVowLTldezAsMjB9JC9pLnRlc3QoIHZhbHVlICkgKTsgXG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignZW1haWwnLHtcbiAgICBtZXNzYWdlIDogJ+mCruS7tuWcsOWdgOmUmeivrycsXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXlthLXpBLVowLTkuISMkJSZhbXA7JyorXFwtXFwvPT9cXF5fYHt8fX5cXC1dK0BbYS16QS1aMC05XFwtXSsoPzpcXC5bYS16QS1aMC05XFwtXSspKiQvLnRlc3QoIHZhbHVlICkgKTtcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdtaW5fbGVuZ3RoJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICfmnIDlsJHovpPlhaUlYXJndeS4quWtlycsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgdmFyIG4gPSBwYXJzZUludCggdGhpcy52YWx1ZSAsIDEwICk7XG4gICAgICAgIGRvbmUoIHZhbHVlLmxlbmd0aCA+PSBuICk7XG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignbWF4X2xlbmd0aCcse1xuICAgIGFyZ3VtZW50IDogdHJ1ZSAsIFxuICAgIG1lc3NhZ2UgOiAn5pyA5aSa6L6T5YWlJWFyZ3XkuKrlrZcnLCBcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKSB7XG4gICAgICAgIHZhciBuID0gcGFyc2VJbnQoIHRoaXMudmFsdWUgLCAxMCApO1xuICAgICAgICBkb25lKCB2YWx1ZS5sZW5ndGggPD0gbiApO1xuICAgIH1cbn0pO1xuXG5cbnYuYWRkUGF0dGVybignbGVuZ3RoJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICfplb/luqblv4XpobvkuLolYXJndeS4quWtl+espicsIFxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24oIHZhbHVlICwgZG9uZSApIHtcbiAgICAgICAgdmFyIG4gPSBwYXJzZUludCggdGhpcy52YWx1ZSAsIDEwICk7XG4gICAgICAgIGRvbmUoIHZhbHVlLmxlbmd0aCA9PT0gbiApO1xuICAgIH1cbn0pO1xuXG5cbnYuYWRkUGF0dGVybignZ3JlYXRlcl90aGFuJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICflv4XpobvlpKfkuo4lYXJndScsXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICl7XG4gICAgICAgIHZhciB2ID0gcGFyc2VJbnQoIHZhbHVlICwgMTAgKTtcbiAgICAgICAgdmFyIG4gPSB0aGlzLnBhcnNlTmFtZVN5bWJvbCggdGhpcy52YWx1ZSApO1xuICAgICAgICBuID0gcGFyc2VGbG9hdCggbiAmJiBuLnRhZ05hbWUgPyB0aGlzLmdldEVsZW1lbnRWYWx1ZSggbiApIDogdGhpcy52YWx1ZSApO1xuICAgICAgICBkb25lKCB2ID4gbiApXG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignbGVzc190aGFuJyx7XG4gICAgYXJndW1lbnQgOiB0cnVlICwgXG4gICAgbWVzc2FnZSA6ICflv4XpobvlsI/kuo4lYXJndScsXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICl7XG4gICAgICAgIHZhciB2ID0gcGFyc2VJbnQoIHZhbHVlICwgMTAgKTtcbiAgICAgICAgdmFyIG4gPSB0aGlzLnBhcnNlTmFtZVN5bWJvbCggdGhpcy52YWx1ZSApO1xuICAgICAgICBuID0gcGFyc2VGbG9hdCggbiAmJiBuLnRhZ05hbWUgPyB0aGlzLmdldEVsZW1lbnRWYWx1ZSggbiApIDogdGhpcy52YWx1ZSApO1xuICAgICAgICBkb25lKCB2IDwgbiApXG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignZXF1YWwnLHtcbiAgICBhcmd1bWVudCA6IHRydWUgLCBcbiAgICBtZXNzYWdlIDogJ+W/hemhu+etieS6jiVhcmd1JyxcbiAgICB2YWxpZGF0ZSA6IGZ1bmN0aW9uKCB2YWx1ZSAsIGRvbmUgKXtcbiAgICAgICAgdmFyIHYgPSBwYXJzZUludCggdmFsdWUgLCAxMCApO1xuICAgICAgICB2YXIgbiA9IHRoaXMucGFyc2VOYW1lU3ltYm9sKCB0aGlzLnZhbHVlICk7XG4gICAgICAgIG4gPSBwYXJzZUZsb2F0KCBuICYmIG4udGFnTmFtZSA/IHRoaXMuZ2V0RWxlbWVudFZhbHVlKCBuICkgOiB0aGlzLnZhbHVlICk7XG4gICAgICAgIGRvbmUoIHYgPT0gbiApXG4gICAgfVxufSk7XG5cbnYuYWRkUGF0dGVybignaXAnLHsgXG4gICAgbWVzc2FnZSA6ICflv4XpobvnrKblkIhpcOagvOW8jycsXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICl7XG4gICAgICAgIGRvbmUoIC9eKCgyNVswLTVdfDJbMC00XVxcZHwxXFxkezJ9fFxcZHsxLDJ9KVxcLil7M30oMjVbMC01XXwyWzAtNF1cXGR8MVxcZHsyfXxcXGR7MSwyfSkkL2kudGVzdCh2YWx1ZSkgKTtcbiAgICB9XG59KTtcblxudi5hZGRQYXR0ZXJuKCdkYXRlJyx7XG4gICAgbWVzc2FnZSA6ICflv4XpobvnrKblkIjml6XmnJ/moLzlvI8gWVlZWS1NTS1ERCcsXG4gICAgdmFsaWRhdGUgOiBmdW5jdGlvbiggdmFsdWUgLCBkb25lICkge1xuICAgICAgICBkb25lKCAvXlxcZFxcZFxcZFxcZFxcLVxcZFxcZFxcLVxcZFxcZCQvLnRlc3QodmFsdWUpICk7XG4gICAgfVxufSk7XG4gXG4iLCJ2YXIgc2VhcmNoICA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gsXG4gICAgZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xudmFyIFM9IHt9OyBcbiAgICBmdW5jdGlvbiBwYXJzZShpc19ub3cpe1xuICAgICAgICB2YXIgX3MgLCBwYXJhbXMgPSB7fSA7XG4gICAgICAgIGlmICghaXNfbm93KSB7XG4gICAgICAgICAgICBfcyA9IHNlYXJjaDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9zID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgICAgICAgfSBcbiAgICAgICAgX3MgPSAgX3MucmVwbGFjZSgvXlxcPy8sXCJcIikuc3BsaXQoXCImXCIpO1xuICAgICAgICBpZiAoX3MuZm9yRWFjaCkge1xuICAgICAgICAgICAgX3MuZm9yRWFjaChmdW5jdGlvbihzLGkpe1xuICAgICAgICAgICAgICAgIHZhciB0ID0gcy5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgcGFyYW1zW3RbMF1dID0gZGVjb2RlKHRbMV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IF9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gX3NbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgIHBhcmFtc1t0WzBdXSA9IGRlY29kZSh0WzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cbiAgICB2YXIgcGFyYW1zID0gcGFyc2UoKTtcbiAgICB2YXIgaXNfZW1wdHkgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgZW0gPSB0cnVlO1xuICAgICAgICBmb3IodmFyIGkgaW4gcGFyYW1zKXtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBlbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZW07XG4gICAgfSgpO1xuICAgIFMucGFyYW1zID0gcGFyYW1zO1xuICAgIFMuaXNfZW1wdHkgPSBpc19lbXB0eTtcbiAgICBTLm5vdyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBwYXJzZSh0cnVlKTtcbiAgICB9XG5cbm1vZHVsZS5leHBvcnRzID0gUztcbiIsIi8qKlxuICogQHJlcXVpcmVzIHlzZWxlY3Rvci5jc3NcbiAqIOS9jee9rjpzdHlsZXMvY29tbW9uL3lzZWxlY3Rvci5jc3NcbiAqXG4gKiBUT0RPIOmUruebmOWvvOiIqiDmu5rliqjmnaHot5/pmo/mu5rliqhcbiAqIFRPRE8gSVBIT05FIOS9v+eUqOWOn+eUn+aOp+S7tlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY29uZmlnLmVtcHR5SGlkZGVuIOW9k+iHquWumuS5iXNlbGVjdOayoeaciemAiemhueaXtuaYr+WQpumakOiXjyB0cnVl6ZqQ6JePXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNvbmZpZy5tYXhSb3dzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNvbmZpZy5pbmRleCDliJ3lp4vljJbml7bmjIflrprpgInmi6nnrKzlh6DkuKpvcHRpb24g5aaC5p6c5rKh5oyH5a6aIOm7mOiupOmAieaLqeWOn+eUn3NlbGVjdOWFg+e0oOW9k+WJjemAieaLqeeahG9wdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy5kaXJlY3Rpb24gb3B0aW9u5LiL5ouJ5qGG5Ye6546w5L2N572uXG4gKiB0b3Agc2VsZWN0IHRpdGxl55qE5LiK5pa5ICBib3R0b20gc2VsZWN0IHRpdGxl55qE5LiL5pa5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maWcub25jaGFuZ2Uob2JqKSDpgInpobnmm7TmlLnml7bkvJrop6blj5HmraTlh73mlbBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maWcub25zZWxlY3QodGV4dCkg5pu05o2i6YCJ6aG55pe25Lya6Kem5Y+R5q2k5Ye95pWwXG4gKiDmraTlh73mlbDlj6/ku6Xlr7nlvZPliY3pgInmi6nnmoRvcHRpb24gdGV4dOi/m+ihjOWkhOeQhiDoh6rlrprkuYlzZWxlY3QgdGl0bGXkuIrmmL7npLrnmoTmmK/lpITnkIblkI7nmoR0ZXh0XG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCDlvZPliY3pgInmi6nnmoRvcHRpb24gdGV4dFxuICpcbiAqIEBleGFtcGxlXG4gKiAkKFwic2VsZWN0XCIpLnlzZWxlY3Rvcihjb25maWcpO1xuICpcbiAqXG4gKiAkKCQuZm4ueXNlbGVjdG9yLmV2ZW50cykudHJpZ2dlcihcImNoYW5nZVwiLCBbIHNlbGYsIG9iaiwgc2VsZi5vcHRpb24oXCJob2xkZXJcIildKTtcbiAqL1xuXG4oZnVuY3Rpb24oJCl7XG5cbiAgICB2YXIgU0VMRUNUT1JfREFUQV9LRVkgPSBcIllTRUxFQ1RPUlwiLFxuICAgICAgICBTRUxFQ1RPUl9FVkVOVCAgICA9ICBcIi5TRUxFQ1RPUl9FVkVOVFwiLFxuICAgICAgICBIT1ZFUiAgICAgICAgICAgICA9IFwiaG92ZXJcIjtcblxuICAgIHZhciBTZWxlY3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAgIFNlbGVjdG9yLm9wdGlvbnMgPSB7XG4gICAgICAgIGVtcHR5SGlkZGVuOiBmYWxzZSxcbiAgICAgICAgbWF4Um93cyAgICA6IDEwLFxuICAgICAgICBpbmRleCAgICAgIDogbnVsbCxcbiAgICAgICAgLy8gZGlyZWN0aW9uICA6IFwiYm90dG9tXCIsXG4gICAgICAgIG9uY2hhbmdlICAgOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICBvbnNlbGVjdCAgIDogZnVuY3Rpb24odCkgeyByZXR1cm4gdCB8fCBcIlwiOyB9XG4gICAgfTtcblxuICAgIFNlbGVjdG9yLnByb3RvdHlwZSA9IHtcbiAgICAgICAgX2luaXQ6IGZ1bmN0aW9uKGNvbmZpZyl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHNlbGYuX3NldE9wdGlvbnMoY29uZmlnIHx8IHt9KTtcbiAgICAgICAgICAgIHNlbGYuX2JpbmRFdmVudHMoKTtcbiAgICAgICAgfSxcbiAgICAgICAgX2JpbmRFdmVudHM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiAgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAganF1ZXJ5ICA9IHNlbGYub3B0aW9uKFwianF1ZXJ5XCIpLFxuICAgICAgICAgICAgICAgIHNob3dpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdG9nZ2xlRXZlbnQoZSl7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb24oXCJkaXNhYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2hvd2luZykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNob3dpbmcgPSAhc2hvd2luZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZml4IGNhcHR1cmUgbm90IHJlbGVhc2UobW91c2Vkb3duIGFuZCBkcmFnIG91dCk7XG4gICAgICAgICAgICB2YXIgX2N1ciA9IG51bGw7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgX2N1ciAmJiBfY3VyLnJlbGVhc2VDYXB0dXJlICYmIF9jdXIucmVsZWFzZUNhcHR1cmUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBqcXVlcnkuZGVsZWdhdGUoXCIueXNlbC1pbnB1dFwiLCBcImNsaWNrXCIgKyBTRUxFQ1RPUl9FVkVOVCwgdG9nZ2xlRXZlbnQpXG4gICAgICAgICAgICAgICAgLmRlbGVnYXRlKFwiLnlzZWwtYXJyYXdcIiwgXCJtb3VzZWRvd25cIiArIFNFTEVDVE9SX0VWRU5ULCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJpbnB1dFwiKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldENhcHR1cmUpIHsgdGhpcy5zZXRDYXB0dXJlKCk7IH1cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlRXZlbnQoZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZGVsZWdhdGUoXCIueXNlbC1hcnJhd1wiLCBcImNsaWNrXCIgKyBTRUxFQ1RPUl9FVkVOVCwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbGVhc2VDYXB0dXJlKSB7IHRoaXMucmVsZWFzZUNhcHR1cmUoKTsgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRlbGVnYXRlKFwiLnlzZWwtaW5wdXRcIiwgXCJmb2N1c291dFwiICsgU0VMRUNUT1JfRVZFTlQsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG93aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gc2VsZi52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IHNlbGYuX2dldEJ5VmFsdWUodmFsKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgZXh0ZXJhbCBiaW5kXG4gICAgICAgICAgICAgICAgICAgICQoJC5mbi55c2VsZWN0b3IuZXZlbnRzKS50cmlnZ2VyKFwiYmx1clwiLCBbIHNlbGYsIG9iaiwgc2VsZi5vcHRpb24oXCJob2xkZXJcIildKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kZWxlZ2F0ZShcIi55c2VsLXN1ZyB1bFwiLCBcIm1vdXNlZG93blwiICsgU0VMRUNUT1JfRVZFTlQsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0Q2FwdHVyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRDYXB0dXJlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY3VyID0gdGhpczsgLy8gZml4IGNhcHR1cmUgbm90IHJlbGVhc2UobW91c2Vkb3duIGFuZCBkcmFnIG91dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQsIGluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PT0gXCJBXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJCh0YXJnZXQpLmRhdGEoXCJpbmRleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gJCh0YXJnZXQpLnBhcmVudHNVbnRpbChcIi55c2VsLXN1Z1wiLFwiYVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGEubGVuZ3RoID09IDApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGEuZGF0YShcImluZGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbmRleChpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlRXZlbnQoZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZGVsZWdhdGUoXCIueXNlbC1zdWcgdWxcIiwgXCJjbGlja1wiICsgU0VMRUNUT1JfRVZFTlQsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWxlYXNlQ2FwdHVyZSkgeyB0aGlzLnJlbGVhc2VDYXB0dXJlKCk7IH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kZWxlZ2F0ZShcIi55c2VsLXN1ZyB1bFwiLCBcIm1vdXNlZW50ZXJcIiArIFNFTEVDVE9SX0VWRU5ULCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fY3VyKCkucmVtb3ZlQ2xhc3MoSE9WRVIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRlbGVnYXRlKFwiLnlzZWwtaW5wdXRcIiwgXCJrZXlkb3duXCIgKyBTRUxFQ1RPUl9FVkVOVCwgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9uKFwiZGlzYWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBlLmtleUNvZGU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoY29kZSA9PT0gMzcgfHwgY29kZSA9PT0gMzgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmV2aW91cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY29kZSA9PT0gMzkgfHwgY29kZSA9PT0gNDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjb2RlID09PSAxMyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVFdmVudChlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNvZGUgPT09IDgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIF9jdXI6IGZ1bmN0aW9uKGkpe1xuICAgICAgICAgICAgdmFyIHNlbGYgICAgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSAoaSA9PSBudWxsKSA/IHNlbGYub3B0aW9uKFwiaW5kZXhcIikgOiBpLFxuICAgICAgICAgICAgICAgIGN1ciAgICAgPSBzZWxmLm9wdGlvbihcInN1Z2dlc3RcIikuZmluZChcImE6ZXEoXCIgKyBjdXJyZW50ICsgXCIpXCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3VyO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu66Ieq5a6a5LmJc2VsZWN057uE5Lu2XG4gICAgICAgICAqIOS/neWtmHNlbGVjdOe7hOS7tixzZWxlY3Tnu4Tku7bkuIvmi4nlhYPntKAsc2VsZWN057uE5Lu2dGl0bGVcbiAgICAgICAgICovXG4gICAgICAgIF9kcmF3SHRtbDogZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgZnVsbEhUTUwgPSBbJzxkaXYgY2xhc3M9XCJ1aS15c2VsZWN0b3JcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInlzZWwtYm94XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwieXNlbC1hcnJhd1wiPjxiPjwvYj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwieXNlbC1pbnB1dFwiIHRhYmluZGV4PVwiMFwiPjwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCIgY2xhc3M9XCJ5c2VsLXN1Z1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHVsPjwvdWw+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PiddO1xuXG4gICAgICAgICAgICB2YXIganF1ZXJ5ID0gJChmdWxsSFRNTC5qb2luKFwiXFxuXCIpKSxcbiAgICAgICAgICAgICAgICBob2xkZXIgPSBzZWxmLm9wdGlvbihcImhvbGRlclwiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIGhvbGRlci5hZnRlcihqcXVlcnkpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJqcXVlcnlcIiwganF1ZXJ5KTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwic3VnZ2VzdFwiLCAkKFwiLnlzZWwtc3VnXCIsIGpxdWVyeSkpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb24oXCJpbnB1dFwiLCAkKFwiLnlzZWwtaW5wdXRcIiwganF1ZXJ5KSk7XG4gICAgICAgIH0sXG4gICAgICAgIF9kcmF3U3VnZ2VzdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBsaXN0SHRtbEFycmF5ID0gW10sIGl0ZW0sXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgbGlzdCA9IHNlbGYub3B0aW9uKFwiZGF0YVwiKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBsaXN0W2ldO1xuICAgICAgICAgICAgICAgIGxpc3RIdG1sQXJyYXkucHVzaCgnPGxpIGNsYXNzPVwianMtc2VhcmNoLXR5cGVcIj48YSBkYXRhLXZhbHVlPVwiJyArIGl0ZW0udmFsdWUgKyAnXCIgaGlkZWZvY3VzPVwib25cIiBkYXRhLWluZGV4PVwiJyArIGkgKyAnXCInKTtcbiAgICAgICAgICAgICAgICBsaXN0SHRtbEFycmF5LnB1c2goJyBvbmNsaWNrPVwicmV0dXJuIGZhbHNlO1wiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiB0YWJpbmRleD1cIi0xXCI+JyArIGl0ZW0udGV4dCApO1xuICAgICAgICAgICAgICAgIGxpc3RIdG1sQXJyYXkucHVzaCgnPC9hPjwvbGk+Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwic3VnZ2VzdFwiKS5odG1sKFwiPHVsPlwiICsgbGlzdEh0bWxBcnJheS5qb2luKFwiXFxuXCIpICsgXCI8L3VsPlwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3NldE9wdGlvbnM6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHNlbGYub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBTZWxlY3Rvci5vcHRpb25zLCBvYmopO1xuXG4gICAgICAgICAgICB2YXIgcmF3U2VsZWN0ID0gb2JqLnJhd1NlbGVjdCxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gcmF3U2VsZWN0Lm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSByYXdTZWxlY3Quc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgICAgICAgICBkYXRhTGlzdCA9IFtdLCBpdGVtO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgZGF0YUxpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtLnZhbHVlIHx8IGl0ZW0udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbS50ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwiaG9sZGVyXCIsICQocmF3U2VsZWN0KSk7XG4gICAgICAgICAgICBzZWxmLm9wdGlvbihcImluZGV4XCIsIG9iai5pbmRleCAhPSBudWxsID8gb2JqLmluZGV4IDogaW5kZXgpO1xuICAgICAgICAgICAgc2VsZi5fZHJhd0h0bWwoKTtcbiAgICAgICAgICAgIHNlbGYuc2V0T3B0aW9ucyhkYXRhTGlzdCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgX2dldEJ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbGlzdCA9IHRoaXMub3B0aW9uKFwiZGF0YVwiKSxcbiAgICAgICAgICAgICAgICBpdGVtO1xuXG4gICAgICAgICAgICBrZXkgPSBrZXkgfHwgXCJ2YWx1ZVwiO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGxpc3RbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbVtrZXldID09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOagueaNrm9iaiDmm7TmlrBzZWxlY3Tnu4Tku7bpgInpoblcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAgICAgKiBAcGFyYW0ge2ludH0gb2JqLmluZGV4XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvYmoudmFsdWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9iai50ZXh0XG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZm9yY2VcbiAgICAgICAgICovXG4gICAgICAgIF9zZXRCeU9iamVjdDogZnVuY3Rpb24ob2JqLCBmb3JjZSl7XG5cbiAgICAgICAgICAgIG9iaiA9IG9iaiB8fCB7fTtcblxuICAgICAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLm9wdGlvbihcImluZGV4XCIpID09PSBvYmouaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBvbnNlbGVjdCA9IHNlbGYub3B0aW9uKFwib25zZWxlY3RcIiksXG4gICAgICAgICAgICAgICAgb25jaGFuZ2UgPSBzZWxmLm9wdGlvbihcIm9uY2hhbmdlXCIpO1xuXG4gICAgICAgICAgICB2YXIgdGV4dCA9IG9uc2VsZWN0ID8gb25zZWxlY3Qob2JqLnRleHQpIDogKG9iai50ZXh0IHx8IFwiXCIpO1xuXG4gICAgICAgICAgICBzZWxmLm9wdGlvbihcInZhbHVlXCIsIG9iai52YWx1ZSB8fCBcIlwiKTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwidGV4dFwiLCB0ZXh0KTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9uKFwiaW5kZXhcIiwgb2JqLmluZGV4IHx8IDApO1xuXG4gICAgICAgICAgICB2YXIgaG9sZGVyID0gc2VsZi5vcHRpb24oXCJob2xkZXJcIiksXG4gICAgICAgICAgICAgICAgaW5wdXQgPSBzZWxmLm9wdGlvbihcImlucHV0XCIpO1xuXG4gICAgICAgICAgICBpZiAoaG9sZGVyKSB7IGhvbGRlclswXS5zZWxlY3RlZEluZGV4ID0gb2JqLmluZGV4OyB9XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHsgc2VsZi5vcHRpb24oXCJpbnB1dFwiKS50ZXh0KHRleHQpOyB9XG5cbiAgICAgICAgICAgIGlmIChvbmNoYW5nZSkgeyBvbmNoYW5nZS5jYWxsKHNlbGYsIG9iaik7IH1cblxuICAgICAgICAgICAgLy8gZm9yIGV4dGVyYWwgYmluZFxuICAgICAgICAgICAgJCgkLmZuLnlzZWxlY3Rvci5ldmVudHMpLnRyaWdnZXIoXCJjaGFuZ2VcIiwgWyBzZWxmLCBvYmosIHNlbGYub3B0aW9uKFwiaG9sZGVyXCIpXSk7XG4gICAgICAgIH0sXG4gICAgICAgIF90cmlnZ2VyQ2xhc3M6IGZ1bmN0aW9uKGksIGope1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAoaSA9PT0gaikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5fY3VyKGkpLnJlbW92ZUNsYXNzKEhPVkVSKTtcbiAgICAgICAgICAgIHNlbGYuX2N1cihqKS5hZGRDbGFzcyhIT1ZFUik7XG4gICAgICAgIH0sXG4gICAgICAgIF9zaG93OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHN1Z2dlc3QgPSBzZWxmLm9wdGlvbihcInN1Z2dlc3RcIiksXG4gICAgICAgICAgICAgICAgaW5kZXggPSBzZWxmLm9wdGlvbihcImluZGV4XCIpLFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNlbGYub3B0aW9uKFwiZGlyZWN0aW9uXCIpO1xuXG4gICAgICAgICAgICBzZWxmLl9kcmF3U3VnZ2VzdCgpO1xuXG4gICAgICAgICAgICB2YXIgbGlzdCA9IHN1Z2dlc3QuZmluZChcImFcIik7XG5cbiAgICAgICAgICAgIGxpc3QuZXEoaW5kZXgpLmFkZENsYXNzKEhPVkVSKTtcblxuICAgICAgICAgICAgc3VnZ2VzdC5zaG93KCk7XG5cbiAgICAgICAgICAgIHZhciBtYXhSb3dzID0gc2VsZi5vcHRpb24oXCJtYXhSb3dzXCIpO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IE1hdGgubWluKGxpc3Quc2l6ZSgpLCBtYXhSb3dzKSAqIGxpc3QuaGVpZ2h0KCk7XG4gICAgICAgICAgICB2YXIgcHJldiA9IHNlbGYub3B0aW9uKFwianF1ZXJ5XCIpLCB0b3A7XG4gICAgICAgICAgICBzd2l0Y2goZGlyZWN0aW9uKXtcbiAgICAgICAgICAgICAgICBjYXNlIFwidG9wXCI6XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IDAgLSBoZWlnaHQgLSBwcmV2LmhlaWdodCgpIC0gMjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICAgICAgICB0b3AgPSA1O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAvLyDmoLnmja7kuIvmlrnnqbrpl7TlhrPlrprlnKhib3R0b23ov5jmmK90b3DlsZXnpLpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpbiA9JCh3aW5kb3cpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldlRvcCA9IHByZXYub2Zmc2V0KCkudG9wICsgcHJldi5oZWlnaHQoKSArIDMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdCA9IHdpbi5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoID0gd2luLmhlaWdodCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHByZXZUb3AgKyBoZWlnaHQgPiBzdCArIHdoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9IDAgLSBoZWlnaHQgLSBwcmV2LmhlaWdodCgpIC0gMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9IDU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN1Z2dlc3QuZmluZChcInVsXCIpLmNzcyhcImhlaWdodFwiLCBoZWlnaHQpLmNzcyhcInRvcFwiLCB0b3ApLnNjcm9sbFRvcChzZWxmLm9wdGlvbignaW5kZXgnKSAqIGxpc3QuaGVpZ2h0KCkpO1xuICAgICAgICB9LFxuICAgICAgICBfaGlkZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uKFwic3VnZ2VzdFwiKS5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmuIXnqbrljp/nlJ9zZWxlY3Qg5bm25bCGbGlzdOi9rOaNouS4uk9wdGlvbua3u+WKoOWIsHNlbGVjdOS4rVxuICAgICAgICAgKiDlubbmoLnmja50aGlzLm9wdGlvbihcImluZGV4XCIp55qE5YC8IOmAieaLqeWvueW6lOeahG9wdGlvbumAiemhuVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbGlzdCBzZWxlY3Qgb3B0aW9u5pWw5o2u5a+56LGhXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsaXN0LnZhbHVlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsaXN0LnRleHRcbiAgICAgICAgICovXG4gICAgICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uKGxpc3Qpe1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGpxdWVyeSA9IHNlbGYub3B0aW9uKFwianF1ZXJ5XCIpO1xuXG4gICAgICAgICAgICBsaXN0ID0gbGlzdCB8fCBbXTtcblxuICAgICAgICAgICAgdmFyIHNlbGVjdCA9IHNlbGYub3B0aW9uKFwiaG9sZGVyXCIpWzBdO1xuICAgICAgICAgICAgLy/muIXnqbrljp/nlJ9zZWxlY3TpgInpoblcbiAgICAgICAgICAgICAgICBzZWxlY3QubGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aCwgdGVtcDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBsaXN0W2ldO1xuICAgICAgICAgICAgICAgIHRlbXAuaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIHNlbGVjdC5vcHRpb25zLmFkZChuZXcgT3B0aW9uKHRlbXAudGV4dCwgdGVtcC52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLm9wdGlvbihcImRhdGFcIiwgbGlzdCk7XG5cbiAgICAgICAgICAgIGlmICghbGlzdC5sZW5ndGggJiYgc2VsZi5vcHRpb24oXCJlbXB0eUhpZGRlblwiKSkge1xuICAgICAgICAgICAgICAgIGpxdWVyeS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGpxdWVyeS5zaG93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuX3NldEJ5T2JqZWN0KGxpc3Rbc2VsZi5vcHRpb24oXCJpbmRleFwiKV0gfHwgbGlzdFswXSwgdHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZpcnN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uKFwiZGF0YVwiKVswXSB8fCB7fTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOivu+WPluaIluabtOaWsOmFjee9ruWPguaVsCh0aGlzLm9wdGlvbnMpXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkg6YWN572u5Y+C5pWwa2V5XG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWwg5pu05paw5pe2IOimgeiuvue9rueahOmFjee9ruWPguaVsOWvueW6lOeahOWAvFxuICAgICAgICAgKi9cbiAgICAgICAgb3B0aW9uOiBmdW5jdGlvbihrZXksIHZhbCl7XG5cbiAgICAgICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gdmFsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHByZXZpb3VzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gc2VsZi5pbmRleCgpIC0gMTtcblxuICAgICAgICAgICAgaWYoaW5kZXggPCAwKXtcbiAgICAgICAgICAgICAgICBpbmRleCA9IHNlbGYub3B0aW9uKFwiZGF0YVwiKS5sZW5ndGggKyBpbmRleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5pbmRleChpbmRleCk7XG4gICAgICAgIH0sXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHNlbGYuaW5kZXgoc2VsZi5vcHRpb24oXCJpbmRleFwiKSArIDEpO1xuICAgICAgICB9LFxuICAgICAgICBpbmRleDogZnVuY3Rpb24oaSl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChpID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5vcHRpb24oXCJpbmRleFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBzZWxmLm9wdGlvbihcImRhdGFcIiksXG4gICAgICAgICAgICAgICAgb2JqID0gZGF0YVtpXSxcbiAgICAgICAgICAgICAgICBpbmRleCA9IHNlbGYub3B0aW9uKFwiaW5kZXhcIik7XG5cbiAgICAgICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICAgICAgb2JqID0gc2VsZi5maXJzdCgpO1xuICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLl9zZXRCeU9iamVjdChvYmopO1xuICAgICAgICB9LFxuICAgICAgICB2YWw6IGZ1bmN0aW9uKHZhbHVlLCBmb3JjZSl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYub3B0aW9uKFwidmFsdWVcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvYmogPSBzZWxmLl9nZXRCeVZhbHVlKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgb2JqID0gc2VsZi5maXJzdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLl9zZXRCeU9iamVjdChvYmosIGZvcmNlKTtcblxuICAgICAgICB9LFxuICAgICAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLm9wdGlvbihcInRleHRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvYmogPSBzZWxmLl9nZXRCeVZhbHVlKHRleHQsIFwidGV4dFwiKTtcblxuICAgICAgICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgb2JqID0gc2VsZi5maXJzdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLl9zZXRCeU9iamVjdChvYmopO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbihcImpxdWVyeVwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImRpc2JsZVwiKTtcblxuICAgICAgICAgICAgdGhpcy5vcHRpb24oXCJkaXNhYmxlXCIsIHRydWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbmFibGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbihcImpxdWVyeVwiKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImRpc2JsZVwiKTtcblxuICAgICAgICAgICAgdGhpcy5vcHRpb24oXCJkaXNhYmxlXCIsIGZhbHNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3JlZHJhd0xpc3Q6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgcmF3U2VsZWN0ID0gdGhpcy5vcHRpb24oJ2hvbGRlcicpWzBdLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSByYXdTZWxlY3Qub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBkYXRhTGlzdCA9IFtdLCBpdGVtO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgZGF0YUxpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtLnZhbHVlIHx8IGl0ZW0udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbS50ZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbnMoZGF0YUxpc3QpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgc2VsID0gdGhpcy5vcHRpb24oJ2hvbGRlcicpWzBdLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBzZWwub3B0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMucmVtb3ZlKGluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuX3JlZHJhd0xpc3QoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkOiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSB0aGlzLm9wdGlvbignaG9sZGVyJylbMF0sXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHNlbC5vcHRpb25zO1xuICAgICAgICAgICAgb3B0aW9ucy5hZGQob3B0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3JlZHJhd0xpc3QoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgJC5mbi5leHRlbmQoe1xuICAgICAgICB5c2VsZWN0b3I6IGZ1bmN0aW9uKGNvbmZpZyl7XG5cbiAgICAgICAgICAgICQuZm4ueXNlbGVjdG9yLmV2ZW50cyA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSl7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGluc3QgPSBzZWxmLmRhdGEoU0VMRUNUT1JfREFUQV9LRVkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnJhd1NlbGVjdCA9IHNlbGZbMF07XG4gICAgICAgICAgICAgICAgICAgIGluc3QgPSBuZXcgU2VsZWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kYXRhKFNFTEVDVE9SX0RBVEFfS0VZLCBpbnN0KTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdC5faW5pdChjb25maWcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufSkoalF1ZXJ5KTtcblxuXG4iLCJ2YXIgY29va2llcyA9IHJlcXVpcmUoJy4uL2xpYi9jb29raWVzJyk7XG52YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG52YXIgZGVmX29wdCA9IHtcbiAgICBjYWNoZSA6IGZhbHNlLFxuICAgIGRhdGFUeXBlIDogXCJqc29uXCJcbn07XG5cbnZhciBhamF4ID0gZnVuY3Rpb24ob3B0KXtcbiAgICBvcHQgPSAkLmV4dGVuZChkZWZfb3B0ICwgb3B0ICk7XG4gICAgdmFyIGRhdGEgPSBvcHQuZGF0YSB8fCB7fTtcbiAgICBkYXRhLmNzcmZ0b2tlbiA9IGNvb2tpZXMuZ2V0SXRlbShcImNzcmZ0b2tlblwiKTtcbiAgICBvcHQuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuICQuYWpheChvcHQpO1xufVxuXG52YXIgaHR0cCA9IHtcbiAgICBnZXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBvcHQudHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgIHJldHVybiBhamF4KG9wdCk7XG4gICAgfSxcbiAgICBwb3N0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgb3B0LnR5cGUgPSBcInBvc3RcIjtcbiAgICAgICAgcmV0dXJuIGFqYXgob3B0KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGh0dHA7XG4iLCJ2YXIgRGlhbG9nID0gcmVxdWlyZShcIi4uL2xpYi9pZGlhbG9nXCIpO1xuXG5cbnZhciBwb3AgPSBmdW5jdGlvbihjb250ZW50KXtcbiAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgIGNvbnRlbnQgOiBjb250ZW50XG4gICAgfSk7XG4gICAgZGxnLmhpZGUoKTtcbiAgICByZXR1cm4gZGxnO1xufVxuXG5cbnZhciBhbGVydF9kbGcgLCBjb25maXJtX2RsZyA7XG52YXIgb2JqID0ge1xuXG4gICAgYWxlcnQgOiBmdW5jdGlvbihtc2cpe1xuICAgICAgICBpZiAoIWFsZXJ0X2RsZykge1xuICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIm0tcG9wIG0tcG9wLWFsZXJ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWJkIFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFsZXJ0LWN0IGpzX2NvbnRlbnRcIj4nK21zZysnPC9wPlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1mdFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tY2ZyIGpzX2Nsb3NlXCI+56Gu5a6aPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgIGFsZXJ0X2RsZyA9IHBvcChodG1sKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0X2RsZy5nZXRDb250ZW50KCkudGV4dChtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGFsZXJ0X2RsZy5zaG93KCk7XG4gICAgICAgIHJldHVybiBhbGVydF9kbGc7XG4gICAgfSxcbiAgICBjb25maXJtIDogZnVuY3Rpb24obXNnLHN1YyxlcnIpe1xuICAgICAgICAgIHN1YyA9IHN1YyB8fCBmdW5jdGlvbigpe307XG4gICAgICAgICAgZXJyID0gZXJyIHx8IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgIGlmICghY29uZmlybV9kbGcpIHtcbiAgICAgICAgICAgIHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJtLXBvcCBtLXBvcC1hbGVydFwiPlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1iZCBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJhbGVydC1jdCBqc19jb250ZW50XCI+Jyttc2crJzwvcD5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtZnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi13cmFwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWNmclwiPuehruWumjwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1jYW5jZWxcIj7lj5bmtog8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgY29uZmlybV9kbGcgPSBwb3AoaHRtbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maXJtX2RsZy5nZXRDb250ZW50KCkudGV4dChtc2cpO1xuICAgICAgICB9XG4gICAgICAgIHZhciAkZDEgPSBjb25maXJtX2RsZy5nZXREbGdEb20oKS5maW5kKFwiLmJ0bi1jZnJcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbmZpcm1fZGxnLmhpZGUoKTtcbiAgICAgICAgICAgIHN1YyAmJiBzdWMoKTsgXG4gICAgICAgICAgICAkZDEudW5iaW5kKCk7IFxuICAgICAgICAgICAgJGQyLnVuYmluZCgpOyBcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciAkZDIgPSBjb25maXJtX2RsZy5nZXREbGdEb20oKS5maW5kKFwiLmJ0bi1jYW5jZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbmZpcm1fZGxnLmhpZGUoKTtcbiAgICAgICAgICAgICRkMS51bmJpbmQoKTsgXG4gICAgICAgICAgICAkZDIudW5iaW5kKCk7IFxuICAgICAgICAgICAgZXJyICYmIGVycigpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uZmlybV9kbGcuc2hvdygpOyBcbiAgICB9LFxuICAgIGhkX2RsZyA6IGZ1bmN0aW9uKCRkb20sdGl0bGUsY2IsY2xvc2VfZm4pe1xuICAgICAgICB2YXIgJHdyYXAgPSAgJCgnPGRpdiBjbGFzcz1cIm0tcG9wXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWhkXCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiaGQtY2xvc2UganNfY2xvc2VcIj4mdGltZXM7PC9hPjxoND4nK3RpdGxlKyc8L2g0PjwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1iZCBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzX2NvbnRlbnRcIj48L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtZnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi13cmFwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWNmclwiPuehruWumjwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgIDwvZGl2PicpOyAgIFxuICAgICAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgICAgICBjb250ZW50IDogJHdyYXAsXG4gICAgICAgICAgICBjbG9zZV9mbiA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZGxnLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGNsb3NlX2ZuICYmIGNsb3NlX2ZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkd3JhcC5maW5kKFwiLmJ0bi1jZnJcIikuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjYiAmJiBjYihkbGcuZ2V0Q29udGVudCgpLGRsZyk7XG4gICAgICAgIH0pO1xuICAgICAgICBkbGcuZ2V0Q29udGVudCgpLmh0bWwoJGRvbSk7XG4gICAgICAgIGRsZy5oaWRlKCk7XG4gICAgICAgIHJldHVybiBkbGc7XG4gICAgfSxcbiAgICBkbGcgOiBmdW5jdGlvbihjb250ZW50LG1hc2tWaXNpYmxlKXtcbiAgICAgICAgdmFyIGRsZyA9IG5ldyBEaWFsb2coe1xuICAgICAgICAgICAgY29udGVudCA6IGNvbnRlbnQsXG4gICAgICAgICAgICBtYXNrVmlzaWJsZSA6ICEhbWFza1Zpc2libGVcbiAgICAgICAgfSk7XG4gICAgICAgIGRsZy5oaWRlKCk7XG4gICAgICAgIHJldHVybiBkbGc7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iajtcblxuXG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCIuLi9saWIvanF1ZXJ5LmpzXCIpO1xudmFyIFVwbG9hZGVyID0gcmVxdWlyZShcIi4uL2xpYi9pdXBsb2FkLmpzXCIpO1xudmFyIGh0dHAgPSByZXF1aXJlKFwiLi4vbW9kL2h0dHAuanNcIik7XG5yZXF1aXJlKFwiLi4vbGliL2lmb3JtLmpzXCIpO1xudmFyIHVybF9wYXJhbXMgPSByZXF1aXJlKFwiLi4vbGliL3NlYXJjaF9wYXJhbXMuanNcIikucGFyYW1zO1xuJChmdW5jdGlvbigpe1xuICAgICQoXCIjb3BlcmF0aW9uLW5hdlwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAkKFwiI29wLWFkZC1zdWJqZWN0XCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXG4gICAgaW5pdFVwbG9hZCgpO1xuICAgIGFkZFN1YmplY3QoKTtcbiAgICB2YXIgc3ViamVjdF9pZCA9IHVybF9wYXJhbXMuc3ViamVjdF9pZDtcbiAgICBpZiAoc3ViamVjdF9pZCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICQoXCJidXR0b24uYWRkLXN1YmplY3RcIikuaHRtbChcIuS/neWtmFwiKS5hZnRlcigkKCc8YSBocmVmPVwiL20vb3BlcmF0aW9uL3N1YmplY3RfaXRlbV9lZGl0P3N1YmplY3RfaWQ9JytzdWJqZWN0X2lkKydcIiBjbGFzcz1cImJ0biBidG4taW5mb1wiID7kuJPpopjor6bmg4U8L2E+JykpO1xuXG4gICAgICAgIGh0dHAuZ2V0KHtcbiAgICAgICAgICAgIHVybCA6IFwiL2FwaS9nZXRBbGJ1bS5odG1cIixcbiAgICAgICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgaWQgOiBzdWJqZWN0X2lkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICB2YXIgZGF0YSA9IHJzLmFsYnVtO1xuICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgJChcIiNzdWJqZWN0X25hbWVcIikudmFsKGRhdGEubmFtZSk7XG4gICAgICAgICAgICAgICAgJChcIiNzdWJqZWN0X2xvZ29cIikudmFsKGRhdGEuaW1hZ2VVcmwpO1xuICAgICAgICAgICAgICAgICQoXCIjY29udGVudFwiKS52YWwoZGF0YS5jb250ZW50KTtcbiAgICAgICAgICAgICAgICAkKFwiI3VwbG9hZC1pbWdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpLmZpbmQoXCJpbWdcIikuYXR0cihcInNyY1wiLCBkYXRhLmltYWdlVXJsKSBcbiAgICAgICAgICAgICAgICAkKFwiI3VwbG9hZC1pbWcgaDRcIikuaHRtbChcIuS4k+mimOWktOWbvlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kZXRhaWxJbWFnZVVybCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2RldGFpbC1zdWJqZWN0X2xvZ29cIikudmFsKGRhdGEuZGV0YWlsSW1hZ2VVcmwpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2RldGFpbC11cGxvYWQtaW1nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5maW5kKFwiaW1nXCIpLmF0dHIoXCJzcmNcIiwgZGF0YS5kZXRhaWxJbWFnZVVybCk7IFxuICAgICAgICAgICAgICAgICAgICAkKFwiI2RldGFpbC11cGxvYWQtaW1nIGg0XCIpLmh0bWwoXCLor6bmg4XpobXlpLTlm75cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGVydChcIuiOt+WPluS4k+mimOWfuuacrOS/oeaBr+Wksei0pVwiKTtcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgYWxlcnQoXCLojrflj5bkuJPpopjln7rmnKzkv6Hmga/lpLHotKVcIik7XG4gICAgICAgIH0pXG5cbiAgICB9XG4gICAgICAgXG5cbmZ1bmN0aW9uIGFkZFN1YmplY3QoKXtcbiAgICB2YXIgJGZvcm0gPSAkKFwiI3N1YmplY3RfZm9ybVwiKTtcbiAgICAkZm9ybS5mb3JtKHtcbiAgICAgICAgZGF0YV9tYXAgOiB7XG4gICAgICAgICAgICBuYW1lIDogXCIjc3ViamVjdF9uYW1lXCIsXG4gICAgICAgICAgICBpbWFnZVVybCA6IFwiI3N1YmplY3RfbG9nb1wiLFxuICAgICAgICAgICAgZGV0YWlsSW1hZ2VVcmwgOiBcIiNkZXRhaWwtc3ViamVjdF9sb2dvXCIsXG4gICAgICAgICAgICBzdGFydERhdGUgOiBcIiNzdGFydF9kYXRlXCIsXG4gICAgICAgICAgICBlbmREYXRlIDogXCIjZW5kX2RhdGVcIixcbiAgICAgICAgICAgIGNvbnRlbnQgOiBcIiNjb250ZW50XCJcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICRmb3JtLm9uKFwiZm9ybS1zdWJtaXRcIixmdW5jdGlvbihlLGZvcm1fZGF0YSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKCEoZm9ybV9kYXRhLm5hbWUgJiYgZm9ybV9kYXRhLmltYWdlVXJsKSkge1xuICAgICAgICAgICAgYWxlcnQoXCLmsqHmnInloavlhpnlrozmlbDmja5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1YmplY3RfaWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaHR0cC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmwgOiBcIi9hcGkvYWRkQWxidW0uaHRtXCIsXG4gICAgICAgICAgICAgICAgZGF0YSA6IGZvcm1fZGF0YSxcbiAgICAgICAgICAgICAgICBhc3luYyA6IGZhbHNlXG5cbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICAgICAgIGlmIChycy5yZXQgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWxidW0gPSBycy5hbGJ1bTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCIvbS9vcGVyYXRpb24vc3ViamVjdF9pdGVtX2VkaXQ/c3ViamVjdF9pZD1cIisgYWxidW0uaWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmt7vliqDlpLHotKVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwi5re75Yqg5aSx6LSlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIGZvcm1fZGF0YS5pZCA9IHN1YmplY3RfaWQ7XG4gICAgICAgICAgIGh0dHAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsIDogXCIvYXBpL3VwZGF0ZUFsYnVtLmh0bVwiLFxuICAgICAgICAgICAgICAgIGRhdGEgOiBmb3JtX2RhdGEsXG4gICAgICAgICAgICAgICAgYXN5bmMgOiBmYWxzZVxuXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgICAgICBpZiAocnMucmV0ID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsYnVtID0gcnMuYWxidW07XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5pu05paw5LiT6aKY5oiQ5YqfXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5re75Yqg5aSx6LSlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIua3u+WKoOWksei0pVwiKTtcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGluaXRVcGxvYWQoKXtcbiAgICBVcGxvYWRlci5jcmVhdGVfdXBsb2FkKHtcbiAgICAgICAgZG9tIDogJChcIiNsb2dvLXVwbG9hZFwiKVswXSxcbiAgICAgICAgbXVsdGlfc2VsZWN0aW9uIDogZmFsc2UsXG4gICAgICAgIGNhbGxiYWNrIDogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB2YXIgcGF0aExpc3QgPSBkYXRhLnBhdGhMaXN0O1xuICAgICAgICAgICAgaWYgKHBhdGhMaXN0ICYmIHBhdGhMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoXCIjc3ViamVjdF9sb2dvXCIpLnZhbChwYXRoTGlzdFswXSk7XG4gICAgICAgICAgICAgICAgJChcIiN1cGxvYWQtaW1nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5maW5kKFwiaW1nXCIpLmF0dHIoXCJzcmNcIiwgcGF0aExpc3RbMF0pIFxuICAgICAgICAgICAgICAgICQoXCIjdXBsb2FkLWltZyBoNFwiKS5odG1sKFwi5LiT6aKY5aS05Zu+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgVXBsb2FkZXIuY3JlYXRlX3VwbG9hZCh7XG4gICAgICAgIGRvbSA6ICQoXCIjZGV0YWlsLWxvZ28tdXBsb2FkXCIpWzBdLFxuICAgICAgICBtdWx0aV9zZWxlY3Rpb24gOiBmYWxzZSxcbiAgICAgICAgY2FsbGJhY2sgOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHZhciBwYXRoTGlzdCA9IGRhdGEucGF0aExpc3Q7XG4gICAgICAgICAgICBpZiAocGF0aExpc3QgJiYgcGF0aExpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJChcIiNkZXRhaWwtc3ViamVjdF9sb2dvXCIpLnZhbChwYXRoTGlzdFswXSk7XG4gICAgICAgICAgICAgICAgJChcIiNkZXRhaWwtdXBsb2FkLWltZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIikuZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIsIHBhdGhMaXN0WzBdKSBcbiAgICAgICAgICAgICAgICAkKFwiI2RldGFpbC11cGxvYWQtaW1nIGg0XCIpLmh0bWwoXCLor6bmg4XpobXlpLTlm75cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxufSk7XG4iXX0=
