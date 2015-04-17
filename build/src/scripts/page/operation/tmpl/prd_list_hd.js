(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_list_hd.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var id=_.id;var table=_.table;var hover=_.hover;var thead=_.thead;var tr=_.tr;var th=_.th;var selected=_.selected;var all=_.all;var label=_.label;var input=_.input;var tbody=_.tbody; _out+=' <table class="table  table-hover general-table"> <thead> <tr>     <th>商品名称</th>     <th>现价</th>     <th>原价</th>     <th>服务时间</th>     <th>状态</th>     <th class="ai-selected-all">         <label>         <input type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>         全选         </label>     </th> </tr> </thead> <tbody> </tbody> </table>   '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_list_hd.tmpl'];