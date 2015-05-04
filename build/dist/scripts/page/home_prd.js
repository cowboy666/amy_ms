(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var docCookie = (function(undefined) {
  /*\
  |*|
  |*|  :: cookies.js ::
  |*|
  |*|  A complete cookies reader/writer framework with full unicode support.
  |*|
  |*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
  |*|
  |*|  This framework is released under the GNU Public License, version 3 or later.
  |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
  |*|
  |*|  Syntaxes:
  |*|
  |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
  |*|  * docCookies.getItem(name)
  |*|  * docCookies.removeItem(name[, path], domain)
  |*|  * docCookies.hasItem(name)
  |*|  * docCookies.keys()
  |*|
  \*/

  var docCookies = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },


    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };
  return docCookies;
})();
module.exports =  docCookie;


},{}],2:[function(require,module,exports){
var $ = require("./jquery");
var render = function(dom,now, total, limit) {
	var max = Math.ceil(total / limit);
	var pager = {
		now: now,
		max: max
	};
	var pages = create(pager);
	render_html(dom,pages, pager);
}

var render_html = function(dom,pages, pagger) {
	/** 分页**/
	var now = pagger.now;
	var html = ['<div class="pages">'];
	for (var i = 0, l = pages.length; i < l; i++) {
		if (typeof pages[i] === "number") {
			if (pages[i] == now) {
				html.push('<em ><span>' + now + '</span></em>');
			} else {
				html.push('<a class="pg-item js-pn" pg="' + pages[i] + '" href="#"><span>' + pages[i] + '</span></a>');
			}
		} else if (typeof pages[i] === "string") {
			html.push("<span >...</span>");
		}
	}

	if (pagger.now < pagger.max) {
		html.push('<a class="pg-item page-next js-p-next" href="#" title="下一页">下一页</a>');
	}
	if (pagger.now > 1) {
		html.splice(1, 0, '<a class="pg-item page-prev js-p-prev" href="#" title="上一页">上一页</a> ');
	}
	html.push("</div>");
	dom.html(html.join(""));
}

function create(pagger) {
	var max = pagger.max,
	now = pagger.now;
	var f_offset = 2; //偏移量
	var l_r_limit = 5;
	var pages = [];
	var gap = "...";
	var rs = [],
	ls = [],
	lv,
	rv,
	maxed = false,
	mined = false;
	lv = rv = now;

	if (1 == max) {
		return [1];
	}
	if (l_r_limit >= max) {
		var pages = [];
		for (var i = 1; i <= max; i++) {
			pages.push(i);
		}
		return pages;
	}
	for (var i = 0; i < f_offset; i++) {
		if (++rv >= max) {
			if (!maxed) {
				rs.push(max);
				maxed = true;
			}
		} else {
			rs.push(rv);
		}
		if (--lv <= 1) {
			if (!mined) {
				ls.splice(0, 0, 1);
				mined = true;
			}
		} else {
			ls.splice(0, 0, lv);
		}

	}

	var pages = ls.concat([now]).concat(rs);
	if (!maxed) {
		if (pages[pages.length - 1] < max - 1) {
			pages.push(gap);
		}
		pages.push(max);
	} else {
		if (l_r_limit > max) {
			pages = [];
			for (var i = 1; i <= max; i++) {
				pages.push(i);
			}
		} else {
			pages = [];
			for (var i = max; i > max - l_r_limit; i--) {
				pages.splice(0, 0, i);
			}
			if (1 < max - l_r_limit) {
				pages.splice(0, 0, gap);
			}
			pages.splice(0, 0, 1);
			return pages;
		}

	}

	if (!mined) {
		if (pages[0] > 2) {
			pages = [1, gap].concat(pages);
		} else {
			pages.splice(0, 0, 1);
		}
	} else {
		if (l_r_limit >= max) {
			pages = [];
			for (var i = 1; i <= max; i++) {
				pages.push(i);
			}
		} else {
			pages = [];
			for (var i = 1; i <= l_r_limit; i++) {
				pages.push(i);
			}
			if (l_r_limit < max - 1) {
				pages.push(gap);
			}
			pages.push(max);
		}

	}

	return pages;
};

module.exports = {
    render : render
};

},{"./jquery":3}],3:[function(require,module,exports){
var $ = window.jQuery;
module.exports = $;

},{}],4:[function(require,module,exports){
(function (global){
/*
    ********** Juicer **********
    ${A Fast template engine}
    Project Home: http://juicer.name

    Author: Guokai
    Gtalk: badkaikai@gmail.com
    Blog: http://benben.cc
    Licence: MIT License
    Version: 0.6.8-stable
*/

(function() {

    // This is the main function for not only compiling but also rendering.
    // there's at least two parameters need to be provided, one is the tpl, 
    // another is the data, the tpl can either be a string, or an id like #id.
    // if only tpl was given, it'll return the compiled reusable function.
    // if tpl and data were given at the same time, it'll return the rendered 
    // result immediately.

    var juicer = function() {
        var args = [].slice.call(arguments);

        args.push(juicer.options);

        if(args[0].match(/^\s*#([\w:\-\.]+)\s*$/igm)) {
            args[0].replace(/^\s*#([\w:\-\.]+)\s*$/igm, function($, $id) {
                var _document = document;
                var elem = _document && _document.getElementById($id);
                args[0] = elem ? (elem.value || elem.innerHTML) : $;
            });
        }

        if(typeof(document) !== 'undefined' && document.body) {
            juicer.compile.call(juicer, document.body.innerHTML);
        }

        if(arguments.length == 1) {
            return juicer.compile.apply(juicer, args);
        }

        if(arguments.length >= 2) {
            return juicer.to_html.apply(juicer, args);
        }
    };

    var __escapehtml = {
        escapehash: {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2f;'
        },
        escapereplace: function(k) {
            return __escapehtml.escapehash[k];
        },
        escaping: function(str) {
            return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm, this.escapereplace);
        },
        detection: function(data) {
            return typeof(data) === 'undefined' ? '' : data;
        }
    };

    var __throw = function(error) {
        if(typeof(console) !== 'undefined') {
            if(console.warn) {
                console.warn(error);
                return;
            }

            if(console.log) {
                console.log(error);
                return;
            }
        }

        throw(error);
    };

    var __creator = function(o, proto) {
        o = o !== Object(o) ? {} : o;

        if(o.__proto__) {
            o.__proto__ = proto;
            return o;
        }

        var empty = function() {};
        var n = Object.create ? 
            Object.create(proto) : 
            new(empty.prototype = proto, empty);

        for(var i in o) {
            if(o.hasOwnProperty(i)) {
                n[i] = o[i];
            }
        }

        return n;
    };

    var annotate = function(fn) {
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var FN_BODY = /^function[^{]+{([\s\S]*)}/m;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var args = [],
            fnText,
            fnBody,
            argDecl;

        if (typeof fn === 'function') {
            if (fn.length) {
                fnText = fn.toString();
            }
        } else if(typeof fn === 'string') {
            fnText = fn;
        }

        fnText = fnText.replace(STRIP_COMMENTS, '');
        fnText = fnText.trim();
        argDecl = fnText.match(FN_ARGS);
        fnBody = fnText.match(FN_BODY)[1].trim();

        for(var i = 0; i < argDecl[1].split(FN_ARG_SPLIT).length; i++) {
            var arg = argDecl[1].split(FN_ARG_SPLIT)[i];
            arg.replace(FN_ARG, function(all, underscore, name) {
                args.push(name);
            });
        }

        return [args, fnBody];
    };

    juicer.__cache = {};
    juicer.version = '0.6.8-stable';
    juicer.settings = {};

    juicer.tags = {
        operationOpen: '{@',
        operationClose: '}',
        interpolateOpen: '\\${',
        interpolateClose: '}',
        noneencodeOpen: '\\$\\${',
        noneencodeClose: '}',
        commentOpen: '\\{#',
        commentClose: '\\}'
    };

    juicer.options = {
        cache: true,
        strip: true,
        errorhandling: true,
        detection: true,
        _method: __creator({
            __escapehtml: __escapehtml,
            __throw: __throw,
            __juicer: juicer
        }, {})
    };

    juicer.tagInit = function() {
        var forstart = juicer.tags.operationOpen + 'each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?' + juicer.tags.operationClose;
        var forend = juicer.tags.operationOpen + '\\/each' + juicer.tags.operationClose;
        var ifstart = juicer.tags.operationOpen + 'if\\s*([^}]*?)' + juicer.tags.operationClose;
        var ifend = juicer.tags.operationOpen + '\\/if' + juicer.tags.operationClose;
        var elsestart = juicer.tags.operationOpen + 'else' + juicer.tags.operationClose;
        var elseifstart = juicer.tags.operationOpen + 'else if\\s*([^}]*?)' + juicer.tags.operationClose;
        var interpolate = juicer.tags.interpolateOpen + '([\\s\\S]+?)' + juicer.tags.interpolateClose;
        var noneencode = juicer.tags.noneencodeOpen + '([\\s\\S]+?)' + juicer.tags.noneencodeClose;
        var inlinecomment = juicer.tags.commentOpen + '[^}]*?' + juicer.tags.commentClose;
        var rangestart = juicer.tags.operationOpen + 'each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)' + juicer.tags.operationClose;
        var include = juicer.tags.operationOpen + 'include\\s*([^}]*?)\\s*,\\s*([^}]*?)' + juicer.tags.operationClose;
        var helperRegisterStart = juicer.tags.operationOpen + 'helper\\s*([^}]*?)\\s*' + juicer.tags.operationClose;
        var helperRegisterBody = '([\\s\\S]*?)';
        var helperRegisterEnd = juicer.tags.operationOpen + '\\/helper' + juicer.tags.operationClose;

        juicer.settings.forstart = new RegExp(forstart, 'igm');
        juicer.settings.forend = new RegExp(forend, 'igm');
        juicer.settings.ifstart = new RegExp(ifstart, 'igm');
        juicer.settings.ifend = new RegExp(ifend, 'igm');
        juicer.settings.elsestart = new RegExp(elsestart, 'igm');
        juicer.settings.elseifstart = new RegExp(elseifstart, 'igm');
        juicer.settings.interpolate = new RegExp(interpolate, 'igm');
        juicer.settings.noneencode = new RegExp(noneencode, 'igm');
        juicer.settings.inlinecomment = new RegExp(inlinecomment, 'igm');
        juicer.settings.rangestart = new RegExp(rangestart, 'igm');
        juicer.settings.include = new RegExp(include, 'igm');
        juicer.settings.helperRegister = new RegExp(helperRegisterStart + helperRegisterBody + helperRegisterEnd, 'igm');
    };

    juicer.tagInit();

    // Using this method to set the options by given conf-name and conf-value,
    // you can also provide more than one key-value pair wrapped by an object.
    // this interface also used to custom the template tag delimater, for this
    // situation, the conf-name must begin with tag::, for example: juicer.set
    // ('tag::operationOpen', '{@').

    juicer.set = function(conf, value) {
        var that = this;

        var escapePattern = function(v) {
            return v.replace(/[\$\(\)\[\]\+\^\{\}\?\*\|\.]/igm, function($) {
                return '\\' + $;
            });
        };

        var set = function(conf, value) {
            var tag = conf.match(/^tag::(.*)$/i);

            if(tag) {
                that.tags[tag[1]] = escapePattern(value);
                that.tagInit();
                return;
            }

            that.options[conf] = value;
        };

        if(arguments.length === 2) {
            set(conf, value);
            return;
        }

        if(conf === Object(conf)) {
            for(var i in conf) {
                if(conf.hasOwnProperty(i)) {
                    set(i, conf[i]);
                }
            }
        }
    };

    // Before you're using custom functions in your template like ${name | fnName},
    // you need to register this fn by juicer.register('fnName', fn).

    juicer.register = function(fname, fn) {
        var _method = this.options._method;

        if(_method.hasOwnProperty(fname)) {
            return false;
        }

        return _method[fname] = fn;
    };

    // remove the registered function in the memory by the provided function name.
    // for example: juicer.unregister('fnName').

    juicer.unregister = function(fname) {
        var _method = this.options._method;

        if(_method.hasOwnProperty(fname)) {
            return delete _method[fname];
        }
    };

    juicer.template = function(options) {
        var that = this;

        this.options = options;

        this.__interpolate = function(_name, _escape, options) {
            var _define = _name.split('|'), _fn = _define[0] || '', _cluster;

            if(_define.length > 1) {
                _name = _define.shift();
                _cluster = _define.shift().split(',');
                _fn = '_method.' + _cluster.shift() + '.call({}, ' + [_name].concat(_cluster) + ')';
            }

            return '<%= ' + (_escape ? '_method.__escapehtml.escaping' : '') + '(' +
                        (!options || options.detection !== false ? '_method.__escapehtml.detection' : '') + '(' +
                            _fn +
                        ')' +
                    ')' +
                ' %>';
        };

        this.__removeShell = function(tpl, options) {
            var _counter = 0;

            tpl = tpl
                // inline helper register
                .replace(juicer.settings.helperRegister, function($, helperName, fnText) {
                    var anno = annotate(fnText);
                    var fnArgs = anno[0];
                    var fnBody = anno[1];
                    var fn = new Function(fnArgs.join(','), fnBody);

                    juicer.register(helperName, fn);
                    return $;
                })

                // for expression
                .replace(juicer.settings.forstart, function($, _name, alias, key) {
                    var alias = alias || 'value', key = key && key.substr(1);
                    var _iterate = 'i' + _counter++;
                    return '<% ~function() {' +
                                'for(var ' + _iterate + ' in ' + _name + ') {' +
                                    'if(' + _name + '.hasOwnProperty(' + _iterate + ')) {' +
                                        'var ' + alias + '=' + _name + '[' + _iterate + '];' +
                                        (key ? ('var ' + key + '=' + _iterate + ';') : '') +
                            ' %>';
                })
                .replace(juicer.settings.forend, '<% }}}(); %>')

                // if expression
                .replace(juicer.settings.ifstart, function($, condition) {
                    return '<% if(' + condition + ') { %>';
                })
                .replace(juicer.settings.ifend, '<% } %>')

                // else expression
                .replace(juicer.settings.elsestart, function($) {
                    return '<% } else { %>';
                })

                // else if expression
                .replace(juicer.settings.elseifstart, function($, condition) {
                    return '<% } else if(' + condition + ') { %>';
                })

                // interpolate without escape
                .replace(juicer.settings.noneencode, function($, _name) {
                    return that.__interpolate(_name, false, options);
                })

                // interpolate with escape
                .replace(juicer.settings.interpolate, function($, _name) {
                    return that.__interpolate(_name, true, options);
                })

                // clean up comments
                .replace(juicer.settings.inlinecomment, '')

                // range expression
                .replace(juicer.settings.rangestart, function($, _name, start, end) {
                    var _iterate = 'j' + _counter++;
                    return '<% ~function() {' +
                                'for(var ' + _iterate + '=' + start + ';' + _iterate + '<' + end + ';' + _iterate + '++) {{' +
                                    'var ' + _name + '=' + _iterate + ';' +
                            ' %>';
                })

                // include sub-template
                .replace(juicer.settings.include, function($, tpl, data) {
                    // compatible for node.js
                    if(tpl.match(/^file\:\/\//igm)) return $;
                    return '<%= _method.__juicer(' + tpl + ', ' + data + '); %>';
                });

            // exception handling
            if(!options || options.errorhandling !== false) {
                tpl = '<% try { %>' + tpl;
                tpl += '<% } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} %>';
            }

            return tpl;
        };

        this.__toNative = function(tpl, options) {
            return this.__convert(tpl, !options || options.strip);
        };

        this.__lexicalAnalyze = function(tpl) {
            var buffer = [];
            var method = [];
            var prefix = '';
            var reserved = [
                'if', 'each', '_', '_method', 'console', 
                'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 
                'finally', 'for', 'function', 'in', 'instanceof', 'new', 'return', 'switch', 
                'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'typeof', 
                'class', 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface', 
                'let', 'package', 'private', 'protected', 'public', 'static', 'yield', 'const', 'arguments', 
                'true', 'false', 'undefined', 'NaN'
            ];

            var indexOf = function(array, item) {
                if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) {
                    return array.indexOf(item);
                }

                for(var i=0; i < array.length; i++) {
                    if(array[i] === item) return i;
                }

                return -1;
            };

            var variableAnalyze = function($, statement) {
                statement = statement.match(/\w+/igm)[0];

                if(indexOf(buffer, statement) === -1 && indexOf(reserved, statement) === -1 && indexOf(method, statement) === -1) {

                    // avoid re-declare native function, if not do this, template 
                    // `{@if encodeURIComponent(name)}` could be throw undefined.

                    if(typeof(window) !== 'undefined' && typeof(window[statement]) === 'function' && window[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // compatible for node.js
                    if(typeof(global) !== 'undefined' && typeof(global[statement]) === 'function' && global[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // avoid re-declare registered function, if not do this, template 
                    // `{@if registered_func(name)}` could be throw undefined.

                    if(typeof(juicer.options._method[statement]) === 'function' || juicer.options._method.hasOwnProperty(statement)) {
                        method.push(statement);
                        return $;
                    }

                    buffer.push(statement); // fuck ie
                }

                return $;
            };

            tpl.replace(juicer.settings.forstart, variableAnalyze).
                replace(juicer.settings.interpolate, variableAnalyze).
                replace(juicer.settings.ifstart, variableAnalyze).
                replace(juicer.settings.elseifstart, variableAnalyze).
                replace(juicer.settings.include, variableAnalyze).
                replace(/[\+\-\*\/%!\?\|\^&~<>=,\(\)\[\]]\s*([A-Za-z_]+)/igm, variableAnalyze);

            for(var i = 0;i < buffer.length; i++) {
                prefix += 'var ' + buffer[i] + '=_.' + buffer[i] + ';';
            }

            for(var i = 0;i < method.length; i++) {
                prefix += 'var ' + method[i] + '=_method.' + method[i] + ';';
            }

            return '<% ' + prefix + ' %>';
        };

        this.__convert=function(tpl, strip) {
            var buffer = [].join('');

            buffer += "'use strict';"; // use strict mode
            buffer += "var _=_||{};";
            buffer += "var _out='';_out+='";

            if(strip !== false) {
                buffer += tpl
                    .replace(/\\/g, "\\\\")
                    .replace(/[\r\t\n]/g, " ")
                    .replace(/'(?=[^%]*%>)/g, "\t")
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                    .split("<%").join("';")
                    .split("%>").join("_out+='")+
                    "';return _out;";

                return buffer;
            }

            buffer += tpl
                    .replace(/\\/g, "\\\\")
                    .replace(/[\r]/g, "\\r")
                    .replace(/[\t]/g, "\\t")
                    .replace(/[\n]/g, "\\n")
                    .replace(/'(?=[^%]*%>)/g, "\t")
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                    .split("<%").join("';")
                    .split("%>").join("_out+='")+
                    "';return _out.replace(/[\\r\\n]\\s+[\\r\\n]/g, '\\r\\n');";

            return buffer;
        };

        this.parse = function(tpl, options) {
            var _that = this;

            if(!options || options.loose !== false) {
                tpl = this.__lexicalAnalyze(tpl) + tpl;
            }

            tpl = this.__removeShell(tpl, options);
            tpl = this.__toNative(tpl, options);

            this._render = new Function('_, _method', tpl);

            this.render = function(_, _method) {
                if(!_method || _method !== that.options._method) {
                    _method = __creator(_method, that.options._method);
                }

                return _that._render.call(this, _, _method);
            };

            return this;
        };
    };

    juicer.compile = function(tpl, options) {
        if(!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        try {
            var engine = this.__cache[tpl] ? 
                this.__cache[tpl] : 
                new this.template(this.options).parse(tpl, options);

            if(!options || options.cache !== false) {
                this.__cache[tpl] = engine;
            }

            return engine;

        } catch(e) {
            __throw('Juicer Compile Exception: ' + e.message);

            return {
                render: function() {} // noop
            };
        }
    };

    juicer.to_html = function(tpl, data, options) {
        if(!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        return this.compile(tpl, options).render(data, options._method);
    };
    window.juicer = juicer;
    typeof(module) !== 'undefined' && module.exports ? module.exports = juicer : this.juicer = juicer;

})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) lodash.com/license | Underscore.js 1.5.2 underscorejs.org/LICENSE
 * Build: `lodash -o ./dist/lodash.compat.js`
 */
;(function(){function n(n,t,e){e=(e||0)-1;for(var r=n?n.length:0;++e<r;)if(n[e]===t)return e;return-1}function t(t,e){var r=typeof e;if(t=t.l,"boolean"==r||null==e)return t[e]?0:-1;"number"!=r&&"string"!=r&&(r="object");var u="number"==r?e:b+e;return t=(t=t[r])&&t[u],"object"==r?t&&-1<n(t,e)?0:-1:t?0:-1}function e(n){var t=this.l,e=typeof n;if("boolean"==e||null==n)t[n]=true;else{"number"!=e&&"string"!=e&&(e="object");var r="number"==e?n:b+n,t=t[e]||(t[e]={});"object"==e?(t[r]||(t[r]=[])).push(n):t[r]=true
}}function r(n){return n.charCodeAt(0)}function u(n,t){for(var e=n.m,r=t.m,u=-1,o=e.length;++u<o;){var a=e[u],i=r[u];if(a!==i){if(a>i||typeof a=="undefined")return 1;if(a<i||typeof i=="undefined")return-1}}return n.n-t.n}function o(n){var t=-1,r=n.length,u=n[0],o=n[r/2|0],a=n[r-1];if(u&&typeof u=="object"&&o&&typeof o=="object"&&a&&typeof a=="object")return false;for(u=l(),u["false"]=u["null"]=u["true"]=u.undefined=false,o=l(),o.k=n,o.l=u,o.push=e;++t<r;)o.push(n[t]);return o}function a(n){return"\\"+Y[n]
}function i(){return v.pop()||[]}function l(){return y.pop()||{k:null,l:null,m:null,"false":false,n:0,"null":false,number:null,object:null,push:null,string:null,"true":false,undefined:false,o:null}}function f(n){return typeof n.toString!="function"&&typeof(n+"")=="string"}function c(n){n.length=0,v.length<w&&v.push(n)}function p(n){var t=n.l;t&&p(t),n.k=n.l=n.m=n.object=n.number=n.string=n.o=null,y.length<w&&y.push(n)}function s(n,t,e){t||(t=0),typeof e=="undefined"&&(e=n?n.length:0);var r=-1;e=e-t||0;for(var u=Array(0>e?0:e);++r<e;)u[r]=n[t+r];
return u}function g(e){function v(n){return n&&typeof n=="object"&&!qe(n)&&we.call(n,"__wrapped__")?n:new y(n)}function y(n,t){this.__chain__=!!t,this.__wrapped__=n}function w(n){function t(){if(r){var n=s(r);je.apply(n,arguments)}if(this instanceof t){var o=nt(e.prototype),n=e.apply(o,n||arguments);return xt(n)?n:o}return e.apply(u,n||arguments)}var e=n[0],r=n[2],u=n[4];return ze(t,n),t}function Y(n,t,e,r,u){if(e){var o=e(n);if(typeof o!="undefined")return o}if(!xt(n))return n;var a=he.call(n);if(!V[a]||!Le.nodeClass&&f(n))return n;
var l=Te[a];switch(a){case L:case z:return new l(+n);case W:case M:return new l(n);case J:return o=l(n.source,S.exec(n)),o.lastIndex=n.lastIndex,o}if(a=qe(n),t){var p=!r;r||(r=i()),u||(u=i());for(var g=r.length;g--;)if(r[g]==n)return u[g];o=a?l(n.length):{}}else o=a?s(n):Ye({},n);return a&&(we.call(n,"index")&&(o.index=n.index),we.call(n,"input")&&(o.input=n.input)),t?(r.push(n),u.push(o),(a?Xe:tr)(n,function(n,a){o[a]=Y(n,t,e,r,u)}),p&&(c(r),c(u)),o):o}function nt(n){return xt(n)?Se(n):{}}function tt(n,t,e){if(typeof n!="function")return Ht;
if(typeof t=="undefined"||!("prototype"in n))return n;var r=n.__bindData__;if(typeof r=="undefined"&&(Le.funcNames&&(r=!n.name),r=r||!Le.funcDecomp,!r)){var u=be.call(n);Le.funcNames||(r=!A.test(u)),r||(r=B.test(u),ze(n,r))}if(false===r||true!==r&&1&r[1])return n;switch(e){case 1:return function(e){return n.call(t,e)};case 2:return function(e,r){return n.call(t,e,r)};case 3:return function(e,r,u){return n.call(t,e,r,u)};case 4:return function(e,r,u,o){return n.call(t,e,r,u,o)}}return Mt(n,t)}function et(n){function t(){var n=l?a:this;
if(u){var h=s(u);je.apply(h,arguments)}return(o||c)&&(h||(h=s(arguments)),o&&je.apply(h,o),c&&h.length<i)?(r|=16,et([e,p?r:-4&r,h,null,a,i])):(h||(h=arguments),f&&(e=n[g]),this instanceof t?(n=nt(e.prototype),h=e.apply(n,h),xt(h)?h:n):e.apply(n,h))}var e=n[0],r=n[1],u=n[2],o=n[3],a=n[4],i=n[5],l=1&r,f=2&r,c=4&r,p=8&r,g=e;return ze(t,n),t}function rt(e,r){var u=-1,a=ht(),i=e?e.length:0,l=i>=_&&a===n,f=[];if(l){var c=o(r);c?(a=t,r=c):l=false}for(;++u<i;)c=e[u],0>a(r,c)&&f.push(c);return l&&p(r),f}function ot(n,t,e,r){r=(r||0)-1;
for(var u=n?n.length:0,o=[];++r<u;){var a=n[r];if(a&&typeof a=="object"&&typeof a.length=="number"&&(qe(a)||dt(a))){t||(a=ot(a,t,e));var i=-1,l=a.length,f=o.length;for(o.length+=l;++i<l;)o[f++]=a[i]}else e||o.push(a)}return o}function at(n,t,e,r,u,o){if(e){var a=e(n,t);if(typeof a!="undefined")return!!a}if(n===t)return 0!==n||1/n==1/t;if(n===n&&!(n&&X[typeof n]||t&&X[typeof t]))return false;if(null==n||null==t)return n===t;var l=he.call(n),p=he.call(t);if(l==T&&(l=G),p==T&&(p=G),l!=p)return false;switch(l){case L:case z:return+n==+t;
case W:return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case J:case M:return n==ie(t)}if(p=l==$,!p){var s=we.call(n,"__wrapped__"),g=we.call(t,"__wrapped__");if(s||g)return at(s?n.__wrapped__:n,g?t.__wrapped__:t,e,r,u,o);if(l!=G||!Le.nodeClass&&(f(n)||f(t)))return false;if(l=!Le.argsObject&&dt(n)?oe:n.constructor,s=!Le.argsObject&&dt(t)?oe:t.constructor,l!=s&&!(jt(l)&&l instanceof l&&jt(s)&&s instanceof s)&&"constructor"in n&&"constructor"in t)return false}for(l=!u,u||(u=i()),o||(o=i()),s=u.length;s--;)if(u[s]==n)return o[s]==t;
var h=0,a=true;if(u.push(n),o.push(t),p){if(s=n.length,h=t.length,(a=h==s)||r)for(;h--;)if(p=s,g=t[h],r)for(;p--&&!(a=at(n[p],g,e,r,u,o)););else if(!(a=at(n[h],g,e,r,u,o)))break}else nr(t,function(t,i,l){return we.call(l,i)?(h++,a=we.call(n,i)&&at(n[i],t,e,r,u,o)):void 0}),a&&!r&&nr(n,function(n,t,e){return we.call(e,t)?a=-1<--h:void 0});return u.pop(),o.pop(),l&&(c(u),c(o)),a}function it(n,t,e,r,u){(qe(t)?Dt:tr)(t,function(t,o){var a,i,l=t,f=n[o];if(t&&((i=qe(t))||er(t))){for(l=r.length;l--;)if(a=r[l]==t){f=u[l];
break}if(!a){var c;e&&(l=e(f,t),c=typeof l!="undefined")&&(f=l),c||(f=i?qe(f)?f:[]:er(f)?f:{}),r.push(t),u.push(f),c||it(f,t,e,r,u)}}else e&&(l=e(f,t),typeof l=="undefined"&&(l=t)),typeof l!="undefined"&&(f=l);n[o]=f})}function lt(n,t){return n+de(Fe()*(t-n+1))}function ft(e,r,u){var a=-1,l=ht(),f=e?e.length:0,s=[],g=!r&&f>=_&&l===n,h=u||g?i():s;for(g&&(h=o(h),l=t);++a<f;){var v=e[a],y=u?u(v,a,e):v;(r?!a||h[h.length-1]!==y:0>l(h,y))&&((u||g)&&h.push(y),s.push(v))}return g?(c(h.k),p(h)):u&&c(h),s}function ct(n){return function(t,e,r){var u={};
if(e=v.createCallback(e,r,3),qe(t)){r=-1;for(var o=t.length;++r<o;){var a=t[r];n(u,a,e(a,r,t),t)}}else Xe(t,function(t,r,o){n(u,t,e(t,r,o),o)});return u}}function pt(n,t,e,r,u,o){var a=1&t,i=4&t,l=16&t,f=32&t;if(!(2&t||jt(n)))throw new le;l&&!e.length&&(t&=-17,l=e=false),f&&!r.length&&(t&=-33,f=r=false);var c=n&&n.__bindData__;return c&&true!==c?(c=s(c),c[2]&&(c[2]=s(c[2])),c[3]&&(c[3]=s(c[3])),!a||1&c[1]||(c[4]=u),!a&&1&c[1]&&(t|=8),!i||4&c[1]||(c[5]=o),l&&je.apply(c[2]||(c[2]=[]),e),f&&Ee.apply(c[3]||(c[3]=[]),r),c[1]|=t,pt.apply(null,c)):(1==t||17===t?w:et)([n,t,e,r,u,o])
}function st(){Q.h=F,Q.b=Q.c=Q.g=Q.i="",Q.e="t",Q.j=true;for(var n,t=0;n=arguments[t];t++)for(var e in n)Q[e]=n[e];t=Q.a,Q.d=/^[^,]+/.exec(t)[0],n=ee,t="return function("+t+"){",e=Q;var r="var n,t="+e.d+",E="+e.e+";if(!t)return E;"+e.i+";";e.b?(r+="var u=t.length;n=-1;if("+e.b+"){",Le.unindexedChars&&(r+="if(s(t)){t=t.split('')}"),r+="while(++n<u){"+e.g+";}}else{"):Le.nonEnumArgs&&(r+="var u=t.length;n=-1;if(u&&p(t)){while(++n<u){n+='';"+e.g+";}}else{"),Le.enumPrototypes&&(r+="var G=typeof t=='function';"),Le.enumErrorProps&&(r+="var F=t===k||t instanceof Error;");
var u=[];if(Le.enumPrototypes&&u.push('!(G&&n=="prototype")'),Le.enumErrorProps&&u.push('!(F&&(n=="message"||n=="name"))'),e.j&&e.f)r+="var C=-1,D=B[typeof t]&&v(t),u=D?D.length:0;while(++C<u){n=D[C];",u.length&&(r+="if("+u.join("&&")+"){"),r+=e.g+";",u.length&&(r+="}"),r+="}";else if(r+="for(n in t){",e.j&&u.push("m.call(t, n)"),u.length&&(r+="if("+u.join("&&")+"){"),r+=e.g+";",u.length&&(r+="}"),r+="}",Le.nonEnumShadows){for(r+="if(t!==A){var i=t.constructor,r=t===(i&&i.prototype),f=t===J?I:t===k?j:L.call(t),x=y[f];",k=0;7>k;k++)r+="n='"+e.h[k]+"';if((!(r&&x[n])&&m.call(t,n))",e.j||(r+="||(!x[n]&&t[n]!==A[n])"),r+="){"+e.g+"}";
r+="}"}return(e.b||Le.nonEnumArgs)&&(r+="}"),r+=e.c+";return E",n("d,j,k,m,o,p,q,s,v,A,B,y,I,J,L",t+r+"}")(tt,q,ce,we,d,dt,qe,kt,Q.f,pe,X,$e,M,se,he)}function gt(n){return Ve[n]}function ht(){var t=(t=v.indexOf)===zt?n:t;return t}function vt(n){return typeof n=="function"&&ve.test(n)}function yt(n){var t,e;return!n||he.call(n)!=G||(t=n.constructor,jt(t)&&!(t instanceof t))||!Le.argsClass&&dt(n)||!Le.nodeClass&&f(n)?false:Le.ownLast?(nr(n,function(n,t,r){return e=we.call(r,t),false}),false!==e):(nr(n,function(n,t){e=t
}),typeof e=="undefined"||we.call(n,e))}function mt(n){return He[n]}function dt(n){return n&&typeof n=="object"&&typeof n.length=="number"&&he.call(n)==T||false}function bt(n,t,e){var r=We(n),u=r.length;for(t=tt(t,e,3);u--&&(e=r[u],false!==t(n[e],e,n)););return n}function _t(n){var t=[];return nr(n,function(n,e){jt(n)&&t.push(e)}),t.sort()}function wt(n){for(var t=-1,e=We(n),r=e.length,u={};++t<r;){var o=e[t];u[n[o]]=o}return u}function jt(n){return typeof n=="function"}function xt(n){return!(!n||!X[typeof n])
}function Ct(n){return typeof n=="number"||n&&typeof n=="object"&&he.call(n)==W||false}function kt(n){return typeof n=="string"||n&&typeof n=="object"&&he.call(n)==M||false}function Et(n){for(var t=-1,e=We(n),r=e.length,u=Zt(r);++t<r;)u[t]=n[e[t]];return u}function Ot(n,t,e){var r=-1,u=ht(),o=n?n.length:0,a=false;return e=(0>e?Be(0,o+e):e)||0,qe(n)?a=-1<u(n,t,e):typeof o=="number"?a=-1<(kt(n)?n.indexOf(t,e):u(n,t,e)):Xe(n,function(n){return++r<e?void 0:!(a=n===t)}),a}function St(n,t,e){var r=true;if(t=v.createCallback(t,e,3),qe(n)){e=-1;
for(var u=n.length;++e<u&&(r=!!t(n[e],e,n)););}else Xe(n,function(n,e,u){return r=!!t(n,e,u)});return r}function At(n,t,e){var r=[];if(t=v.createCallback(t,e,3),qe(n)){e=-1;for(var u=n.length;++e<u;){var o=n[e];t(o,e,n)&&r.push(o)}}else Xe(n,function(n,e,u){t(n,e,u)&&r.push(n)});return r}function It(n,t,e){if(t=v.createCallback(t,e,3),!qe(n)){var r;return Xe(n,function(n,e,u){return t(n,e,u)?(r=n,false):void 0}),r}e=-1;for(var u=n.length;++e<u;){var o=n[e];if(t(o,e,n))return o}}function Dt(n,t,e){if(t&&typeof e=="undefined"&&qe(n)){e=-1;
for(var r=n.length;++e<r&&false!==t(n[e],e,n););}else Xe(n,t,e);return n}function Nt(n,t,e){var r=n,u=n?n.length:0;if(t=t&&typeof e=="undefined"?t:tt(t,e,3),qe(n))for(;u--&&false!==t(n[u],u,n););else{if(typeof u!="number")var o=We(n),u=o.length;else Le.unindexedChars&&kt(n)&&(r=n.split(""));Xe(n,function(n,e,a){return e=o?o[--u]:--u,t(r[e],e,a)})}return n}function Bt(n,t,e){var r=-1,u=n?n.length:0,o=Zt(typeof u=="number"?u:0);if(t=v.createCallback(t,e,3),qe(n))for(;++r<u;)o[r]=t(n[r],r,n);else Xe(n,function(n,e,u){o[++r]=t(n,e,u)
});return o}function Pt(n,t,e){var u=-1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&qe(n)){e=-1;for(var a=n.length;++e<a;){var i=n[e];i>o&&(o=i)}}else t=null==t&&kt(n)?r:v.createCallback(t,e,3),Xe(n,function(n,e,r){e=t(n,e,r),e>u&&(u=e,o=n)});return o}function Rt(n,t,e,r){var u=3>arguments.length;if(t=v.createCallback(t,r,4),qe(n)){var o=-1,a=n.length;for(u&&(e=n[++o]);++o<a;)e=t(e,n[o],o,n)}else Xe(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)});return e}function Ft(n,t,e,r){var u=3>arguments.length;
return t=v.createCallback(t,r,4),Nt(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)}),e}function Tt(n){var t=-1,e=n?n.length:0,r=Zt(typeof e=="number"?e:0);return Dt(n,function(n){var e=lt(0,++t);r[t]=r[e],r[e]=n}),r}function $t(n,t,e){var r;if(t=v.createCallback(t,e,3),qe(n)){e=-1;for(var u=n.length;++e<u&&!(r=t(n[e],e,n)););}else Xe(n,function(n,e,u){return!(r=t(n,e,u))});return!!r}function Lt(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=-1;for(t=v.createCallback(t,e,3);++o<u&&t(n[o],o,n);)r++
}else if(r=t,null==r||e)return n?n[0]:h;return s(n,0,Pe(Be(0,r),u))}function zt(t,e,r){if(typeof r=="number"){var u=t?t.length:0;r=0>r?Be(0,u+r):r||0}else if(r)return r=Kt(t,e),t[r]===e?r:-1;return n(t,e,r)}function qt(n,t,e){if(typeof t!="number"&&null!=t){var r=0,u=-1,o=n?n.length:0;for(t=v.createCallback(t,e,3);++u<o&&t(n[u],u,n);)r++}else r=null==t||e?1:Be(0,t);return s(n,r)}function Kt(n,t,e,r){var u=0,o=n?n.length:u;for(e=e?v.createCallback(e,r,1):Ht,t=e(t);u<o;)r=u+o>>>1,e(n[r])<t?u=r+1:o=r;
return u}function Wt(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(e=v.createCallback(e,r,3)),ft(n,t,e)}function Gt(){for(var n=1<arguments.length?arguments:arguments[0],t=-1,e=n?Pt(ar(n,"length")):0,r=Zt(0>e?0:e);++t<e;)r[t]=ar(n,t);return r}function Jt(n,t){var e=-1,r=n?n.length:0,u={};for(t||!r||qe(n[0])||(t=[]);++e<r;){var o=n[e];t?u[o]=t[e]:o&&(u[o[0]]=o[1])}return u}function Mt(n,t){return 2<arguments.length?pt(n,17,s(arguments,2),null,t):pt(n,1,null,null,t)
}function Vt(n,t,e){var r,u,o,a,i,l,f,c=0,p=false,s=true;if(!jt(n))throw new le;if(t=Be(0,t)||0,true===e)var g=true,s=false;else xt(e)&&(g=e.leading,p="maxWait"in e&&(Be(t,e.maxWait)||0),s="trailing"in e?e.trailing:s);var v=function(){var e=t-(ir()-a);0<e?l=Ce(v,e):(u&&me(u),e=f,u=l=f=h,e&&(c=ir(),o=n.apply(i,r),l||u||(r=i=null)))},y=function(){l&&me(l),u=l=f=h,(s||p!==t)&&(c=ir(),o=n.apply(i,r),l||u||(r=i=null))};return function(){if(r=arguments,a=ir(),i=this,f=s&&(l||!g),false===p)var e=g&&!l;else{u||g||(c=a);
var h=p-(a-c),m=0>=h;m?(u&&(u=me(u)),c=a,o=n.apply(i,r)):u||(u=Ce(y,h))}return m&&l?l=me(l):l||t===p||(l=Ce(v,t)),e&&(m=true,o=n.apply(i,r)),!m||l||u||(r=i=null),o}}function Ht(n){return n}function Ut(n,t,e){var r=true,u=t&&_t(t);t&&(e||u.length)||(null==e&&(e=t),o=y,t=n,n=v,u=_t(t)),false===e?r=false:xt(e)&&"chain"in e&&(r=e.chain);var o=n,a=jt(o);Dt(u,function(e){var u=n[e]=t[e];a&&(o.prototype[e]=function(){var t=this.__chain__,e=this.__wrapped__,a=[e];if(je.apply(a,arguments),a=u.apply(n,a),r||t){if(e===a&&xt(a))return this;
a=new o(a),a.__chain__=t}return a})})}function Qt(){}function Xt(n){return function(t){return t[n]}}function Yt(){return this.__wrapped__}e=e?ut.defaults(Z.Object(),e,ut.pick(Z,R)):Z;var Zt=e.Array,ne=e.Boolean,te=e.Date,ee=e.Function,re=e.Math,ue=e.Number,oe=e.Object,ae=e.RegExp,ie=e.String,le=e.TypeError,fe=[],ce=e.Error.prototype,pe=oe.prototype,se=ie.prototype,ge=e._,he=pe.toString,ve=ae("^"+ie(he).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),ye=re.ceil,me=e.clearTimeout,de=re.floor,be=ee.prototype.toString,_e=vt(_e=oe.getPrototypeOf)&&_e,we=pe.hasOwnProperty,je=fe.push,xe=pe.propertyIsEnumerable,Ce=e.setTimeout,ke=fe.splice,Ee=fe.unshift,Oe=function(){try{var n={},t=vt(t=oe.defineProperty)&&t,e=t(n,n,n)&&t
}catch(r){}return e}(),Se=vt(Se=oe.create)&&Se,Ae=vt(Ae=Zt.isArray)&&Ae,Ie=e.isFinite,De=e.isNaN,Ne=vt(Ne=oe.keys)&&Ne,Be=re.max,Pe=re.min,Re=e.parseInt,Fe=re.random,Te={};Te[$]=Zt,Te[L]=ne,Te[z]=te,Te[K]=ee,Te[G]=oe,Te[W]=ue,Te[J]=ae,Te[M]=ie;var $e={};$e[$]=$e[z]=$e[W]={constructor:true,toLocaleString:true,toString:true,valueOf:true},$e[L]=$e[M]={constructor:true,toString:true,valueOf:true},$e[q]=$e[K]=$e[J]={constructor:true,toString:true},$e[G]={constructor:true},function(){for(var n=F.length;n--;){var t,e=F[n];
for(t in $e)we.call($e,t)&&!we.call($e[t],e)&&($e[t][e]=false)}}(),y.prototype=v.prototype;var Le=v.support={};!function(){var n=function(){this.x=1},t={0:1,length:1},r=[];n.prototype={valueOf:1,y:1};for(var u in new n)r.push(u);for(u in arguments);Le.argsClass=he.call(arguments)==T,Le.argsObject=arguments.constructor==oe&&!(arguments instanceof Zt),Le.enumErrorProps=xe.call(ce,"message")||xe.call(ce,"name"),Le.enumPrototypes=xe.call(n,"prototype"),Le.funcDecomp=!vt(e.WinRTError)&&B.test(g),Le.funcNames=typeof ee.name=="string",Le.nonEnumArgs=0!=u,Le.nonEnumShadows=!/valueOf/.test(r),Le.ownLast="x"!=r[0],Le.spliceObjects=(fe.splice.call(t,0,1),!t[0]),Le.unindexedChars="xx"!="x"[0]+oe("x")[0];
try{Le.nodeClass=!(he.call(document)==G&&!({toString:0}+""))}catch(o){Le.nodeClass=true}}(1),v.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:I,variable:"",imports:{_:v}},Se||(nt=function(){function n(){}return function(t){if(xt(t)){n.prototype=t;var r=new n;n.prototype=null}return r||e.Object()}}());var ze=Oe?function(n,t){U.value=t,Oe(n,"__bindData__",U)}:Qt;Le.argsClass||(dt=function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&we.call(n,"callee")&&!xe.call(n,"callee")||false
});var qe=Ae||function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&he.call(n)==$||false},Ke=st({a:"z",e:"[]",i:"if(!(B[typeof z]))return E",g:"E.push(n)"}),We=Ne?function(n){return xt(n)?Le.enumPrototypes&&typeof n=="function"||Le.nonEnumArgs&&n.length&&dt(n)?Ke(n):Ne(n):[]}:Ke,Ge={a:"g,e,K",i:"e=e&&typeof K=='undefined'?e:d(e,K,3)",b:"typeof u=='number'",v:We,g:"if(e(t[n],n,g)===false)return E"},Je={a:"z,H,l",i:"var a=arguments,b=0,c=typeof l=='number'?2:a.length;while(++b<c){t=a[b];if(t&&B[typeof t]){",v:We,g:"if(typeof E[n]=='undefined')E[n]=t[n]",c:"}}"},Me={i:"if(!B[typeof t])return E;"+Ge.i,b:false},Ve={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},He=wt(Ve),Ue=ae("("+We(He).join("|")+")","g"),Qe=ae("["+We(Ve).join("")+"]","g"),Xe=st(Ge),Ye=st(Je,{i:Je.i.replace(";",";if(c>3&&typeof a[c-2]=='function'){var e=d(a[--c-1],a[c--],2)}else if(c>2&&typeof a[c-1]=='function'){e=a[--c]}"),g:"E[n]=e?e(E[n],t[n]):t[n]"}),Ze=st(Je),nr=st(Ge,Me,{j:false}),tr=st(Ge,Me);
jt(/x/)&&(jt=function(n){return typeof n=="function"&&he.call(n)==K});var er=_e?function(n){if(!n||he.call(n)!=G||!Le.argsClass&&dt(n))return false;var t=n.valueOf,e=vt(t)&&(e=_e(t))&&_e(e);return e?n==e||_e(n)==e:yt(n)}:yt,rr=ct(function(n,t,e){we.call(n,e)?n[e]++:n[e]=1}),ur=ct(function(n,t,e){(we.call(n,e)?n[e]:n[e]=[]).push(t)}),or=ct(function(n,t,e){n[e]=t}),ar=Bt,ir=vt(ir=te.now)&&ir||function(){return(new te).getTime()},lr=8==Re(j+"08")?Re:function(n,t){return Re(kt(n)?n.replace(D,""):n,t||0)};
return v.after=function(n,t){if(!jt(t))throw new le;return function(){return 1>--n?t.apply(this,arguments):void 0}},v.assign=Ye,v.at=function(n){var t=arguments,e=-1,r=ot(t,true,false,1),t=t[2]&&t[2][t[1]]===n?1:r.length,u=Zt(t);for(Le.unindexedChars&&kt(n)&&(n=n.split(""));++e<t;)u[e]=n[r[e]];return u},v.bind=Mt,v.bindAll=function(n){for(var t=1<arguments.length?ot(arguments,true,false,1):_t(n),e=-1,r=t.length;++e<r;){var u=t[e];n[u]=pt(n[u],1,null,null,n)}return n},v.bindKey=function(n,t){return 2<arguments.length?pt(t,19,s(arguments,2),null,n):pt(t,3,null,null,n)
},v.chain=function(n){return n=new y(n),n.__chain__=true,n},v.compact=function(n){for(var t=-1,e=n?n.length:0,r=[];++t<e;){var u=n[t];u&&r.push(u)}return r},v.compose=function(){for(var n=arguments,t=n.length;t--;)if(!jt(n[t]))throw new le;return function(){for(var t=arguments,e=n.length;e--;)t=[n[e].apply(this,t)];return t[0]}},v.constant=function(n){return function(){return n}},v.countBy=rr,v.create=function(n,t){var e=nt(n);return t?Ye(e,t):e},v.createCallback=function(n,t,e){var r=typeof n;if(null==n||"function"==r)return tt(n,t,e);
if("object"!=r)return Xt(n);var u=We(n),o=u[0],a=n[o];return 1!=u.length||a!==a||xt(a)?function(t){for(var e=u.length,r=false;e--&&(r=at(t[u[e]],n[u[e]],null,true)););return r}:function(n){return n=n[o],a===n&&(0!==a||1/a==1/n)}},v.curry=function(n,t){return t=typeof t=="number"?t:+t||n.length,pt(n,4,null,null,null,t)},v.debounce=Vt,v.defaults=Ze,v.defer=function(n){if(!jt(n))throw new le;var t=s(arguments,1);return Ce(function(){n.apply(h,t)},1)},v.delay=function(n,t){if(!jt(n))throw new le;var e=s(arguments,2);
return Ce(function(){n.apply(h,e)},t)},v.difference=function(n){return rt(n,ot(arguments,true,true,1))},v.filter=At,v.flatten=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(n=Bt(n,e,r)),ot(n,t)},v.forEach=Dt,v.forEachRight=Nt,v.forIn=nr,v.forInRight=function(n,t,e){var r=[];nr(n,function(n,t){r.push(t,n)});var u=r.length;for(t=tt(t,e,3);u--&&false!==t(r[u--],r[u],n););return n},v.forOwn=tr,v.forOwnRight=bt,v.functions=_t,v.groupBy=ur,v.indexBy=or,v.initial=function(n,t,e){var r=0,u=n?n.length:0;
if(typeof t!="number"&&null!=t){var o=u;for(t=v.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else r=null==t||e?1:t||r;return s(n,0,Pe(Be(0,u-r),u))},v.intersection=function(){for(var e=[],r=-1,u=arguments.length,a=i(),l=ht(),f=l===n,s=i();++r<u;){var g=arguments[r];(qe(g)||dt(g))&&(e.push(g),a.push(f&&g.length>=_&&o(r?e[r]:s)))}var f=e[0],h=-1,v=f?f.length:0,y=[];n:for(;++h<v;){var m=a[0],g=f[h];if(0>(m?t(m,g):l(s,g))){for(r=u,(m||s).push(g);--r;)if(m=a[r],0>(m?t(m,g):l(e[r],g)))continue n;y.push(g)
}}for(;u--;)(m=a[u])&&p(m);return c(a),c(s),y},v.invert=wt,v.invoke=function(n,t){var e=s(arguments,2),r=-1,u=typeof t=="function",o=n?n.length:0,a=Zt(typeof o=="number"?o:0);return Dt(n,function(n){a[++r]=(u?t:n[t]).apply(n,e)}),a},v.keys=We,v.map=Bt,v.mapValues=function(n,t,e){var r={};return t=v.createCallback(t,e,3),tr(n,function(n,e,u){r[e]=t(n,e,u)}),r},v.max=Pt,v.memoize=function(n,t){if(!jt(n))throw new le;var e=function(){var r=e.cache,u=t?t.apply(this,arguments):b+arguments[0];return we.call(r,u)?r[u]:r[u]=n.apply(this,arguments)
};return e.cache={},e},v.merge=function(n){var t=arguments,e=2;if(!xt(n))return n;if("number"!=typeof t[2]&&(e=t.length),3<e&&"function"==typeof t[e-2])var r=tt(t[--e-1],t[e--],2);else 2<e&&"function"==typeof t[e-1]&&(r=t[--e]);for(var t=s(arguments,1,e),u=-1,o=i(),a=i();++u<e;)it(n,t[u],r,o,a);return c(o),c(a),n},v.min=function(n,t,e){var u=1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&qe(n)){e=-1;for(var a=n.length;++e<a;){var i=n[e];i<o&&(o=i)}}else t=null==t&&kt(n)?r:v.createCallback(t,e,3),Xe(n,function(n,e,r){e=t(n,e,r),e<u&&(u=e,o=n)
});return o},v.omit=function(n,t,e){var r={};if(typeof t!="function"){var u=[];nr(n,function(n,t){u.push(t)});for(var u=rt(u,ot(arguments,true,false,1)),o=-1,a=u.length;++o<a;){var i=u[o];r[i]=n[i]}}else t=v.createCallback(t,e,3),nr(n,function(n,e,u){t(n,e,u)||(r[e]=n)});return r},v.once=function(n){var t,e;if(!jt(n))throw new le;return function(){return t?e:(t=true,e=n.apply(this,arguments),n=null,e)}},v.pairs=function(n){for(var t=-1,e=We(n),r=e.length,u=Zt(r);++t<r;){var o=e[t];u[t]=[o,n[o]]}return u
},v.partial=function(n){return pt(n,16,s(arguments,1))},v.partialRight=function(n){return pt(n,32,null,s(arguments,1))},v.pick=function(n,t,e){var r={};if(typeof t!="function")for(var u=-1,o=ot(arguments,true,false,1),a=xt(n)?o.length:0;++u<a;){var i=o[u];i in n&&(r[i]=n[i])}else t=v.createCallback(t,e,3),nr(n,function(n,e,u){t(n,e,u)&&(r[e]=n)});return r},v.pluck=ar,v.property=Xt,v.pull=function(n){for(var t=arguments,e=0,r=t.length,u=n?n.length:0;++e<r;)for(var o=-1,a=t[e];++o<u;)n[o]===a&&(ke.call(n,o--,1),u--);
return n},v.range=function(n,t,e){n=+n||0,e=typeof e=="number"?e:+e||1,null==t&&(t=n,n=0);var r=-1;t=Be(0,ye((t-n)/(e||1)));for(var u=Zt(t);++r<t;)u[r]=n,n+=e;return u},v.reject=function(n,t,e){return t=v.createCallback(t,e,3),At(n,function(n,e,r){return!t(n,e,r)})},v.remove=function(n,t,e){var r=-1,u=n?n.length:0,o=[];for(t=v.createCallback(t,e,3);++r<u;)e=n[r],t(e,r,n)&&(o.push(e),ke.call(n,r--,1),u--);return o},v.rest=qt,v.shuffle=Tt,v.sortBy=function(n,t,e){var r=-1,o=qe(t),a=n?n.length:0,f=Zt(typeof a=="number"?a:0);
for(o||(t=v.createCallback(t,e,3)),Dt(n,function(n,e,u){var a=f[++r]=l();o?a.m=Bt(t,function(t){return n[t]}):(a.m=i())[0]=t(n,e,u),a.n=r,a.o=n}),a=f.length,f.sort(u);a--;)n=f[a],f[a]=n.o,o||c(n.m),p(n);return f},v.tap=function(n,t){return t(n),n},v.throttle=function(n,t,e){var r=true,u=true;if(!jt(n))throw new le;return false===e?r=false:xt(e)&&(r="leading"in e?e.leading:r,u="trailing"in e?e.trailing:u),H.leading=r,H.maxWait=t,H.trailing=u,Vt(n,t,H)},v.times=function(n,t,e){n=-1<(n=+n)?n:0;var r=-1,u=Zt(n);
for(t=tt(t,e,1);++r<n;)u[r]=t(r);return u},v.toArray=function(n){return n&&typeof n.length=="number"?Le.unindexedChars&&kt(n)?n.split(""):s(n):Et(n)},v.transform=function(n,t,e,r){var u=qe(n);if(null==e)if(u)e=[];else{var o=n&&n.constructor;e=nt(o&&o.prototype)}return t&&(t=v.createCallback(t,r,4),(u?Xe:tr)(n,function(n,r,u){return t(e,n,r,u)})),e},v.union=function(){return ft(ot(arguments,true,true))},v.uniq=Wt,v.values=Et,v.where=At,v.without=function(n){return rt(n,s(arguments,1))},v.wrap=function(n,t){return pt(t,16,[n])
},v.xor=function(){for(var n=-1,t=arguments.length;++n<t;){var e=arguments[n];if(qe(e)||dt(e))var r=r?ft(rt(r,e).concat(rt(e,r))):e}return r||[]},v.zip=Gt,v.zipObject=Jt,v.collect=Bt,v.drop=qt,v.each=Dt,v.eachRight=Nt,v.extend=Ye,v.methods=_t,v.object=Jt,v.select=At,v.tail=qt,v.unique=Wt,v.unzip=Gt,Ut(v),v.clone=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=t,t=false),Y(n,t,typeof e=="function"&&tt(e,r,1))},v.cloneDeep=function(n,t,e){return Y(n,true,typeof t=="function"&&tt(t,e,1))},v.contains=Ot,v.escape=function(n){return null==n?"":ie(n).replace(Qe,gt)
},v.every=St,v.find=It,v.findIndex=function(n,t,e){var r=-1,u=n?n.length:0;for(t=v.createCallback(t,e,3);++r<u;)if(t(n[r],r,n))return r;return-1},v.findKey=function(n,t,e){var r;return t=v.createCallback(t,e,3),tr(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},v.findLast=function(n,t,e){var r;return t=v.createCallback(t,e,3),Nt(n,function(n,e,u){return t(n,e,u)?(r=n,false):void 0}),r},v.findLastIndex=function(n,t,e){var r=n?n.length:0;for(t=v.createCallback(t,e,3);r--;)if(t(n[r],r,n))return r;
return-1},v.findLastKey=function(n,t,e){var r;return t=v.createCallback(t,e,3),bt(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},v.has=function(n,t){return n?we.call(n,t):false},v.identity=Ht,v.indexOf=zt,v.isArguments=dt,v.isArray=qe,v.isBoolean=function(n){return true===n||false===n||n&&typeof n=="object"&&he.call(n)==L||false},v.isDate=function(n){return n&&typeof n=="object"&&he.call(n)==z||false},v.isElement=function(n){return n&&1===n.nodeType||false},v.isEmpty=function(n){var t=true;if(!n)return t;var e=he.call(n),r=n.length;
return e==$||e==M||(Le.argsClass?e==T:dt(n))||e==G&&typeof r=="number"&&jt(n.splice)?!r:(tr(n,function(){return t=false}),t)},v.isEqual=function(n,t,e,r){return at(n,t,typeof e=="function"&&tt(e,r,2))},v.isFinite=function(n){return Ie(n)&&!De(parseFloat(n))},v.isFunction=jt,v.isNaN=function(n){return Ct(n)&&n!=+n},v.isNull=function(n){return null===n},v.isNumber=Ct,v.isObject=xt,v.isPlainObject=er,v.isRegExp=function(n){return n&&X[typeof n]&&he.call(n)==J||false},v.isString=kt,v.isUndefined=function(n){return typeof n=="undefined"
},v.lastIndexOf=function(n,t,e){var r=n?n.length:0;for(typeof e=="number"&&(r=(0>e?Be(0,r+e):Pe(e,r-1))+1);r--;)if(n[r]===t)return r;return-1},v.mixin=Ut,v.noConflict=function(){return e._=ge,this},v.noop=Qt,v.now=ir,v.parseInt=lr,v.random=function(n,t,e){var r=null==n,u=null==t;return null==e&&(typeof n=="boolean"&&u?(e=n,n=1):u||typeof t!="boolean"||(e=t,u=true)),r&&u&&(t=1),n=+n||0,u?(t=n,n=0):t=+t||0,e||n%1||t%1?(e=Fe(),Pe(n+e*(t-n+parseFloat("1e-"+((e+"").length-1))),t)):lt(n,t)},v.reduce=Rt,v.reduceRight=Ft,v.result=function(n,t){if(n){var e=n[t];
return jt(e)?n[t]():e}},v.runInContext=g,v.size=function(n){var t=n?n.length:0;return typeof t=="number"?t:We(n).length},v.some=$t,v.sortedIndex=Kt,v.template=function(n,t,e){var r=v.templateSettings;n=ie(n||""),e=Ze({},e,r);var u,o=Ze({},e.imports,r.imports),r=We(o),o=Et(o),i=0,l=e.interpolate||N,f="__p+='",l=ae((e.escape||N).source+"|"+l.source+"|"+(l===I?O:N).source+"|"+(e.evaluate||N).source+"|$","g");n.replace(l,function(t,e,r,o,l,c){return r||(r=o),f+=n.slice(i,c).replace(P,a),e&&(f+="'+__e("+e+")+'"),l&&(u=true,f+="';"+l+";\n__p+='"),r&&(f+="'+((__t=("+r+"))==null?'':__t)+'"),i=c+t.length,t
}),f+="';",l=e=e.variable,l||(e="obj",f="with("+e+"){"+f+"}"),f=(u?f.replace(x,""):f).replace(C,"$1").replace(E,"$1;"),f="function("+e+"){"+(l?"":e+"||("+e+"={});")+"var __t,__p='',__e=_.escape"+(u?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+f+"return __p}";try{var c=ee(r,"return "+f).apply(h,o)}catch(p){throw p.source=f,p}return t?c(t):(c.source=f,c)},v.unescape=function(n){return null==n?"":ie(n).replace(Ue,mt)},v.uniqueId=function(n){var t=++m;return ie(null==n?"":n)+t
},v.all=St,v.any=$t,v.detect=It,v.findWhere=It,v.foldl=Rt,v.foldr=Ft,v.include=Ot,v.inject=Rt,Ut(function(){var n={};return tr(v,function(t,e){v.prototype[e]||(n[e]=t)}),n}(),false),v.first=Lt,v.last=function(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=u;for(t=v.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[u-1]:h;return s(n,Be(0,u-r))},v.sample=function(n,t,e){return n&&typeof n.length!="number"?n=Et(n):Le.unindexedChars&&kt(n)&&(n=n.split("")),null==t||e?n?n[lt(0,n.length-1)]:h:(n=Tt(n),n.length=Pe(Be(0,t),n.length),n)
},v.take=Lt,v.head=Lt,tr(v,function(n,t){var e="sample"!==t;v.prototype[t]||(v.prototype[t]=function(t,r){var u=this.__chain__,o=n(this.__wrapped__,t,r);return u||null!=t&&(!r||e&&typeof t=="function")?new y(o,u):o})}),v.VERSION="2.4.1",v.prototype.chain=function(){return this.__chain__=true,this},v.prototype.toString=function(){return ie(this.__wrapped__)},v.prototype.value=Yt,v.prototype.valueOf=Yt,Xe(["join","pop","shift"],function(n){var t=fe[n];v.prototype[n]=function(){var n=this.__chain__,e=t.apply(this.__wrapped__,arguments);
return n?new y(e,n):e}}),Xe(["push","reverse","sort","unshift"],function(n){var t=fe[n];v.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),Xe(["concat","slice","splice"],function(n){var t=fe[n];v.prototype[n]=function(){return new y(t.apply(this.__wrapped__,arguments),this.__chain__)}}),Le.spliceObjects||Xe(["pop","shift","splice"],function(n){var t=fe[n],e="splice"==n;v.prototype[n]=function(){var n=this.__chain__,r=this.__wrapped__,u=t.apply(r,arguments);return 0===r.length&&delete r[0],n||e?new y(u,n):u
}}),v}var h,v=[],y=[],m=0,d={},b=+new Date+"",_=75,w=40,j=" \t\x0B\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",x=/\b__p\+='';/g,C=/\b(__p\+=)''\+/g,E=/(__e\(.*?\)|\b__t\))\+'';/g,O=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,S=/\w*$/,A=/^\s*function[ \n\r\t]+\w/,I=/<%=([\s\S]+?)%>/g,D=RegExp("^["+j+"]*0+(?=.$)"),N=/($^)/,B=/\bthis\b/,P=/['\n\r\t\u2028\u2029\\]/g,R="Array Boolean Date Error Function Math Number Object RegExp String _ attachEvent clearTimeout isFinite isNaN parseInt setTimeout".split(" "),F="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),T="[object Arguments]",$="[object Array]",L="[object Boolean]",z="[object Date]",q="[object Error]",K="[object Function]",W="[object Number]",G="[object Object]",J="[object RegExp]",M="[object String]",V={};
V[K]=false,V[T]=V[$]=V[L]=V[z]=V[W]=V[G]=V[J]=V[M]=true;var H={leading:false,maxWait:0,trailing:false},U={configurable:false,enumerable:false,value:null,writable:false},Q={a:"",b:null,c:"",d:"",e:"",v:null,g:"",h:null,support:null,i:"",j:false},X={"boolean":false,"function":true,object:true,number:false,string:false,undefined:false},Y={"\\":"\\","'":"'","\n":"n","\r":"r","\t":"t","\u2028":"u2028","\u2029":"u2029"},Z=X[typeof window]&&window||this,nt=X[typeof exports]&&exports&&!exports.nodeType&&exports,tt=X[typeof module]&&module&&!module.nodeType&&module,et=tt&&tt.exports===nt&&nt,rt=X[typeof global]&&global;
!rt||rt.global!==rt&&rt.window!==rt||(Z=rt);var ut=g();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(Z._=ut, define(function(){return ut})):nt&&tt?et?(tt.exports=ut)._=ut:nt._=ut:Z._=ut}).call(this);
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
var cookies = require('../lib/cookies');
var $ = window.jQuery;
var def_opt = {
    cache : false,
    dataType : "json"
};

var ajax = function(opt){
    opt = $.extend(def_opt , opt );
    var data = opt.data || {};
    data.csrftoken = cookies.getItem("csrftoken");
    opt.data = data;
    return $.ajax(opt);
}

var http = {
    get : function(opt){
        opt.type = "get";
        return ajax(opt);
    },
    post : function(opt){
        opt.type = "post";
        return ajax(opt);
    }
};

module.exports = http;

},{"../lib/cookies":1}],7:[function(require,module,exports){
var SearchBox = require("./operation/search_box.js");
var http = require("../mod/http.js");
var _ = require("../lib/lodash.compat.min.js");
$(function(){
    $("#operation-nav").addClass("active");
    $("#op-home-rec").addClass("active");
    var searchbox = new SearchBox({
        limit : 5,
        add_fn : function(data){
           addOpList(data); 
           $(window).scrollTop($("#record-prds").offset().top - 100);
        }
    });
    searchbox.init();
    
    var $op_dom = $("#ai-op-rec");
    var $auto_dom = $("#ai-auto-rec");
    var sl_dom = $("#rec-version");
    var add_datas = [];
    var del_op_items = [];
    
    http.get({
        url : "/api/getAutoRecommendVersionList.htm"
    }).then(function(rs){
        var d = rs.data || [] , len = d.length;
        var data = d[len-1];
        var html = _.map(d,function(data,i){
            return '<option value="'+data+'" >'+data+'</option>'; 
        }).join("");
        sl_dom.html(html);
        sl_dom.val(data);
        return http.get({
            url : "/api/getAutoRecommendProductList.htm",
            data : {
                version : data
            }
        });
    }).done(function(rs){
        renderList($auto_dom.find("ol"),rs.data); 
    });
    http.get({
        url : "/api/getOssRecommendProductList.htm",
    }).done(function(rs){
        renderList($op_dom.find("ol"),rs.data); 
    })
    
    //init 
    /**
    Sortable.create($auto_dom.find("ol")[0],{
        onSort : updateAuto
    });
    **/
    Sortable.create($op_dom.find("ol")[0],{
        onSort : updateOp
    });
    $("#user-save").click(addToDB);
    sl_dom.change(function(){
        var val = sl_dom.val();
        http.get({
            url : "/api/getAutoRecommendProductList.htm",
            data : {
                version : val
            }
        }).done(function(rs){
            renderList($auto_dom.find("ol"),rs.data); 
        });
    });
    $auto_dom.delegate("li i.fa-times","click",function(e){
        var $li = $(this).closest("li");
        var data = $li.data("item");
        var f = window.confirm("确认删除"+data.name+"吗？");
        if (!f) {
            return ;
        }
        $li.remove();
        var id = data.record_id !== void 0 ? data.record_id : data.recommend.id ;
        http.post({
            url : "/api/delRecommendProduct.htm",
            data : {
                id : id
            }
        }).done(function(){
            updateAuto();
        });
    });
    $op_dom.delegate("li i.fa-times","click",function(e){
        var $li = $(this).closest("li");
        var data = $li.data("item");
        $li.remove();
        updateOp();
    });
    //init end
    function renderList(dom,data){
        dom.empty();
        _.forEach(data,function(d,i){
            var html = getLiHtml(d,i);
            var $d = $(html);
            $d.data("item",d);
            dom.append($d);
        });
    }
    function getLiHtml(data,i){
        return '<li class="item dd-item"><a href="#"><i class="fa fa-times pull-right"></i>'+(i == void 0 ? '' : '<span class="ind">'+(i+1)+'</span>') +data.product.name+'</a></li>';
    };
    function addOpList(data){
        var dom = $op_dom.find("ol");
        var $lis = dom.find("li") , ind = $lis.length;
        var has_data_ids = _.map($lis,function(li){
            var data = $(li).data("item");
            return (data.product || {}).id || data.productId;
        });
        var count = 0;
        _.forEach(data,function(d,i){
           if (~has_data_ids.indexOf(d.productId)) {
               return;
           }
           var $l = $('<li class="item "><a href="#"><i class="fa fa-times pull-right"></i><span class="ind">'+(ind+count+1)+'</span>' +d.title+'</a></li>');
           $l.data("item",d)
           add_datas.push(d);
           dom.append($l);
           count ++;
        });


    };
    
    function updateOp(){
        var lis = $op_dom.find("li");
        var post_data = [];
        var max = 9999;
        lis.each(function(i,li){
            var $li = $(li);
            var data = $li.data("item");
            $li.find(".ind").text(i+1);
        });
        return;
        http.post({
            url : "/api/modifyRecommendProductOrder.htm",
            data :{
                 data : JSON.stringify(post_data)
            }
        });

    }
    function updateAuto(){
        var lis = $auto_dom.find("li");
        var data = [];
        lis.each(function(i,li){
            var $li = $(li);
            var data = $li.data("item");
            $li.find(".ind").text(i+1);
        });
        return;

        http.post({
            
        })

    }

    function addToDB(){
        var f = window.confirm("确定要保存么，一旦保存，立刻生效，注意操作。");
        if (!f) {
            return;
        }
        var lis = $op_dom.find("li");
        var prd_ids = _.map(lis,function(li){
            var data = $(li).data("item");
            var id = (data.product || {}).id || data.productId;
            return id
        }).join(",");
        http.post({
            url : "/api/addRecommendProduct.htm",
            data : {
                productId : prd_ids
            }
        }).done(function(rs){
            if (rs.ret === 1) {
                alert("保存成功");
                return;
            }
            alert("保存失败");
            return ;
        }).fail(function(){
            alert("保存失败");
            return ;
        });
    }
})

},{"../lib/lodash.compat.min.js":5,"../mod/http.js":6,"./operation/search_box.js":8}],8:[function(require,module,exports){
require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pager = require("../../lib/ipager.js");
var PRD_HD_TPL = require("./tmpl/prd_list_hd.js");
var SHOP_HD_TPL = require("./tmpl/shop_list_hd.js");
var PRD_TD_TPL = require("./tmpl/prd_td.js");
var SHOP_TD_TPL = require("./tmpl/shop_td.js");

juicer.register('shop_status', function(s){
    if (s == 2) {
        return "审核通过";
    } 
    return "审核未通过";
}); 

juicer.register('prd_status', function(s){
    if (s == "2") {
        return "上架"; 
    } else if (s == "1") {
        return "下架";
    } else if (s =="3") {
        return  "删除";        
    }
    return "";
}); 

var Limit = 10;

var SearchBox = function(opt){
    opt = opt || {};
    var $d = this._dom = opt.dom || $("#pd-search-box");
    this._$search_box = $d.find(".m-prd-search");
    this._$list_box = $d.find(".m-result-list");
    this._$page_box = $d.find(".m-page-box");
    this._page_limit = opt.limit || Limit;
    this._opt = opt;
    this._opt.add_fn = opt.add_fn || $.noop;
}

SearchBox.prototype.init = function(){
    this._initSearch();
    this._initResult();
}
SearchBox.prototype._initSearch = function(){
    var me = this , $s = me._$search_box;
    var $f = this._$search_form = $s.find("form");
    this._$add_btn = $f.find(".ai-add");
    var $search_type = $f.find("input[type=radio]");
    var $search_inp = $f.find(".ai-search-inp");
    var search_type  = ["prd","shop"];
    
    this._cur_type = me._opt.default_type || "prd";
    
    if (this._cur_type == "prd") {
        $search_type[0].checked = true;
        $search_type[1].checked = false;
        if (me._opt.only_one) {
             $search_type.eq(1).closest(".radio").hide();
        }
    } else {
        $search_type[0].checked = false;
        $search_type[1].checked = true;
        if (me._opt.only_one) {
             $search_type.eq(0).closest(".radio").hide();
        }
    }

    this._$search_form.on("submit",function(e){
        e.preventDefault();
        var type ; 
        $search_type.each(function(i){
            if (this.checked) {
                type = search_type[this.value];
            }
        });
        var query = $search_inp.val();
        var search_obj = {
            type : type,
            query : query
        };
        me._search(search_obj);
    });
    this._$add_btn.click(function(e){
        var $l = me._$list_box;
        var $ch = $l.find(".ai-ch") || [];
        var data = [];
        var t_dom = [];
        _.forEach($ch,function(dom,i){
            var checked = dom.checked;
            if (checked) {
                var d = $(dom).closest("tr").data("item");
                data.push(d);
                t_dom.push(dom);
            }
        });
        if (data.length) {
            me._opt.add_fn(data); 
            _.forEach(t_dom,function(dom){
               dom.checked = false; 
            });
            me._dom.find(".ai-selected-all input[type=checkbox]").attr("checked",false);
        } else {
            alert("没有选择商品");
        }
    });
}
SearchBox.prototype._initResult = function(){
    var me = this , $l = this._$list_box;
    $l.delegate(".ai-selected-all label","click",function(e){
        var check_dom = $(this).find("input");
        var $td_labels = $l.find("input.ai-ch"); 
        if ($td_labels.length) {
            var checked = check_dom[0].checked;
            if (checked) {
                $td_labels.each(function(){
                    this.checked = true;
                });
            } else {
                $td_labels.each(function(){
                    this.checked = false;
                });
            }
        }
    });

    var $page_dom = this._$page_box; 
        $page_dom.delegate(".pg-item","click",function(e){
           e.preventDefault();
           var pg = this.getAttribute("pg") * 1;
           me.go_page(pg);
        });
       $page_dom.delegate(".js-p-next","click",function(e){
           e.preventDefault();
           var pg = me._cache_params.pn + 1;
           me.go_page(pg);
       });
       $page_dom.delegate(".js-p-prev","click",function(e){
           e.preventDefault();
           var pg = me._cache_params.pn -1;
           me.go_page(pg);
       });  
}

SearchBox.prototype._search = function(obj){
    var query_obj = this._SEARCH_MAP[obj.type];
    var pn = 1 , ps = this._page_limit;
    var params = {pn:pn,ps:ps,q:obj.query};
    this._cache_params = params;
    this._cur_type = obj.type;
    this._renderListHd(obj.type);
    query_obj.search.call(this,params,obj.type);
}
SearchBox.prototype._SEARCH_MAP = {
    "prd" : {
        search : function(params,type){
            var me = this;
            //var url = '/api/getProductList.htm';
            var url = '/searchProduct?from=oss';
            http.get({
                url : url,
                data : params
            }).done(function(rs){
                me._cache_params.pn = params.pn;
                me._renderList(type,rs.data);
                me._renderPage(params.pn,rs.totalNum,params.ps);
            }).fail(function(){
                alert("服务器错误，请刷新重试"); 
            });
        }
    },
    "shop" : {
        search : function(params,type){
            var me = this;
            var url = '/api/getShopList.htm';
            http.get({
                url : url,
                data : params
            }).done(function(rs){
                me._cache_params.pn = params.pn;
                me._renderList(type,rs.shopList);
                me._renderPage(params.pn,rs.totalNum,params.ps);
            }).fail(function(){
               alert("服务器错误，请刷新重试"); 
            });
        }
    }
    
}

SearchBox.prototype._reset = function(){
    this._cache_params = {pn:1,ps:this._page_limit};  
    this._$list_box.empty();
}
SearchBox.prototype._renderListHd = function(type){
    var $l = this._$list_box;
    if (type == "prd") {
        $l.html(PRD_HD_TPL());
    } else {
        $l.html(SHOP_HD_TPL());
    }
    
}
SearchBox.prototype._renderList = function(type,data){
    var $tbody = this._$list_box.find("tbody");
    var tpl ;
    if (type == "prd" ) {
        tpl = PRD_TD_TPL;
    } else {
        tpl = SHOP_TD_TPL;
    }
    $tbody.empty();
    _.forEach(data,function(d,i){
        var html = tpl(d);
        var $tr = $(html);
        $tr.data("item",d);
        $tbody.append($tr);
    });
}
SearchBox.prototype._renderPage = function(cur_page,total,limit){
      pager.render(this._$page_box,cur_page,total,limit); 
}

SearchBox.prototype.go_page = function(p){
    var params = this._cache_params;
    var type = this._cur_type;
    var query_obj = this._SEARCH_MAP[type];
    var q_params = _.extend({},params);
    q_params.pn = p;
    query_obj.search.call(this,q_params,type);
    
}

module.exports = SearchBox;

},{"../../lib/ipager.js":2,"../../lib/jquery.js":3,"../../lib/juicer.js":4,"../../lib/lodash.compat.min.js":5,"../../mod/http.js":6,"./tmpl/prd_list_hd.js":9,"./tmpl/prd_td.js":10,"./tmpl/shop_list_hd.js":11,"./tmpl/shop_td.js":12}],9:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_list_hd.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var id=_.id;var table=_.table;var hover=_.hover;var thead=_.thead;var tr=_.tr;var th=_.th;var selected=_.selected;var all=_.all;var label=_.label;var input=_.input;var tbody=_.tbody; _out+=' <table class="table  table-hover general-table"> <thead> <tr>     <th>商品ID</th>     <th>商品名称</th>     <th>所属门店</th>     <th>现价</th>     <th>原价</th>     <th>状态</th>     <th class="ai-selected-all">         <label>         <input type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>         全选         </label>     </th> </tr> </thead> <tbody> </tbody> </table>   '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_list_hd.tmpl'];
},{}],10:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_td.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var productId=_.productId;var title=_.title;var shopName=_.shopName;var presentPrice=_.presentPrice;var originalPrice=_.originalPrice;var status=_.status;var id=_.id;var tr=_.tr;var td=_.td;var prd_status=_.prd_status;var label=_.label;var input=_.input;var ch=_.ch; _out+='<tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(productId)) ;_out+='             </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(title)) ;_out+='             </td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(shopName)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(presentPrice)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(originalPrice)) ;_out+='</td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(_method.prd_status.call({}, status))) ;_out+='</td>     <td>         <label>             <input class="ai-ch" type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>             选择         </label>     </td> </tr>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_td.tmpl'];
},{}],11:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['shop_list_hd.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var id=_.id;var table=_.table;var hover=_.hover;var thead=_.thead;var tr=_.tr;var th=_.th;var selected=_.selected;var all=_.all;var label=_.label;var input=_.input;var tbody=_.tbody; _out+='<table class="table  table-hover general-table">     <thead>     <tr>     <th>商户ID</th>     <th>商户名称</th>     <th>状态</th>     <th class="ai-selected-all">         <label>         <input type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>         全选         </label>     </th>     </tr>     </thead>     <tbody>     </tbody> </table>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['shop_list_hd.tmpl'];
},{}],12:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['shop_td.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var shopId=_.shopId;var name=_.name;var status=_.status;var id=_.id;var tr=_.tr;var td=_.td;var shop_status=_.shop_status;var label=_.label;var input=_.input;var ch=_.ch; _out+='<tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(shopId)) ;_out+='             </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(name)) ;_out+='             </td>     <td>';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(_method.shop_status.call({}, status))) ;_out+='</td>     <td>         <label>             <input class="ai-ch" type="checkbox" value="';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='" name="select_prd" id="sel_prd_';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(id)) ;_out+='"/>             选择         </label>     </td> </tr> '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['shop_td.tmpl'];
},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9jb29raWVzLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2lwYWdlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9qcXVlcnkuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanVpY2VyLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2xvZGFzaC5jb21wYXQubWluLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbW9kL2h0dHAuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL2Zha2VfN2E0NjNjZmEuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi9zZWFyY2hfYm94LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvcGFnZS9vcGVyYXRpb24vdG1wbC9wcmRfbGlzdF9oZC5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL3BhZ2Uvb3BlcmF0aW9uL3RtcGwvcHJkX3RkLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvcGFnZS9vcGVyYXRpb24vdG1wbC9zaG9wX2xpc3RfaGQuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL29wZXJhdGlvbi90bXBsL3Nob3BfdGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZG9jQ29va2llID0gKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAvKlxcXG4gIHwqfFxuICB8KnwgIDo6IGNvb2tpZXMuanMgOjpcbiAgfCp8XG4gIHwqfCAgQSBjb21wbGV0ZSBjb29raWVzIHJlYWRlci93cml0ZXIgZnJhbWV3b3JrIHdpdGggZnVsbCB1bmljb2RlIHN1cHBvcnQuXG4gIHwqfFxuICB8KnwgIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvRE9NL2RvY3VtZW50LmNvb2tpZVxuICB8KnxcbiAgfCp8ICBUaGlzIGZyYW1ld29yayBpcyByZWxlYXNlZCB1bmRlciB0aGUgR05VIFB1YmxpYyBMaWNlbnNlLCB2ZXJzaW9uIDMgb3IgbGF0ZXIuXG4gIHwqfCAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXG4gIHwqfFxuICB8KnwgIFN5bnRheGVzOlxuICB8KnxcbiAgfCp8ICAqIGRvY0Nvb2tpZXMuc2V0SXRlbShuYW1lLCB2YWx1ZVssIGVuZFssIHBhdGhbLCBkb21haW5bLCBzZWN1cmVdXV1dKVxuICB8KnwgICogZG9jQ29va2llcy5nZXRJdGVtKG5hbWUpXG4gIHwqfCAgKiBkb2NDb29raWVzLnJlbW92ZUl0ZW0obmFtZVssIHBhdGhdLCBkb21haW4pXG4gIHwqfCAgKiBkb2NDb29raWVzLmhhc0l0ZW0obmFtZSlcbiAgfCp8ICAqIGRvY0Nvb2tpZXMua2V5cygpXG4gIHwqfFxuICBcXCovXG5cbiAgdmFyIGRvY0Nvb2tpZXMgPSB7XG4gICAgZ2V0SXRlbTogZnVuY3Rpb24gKHNLZXkpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZG9jdW1lbnQuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChcIig/Oig/Ol58Lio7KVxcXFxzKlwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICsgXCJcXFxccypcXFxcPVxcXFxzKihbXjtdKikuKiQpfF4uKiRcIiksIFwiJDFcIikpIHx8IG51bGw7XG4gICAgfSxcbiAgICBzZXRJdGVtOiBmdW5jdGlvbiAoc0tleSwgc1ZhbHVlLCB2RW5kLCBzUGF0aCwgc0RvbWFpbiwgYlNlY3VyZSkge1xuICAgICAgaWYgKCFzS2V5IHx8IC9eKD86ZXhwaXJlc3xtYXhcXC1hZ2V8cGF0aHxkb21haW58c2VjdXJlKSQvaS50ZXN0KHNLZXkpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgdmFyIHNFeHBpcmVzID0gXCJcIjtcbiAgICAgIGlmICh2RW5kKSB7XG4gICAgICAgIHN3aXRjaCAodkVuZC5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICAgICAgc0V4cGlyZXMgPSB2RW5kID09PSBJbmZpbml0eSA/IFwiOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMjM6NTk6NTkgR01UXCIgOiBcIjsgbWF4LWFnZT1cIiArIHZFbmQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFN0cmluZzpcbiAgICAgICAgICAgIHNFeHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyB2RW5kO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBEYXRlOlxuICAgICAgICAgICAgc0V4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIHZFbmQudG9VVENTdHJpbmcoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBlbmNvZGVVUklDb21wb25lbnQoc0tleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChzVmFsdWUpICsgc0V4cGlyZXMgKyAoc0RvbWFpbiA/IFwiOyBkb21haW49XCIgKyBzRG9tYWluIDogXCJcIikgKyAoc1BhdGggPyBcIjsgcGF0aD1cIiArIHNQYXRoIDogXCJcIikgKyAoYlNlY3VyZSA/IFwiOyBzZWN1cmVcIiA6IFwiXCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuXG4gICAgcmVtb3ZlSXRlbTogZnVuY3Rpb24gKHNLZXksIHNQYXRoLCBzRG9tYWluKSB7XG4gICAgICBpZiAoIXNLZXkgfHwgIXRoaXMuaGFzSXRlbShzS2V5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChzS2V5KSArIFwiPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVFwiICsgKCBzRG9tYWluID8gXCI7IGRvbWFpbj1cIiArIHNEb21haW4gOiBcIlwiKSArICggc1BhdGggPyBcIjsgcGF0aD1cIiArIHNQYXRoIDogXCJcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhc0l0ZW06IGZ1bmN0aW9uIChzS2V5KSB7XG4gICAgICByZXR1cm4gKG5ldyBSZWdFeHAoXCIoPzpefDtcXFxccyopXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc0tleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XCIpKS50ZXN0KGRvY3VtZW50LmNvb2tpZSk7XG4gICAgfSxcbiAgICBrZXlzOiAvKiBvcHRpb25hbCBtZXRob2Q6IHlvdSBjYW4gc2FmZWx5IHJlbW92ZSBpdCEgKi8gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFLZXlzID0gZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLygoPzpefFxccyo7KVteXFw9XSspKD89O3wkKXxeXFxzKnxcXHMqKD86XFw9W147XSopPyg/OlxcMXwkKS9nLCBcIlwiKS5zcGxpdCgvXFxzKig/OlxcPVteO10qKT87XFxzKi8pO1xuICAgICAgZm9yICh2YXIgbklkeCA9IDA7IG5JZHggPCBhS2V5cy5sZW5ndGg7IG5JZHgrKykgeyBhS2V5c1tuSWR4XSA9IGRlY29kZVVSSUNvbXBvbmVudChhS2V5c1tuSWR4XSk7IH1cbiAgICAgIHJldHVybiBhS2V5cztcbiAgICB9XG4gIH07XG4gIHJldHVybiBkb2NDb29raWVzO1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0gIGRvY0Nvb2tpZTtcblxuIiwidmFyICQgPSByZXF1aXJlKFwiLi9qcXVlcnlcIik7XG52YXIgcmVuZGVyID0gZnVuY3Rpb24oZG9tLG5vdywgdG90YWwsIGxpbWl0KSB7XG5cdHZhciBtYXggPSBNYXRoLmNlaWwodG90YWwgLyBsaW1pdCk7XG5cdHZhciBwYWdlciA9IHtcblx0XHRub3c6IG5vdyxcblx0XHRtYXg6IG1heFxuXHR9O1xuXHR2YXIgcGFnZXMgPSBjcmVhdGUocGFnZXIpO1xuXHRyZW5kZXJfaHRtbChkb20scGFnZXMsIHBhZ2VyKTtcbn1cblxudmFyIHJlbmRlcl9odG1sID0gZnVuY3Rpb24oZG9tLHBhZ2VzLCBwYWdnZXIpIHtcblx0LyoqIOWIhumhtSoqL1xuXHR2YXIgbm93ID0gcGFnZ2VyLm5vdztcblx0dmFyIGh0bWwgPSBbJzxkaXYgY2xhc3M9XCJwYWdlc1wiPiddO1xuXHRmb3IgKHZhciBpID0gMCwgbCA9IHBhZ2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdGlmICh0eXBlb2YgcGFnZXNbaV0gPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdGlmIChwYWdlc1tpXSA9PSBub3cpIHtcblx0XHRcdFx0aHRtbC5wdXNoKCc8ZW0gPjxzcGFuPicgKyBub3cgKyAnPC9zcGFuPjwvZW0+Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRodG1sLnB1c2goJzxhIGNsYXNzPVwicGctaXRlbSBqcy1wblwiIHBnPVwiJyArIHBhZ2VzW2ldICsgJ1wiIGhyZWY9XCIjXCI+PHNwYW4+JyArIHBhZ2VzW2ldICsgJzwvc3Bhbj48L2E+Jyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgcGFnZXNbaV0gPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdGh0bWwucHVzaChcIjxzcGFuID4uLi48L3NwYW4+XCIpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChwYWdnZXIubm93IDwgcGFnZ2VyLm1heCkge1xuXHRcdGh0bWwucHVzaCgnPGEgY2xhc3M9XCJwZy1pdGVtIHBhZ2UtbmV4dCBqcy1wLW5leHRcIiBocmVmPVwiI1wiIHRpdGxlPVwi5LiL5LiA6aG1XCI+5LiL5LiA6aG1PC9hPicpO1xuXHR9XG5cdGlmIChwYWdnZXIubm93ID4gMSkge1xuXHRcdGh0bWwuc3BsaWNlKDEsIDAsICc8YSBjbGFzcz1cInBnLWl0ZW0gcGFnZS1wcmV2IGpzLXAtcHJldlwiIGhyZWY9XCIjXCIgdGl0bGU9XCLkuIrkuIDpobVcIj7kuIrkuIDpobU8L2E+ICcpO1xuXHR9XG5cdGh0bWwucHVzaChcIjwvZGl2PlwiKTtcblx0ZG9tLmh0bWwoaHRtbC5qb2luKFwiXCIpKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKHBhZ2dlcikge1xuXHR2YXIgbWF4ID0gcGFnZ2VyLm1heCxcblx0bm93ID0gcGFnZ2VyLm5vdztcblx0dmFyIGZfb2Zmc2V0ID0gMjsgLy/lgY/np7vph49cblx0dmFyIGxfcl9saW1pdCA9IDU7XG5cdHZhciBwYWdlcyA9IFtdO1xuXHR2YXIgZ2FwID0gXCIuLi5cIjtcblx0dmFyIHJzID0gW10sXG5cdGxzID0gW10sXG5cdGx2LFxuXHRydixcblx0bWF4ZWQgPSBmYWxzZSxcblx0bWluZWQgPSBmYWxzZTtcblx0bHYgPSBydiA9IG5vdztcblxuXHRpZiAoMSA9PSBtYXgpIHtcblx0XHRyZXR1cm4gWzFdO1xuXHR9XG5cdGlmIChsX3JfbGltaXQgPj0gbWF4KSB7XG5cdFx0dmFyIHBhZ2VzID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gbWF4OyBpKyspIHtcblx0XHRcdHBhZ2VzLnB1c2goaSk7XG5cdFx0fVxuXHRcdHJldHVybiBwYWdlcztcblx0fVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGZfb2Zmc2V0OyBpKyspIHtcblx0XHRpZiAoKytydiA+PSBtYXgpIHtcblx0XHRcdGlmICghbWF4ZWQpIHtcblx0XHRcdFx0cnMucHVzaChtYXgpO1xuXHRcdFx0XHRtYXhlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJzLnB1c2gocnYpO1xuXHRcdH1cblx0XHRpZiAoLS1sdiA8PSAxKSB7XG5cdFx0XHRpZiAoIW1pbmVkKSB7XG5cdFx0XHRcdGxzLnNwbGljZSgwLCAwLCAxKTtcblx0XHRcdFx0bWluZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRscy5zcGxpY2UoMCwgMCwgbHYpO1xuXHRcdH1cblxuXHR9XG5cblx0dmFyIHBhZ2VzID0gbHMuY29uY2F0KFtub3ddKS5jb25jYXQocnMpO1xuXHRpZiAoIW1heGVkKSB7XG5cdFx0aWYgKHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdIDwgbWF4IC0gMSkge1xuXHRcdFx0cGFnZXMucHVzaChnYXApO1xuXHRcdH1cblx0XHRwYWdlcy5wdXNoKG1heCk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGxfcl9saW1pdCA+IG1heCkge1xuXHRcdFx0cGFnZXMgPSBbXTtcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IG1heDsgaSsrKSB7XG5cdFx0XHRcdHBhZ2VzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhZ2VzID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gbWF4OyBpID4gbWF4IC0gbF9yX2xpbWl0OyBpLS0pIHtcblx0XHRcdFx0cGFnZXMuc3BsaWNlKDAsIDAsIGkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKDEgPCBtYXggLSBsX3JfbGltaXQpIHtcblx0XHRcdFx0cGFnZXMuc3BsaWNlKDAsIDAsIGdhcCk7XG5cdFx0XHR9XG5cdFx0XHRwYWdlcy5zcGxpY2UoMCwgMCwgMSk7XG5cdFx0XHRyZXR1cm4gcGFnZXM7XG5cdFx0fVxuXG5cdH1cblxuXHRpZiAoIW1pbmVkKSB7XG5cdFx0aWYgKHBhZ2VzWzBdID4gMikge1xuXHRcdFx0cGFnZXMgPSBbMSwgZ2FwXS5jb25jYXQocGFnZXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYWdlcy5zcGxpY2UoMCwgMCwgMSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChsX3JfbGltaXQgPj0gbWF4KSB7XG5cdFx0XHRwYWdlcyA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gbWF4OyBpKyspIHtcblx0XHRcdFx0cGFnZXMucHVzaChpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFnZXMgPSBbXTtcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IGxfcl9saW1pdDsgaSsrKSB7XG5cdFx0XHRcdHBhZ2VzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobF9yX2xpbWl0IDwgbWF4IC0gMSkge1xuXHRcdFx0XHRwYWdlcy5wdXNoKGdhcCk7XG5cdFx0XHR9XG5cdFx0XHRwYWdlcy5wdXNoKG1heCk7XG5cdFx0fVxuXG5cdH1cblxuXHRyZXR1cm4gcGFnZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW5kZXIgOiByZW5kZXJcbn07XG4iLCJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKlxuICAgICoqKioqKioqKiogSnVpY2VyICoqKioqKioqKipcbiAgICAke0EgRmFzdCB0ZW1wbGF0ZSBlbmdpbmV9XG4gICAgUHJvamVjdCBIb21lOiBodHRwOi8vanVpY2VyLm5hbWVcblxuICAgIEF1dGhvcjogR3Vva2FpXG4gICAgR3RhbGs6IGJhZGthaWthaUBnbWFpbC5jb21cbiAgICBCbG9nOiBodHRwOi8vYmVuYmVuLmNjXG4gICAgTGljZW5jZTogTUlUIExpY2Vuc2VcbiAgICBWZXJzaW9uOiAwLjYuOC1zdGFibGVcbiovXG5cbihmdW5jdGlvbigpIHtcblxuICAgIC8vIFRoaXMgaXMgdGhlIG1haW4gZnVuY3Rpb24gZm9yIG5vdCBvbmx5IGNvbXBpbGluZyBidXQgYWxzbyByZW5kZXJpbmcuXG4gICAgLy8gdGhlcmUncyBhdCBsZWFzdCB0d28gcGFyYW1ldGVycyBuZWVkIHRvIGJlIHByb3ZpZGVkLCBvbmUgaXMgdGhlIHRwbCwgXG4gICAgLy8gYW5vdGhlciBpcyB0aGUgZGF0YSwgdGhlIHRwbCBjYW4gZWl0aGVyIGJlIGEgc3RyaW5nLCBvciBhbiBpZCBsaWtlICNpZC5cbiAgICAvLyBpZiBvbmx5IHRwbCB3YXMgZ2l2ZW4sIGl0J2xsIHJldHVybiB0aGUgY29tcGlsZWQgcmV1c2FibGUgZnVuY3Rpb24uXG4gICAgLy8gaWYgdHBsIGFuZCBkYXRhIHdlcmUgZ2l2ZW4gYXQgdGhlIHNhbWUgdGltZSwgaXQnbGwgcmV0dXJuIHRoZSByZW5kZXJlZCBcbiAgICAvLyByZXN1bHQgaW1tZWRpYXRlbHkuXG5cbiAgICB2YXIganVpY2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgIGFyZ3MucHVzaChqdWljZXIub3B0aW9ucyk7XG5cbiAgICAgICAgaWYoYXJnc1swXS5tYXRjaCgvXlxccyojKFtcXHc6XFwtXFwuXSspXFxzKiQvaWdtKSkge1xuICAgICAgICAgICAgYXJnc1swXS5yZXBsYWNlKC9eXFxzKiMoW1xcdzpcXC1cXC5dKylcXHMqJC9pZ20sIGZ1bmN0aW9uKCQsICRpZCkge1xuICAgICAgICAgICAgICAgIHZhciBfZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IF9kb2N1bWVudCAmJiBfZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJGlkKTtcbiAgICAgICAgICAgICAgICBhcmdzWzBdID0gZWxlbSA/IChlbGVtLnZhbHVlIHx8IGVsZW0uaW5uZXJIVE1MKSA6ICQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZihkb2N1bWVudCkgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGp1aWNlci5jb21waWxlLmNhbGwoanVpY2VyLCBkb2N1bWVudC5ib2R5LmlubmVySFRNTCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBqdWljZXIuY29tcGlsZS5hcHBseShqdWljZXIsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4ganVpY2VyLnRvX2h0bWwuYXBwbHkoanVpY2VyLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX19lc2NhcGVodG1sID0ge1xuICAgICAgICBlc2NhcGVoYXNoOiB7XG4gICAgICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgICAgICc+JzogJyZndDsnLFxuICAgICAgICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAgICAgICAnLyc6ICcmI3gyZjsnXG4gICAgICAgIH0sXG4gICAgICAgIGVzY2FwZXJlcGxhY2U6IGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIHJldHVybiBfX2VzY2FwZWh0bWwuZXNjYXBlaGFzaFtrXTtcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBpbmc6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihzdHIpICE9PSAnc3RyaW5nJyA/IHN0ciA6IHN0ci5yZXBsYWNlKC9bJjw+XCJdL2lnbSwgdGhpcy5lc2NhcGVyZXBsYWNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGV0ZWN0aW9uOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRhdGEpID09PSAndW5kZWZpbmVkJyA/ICcnIDogZGF0YTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX190aHJvdyA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGlmKHR5cGVvZihjb25zb2xlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmKGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyhlcnJvcik7XG4gICAgfTtcblxuICAgIHZhciBfX2NyZWF0b3IgPSBmdW5jdGlvbihvLCBwcm90bykge1xuICAgICAgICBvID0gbyAhPT0gT2JqZWN0KG8pID8ge30gOiBvO1xuXG4gICAgICAgIGlmKG8uX19wcm90b19fKSB7XG4gICAgICAgICAgICBvLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW1wdHkgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB2YXIgbiA9IE9iamVjdC5jcmVhdGUgPyBcbiAgICAgICAgICAgIE9iamVjdC5jcmVhdGUocHJvdG8pIDogXG4gICAgICAgICAgICBuZXcoZW1wdHkucHJvdG90eXBlID0gcHJvdG8sIGVtcHR5KTtcblxuICAgICAgICBmb3IodmFyIGkgaW4gbykge1xuICAgICAgICAgICAgaWYoby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIG5baV0gPSBvW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfTtcblxuICAgIHZhciBhbm5vdGF0ZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIHZhciBGTl9BUkdTID0gL15mdW5jdGlvblxccypbXlxcKF0qXFwoXFxzKihbXlxcKV0qKVxcKS9tO1xuICAgICAgICB2YXIgRk5fQVJHX1NQTElUID0gLywvO1xuICAgICAgICB2YXIgRk5fQVJHID0gL15cXHMqKF8/KShcXFMrPylcXDFcXHMqJC87XG4gICAgICAgIHZhciBGTl9CT0RZID0gL15mdW5jdGlvbltee10reyhbXFxzXFxTXSopfS9tO1xuICAgICAgICB2YXIgU1RSSVBfQ09NTUVOVFMgPSAvKChcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKSkvbWc7XG4gICAgICAgIHZhciBhcmdzID0gW10sXG4gICAgICAgICAgICBmblRleHQsXG4gICAgICAgICAgICBmbkJvZHksXG4gICAgICAgICAgICBhcmdEZWNsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChmbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmblRleHQgPSBmbi50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGZuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZm5UZXh0ID0gZm47XG4gICAgICAgIH1cblxuICAgICAgICBmblRleHQgPSBmblRleHQucmVwbGFjZShTVFJJUF9DT01NRU5UUywgJycpO1xuICAgICAgICBmblRleHQgPSBmblRleHQudHJpbSgpO1xuICAgICAgICBhcmdEZWNsID0gZm5UZXh0Lm1hdGNoKEZOX0FSR1MpO1xuICAgICAgICBmbkJvZHkgPSBmblRleHQubWF0Y2goRk5fQk9EWSlbMV0udHJpbSgpO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcmdEZWNsWzFdLnNwbGl0KEZOX0FSR19TUExJVCkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdEZWNsWzFdLnNwbGl0KEZOX0FSR19TUExJVClbaV07XG4gICAgICAgICAgICBhcmcucmVwbGFjZShGTl9BUkcsIGZ1bmN0aW9uKGFsbCwgdW5kZXJzY29yZSwgbmFtZSkge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFthcmdzLCBmbkJvZHldO1xuICAgIH07XG5cbiAgICBqdWljZXIuX19jYWNoZSA9IHt9O1xuICAgIGp1aWNlci52ZXJzaW9uID0gJzAuNi44LXN0YWJsZSc7XG4gICAganVpY2VyLnNldHRpbmdzID0ge307XG5cbiAgICBqdWljZXIudGFncyA9IHtcbiAgICAgICAgb3BlcmF0aW9uT3BlbjogJ3tAJyxcbiAgICAgICAgb3BlcmF0aW9uQ2xvc2U6ICd9JyxcbiAgICAgICAgaW50ZXJwb2xhdGVPcGVuOiAnXFxcXCR7JyxcbiAgICAgICAgaW50ZXJwb2xhdGVDbG9zZTogJ30nLFxuICAgICAgICBub25lZW5jb2RlT3BlbjogJ1xcXFwkXFxcXCR7JyxcbiAgICAgICAgbm9uZWVuY29kZUNsb3NlOiAnfScsXG4gICAgICAgIGNvbW1lbnRPcGVuOiAnXFxcXHsjJyxcbiAgICAgICAgY29tbWVudENsb3NlOiAnXFxcXH0nXG4gICAgfTtcblxuICAgIGp1aWNlci5vcHRpb25zID0ge1xuICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgc3RyaXA6IHRydWUsXG4gICAgICAgIGVycm9yaGFuZGxpbmc6IHRydWUsXG4gICAgICAgIGRldGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgX21ldGhvZDogX19jcmVhdG9yKHtcbiAgICAgICAgICAgIF9fZXNjYXBlaHRtbDogX19lc2NhcGVodG1sLFxuICAgICAgICAgICAgX190aHJvdzogX190aHJvdyxcbiAgICAgICAgICAgIF9fanVpY2VyOiBqdWljZXJcbiAgICAgICAgfSwge30pXG4gICAgfTtcblxuICAgIGp1aWNlci50YWdJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb3JzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWFjaFxcXFxzKihbXn1dKj8pXFxcXHMqYXNcXFxccyooXFxcXHcqPylcXFxccyooLFxcXFxzKlxcXFx3Kj8pPycgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGZvcmVuZCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnXFxcXC9lYWNoJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaWZzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnaWZcXFxccyooW159XSo/KScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGlmZW5kID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdcXFxcL2lmJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgZWxzZXN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdlbHNlJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgZWxzZWlmc3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2Vsc2UgaWZcXFxccyooW159XSo/KScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGludGVycG9sYXRlID0ganVpY2VyLnRhZ3MuaW50ZXJwb2xhdGVPcGVuICsgJyhbXFxcXHNcXFxcU10rPyknICsganVpY2VyLnRhZ3MuaW50ZXJwb2xhdGVDbG9zZTtcbiAgICAgICAgdmFyIG5vbmVlbmNvZGUgPSBqdWljZXIudGFncy5ub25lZW5jb2RlT3BlbiArICcoW1xcXFxzXFxcXFNdKz8pJyArIGp1aWNlci50YWdzLm5vbmVlbmNvZGVDbG9zZTtcbiAgICAgICAgdmFyIGlubGluZWNvbW1lbnQgPSBqdWljZXIudGFncy5jb21tZW50T3BlbiArICdbXn1dKj8nICsganVpY2VyLnRhZ3MuY29tbWVudENsb3NlO1xuICAgICAgICB2YXIgcmFuZ2VzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWFjaFxcXFxzKihcXFxcdyo/KVxcXFxzKmluXFxcXHMqcmFuZ2VcXFxcKChbXn1dKz8pXFxcXHMqLFxcXFxzKihbXn1dKz8pXFxcXCknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBpbmNsdWRlID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdpbmNsdWRlXFxcXHMqKFtefV0qPylcXFxccyosXFxcXHMqKFtefV0qPyknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBoZWxwZXJSZWdpc3RlclN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdoZWxwZXJcXFxccyooW159XSo/KVxcXFxzKicgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGhlbHBlclJlZ2lzdGVyQm9keSA9ICcoW1xcXFxzXFxcXFNdKj8pJztcbiAgICAgICAgdmFyIGhlbHBlclJlZ2lzdGVyRW5kID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdcXFxcL2hlbHBlcicgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcblxuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQgPSBuZXcgUmVnRXhwKGZvcnN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5mb3JlbmQgPSBuZXcgUmVnRXhwKGZvcmVuZCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaWZzdGFydCA9IG5ldyBSZWdFeHAoaWZzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaWZlbmQgPSBuZXcgUmVnRXhwKGlmZW5kLCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5lbHNlc3RhcnQgPSBuZXcgUmVnRXhwKGVsc2VzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZWxzZWlmc3RhcnQgPSBuZXcgUmVnRXhwKGVsc2VpZnN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5pbnRlcnBvbGF0ZSA9IG5ldyBSZWdFeHAoaW50ZXJwb2xhdGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLm5vbmVlbmNvZGUgPSBuZXcgUmVnRXhwKG5vbmVlbmNvZGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmlubGluZWNvbW1lbnQgPSBuZXcgUmVnRXhwKGlubGluZWNvbW1lbnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLnJhbmdlc3RhcnQgPSBuZXcgUmVnRXhwKHJhbmdlc3RhcnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmluY2x1ZGUgPSBuZXcgUmVnRXhwKGluY2x1ZGUsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmhlbHBlclJlZ2lzdGVyID0gbmV3IFJlZ0V4cChoZWxwZXJSZWdpc3RlclN0YXJ0ICsgaGVscGVyUmVnaXN0ZXJCb2R5ICsgaGVscGVyUmVnaXN0ZXJFbmQsICdpZ20nKTtcbiAgICB9O1xuXG4gICAganVpY2VyLnRhZ0luaXQoKTtcblxuICAgIC8vIFVzaW5nIHRoaXMgbWV0aG9kIHRvIHNldCB0aGUgb3B0aW9ucyBieSBnaXZlbiBjb25mLW5hbWUgYW5kIGNvbmYtdmFsdWUsXG4gICAgLy8geW91IGNhbiBhbHNvIHByb3ZpZGUgbW9yZSB0aGFuIG9uZSBrZXktdmFsdWUgcGFpciB3cmFwcGVkIGJ5IGFuIG9iamVjdC5cbiAgICAvLyB0aGlzIGludGVyZmFjZSBhbHNvIHVzZWQgdG8gY3VzdG9tIHRoZSB0ZW1wbGF0ZSB0YWcgZGVsaW1hdGVyLCBmb3IgdGhpc1xuICAgIC8vIHNpdHVhdGlvbiwgdGhlIGNvbmYtbmFtZSBtdXN0IGJlZ2luIHdpdGggdGFnOjosIGZvciBleGFtcGxlOiBqdWljZXIuc2V0XG4gICAgLy8gKCd0YWc6Om9wZXJhdGlvbk9wZW4nLCAne0AnKS5cblxuICAgIGp1aWNlci5zZXQgPSBmdW5jdGlvbihjb25mLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGVzY2FwZVBhdHRlcm4gPSBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICByZXR1cm4gdi5yZXBsYWNlKC9bXFwkXFwoXFwpXFxbXFxdXFwrXFxeXFx7XFx9XFw/XFwqXFx8XFwuXS9pZ20sIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1xcXFwnICsgJDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzZXQgPSBmdW5jdGlvbihjb25mLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHRhZyA9IGNvbmYubWF0Y2goL150YWc6OiguKikkL2kpO1xuXG4gICAgICAgICAgICBpZih0YWcpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRhZ3NbdGFnWzFdXSA9IGVzY2FwZVBhdHRlcm4odmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoYXQudGFnSW5pdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC5vcHRpb25zW2NvbmZdID0gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgc2V0KGNvbmYsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNvbmYgPT09IE9iamVjdChjb25mKSkge1xuICAgICAgICAgICAgZm9yKHZhciBpIGluIGNvbmYpIHtcbiAgICAgICAgICAgICAgICBpZihjb25mLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldChpLCBjb25mW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQmVmb3JlIHlvdSdyZSB1c2luZyBjdXN0b20gZnVuY3Rpb25zIGluIHlvdXIgdGVtcGxhdGUgbGlrZSAke25hbWUgfCBmbk5hbWV9LFxuICAgIC8vIHlvdSBuZWVkIHRvIHJlZ2lzdGVyIHRoaXMgZm4gYnkganVpY2VyLnJlZ2lzdGVyKCdmbk5hbWUnLCBmbikuXG5cbiAgICBqdWljZXIucmVnaXN0ZXIgPSBmdW5jdGlvbihmbmFtZSwgZm4pIHtcbiAgICAgICAgdmFyIF9tZXRob2QgPSB0aGlzLm9wdGlvbnMuX21ldGhvZDtcblxuICAgICAgICBpZihfbWV0aG9kLmhhc093blByb3BlcnR5KGZuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9tZXRob2RbZm5hbWVdID0gZm47XG4gICAgfTtcblxuICAgIC8vIHJlbW92ZSB0aGUgcmVnaXN0ZXJlZCBmdW5jdGlvbiBpbiB0aGUgbWVtb3J5IGJ5IHRoZSBwcm92aWRlZCBmdW5jdGlvbiBuYW1lLlxuICAgIC8vIGZvciBleGFtcGxlOiBqdWljZXIudW5yZWdpc3RlcignZm5OYW1lJykuXG5cbiAgICBqdWljZXIudW5yZWdpc3RlciA9IGZ1bmN0aW9uKGZuYW1lKSB7XG4gICAgICAgIHZhciBfbWV0aG9kID0gdGhpcy5vcHRpb25zLl9tZXRob2Q7XG5cbiAgICAgICAgaWYoX21ldGhvZC5oYXNPd25Qcm9wZXJ0eShmbmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgX21ldGhvZFtmbmFtZV07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAganVpY2VyLnRlbXBsYXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgICAgICB0aGlzLl9faW50ZXJwb2xhdGUgPSBmdW5jdGlvbihfbmFtZSwgX2VzY2FwZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIF9kZWZpbmUgPSBfbmFtZS5zcGxpdCgnfCcpLCBfZm4gPSBfZGVmaW5lWzBdIHx8ICcnLCBfY2x1c3RlcjtcblxuICAgICAgICAgICAgaWYoX2RlZmluZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgX25hbWUgPSBfZGVmaW5lLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgX2NsdXN0ZXIgPSBfZGVmaW5lLnNoaWZ0KCkuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBfZm4gPSAnX21ldGhvZC4nICsgX2NsdXN0ZXIuc2hpZnQoKSArICcuY2FsbCh7fSwgJyArIFtfbmFtZV0uY29uY2F0KF9jbHVzdGVyKSArICcpJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICc8JT0gJyArIChfZXNjYXBlID8gJ19tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nJyA6ICcnKSArICcoJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAoIW9wdGlvbnMgfHwgb3B0aW9ucy5kZXRlY3Rpb24gIT09IGZhbHNlID8gJ19tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbicgOiAnJykgKyAnKCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKScgK1xuICAgICAgICAgICAgICAgICAgICAnKScgK1xuICAgICAgICAgICAgICAgICcgJT4nO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19yZW1vdmVTaGVsbCA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIF9jb3VudGVyID0gMDtcblxuICAgICAgICAgICAgdHBsID0gdHBsXG4gICAgICAgICAgICAgICAgLy8gaW5saW5lIGhlbHBlciByZWdpc3RlclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5oZWxwZXJSZWdpc3RlciwgZnVuY3Rpb24oJCwgaGVscGVyTmFtZSwgZm5UZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbm5vID0gYW5ub3RhdGUoZm5UZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuQXJncyA9IGFubm9bMF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbkJvZHkgPSBhbm5vWzFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oZm5BcmdzLmpvaW4oJywnKSwgZm5Cb2R5KTtcblxuICAgICAgICAgICAgICAgICAgICBqdWljZXIucmVnaXN0ZXIoaGVscGVyTmFtZSwgZm4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gZm9yIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQsIGZ1bmN0aW9uKCQsIF9uYW1lLCBhbGlhcywga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGlhcyA9IGFsaWFzIHx8ICd2YWx1ZScsIGtleSA9IGtleSAmJiBrZXkuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdGUgPSAnaScgKyBfY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH5mdW5jdGlvbigpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcih2YXIgJyArIF9pdGVyYXRlICsgJyBpbiAnICsgX25hbWUgKyAnKSB7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWYoJyArIF9uYW1lICsgJy5oYXNPd25Qcm9wZXJ0eSgnICsgX2l0ZXJhdGUgKyAnKSkgeycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YXIgJyArIGFsaWFzICsgJz0nICsgX25hbWUgKyAnWycgKyBfaXRlcmF0ZSArICddOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXkgPyAoJ3ZhciAnICsga2V5ICsgJz0nICsgX2l0ZXJhdGUgKyAnOycpIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICU+JztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5mb3JlbmQsICc8JSB9fX0oKTsgJT4nKVxuXG4gICAgICAgICAgICAgICAgLy8gaWYgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pZnN0YXJ0LCBmdW5jdGlvbigkLCBjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSBpZignICsgY29uZGl0aW9uICsgJykgeyAlPic7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaWZlbmQsICc8JSB9ICU+JylcblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlc3RhcnQsIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSB9IGVsc2UgeyAlPic7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgaWYgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlaWZzdGFydCwgZnVuY3Rpb24oJCwgY29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCUgfSBlbHNlIGlmKCcgKyBjb25kaXRpb24gKyAnKSB7ICU+JztcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gaW50ZXJwb2xhdGUgd2l0aG91dCBlc2NhcGVcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3Mubm9uZWVuY29kZSwgZnVuY3Rpb24oJCwgX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuX19pbnRlcnBvbGF0ZShfbmFtZSwgZmFsc2UsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBpbnRlcnBvbGF0ZSB3aXRoIGVzY2FwZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbnRlcnBvbGF0ZSwgZnVuY3Rpb24oJCwgX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoYXQuX19pbnRlcnBvbGF0ZShfbmFtZSwgdHJ1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGNsZWFuIHVwIGNvbW1lbnRzXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmlubGluZWNvbW1lbnQsICcnKVxuXG4gICAgICAgICAgICAgICAgLy8gcmFuZ2UgZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5yYW5nZXN0YXJ0LCBmdW5jdGlvbigkLCBfbmFtZSwgc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdGUgPSAnaicgKyBfY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH5mdW5jdGlvbigpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcih2YXIgJyArIF9pdGVyYXRlICsgJz0nICsgc3RhcnQgKyAnOycgKyBfaXRlcmF0ZSArICc8JyArIGVuZCArICc7JyArIF9pdGVyYXRlICsgJysrKSB7eycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhciAnICsgX25hbWUgKyAnPScgKyBfaXRlcmF0ZSArICc7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAlPic7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGluY2x1ZGUgc3ViLXRlbXBsYXRlXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmluY2x1ZGUsIGZ1bmN0aW9uKCQsIHRwbCwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYXRpYmxlIGZvciBub2RlLmpzXG4gICAgICAgICAgICAgICAgICAgIGlmKHRwbC5tYXRjaCgvXmZpbGVcXDpcXC9cXC8vaWdtKSkgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCU9IF9tZXRob2QuX19qdWljZXIoJyArIHRwbCArICcsICcgKyBkYXRhICsgJyk7ICU+JztcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZXhjZXB0aW9uIGhhbmRsaW5nXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmVycm9yaGFuZGxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdHBsID0gJzwlIHRyeSB7ICU+JyArIHRwbDtcbiAgICAgICAgICAgICAgICB0cGwgKz0gJzwlIH0gY2F0Y2goZSkge19tZXRob2QuX190aHJvdyhcIkp1aWNlciBSZW5kZXIgRXhjZXB0aW9uOiBcIitlLm1lc3NhZ2UpO30gJT4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHBsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX190b05hdGl2ZSA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19jb252ZXJ0KHRwbCwgIW9wdGlvbnMgfHwgb3B0aW9ucy5zdHJpcCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fX2xleGljYWxBbmFseXplID0gZnVuY3Rpb24odHBsKSB7XG4gICAgICAgICAgICB2YXIgYnVmZmVyID0gW107XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gW107XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gJyc7XG4gICAgICAgICAgICB2YXIgcmVzZXJ2ZWQgPSBbXG4gICAgICAgICAgICAgICAgJ2lmJywgJ2VhY2gnLCAnXycsICdfbWV0aG9kJywgJ2NvbnNvbGUnLCBcbiAgICAgICAgICAgICAgICAnYnJlYWsnLCAnY2FzZScsICdjYXRjaCcsICdjb250aW51ZScsICdkZWJ1Z2dlcicsICdkZWZhdWx0JywgJ2RlbGV0ZScsICdkbycsIFxuICAgICAgICAgICAgICAgICdmaW5hbGx5JywgJ2ZvcicsICdmdW5jdGlvbicsICdpbicsICdpbnN0YW5jZW9mJywgJ25ldycsICdyZXR1cm4nLCAnc3dpdGNoJywgXG4gICAgICAgICAgICAgICAgJ3RoaXMnLCAndGhyb3cnLCAndHJ5JywgJ3R5cGVvZicsICd2YXInLCAndm9pZCcsICd3aGlsZScsICd3aXRoJywgJ251bGwnLCAndHlwZW9mJywgXG4gICAgICAgICAgICAgICAgJ2NsYXNzJywgJ2VudW0nLCAnZXhwb3J0JywgJ2V4dGVuZHMnLCAnaW1wb3J0JywgJ3N1cGVyJywgJ2ltcGxlbWVudHMnLCAnaW50ZXJmYWNlJywgXG4gICAgICAgICAgICAgICAgJ2xldCcsICdwYWNrYWdlJywgJ3ByaXZhdGUnLCAncHJvdGVjdGVkJywgJ3B1YmxpYycsICdzdGF0aWMnLCAneWllbGQnLCAnY29uc3QnLCAnYXJndW1lbnRzJywgXG4gICAgICAgICAgICAgICAgJ3RydWUnLCAnZmFsc2UnLCAndW5kZWZpbmVkJywgJ05hTidcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHZhciBpbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlQW5hbHl6ZSA9IGZ1bmN0aW9uKCQsIHN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHN0YXRlbWVudC5tYXRjaCgvXFx3Ky9pZ20pWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5kZXhPZihidWZmZXIsIHN0YXRlbWVudCkgPT09IC0xICYmIGluZGV4T2YocmVzZXJ2ZWQsIHN0YXRlbWVudCkgPT09IC0xICYmIGluZGV4T2YobWV0aG9kLCBzdGF0ZW1lbnQpID09PSAtMSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIHJlLWRlY2xhcmUgbmF0aXZlIGZ1bmN0aW9uLCBpZiBub3QgZG8gdGhpcywgdGVtcGxhdGUgXG4gICAgICAgICAgICAgICAgICAgIC8vIGB7QGlmIGVuY29kZVVSSUNvbXBvbmVudChuYW1lKX1gIGNvdWxkIGJlIHRocm93IHVuZGVmaW5lZC5cblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Yod2luZG93KSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mKHdpbmRvd1tzdGF0ZW1lbnRdKSA9PT0gJ2Z1bmN0aW9uJyAmJiB3aW5kb3dbc3RhdGVtZW50XS50b1N0cmluZygpLm1hdGNoKC9eXFxzKj9mdW5jdGlvbiBcXHcrXFwoXFwpIFxce1xccyo/XFxbbmF0aXZlIGNvZGVcXF1cXHMqP1xcfVxccyo/JC9pKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYXRpYmxlIGZvciBub2RlLmpzXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihnbG9iYWwpICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YoZ2xvYmFsW3N0YXRlbWVudF0pID09PSAnZnVuY3Rpb24nICYmIGdsb2JhbFtzdGF0ZW1lbnRdLnRvU3RyaW5nKCkubWF0Y2goL15cXHMqP2Z1bmN0aW9uIFxcdytcXChcXCkgXFx7XFxzKj9cXFtuYXRpdmUgY29kZVxcXVxccyo/XFx9XFxzKj8kL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIHJlLWRlY2xhcmUgcmVnaXN0ZXJlZCBmdW5jdGlvbiwgaWYgbm90IGRvIHRoaXMsIHRlbXBsYXRlIFxuICAgICAgICAgICAgICAgICAgICAvLyBge0BpZiByZWdpc3RlcmVkX2Z1bmMobmFtZSl9YCBjb3VsZCBiZSB0aHJvdyB1bmRlZmluZWQuXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKGp1aWNlci5vcHRpb25zLl9tZXRob2Rbc3RhdGVtZW50XSkgPT09ICdmdW5jdGlvbicgfHwganVpY2VyLm9wdGlvbnMuX21ldGhvZC5oYXNPd25Qcm9wZXJ0eShzdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBidWZmZXIucHVzaChzdGF0ZW1lbnQpOyAvLyBmdWNrIGllXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0cGwucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZm9yc3RhcnQsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaW50ZXJwb2xhdGUsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaWZzdGFydCwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5lbHNlaWZzdGFydCwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbmNsdWRlLCB2YXJpYWJsZUFuYWx5emUpLlxuICAgICAgICAgICAgICAgIHJlcGxhY2UoL1tcXCtcXC1cXCpcXC8lIVxcP1xcfFxcXiZ+PD49LFxcKFxcKVxcW1xcXV1cXHMqKFtBLVphLXpfXSspL2lnbSwgdmFyaWFibGVBbmFseXplKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ICs9ICd2YXIgJyArIGJ1ZmZlcltpXSArICc9Xy4nICsgYnVmZmVyW2ldICsgJzsnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2kgPCBtZXRob2QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggKz0gJ3ZhciAnICsgbWV0aG9kW2ldICsgJz1fbWV0aG9kLicgKyBtZXRob2RbaV0gKyAnOyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAnPCUgJyArIHByZWZpeCArICcgJT4nO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19jb252ZXJ0PWZ1bmN0aW9uKHRwbCwgc3RyaXApIHtcbiAgICAgICAgICAgIHZhciBidWZmZXIgPSBbXS5qb2luKCcnKTtcblxuICAgICAgICAgICAgYnVmZmVyICs9IFwiJ3VzZSBzdHJpY3QnO1wiOyAvLyB1c2Ugc3RyaWN0IG1vZGVcbiAgICAgICAgICAgIGJ1ZmZlciArPSBcInZhciBfPV98fHt9O1wiO1xuICAgICAgICAgICAgYnVmZmVyICs9IFwidmFyIF9vdXQ9Jyc7X291dCs9J1wiO1xuXG4gICAgICAgICAgICBpZihzdHJpcCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIgKz0gdHBsXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJyg/PVteJV0qJT4pL2csIFwiXFx0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIidcIikuam9pbihcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIlxcdFwiKS5qb2luKFwiJ1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPCU9KC4rPyklPi9nLCBcIic7X291dCs9JDE7X291dCs9J1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCI8JVwiKS5qb2luKFwiJztcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJT5cIikuam9pbihcIl9vdXQrPSdcIikrXG4gICAgICAgICAgICAgICAgICAgIFwiJztyZXR1cm4gX291dDtcIjtcblxuICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1ZmZlciArPSB0cGxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xccl0vZywgXCJcXFxcclwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcdF0vZywgXCJcXFxcdFwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcbl0vZywgXCJcXFxcblwiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJyg/PVteJV0qJT4pL2csIFwiXFx0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIidcIikuam9pbihcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIlxcdFwiKS5qb2luKFwiJ1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPCU9KC4rPyklPi9nLCBcIic7X291dCs9JDE7X291dCs9J1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCI8JVwiKS5qb2luKFwiJztcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJT5cIikuam9pbihcIl9vdXQrPSdcIikrXG4gICAgICAgICAgICAgICAgICAgIFwiJztyZXR1cm4gX291dC5yZXBsYWNlKC9bXFxcXHJcXFxcbl1cXFxccytbXFxcXHJcXFxcbl0vZywgJ1xcXFxyXFxcXG4nKTtcIjtcblxuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmxvb3NlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRwbCA9IHRoaXMuX19sZXhpY2FsQW5hbHl6ZSh0cGwpICsgdHBsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cGwgPSB0aGlzLl9fcmVtb3ZlU2hlbGwodHBsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRwbCA9IHRoaXMuX190b05hdGl2ZSh0cGwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIgPSBuZXcgRnVuY3Rpb24oJ18sIF9tZXRob2QnLCB0cGwpO1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKF8sIF9tZXRob2QpIHtcbiAgICAgICAgICAgICAgICBpZighX21ldGhvZCB8fCBfbWV0aG9kICE9PSB0aGF0Lm9wdGlvbnMuX21ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBfbWV0aG9kID0gX19jcmVhdG9yKF9tZXRob2QsIHRoYXQub3B0aW9ucy5fbWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoYXQuX3JlbmRlci5jYWxsKHRoaXMsIF8sIF9tZXRob2QpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGp1aWNlci5jb21waWxlID0gZnVuY3Rpb24odHBsLCBvcHRpb25zKSB7XG4gICAgICAgIGlmKCFvcHRpb25zIHx8IG9wdGlvbnMgIT09IHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IF9fY3JlYXRvcihvcHRpb25zLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBlbmdpbmUgPSB0aGlzLl9fY2FjaGVbdHBsXSA/IFxuICAgICAgICAgICAgICAgIHRoaXMuX19jYWNoZVt0cGxdIDogXG4gICAgICAgICAgICAgICAgbmV3IHRoaXMudGVtcGxhdGUodGhpcy5vcHRpb25zKS5wYXJzZSh0cGwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zLmNhY2hlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19jYWNoZVt0cGxdID0gZW5naW5lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZW5naW5lO1xuXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgX190aHJvdygnSnVpY2VyIENvbXBpbGUgRXhjZXB0aW9uOiAnICsgZS5tZXNzYWdlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge30gLy8gbm9vcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBqdWljZXIudG9faHRtbCA9IGZ1bmN0aW9uKHRwbCwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zICE9PSB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfX2NyZWF0b3Iob3B0aW9ucywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBpbGUodHBsLCBvcHRpb25zKS5yZW5kZXIoZGF0YSwgb3B0aW9ucy5fbWV0aG9kKTtcbiAgICB9O1xuICAgIHdpbmRvdy5qdWljZXIgPSBqdWljZXI7XG4gICAgdHlwZW9mKG1vZHVsZSkgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBqdWljZXIgOiB0aGlzLmp1aWNlciA9IGp1aWNlcjtcblxufSkoKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKipcbiAqIEBsaWNlbnNlXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIGxvZGFzaC5jb20vbGljZW5zZSB8IFVuZGVyc2NvcmUuanMgMS41LjIgdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFXG4gKiBCdWlsZDogYGxvZGFzaCAtbyAuL2Rpc3QvbG9kYXNoLmNvbXBhdC5qc2BcbiAqL1xuOyhmdW5jdGlvbigpe2Z1bmN0aW9uIG4obix0LGUpe2U9KGV8fDApLTE7Zm9yKHZhciByPW4/bi5sZW5ndGg6MDsrK2U8cjspaWYobltlXT09PXQpcmV0dXJuIGU7cmV0dXJuLTF9ZnVuY3Rpb24gdCh0LGUpe3ZhciByPXR5cGVvZiBlO2lmKHQ9dC5sLFwiYm9vbGVhblwiPT1yfHxudWxsPT1lKXJldHVybiB0W2VdPzA6LTE7XCJudW1iZXJcIiE9ciYmXCJzdHJpbmdcIiE9ciYmKHI9XCJvYmplY3RcIik7dmFyIHU9XCJudW1iZXJcIj09cj9lOmIrZTtyZXR1cm4gdD0odD10W3JdKSYmdFt1XSxcIm9iamVjdFwiPT1yP3QmJi0xPG4odCxlKT8wOi0xOnQ/MDotMX1mdW5jdGlvbiBlKG4pe3ZhciB0PXRoaXMubCxlPXR5cGVvZiBuO2lmKFwiYm9vbGVhblwiPT1lfHxudWxsPT1uKXRbbl09dHJ1ZTtlbHNle1wibnVtYmVyXCIhPWUmJlwic3RyaW5nXCIhPWUmJihlPVwib2JqZWN0XCIpO3ZhciByPVwibnVtYmVyXCI9PWU/bjpiK24sdD10W2VdfHwodFtlXT17fSk7XCJvYmplY3RcIj09ZT8odFtyXXx8KHRbcl09W10pKS5wdXNoKG4pOnRbcl09dHJ1ZVxufX1mdW5jdGlvbiByKG4pe3JldHVybiBuLmNoYXJDb2RlQXQoMCl9ZnVuY3Rpb24gdShuLHQpe2Zvcih2YXIgZT1uLm0scj10Lm0sdT0tMSxvPWUubGVuZ3RoOysrdTxvOyl7dmFyIGE9ZVt1XSxpPXJbdV07aWYoYSE9PWkpe2lmKGE+aXx8dHlwZW9mIGE9PVwidW5kZWZpbmVkXCIpcmV0dXJuIDE7aWYoYTxpfHx0eXBlb2YgaT09XCJ1bmRlZmluZWRcIilyZXR1cm4tMX19cmV0dXJuIG4ubi10Lm59ZnVuY3Rpb24gbyhuKXt2YXIgdD0tMSxyPW4ubGVuZ3RoLHU9blswXSxvPW5bci8yfDBdLGE9bltyLTFdO2lmKHUmJnR5cGVvZiB1PT1cIm9iamVjdFwiJiZvJiZ0eXBlb2Ygbz09XCJvYmplY3RcIiYmYSYmdHlwZW9mIGE9PVwib2JqZWN0XCIpcmV0dXJuIGZhbHNlO2Zvcih1PWwoKSx1W1wiZmFsc2VcIl09dVtcIm51bGxcIl09dVtcInRydWVcIl09dS51bmRlZmluZWQ9ZmFsc2Usbz1sKCksby5rPW4sby5sPXUsby5wdXNoPWU7Kyt0PHI7KW8ucHVzaChuW3RdKTtyZXR1cm4gb31mdW5jdGlvbiBhKG4pe3JldHVyblwiXFxcXFwiK1lbbl1cbn1mdW5jdGlvbiBpKCl7cmV0dXJuIHYucG9wKCl8fFtdfWZ1bmN0aW9uIGwoKXtyZXR1cm4geS5wb3AoKXx8e2s6bnVsbCxsOm51bGwsbTpudWxsLFwiZmFsc2VcIjpmYWxzZSxuOjAsXCJudWxsXCI6ZmFsc2UsbnVtYmVyOm51bGwsb2JqZWN0Om51bGwscHVzaDpudWxsLHN0cmluZzpudWxsLFwidHJ1ZVwiOmZhbHNlLHVuZGVmaW5lZDpmYWxzZSxvOm51bGx9fWZ1bmN0aW9uIGYobil7cmV0dXJuIHR5cGVvZiBuLnRvU3RyaW5nIT1cImZ1bmN0aW9uXCImJnR5cGVvZihuK1wiXCIpPT1cInN0cmluZ1wifWZ1bmN0aW9uIGMobil7bi5sZW5ndGg9MCx2Lmxlbmd0aDx3JiZ2LnB1c2gobil9ZnVuY3Rpb24gcChuKXt2YXIgdD1uLmw7dCYmcCh0KSxuLms9bi5sPW4ubT1uLm9iamVjdD1uLm51bWJlcj1uLnN0cmluZz1uLm89bnVsbCx5Lmxlbmd0aDx3JiZ5LnB1c2gobil9ZnVuY3Rpb24gcyhuLHQsZSl7dHx8KHQ9MCksdHlwZW9mIGU9PVwidW5kZWZpbmVkXCImJihlPW4/bi5sZW5ndGg6MCk7dmFyIHI9LTE7ZT1lLXR8fDA7Zm9yKHZhciB1PUFycmF5KDA+ZT8wOmUpOysrcjxlOyl1W3JdPW5bdCtyXTtcbnJldHVybiB1fWZ1bmN0aW9uIGcoZSl7ZnVuY3Rpb24gdihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJiFxZShuKSYmd2UuY2FsbChuLFwiX193cmFwcGVkX19cIik/bjpuZXcgeShuKX1mdW5jdGlvbiB5KG4sdCl7dGhpcy5fX2NoYWluX189ISF0LHRoaXMuX193cmFwcGVkX189bn1mdW5jdGlvbiB3KG4pe2Z1bmN0aW9uIHQoKXtpZihyKXt2YXIgbj1zKHIpO2plLmFwcGx5KG4sYXJndW1lbnRzKX1pZih0aGlzIGluc3RhbmNlb2YgdCl7dmFyIG89bnQoZS5wcm90b3R5cGUpLG49ZS5hcHBseShvLG58fGFyZ3VtZW50cyk7cmV0dXJuIHh0KG4pP246b31yZXR1cm4gZS5hcHBseSh1LG58fGFyZ3VtZW50cyl9dmFyIGU9blswXSxyPW5bMl0sdT1uWzRdO3JldHVybiB6ZSh0LG4pLHR9ZnVuY3Rpb24gWShuLHQsZSxyLHUpe2lmKGUpe3ZhciBvPWUobik7aWYodHlwZW9mIG8hPVwidW5kZWZpbmVkXCIpcmV0dXJuIG99aWYoIXh0KG4pKXJldHVybiBuO3ZhciBhPWhlLmNhbGwobik7aWYoIVZbYV18fCFMZS5ub2RlQ2xhc3MmJmYobikpcmV0dXJuIG47XG52YXIgbD1UZVthXTtzd2l0Y2goYSl7Y2FzZSBMOmNhc2UgejpyZXR1cm4gbmV3IGwoK24pO2Nhc2UgVzpjYXNlIE06cmV0dXJuIG5ldyBsKG4pO2Nhc2UgSjpyZXR1cm4gbz1sKG4uc291cmNlLFMuZXhlYyhuKSksby5sYXN0SW5kZXg9bi5sYXN0SW5kZXgsb31pZihhPXFlKG4pLHQpe3ZhciBwPSFyO3J8fChyPWkoKSksdXx8KHU9aSgpKTtmb3IodmFyIGc9ci5sZW5ndGg7Zy0tOylpZihyW2ddPT1uKXJldHVybiB1W2ddO289YT9sKG4ubGVuZ3RoKTp7fX1lbHNlIG89YT9zKG4pOlllKHt9LG4pO3JldHVybiBhJiYod2UuY2FsbChuLFwiaW5kZXhcIikmJihvLmluZGV4PW4uaW5kZXgpLHdlLmNhbGwobixcImlucHV0XCIpJiYoby5pbnB1dD1uLmlucHV0KSksdD8oci5wdXNoKG4pLHUucHVzaChvKSwoYT9YZTp0cikobixmdW5jdGlvbihuLGEpe29bYV09WShuLHQsZSxyLHUpfSkscCYmKGMociksYyh1KSksbyk6b31mdW5jdGlvbiBudChuKXtyZXR1cm4geHQobik/U2Uobik6e319ZnVuY3Rpb24gdHQobix0LGUpe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpcmV0dXJuIEh0O1xuaWYodHlwZW9mIHQ9PVwidW5kZWZpbmVkXCJ8fCEoXCJwcm90b3R5cGVcImluIG4pKXJldHVybiBuO3ZhciByPW4uX19iaW5kRGF0YV9fO2lmKHR5cGVvZiByPT1cInVuZGVmaW5lZFwiJiYoTGUuZnVuY05hbWVzJiYocj0hbi5uYW1lKSxyPXJ8fCFMZS5mdW5jRGVjb21wLCFyKSl7dmFyIHU9YmUuY2FsbChuKTtMZS5mdW5jTmFtZXN8fChyPSFBLnRlc3QodSkpLHJ8fChyPUIudGVzdCh1KSx6ZShuLHIpKX1pZihmYWxzZT09PXJ8fHRydWUhPT1yJiYxJnJbMV0pcmV0dXJuIG47c3dpdGNoKGUpe2Nhc2UgMTpyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIG4uY2FsbCh0LGUpfTtjYXNlIDI6cmV0dXJuIGZ1bmN0aW9uKGUscil7cmV0dXJuIG4uY2FsbCh0LGUscil9O2Nhc2UgMzpyZXR1cm4gZnVuY3Rpb24oZSxyLHUpe3JldHVybiBuLmNhbGwodCxlLHIsdSl9O2Nhc2UgNDpyZXR1cm4gZnVuY3Rpb24oZSxyLHUsbyl7cmV0dXJuIG4uY2FsbCh0LGUscix1LG8pfX1yZXR1cm4gTXQobix0KX1mdW5jdGlvbiBldChuKXtmdW5jdGlvbiB0KCl7dmFyIG49bD9hOnRoaXM7XG5pZih1KXt2YXIgaD1zKHUpO2plLmFwcGx5KGgsYXJndW1lbnRzKX1yZXR1cm4ob3x8YykmJihofHwoaD1zKGFyZ3VtZW50cykpLG8mJmplLmFwcGx5KGgsbyksYyYmaC5sZW5ndGg8aSk/KHJ8PTE2LGV0KFtlLHA/cjotNCZyLGgsbnVsbCxhLGldKSk6KGh8fChoPWFyZ3VtZW50cyksZiYmKGU9bltnXSksdGhpcyBpbnN0YW5jZW9mIHQ/KG49bnQoZS5wcm90b3R5cGUpLGg9ZS5hcHBseShuLGgpLHh0KGgpP2g6bik6ZS5hcHBseShuLGgpKX12YXIgZT1uWzBdLHI9blsxXSx1PW5bMl0sbz1uWzNdLGE9bls0XSxpPW5bNV0sbD0xJnIsZj0yJnIsYz00JnIscD04JnIsZz1lO3JldHVybiB6ZSh0LG4pLHR9ZnVuY3Rpb24gcnQoZSxyKXt2YXIgdT0tMSxhPWh0KCksaT1lP2UubGVuZ3RoOjAsbD1pPj1fJiZhPT09bixmPVtdO2lmKGwpe3ZhciBjPW8ocik7Yz8oYT10LHI9Yyk6bD1mYWxzZX1mb3IoOysrdTxpOyljPWVbdV0sMD5hKHIsYykmJmYucHVzaChjKTtyZXR1cm4gbCYmcChyKSxmfWZ1bmN0aW9uIG90KG4sdCxlLHIpe3I9KHJ8fDApLTE7XG5mb3IodmFyIHU9bj9uLmxlbmd0aDowLG89W107KytyPHU7KXt2YXIgYT1uW3JdO2lmKGEmJnR5cGVvZiBhPT1cIm9iamVjdFwiJiZ0eXBlb2YgYS5sZW5ndGg9PVwibnVtYmVyXCImJihxZShhKXx8ZHQoYSkpKXt0fHwoYT1vdChhLHQsZSkpO3ZhciBpPS0xLGw9YS5sZW5ndGgsZj1vLmxlbmd0aDtmb3Ioby5sZW5ndGgrPWw7KytpPGw7KW9bZisrXT1hW2ldfWVsc2UgZXx8by5wdXNoKGEpfXJldHVybiBvfWZ1bmN0aW9uIGF0KG4sdCxlLHIsdSxvKXtpZihlKXt2YXIgYT1lKG4sdCk7aWYodHlwZW9mIGEhPVwidW5kZWZpbmVkXCIpcmV0dXJuISFhfWlmKG49PT10KXJldHVybiAwIT09bnx8MS9uPT0xL3Q7aWYobj09PW4mJiEobiYmWFt0eXBlb2Ygbl18fHQmJlhbdHlwZW9mIHRdKSlyZXR1cm4gZmFsc2U7aWYobnVsbD09bnx8bnVsbD09dClyZXR1cm4gbj09PXQ7dmFyIGw9aGUuY2FsbChuKSxwPWhlLmNhbGwodCk7aWYobD09VCYmKGw9RykscD09VCYmKHA9RyksbCE9cClyZXR1cm4gZmFsc2U7c3dpdGNoKGwpe2Nhc2UgTDpjYXNlIHo6cmV0dXJuK249PSt0O1xuY2FzZSBXOnJldHVybiBuIT0rbj90IT0rdDowPT1uPzEvbj09MS90Om49PSt0O2Nhc2UgSjpjYXNlIE06cmV0dXJuIG49PWllKHQpfWlmKHA9bD09JCwhcCl7dmFyIHM9d2UuY2FsbChuLFwiX193cmFwcGVkX19cIiksZz13ZS5jYWxsKHQsXCJfX3dyYXBwZWRfX1wiKTtpZihzfHxnKXJldHVybiBhdChzP24uX193cmFwcGVkX186bixnP3QuX193cmFwcGVkX186dCxlLHIsdSxvKTtpZihsIT1HfHwhTGUubm9kZUNsYXNzJiYoZihuKXx8Zih0KSkpcmV0dXJuIGZhbHNlO2lmKGw9IUxlLmFyZ3NPYmplY3QmJmR0KG4pP29lOm4uY29uc3RydWN0b3Iscz0hTGUuYXJnc09iamVjdCYmZHQodCk/b2U6dC5jb25zdHJ1Y3RvcixsIT1zJiYhKGp0KGwpJiZsIGluc3RhbmNlb2YgbCYmanQocykmJnMgaW5zdGFuY2VvZiBzKSYmXCJjb25zdHJ1Y3RvclwiaW4gbiYmXCJjb25zdHJ1Y3RvclwiaW4gdClyZXR1cm4gZmFsc2V9Zm9yKGw9IXUsdXx8KHU9aSgpKSxvfHwobz1pKCkpLHM9dS5sZW5ndGg7cy0tOylpZih1W3NdPT1uKXJldHVybiBvW3NdPT10O1xudmFyIGg9MCxhPXRydWU7aWYodS5wdXNoKG4pLG8ucHVzaCh0KSxwKXtpZihzPW4ubGVuZ3RoLGg9dC5sZW5ndGgsKGE9aD09cyl8fHIpZm9yKDtoLS07KWlmKHA9cyxnPXRbaF0scilmb3IoO3AtLSYmIShhPWF0KG5bcF0sZyxlLHIsdSxvKSk7KTtlbHNlIGlmKCEoYT1hdChuW2hdLGcsZSxyLHUsbykpKWJyZWFrfWVsc2UgbnIodCxmdW5jdGlvbih0LGksbCl7cmV0dXJuIHdlLmNhbGwobCxpKT8oaCsrLGE9d2UuY2FsbChuLGkpJiZhdChuW2ldLHQsZSxyLHUsbykpOnZvaWQgMH0pLGEmJiFyJiZucihuLGZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gd2UuY2FsbChlLHQpP2E9LTE8LS1oOnZvaWQgMH0pO3JldHVybiB1LnBvcCgpLG8ucG9wKCksbCYmKGModSksYyhvKSksYX1mdW5jdGlvbiBpdChuLHQsZSxyLHUpeyhxZSh0KT9EdDp0cikodCxmdW5jdGlvbih0LG8pe3ZhciBhLGksbD10LGY9bltvXTtpZih0JiYoKGk9cWUodCkpfHxlcih0KSkpe2ZvcihsPXIubGVuZ3RoO2wtLTspaWYoYT1yW2xdPT10KXtmPXVbbF07XG5icmVha31pZighYSl7dmFyIGM7ZSYmKGw9ZShmLHQpLGM9dHlwZW9mIGwhPVwidW5kZWZpbmVkXCIpJiYoZj1sKSxjfHwoZj1pP3FlKGYpP2Y6W106ZXIoZik/Zjp7fSksci5wdXNoKHQpLHUucHVzaChmKSxjfHxpdChmLHQsZSxyLHUpfX1lbHNlIGUmJihsPWUoZix0KSx0eXBlb2YgbD09XCJ1bmRlZmluZWRcIiYmKGw9dCkpLHR5cGVvZiBsIT1cInVuZGVmaW5lZFwiJiYoZj1sKTtuW29dPWZ9KX1mdW5jdGlvbiBsdChuLHQpe3JldHVybiBuK2RlKEZlKCkqKHQtbisxKSl9ZnVuY3Rpb24gZnQoZSxyLHUpe3ZhciBhPS0xLGw9aHQoKSxmPWU/ZS5sZW5ndGg6MCxzPVtdLGc9IXImJmY+PV8mJmw9PT1uLGg9dXx8Zz9pKCk6cztmb3IoZyYmKGg9byhoKSxsPXQpOysrYTxmOyl7dmFyIHY9ZVthXSx5PXU/dSh2LGEsZSk6djsocj8hYXx8aFtoLmxlbmd0aC0xXSE9PXk6MD5sKGgseSkpJiYoKHV8fGcpJiZoLnB1c2goeSkscy5wdXNoKHYpKX1yZXR1cm4gZz8oYyhoLmspLHAoaCkpOnUmJmMoaCksc31mdW5jdGlvbiBjdChuKXtyZXR1cm4gZnVuY3Rpb24odCxlLHIpe3ZhciB1PXt9O1xuaWYoZT12LmNyZWF0ZUNhbGxiYWNrKGUsciwzKSxxZSh0KSl7cj0tMTtmb3IodmFyIG89dC5sZW5ndGg7KytyPG87KXt2YXIgYT10W3JdO24odSxhLGUoYSxyLHQpLHQpfX1lbHNlIFhlKHQsZnVuY3Rpb24odCxyLG8pe24odSx0LGUodCxyLG8pLG8pfSk7cmV0dXJuIHV9fWZ1bmN0aW9uIHB0KG4sdCxlLHIsdSxvKXt2YXIgYT0xJnQsaT00JnQsbD0xNiZ0LGY9MzImdDtpZighKDImdHx8anQobikpKXRocm93IG5ldyBsZTtsJiYhZS5sZW5ndGgmJih0Jj0tMTcsbD1lPWZhbHNlKSxmJiYhci5sZW5ndGgmJih0Jj0tMzMsZj1yPWZhbHNlKTt2YXIgYz1uJiZuLl9fYmluZERhdGFfXztyZXR1cm4gYyYmdHJ1ZSE9PWM/KGM9cyhjKSxjWzJdJiYoY1syXT1zKGNbMl0pKSxjWzNdJiYoY1szXT1zKGNbM10pKSwhYXx8MSZjWzFdfHwoY1s0XT11KSwhYSYmMSZjWzFdJiYodHw9OCksIWl8fDQmY1sxXXx8KGNbNV09byksbCYmamUuYXBwbHkoY1syXXx8KGNbMl09W10pLGUpLGYmJkVlLmFwcGx5KGNbM118fChjWzNdPVtdKSxyKSxjWzFdfD10LHB0LmFwcGx5KG51bGwsYykpOigxPT10fHwxNz09PXQ/dzpldCkoW24sdCxlLHIsdSxvXSlcbn1mdW5jdGlvbiBzdCgpe1EuaD1GLFEuYj1RLmM9US5nPVEuaT1cIlwiLFEuZT1cInRcIixRLmo9dHJ1ZTtmb3IodmFyIG4sdD0wO249YXJndW1lbnRzW3RdO3QrKylmb3IodmFyIGUgaW4gbilRW2VdPW5bZV07dD1RLmEsUS5kPS9eW14sXSsvLmV4ZWModClbMF0sbj1lZSx0PVwicmV0dXJuIGZ1bmN0aW9uKFwiK3QrXCIpe1wiLGU9UTt2YXIgcj1cInZhciBuLHQ9XCIrZS5kK1wiLEU9XCIrZS5lK1wiO2lmKCF0KXJldHVybiBFO1wiK2UuaStcIjtcIjtlLmI/KHIrPVwidmFyIHU9dC5sZW5ndGg7bj0tMTtpZihcIitlLmIrXCIpe1wiLExlLnVuaW5kZXhlZENoYXJzJiYocis9XCJpZihzKHQpKXt0PXQuc3BsaXQoJycpfVwiKSxyKz1cIndoaWxlKCsrbjx1KXtcIitlLmcrXCI7fX1lbHNle1wiKTpMZS5ub25FbnVtQXJncyYmKHIrPVwidmFyIHU9dC5sZW5ndGg7bj0tMTtpZih1JiZwKHQpKXt3aGlsZSgrK248dSl7bis9Jyc7XCIrZS5nK1wiO319ZWxzZXtcIiksTGUuZW51bVByb3RvdHlwZXMmJihyKz1cInZhciBHPXR5cGVvZiB0PT0nZnVuY3Rpb24nO1wiKSxMZS5lbnVtRXJyb3JQcm9wcyYmKHIrPVwidmFyIEY9dD09PWt8fHQgaW5zdGFuY2VvZiBFcnJvcjtcIik7XG52YXIgdT1bXTtpZihMZS5lbnVtUHJvdG90eXBlcyYmdS5wdXNoKCchKEcmJm49PVwicHJvdG90eXBlXCIpJyksTGUuZW51bUVycm9yUHJvcHMmJnUucHVzaCgnIShGJiYobj09XCJtZXNzYWdlXCJ8fG49PVwibmFtZVwiKSknKSxlLmomJmUuZilyKz1cInZhciBDPS0xLEQ9Qlt0eXBlb2YgdF0mJnYodCksdT1EP0QubGVuZ3RoOjA7d2hpbGUoKytDPHUpe249RFtDXTtcIix1Lmxlbmd0aCYmKHIrPVwiaWYoXCIrdS5qb2luKFwiJiZcIikrXCIpe1wiKSxyKz1lLmcrXCI7XCIsdS5sZW5ndGgmJihyKz1cIn1cIikscis9XCJ9XCI7ZWxzZSBpZihyKz1cImZvcihuIGluIHQpe1wiLGUuaiYmdS5wdXNoKFwibS5jYWxsKHQsIG4pXCIpLHUubGVuZ3RoJiYocis9XCJpZihcIit1LmpvaW4oXCImJlwiKStcIil7XCIpLHIrPWUuZytcIjtcIix1Lmxlbmd0aCYmKHIrPVwifVwiKSxyKz1cIn1cIixMZS5ub25FbnVtU2hhZG93cyl7Zm9yKHIrPVwiaWYodCE9PUEpe3ZhciBpPXQuY29uc3RydWN0b3Iscj10PT09KGkmJmkucHJvdG90eXBlKSxmPXQ9PT1KP0k6dD09PWs/ajpMLmNhbGwodCkseD15W2ZdO1wiLGs9MDs3Pms7aysrKXIrPVwibj0nXCIrZS5oW2tdK1wiJztpZigoIShyJiZ4W25dKSYmbS5jYWxsKHQsbikpXCIsZS5qfHwocis9XCJ8fCgheFtuXSYmdFtuXSE9PUFbbl0pXCIpLHIrPVwiKXtcIitlLmcrXCJ9XCI7XG5yKz1cIn1cIn1yZXR1cm4oZS5ifHxMZS5ub25FbnVtQXJncykmJihyKz1cIn1cIikscis9ZS5jK1wiO3JldHVybiBFXCIsbihcImQsaixrLG0sbyxwLHEscyx2LEEsQix5LEksSixMXCIsdCtyK1wifVwiKSh0dCxxLGNlLHdlLGQsZHQscWUsa3QsUS5mLHBlLFgsJGUsTSxzZSxoZSl9ZnVuY3Rpb24gZ3Qobil7cmV0dXJuIFZlW25dfWZ1bmN0aW9uIGh0KCl7dmFyIHQ9KHQ9di5pbmRleE9mKT09PXp0P246dDtyZXR1cm4gdH1mdW5jdGlvbiB2dChuKXtyZXR1cm4gdHlwZW9mIG49PVwiZnVuY3Rpb25cIiYmdmUudGVzdChuKX1mdW5jdGlvbiB5dChuKXt2YXIgdCxlO3JldHVybiFufHxoZS5jYWxsKG4pIT1HfHwodD1uLmNvbnN0cnVjdG9yLGp0KHQpJiYhKHQgaW5zdGFuY2VvZiB0KSl8fCFMZS5hcmdzQ2xhc3MmJmR0KG4pfHwhTGUubm9kZUNsYXNzJiZmKG4pP2ZhbHNlOkxlLm93bkxhc3Q/KG5yKG4sZnVuY3Rpb24obix0LHIpe3JldHVybiBlPXdlLmNhbGwocix0KSxmYWxzZX0pLGZhbHNlIT09ZSk6KG5yKG4sZnVuY3Rpb24obix0KXtlPXRcbn0pLHR5cGVvZiBlPT1cInVuZGVmaW5lZFwifHx3ZS5jYWxsKG4sZSkpfWZ1bmN0aW9uIG10KG4pe3JldHVybiBIZVtuXX1mdW5jdGlvbiBkdChuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJnR5cGVvZiBuLmxlbmd0aD09XCJudW1iZXJcIiYmaGUuY2FsbChuKT09VHx8ZmFsc2V9ZnVuY3Rpb24gYnQobix0LGUpe3ZhciByPVdlKG4pLHU9ci5sZW5ndGg7Zm9yKHQ9dHQodCxlLDMpO3UtLSYmKGU9clt1XSxmYWxzZSE9PXQobltlXSxlLG4pKTspO3JldHVybiBufWZ1bmN0aW9uIF90KG4pe3ZhciB0PVtdO3JldHVybiBucihuLGZ1bmN0aW9uKG4sZSl7anQobikmJnQucHVzaChlKX0pLHQuc29ydCgpfWZ1bmN0aW9uIHd0KG4pe2Zvcih2YXIgdD0tMSxlPVdlKG4pLHI9ZS5sZW5ndGgsdT17fTsrK3Q8cjspe3ZhciBvPWVbdF07dVtuW29dXT1vfXJldHVybiB1fWZ1bmN0aW9uIGp0KG4pe3JldHVybiB0eXBlb2Ygbj09XCJmdW5jdGlvblwifWZ1bmN0aW9uIHh0KG4pe3JldHVybiEoIW58fCFYW3R5cGVvZiBuXSlcbn1mdW5jdGlvbiBDdChuKXtyZXR1cm4gdHlwZW9mIG49PVwibnVtYmVyXCJ8fG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT1XfHxmYWxzZX1mdW5jdGlvbiBrdChuKXtyZXR1cm4gdHlwZW9mIG49PVwic3RyaW5nXCJ8fG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT1NfHxmYWxzZX1mdW5jdGlvbiBFdChuKXtmb3IodmFyIHQ9LTEsZT1XZShuKSxyPWUubGVuZ3RoLHU9WnQocik7Kyt0PHI7KXVbdF09bltlW3RdXTtyZXR1cm4gdX1mdW5jdGlvbiBPdChuLHQsZSl7dmFyIHI9LTEsdT1odCgpLG89bj9uLmxlbmd0aDowLGE9ZmFsc2U7cmV0dXJuIGU9KDA+ZT9CZSgwLG8rZSk6ZSl8fDAscWUobik/YT0tMTx1KG4sdCxlKTp0eXBlb2Ygbz09XCJudW1iZXJcIj9hPS0xPChrdChuKT9uLmluZGV4T2YodCxlKTp1KG4sdCxlKSk6WGUobixmdW5jdGlvbihuKXtyZXR1cm4rK3I8ZT92b2lkIDA6IShhPW49PT10KX0pLGF9ZnVuY3Rpb24gU3Qobix0LGUpe3ZhciByPXRydWU7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxxZShuKSl7ZT0tMTtcbmZvcih2YXIgdT1uLmxlbmd0aDsrK2U8dSYmKHI9ISF0KG5bZV0sZSxuKSk7KTt9ZWxzZSBYZShuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gcj0hIXQobixlLHUpfSk7cmV0dXJuIHJ9ZnVuY3Rpb24gQXQobix0LGUpe3ZhciByPVtdO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykscWUobikpe2U9LTE7Zm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1Oyl7dmFyIG89bltlXTt0KG8sZSxuKSYmci5wdXNoKG8pfX1lbHNlIFhlKG4sZnVuY3Rpb24obixlLHUpe3QobixlLHUpJiZyLnB1c2gobil9KTtyZXR1cm4gcn1mdW5jdGlvbiBJdChuLHQsZSl7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSwhcWUobikpe3ZhciByO3JldHVybiBYZShuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gdChuLGUsdSk/KHI9bixmYWxzZSk6dm9pZCAwfSkscn1lPS0xO2Zvcih2YXIgdT1uLmxlbmd0aDsrK2U8dTspe3ZhciBvPW5bZV07aWYodChvLGUsbikpcmV0dXJuIG99fWZ1bmN0aW9uIER0KG4sdCxlKXtpZih0JiZ0eXBlb2YgZT09XCJ1bmRlZmluZWRcIiYmcWUobikpe2U9LTE7XG5mb3IodmFyIHI9bi5sZW5ndGg7KytlPHImJmZhbHNlIT09dChuW2VdLGUsbik7KTt9ZWxzZSBYZShuLHQsZSk7cmV0dXJuIG59ZnVuY3Rpb24gTnQobix0LGUpe3ZhciByPW4sdT1uP24ubGVuZ3RoOjA7aWYodD10JiZ0eXBlb2YgZT09XCJ1bmRlZmluZWRcIj90OnR0KHQsZSwzKSxxZShuKSlmb3IoO3UtLSYmZmFsc2UhPT10KG5bdV0sdSxuKTspO2Vsc2V7aWYodHlwZW9mIHUhPVwibnVtYmVyXCIpdmFyIG89V2UobiksdT1vLmxlbmd0aDtlbHNlIExlLnVuaW5kZXhlZENoYXJzJiZrdChuKSYmKHI9bi5zcGxpdChcIlwiKSk7WGUobixmdW5jdGlvbihuLGUsYSl7cmV0dXJuIGU9bz9vWy0tdV06LS11LHQocltlXSxlLGEpfSl9cmV0dXJuIG59ZnVuY3Rpb24gQnQobix0LGUpe3ZhciByPS0xLHU9bj9uLmxlbmd0aDowLG89WnQodHlwZW9mIHU9PVwibnVtYmVyXCI/dTowKTtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHFlKG4pKWZvcig7KytyPHU7KW9bcl09dChuW3JdLHIsbik7ZWxzZSBYZShuLGZ1bmN0aW9uKG4sZSx1KXtvWysrcl09dChuLGUsdSlcbn0pO3JldHVybiBvfWZ1bmN0aW9uIFB0KG4sdCxlKXt2YXIgdT0tMS8wLG89dTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiJiZlJiZlW3RdPT09biYmKHQ9bnVsbCksbnVsbD09dCYmcWUobikpe2U9LTE7Zm9yKHZhciBhPW4ubGVuZ3RoOysrZTxhOyl7dmFyIGk9bltlXTtpPm8mJihvPWkpfX1lbHNlIHQ9bnVsbD09dCYma3Qobik/cjp2LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxYZShuLGZ1bmN0aW9uKG4sZSxyKXtlPXQobixlLHIpLGU+dSYmKHU9ZSxvPW4pfSk7cmV0dXJuIG99ZnVuY3Rpb24gUnQobix0LGUscil7dmFyIHU9Mz5hcmd1bWVudHMubGVuZ3RoO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LHIsNCkscWUobikpe3ZhciBvPS0xLGE9bi5sZW5ndGg7Zm9yKHUmJihlPW5bKytvXSk7KytvPGE7KWU9dChlLG5bb10sbyxuKX1lbHNlIFhlKG4sZnVuY3Rpb24obixyLG8pe2U9dT8odT1mYWxzZSxuKTp0KGUsbixyLG8pfSk7cmV0dXJuIGV9ZnVuY3Rpb24gRnQobix0LGUscil7dmFyIHU9Mz5hcmd1bWVudHMubGVuZ3RoO1xucmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LHIsNCksTnQobixmdW5jdGlvbihuLHIsbyl7ZT11Pyh1PWZhbHNlLG4pOnQoZSxuLHIsbyl9KSxlfWZ1bmN0aW9uIFR0KG4pe3ZhciB0PS0xLGU9bj9uLmxlbmd0aDowLHI9WnQodHlwZW9mIGU9PVwibnVtYmVyXCI/ZTowKTtyZXR1cm4gRHQobixmdW5jdGlvbihuKXt2YXIgZT1sdCgwLCsrdCk7clt0XT1yW2VdLHJbZV09bn0pLHJ9ZnVuY3Rpb24gJHQobix0LGUpe3ZhciByO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykscWUobikpe2U9LTE7Zm9yKHZhciB1PW4ubGVuZ3RoOysrZTx1JiYhKHI9dChuW2VdLGUsbikpOyk7fWVsc2UgWGUobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIShyPXQobixlLHUpKX0pO3JldHVybiEhcn1mdW5jdGlvbiBMdChuLHQsZSl7dmFyIHI9MCx1PW4/bi5sZW5ndGg6MDtpZih0eXBlb2YgdCE9XCJudW1iZXJcIiYmbnVsbCE9dCl7dmFyIG89LTE7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7KytvPHUmJnQobltvXSxvLG4pOylyKytcbn1lbHNlIGlmKHI9dCxudWxsPT1yfHxlKXJldHVybiBuP25bMF06aDtyZXR1cm4gcyhuLDAsUGUoQmUoMCxyKSx1KSl9ZnVuY3Rpb24genQodCxlLHIpe2lmKHR5cGVvZiByPT1cIm51bWJlclwiKXt2YXIgdT10P3QubGVuZ3RoOjA7cj0wPnI/QmUoMCx1K3IpOnJ8fDB9ZWxzZSBpZihyKXJldHVybiByPUt0KHQsZSksdFtyXT09PWU/cjotMTtyZXR1cm4gbih0LGUscil9ZnVuY3Rpb24gcXQobix0LGUpe2lmKHR5cGVvZiB0IT1cIm51bWJlclwiJiZudWxsIT10KXt2YXIgcj0wLHU9LTEsbz1uP24ubGVuZ3RoOjA7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7Kyt1PG8mJnQoblt1XSx1LG4pOylyKyt9ZWxzZSByPW51bGw9PXR8fGU/MTpCZSgwLHQpO3JldHVybiBzKG4scil9ZnVuY3Rpb24gS3Qobix0LGUscil7dmFyIHU9MCxvPW4/bi5sZW5ndGg6dTtmb3IoZT1lP3YuY3JlYXRlQ2FsbGJhY2soZSxyLDEpOkh0LHQ9ZSh0KTt1PG87KXI9dStvPj4+MSxlKG5bcl0pPHQ/dT1yKzE6bz1yO1xucmV0dXJuIHV9ZnVuY3Rpb24gV3Qobix0LGUscil7cmV0dXJuIHR5cGVvZiB0IT1cImJvb2xlYW5cIiYmbnVsbCE9dCYmKHI9ZSxlPXR5cGVvZiB0IT1cImZ1bmN0aW9uXCImJnImJnJbdF09PT1uP251bGw6dCx0PWZhbHNlKSxudWxsIT1lJiYoZT12LmNyZWF0ZUNhbGxiYWNrKGUsciwzKSksZnQobix0LGUpfWZ1bmN0aW9uIEd0KCl7Zm9yKHZhciBuPTE8YXJndW1lbnRzLmxlbmd0aD9hcmd1bWVudHM6YXJndW1lbnRzWzBdLHQ9LTEsZT1uP1B0KGFyKG4sXCJsZW5ndGhcIikpOjAscj1adCgwPmU/MDplKTsrK3Q8ZTspclt0XT1hcihuLHQpO3JldHVybiByfWZ1bmN0aW9uIEp0KG4sdCl7dmFyIGU9LTEscj1uP24ubGVuZ3RoOjAsdT17fTtmb3IodHx8IXJ8fHFlKG5bMF0pfHwodD1bXSk7KytlPHI7KXt2YXIgbz1uW2VdO3Q/dVtvXT10W2VdOm8mJih1W29bMF1dPW9bMV0pfXJldHVybiB1fWZ1bmN0aW9uIE10KG4sdCl7cmV0dXJuIDI8YXJndW1lbnRzLmxlbmd0aD9wdChuLDE3LHMoYXJndW1lbnRzLDIpLG51bGwsdCk6cHQobiwxLG51bGwsbnVsbCx0KVxufWZ1bmN0aW9uIFZ0KG4sdCxlKXt2YXIgcix1LG8sYSxpLGwsZixjPTAscD1mYWxzZSxzPXRydWU7aWYoIWp0KG4pKXRocm93IG5ldyBsZTtpZih0PUJlKDAsdCl8fDAsdHJ1ZT09PWUpdmFyIGc9dHJ1ZSxzPWZhbHNlO2Vsc2UgeHQoZSkmJihnPWUubGVhZGluZyxwPVwibWF4V2FpdFwiaW4gZSYmKEJlKHQsZS5tYXhXYWl0KXx8MCkscz1cInRyYWlsaW5nXCJpbiBlP2UudHJhaWxpbmc6cyk7dmFyIHY9ZnVuY3Rpb24oKXt2YXIgZT10LShpcigpLWEpOzA8ZT9sPUNlKHYsZSk6KHUmJm1lKHUpLGU9Zix1PWw9Zj1oLGUmJihjPWlyKCksbz1uLmFwcGx5KGksciksbHx8dXx8KHI9aT1udWxsKSkpfSx5PWZ1bmN0aW9uKCl7bCYmbWUobCksdT1sPWY9aCwoc3x8cCE9PXQpJiYoYz1pcigpLG89bi5hcHBseShpLHIpLGx8fHV8fChyPWk9bnVsbCkpfTtyZXR1cm4gZnVuY3Rpb24oKXtpZihyPWFyZ3VtZW50cyxhPWlyKCksaT10aGlzLGY9cyYmKGx8fCFnKSxmYWxzZT09PXApdmFyIGU9ZyYmIWw7ZWxzZXt1fHxnfHwoYz1hKTtcbnZhciBoPXAtKGEtYyksbT0wPj1oO20/KHUmJih1PW1lKHUpKSxjPWEsbz1uLmFwcGx5KGkscikpOnV8fCh1PUNlKHksaCkpfXJldHVybiBtJiZsP2w9bWUobCk6bHx8dD09PXB8fChsPUNlKHYsdCkpLGUmJihtPXRydWUsbz1uLmFwcGx5KGkscikpLCFtfHxsfHx1fHwocj1pPW51bGwpLG99fWZ1bmN0aW9uIEh0KG4pe3JldHVybiBufWZ1bmN0aW9uIFV0KG4sdCxlKXt2YXIgcj10cnVlLHU9dCYmX3QodCk7dCYmKGV8fHUubGVuZ3RoKXx8KG51bGw9PWUmJihlPXQpLG89eSx0PW4sbj12LHU9X3QodCkpLGZhbHNlPT09ZT9yPWZhbHNlOnh0KGUpJiZcImNoYWluXCJpbiBlJiYocj1lLmNoYWluKTt2YXIgbz1uLGE9anQobyk7RHQodSxmdW5jdGlvbihlKXt2YXIgdT1uW2VdPXRbZV07YSYmKG8ucHJvdG90eXBlW2VdPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fX2NoYWluX18sZT10aGlzLl9fd3JhcHBlZF9fLGE9W2VdO2lmKGplLmFwcGx5KGEsYXJndW1lbnRzKSxhPXUuYXBwbHkobixhKSxyfHx0KXtpZihlPT09YSYmeHQoYSkpcmV0dXJuIHRoaXM7XG5hPW5ldyBvKGEpLGEuX19jaGFpbl9fPXR9cmV0dXJuIGF9KX0pfWZ1bmN0aW9uIFF0KCl7fWZ1bmN0aW9uIFh0KG4pe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdFtuXX19ZnVuY3Rpb24gWXQoKXtyZXR1cm4gdGhpcy5fX3dyYXBwZWRfX31lPWU/dXQuZGVmYXVsdHMoWi5PYmplY3QoKSxlLHV0LnBpY2soWixSKSk6Wjt2YXIgWnQ9ZS5BcnJheSxuZT1lLkJvb2xlYW4sdGU9ZS5EYXRlLGVlPWUuRnVuY3Rpb24scmU9ZS5NYXRoLHVlPWUuTnVtYmVyLG9lPWUuT2JqZWN0LGFlPWUuUmVnRXhwLGllPWUuU3RyaW5nLGxlPWUuVHlwZUVycm9yLGZlPVtdLGNlPWUuRXJyb3IucHJvdG90eXBlLHBlPW9lLnByb3RvdHlwZSxzZT1pZS5wcm90b3R5cGUsZ2U9ZS5fLGhlPXBlLnRvU3RyaW5nLHZlPWFlKFwiXlwiK2llKGhlKS5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZyxcIlxcXFwkJlwiKS5yZXBsYWNlKC90b1N0cmluZ3wgZm9yIFteXFxdXSsvZyxcIi4qP1wiKStcIiRcIikseWU9cmUuY2VpbCxtZT1lLmNsZWFyVGltZW91dCxkZT1yZS5mbG9vcixiZT1lZS5wcm90b3R5cGUudG9TdHJpbmcsX2U9dnQoX2U9b2UuZ2V0UHJvdG90eXBlT2YpJiZfZSx3ZT1wZS5oYXNPd25Qcm9wZXJ0eSxqZT1mZS5wdXNoLHhlPXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLENlPWUuc2V0VGltZW91dCxrZT1mZS5zcGxpY2UsRWU9ZmUudW5zaGlmdCxPZT1mdW5jdGlvbigpe3RyeXt2YXIgbj17fSx0PXZ0KHQ9b2UuZGVmaW5lUHJvcGVydHkpJiZ0LGU9dChuLG4sbikmJnRcbn1jYXRjaChyKXt9cmV0dXJuIGV9KCksU2U9dnQoU2U9b2UuY3JlYXRlKSYmU2UsQWU9dnQoQWU9WnQuaXNBcnJheSkmJkFlLEllPWUuaXNGaW5pdGUsRGU9ZS5pc05hTixOZT12dChOZT1vZS5rZXlzKSYmTmUsQmU9cmUubWF4LFBlPXJlLm1pbixSZT1lLnBhcnNlSW50LEZlPXJlLnJhbmRvbSxUZT17fTtUZVskXT1adCxUZVtMXT1uZSxUZVt6XT10ZSxUZVtLXT1lZSxUZVtHXT1vZSxUZVtXXT11ZSxUZVtKXT1hZSxUZVtNXT1pZTt2YXIgJGU9e307JGVbJF09JGVbel09JGVbV109e2NvbnN0cnVjdG9yOnRydWUsdG9Mb2NhbGVTdHJpbmc6dHJ1ZSx0b1N0cmluZzp0cnVlLHZhbHVlT2Y6dHJ1ZX0sJGVbTF09JGVbTV09e2NvbnN0cnVjdG9yOnRydWUsdG9TdHJpbmc6dHJ1ZSx2YWx1ZU9mOnRydWV9LCRlW3FdPSRlW0tdPSRlW0pdPXtjb25zdHJ1Y3Rvcjp0cnVlLHRvU3RyaW5nOnRydWV9LCRlW0ddPXtjb25zdHJ1Y3Rvcjp0cnVlfSxmdW5jdGlvbigpe2Zvcih2YXIgbj1GLmxlbmd0aDtuLS07KXt2YXIgdCxlPUZbbl07XG5mb3IodCBpbiAkZSl3ZS5jYWxsKCRlLHQpJiYhd2UuY2FsbCgkZVt0XSxlKSYmKCRlW3RdW2VdPWZhbHNlKX19KCkseS5wcm90b3R5cGU9di5wcm90b3R5cGU7dmFyIExlPXYuc3VwcG9ydD17fTshZnVuY3Rpb24oKXt2YXIgbj1mdW5jdGlvbigpe3RoaXMueD0xfSx0PXswOjEsbGVuZ3RoOjF9LHI9W107bi5wcm90b3R5cGU9e3ZhbHVlT2Y6MSx5OjF9O2Zvcih2YXIgdSBpbiBuZXcgbilyLnB1c2godSk7Zm9yKHUgaW4gYXJndW1lbnRzKTtMZS5hcmdzQ2xhc3M9aGUuY2FsbChhcmd1bWVudHMpPT1ULExlLmFyZ3NPYmplY3Q9YXJndW1lbnRzLmNvbnN0cnVjdG9yPT1vZSYmIShhcmd1bWVudHMgaW5zdGFuY2VvZiBadCksTGUuZW51bUVycm9yUHJvcHM9eGUuY2FsbChjZSxcIm1lc3NhZ2VcIil8fHhlLmNhbGwoY2UsXCJuYW1lXCIpLExlLmVudW1Qcm90b3R5cGVzPXhlLmNhbGwobixcInByb3RvdHlwZVwiKSxMZS5mdW5jRGVjb21wPSF2dChlLldpblJURXJyb3IpJiZCLnRlc3QoZyksTGUuZnVuY05hbWVzPXR5cGVvZiBlZS5uYW1lPT1cInN0cmluZ1wiLExlLm5vbkVudW1BcmdzPTAhPXUsTGUubm9uRW51bVNoYWRvd3M9IS92YWx1ZU9mLy50ZXN0KHIpLExlLm93bkxhc3Q9XCJ4XCIhPXJbMF0sTGUuc3BsaWNlT2JqZWN0cz0oZmUuc3BsaWNlLmNhbGwodCwwLDEpLCF0WzBdKSxMZS51bmluZGV4ZWRDaGFycz1cInh4XCIhPVwieFwiWzBdK29lKFwieFwiKVswXTtcbnRyeXtMZS5ub2RlQ2xhc3M9IShoZS5jYWxsKGRvY3VtZW50KT09RyYmISh7dG9TdHJpbmc6MH0rXCJcIikpfWNhdGNoKG8pe0xlLm5vZGVDbGFzcz10cnVlfX0oMSksdi50ZW1wbGF0ZVNldHRpbmdzPXtlc2NhcGU6LzwlLShbXFxzXFxTXSs/KSU+L2csZXZhbHVhdGU6LzwlKFtcXHNcXFNdKz8pJT4vZyxpbnRlcnBvbGF0ZTpJLHZhcmlhYmxlOlwiXCIsaW1wb3J0czp7Xzp2fX0sU2V8fChudD1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9cmV0dXJuIGZ1bmN0aW9uKHQpe2lmKHh0KHQpKXtuLnByb3RvdHlwZT10O3ZhciByPW5ldyBuO24ucHJvdG90eXBlPW51bGx9cmV0dXJuIHJ8fGUuT2JqZWN0KCl9fSgpKTt2YXIgemU9T2U/ZnVuY3Rpb24obix0KXtVLnZhbHVlPXQsT2UobixcIl9fYmluZERhdGFfX1wiLFUpfTpRdDtMZS5hcmdzQ2xhc3N8fChkdD1mdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJnR5cGVvZiBuLmxlbmd0aD09XCJudW1iZXJcIiYmd2UuY2FsbChuLFwiY2FsbGVlXCIpJiYheGUuY2FsbChuLFwiY2FsbGVlXCIpfHxmYWxzZVxufSk7dmFyIHFlPUFlfHxmdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCImJnR5cGVvZiBuLmxlbmd0aD09XCJudW1iZXJcIiYmaGUuY2FsbChuKT09JHx8ZmFsc2V9LEtlPXN0KHthOlwielwiLGU6XCJbXVwiLGk6XCJpZighKEJbdHlwZW9mIHpdKSlyZXR1cm4gRVwiLGc6XCJFLnB1c2gobilcIn0pLFdlPU5lP2Z1bmN0aW9uKG4pe3JldHVybiB4dChuKT9MZS5lbnVtUHJvdG90eXBlcyYmdHlwZW9mIG49PVwiZnVuY3Rpb25cInx8TGUubm9uRW51bUFyZ3MmJm4ubGVuZ3RoJiZkdChuKT9LZShuKTpOZShuKTpbXX06S2UsR2U9e2E6XCJnLGUsS1wiLGk6XCJlPWUmJnR5cGVvZiBLPT0ndW5kZWZpbmVkJz9lOmQoZSxLLDMpXCIsYjpcInR5cGVvZiB1PT0nbnVtYmVyJ1wiLHY6V2UsZzpcImlmKGUodFtuXSxuLGcpPT09ZmFsc2UpcmV0dXJuIEVcIn0sSmU9e2E6XCJ6LEgsbFwiLGk6XCJ2YXIgYT1hcmd1bWVudHMsYj0wLGM9dHlwZW9mIGw9PSdudW1iZXInPzI6YS5sZW5ndGg7d2hpbGUoKytiPGMpe3Q9YVtiXTtpZih0JiZCW3R5cGVvZiB0XSl7XCIsdjpXZSxnOlwiaWYodHlwZW9mIEVbbl09PSd1bmRlZmluZWQnKUVbbl09dFtuXVwiLGM6XCJ9fVwifSxNZT17aTpcImlmKCFCW3R5cGVvZiB0XSlyZXR1cm4gRTtcIitHZS5pLGI6ZmFsc2V9LFZlPXtcIiZcIjpcIiZhbXA7XCIsXCI8XCI6XCImbHQ7XCIsXCI+XCI6XCImZ3Q7XCIsJ1wiJzpcIiZxdW90O1wiLFwiJ1wiOlwiJiMzOTtcIn0sSGU9d3QoVmUpLFVlPWFlKFwiKFwiK1dlKEhlKS5qb2luKFwifFwiKStcIilcIixcImdcIiksUWU9YWUoXCJbXCIrV2UoVmUpLmpvaW4oXCJcIikrXCJdXCIsXCJnXCIpLFhlPXN0KEdlKSxZZT1zdChKZSx7aTpKZS5pLnJlcGxhY2UoXCI7XCIsXCI7aWYoYz4zJiZ0eXBlb2YgYVtjLTJdPT0nZnVuY3Rpb24nKXt2YXIgZT1kKGFbLS1jLTFdLGFbYy0tXSwyKX1lbHNlIGlmKGM+MiYmdHlwZW9mIGFbYy0xXT09J2Z1bmN0aW9uJyl7ZT1hWy0tY119XCIpLGc6XCJFW25dPWU/ZShFW25dLHRbbl0pOnRbbl1cIn0pLFplPXN0KEplKSxucj1zdChHZSxNZSx7ajpmYWxzZX0pLHRyPXN0KEdlLE1lKTtcbmp0KC94LykmJihqdD1mdW5jdGlvbihuKXtyZXR1cm4gdHlwZW9mIG49PVwiZnVuY3Rpb25cIiYmaGUuY2FsbChuKT09S30pO3ZhciBlcj1fZT9mdW5jdGlvbihuKXtpZighbnx8aGUuY2FsbChuKSE9R3x8IUxlLmFyZ3NDbGFzcyYmZHQobikpcmV0dXJuIGZhbHNlO3ZhciB0PW4udmFsdWVPZixlPXZ0KHQpJiYoZT1fZSh0KSkmJl9lKGUpO3JldHVybiBlP249PWV8fF9lKG4pPT1lOnl0KG4pfTp5dCxycj1jdChmdW5jdGlvbihuLHQsZSl7d2UuY2FsbChuLGUpP25bZV0rKzpuW2VdPTF9KSx1cj1jdChmdW5jdGlvbihuLHQsZSl7KHdlLmNhbGwobixlKT9uW2VdOm5bZV09W10pLnB1c2godCl9KSxvcj1jdChmdW5jdGlvbihuLHQsZSl7bltlXT10fSksYXI9QnQsaXI9dnQoaXI9dGUubm93KSYmaXJ8fGZ1bmN0aW9uKCl7cmV0dXJuKG5ldyB0ZSkuZ2V0VGltZSgpfSxscj04PT1SZShqK1wiMDhcIik/UmU6ZnVuY3Rpb24obix0KXtyZXR1cm4gUmUoa3Qobik/bi5yZXBsYWNlKEQsXCJcIik6bix0fHwwKX07XG5yZXR1cm4gdi5hZnRlcj1mdW5jdGlvbihuLHQpe2lmKCFqdCh0KSl0aHJvdyBuZXcgbGU7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIDE+LS1uP3QuYXBwbHkodGhpcyxhcmd1bWVudHMpOnZvaWQgMH19LHYuYXNzaWduPVllLHYuYXQ9ZnVuY3Rpb24obil7dmFyIHQ9YXJndW1lbnRzLGU9LTEscj1vdCh0LHRydWUsZmFsc2UsMSksdD10WzJdJiZ0WzJdW3RbMV1dPT09bj8xOnIubGVuZ3RoLHU9WnQodCk7Zm9yKExlLnVuaW5kZXhlZENoYXJzJiZrdChuKSYmKG49bi5zcGxpdChcIlwiKSk7KytlPHQ7KXVbZV09bltyW2VdXTtyZXR1cm4gdX0sdi5iaW5kPU10LHYuYmluZEFsbD1mdW5jdGlvbihuKXtmb3IodmFyIHQ9MTxhcmd1bWVudHMubGVuZ3RoP290KGFyZ3VtZW50cyx0cnVlLGZhbHNlLDEpOl90KG4pLGU9LTEscj10Lmxlbmd0aDsrK2U8cjspe3ZhciB1PXRbZV07blt1XT1wdChuW3VdLDEsbnVsbCxudWxsLG4pfXJldHVybiBufSx2LmJpbmRLZXk9ZnVuY3Rpb24obix0KXtyZXR1cm4gMjxhcmd1bWVudHMubGVuZ3RoP3B0KHQsMTkscyhhcmd1bWVudHMsMiksbnVsbCxuKTpwdCh0LDMsbnVsbCxudWxsLG4pXG59LHYuY2hhaW49ZnVuY3Rpb24obil7cmV0dXJuIG49bmV3IHkobiksbi5fX2NoYWluX189dHJ1ZSxufSx2LmNvbXBhY3Q9ZnVuY3Rpb24obil7Zm9yKHZhciB0PS0xLGU9bj9uLmxlbmd0aDowLHI9W107Kyt0PGU7KXt2YXIgdT1uW3RdO3UmJnIucHVzaCh1KX1yZXR1cm4gcn0sdi5jb21wb3NlPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPWFyZ3VtZW50cyx0PW4ubGVuZ3RoO3QtLTspaWYoIWp0KG5bdF0pKXRocm93IG5ldyBsZTtyZXR1cm4gZnVuY3Rpb24oKXtmb3IodmFyIHQ9YXJndW1lbnRzLGU9bi5sZW5ndGg7ZS0tOyl0PVtuW2VdLmFwcGx5KHRoaXMsdCldO3JldHVybiB0WzBdfX0sdi5jb25zdGFudD1mdW5jdGlvbihuKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbn19LHYuY291bnRCeT1ycix2LmNyZWF0ZT1mdW5jdGlvbihuLHQpe3ZhciBlPW50KG4pO3JldHVybiB0P1llKGUsdCk6ZX0sdi5jcmVhdGVDYWxsYmFjaz1mdW5jdGlvbihuLHQsZSl7dmFyIHI9dHlwZW9mIG47aWYobnVsbD09bnx8XCJmdW5jdGlvblwiPT1yKXJldHVybiB0dChuLHQsZSk7XG5pZihcIm9iamVjdFwiIT1yKXJldHVybiBYdChuKTt2YXIgdT1XZShuKSxvPXVbMF0sYT1uW29dO3JldHVybiAxIT11Lmxlbmd0aHx8YSE9PWF8fHh0KGEpP2Z1bmN0aW9uKHQpe2Zvcih2YXIgZT11Lmxlbmd0aCxyPWZhbHNlO2UtLSYmKHI9YXQodFt1W2VdXSxuW3VbZV1dLG51bGwsdHJ1ZSkpOyk7cmV0dXJuIHJ9OmZ1bmN0aW9uKG4pe3JldHVybiBuPW5bb10sYT09PW4mJigwIT09YXx8MS9hPT0xL24pfX0sdi5jdXJyeT1mdW5jdGlvbihuLHQpe3JldHVybiB0PXR5cGVvZiB0PT1cIm51bWJlclwiP3Q6K3R8fG4ubGVuZ3RoLHB0KG4sNCxudWxsLG51bGwsbnVsbCx0KX0sdi5kZWJvdW5jZT1WdCx2LmRlZmF1bHRzPVplLHYuZGVmZXI9ZnVuY3Rpb24obil7aWYoIWp0KG4pKXRocm93IG5ldyBsZTt2YXIgdD1zKGFyZ3VtZW50cywxKTtyZXR1cm4gQ2UoZnVuY3Rpb24oKXtuLmFwcGx5KGgsdCl9LDEpfSx2LmRlbGF5PWZ1bmN0aW9uKG4sdCl7aWYoIWp0KG4pKXRocm93IG5ldyBsZTt2YXIgZT1zKGFyZ3VtZW50cywyKTtcbnJldHVybiBDZShmdW5jdGlvbigpe24uYXBwbHkoaCxlKX0sdCl9LHYuZGlmZmVyZW5jZT1mdW5jdGlvbihuKXtyZXR1cm4gcnQobixvdChhcmd1bWVudHMsdHJ1ZSx0cnVlLDEpKX0sdi5maWx0ZXI9QXQsdi5mbGF0dGVuPWZ1bmN0aW9uKG4sdCxlLHIpe3JldHVybiB0eXBlb2YgdCE9XCJib29sZWFuXCImJm51bGwhPXQmJihyPWUsZT10eXBlb2YgdCE9XCJmdW5jdGlvblwiJiZyJiZyW3RdPT09bj9udWxsOnQsdD1mYWxzZSksbnVsbCE9ZSYmKG49QnQobixlLHIpKSxvdChuLHQpfSx2LmZvckVhY2g9RHQsdi5mb3JFYWNoUmlnaHQ9TnQsdi5mb3JJbj1ucix2LmZvckluUmlnaHQ9ZnVuY3Rpb24obix0LGUpe3ZhciByPVtdO25yKG4sZnVuY3Rpb24obix0KXtyLnB1c2godCxuKX0pO3ZhciB1PXIubGVuZ3RoO2Zvcih0PXR0KHQsZSwzKTt1LS0mJmZhbHNlIT09dChyW3UtLV0sclt1XSxuKTspO3JldHVybiBufSx2LmZvck93bj10cix2LmZvck93blJpZ2h0PWJ0LHYuZnVuY3Rpb25zPV90LHYuZ3JvdXBCeT11cix2LmluZGV4Qnk9b3Isdi5pbml0aWFsPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0wLHU9bj9uLmxlbmd0aDowO1xuaWYodHlwZW9mIHQhPVwibnVtYmVyXCImJm51bGwhPXQpe3ZhciBvPXU7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7by0tJiZ0KG5bb10sbyxuKTspcisrfWVsc2Ugcj1udWxsPT10fHxlPzE6dHx8cjtyZXR1cm4gcyhuLDAsUGUoQmUoMCx1LXIpLHUpKX0sdi5pbnRlcnNlY3Rpb249ZnVuY3Rpb24oKXtmb3IodmFyIGU9W10scj0tMSx1PWFyZ3VtZW50cy5sZW5ndGgsYT1pKCksbD1odCgpLGY9bD09PW4scz1pKCk7KytyPHU7KXt2YXIgZz1hcmd1bWVudHNbcl07KHFlKGcpfHxkdChnKSkmJihlLnB1c2goZyksYS5wdXNoKGYmJmcubGVuZ3RoPj1fJiZvKHI/ZVtyXTpzKSkpfXZhciBmPWVbMF0saD0tMSx2PWY/Zi5sZW5ndGg6MCx5PVtdO246Zm9yKDsrK2g8djspe3ZhciBtPWFbMF0sZz1mW2hdO2lmKDA+KG0/dChtLGcpOmwocyxnKSkpe2ZvcihyPXUsKG18fHMpLnB1c2goZyk7LS1yOylpZihtPWFbcl0sMD4obT90KG0sZyk6bChlW3JdLGcpKSljb250aW51ZSBuO3kucHVzaChnKVxufX1mb3IoO3UtLTspKG09YVt1XSkmJnAobSk7cmV0dXJuIGMoYSksYyhzKSx5fSx2LmludmVydD13dCx2Lmludm9rZT1mdW5jdGlvbihuLHQpe3ZhciBlPXMoYXJndW1lbnRzLDIpLHI9LTEsdT10eXBlb2YgdD09XCJmdW5jdGlvblwiLG89bj9uLmxlbmd0aDowLGE9WnQodHlwZW9mIG89PVwibnVtYmVyXCI/bzowKTtyZXR1cm4gRHQobixmdW5jdGlvbihuKXthWysrcl09KHU/dDpuW3RdKS5hcHBseShuLGUpfSksYX0sdi5rZXlzPVdlLHYubWFwPUJ0LHYubWFwVmFsdWVzPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj17fTtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSx0cihuLGZ1bmN0aW9uKG4sZSx1KXtyW2VdPXQobixlLHUpfSkscn0sdi5tYXg9UHQsdi5tZW1vaXplPWZ1bmN0aW9uKG4sdCl7aWYoIWp0KG4pKXRocm93IG5ldyBsZTt2YXIgZT1mdW5jdGlvbigpe3ZhciByPWUuY2FjaGUsdT10P3QuYXBwbHkodGhpcyxhcmd1bWVudHMpOmIrYXJndW1lbnRzWzBdO3JldHVybiB3ZS5jYWxsKHIsdSk/clt1XTpyW3VdPW4uYXBwbHkodGhpcyxhcmd1bWVudHMpXG59O3JldHVybiBlLmNhY2hlPXt9LGV9LHYubWVyZ2U9ZnVuY3Rpb24obil7dmFyIHQ9YXJndW1lbnRzLGU9MjtpZigheHQobikpcmV0dXJuIG47aWYoXCJudW1iZXJcIiE9dHlwZW9mIHRbMl0mJihlPXQubGVuZ3RoKSwzPGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHRbZS0yXSl2YXIgcj10dCh0Wy0tZS0xXSx0W2UtLV0sMik7ZWxzZSAyPGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHRbZS0xXSYmKHI9dFstLWVdKTtmb3IodmFyIHQ9cyhhcmd1bWVudHMsMSxlKSx1PS0xLG89aSgpLGE9aSgpOysrdTxlOylpdChuLHRbdV0scixvLGEpO3JldHVybiBjKG8pLGMoYSksbn0sdi5taW49ZnVuY3Rpb24obix0LGUpe3ZhciB1PTEvMCxvPXU7aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIiYmZSYmZVt0XT09PW4mJih0PW51bGwpLG51bGw9PXQmJnFlKG4pKXtlPS0xO2Zvcih2YXIgYT1uLmxlbmd0aDsrK2U8YTspe3ZhciBpPW5bZV07aTxvJiYobz1pKX19ZWxzZSB0PW51bGw9PXQmJmt0KG4pP3I6di5jcmVhdGVDYWxsYmFjayh0LGUsMyksWGUobixmdW5jdGlvbihuLGUscil7ZT10KG4sZSxyKSxlPHUmJih1PWUsbz1uKVxufSk7cmV0dXJuIG99LHYub21pdD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9e307aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIil7dmFyIHU9W107bnIobixmdW5jdGlvbihuLHQpe3UucHVzaCh0KX0pO2Zvcih2YXIgdT1ydCh1LG90KGFyZ3VtZW50cyx0cnVlLGZhbHNlLDEpKSxvPS0xLGE9dS5sZW5ndGg7KytvPGE7KXt2YXIgaT11W29dO3JbaV09bltpXX19ZWxzZSB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLG5yKG4sZnVuY3Rpb24obixlLHUpe3QobixlLHUpfHwocltlXT1uKX0pO3JldHVybiByfSx2Lm9uY2U9ZnVuY3Rpb24obil7dmFyIHQsZTtpZighanQobikpdGhyb3cgbmV3IGxlO3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0P2U6KHQ9dHJ1ZSxlPW4uYXBwbHkodGhpcyxhcmd1bWVudHMpLG49bnVsbCxlKX19LHYucGFpcnM9ZnVuY3Rpb24obil7Zm9yKHZhciB0PS0xLGU9V2Uobikscj1lLmxlbmd0aCx1PVp0KHIpOysrdDxyOyl7dmFyIG89ZVt0XTt1W3RdPVtvLG5bb11dfXJldHVybiB1XG59LHYucGFydGlhbD1mdW5jdGlvbihuKXtyZXR1cm4gcHQobiwxNixzKGFyZ3VtZW50cywxKSl9LHYucGFydGlhbFJpZ2h0PWZ1bmN0aW9uKG4pe3JldHVybiBwdChuLDMyLG51bGwscyhhcmd1bWVudHMsMSkpfSx2LnBpY2s9ZnVuY3Rpb24obix0LGUpe3ZhciByPXt9O2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpZm9yKHZhciB1PS0xLG89b3QoYXJndW1lbnRzLHRydWUsZmFsc2UsMSksYT14dChuKT9vLmxlbmd0aDowOysrdTxhOyl7dmFyIGk9b1t1XTtpIGluIG4mJihyW2ldPW5baV0pfWVsc2UgdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxucihuLGZ1bmN0aW9uKG4sZSx1KXt0KG4sZSx1KSYmKHJbZV09bil9KTtyZXR1cm4gcn0sdi5wbHVjaz1hcix2LnByb3BlcnR5PVh0LHYucHVsbD1mdW5jdGlvbihuKXtmb3IodmFyIHQ9YXJndW1lbnRzLGU9MCxyPXQubGVuZ3RoLHU9bj9uLmxlbmd0aDowOysrZTxyOylmb3IodmFyIG89LTEsYT10W2VdOysrbzx1OyluW29dPT09YSYmKGtlLmNhbGwobixvLS0sMSksdS0tKTtcbnJldHVybiBufSx2LnJhbmdlPWZ1bmN0aW9uKG4sdCxlKXtuPStufHwwLGU9dHlwZW9mIGU9PVwibnVtYmVyXCI/ZTorZXx8MSxudWxsPT10JiYodD1uLG49MCk7dmFyIHI9LTE7dD1CZSgwLHllKCh0LW4pLyhlfHwxKSkpO2Zvcih2YXIgdT1adCh0KTsrK3I8dDspdVtyXT1uLG4rPWU7cmV0dXJuIHV9LHYucmVqZWN0PWZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxBdChuLGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4hdChuLGUscil9KX0sdi5yZW1vdmU9ZnVuY3Rpb24obix0LGUpe3ZhciByPS0xLHU9bj9uLmxlbmd0aDowLG89W107Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7KytyPHU7KWU9bltyXSx0KGUscixuKSYmKG8ucHVzaChlKSxrZS5jYWxsKG4sci0tLDEpLHUtLSk7cmV0dXJuIG99LHYucmVzdD1xdCx2LnNodWZmbGU9VHQsdi5zb3J0Qnk9ZnVuY3Rpb24obix0LGUpe3ZhciByPS0xLG89cWUodCksYT1uP24ubGVuZ3RoOjAsZj1adCh0eXBlb2YgYT09XCJudW1iZXJcIj9hOjApO1xuZm9yKG98fCh0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpKSxEdChuLGZ1bmN0aW9uKG4sZSx1KXt2YXIgYT1mWysrcl09bCgpO28/YS5tPUJ0KHQsZnVuY3Rpb24odCl7cmV0dXJuIG5bdF19KTooYS5tPWkoKSlbMF09dChuLGUsdSksYS5uPXIsYS5vPW59KSxhPWYubGVuZ3RoLGYuc29ydCh1KTthLS07KW49ZlthXSxmW2FdPW4ubyxvfHxjKG4ubSkscChuKTtyZXR1cm4gZn0sdi50YXA9ZnVuY3Rpb24obix0KXtyZXR1cm4gdChuKSxufSx2LnRocm90dGxlPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj10cnVlLHU9dHJ1ZTtpZighanQobikpdGhyb3cgbmV3IGxlO3JldHVybiBmYWxzZT09PWU/cj1mYWxzZTp4dChlKSYmKHI9XCJsZWFkaW5nXCJpbiBlP2UubGVhZGluZzpyLHU9XCJ0cmFpbGluZ1wiaW4gZT9lLnRyYWlsaW5nOnUpLEgubGVhZGluZz1yLEgubWF4V2FpdD10LEgudHJhaWxpbmc9dSxWdChuLHQsSCl9LHYudGltZXM9ZnVuY3Rpb24obix0LGUpe249LTE8KG49K24pP246MDt2YXIgcj0tMSx1PVp0KG4pO1xuZm9yKHQ9dHQodCxlLDEpOysrcjxuOyl1W3JdPXQocik7cmV0dXJuIHV9LHYudG9BcnJheT1mdW5jdGlvbihuKXtyZXR1cm4gbiYmdHlwZW9mIG4ubGVuZ3RoPT1cIm51bWJlclwiP0xlLnVuaW5kZXhlZENoYXJzJiZrdChuKT9uLnNwbGl0KFwiXCIpOnMobik6RXQobil9LHYudHJhbnNmb3JtPWZ1bmN0aW9uKG4sdCxlLHIpe3ZhciB1PXFlKG4pO2lmKG51bGw9PWUpaWYodSllPVtdO2Vsc2V7dmFyIG89biYmbi5jb25zdHJ1Y3RvcjtlPW50KG8mJm8ucHJvdG90eXBlKX1yZXR1cm4gdCYmKHQ9di5jcmVhdGVDYWxsYmFjayh0LHIsNCksKHU/WGU6dHIpKG4sZnVuY3Rpb24obixyLHUpe3JldHVybiB0KGUsbixyLHUpfSkpLGV9LHYudW5pb249ZnVuY3Rpb24oKXtyZXR1cm4gZnQob3QoYXJndW1lbnRzLHRydWUsdHJ1ZSkpfSx2LnVuaXE9V3Qsdi52YWx1ZXM9RXQsdi53aGVyZT1BdCx2LndpdGhvdXQ9ZnVuY3Rpb24obil7cmV0dXJuIHJ0KG4scyhhcmd1bWVudHMsMSkpfSx2LndyYXA9ZnVuY3Rpb24obix0KXtyZXR1cm4gcHQodCwxNixbbl0pXG59LHYueG9yPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPS0xLHQ9YXJndW1lbnRzLmxlbmd0aDsrK248dDspe3ZhciBlPWFyZ3VtZW50c1tuXTtpZihxZShlKXx8ZHQoZSkpdmFyIHI9cj9mdChydChyLGUpLmNvbmNhdChydChlLHIpKSk6ZX1yZXR1cm4gcnx8W119LHYuemlwPUd0LHYuemlwT2JqZWN0PUp0LHYuY29sbGVjdD1CdCx2LmRyb3A9cXQsdi5lYWNoPUR0LHYuZWFjaFJpZ2h0PU50LHYuZXh0ZW5kPVllLHYubWV0aG9kcz1fdCx2Lm9iamVjdD1KdCx2LnNlbGVjdD1BdCx2LnRhaWw9cXQsdi51bmlxdWU9V3Qsdi51bnppcD1HdCxVdCh2KSx2LmNsb25lPWZ1bmN0aW9uKG4sdCxlLHIpe3JldHVybiB0eXBlb2YgdCE9XCJib29sZWFuXCImJm51bGwhPXQmJihyPWUsZT10LHQ9ZmFsc2UpLFkobix0LHR5cGVvZiBlPT1cImZ1bmN0aW9uXCImJnR0KGUsciwxKSl9LHYuY2xvbmVEZWVwPWZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gWShuLHRydWUsdHlwZW9mIHQ9PVwiZnVuY3Rpb25cIiYmdHQodCxlLDEpKX0sdi5jb250YWlucz1PdCx2LmVzY2FwZT1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbD09bj9cIlwiOmllKG4pLnJlcGxhY2UoUWUsZ3QpXG59LHYuZXZlcnk9U3Qsdi5maW5kPUl0LHYuZmluZEluZGV4PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0tMSx1PW4/bi5sZW5ndGg6MDtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTsrK3I8dTspaWYodChuW3JdLHIsbikpcmV0dXJuIHI7cmV0dXJuLTF9LHYuZmluZEtleT1mdW5jdGlvbihuLHQsZSl7dmFyIHI7cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksdHIobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQobixlLHUpPyhyPWUsZmFsc2UpOnZvaWQgMH0pLHJ9LHYuZmluZExhc3Q9ZnVuY3Rpb24obix0LGUpe3ZhciByO3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLE50KG4sZnVuY3Rpb24obixlLHUpe3JldHVybiB0KG4sZSx1KT8ocj1uLGZhbHNlKTp2b2lkIDB9KSxyfSx2LmZpbmRMYXN0SW5kZXg9ZnVuY3Rpb24obix0LGUpe3ZhciByPW4/bi5sZW5ndGg6MDtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTtyLS07KWlmKHQobltyXSxyLG4pKXJldHVybiByO1xucmV0dXJuLTF9LHYuZmluZExhc3RLZXk9ZnVuY3Rpb24obix0LGUpe3ZhciByO3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLGJ0KG4sZnVuY3Rpb24obixlLHUpe3JldHVybiB0KG4sZSx1KT8ocj1lLGZhbHNlKTp2b2lkIDB9KSxyfSx2Lmhhcz1mdW5jdGlvbihuLHQpe3JldHVybiBuP3dlLmNhbGwobix0KTpmYWxzZX0sdi5pZGVudGl0eT1IdCx2LmluZGV4T2Y9enQsdi5pc0FyZ3VtZW50cz1kdCx2LmlzQXJyYXk9cWUsdi5pc0Jvb2xlYW49ZnVuY3Rpb24obil7cmV0dXJuIHRydWU9PT1ufHxmYWxzZT09PW58fG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT1MfHxmYWxzZX0sdi5pc0RhdGU9ZnVuY3Rpb24obil7cmV0dXJuIG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZoZS5jYWxsKG4pPT16fHxmYWxzZX0sdi5pc0VsZW1lbnQ9ZnVuY3Rpb24obil7cmV0dXJuIG4mJjE9PT1uLm5vZGVUeXBlfHxmYWxzZX0sdi5pc0VtcHR5PWZ1bmN0aW9uKG4pe3ZhciB0PXRydWU7aWYoIW4pcmV0dXJuIHQ7dmFyIGU9aGUuY2FsbChuKSxyPW4ubGVuZ3RoO1xucmV0dXJuIGU9PSR8fGU9PU18fChMZS5hcmdzQ2xhc3M/ZT09VDpkdChuKSl8fGU9PUcmJnR5cGVvZiByPT1cIm51bWJlclwiJiZqdChuLnNwbGljZSk/IXI6KHRyKG4sZnVuY3Rpb24oKXtyZXR1cm4gdD1mYWxzZX0pLHQpfSx2LmlzRXF1YWw9ZnVuY3Rpb24obix0LGUscil7cmV0dXJuIGF0KG4sdCx0eXBlb2YgZT09XCJmdW5jdGlvblwiJiZ0dChlLHIsMikpfSx2LmlzRmluaXRlPWZ1bmN0aW9uKG4pe3JldHVybiBJZShuKSYmIURlKHBhcnNlRmxvYXQobikpfSx2LmlzRnVuY3Rpb249anQsdi5pc05hTj1mdW5jdGlvbihuKXtyZXR1cm4gQ3QobikmJm4hPStufSx2LmlzTnVsbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbD09PW59LHYuaXNOdW1iZXI9Q3Qsdi5pc09iamVjdD14dCx2LmlzUGxhaW5PYmplY3Q9ZXIsdi5pc1JlZ0V4cD1mdW5jdGlvbihuKXtyZXR1cm4gbiYmWFt0eXBlb2Ygbl0mJmhlLmNhbGwobik9PUp8fGZhbHNlfSx2LmlzU3RyaW5nPWt0LHYuaXNVbmRlZmluZWQ9ZnVuY3Rpb24obil7cmV0dXJuIHR5cGVvZiBuPT1cInVuZGVmaW5lZFwiXG59LHYubGFzdEluZGV4T2Y9ZnVuY3Rpb24obix0LGUpe3ZhciByPW4/bi5sZW5ndGg6MDtmb3IodHlwZW9mIGU9PVwibnVtYmVyXCImJihyPSgwPmU/QmUoMCxyK2UpOlBlKGUsci0xKSkrMSk7ci0tOylpZihuW3JdPT09dClyZXR1cm4gcjtyZXR1cm4tMX0sdi5taXhpbj1VdCx2Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gZS5fPWdlLHRoaXN9LHYubm9vcD1RdCx2Lm5vdz1pcix2LnBhcnNlSW50PWxyLHYucmFuZG9tPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj1udWxsPT1uLHU9bnVsbD09dDtyZXR1cm4gbnVsbD09ZSYmKHR5cGVvZiBuPT1cImJvb2xlYW5cIiYmdT8oZT1uLG49MSk6dXx8dHlwZW9mIHQhPVwiYm9vbGVhblwifHwoZT10LHU9dHJ1ZSkpLHImJnUmJih0PTEpLG49K258fDAsdT8odD1uLG49MCk6dD0rdHx8MCxlfHxuJTF8fHQlMT8oZT1GZSgpLFBlKG4rZSoodC1uK3BhcnNlRmxvYXQoXCIxZS1cIisoKGUrXCJcIikubGVuZ3RoLTEpKSksdCkpOmx0KG4sdCl9LHYucmVkdWNlPVJ0LHYucmVkdWNlUmlnaHQ9RnQsdi5yZXN1bHQ9ZnVuY3Rpb24obix0KXtpZihuKXt2YXIgZT1uW3RdO1xucmV0dXJuIGp0KGUpP25bdF0oKTplfX0sdi5ydW5JbkNvbnRleHQ9Zyx2LnNpemU9ZnVuY3Rpb24obil7dmFyIHQ9bj9uLmxlbmd0aDowO3JldHVybiB0eXBlb2YgdD09XCJudW1iZXJcIj90OldlKG4pLmxlbmd0aH0sdi5zb21lPSR0LHYuc29ydGVkSW5kZXg9S3Qsdi50ZW1wbGF0ZT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9di50ZW1wbGF0ZVNldHRpbmdzO249aWUobnx8XCJcIiksZT1aZSh7fSxlLHIpO3ZhciB1LG89WmUoe30sZS5pbXBvcnRzLHIuaW1wb3J0cykscj1XZShvKSxvPUV0KG8pLGk9MCxsPWUuaW50ZXJwb2xhdGV8fE4sZj1cIl9fcCs9J1wiLGw9YWUoKGUuZXNjYXBlfHxOKS5zb3VyY2UrXCJ8XCIrbC5zb3VyY2UrXCJ8XCIrKGw9PT1JP086Tikuc291cmNlK1wifFwiKyhlLmV2YWx1YXRlfHxOKS5zb3VyY2UrXCJ8JFwiLFwiZ1wiKTtuLnJlcGxhY2UobCxmdW5jdGlvbih0LGUscixvLGwsYyl7cmV0dXJuIHJ8fChyPW8pLGYrPW4uc2xpY2UoaSxjKS5yZXBsYWNlKFAsYSksZSYmKGYrPVwiJytfX2UoXCIrZStcIikrJ1wiKSxsJiYodT10cnVlLGYrPVwiJztcIitsK1wiO1xcbl9fcCs9J1wiKSxyJiYoZis9XCInKygoX190PShcIityK1wiKSk9PW51bGw/Jyc6X190KSsnXCIpLGk9Yyt0Lmxlbmd0aCx0XG59KSxmKz1cIic7XCIsbD1lPWUudmFyaWFibGUsbHx8KGU9XCJvYmpcIixmPVwid2l0aChcIitlK1wiKXtcIitmK1wifVwiKSxmPSh1P2YucmVwbGFjZSh4LFwiXCIpOmYpLnJlcGxhY2UoQyxcIiQxXCIpLnJlcGxhY2UoRSxcIiQxO1wiKSxmPVwiZnVuY3Rpb24oXCIrZStcIil7XCIrKGw/XCJcIjplK1wifHwoXCIrZStcIj17fSk7XCIpK1widmFyIF9fdCxfX3A9JycsX19lPV8uZXNjYXBlXCIrKHU/XCIsX19qPUFycmF5LnByb3RvdHlwZS5qb2luO2Z1bmN0aW9uIHByaW50KCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpfVwiOlwiO1wiKStmK1wicmV0dXJuIF9fcH1cIjt0cnl7dmFyIGM9ZWUocixcInJldHVybiBcIitmKS5hcHBseShoLG8pfWNhdGNoKHApe3Rocm93IHAuc291cmNlPWYscH1yZXR1cm4gdD9jKHQpOihjLnNvdXJjZT1mLGMpfSx2LnVuZXNjYXBlPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsPT1uP1wiXCI6aWUobikucmVwbGFjZShVZSxtdCl9LHYudW5pcXVlSWQ9ZnVuY3Rpb24obil7dmFyIHQ9KyttO3JldHVybiBpZShudWxsPT1uP1wiXCI6bikrdFxufSx2LmFsbD1TdCx2LmFueT0kdCx2LmRldGVjdD1JdCx2LmZpbmRXaGVyZT1JdCx2LmZvbGRsPVJ0LHYuZm9sZHI9RnQsdi5pbmNsdWRlPU90LHYuaW5qZWN0PVJ0LFV0KGZ1bmN0aW9uKCl7dmFyIG49e307cmV0dXJuIHRyKHYsZnVuY3Rpb24odCxlKXt2LnByb3RvdHlwZVtlXXx8KG5bZV09dCl9KSxufSgpLGZhbHNlKSx2LmZpcnN0PUx0LHYubGFzdD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9MCx1PW4/bi5sZW5ndGg6MDtpZih0eXBlb2YgdCE9XCJudW1iZXJcIiYmbnVsbCE9dCl7dmFyIG89dTtmb3IodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKTtvLS0mJnQobltvXSxvLG4pOylyKyt9ZWxzZSBpZihyPXQsbnVsbD09cnx8ZSlyZXR1cm4gbj9uW3UtMV06aDtyZXR1cm4gcyhuLEJlKDAsdS1yKSl9LHYuc2FtcGxlPWZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gbiYmdHlwZW9mIG4ubGVuZ3RoIT1cIm51bWJlclwiP249RXQobik6TGUudW5pbmRleGVkQ2hhcnMmJmt0KG4pJiYobj1uLnNwbGl0KFwiXCIpKSxudWxsPT10fHxlP24/bltsdCgwLG4ubGVuZ3RoLTEpXTpoOihuPVR0KG4pLG4ubGVuZ3RoPVBlKEJlKDAsdCksbi5sZW5ndGgpLG4pXG59LHYudGFrZT1MdCx2LmhlYWQ9THQsdHIodixmdW5jdGlvbihuLHQpe3ZhciBlPVwic2FtcGxlXCIhPT10O3YucHJvdG90eXBlW3RdfHwodi5wcm90b3R5cGVbdF09ZnVuY3Rpb24odCxyKXt2YXIgdT10aGlzLl9fY2hhaW5fXyxvPW4odGhpcy5fX3dyYXBwZWRfXyx0LHIpO3JldHVybiB1fHxudWxsIT10JiYoIXJ8fGUmJnR5cGVvZiB0PT1cImZ1bmN0aW9uXCIpP25ldyB5KG8sdSk6b30pfSksdi5WRVJTSU9OPVwiMi40LjFcIix2LnByb3RvdHlwZS5jaGFpbj1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9fY2hhaW5fXz10cnVlLHRoaXN9LHYucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIGllKHRoaXMuX193cmFwcGVkX18pfSx2LnByb3RvdHlwZS52YWx1ZT1ZdCx2LnByb3RvdHlwZS52YWx1ZU9mPVl0LFhlKFtcImpvaW5cIixcInBvcFwiLFwic2hpZnRcIl0sZnVuY3Rpb24obil7dmFyIHQ9ZmVbbl07di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fY2hhaW5fXyxlPXQuYXBwbHkodGhpcy5fX3dyYXBwZWRfXyxhcmd1bWVudHMpO1xucmV0dXJuIG4/bmV3IHkoZSxuKTplfX0pLFhlKFtcInB1c2hcIixcInJldmVyc2VcIixcInNvcnRcIixcInVuc2hpZnRcIl0sZnVuY3Rpb24obil7dmFyIHQ9ZmVbbl07di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXtyZXR1cm4gdC5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLGFyZ3VtZW50cyksdGhpc319KSxYZShbXCJjb25jYXRcIixcInNsaWNlXCIsXCJzcGxpY2VcIl0sZnVuY3Rpb24obil7dmFyIHQ9ZmVbbl07di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHkodC5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLGFyZ3VtZW50cyksdGhpcy5fX2NoYWluX18pfX0pLExlLnNwbGljZU9iamVjdHN8fFhlKFtcInBvcFwiLFwic2hpZnRcIixcInNwbGljZVwiXSxmdW5jdGlvbihuKXt2YXIgdD1mZVtuXSxlPVwic3BsaWNlXCI9PW47di5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fY2hhaW5fXyxyPXRoaXMuX193cmFwcGVkX18sdT10LmFwcGx5KHIsYXJndW1lbnRzKTtyZXR1cm4gMD09PXIubGVuZ3RoJiZkZWxldGUgclswXSxufHxlP25ldyB5KHUsbik6dVxufX0pLHZ9dmFyIGgsdj1bXSx5PVtdLG09MCxkPXt9LGI9K25ldyBEYXRlK1wiXCIsXz03NSx3PTQwLGo9XCIgXFx0XFx4MEJcXGZcXHhhMFxcdWZlZmZcXG5cXHJcXHUyMDI4XFx1MjAyOVxcdTE2ODBcXHUxODBlXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMGFcXHUyMDJmXFx1MjA1ZlxcdTMwMDBcIix4PS9cXGJfX3BcXCs9Jyc7L2csQz0vXFxiKF9fcFxcKz0pJydcXCsvZyxFPS8oX19lXFwoLio/XFwpfFxcYl9fdFxcKSlcXCsnJzsvZyxPPS9cXCRcXHsoW15cXFxcfV0qKD86XFxcXC5bXlxcXFx9XSopKilcXH0vZyxTPS9cXHcqJC8sQT0vXlxccypmdW5jdGlvblsgXFxuXFxyXFx0XStcXHcvLEk9LzwlPShbXFxzXFxTXSs/KSU+L2csRD1SZWdFeHAoXCJeW1wiK2orXCJdKjArKD89LiQpXCIpLE49LygkXikvLEI9L1xcYnRoaXNcXGIvLFA9L1snXFxuXFxyXFx0XFx1MjAyOFxcdTIwMjlcXFxcXS9nLFI9XCJBcnJheSBCb29sZWFuIERhdGUgRXJyb3IgRnVuY3Rpb24gTWF0aCBOdW1iZXIgT2JqZWN0IFJlZ0V4cCBTdHJpbmcgXyBhdHRhY2hFdmVudCBjbGVhclRpbWVvdXQgaXNGaW5pdGUgaXNOYU4gcGFyc2VJbnQgc2V0VGltZW91dFwiLnNwbGl0KFwiIFwiKSxGPVwiY29uc3RydWN0b3IgaGFzT3duUHJvcGVydHkgaXNQcm90b3R5cGVPZiBwcm9wZXJ0eUlzRW51bWVyYWJsZSB0b0xvY2FsZVN0cmluZyB0b1N0cmluZyB2YWx1ZU9mXCIuc3BsaXQoXCIgXCIpLFQ9XCJbb2JqZWN0IEFyZ3VtZW50c11cIiwkPVwiW29iamVjdCBBcnJheV1cIixMPVwiW29iamVjdCBCb29sZWFuXVwiLHo9XCJbb2JqZWN0IERhdGVdXCIscT1cIltvYmplY3QgRXJyb3JdXCIsSz1cIltvYmplY3QgRnVuY3Rpb25dXCIsVz1cIltvYmplY3QgTnVtYmVyXVwiLEc9XCJbb2JqZWN0IE9iamVjdF1cIixKPVwiW29iamVjdCBSZWdFeHBdXCIsTT1cIltvYmplY3QgU3RyaW5nXVwiLFY9e307XG5WW0tdPWZhbHNlLFZbVF09VlskXT1WW0xdPVZbel09VltXXT1WW0ddPVZbSl09VltNXT10cnVlO3ZhciBIPXtsZWFkaW5nOmZhbHNlLG1heFdhaXQ6MCx0cmFpbGluZzpmYWxzZX0sVT17Y29uZmlndXJhYmxlOmZhbHNlLGVudW1lcmFibGU6ZmFsc2UsdmFsdWU6bnVsbCx3cml0YWJsZTpmYWxzZX0sUT17YTpcIlwiLGI6bnVsbCxjOlwiXCIsZDpcIlwiLGU6XCJcIix2Om51bGwsZzpcIlwiLGg6bnVsbCxzdXBwb3J0Om51bGwsaTpcIlwiLGo6ZmFsc2V9LFg9e1wiYm9vbGVhblwiOmZhbHNlLFwiZnVuY3Rpb25cIjp0cnVlLG9iamVjdDp0cnVlLG51bWJlcjpmYWxzZSxzdHJpbmc6ZmFsc2UsdW5kZWZpbmVkOmZhbHNlfSxZPXtcIlxcXFxcIjpcIlxcXFxcIixcIidcIjpcIidcIixcIlxcblwiOlwiblwiLFwiXFxyXCI6XCJyXCIsXCJcXHRcIjpcInRcIixcIlxcdTIwMjhcIjpcInUyMDI4XCIsXCJcXHUyMDI5XCI6XCJ1MjAyOVwifSxaPVhbdHlwZW9mIHdpbmRvd10mJndpbmRvd3x8dGhpcyxudD1YW3R5cGVvZiBleHBvcnRzXSYmZXhwb3J0cyYmIWV4cG9ydHMubm9kZVR5cGUmJmV4cG9ydHMsdHQ9WFt0eXBlb2YgbW9kdWxlXSYmbW9kdWxlJiYhbW9kdWxlLm5vZGVUeXBlJiZtb2R1bGUsZXQ9dHQmJnR0LmV4cG9ydHM9PT1udCYmbnQscnQ9WFt0eXBlb2YgZ2xvYmFsXSYmZ2xvYmFsO1xuIXJ0fHxydC5nbG9iYWwhPT1ydCYmcnQud2luZG93IT09cnR8fChaPXJ0KTt2YXIgdXQ9ZygpO3R5cGVvZiBkZWZpbmU9PVwiZnVuY3Rpb25cIiYmdHlwZW9mIGRlZmluZS5hbWQ9PVwib2JqZWN0XCImJmRlZmluZS5hbWQ/KFouXz11dCwgZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIHV0fSkpOm50JiZ0dD9ldD8odHQuZXhwb3J0cz11dCkuXz11dDpudC5fPXV0OlouXz11dH0pLmNhbGwodGhpcyk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsInZhciBjb29raWVzID0gcmVxdWlyZSgnLi4vbGliL2Nvb2tpZXMnKTtcbnZhciAkID0gd2luZG93LmpRdWVyeTtcbnZhciBkZWZfb3B0ID0ge1xuICAgIGNhY2hlIDogZmFsc2UsXG4gICAgZGF0YVR5cGUgOiBcImpzb25cIlxufTtcblxudmFyIGFqYXggPSBmdW5jdGlvbihvcHQpe1xuICAgIG9wdCA9ICQuZXh0ZW5kKGRlZl9vcHQgLCBvcHQgKTtcbiAgICB2YXIgZGF0YSA9IG9wdC5kYXRhIHx8IHt9O1xuICAgIGRhdGEuY3NyZnRva2VuID0gY29va2llcy5nZXRJdGVtKFwiY3NyZnRva2VuXCIpO1xuICAgIG9wdC5kYXRhID0gZGF0YTtcbiAgICByZXR1cm4gJC5hamF4KG9wdCk7XG59XG5cbnZhciBodHRwID0ge1xuICAgIGdldCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIG9wdC50eXBlID0gXCJnZXRcIjtcbiAgICAgICAgcmV0dXJuIGFqYXgob3B0KTtcbiAgICB9LFxuICAgIHBvc3QgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBvcHQudHlwZSA9IFwicG9zdFwiO1xuICAgICAgICByZXR1cm4gYWpheChvcHQpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaHR0cDtcbiIsInZhciBTZWFyY2hCb3ggPSByZXF1aXJlKFwiLi9vcGVyYXRpb24vc2VhcmNoX2JveC5qc1wiKTtcbnZhciBodHRwID0gcmVxdWlyZShcIi4uL21vZC9odHRwLmpzXCIpO1xudmFyIF8gPSByZXF1aXJlKFwiLi4vbGliL2xvZGFzaC5jb21wYXQubWluLmpzXCIpO1xuJChmdW5jdGlvbigpe1xuICAgICQoXCIjb3BlcmF0aW9uLW5hdlwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAkKFwiI29wLWhvbWUtcmVjXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIHZhciBzZWFyY2hib3ggPSBuZXcgU2VhcmNoQm94KHtcbiAgICAgICAgbGltaXQgOiA1LFxuICAgICAgICBhZGRfZm4gOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgYWRkT3BMaXN0KGRhdGEpOyBcbiAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgkKFwiI3JlY29yZC1wcmRzXCIpLm9mZnNldCgpLnRvcCAtIDEwMCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBzZWFyY2hib3guaW5pdCgpO1xuICAgIFxuICAgIHZhciAkb3BfZG9tID0gJChcIiNhaS1vcC1yZWNcIik7XG4gICAgdmFyICRhdXRvX2RvbSA9ICQoXCIjYWktYXV0by1yZWNcIik7XG4gICAgdmFyIHNsX2RvbSA9ICQoXCIjcmVjLXZlcnNpb25cIik7XG4gICAgdmFyIGFkZF9kYXRhcyA9IFtdO1xuICAgIHZhciBkZWxfb3BfaXRlbXMgPSBbXTtcbiAgICBcbiAgICBodHRwLmdldCh7XG4gICAgICAgIHVybCA6IFwiL2FwaS9nZXRBdXRvUmVjb21tZW5kVmVyc2lvbkxpc3QuaHRtXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgdmFyIGQgPSBycy5kYXRhIHx8IFtdICwgbGVuID0gZC5sZW5ndGg7XG4gICAgICAgIHZhciBkYXRhID0gZFtsZW4tMV07XG4gICAgICAgIHZhciBodG1sID0gXy5tYXAoZCxmdW5jdGlvbihkYXRhLGkpe1xuICAgICAgICAgICAgcmV0dXJuICc8b3B0aW9uIHZhbHVlPVwiJytkYXRhKydcIiA+JytkYXRhKyc8L29wdGlvbj4nOyBcbiAgICAgICAgfSkuam9pbihcIlwiKTtcbiAgICAgICAgc2xfZG9tLmh0bWwoaHRtbCk7XG4gICAgICAgIHNsX2RvbS52YWwoZGF0YSk7XG4gICAgICAgIHJldHVybiBodHRwLmdldCh7XG4gICAgICAgICAgICB1cmwgOiBcIi9hcGkvZ2V0QXV0b1JlY29tbWVuZFByb2R1Y3RMaXN0Lmh0bVwiLFxuICAgICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uIDogZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgcmVuZGVyTGlzdCgkYXV0b19kb20uZmluZChcIm9sXCIpLHJzLmRhdGEpOyBcbiAgICB9KTtcbiAgICBodHRwLmdldCh7XG4gICAgICAgIHVybCA6IFwiL2FwaS9nZXRPc3NSZWNvbW1lbmRQcm9kdWN0TGlzdC5odG1cIixcbiAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgcmVuZGVyTGlzdCgkb3BfZG9tLmZpbmQoXCJvbFwiKSxycy5kYXRhKTsgXG4gICAgfSlcbiAgICBcbiAgICAvL2luaXQgXG4gICAgLyoqXG4gICAgU29ydGFibGUuY3JlYXRlKCRhdXRvX2RvbS5maW5kKFwib2xcIilbMF0se1xuICAgICAgICBvblNvcnQgOiB1cGRhdGVBdXRvXG4gICAgfSk7XG4gICAgKiovXG4gICAgU29ydGFibGUuY3JlYXRlKCRvcF9kb20uZmluZChcIm9sXCIpWzBdLHtcbiAgICAgICAgb25Tb3J0IDogdXBkYXRlT3BcbiAgICB9KTtcbiAgICAkKFwiI3VzZXItc2F2ZVwiKS5jbGljayhhZGRUb0RCKTtcbiAgICBzbF9kb20uY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB2YWwgPSBzbF9kb20udmFsKCk7XG4gICAgICAgIGh0dHAuZ2V0KHtcbiAgICAgICAgICAgIHVybCA6IFwiL2FwaS9nZXRBdXRvUmVjb21tZW5kUHJvZHVjdExpc3QuaHRtXCIsXG4gICAgICAgICAgICBkYXRhIDoge1xuICAgICAgICAgICAgICAgIHZlcnNpb24gOiB2YWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZShmdW5jdGlvbihycyl7XG4gICAgICAgICAgICByZW5kZXJMaXN0KCRhdXRvX2RvbS5maW5kKFwib2xcIikscnMuZGF0YSk7IFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkYXV0b19kb20uZGVsZWdhdGUoXCJsaSBpLmZhLXRpbWVzXCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgJGxpID0gJCh0aGlzKS5jbG9zZXN0KFwibGlcIik7XG4gICAgICAgIHZhciBkYXRhID0gJGxpLmRhdGEoXCJpdGVtXCIpO1xuICAgICAgICB2YXIgZiA9IHdpbmRvdy5jb25maXJtKFwi56Gu6K6k5Yig6ZmkXCIrZGF0YS5uYW1lK1wi5ZCX77yfXCIpO1xuICAgICAgICBpZiAoIWYpIHtcbiAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH1cbiAgICAgICAgJGxpLnJlbW92ZSgpO1xuICAgICAgICB2YXIgaWQgPSBkYXRhLnJlY29yZF9pZCAhPT0gdm9pZCAwID8gZGF0YS5yZWNvcmRfaWQgOiBkYXRhLnJlY29tbWVuZC5pZCA7XG4gICAgICAgIGh0dHAucG9zdCh7XG4gICAgICAgICAgICB1cmwgOiBcIi9hcGkvZGVsUmVjb21tZW5kUHJvZHVjdC5odG1cIixcbiAgICAgICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgaWQgOiBpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB1cGRhdGVBdXRvKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICRvcF9kb20uZGVsZWdhdGUoXCJsaSBpLmZhLXRpbWVzXCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgJGxpID0gJCh0aGlzKS5jbG9zZXN0KFwibGlcIik7XG4gICAgICAgIHZhciBkYXRhID0gJGxpLmRhdGEoXCJpdGVtXCIpO1xuICAgICAgICAkbGkucmVtb3ZlKCk7XG4gICAgICAgIHVwZGF0ZU9wKCk7XG4gICAgfSk7XG4gICAgLy9pbml0IGVuZFxuICAgIGZ1bmN0aW9uIHJlbmRlckxpc3QoZG9tLGRhdGEpe1xuICAgICAgICBkb20uZW1wdHkoKTtcbiAgICAgICAgXy5mb3JFYWNoKGRhdGEsZnVuY3Rpb24oZCxpKXtcbiAgICAgICAgICAgIHZhciBodG1sID0gZ2V0TGlIdG1sKGQsaSk7XG4gICAgICAgICAgICB2YXIgJGQgPSAkKGh0bWwpO1xuICAgICAgICAgICAgJGQuZGF0YShcIml0ZW1cIixkKTtcbiAgICAgICAgICAgIGRvbS5hcHBlbmQoJGQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0TGlIdG1sKGRhdGEsaSl7XG4gICAgICAgIHJldHVybiAnPGxpIGNsYXNzPVwiaXRlbSBkZC1pdGVtXCI+PGEgaHJlZj1cIiNcIj48aSBjbGFzcz1cImZhIGZhLXRpbWVzIHB1bGwtcmlnaHRcIj48L2k+JysoaSA9PSB2b2lkIDAgPyAnJyA6ICc8c3BhbiBjbGFzcz1cImluZFwiPicrKGkrMSkrJzwvc3Bhbj4nKSArZGF0YS5wcm9kdWN0Lm5hbWUrJzwvYT48L2xpPic7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBhZGRPcExpc3QoZGF0YSl7XG4gICAgICAgIHZhciBkb20gPSAkb3BfZG9tLmZpbmQoXCJvbFwiKTtcbiAgICAgICAgdmFyICRsaXMgPSBkb20uZmluZChcImxpXCIpICwgaW5kID0gJGxpcy5sZW5ndGg7XG4gICAgICAgIHZhciBoYXNfZGF0YV9pZHMgPSBfLm1hcCgkbGlzLGZ1bmN0aW9uKGxpKXtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJChsaSkuZGF0YShcIml0ZW1cIik7XG4gICAgICAgICAgICByZXR1cm4gKGRhdGEucHJvZHVjdCB8fCB7fSkuaWQgfHwgZGF0YS5wcm9kdWN0SWQ7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICBfLmZvckVhY2goZGF0YSxmdW5jdGlvbihkLGkpe1xuICAgICAgICAgICBpZiAofmhhc19kYXRhX2lkcy5pbmRleE9mKGQucHJvZHVjdElkKSkge1xuICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIHZhciAkbCA9ICQoJzxsaSBjbGFzcz1cIml0ZW0gXCI+PGEgaHJlZj1cIiNcIj48aSBjbGFzcz1cImZhIGZhLXRpbWVzIHB1bGwtcmlnaHRcIj48L2k+PHNwYW4gY2xhc3M9XCJpbmRcIj4nKyhpbmQrY291bnQrMSkrJzwvc3Bhbj4nICtkLnRpdGxlKyc8L2E+PC9saT4nKTtcbiAgICAgICAgICAgJGwuZGF0YShcIml0ZW1cIixkKVxuICAgICAgICAgICBhZGRfZGF0YXMucHVzaChkKTtcbiAgICAgICAgICAgZG9tLmFwcGVuZCgkbCk7XG4gICAgICAgICAgIGNvdW50ICsrO1xuICAgICAgICB9KTtcblxuXG4gICAgfTtcbiAgICBcbiAgICBmdW5jdGlvbiB1cGRhdGVPcCgpe1xuICAgICAgICB2YXIgbGlzID0gJG9wX2RvbS5maW5kKFwibGlcIik7XG4gICAgICAgIHZhciBwb3N0X2RhdGEgPSBbXTtcbiAgICAgICAgdmFyIG1heCA9IDk5OTk7XG4gICAgICAgIGxpcy5lYWNoKGZ1bmN0aW9uKGksbGkpe1xuICAgICAgICAgICAgdmFyICRsaSA9ICQobGkpO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkbGkuZGF0YShcIml0ZW1cIik7XG4gICAgICAgICAgICAkbGkuZmluZChcIi5pbmRcIikudGV4dChpKzEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgICBodHRwLnBvc3Qoe1xuICAgICAgICAgICAgdXJsIDogXCIvYXBpL21vZGlmeVJlY29tbWVuZFByb2R1Y3RPcmRlci5odG1cIixcbiAgICAgICAgICAgIGRhdGEgOntcbiAgICAgICAgICAgICAgICAgZGF0YSA6IEpTT04uc3RyaW5naWZ5KHBvc3RfZGF0YSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlQXV0bygpe1xuICAgICAgICB2YXIgbGlzID0gJGF1dG9fZG9tLmZpbmQoXCJsaVwiKTtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgbGlzLmVhY2goZnVuY3Rpb24oaSxsaSl7XG4gICAgICAgICAgICB2YXIgJGxpID0gJChsaSk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICRsaS5kYXRhKFwiaXRlbVwiKTtcbiAgICAgICAgICAgICRsaS5maW5kKFwiLmluZFwiKS50ZXh0KGkrMSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaHR0cC5wb3N0KHtcbiAgICAgICAgICAgIFxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVG9EQigpe1xuICAgICAgICB2YXIgZiA9IHdpbmRvdy5jb25maXJtKFwi56Gu5a6a6KaB5L+d5a2Y5LmI77yM5LiA5pem5L+d5a2Y77yM56uL5Yi755Sf5pWI77yM5rOo5oSP5pON5L2c44CCXCIpO1xuICAgICAgICBpZiAoIWYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGlzID0gJG9wX2RvbS5maW5kKFwibGlcIik7XG4gICAgICAgIHZhciBwcmRfaWRzID0gXy5tYXAobGlzLGZ1bmN0aW9uKGxpKXtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJChsaSkuZGF0YShcIml0ZW1cIik7XG4gICAgICAgICAgICB2YXIgaWQgPSAoZGF0YS5wcm9kdWN0IHx8IHt9KS5pZCB8fCBkYXRhLnByb2R1Y3RJZDtcbiAgICAgICAgICAgIHJldHVybiBpZFxuICAgICAgICB9KS5qb2luKFwiLFwiKTtcbiAgICAgICAgaHR0cC5wb3N0KHtcbiAgICAgICAgICAgIHVybCA6IFwiL2FwaS9hZGRSZWNvbW1lbmRQcm9kdWN0Lmh0bVwiLFxuICAgICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0SWQgOiBwcmRfaWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICAgaWYgKHJzLnJldCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwi5L+d5a2Y5oiQ5YqfXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsZXJ0KFwi5L+d5a2Y5aSx6LSlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgYWxlcnQoXCLkv53lrZjlpLHotKVcIik7XG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9KTtcbiAgICB9XG59KVxuIiwicmVxdWlyZShcIi4uLy4uL2xpYi9qdWljZXIuanNcIik7XG52YXIgXyA9IHJlcXVpcmUoXCIuLi8uLi9saWIvbG9kYXNoLmNvbXBhdC5taW4uanNcIik7IFxudmFyICQgPSByZXF1aXJlKFwiLi4vLi4vbGliL2pxdWVyeS5qc1wiKTtcbnZhciBodHRwID0gcmVxdWlyZShcIi4uLy4uL21vZC9odHRwLmpzXCIpO1xudmFyIHBhZ2VyID0gcmVxdWlyZShcIi4uLy4uL2xpYi9pcGFnZXIuanNcIik7XG52YXIgUFJEX0hEX1RQTCA9IHJlcXVpcmUoXCIuL3RtcGwvcHJkX2xpc3RfaGQuanNcIik7XG52YXIgU0hPUF9IRF9UUEwgPSByZXF1aXJlKFwiLi90bXBsL3Nob3BfbGlzdF9oZC5qc1wiKTtcbnZhciBQUkRfVERfVFBMID0gcmVxdWlyZShcIi4vdG1wbC9wcmRfdGQuanNcIik7XG52YXIgU0hPUF9URF9UUEwgPSByZXF1aXJlKFwiLi90bXBsL3Nob3BfdGQuanNcIik7XG5cbmp1aWNlci5yZWdpc3Rlcignc2hvcF9zdGF0dXMnLCBmdW5jdGlvbihzKXtcbiAgICBpZiAocyA9PSAyKSB7XG4gICAgICAgIHJldHVybiBcIuWuoeaguOmAmui/h1wiO1xuICAgIH0gXG4gICAgcmV0dXJuIFwi5a6h5qC45pyq6YCa6L+HXCI7XG59KTsgXG5cbmp1aWNlci5yZWdpc3RlcigncHJkX3N0YXR1cycsIGZ1bmN0aW9uKHMpe1xuICAgIGlmIChzID09IFwiMlwiKSB7XG4gICAgICAgIHJldHVybiBcIuS4iuaetlwiOyBcbiAgICB9IGVsc2UgaWYgKHMgPT0gXCIxXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5LiL5p62XCI7XG4gICAgfSBlbHNlIGlmIChzID09XCIzXCIpIHtcbiAgICAgICAgcmV0dXJuICBcIuWIoOmZpFwiOyAgICAgICAgXG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xufSk7IFxuXG52YXIgTGltaXQgPSAxMDtcblxudmFyIFNlYXJjaEJveCA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIHZhciAkZCA9IHRoaXMuX2RvbSA9IG9wdC5kb20gfHwgJChcIiNwZC1zZWFyY2gtYm94XCIpO1xuICAgIHRoaXMuXyRzZWFyY2hfYm94ID0gJGQuZmluZChcIi5tLXByZC1zZWFyY2hcIik7XG4gICAgdGhpcy5fJGxpc3RfYm94ID0gJGQuZmluZChcIi5tLXJlc3VsdC1saXN0XCIpO1xuICAgIHRoaXMuXyRwYWdlX2JveCA9ICRkLmZpbmQoXCIubS1wYWdlLWJveFwiKTtcbiAgICB0aGlzLl9wYWdlX2xpbWl0ID0gb3B0LmxpbWl0IHx8IExpbWl0O1xuICAgIHRoaXMuX29wdCA9IG9wdDtcbiAgICB0aGlzLl9vcHQuYWRkX2ZuID0gb3B0LmFkZF9mbiB8fCAkLm5vb3A7XG59XG5cblNlYXJjaEJveC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5faW5pdFNlYXJjaCgpO1xuICAgIHRoaXMuX2luaXRSZXN1bHQoKTtcbn1cblNlYXJjaEJveC5wcm90b3R5cGUuX2luaXRTZWFyY2ggPSBmdW5jdGlvbigpe1xuICAgIHZhciBtZSA9IHRoaXMgLCAkcyA9IG1lLl8kc2VhcmNoX2JveDtcbiAgICB2YXIgJGYgPSB0aGlzLl8kc2VhcmNoX2Zvcm0gPSAkcy5maW5kKFwiZm9ybVwiKTtcbiAgICB0aGlzLl8kYWRkX2J0biA9ICRmLmZpbmQoXCIuYWktYWRkXCIpO1xuICAgIHZhciAkc2VhcmNoX3R5cGUgPSAkZi5maW5kKFwiaW5wdXRbdHlwZT1yYWRpb11cIik7XG4gICAgdmFyICRzZWFyY2hfaW5wID0gJGYuZmluZChcIi5haS1zZWFyY2gtaW5wXCIpO1xuICAgIHZhciBzZWFyY2hfdHlwZSAgPSBbXCJwcmRcIixcInNob3BcIl07XG4gICAgXG4gICAgdGhpcy5fY3VyX3R5cGUgPSBtZS5fb3B0LmRlZmF1bHRfdHlwZSB8fCBcInByZFwiO1xuICAgIFxuICAgIGlmICh0aGlzLl9jdXJfdHlwZSA9PSBcInByZFwiKSB7XG4gICAgICAgICRzZWFyY2hfdHlwZVswXS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgJHNlYXJjaF90eXBlWzFdLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG1lLl9vcHQub25seV9vbmUpIHtcbiAgICAgICAgICAgICAkc2VhcmNoX3R5cGUuZXEoMSkuY2xvc2VzdChcIi5yYWRpb1wiKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICAkc2VhcmNoX3R5cGVbMF0uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAkc2VhcmNoX3R5cGVbMV0uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIGlmIChtZS5fb3B0Lm9ubHlfb25lKSB7XG4gICAgICAgICAgICAgJHNlYXJjaF90eXBlLmVxKDApLmNsb3Nlc3QoXCIucmFkaW9cIikuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fJHNlYXJjaF9mb3JtLm9uKFwic3VibWl0XCIsZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHR5cGUgOyBcbiAgICAgICAgJHNlYXJjaF90eXBlLmVhY2goZnVuY3Rpb24oaSl7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgdHlwZSA9IHNlYXJjaF90eXBlW3RoaXMudmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJHNlYXJjaF9pbnAudmFsKCk7XG4gICAgICAgIHZhciBzZWFyY2hfb2JqID0ge1xuICAgICAgICAgICAgdHlwZSA6IHR5cGUsXG4gICAgICAgICAgICBxdWVyeSA6IHF1ZXJ5XG4gICAgICAgIH07XG4gICAgICAgIG1lLl9zZWFyY2goc2VhcmNoX29iaik7XG4gICAgfSk7XG4gICAgdGhpcy5fJGFkZF9idG4uY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciAkbCA9IG1lLl8kbGlzdF9ib3g7XG4gICAgICAgIHZhciAkY2ggPSAkbC5maW5kKFwiLmFpLWNoXCIpIHx8IFtdO1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICB2YXIgdF9kb20gPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKCRjaCxmdW5jdGlvbihkb20saSl7XG4gICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGRvbS5jaGVja2VkO1xuICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9ICQoZG9tKS5jbG9zZXN0KFwidHJcIikuZGF0YShcIml0ZW1cIik7XG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKGQpO1xuICAgICAgICAgICAgICAgIHRfZG9tLnB1c2goZG9tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgbWUuX29wdC5hZGRfZm4oZGF0YSk7IFxuICAgICAgICAgICAgXy5mb3JFYWNoKHRfZG9tLGZ1bmN0aW9uKGRvbSl7XG4gICAgICAgICAgICAgICBkb20uY2hlY2tlZCA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWUuX2RvbS5maW5kKFwiLmFpLXNlbGVjdGVkLWFsbCBpbnB1dFt0eXBlPWNoZWNrYm94XVwiKS5hdHRyKFwiY2hlY2tlZFwiLGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFwi5rKh5pyJ6YCJ5oup5ZWG5ZOBXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5TZWFyY2hCb3gucHJvdG90eXBlLl9pbml0UmVzdWx0ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbWUgPSB0aGlzICwgJGwgPSB0aGlzLl8kbGlzdF9ib3g7XG4gICAgJGwuZGVsZWdhdGUoXCIuYWktc2VsZWN0ZWQtYWxsIGxhYmVsXCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgY2hlY2tfZG9tID0gJCh0aGlzKS5maW5kKFwiaW5wdXRcIik7XG4gICAgICAgIHZhciAkdGRfbGFiZWxzID0gJGwuZmluZChcImlucHV0LmFpLWNoXCIpOyBcbiAgICAgICAgaWYgKCR0ZF9sYWJlbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGNoZWNrX2RvbVswXS5jaGVja2VkO1xuICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAkdGRfbGFiZWxzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRkX2xhYmVscy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgJHBhZ2VfZG9tID0gdGhpcy5fJHBhZ2VfYm94OyBcbiAgICAgICAgJHBhZ2VfZG9tLmRlbGVnYXRlKFwiLnBnLWl0ZW1cIixcImNsaWNrXCIsZnVuY3Rpb24oZSl7XG4gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgdmFyIHBnID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwZ1wiKSAqIDE7XG4gICAgICAgICAgIG1lLmdvX3BhZ2UocGcpO1xuICAgICAgICB9KTtcbiAgICAgICAkcGFnZV9kb20uZGVsZWdhdGUoXCIuanMtcC1uZXh0XCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHZhciBwZyA9IG1lLl9jYWNoZV9wYXJhbXMucG4gKyAxO1xuICAgICAgICAgICBtZS5nb19wYWdlKHBnKTtcbiAgICAgICB9KTtcbiAgICAgICAkcGFnZV9kb20uZGVsZWdhdGUoXCIuanMtcC1wcmV2XCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHZhciBwZyA9IG1lLl9jYWNoZV9wYXJhbXMucG4gLTE7XG4gICAgICAgICAgIG1lLmdvX3BhZ2UocGcpO1xuICAgICAgIH0pOyAgXG59XG5cblNlYXJjaEJveC5wcm90b3R5cGUuX3NlYXJjaCA9IGZ1bmN0aW9uKG9iail7XG4gICAgdmFyIHF1ZXJ5X29iaiA9IHRoaXMuX1NFQVJDSF9NQVBbb2JqLnR5cGVdO1xuICAgIHZhciBwbiA9IDEgLCBwcyA9IHRoaXMuX3BhZ2VfbGltaXQ7XG4gICAgdmFyIHBhcmFtcyA9IHtwbjpwbixwczpwcyxxOm9iai5xdWVyeX07XG4gICAgdGhpcy5fY2FjaGVfcGFyYW1zID0gcGFyYW1zO1xuICAgIHRoaXMuX2N1cl90eXBlID0gb2JqLnR5cGU7XG4gICAgdGhpcy5fcmVuZGVyTGlzdEhkKG9iai50eXBlKTtcbiAgICBxdWVyeV9vYmouc2VhcmNoLmNhbGwodGhpcyxwYXJhbXMsb2JqLnR5cGUpO1xufVxuU2VhcmNoQm94LnByb3RvdHlwZS5fU0VBUkNIX01BUCA9IHtcbiAgICBcInByZFwiIDoge1xuICAgICAgICBzZWFyY2ggOiBmdW5jdGlvbihwYXJhbXMsdHlwZSl7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgLy92YXIgdXJsID0gJy9hcGkvZ2V0UHJvZHVjdExpc3QuaHRtJztcbiAgICAgICAgICAgIHZhciB1cmwgPSAnL3NlYXJjaFByb2R1Y3Q/ZnJvbT1vc3MnO1xuICAgICAgICAgICAgaHR0cC5nZXQoe1xuICAgICAgICAgICAgICAgIHVybCA6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhIDogcGFyYW1zXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgICAgICBtZS5fY2FjaGVfcGFyYW1zLnBuID0gcGFyYW1zLnBuO1xuICAgICAgICAgICAgICAgIG1lLl9yZW5kZXJMaXN0KHR5cGUscnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgbWUuX3JlbmRlclBhZ2UocGFyYW1zLnBuLHJzLnRvdGFsTnVtLHBhcmFtcy5wcyk7XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCLmnI3liqHlmajplJnor6/vvIzor7fliLfmlrDph43or5VcIik7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwic2hvcFwiIDoge1xuICAgICAgICBzZWFyY2ggOiBmdW5jdGlvbihwYXJhbXMsdHlwZSl7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHVybCA9ICcvYXBpL2dldFNob3BMaXN0Lmh0bSc7XG4gICAgICAgICAgICBodHRwLmdldCh7XG4gICAgICAgICAgICAgICAgdXJsIDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGEgOiBwYXJhbXNcbiAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocnMpe1xuICAgICAgICAgICAgICAgIG1lLl9jYWNoZV9wYXJhbXMucG4gPSBwYXJhbXMucG47XG4gICAgICAgICAgICAgICAgbWUuX3JlbmRlckxpc3QodHlwZSxycy5zaG9wTGlzdCk7XG4gICAgICAgICAgICAgICAgbWUuX3JlbmRlclBhZ2UocGFyYW1zLnBuLHJzLnRvdGFsTnVtLHBhcmFtcy5wcyk7XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICBhbGVydChcIuacjeWKoeWZqOmUmeivr++8jOivt+WIt+aWsOmHjeivlVwiKTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn1cblxuU2VhcmNoQm94LnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuX2NhY2hlX3BhcmFtcyA9IHtwbjoxLHBzOnRoaXMuX3BhZ2VfbGltaXR9OyAgXG4gICAgdGhpcy5fJGxpc3RfYm94LmVtcHR5KCk7XG59XG5TZWFyY2hCb3gucHJvdG90eXBlLl9yZW5kZXJMaXN0SGQgPSBmdW5jdGlvbih0eXBlKXtcbiAgICB2YXIgJGwgPSB0aGlzLl8kbGlzdF9ib3g7XG4gICAgaWYgKHR5cGUgPT0gXCJwcmRcIikge1xuICAgICAgICAkbC5odG1sKFBSRF9IRF9UUEwoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGwuaHRtbChTSE9QX0hEX1RQTCgpKTtcbiAgICB9XG4gICAgXG59XG5TZWFyY2hCb3gucHJvdG90eXBlLl9yZW5kZXJMaXN0ID0gZnVuY3Rpb24odHlwZSxkYXRhKXtcbiAgICB2YXIgJHRib2R5ID0gdGhpcy5fJGxpc3RfYm94LmZpbmQoXCJ0Ym9keVwiKTtcbiAgICB2YXIgdHBsIDtcbiAgICBpZiAodHlwZSA9PSBcInByZFwiICkge1xuICAgICAgICB0cGwgPSBQUkRfVERfVFBMO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRwbCA9IFNIT1BfVERfVFBMO1xuICAgIH1cbiAgICAkdGJvZHkuZW1wdHkoKTtcbiAgICBfLmZvckVhY2goZGF0YSxmdW5jdGlvbihkLGkpe1xuICAgICAgICB2YXIgaHRtbCA9IHRwbChkKTtcbiAgICAgICAgdmFyICR0ciA9ICQoaHRtbCk7XG4gICAgICAgICR0ci5kYXRhKFwiaXRlbVwiLGQpO1xuICAgICAgICAkdGJvZHkuYXBwZW5kKCR0cik7XG4gICAgfSk7XG59XG5TZWFyY2hCb3gucHJvdG90eXBlLl9yZW5kZXJQYWdlID0gZnVuY3Rpb24oY3VyX3BhZ2UsdG90YWwsbGltaXQpe1xuICAgICAgcGFnZXIucmVuZGVyKHRoaXMuXyRwYWdlX2JveCxjdXJfcGFnZSx0b3RhbCxsaW1pdCk7IFxufVxuXG5TZWFyY2hCb3gucHJvdG90eXBlLmdvX3BhZ2UgPSBmdW5jdGlvbihwKXtcbiAgICB2YXIgcGFyYW1zID0gdGhpcy5fY2FjaGVfcGFyYW1zO1xuICAgIHZhciB0eXBlID0gdGhpcy5fY3VyX3R5cGU7XG4gICAgdmFyIHF1ZXJ5X29iaiA9IHRoaXMuX1NFQVJDSF9NQVBbdHlwZV07XG4gICAgdmFyIHFfcGFyYW1zID0gXy5leHRlbmQoe30scGFyYW1zKTtcbiAgICBxX3BhcmFtcy5wbiA9IHA7XG4gICAgcXVlcnlfb2JqLnNlYXJjaC5jYWxsKHRoaXMscV9wYXJhbXMsdHlwZSk7XG4gICAgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoQm94O1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgdGVtcGxhdGUgPSBqdWljZXIudGVtcGxhdGUsIHRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzIHx8IHt9O1xudmFyIHRwbCA9IHRlbXBsYXRlc1sncHJkX2xpc3RfaGQudG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIGlkPV8uaWQ7dmFyIHRhYmxlPV8udGFibGU7dmFyIGhvdmVyPV8uaG92ZXI7dmFyIHRoZWFkPV8udGhlYWQ7dmFyIHRyPV8udHI7dmFyIHRoPV8udGg7dmFyIHNlbGVjdGVkPV8uc2VsZWN0ZWQ7dmFyIGFsbD1fLmFsbDt2YXIgbGFiZWw9Xy5sYWJlbDt2YXIgaW5wdXQ9Xy5pbnB1dDt2YXIgdGJvZHk9Xy50Ym9keTsgX291dCs9JyA8dGFibGUgY2xhc3M9XCJ0YWJsZSAgdGFibGUtaG92ZXIgZ2VuZXJhbC10YWJsZVwiPiA8dGhlYWQ+IDx0cj4gICAgIDx0aD7llYblk4FJRDwvdGg+ICAgICA8dGg+5ZWG5ZOB5ZCN56ewPC90aD4gICAgIDx0aD7miYDlsZ7pl6jlupc8L3RoPiAgICAgPHRoPueOsOS7tzwvdGg+ICAgICA8dGg+5Y6f5Lu3PC90aD4gICAgIDx0aD7nirbmgIE8L3RoPiAgICAgPHRoIGNsYXNzPVwiYWktc2VsZWN0ZWQtYWxsXCI+ICAgICAgICAgPGxhYmVsPiAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cIic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIgbmFtZT1cInNlbGVjdF9wcmRcIiBpZD1cInNlbF9wcmRfJztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKGlkKSkgO19vdXQrPSdcIi8+ICAgICAgICAg5YWo6YCJICAgICAgICAgPC9sYWJlbD4gICAgIDwvdGg+IDwvdHI+IDwvdGhlYWQ+IDx0Ym9keT4gPC90Ym9keT4gPC90YWJsZT4gICAnOyB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9IF9vdXQrPScnO3JldHVybiBfb3V0O1xufTtcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGp1aWNlci50ZW1wbGF0ZXNbJ3ByZF9saXN0X2hkLnRtcGwnXTsiLCIoZnVuY3Rpb24oKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IGp1aWNlci50ZW1wbGF0ZSwgdGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgfHwge307XG52YXIgdHBsID0gdGVtcGxhdGVzWydwcmRfdGQudG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIHByb2R1Y3RJZD1fLnByb2R1Y3RJZDt2YXIgdGl0bGU9Xy50aXRsZTt2YXIgc2hvcE5hbWU9Xy5zaG9wTmFtZTt2YXIgcHJlc2VudFByaWNlPV8ucHJlc2VudFByaWNlO3ZhciBvcmlnaW5hbFByaWNlPV8ub3JpZ2luYWxQcmljZTt2YXIgc3RhdHVzPV8uc3RhdHVzO3ZhciBpZD1fLmlkO3ZhciB0cj1fLnRyO3ZhciB0ZD1fLnRkO3ZhciBwcmRfc3RhdHVzPV8ucHJkX3N0YXR1czt2YXIgbGFiZWw9Xy5sYWJlbDt2YXIgaW5wdXQ9Xy5pbnB1dDt2YXIgY2g9Xy5jaDsgX291dCs9Jzx0cj4gICAgIDx0ZD4gICAgICAgICAnO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24ocHJvZHVjdElkKSkgO19vdXQrPScgICAgICAgICAgICAgPC90ZD4gICAgIDx0ZD4gICAgICAgICAnO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24odGl0bGUpKSA7X291dCs9JyAgICAgICAgICAgICA8L3RkPiAgICAgPHRkPic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihzaG9wTmFtZSkpIDtfb3V0Kz0nPC90ZD4gICAgIDx0ZD4nO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24ocHJlc2VudFByaWNlKSkgO19vdXQrPSc8L3RkPiAgICAgPHRkPic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihvcmlnaW5hbFByaWNlKSkgO19vdXQrPSc8L3RkPiAgICAgPHRkPic7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihfbWV0aG9kLnByZF9zdGF0dXMuY2FsbCh7fSwgc3RhdHVzKSkpIDtfb3V0Kz0nPC90ZD4gICAgIDx0ZD4gICAgICAgICA8bGFiZWw+ICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImFpLWNoXCIgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCInO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24oaWQpKSA7X291dCs9J1wiIG5hbWU9XCJzZWxlY3RfcHJkXCIgaWQ9XCJzZWxfcHJkXyc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIvPiAgICAgICAgICAgICDpgInmi6kgICAgICAgICA8L2xhYmVsPiAgICAgPC90ZD4gPC90cj4gICc7IH0gY2F0Y2goZSkge19tZXRob2QuX190aHJvdyhcIkp1aWNlciBSZW5kZXIgRXhjZXB0aW9uOiBcIitlLm1lc3NhZ2UpO30gX291dCs9Jyc7cmV0dXJuIF9vdXQ7XG59O1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0ganVpY2VyLnRlbXBsYXRlc1sncHJkX3RkLnRtcGwnXTsiLCIoZnVuY3Rpb24oKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IGp1aWNlci50ZW1wbGF0ZSwgdGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgfHwge307XG52YXIgdHBsID0gdGVtcGxhdGVzWydzaG9wX2xpc3RfaGQudG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIGlkPV8uaWQ7dmFyIHRhYmxlPV8udGFibGU7dmFyIGhvdmVyPV8uaG92ZXI7dmFyIHRoZWFkPV8udGhlYWQ7dmFyIHRyPV8udHI7dmFyIHRoPV8udGg7dmFyIHNlbGVjdGVkPV8uc2VsZWN0ZWQ7dmFyIGFsbD1fLmFsbDt2YXIgbGFiZWw9Xy5sYWJlbDt2YXIgaW5wdXQ9Xy5pbnB1dDt2YXIgdGJvZHk9Xy50Ym9keTsgX291dCs9Jzx0YWJsZSBjbGFzcz1cInRhYmxlICB0YWJsZS1ob3ZlciBnZW5lcmFsLXRhYmxlXCI+ICAgICA8dGhlYWQ+ICAgICA8dHI+ICAgICA8dGg+5ZWG5oi3SUQ8L3RoPiAgICAgPHRoPuWVhuaIt+WQjeensDwvdGg+ICAgICA8dGg+54q25oCBPC90aD4gICAgIDx0aCBjbGFzcz1cImFpLXNlbGVjdGVkLWFsbFwiPiAgICAgICAgIDxsYWJlbD4gICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCInO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24oaWQpKSA7X291dCs9J1wiIG5hbWU9XCJzZWxlY3RfcHJkXCIgaWQ9XCJzZWxfcHJkXyc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIvPiAgICAgICAgIOWFqOmAiSAgICAgICAgIDwvbGFiZWw+ICAgICA8L3RoPiAgICAgPC90cj4gICAgIDwvdGhlYWQ+ICAgICA8dGJvZHk+ICAgICA8L3Rib2R5PiA8L3RhYmxlPiAgJzsgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSBfb3V0Kz0nJztyZXR1cm4gX291dDtcbn07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBqdWljZXIudGVtcGxhdGVzWydzaG9wX2xpc3RfaGQudG1wbCddOyIsIihmdW5jdGlvbigpIHtcbiAgdmFyIHRlbXBsYXRlID0ganVpY2VyLnRlbXBsYXRlLCB0ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzID0ganVpY2VyLnRlbXBsYXRlcyB8fCB7fTtcbnZhciB0cGwgPSB0ZW1wbGF0ZXNbJ3Nob3BfdGQudG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIHNob3BJZD1fLnNob3BJZDt2YXIgbmFtZT1fLm5hbWU7dmFyIHN0YXR1cz1fLnN0YXR1czt2YXIgaWQ9Xy5pZDt2YXIgdHI9Xy50cjt2YXIgdGQ9Xy50ZDt2YXIgc2hvcF9zdGF0dXM9Xy5zaG9wX3N0YXR1czt2YXIgbGFiZWw9Xy5sYWJlbDt2YXIgaW5wdXQ9Xy5pbnB1dDt2YXIgY2g9Xy5jaDsgX291dCs9Jzx0cj4gICAgIDx0ZD4gICAgICAgICAnO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24oc2hvcElkKSkgO19vdXQrPScgICAgICAgICAgICAgPC90ZD4gICAgIDx0ZD4gICAgICAgICAnO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24obmFtZSkpIDtfb3V0Kz0nICAgICAgICAgICAgIDwvdGQ+ICAgICA8dGQ+Jztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKF9tZXRob2Quc2hvcF9zdGF0dXMuY2FsbCh7fSwgc3RhdHVzKSkpIDtfb3V0Kz0nPC90ZD4gICAgIDx0ZD4gICAgICAgICA8bGFiZWw+ICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImFpLWNoXCIgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCInO19vdXQrPSBfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZyhfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24oaWQpKSA7X291dCs9J1wiIG5hbWU9XCJzZWxlY3RfcHJkXCIgaWQ9XCJzZWxfcHJkXyc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpZCkpIDtfb3V0Kz0nXCIvPiAgICAgICAgICAgICDpgInmi6kgICAgICAgICA8L2xhYmVsPiAgICAgPC90ZD4gPC90cj4gJzsgfSBjYXRjaChlKSB7X21ldGhvZC5fX3Rocm93KFwiSnVpY2VyIFJlbmRlciBFeGNlcHRpb246IFwiK2UubWVzc2FnZSk7fSBfb3V0Kz0nJztyZXR1cm4gX291dDtcbn07XG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBqdWljZXIudGVtcGxhdGVzWydzaG9wX3RkLnRtcGwnXTsiXX0=
