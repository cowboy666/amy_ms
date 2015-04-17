(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['change_dlg.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var title=_.title;var html=_.html;var div=_.div;var pop=_.pop;var hd=_.hd;var a=_.a;var close=_.close;var times=_.times;var h=_.h;var bd=_.bd;var ft=_.ft;var wrap=_.wrap;var button=_.button;var cfr=_.cfr; _out+='<div class="m-pop">     <div class="m-pop-hd"><a href="javascript:;" class="hd-close js_close">&times;</a><h4>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(title)) ;_out+='</h4></div>     <div class="m-pop-bd ">         <div class="js_content">';_out+= (_method.__escapehtml.detection(html)) ;_out+='</div>     </div>     <div class="m-pop-ft">         <div class="btn-wrap">             <button class="btn-cfr">修改</button>         </div>     </div> </div> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['change_dlg.tmpl'];