require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var shop_tpl = require("./tmpl/sp_detail.js");
var search_params = require("../../lib/search_params.js");
var pop = require("../../mod/pop.js");
var CITY = {1: "北京" , 2 :"上海" , 3 :"广州" ,4 : "深圳"};
var SCALE =  {1 : "10人以下",2 : "10人－30人" , 3 : "30人以上"};

var Shop = {

    init : function(){
        var s = this._shop_id = search_params.params.id;
        if (!s) {
            pop.alert("没有商户ID");
            return;
        }
        this._dom = $("#main");
        this.load();
    },
    load : function(){
        var me = this;
        http.get({
            url : "/api/getShop.htm",
            data : {
                id : this._shop_id
            }
        }).done(function(rs){
            if (rs.ret == 1) {
                var data = rs.shop;
                me.render(data);
            } else {
                pop.alert("没有查询到商户信息");
            }
        }).fail(function(){
            pop.alert("服务器错误，请刷新重试");
        })
    },
    render : function(data){
        var tpl_data = {
            name : data.name,
            phone : data.telephone,
            legal : data.legalPerson,
            operator_period : data.operatePeriod,
            license : data.license,
            label_txt : data.typeNames,
            scale : SCALE[data.scale],
            city : CITY[data.cityId],
            shop_phone : data.shopPhone,
            address : data.address,
            longitude : data.longitude,
            latitude : data.latitude,
            bankName : data.bankName,
            cardholderName : data.cardholderName,
            bankCard : data.bankCard,
            status : data.status,
            bossName : data.bossName
        }
        var certificatePic = data.certificatePic;
        if (certificatePic) {
            tpl_data.busi_imgs = certificatePic.split(",")
        }
        var bossCertPic = data.bossCertPic;
        if (bossCertPic) {
            tpl_data.person_imgs = bossCertPic.split(",");
        }
        var html = shop_tpl(tpl_data);
        this._dom.html(html);
        this.listen();
        this._init_map();
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
            pop.confirm("确定拒绝此商户，如果拒绝请检查是否填写了拒绝原因",function(){
                me.reject();
            });
        })
        dom.find("button.ai-reslove").click(function(){
            pop.confirm("确认通过此商户审核？",function(){
                me.reslove();
            });
        })
    },
    _init_map : function(){
        var map_dom = $("#map-warp");
        var map_con = map_dom.find(".map-con");
        if ((lng && lat) || true) {
            var map = new BMap.Map(map_con[0],{
                enableMapClick : false
            });
            var data = map_dom.data();
            var city = data.city ,
                lng = data.lng /1000000,
                lat = data.lat /1000000;

            var p = new BMap.Point(lng||116.404, lat || 39.915);
            var mk = new BMap.Marker(p);
            map.addOverlay(mk);
            map.centerAndZoom(p,15);
            map.addControl(new BMap.NavigationControl());   //添加地图类型控件
            
        } else {
            map_com.html('<p>没有门店地理位置信息</p>');
        }

    },
    get_reject : function(){
        var reject_dom = this._dom.find("div.ai-reject");
        var $texarea = reject_dom.find("textarea");
        var vals = _.filter(_.map($texarea,function(t,i){
            return { val : $.trim(t.value) , step : i+1 } 
        }),function(o){
            return !!o.val;
        })
        return vals;
        
    },
    reslove : function(){
        var reject_vals = this.get_reject();
        if (reject_vals.length) {
            pop.alert("商铺有内容被拒绝，不能通过审核");
            return;
        }
        http.post({
            url : "/api/checkShop.htm",
            data : {
                shopId : this._shop_id,
                status : 2
            },
            async : false
        }).done(function(){
            window.location.href= "/m/shop_list"; 
            /**
            pop.confirm("回到商户列表页店点确定，否则刷新本页。",function(){
                window.location.href= "/m/shop_list"; 
            },function(){
                window.location.reload(true);
            })
            **/
        }).fail(function(){
            pop.alert("后台错误请刷新重试");
        });
    },
    reject : function(){
        var reject_vals = this.get_reject();
        if (!reject_vals.length) {
            pop.alert("没有填写拒绝内容，请填写");
            return;
        }

        var reject_vals = this.get_reject();
        if (!reject_vals.length) {
            pop.alert("没有填写拒绝内容，不能通过审核");
            return;
        }
        var shop_id = this._shop_id;
        http.post({
            url : "/api/setShopCheckDetail.htm",
            data : {
                shopId : this._shop_id,
                detail : JSON.stringify(reject_vals)
            }
        }).then(function(){
            return http.post({
                url : "/api/checkShop.htm",
                data : {
                    shopId : shop_id,
                    status : 3
                },
                async : false
            });
        }).done(function(){
            window.location.href= "/m/shop_list"; 
            /**
            pop.confirm("回到商户列表页店点确定，否则刷新本页。",function(){
                window.location.href= "/m/shop_list"; 
            },function(){
                window.location.reload(true);
            })
            **/
        }).fail(function(){
            pop.alert("后台错误请刷新重试");
        });
    }


}



module.exports = Shop;
