(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_group.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var id=_.id;var name=_.name;var div=_.div;var group=_.group;var label=_.label;var a=_.a;var wrap=_.wrap;var type=_.type;var span=_.span;var txt=_.txt;var i=_.i;var add=_.add;var ico=_.ico;var ct=_.ct;var ul=_.ul; _out+='<div class="prd-group" >     <div class="group-label">         <a class="grp-wrap" href="javascript:;" data-type-id="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"><span class="grp-txt">';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(name)) ;_out+='</span><i class="grp-add-ico"></i></a>     </div>     <div class="prd-group-ct" id="group_type_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='">         <ul></ul>      </div> </div> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_group.tmpl'];