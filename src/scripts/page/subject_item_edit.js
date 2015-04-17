var $ = require("../lib/jquery.js");
var url_params = require("../lib/search_params.js").params;
var SearchBox = require("./operation/search_box.js");
var SubjectItem = require("./operation/subject_item.js");
var _ = require("../lib/lodash.compat.min.js");
var http = require("../mod/http.js");

$(function(){
    var subject_id = url_params.subject_id;
    if (!subject_id) {
        alert("没有专题ID "); 
        return;
    }
    var $container = $("#subject-items-box");
    var searchbox = new SearchBox({
        limit : 5,
        add_fn : function(data){
            var first ;
            for (var i = 0, l = data.length; i < l; i++) {
                if (!first) {
                    first = addSubjectItem(data[i]);
                } else {
                    addSubjectItem(data[i]);
                }
            }
            if (first) {
                $(window).scrollTop(first.dom().offset().top - 100);
            }
        }
    });
    init();
    searchbox.init();
       
    function init(){
        initSubject(); 
        http.get({
            url  : "/api/getAlbumItemList.htm",
            data : {
                pn : 1,
                ps : 1000,
                albumId : subject_id
            }
        }).done(function(rs){
            var albumItemList = rs.albumItemList || [];
            _.forEach(albumItemList , function(data){
                //商品
                if (data.albumType == 0) {
                    http.get({
                        url : '/api/getProduct.htm',
                        data : {
                            id : data.entityid
                        }
                    }).done(function(rs){
                        if (!(rs.product)) {
                            return;
                        }
                        var shop = rs.product.shop;
                        var product  = rs.product.product;
                        product.shopName = shop.name;
                        addSubjectItem(product,data);
                    })
                } else if (data.albumType == 1) {
                    http.get({
                        url : '/api/getShop.htm',
                        data : {
                            id : data.entityid
                        }
                    }).done(function(rs){
                        var shop  = rs.shop;
                        addSubjectItem(shop,data);
                    })
                    
                }
            })
        });
    
    }
    function initSubject(){
        $("#subject-md-btn").click(function(){
            window.open("/m/operation/subject_edit?subject_id="+subject_id);
        })
        http.get({
            url : "/api/getAlbum.htm",
            data : {
                id : subject_id
            }
        }).done(function(rs){
           var data = rs.album;
           if (data) {
               $("#st-name").html(data.name);
               $("#st-logo").attr("src",data.imageUrl).parent().show();
               return;
           }
            alert("获取专题基本信息失败");
        }).fail(function(){
            alert("获取专题基本信息失败");
        })
    }

    function addSubjectItem(data,item_data){
        var subject_item = new SubjectItem({data: data,subject_id : subject_id ,item_data: item_data});
        subject_item.init();
        $container.append(subject_item.dom());
        return subject_item;
    }


});
