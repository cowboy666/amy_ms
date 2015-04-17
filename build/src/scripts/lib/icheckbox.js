var $ = require('./jquery');

var Checkbox = function(dom){
    this._$dom = dom;
    this._$checkbox = dom.find("input[type=checkbox]");
    this.init();
}

Checkbox.prototype.init = function(){
    var checked = this._$checkbox.attr("checked");
    if (checked) {
        this._$dom.addClass("checked");
    } else {
        this._$dom.removeClass("checked");
    }
    this._listen_dom_event();
}
Checkbox.prototype._listen_dom_event = function(){
    var me = this , checkbox = this._$checkbox;
    this._$dom.click(function(e){
        if (checkbox.attr("checked")) {
            me.uncheck();
        } else {
            me.check();
        }
    });
}

Checkbox.prototype.uncheck = function(){
    this._$checkbox.removeAttr("checked");
    this._$dom.removeClass("checked");
}

Checkbox.prototype.check = function(){
    this._$checkbox.attr("checked",true);
    this._$dom.addClass("checked");
}

$.fn.checkbox = function(){
    this.each(function(){
        var $this = $(this),
            data = $this.data("icheckbox");
        
        if (!data) {
            $this.data("icheckbox",(data = new Checkbox($this)));    
        }
    });
}
