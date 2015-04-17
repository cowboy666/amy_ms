var http = require("../mod/http.js");
var _ = require("../lib/lodash.compat.min.js");
require("../lib/juicer.js");
var $ = require("../lib/jquery.js");
require("../lib/iform.js");
var AD_TPL = require("./operation/tmpl/home_ad_item.js");
var Uploader = require("../lib/iupload.js");


$(function(){
    
    var $container = $("#js-container");
    var cur_index = 0; 
    getOnlineData();

    $("#lined-btn").click(function(e){
        getOnlineData();
    });
    $("#draft-btn").click(function(e){
       getDraftData(); 
    });
    $("#add-btn").click(function(e){
        e.preventDefault();
        createItemDom(null);
    });
    $("#save-btn").click(function(e){
        var nf = false;
        var $doms = $container.find("div.ai-item");
        var datas = _.map($doms,function(dom,i){
            var data = $(dom).data("get_data")();
            if (!(data.imageUrl && data.entityId)) {
                alert("第"+(i+1)+"个项目，没有填写完整");
                nf = true;
                return null;
            }
            return data;
        });
            
        if (!nf && datas.length) {
            http.post({
                url : "/api/saveAdvertise.htm",
                data : { data : JSON.stringify(datas) }
            }).done(function(rs){
                 if (rs.list && rs.list.length) {
                    $doms.each(function(i,d){
                        $(d).find("input[name=ad_id]").val(rs.list[i].id);
                    });
                    alert("保存成功");
                 } else {
                    alert("服务器错误");
                    return;
                 }
            }).fail(function(){
                alert("服务器错误");
                return;
            })
        }
    });
    $("#online-btn").click(function(e){
        var f = window.confirm("确认要上线推送到首页么？");
        if (!f) {
            return ;
        }
        var nf = false;
        var $doms = $container.find("div.ai-item");
        var datas = _.map($doms,function(dom,i){
            var data = $(dom).data("get_data")();
            if (!data.id ) {
                alert("第"+(i+1)+"个项目，没有ID，没有存入数据库");
                nf = true;
                return null;
            }
            return data.id;
        });

        if (!nf && datas.length) {
            http.post({
                url : "/api/setAdvertiseOnline.htm",
                data : { id : datas.join(",") }
            }).done(function(rs){
                if (rs.ret == 1 ) {
                    alert("上线成功");
                } else {
                    alert("上线失败");
                }
            }).fail(function(){
                alert("服务器错误");
                return;
            })
        }

 
    });
    $container.delegate(".tools a.fa-times","click",function(e){
        e.preventDefault();
        $(this).closest("div.ai-item").remove();
    });
    function getOnlineData(){
        http.get({
            url : "/api/getAdvertiseList.htm"
        }).done(function(rs){
            $container.empty().append('<h2>线上数据</h2>');
            var list = rs.list;
            if (list && list.length) {
               _.forEach(list,function(l,i){
                 createItemDom(l);
               }); 
            } else {
                alert("目前首页轮播无数据");
            }
        }).fail(function(){
            alert("获取首页推荐信息错误");
        })
    }
    function getDraftData(){
        $container.empty().append('<h2>草稿数据</h2>');
        http.get({
            url : "/api/getDraftsAdvertiseList.htm"
        }).done(function(rs){
            var list = rs.list;
            if (list && list.length) {
               _.forEach(list,function(l,i){
                 createItemDom(l);
               }); 
            } else {
                alert("目前暂无草稿无数据");
            }
        }).fail(function(){
            alert("获取首页推荐信息错误");
        });
    }
    
    function createItemDom(data){
        var html = AD_TPL({
            index : cur_index+1
        });
        cur_index ++;
        var dom = $(html);
        var up_load = dom.find(".js-upload");
        $container.append(dom); 

        Uploader.create_upload({
            dom : up_load[0],
            multi_selection : false,
            callback : function(data,files){
                var pathList = data.pathList;
                if (pathList && pathList.length) {
                    var img = pathList[0];
                    dom.find("div.js-imgbox").html('<img src="'+img+'" >');
                    dom.find("input[name=image_url]").val(img);
                }
            }
        });
        var $form = dom.find("form")
        $form.form({
            data_map : {
                id : "input[name=ad_id]",
                imageUrl : "input[name=image_url]",
                /**
                status :{cls:"input[type=radio]" , val : function($ele){
                        var val ;
                        if ($ele[0].checked) {
                            val = $ele[0].value;
                        } else {
                            val = $ele[1].value;
                        }
                        return val;
                    }
                },
                **/
                adType : "select.js-type" ,
                entityId : "input[name=id]"
            } 
        });

        $form.on("form-submit",function(e,data){
            
        });
        dom.data("get_data",function(){
           return $form.data("iform").get_submit_data(); 
        });
        if (data) {
            dom.data("item",data);
            dom.find("input[name=ad_id]").val(data.id);
            if (data.imageUrl) {
                var img = data.imageUrl;
                dom.find("div.js-imgbox").html('<img src="'+img+'" >');
                dom.find("input[name=image_url]").val(img);
            }
            if (data.adType !== void 0) {
                dom.find("select.js-type").val(data.adType);
            }
            if (data.entityId) {
               dom.find("input[name=id]").val(data.entityId);
            }

        }
        
    }

});
