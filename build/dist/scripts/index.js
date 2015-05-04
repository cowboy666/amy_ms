(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"./ibrowser":1}],3:[function(require,module,exports){

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

},{}],4:[function(require,module,exports){
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



},{"../lib/idialog":2}],5:[function(require,module,exports){
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

},{"../mod/login.js":3,"../mod/pop.js":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9pYnJvd3Nlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9pZGlhbG9nLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbW9kL2xvZ2luLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbW9kL3BvcC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2UvZmFrZV81NzQwN2Q5ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL+a1j+iniOWZqOWIpOaWrVxudmFyIHVhICA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCksXG4gICAgY2hlY2sgPSBmdW5jdGlvbihyKXtcbiAgICAgICAgcmV0dXJuIHIudGVzdCh1YSk7XG4gICAgfTtcbnZhciBpc09wZXJhICA9ICBjaGVjaygvb3BlcmEvKSxcbiAgICBpc0Nocm9tZSA9IGNoZWNrKC9cXGJjaHJvbWVcXGIvKSxcbiAgICBpc1dlYktpdCA9IGNoZWNrKC93ZWJraXQvKSxcbiAgICBpc1NhZmFyaSA9ICFpc0Nocm9tZSAmJiBpc1dlYktpdCxcbiAgICBpc0lFICAgICA9IGNoZWNrKC9tc2llLykgJiYgZG9jdW1lbnQuYWxsICYmICFpc09wZXJhLFxuICAgIGlzSUU3ICAgID0gY2hlY2soL21zaWUgNy8pLFxuICAgIGlzSUU4ICAgID0gY2hlY2soL21zaWUgOC8pLFxuICAgIGlzSUU5ICAgID0gY2hlY2soL21zaWUgOS8pLFxuICAgIGlzSUUxMCAgICA9IGNoZWNrKC9tc2llIDEwLyksXG4gICAgaXNJRTYgICAgPSBpc0lFICYmICFpc0lFNyAmJiAhaXNJRTggJiYgIWlzSUU5ICYmICFpc0lFMTAsXG4gICAgaXNJRTExICAgPSBjaGVjaygvdHJpZGVudC8pICYmIHVhLm1hdGNoKC9ydjooW1xcZC5dKykvKT90cnVlOmZhbHNlLFxuICAgIGlzR2Vja28gID0gY2hlY2soL2dlY2tvLykgJiYgIWlzV2ViS2l0LFxuICAgIGlzTWFjICAgID0gY2hlY2soL21hYy8pO1xuXG52YXIgQnJvd3NlciA9IHtcbiAgICBpc09wZXJhIDogaXNPcGVyYSxcbiAgICBpc0Nocm9tZSA6IGlzQ2hyb21lLFxuICAgIGlzV2ViS2l0IDogaXNXZWJLaXQsXG4gICAgaXNTYWZhcmkgOiBpc1NhZmFyaSxcbiAgICBpc0lFICAgICA6IGlzSUUsXG4gICAgaXNJRTcgICAgOiBpc0lFNyxcbiAgICBpc0lFOCAgICA6IGlzSUU4LFxuICAgIGlzSUU5ICAgIDogaXNJRTksXG4gICAgaXNJRTYgICAgOiBpc0lFNixcbiAgICBpc0lFMTEgICAgOmlzSUUxMSxcbiAgICBpc0dlY2tvICA6IGlzR2Vja28sXG4gICAgaXNNYWMgICAgOiBpc01hY1xufTtcbm1vZHVsZS5leHBvcnRzID0gQnJvd3NlcjtcbiIsInZhciBCcm93c2VyID0gcmVxdWlyZShcIi4vaWJyb3dzZXJcIik7XHJcbnZhciBEaWFsb2cgID0gKGZ1bmN0aW9uKCQsd2luZG93KXtcclxuXHRcdHZhciBfaXNJRSAgPSBCcm93c2VyLmlzSUUsXHJcblx0XHQgICAgX2lzSUU2ID0gQnJvd3Nlci5pc0lFNixcclxuXHRcdFx0JGRvYyAgID0gJCh3aW5kb3cuZG9jdW1lbnQpLFxyXG5cdFx0XHQkYm9keSAgPSAkKCdib2R5JyksXHJcblx0XHRcdCR3aW4gICA9ICQod2luZG93KTsgXHJcbiAgICAgICAgdmFyIElFNl9MRUZUX09GRlNFVCA9IDE2OyAvL0lFNuS4i+a7keWKqOadoeeahOWuveW6plxyXG5cdFx0dmFyIF9pc01hYyA9IEJyb3dzZXIuaXNNYWM7XHJcblx0XHR2YXIgaGFzU2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgLy/pmLLmraLlvJXnlKhKU+aWh+S7tuWcqGhlYWQg6YeM5Y+W5LiN5YiwYm9keVxyXG4gICAgICAgIGlmICghJGJvZHlbMF0pIHtcclxuICAgICAgICAgICAgJChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJGJvZHkgPSAgJCgnYm9keScpOyBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v6IOM5pmvIOWJjeaZryBcclxuXHRcdHZhciBkbGdfbWFza19odG1sID0gJzxkaXYgY2xhc3M9XCJnLXBvcC1iZ1wiPjwvZGl2PicsXHJcblx0XHRcdGRsZ19ib3hfaHRtbCA9ICc8ZGl2IGNsYXNzPVwiZ19kbGdfYm94IGctcG9wXCI+PC9kaXY+JztcclxuXHJcblx0XHR2YXIgZGxnaWQgPSBcImRsZ1wiLFxyXG4gICAgICAgICAgICBtaWRzPTAgLCBcclxuICAgICAgICAgICAgaWRzID0gMCxcclxuXHRcdFx0X2RfemluZGV4ID0gMTAwMDAwO1xyXG5cclxuXHRcdHZhciBkZWZfY29uZmlnID0ge1xyXG5cdFx0XHRjb250ZW50OicnLFxyXG5cdFx0XHRtYXNrVmlzaWJsZSA6IHRydWUsXHJcblx0XHRcdHRvcDowLFxyXG5cdFx0XHRsZWZ0OjAsXHJcblx0XHRcdHdpZHRoOjAsXHJcblx0XHRcdGhlaWdodDowLFxyXG5cdFx0XHRuZXdNYXNrIDogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRTdHlsZSA6IFwiXCIsXHJcblx0XHRcdGJvcmRlclN0eWxlIDpcIlwiLCAgLy8gYm9yZGVy5qC35byPIFxyXG5cdFx0XHR0aXRsZVN0eWxlIDogXCJcIiwgLy/moIfpopjmoLflvI9cclxuXHRcdFx0Y2xvc2VDbHMgIDogXCJcIiwgLy/lhbPpl63mjInpkq4gY2xhc3Mg5aaC5p6c5pyJ5Lya5pu/5o2i5o6JIOWOn+adpeeahCBkbGdfY2xvc2UgXHJcbiAgICAgICAgICAgIGNsb3NlX2ZuIDogZnVuY3Rpb24oKXt9LFxyXG5cdFx0XHRoaWRlQ2xvc2VCdG46IGZhbHNlXHJcblx0XHR9O1xyXG5cdFx0Ly8gbWl4IGNvbmZpZyBzZXR0aW5nLlxyXG5cdFx0dmFyIG1peF9jZmcgPSBmdW5jdGlvbihuLCBkKSB7XHJcblx0XHRcdHZhciBjZmcgPSB7fSxcclxuXHRcdFx0XHRpO1xyXG5cdFx0XHRmb3IgKGkgaW4gZCkge1xyXG5cdFx0XHRcdGlmIChkLmhhc093blByb3BlcnR5KGkpKSB7XHJcblx0XHRcdFx0XHRjZmdbaV0gPSB0eXBlb2YgbltpXSAhPT0gJ3VuZGVmaW5lZCcgPyBuW2ldIDogZFtpXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNmZztcclxuXHRcdH1cclxuXHRcdHZhciBnZXRXaW5SZWN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgd2luID0gJHdpbjtcclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG9wIDogICRkb2Muc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0XHRzY3JvbGxMZWZ0IDogJGRvYy5zY3JvbGxMZWZ0KCksXHJcblx0XHRcdFx0XHR3aWR0aCA6IHdpbi53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA6IHdpbi5oZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vd2lkdGg6IHdpblswXS5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxyXG5cdFx0XHRcdFx0Ly9oZWlnaHQ6IHdpblswXS5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0XHJcblx0XHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIF9tYXNrX2lkID0gXCJkbGdfbWFza19cIjtcclxuXHRcdHZhciBNYXNrID0gZnVuY3Rpb24oKXtcclxuXHRcdCAgICB0aGlzLmlkID0gX21hc2tfaWQrKCsrbWlkcyk7XHJcblx0XHRcdHRoaXMuX2RvbSA9ICQoJzxkaXYgaWQ9XCInKyh0aGlzLmlkKSsnXCIgY2xhc3M9XCJnLXBvcC1iZ1wiIHN0eWxlPVwiei1pbmRleDonKygrK19kX3ppbmRleCkrJ1wiPjwvZGl2PicpO1xyXG5cdFx0XHR0aGlzLl9pbml0KCk7XHJcblx0XHR9O1xyXG5cdCBcdE1hc2sucHJvdG90eXBlID0ge1xyXG5cdFx0XHRfaW5pdCA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JGJvZHkuYXBwZW5kKHRoaXMuX2RvbSk7XHJcblx0XHRcdFx0dGhpcy5fZG9tLmhpZGUoKTtcclxuXHRcdFx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0XHRcdFx0dGhpcy5hZGFwdFdpbigpO1xyXG5cdFx0XHRcdGlmKHRoaXMuX25lZWRJZnJhbWUoKSl7XHJcblx0XHRcdFx0XHR0aGlzLl9jcmVhdGVJZnJhbWUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfaW5pdEV2ZW50cyA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0X2NyZWF0ZUlmcmFtZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGlzLl9pZnJhbWUgPSAkKCc8aWZyYW1lIGNsYXNzPVwiZGxnX21pZnJhbWVcIiBmcmFtZWJvcmRlcj1cIjBcIiBzcmM9XCJhYm91dDpibGFua1wiPjwvaWZyYW1lPicpO1xyXG5cdFx0XHRcdHRoaXMuX2RvbS5hcHBlbmQodGhpcy5faWZyYW1lKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YWRkQ2xhc3MgOiBmdW5jdGlvbiggY2xzTmFtZSl7XHJcblx0XHRcdFx0dGhpcy5fZG9tLmFkZENsYXNzKGNsc05hbWUpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICog5qOA5rWL6Ieq5Yqo55Sf5oiQaWZyYW1l5p2h5Lu2XHJcblx0XHRcdCAqXHJcblx0XHRcdCAqIEBtZXRob2RcclxuXHRcdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0XHQgKiBAcGFyYW0gdm9pZFxyXG5cdFx0XHQgKiBAcmV0dXJuIHtib29sfVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0X25lZWRJZnJhbWU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgdXNlSWZyYW1lID0gISF3aW5kb3cuQWN0aXZlWE9iamVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0JiYgKChfaXNJRTYgJiYgJCgnc2VsZWN0JykubGVuZ3RoKVxyXG5cdFx0XHRcdFx0XHRcdFx0fHwgJCgnb2JqZWN0JykubGVuZ3RoKTtcclxuXHRcdFx0XHRyZXR1cm4gdXNlSWZyYW1lO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhZGFwdFdpbiA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYoX2lzSUU2KXtcclxuXHRcdFx0XHRcdHRoaXMuX2RvbS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgOiAkZG9jLnNjcm9sbFRvcCgpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA6ICRkb2Muc2Nyb2xsTGVmdCgpLFxyXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICR3aW4uaGVpZ2h0KCksXHJcblx0XHRcdFx0XHRcdHdpZHRoOiAkd2luLndpZHRoKClcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0aGlkZSA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5fZG9tLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBodG1sX2RvbSA9ICQoJ2h0bWwnKS5jc3MoXCJvdmVyZmxvd1wiLFwiXCIpO1xyXG5cdFx0XHRcdGlmKF9pc01hYyA9PSBmYWxzZSB8fCAxKXtcclxuXHRcdFx0XHRcdGlmKGhhc1Njcm9sbCl7XHJcblx0ICAgICAgICAgICAgICAgICAgICBodG1sX2RvbS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIsXCIwcHhcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaG93IDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHdhID0gJHdpbi53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWxfZG9tID0gJCgnaHRtbCcpLmNzcyhcIm92ZXJmbG93XCIsXCJoaWRkZW5cIik7XHJcblx0XHRcdFx0dmFyIHdiID0gJHdpbi53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgbWUuX2RvbS5zaG93KCk7XHJcblx0XHRcdFx0aWYoX2lzTWFjID09IGZhbHNlIHx8IDEpe1xyXG5cdFx0XHRcdFx0aWYod2EgIT0gd2Ipe1xyXG5cdFx0XHRcdFx0XHRoYXNTY3JvbGwgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRodG1sX2RvbS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIsSUU2X0xFRlRfT0ZGU0VUK1wicHhcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXREb20gOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9kb207XHJcblx0XHRcdH0sXHJcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR0aGlzLl9kb20ucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbW9zdF9tYXNrOyAvL+WFrOWFseeahE1hc2tcclxuXHRcdHZhciBEaWFsb2cgPSAgZnVuY3Rpb24oY2ZnKXtcclxuXHRcdFx0dmFyIGMgPSBjZmcgfHwge307XHJcblx0XHRcdHRoaXMuY29uZmlnID0gIG1peF9jZmcoYyxkZWZfY29uZmlnKTtcclxuXHRcdFx0dGhpcy5faW5pdCgpO1xyXG5cdFx0fVxyXG5cdFx0RGlhbG9nLnByb3RvdHlwZSA9IHtcclxuXHRcdFx0Y29uc3RydWN0b3IgOiBEaWFsb2csXHJcblx0XHRcdF9pbml0IDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighdGhpcy5jb25maWcpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dGhpcy5pZCA9IGRsZ2lkICsoKytpZHMpO1xyXG5cdFx0XHRcdHZhciBjZmcgPSAgdGhpcy5jb25maWc7XHJcblxyXG5cdFx0XHRcdGlmKGNmZy5uZXdNYXNrKXtcclxuXHRcdFx0XHRcdHRoaXMuX21hc2sgPSAgbmV3IE1hc2soKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKCFtb3N0X21hc2spe1xyXG5cdFx0XHRcdFx0XHRtb3N0X21hc2sgPSAgbmV3IE1hc2soKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWFzayA9IG1vc3RfbWFzaztcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9tYXNrID0gIG1vc3RfbWFzaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5fY3JlYXREaWFsb2coKTtcclxuXHRcdFx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0XHRcdFx0dGhpcy5pbml0ZWQgPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRfaW5pdEV2ZW50cyA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG1lID0gdGhpcyxpZD10aGlzLmlkO1xyXG5cclxuXHRcdFx0XHR0aGlzLl9jbG9zZUJ0bi5iaW5kKHtcclxuXHRcdFx0XHRcdGNsaWNrIDogZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUuY2xvc2UoKTtcclxuXHRcdFx0XHRcdFx0bWUuY29uZmlnLmNsb3NlX2ZuLmNhbGwobWUsbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdCR3aW4uYmluZChcInJlc2l6ZS5cIitpZCxyZXNpemUpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdG1lLl91bmJpbmRFdmVudHMgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0JHdpbi51bmJpbmQoXCJyZXNpemUuXCIraWQpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gcmVzaXplKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9pc0lFNikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5fZGxnX2NvbnRhaW5lci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wIDogJGRvYy5zY3JvbGxUb3AoKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IDogJGRvYy5zY3JvbGxMZWZ0KCksXHJcblx0XHRcdFx0XHRcdCAgICB3aWR0aCA6ICR3aW4ud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0ICAgIGhlaWdodCA6ICR3aW4uaGVpZ2h0KClcclxuXHRcdFx0XHRcdCAgICB9KTtcclxuICBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5fZGxnX2NvbnRhaW5lci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggOiAkd2luLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgOiAkd2luLmhlaWdodCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0XHRcdG1lLnRvQ2VudGVyKCk7XHJcblx0XHRcdFx0XHRtZS5fbWFzay5hZGFwdFdpbigpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0sXHJcblx0XHRcdF9jcmVhdERpYWxvZyA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGNmZyA9IHRoaXMuY29uZmlnO1xyXG5cdFx0XHRcdHZhciBkbGdfY29udGFpbmVyID0gdGhpcy5fZGxnX2NvbnRhaW5lciA9ICQoZGxnX2JveF9odG1sKS5hdHRyKFwiaWRcIix0aGlzLmlkKS5jc3MoXCJ6LWluZGV4XCIsKF9kX3ppbmRleCArPSAxMCkpO1xyXG5cdFx0XHRcdGlmKGNmZy5jb250ZW50IGluc3RhbmNlb2YgJCl7XHJcblx0XHRcdFx0XHR0aGlzLl9kaWFsb2cgPSBjZmcuY29udGVudDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoaXMuX2RpYWxvZyA9ICQoY2ZnLmNvbnRlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgZGxnID0gdGhpcy5fZGlhbG9nO1xyXG5cdFx0XHRcdGRsZy5hZGRDbGFzcyhcImdfZGxnX3dyYXBfY3NzM1wiKTtcdFxyXG5cdFx0XHRcdGRsZ19jb250YWluZXIuaHRtbChkbGcpO1xyXG5cdFx0XHRcdHRoaXMuX2NvbnRlbnQgPSAkKFwiLmpzX2NvbnRlbnRcIixkbGcpO1xyXG5cdFx0XHRcdHRoaXMuX2Nsb3NlQnRuID0gJCgnLmpzX2Nsb3NlJyxkbGcpO1xyXG5cdFx0XHRcdCRib2R5LmFwcGVuZChkbGdfY29udGFpbmVyKTtcclxuXHJcblx0XHRcdFx0aWYoY2ZnLmhpZGVDbG9zZUJ0bil7XHJcblx0XHRcdFx0XHR0aGlzLl9jbG9zZUJ0bi5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBwb3MgPSAgXCJmaXhlZFwiO1xyXG5cdFx0XHRcdGlmKF9pc0lFNil7XHJcblx0XHRcdFx0XHRkbGdfY29udGFpbmVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA6ICRkb2Muc2Nyb2xsVG9wKCksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IDogJGRvYy5zY3JvbGxMZWZ0KCksXHJcblx0XHRcdFx0XHRcdHdpZHRoIDogJHdpbi53aWR0aCgpLFxyXG5cdFx0XHRcdFx0XHRoZWlnaHQgOiAkd2luLmhlaWdodCgpXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHBvcyA9IFwiYWJzb3VsdGVcIjtcclxuXHRcdFx0ICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGxnX2NvbnRhaW5lci5jc3Moe1xyXG5cdFx0XHRcdFx0XHR3aWR0aCA6ICR3aW4ud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0aGVpZ2h0IDogJHdpbi5oZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGxnLmNzcyhcInBvc2l0aW9uXCIsXCJhYnNvbHV0ZVwiKTtcclxuXHRcdFx0XHR0aGlzLnNldFBvcyhwb3MpO1x0XHRcdFx0XHJcblx0XHRcdFx0Ly90aGlzLnRvQ2VudGVyKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldFBvcyA6IGZ1bmN0aW9uKHBvcyl7XHJcblx0XHRcdFx0dGhpcy5fZGxnX2NvbnRhaW5lci5jc3MoXCJwb3NpdGlvblwiLHBvcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdC8v5b6X5YiwY29udGVudCDov5Tlm55qUXVlcnkg5a+56LGhXHJcblx0XHRcdGdldENvbnRhaW5lciA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2RsZ19jb250YWluZXI7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldENvbnRlbnQgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9jb250ZW50O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXRDb250ZW50IDogZnVuY3Rpb24oZG9tKXtcclxuXHRcdFx0XHR0aGlzLl9jb250ZW50LmVtcHR5KCk7XHJcblx0XHRcdFx0dGhpcy5fY29udGVudC5odG1sKGRvbSk7XHRcclxuXHRcdFx0fSxcclxuICAgICAgICAgICAgZ2V0RGxnRG9tIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGlhbG9nOyBcclxuICAgICAgICAgICAgfSxcclxuXHRcdFx0Z2V0Q2xvc2VCdG4gOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9jbG9zZUJ0bjtcclxuXHRcdFx0fSxcclxuXHRcdFx0X3NldFN0eWxlIDogZnVuY3Rpb24oZG9tLGNzcyl7XHJcblx0XHRcdFx0aWYodHlwZW9mIGNzcyA9PSBcInN0cmluZ1wiKXtcclxuXHRcdFx0XHRcdGlmKF9pc0lFKXtcclxuXHRcdFx0XHRcdFx0ZG9tWzBdLnN0eWxlLmNzc1RleHQgPSBjc3M7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0ZG9tLmF0dHIoXCJzdHlsZVwiLGNzcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRkb20uY3NzKGNzcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0b0NlbnRlciA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHdpblJlY3QgPSAgZ2V0V2luUmVjdCgpLFxyXG5cdFx0XHRcdFx0dyA9IHRoaXMuX2RpYWxvZy53aWR0aCgpLFxyXG5cdFx0XHRcdFx0aCA9IHRoaXMuX2RpYWxvZy5oZWlnaHQoKSxcclxuXHRcdFx0XHRcdHQgPSAwLGwgPTA7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wID0gTWF0aC5tYXgoKHdpblJlY3QuaGVpZ2h0IC8gMiAtIGggLyAyKSA+PjAgKyB0LDApIDtcclxuICAgICAgICAgICAgICAgIHZhciBsZWZ0ICA9ICh3aW5SZWN0LndpZHRoIC8gMiAtIHcgLyAyKSA+PjAgKyBsO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9pc0lFNikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgLT0gSUU2X0xFRlRfT0ZGU0VULzI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0dmFyIHJlY3QgPSB7XHJcblx0XHRcdFx0XHRsZWZ0IDpcdGxlZnQsXHJcblx0XHRcdFx0ICAgXHR0b3AgOiAgdG9wXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuX2RpYWxvZy5jc3MocmVjdCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHQgICAgc2hvdyA6IGZ1bmN0aW9uKGNhbGxiYWNrLGNvbnRleHQpe1xyXG5cdFx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdFx0aWYobWUuY29uZmlnLm1hc2tWaXNpYmxlKXtcclxuXHRcdFx0XHRcdG1lLl9tYXNrLnNob3coKTtcclxuXHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAvL0lFOCDku6XkuIvorqHnrpfnqpflj6Plrr3luqZcclxuICAgICAgICAgICAgICAgIG1lLl9kbGdfY29udGFpbmVyLmNzcyh7d2lkdGg6XCIxMDAlXCIsaGVpZ2h0OlwiMTAwJVwifSk7XHJcblx0XHRcdFx0bWUuX2RsZ19jb250YWluZXIuc2hvdygpO1xyXG5cdFx0XHRcdG1lLnRvQ2VudGVyKCk7XHJcblx0XHRcdFx0aWYoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChjb250ZXh0IHx8IG1lLG1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bWUuc2hvd2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2xvc2UgOiBmdW5jdGlvbihjYWxsYmFjayxjb250ZXh0KXtcclxuXHRcdFx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cdFx0XHRcdHRoaXMuX21hc2suaGlkZSgpO1xyXG5cdFx0XHRcdHRoaXMuX2RsZ19jb250YWluZXIuaGlkZSgpO1xyXG5cdFx0XHRcdGlmKGNhbGxiYWNrKXtcclxuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBtZSxtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuc2hvd2VkID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlc3RvcnkgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHR0aGlzLl91bmJpbmRFdmVudHMoKTtcclxuXHRcdFx0XHR0aGlzLmNvbmZpZy5uZXdNYXNrICYmIHRoaXMuX21hc2sucmVtb3ZlKCk7XHJcblx0XHRcdFx0dGhpcy5fZGxnX2NvbnRhaW5lci5yZW1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLl9kaWFsb2cucmVtb3ZlKCk7XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoaXMpe1xyXG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXNbaV1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldE1hc2sgOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9tYXNrO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdH1cclxuXHRcdERpYWxvZy5wcm90b3R5cGUuSW4gPSBEaWFsb2cucHJvdG90eXBlLnNob3c7XHJcblx0XHREaWFsb2cucHJvdG90eXBlLm91dCA9IERpYWxvZy5wcm90b3R5cGUuY2xvc2U7XHJcblx0XHREaWFsb2cucHJvdG90eXBlLmhpZGUgPSBEaWFsb2cucHJvdG90eXBlLmNsb3NlO1xyXG5cdFx0RGlhbG9nLnByb3RvdHlwZS5yZW1vdmUgPSBEaWFsb2cucHJvdG90eXBlLmRlc3Rvcnk7XHJcblx0XHRcclxuXHQgICAgXHJcbiAgICByZXR1cm4gRGlhbG9nO1xyXG5cclxufSkoalF1ZXJ5LHdpbmRvdyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpYWxvZztcclxuIiwiXG52YXIgTG9naW4gPSBmdW5jdGlvbihkb20pe1xuICAgIHZhciAkZm9ybSA9IHRoaXMuJGZvcm0gPSBkb20uZmluZChcImZvcm1cIik7XG4gICAgdGhpcy4kdW5hbWUgPSAkZm9ybS5maW5kKFwiaW5wdXRbbmFtZT1qX3VzZXJuYW1lXVwiKTtcbiAgICB0aGlzLiRwd2QgPSAkZm9ybS5maW5kKFwiaW5wdXRbbmFtZT1qX3Bhc3N3b3JkXVwiKTtcbiAgICB0aGlzLiRyZWNvcmQgPSAkZm9ybS5maW5kKFwiaW5wdXRbbmFtZT1yZWNvcmRdXCIpO1xuICAgIHRoaXMuJHN1Ym1pdCA9ICRmb3JtLmZpbmQoXCJidXR0b25bdHlwZT1zdWJtaXRdXCIpO1xuICAgIHZhciAkY2hib3ggPSAkZm9ybS5maW5kKFwiLmNoYm94XCIpO1xuICAgIGlmICgkY2hib3gubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2NoYm94ID0gbmV3IENoYm94KCRjaGJveCk7XG4gICAgfVxufVxuXG5Mb2dpbi5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3IgOiBMb2dpbixcbiAgICBpbml0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdGhpcy4kZm9ybS5zdWJtaXQoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5cbnZhciBDaGJveCA9IGZ1bmN0aW9uKGRvbSl7XG4gICAgdmFyIGNoZWNrYm94ID0gZG9tLmZpbmQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiKTtcbiAgICBkb20uY2xpY2soZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgaWYgKGNoZWNrYm94LmF0dHIoXCJjaGVja2VkXCIpKSB7XG4gICAgICAgICAgICBjaGVja2JveC5yZW1vdmVBdHRyKFwiY2hlY2tlZFwiKTsgIFxuICAgICAgICAgICAgZG9tLnJlbW92ZUNsYXNzKFwiY2hlY2tlZFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrYm94LmF0dHIoXCJjaGVja2VkXCIsdHJ1ZSk7XG4gICAgICAgICAgICBkb20uYWRkQ2xhc3MoXCJjaGVja2VkXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9naW47IFxuIiwidmFyIERpYWxvZyA9IHJlcXVpcmUoXCIuLi9saWIvaWRpYWxvZ1wiKTtcblxuXG52YXIgcG9wID0gZnVuY3Rpb24oY29udGVudCl7XG4gICAgdmFyIGRsZyA9IG5ldyBEaWFsb2coe1xuICAgICAgICBjb250ZW50IDogY29udGVudFxuICAgIH0pO1xuICAgIGRsZy5oaWRlKCk7XG4gICAgcmV0dXJuIGRsZztcbn1cblxuXG52YXIgYWxlcnRfZGxnICwgY29uZmlybV9kbGcgO1xudmFyIG9iaiA9IHtcblxuICAgIGFsZXJ0IDogZnVuY3Rpb24obXNnKXtcbiAgICAgICAgaWYgKCFhbGVydF9kbGcpIHtcbiAgICAgICAgICAgIHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJtLXBvcCBtLXBvcC1hbGVydFwiPlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1iZCBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJhbGVydC1jdCBqc19jb250ZW50XCI+Jyttc2crJzwvcD5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtZnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi13cmFwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWNmciBqc19jbG9zZVwiPuehruWumjwvYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICBhbGVydF9kbGcgPSBwb3AoaHRtbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydF9kbGcuZ2V0Q29udGVudCgpLnRleHQobXNnKTtcbiAgICAgICAgfVxuICAgICAgICBhbGVydF9kbGcuc2hvdygpO1xuICAgICAgICByZXR1cm4gYWxlcnRfZGxnO1xuICAgIH0sXG4gICAgY29uZmlybSA6IGZ1bmN0aW9uKG1zZyxzdWMsZXJyKXtcbiAgICAgICAgICBzdWMgPSBzdWMgfHwgZnVuY3Rpb24oKXt9O1xuICAgICAgICAgIGVyciA9IGVyciB8fCBmdW5jdGlvbigpe307XG5cbiAgICAgICAgICBpZiAoIWNvbmZpcm1fZGxnKSB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibS1wb3AgbS1wb3AtYWxlcnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtYmQgXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiYWxlcnQtY3QganNfY29udGVudFwiPicrbXNnKyc8L3A+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWZ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4td3JhcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1jZnJcIj7noa7lrpo8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tY2FuY2VsXCI+5Y+W5raIPC9idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+JztcbiAgICAgICAgICAgIGNvbmZpcm1fZGxnID0gcG9wKGh0bWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlybV9kbGcuZ2V0Q29udGVudCgpLnRleHQobXNnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgJGQxID0gY29uZmlybV9kbGcuZ2V0RGxnRG9tKCkuZmluZChcIi5idG4tY2ZyXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25maXJtX2RsZy5oaWRlKCk7XG4gICAgICAgICAgICBzdWMgJiYgc3VjKCk7IFxuICAgICAgICAgICAgJGQxLnVuYmluZCgpOyBcbiAgICAgICAgICAgICRkMi51bmJpbmQoKTsgXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgJGQyID0gY29uZmlybV9kbGcuZ2V0RGxnRG9tKCkuZmluZChcIi5idG4tY2FuY2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25maXJtX2RsZy5oaWRlKCk7XG4gICAgICAgICAgICAkZDEudW5iaW5kKCk7IFxuICAgICAgICAgICAgJGQyLnVuYmluZCgpOyBcbiAgICAgICAgICAgIGVyciAmJiBlcnIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmZpcm1fZGxnLnNob3coKTsgXG4gICAgfSxcbiAgICBoZF9kbGcgOiBmdW5jdGlvbigkZG9tLHRpdGxlLGNiLGNsb3NlX2ZuKXtcbiAgICAgICAgdmFyICR3cmFwID0gICQoJzxkaXYgY2xhc3M9XCJtLXBvcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtLXBvcC1oZFwiPjxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImhkLWNsb3NlIGpzX2Nsb3NlXCI+JnRpbWVzOzwvYT48aDQ+Jyt0aXRsZSsnPC9oND48L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibS1wb3AtYmQgXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqc19jb250ZW50XCI+PC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm0tcG9wLWZ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4td3JhcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1jZnJcIj7noa7lrpo8L2J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj4nKTsgICBcbiAgICAgICAgdmFyIGRsZyA9IG5ldyBEaWFsb2coe1xuICAgICAgICAgICAgY29udGVudCA6ICR3cmFwLFxuICAgICAgICAgICAgY2xvc2VfZm4gOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGRsZy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBjbG9zZV9mbiAmJiBjbG9zZV9mbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJHdyYXAuZmluZChcIi5idG4tY2ZyXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY2IgJiYgY2IoZGxnLmdldENvbnRlbnQoKSxkbGcpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGxnLmdldENvbnRlbnQoKS5odG1sKCRkb20pO1xuICAgICAgICBkbGcuaGlkZSgpO1xuICAgICAgICByZXR1cm4gZGxnO1xuICAgIH0sXG4gICAgZGxnIDogZnVuY3Rpb24oY29udGVudCxtYXNrVmlzaWJsZSl7XG4gICAgICAgIHZhciBkbGcgPSBuZXcgRGlhbG9nKHtcbiAgICAgICAgICAgIGNvbnRlbnQgOiBjb250ZW50LFxuICAgICAgICAgICAgbWFza1Zpc2libGUgOiAhIW1hc2tWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgICAgICBkbGcuaGlkZSgpO1xuICAgICAgICByZXR1cm4gZGxnO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmo7XG5cblxuIiwidmFyIExvZ2luID0gcmVxdWlyZShcIi4uL21vZC9sb2dpbi5qc1wiKTtcbnZhciBwb3AgPSByZXF1aXJlKFwiLi4vbW9kL3BvcC5qc1wiKTtcbihmdW5jdGlvbigkKXtcbiAgICB2YXIgYm94ID0gJChcIiNsb2dpblwiKTtcbiAgICB2YXIgbG9naW4gPSBuZXcgTG9naW4oYm94KTtcbiAgICBsb2dpbi5pbml0KCk7XG4gICAgdmFyICBkZWNvZGUgPSB3aW5kb3cuZGVjb2RlVVJJQ29tcG9uZW50O1xuICAgIHZhciBzZWFyY2ggPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICAgIHZhciBzcywgcGFyYW1zID0ge307XG4gICAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoL15cXD8vLFwiXCIpO1xuICAgIHNzID0gIHNlYXJjaC5zcGxpdChcIiZcIik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIHQgPSBzc1tpXS5zcGxpdChcIj1cIilcbiAgICAgICAgcGFyYW1zW3RbMF1dID0gZGVjb2RlKHRbMV0pO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLm1zZyA9PSBcImVycm9yX2xvZ2luXzFcIikge1xuICAgICAgICBwb3AuYWxlcnQoXCLlr7nkuI3otbfvvIzotKblj7flr4bnoIHplJnor6/vvIzor7fph43mlrDovpPlhaVcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG59KShqUXVlcnkpO1xuIl19
