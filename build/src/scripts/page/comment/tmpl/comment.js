(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['comment.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var star=_.star;var order_no=_.order_no;var cus_name=_.cus_name;var cmt_date=_.cmt_date;var cmt_content=_.cmt_content;var reply=_.reply;var li=_.li;var cmt=_.cmt;var box=_.box;var div=_.div;var main=_.main;var wrap=_.wrap;var hd=_.hd;var stars=_.stars;var inner=_.inner;var no=_.no;var span=_.span;var name=_.name;var time=_.time;var ct=_.ct;var txt=_.txt;var p=_.p;var con=_.con;var textarea=_.textarea;var cnt=_.cnt;var button=_.button;var usr=_.usr;var logo=_.logo;var img=_.img;var tp=_.tp; _out+='<li class="m-cmt-box">     <div class="m-cmt-main">         <div class="cmt-wrap">             <div class="cmt-hd">                 <div class="cms u-stars"><div class="stars star';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(star)) ;_out+='"><div class="stars-inner"></div></div></div>                 <div class="cms odr-no">订单号:<span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(order_no)) ;_out+='</span></div>                 <div class="cms">|</div>                 <div class="cms u-name">用户名:<span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(cus_name)) ;_out+='</span></div>                 <div class="cms">|</div>                 <div class="cms u-time">时间:<span>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(cmt_date)) ;_out+='</span></div>                 <div class="cms">|</div>             </div>             <div class="cmt-ct">                 <div class="cmt-txt">                     ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(cmt_content)) ;_out+='                 </div>                 '; if(reply ) { _out+='                     <div class="cmt-reply-box">                         <p class="reply-con">                             ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(reply)) ;_out+='                         </p>                     </div>                 '; } else { _out+='                     <div class="cmt-reply-box">                         <div class="reply">                             <textarea class="ai-reply-cnt"></textarea>                         </div>                         <div class="btn-wrap">                             <button class="btn ai-reply" >回复</button>                         </div>                         </div>                 '; } _out+='             </div>         </div>     </div>     <div class="m-usr">         <div class="m-usr-logo">             <img src="http://tp4.sinaimg.cn/1249159055/180/5719639257/0" >         </div>         </div> </li> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['comment.tmpl'];