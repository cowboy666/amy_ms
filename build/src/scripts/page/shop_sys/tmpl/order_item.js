(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['order_item.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var order_no=_.order_no;var usr_id=_.usr_id;var usr_phone=_.usr_phone;var shop_name=_.shop_name;var prd_name=_.prd_name;var price=_.price;var order_time=_.order_time;var service_time=_.service_time;var pay=_.pay;var status=_.status;var tr=_.tr;var td=_.td; _out+=' <tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(order_no)) ;_out+='     </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(usr_id)) ;_out+='     </td>         <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(usr_phone)) ;_out+='     </td>         <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(shop_name)) ;_out+='     </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_name)) ;_out+='     </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(price)) ;_out+='     </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(order_time)) ;_out+='     </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(service_time)) ;_out+='     </td>     <td>         '; if(pay == 1 ) { _out+='             支付宝         '; } else if(status == 2 ) { _out+='             微信         '; } _out+='     </td>     <td>         '; if(status == 0 ) { _out+='             未付款         '; } else if(status == 1 ) { _out+='             已付款         '; } else if(status == 2) { _out+='             已完成         '; } _out+='     </td> </tr> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['order_item.tmpl'];