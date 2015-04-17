require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pop = require("../../mod/pop.js");


var GL = {
    init : function(){
       var me = this;
       this.$add_group_txt = $("#add_group_txt"); 
       this.$add_label_txt = $("#add_label_txt"); 
       this.$add_group = $("#add_group"); 
       this.$add_label = $("#add_label"); 
       this.$groups = $("#groups"); 
       this.$labels = $("#labels");

       this.$add_group.click(function(){
           var g_txt = $.trim(me.$add_group_txt.val());
           if (g_txt) {
              me.add_group(g_txt);
           }
       });
       this.$add_label.click(function(){
           var g_txt = $.trim(me.$add_label_txt.val());
           if (g_txt) {
              me.add_label(g_txt);
           }
       });
       this.load_group();
       this.$groups.delegate("li","click",function(){
           var type_id = this.getAttribute("data-id");
           me.load_label(type_id);
           me.$groups.find("li").removeClass("active");
           $(this).addClass("active");
       });
       this.$labels.delegate(".del","click",function(e){
           e.preventDefault();
           var $li = $(this).closest("li");
           var txt = $(this).closest("li").find("span").text();
           var id =  $(this).closest("li").data("id");
           
           pop.confirm("确认删除"+txt+"吗？",function(){
              me.del_label(id,$li); 
           });
       });
        this.$groups.delegate(".del","click",function(e){
           e.preventDefault();
           var $li = $(this).closest("li");
           var txt = $(this).closest("li").text();
           var id =  $(this).closest("li").data("id");
           
           pop.confirm("确认删除"+txt+"吗？",function(){
              me.del_label(id,$li); 
           });
       });
    },
    del_group : function(id,dom){
        http.post({
            url : "/api/deleteProductType.htm",
            data : {
                id : id
            }
        }).done(function(){
            dom.remove();
        }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
        })

    },
    del_label : function(id,dom){
        http.post({
            url : "/api/deleteProductLabel.htm",
            data : {
                id : id
            }
        }).done(function(){
            dom.remove();
        }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
        })
    },
    add_group : function(txt){
       var me = this;
       http.post({
        url : "/api/addProductType.htm",
        data :{
            name : txt
        } 
       }).done(function(rs){
          var productType = rs.productType;
          if (productType && productType.id) {
                me.$groups.find("li").removeClass("active");
                me.$groups.append('<li class="list-group-item active" data-id="'+productType.id+'"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a>'+productType.name+'</li>');          
                me.load_label(productType.id);
          } else {
                pop.alert("添加失败，请刷新重试")
          }
       }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
       })
    },
    add_label : function(name){
       var me = this;
       http.post({
        url : "/api/addProductLabel.htm",
        data :{
            name : name,
            typeId : me._cur_typeid
        } 
       }).done(function(rs){
          me.$labels.append('<li class="list-group-item"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a><span>'+name+'</span></li>');          
       }).fail(function(){
           pop.alert("服务器错误，请刷新重试")
       })
 
    },
    load_group : function(){
       var me = this;
       http.get({
          url : "/api/getProductType.htm"
       }).done(function(rs){
           var data = rs.data || [];
           var html = _.map(data,function(d){
               return '<li class="list-group-item" data-id="'+d.id+'"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a>'+d.name+'</li>';
           }).join("");
           if (data[0]) {
               me.load_label(data[0].id);
           }
           me.$groups.html(html);
           me.$groups.find("li").eq(0).addClass("active");
       })
    },
    render_gr : function(data){
        
    },
    load_label : function(id){
       var me = this;
       me._cur_typeid = id;
       http.get({
          url : "/api/getProductLabel.htm",
          data : {
            typeId : id
          }
       }).done(function(rs){
           var data = rs.data || [];
           var html = _.map(data,function(d){
               return '<li class="list-group-item" data-id="'+d.id+'"><a href="#" class="glyphicon glyphicon-trash pull-right del"></a><span>'+d.name+'</span></li>';
           }).join("");
           me.$labels.html(html);
       }) 
    },
    render_la : function(){
        
    }
};

module.exports = GL;
