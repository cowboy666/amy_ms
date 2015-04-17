var http = require("../mod/http.js");
var _ = require("../lib/lodash.compat.min.js");
require("../lib/juicer.js");
var $ = require("../lib/jquery.js");
var AD_TPL = require("./operation/tmpl/home_ad_item.js");
var Uploader = require("../lib/iupload.js");


$(function(){
    
    var $container = $("#js-container");
    var cur_index = 0; 

    $("#add-btn").click(function(e){
        e.preventDefault();
        createItemDom(null);
    });

    createItemDom(null);
    
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
        var $form = dom.find("form",{
            data_map : {
                image_url : "input[name=image_url]",
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
                type : "select.js-type" ,
                id : "input[name=id]",
                text : "input[name=text]"
            } 
        });

        $form.on("form-submit",function(e,data){
            console.log("data====",data); 
        });
        
        if (data) {
            dom.data("item",data);
            if (data.imageUrl) {
                dom.find("")
            }

        }
        
    }

});
