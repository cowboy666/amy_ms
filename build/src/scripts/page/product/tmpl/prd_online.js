(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_online.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var list=_.list;var item=_.item;var index=_.index;var li=_.li;var id=_.id;var div=_.div;var inner=_.inner;var wrap=_.wrap;var img=_.img;var bar=_.bar;var bg=_.bg;var op=_.op;var left=_.left;var off=_.off;var rm=_.rm;var right=_.right;var h=_.h;var title=_.title; _out+=''; ~function() {for(var i0 in list) {if(list.hasOwnProperty(i0)) {var item=list[i0];var  index=i0; _out+='     <li class="prd-item" data-id="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(item.id)) ;_out+='">         <div class="prd-item-inner">             <div class="img-wrap">                 <img src="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(item.image)) ;_out+='" />             </div>                 <div class="bt-bar">                 <div class="bt-bar-bg">                 </div>                 <div class="bt-bar-inner">                     <div class="s-op s-left"></div>                     <div class="s-op s-off"></div>                     <div class="s-op s-rm"></div>                     <div class="s-op s-right"></div>                 </div>             </div>         </div>         <h4 class="prd-title">';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(item.name)) ;_out+='</h4>     </li> '; }}}(); _out+=' '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_online.tmpl'];