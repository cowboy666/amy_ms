var SearchBox = require("./operation/search_box.js");
var http = require("../mod/http.js");
var _ = require("../lib/lodash.compat.min.js");
$(function(){
    $("#operation-nav").addClass("active");
    $("#op-home-rec").addClass("active");
    var searchbox = new SearchBox({
        limit : 5,
        add_fn : function(data){
           addOpList(data); 
           $(window).scrollTop($("#record-prds").offset().top - 100);
        }
    });
    searchbox.init();
    
    var $op_dom = $("#ai-op-rec");
    var $auto_dom = $("#ai-auto-rec");
    var sl_dom = $("#rec-version");
    var add_datas = [];
    var del_op_items = [];
    
    http.get({
        url : "/api/getAutoRecommendVersionList.htm"
    }).then(function(rs){
        var d = rs.data || [] , len = d.length;
        var data = d[len-1];
        var html = _.map(d,function(data,i){
            return '<option value="'+data+'" >'+data+'</option>'; 
        }).join("");
        sl_dom.html(html);
        sl_dom.val(data);
        return http.get({
            url : "/api/getAutoRecommendProductList.htm",
            data : {
                version : data
            }
        });
    }).done(function(rs){
        renderList($auto_dom.find("ol"),rs.data); 
    });
    http.get({
        url : "/api/getOssRecommendProductList.htm",
    }).done(function(rs){
        renderList($op_dom.find("ol"),rs.data); 
    })
    
    //init 
    /**
    Sortable.create($auto_dom.find("ol")[0],{
        onSort : updateAuto
    });
    **/
    Sortable.create($op_dom.find("ol")[0],{
        onSort : updateOp
    });
    $("#user-save").click(addToDB);
    sl_dom.change(function(){
        var val = sl_dom.val();
        http.get({
            url : "/api/getAutoRecommendProductList.htm",
            data : {
                version : val
            }
        }).done(function(rs){
            renderList($auto_dom.find("ol"),rs.data); 
        });
    });
    $auto_dom.delegate("li i.fa-times","click",function(e){
        var $li = $(this).closest("li");
        var data = $li.data("item");
        var f = window.confirm("确认删除"+data.name+"吗？");
        if (!f) {
            return ;
        }
        $li.remove();
        var id = data.record_id !== void 0 ? data.record_id : data.recommend.id ;
        http.post({
            url : "/api/delRecommendProduct.htm",
            data : {
                id : id
            }
        }).done(function(){
            updateAuto();
        });
    });
    $op_dom.delegate("li i.fa-times","click",function(e){
        var $li = $(this).closest("li");
        var data = $li.data("item");
        $li.remove();
        updateOp();
    });
    //init end
    function renderList(dom,data){
        dom.empty();
        _.forEach(data,function(d,i){
            var html = getLiHtml(d,i);
            var $d = $(html);
            $d.data("item",d);
            dom.append($d);
        });
    }
    function getLiHtml(data,i){
        return '<li class="item dd-item"><a href="#"><i class="fa fa-times pull-right"></i>'+(i == void 0 ? '' : '<span class="ind">'+(i+1)+'</span>') +data.product.name+'</a></li>';
    };
    function addOpList(data){
        var dom = $op_dom.find("ol");
        var $lis = dom.find("li") , ind = $lis.length;
        var has_data_ids = _.map($lis,function(li){
            return $(li).data("item").product.id;
        })
        var count = 0;
        _.forEach(data,function(d,i){
           if (~has_data_ids.indexOf(d.id)) {
               return;
           }
           var $l = $('<li class="item "><a href="#"><i class="fa fa-times pull-right"></i><span class="ind">'+(ind+count+1)+'</span>' +d.name+'</a></li>');
           $l.data("item",d)
           add_datas.push(d);
           dom.append($l);
           count ++;
        });


    };
    
    function updateOp(){
        var lis = $op_dom.find("li");
        var post_data = [];
        var max = 9999;
        lis.each(function(i,li){
            var $li = $(li);
            var data = $li.data("item");
            $li.find(".ind").text(i+1);
        });
        return;
        http.post({
            url : "/api/modifyRecommendProductOrder.htm",
            data :{
                 data : JSON.stringify(post_data)
            }
        });

    }
    function updateAuto(){
        var lis = $auto_dom.find("li");
        var data = [];
        lis.each(function(i,li){
            var $li = $(li);
            var data = $li.data("item");
            $li.find(".ind").text(i+1);
        });
        return;

        http.post({
            
        })

    }

    function addToDB(){
        var f = window.confirm("确定要保存么，一旦保存，立刻生效，注意操作。");
        if (!f) {
            return;
        }
        var lis = $op_dom.find("li");
        var prd_ids = _.map(lis,function(li){
            var data = $(li).data("item");
            var id = (data.product || {}).id || data.id;
            return id
        }).join(",");
        http.post({
            url : "/api/addRecommendProduct.htm",
            data : {
                productId : prd_ids
            }
        }).done(function(rs){
            if (rs.ret === 1) {
                alert("保存成功");
                return;
            }
            alert("保存失败");
            return ;
        }).fail(function(){
            alert("保存失败");
            return ;
        });
    }
})
