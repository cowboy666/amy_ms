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

},{"./ibrowser":2}],4:[function(require,module,exports){
var $ = require("./jquery");
var render = function(dom,now, total, limit) {
	var max = Math.ceil(total / limit);
	var pager = {
		now: now,
		max: max
	};
	var pages = create(pager);
	render_html(dom,pages, pager);
}

var render_html = function(dom,pages, pagger) {
	/** 分页**/
	var now = pagger.now;
	var html = ['<div class="pages">'];
	for (var i = 0, l = pages.length; i < l; i++) {
		if (typeof pages[i] === "number") {
			if (pages[i] == now) {
				html.push('<em ><span>' + now + '</span></em>');
			} else {
				html.push('<a class="pg-item js-pn" pg="' + pages[i] + '" href="#"><span>' + pages[i] + '</span></a>');
			}
		} else if (typeof pages[i] === "string") {
			html.push("<span >...</span>");
		}
	}

	if (pagger.now < pagger.max) {
		html.push('<a class="pg-item page-next js-p-next" href="#" title="下一页">下一页</a>');
	}
	if (pagger.now > 1) {
		html.splice(1, 0, '<a class="pg-item page-prev js-p-prev" href="#" title="上一页">上一页</a> ');
	}
	html.push("</div>");
	dom.html(html.join(""));
}

function create(pagger) {
	var max = pagger.max,
	now = pagger.now;
	var f_offset = 2; //偏移量
	var l_r_limit = 5;
	var pages = [];
	var gap = "...";
	var rs = [],
	ls = [],
	lv,
	rv,
	maxed = false,
	mined = false;
	lv = rv = now;

	if (1 == max) {
		return [1];
	}
	if (l_r_limit >= max) {
		var pages = [];
		for (var i = 1; i <= max; i++) {
			pages.push(i);
		}
		return pages;
	}
	for (var i = 0; i < f_offset; i++) {
		if (++rv >= max) {
			if (!maxed) {
				rs.push(max);
				maxed = true;
			}
		} else {
			rs.push(rv);
		}
		if (--lv <= 1) {
			if (!mined) {
				ls.splice(0, 0, 1);
				mined = true;
			}
		} else {
			ls.splice(0, 0, lv);
		}

	}

	var pages = ls.concat([now]).concat(rs);
	if (!maxed) {
		if (pages[pages.length - 1] < max - 1) {
			pages.push(gap);
		}
		pages.push(max);
	} else {
		if (l_r_limit > max) {
			pages = [];
			for (var i = 1; i <= max; i++) {
				pages.push(i);
			}
		} else {
			pages = [];
			for (var i = max; i > max - l_r_limit; i--) {
				pages.splice(0, 0, i);
			}
			if (1 < max - l_r_limit) {
				pages.splice(0, 0, gap);
			}
			pages.splice(0, 0, 1);
			return pages;
		}

	}

	if (!mined) {
		if (pages[0] > 2) {
			pages = [1, gap].concat(pages);
		} else {
			pages.splice(0, 0, 1);
		}
	} else {
		if (l_r_limit >= max) {
			pages = [];
			for (var i = 1; i <= max; i++) {
				pages.push(i);
			}
		} else {
			pages = [];
			for (var i = 1; i <= l_r_limit; i++) {
				pages.push(i);
			}
			if (l_r_limit < max - 1) {
				pages.push(gap);
			}
			pages.push(max);
		}

	}

	return pages;
};

module.exports = {
    render : render
};

},{"./jquery":6}],5:[function(require,module,exports){


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


},{"../mod/pop.js":11,"./idialog":3}],6:[function(require,module,exports){
var $ = window.jQuery;
module.exports = $;

},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"../lib/cookies":1}],11:[function(require,module,exports){
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



},{"../lib/idialog":3}],12:[function(require,module,exports){
var $ = require("../lib/jquery.js");
var url_params = require("../lib/search_params.js").params;
var SearchBox = require("./operation/search_box.js");
var SubjectItem = require("./operation/subject_item.js");
var _ = require("../lib/lodash.compat.min.js");
var http = require("../mod/http.js");

$(function(){
    var subject_id = url_params.subject_id;
    if (!subject_id) {
        alert("没有专题ID "); 
        return;
    }
    var $container = $("#subject-items-box");
    var searchbox = new SearchBox({
        limit : 5,
        add_fn : function(data){
            var first ;
            for (var i = 0, l = data.length; i < l; i++) {
                if (!first) {
                    first = addSubjectItem(data[i]);
                } else {
                    addSubjectItem(data[i]);
                }
            }
            if (first) {
                $(window).scrollTop(first.dom().offset().top - 100);
            }
        }
    });
    init();
    searchbox.init();
       
    function init(){
        initSubject(); 
        http.get({
            url  : "/api/getAlbumItemList.htm",
            data : {
                pn : 1,
                ps : 1000,
                albumId : subject_id
            }
        }).done(function(rs){
            var albumItemList = rs.albumItemList || [];
            _.forEach(albumItemList , function(data){
                //商品
                if (data.albumType == 0) {
                    http.get({
                        url : '/api/getProduct.htm',
                        data : {
                            id : data.entityid
                        }
                    }).done(function(rs){
                        if (!(rs.product)) {
                            return;
                        }
                        var shop = rs.product.shop;
                        var product  = rs.product.product;
                        product.shopName = shop.name;
                        addSubjectItem(product,data);
                    })
                } else if (data.albumType == 1) {
                    http.get({
                        url : '/api/getShop.htm',
                        data : {
                            id : data.entityid
                        }
                    }).done(function(rs){
                        var shop  = rs.shop;
                        addSubjectItem(shop,data);
                    })
                    
                }
            })
        });
    
    }
    function initSubject(){
        $("#subject-md-btn").click(function(){
            window.open("/m/operation/subject_edit?subject_id="+subject_id);
        })
        http.get({
            url : "/api/getAlbum.htm",
            data : {
                id : subject_id
            }
        }).done(function(rs){
           var data = rs.album;
           if (data) {
               $("#st-name").html(data.name);
               $("#st-logo").attr("src",data.imageUrl).parent().show();
               return;
           }
            alert("获取专题基本信息失败");
        }).fail(function(){
            alert("获取专题基本信息失败");
        })
    }

    function addSubjectItem(data,item_data){
        var subject_item = new SubjectItem({data: data,subject_id : subject_id ,item_data: item_data});
        subject_item.init();
        $container.append(subject_item.dom());
        return subject_item;
    }


});

},{"../lib/jquery.js":6,"../lib/lodash.compat.min.js":8,"../lib/search_params.js":9,"../mod/http.js":10,"./operation/search_box.js":13,"./operation/subject_item.js":14}],13:[function(require,module,exports){
require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pager = require("../../lib/ipager.js");
var PRD_HD_TPL = require("./tmpl/prd_list_hd.js");
var SHOP_HD_TPL = require("./tmpl/shop_list_hd.js");
var PRD_TD_TPL = require("./tmpl/prd_td.js");
var SHOP_TD_TPL = require("./tmpl/shop_td.js");

juicer.register('shop_status', function(s){
    if (s == 2) {
        return "审核通过";
    } 
    return "审核未通过";
}); 

juicer.register('prd_status', function(s){
    if (s == "2") {
        return "上架"; 
    } else if (s == "1") {
        return "下架";
    } else if (s =="3") {
        return  "删除";        
    }
    return "";
}); 

var Limit = 10;

var SearchBox = function(opt){
    opt = opt || {};
    var $d = this._dom = opt.dom || $("#pd-search-box");
    this._$search_box = $d.find(".m-prd-search");
    this._$list_box = $d.find(".m-result-list");
    this._$page_box = $d.find(".m-page-box");
    this._page_limit = opt.limit || Limit;
    this._opt = opt;
    this._opt.add_fn = opt.add_fn || $.noop;
}

SearchBox.prototype.init = function(){
    this._initSearch();
    this._initResult();
}
SearchBox.prototype._initSearch = function(){
    var me = this , $s = me._$search_box;
    var $f = this._$search_form = $s.find("form");
    this._$add_btn = $f.find(".ai-add");
    var $search_type = $f.find("input[type=radio]");
    var $search_inp = $f.find(".ai-search-inp");
    var search_type  = ["prd","shop"];
    
    this._cur_type = me._opt.default_type || "prd";
    
    if (this._cur_type == "prd") {
        $search_type[0].checked = true;
        $search_type[1].checked = false;
        if (me._opt.only_one) {
             $search_type.eq(1).closest(".radio").hide();
        }
    } else {
        $search_type[0].checked = false;
        $search_type[1].checked = true;
        if (me._opt.only_one) {
             $search_type.eq(0).closest(".radio").hide();
        }
    }

    this._$search_form.on("submit",function(e){
        e.preventDefault();
        var type ; 
        $search_type.each(function(i){
            if (this.checked) {
                type = search_type[this.value];
            }
        });
        var query = $search_inp.val();
        var search_obj = {
            type : type,
            query : query
        };
        me._search(search_obj);
    });
    this._$add_btn.click(function(e){
        var $l = me._$list_box;
        var $ch = $l.find(".ai-ch") || [];
        var data = [];
        var t_dom = [];
        _.forEach($ch,function(dom,i){
            var checked = dom.checked;
            if (checked) {
                var d = $(dom).closest("tr").data("item");
                data.push(d);
                t_dom.push(dom);
            }
        });
        if (data.length) {
            me._opt.add_fn(data); 
            _.forEach(t_dom,function(dom){
               dom.checked = false; 
            });
            me._dom.find(".ai-selected-all input[type=checkbox]").attr("checked",false);
        } else {
            alert("没有选择商品");
        }
    });
}
SearchBox.prototype._initResult = function(){
    var me = this , $l = this._$list_box;
    $l.delegate(".ai-selected-all label","click",function(e){
        var check_dom = $(this).find("input");
        var $td_labels = $l.find("input.ai-ch"); 
        if ($td_labels.length) {
            var checked = check_dom[0].checked;
            if (checked) {
                $td_labels.each(function(){
                    this.checked = true;
                });
            } else {
                $td_labels.each(function(){
                    this.checked = false;
                });
            }
        }
    });

    var $page_dom = this._$page_box; 
        $page_dom.delegate(".pg-item","click",function(e){
           e.preventDefault();
           var pg = this.getAttribute("pg") * 1;
           me.go_page(pg);
        });
       $page_dom.delegate(".js-p-next","click",function(e){
           e.preventDefault();
           var pg = me._cache_params.pn + 1;
           me.go_page(pg);
       });
       $page_dom.delegate(".js-p-prev","click",function(e){
           e.preventDefault();
           var pg = me._cache_params.pn -1;
           me.go_page(pg);
       });  
}

SearchBox.prototype._search = function(obj){
    var query_obj = this._SEARCH_MAP[obj.type];
    var pn = 1 , ps = this._page_limit;
    var params = {pn:pn,ps:ps,q:obj.query};
    this._cache_params = params;
    this._cur_type = obj.type;
    this._renderListHd(obj.type);
    query_obj.search.call(this,params,obj.type);
}
SearchBox.prototype._SEARCH_MAP = {
    "prd" : {
        search : function(params,type){
            var me = this;
            //var url = '/api/getProductList.htm';
            var url = '/searchProduct?from=oss';
            http.get({
                url : url,
                data : params
            }).done(function(rs){
                me._cache_params.pn = params.pn;
                me._renderList(type,rs.data);
                me._renderPage(params.pn,rs.totalNum,params.ps);
            }).fail(function(){
                alert("服务器错误，请刷新重试"); 
            });
        }
    },
    "shop" : {
        search : function(params,type){
            var me = this;
            var url = '/api/getShopList.htm';
            http.get({
                url : url,
                data : params
            }).done(function(rs){
                me._cache_params.pn = params.pn;
                me._renderList(type,rs.shopList);
                me._renderPage(params.pn,rs.totalNum,params.ps);
            }).fail(function(){
               alert("服务器错误，请刷新重试"); 
            });
        }
    }
    
}

SearchBox.prototype._reset = function(){
    this._cache_params = {pn:1,ps:this._page_limit};  
    this._$list_box.empty();
}
SearchBox.prototype._renderListHd = function(type){
    var $l = this._$list_box;
    if (type == "prd") {
        $l.html(PRD_HD_TPL());
    } else {
        $l.html(SHOP_HD_TPL());
    }
    
}
SearchBox.prototype._renderList = function(type,data){
    var $tbody = this._$list_box.find("tbody");
    var tpl ;
    if (type == "prd" ) {
        tpl = PRD_TD_TPL;
    } else {
        tpl = SHOP_TD_TPL;
    }
    $tbody.empty();
    _.forEach(data,function(d,i){
        var html = tpl(d);
        var $tr = $(html);
        $tr.data("item",d);
        $tbody.append($tr);
    });
}
SearchBox.prototype._renderPage = function(cur_page,total,limit){
      pager.render(this._$page_box,cur_page,total,limit); 
}

SearchBox.prototype.go_page = function(p){
    var params = this._cache_params;
    var type = this._cur_type;
    var query_obj = this._SEARCH_MAP[type];
    var q_params = _.extend({},params);
    q_params.pn = p;
    query_obj.search.call(this,q_params,type);
    
}

module.exports = SearchBox;

},{"../../lib/ipager.js":4,"../../lib/jquery.js":6,"../../lib/juicer.js":7,"../../lib/lodash.compat.min.js":8,"../../mod/http.js":10,"./tmpl/prd_list_hd.js":17,"./tmpl/prd_td.js":19,"./tmpl/shop_list_hd.js":20,"./tmpl/shop_td.js":22}],14:[function(require,module,exports){
var $ = require("../../lib/jquery.js");
var _ = require("../../lib/lodash.compat.min.js");
var http = require("../../mod/http.js");
var Uploader = require("../../lib/iupload.js");
var Tpl = require("./tmpl/subject_item.js");
var ShopTpl = require("./tmpl/shop_pf.js");
var PrdTpl = require("./tmpl/prd_pf.js");
var TitleTpl = require("./tmpl/title_content.js");
var ImgTpl = require("./tmpl/img_content.js");
var PTpl = require("./tmpl/p_content.js");


var SubjectItem = function(opt){
    //prd or shop
    this._ex_data = opt.data;
    this._subject_id = opt.subject_id;
    this._init_item_data = opt.item_data;
    this._ids = 0;
    this._items = [];
}

SubjectItem.prototype._key = "专题";
SubjectItem.prototype.init = function(){
    this._createDom();
    this._bind();
    Sortable.create(this._$item_con[0],{
        draggable  : ".ai-row"
    });
}
SubjectItem.prototype.dom = function(){
    return this._dom;
}

SubjectItem.prototype._createDom = function(){
     var me = this;
     var html = Tpl({key:me._key});
     this._dom = $(html);
     this._$ps_dom = this._dom.find(".ai-ps-box");
     this._$item_con = this._dom.find(".ai-content-item");
     this._$form = this._dom.find("form");
     if (this._ex_data.presentPrice !== void 0 ) {
         var ps_html = this._createPrd();
         this._typeid = 0;
     } else {
         var ps_html = this._createShop();
         this._typeid = 1;
     }
    this._$ps_dom.html(ps_html);
    this._dom.find(".ai-st-title").val(this._ex_data.title || this._ex_data.name);
     if (this._init_item_data ) {
        var content = this._init_item_data.content;
        var title = this._init_item_data.title;
        this._dom.find(".ai-st-title").val(title);
        content = JSON.parse(content);
        if (content && content.length) {
            _.forEach(content,function(d){
                me._addContentByData(d);
            })
        }
     } else {
        this.addContent(1);
     }

}
SubjectItem.prototype._bind = function(){
    var me = this;
    this._$form.on("submit",function(e){
        e.preventDefault();
        var items = me._items;
        var $inp_doms = me._$item_con.find(".ai-row");
        var content = _.chain($inp_doms).map(function(html_dom){
            var id = html_dom.getAttribute("id");
            var obj = _.filter(items , function(d){
                return id == d.id;
            })[0];
            return obj.get_data();
        }).filter(function(data){
            return data != null;
        }).value();
        /**
        var content = _.filter(_.map(items,function(it){
            return it.get_data();
        }),function(data){
            return data != null;
        });
        **/
        var title = $.trim(me._dom.find("input.ai-st-title").val());
        title = title || me._ex_data.name;
        var post_data = {
            albumId : me._subject_id,
            type : me._typeid,
            entityId : me._typeid == 0 ? me._ex_data.productId : me._ex_data.shopId,
            title : title,
            imageUrl : me._dom.find("div.twt-feed img").attr("src"),
            content : JSON.stringify(content)
        }
        if (!(me._init_item_data && me._init_item_data.id)) {
            http.post({
                url : "/api/addAlbumItem.htm",
                data : post_data
            }).done(function(rs){
                if (rs.ret == 1) {
                    me._init_item_data = rs.item;
                    alert("新增成功");

                } else {
                    alert("新增失败");
                
                }
            }).fail(function(){
                alert("服务器错误,新增失败");
            })
        } else  {
            post_data.id = me._init_item_data.id;
            http.post({
                url : "/api/updateAlbumItem.htm",
                data : post_data
            }).done(function(rs){
                if (rs.ret == 1) {
                    alert("更新成功");
                } else {
                    alert("更新失败");
                
                }
            }).fail(function(){
                alert("服务器错误,更新失败");
            })

        }
    
    });

    this._dom.find(".ai-add-btns").delegate("a","click",function(e){
        e.preventDefault();
        var type = $(this).data("type");
        me.addContent(type);
    });
    this._dom.find("a.ai-st-del").click(function(e){
        e.preventDefault();
        var flag = window.confirm("确认要删除此栏目么");
        if (flag) {
            if (me._init_item_data && me._init_item_data.id) {
                
                http.post({
                    url : "/api/deleteAlbumItem.htm",
                    data : {id :  me._init_item_data.id }
                }).done(function(rs){
                    if (rs.ret == 1) {
                        me.remove();
                        return;
                    } 
                    alert("删除失败");
                }).fail(function(){
                    alert("服务器错误，删除失败");
                });
                return ;
            } 
            me.remove();
        }
    });

}
SubjectItem.prototype._addContentByData = function(data){
    var type = data.type;
    var obj = this.addContent(type);
    if (obj) {
        var $dom = obj.dom;
        switch(type) {
            case 1:
                $dom.find("input").val(data.title);
                break;
            case 3:
                // code
                $dom.find("input[type=text]").val(data.url);
                $dom.find("img").attr("src",data.url).closest(".img-box").show();
                $dom.find("textarea").val(data.text);
                break;
            case 2:
                // code
                $dom.find("textarea").val(data.content);
                break;
            
            default:
                // code
        }
    }



}

SubjectItem.prototype._createPrd = function(){
    var data = this._ex_data;
    var img = data.image;
    if (img && img.length) {
        img = img.split(/;|,/)[0];
    }
    var tpl_data = {
        prd_name : data.title || data.name,
        prd_img : data.iconUrl || img,
        prd_pr : data.presentPrice,
        prd_old_pr : data.originalPrice,
        prd_dur : data.serviceTime,
        prd_shop_name : data.shopName
    };
    var html = PrdTpl(tpl_data)
    return html;
}

SubjectItem.prototype._createShop = function(){
    var data = this._ex_data;
    var html = ShopTpl(data);
    return html;
}
SubjectItem.prototype._createItem = function($dom){
    var me = this , type = me._ex_data;
    var $con = $dom.find(".ai-pf-box");
    var html = "";
    switch(type) {
        case 'prd': 
            html = me._createPrd();
            break;
        case 'shop':
            html = me._createShop();
            break;
        default:
            // code
    };

    $con.html(html);
}

SubjectItem.prototype.addContent = function(type){
    var me = this ;
    var $con = this._$item_con;
    var obj ; 
    switch(type) {
        case 1:
            obj = me._createTitleDom(); 
            break;
        case 2:
            obj = me._createPDom();
            // code
            break;
        case 3:
            obj = me._createImgDom();
            // code
            break;
        default:
            // code
    }
    if (obj) {
        var $dom = obj.dom;
        this._$item_con.append($dom);
        this._items.push(obj);
        
    }
    return obj;
}


SubjectItem.prototype._createTitleDom = function(){
    var html = TitleTpl();
    var $dom = $(html);
    var id  =  "_item_"+this._ids ++;
    var type = 1;
    this.bindItemDom($dom,id,type);
    return  {
        id : id, 
        type : type,
        dom : $dom,
        get_data : function(){
            var val = $.trim($dom.find("input").val());
            if (val) {
                return {
                    type : type ,
                    title : val 
                }
            }
            return null;
        }
    }
}

SubjectItem.prototype._createPDom = function(){
    var html = PTpl();
    var $dom = $(html);
    var id  =  "_item_"+this._ids ++;
    var type = 2;
    this.bindItemDom($dom,id);
    return  {
        id : id, 
        type : type,
        dom : $dom,
        get_data : function(){
            var val = $.trim($dom.find("textarea").val());
            if (val) {
                return  {
                    type : type,
                    content : val
                }
            }
            return null;
        }
    }
    
}



SubjectItem.prototype._createImgDom = function(){
    var html = ImgTpl();
    var $dom = $(html);
    var id  =  "_item_"+this._ids ++;
    var type = 3 ;
    var uploader = Uploader.create_upload({
        dom :  $dom.find(".img-upload-btn")[0],
        multi_selection : false,
        callback : function(data){
            var pathList = data.pathList;
            if (pathList && pathList.length) {
                var img_html = '<img src="'+pathList[0]+'" >';
                $dom.find("input[type=text]").val(pathList[0]);
                $dom.find(".img-wrap").html(img_html).parent().show(); 
                
            }
        }
    });
    $dom.data("uploader",uploader);
    this.bindItemDom($dom,id);
    return  {
        id : id, 
        type : type,
        dom : $dom,
        get_data : function(){
            var url = $.trim($dom.find("input").val());
            if (url) {
                return {
                    type : type ,
                    url : url,
                    text : $dom.find("textarea").val()
                }
            }
            return null;
        }
    }
}
SubjectItem.prototype.bindItemDom = function($dom,id){
    var me = this;
    $dom.attr("id",id);
    $dom.find(".add-del").click(function(e){
        e.preventDefault();
        me.removeItem(id);
    })
}
SubjectItem.prototype.removeItem = function(id){
    var items = this._items;
    var obj ,index;
    _.some(items,function(d,i){
        if (d.id === id) {
            obj = d;
            index = i;
            return true;
        }
    });
    if (obj) {
        var obj = items.splice(index,1)[0];
        var type = obj.type;
        if (type === 3) {
            obj.dom.data("uploader") &&  obj.dom.data("uploader").destroy();
        }
        obj.dom.remove();
        obj = null;
    }
}
SubjectItem.prototype.remove = function(){
    var items = this._items;
    _.forEach(items,function(obj){
        var type = obj.type;
        if (type === 3) {
            obj.dom.data("uploader") &&  obj.dom.data("uploader").destroy();
        }
        obj.dom.remove();
        obj = null;
    });
    
    this._items = null;
    this._dom.remove();
}



module.exports = SubjectItem;










},{"../../lib/iupload.js":5,"../../lib/jquery.js":6,"../../lib/lodash.compat.min.js":8,"../../mod/http.js":10,"./tmpl/img_content.js":15,"./tmpl/p_content.js":16,"./tmpl/prd_pf.js":18,"./tmpl/shop_pf.js":21,"./tmpl/subject_item.js":23,"./tmpl/title_content.js":24}],15:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['img_content.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var div=_.div;var group=_.group;var row=_.row;var label=_.label;var sm=_.sm;var input=_.input;var control=_.control;var span=_.span;var btn=_.btn;var button=_.button;var primary=_.primary;var upload=_.upload;var text=_.text;var textarea=_.textarea;var box=_.box;var wrap=_.wrap;var img=_.img;var btns=_.btns;var a=_.a;var del=_.del;var i=_.i;var times=_.times; _out+=' <div class="form-group  ai-row">     <label class="col-sm-2 control-label">图片</label>     <div class="col-sm-6">         <div class="input-group">             <input type="text" class="form-control">             <span class="input-group-btn">                 <button class="btn btn-primary img-upload-btn"  type="button">上传图片</button>             </span>         </div>             <div class="img-text">             <textarea class="form-control" placeholder="图片描述"></textarea>         </div>             <div class="img-box">             <div class="img-wrap">                 <img src="" >             </div>             </div>     </div>     <div class="col-sm-4 add-btns " >         <a href="#" class="add-del" ><i class="fa fa-times"></i>删除</a>     </div> </div>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['img_content.tmpl'];
},{}],16:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['p_content.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var div=_.div;var group=_.group;var row=_.row;var label=_.label;var sm=_.sm;var textarea=_.textarea;var control=_.control;var p=_.p;var btns=_.btns;var a=_.a;var del=_.del;var type=_.type;var i=_.i;var times=_.times; _out+=' <div class="form-group ai-row">     <label class="col-sm-2 control-label">段落</label>     <div class="col-sm-6">         <textarea class="form-control m-p-textarea" row =8 placeholder="段落内容" ></textarea>     </div>     <div class="col-sm-4 add-btns" >         <a href="#" class="add-del" data-type="3"><i class="fa fa-times"></i>删除</a>     </div> </div>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['p_content.tmpl'];
},{}],17:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_list_hd.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var id=_.id;var table=_.table;var hover=_.hover;var thead=_.thead;var tr=_.tr;var th=_.th;var selected=_.selected;var all=_.all;var label=_.label;var input=_.input;var tbody=_.tbody; _out+=' <table class="table  table-hover general-table"> <thead> <tr>     <th>商品ID</th>     <th>商品名称</th>     <th>所属门店</th>     <th>现价</th>     <th>原价</th>     <th>状态</th>     <th class="ai-selected-all">         <label>         <input type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>         全选         </label>     </th> </tr> </thead> <tbody> </tbody> </table>   '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_list_hd.tmpl'];
},{}],18:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_pf.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var prd_img=_.prd_img;var prd_name=_.prd_name;var prd_pr=_.prd_pr;var prd_old_pr=_.prd_old_pr;var prd_dur=_.prd_dur;var prd_shop_name=_.prd_shop_name;var div=_.div;var prd=_.prd;var box=_.box;var st=_.st;var ps=_.ps;var feed=_.feed;var bg=_.bg;var twitter=_.twitter;var mark=_.mark;var a=_.a;var img=_.img;var ul=_.ul;var pills=_.pills;var stacked=_.stacked;var li=_.li;var span=_.span; _out+='<div class="ai-prd-box m-st-ps">     <div class="twt-feed blue-bg">         <div class="fa fa-twitter wtt-mark"></div>         <a href="#">             <img alt="" src="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_img)) ;_out+='">         </a>     </div>     <ul class="nav nav-pills nav-stacked">         <li ><span>名称:</span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_name)) ;_out+='</li>         <li><span>价格:</span> ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_pr)) ;_out+=' <span>原价:</span> ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_old_pr)) ;_out+='</li>         <li><span>服务时长:</span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_dur)) ;_out+='</li>         <li><span>所属商家:</span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_shop_name)) ;_out+='</li>     </ul>                                                </div> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_pf.tmpl'];
},{}],19:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_td.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var productId=_.productId;var title=_.title;var shopName=_.shopName;var presentPrice=_.presentPrice;var originalPrice=_.originalPrice;var status=_.status;var id=_.id;var tr=_.tr;var td=_.td;var prd_status=_.prd_status;var label=_.label;var input=_.input;var ch=_.ch; _out+='<tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(productId)) ;_out+='             </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(title)) ;_out+='             </td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(shopName)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(presentPrice)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(originalPrice)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(_method.prd_status.call({}, status))) ;_out+='</td>     <td>         <label>             <input class="ai-ch" type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>             选择         </label>     </td> </tr>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_td.tmpl'];
},{}],20:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['shop_list_hd.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var id=_.id;var table=_.table;var hover=_.hover;var thead=_.thead;var tr=_.tr;var th=_.th;var selected=_.selected;var all=_.all;var label=_.label;var input=_.input;var tbody=_.tbody; _out+='<table class="table  table-hover general-table">     <thead>     <tr>     <th>商户ID</th>     <th>商户名称</th>     <th>状态</th>     <th class="ai-selected-all">         <label>         <input type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>         全选         </label>     </th>     </tr>     </thead>     <tbody>     </tbody> </table>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['shop_list_hd.tmpl'];
},{}],21:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['shop_pf.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var name=_.name;var address=_.address;var telephone=_.telephone;var div=_.div;var prd=_.prd;var box=_.box;var st=_.st;var ps=_.ps;var feed=_.feed;var bg=_.bg;var h=_.h;var ul=_.ul;var pills=_.pills;var stacked=_.stacked;var li=_.li;var span=_.span; _out+='<div class="ai-prd-box m-st-ps">     <div class="twt-feed blue-bg">         <h3 style="display:block">             ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(name)) ;_out+='         </h3>     </div>     <ul class="nav nav-pills nav-stacked">         <li><span>商家地址:</span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(address)) ;_out+='</li>         <li><span>商家电话:</span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(telephone)) ;_out+='</li>     </ul>                                                </div>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['shop_pf.tmpl'];
},{}],22:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['shop_td.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var shopId=_.shopId;var name=_.name;var status=_.status;var id=_.id;var tr=_.tr;var td=_.td;var shop_status=_.shop_status;var label=_.label;var input=_.input;var ch=_.ch; _out+='<tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(shopId)) ;_out+='             </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(name)) ;_out+='             </td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(_method.shop_status.call({}, status))) ;_out+='</td>     <td>         <label>             <input class="ai-ch" type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>             选择         </label>     </td> </tr> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['shop_td.tmpl'];
},{}],23:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['subject_item.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var key=_.key;var div=_.div;var subject=_.subject;var section=_.section;var lg=_.lg;var heading=_.heading;var span=_.span;var tools=_.tools;var right=_.right;var a=_.a;var times=_.times;var st=_.st;var del=_.del;var body=_.body;var nav=_.nav;var ps=_.ps;var box=_.box;var form=_.form;var horizontal=_.horizontal;var group=_.group;var row=_.row;var item=_.item;var title=_.title;var label=_.label;var sm=_.sm;var input=_.input;var control=_.control;var sub=_.sub;var add=_.add;var btns=_.btns;var type=_.type;var i=_.i;var file=_.file;var text=_.text;var p=_.p;var img=_.img;var picture=_.picture;var o=_.o;var items=_.items;var content=_.content;var button=_.button;var primary=_.primary;var submit=_.submit; _out+=' <div class="row m-subject-section">     <div class="col-lg-12">         <div class="panel clearfix">             <div class="panel-heading">                  <span class="m-tools pull-right">                     <a href="javascript:;" class="fa fa-times ai-st-del"></a>                  </span>                 ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(key)) ;_out+='内容模块              </div>             <div class="panel-body">                 <div class="col-lg-4">                     <section class="panel profile-nav ai-ps-box" >                     </section>                     </div>                     <div class="col-lg-8">                         <form class="form-horizontal bucket-form">                             <div class="form-group ai-row m-subject-item-title">                                 <label class="col-sm-2 control-label ">大标题</label>                                 <div class="col-sm-8">                                     <input type="text" class="form-control ai-st-title">                                 </div>                             </div>                              <div class="form-group ai-row m-subject-item-title m-sub-title hide">                                 <label class="col-sm-2 control-label ">副标题</label>                                 <div class="col-sm-8">                                     <input type="text" class="form-control ai-sub-title">                                 </div>                             </div>                              <div class="form-group ai-row ">                                 <div class="col-sm-12" >                                     <div class="m-st-add-btns ai-add-btns" >                                         <a href="#" class="add-title" data-type="1"><i class="fa fa-file-text"></i>添加小标题</a>                                         <a href="#" class="add-p" data-type="2"><i class="fa fa-file-text"></i>添加段落</a>                                         <a href="#" class="add-img" data-type="3"><i class="fa fa-picture-o"></i>添加图片</a>                                     </div>                                 </div>                             </div>                              <div class="m-subject-items ai-content-item">                             </div>                                                          <div class="subject-item-btns">                                 <button type="submit" class="btn btn-primary ai-submit">保存</button>                             </div>                         </form>                 </div>             </div>             </div>      </div> </div>   '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['subject_item.tmpl'];
},{}],24:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['title_content.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var div=_.div;var group=_.group;var row=_.row;var label=_.label;var sm=_.sm;var input=_.input;var control=_.control;var btns=_.btns;var a=_.a;var del=_.del;var i=_.i;var times=_.times; _out+=' <div class="form-group ai-row">     <label class="col-sm-2 control-label">小标题</label>     <div class="col-sm-6">         <input type="text" class="form-control">     </div>     <div class="col-sm-4 add-btns" >         <a href="#" class="add-del" ><i class="fa fa-times"></i>删除</a>     </div> </div>   '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['title_content.tmpl'];
},{}]},{},[12])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9jb29raWVzLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2licm93c2VyLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2lkaWFsb2cuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvaXBhZ2VyLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2l1cGxvYWQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanF1ZXJ5LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2p1aWNlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9sb2Rhc2guY29tcGF0Lm1pbi5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9zZWFyY2hfcGFyYW1zLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbW9kL2h0dHAuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9tb2QvcG9wLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvcGFnZS9mYWtlXzY5MTQ5MzQxLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvcGFnZS9vcGVyYXRpb24vc2VhcmNoX2JveC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2Uvb3BlcmF0aW9uL3N1YmplY3RfaXRlbS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2Uvb3BlcmF0aW9uL3RtcGwvaW1nX2NvbnRlbnQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi90bXBsL3BfY29udGVudC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2Uvb3BlcmF0aW9uL3RtcGwvcHJkX2xpc3RfaGQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi90bXBsL3ByZF9wZi5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2Uvb3BlcmF0aW9uL3RtcGwvcHJkX3RkLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvcGFnZS9vcGVyYXRpb24vdG1wbC9zaG9wX2xpc3RfaGQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi90bXBsL3Nob3BfcGYuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi90bXBsL3Nob3BfdGQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi90bXBsL3N1YmplY3RfaXRlbS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2Uvb3BlcmF0aW9uL3RtcGwvdGl0bGVfY29udGVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZG9jQ29va2llID0gKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAvKlxcXG4gIHwqfFxuICB8KnwgIDo6IGNvb2tpZXMuanMgOjpcbiAgfCp8XG4gIHwqfCAgQSBjb21wbGV0ZSBjb29raWVzIHJlYWRlci93cml0ZXIgZnJhbWV3b3JrIHdpdGggZnVsbCB1bmljb2RlIHN1cHBvcnQuXG4gIHwqfFxuICB8KnwgIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvRE9NL2RvY3VtZW50LmNvb2tpZVxuICB8KnxcbiAgfCp8ICBUaGlzIGZyYW1ld29yayBpcyByZWxlYXNlZCB1bmRlciB0aGUgR05VIFB1YmxpYyBMaWNlbnNlLCB2ZXJzaW9uIDMgb3IgbGF0ZXIuXG4gIHwqfCAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXG4gIHwqfFxuICB8KnwgIFN5bnRheGVzOlxuICB8KnxcbiAgfCp8ICAqIGRvY0Nvb2tpZXMuc2V0SXRlbShuYW1lLCB2YWx1ZVssIGVuZFssIHBhdGhbLCBkb21haW5bLCBzZWN1cmVdXV1dKVxuICB8KnwgICogZG9jQ29va2llcy5nZXRJdGVtKG5hbWUpXG4gIHwqfCAgKiBkb2NDb29raWVzLnJlbW92ZUl0ZW0obmFtZVssIHBhdGhdLCBkb21haW4pXG4gIHwqfCAgKiBkb2NDb29raWVzLmhhc0l0ZW0obmFtZSlcbiAgfCp8ICAqIGRvY0Nvb2tpZXMua2V5cygpXG4gIHwqfFxuICBcXCovXG5cbiAgdmFyIGRvY0Nvb2tpZXMgPSB7XG4gICAgZ2V0SXRlbTogZnVuY3Rpb24gKHNLZXkpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZG9jdW1lbnQuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChcIig/Oig/Ol58Lio7KVxcXFxzKlwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICsgXCJcXFxccypcXFxcPVxcXFxzKihbXjtdKikuKiQpfF4uKiRcIiksIFwiJDFcIikpIHx8IG51bGw7XG4gICAgfSxcbiAgICBzZXRJdGVtOiBmdW5jdGlvbiAoc0tleSwgc1ZhbHVlLCB2RW5kLCBzUGF0aCwgc0RvbWFpbiwgYlNlY3VyZSkge1xuICAgICAgaWYgKCFzS2V5IHx8IC9eKD86ZXhwaXJlc3xtYXhcXC1hZ2V8cGF0aHxkb21haW58c2VjdXJlKSQvaS50ZXN0KHNLZXkpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgdmFyIHNFeHBpcmVzID0gXCJcIjtcbiAgICAgIGlmICh2RW5kKSB7XG4gICAgICAgIHN3aXRjaCAodkVuZC5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICAgICAgc0V4cGlyZXMgPSB2RW5kID09PSBJbmZpbml0eSA/IFwiOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMjM6NTk6NTkgR01UXCIgOiBcIjsgbWF4LWFnZT1cIiArIHZFbmQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFN0cmluZzpcbiAgICAgICAgICAgIHNFeHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyB2RW5kO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBEYXRlOlxuICAgICAgICAgICAgc0V4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIHZFbmQudG9VVENTdHJpbmcoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBlbmNvZGVVUklDb21wb25lbnQoc0tleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChzVmFsdWUpICsgc0V4cGlyZXMgKyAoc0RvbWFpbiA/IFwiOyBkb21haW49XCIgKyBzRG9tYWluIDogXCJcIikgKyAoc1BhdGggPyBcIjsgcGF0aD1cIiArIHNQYXRoIDogXCJcIikgKyAoYlNlY3VyZSA/IFwiOyBzZWN1cmVcIiA6IFwiXCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuXG4gICAgcmVtb3ZlSXRlbTogZnVuY3Rpb24gKHNLZXksIHNQYXRoLCBzRG9tYWluKSB7XG4gICAgICBpZiAoIXNLZXkgfHwgIXRoaXMuaGFzSXRlbShzS2V5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChzS2V5KSArIFwiPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVFwiICsgKCBzRG9tYWluID8gXCI7IGRvbWFpbj1cIiArIHNEb21haW4gOiBcIlwiKSArICggc1BhdGggPyBcIjsgcGF0aD1cIiArIHNQYXRoIDogXCJcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhc0l0ZW06IGZ1bmN0aW9uIChzS2V5KSB7XG4gICAgICByZXR1cm4gKG5ldyBSZWdFeHAoXCIoPzpefDtcXFxccyopXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc0tleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XCIpKS50ZXN0KGRvY3VtZW50LmNvb2tpZSk7XG4gICAgfSxcbiAgICBrZXlzOiAvKiBvcHRpb25hbCBtZXRob2Q6IHlvdSBjYW4gc2FmZWx5IHJlbW92ZSBpdCEgKi8gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFLZXlzID0gZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLygoPzpefFxccyo7KVteXFw9XSspKD89O3wkKXxeXFxzKnxcXHMqKD86XFw9W147XSopPyg/OlxcMXwkKS9nLCBcIlwiKS5zcGxpdCgvXFxzKig/OlxcPVteO10qKT87XFxzKi8pO1xuICAgICAgZm9yICh2YXIgbklkeCA9IDA7IG5JZHggPCBhS2V5cy5sZW5ndGg7IG5JZHgrKykgeyBhS2V5c1tuSWR4XSA9IGRlY29kZVVSSUNvbXBvbmVudChhS2V5c1tuSWR4XSk7IH1cbiAgICAgIHJldHVybiBhS2V5cztcbiAgICB9XG4gIH07XG4gIHJldHVybiBkb2NDb29raWVzO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gIGRvY0Nvb2tpZTtcblxuIiwiLy/mtY/op4jlmajliKTmlq1cbnZhciB1YSAgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLFxuICAgIGNoZWNrID0gZnVuY3Rpb24ocil7XG4gICAgICAgIHJldHVybiByLnRlc3QodWEpO1xuICAgIH07XG52YXIgaXNPcGVyYSAgPSAgY2hlY2soL29wZXJhLyksXG4gICAgaXNDaHJvbWUgPSBjaGVjaygvXFxiY2hyb21lXFxiLyksXG4gICAgaXNXZWJLaXQgPSBjaGVjaygvd2Via2l0LyksXG4gICAgaXNTYWZhcmkgPSAhaXNDaHJvbWUgJiYgaXNXZWJLaXQsXG4gICAgaXNJRSAgICAgPSBjaGVjaygvbXNpZS8pICYmIGRvY3VtZW50LmFsbCAmJiAhaXNPcGVyYSxcbiAgICBpc0lFNyAgICA9IGNoZWNrKC9tc2llIDcvKSxcbiAgICBpc0lFOCAgICA9IGNoZWNrKC9tc2llIDgvKSxcbiAgICBpc0lFOSAgICA9IGNoZWNrKC9tc2llIDkvKSxcbiAgICBpc0lFMTAgICAgPSBjaGVjaygvbXNpZSAxMC8pLFxuICAgIGlzSUU2ICAgID0gaXNJRSAmJiAhaXNJRTcgJiYgIWlzSUU4ICYmICFpc0lFOSAmJiAhaXNJRTEwLFxuICAgIGlzSUUxMSAgID0gY2hlY2soL3RyaWRlbnQvKSAmJiB1YS5tYXRjaCgvcnY6KFtcXGQuXSspLyk/dHJ1ZTpmYWxzZSxcbiAgICBpc0dlY2tvICA9IGNoZWNrKC9nZWNrby8pICYmICFpc1dlYktpdCxcbiAgICBpc01hYyAgICA9IGNoZWNrKC9tYWMvKTtcblxudmFyIEJyb3dzZXIgPSB7XG4gICAgaXNPcGVyYSA6IGlzT3BlcmEsXG4gICAgaXNDaHJvbWUgOiBpc0Nocm9tZSxcbiAgICBpc1dlYktpdCA6IGlzV2ViS2l0LFxuICAgIGlzU2FmYXJpIDogaXNTYWZhcmksXG4gICAgaXNJRSAgICAgOiBpc0lFLFxuICAgIGlzSUU3ICAgIDogaXNJRTcsXG4gICAgaXNJRTggICAgOiBpc0lFOCxcbiAgICBpc0lFOSAgICA6IGlzSUU5LFxuICAgIGlzSUU2ICAgIDogaXNJRTYsXG4gICAgaXNJRTExICAgIDppc0lFMTEsXG4gICAgaXNHZWNrbyAgOiBpc0dlY2tvLFxuICAgIGlzTWFjICAgIDogaXNNYWNcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEJyb3dzZXI7XG4iLCJ2YXIgQnJvd3NlciA9IHJlcXVpcmUoXCIuL2licm93c2VyXCIpO1xyXG52YXIgRGlhbG9nICA9IChmdW5jdGlvbigkLHdpbmRvdyl7XHJcblx0XHR2YXIgX2lzSUUgID0gQnJvd3Nlci5pc0lFLFxyXG5cdFx0ICAgIF9pc0lFNiA9IEJyb3dzZXIuaXNJRTYsXHJcblx0XHRcdCRkb2MgICA9ICQod2luZG93LmRvY3VtZW50KSxcclxuXHRcdFx0JGJvZHkgID0gJCgnYm9keScpLFxyXG5cdFx0XHQkd2luICAgPSAkKHdpbmRvdyk7IFxyXG4gICAgICAgIHZhciBJRTZfTEVGVF9PRkZTRVQgPSAxNjsgLy9JRTbkuIvmu5HliqjmnaHnmoTlrr3luqZcclxuXHRcdHZhciBfaXNNYWMgPSBCcm93c2VyLmlzTWFjO1xyXG5cdFx0dmFyIGhhc1Njcm9sbCA9IGZhbHNlO1xyXG4gICAgICAgIC8v6Ziy5q2i5byV55SoSlPmlofku7blnKhoZWFkIOmHjOWPluS4jeWIsGJvZHlcclxuICAgICAgICBpZiAoISRib2R5WzBdKSB7XHJcbiAgICAgICAgICAgICQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRib2R5ID0gICQoJ2JvZHknKTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+iDjOaZryDliY3mma8gXHJcblx0XHR2YXIgZGxnX21hc2tfaHRtbCA9ICc8ZGl2IGNsYXNzPVwiZy1wb3AtYmdcIj48L2Rpdj4nLFxyXG5cdFx0XHRkbGdfYm94X2h0bWwgPSAnPGRpdiBjbGFzcz1cImdfZGxnX2JveCBnLXBvcFwiPjwvZGl2Pic7XHJcblxyXG5cdFx0dmFyIGRsZ2lkID0gXCJkbGdcIixcclxuICAgICAgICAgICAgbWlkcz0wICwgXHJcbiAgICAgICAgICAgIGlkcyA9IDAsXHJcblx0XHRcdF9kX3ppbmRleCA9IDEwMDAwMDtcclxuXHJcblx0XHR2YXIgZGVmX2NvbmZpZyA9IHtcclxuXHRcdFx0Y29udGVudDonJyxcclxuXHRcdFx0bWFza1Zpc2libGUgOiB0cnVlLFxyXG5cdFx0XHR0b3A6MCxcclxuXHRcdFx0bGVmdDowLFxyXG5cdFx0XHR3aWR0aDowLFxyXG5cdFx0XHRoZWlnaHQ6MCxcclxuXHRcdFx0bmV3TWFzayA6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50U3R5bGUgOiBcIlwiLFxyXG5cdFx0XHRib3JkZXJTdHlsZSA6XCJcIiwgIC8vIGJvcmRlcuagt+W8jyBcclxuXHRcdFx0dGl0bGVTdHlsZSA6IFwiXCIsIC8v5qCH6aKY5qC35byPXHJcblx0XHRcdGNsb3NlQ2xzICA6IFwiXCIsIC8v5YWz6Zet5oyJ6ZKuIGNsYXNzIOWmguaenOacieS8muabv+aNouaOiSDljp/mnaXnmoQgZGxnX2Nsb3NlIFxyXG4gICAgICAgICAgICBjbG9zZV9mbiA6IGZ1bmN0aW9uKCl7fSxcclxuXHRcdFx0aGlkZUNsb3NlQnRuOiBmYWxzZVxyXG5cdFx0fTtcclxuXHRcdC8vIG1peCBjb25maWcgc2V0dGluZy5cclxuXHRcdHZhciBtaXhfY2ZnID0gZnVuY3Rpb24obiwgZCkge1xyXG5cdFx0XHR2YXIgY2ZnID0ge30sXHJcblx0XHRcdFx0aTtcclxuXHRcdFx0Zm9yIChpIGluIGQpIHtcclxuXHRcdFx0XHRpZiAoZC5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG5cdFx0XHRcdFx0Y2ZnW2ldID0gdHlwZW9mIG5baV0gIT09ICd1bmRlZmluZWQnID8gbltpXSA6IGRbaV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjZmc7XHJcblx0XHR9XHJcblx0XHR2YXIgZ2V0V2luUmVjdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHdpbiA9ICR3aW47XHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcCA6ICAkZG9jLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdFx0c2Nyb2xsTGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0d2lkdGggOiB3aW4ud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgOiB3aW4uaGVpZ2h0KClcclxuICAgICAgICAgICAgICAgICAgICAvL3dpZHRoOiB3aW5bMF0uaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCxcclxuXHRcdFx0XHRcdC8vaGVpZ2h0OiB3aW5bMF0uaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodFxyXG5cdFx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBfbWFza19pZCA9IFwiZGxnX21hc2tfXCI7XHJcblx0XHR2YXIgTWFzayA9IGZ1bmN0aW9uKCl7XHJcblx0XHQgICAgdGhpcy5pZCA9IF9tYXNrX2lkKygrK21pZHMpO1xyXG5cdFx0XHR0aGlzLl9kb20gPSAkKCc8ZGl2IGlkPVwiJysodGhpcy5pZCkrJ1wiIGNsYXNzPVwiZy1wb3AtYmdcIiBzdHlsZT1cInotaW5kZXg6JysoKytfZF96aW5kZXgpKydcIj48L2Rpdj4nKTtcclxuXHRcdFx0dGhpcy5faW5pdCgpO1xyXG5cdFx0fTtcclxuXHQgXHRNYXNrLnByb3RvdHlwZSA9IHtcclxuXHRcdFx0X2luaXQgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCRib2R5LmFwcGVuZCh0aGlzLl9kb20pO1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5oaWRlKCk7XHJcblx0XHRcdFx0dGhpcy5faW5pdEV2ZW50cygpO1xyXG5cdFx0XHRcdHRoaXMuYWRhcHRXaW4oKTtcclxuXHRcdFx0XHRpZih0aGlzLl9uZWVkSWZyYW1lKCkpe1xyXG5cdFx0XHRcdFx0dGhpcy5fY3JlYXRlSWZyYW1lKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0X2luaXRFdmVudHMgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdF9jcmVhdGVJZnJhbWU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5faWZyYW1lID0gJCgnPGlmcmFtZSBjbGFzcz1cImRsZ19taWZyYW1lXCIgZnJhbWVib3JkZXI9XCIwXCIgc3JjPVwiYWJvdXQ6YmxhbmtcIj48L2lmcmFtZT4nKTtcclxuXHRcdFx0XHR0aGlzLl9kb20uYXBwZW5kKHRoaXMuX2lmcmFtZSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFkZENsYXNzIDogZnVuY3Rpb24oIGNsc05hbWUpe1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5hZGRDbGFzcyhjbHNOYW1lKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIOajgOa1i+iHquWKqOeUn+aIkGlmcmFtZeadoeS7tlxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBAbWV0aG9kXHJcblx0XHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdFx0ICogQHBhcmFtIHZvaWRcclxuXHRcdFx0ICogQHJldHVybiB7Ym9vbH1cclxuXHRcdFx0ICovXHJcblx0XHRcdF9uZWVkSWZyYW1lOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIHVzZUlmcmFtZSA9ICEhd2luZG93LkFjdGl2ZVhPYmplY3RcclxuXHRcdFx0XHRcdFx0XHRcdCYmICgoX2lzSUU2ICYmICQoJ3NlbGVjdCcpLmxlbmd0aClcclxuXHRcdFx0XHRcdFx0XHRcdHx8ICQoJ29iamVjdCcpLmxlbmd0aCk7XHJcblx0XHRcdFx0cmV0dXJuIHVzZUlmcmFtZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YWRhcHRXaW4gOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmKF9pc0lFNil7XHJcblx0XHRcdFx0XHR0aGlzLl9kb20uY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wIDogJGRvYy5zY3JvbGxUb3AoKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgOiAkZG9jLnNjcm9sbExlZnQoKSxcclxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAkd2luLmhlaWdodCgpLFxyXG5cdFx0XHRcdFx0XHR3aWR0aDogJHdpbi53aWR0aCgpXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGhpZGUgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbF9kb20gPSAkKCdodG1sJykuY3NzKFwib3ZlcmZsb3dcIixcIlwiKTtcclxuXHRcdFx0XHRpZihfaXNNYWMgPT0gZmFsc2UgfHwgMSl7XHJcblx0XHRcdFx0XHRpZihoYXNTY3JvbGwpe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaHRtbF9kb20uY3NzKFwicGFkZGluZy1yaWdodFwiLFwiMHB4XCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0c2hvdyA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG5cdFx0XHRcdHZhciB3YSA9ICR3aW4ud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sX2RvbSA9ICQoJ2h0bWwnKS5jc3MoXCJvdmVyZmxvd1wiLFwiaGlkZGVuXCIpO1xyXG5cdFx0XHRcdHZhciB3YiA9ICR3aW4ud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIG1lLl9kb20uc2hvdygpO1xyXG5cdFx0XHRcdGlmKF9pc01hYyA9PSBmYWxzZSB8fCAxKXtcclxuXHRcdFx0XHRcdGlmKHdhICE9IHdiKXtcclxuXHRcdFx0XHRcdFx0aGFzU2Nyb2xsID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0aHRtbF9kb20uY3NzKFwicGFkZGluZy1yaWdodFwiLElFNl9MRUZUX09GRlNFVCtcInB4XCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RG9tIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZG9tO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5fZG9tLnJlbW92ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1vc3RfbWFzazsgLy/lhazlhbHnmoRNYXNrXHJcblx0XHR2YXIgRGlhbG9nID0gIGZ1bmN0aW9uKGNmZyl7XHJcblx0XHRcdHZhciBjID0gY2ZnIHx8IHt9O1xyXG5cdFx0XHR0aGlzLmNvbmZpZyA9ICBtaXhfY2ZnKGMsZGVmX2NvbmZpZyk7XHJcblx0XHRcdHRoaXMuX2luaXQoKTtcclxuXHRcdH1cclxuXHRcdERpYWxvZy5wcm90b3R5cGUgPSB7XHJcblx0XHRcdGNvbnN0cnVjdG9yIDogRGlhbG9nLFxyXG5cdFx0XHRfaW5pdCA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYoIXRoaXMuY29uZmlnKXtcclxuXHRcdFx0XHRcdHJldHVybiA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMuaWQgPSBkbGdpZCArKCsraWRzKTtcclxuXHRcdFx0XHR2YXIgY2ZnID0gIHRoaXMuY29uZmlnO1xyXG5cclxuXHRcdFx0XHRpZihjZmcubmV3TWFzayl7XHJcblx0XHRcdFx0XHR0aGlzLl9tYXNrID0gIG5ldyBNYXNrKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZighbW9zdF9tYXNrKXtcclxuXHRcdFx0XHRcdFx0bW9zdF9tYXNrID0gIG5ldyBNYXNrKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuX21hc2sgPSBtb3N0X21hc2s7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWFzayA9ICBtb3N0X21hc2s7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuX2NyZWF0RGlhbG9nKCk7XHJcblx0XHRcdFx0dGhpcy5faW5pdEV2ZW50cygpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdGVkID0gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0X2luaXRFdmVudHMgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBtZSA9IHRoaXMsaWQ9dGhpcy5pZDtcclxuXHJcblx0XHRcdFx0dGhpcy5fY2xvc2VCdG4uYmluZCh7XHJcblx0XHRcdFx0XHRjbGljayA6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmNsb3NlKCk7XHJcblx0XHRcdFx0XHRcdG1lLmNvbmZpZy5jbG9zZV9mbi5jYWxsKG1lLG1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQkd2luLmJpbmQoXCJyZXNpemUuXCIraWQscmVzaXplKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRtZS5fdW5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCR3aW4udW5iaW5kKFwicmVzaXplLlwiK2lkKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIHJlc2l6ZSgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfaXNJRTYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RsZ19jb250YWluZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA6ICRkb2Muc2Nyb2xsVG9wKCksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0XHQgICAgd2lkdGggOiAkd2luLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdCAgICBoZWlnaHQgOiAkd2luLmhlaWdodCgpXHJcblx0XHRcdFx0XHQgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RsZ19jb250YWluZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoIDogJHdpbi53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogJHdpbi5oZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0XHRtZS50b0NlbnRlcigpO1xyXG5cdFx0XHRcdFx0bWUuX21hc2suYWRhcHRXaW4oKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRfY3JlYXREaWFsb2cgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBjZmcgPSB0aGlzLmNvbmZpZztcclxuXHRcdFx0XHR2YXIgZGxnX2NvbnRhaW5lciA9IHRoaXMuX2RsZ19jb250YWluZXIgPSAkKGRsZ19ib3hfaHRtbCkuYXR0cihcImlkXCIsdGhpcy5pZCkuY3NzKFwiei1pbmRleFwiLChfZF96aW5kZXggKz0gMTApKTtcclxuXHRcdFx0XHRpZihjZmcuY29udGVudCBpbnN0YW5jZW9mICQpe1xyXG5cdFx0XHRcdFx0dGhpcy5fZGlhbG9nID0gY2ZnLmNvbnRlbnQ7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0aGlzLl9kaWFsb2cgPSAkKGNmZy5jb250ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGRsZyA9IHRoaXMuX2RpYWxvZztcclxuXHRcdFx0XHRkbGcuYWRkQ2xhc3MoXCJnX2RsZ193cmFwX2NzczNcIik7XHRcclxuXHRcdFx0XHRkbGdfY29udGFpbmVyLmh0bWwoZGxnKTtcclxuXHRcdFx0XHR0aGlzLl9jb250ZW50ID0gJChcIi5qc19jb250ZW50XCIsZGxnKTtcclxuXHRcdFx0XHR0aGlzLl9jbG9zZUJ0biA9ICQoJy5qc19jbG9zZScsZGxnKTtcclxuXHRcdFx0XHQkYm9keS5hcHBlbmQoZGxnX2NvbnRhaW5lcik7XHJcblxyXG5cdFx0XHRcdGlmKGNmZy5oaWRlQ2xvc2VCdG4pe1xyXG5cdFx0XHRcdFx0dGhpcy5fY2xvc2VCdG4uaGlkZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgcG9zID0gIFwiZml4ZWRcIjtcclxuXHRcdFx0XHRpZihfaXNJRTYpe1xyXG5cdFx0XHRcdFx0ZGxnX2NvbnRhaW5lci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgOiAkZG9jLnNjcm9sbFRvcCgpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0XHR3aWR0aCA6ICR3aW4ud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0aGVpZ2h0IDogJHdpbi5oZWlnaHQoKVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRwb3MgPSBcImFic291bHRlXCI7XHJcblx0XHRcdCAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRsZ19jb250YWluZXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0d2lkdGggOiAkd2luLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdGhlaWdodCA6ICR3aW4uaGVpZ2h0KClcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRsZy5jc3MoXCJwb3NpdGlvblwiLFwiYWJzb2x1dGVcIik7XHJcblx0XHRcdFx0dGhpcy5zZXRQb3MocG9zKTtcdFx0XHRcdFxyXG5cdFx0XHRcdC8vdGhpcy50b0NlbnRlcigpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXRQb3MgOiBmdW5jdGlvbihwb3Mpe1xyXG5cdFx0XHRcdHRoaXMuX2RsZ19jb250YWluZXIuY3NzKFwicG9zaXRpb25cIixwb3MpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvL+W+l+WIsGNvbnRlbnQg6L+U5ZuealF1ZXJ5IOWvueixoVxyXG5cdFx0XHRnZXRDb250YWluZXIgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9kbGdfY29udGFpbmVyO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRDb250ZW50IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY29udGVudDtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0Q29udGVudCA6IGZ1bmN0aW9uKGRvbSl7XHJcblx0XHRcdFx0dGhpcy5fY29udGVudC5lbXB0eSgpO1xyXG5cdFx0XHRcdHRoaXMuX2NvbnRlbnQuaHRtbChkb20pO1x0XHJcblx0XHRcdH0sXHJcbiAgICAgICAgICAgIGdldERsZ0RvbSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RpYWxvZzsgXHJcbiAgICAgICAgICAgIH0sXHJcblx0XHRcdGdldENsb3NlQnRuIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY2xvc2VCdG47XHJcblx0XHRcdH0sXHJcblx0XHRcdF9zZXRTdHlsZSA6IGZ1bmN0aW9uKGRvbSxjc3Mpe1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBjc3MgPT0gXCJzdHJpbmdcIil7XHJcblx0XHRcdFx0XHRpZihfaXNJRSl7XHJcblx0XHRcdFx0XHRcdGRvbVswXS5zdHlsZS5jc3NUZXh0ID0gY3NzO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGRvbS5hdHRyKFwic3R5bGVcIixjc3MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZG9tLmNzcyhjc3MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0dG9DZW50ZXIgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciB3aW5SZWN0ID0gIGdldFdpblJlY3QoKSxcclxuXHRcdFx0XHRcdHcgPSB0aGlzLl9kaWFsb2cud2lkdGgoKSxcclxuXHRcdFx0XHRcdGggPSB0aGlzLl9kaWFsb2cuaGVpZ2h0KCksXHJcblx0XHRcdFx0XHR0ID0gMCxsID0wO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcCA9IE1hdGgubWF4KCh3aW5SZWN0LmhlaWdodCAvIDIgLSBoIC8gMikgPj4wICsgdCwwKSA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGVmdCAgPSAod2luUmVjdC53aWR0aCAvIDIgLSB3IC8gMikgPj4wICsgbDtcclxuICAgICAgICAgICAgICAgIGlmIChfaXNJRTYpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0IC09IElFNl9MRUZUX09GRlNFVC8yO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdHZhciByZWN0ID0ge1xyXG5cdFx0XHRcdFx0bGVmdCA6XHRsZWZ0LFxyXG5cdFx0XHRcdCAgIFx0dG9wIDogIHRvcFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9kaWFsb2cuY3NzKHJlY3QpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cdFx0ICAgIHNob3cgOiBmdW5jdGlvbihjYWxsYmFjayxjb250ZXh0KXtcclxuXHRcdFx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKG1lLmNvbmZpZy5tYXNrVmlzaWJsZSl7XHJcblx0XHRcdFx0XHRtZS5fbWFzay5zaG93KCk7XHJcblx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgLy9JRTgg5Lul5LiL6K6h566X56qX5Y+j5a695bqmXHJcbiAgICAgICAgICAgICAgICBtZS5fZGxnX2NvbnRhaW5lci5jc3Moe3dpZHRoOlwiMTAwJVwiLGhlaWdodDpcIjEwMCVcIn0pO1xyXG5cdFx0XHRcdG1lLl9kbGdfY29udGFpbmVyLnNob3coKTtcclxuXHRcdFx0XHRtZS50b0NlbnRlcigpO1xyXG5cdFx0XHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBtZSxtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG1lLnNob3dlZCA9IHRydWU7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNsb3NlIDogZnVuY3Rpb24oY2FsbGJhY2ssY29udGV4dCl7XHJcblx0XHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0XHR0aGlzLl9tYXNrLmhpZGUoKTtcclxuXHRcdFx0XHR0aGlzLl9kbGdfY29udGFpbmVyLmhpZGUoKTtcclxuXHRcdFx0XHRpZihjYWxsYmFjayl7XHJcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKGNvbnRleHQgfHwgbWUsbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnNob3dlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkZXN0b3J5IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdFx0dGhpcy5fdW5iaW5kRXZlbnRzKCk7XHJcblx0XHRcdFx0dGhpcy5jb25maWcubmV3TWFzayAmJiB0aGlzLl9tYXNrLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMuX2RsZ19jb250YWluZXIucmVtb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5fZGlhbG9nLnJlbW92ZSgpO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiB0aGlzKXtcclxuXHRcdFx0XHRcdGRlbGV0ZSB0aGlzW2ldXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRNYXNrIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fbWFzaztcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9XHJcblx0XHREaWFsb2cucHJvdG90eXBlLkluID0gRGlhbG9nLnByb3RvdHlwZS5zaG93O1xyXG5cdFx0RGlhbG9nLnByb3RvdHlwZS5vdXQgPSBEaWFsb2cucHJvdG90eXBlLmNsb3NlO1xyXG5cdFx0RGlhbG9nLnByb3RvdHlwZS5oaWRlID0gRGlhbG9nLnByb3RvdHlwZS5jbG9zZTtcclxuXHRcdERpYWxvZy5wcm90b3R5cGUucmVtb3ZlID0gRGlhbG9nLnByb3RvdHlwZS5kZXN0b3J5O1xyXG5cdFx0XHJcblx0ICAgIFxyXG4gICAgcmV0dXJuIERpYWxvZztcclxuXHJcbn0pKGpRdWVyeSx3aW5kb3cpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEaWFsb2c7XHJcbiIsInZhciAkID0gcmVxdWlyZShcIi4vanF1ZXJ5XCIpO1xudmFyIHJlbmRlciA9IGZ1bmN0aW9uKGRvbSxub3csIHRvdGFsLCBsaW1pdCkge1xuXHR2YXIgbWF4ID0gTWF0aC5jZWlsKHRvdGFsIC8gbGltaXQpO1xuXHR2YXIgcGFnZXIgPSB7XG5cdFx0bm93OiBub3csXG5cdFx0bWF4OiBtYXhcblx0fTtcblx0dmFyIHBhZ2VzID0gY3JlYXRlKHBhZ2VyKTtcblx0cmVuZGVyX2h0bWwoZG9tLHBhZ2VzLCBwYWdlcik7XG59XG5cbnZhciByZW5kZXJfaHRtbCA9IGZ1bmN0aW9uKGRvbSxwYWdlcywgcGFnZ2VyKSB7XG5cdC8qKiDliIbpobUqKi9cblx0dmFyIG5vdyA9IHBhZ2dlci5ub3c7XG5cdHZhciBodG1sID0gWyc8ZGl2IGNsYXNzPVwicGFnZXNcIj4nXTtcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBwYWdlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRpZiAodHlwZW9mIHBhZ2VzW2ldID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRpZiAocGFnZXNbaV0gPT0gbm93KSB7XG5cdFx0XHRcdGh0bWwucHVzaCgnPGVtID48c3Bhbj4nICsgbm93ICsgJzwvc3Bhbj48L2VtPicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aHRtbC5wdXNoKCc8YSBjbGFzcz1cInBnLWl0ZW0ganMtcG5cIiBwZz1cIicgKyBwYWdlc1tpXSArICdcIiBocmVmPVwiI1wiPjxzcGFuPicgKyBwYWdlc1tpXSArICc8L3NwYW4+PC9hPicpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHBhZ2VzW2ldID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRodG1sLnB1c2goXCI8c3BhbiA+Li4uPC9zcGFuPlwiKTtcblx0XHR9XG5cdH1cblxuXHRpZiAocGFnZ2VyLm5vdyA8IHBhZ2dlci5tYXgpIHtcblx0XHRodG1sLnB1c2goJzxhIGNsYXNzPVwicGctaXRlbSBwYWdlLW5leHQganMtcC1uZXh0XCIgaHJlZj1cIiNcIiB0aXRsZT1cIuS4i+S4gOmhtVwiPuS4i+S4gOmhtTwvYT4nKTtcblx0fVxuXHRpZiAocGFnZ2VyLm5vdyA+IDEpIHtcblx0XHRodG1sLnNwbGljZSgxLCAwLCAnPGEgY2xhc3M9XCJwZy1pdGVtIHBhZ2UtcHJldiBqcy1wLXByZXZcIiBocmVmPVwiI1wiIHRpdGxlPVwi5LiK5LiA6aG1XCI+5LiK5LiA6aG1PC9hPiAnKTtcblx0fVxuXHRodG1sLnB1c2goXCI8L2Rpdj5cIik7XG5cdGRvbS5odG1sKGh0bWwuam9pbihcIlwiKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZShwYWdnZXIpIHtcblx0dmFyIG1heCA9IHBhZ2dlci5tYXgsXG5cdG5vdyA9IHBhZ2dlci5ub3c7XG5cdHZhciBmX29mZnNldCA9IDI7IC8v5YGP56e76YePXG5cdHZhciBsX3JfbGltaXQgPSA1O1xuXHR2YXIgcGFnZXMgPSBbXTtcblx0dmFyIGdhcCA9IFwiLi4uXCI7XG5cdHZhciBycyA9IFtdLFxuXHRscyA9IFtdLFxuXHRsdixcblx0cnYsXG5cdG1heGVkID0gZmFsc2UsXG5cdG1pbmVkID0gZmFsc2U7XG5cdGx2ID0gcnYgPSBub3c7XG5cblx0aWYgKDEgPT0gbWF4KSB7XG5cdFx0cmV0dXJuIFsxXTtcblx0fVxuXHRpZiAobF9yX2xpbWl0ID49IG1heCkge1xuXHRcdHZhciBwYWdlcyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IG1heDsgaSsrKSB7XG5cdFx0XHRwYWdlcy5wdXNoKGkpO1xuXHRcdH1cblx0XHRyZXR1cm4gcGFnZXM7XG5cdH1cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmX29mZnNldDsgaSsrKSB7XG5cdFx0aWYgKCsrcnYgPj0gbWF4KSB7XG5cdFx0XHRpZiAoIW1heGVkKSB7XG5cdFx0XHRcdHJzLnB1c2gobWF4KTtcblx0XHRcdFx0bWF4ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRycy5wdXNoKHJ2KTtcblx0XHR9XG5cdFx0aWYgKC0tbHYgPD0gMSkge1xuXHRcdFx0aWYgKCFtaW5lZCkge1xuXHRcdFx0XHRscy5zcGxpY2UoMCwgMCwgMSk7XG5cdFx0XHRcdG1pbmVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bHMuc3BsaWNlKDAsIDAsIGx2KTtcblx0XHR9XG5cblx0fVxuXG5cdHZhciBwYWdlcyA9IGxzLmNvbmNhdChbbm93XSkuY29uY2F0KHJzKTtcblx0aWYgKCFtYXhlZCkge1xuXHRcdGlmIChwYWdlc1twYWdlcy5sZW5ndGggLSAxXSA8IG1heCAtIDEpIHtcblx0XHRcdHBhZ2VzLnB1c2goZ2FwKTtcblx0XHR9XG5cdFx0cGFnZXMucHVzaChtYXgpO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChsX3JfbGltaXQgPiBtYXgpIHtcblx0XHRcdHBhZ2VzID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSBtYXg7IGkrKykge1xuXHRcdFx0XHRwYWdlcy5wdXNoKGkpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYWdlcyA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IG1heDsgaSA+IG1heCAtIGxfcl9saW1pdDsgaS0tKSB7XG5cdFx0XHRcdHBhZ2VzLnNwbGljZSgwLCAwLCBpKTtcblx0XHRcdH1cblx0XHRcdGlmICgxIDwgbWF4IC0gbF9yX2xpbWl0KSB7XG5cdFx0XHRcdHBhZ2VzLnNwbGljZSgwLCAwLCBnYXApO1xuXHRcdFx0fVxuXHRcdFx0cGFnZXMuc3BsaWNlKDAsIDAsIDEpO1xuXHRcdFx0cmV0dXJuIHBhZ2VzO1xuXHRcdH1cblxuXHR9XG5cblx0aWYgKCFtaW5lZCkge1xuXHRcdGlmIChwYWdlc1swXSA+IDIpIHtcblx0XHRcdHBhZ2VzID0gWzEsIGdhcF0uY29uY2F0KHBhZ2VzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFnZXMuc3BsaWNlKDAsIDAsIDEpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAobF9yX2xpbWl0ID49IG1heCkge1xuXHRcdFx0cGFnZXMgPSBbXTtcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IG1heDsgaSsrKSB7XG5cdFx0XHRcdHBhZ2VzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhZ2VzID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSBsX3JfbGltaXQ7IGkrKykge1xuXHRcdFx0XHRwYWdlcy5wdXNoKGkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxfcl9saW1pdCA8IG1heCAtIDEpIHtcblx0XHRcdFx0cGFnZXMucHVzaChnYXApO1xuXHRcdFx0fVxuXHRcdFx0cGFnZXMucHVzaChtYXgpO1xuXHRcdH1cblxuXHR9XG5cblx0cmV0dXJuIHBhZ2VzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVuZGVyIDogcmVuZGVyXG59O1xuIiwiXG5cbnZhciBwb3AgPSByZXF1aXJlKFwiLi4vbW9kL3BvcC5qc1wiKTtcbnZhciBEaWFsb2cgPSByZXF1aXJlKFwiLi9pZGlhbG9nXCIpO1xudmFyIGxvYWRpbmcgPSB7XG4gICAgX2NyZWF0ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJtLWxvYWRpbmdcIj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvYWRpbmctYm94XCIgPjxpbWcgc3JjPVwiaHR0cDovL2FtaWx5c3RhdGljLm1lL2ltYWdlL2xvYWRpbmcuZ2lmXCIgPjwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9hZGluZy10ZXh0LWJveFwiPjxwIGNsYXNzPVwibG9hZGluZy10ZXh0XCI+5q2j5Zyo5LiK5LygLOivt+eojeWQji4uLjwvcD48L2Rpdj5cXFxuICAgICAgICA8L2Rpdj4nO1xuICAgICAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgICAgICBjb250ZW50IDogaHRtbFxuICAgICAgICB9KVxuICAgICAgICBkbGcuaGlkZSgpO1xuICAgICAgICByZXR1cm4gZGxnO1xuICAgIH0sXG4gICAgc2hvdyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICghdGhpcy5fZGxnKSB7XG4gICAgICAgICAgICB0aGlzLl9kbGcgPSB0aGlzLl9jcmVhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kbGcuc2hvdygpO1xuICAgIH0sXG4gICAgaGlkZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX2RsZy5oaWRlKCk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZV91cGxvYWQob3B0KXtcbiAgICB2YXIgZXh0cyA9IG9wdC5leHRlbnNpb25zIHx8IFtcImpwZ1wiLFwicG5nXCIsXCJqcGVnXCJdO1xuICAgIHZhciBleHRzX3N0ciA9IGV4dHMuam9pbihcIixcIik7XG4gICAgdmFyIHVwbG9hZGVyID0gbmV3IHBsdXBsb2FkLlVwbG9hZGVyKHtcbiAgICAgICAgcnVudGltZXMgOiAnaHRtbDUsZmxhc2gsaHRtbDQnLFxuICAgICAgICAgXG4gICAgICAgIGJyb3dzZV9idXR0b24gOiBvcHQuZG9tLCAvLyB5b3UgY2FuIHBhc3MgaW4gaWQuLi5cbiAgICAgICAgLy9jb250YWluZXI6IG9wdC5jb250YWluZXIsIC8vIC4uLiBvciBET00gRWxlbWVudCBpdHNlbGZcbiAgICAgICAgIFxuICAgICAgICB1cmwgOiBvcHQudXJsIHx8IFwiL2FwaS91cGxvYWRcIixcbiAgICAgICAgcmVzaXplIDoge1xuICAgICAgICAgICAgcXVhbGl0eSA6IDUwXG4gICAgICAgIH0sIFxuICAgICAgICBmaWx0ZXJzIDoge1xuICAgICAgICAgICAgbWF4X2ZpbGVfc2l6ZSA6IG9wdC5zaXplIHx8ICcyMG1iJyxcbiAgICAgICAgICAgIHByZXZlbnRfZHVwbGljYXRlczogdHJ1ZSxcbiAgICAgICAgICAgIG1pbWVfdHlwZXM6IFtcbiAgICAgICAgICAgICAgICB7dGl0bGUgOiBcIumAieaLqShcIitleHRzX3N0citcIinmoLzlvI/nmoTmlofku7ZcIiwgZXh0ZW5zaW9ucyA6IGV4dHNfc3RyIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgXG4gICAgICAgIC8vIEZsYXNoIHNldHRpbmdzXG4gICAgICAgIGZsYXNoX3N3Zl91cmwgOiAnL3VwbG9hZC9Nb3hpZS5zd2YnLFxuICAgICAgICBtdWx0aV9zZWxlY3Rpb24gOiBvcHQubXVsdGlfc2VsZWN0aW9uID09IHZvaWQgMCA/IHRydWUgOiBvcHQubXVsdGlfc2VsZWN0aW9uLFxuICAgICBcbiAgICAgICAgaW5pdDoge1xuICAgICAgICAgICAgUG9zdEluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICBcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkZmlsZXMnKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGVyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICoqL1xuICAgICAgICAgICAgfSxcbiAgICAgXG4gICAgICAgICAgICBGaWxlc0FkZGVkOiBmdW5jdGlvbih1cCwgZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAvL3BsdXBsb2FkLmVhY2goZmlsZXMsIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZyhcImZpbGVcIixmaWxlLmlkKTtcbiAgICAgICAgICAgICAgICAvL30pO1xuICAgICAgICAgICAgICAgIGlmIChvcHQuY2hlY2sgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdC5jaGVjayhmaWxlcyx1cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZGVyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQuc3RhcnQgJiYgb3B0LnN0YXJ0KHVwLGZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmcuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkZXIuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0LnN0YXJ0ICYmIG9wdC5zdGFydCh1cCxmaWxlcyk7IFxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICBcbiAgICAgICAgICAgIFVwbG9hZFByb2dyZXNzOiBmdW5jdGlvbih1cCwgZmlsZSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwcm9ncmVzcz09PVwiLGZpbGUucGVyY2VudCk7XG4gICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlLmlkKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYicpWzBdLmlubmVySFRNTCA9ICc8c3Bhbj4nICsgZmlsZS5wZXJjZW50ICsgXCIlPC9zcGFuPlwiO1xuICAgICAgICAgICAgfSxcbiAgICAgXG4gICAgICAgICAgICBFcnJvcjogZnVuY3Rpb24odXAsIGVycikge1xuICAgICAgICAgICAgICAgIGxvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25zb2xlJykuaW5uZXJIVE1MICs9IFwiXFxuRXJyb3IgI1wiICsgZXJyLmNvZGUgKyBcIjogXCIgKyBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBVcGxvYWRGaWxlIDogZnVuY3Rpb24odXAsZmxpZSl7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRmlsZVVwbG9hZGVkIDogZnVuY3Rpb24odXAsZmlsZXMscmVzKXtcbiAgICAgICAgICAgICAgICB2YXIgX3N0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICAgICAgICAgICAgbG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKF9zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eHQgPSByZXMucmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXZhbChcIihcIit0eHQrXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICBvcHQuY2FsbGJhY2sgJiYgb3B0LmNhbGxiYWNrKGRhdGEsZmlsZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidGhpcyAgPT09PVwiLGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgXG4gICAgdXBsb2FkZXIuaW5pdCgpO1xuXG4gICAgcmV0dXJuIHVwbG9hZGVyO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZV91cGxvYWQgOiBjcmVhdGVfdXBsb2FkXG59XG5cbiIsInZhciAkID0gd2luZG93LmpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gJDtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qXG4gICAgKioqKioqKioqKiBKdWljZXIgKioqKioqKioqKlxuICAgICR7QSBGYXN0IHRlbXBsYXRlIGVuZ2luZX1cbiAgICBQcm9qZWN0IEhvbWU6IGh0dHA6Ly9qdWljZXIubmFtZVxuXG4gICAgQXV0aG9yOiBHdW9rYWlcbiAgICBHdGFsazogYmFka2Fpa2FpQGdtYWlsLmNvbVxuICAgIEJsb2c6IGh0dHA6Ly9iZW5iZW4uY2NcbiAgICBMaWNlbmNlOiBNSVQgTGljZW5zZVxuICAgIFZlcnNpb246IDAuNi44LXN0YWJsZVxuKi9cblxuKGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiBmb3Igbm90IG9ubHkgY29tcGlsaW5nIGJ1dCBhbHNvIHJlbmRlcmluZy5cbiAgICAvLyB0aGVyZSdzIGF0IGxlYXN0IHR3byBwYXJhbWV0ZXJzIG5lZWQgdG8gYmUgcHJvdmlkZWQsIG9uZSBpcyB0aGUgdHBsLCBcbiAgICAvLyBhbm90aGVyIGlzIHRoZSBkYXRhLCB0aGUgdHBsIGNhbiBlaXRoZXIgYmUgYSBzdHJpbmcsIG9yIGFuIGlkIGxpa2UgI2lkLlxuICAgIC8vIGlmIG9ubHkgdHBsIHdhcyBnaXZlbiwgaXQnbGwgcmV0dXJuIHRoZSBjb21waWxlZCByZXVzYWJsZSBmdW5jdGlvbi5cbiAgICAvLyBpZiB0cGwgYW5kIGRhdGEgd2VyZSBnaXZlbiBhdCB0aGUgc2FtZSB0aW1lLCBpdCdsbCByZXR1cm4gdGhlIHJlbmRlcmVkIFxuICAgIC8vIHJlc3VsdCBpbW1lZGlhdGVseS5cblxuICAgIHZhciBqdWljZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgYXJncy5wdXNoKGp1aWNlci5vcHRpb25zKTtcblxuICAgICAgICBpZihhcmdzWzBdLm1hdGNoKC9eXFxzKiMoW1xcdzpcXC1cXC5dKylcXHMqJC9pZ20pKSB7XG4gICAgICAgICAgICBhcmdzWzBdLnJlcGxhY2UoL15cXHMqIyhbXFx3OlxcLVxcLl0rKVxccyokL2lnbSwgZnVuY3Rpb24oJCwgJGlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gX2RvY3VtZW50ICYmIF9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgkaWQpO1xuICAgICAgICAgICAgICAgIGFyZ3NbMF0gPSBlbGVtID8gKGVsZW0udmFsdWUgfHwgZWxlbS5pbm5lckhUTUwpIDogJDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mKGRvY3VtZW50KSAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAganVpY2VyLmNvbXBpbGUuY2FsbChqdWljZXIsIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGp1aWNlci5jb21waWxlLmFwcGx5KGp1aWNlciwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBqdWljZXIudG9faHRtbC5hcHBseShqdWljZXIsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfX2VzY2FwZWh0bWwgPSB7XG4gICAgICAgIGVzY2FwZWhhc2g6IHtcbiAgICAgICAgICAgICc8JzogJyZsdDsnLFxuICAgICAgICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAgICAgICAnJic6ICcmYW1wOycsXG4gICAgICAgICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgICAgICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAgICAgICAgICcvJzogJyYjeDJmOydcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBlcmVwbGFjZTogZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgcmV0dXJuIF9fZXNjYXBlaHRtbC5lc2NhcGVoYXNoW2tdO1xuICAgICAgICB9LFxuICAgICAgICBlc2NhcGluZzogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKHN0cikgIT09ICdzdHJpbmcnID8gc3RyIDogc3RyLnJlcGxhY2UoL1smPD5cIl0vaWdtLCB0aGlzLmVzY2FwZXJlcGxhY2UpO1xuICAgICAgICB9LFxuICAgICAgICBkZXRlY3Rpb246IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZGF0YSkgPT09ICd1bmRlZmluZWQnID8gJycgOiBkYXRhO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfX3Rocm93ID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgaWYodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYoY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbnNvbGUubG9nKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93KGVycm9yKTtcbiAgICB9O1xuXG4gICAgdmFyIF9fY3JlYXRvciA9IGZ1bmN0aW9uKG8sIHByb3RvKSB7XG4gICAgICAgIG8gPSBvICE9PSBPYmplY3QobykgPyB7fSA6IG87XG5cbiAgICAgICAgaWYoby5fX3Byb3RvX18pIHtcbiAgICAgICAgICAgIG8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbXB0eSA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHZhciBuID0gT2JqZWN0LmNyZWF0ZSA/IFxuICAgICAgICAgICAgT2JqZWN0LmNyZWF0ZShwcm90bykgOiBcbiAgICAgICAgICAgIG5ldyhlbXB0eS5wcm90b3R5cGUgPSBwcm90bywgZW1wdHkpO1xuXG4gICAgICAgIGZvcih2YXIgaSBpbiBvKSB7XG4gICAgICAgICAgICBpZihvLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgbltpXSA9IG9baV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9O1xuXG4gICAgdmFyIGFubm90YXRlID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgdmFyIEZOX0FSR1MgPSAvXmZ1bmN0aW9uXFxzKlteXFwoXSpcXChcXHMqKFteXFwpXSopXFwpL207XG4gICAgICAgIHZhciBGTl9BUkdfU1BMSVQgPSAvLC87XG4gICAgICAgIHZhciBGTl9BUkcgPSAvXlxccyooXz8pKFxcUys/KVxcMVxccyokLztcbiAgICAgICAgdmFyIEZOX0JPRFkgPSAvXmZ1bmN0aW9uW157XSt7KFtcXHNcXFNdKil9L207XG4gICAgICAgIHZhciBTVFJJUF9DT01NRU5UUyA9IC8oKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pKS9tZztcbiAgICAgICAgdmFyIGFyZ3MgPSBbXSxcbiAgICAgICAgICAgIGZuVGV4dCxcbiAgICAgICAgICAgIGZuQm9keSxcbiAgICAgICAgICAgIGFyZ0RlY2w7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKGZuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZuVGV4dCA9IGZuLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2YgZm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmblRleHQgPSBmbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZuVGV4dCA9IGZuVGV4dC5yZXBsYWNlKFNUUklQX0NPTU1FTlRTLCAnJyk7XG4gICAgICAgIGZuVGV4dCA9IGZuVGV4dC50cmltKCk7XG4gICAgICAgIGFyZ0RlY2wgPSBmblRleHQubWF0Y2goRk5fQVJHUyk7XG4gICAgICAgIGZuQm9keSA9IGZuVGV4dC5tYXRjaChGTl9CT0RZKVsxXS50cmltKCk7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFyZ0RlY2xbMV0uc3BsaXQoRk5fQVJHX1NQTElUKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ0RlY2xbMV0uc3BsaXQoRk5fQVJHX1NQTElUKVtpXTtcbiAgICAgICAgICAgIGFyZy5yZXBsYWNlKEZOX0FSRywgZnVuY3Rpb24oYWxsLCB1bmRlcnNjb3JlLCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW2FyZ3MsIGZuQm9keV07XG4gICAgfTtcblxuICAgIGp1aWNlci5fX2NhY2hlID0ge307XG4gICAganVpY2VyLnZlcnNpb24gPSAnMC42Ljgtc3RhYmxlJztcbiAgICBqdWljZXIuc2V0dGluZ3MgPSB7fTtcblxuICAgIGp1aWNlci50YWdzID0ge1xuICAgICAgICBvcGVyYXRpb25PcGVuOiAne0AnLFxuICAgICAgICBvcGVyYXRpb25DbG9zZTogJ30nLFxuICAgICAgICBpbnRlcnBvbGF0ZU9wZW46ICdcXFxcJHsnLFxuICAgICAgICBpbnRlcnBvbGF0ZUNsb3NlOiAnfScsXG4gICAgICAgIG5vbmVlbmNvZGVPcGVuOiAnXFxcXCRcXFxcJHsnLFxuICAgICAgICBub25lZW5jb2RlQ2xvc2U6ICd9JyxcbiAgICAgICAgY29tbWVudE9wZW46ICdcXFxceyMnLFxuICAgICAgICBjb21tZW50Q2xvc2U6ICdcXFxcfSdcbiAgICB9O1xuXG4gICAganVpY2VyLm9wdGlvbnMgPSB7XG4gICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICBzdHJpcDogdHJ1ZSxcbiAgICAgICAgZXJyb3JoYW5kbGluZzogdHJ1ZSxcbiAgICAgICAgZGV0ZWN0aW9uOiB0cnVlLFxuICAgICAgICBfbWV0aG9kOiBfX2NyZWF0b3Ioe1xuICAgICAgICAgICAgX19lc2NhcGVodG1sOiBfX2VzY2FwZWh0bWwsXG4gICAgICAgICAgICBfX3Rocm93OiBfX3Rocm93LFxuICAgICAgICAgICAgX19qdWljZXI6IGp1aWNlclxuICAgICAgICB9LCB7fSlcbiAgICB9O1xuXG4gICAganVpY2VyLnRhZ0luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvcnN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdlYWNoXFxcXHMqKFtefV0qPylcXFxccyphc1xcXFxzKihcXFxcdyo/KVxcXFxzKigsXFxcXHMqXFxcXHcqPyk/JyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgZm9yZW5kID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdcXFxcL2VhY2gnICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBpZnN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdpZlxcXFxzKihbXn1dKj8pJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaWZlbmQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ1xcXFwvaWYnICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBlbHNlc3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2Vsc2UnICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBlbHNlaWZzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWxzZSBpZlxcXFxzKihbXn1dKj8pJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaW50ZXJwb2xhdGUgPSBqdWljZXIudGFncy5pbnRlcnBvbGF0ZU9wZW4gKyAnKFtcXFxcc1xcXFxTXSs/KScgKyBqdWljZXIudGFncy5pbnRlcnBvbGF0ZUNsb3NlO1xuICAgICAgICB2YXIgbm9uZWVuY29kZSA9IGp1aWNlci50YWdzLm5vbmVlbmNvZGVPcGVuICsgJyhbXFxcXHNcXFxcU10rPyknICsganVpY2VyLnRhZ3Mubm9uZWVuY29kZUNsb3NlO1xuICAgICAgICB2YXIgaW5saW5lY29tbWVudCA9IGp1aWNlci50YWdzLmNvbW1lbnRPcGVuICsgJ1tefV0qPycgKyBqdWljZXIudGFncy5jb21tZW50Q2xvc2U7XG4gICAgICAgIHZhciByYW5nZXN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdlYWNoXFxcXHMqKFxcXFx3Kj8pXFxcXHMqaW5cXFxccypyYW5nZVxcXFwoKFtefV0rPylcXFxccyosXFxcXHMqKFtefV0rPylcXFxcKScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGluY2x1ZGUgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2luY2x1ZGVcXFxccyooW159XSo/KVxcXFxzKixcXFxccyooW159XSo/KScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGhlbHBlclJlZ2lzdGVyU3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2hlbHBlclxcXFxzKihbXn1dKj8pXFxcXHMqJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaGVscGVyUmVnaXN0ZXJCb2R5ID0gJyhbXFxcXHNcXFxcU10qPyknO1xuICAgICAgICB2YXIgaGVscGVyUmVnaXN0ZXJFbmQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ1xcXFwvaGVscGVyJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuXG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5mb3JzdGFydCA9IG5ldyBSZWdFeHAoZm9yc3RhcnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmZvcmVuZCA9IG5ldyBSZWdFeHAoZm9yZW5kLCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5pZnN0YXJ0ID0gbmV3IFJlZ0V4cChpZnN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5pZmVuZCA9IG5ldyBSZWdFeHAoaWZlbmQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmVsc2VzdGFydCA9IG5ldyBSZWdFeHAoZWxzZXN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5lbHNlaWZzdGFydCA9IG5ldyBSZWdFeHAoZWxzZWlmc3RhcnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmludGVycG9sYXRlID0gbmV3IFJlZ0V4cChpbnRlcnBvbGF0ZSwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3Mubm9uZWVuY29kZSA9IG5ldyBSZWdFeHAobm9uZWVuY29kZSwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaW5saW5lY29tbWVudCA9IG5ldyBSZWdFeHAoaW5saW5lY29tbWVudCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MucmFuZ2VzdGFydCA9IG5ldyBSZWdFeHAocmFuZ2VzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaW5jbHVkZSA9IG5ldyBSZWdFeHAoaW5jbHVkZSwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaGVscGVyUmVnaXN0ZXIgPSBuZXcgUmVnRXhwKGhlbHBlclJlZ2lzdGVyU3RhcnQgKyBoZWxwZXJSZWdpc3RlckJvZHkgKyBoZWxwZXJSZWdpc3RlckVuZCwgJ2lnbScpO1xuICAgIH07XG5cbiAgICBqdWljZXIudGFnSW5pdCgpO1xuXG4gICAgLy8gVXNpbmcgdGhpcyBtZXRob2QgdG8gc2V0IHRoZSBvcHRpb25zIGJ5IGdpdmVuIGNvbmYtbmFtZSBhbmQgY29uZi12YWx1ZSxcbiAgICAvLyB5b3UgY2FuIGFsc28gcHJvdmlkZSBtb3JlIHRoYW4gb25lIGtleS12YWx1ZSBwYWlyIHdyYXBwZWQgYnkgYW4gb2JqZWN0LlxuICAgIC8vIHRoaXMgaW50ZXJmYWNlIGFsc28gdXNlZCB0byBjdXN0b20gdGhlIHRlbXBsYXRlIHRhZyBkZWxpbWF0ZXIsIGZvciB0aGlzXG4gICAgLy8gc2l0dWF0aW9uLCB0aGUgY29uZi1uYW1lIG11c3QgYmVnaW4gd2l0aCB0YWc6OiwgZm9yIGV4YW1wbGU6IGp1aWNlci5zZXRcbiAgICAvLyAoJ3RhZzo6b3BlcmF0aW9uT3BlbicsICd7QCcpLlxuXG4gICAganVpY2VyLnNldCA9IGZ1bmN0aW9uKGNvbmYsIHZhbHVlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB2YXIgZXNjYXBlUGF0dGVybiA9IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIHJldHVybiB2LnJlcGxhY2UoL1tcXCRcXChcXClcXFtcXF1cXCtcXF5cXHtcXH1cXD9cXCpcXHxcXC5dL2lnbSwgZnVuY3Rpb24oJCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnXFxcXCcgKyAkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHNldCA9IGZ1bmN0aW9uKGNvbmYsIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdGFnID0gY29uZi5tYXRjaCgvXnRhZzo6KC4qKSQvaSk7XG5cbiAgICAgICAgICAgIGlmKHRhZykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFnc1t0YWdbMV1dID0gZXNjYXBlUGF0dGVybih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhhdC50YWdJbml0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGF0Lm9wdGlvbnNbY29uZl0gPSB2YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBzZXQoY29uZiwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY29uZiA9PT0gT2JqZWN0KGNvbmYpKSB7XG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gY29uZikge1xuICAgICAgICAgICAgICAgIGlmKGNvbmYuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0KGksIGNvbmZbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBCZWZvcmUgeW91J3JlIHVzaW5nIGN1c3RvbSBmdW5jdGlvbnMgaW4geW91ciB0ZW1wbGF0ZSBsaWtlICR7bmFtZSB8IGZuTmFtZX0sXG4gICAgLy8geW91IG5lZWQgdG8gcmVnaXN0ZXIgdGhpcyBmbiBieSBqdWljZXIucmVnaXN0ZXIoJ2ZuTmFtZScsIGZuKS5cblxuICAgIGp1aWNlci5yZWdpc3RlciA9IGZ1bmN0aW9uKGZuYW1lLCBmbikge1xuICAgICAgICB2YXIgX21ldGhvZCA9IHRoaXMub3B0aW9ucy5fbWV0aG9kO1xuXG4gICAgICAgIGlmKF9tZXRob2QuaGFzT3duUHJvcGVydHkoZm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX21ldGhvZFtmbmFtZV0gPSBmbjtcbiAgICB9O1xuXG4gICAgLy8gcmVtb3ZlIHRoZSByZWdpc3RlcmVkIGZ1bmN0aW9uIGluIHRoZSBtZW1vcnkgYnkgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG5hbWUuXG4gICAgLy8gZm9yIGV4YW1wbGU6IGp1aWNlci51bnJlZ2lzdGVyKCdmbk5hbWUnKS5cblxuICAgIGp1aWNlci51bnJlZ2lzdGVyID0gZnVuY3Rpb24oZm5hbWUpIHtcbiAgICAgICAgdmFyIF9tZXRob2QgPSB0aGlzLm9wdGlvbnMuX21ldGhvZDtcblxuICAgICAgICBpZihfbWV0aG9kLmhhc093blByb3BlcnR5KGZuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZSBfbWV0aG9kW2ZuYW1lXTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBqdWljZXIudGVtcGxhdGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgICAgIHRoaXMuX19pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKF9uYW1lLCBfZXNjYXBlLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX2RlZmluZSA9IF9uYW1lLnNwbGl0KCd8JyksIF9mbiA9IF9kZWZpbmVbMF0gfHwgJycsIF9jbHVzdGVyO1xuXG4gICAgICAgICAgICBpZihfZGVmaW5lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBfbmFtZSA9IF9kZWZpbmUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBfY2x1c3RlciA9IF9kZWZpbmUuc2hpZnQoKS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgIF9mbiA9ICdfbWV0aG9kLicgKyBfY2x1c3Rlci5zaGlmdCgpICsgJy5jYWxsKHt9LCAnICsgW19uYW1lXS5jb25jYXQoX2NsdXN0ZXIpICsgJyknO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJzwlPSAnICsgKF9lc2NhcGUgPyAnX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcnIDogJycpICsgJygnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICghb3B0aW9ucyB8fCBvcHRpb25zLmRldGVjdGlvbiAhPT0gZmFsc2UgPyAnX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uJyA6ICcnKSArICcoJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2ZuICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcpJyArXG4gICAgICAgICAgICAgICAgICAgICcpJyArXG4gICAgICAgICAgICAgICAgJyAlPic7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX3JlbW92ZVNoZWxsID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX2NvdW50ZXIgPSAwO1xuXG4gICAgICAgICAgICB0cGwgPSB0cGxcbiAgICAgICAgICAgICAgICAvLyBpbmxpbmUgaGVscGVyIHJlZ2lzdGVyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmhlbHBlclJlZ2lzdGVyLCBmdW5jdGlvbigkLCBoZWxwZXJOYW1lLCBmblRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFubm8gPSBhbm5vdGF0ZShmblRleHQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm5BcmdzID0gYW5ub1swXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuQm9keSA9IGFubm9bMV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbihmbkFyZ3Muam9pbignLCcpLCBmbkJvZHkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGp1aWNlci5yZWdpc3RlcihoZWxwZXJOYW1lLCBmbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBmb3IgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5mb3JzdGFydCwgZnVuY3Rpb24oJCwgX25hbWUsIGFsaWFzLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsaWFzID0gYWxpYXMgfHwgJ3ZhbHVlJywga2V5ID0ga2V5ICYmIGtleS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfaXRlcmF0ZSA9ICdpJyArIF9jb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCUgfmZ1bmN0aW9uKCkgeycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZm9yKHZhciAnICsgX2l0ZXJhdGUgKyAnIGluICcgKyBfbmFtZSArICcpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpZignICsgX25hbWUgKyAnLmhhc093blByb3BlcnR5KCcgKyBfaXRlcmF0ZSArICcpKSB7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhciAnICsgYWxpYXMgKyAnPScgKyBfbmFtZSArICdbJyArIF9pdGVyYXRlICsgJ107JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleSA/ICgndmFyICcgKyBrZXkgKyAnPScgKyBfaXRlcmF0ZSArICc7JykgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgJT4nO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmZvcmVuZCwgJzwlIH19fSgpOyAlPicpXG5cbiAgICAgICAgICAgICAgICAvLyBpZiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmlmc3RhcnQsIGZ1bmN0aW9uKCQsIGNvbmRpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIGlmKCcgKyBjb25kaXRpb24gKyAnKSB7ICU+JztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pZmVuZCwgJzwlIH0gJT4nKVxuXG4gICAgICAgICAgICAgICAgLy8gZWxzZSBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmVsc2VzdGFydCwgZnVuY3Rpb24oJCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH0gZWxzZSB7ICU+JztcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gZWxzZSBpZiBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmVsc2VpZnN0YXJ0LCBmdW5jdGlvbigkLCBjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSB9IGVsc2UgaWYoJyArIGNvbmRpdGlvbiArICcpIHsgJT4nO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBpbnRlcnBvbGF0ZSB3aXRob3V0IGVzY2FwZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5ub25lZW5jb2RlLCBmdW5jdGlvbigkLCBfbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhhdC5fX2ludGVycG9sYXRlKF9uYW1lLCBmYWxzZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGludGVycG9sYXRlIHdpdGggZXNjYXBlXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmludGVycG9sYXRlLCBmdW5jdGlvbigkLCBfbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhhdC5fX2ludGVycG9sYXRlKF9uYW1lLCB0cnVlLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gY2xlYW4gdXAgY29tbWVudHNcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaW5saW5lY29tbWVudCwgJycpXG5cbiAgICAgICAgICAgICAgICAvLyByYW5nZSBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLnJhbmdlc3RhcnQsIGZ1bmN0aW9uKCQsIF9uYW1lLCBzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfaXRlcmF0ZSA9ICdqJyArIF9jb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCUgfmZ1bmN0aW9uKCkgeycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZm9yKHZhciAnICsgX2l0ZXJhdGUgKyAnPScgKyBzdGFydCArICc7JyArIF9pdGVyYXRlICsgJzwnICsgZW5kICsgJzsnICsgX2l0ZXJhdGUgKyAnKyspIHt7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFyICcgKyBfbmFtZSArICc9JyArIF9pdGVyYXRlICsgJzsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICU+JztcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gaW5jbHVkZSBzdWItdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaW5jbHVkZSwgZnVuY3Rpb24oJCwgdHBsLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBhdGlibGUgZm9yIG5vZGUuanNcbiAgICAgICAgICAgICAgICAgICAgaWYodHBsLm1hdGNoKC9eZmlsZVxcOlxcL1xcLy9pZ20pKSByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JT0gX21ldGhvZC5fX2p1aWNlcignICsgdHBsICsgJywgJyArIGRhdGEgKyAnKTsgJT4nO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBleGNlcHRpb24gaGFuZGxpbmdcbiAgICAgICAgICAgIGlmKCFvcHRpb25zIHx8IG9wdGlvbnMuZXJyb3JoYW5kbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0cGwgPSAnPCUgdHJ5IHsgJT4nICsgdHBsO1xuICAgICAgICAgICAgICAgIHRwbCArPSAnPCUgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSAlPic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX3RvTmF0aXZlID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX2NvbnZlcnQodHBsLCAhb3B0aW9ucyB8fCBvcHRpb25zLnN0cmlwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fbGV4aWNhbEFuYWx5emUgPSBmdW5jdGlvbih0cGwpIHtcbiAgICAgICAgICAgIHZhciBidWZmZXIgPSBbXTtcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSBbXTtcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSAnJztcbiAgICAgICAgICAgIHZhciByZXNlcnZlZCA9IFtcbiAgICAgICAgICAgICAgICAnaWYnLCAnZWFjaCcsICdfJywgJ19tZXRob2QnLCAnY29uc29sZScsIFxuICAgICAgICAgICAgICAgICdicmVhaycsICdjYXNlJywgJ2NhdGNoJywgJ2NvbnRpbnVlJywgJ2RlYnVnZ2VyJywgJ2RlZmF1bHQnLCAnZGVsZXRlJywgJ2RvJywgXG4gICAgICAgICAgICAgICAgJ2ZpbmFsbHknLCAnZm9yJywgJ2Z1bmN0aW9uJywgJ2luJywgJ2luc3RhbmNlb2YnLCAnbmV3JywgJ3JldHVybicsICdzd2l0Y2gnLCBcbiAgICAgICAgICAgICAgICAndGhpcycsICd0aHJvdycsICd0cnknLCAndHlwZW9mJywgJ3ZhcicsICd2b2lkJywgJ3doaWxlJywgJ3dpdGgnLCAnbnVsbCcsICd0eXBlb2YnLCBcbiAgICAgICAgICAgICAgICAnY2xhc3MnLCAnZW51bScsICdleHBvcnQnLCAnZXh0ZW5kcycsICdpbXBvcnQnLCAnc3VwZXInLCAnaW1wbGVtZW50cycsICdpbnRlcmZhY2UnLCBcbiAgICAgICAgICAgICAgICAnbGV0JywgJ3BhY2thZ2UnLCAncHJpdmF0ZScsICdwcm90ZWN0ZWQnLCAncHVibGljJywgJ3N0YXRpYycsICd5aWVsZCcsICdjb25zdCcsICdhcmd1bWVudHMnLCBcbiAgICAgICAgICAgICAgICAndHJ1ZScsICdmYWxzZScsICd1bmRlZmluZWQnLCAnTmFOJ1xuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgdmFyIGluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgdmFyaWFibGVBbmFseXplID0gZnVuY3Rpb24oJCwgc3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gc3RhdGVtZW50Lm1hdGNoKC9cXHcrL2lnbSlbMF07XG5cbiAgICAgICAgICAgICAgICBpZihpbmRleE9mKGJ1ZmZlciwgc3RhdGVtZW50KSA9PT0gLTEgJiYgaW5kZXhPZihyZXNlcnZlZCwgc3RhdGVtZW50KSA9PT0gLTEgJiYgaW5kZXhPZihtZXRob2QsIHN0YXRlbWVudCkgPT09IC0xKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYXZvaWQgcmUtZGVjbGFyZSBuYXRpdmUgZnVuY3Rpb24sIGlmIG5vdCBkbyB0aGlzLCB0ZW1wbGF0ZSBcbiAgICAgICAgICAgICAgICAgICAgLy8gYHtAaWYgZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpfWAgY291bGQgYmUgdGhyb3cgdW5kZWZpbmVkLlxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZih3aW5kb3cpICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Yod2luZG93W3N0YXRlbWVudF0pID09PSAnZnVuY3Rpb24nICYmIHdpbmRvd1tzdGF0ZW1lbnRdLnRvU3RyaW5nKCkubWF0Y2goL15cXHMqP2Z1bmN0aW9uIFxcdytcXChcXCkgXFx7XFxzKj9cXFtuYXRpdmUgY29kZVxcXVxccyo/XFx9XFxzKj8kL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBhdGlibGUgZm9yIG5vZGUuanNcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKGdsb2JhbCkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZihnbG9iYWxbc3RhdGVtZW50XSkgPT09ICdmdW5jdGlvbicgJiYgZ2xvYmFsW3N0YXRlbWVudF0udG9TdHJpbmcoKS5tYXRjaCgvXlxccyo/ZnVuY3Rpb24gXFx3K1xcKFxcKSBcXHtcXHMqP1xcW25hdGl2ZSBjb2RlXFxdXFxzKj9cXH1cXHMqPyQvaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYXZvaWQgcmUtZGVjbGFyZSByZWdpc3RlcmVkIGZ1bmN0aW9uLCBpZiBub3QgZG8gdGhpcywgdGVtcGxhdGUgXG4gICAgICAgICAgICAgICAgICAgIC8vIGB7QGlmIHJlZ2lzdGVyZWRfZnVuYyhuYW1lKX1gIGNvdWxkIGJlIHRocm93IHVuZGVmaW5lZC5cblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoanVpY2VyLm9wdGlvbnMuX21ldGhvZFtzdGF0ZW1lbnRdKSA9PT0gJ2Z1bmN0aW9uJyB8fCBqdWljZXIub3B0aW9ucy5fbWV0aG9kLmhhc093blByb3BlcnR5KHN0YXRlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHN0YXRlbWVudCk7IC8vIGZ1Y2sgaWVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRwbC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5mb3JzdGFydCwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbnRlcnBvbGF0ZSwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pZnN0YXJ0LCB2YXJpYWJsZUFuYWx5emUpLlxuICAgICAgICAgICAgICAgIHJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmVsc2VpZnN0YXJ0LCB2YXJpYWJsZUFuYWx5emUpLlxuICAgICAgICAgICAgICAgIHJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmluY2x1ZGUsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZSgvW1xcK1xcLVxcKlxcLyUhXFw/XFx8XFxeJn48Pj0sXFwoXFwpXFxbXFxdXVxccyooW0EtWmEtel9dKykvaWdtLCB2YXJpYWJsZUFuYWx5emUpO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2kgPCBidWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggKz0gJ3ZhciAnICsgYnVmZmVyW2ldICsgJz1fLicgKyBidWZmZXJbaV0gKyAnOyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aSA8IG1ldGhvZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByZWZpeCArPSAndmFyICcgKyBtZXRob2RbaV0gKyAnPV9tZXRob2QuJyArIG1ldGhvZFtpXSArICc7JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICc8JSAnICsgcHJlZml4ICsgJyAlPic7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX2NvbnZlcnQ9ZnVuY3Rpb24odHBsLCBzdHJpcCkge1xuICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IFtdLmpvaW4oJycpO1xuXG4gICAgICAgICAgICBidWZmZXIgKz0gXCIndXNlIHN0cmljdCc7XCI7IC8vIHVzZSBzdHJpY3QgbW9kZVxuICAgICAgICAgICAgYnVmZmVyICs9IFwidmFyIF89X3x8e307XCI7XG4gICAgICAgICAgICBidWZmZXIgKz0gXCJ2YXIgX291dD0nJztfb3V0Kz0nXCI7XG5cbiAgICAgICAgICAgIGlmKHN0cmlwICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0cGxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcclxcdFxcbl0vZywgXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nKD89W14lXSolPikvZywgXCJcXHRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJ1wiKS5qb2luKFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiXFx0XCIpLmpvaW4oXCInXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC88JT0oLis/KSU+L2csIFwiJztfb3V0Kz0kMTtfb3V0Kz0nXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIjwlXCIpLmpvaW4oXCInO1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIlPlwiKS5qb2luKFwiX291dCs9J1wiKStcbiAgICAgICAgICAgICAgICAgICAgXCInO3JldHVybiBfb3V0O1wiO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVmZmVyICs9IHRwbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFxyXS9nLCBcIlxcXFxyXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx0XS9nLCBcIlxcXFx0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFxuXS9nLCBcIlxcXFxuXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nKD89W14lXSolPikvZywgXCJcXHRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJ1wiKS5qb2luKFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiXFx0XCIpLmpvaW4oXCInXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC88JT0oLis/KSU+L2csIFwiJztfb3V0Kz0kMTtfb3V0Kz0nXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIjwlXCIpLmpvaW4oXCInO1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIlPlwiKS5qb2luKFwiX291dCs9J1wiKStcbiAgICAgICAgICAgICAgICAgICAgXCInO3JldHVybiBfb3V0LnJlcGxhY2UoL1tcXFxcclxcXFxuXVxcXFxzK1tcXFxcclxcXFxuXS9nLCAnXFxcXHJcXFxcbicpO1wiO1xuXG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGFyc2UgPSBmdW5jdGlvbih0cGwsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBfdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmKCFvcHRpb25zIHx8IG9wdGlvbnMubG9vc2UgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdHBsID0gdGhpcy5fX2xleGljYWxBbmFseXplKHRwbCkgKyB0cGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRwbCA9IHRoaXMuX19yZW1vdmVTaGVsbCh0cGwsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdHBsID0gdGhpcy5fX3RvTmF0aXZlKHRwbCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciA9IG5ldyBGdW5jdGlvbignXywgX21ldGhvZCcsIHRwbCk7XG5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oXywgX21ldGhvZCkge1xuICAgICAgICAgICAgICAgIGlmKCFfbWV0aG9kIHx8IF9tZXRob2QgIT09IHRoYXQub3B0aW9ucy5fbWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgIF9tZXRob2QgPSBfX2NyZWF0b3IoX21ldGhvZCwgdGhhdC5vcHRpb25zLl9tZXRob2QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhhdC5fcmVuZGVyLmNhbGwodGhpcywgXywgX21ldGhvZCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAganVpY2VyLmNvbXBpbGUgPSBmdW5jdGlvbih0cGwsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYoIW9wdGlvbnMgfHwgb3B0aW9ucyAhPT0gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gX19jcmVhdG9yKG9wdGlvbnMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGVuZ2luZSA9IHRoaXMuX19jYWNoZVt0cGxdID8gXG4gICAgICAgICAgICAgICAgdGhpcy5fX2NhY2hlW3RwbF0gOiBcbiAgICAgICAgICAgICAgICBuZXcgdGhpcy50ZW1wbGF0ZSh0aGlzLm9wdGlvbnMpLnBhcnNlKHRwbCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIGlmKCFvcHRpb25zIHx8IG9wdGlvbnMuY2FjaGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2NhY2hlW3RwbF0gPSBlbmdpbmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlbmdpbmU7XG5cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBfX3Rocm93KCdKdWljZXIgQ29tcGlsZSBFeGNlcHRpb246ICcgKyBlLm1lc3NhZ2UpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fSAvLyBub29wXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGp1aWNlci50b19odG1sID0gZnVuY3Rpb24odHBsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIGlmKCFvcHRpb25zIHx8IG9wdGlvbnMgIT09IHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IF9fY3JlYXRvcihvcHRpb25zLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGlsZSh0cGwsIG9wdGlvbnMpLnJlbmRlcihkYXRhLCBvcHRpb25zLl9tZXRob2QpO1xuICAgIH07XG4gICAgd2luZG93Lmp1aWNlciA9IGp1aWNlcjtcbiAgICB0eXBlb2YobW9kdWxlKSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgPyBtb2R1bGUuZXhwb3J0cyA9IGp1aWNlciA6IHRoaXMuanVpY2VyID0ganVpY2VyO1xuXG59KSgpO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgbG9kYXNoLmNvbS9saWNlbnNlIHwgVW5kZXJzY29yZS5qcyAxLjUuMiB1bmRlcnNjb3JlanMub3JnL0xJQ0VOU0VcbiAqIEJ1aWxkOiBgbG9kYXNoIC1vIC4vZGlzdC9sb2Rhc2guY29tcGF0LmpzYFxuICovXG47KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbihuLHQsZSl7ZT0oZXx8MCktMTtmb3IodmFyIHI9bj9uLmxlbmd0aDowOysrZTxyOylpZihuW2VdPT09dClyZXR1cm4gZTtyZXR1cm4tMX1mdW5jdGlvbiB0KHQsZSl7dmFyIHI9dHlwZW9mIGU7aWYodD10LmwsXCJib29sZWFuXCI9PXJ8fG51bGw9PWUpcmV0dXJuIHRbZV0/MDotMTtcIm51bWJlclwiIT1yJiZcInN0cmluZ1wiIT1yJiYocj1cIm9iamVjdFwiKTt2YXIgdT1cIm51bWJlclwiPT1yP2U6YitlO3JldHVybiB0PSh0PXRbcl0pJiZ0W3VdLFwib2JqZWN0XCI9PXI/dCYmLTE8bih0LGUpPzA6LTE6dD8wOi0xfWZ1bmN0aW9uIGUobil7dmFyIHQ9dGhpcy5sLGU9dHlwZW9mIG47aWYoXCJib29sZWFuXCI9PWV8fG51bGw9PW4pdFtuXT10cnVlO2Vsc2V7XCJudW1iZXJcIiE9ZSYmXCJzdHJpbmdcIiE9ZSYmKGU9XCJvYmplY3RcIik7dmFyIHI9XCJudW1iZXJcIj09ZT9uOmIrbix0PXRbZV18fCh0W2VdPXt9KTtcIm9iamVjdFwiPT1lPyh0W3JdfHwodFtyXT1bXSkpLnB1c2gobik6dFtyXT10cnVlXG59fWZ1bmN0aW9uIHIobil7cmV0dXJuIG4uY2hhckNvZGVBdCgwKX1mdW5jdGlvbiB1KG4sdCl7Zm9yKHZhciBlPW4ubSxyPXQubSx1PS0xLG89ZS5sZW5ndGg7Kyt1PG87KXt2YXIgYT1lW3VdLGk9clt1XTtpZihhIT09aSl7aWYoYT5pfHx0eXBlb2YgYT09XCJ1bmRlZmluZWRcIilyZXR1cm4gMTtpZihhPGl8fHR5cGVvZiBpPT1cInVuZGVmaW5lZFwiKXJldHVybi0xfX1yZXR1cm4gbi5uLXQubn1mdW5jdGlvbiBvKG4pe3ZhciB0PS0xLHI9bi5sZW5ndGgsdT1uWzBdLG89bltyLzJ8MF0sYT1uW3ItMV07aWYodSYmdHlwZW9mIHU9PVwib2JqZWN0XCImJm8mJnR5cGVvZiBvPT1cIm9iamVjdFwiJiZhJiZ0eXBlb2YgYT09XCJvYmplY3RcIilyZXR1cm4gZmFsc2U7Zm9yKHU9bCgpLHVbXCJmYWxzZVwiXT11W1wibnVsbFwiXT11W1widHJ1ZVwiXT11LnVuZGVmaW5lZD1mYWxzZSxvPWwoKSxvLms9bixvLmw9dSxvLnB1c2g9ZTsrK3Q8cjspby5wdXNoKG5bdF0pO3JldHVybiBvfWZ1bmN0aW9uIGEobil7cmV0dXJuXCJcXFxcXCIrWVtuXVxufWZ1bmN0aW9uIGkoKXtyZXR1cm4gdi5wb3AoKXx8W119ZnVuY3Rpb24gbCgpe3JldHVybiB5LnBvcCgpfHx7azpudWxsLGw6bnVsbCxtOm51bGwsXCJmYWxzZVwiOmZhbHNlLG46MCxcIm51bGxcIjpmYWxzZSxudW1iZXI6bnVsbCxvYmplY3Q6bnVsbCxwdXNoOm51bGwsc3RyaW5nOm51bGwsXCJ0cnVlXCI6ZmFsc2UsdW5kZWZpbmVkOmZhbHNlLG86bnVsbH19ZnVuY3Rpb24gZihuKXtyZXR1cm4gdHlwZW9mIG4udG9TdHJpbmchPVwiZnVuY3Rpb25cIiYmdHlwZW9mKG4rXCJcIik9PVwic3RyaW5nXCJ9ZnVuY3Rpb24gYyhuKXtuLmxlbmd0aD0wLHYubGVuZ3RoPHcmJnYucHVzaChuKX1mdW5jdGlvbiBwKG4pe3ZhciB0PW4ubDt0JiZwKHQpLG4uaz1uLmw9bi5tPW4ub2JqZWN0PW4ubnVtYmVyPW4uc3RyaW5nPW4ubz1udWxsLHkubGVuZ3RoPHcmJnkucHVzaChuKX1mdW5jdGlvbiBzKG4sdCxlKXt0fHwodD0wKSx0eXBlb2YgZT09XCJ1bmRlZmluZWRcIiYmKGU9bj9uLmxlbmd0aDowKTt2YXIgcj0tMTtlPWUtdHx8MDtmb3IodmFyIHU9QXJyYXkoMD5lPzA6ZSk7KytyPGU7KXVbcl09blt0K3JdO1xucmV0dXJuIHV9ZnVuY3Rpb24gZyhlKXtmdW5jdGlvbiB2KG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmIXFlKG4pJiZ3ZS5jYWxsKG4sXCJfX3dyYXBwZWRfX1wiKT9uOm5ldyB5KG4pfWZ1bmN0aW9uIHkobix0KXt0aGlzLl9fY2hhaW5fXz0hIXQsdGhpcy5fX3dyYXBwZWRfXz1ufWZ1bmN0aW9uIHcobil7ZnVuY3Rpb24gdCgpe2lmKHIpe3ZhciBuPXMocik7amUuYXBwbHkobixhcmd1bWVudHMpfWlmKHRoaXMgaW5zdGFuY2VvZiB0KXt2YXIgbz1udChlLnByb3RvdHlwZSksbj1lLmFwcGx5KG8sbnx8YXJndW1lbnRzKTtyZXR1cm4geHQobik/bjpvfXJldHVybiBlLmFwcGx5KHUsbnx8YXJndW1lbnRzKX12YXIgZT1uWzBdLHI9blsyXSx1PW5bNF07cmV0dXJuIHplKHQsbiksdH1mdW5jdGlvbiBZKG4sdCxlLHIsdSl7aWYoZSl7dmFyIG89ZShuKTtpZih0eXBlb2YgbyE9XCJ1bmRlZmluZWRcIilyZXR1cm4gb31pZigheHQobikpcmV0dXJuIG47dmFyIGE9aGUuY2FsbChuKTtpZighVlthXXx8IUxlLm5vZGVDbGFzcyYmZihuKSlyZXR1cm4gbjtcbnZhciBsPVRlW2FdO3N3aXRjaChhKXtjYXNlIEw6Y2FzZSB6OnJldHVybiBuZXcgbCgrbik7Y2FzZSBXOmNhc2UgTTpyZXR1cm4gbmV3IGwobik7Y2FzZSBKOnJldHVybiBvPWwobi5zb3VyY2UsUy5leGVjKG4pKSxvLmxhc3RJbmRleD1uLmxhc3RJbmRleCxvfWlmKGE9cWUobiksdCl7dmFyIHA9IXI7cnx8KHI9aSgpKSx1fHwodT1pKCkpO2Zvcih2YXIgZz1yLmxlbmd0aDtnLS07KWlmKHJbZ109PW4pcmV0dXJuIHVbZ107bz1hP2wobi5sZW5ndGgpOnt9fWVsc2Ugbz1hP3Mobik6WWUoe30sbik7cmV0dXJuIGEmJih3ZS5jYWxsKG4sXCJpbmRleFwiKSYmKG8uaW5kZXg9bi5pbmRleCksd2UuY2FsbChuLFwiaW5wdXRcIikmJihvLmlucHV0PW4uaW5wdXQpKSx0PyhyLnB1c2gobiksdS5wdXNoKG8pLChhP1hlOnRyKShuLGZ1bmN0aW9uKG4sYSl7b1thXT1ZKG4sdCxlLHIsdSl9KSxwJiYoYyhyKSxjKHUpKSxvKTpvfWZ1bmN0aW9uIG50KG4pe3JldHVybiB4dChuKT9TZShuKTp7fX1mdW5jdGlvbiB0dChuLHQsZSl7aWYodHlwZW9mIG4hPVwiZnVuY3Rpb25cIilyZXR1cm4gSHQ7XG5pZih0eXBlb2YgdD09XCJ1bmRlZmluZWRcInx8IShcInByb3RvdHlwZVwiaW4gbikpcmV0dXJuIG47dmFyIHI9bi5fX2JpbmREYXRhX187aWYodHlwZW9mIHI9PVwidW5kZWZpbmVkXCImJihMZS5mdW5jTmFtZXMmJihyPSFuLm5hbWUpLHI9cnx8IUxlLmZ1bmNEZWNvbXAsIXIpKXt2YXIgdT1iZS5jYWxsKG4pO0xlLmZ1bmNOYW1lc3x8KHI9IUEudGVzdCh1KSkscnx8KHI9Qi50ZXN0KHUpLHplKG4scikpfWlmKGZhbHNlPT09cnx8dHJ1ZSE9PXImJjEmclsxXSlyZXR1cm4gbjtzd2l0Y2goZSl7Y2FzZSAxOnJldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gbi5jYWxsKHQsZSl9O2Nhc2UgMjpyZXR1cm4gZnVuY3Rpb24oZSxyKXtyZXR1cm4gbi5jYWxsKHQsZSxyKX07Y2FzZSAzOnJldHVybiBmdW5jdGlvbihlLHIsdSl7cmV0dXJuIG4uY2FsbCh0LGUscix1KX07Y2FzZSA0OnJldHVybiBmdW5jdGlvbihlLHIsdSxvKXtyZXR1cm4gbi5jYWxsKHQsZSxyLHUsbyl9fXJldHVybiBNdChuLHQpfWZ1bmN0aW9uIGV0KG4pe2Z1bmN0aW9uIHQoKXt2YXIgbj1sP2E6dGhpcztcbmlmKHUpe3ZhciBoPXModSk7amUuYXBwbHkoaCxhcmd1bWVudHMpfXJldHVybihvfHxjKSYmKGh8fChoPXMoYXJndW1lbnRzKSksbyYmamUuYXBwbHkoaCxvKSxjJiZoLmxlbmd0aDxpKT8ocnw9MTYsZXQoW2UscD9yOi00JnIsaCxudWxsLGEsaV0pKTooaHx8KGg9YXJndW1lbnRzKSxmJiYoZT1uW2ddKSx0aGlzIGluc3RhbmNlb2YgdD8obj1udChlLnByb3RvdHlwZSksaD1lLmFwcGx5KG4saCkseHQoaCk/aDpuKTplLmFwcGx5KG4saCkpfXZhciBlPW5bMF0scj1uWzFdLHU9blsyXSxvPW5bM10sYT1uWzRdLGk9bls1XSxsPTEmcixmPTImcixjPTQmcixwPTgmcixnPWU7cmV0dXJuIHplKHQsbiksdH1mdW5jdGlvbiBydChlLHIpe3ZhciB1PS0xLGE9aHQoKSxpPWU/ZS5sZW5ndGg6MCxsPWk+PV8mJmE9PT1uLGY9W107aWYobCl7dmFyIGM9byhyKTtjPyhhPXQscj1jKTpsPWZhbHNlfWZvcig7Kyt1PGk7KWM9ZVt1XSwwPmEocixjKSYmZi5wdXNoKGMpO3JldHVybiBsJiZwKHIpLGZ9ZnVuY3Rpb24gb3Qobix0LGUscil7cj0ocnx8MCktMTtcbmZvcih2YXIgdT1uP24ubGVuZ3RoOjAsbz1bXTsrK3I8dTspe3ZhciBhPW5bcl07aWYoYSYmdHlwZW9mIGE9PVwib2JqZWN0XCImJnR5cGVvZiBhLmxlbmd0aD09XCJudW1iZXJcIiYmKHFlKGEpfHxkdChhKSkpe3R8fChhPW90KGEsdCxlKSk7dmFyIGk9LTEsbD1hLmxlbmd0aCxmPW8ubGVuZ3RoO2ZvcihvLmxlbmd0aCs9bDsrK2k8bDspb1tmKytdPWFbaV19ZWxzZSBlfHxvLnB1c2goYSl9cmV0dXJuIG99ZnVuY3Rpb24gYXQobix0LGUscix1LG8pe2lmKGUpe3ZhciBhPWUobix0KTtpZih0eXBlb2YgYSE9XCJ1bmRlZmluZWRcIilyZXR1cm4hIWF9aWYobj09PXQpcmV0dXJuIDAhPT1ufHwxL249PTEvdDtpZihuPT09biYmIShuJiZYW3R5cGVvZiBuXXx8dCYmWFt0eXBlb2YgdF0pKXJldHVybiBmYWxzZTtpZihudWxsPT1ufHxudWxsPT10KXJldHVybiBuPT09dDt2YXIgbD1oZS5jYWxsKG4pLHA9aGUuY2FsbCh0KTtpZihsPT1UJiYobD1HKSxwPT1UJiYocD1HKSxsIT1wKXJldHVybiBmYWxzZTtzd2l0Y2gobCl7Y2FzZSBMOmNhc2UgejpyZXR1cm4rbj09K3Q7XG5jYXNlIFc6cmV0dXJuIG4hPStuP3QhPSt0OjA9PW4/MS9uPT0xL3Q6bj09K3Q7Y2FzZSBKOmNhc2UgTTpyZXR1cm4gbj09aWUodCl9aWYocD1sPT0kLCFwKXt2YXIgcz13ZS5jYWxsKG4sXCJfX3dyYXBwZWRfX1wiKSxnPXdlLmNhbGwodCxcIl9fd3JhcHBlZF9fXCIpO2lmKHN8fGcpcmV0dXJuIGF0KHM/bi5fX3dyYXBwZWRfXzpuLGc/dC5fX3dyYXBwZWRfXzp0LGUscix1LG8pO2lmKGwhPUd8fCFMZS5ub2RlQ2xhc3MmJihmKG4pfHxmKHQpKSlyZXR1cm4gZmFsc2U7aWYobD0hTGUuYXJnc09iamVjdCYmZHQobik/b2U6bi5jb25zdHJ1Y3RvcixzPSFMZS5hcmdzT2JqZWN0JiZkdCh0KT9vZTp0LmNvbnN0cnVjdG9yLGwhPXMmJiEoanQobCkmJmwgaW5zdGFuY2VvZiBsJiZqdChzKSYmcyBpbnN0YW5jZW9mIHMpJiZcImNvbnN0cnVjdG9yXCJpbiBuJiZcImNvbnN0cnVjdG9yXCJpbiB0KXJldHVybiBmYWxzZX1mb3IobD0hdSx1fHwodT1pKCkpLG98fChvPWkoKSkscz11Lmxlbmd0aDtzLS07KWlmKHVbc109PW4pcmV0dXJuIG9bc109PXQ7XG52YXIgaD0wLGE9dHJ1ZTtpZih1LnB1c2gobiksby5wdXNoKHQpLHApe2lmKHM9bi5sZW5ndGgsaD10Lmxlbmd0aCwoYT1oPT1zKXx8cilmb3IoO2gtLTspaWYocD1zLGc9dFtoXSxyKWZvcig7cC0tJiYhKGE9YXQobltwXSxnLGUscix1LG8pKTspO2Vsc2UgaWYoIShhPWF0KG5baF0sZyxlLHIsdSxvKSkpYnJlYWt9ZWxzZSBucih0LGZ1bmN0aW9uKHQsaSxsKXtyZXR1cm4gd2UuY2FsbChsLGkpPyhoKyssYT13ZS5jYWxsKG4saSkmJmF0KG5baV0sdCxlLHIsdSxvKSk6dm9pZCAwfSksYSYmIXImJm5yKG4sZnVuY3Rpb24obix0LGUpe3JldHVybiB3ZS5jYWxsKGUsdCk/YT0tMTwtLWg6dm9pZCAwfSk7cmV0dXJuIHUucG9wKCksby5wb3AoKSxsJiYoYyh1KSxjKG8pKSxhfWZ1bmN0aW9uIGl0KG4sdCxlLHIsdSl7KHFlKHQpP0R0OnRyKSh0LGZ1bmN0aW9uKHQsbyl7dmFyIGEsaSxsPXQsZj1uW29dO2lmKHQmJigoaT1xZSh0KSl8fGVyKHQpKSl7Zm9yKGw9ci5sZW5ndGg7bC0tOylpZihhPXJbbF09PXQpe2Y9dVtsXTtcbmJyZWFrfWlmKCFhKXt2YXIgYztlJiYobD1lKGYsdCksYz10eXBlb2YgbCE9XCJ1bmRlZmluZWRcIikmJihmPWwpLGN8fChmPWk/cWUoZik/ZjpbXTplcihmKT9mOnt9KSxyLnB1c2godCksdS5wdXNoKGYpLGN8fGl0KGYsdCxlLHIsdSl9fWVsc2UgZSYmKGw9ZShmLHQpLHR5cGVvZiBsPT1cInVuZGVmaW5lZFwiJiYobD10KSksdHlwZW9mIGwhPVwidW5kZWZpbmVkXCImJihmPWwpO25bb109Zn0pfWZ1bmN0aW9uIGx0KG4sdCl7cmV0dXJuIG4rZGUoRmUoKSoodC1uKzEpKX1mdW5jdGlvbiBmdChlLHIsdSl7dmFyIGE9LTEsbD1odCgpLGY9ZT9lLmxlbmd0aDowLHM9W10sZz0hciYmZj49XyYmbD09PW4saD11fHxnP2koKTpzO2ZvcihnJiYoaD1vKGgpLGw9dCk7KythPGY7KXt2YXIgdj1lW2FdLHk9dT91KHYsYSxlKTp2OyhyPyFhfHxoW2gubGVuZ3RoLTFdIT09eTowPmwoaCx5KSkmJigodXx8ZykmJmgucHVzaCh5KSxzLnB1c2godikpfXJldHVybiBnPyhjKGguaykscChoKSk6dSYmYyhoKSxzfWZ1bmN0aW9uIGN0KG4pe3JldHVybiBmdW5jdGlvbih0LGUscil7dmFyIHU9e307XG5pZihlPXYuY3JlYXRlQ2FsbGJhY2soZSxyLDMpLHFlKHQpKXtyPS0xO2Zvcih2YXIgbz10Lmxlbmd0aDsrK3I8bzspe3ZhciBhPXRbcl07bih1LGEsZShhLHIsdCksdCl9fWVsc2UgWGUodCxmdW5jdGlvbih0LHIsbyl7bih1LHQsZSh0LHIsbyksbyl9KTtyZXR1cm4gdX19ZnVuY3Rpb24gcHQobix0LGUscix1LG8pe3ZhciBhPTEmdCxpPTQmdCxsPTE2JnQsZj0zMiZ0O2lmKCEoMiZ0fHxqdChuKSkpdGhyb3cgbmV3IGxlO2wmJiFlLmxlbmd0aCYmKHQmPS0xNyxsPWU9ZmFsc2UpLGYmJiFyLmxlbmd0aCYmKHQmPS0zMyxmPXI9ZmFsc2UpO3ZhciBjPW4mJm4uX19iaW5kRGF0YV9fO3JldHVybiBjJiZ0cnVlIT09Yz8oYz1zKGMpLGNbMl0mJihjWzJdPXMoY1syXSkpLGNbM10mJihjWzNdPXMoY1szXSkpLCFhfHwxJmNbMV18fChjWzRdPXUpLCFhJiYxJmNbMV0mJih0fD04KSwhaXx8NCZjWzFdfHwoY1s1XT1vKSxsJiZqZS5hcHBseShjWzJdfHwoY1syXT1bXSksZSksZiYmRWUuYXBwbHkoY1szXXx8KGNbM109W10pLHIpLGNbMV18PXQscHQuYXBwbHkobnVsbCxjKSk6KDE9PXR8fDE3PT09dD93OmV0KShbbix0LGUscix1LG9dKVxufWZ1bmN0aW9uIHN0KCl7US5oPUYsUS5iPVEuYz1RLmc9US5pPVwiXCIsUS5lPVwidFwiLFEuaj10cnVlO2Zvcih2YXIgbix0PTA7bj1hcmd1bWVudHNbdF07dCsrKWZvcih2YXIgZSBpbiBuKVFbZV09bltlXTt0PVEuYSxRLmQ9L15bXixdKy8uZXhlYyh0KVswXSxuPWVlLHQ9XCJyZXR1cm4gZnVuY3Rpb24oXCIrdCtcIil7XCIsZT1RO3ZhciByPVwidmFyIG4sdD1cIitlLmQrXCIsRT1cIitlLmUrXCI7aWYoIXQpcmV0dXJuIEU7XCIrZS5pK1wiO1wiO2UuYj8ocis9XCJ2YXIgdT10Lmxlbmd0aDtuPS0xO2lmKFwiK2UuYitcIil7XCIsTGUudW5pbmRleGVkQ2hhcnMmJihyKz1cImlmKHModCkpe3Q9dC5zcGxpdCgnJyl9XCIpLHIrPVwid2hpbGUoKytuPHUpe1wiK2UuZytcIjt9fWVsc2V7XCIpOkxlLm5vbkVudW1BcmdzJiYocis9XCJ2YXIgdT10Lmxlbmd0aDtuPS0xO2lmKHUmJnAodCkpe3doaWxlKCsrbjx1KXtuKz0nJztcIitlLmcrXCI7fX1lbHNle1wiKSxMZS5lbnVtUHJvdG90eXBlcyYmKHIrPVwidmFyIEc9dHlwZW9mIHQ9PSdmdW5jdGlvbic7XCIpLExlLmVudW1FcnJvclByb3BzJiYocis9XCJ2YXIgRj10PT09a3x8dCBpbnN0YW5jZW9mIEVycm9yO1wiKTtcbnZhciB1PVtdO2lmKExlLmVudW1Qcm90b3R5cGVzJiZ1LnB1c2goJyEoRyYmbj09XCJwcm90b3R5cGVcIiknKSxMZS5lbnVtRXJyb3JQcm9wcyYmdS5wdXNoKCchKEYmJihuPT1cIm1lc3NhZ2VcInx8bj09XCJuYW1lXCIpKScpLGUuaiYmZS5mKXIrPVwidmFyIEM9LTEsRD1CW3R5cGVvZiB0XSYmdih0KSx1PUQ/RC5sZW5ndGg6MDt3aGlsZSgrK0M8dSl7bj1EW0NdO1wiLHUubGVuZ3RoJiYocis9XCJpZihcIit1LmpvaW4oXCImJlwiKStcIil7XCIpLHIrPWUuZytcIjtcIix1Lmxlbmd0aCYmKHIrPVwifVwiKSxyKz1cIn1cIjtlbHNlIGlmKHIrPVwiZm9yKG4gaW4gdCl7XCIsZS5qJiZ1LnB1c2goXCJtLmNhbGwodCwgbilcIiksdS5sZW5ndGgmJihyKz1cImlmKFwiK3Uuam9pbihcIiYmXCIpK1wiKXtcIikscis9ZS5nK1wiO1wiLHUubGVuZ3RoJiYocis9XCJ9XCIpLHIrPVwifVwiLExlLm5vbkVudW1TaGFkb3dzKXtmb3Iocis9XCJpZih0IT09QSl7dmFyIGk9dC5jb25zdHJ1Y3RvcixyPXQ9PT0oaSYmaS5wcm90b3R5cGUpLGY9dD09PUo/STp0PT09az9qOkwuY2FsbCh0KSx4PXlbZl07XCIsaz0wOzc+aztrKyspcis9XCJuPSdcIitlLmhba10rXCInO2lmKCghKHImJnhbbl0pJiZtLmNhbGwodCxuKSlcIixlLmp8fChyKz1cInx8KCF4W25dJiZ0W25dIT09QVtuXSlcIikscis9XCIpe1wiK2UuZytcIn1cIjtcbnIrPVwifVwifXJldHVybihlLmJ8fExlLm5vbkVudW1BcmdzKSYmKHIrPVwifVwiKSxyKz1lLmMrXCI7cmV0dXJuIEVcIixuKFwiZCxqLGssbSxvLHAscSxzLHYsQSxCLHksSSxKLExcIix0K3IrXCJ9XCIpKHR0LHEsY2Usd2UsZCxkdCxxZSxrdCxRLmYscGUsWCwkZSxNLHNlLGhlKX1mdW5jdGlvbiBndChuKXtyZXR1cm4gVmVbbl19ZnVuY3Rpb24gaHQoKXt2YXIgdD0odD12LmluZGV4T2YpPT09enQ/bjp0O3JldHVybiB0fWZ1bmN0aW9uIHZ0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJmdW5jdGlvblwiJiZ2ZS50ZXN0KG4pfWZ1bmN0aW9uIHl0KG4pe3ZhciB0LGU7cmV0dXJuIW58fGhlLmNhbGwobikhPUd8fCh0PW4uY29uc3RydWN0b3IsanQodCkmJiEodCBpbnN0YW5jZW9mIHQpKXx8IUxlLmFyZ3NDbGFzcyYmZHQobil8fCFMZS5ub2RlQ2xhc3MmJmYobik/ZmFsc2U6TGUub3duTGFzdD8obnIobixmdW5jdGlvbihuLHQscil7cmV0dXJuIGU9d2UuY2FsbChyLHQpLGZhbHNlfSksZmFsc2UhPT1lKToobnIobixmdW5jdGlvbihuLHQpe2U9dFxufSksdHlwZW9mIGU9PVwidW5kZWZpbmVkXCJ8fHdlLmNhbGwobixlKSl9ZnVuY3Rpb24gbXQobil7cmV0dXJuIEhlW25dfWZ1bmN0aW9uIGR0KG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiJiZoZS5jYWxsKG4pPT1UfHxmYWxzZX1mdW5jdGlvbiBidChuLHQsZSl7dmFyIHI9V2UobiksdT1yLmxlbmd0aDtmb3IodD10dCh0LGUsMyk7dS0tJiYoZT1yW3VdLGZhbHNlIT09dChuW2VdLGUsbikpOyk7cmV0dXJuIG59ZnVuY3Rpb24gX3Qobil7dmFyIHQ9W107cmV0dXJuIG5yKG4sZnVuY3Rpb24obixlKXtqdChuKSYmdC5wdXNoKGUpfSksdC5zb3J0KCl9ZnVuY3Rpb24gd3Qobil7Zm9yKHZhciB0PS0xLGU9V2Uobikscj1lLmxlbmd0aCx1PXt9OysrdDxyOyl7dmFyIG89ZVt0XTt1W25bb11dPW99cmV0dXJuIHV9ZnVuY3Rpb24ganQobil7cmV0dXJuIHR5cGVvZiBuPT1cImZ1bmN0aW9uXCJ9ZnVuY3Rpb24geHQobil7cmV0dXJuISghbnx8IVhbdHlwZW9mIG5dKVxufWZ1bmN0aW9uIEN0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJudW1iZXJcInx8biYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PVd8fGZhbHNlfWZ1bmN0aW9uIGt0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJzdHJpbmdcInx8biYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PU18fGZhbHNlfWZ1bmN0aW9uIEV0KG4pe2Zvcih2YXIgdD0tMSxlPVdlKG4pLHI9ZS5sZW5ndGgsdT1adChyKTsrK3Q8cjspdVt0XT1uW2VbdF1dO3JldHVybiB1fWZ1bmN0aW9uIE90KG4sdCxlKXt2YXIgcj0tMSx1PWh0KCksbz1uP24ubGVuZ3RoOjAsYT1mYWxzZTtyZXR1cm4gZT0oMD5lP0JlKDAsbytlKTplKXx8MCxxZShuKT9hPS0xPHUobix0LGUpOnR5cGVvZiBvPT1cIm51bWJlclwiP2E9LTE8KGt0KG4pP24uaW5kZXhPZih0LGUpOnUobix0LGUpKTpYZShuLGZ1bmN0aW9uKG4pe3JldHVybisrcjxlP3ZvaWQgMDohKGE9bj09PXQpfSksYX1mdW5jdGlvbiBTdChuLHQsZSl7dmFyIHI9dHJ1ZTtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHFlKG4pKXtlPS0xO1xuZm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1JiYocj0hIXQobltlXSxlLG4pKTspO31lbHNlIFhlKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiByPSEhdChuLGUsdSl9KTtyZXR1cm4gcn1mdW5jdGlvbiBBdChuLHQsZSl7dmFyIHI9W107aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxxZShuKSl7ZT0tMTtmb3IodmFyIHU9bi5sZW5ndGg7KytlPHU7KXt2YXIgbz1uW2VdO3QobyxlLG4pJiZyLnB1c2gobyl9fWVsc2UgWGUobixmdW5jdGlvbihuLGUsdSl7dChuLGUsdSkmJnIucHVzaChuKX0pO3JldHVybiByfWZ1bmN0aW9uIEl0KG4sdCxlKXtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLCFxZShuKSl7dmFyIHI7cmV0dXJuIFhlKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiB0KG4sZSx1KT8ocj1uLGZhbHNlKTp2b2lkIDB9KSxyfWU9LTE7Zm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1Oyl7dmFyIG89bltlXTtpZih0KG8sZSxuKSlyZXR1cm4gb319ZnVuY3Rpb24gRHQobix0LGUpe2lmKHQmJnR5cGVvZiBlPT1cInVuZGVmaW5lZFwiJiZxZShuKSl7ZT0tMTtcbmZvcih2YXIgcj1uLmxlbmd0aDsrK2U8ciYmZmFsc2UhPT10KG5bZV0sZSxuKTspO31lbHNlIFhlKG4sdCxlKTtyZXR1cm4gbn1mdW5jdGlvbiBOdChuLHQsZSl7dmFyIHI9bix1PW4/bi5sZW5ndGg6MDtpZih0PXQmJnR5cGVvZiBlPT1cInVuZGVmaW5lZFwiP3Q6dHQodCxlLDMpLHFlKG4pKWZvcig7dS0tJiZmYWxzZSE9PXQoblt1XSx1LG4pOyk7ZWxzZXtpZih0eXBlb2YgdSE9XCJudW1iZXJcIil2YXIgbz1XZShuKSx1PW8ubGVuZ3RoO2Vsc2UgTGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pJiYocj1uLnNwbGl0KFwiXCIpKTtYZShuLGZ1bmN0aW9uKG4sZSxhKXtyZXR1cm4gZT1vP29bLS11XTotLXUsdChyW2VdLGUsYSl9KX1yZXR1cm4gbn1mdW5jdGlvbiBCdChuLHQsZSl7dmFyIHI9LTEsdT1uP24ubGVuZ3RoOjAsbz1adCh0eXBlb2YgdT09XCJudW1iZXJcIj91OjApO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykscWUobikpZm9yKDsrK3I8dTspb1tyXT10KG5bcl0scixuKTtlbHNlIFhlKG4sZnVuY3Rpb24obixlLHUpe29bKytyXT10KG4sZSx1KVxufSk7cmV0dXJuIG99ZnVuY3Rpb24gUHQobix0LGUpe3ZhciB1PS0xLzAsbz11O2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCImJmUmJmVbdF09PT1uJiYodD1udWxsKSxudWxsPT10JiZxZShuKSl7ZT0tMTtmb3IodmFyIGE9bi5sZW5ndGg7KytlPGE7KXt2YXIgaT1uW2VdO2k+byYmKG89aSl9fWVsc2UgdD1udWxsPT10JiZrdChuKT9yOnYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLFhlKG4sZnVuY3Rpb24obixlLHIpe2U9dChuLGUsciksZT51JiYodT1lLG89bil9KTtyZXR1cm4gb31mdW5jdGlvbiBSdChuLHQsZSxyKXt2YXIgdT0zPmFyZ3VtZW50cy5sZW5ndGg7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsciw0KSxxZShuKSl7dmFyIG89LTEsYT1uLmxlbmd0aDtmb3IodSYmKGU9blsrK29dKTsrK288YTspZT10KGUsbltvXSxvLG4pfWVsc2UgWGUobixmdW5jdGlvbihuLHIsbyl7ZT11Pyh1PWZhbHNlLG4pOnQoZSxuLHIsbyl9KTtyZXR1cm4gZX1mdW5jdGlvbiBGdChuLHQsZSxyKXt2YXIgdT0zPmFyZ3VtZW50cy5sZW5ndGg7XG5yZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsciw0KSxOdChuLGZ1bmN0aW9uKG4scixvKXtlPXU/KHU9ZmFsc2Usbik6dChlLG4scixvKX0pLGV9ZnVuY3Rpb24gVHQobil7dmFyIHQ9LTEsZT1uP24ubGVuZ3RoOjAscj1adCh0eXBlb2YgZT09XCJudW1iZXJcIj9lOjApO3JldHVybiBEdChuLGZ1bmN0aW9uKG4pe3ZhciBlPWx0KDAsKyt0KTtyW3RdPXJbZV0scltlXT1ufSkscn1mdW5jdGlvbiAkdChuLHQsZSl7dmFyIHI7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxxZShuKSl7ZT0tMTtmb3IodmFyIHU9bi5sZW5ndGg7KytlPHUmJiEocj10KG5bZV0sZSxuKSk7KTt9ZWxzZSBYZShuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4hKHI9dChuLGUsdSkpfSk7cmV0dXJuISFyfWZ1bmN0aW9uIEx0KG4sdCxlKXt2YXIgcj0wLHU9bj9uLmxlbmd0aDowO2lmKHR5cGVvZiB0IT1cIm51bWJlclwiJiZudWxsIT10KXt2YXIgbz0tMTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK288dSYmdChuW29dLG8sbik7KXIrK1xufWVsc2UgaWYocj10LG51bGw9PXJ8fGUpcmV0dXJuIG4/blswXTpoO3JldHVybiBzKG4sMCxQZShCZSgwLHIpLHUpKX1mdW5jdGlvbiB6dCh0LGUscil7aWYodHlwZW9mIHI9PVwibnVtYmVyXCIpe3ZhciB1PXQ/dC5sZW5ndGg6MDtyPTA+cj9CZSgwLHUrcik6cnx8MH1lbHNlIGlmKHIpcmV0dXJuIHI9S3QodCxlKSx0W3JdPT09ZT9yOi0xO3JldHVybiBuKHQsZSxyKX1mdW5jdGlvbiBxdChuLHQsZSl7aWYodHlwZW9mIHQhPVwibnVtYmVyXCImJm51bGwhPXQpe3ZhciByPTAsdT0tMSxvPW4/bi5sZW5ndGg6MDtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK3U8byYmdChuW3VdLHUsbik7KXIrK31lbHNlIHI9bnVsbD09dHx8ZT8xOkJlKDAsdCk7cmV0dXJuIHMobixyKX1mdW5jdGlvbiBLdChuLHQsZSxyKXt2YXIgdT0wLG89bj9uLmxlbmd0aDp1O2ZvcihlPWU/di5jcmVhdGVDYWxsYmFjayhlLHIsMSk6SHQsdD1lKHQpO3U8bzspcj11K28+Pj4xLGUobltyXSk8dD91PXIrMTpvPXI7XG5yZXR1cm4gdX1mdW5jdGlvbiBXdChuLHQsZSxyKXtyZXR1cm4gdHlwZW9mIHQhPVwiYm9vbGVhblwiJiZudWxsIT10JiYocj1lLGU9dHlwZW9mIHQhPVwiZnVuY3Rpb25cIiYmciYmclt0XT09PW4/bnVsbDp0LHQ9ZmFsc2UpLG51bGwhPWUmJihlPXYuY3JlYXRlQ2FsbGJhY2soZSxyLDMpKSxmdChuLHQsZSl9ZnVuY3Rpb24gR3QoKXtmb3IodmFyIG49MTxhcmd1bWVudHMubGVuZ3RoP2FyZ3VtZW50czphcmd1bWVudHNbMF0sdD0tMSxlPW4/UHQoYXIobixcImxlbmd0aFwiKSk6MCxyPVp0KDA+ZT8wOmUpOysrdDxlOylyW3RdPWFyKG4sdCk7cmV0dXJuIHJ9ZnVuY3Rpb24gSnQobix0KXt2YXIgZT0tMSxyPW4/bi5sZW5ndGg6MCx1PXt9O2Zvcih0fHwhcnx8cWUoblswXSl8fCh0PVtdKTsrK2U8cjspe3ZhciBvPW5bZV07dD91W29dPXRbZV06byYmKHVbb1swXV09b1sxXSl9cmV0dXJuIHV9ZnVuY3Rpb24gTXQobix0KXtyZXR1cm4gMjxhcmd1bWVudHMubGVuZ3RoP3B0KG4sMTcscyhhcmd1bWVudHMsMiksbnVsbCx0KTpwdChuLDEsbnVsbCxudWxsLHQpXG59ZnVuY3Rpb24gVnQobix0LGUpe3ZhciByLHUsbyxhLGksbCxmLGM9MCxwPWZhbHNlLHM9dHJ1ZTtpZighanQobikpdGhyb3cgbmV3IGxlO2lmKHQ9QmUoMCx0KXx8MCx0cnVlPT09ZSl2YXIgZz10cnVlLHM9ZmFsc2U7ZWxzZSB4dChlKSYmKGc9ZS5sZWFkaW5nLHA9XCJtYXhXYWl0XCJpbiBlJiYoQmUodCxlLm1heFdhaXQpfHwwKSxzPVwidHJhaWxpbmdcImluIGU/ZS50cmFpbGluZzpzKTt2YXIgdj1mdW5jdGlvbigpe3ZhciBlPXQtKGlyKCktYSk7MDxlP2w9Q2UodixlKToodSYmbWUodSksZT1mLHU9bD1mPWgsZSYmKGM9aXIoKSxvPW4uYXBwbHkoaSxyKSxsfHx1fHwocj1pPW51bGwpKSl9LHk9ZnVuY3Rpb24oKXtsJiZtZShsKSx1PWw9Zj1oLChzfHxwIT09dCkmJihjPWlyKCksbz1uLmFwcGx5KGksciksbHx8dXx8KHI9aT1udWxsKSl9O3JldHVybiBmdW5jdGlvbigpe2lmKHI9YXJndW1lbnRzLGE9aXIoKSxpPXRoaXMsZj1zJiYobHx8IWcpLGZhbHNlPT09cCl2YXIgZT1nJiYhbDtlbHNle3V8fGd8fChjPWEpO1xudmFyIGg9cC0oYS1jKSxtPTA+PWg7bT8odSYmKHU9bWUodSkpLGM9YSxvPW4uYXBwbHkoaSxyKSk6dXx8KHU9Q2UoeSxoKSl9cmV0dXJuIG0mJmw/bD1tZShsKTpsfHx0PT09cHx8KGw9Q2Uodix0KSksZSYmKG09dHJ1ZSxvPW4uYXBwbHkoaSxyKSksIW18fGx8fHV8fChyPWk9bnVsbCksb319ZnVuY3Rpb24gSHQobil7cmV0dXJuIG59ZnVuY3Rpb24gVXQobix0LGUpe3ZhciByPXRydWUsdT10JiZfdCh0KTt0JiYoZXx8dS5sZW5ndGgpfHwobnVsbD09ZSYmKGU9dCksbz15LHQ9bixuPXYsdT1fdCh0KSksZmFsc2U9PT1lP3I9ZmFsc2U6eHQoZSkmJlwiY2hhaW5cImluIGUmJihyPWUuY2hhaW4pO3ZhciBvPW4sYT1qdChvKTtEdCh1LGZ1bmN0aW9uKGUpe3ZhciB1PW5bZV09dFtlXTthJiYoby5wcm90b3R5cGVbZV09ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9fY2hhaW5fXyxlPXRoaXMuX193cmFwcGVkX18sYT1bZV07aWYoamUuYXBwbHkoYSxhcmd1bWVudHMpLGE9dS5hcHBseShuLGEpLHJ8fHQpe2lmKGU9PT1hJiZ4dChhKSlyZXR1cm4gdGhpcztcbmE9bmV3IG8oYSksYS5fX2NoYWluX189dH1yZXR1cm4gYX0pfSl9ZnVuY3Rpb24gUXQoKXt9ZnVuY3Rpb24gWHQobil7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0W25dfX1mdW5jdGlvbiBZdCgpe3JldHVybiB0aGlzLl9fd3JhcHBlZF9ffWU9ZT91dC5kZWZhdWx0cyhaLk9iamVjdCgpLGUsdXQucGljayhaLFIpKTpaO3ZhciBadD1lLkFycmF5LG5lPWUuQm9vbGVhbix0ZT1lLkRhdGUsZWU9ZS5GdW5jdGlvbixyZT1lLk1hdGgsdWU9ZS5OdW1iZXIsb2U9ZS5PYmplY3QsYWU9ZS5SZWdFeHAsaWU9ZS5TdHJpbmcsbGU9ZS5UeXBlRXJyb3IsZmU9W10sY2U9ZS5FcnJvci5wcm90b3R5cGUscGU9b2UucHJvdG90eXBlLHNlPWllLnByb3RvdHlwZSxnZT1lLl8saGU9cGUudG9TdHJpbmcsdmU9YWUoXCJeXCIraWUoaGUpLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLFwiXFxcXCQmXCIpLnJlcGxhY2UoL3RvU3RyaW5nfCBmb3IgW15cXF1dKy9nLFwiLio/XCIpK1wiJFwiKSx5ZT1yZS5jZWlsLG1lPWUuY2xlYXJUaW1lb3V0LGRlPXJlLmZsb29yLGJlPWVlLnByb3RvdHlwZS50b1N0cmluZyxfZT12dChfZT1vZS5nZXRQcm90b3R5cGVPZikmJl9lLHdlPXBlLmhhc093blByb3BlcnR5LGplPWZlLnB1c2gseGU9cGUucHJvcGVydHlJc0VudW1lcmFibGUsQ2U9ZS5zZXRUaW1lb3V0LGtlPWZlLnNwbGljZSxFZT1mZS51bnNoaWZ0LE9lPWZ1bmN0aW9uKCl7dHJ5e3ZhciBuPXt9LHQ9dnQodD1vZS5kZWZpbmVQcm9wZXJ0eSkmJnQsZT10KG4sbixuKSYmdFxufWNhdGNoKHIpe31yZXR1cm4gZX0oKSxTZT12dChTZT1vZS5jcmVhdGUpJiZTZSxBZT12dChBZT1adC5pc0FycmF5KSYmQWUsSWU9ZS5pc0Zpbml0ZSxEZT1lLmlzTmFOLE5lPXZ0KE5lPW9lLmtleXMpJiZOZSxCZT1yZS5tYXgsUGU9cmUubWluLFJlPWUucGFyc2VJbnQsRmU9cmUucmFuZG9tLFRlPXt9O1RlWyRdPVp0LFRlW0xdPW5lLFRlW3pdPXRlLFRlW0tdPWVlLFRlW0ddPW9lLFRlW1ddPXVlLFRlW0pdPWFlLFRlW01dPWllO3ZhciAkZT17fTskZVskXT0kZVt6XT0kZVtXXT17Y29uc3RydWN0b3I6dHJ1ZSx0b0xvY2FsZVN0cmluZzp0cnVlLHRvU3RyaW5nOnRydWUsdmFsdWVPZjp0cnVlfSwkZVtMXT0kZVtNXT17Y29uc3RydWN0b3I6dHJ1ZSx0b1N0cmluZzp0cnVlLHZhbHVlT2Y6dHJ1ZX0sJGVbcV09JGVbS109JGVbSl09e2NvbnN0cnVjdG9yOnRydWUsdG9TdHJpbmc6dHJ1ZX0sJGVbR109e2NvbnN0cnVjdG9yOnRydWV9LGZ1bmN0aW9uKCl7Zm9yKHZhciBuPUYubGVuZ3RoO24tLTspe3ZhciB0LGU9RltuXTtcbmZvcih0IGluICRlKXdlLmNhbGwoJGUsdCkmJiF3ZS5jYWxsKCRlW3RdLGUpJiYoJGVbdF1bZV09ZmFsc2UpfX0oKSx5LnByb3RvdHlwZT12LnByb3RvdHlwZTt2YXIgTGU9di5zdXBwb3J0PXt9OyFmdW5jdGlvbigpe3ZhciBuPWZ1bmN0aW9uKCl7dGhpcy54PTF9LHQ9ezA6MSxsZW5ndGg6MX0scj1bXTtuLnByb3RvdHlwZT17dmFsdWVPZjoxLHk6MX07Zm9yKHZhciB1IGluIG5ldyBuKXIucHVzaCh1KTtmb3IodSBpbiBhcmd1bWVudHMpO0xlLmFyZ3NDbGFzcz1oZS5jYWxsKGFyZ3VtZW50cyk9PVQsTGUuYXJnc09iamVjdD1hcmd1bWVudHMuY29uc3RydWN0b3I9PW9lJiYhKGFyZ3VtZW50cyBpbnN0YW5jZW9mIFp0KSxMZS5lbnVtRXJyb3JQcm9wcz14ZS5jYWxsKGNlLFwibWVzc2FnZVwiKXx8eGUuY2FsbChjZSxcIm5hbWVcIiksTGUuZW51bVByb3RvdHlwZXM9eGUuY2FsbChuLFwicHJvdG90eXBlXCIpLExlLmZ1bmNEZWNvbXA9IXZ0KGUuV2luUlRFcnJvcikmJkIudGVzdChnKSxMZS5mdW5jTmFtZXM9dHlwZW9mIGVlLm5hbWU9PVwic3RyaW5nXCIsTGUubm9uRW51bUFyZ3M9MCE9dSxMZS5ub25FbnVtU2hhZG93cz0hL3ZhbHVlT2YvLnRlc3QociksTGUub3duTGFzdD1cInhcIiE9clswXSxMZS5zcGxpY2VPYmplY3RzPShmZS5zcGxpY2UuY2FsbCh0LDAsMSksIXRbMF0pLExlLnVuaW5kZXhlZENoYXJzPVwieHhcIiE9XCJ4XCJbMF0rb2UoXCJ4XCIpWzBdO1xudHJ5e0xlLm5vZGVDbGFzcz0hKGhlLmNhbGwoZG9jdW1lbnQpPT1HJiYhKHt0b1N0cmluZzowfStcIlwiKSl9Y2F0Y2gobyl7TGUubm9kZUNsYXNzPXRydWV9fSgxKSx2LnRlbXBsYXRlU2V0dGluZ3M9e2VzY2FwZTovPCUtKFtcXHNcXFNdKz8pJT4vZyxldmFsdWF0ZTovPCUoW1xcc1xcU10rPyklPi9nLGludGVycG9sYXRlOkksdmFyaWFibGU6XCJcIixpbXBvcnRzOntfOnZ9fSxTZXx8KG50PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe31yZXR1cm4gZnVuY3Rpb24odCl7aWYoeHQodCkpe24ucHJvdG90eXBlPXQ7dmFyIHI9bmV3IG47bi5wcm90b3R5cGU9bnVsbH1yZXR1cm4gcnx8ZS5PYmplY3QoKX19KCkpO3ZhciB6ZT1PZT9mdW5jdGlvbihuLHQpe1UudmFsdWU9dCxPZShuLFwiX19iaW5kRGF0YV9fXCIsVSl9OlF0O0xlLmFyZ3NDbGFzc3x8KGR0PWZ1bmN0aW9uKG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiJiZ3ZS5jYWxsKG4sXCJjYWxsZWVcIikmJiF4ZS5jYWxsKG4sXCJjYWxsZWVcIil8fGZhbHNlXG59KTt2YXIgcWU9QWV8fGZ1bmN0aW9uKG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiJiZoZS5jYWxsKG4pPT0kfHxmYWxzZX0sS2U9c3Qoe2E6XCJ6XCIsZTpcIltdXCIsaTpcImlmKCEoQlt0eXBlb2Ygel0pKXJldHVybiBFXCIsZzpcIkUucHVzaChuKVwifSksV2U9TmU/ZnVuY3Rpb24obil7cmV0dXJuIHh0KG4pP0xlLmVudW1Qcm90b3R5cGVzJiZ0eXBlb2Ygbj09XCJmdW5jdGlvblwifHxMZS5ub25FbnVtQXJncyYmbi5sZW5ndGgmJmR0KG4pP0tlKG4pOk5lKG4pOltdfTpLZSxHZT17YTpcImcsZSxLXCIsaTpcImU9ZSYmdHlwZW9mIEs9PSd1bmRlZmluZWQnP2U6ZChlLEssMylcIixiOlwidHlwZW9mIHU9PSdudW1iZXInXCIsdjpXZSxnOlwiaWYoZSh0W25dLG4sZyk9PT1mYWxzZSlyZXR1cm4gRVwifSxKZT17YTpcInosSCxsXCIsaTpcInZhciBhPWFyZ3VtZW50cyxiPTAsYz10eXBlb2YgbD09J251bWJlcic/MjphLmxlbmd0aDt3aGlsZSgrK2I8Yyl7dD1hW2JdO2lmKHQmJkJbdHlwZW9mIHRdKXtcIix2OldlLGc6XCJpZih0eXBlb2YgRVtuXT09J3VuZGVmaW5lZCcpRVtuXT10W25dXCIsYzpcIn19XCJ9LE1lPXtpOlwiaWYoIUJbdHlwZW9mIHRdKXJldHVybiBFO1wiK0dlLmksYjpmYWxzZX0sVmU9e1wiJlwiOlwiJmFtcDtcIixcIjxcIjpcIiZsdDtcIixcIj5cIjpcIiZndDtcIiwnXCInOlwiJnF1b3Q7XCIsXCInXCI6XCImIzM5O1wifSxIZT13dChWZSksVWU9YWUoXCIoXCIrV2UoSGUpLmpvaW4oXCJ8XCIpK1wiKVwiLFwiZ1wiKSxRZT1hZShcIltcIitXZShWZSkuam9pbihcIlwiKStcIl1cIixcImdcIiksWGU9c3QoR2UpLFllPXN0KEplLHtpOkplLmkucmVwbGFjZShcIjtcIixcIjtpZihjPjMmJnR5cGVvZiBhW2MtMl09PSdmdW5jdGlvbicpe3ZhciBlPWQoYVstLWMtMV0sYVtjLS1dLDIpfWVsc2UgaWYoYz4yJiZ0eXBlb2YgYVtjLTFdPT0nZnVuY3Rpb24nKXtlPWFbLS1jXX1cIiksZzpcIkVbbl09ZT9lKEVbbl0sdFtuXSk6dFtuXVwifSksWmU9c3QoSmUpLG5yPXN0KEdlLE1lLHtqOmZhbHNlfSksdHI9c3QoR2UsTWUpO1xuanQoL3gvKSYmKGp0PWZ1bmN0aW9uKG4pe3JldHVybiB0eXBlb2Ygbj09XCJmdW5jdGlvblwiJiZoZS5jYWxsKG4pPT1LfSk7dmFyIGVyPV9lP2Z1bmN0aW9uKG4pe2lmKCFufHxoZS5jYWxsKG4pIT1HfHwhTGUuYXJnc0NsYXNzJiZkdChuKSlyZXR1cm4gZmFsc2U7dmFyIHQ9bi52YWx1ZU9mLGU9dnQodCkmJihlPV9lKHQpKSYmX2UoZSk7cmV0dXJuIGU/bj09ZXx8X2Uobik9PWU6eXQobil9Onl0LHJyPWN0KGZ1bmN0aW9uKG4sdCxlKXt3ZS5jYWxsKG4sZSk/bltlXSsrOm5bZV09MX0pLHVyPWN0KGZ1bmN0aW9uKG4sdCxlKXsod2UuY2FsbChuLGUpP25bZV06bltlXT1bXSkucHVzaCh0KX0pLG9yPWN0KGZ1bmN0aW9uKG4sdCxlKXtuW2VdPXR9KSxhcj1CdCxpcj12dChpcj10ZS5ub3cpJiZpcnx8ZnVuY3Rpb24oKXtyZXR1cm4obmV3IHRlKS5nZXRUaW1lKCl9LGxyPTg9PVJlKGorXCIwOFwiKT9SZTpmdW5jdGlvbihuLHQpe3JldHVybiBSZShrdChuKT9uLnJlcGxhY2UoRCxcIlwiKTpuLHR8fDApfTtcbnJldHVybiB2LmFmdGVyPWZ1bmN0aW9uKG4sdCl7aWYoIWp0KHQpKXRocm93IG5ldyBsZTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gMT4tLW4/dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6dm9pZCAwfX0sdi5hc3NpZ249WWUsdi5hdD1mdW5jdGlvbihuKXt2YXIgdD1hcmd1bWVudHMsZT0tMSxyPW90KHQsdHJ1ZSxmYWxzZSwxKSx0PXRbMl0mJnRbMl1bdFsxXV09PT1uPzE6ci5sZW5ndGgsdT1adCh0KTtmb3IoTGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pJiYobj1uLnNwbGl0KFwiXCIpKTsrK2U8dDspdVtlXT1uW3JbZV1dO3JldHVybiB1fSx2LmJpbmQ9TXQsdi5iaW5kQWxsPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD0xPGFyZ3VtZW50cy5sZW5ndGg/b3QoYXJndW1lbnRzLHRydWUsZmFsc2UsMSk6X3QobiksZT0tMSxyPXQubGVuZ3RoOysrZTxyOyl7dmFyIHU9dFtlXTtuW3VdPXB0KG5bdV0sMSxudWxsLG51bGwsbil9cmV0dXJuIG59LHYuYmluZEtleT1mdW5jdGlvbihuLHQpe3JldHVybiAyPGFyZ3VtZW50cy5sZW5ndGg/cHQodCwxOSxzKGFyZ3VtZW50cywyKSxudWxsLG4pOnB0KHQsMyxudWxsLG51bGwsbilcbn0sdi5jaGFpbj1mdW5jdGlvbihuKXtyZXR1cm4gbj1uZXcgeShuKSxuLl9fY2hhaW5fXz10cnVlLG59LHYuY29tcGFjdD1mdW5jdGlvbihuKXtmb3IodmFyIHQ9LTEsZT1uP24ubGVuZ3RoOjAscj1bXTsrK3Q8ZTspe3ZhciB1PW5bdF07dSYmci5wdXNoKHUpfXJldHVybiByfSx2LmNvbXBvc2U9ZnVuY3Rpb24oKXtmb3IodmFyIG49YXJndW1lbnRzLHQ9bi5sZW5ndGg7dC0tOylpZighanQoblt0XSkpdGhyb3cgbmV3IGxlO3JldHVybiBmdW5jdGlvbigpe2Zvcih2YXIgdD1hcmd1bWVudHMsZT1uLmxlbmd0aDtlLS07KXQ9W25bZV0uYXBwbHkodGhpcyx0KV07cmV0dXJuIHRbMF19fSx2LmNvbnN0YW50PWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBufX0sdi5jb3VudEJ5PXJyLHYuY3JlYXRlPWZ1bmN0aW9uKG4sdCl7dmFyIGU9bnQobik7cmV0dXJuIHQ/WWUoZSx0KTplfSx2LmNyZWF0ZUNhbGxiYWNrPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj10eXBlb2YgbjtpZihudWxsPT1ufHxcImZ1bmN0aW9uXCI9PXIpcmV0dXJuIHR0KG4sdCxlKTtcbmlmKFwib2JqZWN0XCIhPXIpcmV0dXJuIFh0KG4pO3ZhciB1PVdlKG4pLG89dVswXSxhPW5bb107cmV0dXJuIDEhPXUubGVuZ3RofHxhIT09YXx8eHQoYSk/ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXUubGVuZ3RoLHI9ZmFsc2U7ZS0tJiYocj1hdCh0W3VbZV1dLG5bdVtlXV0sbnVsbCx0cnVlKSk7KTtyZXR1cm4gcn06ZnVuY3Rpb24obil7cmV0dXJuIG49bltvXSxhPT09biYmKDAhPT1hfHwxL2E9PTEvbil9fSx2LmN1cnJ5PWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHQ9dHlwZW9mIHQ9PVwibnVtYmVyXCI/dDordHx8bi5sZW5ndGgscHQobiw0LG51bGwsbnVsbCxudWxsLHQpfSx2LmRlYm91bmNlPVZ0LHYuZGVmYXVsdHM9WmUsdi5kZWZlcj1mdW5jdGlvbihuKXtpZighanQobikpdGhyb3cgbmV3IGxlO3ZhciB0PXMoYXJndW1lbnRzLDEpO3JldHVybiBDZShmdW5jdGlvbigpe24uYXBwbHkoaCx0KX0sMSl9LHYuZGVsYXk9ZnVuY3Rpb24obix0KXtpZighanQobikpdGhyb3cgbmV3IGxlO3ZhciBlPXMoYXJndW1lbnRzLDIpO1xucmV0dXJuIENlKGZ1bmN0aW9uKCl7bi5hcHBseShoLGUpfSx0KX0sdi5kaWZmZXJlbmNlPWZ1bmN0aW9uKG4pe3JldHVybiBydChuLG90KGFyZ3VtZW50cyx0cnVlLHRydWUsMSkpfSx2LmZpbHRlcj1BdCx2LmZsYXR0ZW49ZnVuY3Rpb24obix0LGUscil7cmV0dXJuIHR5cGVvZiB0IT1cImJvb2xlYW5cIiYmbnVsbCE9dCYmKHI9ZSxlPXR5cGVvZiB0IT1cImZ1bmN0aW9uXCImJnImJnJbdF09PT1uP251bGw6dCx0PWZhbHNlKSxudWxsIT1lJiYobj1CdChuLGUscikpLG90KG4sdCl9LHYuZm9yRWFjaD1EdCx2LmZvckVhY2hSaWdodD1OdCx2LmZvckluPW5yLHYuZm9ySW5SaWdodD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9W107bnIobixmdW5jdGlvbihuLHQpe3IucHVzaCh0LG4pfSk7dmFyIHU9ci5sZW5ndGg7Zm9yKHQ9dHQodCxlLDMpO3UtLSYmZmFsc2UhPT10KHJbdS0tXSxyW3VdLG4pOyk7cmV0dXJuIG59LHYuZm9yT3duPXRyLHYuZm9yT3duUmlnaHQ9YnQsdi5mdW5jdGlvbnM9X3Qsdi5ncm91cEJ5PXVyLHYuaW5kZXhCeT1vcix2LmluaXRpYWw9ZnVuY3Rpb24obix0LGUpe3ZhciByPTAsdT1uP24ubGVuZ3RoOjA7XG5pZih0eXBlb2YgdCE9XCJudW1iZXJcIiYmbnVsbCE9dCl7dmFyIG89dTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTtvLS0mJnQobltvXSxvLG4pOylyKyt9ZWxzZSByPW51bGw9PXR8fGU/MTp0fHxyO3JldHVybiBzKG4sMCxQZShCZSgwLHUtciksdSkpfSx2LmludGVyc2VjdGlvbj1mdW5jdGlvbigpe2Zvcih2YXIgZT1bXSxyPS0xLHU9YXJndW1lbnRzLmxlbmd0aCxhPWkoKSxsPWh0KCksZj1sPT09bixzPWkoKTsrK3I8dTspe3ZhciBnPWFyZ3VtZW50c1tyXTsocWUoZyl8fGR0KGcpKSYmKGUucHVzaChnKSxhLnB1c2goZiYmZy5sZW5ndGg+PV8mJm8ocj9lW3JdOnMpKSl9dmFyIGY9ZVswXSxoPS0xLHY9Zj9mLmxlbmd0aDowLHk9W107bjpmb3IoOysraDx2Oyl7dmFyIG09YVswXSxnPWZbaF07aWYoMD4obT90KG0sZyk6bChzLGcpKSl7Zm9yKHI9dSwobXx8cykucHVzaChnKTstLXI7KWlmKG09YVtyXSwwPihtP3QobSxnKTpsKGVbcl0sZykpKWNvbnRpbnVlIG47eS5wdXNoKGcpXG59fWZvcig7dS0tOykobT1hW3VdKSYmcChtKTtyZXR1cm4gYyhhKSxjKHMpLHl9LHYuaW52ZXJ0PXd0LHYuaW52b2tlPWZ1bmN0aW9uKG4sdCl7dmFyIGU9cyhhcmd1bWVudHMsMikscj0tMSx1PXR5cGVvZiB0PT1cImZ1bmN0aW9uXCIsbz1uP24ubGVuZ3RoOjAsYT1adCh0eXBlb2Ygbz09XCJudW1iZXJcIj9vOjApO3JldHVybiBEdChuLGZ1bmN0aW9uKG4pe2FbKytyXT0odT90Om5bdF0pLmFwcGx5KG4sZSl9KSxhfSx2LmtleXM9V2Usdi5tYXA9QnQsdi5tYXBWYWx1ZXM9ZnVuY3Rpb24obix0LGUpe3ZhciByPXt9O3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHRyKG4sZnVuY3Rpb24obixlLHUpe3JbZV09dChuLGUsdSl9KSxyfSx2Lm1heD1QdCx2Lm1lbW9pemU9ZnVuY3Rpb24obix0KXtpZighanQobikpdGhyb3cgbmV3IGxlO3ZhciBlPWZ1bmN0aW9uKCl7dmFyIHI9ZS5jYWNoZSx1PXQ/dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6Yithcmd1bWVudHNbMF07cmV0dXJuIHdlLmNhbGwocix1KT9yW3VdOnJbdV09bi5hcHBseSh0aGlzLGFyZ3VtZW50cylcbn07cmV0dXJuIGUuY2FjaGU9e30sZX0sdi5tZXJnZT1mdW5jdGlvbihuKXt2YXIgdD1hcmd1bWVudHMsZT0yO2lmKCF4dChuKSlyZXR1cm4gbjtpZihcIm51bWJlclwiIT10eXBlb2YgdFsyXSYmKGU9dC5sZW5ndGgpLDM8ZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgdFtlLTJdKXZhciByPXR0KHRbLS1lLTFdLHRbZS0tXSwyKTtlbHNlIDI8ZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgdFtlLTFdJiYocj10Wy0tZV0pO2Zvcih2YXIgdD1zKGFyZ3VtZW50cywxLGUpLHU9LTEsbz1pKCksYT1pKCk7Kyt1PGU7KWl0KG4sdFt1XSxyLG8sYSk7cmV0dXJuIGMobyksYyhhKSxufSx2Lm1pbj1mdW5jdGlvbihuLHQsZSl7dmFyIHU9MS8wLG89dTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiJiZlJiZlW3RdPT09biYmKHQ9bnVsbCksbnVsbD09dCYmcWUobikpe2U9LTE7Zm9yKHZhciBhPW4ubGVuZ3RoOysrZTxhOyl7dmFyIGk9bltlXTtpPG8mJihvPWkpfX1lbHNlIHQ9bnVsbD09dCYma3Qobik/cjp2LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxYZShuLGZ1bmN0aW9uKG4sZSxyKXtlPXQobixlLHIpLGU8dSYmKHU9ZSxvPW4pXG59KTtyZXR1cm4gb30sdi5vbWl0PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj17fTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiKXt2YXIgdT1bXTtucihuLGZ1bmN0aW9uKG4sdCl7dS5wdXNoKHQpfSk7Zm9yKHZhciB1PXJ0KHUsb3QoYXJndW1lbnRzLHRydWUsZmFsc2UsMSkpLG89LTEsYT11Lmxlbmd0aDsrK288YTspe3ZhciBpPXVbb107cltpXT1uW2ldfX1lbHNlIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksbnIobixmdW5jdGlvbihuLGUsdSl7dChuLGUsdSl8fChyW2VdPW4pfSk7cmV0dXJuIHJ9LHYub25jZT1mdW5jdGlvbihuKXt2YXIgdCxlO2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQ/ZToodD10cnVlLGU9bi5hcHBseSh0aGlzLGFyZ3VtZW50cyksbj1udWxsLGUpfX0sdi5wYWlycz1mdW5jdGlvbihuKXtmb3IodmFyIHQ9LTEsZT1XZShuKSxyPWUubGVuZ3RoLHU9WnQocik7Kyt0PHI7KXt2YXIgbz1lW3RdO3VbdF09W28sbltvXV19cmV0dXJuIHVcbn0sdi5wYXJ0aWFsPWZ1bmN0aW9uKG4pe3JldHVybiBwdChuLDE2LHMoYXJndW1lbnRzLDEpKX0sdi5wYXJ0aWFsUmlnaHQ9ZnVuY3Rpb24obil7cmV0dXJuIHB0KG4sMzIsbnVsbCxzKGFyZ3VtZW50cywxKSl9LHYucGljaz1mdW5jdGlvbihuLHQsZSl7dmFyIHI9e307aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIilmb3IodmFyIHU9LTEsbz1vdChhcmd1bWVudHMsdHJ1ZSxmYWxzZSwxKSxhPXh0KG4pP28ubGVuZ3RoOjA7Kyt1PGE7KXt2YXIgaT1vW3VdO2kgaW4gbiYmKHJbaV09bltpXSl9ZWxzZSB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLG5yKG4sZnVuY3Rpb24obixlLHUpe3QobixlLHUpJiYocltlXT1uKX0pO3JldHVybiByfSx2LnBsdWNrPWFyLHYucHJvcGVydHk9WHQsdi5wdWxsPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD1hcmd1bWVudHMsZT0wLHI9dC5sZW5ndGgsdT1uP24ubGVuZ3RoOjA7KytlPHI7KWZvcih2YXIgbz0tMSxhPXRbZV07KytvPHU7KW5bb109PT1hJiYoa2UuY2FsbChuLG8tLSwxKSx1LS0pO1xucmV0dXJuIG59LHYucmFuZ2U9ZnVuY3Rpb24obix0LGUpe249K258fDAsZT10eXBlb2YgZT09XCJudW1iZXJcIj9lOitlfHwxLG51bGw9PXQmJih0PW4sbj0wKTt2YXIgcj0tMTt0PUJlKDAseWUoKHQtbikvKGV8fDEpKSk7Zm9yKHZhciB1PVp0KHQpOysrcjx0Oyl1W3JdPW4sbis9ZTtyZXR1cm4gdX0sdi5yZWplY3Q9ZnVuY3Rpb24obix0LGUpe3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLEF0KG4sZnVuY3Rpb24obixlLHIpe3JldHVybiF0KG4sZSxyKX0pfSx2LnJlbW92ZT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9LTEsdT1uP24ubGVuZ3RoOjAsbz1bXTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK3I8dTspZT1uW3JdLHQoZSxyLG4pJiYoby5wdXNoKGUpLGtlLmNhbGwobixyLS0sMSksdS0tKTtyZXR1cm4gb30sdi5yZXN0PXF0LHYuc2h1ZmZsZT1UdCx2LnNvcnRCeT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9LTEsbz1xZSh0KSxhPW4/bi5sZW5ndGg6MCxmPVp0KHR5cGVvZiBhPT1cIm51bWJlclwiP2E6MCk7XG5mb3Iob3x8KHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykpLER0KG4sZnVuY3Rpb24obixlLHUpe3ZhciBhPWZbKytyXT1sKCk7bz9hLm09QnQodCxmdW5jdGlvbih0KXtyZXR1cm4gblt0XX0pOihhLm09aSgpKVswXT10KG4sZSx1KSxhLm49cixhLm89bn0pLGE9Zi5sZW5ndGgsZi5zb3J0KHUpO2EtLTspbj1mW2FdLGZbYV09bi5vLG98fGMobi5tKSxwKG4pO3JldHVybiBmfSx2LnRhcD1mdW5jdGlvbihuLHQpe3JldHVybiB0KG4pLG59LHYudGhyb3R0bGU9ZnVuY3Rpb24obix0LGUpe3ZhciByPXRydWUsdT10cnVlO2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7cmV0dXJuIGZhbHNlPT09ZT9yPWZhbHNlOnh0KGUpJiYocj1cImxlYWRpbmdcImluIGU/ZS5sZWFkaW5nOnIsdT1cInRyYWlsaW5nXCJpbiBlP2UudHJhaWxpbmc6dSksSC5sZWFkaW5nPXIsSC5tYXhXYWl0PXQsSC50cmFpbGluZz11LFZ0KG4sdCxIKX0sdi50aW1lcz1mdW5jdGlvbihuLHQsZSl7bj0tMTwobj0rbik/bjowO3ZhciByPS0xLHU9WnQobik7XG5mb3IodD10dCh0LGUsMSk7KytyPG47KXVbcl09dChyKTtyZXR1cm4gdX0sdi50b0FycmF5PWZ1bmN0aW9uKG4pe3JldHVybiBuJiZ0eXBlb2Ygbi5sZW5ndGg9PVwibnVtYmVyXCI/TGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pP24uc3BsaXQoXCJcIik6cyhuKTpFdChuKX0sdi50cmFuc2Zvcm09ZnVuY3Rpb24obix0LGUscil7dmFyIHU9cWUobik7aWYobnVsbD09ZSlpZih1KWU9W107ZWxzZXt2YXIgbz1uJiZuLmNvbnN0cnVjdG9yO2U9bnQobyYmby5wcm90b3R5cGUpfXJldHVybiB0JiYodD12LmNyZWF0ZUNhbGxiYWNrKHQsciw0KSwodT9YZTp0cikobixmdW5jdGlvbihuLHIsdSl7cmV0dXJuIHQoZSxuLHIsdSl9KSksZX0sdi51bmlvbj1mdW5jdGlvbigpe3JldHVybiBmdChvdChhcmd1bWVudHMsdHJ1ZSx0cnVlKSl9LHYudW5pcT1XdCx2LnZhbHVlcz1FdCx2LndoZXJlPUF0LHYud2l0aG91dD1mdW5jdGlvbihuKXtyZXR1cm4gcnQobixzKGFyZ3VtZW50cywxKSl9LHYud3JhcD1mdW5jdGlvbihuLHQpe3JldHVybiBwdCh0LDE2LFtuXSlcbn0sdi54b3I9ZnVuY3Rpb24oKXtmb3IodmFyIG49LTEsdD1hcmd1bWVudHMubGVuZ3RoOysrbjx0Oyl7dmFyIGU9YXJndW1lbnRzW25dO2lmKHFlKGUpfHxkdChlKSl2YXIgcj1yP2Z0KHJ0KHIsZSkuY29uY2F0KHJ0KGUscikpKTplfXJldHVybiByfHxbXX0sdi56aXA9R3Qsdi56aXBPYmplY3Q9SnQsdi5jb2xsZWN0PUJ0LHYuZHJvcD1xdCx2LmVhY2g9RHQsdi5lYWNoUmlnaHQ9TnQsdi5leHRlbmQ9WWUsdi5tZXRob2RzPV90LHYub2JqZWN0PUp0LHYuc2VsZWN0PUF0LHYudGFpbD1xdCx2LnVuaXF1ZT1XdCx2LnVuemlwPUd0LFV0KHYpLHYuY2xvbmU9ZnVuY3Rpb24obix0LGUscil7cmV0dXJuIHR5cGVvZiB0IT1cImJvb2xlYW5cIiYmbnVsbCE9dCYmKHI9ZSxlPXQsdD1mYWxzZSksWShuLHQsdHlwZW9mIGU9PVwiZnVuY3Rpb25cIiYmdHQoZSxyLDEpKX0sdi5jbG9uZURlZXA9ZnVuY3Rpb24obix0LGUpe3JldHVybiBZKG4sdHJ1ZSx0eXBlb2YgdD09XCJmdW5jdGlvblwiJiZ0dCh0LGUsMSkpfSx2LmNvbnRhaW5zPU90LHYuZXNjYXBlPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsPT1uP1wiXCI6aWUobikucmVwbGFjZShRZSxndClcbn0sdi5ldmVyeT1TdCx2LmZpbmQ9SXQsdi5maW5kSW5kZXg9ZnVuY3Rpb24obix0LGUpe3ZhciByPS0xLHU9bj9uLmxlbmd0aDowO2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpOysrcjx1OylpZih0KG5bcl0scixuKSlyZXR1cm4gcjtyZXR1cm4tMX0sdi5maW5kS2V5PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcjtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSx0cihuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gdChuLGUsdSk/KHI9ZSxmYWxzZSk6dm9pZCAwfSkscn0sdi5maW5kTGFzdD1mdW5jdGlvbihuLHQsZSl7dmFyIHI7cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksTnQobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQobixlLHUpPyhyPW4sZmFsc2UpOnZvaWQgMH0pLHJ9LHYuZmluZExhc3RJbmRleD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9bj9uLmxlbmd0aDowO2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpO3ItLTspaWYodChuW3JdLHIsbikpcmV0dXJuIHI7XG5yZXR1cm4tMX0sdi5maW5kTGFzdEtleT1mdW5jdGlvbihuLHQsZSl7dmFyIHI7cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksYnQobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQobixlLHUpPyhyPWUsZmFsc2UpOnZvaWQgMH0pLHJ9LHYuaGFzPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/d2UuY2FsbChuLHQpOmZhbHNlfSx2LmlkZW50aXR5PUh0LHYuaW5kZXhPZj16dCx2LmlzQXJndW1lbnRzPWR0LHYuaXNBcnJheT1xZSx2LmlzQm9vbGVhbj1mdW5jdGlvbihuKXtyZXR1cm4gdHJ1ZT09PW58fGZhbHNlPT09bnx8biYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PUx8fGZhbHNlfSx2LmlzRGF0ZT1mdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJmhlLmNhbGwobik9PXp8fGZhbHNlfSx2LmlzRWxlbWVudD1mdW5jdGlvbihuKXtyZXR1cm4gbiYmMT09PW4ubm9kZVR5cGV8fGZhbHNlfSx2LmlzRW1wdHk9ZnVuY3Rpb24obil7dmFyIHQ9dHJ1ZTtpZighbilyZXR1cm4gdDt2YXIgZT1oZS5jYWxsKG4pLHI9bi5sZW5ndGg7XG5yZXR1cm4gZT09JHx8ZT09TXx8KExlLmFyZ3NDbGFzcz9lPT1UOmR0KG4pKXx8ZT09RyYmdHlwZW9mIHI9PVwibnVtYmVyXCImJmp0KG4uc3BsaWNlKT8hcjoodHIobixmdW5jdGlvbigpe3JldHVybiB0PWZhbHNlfSksdCl9LHYuaXNFcXVhbD1mdW5jdGlvbihuLHQsZSxyKXtyZXR1cm4gYXQobix0LHR5cGVvZiBlPT1cImZ1bmN0aW9uXCImJnR0KGUsciwyKSl9LHYuaXNGaW5pdGU9ZnVuY3Rpb24obil7cmV0dXJuIEllKG4pJiYhRGUocGFyc2VGbG9hdChuKSl9LHYuaXNGdW5jdGlvbj1qdCx2LmlzTmFOPWZ1bmN0aW9uKG4pe3JldHVybiBDdChuKSYmbiE9K259LHYuaXNOdWxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsPT09bn0sdi5pc051bWJlcj1DdCx2LmlzT2JqZWN0PXh0LHYuaXNQbGFpbk9iamVjdD1lcix2LmlzUmVnRXhwPWZ1bmN0aW9uKG4pe3JldHVybiBuJiZYW3R5cGVvZiBuXSYmaGUuY2FsbChuKT09Snx8ZmFsc2V9LHYuaXNTdHJpbmc9a3Qsdi5pc1VuZGVmaW5lZD1mdW5jdGlvbihuKXtyZXR1cm4gdHlwZW9mIG49PVwidW5kZWZpbmVkXCJcbn0sdi5sYXN0SW5kZXhPZj1mdW5jdGlvbihuLHQsZSl7dmFyIHI9bj9uLmxlbmd0aDowO2Zvcih0eXBlb2YgZT09XCJudW1iZXJcIiYmKHI9KDA+ZT9CZSgwLHIrZSk6UGUoZSxyLTEpKSsxKTtyLS07KWlmKG5bcl09PT10KXJldHVybiByO3JldHVybi0xfSx2Lm1peGluPVV0LHYubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBlLl89Z2UsdGhpc30sdi5ub29wPVF0LHYubm93PWlyLHYucGFyc2VJbnQ9bHIsdi5yYW5kb209ZnVuY3Rpb24obix0LGUpe3ZhciByPW51bGw9PW4sdT1udWxsPT10O3JldHVybiBudWxsPT1lJiYodHlwZW9mIG49PVwiYm9vbGVhblwiJiZ1PyhlPW4sbj0xKTp1fHx0eXBlb2YgdCE9XCJib29sZWFuXCJ8fChlPXQsdT10cnVlKSksciYmdSYmKHQ9MSksbj0rbnx8MCx1Pyh0PW4sbj0wKTp0PSt0fHwwLGV8fG4lMXx8dCUxPyhlPUZlKCksUGUobitlKih0LW4rcGFyc2VGbG9hdChcIjFlLVwiKygoZStcIlwiKS5sZW5ndGgtMSkpKSx0KSk6bHQobix0KX0sdi5yZWR1Y2U9UnQsdi5yZWR1Y2VSaWdodD1GdCx2LnJlc3VsdD1mdW5jdGlvbihuLHQpe2lmKG4pe3ZhciBlPW5bdF07XG5yZXR1cm4ganQoZSk/blt0XSgpOmV9fSx2LnJ1bkluQ29udGV4dD1nLHYuc2l6ZT1mdW5jdGlvbihuKXt2YXIgdD1uP24ubGVuZ3RoOjA7cmV0dXJuIHR5cGVvZiB0PT1cIm51bWJlclwiP3Q6V2UobikubGVuZ3RofSx2LnNvbWU9JHQsdi5zb3J0ZWRJbmRleD1LdCx2LnRlbXBsYXRlPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj12LnRlbXBsYXRlU2V0dGluZ3M7bj1pZShufHxcIlwiKSxlPVplKHt9LGUscik7dmFyIHUsbz1aZSh7fSxlLmltcG9ydHMsci5pbXBvcnRzKSxyPVdlKG8pLG89RXQobyksaT0wLGw9ZS5pbnRlcnBvbGF0ZXx8TixmPVwiX19wKz0nXCIsbD1hZSgoZS5lc2NhcGV8fE4pLnNvdXJjZStcInxcIitsLnNvdXJjZStcInxcIisobD09PUk/TzpOKS5zb3VyY2UrXCJ8XCIrKGUuZXZhbHVhdGV8fE4pLnNvdXJjZStcInwkXCIsXCJnXCIpO24ucmVwbGFjZShsLGZ1bmN0aW9uKHQsZSxyLG8sbCxjKXtyZXR1cm4gcnx8KHI9byksZis9bi5zbGljZShpLGMpLnJlcGxhY2UoUCxhKSxlJiYoZis9XCInK19fZShcIitlK1wiKSsnXCIpLGwmJih1PXRydWUsZis9XCInO1wiK2wrXCI7XFxuX19wKz0nXCIpLHImJihmKz1cIicrKChfX3Q9KFwiK3IrXCIpKT09bnVsbD8nJzpfX3QpKydcIiksaT1jK3QubGVuZ3RoLHRcbn0pLGYrPVwiJztcIixsPWU9ZS52YXJpYWJsZSxsfHwoZT1cIm9ialwiLGY9XCJ3aXRoKFwiK2UrXCIpe1wiK2YrXCJ9XCIpLGY9KHU/Zi5yZXBsYWNlKHgsXCJcIik6ZikucmVwbGFjZShDLFwiJDFcIikucmVwbGFjZShFLFwiJDE7XCIpLGY9XCJmdW5jdGlvbihcIitlK1wiKXtcIisobD9cIlwiOmUrXCJ8fChcIitlK1wiPXt9KTtcIikrXCJ2YXIgX190LF9fcD0nJyxfX2U9Xy5lc2NhcGVcIisodT9cIixfX2o9QXJyYXkucHJvdG90eXBlLmpvaW47ZnVuY3Rpb24gcHJpbnQoKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyl9XCI6XCI7XCIpK2YrXCJyZXR1cm4gX19wfVwiO3RyeXt2YXIgYz1lZShyLFwicmV0dXJuIFwiK2YpLmFwcGx5KGgsbyl9Y2F0Y2gocCl7dGhyb3cgcC5zb3VyY2U9ZixwfXJldHVybiB0P2ModCk6KGMuc291cmNlPWYsYyl9LHYudW5lc2NhcGU9ZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PW4/XCJcIjppZShuKS5yZXBsYWNlKFVlLG10KX0sdi51bmlxdWVJZD1mdW5jdGlvbihuKXt2YXIgdD0rK207cmV0dXJuIGllKG51bGw9PW4/XCJcIjpuKSt0XG59LHYuYWxsPVN0LHYuYW55PSR0LHYuZGV0ZWN0PUl0LHYuZmluZFdoZXJlPUl0LHYuZm9sZGw9UnQsdi5mb2xkcj1GdCx2LmluY2x1ZGU9T3Qsdi5pbmplY3Q9UnQsVXQoZnVuY3Rpb24oKXt2YXIgbj17fTtyZXR1cm4gdHIodixmdW5jdGlvbih0LGUpe3YucHJvdG90eXBlW2VdfHwobltlXT10KX0pLG59KCksZmFsc2UpLHYuZmlyc3Q9THQsdi5sYXN0PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0wLHU9bj9uLmxlbmd0aDowO2lmKHR5cGVvZiB0IT1cIm51bWJlclwiJiZudWxsIT10KXt2YXIgbz11O2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpO28tLSYmdChuW29dLG8sbik7KXIrK31lbHNlIGlmKHI9dCxudWxsPT1yfHxlKXJldHVybiBuP25bdS0xXTpoO3JldHVybiBzKG4sQmUoMCx1LXIpKX0sdi5zYW1wbGU9ZnVuY3Rpb24obix0LGUpe3JldHVybiBuJiZ0eXBlb2Ygbi5sZW5ndGghPVwibnVtYmVyXCI/bj1FdChuKTpMZS51bmluZGV4ZWRDaGFycyYma3QobikmJihuPW4uc3BsaXQoXCJcIikpLG51bGw9PXR8fGU/bj9uW2x0KDAsbi5sZW5ndGgtMSldOmg6KG49VHQobiksbi5sZW5ndGg9UGUoQmUoMCx0KSxuLmxlbmd0aCksbilcbn0sdi50YWtlPUx0LHYuaGVhZD1MdCx0cih2LGZ1bmN0aW9uKG4sdCl7dmFyIGU9XCJzYW1wbGVcIiE9PXQ7di5wcm90b3R5cGVbdF18fCh2LnByb3RvdHlwZVt0XT1mdW5jdGlvbih0LHIpe3ZhciB1PXRoaXMuX19jaGFpbl9fLG89bih0aGlzLl9fd3JhcHBlZF9fLHQscik7cmV0dXJuIHV8fG51bGwhPXQmJighcnx8ZSYmdHlwZW9mIHQ9PVwiZnVuY3Rpb25cIik/bmV3IHkobyx1KTpvfSl9KSx2LlZFUlNJT049XCIyLjQuMVwiLHYucHJvdG90eXBlLmNoYWluPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX19jaGFpbl9fPXRydWUsdGhpc30sdi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gaWUodGhpcy5fX3dyYXBwZWRfXyl9LHYucHJvdG90eXBlLnZhbHVlPVl0LHYucHJvdG90eXBlLnZhbHVlT2Y9WXQsWGUoW1wiam9pblwiLFwicG9wXCIsXCJzaGlmdFwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXTt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3ZhciBuPXRoaXMuX19jaGFpbl9fLGU9dC5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLGFyZ3VtZW50cyk7XG5yZXR1cm4gbj9uZXcgeShlLG4pOmV9fSksWGUoW1wicHVzaFwiLFwicmV2ZXJzZVwiLFwic29ydFwiLFwidW5zaGlmdFwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXTt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3JldHVybiB0LmFwcGx5KHRoaXMuX193cmFwcGVkX18sYXJndW1lbnRzKSx0aGlzfX0pLFhlKFtcImNvbmNhdFwiLFwic2xpY2VcIixcInNwbGljZVwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXTt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3JldHVybiBuZXcgeSh0LmFwcGx5KHRoaXMuX193cmFwcGVkX18sYXJndW1lbnRzKSx0aGlzLl9fY2hhaW5fXyl9fSksTGUuc3BsaWNlT2JqZWN0c3x8WGUoW1wicG9wXCIsXCJzaGlmdFwiLFwic3BsaWNlXCJdLGZ1bmN0aW9uKG4pe3ZhciB0PWZlW25dLGU9XCJzcGxpY2VcIj09bjt2LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3ZhciBuPXRoaXMuX19jaGFpbl9fLHI9dGhpcy5fX3dyYXBwZWRfXyx1PXQuYXBwbHkocixhcmd1bWVudHMpO3JldHVybiAwPT09ci5sZW5ndGgmJmRlbGV0ZSByWzBdLG58fGU/bmV3IHkodSxuKTp1XG59fSksdn12YXIgaCx2PVtdLHk9W10sbT0wLGQ9e30sYj0rbmV3IERhdGUrXCJcIixfPTc1LHc9NDAsaj1cIiBcXHRcXHgwQlxcZlxceGEwXFx1ZmVmZlxcblxcclxcdTIwMjhcXHUyMDI5XFx1MTY4MFxcdTE4MGVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwYVxcdTIwMmZcXHUyMDVmXFx1MzAwMFwiLHg9L1xcYl9fcFxcKz0nJzsvZyxDPS9cXGIoX19wXFwrPSknJ1xcKy9nLEU9LyhfX2VcXCguKj9cXCl8XFxiX190XFwpKVxcKycnOy9nLE89L1xcJFxceyhbXlxcXFx9XSooPzpcXFxcLlteXFxcXH1dKikqKVxcfS9nLFM9L1xcdyokLyxBPS9eXFxzKmZ1bmN0aW9uWyBcXG5cXHJcXHRdK1xcdy8sST0vPCU9KFtcXHNcXFNdKz8pJT4vZyxEPVJlZ0V4cChcIl5bXCIraitcIl0qMCsoPz0uJClcIiksTj0vKCReKS8sQj0vXFxidGhpc1xcYi8sUD0vWydcXG5cXHJcXHRcXHUyMDI4XFx1MjAyOVxcXFxdL2csUj1cIkFycmF5IEJvb2xlYW4gRGF0ZSBFcnJvciBGdW5jdGlvbiBNYXRoIE51bWJlciBPYmplY3QgUmVnRXhwIFN0cmluZyBfIGF0dGFjaEV2ZW50IGNsZWFyVGltZW91dCBpc0Zpbml0ZSBpc05hTiBwYXJzZUludCBzZXRUaW1lb3V0XCIuc3BsaXQoXCIgXCIpLEY9XCJjb25zdHJ1Y3RvciBoYXNPd25Qcm9wZXJ0eSBpc1Byb3RvdHlwZU9mIHByb3BlcnR5SXNFbnVtZXJhYmxlIHRvTG9jYWxlU3RyaW5nIHRvU3RyaW5nIHZhbHVlT2ZcIi5zcGxpdChcIiBcIiksVD1cIltvYmplY3QgQXJndW1lbnRzXVwiLCQ9XCJbb2JqZWN0IEFycmF5XVwiLEw9XCJbb2JqZWN0IEJvb2xlYW5dXCIsej1cIltvYmplY3QgRGF0ZV1cIixxPVwiW29iamVjdCBFcnJvcl1cIixLPVwiW29iamVjdCBGdW5jdGlvbl1cIixXPVwiW29iamVjdCBOdW1iZXJdXCIsRz1cIltvYmplY3QgT2JqZWN0XVwiLEo9XCJbb2JqZWN0IFJlZ0V4cF1cIixNPVwiW29iamVjdCBTdHJpbmddXCIsVj17fTtcblZbS109ZmFsc2UsVltUXT1WWyRdPVZbTF09Vlt6XT1WW1ddPVZbR109VltKXT1WW01dPXRydWU7dmFyIEg9e2xlYWRpbmc6ZmFsc2UsbWF4V2FpdDowLHRyYWlsaW5nOmZhbHNlfSxVPXtjb25maWd1cmFibGU6ZmFsc2UsZW51bWVyYWJsZTpmYWxzZSx2YWx1ZTpudWxsLHdyaXRhYmxlOmZhbHNlfSxRPXthOlwiXCIsYjpudWxsLGM6XCJcIixkOlwiXCIsZTpcIlwiLHY6bnVsbCxnOlwiXCIsaDpudWxsLHN1cHBvcnQ6bnVsbCxpOlwiXCIsajpmYWxzZX0sWD17XCJib29sZWFuXCI6ZmFsc2UsXCJmdW5jdGlvblwiOnRydWUsb2JqZWN0OnRydWUsbnVtYmVyOmZhbHNlLHN0cmluZzpmYWxzZSx1bmRlZmluZWQ6ZmFsc2V9LFk9e1wiXFxcXFwiOlwiXFxcXFwiLFwiJ1wiOlwiJ1wiLFwiXFxuXCI6XCJuXCIsXCJcXHJcIjpcInJcIixcIlxcdFwiOlwidFwiLFwiXFx1MjAyOFwiOlwidTIwMjhcIixcIlxcdTIwMjlcIjpcInUyMDI5XCJ9LFo9WFt0eXBlb2Ygd2luZG93XSYmd2luZG93fHx0aGlzLG50PVhbdHlwZW9mIGV4cG9ydHNdJiZleHBvcnRzJiYhZXhwb3J0cy5ub2RlVHlwZSYmZXhwb3J0cyx0dD1YW3R5cGVvZiBtb2R1bGVdJiZtb2R1bGUmJiFtb2R1bGUubm9kZVR5cGUmJm1vZHVsZSxldD10dCYmdHQuZXhwb3J0cz09PW50JiZudCxydD1YW3R5cGVvZiBnbG9iYWxdJiZnbG9iYWw7XG4hcnR8fHJ0Lmdsb2JhbCE9PXJ0JiZydC53aW5kb3chPT1ydHx8KFo9cnQpO3ZhciB1dD1nKCk7dHlwZW9mIGRlZmluZT09XCJmdW5jdGlvblwiJiZ0eXBlb2YgZGVmaW5lLmFtZD09XCJvYmplY3RcIiYmZGVmaW5lLmFtZD8oWi5fPXV0LCBkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gdXR9KSk6bnQmJnR0P2V0Pyh0dC5leHBvcnRzPXV0KS5fPXV0Om50Ll89dXQ6Wi5fPXV0fSkuY2FsbCh0aGlzKTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIHNlYXJjaCAgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLFxuICAgIGRlY29kZSA9IGRlY29kZVVSSUNvbXBvbmVudDtcbnZhciBTPSB7fTsgXG4gICAgZnVuY3Rpb24gcGFyc2UoaXNfbm93KXtcbiAgICAgICAgdmFyIF9zICwgcGFyYW1zID0ge30gO1xuICAgICAgICBpZiAoIWlzX25vdykge1xuICAgICAgICAgICAgX3MgPSBzZWFyY2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gICAgICAgIH0gXG4gICAgICAgIF9zID0gIF9zLnJlcGxhY2UoL15cXD8vLFwiXCIpLnNwbGl0KFwiJlwiKTtcbiAgICAgICAgaWYgKF9zLmZvckVhY2gpIHtcbiAgICAgICAgICAgIF9zLmZvckVhY2goZnVuY3Rpb24ocyxpKXtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IHMuc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgIHBhcmFtc1t0WzBdXSA9IGRlY29kZSh0WzFdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBfcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IF9zW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBwYXJhbXNbdFswXV0gPSBkZWNvZGUodFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9XG4gICAgdmFyIHBhcmFtcyA9IHBhcnNlKCk7XG4gICAgdmFyIGlzX2VtcHR5ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGVtID0gdHJ1ZTtcbiAgICAgICAgZm9yKHZhciBpIGluIHBhcmFtcyl7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgZW0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGVtO1xuICAgIH0oKTtcbiAgICBTLnBhcmFtcyA9IHBhcmFtcztcbiAgICBTLmlzX2VtcHR5ID0gaXNfZW1wdHk7XG4gICAgUy5ub3cgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gcGFyc2UodHJ1ZSk7XG4gICAgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IFM7XG4iLCJ2YXIgY29va2llcyA9IHJlcXVpcmUoJy4uL2xpYi9jb29raWVzJyk7XG52YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG52YXIgZGVmX29wdCA9IHtcbiAgICBjYWNoZSA6IGZhbHNlLFxuICAgIGRhdGFUeXBlIDogXCJqc29uXCJcbn07XG5cbnZhciBhamF4ID0gZnVuY3Rpb24ob3B0KXtcbiAgICBvcHQgPSAkLmV4dGVuZChkZWZfb3B0ICwgb3B0ICk7XG4gICAgdmFyIGRhdGEgPSBvcHQuZGF0YSB8fCB7fTtcbiAgICBkYXRhLmNzcmZ0b2tlbiA9IGNvb2tpZXMuZ2V0SXRlbShcImNzcmZ0b2tlblwiKTtcbiAgICBvcHQuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuICQuYWpheChvcHQpO1xufVxuXG52YXIgaHR0cCA9IHtcbiAgICBnZXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBvcHQudHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgIHJldHVybiBhamF4KG9wdCk7XG4gICAgfSxcbiAgICBwb3N0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgb3B0LnR5cGUgPSBcInBvc3RcIjtcbiAgICAgICAgcmV0dXJuIGFqYXgob3B0KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGh0dHA7XG4iLCJ2YXIgRGlhbG9nID0gcmVxdWlyZShcIi4uL2xpYi9pZGlhbG9nXCIpO1xuXG5cbnZhciBwb3AgPSBmdW5jdGlvbihjb250ZW50KXtcbiAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgIGNvbnRlbnQgOiBjb250ZW50XG4gICAgfSk7XG4gICAgZGxnLmhpZGUoKTtcbiAgICByZXR1cm4gZGxnO1xufVxuXG5cbnZhciBhbGVydF9kbGcgLCBjb25maXJtX2RsZyA7XG52YXIgb2JqID0ge1xuXG4gICAgYWxlcnQgOiBmdW5jdGlvbihtc2cpe1xuICAgICAgICBpZiAoIWFsZXJ0X2RsZykge1xuICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIm0tcG9wIG0tcG9wLWFsZXJ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWJkIFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFsZXJ0LWN0IGpzX2NvbnRlbnRcIj4nK21zZysnPC9wPlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1mdFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tY2ZyIGpzX2Nsb3NlXCI+56Gu5a6aPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgIGFsZXJ0X2RsZyA9IHBvcChodG1sKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0X2RsZy5nZXRDb250ZW50KCkudGV4dChtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGFsZXJ0X2RsZy5zaG93KCk7XG4gICAgICAgIHJldHVybiBhbGVydF9kbGc7XG4gICAgfSxcbiAgICBjb25maXJtIDogZnVuY3Rpb24obXNnLHN1YyxlcnIpe1xuICAgICAgICAgIHN1YyA9IHN1YyB8fCBmdW5jdGlvbigpe307XG4gICAgICAgICAgZXJyID0gZXJyIHx8IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICAgIGlmICghY29uZmlybV9kbGcpIHtcbiAgICAgICAgICAgIHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJtLXBvcCBtLXBvcC1hbGVydFwiPlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1iZCBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJhbGVydC1jdCBqc19jb250ZW50XCI+Jyttc2crJzwvcD5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtZnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi13cmFwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWNmclwiPuehruWumjwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1jYW5jZWxcIj7lj5bmtog8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgY29uZmlybV9kbGcgPSBwb3AoaHRtbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maXJtX2RsZy5nZXRDb250ZW50KCkudGV4dChtc2cpO1xuICAgICAgICB9XG4gICAgICAgIHZhciAkZDEgPSBjb25maXJtX2RsZy5nZXREbGdEb20oKS5maW5kKFwiLmJ0bi1jZnJcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbmZpcm1fZGxnLmhpZGUoKTtcbiAgICAgICAgICAgIHN1YyAmJiBzdWMoKTsgXG4gICAgICAgICAgICAkZDEudW5iaW5kKCk7IFxuICAgICAgICAgICAgJGQyLnVuYmluZCgpOyBcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciAkZDIgPSBjb25maXJtX2RsZy5nZXREbGdEb20oKS5maW5kKFwiLmJ0bi1jYW5jZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbmZpcm1fZGxnLmhpZGUoKTtcbiAgICAgICAgICAgICRkMS51bmJpbmQoKTsgXG4gICAgICAgICAgICAkZDIudW5iaW5kKCk7IFxuICAgICAgICAgICAgZXJyICYmIGVycigpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uZmlybV9kbGcuc2hvdygpOyBcbiAgICB9LFxuICAgIGhkX2RsZyA6IGZ1bmN0aW9uKCRkb20sdGl0bGUsY2IsY2xvc2VfZm4pe1xuICAgICAgICB2YXIgJHdyYXAgPSAgJCgnPGRpdiBjbGFzcz1cIm0tcG9wXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWhkXCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiaGQtY2xvc2UganNfY2xvc2VcIj4mdGltZXM7PC9hPjxoND4nK3RpdGxlKyc8L2g0PjwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1iZCBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzX2NvbnRlbnRcIj48L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtZnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi13cmFwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWNmclwiPuehruWumjwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgIDwvZGl2PicpOyAgIFxuICAgICAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgICAgICBjb250ZW50IDogJHdyYXAsXG4gICAgICAgICAgICBjbG9zZV9mbiA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZGxnLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGNsb3NlX2ZuICYmIGNsb3NlX2ZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkd3JhcC5maW5kKFwiLmJ0bi1jZnJcIikuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjYiAmJiBjYihkbGcuZ2V0Q29udGVudCgpLGRsZyk7XG4gICAgICAgIH0pO1xuICAgICAgICBkbGcuZ2V0Q29udGVudCgpLmh0bWwoJGRvbSk7XG4gICAgICAgIGRsZy5oaWRlKCk7XG4gICAgICAgIHJldHVybiBkbGc7XG4gICAgfSxcbiAgICBkbGcgOiBmdW5jdGlvbihjb250ZW50LG1hc2tWaXNpYmxlKXtcbiAgICAgICAgdmFyIGRsZyA9IG5ldyBEaWFsb2coe1xuICAgICAgICAgICAgY29udGVudCA6IGNvbnRlbnQsXG4gICAgICAgICAgICBtYXNrVmlzaWJsZSA6ICEhbWFza1Zpc2libGVcbiAgICAgICAgfSk7XG4gICAgICAgIGRsZy5oaWRlKCk7XG4gICAgICAgIHJldHVybiBkbGc7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iajtcblxuXG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCIuLi9saWIvanF1ZXJ5LmpzXCIpO1xudmFyIHVybF9wYXJhbXMgPSByZXF1aXJlKFwiLi4vbGliL3NlYXJjaF9wYXJhbXMuanNcIikucGFyYW1zO1xudmFyIFNlYXJjaEJveCA9IHJlcXVpcmUoXCIuL29wZXJhdGlvbi9zZWFyY2hfYm94LmpzXCIpO1xudmFyIFN1YmplY3RJdGVtID0gcmVxdWlyZShcIi4vb3BlcmF0aW9uL3N1YmplY3RfaXRlbS5qc1wiKTtcbnZhciBfID0gcmVxdWlyZShcIi4uL2xpYi9sb2Rhc2guY29tcGF0Lm1pbi5qc1wiKTtcbnZhciBodHRwID0gcmVxdWlyZShcIi4uL21vZC9odHRwLmpzXCIpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHN1YmplY3RfaWQgPSB1cmxfcGFyYW1zLnN1YmplY3RfaWQ7XG4gICAgaWYgKCFzdWJqZWN0X2lkKSB7XG4gICAgICAgIGFsZXJ0KFwi5rKh5pyJ5LiT6aKYSUQgXCIpOyBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoXCIjc3ViamVjdC1pdGVtcy1ib3hcIik7XG4gICAgdmFyIHNlYXJjaGJveCA9IG5ldyBTZWFyY2hCb3goe1xuICAgICAgICBsaW1pdCA6IDUsXG4gICAgICAgIGFkZF9mbiA6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgdmFyIGZpcnN0IDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZpcnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0ID0gYWRkU3ViamVjdEl0ZW0oZGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkU3ViamVjdEl0ZW0oZGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcChmaXJzdC5kb20oKS5vZmZzZXQoKS50b3AgLSAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgaW5pdCgpO1xuICAgIHNlYXJjaGJveC5pbml0KCk7XG4gICAgICAgXG4gICAgZnVuY3Rpb24gaW5pdCgpe1xuICAgICAgICBpbml0U3ViamVjdCgpOyBcbiAgICAgICAgaHR0cC5nZXQoe1xuICAgICAgICAgICAgdXJsICA6IFwiL2FwaS9nZXRBbGJ1bUl0ZW1MaXN0Lmh0bVwiLFxuICAgICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgICAgICBwbiA6IDEsXG4gICAgICAgICAgICAgICAgcHMgOiAxMDAwLFxuICAgICAgICAgICAgICAgIGFsYnVtSWQgOiBzdWJqZWN0X2lkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICAgdmFyIGFsYnVtSXRlbUxpc3QgPSBycy5hbGJ1bUl0ZW1MaXN0IHx8IFtdO1xuICAgICAgICAgICAgXy5mb3JFYWNoKGFsYnVtSXRlbUxpc3QgLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAvL+WVhuWTgVxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmFsYnVtVHlwZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHAuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA6ICcvYXBpL2dldFByb2R1Y3QuaHRtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQgOiBkYXRhLmVudGl0eWlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocnMucHJvZHVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hvcCA9IHJzLnByb2R1Y3Quc2hvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ICA9IHJzLnByb2R1Y3QucHJvZHVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3Quc2hvcE5hbWUgPSBzaG9wLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTdWJqZWN0SXRlbShwcm9kdWN0LGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5hbGJ1bVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBodHRwLmdldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgOiAnL2FwaS9nZXRTaG9wLmh0bScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkIDogZGF0YS5lbnRpdHlpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaG9wICA9IHJzLnNob3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTdWJqZWN0SXRlbShzaG9wLGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICBcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5pdFN1YmplY3QoKXtcbiAgICAgICAgJChcIiNzdWJqZWN0LW1kLWJ0blwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgd2luZG93Lm9wZW4oXCIvbS9vcGVyYXRpb24vc3ViamVjdF9lZGl0P3N1YmplY3RfaWQ9XCIrc3ViamVjdF9pZCk7XG4gICAgICAgIH0pXG4gICAgICAgIGh0dHAuZ2V0KHtcbiAgICAgICAgICAgIHVybCA6IFwiL2FwaS9nZXRBbGJ1bS5odG1cIixcbiAgICAgICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgaWQgOiBzdWJqZWN0X2lkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICB2YXIgZGF0YSA9IHJzLmFsYnVtO1xuICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgJChcIiNzdC1uYW1lXCIpLmh0bWwoZGF0YS5uYW1lKTtcbiAgICAgICAgICAgICAgICQoXCIjc3QtbG9nb1wiKS5hdHRyKFwic3JjXCIsZGF0YS5pbWFnZVVybCkucGFyZW50KCkuc2hvdygpO1xuICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGVydChcIuiOt+WPluS4k+mimOWfuuacrOS/oeaBr+Wksei0pVwiKTtcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgYWxlcnQoXCLojrflj5bkuJPpopjln7rmnKzkv6Hmga/lpLHotKVcIik7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU3ViamVjdEl0ZW0oZGF0YSxpdGVtX2RhdGEpe1xuICAgICAgICB2YXIgc3ViamVjdF9pdGVtID0gbmV3IFN1YmplY3RJdGVtKHtkYXRhOiBkYXRhLHN1YmplY3RfaWQgOiBzdWJqZWN0X2lkICxpdGVtX2RhdGE6IGl0ZW1fZGF0YX0pO1xuICAgICAgICBzdWJqZWN0X2l0ZW0uaW5pdCgpO1xuICAgICAgICAkY29udGFpbmVyLmFwcGVuZChzdWJqZWN0X2l0ZW0uZG9tKCkpO1xuICAgICAgICByZXR1cm4gc3ViamVjdF9pdGVtO1xuICAgIH1cblxuXG59KTtcbiIsInJlcXVpcmUoXCIuLi8uLi9saWIvanVpY2VyLmpzXCIpO1xudmFyIF8gPSByZXF1aXJlKFwiLi4vLi4vbGliL2xvZGFzaC5jb21wYXQubWluLmpzXCIpOyBcbnZhciAkID0gcmVxdWlyZShcIi4uLy4uL2xpYi9qcXVlcnkuanNcIik7XG52YXIgaHR0cCA9IHJlcXVpcmUoXCIuLi8uLi9tb2QvaHR0cC5qc1wiKTtcbnZhciBwYWdlciA9IHJlcXVpcmUoXCIuLi8uLi9saWIvaXBhZ2VyLmpzXCIpO1xudmFyIFBSRF9IRF9UUEwgPSByZXF1aXJlKFwiLi90bXBsL3ByZF9saXN0X2hkLmpzXCIpO1xudmFyIFNIT1BfSERfVFBMID0gcmVxdWlyZShcIi4vdG1wbC9zaG9wX2xpc3RfaGQuanNcIik7XG52YXIgUFJEX1REX1RQTCA9IHJlcXVpcmUoXCIuL3RtcGwvcHJkX3RkLmpzXCIpO1xudmFyIFNIT1BfVERfVFBMID0gcmVxdWlyZShcIi4vdG1wbC9zaG9wX3RkLmpzXCIpO1xuXG5qdWljZXIucmVnaXN0ZXIoJ3Nob3Bfc3RhdHVzJywgZnVuY3Rpb24ocyl7XG4gICAgaWYgKHMgPT0gMikge1xuICAgICAgICByZXR1cm4gXCLlrqHmoLjpgJrov4dcIjtcbiAgICB9IFxuICAgIHJldHVybiBcIuWuoeaguOacqumAmui/h1wiO1xufSk7IFxuXG5qdWljZXIucmVnaXN0ZXIoJ3ByZF9zdGF0dXMnLCBmdW5jdGlvbihzKXtcbiAgICBpZiAocyA9PSBcIjJcIikge1xuICAgICAgICByZXR1cm4gXCLkuIrmnrZcIjsgXG4gICAgfSBlbHNlIGlmIChzID09IFwiMVwiKSB7XG4gICAgICAgIHJldHVybiBcIuS4i+aetlwiO1xuICAgIH0gZWxzZSBpZiAocyA9PVwiM1wiKSB7XG4gICAgICAgIHJldHVybiAgXCLliKDpmaRcIjsgICAgICAgIFxuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbn0pOyBcblxudmFyIExpbWl0ID0gMTA7XG5cbnZhciBTZWFyY2hCb3ggPSBmdW5jdGlvbihvcHQpe1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICB2YXIgJGQgPSB0aGlzLl9kb20gPSBvcHQuZG9tIHx8ICQoXCIjcGQtc2VhcmNoLWJveFwiKTtcbiAgICB0aGlzLl8kc2VhcmNoX2JveCA9ICRkLmZpbmQoXCIubS1wcmQtc2VhcmNoXCIpO1xuICAgIHRoaXMuXyRsaXN0X2JveCA9ICRkLmZpbmQoXCIubS1yZXN1bHQtbGlzdFwiKTtcbiAgICB0aGlzLl8kcGFnZV9ib3ggPSAkZC5maW5kKFwiLm0tcGFnZS1ib3hcIik7XG4gICAgdGhpcy5fcGFnZV9saW1pdCA9IG9wdC5saW1pdCB8fCBMaW1pdDtcbiAgICB0aGlzLl9vcHQgPSBvcHQ7XG4gICAgdGhpcy5fb3B0LmFkZF9mbiA9IG9wdC5hZGRfZm4gfHwgJC5ub29wO1xufVxuXG5TZWFyY2hCb3gucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuX2luaXRTZWFyY2goKTtcbiAgICB0aGlzLl9pbml0UmVzdWx0KCk7XG59XG5TZWFyY2hCb3gucHJvdG90eXBlLl9pbml0U2VhcmNoID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbWUgPSB0aGlzICwgJHMgPSBtZS5fJHNlYXJjaF9ib3g7XG4gICAgdmFyICRmID0gdGhpcy5fJHNlYXJjaF9mb3JtID0gJHMuZmluZChcImZvcm1cIik7XG4gICAgdGhpcy5fJGFkZF9idG4gPSAkZi5maW5kKFwiLmFpLWFkZFwiKTtcbiAgICB2YXIgJHNlYXJjaF90eXBlID0gJGYuZmluZChcImlucHV0W3R5cGU9cmFkaW9dXCIpO1xuICAgIHZhciAkc2VhcmNoX2lucCA9ICRmLmZpbmQoXCIuYWktc2VhcmNoLWlucFwiKTtcbiAgICB2YXIgc2VhcmNoX3R5cGUgID0gW1wicHJkXCIsXCJzaG9wXCJdO1xuICAgIFxuICAgIHRoaXMuX2N1cl90eXBlID0gbWUuX29wdC5kZWZhdWx0X3R5cGUgfHwgXCJwcmRcIjtcbiAgICBcbiAgICBpZiAodGhpcy5fY3VyX3R5cGUgPT0gXCJwcmRcIikge1xuICAgICAgICAkc2VhcmNoX3R5cGVbMF0uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICRzZWFyY2hfdHlwZVsxXS5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChtZS5fb3B0Lm9ubHlfb25lKSB7XG4gICAgICAgICAgICAgJHNlYXJjaF90eXBlLmVxKDEpLmNsb3Nlc3QoXCIucmFkaW9cIikuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJHNlYXJjaF90eXBlWzBdLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgJHNlYXJjaF90eXBlWzFdLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICBpZiAobWUuX29wdC5vbmx5X29uZSkge1xuICAgICAgICAgICAgICRzZWFyY2hfdHlwZS5lcSgwKS5jbG9zZXN0KFwiLnJhZGlvXCIpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuXyRzZWFyY2hfZm9ybS5vbihcInN1Ym1pdFwiLGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciB0eXBlIDsgXG4gICAgICAgICRzZWFyY2hfdHlwZS5lYWNoKGZ1bmN0aW9uKGkpe1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIHR5cGUgPSBzZWFyY2hfdHlwZVt0aGlzLnZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBxdWVyeSA9ICRzZWFyY2hfaW5wLnZhbCgpO1xuICAgICAgICB2YXIgc2VhcmNoX29iaiA9IHtcbiAgICAgICAgICAgIHR5cGUgOiB0eXBlLFxuICAgICAgICAgICAgcXVlcnkgOiBxdWVyeVxuICAgICAgICB9O1xuICAgICAgICBtZS5fc2VhcmNoKHNlYXJjaF9vYmopO1xuICAgIH0pO1xuICAgIHRoaXMuXyRhZGRfYnRuLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgJGwgPSBtZS5fJGxpc3RfYm94O1xuICAgICAgICB2YXIgJGNoID0gJGwuZmluZChcIi5haS1jaFwiKSB8fCBbXTtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgdmFyIHRfZG9tID0gW107XG4gICAgICAgIF8uZm9yRWFjaCgkY2gsZnVuY3Rpb24oZG9tLGkpe1xuICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSBkb20uY2hlY2tlZDtcbiAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSAkKGRvbSkuY2xvc2VzdChcInRyXCIpLmRhdGEoXCJpdGVtXCIpO1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaChkKTtcbiAgICAgICAgICAgICAgICB0X2RvbS5wdXNoKGRvbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIG1lLl9vcHQuYWRkX2ZuKGRhdGEpOyBcbiAgICAgICAgICAgIF8uZm9yRWFjaCh0X2RvbSxmdW5jdGlvbihkb20pe1xuICAgICAgICAgICAgICAgZG9tLmNoZWNrZWQgPSBmYWxzZTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1lLl9kb20uZmluZChcIi5haS1zZWxlY3RlZC1hbGwgaW5wdXRbdHlwZT1jaGVja2JveF1cIikuYXR0cihcImNoZWNrZWRcIixmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIuayoeaciemAieaLqeWVhuWTgVwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuU2VhcmNoQm94LnByb3RvdHlwZS5faW5pdFJlc3VsdCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG1lID0gdGhpcyAsICRsID0gdGhpcy5fJGxpc3RfYm94O1xuICAgICRsLmRlbGVnYXRlKFwiLmFpLXNlbGVjdGVkLWFsbCBsYWJlbFwiLFwiY2xpY2tcIixmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIGNoZWNrX2RvbSA9ICQodGhpcykuZmluZChcImlucHV0XCIpO1xuICAgICAgICB2YXIgJHRkX2xhYmVscyA9ICRsLmZpbmQoXCJpbnB1dC5haS1jaFwiKTsgXG4gICAgICAgIGlmICgkdGRfbGFiZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSBjaGVja19kb21bMF0uY2hlY2tlZDtcbiAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgJHRkX2xhYmVscy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0ZF9sYWJlbHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyICRwYWdlX2RvbSA9IHRoaXMuXyRwYWdlX2JveDsgXG4gICAgICAgICRwYWdlX2RvbS5kZWxlZ2F0ZShcIi5wZy1pdGVtXCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHZhciBwZyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwicGdcIikgKiAxO1xuICAgICAgICAgICBtZS5nb19wYWdlKHBnKTtcbiAgICAgICAgfSk7XG4gICAgICAgJHBhZ2VfZG9tLmRlbGVnYXRlKFwiLmpzLXAtbmV4dFwiLFwiY2xpY2tcIixmdW5jdGlvbihlKXtcbiAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICB2YXIgcGcgPSBtZS5fY2FjaGVfcGFyYW1zLnBuICsgMTtcbiAgICAgICAgICAgbWUuZ29fcGFnZShwZyk7XG4gICAgICAgfSk7XG4gICAgICAgJHBhZ2VfZG9tLmRlbGVnYXRlKFwiLmpzLXAtcHJldlwiLFwiY2xpY2tcIixmdW5jdGlvbihlKXtcbiAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICB2YXIgcGcgPSBtZS5fY2FjaGVfcGFyYW1zLnBuIC0xO1xuICAgICAgICAgICBtZS5nb19wYWdlKHBnKTtcbiAgICAgICB9KTsgIFxufVxuXG5TZWFyY2hCb3gucHJvdG90eXBlLl9zZWFyY2ggPSBmdW5jdGlvbihvYmope1xuICAgIHZhciBxdWVyeV9vYmogPSB0aGlzLl9TRUFSQ0hfTUFQW29iai50eXBlXTtcbiAgICB2YXIgcG4gPSAxICwgcHMgPSB0aGlzLl9wYWdlX2xpbWl0O1xuICAgIHZhciBwYXJhbXMgPSB7cG46cG4scHM6cHMscTpvYmoucXVlcnl9O1xuICAgIHRoaXMuX2NhY2hlX3BhcmFtcyA9IHBhcmFtcztcbiAgICB0aGlzLl9jdXJfdHlwZSA9IG9iai50eXBlO1xuICAgIHRoaXMuX3JlbmRlckxpc3RIZChvYmoudHlwZSk7XG4gICAgcXVlcnlfb2JqLnNlYXJjaC5jYWxsKHRoaXMscGFyYW1zLG9iai50eXBlKTtcbn1cblNlYXJjaEJveC5wcm90b3R5cGUuX1NFQVJDSF9NQVAgPSB7XG4gICAgXCJwcmRcIiA6IHtcbiAgICAgICAgc2VhcmNoIDogZnVuY3Rpb24ocGFyYW1zLHR5cGUpe1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIC8vdmFyIHVybCA9ICcvYXBpL2dldFByb2R1Y3RMaXN0Lmh0bSc7XG4gICAgICAgICAgICB2YXIgdXJsID0gJy9zZWFyY2hQcm9kdWN0P2Zyb209b3NzJztcbiAgICAgICAgICAgIGh0dHAuZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmwgOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YSA6IHBhcmFtc1xuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihycyl7XG4gICAgICAgICAgICAgICAgbWUuX2NhY2hlX3BhcmFtcy5wbiA9IHBhcmFtcy5wbjtcbiAgICAgICAgICAgICAgICBtZS5fcmVuZGVyTGlzdCh0eXBlLHJzLmRhdGEpO1xuICAgICAgICAgICAgICAgIG1lLl9yZW5kZXJQYWdlKHBhcmFtcy5wbixycy50b3RhbE51bSxwYXJhbXMucHMpO1xuICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwi5pyN5Yqh5Zmo6ZSZ6K+v77yM6K+35Yi35paw6YeN6K+VXCIpOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcInNob3BcIiA6IHtcbiAgICAgICAgc2VhcmNoIDogZnVuY3Rpb24ocGFyYW1zLHR5cGUpe1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHZhciB1cmwgPSAnL2FwaS9nZXRTaG9wTGlzdC5odG0nO1xuICAgICAgICAgICAgaHR0cC5nZXQoe1xuICAgICAgICAgICAgICAgIHVybCA6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhIDogcGFyYW1zXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgICAgICBtZS5fY2FjaGVfcGFyYW1zLnBuID0gcGFyYW1zLnBuO1xuICAgICAgICAgICAgICAgIG1lLl9yZW5kZXJMaXN0KHR5cGUscnMuc2hvcExpc3QpO1xuICAgICAgICAgICAgICAgIG1lLl9yZW5kZXJQYWdlKHBhcmFtcy5wbixycy50b3RhbE51bSxwYXJhbXMucHMpO1xuICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgYWxlcnQoXCLmnI3liqHlmajplJnor6/vvIzor7fliLfmlrDph43or5VcIik7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG59XG5cblNlYXJjaEJveC5wcm90b3R5cGUuX3Jlc2V0ID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLl9jYWNoZV9wYXJhbXMgPSB7cG46MSxwczp0aGlzLl9wYWdlX2xpbWl0fTsgIFxuICAgIHRoaXMuXyRsaXN0X2JveC5lbXB0eSgpO1xufVxuU2VhcmNoQm94LnByb3RvdHlwZS5fcmVuZGVyTGlzdEhkID0gZnVuY3Rpb24odHlwZSl7XG4gICAgdmFyICRsID0gdGhpcy5fJGxpc3RfYm94O1xuICAgIGlmICh0eXBlID09IFwicHJkXCIpIHtcbiAgICAgICAgJGwuaHRtbChQUkRfSERfVFBMKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRsLmh0bWwoU0hPUF9IRF9UUEwoKSk7XG4gICAgfVxuICAgIFxufVxuU2VhcmNoQm94LnByb3RvdHlwZS5fcmVuZGVyTGlzdCA9IGZ1bmN0aW9uKHR5cGUsZGF0YSl7XG4gICAgdmFyICR0Ym9keSA9IHRoaXMuXyRsaXN0X2JveC5maW5kKFwidGJvZHlcIik7XG4gICAgdmFyIHRwbCA7XG4gICAgaWYgKHR5cGUgPT0gXCJwcmRcIiApIHtcbiAgICAgICAgdHBsID0gUFJEX1REX1RQTDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cGwgPSBTSE9QX1REX1RQTDtcbiAgICB9XG4gICAgJHRib2R5LmVtcHR5KCk7XG4gICAgXy5mb3JFYWNoKGRhdGEsZnVuY3Rpb24oZCxpKXtcbiAgICAgICAgdmFyIGh0bWwgPSB0cGwoZCk7XG4gICAgICAgIHZhciAkdHIgPSAkKGh0bWwpO1xuICAgICAgICAkdHIuZGF0YShcIml0ZW1cIixkKTtcbiAgICAgICAgJHRib2R5LmFwcGVuZCgkdHIpO1xuICAgIH0pO1xufVxuU2VhcmNoQm94LnByb3RvdHlwZS5fcmVuZGVyUGFnZSA9IGZ1bmN0aW9uKGN1cl9wYWdlLHRvdGFsLGxpbWl0KXtcbiAgICAgIHBhZ2VyLnJlbmRlcih0aGlzLl8kcGFnZV9ib3gsY3VyX3BhZ2UsdG90YWwsbGltaXQpOyBcbn1cblxuU2VhcmNoQm94LnByb3RvdHlwZS5nb19wYWdlID0gZnVuY3Rpb24ocCl7XG4gICAgdmFyIHBhcmFtcyA9IHRoaXMuX2NhY2hlX3BhcmFtcztcbiAgICB2YXIgdHlwZSA9IHRoaXMuX2N1cl90eXBlO1xuICAgIHZhciBxdWVyeV9vYmogPSB0aGlzLl9TRUFSQ0hfTUFQW3R5cGVdO1xuICAgIHZhciBxX3BhcmFtcyA9IF8uZXh0ZW5kKHt9LHBhcmFtcyk7XG4gICAgcV9wYXJhbXMucG4gPSBwO1xuICAgIHF1ZXJ5X29iai5zZWFyY2guY2FsbCh0aGlzLHFfcGFyYW1zLHR5cGUpO1xuICAgIFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaEJveDtcbiIsInZhciAkID0gcmVxdWlyZShcIi4uLy4uL2xpYi9qcXVlcnkuanNcIik7XG52YXIgXyA9IHJlcXVpcmUoXCIuLi8uLi9saWIvbG9kYXNoLmNvbXBhdC5taW4uanNcIik7XG52YXIgaHR0cCA9IHJlcXVpcmUoXCIuLi8uLi9tb2QvaHR0cC5qc1wiKTtcbnZhciBVcGxvYWRlciA9IHJlcXVpcmUoXCIuLi8uLi9saWIvaXVwbG9hZC5qc1wiKTtcbnZhciBUcGwgPSByZXF1aXJlKFwiLi90bXBsL3N1YmplY3RfaXRlbS5qc1wiKTtcbnZhciBTaG9wVHBsID0gcmVxdWlyZShcIi4vdG1wbC9zaG9wX3BmLmpzXCIpO1xudmFyIFByZFRwbCA9IHJlcXVpcmUoXCIuL3RtcGwvcHJkX3BmLmpzXCIpO1xudmFyIFRpdGxlVHBsID0gcmVxdWlyZShcIi4vdG1wbC90aXRsZV9jb250ZW50LmpzXCIpO1xudmFyIEltZ1RwbCA9IHJlcXVpcmUoXCIuL3RtcGwvaW1nX2NvbnRlbnQuanNcIik7XG52YXIgUFRwbCA9IHJlcXVpcmUoXCIuL3RtcGwvcF9jb250ZW50LmpzXCIpO1xuXG5cbnZhciBTdWJqZWN0SXRlbSA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgLy9wcmQgb3Igc2hvcFxuICAgIHRoaXMuX2V4X2RhdGEgPSBvcHQuZGF0YTtcbiAgICB0aGlzLl9zdWJqZWN0X2lkID0gb3B0LnN1YmplY3RfaWQ7XG4gICAgdGhpcy5faW5pdF9pdGVtX2RhdGEgPSBvcHQuaXRlbV9kYXRhO1xuICAgIHRoaXMuX2lkcyA9IDA7XG4gICAgdGhpcy5faXRlbXMgPSBbXTtcbn1cblxuU3ViamVjdEl0ZW0ucHJvdG90eXBlLl9rZXkgPSBcIuS4k+mimFwiO1xuU3ViamVjdEl0ZW0ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuX2NyZWF0ZURvbSgpO1xuICAgIHRoaXMuX2JpbmQoKTtcbiAgICBTb3J0YWJsZS5jcmVhdGUodGhpcy5fJGl0ZW1fY29uWzBdLHtcbiAgICAgICAgZHJhZ2dhYmxlICA6IFwiLmFpLXJvd1wiXG4gICAgfSk7XG59XG5TdWJqZWN0SXRlbS5wcm90b3R5cGUuZG9tID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5fZG9tO1xufVxuXG5TdWJqZWN0SXRlbS5wcm90b3R5cGUuX2NyZWF0ZURvbSA9IGZ1bmN0aW9uKCl7XG4gICAgIHZhciBtZSA9IHRoaXM7XG4gICAgIHZhciBodG1sID0gVHBsKHtrZXk6bWUuX2tleX0pO1xuICAgICB0aGlzLl9kb20gPSAkKGh0bWwpO1xuICAgICB0aGlzLl8kcHNfZG9tID0gdGhpcy5fZG9tLmZpbmQoXCIuYWktcHMtYm94XCIpO1xuICAgICB0aGlzLl8kaXRlbV9jb24gPSB0aGlzLl9kb20uZmluZChcIi5haS1jb250ZW50LWl0ZW1cIik7XG4gICAgIHRoaXMuXyRmb3JtID0gdGhpcy5fZG9tLmZpbmQoXCJmb3JtXCIpO1xuICAgICBpZiAodGhpcy5fZXhfZGF0YS5wcmVzZW50UHJpY2UgIT09IHZvaWQgMCApIHtcbiAgICAgICAgIHZhciBwc19odG1sID0gdGhpcy5fY3JlYXRlUHJkKCk7XG4gICAgICAgICB0aGlzLl90eXBlaWQgPSAwO1xuICAgICB9IGVsc2Uge1xuICAgICAgICAgdmFyIHBzX2h0bWwgPSB0aGlzLl9jcmVhdGVTaG9wKCk7XG4gICAgICAgICB0aGlzLl90eXBlaWQgPSAxO1xuICAgICB9XG4gICAgdGhpcy5fJHBzX2RvbS5odG1sKHBzX2h0bWwpO1xuICAgIHRoaXMuX2RvbS5maW5kKFwiLmFpLXN0LXRpdGxlXCIpLnZhbCh0aGlzLl9leF9kYXRhLnRpdGxlIHx8IHRoaXMuX2V4X2RhdGEubmFtZSk7XG4gICAgIGlmICh0aGlzLl9pbml0X2l0ZW1fZGF0YSApIHtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLl9pbml0X2l0ZW1fZGF0YS5jb250ZW50O1xuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLl9pbml0X2l0ZW1fZGF0YS50aXRsZTtcbiAgICAgICAgdGhpcy5fZG9tLmZpbmQoXCIuYWktc3QtdGl0bGVcIikudmFsKHRpdGxlKTtcbiAgICAgICAgY29udGVudCA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgICAgIGlmIChjb250ZW50ICYmIGNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICBfLmZvckVhY2goY29udGVudCxmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICBtZS5fYWRkQ29udGVudEJ5RGF0YShkKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRDb250ZW50KDEpO1xuICAgICB9XG5cbn1cblN1YmplY3RJdGVtLnByb3RvdHlwZS5fYmluZCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG1lID0gdGhpcztcbiAgICB0aGlzLl8kZm9ybS5vbihcInN1Ym1pdFwiLGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBpdGVtcyA9IG1lLl9pdGVtcztcbiAgICAgICAgdmFyICRpbnBfZG9tcyA9IG1lLl8kaXRlbV9jb24uZmluZChcIi5haS1yb3dcIik7XG4gICAgICAgIHZhciBjb250ZW50ID0gXy5jaGFpbigkaW5wX2RvbXMpLm1hcChmdW5jdGlvbihodG1sX2RvbSl7XG4gICAgICAgICAgICB2YXIgaWQgPSBodG1sX2RvbS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgICAgIHZhciBvYmogPSBfLmZpbHRlcihpdGVtcyAsIGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBpZCA9PSBkLmlkO1xuICAgICAgICAgICAgfSlbMF07XG4gICAgICAgICAgICByZXR1cm4gb2JqLmdldF9kYXRhKCk7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiBkYXRhICE9IG51bGw7XG4gICAgICAgIH0pLnZhbHVlKCk7XG4gICAgICAgIC8qKlxuICAgICAgICB2YXIgY29udGVudCA9IF8uZmlsdGVyKF8ubWFwKGl0ZW1zLGZ1bmN0aW9uKGl0KXtcbiAgICAgICAgICAgIHJldHVybiBpdC5nZXRfZGF0YSgpO1xuICAgICAgICB9KSxmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiBkYXRhICE9IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgICAqKi9cbiAgICAgICAgdmFyIHRpdGxlID0gJC50cmltKG1lLl9kb20uZmluZChcImlucHV0LmFpLXN0LXRpdGxlXCIpLnZhbCgpKTtcbiAgICAgICAgdGl0bGUgPSB0aXRsZSB8fCBtZS5fZXhfZGF0YS5uYW1lO1xuICAgICAgICB2YXIgcG9zdF9kYXRhID0ge1xuICAgICAgICAgICAgYWxidW1JZCA6IG1lLl9zdWJqZWN0X2lkLFxuICAgICAgICAgICAgdHlwZSA6IG1lLl90eXBlaWQsXG4gICAgICAgICAgICBlbnRpdHlJZCA6IG1lLl90eXBlaWQgPT0gMCA/IG1lLl9leF9kYXRhLnByb2R1Y3RJZCA6IG1lLl9leF9kYXRhLnNob3BJZCxcbiAgICAgICAgICAgIHRpdGxlIDogdGl0bGUsXG4gICAgICAgICAgICBpbWFnZVVybCA6IG1lLl9kb20uZmluZChcImRpdi50d3QtZmVlZCBpbWdcIikuYXR0cihcInNyY1wiKSxcbiAgICAgICAgICAgIGNvbnRlbnQgOiBKU09OLnN0cmluZ2lmeShjb250ZW50KVxuICAgICAgICB9XG4gICAgICAgIGlmICghKG1lLl9pbml0X2l0ZW1fZGF0YSAmJiBtZS5faW5pdF9pdGVtX2RhdGEuaWQpKSB7XG4gICAgICAgICAgICBodHRwLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybCA6IFwiL2FwaS9hZGRBbGJ1bUl0ZW0uaHRtXCIsXG4gICAgICAgICAgICAgICAgZGF0YSA6IHBvc3RfZGF0YVxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihycyl7XG4gICAgICAgICAgICAgICAgaWYgKHJzLnJldCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lLl9pbml0X2l0ZW1fZGF0YSA9IHJzLml0ZW07XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5paw5aKe5oiQ5YqfXCIpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmlrDlop7lpLHotKVcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwi5pyN5Yqh5Zmo6ZSZ6K+vLOaWsOWinuWksei0pVwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgcG9zdF9kYXRhLmlkID0gbWUuX2luaXRfaXRlbV9kYXRhLmlkO1xuICAgICAgICAgICAgaHR0cC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmwgOiBcIi9hcGkvdXBkYXRlQWxidW1JdGVtLmh0bVwiLFxuICAgICAgICAgICAgICAgIGRhdGEgOiBwb3N0X2RhdGFcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICAgICAgIGlmIChycy5yZXQgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuabtOaWsOaIkOWKn1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuabtOaWsOWksei0pVwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCLmnI3liqHlmajplJnor68s5pu05paw5aSx6LSlXCIpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICB9XG4gICAgXG4gICAgfSk7XG5cbiAgICB0aGlzLl9kb20uZmluZChcIi5haS1hZGQtYnRuc1wiKS5kZWxlZ2F0ZShcImFcIixcImNsaWNrXCIsZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHR5cGUgPSAkKHRoaXMpLmRhdGEoXCJ0eXBlXCIpO1xuICAgICAgICBtZS5hZGRDb250ZW50KHR5cGUpO1xuICAgIH0pO1xuICAgIHRoaXMuX2RvbS5maW5kKFwiYS5haS1zdC1kZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGZsYWcgPSB3aW5kb3cuY29uZmlybShcIuehruiupOimgeWIoOmZpOatpOagj+ebruS5iFwiKTtcbiAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgIGlmIChtZS5faW5pdF9pdGVtX2RhdGEgJiYgbWUuX2luaXRfaXRlbV9kYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaHR0cC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsIDogXCIvYXBpL2RlbGV0ZUFsYnVtSXRlbS5odG1cIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA6IHtpZCA6ICBtZS5faW5pdF9pdGVtX2RhdGEuaWQgfVxuICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICAgICAgICAgICBpZiAocnMucmV0ID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIuWIoOmZpOWksei0pVwiKTtcbiAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5pyN5Yqh5Zmo6ZSZ6K+v77yM5Yig6Zmk5aSx6LSlXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgbWUucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuU3ViamVjdEl0ZW0ucHJvdG90eXBlLl9hZGRDb250ZW50QnlEYXRhID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgdmFyIHR5cGUgPSBkYXRhLnR5cGU7XG4gICAgdmFyIG9iaiA9IHRoaXMuYWRkQ29udGVudCh0eXBlKTtcbiAgICBpZiAob2JqKSB7XG4gICAgICAgIHZhciAkZG9tID0gb2JqLmRvbTtcbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAkZG9tLmZpbmQoXCJpbnB1dFwiKS52YWwoZGF0YS50aXRsZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgLy8gY29kZVxuICAgICAgICAgICAgICAgICRkb20uZmluZChcImlucHV0W3R5cGU9dGV4dF1cIikudmFsKGRhdGEudXJsKTtcbiAgICAgICAgICAgICAgICAkZG9tLmZpbmQoXCJpbWdcIikuYXR0cihcInNyY1wiLGRhdGEudXJsKS5jbG9zZXN0KFwiLmltZy1ib3hcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICRkb20uZmluZChcInRleHRhcmVhXCIpLnZhbChkYXRhLnRleHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIC8vIGNvZGVcbiAgICAgICAgICAgICAgICAkZG9tLmZpbmQoXCJ0ZXh0YXJlYVwiKS52YWwoZGF0YS5jb250ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBjb2RlXG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG5cblN1YmplY3RJdGVtLnByb3RvdHlwZS5fY3JlYXRlUHJkID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgZGF0YSA9IHRoaXMuX2V4X2RhdGE7XG4gICAgdmFyIGltZyA9IGRhdGEuaW1hZ2U7XG4gICAgaWYgKGltZyAmJiBpbWcubGVuZ3RoKSB7XG4gICAgICAgIGltZyA9IGltZy5zcGxpdCgvO3wsLylbMF07XG4gICAgfVxuICAgIHZhciB0cGxfZGF0YSA9IHtcbiAgICAgICAgcHJkX25hbWUgOiBkYXRhLnRpdGxlIHx8IGRhdGEubmFtZSxcbiAgICAgICAgcHJkX2ltZyA6IGRhdGEuaWNvblVybCB8fCBpbWcsXG4gICAgICAgIHByZF9wciA6IGRhdGEucHJlc2VudFByaWNlLFxuICAgICAgICBwcmRfb2xkX3ByIDogZGF0YS5vcmlnaW5hbFByaWNlLFxuICAgICAgICBwcmRfZHVyIDogZGF0YS5zZXJ2aWNlVGltZSxcbiAgICAgICAgcHJkX3Nob3BfbmFtZSA6IGRhdGEuc2hvcE5hbWVcbiAgICB9O1xuICAgIHZhciBodG1sID0gUHJkVHBsKHRwbF9kYXRhKVxuICAgIHJldHVybiBodG1sO1xufVxuXG5TdWJqZWN0SXRlbS5wcm90b3R5cGUuX2NyZWF0ZVNob3AgPSBmdW5jdGlvbigpe1xuICAgIHZhciBkYXRhID0gdGhpcy5fZXhfZGF0YTtcbiAgICB2YXIgaHRtbCA9IFNob3BUcGwoZGF0YSk7XG4gICAgcmV0dXJuIGh0bWw7XG59XG5TdWJqZWN0SXRlbS5wcm90b3R5cGUuX2NyZWF0ZUl0ZW0gPSBmdW5jdGlvbigkZG9tKXtcbiAgICB2YXIgbWUgPSB0aGlzICwgdHlwZSA9IG1lLl9leF9kYXRhO1xuICAgIHZhciAkY29uID0gJGRvbS5maW5kKFwiLmFpLXBmLWJveFwiKTtcbiAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgY2FzZSAncHJkJzogXG4gICAgICAgICAgICBodG1sID0gbWUuX2NyZWF0ZVByZCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Nob3AnOlxuICAgICAgICAgICAgaHRtbCA9IG1lLl9jcmVhdGVTaG9wKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIC8vIGNvZGVcbiAgICB9O1xuXG4gICAgJGNvbi5odG1sKGh0bWwpO1xufVxuXG5TdWJqZWN0SXRlbS5wcm90b3R5cGUuYWRkQ29udGVudCA9IGZ1bmN0aW9uKHR5cGUpe1xuICAgIHZhciBtZSA9IHRoaXMgO1xuICAgIHZhciAkY29uID0gdGhpcy5fJGl0ZW1fY29uO1xuICAgIHZhciBvYmogOyBcbiAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBvYmogPSBtZS5fY3JlYXRlVGl0bGVEb20oKTsgXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgb2JqID0gbWUuX2NyZWF0ZVBEb20oKTtcbiAgICAgICAgICAgIC8vIGNvZGVcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBvYmogPSBtZS5fY3JlYXRlSW1nRG9tKCk7XG4gICAgICAgICAgICAvLyBjb2RlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIC8vIGNvZGVcbiAgICB9XG4gICAgaWYgKG9iaikge1xuICAgICAgICB2YXIgJGRvbSA9IG9iai5kb207XG4gICAgICAgIHRoaXMuXyRpdGVtX2Nvbi5hcHBlbmQoJGRvbSk7XG4gICAgICAgIHRoaXMuX2l0ZW1zLnB1c2gob2JqKTtcbiAgICAgICAgXG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5cblxuU3ViamVjdEl0ZW0ucHJvdG90eXBlLl9jcmVhdGVUaXRsZURvbSA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGh0bWwgPSBUaXRsZVRwbCgpO1xuICAgIHZhciAkZG9tID0gJChodG1sKTtcbiAgICB2YXIgaWQgID0gIFwiX2l0ZW1fXCIrdGhpcy5faWRzICsrO1xuICAgIHZhciB0eXBlID0gMTtcbiAgICB0aGlzLmJpbmRJdGVtRG9tKCRkb20saWQsdHlwZSk7XG4gICAgcmV0dXJuICB7XG4gICAgICAgIGlkIDogaWQsIFxuICAgICAgICB0eXBlIDogdHlwZSxcbiAgICAgICAgZG9tIDogJGRvbSxcbiAgICAgICAgZ2V0X2RhdGEgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHZhbCA9ICQudHJpbSgkZG9tLmZpbmQoXCJpbnB1dFwiKS52YWwoKSk7XG4gICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6IHR5cGUgLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA6IHZhbCBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuU3ViamVjdEl0ZW0ucHJvdG90eXBlLl9jcmVhdGVQRG9tID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgaHRtbCA9IFBUcGwoKTtcbiAgICB2YXIgJGRvbSA9ICQoaHRtbCk7XG4gICAgdmFyIGlkICA9ICBcIl9pdGVtX1wiK3RoaXMuX2lkcyArKztcbiAgICB2YXIgdHlwZSA9IDI7XG4gICAgdGhpcy5iaW5kSXRlbURvbSgkZG9tLGlkKTtcbiAgICByZXR1cm4gIHtcbiAgICAgICAgaWQgOiBpZCwgXG4gICAgICAgIHR5cGUgOiB0eXBlLFxuICAgICAgICBkb20gOiAkZG9tLFxuICAgICAgICBnZXRfZGF0YSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdmFsID0gJC50cmltKCRkb20uZmluZChcInRleHRhcmVhXCIpLnZhbCgpKTtcbiAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgOiB2YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn1cblxuXG5cblN1YmplY3RJdGVtLnByb3RvdHlwZS5fY3JlYXRlSW1nRG9tID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgaHRtbCA9IEltZ1RwbCgpO1xuICAgIHZhciAkZG9tID0gJChodG1sKTtcbiAgICB2YXIgaWQgID0gIFwiX2l0ZW1fXCIrdGhpcy5faWRzICsrO1xuICAgIHZhciB0eXBlID0gMyA7XG4gICAgdmFyIHVwbG9hZGVyID0gVXBsb2FkZXIuY3JlYXRlX3VwbG9hZCh7XG4gICAgICAgIGRvbSA6ICAkZG9tLmZpbmQoXCIuaW1nLXVwbG9hZC1idG5cIilbMF0sXG4gICAgICAgIG11bHRpX3NlbGVjdGlvbiA6IGZhbHNlLFxuICAgICAgICBjYWxsYmFjayA6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgdmFyIHBhdGhMaXN0ID0gZGF0YS5wYXRoTGlzdDtcbiAgICAgICAgICAgIGlmIChwYXRoTGlzdCAmJiBwYXRoTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1nX2h0bWwgPSAnPGltZyBzcmM9XCInK3BhdGhMaXN0WzBdKydcIiA+JztcbiAgICAgICAgICAgICAgICAkZG9tLmZpbmQoXCJpbnB1dFt0eXBlPXRleHRdXCIpLnZhbChwYXRoTGlzdFswXSk7XG4gICAgICAgICAgICAgICAgJGRvbS5maW5kKFwiLmltZy13cmFwXCIpLmh0bWwoaW1nX2h0bWwpLnBhcmVudCgpLnNob3coKTsgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkZG9tLmRhdGEoXCJ1cGxvYWRlclwiLHVwbG9hZGVyKTtcbiAgICB0aGlzLmJpbmRJdGVtRG9tKCRkb20saWQpO1xuICAgIHJldHVybiAge1xuICAgICAgICBpZCA6IGlkLCBcbiAgICAgICAgdHlwZSA6IHR5cGUsXG4gICAgICAgIGRvbSA6ICRkb20sXG4gICAgICAgIGdldF9kYXRhIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB1cmwgPSAkLnRyaW0oJGRvbS5maW5kKFwiaW5wdXRcIikudmFsKCkpO1xuICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgOiB0eXBlICxcbiAgICAgICAgICAgICAgICAgICAgdXJsIDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0IDogJGRvbS5maW5kKFwidGV4dGFyZWFcIikudmFsKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblN1YmplY3RJdGVtLnByb3RvdHlwZS5iaW5kSXRlbURvbSA9IGZ1bmN0aW9uKCRkb20saWQpe1xuICAgIHZhciBtZSA9IHRoaXM7XG4gICAgJGRvbS5hdHRyKFwiaWRcIixpZCk7XG4gICAgJGRvbS5maW5kKFwiLmFkZC1kZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbWUucmVtb3ZlSXRlbShpZCk7XG4gICAgfSlcbn1cblN1YmplY3RJdGVtLnByb3RvdHlwZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaWQpe1xuICAgIHZhciBpdGVtcyA9IHRoaXMuX2l0ZW1zO1xuICAgIHZhciBvYmogLGluZGV4O1xuICAgIF8uc29tZShpdGVtcyxmdW5jdGlvbihkLGkpe1xuICAgICAgICBpZiAoZC5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIG9iaiA9IGQ7XG4gICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChvYmopIHtcbiAgICAgICAgdmFyIG9iaiA9IGl0ZW1zLnNwbGljZShpbmRleCwxKVswXTtcbiAgICAgICAgdmFyIHR5cGUgPSBvYmoudHlwZTtcbiAgICAgICAgaWYgKHR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIG9iai5kb20uZGF0YShcInVwbG9hZGVyXCIpICYmICBvYmouZG9tLmRhdGEoXCJ1cGxvYWRlclwiKS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgb2JqLmRvbS5yZW1vdmUoKTtcbiAgICAgICAgb2JqID0gbnVsbDtcbiAgICB9XG59XG5TdWJqZWN0SXRlbS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgaXRlbXMgPSB0aGlzLl9pdGVtcztcbiAgICBfLmZvckVhY2goaXRlbXMsZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgdmFyIHR5cGUgPSBvYmoudHlwZTtcbiAgICAgICAgaWYgKHR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIG9iai5kb20uZGF0YShcInVwbG9hZGVyXCIpICYmICBvYmouZG9tLmRhdGEoXCJ1cGxvYWRlclwiKS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgb2JqLmRvbS5yZW1vdmUoKTtcbiAgICAgICAgb2JqID0gbnVsbDtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLl9pdGVtcyA9IG51bGw7XG4gICAgdGhpcy5fZG9tLnJlbW92ZSgpO1xufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdWJqZWN0SXRlbTtcblxuXG5cblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyIHRlbXBsYXRlID0ganVpY2VyLnRlbXBsYXRlLCB0ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyB8fCB7fTtcbnZhciB0cGwgPSB0ZW1wbGF0ZXNbJ2ltZ19jb250ZW50LnRtcGwnXSA9IGZ1bmN0aW9uKF8sIF9tZXRob2QpIHtfbWV0aG9kID0ganVpY2VyLm9wdGlvbnMuX21ldGhvZDtcbid1c2Ugc3RyaWN0Jzt2YXIgXz1ffHx7fTt2YXIgX291dD0nJztfb3V0Kz0nJzsgdHJ5IHsgX291dCs9Jyc7IHZhciBkaXY9Xy5kaXY7dmFyIGdyb3VwPV8uZ3JvdXA7dmFyIHJvdz1fLnJvdzt2YXIgbGFiZWw9Xy5sYWJlbDt2YXIgc209Xy5zbTt2YXIgaW5wdXQ9Xy5pbnB1dDt2YXIgY29udHJvbD1fLmNvbnRyb2w7dmFyIHNwYW49Xy5zcGFuO3ZhciBidG49Xy5idG47dmFyIGJ1dHRvbj1fLmJ1dHRvbjt2YXIgcHJpbWFyeT1fLnByaW1hcnk7dmFyIHVwbG9hZD1fLnVwbG9hZDt2YXIgdGV4dD1fLnRleHQ7dmFyIHRleHRhcmVhPV8udGV4dGFyZWE7dmFyIGJveD1fLmJveDt2YXIgd3JhcD1fLndyYXA7dmFyIGltZz1fLmltZzt2YXIgYnRucz1fLmJ0bnM7dmFyIGE9Xy5hO3ZhciBkZWw9Xy5kZWw7dmFyIGk9Xy5pO3ZhciB0aW1lcz1fLnRpbWVzOyBfb3V0Kz0nIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwICBhaS1yb3dcIj4gICAgIDxsYWJlbCBjbGFzcz1cImNvbC1zbS0yIGNvbnRyb2wtbGFiZWxcIj7lm77niYc8L2xhYmVsPiAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+ICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+ICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+ICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGltZy11cGxvYWQtYnRuXCIgIHR5cGU9XCJidXR0b25cIj7kuIrkvKDlm77niYc8L2J1dHRvbj4gICAgICAgICAgICAgPC9zcGFuPiAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW1nLXRleHRcIj4gICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCLlm77niYfmj4/ov7BcIj48L3RleHRhcmVhPiAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW1nLWJveFwiPiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW1nLXdyYXBcIj4gICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiXCIgPiAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgPC9kaXY+ICAgICA8L2Rpdj4gICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNCBhZGQtYnRucyBcIiA+ICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImFkZC1kZWxcIiA+PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT7liKDpmaQ8L2E+ICAgICA8L2Rpdj4gPC9kaXY+ICAnOyB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9IF9vdXQrPScnO3JldHVybiBfb3V0O1xufTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGp1aWNlci50ZW1wbGF0ZXNbJ2ltZ19jb250ZW50LnRtcGwnXTsiLCIoZnVuY3Rpb24oKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IGp1aWNlci50ZW1wbGF0ZSwgdGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgfHwge307XG52YXIgdHBsID0gdGVtcGxhdGVzWydwX2NvbnRlbnQudG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIGRpdj1fLmRpdjt2YXIgZ3JvdXA9Xy5ncm91cDt2YXIgcm93PV8ucm93O3ZhciBsYWJlbD1fLmxhYmVsO3ZhciBzbT1fLnNtO3ZhciB0ZXh0YXJlYT1fLnRleHRhcmVhO3ZhciBjb250cm9sPV8uY29udHJvbDt2YXIgcD1fLnA7dmFyIGJ0bnM9Xy5idG5zO3ZhciBhPV8uYTt2YXIgZGVsPV8uZGVsO3ZhciB0eXBlPV8udHlwZTt2YXIgaT1fLmk7dmFyIHRpbWVzPV8udGltZXM7IF9vdXQrPScgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgYWktcm93XCI+ICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtc20tMiBjb250cm9sLWxhYmVsXCI+5q616JC9PC9sYWJlbD4gICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPiAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImZvcm0tY29udHJvbCBtLXAtdGV4dGFyZWFcIiByb3cgPTggcGxhY2Vob2xkZXI9XCLmrrXokL3lhoXlrrlcIiA+PC90ZXh0YXJlYT4gICAgIDwvZGl2PiAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00IGFkZC1idG5zXCIgPiAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhZGQtZGVsXCIgZGF0YS10eXBlPVwiM1wiPjxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+5Yig6ZmkPC9hPiAgICAgPC9kaXY+IDwvZGl2PiAgJzsgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSBfb3V0Kz0nJztyZXR1cm4gX291dDtcbn07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBqdWljZXIudGVtcGxhdGVzWydwX2NvbnRlbnQudG1wbCddOyIsIihmdW5jdGlvbigpIHtcbiAgdmFyIHRlbXBsYXRlID0ganVpY2VyLnRlbXBsYXRlLCB0ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyB8fCB7fTtcbnZhciB0cGwgPSB0ZW1wbGF0ZXNbJ3ByZF9saXN0X2hkLnRtcGwnXSA9IGZ1bmN0aW9uKF8sIF9tZXRob2QpIHtfbWV0aG9kID0ganVpY2VyLm9wdGlvbnMuX21ldGhvZDtcbid1c2Ugc3RyaWN0Jzt2YXIgXz1ffHx7fTt2YXIgX291dD0nJztfb3V0Kz0nJzsgdHJ5IHsgX291dCs9Jyc7IHZhciBpZD1fLmlkO3ZhciB0YWJsZT1fLnRhYmxlO3ZhciBob3Zlcj1fLmhvdmVyO3ZhciB0aGVhZD1fLnRoZWFkO3ZhciB0cj1fLnRyO3ZhciB0aD1fLnRoO3ZhciBzZWxlY3RlZD1fLnNlbGVjdGVkO3ZhciBhbGw9Xy5hbGw7dmFyIGxhYmVsPV8ubGFiZWw7dmFyIGlucHV0PV8uaW5wdXQ7dmFyIHRib2R5PV8udGJvZHk7IF9vdXQrPScgPHRhYmxlIGNsYXNzPVwidGFibGUgIHRhYmxlLWhvdmVyIGdlbmVyYWwtdGFibGVcIj4gPHRoZWFkPiA8dHI+ICAgICA8dGg+5ZWG5ZOBSUQ8L3RoPiAgICAgPHRoPuWVhuWTgeWQjeensDwvdGg+ICAgICA8dGg+5omA5bGe6Zeo5bqXPC90aD4gICAgIDx0aD7njrDku7c8L3RoPiAgICAgPHRoPuWOn+S7tzwvdGg+ICAgICA8dGg+54q25oCBPC90aD4gICAgIDx0aCBjbGFzcz1cImFpLXNlbGVjdGVkLWFsbFwiPiAgICAgICAgIDxsYWJlbD4gICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCInO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24oaWQpKSA7X291dCs9J1wiIG5hbWU9XCJzZWxlY3RfcHJkXCIgaWQ9XCJzZWxfcHJkXyc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIvPiAgICAgICAgIOWFqOmAiSAgICAgICAgIDwvbGFiZWw+ICAgICA8L3RoPiA8L3RyPiA8L3RoZWFkPiA8dGJvZHk+IDwvdGJvZHk+IDwvdGFibGU+ICAgJzsgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSBfb3V0Kz0nJztyZXR1cm4gX291dDtcbn07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBqdWljZXIudGVtcGxhdGVzWydwcmRfbGlzdF9oZC50bXBsJ107IiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgdGVtcGxhdGUgPSBqdWljZXIudGVtcGxhdGUsIHRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzIHx8IHt9O1xudmFyIHRwbCA9IHRlbXBsYXRlc1sncHJkX3BmLnRtcGwnXSA9IGZ1bmN0aW9uKF8sIF9tZXRob2QpIHtfbWV0aG9kID0ganVpY2VyLm9wdGlvbnMuX21ldGhvZDtcbid1c2Ugc3RyaWN0Jzt2YXIgXz1ffHx7fTt2YXIgX291dD0nJztfb3V0Kz0nJzsgdHJ5IHsgX291dCs9Jyc7IHZhciBwcmRfaW1nPV8ucHJkX2ltZzt2YXIgcHJkX25hbWU9Xy5wcmRfbmFtZTt2YXIgcHJkX3ByPV8ucHJkX3ByO3ZhciBwcmRfb2xkX3ByPV8ucHJkX29sZF9wcjt2YXIgcHJkX2R1cj1fLnByZF9kdXI7dmFyIHByZF9zaG9wX25hbWU9Xy5wcmRfc2hvcF9uYW1lO3ZhciBkaXY9Xy5kaXY7dmFyIHByZD1fLnByZDt2YXIgYm94PV8uYm94O3ZhciBzdD1fLnN0O3ZhciBwcz1fLnBzO3ZhciBmZWVkPV8uZmVlZDt2YXIgYmc9Xy5iZzt2YXIgdHdpdHRlcj1fLnR3aXR0ZXI7dmFyIG1hcms9Xy5tYXJrO3ZhciBhPV8uYTt2YXIgaW1nPV8uaW1nO3ZhciB1bD1fLnVsO3ZhciBwaWxscz1fLnBpbGxzO3ZhciBzdGFja2VkPV8uc3RhY2tlZDt2YXIgbGk9Xy5saTt2YXIgc3Bhbj1fLnNwYW47IF9vdXQrPSc8ZGl2IGNsYXNzPVwiYWktcHJkLWJveCBtLXN0LXBzXCI+ICAgICA8ZGl2IGNsYXNzPVwidHd0LWZlZWQgYmx1ZS1iZ1wiPiAgICAgICAgIDxkaXYgY2xhc3M9XCJmYSBmYS10d2l0dGVyIHd0dC1tYXJrXCI+PC9kaXY+ICAgICAgICAgPGEgaHJlZj1cIiNcIj4gICAgICAgICAgICAgPGltZyBhbHQ9XCJcIiBzcmM9XCInO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24ocHJkX2ltZykpIDtfb3V0Kz0nXCI+ICAgICAgICAgPC9hPiAgICAgPC9kaXY+ICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXBpbGxzIG5hdi1zdGFja2VkXCI+ICAgICAgICAgPGxpID48c3Bhbj7lkI3np7A6PC9zcGFuPic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihwcmRfbmFtZSkpIDtfb3V0Kz0nPC9saT4gICAgICAgICA8bGk+PHNwYW4+5Lu35qC8Ojwvc3Bhbj4gJztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKHByZF9wcikpIDtfb3V0Kz0nIDxzcGFuPuWOn+S7tzo8L3NwYW4+ICc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihwcmRfb2xkX3ByKSkgO19vdXQrPSc8L2xpPiAgICAgICAgIDxsaT48c3Bhbj7mnI3liqHml7bplb86PC9zcGFuPic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihwcmRfZHVyKSkgO19vdXQrPSc8L2xpPiAgICAgICAgIDxsaT48c3Bhbj7miYDlsZ7llYblrrY6PC9zcGFuPic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihwcmRfc2hvcF9uYW1lKSkgO19vdXQrPSc8L2xpPiAgICAgPC91bD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gJzsgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSBfb3V0Kz0nJztyZXR1cm4gX291dDtcbn07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBqdWljZXIudGVtcGxhdGVzWydwcmRfcGYudG1wbCddOyIsIihmdW5jdGlvbigpIHtcbiAgdmFyIHRlbXBsYXRlID0ganVpY2VyLnRlbXBsYXRlLCB0ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyB8fCB7fTtcbnZhciB0cGwgPSB0ZW1wbGF0ZXNbJ3ByZF90ZC50bXBsJ10gPSBmdW5jdGlvbihfLCBfbWV0aG9kKSB7X21ldGhvZCA9IGp1aWNlci5vcHRpb25zLl9tZXRob2Q7XG4ndXNlIHN0cmljdCc7dmFyIF89X3x8e307dmFyIF9vdXQ9Jyc7X291dCs9Jyc7IHRyeSB7IF9vdXQrPScnOyB2YXIgcHJvZHVjdElkPV8ucHJvZHVjdElkO3ZhciB0aXRsZT1fLnRpdGxlO3ZhciBzaG9wTmFtZT1fLnNob3BOYW1lO3ZhciBwcmVzZW50UHJpY2U9Xy5wcmVzZW50UHJpY2U7dmFyIG9yaWdpbmFsUHJpY2U9Xy5vcmlnaW5hbFByaWNlO3ZhciBzdGF0dXM9Xy5zdGF0dXM7dmFyIGlkPV8uaWQ7dmFyIHRyPV8udHI7dmFyIHRkPV8udGQ7dmFyIHByZF9zdGF0dXM9Xy5wcmRfc3RhdHVzO3ZhciBsYWJlbD1fLmxhYmVsO3ZhciBpbnB1dD1fLmlucHV0O3ZhciBjaD1fLmNoOyBfb3V0Kz0nPHRyPiAgICAgPHRkPiAgICAgICAgICc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihwcm9kdWN0SWQpKSA7X291dCs9JyAgICAgICAgICAgICA8L3RkPiAgICAgPHRkPiAgICAgICAgICc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbih0aXRsZSkpIDtfb3V0Kz0nICAgICAgICAgICAgIDwvdGQ+ICAgICA8dGQ+Jztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKHNob3BOYW1lKSkgO19vdXQrPSc8L3RkPiAgICAgPHRkPic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihwcmVzZW50UHJpY2UpKSA7X291dCs9JzwvdGQ+ICAgICA8dGQ+Jztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKG9yaWdpbmFsUHJpY2UpKSA7X291dCs9JzwvdGQ+ICAgICA8dGQ+Jztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKF9tZXRob2QucHJkX3N0YXR1cy5jYWxsKHt9LCBzdGF0dXMpKSkgO19vdXQrPSc8L3RkPiAgICAgPHRkPiAgICAgICAgIDxsYWJlbD4gICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiYWktY2hcIiB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cIic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIgbmFtZT1cInNlbGVjdF9wcmRcIiBpZD1cInNlbF9wcmRfJztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKGlkKSkgO19vdXQrPSdcIi8+ICAgICAgICAgICAgIOmAieaLqSAgICAgICAgIDwvbGFiZWw+ICAgICA8L3RkPiA8L3RyPiAgJzsgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSBfb3V0Kz0nJztyZXR1cm4gX291dDtcbn07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBqdWljZXIudGVtcGxhdGVzWydwcmRfdGQudG1wbCddOyIsIihmdW5jdGlvbigpIHtcbiAgdmFyIHRlbXBsYXRlID0ganVpY2VyLnRlbXBsYXRlLCB0ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyB8fCB7fTtcbnZhciB0cGwgPSB0ZW1wbGF0ZXNbJ3Nob3BfbGlzdF9oZC50bXBsJ10gPSBmdW5jdGlvbihfLCBfbWV0aG9kKSB7X21ldGhvZCA9IGp1aWNlci5vcHRpb25zLl9tZXRob2Q7XG4ndXNlIHN0cmljdCc7dmFyIF89X3x8e307dmFyIF9vdXQ9Jyc7X291dCs9Jyc7IHRyeSB7IF9vdXQrPScnOyB2YXIgaWQ9Xy5pZDt2YXIgdGFibGU9Xy50YWJsZTt2YXIgaG92ZXI9Xy5ob3Zlcjt2YXIgdGhlYWQ9Xy50aGVhZDt2YXIgdHI9Xy50cjt2YXIgdGg9Xy50aDt2YXIgc2VsZWN0ZWQ9Xy5zZWxlY3RlZDt2YXIgYWxsPV8uYWxsO3ZhciBsYWJlbD1fLmxhYmVsO3ZhciBpbnB1dD1fLmlucHV0O3ZhciB0Ym9keT1fLnRib2R5OyBfb3V0Kz0nPHRhYmxlIGNsYXNzPVwidGFibGUgIHRhYmxlLWhvdmVyIGdlbmVyYWwtdGFibGVcIj4gICAgIDx0aGVhZD4gICAgIDx0cj4gICAgIDx0aD7llYbmiLdJRDwvdGg+ICAgICA8dGg+5ZWG5oi35ZCN56ewPC90aD4gICAgIDx0aD7nirbmgIE8L3RoPiAgICAgPHRoIGNsYXNzPVwiYWktc2VsZWN0ZWQtYWxsXCI+ICAgICAgICAgPGxhYmVsPiAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cIic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIgbmFtZT1cInNlbGVjdF9wcmRcIiBpZD1cInNlbF9wcmRfJztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKGlkKSkgO19vdXQrPSdcIi8+ICAgICAgICAg5YWo6YCJICAgICAgICAgPC9sYWJlbD4gICAgIDwvdGg+ICAgICA8L3RyPiAgICAgPC90aGVhZD4gICAgIDx0Ym9keT4gICAgIDwvdGJvZHk+IDwvdGFibGU+ICAnOyB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9IF9vdXQrPScnO3JldHVybiBfb3V0O1xufTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGp1aWNlci50ZW1wbGF0ZXNbJ3Nob3BfbGlzdF9oZC50bXBsJ107IiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgdGVtcGxhdGUgPSBqdWljZXIudGVtcGxhdGUsIHRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzIHx8IHt9O1xudmFyIHRwbCA9IHRlbXBsYXRlc1snc2hvcF9wZi50bXBsJ10gPSBmdW5jdGlvbihfLCBfbWV0aG9kKSB7X21ldGhvZCA9IGp1aWNlci5vcHRpb25zLl9tZXRob2Q7XG4ndXNlIHN0cmljdCc7dmFyIF89X3x8e307dmFyIF9vdXQ9Jyc7X291dCs9Jyc7IHRyeSB7IF9vdXQrPScnOyB2YXIgbmFtZT1fLm5hbWU7dmFyIGFkZHJlc3M9Xy5hZGRyZXNzO3ZhciB0ZWxlcGhvbmU9Xy50ZWxlcGhvbmU7dmFyIGRpdj1fLmRpdjt2YXIgcHJkPV8ucHJkO3ZhciBib3g9Xy5ib3g7dmFyIHN0PV8uc3Q7dmFyIHBzPV8ucHM7dmFyIGZlZWQ9Xy5mZWVkO3ZhciBiZz1fLmJnO3ZhciBoPV8uaDt2YXIgdWw9Xy51bDt2YXIgcGlsbHM9Xy5waWxsczt2YXIgc3RhY2tlZD1fLnN0YWNrZWQ7dmFyIGxpPV8ubGk7dmFyIHNwYW49Xy5zcGFuOyBfb3V0Kz0nPGRpdiBjbGFzcz1cImFpLXByZC1ib3ggbS1zdC1wc1wiPiAgICAgPGRpdiBjbGFzcz1cInR3dC1mZWVkIGJsdWUtYmdcIj4gICAgICAgICA8aDMgc3R5bGU9XCJkaXNwbGF5OmJsb2NrXCI+ICAgICAgICAgICAgICc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihuYW1lKSkgO19vdXQrPScgICAgICAgICA8L2gzPiAgICAgPC9kaXY+ICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXBpbGxzIG5hdi1zdGFja2VkXCI+ICAgICAgICAgPGxpPjxzcGFuPuWVhuWutuWcsOWdgDo8L3NwYW4+Jztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKGFkZHJlc3MpKSA7X291dCs9JzwvbGk+ICAgICAgICAgPGxpPjxzcGFuPuWVhuWutueUteivnTo8L3NwYW4+Jztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKHRlbGVwaG9uZSkpIDtfb3V0Kz0nPC9saT4gICAgIDwvdWw+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAnOyB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9IF9vdXQrPScnO3JldHVybiBfb3V0O1xufTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGp1aWNlci50ZW1wbGF0ZXNbJ3Nob3BfcGYudG1wbCddOyIsIihmdW5jdGlvbigpIHtcbiAgdmFyIHRlbXBsYXRlID0ganVpY2VyLnRlbXBsYXRlLCB0ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyB8fCB7fTtcbnZhciB0cGwgPSB0ZW1wbGF0ZXNbJ3Nob3BfdGQudG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIHNob3BJZD1fLnNob3BJZDt2YXIgbmFtZT1fLm5hbWU7dmFyIHN0YXR1cz1fLnN0YXR1czt2YXIgaWQ9Xy5pZDt2YXIgdHI9Xy50cjt2YXIgdGQ9Xy50ZDt2YXIgc2hvcF9zdGF0dXM9Xy5zaG9wX3N0YXR1czt2YXIgbGFiZWw9Xy5sYWJlbDt2YXIgaW5wdXQ9Xy5pbnB1dDt2YXIgY2g9Xy5jaDsgX291dCs9Jzx0cj4gICAgIDx0ZD4gICAgICAgICAnO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24oc2hvcElkKSkgO19vdXQrPScgICAgICAgICAgICAgPC90ZD4gICAgIDx0ZD4gICAgICAgICAnO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24obmFtZSkpIDtfb3V0Kz0nICAgICAgICAgICAgIDwvdGQ+ICAgICA8dGQ+Jztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKF9tZXRob2Quc2hvcF9zdGF0dXMuY2FsbCh7fSwgc3RhdHVzKSkpIDtfb3V0Kz0nPC90ZD4gICAgIDx0ZD4gICAgICAgICA8bGFiZWw+ICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImFpLWNoXCIgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCInO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24oaWQpKSA7X291dCs9J1wiIG5hbWU9XCJzZWxlY3RfcHJkXCIgaWQ9XCJzZWxfcHJkXyc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIvPiAgICAgICAgICAgICDpgInmi6kgICAgICAgICA8L2xhYmVsPiAgICAgPC90ZD4gPC90cj4gJzsgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSBfb3V0Kz0nJztyZXR1cm4gX291dDtcbn07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBqdWljZXIudGVtcGxhdGVzWydzaG9wX3RkLnRtcGwnXTsiLCIoZnVuY3Rpb24oKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IGp1aWNlci50ZW1wbGF0ZSwgdGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgfHwge307XG52YXIgdHBsID0gdGVtcGxhdGVzWydzdWJqZWN0X2l0ZW0udG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIGtleT1fLmtleTt2YXIgZGl2PV8uZGl2O3ZhciBzdWJqZWN0PV8uc3ViamVjdDt2YXIgc2VjdGlvbj1fLnNlY3Rpb247dmFyIGxnPV8ubGc7dmFyIGhlYWRpbmc9Xy5oZWFkaW5nO3ZhciBzcGFuPV8uc3Bhbjt2YXIgdG9vbHM9Xy50b29sczt2YXIgcmlnaHQ9Xy5yaWdodDt2YXIgYT1fLmE7dmFyIHRpbWVzPV8udGltZXM7dmFyIHN0PV8uc3Q7dmFyIGRlbD1fLmRlbDt2YXIgYm9keT1fLmJvZHk7dmFyIG5hdj1fLm5hdjt2YXIgcHM9Xy5wczt2YXIgYm94PV8uYm94O3ZhciBmb3JtPV8uZm9ybTt2YXIgaG9yaXpvbnRhbD1fLmhvcml6b250YWw7dmFyIGdyb3VwPV8uZ3JvdXA7dmFyIHJvdz1fLnJvdzt2YXIgaXRlbT1fLml0ZW07dmFyIHRpdGxlPV8udGl0bGU7dmFyIGxhYmVsPV8ubGFiZWw7dmFyIHNtPV8uc207dmFyIGlucHV0PV8uaW5wdXQ7dmFyIGNvbnRyb2w9Xy5jb250cm9sO3ZhciBzdWI9Xy5zdWI7dmFyIGFkZD1fLmFkZDt2YXIgYnRucz1fLmJ0bnM7dmFyIHR5cGU9Xy50eXBlO3ZhciBpPV8uaTt2YXIgZmlsZT1fLmZpbGU7dmFyIHRleHQ9Xy50ZXh0O3ZhciBwPV8ucDt2YXIgaW1nPV8uaW1nO3ZhciBwaWN0dXJlPV8ucGljdHVyZTt2YXIgbz1fLm87dmFyIGl0ZW1zPV8uaXRlbXM7dmFyIGNvbnRlbnQ9Xy5jb250ZW50O3ZhciBidXR0b249Xy5idXR0b247dmFyIHByaW1hcnk9Xy5wcmltYXJ5O3ZhciBzdWJtaXQ9Xy5zdWJtaXQ7IF9vdXQrPScgPGRpdiBjbGFzcz1cInJvdyBtLXN1YmplY3Qtc2VjdGlvblwiPiAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMlwiPiAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBjbGVhcmZpeFwiPiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibS10b29scyBwdWxsLXJpZ2h0XCI+ICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZmEgZmEtdGltZXMgYWktc3QtZGVsXCI+PC9hPiAgICAgICAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgICAgICAgICAgICc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihrZXkpKSA7X291dCs9J+WGheWuueaooeWdlyAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+ICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTRcIj4gICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInBhbmVsIHByb2ZpbGUtbmF2IGFpLXBzLWJveFwiID4gICAgICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+ICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04XCI+ICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwiZm9ybS1ob3Jpem9udGFsIGJ1Y2tldC1mb3JtXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBhaS1yb3cgbS1zdWJqZWN0LWl0ZW0tdGl0bGVcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtc20tMiBjb250cm9sLWxhYmVsIFwiPuWkp+agh+mimDwvbGFiZWw+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS04XCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGFpLXN0LXRpdGxlXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBhaS1yb3cgbS1zdWJqZWN0LWl0ZW0tdGl0bGUgbS1zdWItdGl0bGUgaGlkZVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbC1zbS0yIGNvbnRyb2wtbGFiZWwgXCI+5Ymv5qCH6aKYPC9sYWJlbD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLThcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgYWktc3ViLXRpdGxlXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBhaS1yb3cgXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMlwiID4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tc3QtYWRkLWJ0bnMgYWktYWRkLWJ0bnNcIiA+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYWRkLXRpdGxlXCIgZGF0YS10eXBlPVwiMVwiPjxpIGNsYXNzPVwiZmEgZmEtZmlsZS10ZXh0XCI+PC9pPua3u+WKoOWwj+agh+mimDwvYT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhZGQtcFwiIGRhdGEtdHlwZT1cIjJcIj48aSBjbGFzcz1cImZhIGZhLWZpbGUtdGV4dFwiPjwvaT7mt7vliqDmrrXokL08L2E+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYWRkLWltZ1wiIGRhdGEtdHlwZT1cIjNcIj48aSBjbGFzcz1cImZhIGZhLXBpY3R1cmUtb1wiPjwvaT7mt7vliqDlm77niYc8L2E+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tc3ViamVjdC1pdGVtcyBhaS1jb250ZW50LWl0ZW1cIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3ViamVjdC1pdGVtLWJ0bnNcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBhaS1zdWJtaXRcIj7kv53lrZg8L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+ICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgIDwvZGl2PiAgICAgIDwvZGl2PiA8L2Rpdj4gICAnOyB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9IF9vdXQrPScnO3JldHVybiBfb3V0O1xufTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGp1aWNlci50ZW1wbGF0ZXNbJ3N1YmplY3RfaXRlbS50bXBsJ107IiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgdGVtcGxhdGUgPSBqdWljZXIudGVtcGxhdGUsIHRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzIHx8IHt9O1xudmFyIHRwbCA9IHRlbXBsYXRlc1sndGl0bGVfY29udGVudC50bXBsJ10gPSBmdW5jdGlvbihfLCBfbWV0aG9kKSB7X21ldGhvZCA9IGp1aWNlci5vcHRpb25zLl9tZXRob2Q7XG4ndXNlIHN0cmljdCc7dmFyIF89X3x8e307dmFyIF9vdXQ9Jyc7X291dCs9Jyc7IHRyeSB7IF9vdXQrPScnOyB2YXIgZGl2PV8uZGl2O3ZhciBncm91cD1fLmdyb3VwO3ZhciByb3c9Xy5yb3c7dmFyIGxhYmVsPV8ubGFiZWw7dmFyIHNtPV8uc207dmFyIGlucHV0PV8uaW5wdXQ7dmFyIGNvbnRyb2w9Xy5jb250cm9sO3ZhciBidG5zPV8uYnRuczt2YXIgYT1fLmE7dmFyIGRlbD1fLmRlbDt2YXIgaT1fLmk7dmFyIHRpbWVzPV8udGltZXM7IF9vdXQrPScgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgYWktcm93XCI+ICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtc20tMiBjb250cm9sLWxhYmVsXCI+5bCP5qCH6aKYPC9sYWJlbD4gICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPiAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+ICAgICA8L2Rpdj4gICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNCBhZGQtYnRuc1wiID4gICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYWRkLWRlbFwiID48aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPuWIoOmZpDwvYT4gICAgIDwvZGl2PiA8L2Rpdj4gICAnOyB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9IF9vdXQrPScnO3JldHVybiBfb3V0O1xufTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGp1aWNlci50ZW1wbGF0ZXNbJ3RpdGxlX2NvbnRlbnQudG1wbCddOyJdfQ==
