require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pager = require("../../lib/ipager.js");
var item_tpl = require("./tmpl/order_item.js");

var Limit = 20;

var parse_date = function(dateint){
    dateint +="";
    return dateint.substring(0,4)+"-"+dateint.substring(4,6)+"-"+dateint.substring(6,8);
}

var parse_st = function(st){
    st = ""+st;
    if (st.length == 3) {
        st = "0"+st.substring(0,1)+":"+st.substring(1);
    } else {
        st = ""+st.substring(0,2)+":"+st.substring(2);
    } 
    return st;
}

var format = function(date){
    var  yyyy = date.getFullYear(),
         mm = date.getMonth()+1,
         day = date.getDate(),
         hh  = date.getHours(),
         mins = date.getMinutes();
    
    if (mm < 10) {
        mm = "0"+mm;
    }
    return yyyy+"-"+mm+"-"+day +" "+ hh +":"+mins;
    
}

var Prd_List = {

    init : function(){
        this._dom = $("#m-list");
        this._cur_params = {
            pn : 1
        };
        this._$list = this._dom.find(".ai-list"); 
        this._$page = this._dom.find(".ai-page");
        this._$list_ct = $("#list-ct");
        this._$noresult = $("#no-result");
        this.load();
        this.listen();
    },
    listen : function(){
        var me = this;
        var $page_dom = this._$page; 
        $page_dom.delegate(".js-pn","click",function(e){
           e.preventDefault();
           var pg = this.getAttribute("pg") * 1;
           me.go_page(pg);
        });
        $page_dom.delegate(".js-p-next","click",function(e){
           e.preventDefault();
           var pg = me._cur_params.pn + 1;
           me.go_page(pg);
        });
        $page_dom.delegate(".js-p-prev","click",function(e){
           e.preventDefault();
           var pg = me._cur_params.pn -1;
           me.go_page(pg);
        });  
        var $sf = $("#status-filter");
        $sf.find("li a").click(function(e){
            e.preventDefault();
            var status = this.getAttribute("data-status");
            var text = this.innerHTML;
            $sf.find("button").html(''+text+'<span class="caret"></span>');
            if (status === "all") {
                delete me._cur_params.status;
            } else {
                me._cur_params.status = status;
            }
            me.load();
        });

    },
    render : function(shop_list){
        var $ls = this._$list.empty();
        _.forEach(shop_list,function(item,i){
           var html = item_tpl({
                ind_txt : i + 1,
                order_no : item.indent.id,
                usr_id : item.indent.authorId,
                usr_phone: item.indent.consumerPhone,
                shop_name : item.shopName,
                prd_name : item.product.name,
                price : item.product.presentPrice,
                order_time : format(new Date(item.indent.createTime)),
                service_time : parse_date(item.indent.serviceDay) + " "+parse_st(item.indent.serviceTime),
                pay : item.indent.payMethod ,
                status : item.indent.status 
           });
           var $d = $(html); 
           $d.data("item",item);
           $ls.append($d);
        });
    },
    render_page : function(pg,total){
        pager.render(this._$page,pg,total,Limit);
    },
    load : function(pg){
        var me = this;
        pg = pg == void 0 ? 1 : pg;
        query_list($.extend({},me._cur_params,{pn:pg})).done(function(rs){
            if (rs.ret === 1 && rs.indentList.length) {
                me._$noresult.hide();
                var shop_list = rs.indentList;
                me.render(shop_list);
                me._cur_params.pn = pg;
                me.render_page(pg,rs.totalNum);
                me._$list_ct.show();
            } else {
                me._$list_ct.hide();
                me._$noresult.html("<p>没有查询到结果</p>").show();
            }
        }).fail(function(){
            me._$list_ct.hide();
            me._$noresult.html("<p>后台错误</p>").show();
        });
    },
    go_page : function(pg){
        this.load(pg); 
    }
}

function query_list(data) {
    return http.get({
        url : "/api/getIndentList.htm",
        data : $.extend({
            pn : data.pn,
            ps : Limit
        },data || {})
    });
}


module.exports = Prd_List;

