(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['time_row.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var time_list=_.time_list;var ind=_.ind;var index=_.index;var it=_.it;var div=_.div;var row=_.row;var col=_.col;var txt=_.txt;var ct=_.ct;var info=_.info; _out+='<div class="time-row '; if(index % 2 == 0 ) { _out+=' odd '; } _out+='">     <div class="label-col">         <div class="label-txt">         </div>     </div>     <div class="time-ct">         '; ~function() {for(var i0 in time_list) {if(time_list.hasOwnProperty(i0)) {var it=time_list[i0];var ind=i0; _out+='         <div class="ct-col '; if(it.special) { _out+=' sp-col '; } _out+='" data-col=\'';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(ind)) ;_out+='\' ><div class="order-info"></div></div>            '; }}}(); _out+='     </div> </div> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['time_row.tmpl'];