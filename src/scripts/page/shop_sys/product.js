require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var prd_tpl = require("./tmpl/prd_detail.js");
var search_params = require("../../lib/search_params.js");
var pop = require("../../mod/pop.js");
var Prd = {

    init : function(){
        var s = this._prd_id = search_params.params.id;
        if (!s) {
            pop.alert("没有商品ID");
            return;
        }
        this._dom = $("#main");
        this.load();
    },
    load : function(){
        var me = this;
        http.get({
            url : "/api/getProduct.htm",
            data : {
                id : this._prd_id
            }
        }).done(function(rs){
            if (rs.ret == 1) {
                var data = rs.product;
                me.render(data);
            } else {
                pop.alert("没有查询到商户信息");
            }
        }).fail(function(){
            pop.alert("服务器错误，请刷新重试");
        })
    },
    render : function(data_obj){
        var data = data_obj.product ,
            shop = data_obj.shop;

        var tpl_data = {
            name : data.name,
            desc : data.description,
            price : data.presentPrice,
            service_time : data.serviceTime,
            org_price : data.originalPrice, 
            label_txt : data.labelNames,
            shop_name : shop.name,
            status : data.checkStatus,
            detail : data.checkDetail
        }
        var imgs = data.image ? data.image.split(",") : [];
        tpl_data.prd_imgs = imgs;
        var html = prd_tpl(tpl_data);
        this._dom.html(html);
        this.listen();
    },
    listen : function(){
        var me = this;
        var dom = this._dom;
        var reject_btn =  dom.find("a.ai-reject-btn");
        var reject_dom = dom.find("div.ai-reject");
        reject_btn.each(function(ind){
            $(this).click(function(e){
                e.preventDefault();
                var $d = reject_dom.eq(ind);
                $d.show();
            });
        });
        dom.find("button.ai-reject").click(function(){
            pop.confirm("确定拒绝此商品，如果拒绝请检查是否填写了拒绝原因",function(){
                me.reject();
            });
        })
        dom.find("button.ai-reslove").click(function(){
            pop.confirm("确认通过此商品审核？",function(){
                me.reslove();
            });
        })
    },
    get_reject : function(){
        var reject_dom = this._dom.find("div.ai-reject");
        var $texarea = reject_dom.find("textarea");
        return $.trim($texarea.val());
        
    },
    reslove : function(){
        var me = this;
        var reject_vals = this.get_reject();
        if (reject_vals.length) {
            pop.alert("商品有内容被拒绝，不能通过审核");
            return;
        }
        http.post({
            url : "/api/checkProduct.htm",
            data : {
                productId : me._prd_id,
                status : 1
            }
        }).done(function(){
            window.location.href= "/m/prd_list"; 
        }).fail(function(){
            pop.alert("后台错误请刷新重试");
        });
    },
    reject : function(){
        var reject_vals = this.get_reject();
        var me = this;
        if (!reject_vals.length) {
            pop.alert("没有填写拒绝内容，不能通过审核");
            return;
        }

        http.post({
            url : "/api/setProductCheckDetail.htm",
            data : {
                productId : this._prd_id,
                detail : reject_vals
            }
        }).then(function(){
            return http.post({
                url : "/api/checkProduct.htm",
                data : {
                    productId : me._prd_id,
                    status : 3
                },
                async : false
            });
        }).done(function(){
            window.location.href= "/m/prd_list"; 
        }).fail(function(){
            pop.alert("后台错误请刷新重试");
        });
    }


}



module.exports = Prd;
