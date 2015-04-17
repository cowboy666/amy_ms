(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['title_content.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var div=_.div;var group=_.group;var row=_.row;var label=_.label;var sm=_.sm;var input=_.input;var control=_.control;var btns=_.btns;var a=_.a;var del=_.del;var i=_.i;var times=_.times; _out+=' <div class="form-group ai-row">     <label class="col-sm-2 control-label">小标题</label>     <div class="col-sm-6">         <input type="text" class="form-control">     </div>     <div class="col-sm-4 add-btns" >         <a href="#" class="add-del" ><i class="fa fa-times"></i>删除</a>     </div> </div>   '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['title_content.tmpl'];