(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/scripts/page/index.js":[function(require,module,exports){
var Login = require("../mod/login.js");
var pop = require("../mod/pop.js");
(function($){
    var box = $("#login");
    var login = new Login(box);
    login.init();
    var  decode = window.decodeURIComponent;
    var search = window.location.search;
    var ss, params = {};
    search = search.replace(/^\?/,"");
    ss =  search.split("&");
    for (var i = 0, l = ss.length; i < l; i++) {
        var t = ss[i].split("=")
        params[t[0]] = decode(t[1]);
    }
    if (params.msg == "error_login_1") {
        pop.alert("对不起，账号密码错误，请重新输入");
        return;
    }
    
})(jQuery);

},{"../mod/login.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/mod/login.js","../mod/pop.js":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/mod/pop.js"}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/ibrowser.js":[function(require,module,exports){
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

},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/idialog.js":[function(require,module,exports){
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

},{"./ibrowser":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/ibrowser.js"}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/mod/login.js":[function(require,module,exports){

var Login = function(dom){
    var $form = this.$form = dom.find("form");
    this.$uname = $form.find("input[name=j_username]");
    this.$pwd = $form.find("input[name=j_password]");
    this.$record = $form.find("input[name=record]");
    this.$submit = $form.find("button[type=submit]");
    var $chbox = $form.find(".chbox");
    if ($chbox.length) {
        this._chbox = new Chbox($chbox);
    }
}

Login.prototype = {
    constructor : Login,
    init : function(){
        var me = this;
        this.$form.submit(function(e){
             
        });
    }

}


var Chbox = function(dom){
    var checkbox = dom.find("input[type=checkbox]");
    dom.click(function(e){

        if (checkbox.attr("checked")) {
            checkbox.removeAttr("checked");  
            dom.removeClass("checked");
        } else {
            checkbox.attr("checked",true);
            dom.addClass("checked");
        }
    });
}

module.exports = Login; 

},{}],"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/mod/pop.js":[function(require,module,exports){
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



},{"../lib/idialog":"/Users/wk/myspace/git/kvv/amily_ms_web/src/scripts/lib/idialog.js"}]},{},["./src/scripts/page/index.js"]);

//# sourceMappingURL=index.js.map