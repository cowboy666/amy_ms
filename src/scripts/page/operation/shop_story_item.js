var SubjectItem = require("./subject_item.js");
var _ = require("../../lib/lodash.compat.min.js");
var http = require("../../mod/http.js");

var ShopStoryItem = function(opt){
    SubjectItem.call(this,opt);
    this._shop_id = opt.shop_id;
};

ShopStoryItem.prototype = _.create(SubjectItem.prototype,{
    constructor : ShopStoryItem
});


ShopStoryItem.prototype._key = "门店故事";
ShopStoryItem.prototype._bind = function(){
    var me = this;
    var $title =  this._$form.find(".m-subject-item-title").removeClass("hide").show().find("input[type=text]");
    var $sub_title = this._$form.find(".m-sub-title").removeClass("hide").show().find("input[type=text]");

    this._$form.on("submit",function(e){
        e.preventDefault();
        var title = $.trim($title.val()),
            sub_title = $.trim($sub_title.val());

        
        if (!title) {
            alert("大标题必填");
            return;
        }

        var items = me._items;

        
        var $inp_doms = me._$item_con.find(".ai-row");
        var content = _.chain($inp_doms).map(function(html_dom){
            var id = html_dom.getAttribute("id");
            var obj = _.filter(items , function(d){
                return id == d.id;
            })[0];
            return obj.get_data();
        }).filter(function(data){
            return data != null;
        }).value();
        /**
        var content = _.filter(_.map(items,function(it){
            return it.get_data();
        }),function(data){
            return data != null;
        });

        **/
        var title_obj = {
            type : 4 ,
            title : title ,
            subtitle : sub_title
        };

        content = [title_obj].concat(content);

        var post_data = {
            shopId : me._shop_id,
            data : JSON.stringify(content)
        };

        http.post({
            url : "/api/setShopStory.htm",
            data : post_data
        }).done(function(rs){
            if (rs.ret == 1) {
                alert("保存成功");
            } else {
                alert("保存失败");
            }
        }).fail(function(){
            alert("服务器错误,新增失败");
        });
    
    
    });

    this._dom.find(".ai-add-btns").delegate("a","click",function(e){
        e.preventDefault();
        var type = $(this).data("type");
        me.addContent(type);
    });
    this._dom.find("a.ai-st-del").click(function(e){
        e.preventDefault();
        var flag = window.confirm("确认要删除此门店故事么");

        if (flag && me._init_item_data) {
            http.post({
                url : "/api/delShopStory.htm",
                data : {shopId : this._shop_id }
            }).done(function(rs){
                if (rs.ret == 1) {
                    me.remove();
                    return;
                } 
                alert("删除失败");
            }).fail(function(){
                alert("服务器错误，删除失败");
            });
        } 
    });

}

ShopStoryItem.prototype.setContent = function(data){
    var me = this;
    var content = data;
    content = JSON.parse(content);
    if (content && content.length) {
        this._init_item_data = content;
        me.removeItem(me._items[0].id);
        _.forEach(content,function(d){
            me._addContentByData(d);
        })
    }
}


module.exports = ShopStoryItem;



