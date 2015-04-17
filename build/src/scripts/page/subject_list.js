var SearchBox = require("./operation/subject_search_box.js");
var http = require("../mod/http.js");
var _ = require("../lib/lodash.compat.min.js");
$(function(){
    $("#operation-nav").addClass("active");
    $("#op-subject-ls").addClass("active");
    var search = new SearchBox();
    search.init();
    search.search();
});
