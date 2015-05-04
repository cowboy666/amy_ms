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
var $ = window.jQuery;
module.exports = $;

},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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

},{"../lib/cookies":1}],8:[function(require,module,exports){
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



},{"../lib/idialog":3}],9:[function(require,module,exports){
var gl = require("./shop_sys/group_list.js");
$(function(){
    $("#op-label").addClass("active");
    gl.init();
});

},{"./shop_sys/group_list.js":10}],10:[function(require,module,exports){
require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pop = require("../../mod/pop.js");


var GL = {
    init : function(){
       var me = this;
       this.$add_group_txt = $("#add_group_txt"); 
       this.$add_label_txt = $("#add_label_txt"); 
       this.$add_group = $("#add_group"); 
       this.$add_label = $("#add_label"); 
       this.$groups = $("#groups"); 
       this.$labels = $("#labels");

       this.$add_group.click(function(){
           var g_txt = $.trim(me.$add_group_txt.val());
           if (g_txt) {
              me.add_group(g_txt);
           }
       });
       this.$add_label.click(function(){
           var g_txt = $.trim(me.$add_label_txt.val());
           if (g_txt) {
              me.add_label(g_txt);
           }
       });
       this.load_group();
       this.$groups.delegate("li","click",function(){
           var type_id = this.getAttribute("data-id");
           me.load_label(type_id);
           me.$groups.find("li").removeClass("active");
           $(this).addClass("active");
       });
       this.$labels.delegate(".del","click",function(e){
           e.preventDefault();
           var $li = $(this).closest("li");
           var txt = $(this).closest("li").find("span").text();
           var id =  $(this).closest("li").data("id");
           
           pop.confirm("确认删除"+txt+"吗？",function(){
              me.del_label(id,$li); 
           });
       });
        this.$groups.delegate(".del","click",function(e){
           e.preventDefault();
           var $li = $(this).closest("li");
           var txt = $(this).closest("li").text();
           var id =  $(this).closest("li").data("id");
           
           pop.confirm("确认删除"+txt+"吗？",function(){
              me.del_label(id,$li); 
           });
       });
    },
    del_group : function(id,dom){
        http.post({
            url : "/api/deleteProductType.htm",
            data : {
                id : id
            }
        }).done(function(){
            dom.remove();
        }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
        })

    },
    del_label : function(id,dom){
        http.post({
            url : "/api/deleteProductLabel.htm",
            data : {
                id : id
            }
        }).done(function(){
            dom.remove();
        }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
        })
    },
    add_group : function(txt){
       var me = this;
       http.post({
        url : "/api/addProductType.htm",
        data :{
            name : txt
        } 
       }).done(function(rs){
          var productType = rs.productType;
          if (productType && productType.id) {
                me.$groups.find("li").removeClass("active");
                me.$groups.append('<li class="list-group-item active" data-id="'+productType.id+'"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a>'+productType.name+'</li>');          
                me.load_label(productType.id);
          } else {
                pop.alert("添加失败，请刷新重试")
          }
       }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
       })
    },
    add_label : function(name){
       var me = this;
       http.post({
        url : "/api/addProductLabel.htm",
        data :{
            name : name,
            typeId : me._cur_typeid
        } 
       }).done(function(rs){
          me.$labels.append('<li class="list-group-item"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a><span>'+name+'</span></li>');          
       }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
       })
 
    },
    load_group : function(){
       var me = this;
       http.get({
          url : "/api/getProductType.htm"
       }).done(function(rs){
           var data = rs.data || [];
           var html = _.map(data,function(d){
               return '<li class="list-group-item" data-id="'+d.id+'"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a>'+d.name+'</li>';
           }).join("");
           if (data[0]) {
               me.load_label(data[0].id);
           }
           me.$groups.html(html);
           me.$groups.find("li").eq(0).addClass("active");
       })
    },
    render_gr : function(data){
        
    },
    load_label : function(id){
       var me = this;
       me._cur_typeid = id;
       http.get({
          url : "/api/getProductLabel.htm",
          data : {
            typeId : id
          }
       }).done(function(rs){
           var data = rs.data || [];
           var html = _.map(data,function(d){
               return '<li class="list-group-item" data-id="'+d.id+'"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a><span>'+d.name+'</span></li>';
           }).join("");
           me.$labels.html(html);
       }) 
    },
    render_la : function(){
        
    }
};

module.exports = GL;

},{"../../lib/jquery.js":4,"../../lib/juicer.js":5,"../../lib/lodash.compat.min.js":6,"../../mod/http.js":7,"../../mod/pop.js":8}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9jb29raWVzLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2licm93c2VyLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2lkaWFsb2cuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanF1ZXJ5LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2p1aWNlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9sb2Rhc2guY29tcGF0Lm1pbi5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL21vZC9odHRwLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbW9kL3BvcC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2UvZmFrZV80MTQxYTMzMi5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2Uvc2hvcF9zeXMvZ3JvdXBfbGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGRvY0Nvb2tpZSA9IChmdW5jdGlvbih1bmRlZmluZWQpIHtcbiAgLypcXFxuICB8KnxcbiAgfCp8ICA6OiBjb29raWVzLmpzIDo6XG4gIHwqfFxuICB8KnwgIEEgY29tcGxldGUgY29va2llcyByZWFkZXIvd3JpdGVyIGZyYW1ld29yayB3aXRoIGZ1bGwgdW5pY29kZSBzdXBwb3J0LlxuICB8KnxcbiAgfCp8ICBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0RPTS9kb2N1bWVudC5jb29raWVcbiAgfCp8XG4gIHwqfCAgVGhpcyBmcmFtZXdvcmsgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBQdWJsaWMgTGljZW5zZSwgdmVyc2lvbiAzIG9yIGxhdGVyLlxuICB8KnwgIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLXN0YW5kYWxvbmUuaHRtbFxuICB8KnxcbiAgfCp8ICBTeW50YXhlczpcbiAgfCp8XG4gIHwqfCAgKiBkb2NDb29raWVzLnNldEl0ZW0obmFtZSwgdmFsdWVbLCBlbmRbLCBwYXRoWywgZG9tYWluWywgc2VjdXJlXV1dXSlcbiAgfCp8ICAqIGRvY0Nvb2tpZXMuZ2V0SXRlbShuYW1lKVxuICB8KnwgICogZG9jQ29va2llcy5yZW1vdmVJdGVtKG5hbWVbLCBwYXRoXSwgZG9tYWluKVxuICB8KnwgICogZG9jQ29va2llcy5oYXNJdGVtKG5hbWUpXG4gIHwqfCAgKiBkb2NDb29raWVzLmtleXMoKVxuICB8KnxcbiAgXFwqL1xuXG4gIHZhciBkb2NDb29raWVzID0ge1xuICAgIGdldEl0ZW06IGZ1bmN0aW9uIChzS2V5KSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoPzooPzpefC4qOylcXFxccypcIiArIGVuY29kZVVSSUNvbXBvbmVudChzS2V5KS5yZXBsYWNlKC9bXFwtXFwuXFwrXFwqXS9nLCBcIlxcXFwkJlwiKSArIFwiXFxcXHMqXFxcXD1cXFxccyooW147XSopLiokKXxeLiokXCIpLCBcIiQxXCIpKSB8fCBudWxsO1xuICAgIH0sXG4gICAgc2V0SXRlbTogZnVuY3Rpb24gKHNLZXksIHNWYWx1ZSwgdkVuZCwgc1BhdGgsIHNEb21haW4sIGJTZWN1cmUpIHtcbiAgICAgIGlmICghc0tleSB8fCAvXig/OmV4cGlyZXN8bWF4XFwtYWdlfHBhdGh8ZG9tYWlufHNlY3VyZSkkL2kudGVzdChzS2V5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIHZhciBzRXhwaXJlcyA9IFwiXCI7XG4gICAgICBpZiAodkVuZCkge1xuICAgICAgICBzd2l0Y2ggKHZFbmQuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICBjYXNlIE51bWJlcjpcbiAgICAgICAgICAgIHNFeHBpcmVzID0gdkVuZCA9PT0gSW5maW5pdHkgPyBcIjsgZXhwaXJlcz1GcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IEdNVFwiIDogXCI7IG1heC1hZ2U9XCIgKyB2RW5kO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBTdHJpbmc6XG4gICAgICAgICAgICBzRXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgdkVuZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRGF0ZTpcbiAgICAgICAgICAgIHNFeHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyB2RW5kLnRvVVRDU3RyaW5nKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuY29va2llID0gZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoc1ZhbHVlKSArIHNFeHBpcmVzICsgKHNEb21haW4gPyBcIjsgZG9tYWluPVwiICsgc0RvbWFpbiA6IFwiXCIpICsgKHNQYXRoID8gXCI7IHBhdGg9XCIgKyBzUGF0aCA6IFwiXCIpICsgKGJTZWN1cmUgPyBcIjsgc2VjdXJlXCIgOiBcIlwiKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cblxuICAgIHJlbW92ZUl0ZW06IGZ1bmN0aW9uIChzS2V5LCBzUGF0aCwgc0RvbWFpbikge1xuICAgICAgaWYgKCFzS2V5IHx8ICF0aGlzLmhhc0l0ZW0oc0tleSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBlbmNvZGVVUklDb21wb25lbnQoc0tleSkgKyBcIj07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVRcIiArICggc0RvbWFpbiA/IFwiOyBkb21haW49XCIgKyBzRG9tYWluIDogXCJcIikgKyAoIHNQYXRoID8gXCI7IHBhdGg9XCIgKyBzUGF0aCA6IFwiXCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBoYXNJdGVtOiBmdW5jdGlvbiAoc0tleSkge1xuICAgICAgcmV0dXJuIChuZXcgUmVnRXhwKFwiKD86Xnw7XFxcXHMqKVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICsgXCJcXFxccypcXFxcPVwiKSkudGVzdChkb2N1bWVudC5jb29raWUpO1xuICAgIH0sXG4gICAga2V5czogLyogb3B0aW9uYWwgbWV0aG9kOiB5b3UgY2FuIHNhZmVseSByZW1vdmUgaXQhICovIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhS2V5cyA9IGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKC8oKD86XnxcXHMqOylbXlxcPV0rKSg/PTt8JCl8Xlxccyp8XFxzKig/OlxcPVteO10qKT8oPzpcXDF8JCkvZywgXCJcIikuc3BsaXQoL1xccyooPzpcXD1bXjtdKik/O1xccyovKTtcbiAgICAgIGZvciAodmFyIG5JZHggPSAwOyBuSWR4IDwgYUtleXMubGVuZ3RoOyBuSWR4KyspIHsgYUtleXNbbklkeF0gPSBkZWNvZGVVUklDb21wb25lbnQoYUtleXNbbklkeF0pOyB9XG4gICAgICByZXR1cm4gYUtleXM7XG4gICAgfVxuICB9O1xuICByZXR1cm4gZG9jQ29va2llcztcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9ICBkb2NDb29raWU7XG5cbiIsIi8v5rWP6KeI5Zmo5Yik5patXG52YXIgdWEgID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSxcbiAgICBjaGVjayA9IGZ1bmN0aW9uKHIpe1xuICAgICAgICByZXR1cm4gci50ZXN0KHVhKTtcbiAgICB9O1xudmFyIGlzT3BlcmEgID0gIGNoZWNrKC9vcGVyYS8pLFxuICAgIGlzQ2hyb21lID0gY2hlY2soL1xcYmNocm9tZVxcYi8pLFxuICAgIGlzV2ViS2l0ID0gY2hlY2soL3dlYmtpdC8pLFxuICAgIGlzU2FmYXJpID0gIWlzQ2hyb21lICYmIGlzV2ViS2l0LFxuICAgIGlzSUUgICAgID0gY2hlY2soL21zaWUvKSAmJiBkb2N1bWVudC5hbGwgJiYgIWlzT3BlcmEsXG4gICAgaXNJRTcgICAgPSBjaGVjaygvbXNpZSA3LyksXG4gICAgaXNJRTggICAgPSBjaGVjaygvbXNpZSA4LyksXG4gICAgaXNJRTkgICAgPSBjaGVjaygvbXNpZSA5LyksXG4gICAgaXNJRTEwICAgID0gY2hlY2soL21zaWUgMTAvKSxcbiAgICBpc0lFNiAgICA9IGlzSUUgJiYgIWlzSUU3ICYmICFpc0lFOCAmJiAhaXNJRTkgJiYgIWlzSUUxMCxcbiAgICBpc0lFMTEgICA9IGNoZWNrKC90cmlkZW50LykgJiYgdWEubWF0Y2goL3J2OihbXFxkLl0rKS8pP3RydWU6ZmFsc2UsXG4gICAgaXNHZWNrbyAgPSBjaGVjaygvZ2Vja28vKSAmJiAhaXNXZWJLaXQsXG4gICAgaXNNYWMgICAgPSBjaGVjaygvbWFjLyk7XG5cbnZhciBCcm93c2VyID0ge1xuICAgIGlzT3BlcmEgOiBpc09wZXJhLFxuICAgIGlzQ2hyb21lIDogaXNDaHJvbWUsXG4gICAgaXNXZWJLaXQgOiBpc1dlYktpdCxcbiAgICBpc1NhZmFyaSA6IGlzU2FmYXJpLFxuICAgIGlzSUUgICAgIDogaXNJRSxcbiAgICBpc0lFNyAgICA6IGlzSUU3LFxuICAgIGlzSUU4ICAgIDogaXNJRTgsXG4gICAgaXNJRTkgICAgOiBpc0lFOSxcbiAgICBpc0lFNiAgICA6IGlzSUU2LFxuICAgIGlzSUUxMSAgICA6aXNJRTExLFxuICAgIGlzR2Vja28gIDogaXNHZWNrbyxcbiAgICBpc01hYyAgICA6IGlzTWFjXG59O1xubW9kdWxlLmV4cG9ydHMgPSBCcm93c2VyO1xuIiwidmFyIEJyb3dzZXIgPSByZXF1aXJlKFwiLi9pYnJvd3NlclwiKTtcclxudmFyIERpYWxvZyAgPSAoZnVuY3Rpb24oJCx3aW5kb3cpe1xyXG5cdFx0dmFyIF9pc0lFICA9IEJyb3dzZXIuaXNJRSxcclxuXHRcdCAgICBfaXNJRTYgPSBCcm93c2VyLmlzSUU2LFxyXG5cdFx0XHQkZG9jICAgPSAkKHdpbmRvdy5kb2N1bWVudCksXHJcblx0XHRcdCRib2R5ICA9ICQoJ2JvZHknKSxcclxuXHRcdFx0JHdpbiAgID0gJCh3aW5kb3cpOyBcclxuICAgICAgICB2YXIgSUU2X0xFRlRfT0ZGU0VUID0gMTY7IC8vSUU25LiL5ruR5Yqo5p2h55qE5a695bqmXHJcblx0XHR2YXIgX2lzTWFjID0gQnJvd3Nlci5pc01hYztcclxuXHRcdHZhciBoYXNTY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICAvL+mYsuatouW8leeUqEpT5paH5Lu25ZyoaGVhZCDph4zlj5bkuI3liLBib2R5XHJcbiAgICAgICAgaWYgKCEkYm9keVswXSkge1xyXG4gICAgICAgICAgICAkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkYm9keSA9ICAkKCdib2R5Jyk7IFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/og4zmma8g5YmN5pmvIFxyXG5cdFx0dmFyIGRsZ19tYXNrX2h0bWwgPSAnPGRpdiBjbGFzcz1cImctcG9wLWJnXCI+PC9kaXY+JyxcclxuXHRcdFx0ZGxnX2JveF9odG1sID0gJzxkaXYgY2xhc3M9XCJnX2RsZ19ib3ggZy1wb3BcIj48L2Rpdj4nO1xyXG5cclxuXHRcdHZhciBkbGdpZCA9IFwiZGxnXCIsXHJcbiAgICAgICAgICAgIG1pZHM9MCAsIFxyXG4gICAgICAgICAgICBpZHMgPSAwLFxyXG5cdFx0XHRfZF96aW5kZXggPSAxMDAwMDA7XHJcblxyXG5cdFx0dmFyIGRlZl9jb25maWcgPSB7XHJcblx0XHRcdGNvbnRlbnQ6JycsXHJcblx0XHRcdG1hc2tWaXNpYmxlIDogdHJ1ZSxcclxuXHRcdFx0dG9wOjAsXHJcblx0XHRcdGxlZnQ6MCxcclxuXHRcdFx0d2lkdGg6MCxcclxuXHRcdFx0aGVpZ2h0OjAsXHJcblx0XHRcdG5ld01hc2sgOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFN0eWxlIDogXCJcIixcclxuXHRcdFx0Ym9yZGVyU3R5bGUgOlwiXCIsICAvLyBib3JkZXLmoLflvI8gXHJcblx0XHRcdHRpdGxlU3R5bGUgOiBcIlwiLCAvL+agh+mimOagt+W8j1xyXG5cdFx0XHRjbG9zZUNscyAgOiBcIlwiLCAvL+WFs+mXreaMiemSriBjbGFzcyDlpoLmnpzmnInkvJrmm7/mjaLmjokg5Y6f5p2l55qEIGRsZ19jbG9zZSBcclxuICAgICAgICAgICAgY2xvc2VfZm4gOiBmdW5jdGlvbigpe30sXHJcblx0XHRcdGhpZGVDbG9zZUJ0bjogZmFsc2VcclxuXHRcdH07XHJcblx0XHQvLyBtaXggY29uZmlnIHNldHRpbmcuXHJcblx0XHR2YXIgbWl4X2NmZyA9IGZ1bmN0aW9uKG4sIGQpIHtcclxuXHRcdFx0dmFyIGNmZyA9IHt9LFxyXG5cdFx0XHRcdGk7XHJcblx0XHRcdGZvciAoaSBpbiBkKSB7XHJcblx0XHRcdFx0aWYgKGQuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuXHRcdFx0XHRcdGNmZ1tpXSA9IHR5cGVvZiBuW2ldICE9PSAndW5kZWZpbmVkJyA/IG5baV0gOiBkW2ldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gY2ZnO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGdldFdpblJlY3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciB3aW4gPSAkd2luO1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRzY3JvbGxUb3AgOiAgJGRvYy5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRcdHNjcm9sbExlZnQgOiAkZG9jLnNjcm9sbExlZnQoKSxcclxuXHRcdFx0XHRcdHdpZHRoIDogd2luLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogd2luLmhlaWdodCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLy93aWR0aDogd2luWzBdLmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsXHJcblx0XHRcdFx0XHQvL2hlaWdodDogd2luWzBdLmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHRcclxuXHRcdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgX21hc2tfaWQgPSBcImRsZ19tYXNrX1wiO1xyXG5cdFx0dmFyIE1hc2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0ICAgIHRoaXMuaWQgPSBfbWFza19pZCsoKyttaWRzKTtcclxuXHRcdFx0dGhpcy5fZG9tID0gJCgnPGRpdiBpZD1cIicrKHRoaXMuaWQpKydcIiBjbGFzcz1cImctcG9wLWJnXCIgc3R5bGU9XCJ6LWluZGV4OicrKCsrX2RfemluZGV4KSsnXCI+PC9kaXY+Jyk7XHJcblx0XHRcdHRoaXMuX2luaXQoKTtcclxuXHRcdH07XHJcblx0IFx0TWFzay5wcm90b3R5cGUgPSB7XHJcblx0XHRcdF9pbml0IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkYm9keS5hcHBlbmQodGhpcy5fZG9tKTtcclxuXHRcdFx0XHR0aGlzLl9kb20uaGlkZSgpO1xyXG5cdFx0XHRcdHRoaXMuX2luaXRFdmVudHMoKTtcclxuXHRcdFx0XHR0aGlzLmFkYXB0V2luKCk7XHJcblx0XHRcdFx0aWYodGhpcy5fbmVlZElmcmFtZSgpKXtcclxuXHRcdFx0XHRcdHRoaXMuX2NyZWF0ZUlmcmFtZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdF9pbml0RXZlbnRzIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRfY3JlYXRlSWZyYW1lOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHRoaXMuX2lmcmFtZSA9ICQoJzxpZnJhbWUgY2xhc3M9XCJkbGdfbWlmcmFtZVwiIGZyYW1lYm9yZGVyPVwiMFwiIHNyYz1cImFib3V0OmJsYW5rXCI+PC9pZnJhbWU+Jyk7XHJcblx0XHRcdFx0dGhpcy5fZG9tLmFwcGVuZCh0aGlzLl9pZnJhbWUpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhZGRDbGFzcyA6IGZ1bmN0aW9uKCBjbHNOYW1lKXtcclxuXHRcdFx0XHR0aGlzLl9kb20uYWRkQ2xhc3MoY2xzTmFtZSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiDmo4DmtYvoh6rliqjnlJ/miJBpZnJhbWXmnaHku7ZcclxuXHRcdFx0ICpcclxuXHRcdFx0ICogQG1ldGhvZFxyXG5cdFx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHRcdCAqIEBwYXJhbSB2b2lkXHJcblx0XHRcdCAqIEByZXR1cm4ge2Jvb2x9XHJcblx0XHRcdCAqL1xyXG5cdFx0XHRfbmVlZElmcmFtZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB1c2VJZnJhbWUgPSAhIXdpbmRvdy5BY3RpdmVYT2JqZWN0XHJcblx0XHRcdFx0XHRcdFx0XHQmJiAoKF9pc0lFNiAmJiAkKCdzZWxlY3QnKS5sZW5ndGgpXHJcblx0XHRcdFx0XHRcdFx0XHR8fCAkKCdvYmplY3QnKS5sZW5ndGgpO1xyXG5cdFx0XHRcdHJldHVybiB1c2VJZnJhbWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFkYXB0V2luIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZihfaXNJRTYpe1xyXG5cdFx0XHRcdFx0dGhpcy5fZG9tLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA6ICRkb2Muc2Nyb2xsVG9wKCksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IDogJGRvYy5zY3JvbGxMZWZ0KCksXHJcblx0XHRcdFx0XHRcdGhlaWdodDogJHdpbi5oZWlnaHQoKSxcclxuXHRcdFx0XHRcdFx0d2lkdGg6ICR3aW4ud2lkdGgoKVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaWRlIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGlzLl9kb20uaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWxfZG9tID0gJCgnaHRtbCcpLmNzcyhcIm92ZXJmbG93XCIsXCJcIik7XHJcblx0XHRcdFx0aWYoX2lzTWFjID09IGZhbHNlIHx8IDEpe1xyXG5cdFx0XHRcdFx0aWYoaGFzU2Nyb2xsKXtcclxuXHQgICAgICAgICAgICAgICAgICAgIGh0bWxfZG9tLmNzcyhcInBhZGRpbmctcmlnaHRcIixcIjBweFwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHNob3cgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcclxuXHRcdFx0XHR2YXIgd2EgPSAkd2luLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbF9kb20gPSAkKCdodG1sJykuY3NzKFwib3ZlcmZsb3dcIixcImhpZGRlblwiKTtcclxuXHRcdFx0XHR2YXIgd2IgPSAkd2luLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICBtZS5fZG9tLnNob3coKTtcclxuXHRcdFx0XHRpZihfaXNNYWMgPT0gZmFsc2UgfHwgMSl7XHJcblx0XHRcdFx0XHRpZih3YSAhPSB3Yil7XHJcblx0XHRcdFx0XHRcdGhhc1Njcm9sbCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGh0bWxfZG9tLmNzcyhcInBhZGRpbmctcmlnaHRcIixJRTZfTEVGVF9PRkZTRVQrXCJweFwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldERvbSA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2RvbTtcclxuXHRcdFx0fSxcclxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBtb3N0X21hc2s7IC8v5YWs5YWx55qETWFza1xyXG5cdFx0dmFyIERpYWxvZyA9ICBmdW5jdGlvbihjZmcpe1xyXG5cdFx0XHR2YXIgYyA9IGNmZyB8fCB7fTtcclxuXHRcdFx0dGhpcy5jb25maWcgPSAgbWl4X2NmZyhjLGRlZl9jb25maWcpO1xyXG5cdFx0XHR0aGlzLl9pbml0KCk7XHJcblx0XHR9XHJcblx0XHREaWFsb2cucHJvdG90eXBlID0ge1xyXG5cdFx0XHRjb25zdHJ1Y3RvciA6IERpYWxvZyxcclxuXHRcdFx0X2luaXQgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmKCF0aGlzLmNvbmZpZyl7XHJcblx0XHRcdFx0XHRyZXR1cm4gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLmlkID0gZGxnaWQgKygrK2lkcyk7XHJcblx0XHRcdFx0dmFyIGNmZyA9ICB0aGlzLmNvbmZpZztcclxuXHJcblx0XHRcdFx0aWYoY2ZnLm5ld01hc2spe1xyXG5cdFx0XHRcdFx0dGhpcy5fbWFzayA9ICBuZXcgTWFzaygpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0aWYoIW1vc3RfbWFzayl7XHJcblx0XHRcdFx0XHRcdG1vc3RfbWFzayA9ICBuZXcgTWFzaygpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9tYXNrID0gbW9zdF9tYXNrO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHRoaXMuX21hc2sgPSAgbW9zdF9tYXNrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9jcmVhdERpYWxvZygpO1xyXG5cdFx0XHRcdHRoaXMuX2luaXRFdmVudHMoKTtcclxuXHRcdFx0XHR0aGlzLmluaXRlZCA9IHRydWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdF9pbml0RXZlbnRzIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbWUgPSB0aGlzLGlkPXRoaXMuaWQ7XHJcblxyXG5cdFx0XHRcdHRoaXMuX2Nsb3NlQnRuLmJpbmQoe1xyXG5cdFx0XHRcdFx0Y2xpY2sgOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0XHRtZS5jb25maWcuY2xvc2VfZm4uY2FsbChtZSxtZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0JHdpbi5iaW5kKFwicmVzaXplLlwiK2lkLHJlc2l6ZSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0bWUuX3VuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHQkd2luLnVuYmluZChcInJlc2l6ZS5cIitpZCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiByZXNpemUoKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX2lzSUU2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kbGdfY29udGFpbmVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3AgOiAkZG9jLnNjcm9sbFRvcCgpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgOiAkZG9jLnNjcm9sbExlZnQoKSxcclxuXHRcdFx0XHRcdFx0ICAgIHdpZHRoIDogJHdpbi53aWR0aCgpLFxyXG5cdFx0XHRcdFx0XHQgICAgaGVpZ2h0IDogJHdpbi5oZWlnaHQoKVxyXG5cdFx0XHRcdFx0ICAgIH0pO1xyXG4gIFxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kbGdfY29udGFpbmVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6ICR3aW4ud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCA6ICR3aW4uaGVpZ2h0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdFx0bWUudG9DZW50ZXIoKTtcclxuXHRcdFx0XHRcdG1lLl9tYXNrLmFkYXB0V2luKCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSxcclxuXHRcdFx0X2NyZWF0RGlhbG9nIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgY2ZnID0gdGhpcy5jb25maWc7XHJcblx0XHRcdFx0dmFyIGRsZ19jb250YWluZXIgPSB0aGlzLl9kbGdfY29udGFpbmVyID0gJChkbGdfYm94X2h0bWwpLmF0dHIoXCJpZFwiLHRoaXMuaWQpLmNzcyhcInotaW5kZXhcIiwoX2RfemluZGV4ICs9IDEwKSk7XHJcblx0XHRcdFx0aWYoY2ZnLmNvbnRlbnQgaW5zdGFuY2VvZiAkKXtcclxuXHRcdFx0XHRcdHRoaXMuX2RpYWxvZyA9IGNmZy5jb250ZW50O1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dGhpcy5fZGlhbG9nID0gJChjZmcuY29udGVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBkbGcgPSB0aGlzLl9kaWFsb2c7XHJcblx0XHRcdFx0ZGxnLmFkZENsYXNzKFwiZ19kbGdfd3JhcF9jc3MzXCIpO1x0XHJcblx0XHRcdFx0ZGxnX2NvbnRhaW5lci5odG1sKGRsZyk7XHJcblx0XHRcdFx0dGhpcy5fY29udGVudCA9ICQoXCIuanNfY29udGVudFwiLGRsZyk7XHJcblx0XHRcdFx0dGhpcy5fY2xvc2VCdG4gPSAkKCcuanNfY2xvc2UnLGRsZyk7XHJcblx0XHRcdFx0JGJvZHkuYXBwZW5kKGRsZ19jb250YWluZXIpO1xyXG5cclxuXHRcdFx0XHRpZihjZmcuaGlkZUNsb3NlQnRuKXtcclxuXHRcdFx0XHRcdHRoaXMuX2Nsb3NlQnRuLmhpZGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIHBvcyA9ICBcImZpeGVkXCI7XHJcblx0XHRcdFx0aWYoX2lzSUU2KXtcclxuXHRcdFx0XHRcdGRsZ19jb250YWluZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wIDogJGRvYy5zY3JvbGxUb3AoKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgOiAkZG9jLnNjcm9sbExlZnQoKSxcclxuXHRcdFx0XHRcdFx0d2lkdGggOiAkd2luLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdGhlaWdodCA6ICR3aW4uaGVpZ2h0KClcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cG9zID0gXCJhYnNvdWx0ZVwiO1xyXG5cdFx0XHQgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkbGdfY29udGFpbmVyLmNzcyh7XHJcblx0XHRcdFx0XHRcdHdpZHRoIDogJHdpbi53aWR0aCgpLFxyXG5cdFx0XHRcdFx0XHRoZWlnaHQgOiAkd2luLmhlaWdodCgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkbGcuY3NzKFwicG9zaXRpb25cIixcImFic29sdXRlXCIpO1xyXG5cdFx0XHRcdHRoaXMuc2V0UG9zKHBvcyk7XHRcdFx0XHRcclxuXHRcdFx0XHQvL3RoaXMudG9DZW50ZXIoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0UG9zIDogZnVuY3Rpb24ocG9zKXtcclxuXHRcdFx0XHR0aGlzLl9kbGdfY29udGFpbmVyLmNzcyhcInBvc2l0aW9uXCIscG9zKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Ly/lvpfliLBjb250ZW50IOi/lOWbnmpRdWVyeSDlr7nosaFcclxuXHRcdFx0Z2V0Q29udGFpbmVyIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZGxnX2NvbnRhaW5lcjtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0Q29udGVudCA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRlbnQ7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldENvbnRlbnQgOiBmdW5jdGlvbihkb20pe1xyXG5cdFx0XHRcdHRoaXMuX2NvbnRlbnQuZW1wdHkoKTtcclxuXHRcdFx0XHR0aGlzLl9jb250ZW50Lmh0bWwoZG9tKTtcdFxyXG5cdFx0XHR9LFxyXG4gICAgICAgICAgICBnZXREbGdEb20gOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kaWFsb2c7IFxyXG4gICAgICAgICAgICB9LFxyXG5cdFx0XHRnZXRDbG9zZUJ0biA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2Nsb3NlQnRuO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRfc2V0U3R5bGUgOiBmdW5jdGlvbihkb20sY3NzKXtcclxuXHRcdFx0XHRpZih0eXBlb2YgY3NzID09IFwic3RyaW5nXCIpe1xyXG5cdFx0XHRcdFx0aWYoX2lzSUUpe1xyXG5cdFx0XHRcdFx0XHRkb21bMF0uc3R5bGUuY3NzVGV4dCA9IGNzcztcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRkb20uYXR0cihcInN0eWxlXCIsY3NzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGRvbS5jc3MoY3NzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHRvQ2VudGVyIDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgd2luUmVjdCA9ICBnZXRXaW5SZWN0KCksXHJcblx0XHRcdFx0XHR3ID0gdGhpcy5fZGlhbG9nLndpZHRoKCksXHJcblx0XHRcdFx0XHRoID0gdGhpcy5fZGlhbG9nLmhlaWdodCgpLFxyXG5cdFx0XHRcdFx0dCA9IDAsbCA9MDtcclxuICAgICAgICAgICAgICAgIHZhciB0b3AgPSBNYXRoLm1heCgod2luUmVjdC5oZWlnaHQgLyAyIC0gaCAvIDIpID4+MCArIHQsMCkgO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxlZnQgID0gKHdpblJlY3Qud2lkdGggLyAyIC0gdyAvIDIpID4+MCArIGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2lzSUU2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdCAtPSBJRTZfTEVGVF9PRkZTRVQvMjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0XHR2YXIgcmVjdCA9IHtcclxuXHRcdFx0XHRcdGxlZnQgOlx0bGVmdCxcclxuXHRcdFx0XHQgICBcdHRvcCA6ICB0b3BcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5fZGlhbG9nLmNzcyhyZWN0KTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdCAgICBzaG93IDogZnVuY3Rpb24oY2FsbGJhY2ssY29udGV4dCl7XHJcblx0XHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0XHRpZihtZS5jb25maWcubWFza1Zpc2libGUpe1xyXG5cdFx0XHRcdFx0bWUuX21hc2suc2hvdygpO1xyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgIC8vSUU4IOS7peS4i+iuoeeul+eql+WPo+WuveW6plxyXG4gICAgICAgICAgICAgICAgbWUuX2RsZ19jb250YWluZXIuY3NzKHt3aWR0aDpcIjEwMCVcIixoZWlnaHQ6XCIxMDAlXCJ9KTtcclxuXHRcdFx0XHRtZS5fZGxnX2NvbnRhaW5lci5zaG93KCk7XHJcblx0XHRcdFx0bWUudG9DZW50ZXIoKTtcclxuXHRcdFx0XHRpZihjYWxsYmFjayl7XHJcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKGNvbnRleHQgfHwgbWUsbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRtZS5zaG93ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjbG9zZSA6IGZ1bmN0aW9uKGNhbGxiYWNrLGNvbnRleHQpe1xyXG5cdFx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdFx0dGhpcy5fbWFzay5oaWRlKCk7XHJcblx0XHRcdFx0dGhpcy5fZGxnX2NvbnRhaW5lci5oaWRlKCk7XHJcblx0XHRcdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChjb250ZXh0IHx8IG1lLG1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5zaG93ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVzdG9yeSA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHRcdHRoaXMuX3VuYmluZEV2ZW50cygpO1xyXG5cdFx0XHRcdHRoaXMuY29uZmlnLm5ld01hc2sgJiYgdGhpcy5fbWFzay5yZW1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLl9kbGdfY29udGFpbmVyLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMuX2RpYWxvZy5yZW1vdmUoKTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gdGhpcyl7XHJcblx0XHRcdFx0XHRkZWxldGUgdGhpc1tpXVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0TWFzayA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX21hc2s7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0fVxyXG5cdFx0RGlhbG9nLnByb3RvdHlwZS5JbiA9IERpYWxvZy5wcm90b3R5cGUuc2hvdztcclxuXHRcdERpYWxvZy5wcm90b3R5cGUub3V0ID0gRGlhbG9nLnByb3RvdHlwZS5jbG9zZTtcclxuXHRcdERpYWxvZy5wcm90b3R5cGUuaGlkZSA9IERpYWxvZy5wcm90b3R5cGUuY2xvc2U7XHJcblx0XHREaWFsb2cucHJvdG90eXBlLnJlbW92ZSA9IERpYWxvZy5wcm90b3R5cGUuZGVzdG9yeTtcclxuXHRcdFxyXG5cdCAgICBcclxuICAgIHJldHVybiBEaWFsb2c7XHJcblxyXG59KShqUXVlcnksd2luZG93KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGlhbG9nO1xyXG4iLCJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKlxuICAgICoqKioqKioqKiogSnVpY2VyICoqKioqKioqKipcbiAgICAke0EgRmFzdCB0ZW1wbGF0ZSBlbmdpbmV9XG4gICAgUHJvamVjdCBIb21lOiBodHRwOi8vanVpY2VyLm5hbWVcblxuICAgIEF1dGhvcjogR3Vva2FpXG4gICAgR3RhbGs6IGJhZGthaWthaUBnbWFpbC5jb21cbiAgICBCbG9nOiBodHRwOi8vYmVuYmVuLmNjXG4gICAgTGljZW5jZTogTUlUIExpY2Vuc2VcbiAgICBWZXJzaW9uOiAwLjYuOC1zdGFibGVcbiovXG5cbihmdW5jdGlvbigpIHtcblxuICAgIC8vIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gZm9yIG5vdCBvbmx5IGNvbXBpbGluZyBidXQgYWxzbyByZW5kZXJpbmcuXG4gICAgLy8gdGhlcmUncyBhdCBsZWFzdCB0d28gcGFyYW1ldGVycyBuZWVkIHRvIGJlIHByb3ZpZGVkLCBvbmUgaXMgdGhlIHRwbCwgXG4gICAgLy8gYW5vdGhlciBpcyB0aGUgZGF0YSwgdGhlIHRwbCBjYW4gZWl0aGVyIGJlIGEgc3RyaW5nLCBvciBhbiBpZCBsaWtlICNpZC5cbiAgICAvLyBpZiBvbmx5IHRwbCB3YXMgZ2l2ZW4sIGl0J2xsIHJldHVybiB0aGUgY29tcGlsZWQgcmV1c2FibGUgZnVuY3Rpb24uXG4gICAgLy8gaWYgdHBsIGFuZCBkYXRhIHdlcmUgZ2l2ZW4gYXQgdGhlIHNhbWUgdGltZSwgaXQnbGwgcmV0dXJuIHRoZSByZW5kZXJlZCBcbiAgICAvLyByZXN1bHQgaW1tZWRpYXRlbHkuXG5cbiAgICB2YXIganVpY2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgIGFyZ3MucHVzaChqdWljZXIub3B0aW9ucyk7XG5cbiAgICAgICAgaWYoYXJnc1swXS5tYXRjaCgvXlxccyojKFtcXHc6XFwtXFwuXSspXFxzKiQvaWdtKSkge1xuICAgICAgICAgICAgYXJnc1swXS5yZXBsYWNlKC9eXFxzKiMoW1xcdzpcXC1cXC5dKylcXHMqJC9pZ20sIGZ1bmN0aW9uKCQsICRpZCkge1xuICAgICAgICAgICAgICAgIHZhciBfZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IF9kb2N1bWVudCAmJiBfZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJGlkKTtcbiAgICAgICAgICAgICAgICBhcmdzWzBdID0gZWxlbSA/IChlbGVtLnZhbHVlIHx8IGVsZW0uaW5uZXJIVE1MKSA6ICQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZihkb2N1bWVudCkgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGp1aWNlci5jb21waWxlLmNhbGwoanVpY2VyLCBkb2N1bWVudC5ib2R5LmlubmVySFRNTCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBqdWljZXIuY29tcGlsZS5hcHBseShqdWljZXIsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4ganVpY2VyLnRvX2h0bWwuYXBwbHkoanVpY2VyLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX19lc2NhcGVodG1sID0ge1xuICAgICAgICBlc2NhcGVoYXNoOiB7XG4gICAgICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgICAgICc+JzogJyZndDsnLFxuICAgICAgICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAgICAgICAnLyc6ICcmI3gyZjsnXG4gICAgICAgIH0sXG4gICAgICAgIGVzY2FwZXJlcGxhY2U6IGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIHJldHVybiBfX2VzY2FwZWh0bWwuZXNjYXBlaGFzaFtrXTtcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBpbmc6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihzdHIpICE9PSAnc3RyaW5nJyA/IHN0ciA6IHN0ci5yZXBsYWNlKC9bJjw+XCJdL2lnbSwgdGhpcy5lc2NhcGVyZXBsYWNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGV0ZWN0aW9uOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRhdGEpID09PSAndW5kZWZpbmVkJyA/ICcnIDogZGF0YTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX190aHJvdyA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGlmKHR5cGVvZihjb25zb2xlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmKGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyhlcnJvcik7XG4gICAgfTtcblxuICAgIHZhciBfX2NyZWF0b3IgPSBmdW5jdGlvbihvLCBwcm90bykge1xuICAgICAgICBvID0gbyAhPT0gT2JqZWN0KG8pID8ge30gOiBvO1xuXG4gICAgICAgIGlmKG8uX19wcm90b19fKSB7XG4gICAgICAgICAgICBvLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW1wdHkgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB2YXIgbiA9IE9iamVjdC5jcmVhdGUgPyBcbiAgICAgICAgICAgIE9iamVjdC5jcmVhdGUocHJvdG8pIDogXG4gICAgICAgICAgICBuZXcoZW1wdHkucHJvdG90eXBlID0gcHJvdG8sIGVtcHR5KTtcblxuICAgICAgICBmb3IodmFyIGkgaW4gbykge1xuICAgICAgICAgICAgaWYoby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIG5baV0gPSBvW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfTtcblxuICAgIHZhciBhbm5vdGF0ZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIHZhciBGTl9BUkdTID0gL15mdW5jdGlvblxccypbXlxcKF0qXFwoXFxzKihbXlxcKV0qKVxcKS9tO1xuICAgICAgICB2YXIgRk5fQVJHX1NQTElUID0gLywvO1xuICAgICAgICB2YXIgRk5fQVJHID0gL15cXHMqKF8/KShcXFMrPylcXDFcXHMqJC87XG4gICAgICAgIHZhciBGTl9CT0RZID0gL15mdW5jdGlvbltee10reyhbXFxzXFxTXSopfS9tO1xuICAgICAgICB2YXIgU1RSSVBfQ09NTUVOVFMgPSAvKChcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKSkvbWc7XG4gICAgICAgIHZhciBhcmdzID0gW10sXG4gICAgICAgICAgICBmblRleHQsXG4gICAgICAgICAgICBmbkJvZHksXG4gICAgICAgICAgICBhcmdEZWNsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChmbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmblRleHQgPSBmbi50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGZuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZm5UZXh0ID0gZm47XG4gICAgICAgIH1cblxuICAgICAgICBmblRleHQgPSBmblRleHQucmVwbGFjZShTVFJJUF9DT01NRU5UUywgJycpO1xuICAgICAgICBmblRleHQgPSBmblRleHQudHJpbSgpO1xuICAgICAgICBhcmdEZWNsID0gZm5UZXh0Lm1hdGNoKEZOX0FSR1MpO1xuICAgICAgICBmbkJvZHkgPSBmblRleHQubWF0Y2goRk5fQk9EWSlbMV0udHJpbSgpO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcmdEZWNsWzFdLnNwbGl0KEZOX0FSR19TUExJVCkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdEZWNsWzFdLnNwbGl0KEZOX0FSR19TUExJVClbaV07XG4gICAgICAgICAgICBhcmcucmVwbGFjZShGTl9BUkcsIGZ1bmN0aW9uKGFsbCwgdW5kZXJzY29yZSwgbmFtZSkge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFthcmdzLCBmbkJvZHldO1xuICAgIH07XG5cbiAgICBqdWljZXIuX19jYWNoZSA9IHt9O1xuICAgIGp1aWNlci52ZXJzaW9uID0gJzAuNi44LXN0YWJsZSc7XG4gICAganVpY2VyLnNldHRpbmdzID0ge307XG5cbiAgICBqdWljZXIudGFncyA9IHtcbiAgICAgICAgb3BlcmF0aW9uT3BlbjogJ3tAJyxcbiAgICAgICAgb3BlcmF0aW9uQ2xvc2U6ICd9JyxcbiAgICAgICAgaW50ZXJwb2xhdGVPcGVuOiAnXFxcXCR7JyxcbiAgICAgICAgaW50ZXJwb2xhdGVDbG9zZTogJ30nLFxuICAgICAgICBub25lZW5jb2RlT3BlbjogJ1xcXFwkXFxcXCR7JyxcbiAgICAgICAgbm9uZWVuY29kZUNsb3NlOiAnfScsXG4gICAgICAgIGNvbW1lbnRPcGVuOiAnXFxcXHsjJyxcbiAgICAgICAgY29tbWVudENsb3NlOiAnXFxcXH0nXG4gICAgfTtcblxuICAgIGp1aWNlci5vcHRpb25zID0ge1xuICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgc3RyaXA6IHRydWUsXG4gICAgICAgIGVycm9yaGFuZGxpbmc6IHRydWUsXG4gICAgICAgIGRldGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgX21ldGhvZDogX19jcmVhdG9yKHtcbiAgICAgICAgICAgIF9fZXNjYXBlaHRtbDogX19lc2NhcGVodG1sLFxuICAgICAgICAgICAgX190aHJvdzogX190aHJvdyxcbiAgICAgICAgICAgIF9fanVpY2VyOiBqdWljZXJcbiAgICAgICAgfSwge30pXG4gICAgfTtcblxuICAgIGp1aWNlci50YWdJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb3JzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWFjaFxcXFxzKihbXn1dKj8pXFxcXHMqYXNcXFxccyooXFxcXHcqPylcXFxccyooLFxcXFxzKlxcXFx3Kj8pPycgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGZvcmVuZCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnXFxcXC9lYWNoJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaWZzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnaWZcXFxccyooW159XSo/KScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGlmZW5kID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdcXFxcL2lmJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgZWxzZXN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdlbHNlJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgZWxzZWlmc3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2Vsc2UgaWZcXFxccyooW159XSo/KScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGludGVycG9sYXRlID0ganVpY2VyLnRhZ3MuaW50ZXJwb2xhdGVPcGVuICsgJyhbXFxcXHNcXFxcU10rPyknICsganVpY2VyLnRhZ3MuaW50ZXJwb2xhdGVDbG9zZTtcbiAgICAgICAgdmFyIG5vbmVlbmNvZGUgPSBqdWljZXIudGFncy5ub25lZW5jb2RlT3BlbiArICcoW1xcXFxzXFxcXFNdKz8pJyArIGp1aWNlci50YWdzLm5vbmVlbmNvZGVDbG9zZTtcbiAgICAgICAgdmFyIGlubGluZWNvbW1lbnQgPSBqdWljZXIudGFncy5jb21tZW50T3BlbiArICdbXn1dKj8nICsganVpY2VyLnRhZ3MuY29tbWVudENsb3NlO1xuICAgICAgICB2YXIgcmFuZ2VzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWFjaFxcXFxzKihcXFxcdyo/KVxcXFxzKmluXFxcXHMqcmFuZ2VcXFxcKChbXn1dKz8pXFxcXHMqLFxcXFxzKihbXn1dKz8pXFxcXCknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBpbmNsdWRlID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdpbmNsdWRlXFxcXHMqKFtefV0qPylcXFxccyosXFxcXHMqKFtefV0qPyknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBoZWxwZXJSZWdpc3RlclN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdoZWxwZXJcXFxccyooW159XSo/KVxcXFxzKicgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGhlbHBlclJlZ2lzdGVyQm9keSA9ICcoW1xcXFxzXFxcXFNdKj8pJztcbiAgICAgICAgdmFyIGhlbHBlclJlZ2lzdGVyRW5kID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdcXFxcL2hlbHBlcicgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcblxuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQgPSBuZXcgUmVnRXhwKGZvcnN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5mb3JlbmQgPSBuZXcgUmVnRXhwKGZvcmVuZCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaWZzdGFydCA9IG5ldyBSZWdFeHAoaWZzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaWZlbmQgPSBuZXcgUmVnRXhwKGlmZW5kLCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5lbHNlc3RhcnQgPSBuZXcgUmVnRXhwKGVsc2VzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZWxzZWlmc3RhcnQgPSBuZXcgUmVnRXhwKGVsc2VpZnN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5pbnRlcnBvbGF0ZSA9IG5ldyBSZWdFeHAoaW50ZXJwb2xhdGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLm5vbmVlbmNvZGUgPSBuZXcgUmVnRXhwKG5vbmVlbmNvZGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmlubGluZWNvbW1lbnQgPSBuZXcgUmVnRXhwKGlubGluZWNvbW1lbnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLnJhbmdlc3RhcnQgPSBuZXcgUmVnRXhwKHJhbmdlc3RhcnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmluY2x1ZGUgPSBuZXcgUmVnRXhwKGluY2x1ZGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmhlbHBlclJlZ2lzdGVyID0gbmV3IFJlZ0V4cChoZWxwZXJSZWdpc3RlclN0YXJ0ICsgaGVscGVyUmVnaXN0ZXJCb2R5ICsgaGVscGVyUmVnaXN0ZXJFbmQsICdpZ20nKTtcbiAgICB9O1xuXG4gICAganVpY2VyLnRhZ0luaXQoKTtcblxuICAgIC8vIFVzaW5nIHRoaXMgbWV0aG9kIHRvIHNldCB0aGUgb3B0aW9ucyBieSBnaXZlbiBjb25mLW5hbWUgYW5kIGNvbmYtdmFsdWUsXG4gICAgLy8geW91IGNhbiBhbHNvIHByb3ZpZGUgbW9yZSB0aGFuIG9uZSBrZXktdmFsdWUgcGFpciB3cmFwcGVkIGJ5IGFuIG9iamVjdC5cbiAgICAvLyB0aGlzIGludGVyZmFjZSBhbHNvIHVzZWQgdG8gY3VzdG9tIHRoZSB0ZW1wbGF0ZSB0YWcgZGVsaW1hdGVyLCBmb3IgdGhpc1xuICAgIC8vIHNpdHVhdGlvbiwgdGhlIGNvbmYtbmFtZSBtdXN0IGJlZ2luIHdpdGggdGFnOjosIGZvciBleGFtcGxlOiBqdWljZXIuc2V0XG4gICAgLy8gKCd0YWc6Om9wZXJhdGlvbk9wZW4nLCAne0AnKS5cblxuICAgIGp1aWNlci5zZXQgPSBmdW5jdGlvbihjb25mLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGVzY2FwZVBhdHRlcm4gPSBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICByZXR1cm4gdi5yZXBsYWNlKC9bXFwkXFwoXFwpXFxbXFxdXFwrXFxeXFx7XFx9XFw/XFwqXFx8XFwuXS9pZ20sIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1xcXFwnICsgJDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzZXQgPSBmdW5jdGlvbihjb25mLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHRhZyA9IGNvbmYubWF0Y2goL150YWc6OiguKikkL2kpO1xuXG4gICAgICAgICAgICBpZih0YWcpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRhZ3NbdGFnWzFdXSA9IGVzY2FwZVBhdHRlcm4odmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoYXQudGFnSW5pdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC5vcHRpb25zW2NvbmZdID0gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgc2V0KGNvbmYsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNvbmYgPT09IE9iamVjdChjb25mKSkge1xuICAgICAgICAgICAgZm9yKHZhciBpIGluIGNvbmYpIHtcbiAgICAgICAgICAgICAgICBpZihjb25mLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldChpLCBjb25mW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQmVmb3JlIHlvdSdyZSB1c2luZyBjdXN0b20gZnVuY3Rpb25zIGluIHlvdXIgdGVtcGxhdGUgbGlrZSAke25hbWUgfCBmbk5hbWV9LFxuICAgIC8vIHlvdSBuZWVkIHRvIHJlZ2lzdGVyIHRoaXMgZm4gYnkganVpY2VyLnJlZ2lzdGVyKCdmbk5hbWUnLCBmbikuXG5cbiAgICBqdWljZXIucmVnaXN0ZXIgPSBmdW5jdGlvbihmbmFtZSwgZm4pIHtcbiAgICAgICAgdmFyIF9tZXRob2QgPSB0aGlzLm9wdGlvbnMuX21ldGhvZDtcblxuICAgICAgICBpZihfbWV0aG9kLmhhc093blByb3BlcnR5KGZuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9tZXRob2RbZm5hbWVdID0gZm47XG4gICAgfTtcblxuICAgIC8vIHJlbW92ZSB0aGUgcmVnaXN0ZXJlZCBmdW5jdGlvbiBpbiB0aGUgbWVtb3J5IGJ5IHRoZSBwcm92aWRlZCBmdW5jdGlvbiBuYW1lLlxuICAgIC8vIGZvciBleGFtcGxlOiBqdWljZXIudW5yZWdpc3RlcignZm5OYW1lJykuXG5cbiAgICBqdWljZXIudW5yZWdpc3RlciA9IGZ1bmN0aW9uKGZuYW1lKSB7XG4gICAgICAgIHZhciBfbWV0aG9kID0gdGhpcy5vcHRpb25zLl9tZXRob2Q7XG5cbiAgICAgICAgaWYoX21ldGhvZC5oYXNPd25Qcm9wZXJ0eShmbmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgX21ldGhvZFtmbmFtZV07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAganVpY2VyLnRlbXBsYXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgICAgICB0aGlzLl9faW50ZXJwb2xhdGUgPSBmdW5jdGlvbihfbmFtZSwgX2VzY2FwZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIF9kZWZpbmUgPSBfbmFtZS5zcGxpdCgnfCcpLCBfZm4gPSBfZGVmaW5lWzBdIHx8ICcnLCBfY2x1c3RlcjtcblxuICAgICAgICAgICAgaWYoX2RlZmluZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgX25hbWUgPSBfZGVmaW5lLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgX2NsdXN0ZXIgPSBfZGVmaW5lLnNoaWZ0KCkuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBfZm4gPSAnX21ldGhvZC4nICsgX2NsdXN0ZXIuc2hpZnQoKSArICcuY2FsbCh7fSwgJyArIFtfbmFtZV0uY29uY2F0KF9jbHVzdGVyKSArICcpJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICc8JT0gJyArIChfZXNjYXBlID8gJ19tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nJyA6ICcnKSArICcoJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAoIW9wdGlvbnMgfHwgb3B0aW9ucy5kZXRlY3Rpb24gIT09IGZhbHNlID8gJ19tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbicgOiAnJykgKyAnKCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKScgK1xuICAgICAgICAgICAgICAgICAgICAnKScgK1xuICAgICAgICAgICAgICAgICcgJT4nO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19yZW1vdmVTaGVsbCA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIF9jb3VudGVyID0gMDtcblxuICAgICAgICAgICAgdHBsID0gdHBsXG4gICAgICAgICAgICAgICAgLy8gaW5saW5lIGhlbHBlciByZWdpc3RlclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5oZWxwZXJSZWdpc3RlciwgZnVuY3Rpb24oJCwgaGVscGVyTmFtZSwgZm5UZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbm5vID0gYW5ub3RhdGUoZm5UZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuQXJncyA9IGFubm9bMF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbkJvZHkgPSBhbm5vWzFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oZm5BcmdzLmpvaW4oJywnKSwgZm5Cb2R5KTtcblxuICAgICAgICAgICAgICAgICAgICBqdWljZXIucmVnaXN0ZXIoaGVscGVyTmFtZSwgZm4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gZm9yIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQsIGZ1bmN0aW9uKCQsIF9uYW1lLCBhbGlhcywga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGlhcyA9IGFsaWFzIHx8ICd2YWx1ZScsIGtleSA9IGtleSAmJiBrZXkuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdGUgPSAnaScgKyBfY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH5mdW5jdGlvbigpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcih2YXIgJyArIF9pdGVyYXRlICsgJyBpbiAnICsgX25hbWUgKyAnKSB7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWYoJyArIF9uYW1lICsgJy5oYXNPd25Qcm9wZXJ0eSgnICsgX2l0ZXJhdGUgKyAnKSkgeycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YXIgJyArIGFsaWFzICsgJz0nICsgX25hbWUgKyAnWycgKyBfaXRlcmF0ZSArICddOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXkgPyAoJ3ZhciAnICsga2V5ICsgJz0nICsgX2l0ZXJhdGUgKyAnOycpIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICU+JztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5mb3JlbmQsICc8JSB9fX0oKTsgJT4nKVxuXG4gICAgICAgICAgICAgICAgLy8gaWYgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pZnN0YXJ0LCBmdW5jdGlvbigkLCBjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSBpZignICsgY29uZGl0aW9uICsgJykgeyAlPic7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaWZlbmQsICc8JSB9ICU+JylcblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlc3RhcnQsIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSB9IGVsc2UgeyAlPic7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgaWYgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlaWZzdGFydCwgZnVuY3Rpb24oJCwgY29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCUgfSBlbHNlIGlmKCcgKyBjb25kaXRpb24gKyAnKSB7ICU+JztcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gaW50ZXJwb2xhdGUgd2l0aG91dCBlc2NhcGVcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3Mubm9uZWVuY29kZSwgZnVuY3Rpb24oJCwgX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuX19pbnRlcnBvbGF0ZShfbmFtZSwgZmFsc2UsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBpbnRlcnBvbGF0ZSB3aXRoIGVzY2FwZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbnRlcnBvbGF0ZSwgZnVuY3Rpb24oJCwgX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuX19pbnRlcnBvbGF0ZShfbmFtZSwgdHJ1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGNsZWFuIHVwIGNvbW1lbnRzXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmlubGluZWNvbW1lbnQsICcnKVxuXG4gICAgICAgICAgICAgICAgLy8gcmFuZ2UgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5yYW5nZXN0YXJ0LCBmdW5jdGlvbigkLCBfbmFtZSwgc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdGUgPSAnaicgKyBfY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH5mdW5jdGlvbigpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcih2YXIgJyArIF9pdGVyYXRlICsgJz0nICsgc3RhcnQgKyAnOycgKyBfaXRlcmF0ZSArICc8JyArIGVuZCArICc7JyArIF9pdGVyYXRlICsgJysrKSB7eycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhciAnICsgX25hbWUgKyAnPScgKyBfaXRlcmF0ZSArICc7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAlPic7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGluY2x1ZGUgc3ViLXRlbXBsYXRlXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmluY2x1ZGUsIGZ1bmN0aW9uKCQsIHRwbCwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYXRpYmxlIGZvciBub2RlLmpzXG4gICAgICAgICAgICAgICAgICAgIGlmKHRwbC5tYXRjaCgvXmZpbGVcXDpcXC9cXC8vaWdtKSkgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCU9IF9tZXRob2QuX19qdWljZXIoJyArIHRwbCArICcsICcgKyBkYXRhICsgJyk7ICU+JztcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZXhjZXB0aW9uIGhhbmRsaW5nXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmVycm9yaGFuZGxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdHBsID0gJzwlIHRyeSB7ICU+JyArIHRwbDtcbiAgICAgICAgICAgICAgICB0cGwgKz0gJzwlIH0gY2F0Y2goZSkge19tZXRob2QuX190aHJvdyhcIkp1aWNlciBSZW5kZXIgRXhjZXB0aW9uOiBcIitlLm1lc3NhZ2UpO30gJT4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHBsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX190b05hdGl2ZSA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19jb252ZXJ0KHRwbCwgIW9wdGlvbnMgfHwgb3B0aW9ucy5zdHJpcCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX2xleGljYWxBbmFseXplID0gZnVuY3Rpb24odHBsKSB7XG4gICAgICAgICAgICB2YXIgYnVmZmVyID0gW107XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gW107XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICB2YXIgcmVzZXJ2ZWQgPSBbXG4gICAgICAgICAgICAgICAgJ2lmJywgJ2VhY2gnLCAnXycsICdfbWV0aG9kJywgJ2NvbnNvbGUnLCBcbiAgICAgICAgICAgICAgICAnYnJlYWsnLCAnY2FzZScsICdjYXRjaCcsICdjb250aW51ZScsICdkZWJ1Z2dlcicsICdkZWZhdWx0JywgJ2RlbGV0ZScsICdkbycsIFxuICAgICAgICAgICAgICAgICdmaW5hbGx5JywgJ2ZvcicsICdmdW5jdGlvbicsICdpbicsICdpbnN0YW5jZW9mJywgJ25ldycsICdyZXR1cm4nLCAnc3dpdGNoJywgXG4gICAgICAgICAgICAgICAgJ3RoaXMnLCAndGhyb3cnLCAndHJ5JywgJ3R5cGVvZicsICd2YXInLCAndm9pZCcsICd3aGlsZScsICd3aXRoJywgJ251bGwnLCAndHlwZW9mJywgXG4gICAgICAgICAgICAgICAgJ2NsYXNzJywgJ2VudW0nLCAnZXhwb3J0JywgJ2V4dGVuZHMnLCAnaW1wb3J0JywgJ3N1cGVyJywgJ2ltcGxlbWVudHMnLCAnaW50ZXJmYWNlJywgXG4gICAgICAgICAgICAgICAgJ2xldCcsICdwYWNrYWdlJywgJ3ByaXZhdGUnLCAncHJvdGVjdGVkJywgJ3B1YmxpYycsICdzdGF0aWMnLCAneWllbGQnLCAnY29uc3QnLCAnYXJndW1lbnRzJywgXG4gICAgICAgICAgICAgICAgJ3RydWUnLCAnZmFsc2UnLCAndW5kZWZpbmVkJywgJ05hTidcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHZhciBpbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlQW5hbHl6ZSA9IGZ1bmN0aW9uKCQsIHN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHN0YXRlbWVudC5tYXRjaCgvXFx3Ky9pZ20pWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5kZXhPZihidWZmZXIsIHN0YXRlbWVudCkgPT09IC0xICYmIGluZGV4T2YocmVzZXJ2ZWQsIHN0YXRlbWVudCkgPT09IC0xICYmIGluZGV4T2YobWV0aG9kLCBzdGF0ZW1lbnQpID09PSAtMSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIHJlLWRlY2xhcmUgbmF0aXZlIGZ1bmN0aW9uLCBpZiBub3QgZG8gdGhpcywgdGVtcGxhdGUgXG4gICAgICAgICAgICAgICAgICAgIC8vIGB7QGlmIGVuY29kZVVSSUNvbXBvbmVudChuYW1lKX1gIGNvdWxkIGJlIHRocm93IHVuZGVmaW5lZC5cblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Yod2luZG93KSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mKHdpbmRvd1tzdGF0ZW1lbnRdKSA9PT0gJ2Z1bmN0aW9uJyAmJiB3aW5kb3dbc3RhdGVtZW50XS50b1N0cmluZygpLm1hdGNoKC9eXFxzKj9mdW5jdGlvbiBcXHcrXFwoXFwpIFxce1xccyo/XFxbbmF0aXZlIGNvZGVcXF1cXHMqP1xcfVxccyo/JC9pKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYXRpYmxlIGZvciBub2RlLmpzXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihnbG9iYWwpICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YoZ2xvYmFsW3N0YXRlbWVudF0pID09PSAnZnVuY3Rpb24nICYmIGdsb2JhbFtzdGF0ZW1lbnRdLnRvU3RyaW5nKCkubWF0Y2goL15cXHMqP2Z1bmN0aW9uIFxcdytcXChcXCkgXFx7XFxzKj9cXFtuYXRpdmUgY29kZVxcXVxccyo/XFx9XFxzKj8kL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIHJlLWRlY2xhcmUgcmVnaXN0ZXJlZCBmdW5jdGlvbiwgaWYgbm90IGRvIHRoaXMsIHRlbXBsYXRlIFxuICAgICAgICAgICAgICAgICAgICAvLyBge0BpZiByZWdpc3RlcmVkX2Z1bmMobmFtZSl9YCBjb3VsZCBiZSB0aHJvdyB1bmRlZmluZWQuXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKGp1aWNlci5vcHRpb25zLl9tZXRob2Rbc3RhdGVtZW50XSkgPT09ICdmdW5jdGlvbicgfHwganVpY2VyLm9wdGlvbnMuX21ldGhvZC5oYXNPd25Qcm9wZXJ0eShzdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBidWZmZXIucHVzaChzdGF0ZW1lbnQpOyAvLyBmdWNrIGllXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0cGwucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaW50ZXJwb2xhdGUsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaWZzdGFydCwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlaWZzdGFydCwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbmNsdWRlLCB2YXJpYWJsZUFuYWx5emUpLlxuICAgICAgICAgICAgICAgIHJlcGxhY2UoL1tcXCtcXC1cXCpcXC8lIVxcP1xcfFxcXiZ+PD49LFxcKFxcKVxcW1xcXV1cXHMqKFtBLVphLXpfXSspL2lnbSwgdmFyaWFibGVBbmFseXplKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ICs9ICd2YXIgJyArIGJ1ZmZlcltpXSArICc9Xy4nICsgYnVmZmVyW2ldICsgJzsnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2kgPCBtZXRob2QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggKz0gJ3ZhciAnICsgbWV0aG9kW2ldICsgJz1fbWV0aG9kLicgKyBtZXRob2RbaV0gKyAnOyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAnPCUgJyArIHByZWZpeCArICcgJT4nO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19jb252ZXJ0PWZ1bmN0aW9uKHRwbCwgc3RyaXApIHtcbiAgICAgICAgICAgIHZhciBidWZmZXIgPSBbXS5qb2luKCcnKTtcblxuICAgICAgICAgICAgYnVmZmVyICs9IFwiJ3VzZSBzdHJpY3QnO1wiOyAvLyB1c2Ugc3RyaWN0IG1vZGVcbiAgICAgICAgICAgIGJ1ZmZlciArPSBcInZhciBfPV98fHt9O1wiO1xuICAgICAgICAgICAgYnVmZmVyICs9IFwidmFyIF9vdXQ9Jyc7X291dCs9J1wiO1xuXG4gICAgICAgICAgICBpZihzdHJpcCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIgKz0gdHBsXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJyg/PVteJV0qJT4pL2csIFwiXFx0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIidcIikuam9pbihcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIlxcdFwiKS5qb2luKFwiJ1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPCU9KC4rPyklPi9nLCBcIic7X291dCs9JDE7X291dCs9J1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCI8JVwiKS5qb2luKFwiJztcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJT5cIikuam9pbihcIl9vdXQrPSdcIikrXG4gICAgICAgICAgICAgICAgICAgIFwiJztyZXR1cm4gX291dDtcIjtcblxuICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1ZmZlciArPSB0cGxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xccl0vZywgXCJcXFxcclwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcdF0vZywgXCJcXFxcdFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcbl0vZywgXCJcXFxcblwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJyg/PVteJV0qJT4pL2csIFwiXFx0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIidcIikuam9pbihcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIlxcdFwiKS5qb2luKFwiJ1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPCU9KC4rPyklPi9nLCBcIic7X291dCs9JDE7X291dCs9J1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCI8JVwiKS5qb2luKFwiJztcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJT5cIikuam9pbihcIl9vdXQrPSdcIikrXG4gICAgICAgICAgICAgICAgICAgIFwiJztyZXR1cm4gX291dC5yZXBsYWNlKC9bXFxcXHJcXFxcbl1cXFxccytbXFxcXHJcXFxcbl0vZywgJ1xcXFxyXFxcXG4nKTtcIjtcblxuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmxvb3NlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRwbCA9IHRoaXMuX19sZXhpY2FsQW5hbHl6ZSh0cGwpICsgdHBsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cGwgPSB0aGlzLl9fcmVtb3ZlU2hlbGwodHBsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRwbCA9IHRoaXMuX190b05hdGl2ZSh0cGwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIgPSBuZXcgRnVuY3Rpb24oJ18sIF9tZXRob2QnLCB0cGwpO1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKF8sIF9tZXRob2QpIHtcbiAgICAgICAgICAgICAgICBpZighX21ldGhvZCB8fCBfbWV0aG9kICE9PSB0aGF0Lm9wdGlvbnMuX21ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBfbWV0aG9kID0gX19jcmVhdG9yKF9tZXRob2QsIHRoYXQub3B0aW9ucy5fbWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoYXQuX3JlbmRlci5jYWxsKHRoaXMsIF8sIF9tZXRob2QpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGp1aWNlci5jb21waWxlID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgIGlmKCFvcHRpb25zIHx8IG9wdGlvbnMgIT09IHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IF9fY3JlYXRvcihvcHRpb25zLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBlbmdpbmUgPSB0aGlzLl9fY2FjaGVbdHBsXSA/IFxuICAgICAgICAgICAgICAgIHRoaXMuX19jYWNoZVt0cGxdIDogXG4gICAgICAgICAgICAgICAgbmV3IHRoaXMudGVtcGxhdGUodGhpcy5vcHRpb25zKS5wYXJzZSh0cGwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmNhY2hlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19jYWNoZVt0cGxdID0gZW5naW5lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZW5naW5lO1xuXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgX190aHJvdygnSnVpY2VyIENvbXBpbGUgRXhjZXB0aW9uOiAnICsgZS5tZXNzYWdlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge30gLy8gbm9vcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBqdWljZXIudG9faHRtbCA9IGZ1bmN0aW9uKHRwbCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zICE9PSB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfX2NyZWF0b3Iob3B0aW9ucywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUodHBsLCBvcHRpb25zKS5yZW5kZXIoZGF0YSwgb3B0aW9ucy5fbWV0aG9kKTtcbiAgICB9O1xuICAgIHdpbmRvdy5qdWljZXIgPSBqdWljZXI7XG4gICAgdHlwZW9mKG1vZHVsZSkgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBqdWljZXIgOiB0aGlzLmp1aWNlciA9IGp1aWNlcjtcblxufSkoKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIGxvZGFzaC5jb20vbGljZW5zZSB8IFVuZGVyc2NvcmUuanMgMS41LjIgdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFXG4gKiBCdWlsZDogYGxvZGFzaCAtbyAuL2Rpc3QvbG9kYXNoLmNvbXBhdC5qc2BcbiAqL1xuOyhmdW5jdGlvbigpe2Z1bmN0aW9uIG4obix0LGUpe2U9KGV8fDApLTE7Zm9yKHZhciByPW4/bi5sZW5ndGg6MDsrK2U8cjspaWYobltlXT09PXQpcmV0dXJuIGU7cmV0dXJuLTF9ZnVuY3Rpb24gdCh0LGUpe3ZhciByPXR5cGVvZiBlO2lmKHQ9dC5sLFwiYm9vbGVhblwiPT1yfHxudWxsPT1lKXJldHVybiB0W2VdPzA6LTE7XCJudW1iZXJcIiE9ciYmXCJzdHJpbmdcIiE9ciYmKHI9XCJvYmplY3RcIik7dmFyIHU9XCJudW1iZXJcIj09cj9lOmIrZTtyZXR1cm4gdD0odD10W3JdKSYmdFt1XSxcIm9iamVjdFwiPT1yP3QmJi0xPG4odCxlKT8wOi0xOnQ/MDotMX1mdW5jdGlvbiBlKG4pe3ZhciB0PXRoaXMubCxlPXR5cGVvZiBuO2lmKFwiYm9vbGVhblwiPT1lfHxudWxsPT1uKXRbbl09dHJ1ZTtlbHNle1wibnVtYmVyXCIhPWUmJlwic3RyaW5nXCIhPWUmJihlPVwib2JqZWN0XCIpO3ZhciByPVwibnVtYmVyXCI9PWU/bjpiK24sdD10W2VdfHwodFtlXT17fSk7XCJvYmplY3RcIj09ZT8odFtyXXx8KHRbcl09W10pKS5wdXNoKG4pOnRbcl09dHJ1ZVxufX1mdW5jdGlvbiByKG4pe3JldHVybiBuLmNoYXJDb2RlQXQoMCl9ZnVuY3Rpb24gdShuLHQpe2Zvcih2YXIgZT1uLm0scj10Lm0sdT0tMSxvPWUubGVuZ3RoOysrdTxvOyl7dmFyIGE9ZVt1XSxpPXJbdV07aWYoYSE9PWkpe2lmKGE+aXx8dHlwZW9mIGE9PVwidW5kZWZpbmVkXCIpcmV0dXJuIDE7aWYoYTxpfHx0eXBlb2YgaT09XCJ1bmRlZmluZWRcIilyZXR1cm4tMX19cmV0dXJuIG4ubi10Lm59ZnVuY3Rpb24gbyhuKXt2YXIgdD0tMSxyPW4ubGVuZ3RoLHU9blswXSxvPW5bci8yfDBdLGE9bltyLTFdO2lmKHUmJnR5cGVvZiB1PT1cIm9iamVjdFwiJiZvJiZ0eXBlb2Ygbz09XCJvYmplY3RcIiYmYSYmdHlwZW9mIGE9PVwib2JqZWN0XCIpcmV0dXJuIGZhbHNlO2Zvcih1PWwoKSx1W1wiZmFsc2VcIl09dVtcIm51bGxcIl09dVtcInRydWVcIl09dS51bmRlZmluZWQ9ZmFsc2Usbz1sKCksby5rPW4sby5sPXUsby5wdXNoPWU7Kyt0PHI7KW8ucHVzaChuW3RdKTtyZXR1cm4gb31mdW5jdGlvbiBhKG4pe3JldHVyblwiXFxcXFwiK1lbbl1cbn1mdW5jdGlvbiBpKCl7cmV0dXJuIHYucG9wKCl8fFtdfWZ1bmN0aW9uIGwoKXtyZXR1cm4geS5wb3AoKXx8e2s6bnVsbCxsOm51bGwsbTpudWxsLFwiZmFsc2VcIjpmYWxzZSxuOjAsXCJudWxsXCI6ZmFsc2UsbnVtYmVyOm51bGwsb2JqZWN0Om51bGwscHVzaDpudWxsLHN0cmluZzpudWxsLFwidHJ1ZVwiOmZhbHNlLHVuZGVmaW5lZDpmYWxzZSxvOm51bGx9fWZ1bmN0aW9uIGYobil7cmV0dXJuIHR5cGVvZiBuLnRvU3RyaW5nIT1cImZ1bmN0aW9uXCImJnR5cGVvZihuK1wiXCIpPT1cInN0cmluZ1wifWZ1bmN0aW9uIGMobil7bi5sZW5ndGg9MCx2Lmxlbmd0aDx3JiZ2LnB1c2gobil9ZnVuY3Rpb24gcChuKXt2YXIgdD1uLmw7dCYmcCh0KSxuLms9bi5sPW4ubT1uLm9iamVjdD1uLm51bWJlcj1uLnN0cmluZz1uLm89bnVsbCx5Lmxlbmd0aDx3JiZ5LnB1c2gobil9ZnVuY3Rpb24gcyhuLHQsZSl7dHx8KHQ9MCksdHlwZW9mIGU9PVwidW5kZWZpbmVkXCImJihlPW4/bi5sZW5ndGg6MCk7dmFyIHI9LTE7ZT1lLXR8fDA7Zm9yKHZhciB1PUFycmF5KDA+ZT8wOmUpOysrcjxlOyl1W3JdPW5bdCtyXTtcbnJldHVybiB1fWZ1bmN0aW9uIGcoZSl7ZnVuY3Rpb24gdihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJiFxZShuKSYmd2UuY2FsbChuLFwiX193cmFwcGVkX19cIik/bjpuZXcgeShuKX1mdW5jdGlvbiB5KG4sdCl7dGhpcy5fX2NoYWluX189ISF0LHRoaXMuX193cmFwcGVkX189bn1mdW5jdGlvbiB3KG4pe2Z1bmN0aW9uIHQoKXtpZihyKXt2YXIgbj1zKHIpO2plLmFwcGx5KG4sYXJndW1lbnRzKX1pZih0aGlzIGluc3RhbmNlb2YgdCl7dmFyIG89bnQoZS5wcm90b3R5cGUpLG49ZS5hcHBseShvLG58fGFyZ3VtZW50cyk7cmV0dXJuIHh0KG4pP246b31yZXR1cm4gZS5hcHBseSh1LG58fGFyZ3VtZW50cyl9dmFyIGU9blswXSxyPW5bMl0sdT1uWzRdO3JldHVybiB6ZSh0LG4pLHR9ZnVuY3Rpb24gWShuLHQsZSxyLHUpe2lmKGUpe3ZhciBvPWUobik7aWYodHlwZW9mIG8hPVwidW5kZWZpbmVkXCIpcmV0dXJuIG99aWYoIXh0KG4pKXJldHVybiBuO3ZhciBhPWhlLmNhbGwobik7aWYoIVZbYV18fCFMZS5ub2RlQ2xhc3MmJmYobikpcmV0dXJuIG47XG52YXIgbD1UZVthXTtzd2l0Y2goYSl7Y2FzZSBMOmNhc2UgejpyZXR1cm4gbmV3IGwoK24pO2Nhc2UgVzpjYXNlIE06cmV0dXJuIG5ldyBsKG4pO2Nhc2UgSjpyZXR1cm4gbz1sKG4uc291cmNlLFMuZXhlYyhuKSksby5sYXN0SW5kZXg9bi5sYXN0SW5kZXgsb31pZihhPXFlKG4pLHQpe3ZhciBwPSFyO3J8fChyPWkoKSksdXx8KHU9aSgpKTtmb3IodmFyIGc9ci5sZW5ndGg7Zy0tOylpZihyW2ddPT1uKXJldHVybiB1W2ddO289YT9sKG4ubGVuZ3RoKTp7fX1lbHNlIG89YT9zKG4pOlllKHt9LG4pO3JldHVybiBhJiYod2UuY2FsbChuLFwiaW5kZXhcIikmJihvLmluZGV4PW4uaW5kZXgpLHdlLmNhbGwobixcImlucHV0XCIpJiYoby5pbnB1dD1uLmlucHV0KSksdD8oci5wdXNoKG4pLHUucHVzaChvKSwoYT9YZTp0cikobixmdW5jdGlvbihuLGEpe29bYV09WShuLHQsZSxyLHUpfSkscCYmKGMociksYyh1KSksbyk6b31mdW5jdGlvbiBudChuKXtyZXR1cm4geHQobik/U2Uobik6e319ZnVuY3Rpb24gdHQobix0LGUpe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpcmV0dXJuIEh0O1xuaWYodHlwZW9mIHQ9PVwidW5kZWZpbmVkXCJ8fCEoXCJwcm90b3R5cGVcImluIG4pKXJldHVybiBuO3ZhciByPW4uX19iaW5kRGF0YV9fO2lmKHR5cGVvZiByPT1cInVuZGVmaW5lZFwiJiYoTGUuZnVuY05hbWVzJiYocj0hbi5uYW1lKSxyPXJ8fCFMZS5mdW5jRGVjb21wLCFyKSl7dmFyIHU9YmUuY2FsbChuKTtMZS5mdW5jTmFtZXN8fChyPSFBLnRlc3QodSkpLHJ8fChyPUIudGVzdCh1KSx6ZShuLHIpKX1pZihmYWxzZT09PXJ8fHRydWUhPT1yJiYxJnJbMV0pcmV0dXJuIG47c3dpdGNoKGUpe2Nhc2UgMTpyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIG4uY2FsbCh0LGUpfTtjYXNlIDI6cmV0dXJuIGZ1bmN0aW9uKGUscil7cmV0dXJuIG4uY2FsbCh0LGUscil9O2Nhc2UgMzpyZXR1cm4gZnVuY3Rpb24oZSxyLHUpe3JldHVybiBuLmNhbGwodCxlLHIsdSl9O2Nhc2UgNDpyZXR1cm4gZnVuY3Rpb24oZSxyLHUsbyl7cmV0dXJuIG4uY2FsbCh0LGUscix1LG8pfX1yZXR1cm4gTXQobix0KX1mdW5jdGlvbiBldChuKXtmdW5jdGlvbiB0KCl7dmFyIG49bD9hOnRoaXM7XG5pZih1KXt2YXIgaD1zKHUpO2plLmFwcGx5KGgsYXJndW1lbnRzKX1yZXR1cm4ob3x8YykmJihofHwoaD1zKGFyZ3VtZW50cykpLG8mJmplLmFwcGx5KGgsbyksYyYmaC5sZW5ndGg8aSk/KHJ8PTE2LGV0KFtlLHA/cjotNCZyLGgsbnVsbCxhLGldKSk6KGh8fChoPWFyZ3VtZW50cyksZiYmKGU9bltnXSksdGhpcyBpbnN0YW5jZW9mIHQ/KG49bnQoZS5wcm90b3R5cGUpLGg9ZS5hcHBseShuLGgpLHh0KGgpP2g6bik6ZS5hcHBseShuLGgpKX12YXIgZT1uWzBdLHI9blsxXSx1PW5bMl0sbz1uWzNdLGE9bls0XSxpPW5bNV0sbD0xJnIsZj0yJnIsYz00JnIscD04JnIsZz1lO3JldHVybiB6ZSh0LG4pLHR9ZnVuY3Rpb24gcnQoZSxyKXt2YXIgdT0tMSxhPWh0KCksaT1lP2UubGVuZ3RoOjAsbD1pPj1fJiZhPT09bixmPVtdO2lmKGwpe3ZhciBjPW8ocik7Yz8oYT10LHI9Yyk6bD1mYWxzZX1mb3IoOysrdTxpOyljPWVbdV0sMD5hKHIsYykmJmYucHVzaChjKTtyZXR1cm4gbCYmcChyKSxmfWZ1bmN0aW9uIG90KG4sdCxlLHIpe3I9KHJ8fDApLTE7XG5mb3IodmFyIHU9bj9uLmxlbmd0aDowLG89W107KytyPHU7KXt2YXIgYT1uW3JdO2lmKGEmJnR5cGVvZiBhPT1cIm9iamVjdFwiJiZ0eXBlb2YgYS5sZW5ndGg9PVwibnVtYmVyXCImJihxZShhKXx8ZHQoYSkpKXt0fHwoYT1vdChhLHQsZSkpO3ZhciBpPS0xLGw9YS5sZW5ndGgsZj1vLmxlbmd0aDtmb3Ioby5sZW5ndGgrPWw7KytpPGw7KW9bZisrXT1hW2ldfWVsc2UgZXx8by5wdXNoKGEpfXJldHVybiBvfWZ1bmN0aW9uIGF0KG4sdCxlLHIsdSxvKXtpZihlKXt2YXIgYT1lKG4sdCk7aWYodHlwZW9mIGEhPVwidW5kZWZpbmVkXCIpcmV0dXJuISFhfWlmKG49PT10KXJldHVybiAwIT09bnx8MS9uPT0xL3Q7aWYobj09PW4mJiEobiYmWFt0eXBlb2Ygbl18fHQmJlhbdHlwZW9mIHRdKSlyZXR1cm4gZmFsc2U7aWYobnVsbD09bnx8bnVsbD09dClyZXR1cm4gbj09PXQ7dmFyIGw9aGUuY2FsbChuKSxwPWhlLmNhbGwodCk7aWYobD09VCYmKGw9RykscD09VCYmKHA9RyksbCE9cClyZXR1cm4gZmFsc2U7c3dpdGNoKGwpe2Nhc2UgTDpjYXNlIHo6cmV0dXJuK249PSt0O1xuY2FzZSBXOnJldHVybiBuIT0rbj90IT0rdDowPT1uPzEvbj09MS90Om49PSt0O2Nhc2UgSjpjYXNlIE06cmV0dXJuIG49PWllKHQpfWlmKHA9bD09JCwhcCl7dmFyIHM9d2UuY2FsbChuLFwiX193cmFwcGVkX19cIiksZz13ZS5jYWxsKHQsXCJfX3dyYXBwZWRfX1wiKTtpZihzfHxnKXJldHVybiBhdChzP24uX193cmFwcGVkX186bixnP3QuX193cmFwcGVkX186dCxlLHIsdSxvKTtpZihsIT1HfHwhTGUubm9kZUNsYXNzJiYoZihuKXx8Zih0KSkpcmV0dXJuIGZhbHNlO2lmKGw9IUxlLmFyZ3NPYmplY3QmJmR0KG4pP29lOm4uY29uc3RydWN0b3Iscz0hTGUuYXJnc09iamVjdCYmZHQodCk/b2U6dC5jb25zdHJ1Y3RvcixsIT1zJiYhKGp0KGwpJiZsIGluc3RhbmNlb2YgbCYmanQocykmJnMgaW5zdGFuY2VvZiBzKSYmXCJjb25zdHJ1Y3RvclwiaW4gbiYmXCJjb25zdHJ1Y3RvclwiaW4gdClyZXR1cm4gZmFsc2V9Zm9yKGw9IXUsdXx8KHU9aSgpKSxvfHwobz1pKCkpLHM9dS5sZW5ndGg7cy0tOylpZih1W3NdPT1uKXJldHVybiBvW3NdPT10O1xudmFyIGg9MCxhPXRydWU7aWYodS5wdXNoKG4pLG8ucHVzaCh0KSxwKXtpZihzPW4ubGVuZ3RoLGg9dC5sZW5ndGgsKGE9aD09cyl8fHIpZm9yKDtoLS07KWlmKHA9cyxnPXRbaF0scilmb3IoO3AtLSYmIShhPWF0KG5bcF0sZyxlLHIsdSxvKSk7KTtlbHNlIGlmKCEoYT1hdChuW2hdLGcsZSxyLHUsbykpKWJyZWFrfWVsc2UgbnIodCxmdW5jdGlvbih0LGksbCl7cmV0dXJuIHdlLmNhbGwobCxpKT8oaCsrLGE9d2UuY2FsbChuLGkpJiZhdChuW2ldLHQsZSxyLHUsbykpOnZvaWQgMH0pLGEmJiFyJiZucihuLGZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gd2UuY2FsbChlLHQpP2E9LTE8LS1oOnZvaWQgMH0pO3JldHVybiB1LnBvcCgpLG8ucG9wKCksbCYmKGModSksYyhvKSksYX1mdW5jdGlvbiBpdChuLHQsZSxyLHUpeyhxZSh0KT9EdDp0cikodCxmdW5jdGlvbih0LG8pe3ZhciBhLGksbD10LGY9bltvXTtpZih0JiYoKGk9cWUodCkpfHxlcih0KSkpe2ZvcihsPXIubGVuZ3RoO2wtLTspaWYoYT1yW2xdPT10KXtmPXVbbF07XG5icmVha31pZighYSl7dmFyIGM7ZSYmKGw9ZShmLHQpLGM9dHlwZW9mIGwhPVwidW5kZWZpbmVkXCIpJiYoZj1sKSxjfHwoZj1pP3FlKGYpP2Y6W106ZXIoZik/Zjp7fSksci5wdXNoKHQpLHUucHVzaChmKSxjfHxpdChmLHQsZSxyLHUpfX1lbHNlIGUmJihsPWUoZix0KSx0eXBlb2YgbD09XCJ1bmRlZmluZWRcIiYmKGw9dCkpLHR5cGVvZiBsIT1cInVuZGVmaW5lZFwiJiYoZj1sKTtuW29dPWZ9KX1mdW5jdGlvbiBsdChuLHQpe3JldHVybiBuK2RlKEZlKCkqKHQtbisxKSl9ZnVuY3Rpb24gZnQoZSxyLHUpe3ZhciBhPS0xLGw9aHQoKSxmPWU/ZS5sZW5ndGg6MCxzPVtdLGc9IXImJmY+PV8mJmw9PT1uLGg9dXx8Zz9pKCk6cztmb3IoZyYmKGg9byhoKSxsPXQpOysrYTxmOyl7dmFyIHY9ZVthXSx5PXU/dSh2LGEsZSk6djsocj8hYXx8aFtoLmxlbmd0aC0xXSE9PXk6MD5sKGgseSkpJiYoKHV8fGcpJiZoLnB1c2goeSkscy5wdXNoKHYpKX1yZXR1cm4gZz8oYyhoLmspLHAoaCkpOnUmJmMoaCksc31mdW5jdGlvbiBjdChuKXtyZXR1cm4gZnVuY3Rpb24odCxlLHIpe3ZhciB1PXt9O1xuaWYoZT12LmNyZWF0ZUNhbGxiYWNrKGUsciwzKSxxZSh0KSl7cj0tMTtmb3IodmFyIG89dC5sZW5ndGg7KytyPG87KXt2YXIgYT10W3JdO24odSxhLGUoYSxyLHQpLHQpfX1lbHNlIFhlKHQsZnVuY3Rpb24odCxyLG8pe24odSx0LGUodCxyLG8pLG8pfSk7cmV0dXJuIHV9fWZ1bmN0aW9uIHB0KG4sdCxlLHIsdSxvKXt2YXIgYT0xJnQsaT00JnQsbD0xNiZ0LGY9MzImdDtpZighKDImdHx8anQobikpKXRocm93IG5ldyBsZTtsJiYhZS5sZW5ndGgmJih0Jj0tMTcsbD1lPWZhbHNlKSxmJiYhci5sZW5ndGgmJih0Jj0tMzMsZj1yPWZhbHNlKTt2YXIgYz1uJiZuLl9fYmluZERhdGFfXztyZXR1cm4gYyYmdHJ1ZSE9PWM/KGM9cyhjKSxjWzJdJiYoY1syXT1zKGNbMl0pKSxjWzNdJiYoY1szXT1zKGNbM10pKSwhYXx8MSZjWzFdfHwoY1s0XT11KSwhYSYmMSZjWzFdJiYodHw9OCksIWl8fDQmY1sxXXx8KGNbNV09byksbCYmamUuYXBwbHkoY1syXXx8KGNbMl09W10pLGUpLGYmJkVlLmFwcGx5KGNbM118fChjWzNdPVtdKSxyKSxjWzFdfD10LHB0LmFwcGx5KG51bGwsYykpOigxPT10fHwxNz09PXQ/dzpldCkoW24sdCxlLHIsdSxvXSlcbn1mdW5jdGlvbiBzdCgpe1EuaD1GLFEuYj1RLmM9US5nPVEuaT1cIlwiLFEuZT1cInRcIixRLmo9dHJ1ZTtmb3IodmFyIG4sdD0wO249YXJndW1lbnRzW3RdO3QrKylmb3IodmFyIGUgaW4gbilRW2VdPW5bZV07dD1RLmEsUS5kPS9eW14sXSsvLmV4ZWModClbMF0sbj1lZSx0PVwicmV0dXJuIGZ1bmN0aW9uKFwiK3QrXCIpe1wiLGU9UTt2YXIgcj1cInZhciBuLHQ9XCIrZS5kK1wiLEU9XCIrZS5lK1wiO2lmKCF0KXJldHVybiBFO1wiK2UuaStcIjtcIjtlLmI/KHIrPVwidmFyIHU9dC5sZW5ndGg7bj0tMTtpZihcIitlLmIrXCIpe1wiLExlLnVuaW5kZXhlZENoYXJzJiYocis9XCJpZihzKHQpKXt0PXQuc3BsaXQoJycpfVwiKSxyKz1cIndoaWxlKCsrbjx1KXtcIitlLmcrXCI7fX1lbHNle1wiKTpMZS5ub25FbnVtQXJncyYmKHIrPVwidmFyIHU9dC5sZW5ndGg7bj0tMTtpZih1JiZwKHQpKXt3aGlsZSgrK248dSl7bis9Jyc7XCIrZS5nK1wiO319ZWxzZXtcIiksTGUuZW51bVByb3RvdHlwZXMmJihyKz1cInZhciBHPXR5cGVvZiB0PT0nZnVuY3Rpb24nO1wiKSxMZS5lbnVtRXJyb3JQcm9wcyYmKHIrPVwidmFyIEY9dD09PWt8fHQgaW5zdGFuY2VvZiBFcnJvcjtcIik7XG52YXIgdT1bXTtpZihMZS5lbnVtUHJvdG90eXBlcyYmdS5wdXNoKCchKEcmJm49PVwicHJvdG90eXBlXCIpJyksTGUuZW51bUVycm9yUHJvcHMmJnUucHVzaCgnIShGJiYobj09XCJtZXNzYWdlXCJ8fG49PVwibmFtZVwiKSknKSxlLmomJmUuZilyKz1cInZhciBDPS0xLEQ9Qlt0eXBlb2YgdF0mJnYodCksdT1EP0QubGVuZ3RoOjA7d2hpbGUoKytDPHUpe249RFtDXTtcIix1Lmxlbmd0aCYmKHIrPVwiaWYoXCIrdS5qb2luKFwiJiZcIikrXCIpe1wiKSxyKz1lLmcrXCI7XCIsdS5sZW5ndGgmJihyKz1cIn1cIikscis9XCJ9XCI7ZWxzZSBpZihyKz1cImZvcihuIGluIHQpe1wiLGUuaiYmdS5wdXNoKFwibS5jYWxsKHQsIG4pXCIpLHUubGVuZ3RoJiYocis9XCJpZihcIit1LmpvaW4oXCImJlwiKStcIil7XCIpLHIrPWUuZytcIjtcIix1Lmxlbmd0aCYmKHIrPVwifVwiKSxyKz1cIn1cIixMZS5ub25FbnVtU2hhZG93cyl7Zm9yKHIrPVwiaWYodCE9PUEpe3ZhciBpPXQuY29uc3RydWN0b3Iscj10PT09KGkmJmkucHJvdG90eXBlKSxmPXQ9PT1KP0k6dD09PWs/ajpMLmNhbGwodCkseD15W2ZdO1wiLGs9MDs3Pms7aysrKXIrPVwibj0nXCIrZS5oW2tdK1wiJztpZigoIShyJiZ4W25dKSYmbS5jYWxsKHQsbikpXCIsZS5qfHwocis9XCJ8fCgheFtuXSYmdFtuXSE9PUFbbl0pXCIpLHIrPVwiKXtcIitlLmcrXCJ9XCI7XG5yKz1cIn1cIn1yZXR1cm4oZS5ifHxMZS5ub25FbnVtQXJncykmJihyKz1cIn1cIikscis9ZS5jK1wiO3JldHVybiBFXCIsbihcImQsaixrLG0sbyxwLHEscyx2LEEsQix5LEksSixMXCIsdCtyK1wifVwiKSh0dCxxLGNlLHdlLGQsZHQscWUsa3QsUS5mLHBlLFgsJGUsTSxzZSxoZSl9ZnVuY3Rpb24gZ3Qobil7cmV0dXJuIFZlW25dfWZ1bmN0aW9uIGh0KCl7dmFyIHQ9KHQ9di5pbmRleE9mKT09PXp0P246dDtyZXR1cm4gdH1mdW5jdGlvbiB2dChuKXtyZXR1cm4gdHlwZW9mIG49PVwiZnVuY3Rpb25cIiYmdmUudGVzdChuKX1mdW5jdGlvbiB5dChuKXt2YXIgdCxlO3JldHVybiFufHxoZS5jYWxsKG4pIT1HfHwodD1uLmNvbnN0cnVjdG9yLGp0KHQpJiYhKHQgaW5zdGFuY2VvZiB0KSl8fCFMZS5hcmdzQ2xhc3MmJmR0KG4pfHwhTGUubm9kZUNsYXNzJiZmKG4pP2ZhbHNlOkxlLm93bkxhc3Q/KG5yKG4sZnVuY3Rpb24obix0LHIpe3JldHVybiBlPXdlLmNhbGwocix0KSxmYWxzZX0pLGZhbHNlIT09ZSk6KG5yKG4sZnVuY3Rpb24obix0KXtlPXRcbn0pLHR5cGVvZiBlPT1cInVuZGVmaW5lZFwifHx3ZS5jYWxsKG4sZSkpfWZ1bmN0aW9uIG10KG4pe3JldHVybiBIZVtuXX1mdW5jdGlvbiBkdChuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJnR5cGVvZiBuLmxlbmd0aD09XCJudW1iZXJcIiYmaGUuY2FsbChuKT09VHx8ZmFsc2V9ZnVuY3Rpb24gYnQobix0LGUpe3ZhciByPVdlKG4pLHU9ci5sZW5ndGg7Zm9yKHQ9dHQodCxlLDMpO3UtLSYmKGU9clt1XSxmYWxzZSE9PXQobltlXSxlLG4pKTspO3JldHVybiBufWZ1bmN0aW9uIF90KG4pe3ZhciB0PVtdO3JldHVybiBucihuLGZ1bmN0aW9uKG4sZSl7anQobikmJnQucHVzaChlKX0pLHQuc29ydCgpfWZ1bmN0aW9uIHd0KG4pe2Zvcih2YXIgdD0tMSxlPVdlKG4pLHI9ZS5sZW5ndGgsdT17fTsrK3Q8cjspe3ZhciBvPWVbdF07dVtuW29dXT1vfXJldHVybiB1fWZ1bmN0aW9uIGp0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJmdW5jdGlvblwifWZ1bmN0aW9uIHh0KG4pe3JldHVybiEoIW58fCFYW3R5cGVvZiBuXSlcbn1mdW5jdGlvbiBDdChuKXtyZXR1cm4gdHlwZW9mIG49PVwibnVtYmVyXCJ8fG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT1XfHxmYWxzZX1mdW5jdGlvbiBrdChuKXtyZXR1cm4gdHlwZW9mIG49PVwic3RyaW5nXCJ8fG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT1NfHxmYWxzZX1mdW5jdGlvbiBFdChuKXtmb3IodmFyIHQ9LTEsZT1XZShuKSxyPWUubGVuZ3RoLHU9WnQocik7Kyt0PHI7KXVbdF09bltlW3RdXTtyZXR1cm4gdX1mdW5jdGlvbiBPdChuLHQsZSl7dmFyIHI9LTEsdT1odCgpLG89bj9uLmxlbmd0aDowLGE9ZmFsc2U7cmV0dXJuIGU9KDA+ZT9CZSgwLG8rZSk6ZSl8fDAscWUobik/YT0tMTx1KG4sdCxlKTp0eXBlb2Ygbz09XCJudW1iZXJcIj9hPS0xPChrdChuKT9uLmluZGV4T2YodCxlKTp1KG4sdCxlKSk6WGUobixmdW5jdGlvbihuKXtyZXR1cm4rK3I8ZT92b2lkIDA6IShhPW49PT10KX0pLGF9ZnVuY3Rpb24gU3Qobix0LGUpe3ZhciByPXRydWU7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxxZShuKSl7ZT0tMTtcbmZvcih2YXIgdT1uLmxlbmd0aDsrK2U8dSYmKHI9ISF0KG5bZV0sZSxuKSk7KTt9ZWxzZSBYZShuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gcj0hIXQobixlLHUpfSk7cmV0dXJuIHJ9ZnVuY3Rpb24gQXQobix0LGUpe3ZhciByPVtdO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykscWUobikpe2U9LTE7Zm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1Oyl7dmFyIG89bltlXTt0KG8sZSxuKSYmci5wdXNoKG8pfX1lbHNlIFhlKG4sZnVuY3Rpb24obixlLHUpe3QobixlLHUpJiZyLnB1c2gobil9KTtyZXR1cm4gcn1mdW5jdGlvbiBJdChuLHQsZSl7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSwhcWUobikpe3ZhciByO3JldHVybiBYZShuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gdChuLGUsdSk/KHI9bixmYWxzZSk6dm9pZCAwfSkscn1lPS0xO2Zvcih2YXIgdT1uLmxlbmd0aDsrK2U8dTspe3ZhciBvPW5bZV07aWYodChvLGUsbikpcmV0dXJuIG99fWZ1bmN0aW9uIER0KG4sdCxlKXtpZih0JiZ0eXBlb2YgZT09XCJ1bmRlZmluZWRcIiYmcWUobikpe2U9LTE7XG5mb3IodmFyIHI9bi5sZW5ndGg7KytlPHImJmZhbHNlIT09dChuW2VdLGUsbik7KTt9ZWxzZSBYZShuLHQsZSk7cmV0dXJuIG59ZnVuY3Rpb24gTnQobix0LGUpe3ZhciByPW4sdT1uP24ubGVuZ3RoOjA7aWYodD10JiZ0eXBlb2YgZT09XCJ1bmRlZmluZWRcIj90OnR0KHQsZSwzKSxxZShuKSlmb3IoO3UtLSYmZmFsc2UhPT10KG5bdV0sdSxuKTspO2Vsc2V7aWYodHlwZW9mIHUhPVwibnVtYmVyXCIpdmFyIG89V2UobiksdT1vLmxlbmd0aDtlbHNlIExlLnVuaW5kZXhlZENoYXJzJiZrdChuKSYmKHI9bi5zcGxpdChcIlwiKSk7WGUobixmdW5jdGlvbihuLGUsYSl7cmV0dXJuIGU9bz9vWy0tdV06LS11LHQocltlXSxlLGEpfSl9cmV0dXJuIG59ZnVuY3Rpb24gQnQobix0LGUpe3ZhciByPS0xLHU9bj9uLmxlbmd0aDowLG89WnQodHlwZW9mIHU9PVwibnVtYmVyXCI/dTowKTtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHFlKG4pKWZvcig7KytyPHU7KW9bcl09dChuW3JdLHIsbik7ZWxzZSBYZShuLGZ1bmN0aW9uKG4sZSx1KXtvWysrcl09dChuLGUsdSlcbn0pO3JldHVybiBvfWZ1bmN0aW9uIFB0KG4sdCxlKXt2YXIgdT0tMS8wLG89dTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiJiZlJiZlW3RdPT09biYmKHQ9bnVsbCksbnVsbD09dCYmcWUobikpe2U9LTE7Zm9yKHZhciBhPW4ubGVuZ3RoOysrZTxhOyl7dmFyIGk9bltlXTtpPm8mJihvPWkpfX1lbHNlIHQ9bnVsbD09dCYma3Qobik/cjp2LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxYZShuLGZ1bmN0aW9uKG4sZSxyKXtlPXQobixlLHIpLGU+dSYmKHU9ZSxvPW4pfSk7cmV0dXJuIG99ZnVuY3Rpb24gUnQobix0LGUscil7dmFyIHU9Mz5hcmd1bWVudHMubGVuZ3RoO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LHIsNCkscWUobikpe3ZhciBvPS0xLGE9bi5sZW5ndGg7Zm9yKHUmJihlPW5bKytvXSk7KytvPGE7KWU9dChlLG5bb10sbyxuKX1lbHNlIFhlKG4sZnVuY3Rpb24obixyLG8pe2U9dT8odT1mYWxzZSxuKTp0KGUsbixyLG8pfSk7cmV0dXJuIGV9ZnVuY3Rpb24gRnQobix0LGUscil7dmFyIHU9Mz5hcmd1bWVudHMubGVuZ3RoO1xucmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LHIsNCksTnQobixmdW5jdGlvbihuLHIsbyl7ZT11Pyh1PWZhbHNlLG4pOnQoZSxuLHIsbyl9KSxlfWZ1bmN0aW9uIFR0KG4pe3ZhciB0PS0xLGU9bj9uLmxlbmd0aDowLHI9WnQodHlwZW9mIGU9PVwibnVtYmVyXCI/ZTowKTtyZXR1cm4gRHQobixmdW5jdGlvbihuKXt2YXIgZT1sdCgwLCsrdCk7clt0XT1yW2VdLHJbZV09bn0pLHJ9ZnVuY3Rpb24gJHQobix0LGUpe3ZhciByO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykscWUobikpe2U9LTE7Zm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1JiYhKHI9dChuW2VdLGUsbikpOyk7fWVsc2UgWGUobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIShyPXQobixlLHUpKX0pO3JldHVybiEhcn1mdW5jdGlvbiBMdChuLHQsZSl7dmFyIHI9MCx1PW4/bi5sZW5ndGg6MDtpZih0eXBlb2YgdCE9XCJudW1iZXJcIiYmbnVsbCE9dCl7dmFyIG89LTE7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7KytvPHUmJnQobltvXSxvLG4pOylyKytcbn1lbHNlIGlmKHI9dCxudWxsPT1yfHxlKXJldHVybiBuP25bMF06aDtyZXR1cm4gcyhuLDAsUGUoQmUoMCxyKSx1KSl9ZnVuY3Rpb24genQodCxlLHIpe2lmKHR5cGVvZiByPT1cIm51bWJlclwiKXt2YXIgdT10P3QubGVuZ3RoOjA7cj0wPnI/QmUoMCx1K3IpOnJ8fDB9ZWxzZSBpZihyKXJldHVybiByPUt0KHQsZSksdFtyXT09PWU/cjotMTtyZXR1cm4gbih0LGUscil9ZnVuY3Rpb24gcXQobix0LGUpe2lmKHR5cGVvZiB0IT1cIm51bWJlclwiJiZudWxsIT10KXt2YXIgcj0wLHU9LTEsbz1uP24ubGVuZ3RoOjA7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7Kyt1PG8mJnQoblt1XSx1LG4pOylyKyt9ZWxzZSByPW51bGw9PXR8fGU/MTpCZSgwLHQpO3JldHVybiBzKG4scil9ZnVuY3Rpb24gS3Qobix0LGUscil7dmFyIHU9MCxvPW4/bi5sZW5ndGg6dTtmb3IoZT1lP3YuY3JlYXRlQ2FsbGJhY2soZSxyLDEpOkh0LHQ9ZSh0KTt1PG87KXI9dStvPj4+MSxlKG5bcl0pPHQ/dT1yKzE6bz1yO1xucmV0dXJuIHV9ZnVuY3Rpb24gV3Qobix0LGUscil7cmV0dXJuIHR5cGVvZiB0IT1cImJvb2xlYW5cIiYmbnVsbCE9dCYmKHI9ZSxlPXR5cGVvZiB0IT1cImZ1bmN0aW9uXCImJnImJnJbdF09PT1uP251bGw6dCx0PWZhbHNlKSxudWxsIT1lJiYoZT12LmNyZWF0ZUNhbGxiYWNrKGUsciwzKSksZnQobix0LGUpfWZ1bmN0aW9uIEd0KCl7Zm9yKHZhciBuPTE8YXJndW1lbnRzLmxlbmd0aD9hcmd1bWVudHM6YXJndW1lbnRzWzBdLHQ9LTEsZT1uP1B0KGFyKG4sXCJsZW5ndGhcIikpOjAscj1adCgwPmU/MDplKTsrK3Q8ZTspclt0XT1hcihuLHQpO3JldHVybiByfWZ1bmN0aW9uIEp0KG4sdCl7dmFyIGU9LTEscj1uP24ubGVuZ3RoOjAsdT17fTtmb3IodHx8IXJ8fHFlKG5bMF0pfHwodD1bXSk7KytlPHI7KXt2YXIgbz1uW2VdO3Q/dVtvXT10W2VdOm8mJih1W29bMF1dPW9bMV0pfXJldHVybiB1fWZ1bmN0aW9uIE10KG4sdCl7cmV0dXJuIDI8YXJndW1lbnRzLmxlbmd0aD9wdChuLDE3LHMoYXJndW1lbnRzLDIpLG51bGwsdCk6cHQobiwxLG51bGwsbnVsbCx0KVxufWZ1bmN0aW9uIFZ0KG4sdCxlKXt2YXIgcix1LG8sYSxpLGwsZixjPTAscD1mYWxzZSxzPXRydWU7aWYoIWp0KG4pKXRocm93IG5ldyBsZTtpZih0PUJlKDAsdCl8fDAsdHJ1ZT09PWUpdmFyIGc9dHJ1ZSxzPWZhbHNlO2Vsc2UgeHQoZSkmJihnPWUubGVhZGluZyxwPVwibWF4V2FpdFwiaW4gZSYmKEJlKHQsZS5tYXhXYWl0KXx8MCkscz1cInRyYWlsaW5nXCJpbiBlP2UudHJhaWxpbmc6cyk7dmFyIHY9ZnVuY3Rpb24oKXt2YXIgZT10LShpcigpLWEpOzA8ZT9sPUNlKHYsZSk6KHUmJm1lKHUpLGU9Zix1PWw9Zj1oLGUmJihjPWlyKCksbz1uLmFwcGx5KGksciksbHx8dXx8KHI9aT1udWxsKSkpfSx5PWZ1bmN0aW9uKCl7bCYmbWUobCksdT1sPWY9aCwoc3x8cCE9PXQpJiYoYz1pcigpLG89bi5hcHBseShpLHIpLGx8fHV8fChyPWk9bnVsbCkpfTtyZXR1cm4gZnVuY3Rpb24oKXtpZihyPWFyZ3VtZW50cyxhPWlyKCksaT10aGlzLGY9cyYmKGx8fCFnKSxmYWxzZT09PXApdmFyIGU9ZyYmIWw7ZWxzZXt1fHxnfHwoYz1hKTtcbnZhciBoPXAtKGEtYyksbT0wPj1oO20/KHUmJih1PW1lKHUpKSxjPWEsbz1uLmFwcGx5KGkscikpOnV8fCh1PUNlKHksaCkpfXJldHVybiBtJiZsP2w9bWUobCk6bHx8dD09PXB8fChsPUNlKHYsdCkpLGUmJihtPXRydWUsbz1uLmFwcGx5KGkscikpLCFtfHxsfHx1fHwocj1pPW51bGwpLG99fWZ1bmN0aW9uIEh0KG4pe3JldHVybiBufWZ1bmN0aW9uIFV0KG4sdCxlKXt2YXIgcj10cnVlLHU9dCYmX3QodCk7dCYmKGV8fHUubGVuZ3RoKXx8KG51bGw9PWUmJihlPXQpLG89eSx0PW4sbj12LHU9X3QodCkpLGZhbHNlPT09ZT9yPWZhbHNlOnh0KGUpJiZcImNoYWluXCJpbiBlJiYocj1lLmNoYWluKTt2YXIgbz1uLGE9anQobyk7RHQodSxmdW5jdGlvbihlKXt2YXIgdT1uW2VdPXRbZV07YSYmKG8ucHJvdG90eXBlW2VdPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fX2NoYWluX18sZT10aGlzLl9fd3JhcHBlZF9fLGE9W2VdO2lmKGplLmFwcGx5KGEsYXJndW1lbnRzKSxhPXUuYXBwbHkobixhKSxyfHx0KXtpZihlPT09YSYmeHQoYSkpcmV0dXJuIHRoaXM7XG5hPW5ldyBvKGEpLGEuX19jaGFpbl9fPXR9cmV0dXJuIGF9KX0pfWZ1bmN0aW9uIFF0KCl7fWZ1bmN0aW9uIFh0KG4pe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdFtuXX19ZnVuY3Rpb24gWXQoKXtyZXR1cm4gdGhpcy5fX3dyYXBwZWRfX31lPWU/dXQuZGVmYXVsdHMoWi5PYmplY3QoKSxlLHV0LnBpY2soWixSKSk6Wjt2YXIgWnQ9ZS5BcnJheSxuZT1lLkJvb2xlYW4sdGU9ZS5EYXRlLGVlPWUuRnVuY3Rpb24scmU9ZS5NYXRoLHVlPWUuTnVtYmVyLG9lPWUuT2JqZWN0LGFlPWUuUmVnRXhwLGllPWUuU3RyaW5nLGxlPWUuVHlwZUVycm9yLGZlPVtdLGNlPWUuRXJyb3IucHJvdG90eXBlLHBlPW9lLnByb3RvdHlwZSxzZT1pZS5wcm90b3R5cGUsZ2U9ZS5fLGhlPXBlLnRvU3RyaW5nLHZlPWFlKFwiXlwiK2llKGhlKS5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZyxcIlxcXFwkJlwiKS5yZXBsYWNlKC90b1N0cmluZ3wgZm9yIFteXFxdXSsvZyxcIi4qP1wiKStcIiRcIikseWU9cmUuY2VpbCxtZT1lLmNsZWFyVGltZW91dCxkZT1yZS5mbG9vcixiZT1lZS5wcm90b3R5cGUudG9TdHJpbmcsX2U9dnQoX2U9b2UuZ2V0UHJvdG90eXBlT2YpJiZfZSx3ZT1wZS5oYXNPd25Qcm9wZXJ0eSxqZT1mZS5wdXNoLHhlPXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLENlPWUuc2V0VGltZW91dCxrZT1mZS5zcGxpY2UsRWU9ZmUudW5zaGlmdCxPZT1mdW5jdGlvbigpe3RyeXt2YXIgbj17fSx0PXZ0KHQ9b2UuZGVmaW5lUHJvcGVydHkpJiZ0LGU9dChuLG4sbikmJnRcbn1jYXRjaChyKXt9cmV0dXJuIGV9KCksU2U9dnQoU2U9b2UuY3JlYXRlKSYmU2UsQWU9dnQoQWU9WnQuaXNBcnJheSkmJkFlLEllPWUuaXNGaW5pdGUsRGU9ZS5pc05hTixOZT12dChOZT1vZS5rZXlzKSYmTmUsQmU9cmUubWF4LFBlPXJlLm1pbixSZT1lLnBhcnNlSW50LEZlPXJlLnJhbmRvbSxUZT17fTtUZVskXT1adCxUZVtMXT1uZSxUZVt6XT10ZSxUZVtLXT1lZSxUZVtHXT1vZSxUZVtXXT11ZSxUZVtKXT1hZSxUZVtNXT1pZTt2YXIgJGU9e307JGVbJF09JGVbel09JGVbV109e2NvbnN0cnVjdG9yOnRydWUsdG9Mb2NhbGVTdHJpbmc6dHJ1ZSx0b1N0cmluZzp0cnVlLHZhbHVlT2Y6dHJ1ZX0sJGVbTF09JGVbTV09e2NvbnN0cnVjdG9yOnRydWUsdG9TdHJpbmc6dHJ1ZSx2YWx1ZU9mOnRydWV9LCRlW3FdPSRlW0tdPSRlW0pdPXtjb25zdHJ1Y3Rvcjp0cnVlLHRvU3RyaW5nOnRydWV9LCRlW0ddPXtjb25zdHJ1Y3Rvcjp0cnVlfSxmdW5jdGlvbigpe2Zvcih2YXIgbj1GLmxlbmd0aDtuLS07KXt2YXIgdCxlPUZbbl07XG5mb3IodCBpbiAkZSl3ZS5jYWxsKCRlLHQpJiYhd2UuY2FsbCgkZVt0XSxlKSYmKCRlW3RdW2VdPWZhbHNlKX19KCkseS5wcm90b3R5cGU9di5wcm90b3R5cGU7dmFyIExlPXYuc3VwcG9ydD17fTshZnVuY3Rpb24oKXt2YXIgbj1mdW5jdGlvbigpe3RoaXMueD0xfSx0PXswOjEsbGVuZ3RoOjF9LHI9W107bi5wcm90b3R5cGU9e3ZhbHVlT2Y6MSx5OjF9O2Zvcih2YXIgdSBpbiBuZXcgbilyLnB1c2godSk7Zm9yKHUgaW4gYXJndW1lbnRzKTtMZS5hcmdzQ2xhc3M9aGUuY2FsbChhcmd1bWVudHMpPT1ULExlLmFyZ3NPYmplY3Q9YXJndW1lbnRzLmNvbnN0cnVjdG9yPT1vZSYmIShhcmd1bWVudHMgaW5zdGFuY2VvZiBadCksTGUuZW51bUVycm9yUHJvcHM9eGUuY2FsbChjZSxcIm1lc3NhZ2VcIil8fHhlLmNhbGwoY2UsXCJuYW1lXCIpLExlLmVudW1Qcm90b3R5cGVzPXhlLmNhbGwobixcInByb3RvdHlwZVwiKSxMZS5mdW5jRGVjb21wPSF2dChlLldpblJURXJyb3IpJiZCLnRlc3QoZyksTGUuZnVuY05hbWVzPXR5cGVvZiBlZS5uYW1lPT1cInN0cmluZ1wiLExlLm5vbkVudW1BcmdzPTAhPXUsTGUubm9uRW51bVNoYWRvd3M9IS92YWx1ZU9mLy50ZXN0KHIpLExlLm93bkxhc3Q9XCJ4XCIhPXJbMF0sTGUuc3BsaWNlT2JqZWN0cz0oZmUuc3BsaWNlLmNhbGwodCwwLDEpLCF0WzBdKSxMZS51bmluZGV4ZWRDaGFycz1cInh4XCIhPVwieFwiWzBdK29lKFwieFwiKVswXTtcbnRyeXtMZS5ub2RlQ2xhc3M9IShoZS5jYWxsKGRvY3VtZW50KT09RyYmISh7dG9TdHJpbmc6MH0rXCJcIikpfWNhdGNoKG8pe0xlLm5vZGVDbGFzcz10cnVlfX0oMSksdi50ZW1wbGF0ZVNldHRpbmdzPXtlc2NhcGU6LzwlLShbXFxzXFxTXSs/KSU+L2csZXZhbHVhdGU6LzwlKFtcXHNcXFNdKz8pJT4vZyxpbnRlcnBvbGF0ZTpJLHZhcmlhYmxlOlwiXCIsaW1wb3J0czp7Xzp2fX0sU2V8fChudD1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9cmV0dXJuIGZ1bmN0aW9uKHQpe2lmKHh0KHQpKXtuLnByb3RvdHlwZT10O3ZhciByPW5ldyBuO24ucHJvdG90eXBlPW51bGx9cmV0dXJuIHJ8fGUuT2JqZWN0KCl9fSgpKTt2YXIgemU9T2U/ZnVuY3Rpb24obix0KXtVLnZhbHVlPXQsT2UobixcIl9fYmluZERhdGFfX1wiLFUpfTpRdDtMZS5hcmdzQ2xhc3N8fChkdD1mdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJnR5cGVvZiBuLmxlbmd0aD09XCJudW1iZXJcIiYmd2UuY2FsbChuLFwiY2FsbGVlXCIpJiYheGUuY2FsbChuLFwiY2FsbGVlXCIpfHxmYWxzZVxufSk7dmFyIHFlPUFlfHxmdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJnR5cGVvZiBuLmxlbmd0aD09XCJudW1iZXJcIiYmaGUuY2FsbChuKT09JHx8ZmFsc2V9LEtlPXN0KHthOlwielwiLGU6XCJbXVwiLGk6XCJpZighKEJbdHlwZW9mIHpdKSlyZXR1cm4gRVwiLGc6XCJFLnB1c2gobilcIn0pLFdlPU5lP2Z1bmN0aW9uKG4pe3JldHVybiB4dChuKT9MZS5lbnVtUHJvdG90eXBlcyYmdHlwZW9mIG49PVwiZnVuY3Rpb25cInx8TGUubm9uRW51bUFyZ3MmJm4ubGVuZ3RoJiZkdChuKT9LZShuKTpOZShuKTpbXX06S2UsR2U9e2E6XCJnLGUsS1wiLGk6XCJlPWUmJnR5cGVvZiBLPT0ndW5kZWZpbmVkJz9lOmQoZSxLLDMpXCIsYjpcInR5cGVvZiB1PT0nbnVtYmVyJ1wiLHY6V2UsZzpcImlmKGUodFtuXSxuLGcpPT09ZmFsc2UpcmV0dXJuIEVcIn0sSmU9e2E6XCJ6LEgsbFwiLGk6XCJ2YXIgYT1hcmd1bWVudHMsYj0wLGM9dHlwZW9mIGw9PSdudW1iZXInPzI6YS5sZW5ndGg7d2hpbGUoKytiPGMpe3Q9YVtiXTtpZih0JiZCW3R5cGVvZiB0XSl7XCIsdjpXZSxnOlwiaWYodHlwZW9mIEVbbl09PSd1bmRlZmluZWQnKUVbbl09dFtuXVwiLGM6XCJ9fVwifSxNZT17aTpcImlmKCFCW3R5cGVvZiB0XSlyZXR1cm4gRTtcIitHZS5pLGI6ZmFsc2V9LFZlPXtcIiZcIjpcIiZhbXA7XCIsXCI8XCI6XCImbHQ7XCIsXCI+XCI6XCImZ3Q7XCIsJ1wiJzpcIiZxdW90O1wiLFwiJ1wiOlwiJiMzOTtcIn0sSGU9d3QoVmUpLFVlPWFlKFwiKFwiK1dlKEhlKS5qb2luKFwifFwiKStcIilcIixcImdcIiksUWU9YWUoXCJbXCIrV2UoVmUpLmpvaW4oXCJcIikrXCJdXCIsXCJnXCIpLFhlPXN0KEdlKSxZZT1zdChKZSx7aTpKZS5pLnJlcGxhY2UoXCI7XCIsXCI7aWYoYz4zJiZ0eXBlb2YgYVtjLTJdPT0nZnVuY3Rpb24nKXt2YXIgZT1kKGFbLS1jLTFdLGFbYy0tXSwyKX1lbHNlIGlmKGM+MiYmdHlwZW9mIGFbYy0xXT09J2Z1bmN0aW9uJyl7ZT1hWy0tY119XCIpLGc6XCJFW25dPWU/ZShFW25dLHRbbl0pOnRbbl1cIn0pLFplPXN0KEplKSxucj1zdChHZSxNZSx7ajpmYWxzZX0pLHRyPXN0KEdlLE1lKTtcbmp0KC94LykmJihqdD1mdW5jdGlvbihuKXtyZXR1cm4gdHlwZW9mIG49PVwiZnVuY3Rpb25cIiYmaGUuY2FsbChuKT09S30pO3ZhciBlcj1fZT9mdW5jdGlvbihuKXtpZighbnx8aGUuY2FsbChuKSE9R3x8IUxlLmFyZ3NDbGFzcyYmZHQobikpcmV0dXJuIGZhbHNlO3ZhciB0PW4udmFsdWVPZixlPXZ0KHQpJiYoZT1fZSh0KSkmJl9lKGUpO3JldHVybiBlP249PWV8fF9lKG4pPT1lOnl0KG4pfTp5dCxycj1jdChmdW5jdGlvbihuLHQsZSl7d2UuY2FsbChuLGUpP25bZV0rKzpuW2VdPTF9KSx1cj1jdChmdW5jdGlvbihuLHQsZSl7KHdlLmNhbGwobixlKT9uW2VdOm5bZV09W10pLnB1c2godCl9KSxvcj1jdChmdW5jdGlvbihuLHQsZSl7bltlXT10fSksYXI9QnQsaXI9dnQoaXI9dGUubm93KSYmaXJ8fGZ1bmN0aW9uKCl7cmV0dXJuKG5ldyB0ZSkuZ2V0VGltZSgpfSxscj04PT1SZShqK1wiMDhcIik/UmU6ZnVuY3Rpb24obix0KXtyZXR1cm4gUmUoa3Qobik/bi5yZXBsYWNlKEQsXCJcIik6bix0fHwwKX07XG5yZXR1cm4gdi5hZnRlcj1mdW5jdGlvbihuLHQpe2lmKCFqdCh0KSl0aHJvdyBuZXcgbGU7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIDE+LS1uP3QuYXBwbHkodGhpcyxhcmd1bWVudHMpOnZvaWQgMH19LHYuYXNzaWduPVllLHYuYXQ9ZnVuY3Rpb24obil7dmFyIHQ9YXJndW1lbnRzLGU9LTEscj1vdCh0LHRydWUsZmFsc2UsMSksdD10WzJdJiZ0WzJdW3RbMV1dPT09bj8xOnIubGVuZ3RoLHU9WnQodCk7Zm9yKExlLnVuaW5kZXhlZENoYXJzJiZrdChuKSYmKG49bi5zcGxpdChcIlwiKSk7KytlPHQ7KXVbZV09bltyW2VdXTtyZXR1cm4gdX0sdi5iaW5kPU10LHYuYmluZEFsbD1mdW5jdGlvbihuKXtmb3IodmFyIHQ9MTxhcmd1bWVudHMubGVuZ3RoP290KGFyZ3VtZW50cyx0cnVlLGZhbHNlLDEpOl90KG4pLGU9LTEscj10Lmxlbmd0aDsrK2U8cjspe3ZhciB1PXRbZV07blt1XT1wdChuW3VdLDEsbnVsbCxudWxsLG4pfXJldHVybiBufSx2LmJpbmRLZXk9ZnVuY3Rpb24obix0KXtyZXR1cm4gMjxhcmd1bWVudHMubGVuZ3RoP3B0KHQsMTkscyhhcmd1bWVudHMsMiksbnVsbCxuKTpwdCh0LDMsbnVsbCxudWxsLG4pXG59LHYuY2hhaW49ZnVuY3Rpb24obil7cmV0dXJuIG49bmV3IHkobiksbi5fX2NoYWluX189dHJ1ZSxufSx2LmNvbXBhY3Q9ZnVuY3Rpb24obil7Zm9yKHZhciB0PS0xLGU9bj9uLmxlbmd0aDowLHI9W107Kyt0PGU7KXt2YXIgdT1uW3RdO3UmJnIucHVzaCh1KX1yZXR1cm4gcn0sdi5jb21wb3NlPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPWFyZ3VtZW50cyx0PW4ubGVuZ3RoO3QtLTspaWYoIWp0KG5bdF0pKXRocm93IG5ldyBsZTtyZXR1cm4gZnVuY3Rpb24oKXtmb3IodmFyIHQ9YXJndW1lbnRzLGU9bi5sZW5ndGg7ZS0tOyl0PVtuW2VdLmFwcGx5KHRoaXMsdCldO3JldHVybiB0WzBdfX0sdi5jb25zdGFudD1mdW5jdGlvbihuKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbn19LHYuY291bnRCeT1ycix2LmNyZWF0ZT1mdW5jdGlvbihuLHQpe3ZhciBlPW50KG4pO3JldHVybiB0P1llKGUsdCk6ZX0sdi5jcmVhdGVDYWxsYmFjaz1mdW5jdGlvbihuLHQsZSl7dmFyIHI9dHlwZW9mIG47aWYobnVsbD09bnx8XCJmdW5jdGlvblwiPT1yKXJldHVybiB0dChuLHQsZSk7XG5pZihcIm9iamVjdFwiIT1yKXJldHVybiBYdChuKTt2YXIgdT1XZShuKSxvPXVbMF0sYT1uW29dO3JldHVybiAxIT11Lmxlbmd0aHx8YSE9PWF8fHh0KGEpP2Z1bmN0aW9uKHQpe2Zvcih2YXIgZT11Lmxlbmd0aCxyPWZhbHNlO2UtLSYmKHI9YXQodFt1W2VdXSxuW3VbZV1dLG51bGwsdHJ1ZSkpOyk7cmV0dXJuIHJ9OmZ1bmN0aW9uKG4pe3JldHVybiBuPW5bb10sYT09PW4mJigwIT09YXx8MS9hPT0xL24pfX0sdi5jdXJyeT1mdW5jdGlvbihuLHQpe3JldHVybiB0PXR5cGVvZiB0PT1cIm51bWJlclwiP3Q6K3R8fG4ubGVuZ3RoLHB0KG4sNCxudWxsLG51bGwsbnVsbCx0KX0sdi5kZWJvdW5jZT1WdCx2LmRlZmF1bHRzPVplLHYuZGVmZXI9ZnVuY3Rpb24obil7aWYoIWp0KG4pKXRocm93IG5ldyBsZTt2YXIgdD1zKGFyZ3VtZW50cywxKTtyZXR1cm4gQ2UoZnVuY3Rpb24oKXtuLmFwcGx5KGgsdCl9LDEpfSx2LmRlbGF5PWZ1bmN0aW9uKG4sdCl7aWYoIWp0KG4pKXRocm93IG5ldyBsZTt2YXIgZT1zKGFyZ3VtZW50cywyKTtcbnJldHVybiBDZShmdW5jdGlvbigpe24uYXBwbHkoaCxlKX0sdCl9LHYuZGlmZmVyZW5jZT1mdW5jdGlvbihuKXtyZXR1cm4gcnQobixvdChhcmd1bWVudHMsdHJ1ZSx0cnVlLDEpKX0sdi5maWx0ZXI9QXQsdi5mbGF0dGVuPWZ1bmN0aW9uKG4sdCxlLHIpe3JldHVybiB0eXBlb2YgdCE9XCJib29sZWFuXCImJm51bGwhPXQmJihyPWUsZT10eXBlb2YgdCE9XCJmdW5jdGlvblwiJiZyJiZyW3RdPT09bj9udWxsOnQsdD1mYWxzZSksbnVsbCE9ZSYmKG49QnQobixlLHIpKSxvdChuLHQpfSx2LmZvckVhY2g9RHQsdi5mb3JFYWNoUmlnaHQ9TnQsdi5mb3JJbj1ucix2LmZvckluUmlnaHQ9ZnVuY3Rpb24obix0LGUpe3ZhciByPVtdO25yKG4sZnVuY3Rpb24obix0KXtyLnB1c2godCxuKX0pO3ZhciB1PXIubGVuZ3RoO2Zvcih0PXR0KHQsZSwzKTt1LS0mJmZhbHNlIT09dChyW3UtLV0sclt1XSxuKTspO3JldHVybiBufSx2LmZvck93bj10cix2LmZvck93blJpZ2h0PWJ0LHYuZnVuY3Rpb25zPV90LHYuZ3JvdXBCeT11cix2LmluZGV4Qnk9b3Isdi5pbml0aWFsPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0wLHU9bj9uLmxlbmd0aDowO1xuaWYodHlwZW9mIHQhPVwibnVtYmVyXCImJm51bGwhPXQpe3ZhciBvPXU7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7by0tJiZ0KG5bb10sbyxuKTspcisrfWVsc2Ugcj1udWxsPT10fHxlPzE6dHx8cjtyZXR1cm4gcyhuLDAsUGUoQmUoMCx1LXIpLHUpKX0sdi5pbnRlcnNlY3Rpb249ZnVuY3Rpb24oKXtmb3IodmFyIGU9W10scj0tMSx1PWFyZ3VtZW50cy5sZW5ndGgsYT1pKCksbD1odCgpLGY9bD09PW4scz1pKCk7KytyPHU7KXt2YXIgZz1hcmd1bWVudHNbcl07KHFlKGcpfHxkdChnKSkmJihlLnB1c2goZyksYS5wdXNoKGYmJmcubGVuZ3RoPj1fJiZvKHI/ZVtyXTpzKSkpfXZhciBmPWVbMF0saD0tMSx2PWY/Zi5sZW5ndGg6MCx5PVtdO246Zm9yKDsrK2g8djspe3ZhciBtPWFbMF0sZz1mW2hdO2lmKDA+KG0/dChtLGcpOmwocyxnKSkpe2ZvcihyPXUsKG18fHMpLnB1c2goZyk7LS1yOylpZihtPWFbcl0sMD4obT90KG0sZyk6bChlW3JdLGcpKSljb250aW51ZSBuO3kucHVzaChnKVxufX1mb3IoO3UtLTspKG09YVt1XSkmJnAobSk7cmV0dXJuIGMoYSksYyhzKSx5fSx2LmludmVydD13dCx2Lmludm9rZT1mdW5jdGlvbihuLHQpe3ZhciBlPXMoYXJndW1lbnRzLDIpLHI9LTEsdT10eXBlb2YgdD09XCJmdW5jdGlvblwiLG89bj9uLmxlbmd0aDowLGE9WnQodHlwZW9mIG89PVwibnVtYmVyXCI/bzowKTtyZXR1cm4gRHQobixmdW5jdGlvbihuKXthWysrcl09KHU/dDpuW3RdKS5hcHBseShuLGUpfSksYX0sdi5rZXlzPVdlLHYubWFwPUJ0LHYubWFwVmFsdWVzPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj17fTtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSx0cihuLGZ1bmN0aW9uKG4sZSx1KXtyW2VdPXQobixlLHUpfSkscn0sdi5tYXg9UHQsdi5tZW1vaXplPWZ1bmN0aW9uKG4sdCl7aWYoIWp0KG4pKXRocm93IG5ldyBsZTt2YXIgZT1mdW5jdGlvbigpe3ZhciByPWUuY2FjaGUsdT10P3QuYXBwbHkodGhpcyxhcmd1bWVudHMpOmIrYXJndW1lbnRzWzBdO3JldHVybiB3ZS5jYWxsKHIsdSk/clt1XTpyW3VdPW4uYXBwbHkodGhpcyxhcmd1bWVudHMpXG59O3JldHVybiBlLmNhY2hlPXt9LGV9LHYubWVyZ2U9ZnVuY3Rpb24obil7dmFyIHQ9YXJndW1lbnRzLGU9MjtpZigheHQobikpcmV0dXJuIG47aWYoXCJudW1iZXJcIiE9dHlwZW9mIHRbMl0mJihlPXQubGVuZ3RoKSwzPGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHRbZS0yXSl2YXIgcj10dCh0Wy0tZS0xXSx0W2UtLV0sMik7ZWxzZSAyPGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHRbZS0xXSYmKHI9dFstLWVdKTtmb3IodmFyIHQ9cyhhcmd1bWVudHMsMSxlKSx1PS0xLG89aSgpLGE9aSgpOysrdTxlOylpdChuLHRbdV0scixvLGEpO3JldHVybiBjKG8pLGMoYSksbn0sdi5taW49ZnVuY3Rpb24obix0LGUpe3ZhciB1PTEvMCxvPXU7aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIiYmZSYmZVt0XT09PW4mJih0PW51bGwpLG51bGw9PXQmJnFlKG4pKXtlPS0xO2Zvcih2YXIgYT1uLmxlbmd0aDsrK2U8YTspe3ZhciBpPW5bZV07aTxvJiYobz1pKX19ZWxzZSB0PW51bGw9PXQmJmt0KG4pP3I6di5jcmVhdGVDYWxsYmFjayh0LGUsMyksWGUobixmdW5jdGlvbihuLGUscil7ZT10KG4sZSxyKSxlPHUmJih1PWUsbz1uKVxufSk7cmV0dXJuIG99LHYub21pdD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9e307aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIil7dmFyIHU9W107bnIobixmdW5jdGlvbihuLHQpe3UucHVzaCh0KX0pO2Zvcih2YXIgdT1ydCh1LG90KGFyZ3VtZW50cyx0cnVlLGZhbHNlLDEpKSxvPS0xLGE9dS5sZW5ndGg7KytvPGE7KXt2YXIgaT11W29dO3JbaV09bltpXX19ZWxzZSB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLG5yKG4sZnVuY3Rpb24obixlLHUpe3QobixlLHUpfHwocltlXT1uKX0pO3JldHVybiByfSx2Lm9uY2U9ZnVuY3Rpb24obil7dmFyIHQsZTtpZighanQobikpdGhyb3cgbmV3IGxlO3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0P2U6KHQ9dHJ1ZSxlPW4uYXBwbHkodGhpcyxhcmd1bWVudHMpLG49bnVsbCxlKX19LHYucGFpcnM9ZnVuY3Rpb24obil7Zm9yKHZhciB0PS0xLGU9V2Uobikscj1lLmxlbmd0aCx1PVp0KHIpOysrdDxyOyl7dmFyIG89ZVt0XTt1W3RdPVtvLG5bb11dfXJldHVybiB1XG59LHYucGFydGlhbD1mdW5jdGlvbihuKXtyZXR1cm4gcHQobiwxNixzKGFyZ3VtZW50cywxKSl9LHYucGFydGlhbFJpZ2h0PWZ1bmN0aW9uKG4pe3JldHVybiBwdChuLDMyLG51bGwscyhhcmd1bWVudHMsMSkpfSx2LnBpY2s9ZnVuY3Rpb24obix0LGUpe3ZhciByPXt9O2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpZm9yKHZhciB1PS0xLG89b3QoYXJndW1lbnRzLHRydWUsZmFsc2UsMSksYT14dChuKT9vLmxlbmd0aDowOysrdTxhOyl7dmFyIGk9b1t1XTtpIGluIG4mJihyW2ldPW5baV0pfWVsc2UgdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxucihuLGZ1bmN0aW9uKG4sZSx1KXt0KG4sZSx1KSYmKHJbZV09bil9KTtyZXR1cm4gcn0sdi5wbHVjaz1hcix2LnByb3BlcnR5PVh0LHYucHVsbD1mdW5jdGlvbihuKXtmb3IodmFyIHQ9YXJndW1lbnRzLGU9MCxyPXQubGVuZ3RoLHU9bj9uLmxlbmd0aDowOysrZTxyOylmb3IodmFyIG89LTEsYT10W2VdOysrbzx1OyluW29dPT09YSYmKGtlLmNhbGwobixvLS0sMSksdS0tKTtcbnJldHVybiBufSx2LnJhbmdlPWZ1bmN0aW9uKG4sdCxlKXtuPStufHwwLGU9dHlwZW9mIGU9PVwibnVtYmVyXCI/ZTorZXx8MSxudWxsPT10JiYodD1uLG49MCk7dmFyIHI9LTE7dD1CZSgwLHllKCh0LW4pLyhlfHwxKSkpO2Zvcih2YXIgdT1adCh0KTsrK3I8dDspdVtyXT1uLG4rPWU7cmV0dXJuIHV9LHYucmVqZWN0PWZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxBdChuLGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4hdChuLGUscil9KX0sdi5yZW1vdmU9ZnVuY3Rpb24obix0LGUpe3ZhciByPS0xLHU9bj9uLmxlbmd0aDowLG89W107Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7KytyPHU7KWU9bltyXSx0KGUscixuKSYmKG8ucHVzaChlKSxrZS5jYWxsKG4sci0tLDEpLHUtLSk7cmV0dXJuIG99LHYucmVzdD1xdCx2LnNodWZmbGU9VHQsdi5zb3J0Qnk9ZnVuY3Rpb24obix0LGUpe3ZhciByPS0xLG89cWUodCksYT1uP24ubGVuZ3RoOjAsZj1adCh0eXBlb2YgYT09XCJudW1iZXJcIj9hOjApO1xuZm9yKG98fCh0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpKSxEdChuLGZ1bmN0aW9uKG4sZSx1KXt2YXIgYT1mWysrcl09bCgpO28/YS5tPUJ0KHQsZnVuY3Rpb24odCl7cmV0dXJuIG5bdF19KTooYS5tPWkoKSlbMF09dChuLGUsdSksYS5uPXIsYS5vPW59KSxhPWYubGVuZ3RoLGYuc29ydCh1KTthLS07KW49ZlthXSxmW2FdPW4ubyxvfHxjKG4ubSkscChuKTtyZXR1cm4gZn0sdi50YXA9ZnVuY3Rpb24obix0KXtyZXR1cm4gdChuKSxufSx2LnRocm90dGxlPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj10cnVlLHU9dHJ1ZTtpZighanQobikpdGhyb3cgbmV3IGxlO3JldHVybiBmYWxzZT09PWU/cj1mYWxzZTp4dChlKSYmKHI9XCJsZWFkaW5nXCJpbiBlP2UubGVhZGluZzpyLHU9XCJ0cmFpbGluZ1wiaW4gZT9lLnRyYWlsaW5nOnUpLEgubGVhZGluZz1yLEgubWF4V2FpdD10LEgudHJhaWxpbmc9dSxWdChuLHQsSCl9LHYudGltZXM9ZnVuY3Rpb24obix0LGUpe249LTE8KG49K24pP246MDt2YXIgcj0tMSx1PVp0KG4pO1xuZm9yKHQ9dHQodCxlLDEpOysrcjxuOyl1W3JdPXQocik7cmV0dXJuIHV9LHYudG9BcnJheT1mdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiP0xlLnVuaW5kZXhlZENoYXJzJiZrdChuKT9uLnNwbGl0KFwiXCIpOnMobik6RXQobil9LHYudHJhbnNmb3JtPWZ1bmN0aW9uKG4sdCxlLHIpe3ZhciB1PXFlKG4pO2lmKG51bGw9PWUpaWYodSllPVtdO2Vsc2V7dmFyIG89biYmbi5jb25zdHJ1Y3RvcjtlPW50KG8mJm8ucHJvdG90eXBlKX1yZXR1cm4gdCYmKHQ9di5jcmVhdGVDYWxsYmFjayh0LHIsNCksKHU/WGU6dHIpKG4sZnVuY3Rpb24obixyLHUpe3JldHVybiB0KGUsbixyLHUpfSkpLGV9LHYudW5pb249ZnVuY3Rpb24oKXtyZXR1cm4gZnQob3QoYXJndW1lbnRzLHRydWUsdHJ1ZSkpfSx2LnVuaXE9V3Qsdi52YWx1ZXM9RXQsdi53aGVyZT1BdCx2LndpdGhvdXQ9ZnVuY3Rpb24obil7cmV0dXJuIHJ0KG4scyhhcmd1bWVudHMsMSkpfSx2LndyYXA9ZnVuY3Rpb24obix0KXtyZXR1cm4gcHQodCwxNixbbl0pXG59LHYueG9yPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPS0xLHQ9YXJndW1lbnRzLmxlbmd0aDsrK248dDspe3ZhciBlPWFyZ3VtZW50c1tuXTtpZihxZShlKXx8ZHQoZSkpdmFyIHI9cj9mdChydChyLGUpLmNvbmNhdChydChlLHIpKSk6ZX1yZXR1cm4gcnx8W119LHYuemlwPUd0LHYuemlwT2JqZWN0PUp0LHYuY29sbGVjdD1CdCx2LmRyb3A9cXQsdi5lYWNoPUR0LHYuZWFjaFJpZ2h0PU50LHYuZXh0ZW5kPVllLHYubWV0aG9kcz1fdCx2Lm9iamVjdD1KdCx2LnNlbGVjdD1BdCx2LnRhaWw9cXQsdi51bmlxdWU9V3Qsdi51bnppcD1HdCxVdCh2KSx2LmNsb25lPWZ1bmN0aW9uKG4sdCxlLHIpe3JldHVybiB0eXBlb2YgdCE9XCJib29sZWFuXCImJm51bGwhPXQmJihyPWUsZT10LHQ9ZmFsc2UpLFkobix0LHR5cGVvZiBlPT1cImZ1bmN0aW9uXCImJnR0KGUsciwxKSl9LHYuY2xvbmVEZWVwPWZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gWShuLHRydWUsdHlwZW9mIHQ9PVwiZnVuY3Rpb25cIiYmdHQodCxlLDEpKX0sdi5jb250YWlucz1PdCx2LmVzY2FwZT1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbD09bj9cIlwiOmllKG4pLnJlcGxhY2UoUWUsZ3QpXG59LHYuZXZlcnk9U3Qsdi5maW5kPUl0LHYuZmluZEluZGV4PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0tMSx1PW4/bi5sZW5ndGg6MDtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK3I8dTspaWYodChuW3JdLHIsbikpcmV0dXJuIHI7cmV0dXJuLTF9LHYuZmluZEtleT1mdW5jdGlvbihuLHQsZSl7dmFyIHI7cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksdHIobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQobixlLHUpPyhyPWUsZmFsc2UpOnZvaWQgMH0pLHJ9LHYuZmluZExhc3Q9ZnVuY3Rpb24obix0LGUpe3ZhciByO3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLE50KG4sZnVuY3Rpb24obixlLHUpe3JldHVybiB0KG4sZSx1KT8ocj1uLGZhbHNlKTp2b2lkIDB9KSxyfSx2LmZpbmRMYXN0SW5kZXg9ZnVuY3Rpb24obix0LGUpe3ZhciByPW4/bi5sZW5ndGg6MDtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTtyLS07KWlmKHQobltyXSxyLG4pKXJldHVybiByO1xucmV0dXJuLTF9LHYuZmluZExhc3RLZXk9ZnVuY3Rpb24obix0LGUpe3ZhciByO3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLGJ0KG4sZnVuY3Rpb24obixlLHUpe3JldHVybiB0KG4sZSx1KT8ocj1lLGZhbHNlKTp2b2lkIDB9KSxyfSx2Lmhhcz1mdW5jdGlvbihuLHQpe3JldHVybiBuP3dlLmNhbGwobix0KTpmYWxzZX0sdi5pZGVudGl0eT1IdCx2LmluZGV4T2Y9enQsdi5pc0FyZ3VtZW50cz1kdCx2LmlzQXJyYXk9cWUsdi5pc0Jvb2xlYW49ZnVuY3Rpb24obil7cmV0dXJuIHRydWU9PT1ufHxmYWxzZT09PW58fG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT1MfHxmYWxzZX0sdi5pc0RhdGU9ZnVuY3Rpb24obil7cmV0dXJuIG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT16fHxmYWxzZX0sdi5pc0VsZW1lbnQ9ZnVuY3Rpb24obil7cmV0dXJuIG4mJjE9PT1uLm5vZGVUeXBlfHxmYWxzZX0sdi5pc0VtcHR5PWZ1bmN0aW9uKG4pe3ZhciB0PXRydWU7aWYoIW4pcmV0dXJuIHQ7dmFyIGU9aGUuY2FsbChuKSxyPW4ubGVuZ3RoO1xucmV0dXJuIGU9PSR8fGU9PU18fChMZS5hcmdzQ2xhc3M/ZT09VDpkdChuKSl8fGU9PUcmJnR5cGVvZiByPT1cIm51bWJlclwiJiZqdChuLnNwbGljZSk/IXI6KHRyKG4sZnVuY3Rpb24oKXtyZXR1cm4gdD1mYWxzZX0pLHQpfSx2LmlzRXF1YWw9ZnVuY3Rpb24obix0LGUscil7cmV0dXJuIGF0KG4sdCx0eXBlb2YgZT09XCJmdW5jdGlvblwiJiZ0dChlLHIsMikpfSx2LmlzRmluaXRlPWZ1bmN0aW9uKG4pe3JldHVybiBJZShuKSYmIURlKHBhcnNlRmxvYXQobikpfSx2LmlzRnVuY3Rpb249anQsdi5pc05hTj1mdW5jdGlvbihuKXtyZXR1cm4gQ3QobikmJm4hPStufSx2LmlzTnVsbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbD09PW59LHYuaXNOdW1iZXI9Q3Qsdi5pc09iamVjdD14dCx2LmlzUGxhaW5PYmplY3Q9ZXIsdi5pc1JlZ0V4cD1mdW5jdGlvbihuKXtyZXR1cm4gbiYmWFt0eXBlb2Ygbl0mJmhlLmNhbGwobik9PUp8fGZhbHNlfSx2LmlzU3RyaW5nPWt0LHYuaXNVbmRlZmluZWQ9ZnVuY3Rpb24obil7cmV0dXJuIHR5cGVvZiBuPT1cInVuZGVmaW5lZFwiXG59LHYubGFzdEluZGV4T2Y9ZnVuY3Rpb24obix0LGUpe3ZhciByPW4/bi5sZW5ndGg6MDtmb3IodHlwZW9mIGU9PVwibnVtYmVyXCImJihyPSgwPmU/QmUoMCxyK2UpOlBlKGUsci0xKSkrMSk7ci0tOylpZihuW3JdPT09dClyZXR1cm4gcjtyZXR1cm4tMX0sdi5taXhpbj1VdCx2Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gZS5fPWdlLHRoaXN9LHYubm9vcD1RdCx2Lm5vdz1pcix2LnBhcnNlSW50PWxyLHYucmFuZG9tPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj1udWxsPT1uLHU9bnVsbD09dDtyZXR1cm4gbnVsbD09ZSYmKHR5cGVvZiBuPT1cImJvb2xlYW5cIiYmdT8oZT1uLG49MSk6dXx8dHlwZW9mIHQhPVwiYm9vbGVhblwifHwoZT10LHU9dHJ1ZSkpLHImJnUmJih0PTEpLG49K258fDAsdT8odD1uLG49MCk6dD0rdHx8MCxlfHxuJTF8fHQlMT8oZT1GZSgpLFBlKG4rZSoodC1uK3BhcnNlRmxvYXQoXCIxZS1cIisoKGUrXCJcIikubGVuZ3RoLTEpKSksdCkpOmx0KG4sdCl9LHYucmVkdWNlPVJ0LHYucmVkdWNlUmlnaHQ9RnQsdi5yZXN1bHQ9ZnVuY3Rpb24obix0KXtpZihuKXt2YXIgZT1uW3RdO1xucmV0dXJuIGp0KGUpP25bdF0oKTplfX0sdi5ydW5JbkNvbnRleHQ9Zyx2LnNpemU9ZnVuY3Rpb24obil7dmFyIHQ9bj9uLmxlbmd0aDowO3JldHVybiB0eXBlb2YgdD09XCJudW1iZXJcIj90OldlKG4pLmxlbmd0aH0sdi5zb21lPSR0LHYuc29ydGVkSW5kZXg9S3Qsdi50ZW1wbGF0ZT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9di50ZW1wbGF0ZVNldHRpbmdzO249aWUobnx8XCJcIiksZT1aZSh7fSxlLHIpO3ZhciB1LG89WmUoe30sZS5pbXBvcnRzLHIuaW1wb3J0cykscj1XZShvKSxvPUV0KG8pLGk9MCxsPWUuaW50ZXJwb2xhdGV8fE4sZj1cIl9fcCs9J1wiLGw9YWUoKGUuZXNjYXBlfHxOKS5zb3VyY2UrXCJ8XCIrbC5zb3VyY2UrXCJ8XCIrKGw9PT1JP086Tikuc291cmNlK1wifFwiKyhlLmV2YWx1YXRlfHxOKS5zb3VyY2UrXCJ8JFwiLFwiZ1wiKTtuLnJlcGxhY2UobCxmdW5jdGlvbih0LGUscixvLGwsYyl7cmV0dXJuIHJ8fChyPW8pLGYrPW4uc2xpY2UoaSxjKS5yZXBsYWNlKFAsYSksZSYmKGYrPVwiJytfX2UoXCIrZStcIikrJ1wiKSxsJiYodT10cnVlLGYrPVwiJztcIitsK1wiO1xcbl9fcCs9J1wiKSxyJiYoZis9XCInKygoX190PShcIityK1wiKSk9PW51bGw/Jyc6X190KSsnXCIpLGk9Yyt0Lmxlbmd0aCx0XG59KSxmKz1cIic7XCIsbD1lPWUudmFyaWFibGUsbHx8KGU9XCJvYmpcIixmPVwid2l0aChcIitlK1wiKXtcIitmK1wifVwiKSxmPSh1P2YucmVwbGFjZSh4LFwiXCIpOmYpLnJlcGxhY2UoQyxcIiQxXCIpLnJlcGxhY2UoRSxcIiQxO1wiKSxmPVwiZnVuY3Rpb24oXCIrZStcIil7XCIrKGw/XCJcIjplK1wifHwoXCIrZStcIj17fSk7XCIpK1widmFyIF9fdCxfX3A9JycsX19lPV8uZXNjYXBlXCIrKHU/XCIsX19qPUFycmF5LnByb3RvdHlwZS5qb2luO2Z1bmN0aW9uIHByaW50KCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpfVwiOlwiO1wiKStmK1wicmV0dXJuIF9fcH1cIjt0cnl7dmFyIGM9ZWUocixcInJldHVybiBcIitmKS5hcHBseShoLG8pfWNhdGNoKHApe3Rocm93IHAuc291cmNlPWYscH1yZXR1cm4gdD9jKHQpOihjLnNvdXJjZT1mLGMpfSx2LnVuZXNjYXBlPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsPT1uP1wiXCI6aWUobikucmVwbGFjZShVZSxtdCl9LHYudW5pcXVlSWQ9ZnVuY3Rpb24obil7dmFyIHQ9KyttO3JldHVybiBpZShudWxsPT1uP1wiXCI6bikrdFxufSx2LmFsbD1TdCx2LmFueT0kdCx2LmRldGVjdD1JdCx2LmZpbmRXaGVyZT1JdCx2LmZvbGRsPVJ0LHYuZm9sZHI9RnQsdi5pbmNsdWRlPU90LHYuaW5qZWN0PVJ0LFV0KGZ1bmN0aW9uKCl7dmFyIG49e307cmV0dXJuIHRyKHYsZnVuY3Rpb24odCxlKXt2LnByb3RvdHlwZVtlXXx8KG5bZV09dCl9KSxufSgpLGZhbHNlKSx2LmZpcnN0PUx0LHYubGFzdD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9MCx1PW4/bi5sZW5ndGg6MDtpZih0eXBlb2YgdCE9XCJudW1iZXJcIiYmbnVsbCE9dCl7dmFyIG89dTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTtvLS0mJnQobltvXSxvLG4pOylyKyt9ZWxzZSBpZihyPXQsbnVsbD09cnx8ZSlyZXR1cm4gbj9uW3UtMV06aDtyZXR1cm4gcyhuLEJlKDAsdS1yKSl9LHYuc2FtcGxlPWZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gbiYmdHlwZW9mIG4ubGVuZ3RoIT1cIm51bWJlclwiP249RXQobik6TGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pJiYobj1uLnNwbGl0KFwiXCIpKSxudWxsPT10fHxlP24/bltsdCgwLG4ubGVuZ3RoLTEpXTpoOihuPVR0KG4pLG4ubGVuZ3RoPVBlKEJlKDAsdCksbi5sZW5ndGgpLG4pXG59LHYudGFrZT1MdCx2LmhlYWQ9THQsdHIodixmdW5jdGlvbihuLHQpe3ZhciBlPVwic2FtcGxlXCIhPT10O3YucHJvdG90eXBlW3RdfHwodi5wcm90b3R5cGVbdF09ZnVuY3Rpb24odCxyKXt2YXIgdT10aGlzLl9fY2hhaW5fXyxvPW4odGhpcy5fX3dyYXBwZWRfXyx0LHIpO3JldHVybiB1fHxudWxsIT10JiYoIXJ8fGUmJnR5cGVvZiB0PT1cImZ1bmN0aW9uXCIpP25ldyB5KG8sdSk6b30pfSksdi5WRVJTSU9OPVwiMi40LjFcIix2LnByb3RvdHlwZS5jaGFpbj1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9fY2hhaW5fXz10cnVlLHRoaXN9LHYucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIGllKHRoaXMuX193cmFwcGVkX18pfSx2LnByb3RvdHlwZS52YWx1ZT1ZdCx2LnByb3RvdHlwZS52YWx1ZU9mPVl0LFhlKFtcImpvaW5cIixcInBvcFwiLFwic2hpZnRcIl0sZnVuY3Rpb24obil7dmFyIHQ9ZmVbbl07di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fY2hhaW5fXyxlPXQuYXBwbHkodGhpcy5fX3dyYXBwZWRfXyxhcmd1bWVudHMpO1xucmV0dXJuIG4/bmV3IHkoZSxuKTplfX0pLFhlKFtcInB1c2hcIixcInJldmVyc2VcIixcInNvcnRcIixcInVuc2hpZnRcIl0sZnVuY3Rpb24obil7dmFyIHQ9ZmVbbl07di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXtyZXR1cm4gdC5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLGFyZ3VtZW50cyksdGhpc319KSxYZShbXCJjb25jYXRcIixcInNsaWNlXCIsXCJzcGxpY2VcIl0sZnVuY3Rpb24obil7dmFyIHQ9ZmVbbl07di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHkodC5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLGFyZ3VtZW50cyksdGhpcy5fX2NoYWluX18pfX0pLExlLnNwbGljZU9iamVjdHN8fFhlKFtcInBvcFwiLFwic2hpZnRcIixcInNwbGljZVwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXSxlPVwic3BsaWNlXCI9PW47di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fY2hhaW5fXyxyPXRoaXMuX193cmFwcGVkX18sdT10LmFwcGx5KHIsYXJndW1lbnRzKTtyZXR1cm4gMD09PXIubGVuZ3RoJiZkZWxldGUgclswXSxufHxlP25ldyB5KHUsbik6dVxufX0pLHZ9dmFyIGgsdj1bXSx5PVtdLG09MCxkPXt9LGI9K25ldyBEYXRlK1wiXCIsXz03NSx3PTQwLGo9XCIgXFx0XFx4MEJcXGZcXHhhMFxcdWZlZmZcXG5cXHJcXHUyMDI4XFx1MjAyOVxcdTE2ODBcXHUxODBlXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMGFcXHUyMDJmXFx1MjA1ZlxcdTMwMDBcIix4PS9cXGJfX3BcXCs9Jyc7L2csQz0vXFxiKF9fcFxcKz0pJydcXCsvZyxFPS8oX19lXFwoLio/XFwpfFxcYl9fdFxcKSlcXCsnJzsvZyxPPS9cXCRcXHsoW15cXFxcfV0qKD86XFxcXC5bXlxcXFx9XSopKilcXH0vZyxTPS9cXHcqJC8sQT0vXlxccypmdW5jdGlvblsgXFxuXFxyXFx0XStcXHcvLEk9LzwlPShbXFxzXFxTXSs/KSU+L2csRD1SZWdFeHAoXCJeW1wiK2orXCJdKjArKD89LiQpXCIpLE49LygkXikvLEI9L1xcYnRoaXNcXGIvLFA9L1snXFxuXFxyXFx0XFx1MjAyOFxcdTIwMjlcXFxcXS9nLFI9XCJBcnJheSBCb29sZWFuIERhdGUgRXJyb3IgRnVuY3Rpb24gTWF0aCBOdW1iZXIgT2JqZWN0IFJlZ0V4cCBTdHJpbmcgXyBhdHRhY2hFdmVudCBjbGVhclRpbWVvdXQgaXNGaW5pdGUgaXNOYU4gcGFyc2VJbnQgc2V0VGltZW91dFwiLnNwbGl0KFwiIFwiKSxGPVwiY29uc3RydWN0b3IgaGFzT3duUHJvcGVydHkgaXNQcm90b3R5cGVPZiBwcm9wZXJ0eUlzRW51bWVyYWJsZSB0b0xvY2FsZVN0cmluZyB0b1N0cmluZyB2YWx1ZU9mXCIuc3BsaXQoXCIgXCIpLFQ9XCJbb2JqZWN0IEFyZ3VtZW50c11cIiwkPVwiW29iamVjdCBBcnJheV1cIixMPVwiW29iamVjdCBCb29sZWFuXVwiLHo9XCJbb2JqZWN0IERhdGVdXCIscT1cIltvYmplY3QgRXJyb3JdXCIsSz1cIltvYmplY3QgRnVuY3Rpb25dXCIsVz1cIltvYmplY3QgTnVtYmVyXVwiLEc9XCJbb2JqZWN0IE9iamVjdF1cIixKPVwiW29iamVjdCBSZWdFeHBdXCIsTT1cIltvYmplY3QgU3RyaW5nXVwiLFY9e307XG5WW0tdPWZhbHNlLFZbVF09VlskXT1WW0xdPVZbel09VltXXT1WW0ddPVZbSl09VltNXT10cnVlO3ZhciBIPXtsZWFkaW5nOmZhbHNlLG1heFdhaXQ6MCx0cmFpbGluZzpmYWxzZX0sVT17Y29uZmlndXJhYmxlOmZhbHNlLGVudW1lcmFibGU6ZmFsc2UsdmFsdWU6bnVsbCx3cml0YWJsZTpmYWxzZX0sUT17YTpcIlwiLGI6bnVsbCxjOlwiXCIsZDpcIlwiLGU6XCJcIix2Om51bGwsZzpcIlwiLGg6bnVsbCxzdXBwb3J0Om51bGwsaTpcIlwiLGo6ZmFsc2V9LFg9e1wiYm9vbGVhblwiOmZhbHNlLFwiZnVuY3Rpb25cIjp0cnVlLG9iamVjdDp0cnVlLG51bWJlcjpmYWxzZSxzdHJpbmc6ZmFsc2UsdW5kZWZpbmVkOmZhbHNlfSxZPXtcIlxcXFxcIjpcIlxcXFxcIixcIidcIjpcIidcIixcIlxcblwiOlwiblwiLFwiXFxyXCI6XCJyXCIsXCJcXHRcIjpcInRcIixcIlxcdTIwMjhcIjpcInUyMDI4XCIsXCJcXHUyMDI5XCI6XCJ1MjAyOVwifSxaPVhbdHlwZW9mIHdpbmRvd10mJndpbmRvd3x8dGhpcyxudD1YW3R5cGVvZiBleHBvcnRzXSYmZXhwb3J0cyYmIWV4cG9ydHMubm9kZVR5cGUmJmV4cG9ydHMsdHQ9WFt0eXBlb2YgbW9kdWxlXSYmbW9kdWxlJiYhbW9kdWxlLm5vZGVUeXBlJiZtb2R1bGUsZXQ9dHQmJnR0LmV4cG9ydHM9PT1udCYmbnQscnQ9WFt0eXBlb2YgZ2xvYmFsXSYmZ2xvYmFsO1xuIXJ0fHxydC5nbG9iYWwhPT1ydCYmcnQud2luZG93IT09cnR8fChaPXJ0KTt2YXIgdXQ9ZygpO3R5cGVvZiBkZWZpbmU9PVwiZnVuY3Rpb25cIiYmdHlwZW9mIGRlZmluZS5hbWQ9PVwib2JqZWN0XCImJmRlZmluZS5hbWQ/KFouXz11dCwgZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIHV0fSkpOm50JiZ0dD9ldD8odHQuZXhwb3J0cz11dCkuXz11dDpudC5fPXV0OlouXz11dH0pLmNhbGwodGhpcyk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsInZhciBjb29raWVzID0gcmVxdWlyZSgnLi4vbGliL2Nvb2tpZXMnKTtcbnZhciAkID0gd2luZG93LmpRdWVyeTtcbnZhciBkZWZfb3B0ID0ge1xuICAgIGNhY2hlIDogZmFsc2UsXG4gICAgZGF0YVR5cGUgOiBcImpzb25cIlxufTtcblxudmFyIGFqYXggPSBmdW5jdGlvbihvcHQpe1xuICAgIG9wdCA9ICQuZXh0ZW5kKGRlZl9vcHQgLCBvcHQgKTtcbiAgICB2YXIgZGF0YSA9IG9wdC5kYXRhIHx8IHt9O1xuICAgIGRhdGEuY3NyZnRva2VuID0gY29va2llcy5nZXRJdGVtKFwiY3NyZnRva2VuXCIpO1xuICAgIG9wdC5kYXRhID0gZGF0YTtcbiAgICByZXR1cm4gJC5hamF4KG9wdCk7XG59XG5cbnZhciBodHRwID0ge1xuICAgIGdldCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIG9wdC50eXBlID0gXCJnZXRcIjtcbiAgICAgICAgcmV0dXJuIGFqYXgob3B0KTtcbiAgICB9LFxuICAgIHBvc3QgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBvcHQudHlwZSA9IFwicG9zdFwiO1xuICAgICAgICByZXR1cm4gYWpheChvcHQpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaHR0cDtcbiIsInZhciBEaWFsb2cgPSByZXF1aXJlKFwiLi4vbGliL2lkaWFsb2dcIik7XG5cblxudmFyIHBvcCA9IGZ1bmN0aW9uKGNvbnRlbnQpe1xuICAgIHZhciBkbGcgPSBuZXcgRGlhbG9nKHtcbiAgICAgICAgY29udGVudCA6IGNvbnRlbnRcbiAgICB9KTtcbiAgICBkbGcuaGlkZSgpO1xuICAgIHJldHVybiBkbGc7XG59XG5cblxudmFyIGFsZXJ0X2RsZyAsIGNvbmZpcm1fZGxnIDtcbnZhciBvYmogPSB7XG5cbiAgICBhbGVydCA6IGZ1bmN0aW9uKG1zZyl7XG4gICAgICAgIGlmICghYWxlcnRfZGxnKSB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibS1wb3AgbS1wb3AtYWxlcnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtYmQgXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiYWxlcnQtY3QganNfY29udGVudFwiPicrbXNnKyc8L3A+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWZ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4td3JhcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1jZnIganNfY2xvc2VcIj7noa7lrpo8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj4nO1xuICAgICAgICAgICAgYWxlcnRfZGxnID0gcG9wKGh0bWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnRfZGxnLmdldENvbnRlbnQoKS50ZXh0KG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgYWxlcnRfZGxnLnNob3coKTtcbiAgICAgICAgcmV0dXJuIGFsZXJ0X2RsZztcbiAgICB9LFxuICAgIGNvbmZpcm0gOiBmdW5jdGlvbihtc2csc3VjLGVycil7XG4gICAgICAgICAgc3VjID0gc3VjIHx8IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgICBlcnIgPSBlcnIgfHwgZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgICAgaWYgKCFjb25maXJtX2RsZykge1xuICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIm0tcG9wIG0tcG9wLWFsZXJ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWJkIFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImFsZXJ0LWN0IGpzX2NvbnRlbnRcIj4nK21zZysnPC9wPlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1mdFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tY2ZyXCI+56Gu5a6aPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWNhbmNlbFwiPuWPlua2iDwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICBjb25maXJtX2RsZyA9IHBvcChodG1sKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpcm1fZGxnLmdldENvbnRlbnQoKS50ZXh0KG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyICRkMSA9IGNvbmZpcm1fZGxnLmdldERsZ0RvbSgpLmZpbmQoXCIuYnRuLWNmclwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uZmlybV9kbGcuaGlkZSgpO1xuICAgICAgICAgICAgc3VjICYmIHN1YygpOyBcbiAgICAgICAgICAgICRkMS51bmJpbmQoKTsgXG4gICAgICAgICAgICAkZDIudW5iaW5kKCk7IFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyICRkMiA9IGNvbmZpcm1fZGxnLmdldERsZ0RvbSgpLmZpbmQoXCIuYnRuLWNhbmNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uZmlybV9kbGcuaGlkZSgpO1xuICAgICAgICAgICAgJGQxLnVuYmluZCgpOyBcbiAgICAgICAgICAgICRkMi51bmJpbmQoKTsgXG4gICAgICAgICAgICBlcnIgJiYgZXJyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25maXJtX2RsZy5zaG93KCk7IFxuICAgIH0sXG4gICAgaGRfZGxnIDogZnVuY3Rpb24oJGRvbSx0aXRsZSxjYixjbG9zZV9mbil7XG4gICAgICAgIHZhciAkd3JhcCA9ICAkKCc8ZGl2IGNsYXNzPVwibS1wb3BcIj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtaGRcIj48YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJoZC1jbG9zZSBqc19jbG9zZVwiPiZ0aW1lczs8L2E+PGg0PicrdGl0bGUrJzwvaDQ+PC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWJkIFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwianNfY29udGVudFwiPjwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1mdFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tY2ZyXCI+56Gu5a6aPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+Jyk7ICAgXG4gICAgICAgIHZhciBkbGcgPSBuZXcgRGlhbG9nKHtcbiAgICAgICAgICAgIGNvbnRlbnQgOiAkd3JhcCxcbiAgICAgICAgICAgIGNsb3NlX2ZuIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBkbGcucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgY2xvc2VfZm4gJiYgY2xvc2VfZm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICR3cmFwLmZpbmQoXCIuYnRuLWNmclwiKS5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNiICYmIGNiKGRsZy5nZXRDb250ZW50KCksZGxnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRsZy5nZXRDb250ZW50KCkuaHRtbCgkZG9tKTtcbiAgICAgICAgZGxnLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIGRsZztcbiAgICB9LFxuICAgIGRsZyA6IGZ1bmN0aW9uKGNvbnRlbnQsbWFza1Zpc2libGUpe1xuICAgICAgICB2YXIgZGxnID0gbmV3IERpYWxvZyh7XG4gICAgICAgICAgICBjb250ZW50IDogY29udGVudCxcbiAgICAgICAgICAgIG1hc2tWaXNpYmxlIDogISFtYXNrVmlzaWJsZVxuICAgICAgICB9KTtcbiAgICAgICAgZGxnLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIGRsZztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqO1xuXG5cbiIsInZhciBnbCA9IHJlcXVpcmUoXCIuL3Nob3Bfc3lzL2dyb3VwX2xpc3QuanNcIik7XG4kKGZ1bmN0aW9uKCl7XG4gICAgJChcIiNvcC1sYWJlbFwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICBnbC5pbml0KCk7XG59KTtcbiIsInJlcXVpcmUoXCIuLi8uLi9saWIvanVpY2VyLmpzXCIpO1xudmFyIF8gPSByZXF1aXJlKFwiLi4vLi4vbGliL2xvZGFzaC5jb21wYXQubWluLmpzXCIpOyBcbnZhciAkID0gcmVxdWlyZShcIi4uLy4uL2xpYi9qcXVlcnkuanNcIik7XG52YXIgaHR0cCA9IHJlcXVpcmUoXCIuLi8uLi9tb2QvaHR0cC5qc1wiKTtcbnZhciBwb3AgPSByZXF1aXJlKFwiLi4vLi4vbW9kL3BvcC5qc1wiKTtcblxuXG52YXIgR0wgPSB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICB0aGlzLiRhZGRfZ3JvdXBfdHh0ID0gJChcIiNhZGRfZ3JvdXBfdHh0XCIpOyBcbiAgICAgICB0aGlzLiRhZGRfbGFiZWxfdHh0ID0gJChcIiNhZGRfbGFiZWxfdHh0XCIpOyBcbiAgICAgICB0aGlzLiRhZGRfZ3JvdXAgPSAkKFwiI2FkZF9ncm91cFwiKTsgXG4gICAgICAgdGhpcy4kYWRkX2xhYmVsID0gJChcIiNhZGRfbGFiZWxcIik7IFxuICAgICAgIHRoaXMuJGdyb3VwcyA9ICQoXCIjZ3JvdXBzXCIpOyBcbiAgICAgICB0aGlzLiRsYWJlbHMgPSAkKFwiI2xhYmVsc1wiKTtcblxuICAgICAgIHRoaXMuJGFkZF9ncm91cC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICB2YXIgZ190eHQgPSAkLnRyaW0obWUuJGFkZF9ncm91cF90eHQudmFsKCkpO1xuICAgICAgICAgICBpZiAoZ190eHQpIHtcbiAgICAgICAgICAgICAgbWUuYWRkX2dyb3VwKGdfdHh0KTtcbiAgICAgICAgICAgfVxuICAgICAgIH0pO1xuICAgICAgIHRoaXMuJGFkZF9sYWJlbC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICB2YXIgZ190eHQgPSAkLnRyaW0obWUuJGFkZF9sYWJlbF90eHQudmFsKCkpO1xuICAgICAgICAgICBpZiAoZ190eHQpIHtcbiAgICAgICAgICAgICAgbWUuYWRkX2xhYmVsKGdfdHh0KTtcbiAgICAgICAgICAgfVxuICAgICAgIH0pO1xuICAgICAgIHRoaXMubG9hZF9ncm91cCgpO1xuICAgICAgIHRoaXMuJGdyb3Vwcy5kZWxlZ2F0ZShcImxpXCIsXCJjbGlja1wiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgIHZhciB0eXBlX2lkID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xuICAgICAgICAgICBtZS5sb2FkX2xhYmVsKHR5cGVfaWQpO1xuICAgICAgICAgICBtZS4kZ3JvdXBzLmZpbmQoXCJsaVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICB9KTtcbiAgICAgICB0aGlzLiRsYWJlbHMuZGVsZWdhdGUoXCIuZGVsXCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHZhciAkbGkgPSAkKHRoaXMpLmNsb3Nlc3QoXCJsaVwiKTtcbiAgICAgICAgICAgdmFyIHR4dCA9ICQodGhpcykuY2xvc2VzdChcImxpXCIpLmZpbmQoXCJzcGFuXCIpLnRleHQoKTtcbiAgICAgICAgICAgdmFyIGlkID0gICQodGhpcykuY2xvc2VzdChcImxpXCIpLmRhdGEoXCJpZFwiKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgIHBvcC5jb25maXJtKFwi56Gu6K6k5Yig6ZmkXCIrdHh0K1wi5ZCX77yfXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgbWUuZGVsX2xhYmVsKGlkLCRsaSk7IFxuICAgICAgICAgICB9KTtcbiAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kZ3JvdXBzLmRlbGVnYXRlKFwiLmRlbFwiLFwiY2xpY2tcIixmdW5jdGlvbihlKXtcbiAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICB2YXIgJGxpID0gJCh0aGlzKS5jbG9zZXN0KFwibGlcIik7XG4gICAgICAgICAgIHZhciB0eHQgPSAkKHRoaXMpLmNsb3Nlc3QoXCJsaVwiKS50ZXh0KCk7XG4gICAgICAgICAgIHZhciBpZCA9ICAkKHRoaXMpLmNsb3Nlc3QoXCJsaVwiKS5kYXRhKFwiaWRcIik7XG4gICAgICAgICAgIFxuICAgICAgICAgICBwb3AuY29uZmlybShcIuehruiupOWIoOmZpFwiK3R4dCtcIuWQl++8n1wiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIG1lLmRlbF9sYWJlbChpZCwkbGkpOyBcbiAgICAgICAgICAgfSk7XG4gICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWxfZ3JvdXAgOiBmdW5jdGlvbihpZCxkb20pe1xuICAgICAgICBodHRwLnBvc3Qoe1xuICAgICAgICAgICAgdXJsIDogXCIvYXBpL2RlbGV0ZVByb2R1Y3RUeXBlLmh0bVwiLFxuICAgICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgICAgICBpZCA6IGlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGRvbS5yZW1vdmUoKTtcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICBwb3AuYWxlcnQoXCLmnI3liqHlmajplJnor6/vvIzor7fliLfmlrDph43or5VcIilcbiAgICAgICAgfSlcblxuICAgIH0sXG4gICAgZGVsX2xhYmVsIDogZnVuY3Rpb24oaWQsZG9tKXtcbiAgICAgICAgaHR0cC5wb3N0KHtcbiAgICAgICAgICAgIHVybCA6IFwiL2FwaS9kZWxldGVQcm9kdWN0TGFiZWwuaHRtXCIsXG4gICAgICAgICAgICBkYXRhIDoge1xuICAgICAgICAgICAgICAgIGlkIDogaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgZG9tLnJlbW92ZSgpO1xuICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgIHBvcC5hbGVydChcIuacjeWKoeWZqOmUmeivr++8jOivt+WIt+aWsOmHjeivlVwiKVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgYWRkX2dyb3VwIDogZnVuY3Rpb24odHh0KXtcbiAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgIGh0dHAucG9zdCh7XG4gICAgICAgIHVybCA6IFwiL2FwaS9hZGRQcm9kdWN0VHlwZS5odG1cIixcbiAgICAgICAgZGF0YSA6e1xuICAgICAgICAgICAgbmFtZSA6IHR4dFxuICAgICAgICB9IFxuICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgIHZhciBwcm9kdWN0VHlwZSA9IHJzLnByb2R1Y3RUeXBlO1xuICAgICAgICAgIGlmIChwcm9kdWN0VHlwZSAmJiBwcm9kdWN0VHlwZS5pZCkge1xuICAgICAgICAgICAgICAgIG1lLiRncm91cHMuZmluZChcImxpXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIG1lLiRncm91cHMuYXBwZW5kKCc8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gYWN0aXZlXCIgZGF0YS1pZD1cIicrcHJvZHVjdFR5cGUuaWQrJ1wiPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoIHB1bGwtcmlnaHQgZGVsXCI+PC9hPicrcHJvZHVjdFR5cGUubmFtZSsnPC9saT4nKTsgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbWUubG9hZF9sYWJlbChwcm9kdWN0VHlwZS5pZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3AuYWxlcnQoXCLmt7vliqDlpLHotKXvvIzor7fliLfmlrDph43or5VcIilcbiAgICAgICAgICB9XG4gICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICBwb3AuYWxlcnQoXCLmnI3liqHlmajplJnor6/vvIzor7fliLfmlrDph43or5VcIilcbiAgICAgICB9KVxuICAgIH0sXG4gICAgYWRkX2xhYmVsIDogZnVuY3Rpb24obmFtZSl7XG4gICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICBodHRwLnBvc3Qoe1xuICAgICAgICB1cmwgOiBcIi9hcGkvYWRkUHJvZHVjdExhYmVsLmh0bVwiLFxuICAgICAgICBkYXRhIDp7XG4gICAgICAgICAgICBuYW1lIDogbmFtZSxcbiAgICAgICAgICAgIHR5cGVJZCA6IG1lLl9jdXJfdHlwZWlkXG4gICAgICAgIH0gXG4gICAgICAgfSkuZG9uZShmdW5jdGlvbihycyl7XG4gICAgICAgICAgbWUuJGxhYmVscy5hcHBlbmQoJzxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoIHB1bGwtcmlnaHQgZGVsXCI+PC9hPjxzcGFuPicrbmFtZSsnPC9zcGFuPjwvbGk+Jyk7ICAgICAgICAgIFxuICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgcG9wLmFsZXJ0KFwi5pyN5Yqh5Zmo6ZSZ6K+v77yM6K+35Yi35paw6YeN6K+VXCIpXG4gICAgICAgfSlcbiBcbiAgICB9LFxuICAgIGxvYWRfZ3JvdXAgOiBmdW5jdGlvbigpe1xuICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgaHR0cC5nZXQoe1xuICAgICAgICAgIHVybCA6IFwiL2FwaS9nZXRQcm9kdWN0VHlwZS5odG1cIlxuICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICB2YXIgZGF0YSA9IHJzLmRhdGEgfHwgW107XG4gICAgICAgICAgIHZhciBodG1sID0gXy5tYXAoZGF0YSxmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgIHJldHVybiAnPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCIgZGF0YS1pZD1cIicrZC5pZCsnXCI+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2ggcHVsbC1yaWdodCBkZWxcIj48L2E+JytkLm5hbWUrJzwvbGk+JztcbiAgICAgICAgICAgfSkuam9pbihcIlwiKTtcbiAgICAgICAgICAgaWYgKGRhdGFbMF0pIHtcbiAgICAgICAgICAgICAgIG1lLmxvYWRfbGFiZWwoZGF0YVswXS5pZCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgbWUuJGdyb3Vwcy5odG1sKGh0bWwpO1xuICAgICAgICAgICBtZS4kZ3JvdXBzLmZpbmQoXCJsaVwiKS5lcSgwKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICB9KVxuICAgIH0sXG4gICAgcmVuZGVyX2dyIDogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIFxuICAgIH0sXG4gICAgbG9hZF9sYWJlbCA6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgIG1lLl9jdXJfdHlwZWlkID0gaWQ7XG4gICAgICAgaHR0cC5nZXQoe1xuICAgICAgICAgIHVybCA6IFwiL2FwaS9nZXRQcm9kdWN0TGFiZWwuaHRtXCIsXG4gICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgIHR5cGVJZCA6IGlkXG4gICAgICAgICAgfVxuICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICB2YXIgZGF0YSA9IHJzLmRhdGEgfHwgW107XG4gICAgICAgICAgIHZhciBodG1sID0gXy5tYXAoZGF0YSxmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgIHJldHVybiAnPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCIgZGF0YS1pZD1cIicrZC5pZCsnXCI+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2ggcHVsbC1yaWdodCBkZWxcIj48L2E+PHNwYW4+JytkLm5hbWUrJzwvc3Bhbj48L2xpPic7XG4gICAgICAgICAgIH0pLmpvaW4oXCJcIik7XG4gICAgICAgICAgIG1lLiRsYWJlbHMuaHRtbChodG1sKTtcbiAgICAgICB9KSBcbiAgICB9LFxuICAgIHJlbmRlcl9sYSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR0w7XG4iXX0=
