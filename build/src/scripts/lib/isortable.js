var $ = require('./jquery.js');
require('./jquery.event.drag-2.2.js');
require('./jquery.event.drag.live-2.2.js');


var Sortable = function(opt){
    this._$dom = opt.dom;
    this._selector = opt.selector || "li";
    this._onDrag = opt.onDrag || $.noop;
    this._onDragStart = opt.onDragStart || $.noop;
    this._onDrop = opt.onDrop || $.noop;
    this._placeholder = opt.placeholder || function($dom){
        return $dom.clone().addClass("drag_placeholder");
    }    
    this._bind();
}


Sortable.prototype._bind = function($items){
    var me = this , selector = me._selector;
    if (!$items) {
        $items = this._$dom.find(selector);
    }
    this._$items = $items;
    if ($items.length === 1) {
         return;
    }

    $items.each(function(i,ele){
        var $ele = $(ele);
        if ($ele.data("dragdata")) {
            return;
        }
        $ele.drag("start",function(ev,dd){
            var $d = $(this);
            dd._$ph = me._placeholder($d);
            dd._i_w = $d.width();
            dd._i_h = $d.height();
            dd._ind = me._$items.index();
            me._onDragStart($d);
            var $proxy = $('<div class="prd-item"></div>')
                         .html($d.html())
                         .addClass("dragged")
                         .css($d.offset())
                         .appendTo(document.body);
            $d.before(dd._$ph);
            $d.hide();
            return $proxy;
        }).drag(function(ev,dd){
            var i = 0 , $t ;
            var $items = me._$items , len = $items.length;
            var offset = {
                top : dd.offsetY,
                left : dd.offsetX
            };
            $(dd.proxy).css(offset);
            var w = dd._i_w , h = dd._i_h ,
                cx = offset.left + w / 2 ,
                cy = offset.top + h / 2;
            var $dom = me._$dom;
                con_offset = $dom.offset(),
                cl = con_offset.left , ct = con_offset.top ,
                cb = ct + $dom.height(), cr = cl + $dom.width();
            
            if( cx < cl || cx > cr || cy < ct || cy >cb  ){
                dd._$ph.hide().remove();
                dd._cur_ind = null;
                me._onDrag($(this),dd);
                return;
            }
            var $d = $(this);
            while( ($t = $items.eq(i))[0]){
                if (i == dd._ind) {
                    i++;
                    continue;
                }
                var t_pos = $t.offset();
                var tl = t_pos.left , tt = t_pos.top , 
                    tr = tl + w , tb = tt + h;
                //console.log("=======",tl,tr,tt,tb,cx,cy);
                if (cx > tl && cx < tr && cy > tt && cy < tb) {
                    if (cx <= tl + w / 2) {
                        $t.before(dd._$ph.show());
                        dd._cur_ind = Math.max(i-1,0);
                    } else {
                        $t.after(dd._$ph.show());
                        dd._cur_ind = Math.max(i+1,len - 1 );
                    }
                    break;
                }
                i++;
            }
            me._onDrag($d,dd);
        }).drag("end",function(ev,dd){
            var $d = $(this);
            if (dd._$ph.is(":hidden")) {
                dd._$ph.remove();
                $(dd.proxy).remove();
                $d.show();
                delete dd._$ph;
                delete dd._i_w;
                delete dd._i_h;
                delete dd._ind;
                delete dd._cur_ind;
            } else {
                var offset = dd._$ph.offset();
                var $p = $(dd.proxy).animate(offset,420,function(){
                    $p.remove();
                    dd._$ph.replaceWith($d.show()).remove();
                    me._onDrop($(this),me._$items,dd._ind,dd._cur_ind);
                    $(dd.proxy).remove();
                    delete dd._$ph;
                    delete dd._i_w;
                    delete dd._i_h;
                    delete dd._ind;
                    delete dd._cur_ind;
                });
            }
            me.refresh();
        });
    });
}

Sortable.prototype.refresh = function(){
    var me = this;
    var $items = this._$dom.find(me._selector);
    $items.each(function(i,ele){
       teardown.call(ele); 
    });
    me._bind($items);
}
Sortable.prototype.getItems = function(){
    return this._$items;
}

var slice = Array.prototype.slice;
var teardown = $.event.special.drag.teardown;
$.fn.sortable = function(opt){
    opt = opt || {};
    this.each(function () {
        var $this = $(this),
            data = $this.data("isortable");
            
        if ($.type(opt)=== "string" && data ) {
           var args = slice.call(arguments,1);
           return data[opt].apply(data,args);
        }
        if (!data) {
            var _opt = $.extend({
                dom : $this
            },opt);
            $this.data("isortable",(data = (new Sortable(_opt))));
        }

    });   
}



