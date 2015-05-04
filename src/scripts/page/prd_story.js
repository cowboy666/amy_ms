var $ = require("../lib/jquery.js");
var url_params = require("../lib/search_params.js").params;
var SearchBox = require("./operation/search_box.js");
var PrdItem = require("./operation/prd_story_item.js");
var _ = require("../lib/lodash.compat.min.js");
var http = require("../mod/http.js");

$(function(){
    var $container = $("#items-box");
    var searchbox = new SearchBox({
        limit : 5,
        default_type : "prd",
        only_one : true,
        add_fn : function(data){
            var first ;
            for (var i = 0, l = data.length; i < l; i++) {
                if (!first) {
                    first = addItem(data[i]);
                } else {
                    addItem(data[i]);
                }
            }
            if (first) {
                $(window).scrollTop(first.dom().offset().top - 100);
            }
        }
    });
    searchbox.init();
    function addItem(data){
        var prd_id = data.productId;
        var item = new PrdItem({data: data , prd_id: prd_id });
        item.init();
        $container.append(item.dom());
        http.get({
            url : "/api/getProductStory.htm",
            data : {
                productId : prd_id 
            }
        }).done(function(rs){
            if (rs.stroy) {
                item.setContent(rs.stroy.story);
            }
        });
        return item;
    }

});
