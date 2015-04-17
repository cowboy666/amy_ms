var Login = require("../mod/login.js");
var pop = require("../mod/pop.js");
(function($){
    var box = $("#login");
    var login = new Login(box);
    login.init();
    var  decode = window.decodeURIComponent;
    var search = window.location.search;
    var ss, params = {};
    search = search.replace(/^\?/,"");
    ss =  search.split("&");
    for (var i = 0, l = ss.length; i < l; i++) {
        var t = ss[i].split("=")
        params[t[0]] = decode(t[1]);
    }
    if (params.msg == "error_login_1") {
        pop.alert("对不起，账号密码错误，请重新输入");
        return;
    }
    
})(jQuery);
