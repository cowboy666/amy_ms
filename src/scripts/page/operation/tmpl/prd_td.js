(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_td.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var id=_.id;var name=_.name;var presentPrice=_.presentPrice;var originalPrice=_.originalPrice;var serviceTime=_.serviceTime;var status=_.status;var tr=_.tr;var td=_.td;var prd_status=_.prd_status;var label=_.label;var input=_.input;var ch=_.ch; _out+='<tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='             </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(name)) ;_out+='             </td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(presentPrice)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(originalPrice)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(serviceTime)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(_method.prd_status.call({}, status))) ;_out+='</td>     <td>         <label>             <input class="ai-ch" type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>             选择         </label>     </td> </tr>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_td.tmpl'];