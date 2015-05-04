var $ = require("../lib/jquery.js");
var url_params = require("../lib/search_params.js").params;
var SearchBox = require("./operation/search_box.js");
var ShopItem = require("./operation/shop_story_item.js");
var _ = require("../lib/lodash.compat.min.js");
var http = require("../mod/http.js");

$(function(){
    var $container = $("#items-box");
    var searchbox = new SearchBox({
        limit : 5,
        default_type : "shop",
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
        var shop_id = data.shopId;
        var item = new ShopItem({data: data , shop_id: shop_id });
        item.init();
        $container.append(item.dom());
        http.get({
            url : "/api/getShopStory.htm",
            data : {
                shopId : shop_id 
            }
        }).done(function(rs){
            if (rs.story) {
                item.setContent(rs.story.story);
            }
        });
        return item;
    }

});
