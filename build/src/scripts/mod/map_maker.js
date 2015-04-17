var iloader = require('../lib/iloader.js');
var Dialog = require('../lib/idialog.js');
var map_dlg_tpl = require('../page/reg/tmpl/map_dlg.js');
var $ = require("../lib/jquery.js");
var pop = require("./pop.js");

var map_src =['http://api.map.baidu.com/api?v=2.0&ak=DB192aa7c6701a0c5c5e7572bce421cc&callback=__map_init__'];
var init = false, loaded = false , callbacks = [];
window.__map_init__ = function(){
    loaded = true;        
    var cb;
    while( cb = callbacks.shift() ){
        cb();
    }
}
var load = function(cb){
    if (!init) {
        iloader.loadJS(map_src);
        init = true;
    }
    if (loaded) {
        cb();
        return;
    }
    callbacks.push(cb);

}

var map = {

     show : function(opt){
        var me = this;
        opt = opt ||{};
        me.opt = opt;
        load(function(){
            if (me.dlg) {
                me.dlg.show();
                if (opt.city) {
                    //me.ac.setLocation(opt.city);
                    me.local_search.setLocation(opt.city);
                }
                setTimeout(function(){
                    if (opt.pos) {
                        me._lask_mk && me.map.removeOverlay(me._lask_mk);
                        var mk = new BMap.Marker(opt.pos);
                        me._lask_mk = mk;
                        me.map.addOverlay(mk);
                        me.map.centerAndZoom(opt.pos,11);
                    } else {
                        me._lask_mk && me.map.centerAndZoom(me._last_mk.getPosition(),11);
                    }
                },500);
                return;
            }
    
            var $dom = $(map_dlg_tpl());
            var dlg = new Dialog({
                content : $dom
            });
            me.dlg = dlg;
            dlg.show();
            me.$dom = $dom;
            me.$map_dom = $dom.find(".map-box");
            var map = me.map = new BMap.Map(me.$map_dom[0],{
                enableMapClick : false
            });
            map.centerAndZoom(opt.city || "北京",11);
            map.addControl(new BMap.NavigationControl());   //添加地图类型控件
            me.init($dom);
        });
    },
    hide : function(){
        if (this.dlg) {
            this.dlg.hide();
            this.local_search.clearResults();
            
        }
    },
    init : function($dom){
        var me = this;
        this.$input = $dom.find(".ai-sch");
        this.$sch_btn = $dom.find("button");
        this.$panel = $dom.find(".ai-panel");
        $dom.find(".close-ico").click(function(e){
            e.preventDefault();
            me.hide();
        });
        this._last_mk = null;
        this.init_search();
        this.init_marker();
    },
    init_search : function(){
        var me = this;
        /**
        var ac = this.ac = new BMap.Autocomplete({
            "input" : this.$input[0],
		    "location" : this.map
	    });
        ac.addEventListener("onconfirm", function(e) {
            var _value = e.item.value;
		    var val = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            me.search(val);
        });
        **/
        me._overlays = [];
        this.local_search = new BMap.LocalSearch(this.map, { //智能搜索
          renderOptions:{map: this.map,panel :this.$panel[0] },
		  onMarkersSet : function(pois){
                console.log("pois===",pois); 
              for (var i = 0, l = pois.length; i < l; i++) {
                  (function(m,i){
                    console.log("=====",m)
                    me.bind_mark(m);
                      /**
                      m.removeEventListener("click");
                      m.addEventListener("dblclick", function(e){
                          pop.confirm("确定要保存这个点么？",function(){
                              me.hide();
                              me._last_mk =  new BMap.Marker(m.getPosition());
                              me.map.addOverlay(me._last_mk );
                              me.local_search.clearResults();
                              me.opt.callback && me.opt.callback(m.getPosition(),me);
                          });
                      }); 
                      **/
                  })(pois[i].marker,i);
              }
		  }  
        });  
        
        this.$input.on("keyup",function(e){
            var key_code = e.which;
            if (key_code == 13) {
                var val = me.$input.val();
                val = $.trim(val);
                if (val) {
                    me.search(val);
                }
            }
        })

        this.$sch_btn.click(function(e){
            var val = me.$input.val();
            val = $.trim(val);
            if (val) {
                me.search(val);
            }
        });
        this.$dom.find(".ai-clear").click(function(e){
            e.preventDefault();
            me.remove();
        });
    },
    remove : function(){
        var me = this;
        me.local_search.clearResults();
        var ols = me._last_mk;
        ols && me.map.removeOverlay(ols);
        me._last_mk = null;
    },
    init_marker : function(){
        var me = this;
        this._last_mk = null;
        iloader.loadJS([
            'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css',
            'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'
        ],function(){
            var last;
            var overlaycomplete = function(e){
                me._last_mk && me.map.removeOverlay(me._last_mk); 
                var m = me._last_mk = e.overlay;
                m.enableDragging();
                /**
                m.addEventListener("dblclick", function(e){
                    pop.confirm("确定要保存这个点么？",function(){
                        me.hide();
                        me._last_mk = new BMap.Marker(m.getPosition());
                        me.map.removeOverlay(m);
                        me.opt.callback && me.opt.callback(m.getPosition(),me);
                    });
                }); 
                **/
                me.bind_mark(me._last_mk);
            };
            //实例化鼠标绘制工具
            var drawingManager = new BMapLib.DrawingManager(me.map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                enableCalculate: false,
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    scale :0.5,
                    drawingModes : [
                        BMAP_DRAWING_MARKER
                    ]
                }
            }); 
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        });

    },
    search : function(val){
        this.local_search.clearResults();
        this._overlays = [];
        this.local_search.search(val); 
    },
    bind_mark : function(marker){
        var me = this;
        var markerMenu=new BMap.ContextMenu();
        markerMenu.addItem(new BMap.MenuItem('保存坐标',function(point,ee){
            me.opt.callback && me.opt.callback(point);
            me.hide();
        }));
	    marker.addContextMenu(markerMenu);
	},
    init_menu : function(){
        var me = this;
        var markerMenu=new BMap.ContextMenu();
        markerMenu.addItem(new BMap.MenuItem('保存坐标',function(point,ee){
            me.opt.callback && me.opt.callback(point);
            me.hide();
        }));
        me._menu = markerMenu;
    }
}
module.exports = map;
