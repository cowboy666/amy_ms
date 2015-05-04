require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pager = require("../../lib/ipager.js");
var PRD_HD_TPL = require("./tmpl/prd_list_hd.js");
var SHOP_HD_TPL = require("./tmpl/shop_list_hd.js");
var PRD_TD_TPL = require("./tmpl/prd_td.js");
var SHOP_TD_TPL = require("./tmpl/shop_td.js");

juicer.register('shop_status', function(s){
    if (s == 2) {
        return "审核通过";
    } 
    return "审核未通过";
}); 

juicer.register('prd_status', function(s){
    if (s == "2") {
        return "上架"; 
    } else if (s == "1") {
        return "下架";
    } else if (s =="3") {
        return  "删除";        
    }
    return "";
}); 

var Limit = 10;

var SearchBox = function(opt){
    opt = opt || {};
    var $d = this._dom = opt.dom || $("#pd-search-box");
    this._$search_box = $d.find(".m-prd-search");
    this._$list_box = $d.find(".m-result-list");
    this._$page_box = $d.find(".m-page-box");
    this._page_limit = opt.limit || Limit;
    this._opt = opt;
    this._opt.add_fn = opt.add_fn || $.noop;
}

SearchBox.prototype.init = function(){
    this._initSearch();
    this._initResult();
}
SearchBox.prototype._initSearch = function(){
    var me = this , $s = me._$search_box;
    var $f = this._$search_form = $s.find("form");
    this._$add_btn = $f.find(".ai-add");
    var $search_type = $f.find("input[type=radio]");
    var $search_inp = $f.find(".ai-search-inp");
    var search_type  = ["prd","shop"];
    
    this._cur_type = me._opt.default_type || "prd";
    
    if (this._cur_type == "prd") {
        $search_type[0].checked = true;
        $search_type[1].checked = false;
        if (me._opt.only_one) {
             $search_type.eq(1).closest(".radio").hide();
        }
    } else {
        $search_type[0].checked = false;
        $search_type[1].checked = true;
        if (me._opt.only_one) {
             $search_type.eq(0).closest(".radio").hide();
        }
    }

    this._$search_form.on("submit",function(e){
        e.preventDefault();
        var type ; 
        $search_type.each(function(i){
            if (this.checked) {
                type = search_type[this.value];
            }
        });
        var query = $search_inp.val();
        var search_obj = {
            type : type,
            query : query
        };
        me._search(search_obj);
    });
    this._$add_btn.click(function(e){
        var $l = me._$list_box;
        var $ch = $l.find(".ai-ch") || [];
        var data = [];
        var t_dom = [];
        _.forEach($ch,function(dom,i){
            var checked = dom.checked;
            if (checked) {
                var d = $(dom).closest("tr").data("item");
                data.push(d);
                t_dom.push(dom);
            }
        });
        if (data.length) {
            me._opt.add_fn(data); 
            _.forEach(t_dom,function(dom){
               dom.checked = false; 
            });
            me._dom.find(".ai-selected-all input[type=checkbox]").attr("checked",false);
        } else {
            alert("没有选择商品");
        }
    });
}
SearchBox.prototype._initResult = function(){
    var me = this , $l = this._$list_box;
    $l.delegate(".ai-selected-all label","click",function(e){
        var check_dom = $(this).find("input");
        var $td_labels = $l.find("input.ai-ch"); 
        if ($td_labels.length) {
            var checked = check_dom[0].checked;
            if (checked) {
                $td_labels.each(function(){
                    this.checked = true;
                });
            } else {
                $td_labels.each(function(){
                    this.checked = false;
                });
            }
        }
    });

    var $page_dom = this._$page_box; 
        $page_dom.delegate(".pg-item","click",function(e){
           e.preventDefault();
           var pg = this.getAttribute("pg") * 1;
           me.go_page(pg);
        });
       $page_dom.delegate(".js-p-next","click",function(e){
           e.preventDefault();
           var pg = me._cache_params.pn + 1;
           me.go_page(pg);
       });
       $page_dom.delegate(".js-p-prev","click",function(e){
           e.preventDefault();
           var pg = me._cache_params.pn -1;
           me.go_page(pg);
       });  
}

SearchBox.prototype._search = function(obj){
    var query_obj = this._SEARCH_MAP[obj.type];
    var pn = 1 , ps = this._page_limit;
    var params = {pn:pn,ps:ps,q:obj.query};
    this._cache_params = params;
    this._cur_type = obj.type;
    this._renderListHd(obj.type);
    query_obj.search.call(this,params,obj.type);
}
SearchBox.prototype._SEARCH_MAP = {
    "prd" : {
        search : function(params,type){
            var me = this;
            //var url = '/api/getProductList.htm';
            var url = '/searchProduct?from=oss';
            http.get({
                url : url,
                data : params
            }).done(function(rs){
                me._cache_params.pn = params.pn;
                me._renderList(type,rs.data);
                me._renderPage(params.pn,rs.totalNum,params.ps);
            }).fail(function(){
                alert("服务器错误，请刷新重试"); 
            });
        }
    },
    "shop" : {
        search : function(params,type){
            var me = this;
            var url = '/api/getShopList.htm';
            http.get({
                url : url,
                data : params
            }).done(function(rs){
                me._cache_params.pn = params.pn;
                me._renderList(type,rs.shopList);
                me._renderPage(params.pn,rs.totalNum,params.ps);
            }).fail(function(){
               alert("服务器错误，请刷新重试"); 
            });
        }
    }
    
}

SearchBox.prototype._reset = function(){
    this._cache_params = {pn:1,ps:this._page_limit};  
    this._$list_box.empty();
}
SearchBox.prototype._renderListHd = function(type){
    var $l = this._$list_box;
    if (type == "prd") {
        $l.html(PRD_HD_TPL());
    } else {
        $l.html(SHOP_HD_TPL());
    }
    
}
SearchBox.prototype._renderList = function(type,data){
    var $tbody = this._$list_box.find("tbody");
    var tpl ;
    if (type == "prd" ) {
        tpl = PRD_TD_TPL;
    } else {
        tpl = SHOP_TD_TPL;
    }
    $tbody.empty();
    _.forEach(data,function(d,i){
        var html = tpl(d);
        var $tr = $(html);
        $tr.data("item",d);
        $tbody.append($tr);
    });
}
SearchBox.prototype._renderPage = function(cur_page,total,limit){
      pager.render(this._$page_box,cur_page,total,limit); 
}

SearchBox.prototype.go_page = function(p){
    var params = this._cache_params;
    var type = this._cur_type;
    var query_obj = this._SEARCH_MAP[type];
    var q_params = _.extend({},params);
    q_params.pn = p;
    query_obj.search.call(this,q_params,type);
    
}

module.exports = SearchBox;
