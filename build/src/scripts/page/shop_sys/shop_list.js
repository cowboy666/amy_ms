require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pager = require("../../lib/ipager.js");
var item_tpl = require("./tmpl/shop_item.js");
var format = require("../../lib/idate_format.js")

var Limit = 20;


var Shop_List = {

    init : function(){
        this._dom = $("#m-list");
        this._$list = this._dom.find(".ai-list"); 
        this._$page = this._dom.find(".ai-page");
        this._cur_params = {
            pn : 1
        };
        this._$list_ct = $("#list-ct");
        this._$noresult = $("#no-result");
        this.load();
        this.listen();
    },
    listen : function(){
       var me = this;
       var $page_dom = this._$page; 
       $page_dom.delegate(".pg-item","click",function(e){
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
                name : item.name,
                create_time : format.format(new Date(item.createTime) , "yyyy-MM-dd hh:mm"),
                shop_id : item.shopId,
                operator : item.operator,
                status : item.status
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
            if (rs.ret === 1 && rs.totalNum) {
                me._$noresult.hide();
                var shop_list = rs.shopList;
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
        url : "/api/getShopList.htm",
        data : $.extend({
            pn : data.pn,
            ps : Limit
        },data || {})
    });
}


module.exports = Shop_List;

