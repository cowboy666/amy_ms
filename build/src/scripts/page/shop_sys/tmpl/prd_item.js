(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_item.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var prd_id=_.prd_id;var name=_.name;var shop_name=_.shop_name;var create_time=_.create_time;var online=_.online;var status=_.status;var tr=_.tr;var td=_.td;var a=_.a;var m=_.m;var prd=_.prd;var id=_.id;var pencil=_.pencil; _out+=' <tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_id)) ;_out+='     </td>         <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(name)) ;_out+='     </td>         <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(shop_name)) ;_out+='     </td>         <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(create_time)) ;_out+='     </td>     <td>         '; if(online == 2) { _out+='             上架         '; } else if(online == 1) { _out+='             下架         '; } else if(online == 3) { _out+='             删除         '; } _out+='     </td>     <td>         '; if(status == 0 ) { _out+='             未审核         '; } else if(status == 1 ) { _out+='             审核通过         '; } else if(status == 3) { _out+='             审核未通过         '; } _out+='     </td>     <td>         <a href="/m/prd?id=';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_id)) ;_out+='" class= "glyphicon glyphicon-pencil"></a>     </td> </tr>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_item.tmpl'];