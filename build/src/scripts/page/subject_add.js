var $ = require("../lib/jquery.js");
var Uploader = require("../lib/iupload.js");
var http = require("../mod/http.js");
require("../lib/iform.js");
var url_params = require("../lib/search_params.js").params;
$(function(){
    $("#operation-nav").addClass("active");
    $("#op-add-subject").addClass("active");

    initUpload();
    addSubject();
    var subject_id = url_params.subject_id;
    if (subject_id !== void 0) {
        $("button.add-subject").html("更新专题").after($('<a href="/m/operation/subject_item_edit?subject_id='+subject_id+'" class="btn btn-info" >专题详情</a>'));

        http.get({
            url : "/api/getAlbum.htm",
            data : {
                id : subject_id
            }
        }).done(function(rs){
           var data = rs.album;
           if (data) {
               $("#subject_name").val(data.name);
                $("#subject_logo").val(data.imageUrl);
                $("#upload-img").removeClass("hide").find("img").attr("src", data.imageUrl) 
                $("#upload-img h4").html("专题头图");
                if (data.detailImageUrl) {
                    $("#detail-subject_logo").val(data.detailImageUrl);
                    $("#detail-upload-img").removeClass("hide").find("img").attr("src", data.detailImageUrl); 
                    $("#detail-upload-img h4").html("详情页头图");
                }
               return;
           }
            alert("获取专题基本信息失败");
        }).fail(function(){
            alert("获取专题基本信息失败");
        })

    }
       
});

function addSubject(){
    var $form = $("#subject_form");
    $form.form({
        data_map : {
            name : "#subject_name",
            imageUrl : "#subject_logo",
            detailImageUrl : "#detail-subject_logo",
            startDate : "#start_date",
            endDate : "#end_date"
        }
    });
    $form.on("form-submit",function(e,form_data){
        e.preventDefault();
        if (!(form_data.name && form_data.imageUrl)) {
            alert("没有填写完数据");
            return;
        }
        http.post({
            url : "/api/addAlbum.htm",
            data : form_data,
            async : false

        }).done(function(rs){
            if (rs.ret == 1) {
                var album = rs.album;
                window.location.href="/m/operation/subject_item_edit?subject_id="+ album.id;
            } else {
                alert("添加失败");
            }
        }).fail(function(){
            alert("添加失败");
        });
    })
}

function initUpload(){
    Uploader.create_upload({
        dom : $("#logo-upload")[0],
        multi_selection : false,
        callback : function(data){
            var pathList = data.pathList;
            if (pathList && pathList.length) {
                $("#subject_logo").val(pathList[0]);
                $("#upload-img").removeClass("hide").find("img").attr("src", pathList[0]) 
                $("#upload-img h4").html("专题头图");
            }
        }
    });
    Uploader.create_upload({
        dom : $("#detail-logo-upload")[0],
        multi_selection : false,
        callback : function(data){
            var pathList = data.pathList;
            if (pathList && pathList.length) {
                $("#detail-subject_logo").val(pathList[0]);
                $("#detail-upload-img").removeClass("hide").find("img").attr("src", pathList[0]) 
                $("#detail-upload-img h4").html("详情页头图");
            }
        }
    });

}
