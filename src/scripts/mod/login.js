
var Login = function(dom){
    var $form = this.$form = dom.find("form");
    this.$uname = $form.find("input[name=j_username]");
    this.$pwd = $form.find("input[name=j_password]");
    this.$record = $form.find("input[name=record]");
    this.$submit = $form.find("button[type=submit]");
    var $chbox = $form.find(".chbox");
    if ($chbox.length) {
        this._chbox = new Chbox($chbox);
    }
}

Login.prototype = {
    constructor : Login,
    init : function(){
        var me = this;
        this.$form.submit(function(e){
             
        });
    }

}


var Chbox = function(dom){
    var checkbox = dom.find("input[type=checkbox]");
    dom.click(function(e){

        if (checkbox.attr("checked")) {
            checkbox.removeAttr("checked");  
            dom.removeClass("checked");
        } else {
            checkbox.attr("checked",true);
            dom.addClass("checked");
        }
    });
}

module.exports = Login; 
