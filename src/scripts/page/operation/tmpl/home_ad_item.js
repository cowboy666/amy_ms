(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['home_ad_item.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var div=_.div;var item=_.item;var lg=_.lg;var heading=_.heading;var span=_.span;var right=_.right;var a=_.a;var times=_.times;var body=_.body;var sm=_.sm;var form=_.form;var horizontal=_.horizontal;var input=_.input;var group=_.group;var label=_.label;var control=_.control;var btn=_.btn;var button=_.button;var primary=_.primary;var upload=_.upload;var align=_.align;var left=_.left;var select=_.select;var type=_.type;var not=_.not;var init=_.init;var option=_.option;var ul=_.ul;var pills=_.pills;var stacked=_.stacked;var li=_.li;var ID=_.ID;var wrap=_.wrap;var imgbox=_.imgbox; _out+=' <div class="row ai-item">     <div class="col-lg-12">         <div class="panel clearfix">             <div class="panel-heading">                 首页轮播                 <span class="tools pull-right">                         <a class="fa fa-times" href="javascript:;"></a>                 </span>             </div>             <div class="panel-body">                 <div class="col-sm-7">                     <div class="m-form " style="margin-right:20px;">                         <form class="form-horizontal" id="subject_form">                             <input type="hidden" name="ad_id" value="" >                             <div class="form-group">                                 <label for="subject_logo" class="col-sm-3 control-label" >图片</label>                                 <div class="col-sm-9 input-group">                                     <input type="text" class="form-control" name="image_url" placeholder="可以填链接也可以上传">                                     <span class="input-group-btn">                                         <button class="btn btn-primary js-upload"  type="button" >上传图片</button>                                      </span>                                 </div>                             </div>                             <div class="form-group hide">                                 <label  class="col-sm-3 control-label" >上下线状态</label>                                 <div class="col-sm-4  control-label" style="text-align:left;">                                     <label for="status_1_0">                                     下线                                     <input type="radio" value="0" name ="status_0" id="status_1_0">                                     </label>                                     <label for="statis_1_1" style="margin-left:20px;">                                     上线                                     <input type="radio" value="1" name ="status_0" id="status_1_1">                                     </label>                                 </div>                             </div>                             <div class="form-group">                                 <div class="col-sm-3 control-label" >类型</div>                                 <div class="col-sm-2 control-label" style="text-align:left;">                                     <select class="js-type" data-not-init="true">                                         <option value="2">专题</option>                                         <option value="0">产品</option>                                         <option value="1" >商铺</option>                                     </select>                                     </div>                                 <div class="col-sm-5 control-label" style="text-align:left;">                                     <ul class="nav nav-pills nav-stacked">                                         <li> ID:<input type="text" value="" name="id" ></li>                                     </ul>                                     </div>                             </div>                             <div class="form-group hide">                                 <div  class="col-sm-3 control-label" >备注：</div>                                 <div class="col-sm-9 input-group">                                     <input type="text" class="form-control" name="text">                                 </div>                             </div>                         </form>                     </div>                    </div>                  <div class="col-sm-5">                      <div class="img-wrap js-imgbox">                      </div>                  </div>                 </div>         </div>     </div> </div>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['home_ad_item.tmpl'];