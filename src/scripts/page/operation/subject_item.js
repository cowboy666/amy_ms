var $ = require("../../lib/jquery.js");
var _ = require("../../lib/lodash.compat.min.js");
var http = require("../../mod/http.js");
var Uploader = require("../../lib/iupload.js");
var Tpl = require("./tmpl/subject_item.js");
var ShopTpl = require("./tmpl/shop_pf.js");
var PrdTpl = require("./tmpl/prd_pf.js");
var TitleTpl = require("./tmpl/title_content.js");
var ImgTpl = require("./tmpl/img_content.js");
var PTpl = require("./tmpl/p_content.js");


var SubjectItem = function(opt){
    //prd or shop
    this._ex_data = opt.data;
    this._subject_id = opt.subject_id;
    this._init_item_data = opt.item_data;
    this._ids = 0;
    this._items = [];
}

SubjectItem.prototype._key = "专题";
SubjectItem.prototype.init = function(){
    this._createDom();
    this._bind();
    Sortable.create(this._$item_con[0],{
        draggable  : ".ai-row"
    });
}
SubjectItem.prototype.dom = function(){
    return this._dom;
}

SubjectItem.prototype._createDom = function(){
     var me = this;
     var html = Tpl({key:me._key});
     this._dom = $(html);
     this._$ps_dom = this._dom.find(".ai-ps-box");
     this._$item_con = this._dom.find(".ai-content-item");
     this._$form = this._dom.find("form");
     if (this._ex_data.presentPrice !== void 0 ) {
         var ps_html = this._createPrd();
         this._typeid = 0;
     } else {
         var ps_html = this._createShop();
         this._typeid = 1;
     }
    this._$ps_dom.html(ps_html);
    this._dom.find(".ai-st-title").val(this._ex_data.title || this._ex_data.name);
     if (this._init_item_data ) {
        var content = this._init_item_data.content;
        var title = this._init_item_data.title;
        this._dom.find(".ai-st-title").val(title);
        content = JSON.parse(content);
        if (content && content.length) {
            _.forEach(content,function(d){
                me._addContentByData(d);
            })
        }
     } else {
        this.addContent(1);
     }

}
SubjectItem.prototype._bind = function(){
    var me = this;
    this._$form.on("submit",function(e){
        e.preventDefault();
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
        var title = $.trim(me._dom.find("input.ai-st-title").val());
        title = title || me._ex_data.name;
        var post_data = {
            albumId : me._subject_id,
            type : me._typeid,
            entityId : me._typeid == 0 ? me._ex_data.productId : me._ex_data.shopId,
            title : title,
            imageUrl : me._dom.find("div.twt-feed img").attr("src"),
            content : JSON.stringify(content)
        }
        if (!(me._init_item_data && me._init_item_data.id)) {
            http.post({
                url : "/api/addAlbumItem.htm",
                data : post_data
            }).done(function(rs){
                if (rs.ret == 1) {
                    me._init_item_data = rs.item;
                    alert("新增成功");

                } else {
                    alert("新增失败");
                
                }
            }).fail(function(){
                alert("服务器错误,新增失败");
            })
        } else  {
            post_data.id = me._init_item_data.id;
            http.post({
                url : "/api/updateAlbumItem.htm",
                data : post_data
            }).done(function(rs){
                if (rs.ret == 1) {
                    alert("更新成功");
                } else {
                    alert("更新失败");
                
                }
            }).fail(function(){
                alert("服务器错误,更新失败");
            })

        }
    
    });

    this._dom.find(".ai-add-btns").delegate("a","click",function(e){
        e.preventDefault();
        var type = $(this).data("type");
        me.addContent(type);
    });
    this._dom.find("a.ai-st-del").click(function(e){
        e.preventDefault();
        var flag = window.confirm("确认要删除此栏目么");
        if (flag) {
            if (me._init_item_data && me._init_item_data.id) {
                
                http.post({
                    url : "/api/deleteAlbumItem.htm",
                    data : {id :  me._init_item_data.id }
                }).done(function(rs){
                    if (rs.ret == 1) {
                        me.remove();
                        return;
                    } 
                    alert("删除失败");
                }).fail(function(){
                    alert("服务器错误，删除失败");
                });
                return ;
            } 
            me.remove();
        }
    });

}
SubjectItem.prototype._addContentByData = function(data){
    var type = data.type;
    var obj = this.addContent(type);
    if (obj) {
        var $dom = obj.dom;
        switch(type) {
            case 1:
                $dom.find("input").val(data.title);
                break;
            case 3:
                // code
                $dom.find("input[type=text]").val(data.url);
                $dom.find("img").attr("src",data.url).closest(".img-box").show();
                $dom.find("textarea").val(data.text);
                break;
            case 2:
                // code
                $dom.find("textarea").val(data.content);
                break;
            
            default:
                // code
        }
    }



}

SubjectItem.prototype._createPrd = function(){
    var data = this._ex_data;
    var img = data.image;
    if (img && img.length) {
        img = img.split(/;|,/)[0];
    }
    var tpl_data = {
        prd_name : data.title || data.name,
        prd_img : data.iconUrl || img,
        prd_pr : data.presentPrice,
        prd_old_pr : data.originalPrice,
        prd_dur : data.serviceTime,
        prd_shop_name : data.shopName
    };
    var html = PrdTpl(tpl_data)
    return html;
}

SubjectItem.prototype._createShop = function(){
    var data = this._ex_data;
    var html = ShopTpl(data);
    return html;
}
SubjectItem.prototype._createItem = function($dom){
    var me = this , type = me._ex_data;
    var $con = $dom.find(".ai-pf-box");
    var html = "";
    switch(type) {
        case 'prd': 
            html = me._createPrd();
            break;
        case 'shop':
            html = me._createShop();
            break;
        default:
            // code
    };

    $con.html(html);
}

SubjectItem.prototype.addContent = function(type){
    var me = this ;
    var $con = this._$item_con;
    var obj ; 
    switch(type) {
        case 1:
            obj = me._createTitleDom(); 
            break;
        case 2:
            obj = me._createPDom();
            // code
            break;
        case 3:
            obj = me._createImgDom();
            // code
            break;
        default:
            // code
    }
    if (obj) {
        var $dom = obj.dom;
        this._$item_con.append($dom);
        this._items.push(obj);
        
    }
    return obj;
}


SubjectItem.prototype._createTitleDom = function(){
    var html = TitleTpl();
    var $dom = $(html);
    var id  =  "_item_"+this._ids ++;
    var type = 1;
    this.bindItemDom($dom,id,type);
    return  {
        id : id, 
        type : type,
        dom : $dom,
        get_data : function(){
            var val = $.trim($dom.find("input").val());
            if (val) {
                return {
                    type : type ,
                    title : val 
                }
            }
            return null;
        }
    }
}

SubjectItem.prototype._createPDom = function(){
    var html = PTpl();
    var $dom = $(html);
    var id  =  "_item_"+this._ids ++;
    var type = 2;
    this.bindItemDom($dom,id);
    return  {
        id : id, 
        type : type,
        dom : $dom,
        get_data : function(){
            var val = $.trim($dom.find("textarea").val());
            if (val) {
                return  {
                    type : type,
                    content : val
                }
            }
            return null;
        }
    }
    
}



SubjectItem.prototype._createImgDom = function(){
    var html = ImgTpl();
    var $dom = $(html);
    var id  =  "_item_"+this._ids ++;
    var type = 3 ;
    var uploader = Uploader.create_upload({
        dom :  $dom.find(".img-upload-btn")[0],
        multi_selection : false,
        callback : function(data){
            var pathList = data.pathList;
            if (pathList && pathList.length) {
                var img_html = '<img src="'+pathList[0]+'" >';
                $dom.find("input[type=text]").val(pathList[0]);
                $dom.find(".img-wrap").html(img_html).parent().show(); 
                
            }
        }
    });
    $dom.data("uploader",uploader);
    this.bindItemDom($dom,id);
    return  {
        id : id, 
        type : type,
        dom : $dom,
        get_data : function(){
            var url = $.trim($dom.find("input").val());
            if (url) {
                return {
                    type : type ,
                    url : url,
                    text : $dom.find("textarea").val()
                }
            }
            return null;
        }
    }
}
SubjectItem.prototype.bindItemDom = function($dom,id){
    var me = this;
    $dom.attr("id",id);
    $dom.find(".add-del").click(function(e){
        e.preventDefault();
        me.removeItem(id);
    })
}
SubjectItem.prototype.removeItem = function(id){
    var items = this._items;
    var obj ,index;
    _.some(items,function(d,i){
        if (d.id === id) {
            obj = d;
            index = i;
            return true;
        }
    });
    if (obj) {
        var obj = items.splice(index,1)[0];
        var type = obj.type;
        if (type === 3) {
            obj.dom.data("uploader") &&  obj.dom.data("uploader").destroy();
        }
        obj.dom.remove();
        obj = null;
    }
}
SubjectItem.prototype.remove = function(){
    var items = this._items;
    _.forEach(items,function(obj){
        var type = obj.type;
        if (type === 3) {
            obj.dom.data("uploader") &&  obj.dom.data("uploader").destroy();
        }
        obj.dom.remove();
        obj = null;
    });
    
    this._items = null;
    this._dom.remove();
}



module.exports = SubjectItem;









