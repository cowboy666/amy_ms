(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['subject_list_hd.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var table=_.table;var hover=_.hover;var thead=_.thead;var tr=_.tr;var th=_.th;var tbody=_.tbody; _out+=' <table class="table  table-hover general-table"> <thead> <tr>     <th>专题ID</th>     <th>专题名称</th>     <th widht="150">专题描述</th>     <th>图片</th>     <th>状态</th>     <th>操作</th> </tr> </thead> <tbody> </tbody> </table>   '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['subject_list_hd.tmpl'];