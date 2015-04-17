require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pager = require("../../lib/ipager.js");
var HD_TPL = require("./tmpl/subject_list_hd.js");
var TD_TPL = require("./tmpl/subject_td.js");

juicer.register('subject_status', function(s){
    //var s = data.status;

    if (s == 0) {
       return "下架" 
    } else if (s == 1) {
       return "上架";
    }
}); 


var Limit = 10;

var SearchBox = function(opt){
    opt = opt || {};
    var $d = this._dom = opt.dom || $("#sb-search-box");
    this._$search_box = $d.find(".m-prd-search");
    this._$list_box = $d.find(".m-result-list");
    this._$page_box = $d.find(".m-page-box");
    this._page_limit = opt.limit || Limit;
    this._opt = opt;
}

SearchBox.prototype.init = function(){
    this._initSearch();
    this._initResult();
}
SearchBox.prototype._initSearch = function(){
    var me = this , $s = me._$search_box;
    var $f = this._$search_form = $s.find("form");
    var $search_inp = $f.find(".ai-search-inp");
    this._$search_form.on("submit",function(e){
        e.preventDefault();
        var query = $.trim($search_inp.val());
        var search_obj = {
            query : query
        };
        me._search(search_obj);
    });
    
}
SearchBox.prototype._initResult = function(){
    var me = this , $l = this._$list_box;
    
    $l.delegate("a.ai-del","click",function(e){
        e.preventDefault();
        var $item = $(this).closest("tr");
        var data  = $item.data("item");
        var id = data.id;
        var flag = window.confirm("确定要删除此专题么？");
        if (flag) {
            http.post({
                url : "/api/deleteAlbum.htm",
                data : {
                    id : data.id
                }
            }).done(function(rs){
                if (rs.ret == 1) {
                    me.query(me._cache_params);
                } else {
                    alert("删除失败");
                }
            }).fail(function(){
                alert("删除失败");
            })
        }
    });

    $l.delegate("a.ai-edit","click",function(e){
        e.preventDefault();
        var $item = $(this).closest("tr");
        var data  = $item.data("item");
        var id = data.id;
        window.open("/m/operation/subject_edit?subject_id="+id);
    });
    
    $l.delegate("a.ai-online","click",function(e){
        e.preventDefault();
        var $item = $(this).closest("tr");
        var data  = $item.data("item");
        var id = data.id;
        http.post({
            url : "/api/setAlbumStatus.htm",
            data : {
                id : id ,
                status : 1
            }
        }).done(function(){
            me.query(me._cache_params);
        });
       
    });

    $l.delegate("a.ai-offline","click",function(e){
        e.preventDefault();
        var $item = $(this).closest("tr");
        var data  = $item.data("item");
        var id = data.id;
        http.post({
            url : "/api/setAlbumStatus.htm",
            data : {
                id : id ,
                status : 0
            }
        }).done(function(){
            me.query(me._cache_params);
        });
       
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
    var pn = 1 , ps = this._page_limit;
    var params = {pn:pn,ps:ps,query:obj.query};
    this._cache_params = params;
    this._renderListHd();
    this.query(params,obj);
}
SearchBox.prototype.query = function(params){
    var me = this;
    var url = '/api/getAlbumList.htm';
    http.get({
        url : url,
        data : $.extend({isDeleted : 0},params)
    }).done(function(rs){
        me._cache_params.pn = params.pn;
        me._renderList(rs.albumList);
        me._renderPage(params.pn,rs.totalNum,params.ps);
    }).fail(function(){
        alert("服务器错误，请刷新重试"); 
    });
}

SearchBox.prototype._reset = function(){
    this._cache_params = {pn:1,ps:this._page_limit};  
    this._$list_box.empty();
}
SearchBox.prototype._renderListHd = function(type){
    var $l = this._$list_box;
    $l.html(HD_TPL());
    
}
SearchBox.prototype._renderList = function(data){
    var $tbody = this._$list_box.find("tbody");
    var tpl ;
    tpl = TD_TPL;
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
    var q_params = _.extend({},params);
    q_params.pn = p;
    this.query(q_params);
    
}
SearchBox.prototype.search = function(opt){
    opt = opt || {};
    this._search(opt);
}

module.exports = SearchBox;
