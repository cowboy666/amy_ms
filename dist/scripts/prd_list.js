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
var prd_list = require('./shop_sys/prd_list.js');

$(function(){
    prd_list.init();
});

},{"./shop_sys/prd_list.js":8}],8:[function(require,module,exports){
require("../../lib/juicer.js");
var _ = require("../../lib/lodash.compat.min.js"); 
var $ = require("../../lib/jquery.js");
var http = require("../../mod/http.js");
var pager = require("../../lib/ipager.js");
var item_tpl = require("./tmpl/prd_item.js");

var Limit = 20;


var Prd_List = {

    init : function(){
        this._dom = $("#m-list");
        this._cur_params = {
            pn : 1
        };
        this._$list = this._dom.find(".ai-list"); 
        this._$page = this._dom.find(".ai-page");
        this._$list_ct = $("#list-ct");
        this._$noresult = $("#no-result");
        this.load();
        this.listen();
    },
    listen : function(){
        var me = this;
        var $page_dom = this._$page; 
        $page_dom.delegate(".js-pn","click",function(e){
           e.preventDefault();
           var pg = this.getAttribute("pg") * 1;
           me.go_page(pg);
        });
        $page_dom.delegate(".js-p-next","click",function(e){
           e.preventDefault();
           var pg = me._cur_params.pn + 1;
           me.go_page(pg);
        });
        $page_dom.delegate(".js-p-prev","click",function(e){
           e.preventDefault();
           var pg = me._cur_params.pn -1;
           me.go_page(pg);
        });  
        var $sf = $("#status-filter");
        $sf.find("li a").click(function(e){
            e.preventDefault();
            var status = this.getAttribute("data-status");
            var text = this.innerHTML;
            $sf.find("button").html(''+text+'<span class="caret"></span>');
            if (status === "all") {
                delete me._cur_params.status;
            } else {
                me._cur_params.status = status;
            }
            me.load();
        });

    },
    render : function(shop_list){
        var $ls = this._$list.empty();
        _.forEach(shop_list,function(item,i){
           var html = item_tpl({
                ind_txt : i + 1,
                name : item.name,
                create_time : item.createTime,
                prd_id : item.id,
                operator : item.operator,
                status : item.checkStatus
           });
           var $d = $(html); 
           $d.data("item",item);
           $ls.append($d);
        });
    },
    render_page : function(pg,total){
        pager.render(this._$page,pg,total,Limit);
    },
    load : function(pg){
        var me = this;
        pg = pg == void 0 ? 1 : pg;
        query_list($.extend({},me._cur_params,{pn:pg})).done(function(rs){
            if (rs.ret === 1 && rs.totalNum) {
                me._$noresult.hide();
                var shop_list = rs.productList;
                me.render(shop_list);
                me._cur_params.pn = pg;
                me.render_page(pg,rs.totalNum);
                me._$list_ct.show();
            } else {
                me._$noresult.html("<p>没有查询到结果</p>").show();
            }
        }).fail(function(){
            me._$noresult.html("<p>后台错误</p>").show();
        });
    },
    go_page : function(pg){
        this.load(pg); 
    }
}

function query_list(data) {
    return http.get({
        url : "/api/getProductList.htm",
        data : $.extend({
            pn : data.pn,
            ps : Limit
        },data || {})
    });
}


module.exports = Prd_List;


},{"../../lib/ipager.js":2,"../../lib/jquery.js":3,"../../lib/juicer.js":4,"../../lib/lodash.compat.min.js":5,"../../mod/http.js":6,"./tmpl/prd_item.js":9}],9:[function(require,module,exports){
(function() {
  var template = juicer.template, templates = juicer.templates = juicer.templates || {};
var tpl = templates['prd_item.tmpl'] = function(_, _method) {_method = juicer.options._method;
'use strict';var _=_||{};var _out='';_out+=''; try { _out+=''; var ind_txt=_.ind_txt;var name=_.name;var create_time=_.create_time;var operator=_.operator;var prd_id=_.prd_id;var status=_.status;var tr=_.tr;var td=_.td;var a=_.a;var m=_.m;var prd=_.prd;var id=_.id;var pencil=_.pencil; _out+=' <tr>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(ind_txt)) ;_out+='     </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(name)) ;_out+='     </td>         <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(create_time)) ;_out+='     </td>     <td>         ';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(operator)) ;_out+='     </td>     <td>         '; if(status == 0 ) { _out+='             未审核         '; } else if(status == 1 ) { _out+='             审核通过         '; } else if(status == 3) { _out+='             审核未通过         '; } _out+='     </td>     <td>         <a href="/m/prd?id=';_out+= _method.__escapehtml.escaping(_method.__escapehtml.detection(prd_id)) ;_out+='" class= "glyphicon glyphicon-pencil"></a>     </td> </tr>  '; } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} _out+='';return _out;
};
})();
module.exports = juicer.templates['prd_item.tmpl'];
},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9jb29raWVzLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2lwYWdlci5qcyIsIi9Vc2Vycy93ay9teXNwYWNlL2dpdC9rdnYvYW1pbHlfbXNfd2ViL3NyYy9zY3JpcHRzL2xpYi9qcXVlcnkuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9saWIvanVpY2VyLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbGliL2xvZGFzaC5jb21wYXQubWluLmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvbW9kL2h0dHAuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL2Zha2VfYzBlNmYzYjEuanMiLCIvVXNlcnMvd2svbXlzcGFjZS9naXQva3Z2L2FtaWx5X21zX3dlYi9zcmMvc2NyaXB0cy9wYWdlL3Nob3Bfc3lzL3ByZF9saXN0LmpzIiwiL1VzZXJzL3drL215c3BhY2UvZ2l0L2t2di9hbWlseV9tc193ZWIvc3JjL3NjcmlwdHMvcGFnZS9zaG9wX3N5cy90bXBsL3ByZF9pdGVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGRvY0Nvb2tpZSA9IChmdW5jdGlvbih1bmRlZmluZWQpIHtcbiAgLypcXFxuICB8KnxcbiAgfCp8ICA6OiBjb29raWVzLmpzIDo6XG4gIHwqfFxuICB8KnwgIEEgY29tcGxldGUgY29va2llcyByZWFkZXIvd3JpdGVyIGZyYW1ld29yayB3aXRoIGZ1bGwgdW5pY29kZSBzdXBwb3J0LlxuICB8KnxcbiAgfCp8ICBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0RPTS9kb2N1bWVudC5jb29raWVcbiAgfCp8XG4gIHwqfCAgVGhpcyBmcmFtZXdvcmsgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBQdWJsaWMgTGljZW5zZSwgdmVyc2lvbiAzIG9yIGxhdGVyLlxuICB8KnwgIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLXN0YW5kYWxvbmUuaHRtbFxuICB8KnxcbiAgfCp8ICBTeW50YXhlczpcbiAgfCp8XG4gIHwqfCAgKiBkb2NDb29raWVzLnNldEl0ZW0obmFtZSwgdmFsdWVbLCBlbmRbLCBwYXRoWywgZG9tYWluWywgc2VjdXJlXV1dXSlcbiAgfCp8ICAqIGRvY0Nvb2tpZXMuZ2V0SXRlbShuYW1lKVxuICB8KnwgICogZG9jQ29va2llcy5yZW1vdmVJdGVtKG5hbWVbLCBwYXRoXSwgZG9tYWluKVxuICB8KnwgICogZG9jQ29va2llcy5oYXNJdGVtKG5hbWUpXG4gIHwqfCAgKiBkb2NDb29raWVzLmtleXMoKVxuICB8KnxcbiAgXFwqL1xuXG4gIHZhciBkb2NDb29raWVzID0ge1xuICAgIGdldEl0ZW06IGZ1bmN0aW9uIChzS2V5KSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoPzooPzpefC4qOylcXFxccypcIiArIGVuY29kZVVSSUNvbXBvbmVudChzS2V5KS5yZXBsYWNlKC9bXFwtXFwuXFwrXFwqXS9nLCBcIlxcXFwkJlwiKSArIFwiXFxcXHMqXFxcXD1cXFxccyooW147XSopLiokKXxeLiokXCIpLCBcIiQxXCIpKSB8fCBudWxsO1xuICAgIH0sXG4gICAgc2V0SXRlbTogZnVuY3Rpb24gKHNLZXksIHNWYWx1ZSwgdkVuZCwgc1BhdGgsIHNEb21haW4sIGJTZWN1cmUpIHtcbiAgICAgIGlmICghc0tleSB8fCAvXig/OmV4cGlyZXN8bWF4XFwtYWdlfHBhdGh8ZG9tYWlufHNlY3VyZSkkL2kudGVzdChzS2V5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIHZhciBzRXhwaXJlcyA9IFwiXCI7XG4gICAgICBpZiAodkVuZCkge1xuICAgICAgICBzd2l0Y2ggKHZFbmQuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICBjYXNlIE51bWJlcjpcbiAgICAgICAgICAgIHNFeHBpcmVzID0gdkVuZCA9PT0gSW5maW5pdHkgPyBcIjsgZXhwaXJlcz1GcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IEdNVFwiIDogXCI7IG1heC1hZ2U9XCIgKyB2RW5kO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBTdHJpbmc6XG4gICAgICAgICAgICBzRXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgdkVuZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRGF0ZTpcbiAgICAgICAgICAgIHNFeHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyB2RW5kLnRvVVRDU3RyaW5nKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuY29va2llID0gZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoc1ZhbHVlKSArIHNFeHBpcmVzICsgKHNEb21haW4gPyBcIjsgZG9tYWluPVwiICsgc0RvbWFpbiA6IFwiXCIpICsgKHNQYXRoID8gXCI7IHBhdGg9XCIgKyBzUGF0aCA6IFwiXCIpICsgKGJTZWN1cmUgPyBcIjsgc2VjdXJlXCIgOiBcIlwiKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cblxuICAgIHJlbW92ZUl0ZW06IGZ1bmN0aW9uIChzS2V5LCBzUGF0aCwgc0RvbWFpbikge1xuICAgICAgaWYgKCFzS2V5IHx8ICF0aGlzLmhhc0l0ZW0oc0tleSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBlbmNvZGVVUklDb21wb25lbnQoc0tleSkgKyBcIj07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVRcIiArICggc0RvbWFpbiA/IFwiOyBkb21haW49XCIgKyBzRG9tYWluIDogXCJcIikgKyAoIHNQYXRoID8gXCI7IHBhdGg9XCIgKyBzUGF0aCA6IFwiXCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBoYXNJdGVtOiBmdW5jdGlvbiAoc0tleSkge1xuICAgICAgcmV0dXJuIChuZXcgUmVnRXhwKFwiKD86Xnw7XFxcXHMqKVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICsgXCJcXFxccypcXFxcPVwiKSkudGVzdChkb2N1bWVudC5jb29raWUpO1xuICAgIH0sXG4gICAga2V5czogLyogb3B0aW9uYWwgbWV0aG9kOiB5b3UgY2FuIHNhZmVseSByZW1vdmUgaXQhICovIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhS2V5cyA9IGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKC8oKD86XnxcXHMqOylbXlxcPV0rKSg/PTt8JCl8Xlxccyp8XFxzKig/OlxcPVteO10qKT8oPzpcXDF8JCkvZywgXCJcIikuc3BsaXQoL1xccyooPzpcXD1bXjtdKik/O1xccyovKTtcbiAgICAgIGZvciAodmFyIG5JZHggPSAwOyBuSWR4IDwgYUtleXMubGVuZ3RoOyBuSWR4KyspIHsgYUtleXNbbklkeF0gPSBkZWNvZGVVUklDb21wb25lbnQoYUtleXNbbklkeF0pOyB9XG4gICAgICByZXR1cm4gYUtleXM7XG4gICAgfVxuICB9O1xuICByZXR1cm4gZG9jQ29va2llcztcbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9ICBkb2NDb29raWU7XG5cbiIsInZhciAkID0gcmVxdWlyZShcIi4vanF1ZXJ5XCIpO1xudmFyIHJlbmRlciA9IGZ1bmN0aW9uKGRvbSxub3csIHRvdGFsLCBsaW1pdCkge1xuXHR2YXIgbWF4ID0gTWF0aC5jZWlsKHRvdGFsIC8gbGltaXQpO1xuXHR2YXIgcGFnZXIgPSB7XG5cdFx0bm93OiBub3csXG5cdFx0bWF4OiBtYXhcblx0fTtcblx0dmFyIHBhZ2VzID0gY3JlYXRlKHBhZ2VyKTtcblx0cmVuZGVyX2h0bWwoZG9tLHBhZ2VzLCBwYWdlcik7XG59XG5cbnZhciByZW5kZXJfaHRtbCA9IGZ1bmN0aW9uKGRvbSxwYWdlcywgcGFnZ2VyKSB7XG5cdC8qKiDliIbpobUqKi9cblx0dmFyIG5vdyA9IHBhZ2dlci5ub3c7XG5cdHZhciBodG1sID0gWyc8ZGl2IGNsYXNzPVwicGFnZXNcIj4nXTtcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBwYWdlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRpZiAodHlwZW9mIHBhZ2VzW2ldID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRpZiAocGFnZXNbaV0gPT0gbm93KSB7XG5cdFx0XHRcdGh0bWwucHVzaCgnPGVtID48c3Bhbj4nICsgbm93ICsgJzwvc3Bhbj48L2VtPicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aHRtbC5wdXNoKCc8YSBjbGFzcz1cInBnLWl0ZW0ganMtcG5cIiBwZz1cIicgKyBwYWdlc1tpXSArICdcIiBocmVmPVwiI1wiPjxzcGFuPicgKyBwYWdlc1tpXSArICc8L3NwYW4+PC9hPicpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHBhZ2VzW2ldID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRodG1sLnB1c2goXCI8c3BhbiA+Li4uPC9zcGFuPlwiKTtcblx0XHR9XG5cdH1cblxuXHRpZiAocGFnZ2VyLm5vdyA8IHBhZ2dlci5tYXgpIHtcblx0XHRodG1sLnB1c2goJzxhIGNsYXNzPVwicGctaXRlbSBwYWdlLW5leHQganMtcC1uZXh0XCIgaHJlZj1cIiNcIiB0aXRsZT1cIuS4i+S4gOmhtVwiPuS4i+S4gOmhtTwvYT4nKTtcblx0fVxuXHRpZiAocGFnZ2VyLm5vdyA+IDEpIHtcblx0XHRodG1sLnNwbGljZSgxLCAwLCAnPGEgY2xhc3M9XCJwZy1pdGVtIHBhZ2UtcHJldiBqcy1wLXByZXZcIiBocmVmPVwiI1wiIHRpdGxlPVwi5LiK5LiA6aG1XCI+5LiK5LiA6aG1PC9hPiAnKTtcblx0fVxuXHRodG1sLnB1c2goXCI8L2Rpdj5cIik7XG5cdGRvbS5odG1sKGh0bWwuam9pbihcIlwiKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZShwYWdnZXIpIHtcblx0dmFyIG1heCA9IHBhZ2dlci5tYXgsXG5cdG5vdyA9IHBhZ2dlci5ub3c7XG5cdHZhciBmX29mZnNldCA9IDI7IC8v5YGP56e76YePXG5cdHZhciBsX3JfbGltaXQgPSA1O1xuXHR2YXIgcGFnZXMgPSBbXTtcblx0dmFyIGdhcCA9IFwiLi4uXCI7XG5cdHZhciBycyA9IFtdLFxuXHRscyA9IFtdLFxuXHRsdixcblx0cnYsXG5cdG1heGVkID0gZmFsc2UsXG5cdG1pbmVkID0gZmFsc2U7XG5cdGx2ID0gcnYgPSBub3c7XG5cblx0aWYgKDEgPT0gbWF4KSB7XG5cdFx0cmV0dXJuIFsxXTtcblx0fVxuXHRpZiAobF9yX2xpbWl0ID49IG1heCkge1xuXHRcdHZhciBwYWdlcyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IG1heDsgaSsrKSB7XG5cdFx0XHRwYWdlcy5wdXNoKGkpO1xuXHRcdH1cblx0XHRyZXR1cm4gcGFnZXM7XG5cdH1cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmX29mZnNldDsgaSsrKSB7XG5cdFx0aWYgKCsrcnYgPj0gbWF4KSB7XG5cdFx0XHRpZiAoIW1heGVkKSB7XG5cdFx0XHRcdHJzLnB1c2gobWF4KTtcblx0XHRcdFx0bWF4ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRycy5wdXNoKHJ2KTtcblx0XHR9XG5cdFx0aWYgKC0tbHYgPD0gMSkge1xuXHRcdFx0aWYgKCFtaW5lZCkge1xuXHRcdFx0XHRscy5zcGxpY2UoMCwgMCwgMSk7XG5cdFx0XHRcdG1pbmVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bHMuc3BsaWNlKDAsIDAsIGx2KTtcblx0XHR9XG5cblx0fVxuXG5cdHZhciBwYWdlcyA9IGxzLmNvbmNhdChbbm93XSkuY29uY2F0KHJzKTtcblx0aWYgKCFtYXhlZCkge1xuXHRcdGlmIChwYWdlc1twYWdlcy5sZW5ndGggLSAxXSA8IG1heCAtIDEpIHtcblx0XHRcdHBhZ2VzLnB1c2goZ2FwKTtcblx0XHR9XG5cdFx0cGFnZXMucHVzaChtYXgpO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChsX3JfbGltaXQgPiBtYXgpIHtcblx0XHRcdHBhZ2VzID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSBtYXg7IGkrKykge1xuXHRcdFx0XHRwYWdlcy5wdXNoKGkpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYWdlcyA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IG1heDsgaSA+IG1heCAtIGxfcl9saW1pdDsgaS0tKSB7XG5cdFx0XHRcdHBhZ2VzLnNwbGljZSgwLCAwLCBpKTtcblx0XHRcdH1cblx0XHRcdGlmICgxIDwgbWF4IC0gbF9yX2xpbWl0KSB7XG5cdFx0XHRcdHBhZ2VzLnNwbGljZSgwLCAwLCBnYXApO1xuXHRcdFx0fVxuXHRcdFx0cGFnZXMuc3BsaWNlKDAsIDAsIDEpO1xuXHRcdFx0cmV0dXJuIHBhZ2VzO1xuXHRcdH1cblxuXHR9XG5cblx0aWYgKCFtaW5lZCkge1xuXHRcdGlmIChwYWdlc1swXSA+IDIpIHtcblx0XHRcdHBhZ2VzID0gWzEsIGdhcF0uY29uY2F0KHBhZ2VzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFnZXMuc3BsaWNlKDAsIDAsIDEpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpZiAobF9yX2xpbWl0ID49IG1heCkge1xuXHRcdFx0cGFnZXMgPSBbXTtcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IG1heDsgaSsrKSB7XG5cdFx0XHRcdHBhZ2VzLnB1c2goaSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhZ2VzID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSBsX3JfbGltaXQ7IGkrKykge1xuXHRcdFx0XHRwYWdlcy5wdXNoKGkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxfcl9saW1pdCA8IG1heCAtIDEpIHtcblx0XHRcdFx0cGFnZXMucHVzaChnYXApO1xuXHRcdFx0fVxuXHRcdFx0cGFnZXMucHVzaChtYXgpO1xuXHRcdH1cblxuXHR9XG5cblx0cmV0dXJuIHBhZ2VzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVuZGVyIDogcmVuZGVyXG59O1xuIiwidmFyICQgPSB3aW5kb3cualF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSAkO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLypcbiAgICAqKioqKioqKioqIEp1aWNlciAqKioqKioqKioqXG4gICAgJHtBIEZhc3QgdGVtcGxhdGUgZW5naW5lfVxuICAgIFByb2plY3QgSG9tZTogaHR0cDovL2p1aWNlci5uYW1lXG5cbiAgICBBdXRob3I6IEd1b2thaVxuICAgIEd0YWxrOiBiYWRrYWlrYWlAZ21haWwuY29tXG4gICAgQmxvZzogaHR0cDovL2JlbmJlbi5jY1xuICAgIExpY2VuY2U6IE1JVCBMaWNlbnNlXG4gICAgVmVyc2lvbjogMC42Ljgtc3RhYmxlXG4qL1xuXG4oZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIGZvciBub3Qgb25seSBjb21waWxpbmcgYnV0IGFsc28gcmVuZGVyaW5nLlxuICAgIC8vIHRoZXJlJ3MgYXQgbGVhc3QgdHdvIHBhcmFtZXRlcnMgbmVlZCB0byBiZSBwcm92aWRlZCwgb25lIGlzIHRoZSB0cGwsIFxuICAgIC8vIGFub3RoZXIgaXMgdGhlIGRhdGEsIHRoZSB0cGwgY2FuIGVpdGhlciBiZSBhIHN0cmluZywgb3IgYW4gaWQgbGlrZSAjaWQuXG4gICAgLy8gaWYgb25seSB0cGwgd2FzIGdpdmVuLCBpdCdsbCByZXR1cm4gdGhlIGNvbXBpbGVkIHJldXNhYmxlIGZ1bmN0aW9uLlxuICAgIC8vIGlmIHRwbCBhbmQgZGF0YSB3ZXJlIGdpdmVuIGF0IHRoZSBzYW1lIHRpbWUsIGl0J2xsIHJldHVybiB0aGUgcmVuZGVyZWQgXG4gICAgLy8gcmVzdWx0IGltbWVkaWF0ZWx5LlxuXG4gICAgdmFyIGp1aWNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgICBhcmdzLnB1c2goanVpY2VyLm9wdGlvbnMpO1xuXG4gICAgICAgIGlmKGFyZ3NbMF0ubWF0Y2goL15cXHMqIyhbXFx3OlxcLVxcLl0rKVxccyokL2lnbSkpIHtcbiAgICAgICAgICAgIGFyZ3NbMF0ucmVwbGFjZSgvXlxccyojKFtcXHc6XFwtXFwuXSspXFxzKiQvaWdtLCBmdW5jdGlvbigkLCAkaWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW0gPSBfZG9jdW1lbnQgJiYgX2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCRpZCk7XG4gICAgICAgICAgICAgICAgYXJnc1swXSA9IGVsZW0gPyAoZWxlbS52YWx1ZSB8fCBlbGVtLmlubmVySFRNTCkgOiAkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2YoZG9jdW1lbnQpICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICBqdWljZXIuY29tcGlsZS5jYWxsKGp1aWNlciwgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4ganVpY2VyLmNvbXBpbGUuYXBwbHkoanVpY2VyLCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmV0dXJuIGp1aWNlci50b19odG1sLmFwcGx5KGp1aWNlciwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF9fZXNjYXBlaHRtbCA9IHtcbiAgICAgICAgZXNjYXBlaGFzaDoge1xuICAgICAgICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAgICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgICAgICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICAgICAgICAgJy8nOiAnJiN4MmY7J1xuICAgICAgICB9LFxuICAgICAgICBlc2NhcGVyZXBsYWNlOiBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICByZXR1cm4gX19lc2NhcGVodG1sLmVzY2FwZWhhc2hba107XG4gICAgICAgIH0sXG4gICAgICAgIGVzY2FwaW5nOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Yoc3RyKSAhPT0gJ3N0cmluZycgPyBzdHIgOiBzdHIucmVwbGFjZSgvWyY8PlwiXS9pZ20sIHRoaXMuZXNjYXBlcmVwbGFjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRldGVjdGlvbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihkYXRhKSA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IGRhdGE7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF9fdGhyb3cgPSBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBpZih0eXBlb2YoY29uc29sZSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZihjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY29uc29sZS5sb2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3coZXJyb3IpO1xuICAgIH07XG5cbiAgICB2YXIgX19jcmVhdG9yID0gZnVuY3Rpb24obywgcHJvdG8pIHtcbiAgICAgICAgbyA9IG8gIT09IE9iamVjdChvKSA/IHt9IDogbztcblxuICAgICAgICBpZihvLl9fcHJvdG9fXykge1xuICAgICAgICAgICAgby5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgICAgIHJldHVybiBvO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVtcHR5ID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgdmFyIG4gPSBPYmplY3QuY3JlYXRlID8gXG4gICAgICAgICAgICBPYmplY3QuY3JlYXRlKHByb3RvKSA6IFxuICAgICAgICAgICAgbmV3KGVtcHR5LnByb3RvdHlwZSA9IHByb3RvLCBlbXB0eSk7XG5cbiAgICAgICAgZm9yKHZhciBpIGluIG8pIHtcbiAgICAgICAgICAgIGlmKG8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBuW2ldID0gb1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuO1xuICAgIH07XG5cbiAgICB2YXIgYW5ub3RhdGUgPSBmdW5jdGlvbihmbikge1xuICAgICAgICB2YXIgRk5fQVJHUyA9IC9eZnVuY3Rpb25cXHMqW15cXChdKlxcKFxccyooW15cXCldKilcXCkvbTtcbiAgICAgICAgdmFyIEZOX0FSR19TUExJVCA9IC8sLztcbiAgICAgICAgdmFyIEZOX0FSRyA9IC9eXFxzKihfPykoXFxTKz8pXFwxXFxzKiQvO1xuICAgICAgICB2YXIgRk5fQk9EWSA9IC9eZnVuY3Rpb25bXntdK3soW1xcc1xcU10qKX0vbTtcbiAgICAgICAgdmFyIFNUUklQX0NPTU1FTlRTID0gLygoXFwvXFwvLiokKXwoXFwvXFwqW1xcc1xcU10qP1xcKlxcLykpL21nO1xuICAgICAgICB2YXIgYXJncyA9IFtdLFxuICAgICAgICAgICAgZm5UZXh0LFxuICAgICAgICAgICAgZm5Cb2R5LFxuICAgICAgICAgICAgYXJnRGVjbDtcblxuICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpZiAoZm4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm5UZXh0ID0gZm4udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBmbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZuVGV4dCA9IGZuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm5UZXh0ID0gZm5UZXh0LnJlcGxhY2UoU1RSSVBfQ09NTUVOVFMsICcnKTtcbiAgICAgICAgZm5UZXh0ID0gZm5UZXh0LnRyaW0oKTtcbiAgICAgICAgYXJnRGVjbCA9IGZuVGV4dC5tYXRjaChGTl9BUkdTKTtcbiAgICAgICAgZm5Cb2R5ID0gZm5UZXh0Lm1hdGNoKEZOX0JPRFkpWzFdLnRyaW0oKTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJnRGVjbFsxXS5zcGxpdChGTl9BUkdfU1BMSVQpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gYXJnRGVjbFsxXS5zcGxpdChGTl9BUkdfU1BMSVQpW2ldO1xuICAgICAgICAgICAgYXJnLnJlcGxhY2UoRk5fQVJHLCBmdW5jdGlvbihhbGwsIHVuZGVyc2NvcmUsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2gobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbYXJncywgZm5Cb2R5XTtcbiAgICB9O1xuXG4gICAganVpY2VyLl9fY2FjaGUgPSB7fTtcbiAgICBqdWljZXIudmVyc2lvbiA9ICcwLjYuOC1zdGFibGUnO1xuICAgIGp1aWNlci5zZXR0aW5ncyA9IHt9O1xuXG4gICAganVpY2VyLnRhZ3MgPSB7XG4gICAgICAgIG9wZXJhdGlvbk9wZW46ICd7QCcsXG4gICAgICAgIG9wZXJhdGlvbkNsb3NlOiAnfScsXG4gICAgICAgIGludGVycG9sYXRlT3BlbjogJ1xcXFwkeycsXG4gICAgICAgIGludGVycG9sYXRlQ2xvc2U6ICd9JyxcbiAgICAgICAgbm9uZWVuY29kZU9wZW46ICdcXFxcJFxcXFwkeycsXG4gICAgICAgIG5vbmVlbmNvZGVDbG9zZTogJ30nLFxuICAgICAgICBjb21tZW50T3BlbjogJ1xcXFx7IycsXG4gICAgICAgIGNvbW1lbnRDbG9zZTogJ1xcXFx9J1xuICAgIH07XG5cbiAgICBqdWljZXIub3B0aW9ucyA9IHtcbiAgICAgICAgY2FjaGU6IHRydWUsXG4gICAgICAgIHN0cmlwOiB0cnVlLFxuICAgICAgICBlcnJvcmhhbmRsaW5nOiB0cnVlLFxuICAgICAgICBkZXRlY3Rpb246IHRydWUsXG4gICAgICAgIF9tZXRob2Q6IF9fY3JlYXRvcih7XG4gICAgICAgICAgICBfX2VzY2FwZWh0bWw6IF9fZXNjYXBlaHRtbCxcbiAgICAgICAgICAgIF9fdGhyb3c6IF9fdGhyb3csXG4gICAgICAgICAgICBfX2p1aWNlcjoganVpY2VyXG4gICAgICAgIH0sIHt9KVxuICAgIH07XG5cbiAgICBqdWljZXIudGFnSW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9yc3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2VhY2hcXFxccyooW159XSo/KVxcXFxzKmFzXFxcXHMqKFxcXFx3Kj8pXFxcXHMqKCxcXFxccypcXFxcdyo/KT8nICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBmb3JlbmQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ1xcXFwvZWFjaCcgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGlmc3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2lmXFxcXHMqKFtefV0qPyknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBpZmVuZCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnXFxcXC9pZicgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGVsc2VzdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnZWxzZScgKyBqdWljZXIudGFncy5vcGVyYXRpb25DbG9zZTtcbiAgICAgICAgdmFyIGVsc2VpZnN0YXJ0ID0ganVpY2VyLnRhZ3Mub3BlcmF0aW9uT3BlbiArICdlbHNlIGlmXFxcXHMqKFtefV0qPyknICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBpbnRlcnBvbGF0ZSA9IGp1aWNlci50YWdzLmludGVycG9sYXRlT3BlbiArICcoW1xcXFxzXFxcXFNdKz8pJyArIGp1aWNlci50YWdzLmludGVycG9sYXRlQ2xvc2U7XG4gICAgICAgIHZhciBub25lZW5jb2RlID0ganVpY2VyLnRhZ3Mubm9uZWVuY29kZU9wZW4gKyAnKFtcXFxcc1xcXFxTXSs/KScgKyBqdWljZXIudGFncy5ub25lZW5jb2RlQ2xvc2U7XG4gICAgICAgIHZhciBpbmxpbmVjb21tZW50ID0ganVpY2VyLnRhZ3MuY29tbWVudE9wZW4gKyAnW159XSo/JyArIGp1aWNlci50YWdzLmNvbW1lbnRDbG9zZTtcbiAgICAgICAgdmFyIHJhbmdlc3RhcnQgPSBqdWljZXIudGFncy5vcGVyYXRpb25PcGVuICsgJ2VhY2hcXFxccyooXFxcXHcqPylcXFxccyppblxcXFxzKnJhbmdlXFxcXCgoW159XSs/KVxcXFxzKixcXFxccyooW159XSs/KVxcXFwpJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaW5jbHVkZSA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnaW5jbHVkZVxcXFxzKihbXn1dKj8pXFxcXHMqLFxcXFxzKihbXn1dKj8pJyArIGp1aWNlci50YWdzLm9wZXJhdGlvbkNsb3NlO1xuICAgICAgICB2YXIgaGVscGVyUmVnaXN0ZXJTdGFydCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnaGVscGVyXFxcXHMqKFtefV0qPylcXFxccyonICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG4gICAgICAgIHZhciBoZWxwZXJSZWdpc3RlckJvZHkgPSAnKFtcXFxcc1xcXFxTXSo/KSc7XG4gICAgICAgIHZhciBoZWxwZXJSZWdpc3RlckVuZCA9IGp1aWNlci50YWdzLm9wZXJhdGlvbk9wZW4gKyAnXFxcXC9oZWxwZXInICsganVpY2VyLnRhZ3Mub3BlcmF0aW9uQ2xvc2U7XG5cbiAgICAgICAganVpY2VyLnNldHRpbmdzLmZvcnN0YXJ0ID0gbmV3IFJlZ0V4cChmb3JzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZm9yZW5kID0gbmV3IFJlZ0V4cChmb3JlbmQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmlmc3RhcnQgPSBuZXcgUmVnRXhwKGlmc3RhcnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmlmZW5kID0gbmV3IFJlZ0V4cChpZmVuZCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuZWxzZXN0YXJ0ID0gbmV3IFJlZ0V4cChlbHNlc3RhcnQsICdpZ20nKTtcbiAgICAgICAganVpY2VyLnNldHRpbmdzLmVsc2VpZnN0YXJ0ID0gbmV3IFJlZ0V4cChlbHNlaWZzdGFydCwgJ2lnbScpO1xuICAgICAgICBqdWljZXIuc2V0dGluZ3MuaW50ZXJwb2xhdGUgPSBuZXcgUmVnRXhwKGludGVycG9sYXRlLCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5ub25lZW5jb2RlID0gbmV3IFJlZ0V4cChub25lZW5jb2RlLCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5pbmxpbmVjb21tZW50ID0gbmV3IFJlZ0V4cChpbmxpbmVjb21tZW50LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5yYW5nZXN0YXJ0ID0gbmV3IFJlZ0V4cChyYW5nZXN0YXJ0LCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5pbmNsdWRlID0gbmV3IFJlZ0V4cChpbmNsdWRlLCAnaWdtJyk7XG4gICAgICAgIGp1aWNlci5zZXR0aW5ncy5oZWxwZXJSZWdpc3RlciA9IG5ldyBSZWdFeHAoaGVscGVyUmVnaXN0ZXJTdGFydCArIGhlbHBlclJlZ2lzdGVyQm9keSArIGhlbHBlclJlZ2lzdGVyRW5kLCAnaWdtJyk7XG4gICAgfTtcblxuICAgIGp1aWNlci50YWdJbml0KCk7XG5cbiAgICAvLyBVc2luZyB0aGlzIG1ldGhvZCB0byBzZXQgdGhlIG9wdGlvbnMgYnkgZ2l2ZW4gY29uZi1uYW1lIGFuZCBjb25mLXZhbHVlLFxuICAgIC8vIHlvdSBjYW4gYWxzbyBwcm92aWRlIG1vcmUgdGhhbiBvbmUga2V5LXZhbHVlIHBhaXIgd3JhcHBlZCBieSBhbiBvYmplY3QuXG4gICAgLy8gdGhpcyBpbnRlcmZhY2UgYWxzbyB1c2VkIHRvIGN1c3RvbSB0aGUgdGVtcGxhdGUgdGFnIGRlbGltYXRlciwgZm9yIHRoaXNcbiAgICAvLyBzaXR1YXRpb24sIHRoZSBjb25mLW5hbWUgbXVzdCBiZWdpbiB3aXRoIHRhZzo6LCBmb3IgZXhhbXBsZToganVpY2VyLnNldFxuICAgIC8vICgndGFnOjpvcGVyYXRpb25PcGVuJywgJ3tAJykuXG5cbiAgICBqdWljZXIuc2V0ID0gZnVuY3Rpb24oY29uZiwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHZhciBlc2NhcGVQYXR0ZXJuID0gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgcmV0dXJuIHYucmVwbGFjZSgvW1xcJFxcKFxcKVxcW1xcXVxcK1xcXlxce1xcfVxcP1xcKlxcfFxcLl0vaWdtLCBmdW5jdGlvbigkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXFxcJyArICQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc2V0ID0gZnVuY3Rpb24oY29uZiwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB0YWcgPSBjb25mLm1hdGNoKC9edGFnOjooLiopJC9pKTtcblxuICAgICAgICAgICAgaWYodGFnKSB7XG4gICAgICAgICAgICAgICAgdGhhdC50YWdzW3RhZ1sxXV0gPSBlc2NhcGVQYXR0ZXJuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGF0LnRhZ0luaXQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoYXQub3B0aW9uc1tjb25mXSA9IHZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHNldChjb25mLCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZihjb25mID09PSBPYmplY3QoY29uZikpIHtcbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiBjb25mKSB7XG4gICAgICAgICAgICAgICAgaWYoY29uZi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXQoaSwgY29uZltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEJlZm9yZSB5b3UncmUgdXNpbmcgY3VzdG9tIGZ1bmN0aW9ucyBpbiB5b3VyIHRlbXBsYXRlIGxpa2UgJHtuYW1lIHwgZm5OYW1lfSxcbiAgICAvLyB5b3UgbmVlZCB0byByZWdpc3RlciB0aGlzIGZuIGJ5IGp1aWNlci5yZWdpc3RlcignZm5OYW1lJywgZm4pLlxuXG4gICAganVpY2VyLnJlZ2lzdGVyID0gZnVuY3Rpb24oZm5hbWUsIGZuKSB7XG4gICAgICAgIHZhciBfbWV0aG9kID0gdGhpcy5vcHRpb25zLl9tZXRob2Q7XG5cbiAgICAgICAgaWYoX21ldGhvZC5oYXNPd25Qcm9wZXJ0eShmbmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfbWV0aG9kW2ZuYW1lXSA9IGZuO1xuICAgIH07XG5cbiAgICAvLyByZW1vdmUgdGhlIHJlZ2lzdGVyZWQgZnVuY3Rpb24gaW4gdGhlIG1lbW9yeSBieSB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gbmFtZS5cbiAgICAvLyBmb3IgZXhhbXBsZToganVpY2VyLnVucmVnaXN0ZXIoJ2ZuTmFtZScpLlxuXG4gICAganVpY2VyLnVucmVnaXN0ZXIgPSBmdW5jdGlvbihmbmFtZSkge1xuICAgICAgICB2YXIgX21ldGhvZCA9IHRoaXMub3B0aW9ucy5fbWV0aG9kO1xuXG4gICAgICAgIGlmKF9tZXRob2QuaGFzT3duUHJvcGVydHkoZm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsZXRlIF9tZXRob2RbZm5hbWVdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGp1aWNlci50ZW1wbGF0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAgICAgdGhpcy5fX2ludGVycG9sYXRlID0gZnVuY3Rpb24oX25hbWUsIF9lc2NhcGUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBfZGVmaW5lID0gX25hbWUuc3BsaXQoJ3wnKSwgX2ZuID0gX2RlZmluZVswXSB8fCAnJywgX2NsdXN0ZXI7XG5cbiAgICAgICAgICAgIGlmKF9kZWZpbmUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIF9uYW1lID0gX2RlZmluZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIF9jbHVzdGVyID0gX2RlZmluZS5zaGlmdCgpLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgX2ZuID0gJ19tZXRob2QuJyArIF9jbHVzdGVyLnNoaWZ0KCkgKyAnLmNhbGwoe30sICcgKyBbX25hbWVdLmNvbmNhdChfY2x1c3RlcikgKyAnKSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAnPCU9ICcgKyAoX2VzY2FwZSA/ICdfbWV0aG9kLl9fZXNjYXBlaHRtbC5lc2NhcGluZycgOiAnJykgKyAnKCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKCFvcHRpb25zIHx8IG9wdGlvbnMuZGV0ZWN0aW9uICE9PSBmYWxzZSA/ICdfbWV0aG9kLl9fZXNjYXBlaHRtbC5kZXRlY3Rpb24nIDogJycpICsgJygnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZm4gK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyknICtcbiAgICAgICAgICAgICAgICAgICAgJyknICtcbiAgICAgICAgICAgICAgICAnICU+JztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fcmVtb3ZlU2hlbGwgPSBmdW5jdGlvbih0cGwsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBfY291bnRlciA9IDA7XG5cbiAgICAgICAgICAgIHRwbCA9IHRwbFxuICAgICAgICAgICAgICAgIC8vIGlubGluZSBoZWxwZXIgcmVnaXN0ZXJcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaGVscGVyUmVnaXN0ZXIsIGZ1bmN0aW9uKCQsIGhlbHBlck5hbWUsIGZuVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5ubyA9IGFubm90YXRlKGZuVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbkFyZ3MgPSBhbm5vWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm5Cb2R5ID0gYW5ub1sxXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gbmV3IEZ1bmN0aW9uKGZuQXJncy5qb2luKCcsJyksIGZuQm9keSk7XG5cbiAgICAgICAgICAgICAgICAgICAganVpY2VyLnJlZ2lzdGVyKGhlbHBlck5hbWUsIGZuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGZvciBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmZvcnN0YXJ0LCBmdW5jdGlvbigkLCBfbmFtZSwgYWxpYXMsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWxpYXMgPSBhbGlhcyB8fCAndmFsdWUnLCBrZXkgPSBrZXkgJiYga2V5LnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9pdGVyYXRlID0gJ2knICsgX2NvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSB+ZnVuY3Rpb24oKSB7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmb3IodmFyICcgKyBfaXRlcmF0ZSArICcgaW4gJyArIF9uYW1lICsgJykgeycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lmKCcgKyBfbmFtZSArICcuaGFzT3duUHJvcGVydHkoJyArIF9pdGVyYXRlICsgJykpIHsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFyICcgKyBhbGlhcyArICc9JyArIF9uYW1lICsgJ1snICsgX2l0ZXJhdGUgKyAnXTsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoa2V5ID8gKCd2YXIgJyArIGtleSArICc9JyArIF9pdGVyYXRlICsgJzsnKSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAlPic7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZm9yZW5kLCAnPCUgfX19KCk7ICU+JylcblxuICAgICAgICAgICAgICAgIC8vIGlmIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaWZzdGFydCwgZnVuY3Rpb24oJCwgY29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCUgaWYoJyArIGNvbmRpdGlvbiArICcpIHsgJT4nO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmlmZW5kLCAnPCUgfSAlPicpXG5cbiAgICAgICAgICAgICAgICAvLyBlbHNlIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZWxzZXN0YXJ0LCBmdW5jdGlvbigkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPCUgfSBlbHNlIHsgJT4nO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBlbHNlIGlmIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZWxzZWlmc3RhcnQsIGZ1bmN0aW9uKCQsIGNvbmRpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlIH0gZWxzZSBpZignICsgY29uZGl0aW9uICsgJykgeyAlPic7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIGludGVycG9sYXRlIHdpdGhvdXQgZXNjYXBlXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLm5vbmVlbmNvZGUsIGZ1bmN0aW9uKCQsIF9uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGF0Ll9faW50ZXJwb2xhdGUoX25hbWUsIGZhbHNlLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gaW50ZXJwb2xhdGUgd2l0aCBlc2NhcGVcbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaW50ZXJwb2xhdGUsIGZ1bmN0aW9uKCQsIF9uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGF0Ll9faW50ZXJwb2xhdGUoX25hbWUsIHRydWUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBjbGVhbiB1cCBjb21tZW50c1xuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbmxpbmVjb21tZW50LCAnJylcblxuICAgICAgICAgICAgICAgIC8vIHJhbmdlIGV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZShqdWljZXIuc2V0dGluZ3MucmFuZ2VzdGFydCwgZnVuY3Rpb24oJCwgX25hbWUsIHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9pdGVyYXRlID0gJ2onICsgX2NvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8JSB+ZnVuY3Rpb24oKSB7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmb3IodmFyICcgKyBfaXRlcmF0ZSArICc9JyArIHN0YXJ0ICsgJzsnICsgX2l0ZXJhdGUgKyAnPCcgKyBlbmQgKyAnOycgKyBfaXRlcmF0ZSArICcrKykge3snICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YXIgJyArIF9uYW1lICsgJz0nICsgX2l0ZXJhdGUgKyAnOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgJT4nO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBpbmNsdWRlIHN1Yi10ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKGp1aWNlci5zZXR0aW5ncy5pbmNsdWRlLCBmdW5jdGlvbigkLCB0cGwsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29tcGF0aWJsZSBmb3Igbm9kZS5qc1xuICAgICAgICAgICAgICAgICAgICBpZih0cGwubWF0Y2goL15maWxlXFw6XFwvXFwvL2lnbSkpIHJldHVybiAkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzwlPSBfbWV0aG9kLl9fanVpY2VyKCcgKyB0cGwgKyAnLCAnICsgZGF0YSArICcpOyAlPic7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGV4Y2VwdGlvbiBoYW5kbGluZ1xuICAgICAgICAgICAgaWYoIW9wdGlvbnMgfHwgb3B0aW9ucy5lcnJvcmhhbmRsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRwbCA9ICc8JSB0cnkgeyAlPicgKyB0cGw7XG4gICAgICAgICAgICAgICAgdHBsICs9ICc8JSB9IGNhdGNoKGUpIHtfbWV0aG9kLl9fdGhyb3coXCJKdWljZXIgUmVuZGVyIEV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlKTt9ICU+JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRwbDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fdG9OYXRpdmUgPSBmdW5jdGlvbih0cGwsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fY29udmVydCh0cGwsICFvcHRpb25zIHx8IG9wdGlvbnMuc3RyaXApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19sZXhpY2FsQW5hbHl6ZSA9IGZ1bmN0aW9uKHRwbCkge1xuICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IFtdO1xuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IFtdO1xuICAgICAgICAgICAgdmFyIHByZWZpeCA9ICcnO1xuICAgICAgICAgICAgdmFyIHJlc2VydmVkID0gW1xuICAgICAgICAgICAgICAgICdpZicsICdlYWNoJywgJ18nLCAnX21ldGhvZCcsICdjb25zb2xlJywgXG4gICAgICAgICAgICAgICAgJ2JyZWFrJywgJ2Nhc2UnLCAnY2F0Y2gnLCAnY29udGludWUnLCAnZGVidWdnZXInLCAnZGVmYXVsdCcsICdkZWxldGUnLCAnZG8nLCBcbiAgICAgICAgICAgICAgICAnZmluYWxseScsICdmb3InLCAnZnVuY3Rpb24nLCAnaW4nLCAnaW5zdGFuY2VvZicsICduZXcnLCAncmV0dXJuJywgJ3N3aXRjaCcsIFxuICAgICAgICAgICAgICAgICd0aGlzJywgJ3Rocm93JywgJ3RyeScsICd0eXBlb2YnLCAndmFyJywgJ3ZvaWQnLCAnd2hpbGUnLCAnd2l0aCcsICdudWxsJywgJ3R5cGVvZicsIFxuICAgICAgICAgICAgICAgICdjbGFzcycsICdlbnVtJywgJ2V4cG9ydCcsICdleHRlbmRzJywgJ2ltcG9ydCcsICdzdXBlcicsICdpbXBsZW1lbnRzJywgJ2ludGVyZmFjZScsIFxuICAgICAgICAgICAgICAgICdsZXQnLCAncGFja2FnZScsICdwcml2YXRlJywgJ3Byb3RlY3RlZCcsICdwdWJsaWMnLCAnc3RhdGljJywgJ3lpZWxkJywgJ2NvbnN0JywgJ2FyZ3VtZW50cycsIFxuICAgICAgICAgICAgICAgICd0cnVlJywgJ2ZhbHNlJywgJ3VuZGVmaW5lZCcsICdOYU4nXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICB2YXIgaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciB2YXJpYWJsZUFuYWx5emUgPSBmdW5jdGlvbigkLCBzdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSBzdGF0ZW1lbnQubWF0Y2goL1xcdysvaWdtKVswXTtcblxuICAgICAgICAgICAgICAgIGlmKGluZGV4T2YoYnVmZmVyLCBzdGF0ZW1lbnQpID09PSAtMSAmJiBpbmRleE9mKHJlc2VydmVkLCBzdGF0ZW1lbnQpID09PSAtMSAmJiBpbmRleE9mKG1ldGhvZCwgc3RhdGVtZW50KSA9PT0gLTEpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBhdm9pZCByZS1kZWNsYXJlIG5hdGl2ZSBmdW5jdGlvbiwgaWYgbm90IGRvIHRoaXMsIHRlbXBsYXRlIFxuICAgICAgICAgICAgICAgICAgICAvLyBge0BpZiBlbmNvZGVVUklDb21wb25lbnQobmFtZSl9YCBjb3VsZCBiZSB0aHJvdyB1bmRlZmluZWQuXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHdpbmRvdykgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZih3aW5kb3dbc3RhdGVtZW50XSkgPT09ICdmdW5jdGlvbicgJiYgd2luZG93W3N0YXRlbWVudF0udG9TdHJpbmcoKS5tYXRjaCgvXlxccyo/ZnVuY3Rpb24gXFx3K1xcKFxcKSBcXHtcXHMqP1xcW25hdGl2ZSBjb2RlXFxdXFxzKj9cXH1cXHMqPyQvaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29tcGF0aWJsZSBmb3Igbm9kZS5qc1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoZ2xvYmFsKSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mKGdsb2JhbFtzdGF0ZW1lbnRdKSA9PT0gJ2Z1bmN0aW9uJyAmJiBnbG9iYWxbc3RhdGVtZW50XS50b1N0cmluZygpLm1hdGNoKC9eXFxzKj9mdW5jdGlvbiBcXHcrXFwoXFwpIFxce1xccyo/XFxbbmF0aXZlIGNvZGVcXF1cXHMqP1xcfVxccyo/JC9pKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBhdm9pZCByZS1kZWNsYXJlIHJlZ2lzdGVyZWQgZnVuY3Rpb24sIGlmIG5vdCBkbyB0aGlzLCB0ZW1wbGF0ZSBcbiAgICAgICAgICAgICAgICAgICAgLy8gYHtAaWYgcmVnaXN0ZXJlZF9mdW5jKG5hbWUpfWAgY291bGQgYmUgdGhyb3cgdW5kZWZpbmVkLlxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihqdWljZXIub3B0aW9ucy5fbWV0aG9kW3N0YXRlbWVudF0pID09PSAnZnVuY3Rpb24nIHx8IGp1aWNlci5vcHRpb25zLl9tZXRob2QuaGFzT3duUHJvcGVydHkoc3RhdGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goc3RhdGVtZW50KTsgLy8gZnVjayBpZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAkO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdHBsLnJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmZvcnN0YXJ0LCB2YXJpYWJsZUFuYWx5emUpLlxuICAgICAgICAgICAgICAgIHJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmludGVycG9sYXRlLCB2YXJpYWJsZUFuYWx5emUpLlxuICAgICAgICAgICAgICAgIHJlcGxhY2UoanVpY2VyLnNldHRpbmdzLmlmc3RhcnQsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuZWxzZWlmc3RhcnQsIHZhcmlhYmxlQW5hbHl6ZSkuXG4gICAgICAgICAgICAgICAgcmVwbGFjZShqdWljZXIuc2V0dGluZ3MuaW5jbHVkZSwgdmFyaWFibGVBbmFseXplKS5cbiAgICAgICAgICAgICAgICByZXBsYWNlKC9bXFwrXFwtXFwqXFwvJSFcXD9cXHxcXF4mfjw+PSxcXChcXClcXFtcXF1dXFxzKihbQS1aYS16X10rKS9pZ20sIHZhcmlhYmxlQW5hbHl6ZSk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aSA8IGJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByZWZpeCArPSAndmFyICcgKyBidWZmZXJbaV0gKyAnPV8uJyArIGJ1ZmZlcltpXSArICc7JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpIDwgbWV0aG9kLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ICs9ICd2YXIgJyArIG1ldGhvZFtpXSArICc9X21ldGhvZC4nICsgbWV0aG9kW2ldICsgJzsnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJzwlICcgKyBwcmVmaXggKyAnICU+JztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fY29udmVydD1mdW5jdGlvbih0cGwsIHN0cmlwKSB7XG4gICAgICAgICAgICB2YXIgYnVmZmVyID0gW10uam9pbignJyk7XG5cbiAgICAgICAgICAgIGJ1ZmZlciArPSBcIid1c2Ugc3RyaWN0JztcIjsgLy8gdXNlIHN0cmljdCBtb2RlXG4gICAgICAgICAgICBidWZmZXIgKz0gXCJ2YXIgXz1ffHx7fTtcIjtcbiAgICAgICAgICAgIGJ1ZmZlciArPSBcInZhciBfb3V0PScnO19vdXQrPSdcIjtcblxuICAgICAgICAgICAgaWYoc3RyaXAgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyICs9IHRwbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFxyXFx0XFxuXS9nLCBcIiBcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycoPz1bXiVdKiU+KS9nLCBcIlxcdFwiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCInXCIpLmpvaW4oXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCJcXHRcIikuam9pbihcIidcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwlPSguKz8pJT4vZywgXCInO19vdXQrPSQxO19vdXQrPSdcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiPCVcIikuam9pbihcIic7XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIiU+XCIpLmpvaW4oXCJfb3V0Kz0nXCIpK1xuICAgICAgICAgICAgICAgICAgICBcIic7cmV0dXJuIF9vdXQ7XCI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWZmZXIgKz0gdHBsXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHJdL2csIFwiXFxcXHJcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHRdL2csIFwiXFxcXHRcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXG5dL2csIFwiXFxcXG5cIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycoPz1bXiVdKiU+KS9nLCBcIlxcdFwiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCInXCIpLmpvaW4oXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCJcXHRcIikuam9pbihcIidcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwlPSguKz8pJT4vZywgXCInO19vdXQrPSQxO19vdXQrPSdcIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiPCVcIikuam9pbihcIic7XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIiU+XCIpLmpvaW4oXCJfb3V0Kz0nXCIpK1xuICAgICAgICAgICAgICAgICAgICBcIic7cmV0dXJuIF9vdXQucmVwbGFjZSgvW1xcXFxyXFxcXG5dXFxcXHMrW1xcXFxyXFxcXG5dL2csICdcXFxcclxcXFxuJyk7XCI7XG5cbiAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXJzZSA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIF90aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgaWYoIW9wdGlvbnMgfHwgb3B0aW9ucy5sb29zZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0cGwgPSB0aGlzLl9fbGV4aWNhbEFuYWx5emUodHBsKSArIHRwbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHBsID0gdGhpcy5fX3JlbW92ZVNoZWxsKHRwbCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0cGwgPSB0aGlzLl9fdG9OYXRpdmUodHBsLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyID0gbmV3IEZ1bmN0aW9uKCdfLCBfbWV0aG9kJywgdHBsKTtcblxuICAgICAgICAgICAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbihfLCBfbWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgaWYoIV9tZXRob2QgfHwgX21ldGhvZCAhPT0gdGhhdC5vcHRpb25zLl9tZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgX21ldGhvZCA9IF9fY3JlYXRvcihfbWV0aG9kLCB0aGF0Lm9wdGlvbnMuX21ldGhvZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGF0Ll9yZW5kZXIuY2FsbCh0aGlzLCBfLCBfbWV0aG9kKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBqdWljZXIuY29tcGlsZSA9IGZ1bmN0aW9uKHRwbCwgb3B0aW9ucykge1xuICAgICAgICBpZighb3B0aW9ucyB8fCBvcHRpb25zICE9PSB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfX2NyZWF0b3Iob3B0aW9ucywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZW5naW5lID0gdGhpcy5fX2NhY2hlW3RwbF0gPyBcbiAgICAgICAgICAgICAgICB0aGlzLl9fY2FjaGVbdHBsXSA6IFxuICAgICAgICAgICAgICAgIG5ldyB0aGlzLnRlbXBsYXRlKHRoaXMub3B0aW9ucykucGFyc2UodHBsLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgaWYoIW9wdGlvbnMgfHwgb3B0aW9ucy5jYWNoZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fY2FjaGVbdHBsXSA9IGVuZ2luZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZTtcblxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIF9fdGhyb3coJ0p1aWNlciBDb21waWxlIEV4Y2VwdGlvbjogJyArIGUubWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHt9IC8vIG5vb3BcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAganVpY2VyLnRvX2h0bWwgPSBmdW5jdGlvbih0cGwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYoIW9wdGlvbnMgfHwgb3B0aW9ucyAhPT0gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gX19jcmVhdG9yKG9wdGlvbnMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb21waWxlKHRwbCwgb3B0aW9ucykucmVuZGVyKGRhdGEsIG9wdGlvbnMuX21ldGhvZCk7XG4gICAgfTtcbiAgICB3aW5kb3cuanVpY2VyID0ganVpY2VyO1xuICAgIHR5cGVvZihtb2R1bGUpICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyA/IG1vZHVsZS5leHBvcnRzID0ganVpY2VyIDogdGhpcy5qdWljZXIgPSBqdWljZXI7XG5cbn0pKCk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoqXG4gKiBAbGljZW5zZVxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSBsb2Rhc2guY29tL2xpY2Vuc2UgfCBVbmRlcnNjb3JlLmpzIDEuNS4yIHVuZGVyc2NvcmVqcy5vcmcvTElDRU5TRVxuICogQnVpbGQ6IGBsb2Rhc2ggLW8gLi9kaXN0L2xvZGFzaC5jb21wYXQuanNgXG4gKi9cbjsoZnVuY3Rpb24oKXtmdW5jdGlvbiBuKG4sdCxlKXtlPShlfHwwKS0xO2Zvcih2YXIgcj1uP24ubGVuZ3RoOjA7KytlPHI7KWlmKG5bZV09PT10KXJldHVybiBlO3JldHVybi0xfWZ1bmN0aW9uIHQodCxlKXt2YXIgcj10eXBlb2YgZTtpZih0PXQubCxcImJvb2xlYW5cIj09cnx8bnVsbD09ZSlyZXR1cm4gdFtlXT8wOi0xO1wibnVtYmVyXCIhPXImJlwic3RyaW5nXCIhPXImJihyPVwib2JqZWN0XCIpO3ZhciB1PVwibnVtYmVyXCI9PXI/ZTpiK2U7cmV0dXJuIHQ9KHQ9dFtyXSkmJnRbdV0sXCJvYmplY3RcIj09cj90JiYtMTxuKHQsZSk/MDotMTp0PzA6LTF9ZnVuY3Rpb24gZShuKXt2YXIgdD10aGlzLmwsZT10eXBlb2YgbjtpZihcImJvb2xlYW5cIj09ZXx8bnVsbD09bil0W25dPXRydWU7ZWxzZXtcIm51bWJlclwiIT1lJiZcInN0cmluZ1wiIT1lJiYoZT1cIm9iamVjdFwiKTt2YXIgcj1cIm51bWJlclwiPT1lP246YituLHQ9dFtlXXx8KHRbZV09e30pO1wib2JqZWN0XCI9PWU/KHRbcl18fCh0W3JdPVtdKSkucHVzaChuKTp0W3JdPXRydWVcbn19ZnVuY3Rpb24gcihuKXtyZXR1cm4gbi5jaGFyQ29kZUF0KDApfWZ1bmN0aW9uIHUobix0KXtmb3IodmFyIGU9bi5tLHI9dC5tLHU9LTEsbz1lLmxlbmd0aDsrK3U8bzspe3ZhciBhPWVbdV0saT1yW3VdO2lmKGEhPT1pKXtpZihhPml8fHR5cGVvZiBhPT1cInVuZGVmaW5lZFwiKXJldHVybiAxO2lmKGE8aXx8dHlwZW9mIGk9PVwidW5kZWZpbmVkXCIpcmV0dXJuLTF9fXJldHVybiBuLm4tdC5ufWZ1bmN0aW9uIG8obil7dmFyIHQ9LTEscj1uLmxlbmd0aCx1PW5bMF0sbz1uW3IvMnwwXSxhPW5bci0xXTtpZih1JiZ0eXBlb2YgdT09XCJvYmplY3RcIiYmbyYmdHlwZW9mIG89PVwib2JqZWN0XCImJmEmJnR5cGVvZiBhPT1cIm9iamVjdFwiKXJldHVybiBmYWxzZTtmb3IodT1sKCksdVtcImZhbHNlXCJdPXVbXCJudWxsXCJdPXVbXCJ0cnVlXCJdPXUudW5kZWZpbmVkPWZhbHNlLG89bCgpLG8uaz1uLG8ubD11LG8ucHVzaD1lOysrdDxyOylvLnB1c2goblt0XSk7cmV0dXJuIG99ZnVuY3Rpb24gYShuKXtyZXR1cm5cIlxcXFxcIitZW25dXG59ZnVuY3Rpb24gaSgpe3JldHVybiB2LnBvcCgpfHxbXX1mdW5jdGlvbiBsKCl7cmV0dXJuIHkucG9wKCl8fHtrOm51bGwsbDpudWxsLG06bnVsbCxcImZhbHNlXCI6ZmFsc2UsbjowLFwibnVsbFwiOmZhbHNlLG51bWJlcjpudWxsLG9iamVjdDpudWxsLHB1c2g6bnVsbCxzdHJpbmc6bnVsbCxcInRydWVcIjpmYWxzZSx1bmRlZmluZWQ6ZmFsc2UsbzpudWxsfX1mdW5jdGlvbiBmKG4pe3JldHVybiB0eXBlb2Ygbi50b1N0cmluZyE9XCJmdW5jdGlvblwiJiZ0eXBlb2YobitcIlwiKT09XCJzdHJpbmdcIn1mdW5jdGlvbiBjKG4pe24ubGVuZ3RoPTAsdi5sZW5ndGg8dyYmdi5wdXNoKG4pfWZ1bmN0aW9uIHAobil7dmFyIHQ9bi5sO3QmJnAodCksbi5rPW4ubD1uLm09bi5vYmplY3Q9bi5udW1iZXI9bi5zdHJpbmc9bi5vPW51bGwseS5sZW5ndGg8dyYmeS5wdXNoKG4pfWZ1bmN0aW9uIHMobix0LGUpe3R8fCh0PTApLHR5cGVvZiBlPT1cInVuZGVmaW5lZFwiJiYoZT1uP24ubGVuZ3RoOjApO3ZhciByPS0xO2U9ZS10fHwwO2Zvcih2YXIgdT1BcnJheSgwPmU/MDplKTsrK3I8ZTspdVtyXT1uW3Qrcl07XG5yZXR1cm4gdX1mdW5jdGlvbiBnKGUpe2Z1bmN0aW9uIHYobil7cmV0dXJuIG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiYhcWUobikmJndlLmNhbGwobixcIl9fd3JhcHBlZF9fXCIpP246bmV3IHkobil9ZnVuY3Rpb24geShuLHQpe3RoaXMuX19jaGFpbl9fPSEhdCx0aGlzLl9fd3JhcHBlZF9fPW59ZnVuY3Rpb24gdyhuKXtmdW5jdGlvbiB0KCl7aWYocil7dmFyIG49cyhyKTtqZS5hcHBseShuLGFyZ3VtZW50cyl9aWYodGhpcyBpbnN0YW5jZW9mIHQpe3ZhciBvPW50KGUucHJvdG90eXBlKSxuPWUuYXBwbHkobyxufHxhcmd1bWVudHMpO3JldHVybiB4dChuKT9uOm99cmV0dXJuIGUuYXBwbHkodSxufHxhcmd1bWVudHMpfXZhciBlPW5bMF0scj1uWzJdLHU9bls0XTtyZXR1cm4gemUodCxuKSx0fWZ1bmN0aW9uIFkobix0LGUscix1KXtpZihlKXt2YXIgbz1lKG4pO2lmKHR5cGVvZiBvIT1cInVuZGVmaW5lZFwiKXJldHVybiBvfWlmKCF4dChuKSlyZXR1cm4gbjt2YXIgYT1oZS5jYWxsKG4pO2lmKCFWW2FdfHwhTGUubm9kZUNsYXNzJiZmKG4pKXJldHVybiBuO1xudmFyIGw9VGVbYV07c3dpdGNoKGEpe2Nhc2UgTDpjYXNlIHo6cmV0dXJuIG5ldyBsKCtuKTtjYXNlIFc6Y2FzZSBNOnJldHVybiBuZXcgbChuKTtjYXNlIEo6cmV0dXJuIG89bChuLnNvdXJjZSxTLmV4ZWMobikpLG8ubGFzdEluZGV4PW4ubGFzdEluZGV4LG99aWYoYT1xZShuKSx0KXt2YXIgcD0hcjtyfHwocj1pKCkpLHV8fCh1PWkoKSk7Zm9yKHZhciBnPXIubGVuZ3RoO2ctLTspaWYocltnXT09bilyZXR1cm4gdVtnXTtvPWE/bChuLmxlbmd0aCk6e319ZWxzZSBvPWE/cyhuKTpZZSh7fSxuKTtyZXR1cm4gYSYmKHdlLmNhbGwobixcImluZGV4XCIpJiYoby5pbmRleD1uLmluZGV4KSx3ZS5jYWxsKG4sXCJpbnB1dFwiKSYmKG8uaW5wdXQ9bi5pbnB1dCkpLHQ/KHIucHVzaChuKSx1LnB1c2gobyksKGE/WGU6dHIpKG4sZnVuY3Rpb24obixhKXtvW2FdPVkobix0LGUscix1KX0pLHAmJihjKHIpLGModSkpLG8pOm99ZnVuY3Rpb24gbnQobil7cmV0dXJuIHh0KG4pP1NlKG4pOnt9fWZ1bmN0aW9uIHR0KG4sdCxlKXtpZih0eXBlb2YgbiE9XCJmdW5jdGlvblwiKXJldHVybiBIdDtcbmlmKHR5cGVvZiB0PT1cInVuZGVmaW5lZFwifHwhKFwicHJvdG90eXBlXCJpbiBuKSlyZXR1cm4gbjt2YXIgcj1uLl9fYmluZERhdGFfXztpZih0eXBlb2Ygcj09XCJ1bmRlZmluZWRcIiYmKExlLmZ1bmNOYW1lcyYmKHI9IW4ubmFtZSkscj1yfHwhTGUuZnVuY0RlY29tcCwhcikpe3ZhciB1PWJlLmNhbGwobik7TGUuZnVuY05hbWVzfHwocj0hQS50ZXN0KHUpKSxyfHwocj1CLnRlc3QodSksemUobixyKSl9aWYoZmFsc2U9PT1yfHx0cnVlIT09ciYmMSZyWzFdKXJldHVybiBuO3N3aXRjaChlKXtjYXNlIDE6cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBuLmNhbGwodCxlKX07Y2FzZSAyOnJldHVybiBmdW5jdGlvbihlLHIpe3JldHVybiBuLmNhbGwodCxlLHIpfTtjYXNlIDM6cmV0dXJuIGZ1bmN0aW9uKGUscix1KXtyZXR1cm4gbi5jYWxsKHQsZSxyLHUpfTtjYXNlIDQ6cmV0dXJuIGZ1bmN0aW9uKGUscix1LG8pe3JldHVybiBuLmNhbGwodCxlLHIsdSxvKX19cmV0dXJuIE10KG4sdCl9ZnVuY3Rpb24gZXQobil7ZnVuY3Rpb24gdCgpe3ZhciBuPWw/YTp0aGlzO1xuaWYodSl7dmFyIGg9cyh1KTtqZS5hcHBseShoLGFyZ3VtZW50cyl9cmV0dXJuKG98fGMpJiYoaHx8KGg9cyhhcmd1bWVudHMpKSxvJiZqZS5hcHBseShoLG8pLGMmJmgubGVuZ3RoPGkpPyhyfD0xNixldChbZSxwP3I6LTQmcixoLG51bGwsYSxpXSkpOihofHwoaD1hcmd1bWVudHMpLGYmJihlPW5bZ10pLHRoaXMgaW5zdGFuY2VvZiB0PyhuPW50KGUucHJvdG90eXBlKSxoPWUuYXBwbHkobixoKSx4dChoKT9oOm4pOmUuYXBwbHkobixoKSl9dmFyIGU9blswXSxyPW5bMV0sdT1uWzJdLG89blszXSxhPW5bNF0saT1uWzVdLGw9MSZyLGY9MiZyLGM9NCZyLHA9OCZyLGc9ZTtyZXR1cm4gemUodCxuKSx0fWZ1bmN0aW9uIHJ0KGUscil7dmFyIHU9LTEsYT1odCgpLGk9ZT9lLmxlbmd0aDowLGw9aT49XyYmYT09PW4sZj1bXTtpZihsKXt2YXIgYz1vKHIpO2M/KGE9dCxyPWMpOmw9ZmFsc2V9Zm9yKDsrK3U8aTspYz1lW3VdLDA+YShyLGMpJiZmLnB1c2goYyk7cmV0dXJuIGwmJnAociksZn1mdW5jdGlvbiBvdChuLHQsZSxyKXtyPShyfHwwKS0xO1xuZm9yKHZhciB1PW4/bi5sZW5ndGg6MCxvPVtdOysrcjx1Oyl7dmFyIGE9bltyXTtpZihhJiZ0eXBlb2YgYT09XCJvYmplY3RcIiYmdHlwZW9mIGEubGVuZ3RoPT1cIm51bWJlclwiJiYocWUoYSl8fGR0KGEpKSl7dHx8KGE9b3QoYSx0LGUpKTt2YXIgaT0tMSxsPWEubGVuZ3RoLGY9by5sZW5ndGg7Zm9yKG8ubGVuZ3RoKz1sOysraTxsOylvW2YrK109YVtpXX1lbHNlIGV8fG8ucHVzaChhKX1yZXR1cm4gb31mdW5jdGlvbiBhdChuLHQsZSxyLHUsbyl7aWYoZSl7dmFyIGE9ZShuLHQpO2lmKHR5cGVvZiBhIT1cInVuZGVmaW5lZFwiKXJldHVybiEhYX1pZihuPT09dClyZXR1cm4gMCE9PW58fDEvbj09MS90O2lmKG49PT1uJiYhKG4mJlhbdHlwZW9mIG5dfHx0JiZYW3R5cGVvZiB0XSkpcmV0dXJuIGZhbHNlO2lmKG51bGw9PW58fG51bGw9PXQpcmV0dXJuIG49PT10O3ZhciBsPWhlLmNhbGwobikscD1oZS5jYWxsKHQpO2lmKGw9PVQmJihsPUcpLHA9PVQmJihwPUcpLGwhPXApcmV0dXJuIGZhbHNlO3N3aXRjaChsKXtjYXNlIEw6Y2FzZSB6OnJldHVybituPT0rdDtcbmNhc2UgVzpyZXR1cm4gbiE9K24/dCE9K3Q6MD09bj8xL249PTEvdDpuPT0rdDtjYXNlIEo6Y2FzZSBNOnJldHVybiBuPT1pZSh0KX1pZihwPWw9PSQsIXApe3ZhciBzPXdlLmNhbGwobixcIl9fd3JhcHBlZF9fXCIpLGc9d2UuY2FsbCh0LFwiX193cmFwcGVkX19cIik7aWYoc3x8ZylyZXR1cm4gYXQocz9uLl9fd3JhcHBlZF9fOm4sZz90Ll9fd3JhcHBlZF9fOnQsZSxyLHUsbyk7aWYobCE9R3x8IUxlLm5vZGVDbGFzcyYmKGYobil8fGYodCkpKXJldHVybiBmYWxzZTtpZihsPSFMZS5hcmdzT2JqZWN0JiZkdChuKT9vZTpuLmNvbnN0cnVjdG9yLHM9IUxlLmFyZ3NPYmplY3QmJmR0KHQpP29lOnQuY29uc3RydWN0b3IsbCE9cyYmIShqdChsKSYmbCBpbnN0YW5jZW9mIGwmJmp0KHMpJiZzIGluc3RhbmNlb2YgcykmJlwiY29uc3RydWN0b3JcImluIG4mJlwiY29uc3RydWN0b3JcImluIHQpcmV0dXJuIGZhbHNlfWZvcihsPSF1LHV8fCh1PWkoKSksb3x8KG89aSgpKSxzPXUubGVuZ3RoO3MtLTspaWYodVtzXT09bilyZXR1cm4gb1tzXT09dDtcbnZhciBoPTAsYT10cnVlO2lmKHUucHVzaChuKSxvLnB1c2godCkscCl7aWYocz1uLmxlbmd0aCxoPXQubGVuZ3RoLChhPWg9PXMpfHxyKWZvcig7aC0tOylpZihwPXMsZz10W2hdLHIpZm9yKDtwLS0mJiEoYT1hdChuW3BdLGcsZSxyLHUsbykpOyk7ZWxzZSBpZighKGE9YXQobltoXSxnLGUscix1LG8pKSlicmVha31lbHNlIG5yKHQsZnVuY3Rpb24odCxpLGwpe3JldHVybiB3ZS5jYWxsKGwsaSk/KGgrKyxhPXdlLmNhbGwobixpKSYmYXQobltpXSx0LGUscix1LG8pKTp2b2lkIDB9KSxhJiYhciYmbnIobixmdW5jdGlvbihuLHQsZSl7cmV0dXJuIHdlLmNhbGwoZSx0KT9hPS0xPC0taDp2b2lkIDB9KTtyZXR1cm4gdS5wb3AoKSxvLnBvcCgpLGwmJihjKHUpLGMobykpLGF9ZnVuY3Rpb24gaXQobix0LGUscix1KXsocWUodCk/RHQ6dHIpKHQsZnVuY3Rpb24odCxvKXt2YXIgYSxpLGw9dCxmPW5bb107aWYodCYmKChpPXFlKHQpKXx8ZXIodCkpKXtmb3IobD1yLmxlbmd0aDtsLS07KWlmKGE9cltsXT09dCl7Zj11W2xdO1xuYnJlYWt9aWYoIWEpe3ZhciBjO2UmJihsPWUoZix0KSxjPXR5cGVvZiBsIT1cInVuZGVmaW5lZFwiKSYmKGY9bCksY3x8KGY9aT9xZShmKT9mOltdOmVyKGYpP2Y6e30pLHIucHVzaCh0KSx1LnB1c2goZiksY3x8aXQoZix0LGUscix1KX19ZWxzZSBlJiYobD1lKGYsdCksdHlwZW9mIGw9PVwidW5kZWZpbmVkXCImJihsPXQpKSx0eXBlb2YgbCE9XCJ1bmRlZmluZWRcIiYmKGY9bCk7bltvXT1mfSl9ZnVuY3Rpb24gbHQobix0KXtyZXR1cm4gbitkZShGZSgpKih0LW4rMSkpfWZ1bmN0aW9uIGZ0KGUscix1KXt2YXIgYT0tMSxsPWh0KCksZj1lP2UubGVuZ3RoOjAscz1bXSxnPSFyJiZmPj1fJiZsPT09bixoPXV8fGc/aSgpOnM7Zm9yKGcmJihoPW8oaCksbD10KTsrK2E8Zjspe3ZhciB2PWVbYV0seT11P3UodixhLGUpOnY7KHI/IWF8fGhbaC5sZW5ndGgtMV0hPT15OjA+bChoLHkpKSYmKCh1fHxnKSYmaC5wdXNoKHkpLHMucHVzaCh2KSl9cmV0dXJuIGc/KGMoaC5rKSxwKGgpKTp1JiZjKGgpLHN9ZnVuY3Rpb24gY3Qobil7cmV0dXJuIGZ1bmN0aW9uKHQsZSxyKXt2YXIgdT17fTtcbmlmKGU9di5jcmVhdGVDYWxsYmFjayhlLHIsMykscWUodCkpe3I9LTE7Zm9yKHZhciBvPXQubGVuZ3RoOysrcjxvOyl7dmFyIGE9dFtyXTtuKHUsYSxlKGEscix0KSx0KX19ZWxzZSBYZSh0LGZ1bmN0aW9uKHQscixvKXtuKHUsdCxlKHQscixvKSxvKX0pO3JldHVybiB1fX1mdW5jdGlvbiBwdChuLHQsZSxyLHUsbyl7dmFyIGE9MSZ0LGk9NCZ0LGw9MTYmdCxmPTMyJnQ7aWYoISgyJnR8fGp0KG4pKSl0aHJvdyBuZXcgbGU7bCYmIWUubGVuZ3RoJiYodCY9LTE3LGw9ZT1mYWxzZSksZiYmIXIubGVuZ3RoJiYodCY9LTMzLGY9cj1mYWxzZSk7dmFyIGM9biYmbi5fX2JpbmREYXRhX187cmV0dXJuIGMmJnRydWUhPT1jPyhjPXMoYyksY1syXSYmKGNbMl09cyhjWzJdKSksY1szXSYmKGNbM109cyhjWzNdKSksIWF8fDEmY1sxXXx8KGNbNF09dSksIWEmJjEmY1sxXSYmKHR8PTgpLCFpfHw0JmNbMV18fChjWzVdPW8pLGwmJmplLmFwcGx5KGNbMl18fChjWzJdPVtdKSxlKSxmJiZFZS5hcHBseShjWzNdfHwoY1szXT1bXSksciksY1sxXXw9dCxwdC5hcHBseShudWxsLGMpKTooMT09dHx8MTc9PT10P3c6ZXQpKFtuLHQsZSxyLHUsb10pXG59ZnVuY3Rpb24gc3QoKXtRLmg9RixRLmI9US5jPVEuZz1RLmk9XCJcIixRLmU9XCJ0XCIsUS5qPXRydWU7Zm9yKHZhciBuLHQ9MDtuPWFyZ3VtZW50c1t0XTt0KyspZm9yKHZhciBlIGluIG4pUVtlXT1uW2VdO3Q9US5hLFEuZD0vXlteLF0rLy5leGVjKHQpWzBdLG49ZWUsdD1cInJldHVybiBmdW5jdGlvbihcIit0K1wiKXtcIixlPVE7dmFyIHI9XCJ2YXIgbix0PVwiK2UuZCtcIixFPVwiK2UuZStcIjtpZighdClyZXR1cm4gRTtcIitlLmkrXCI7XCI7ZS5iPyhyKz1cInZhciB1PXQubGVuZ3RoO249LTE7aWYoXCIrZS5iK1wiKXtcIixMZS51bmluZGV4ZWRDaGFycyYmKHIrPVwiaWYocyh0KSl7dD10LnNwbGl0KCcnKX1cIikscis9XCJ3aGlsZSgrK248dSl7XCIrZS5nK1wiO319ZWxzZXtcIik6TGUubm9uRW51bUFyZ3MmJihyKz1cInZhciB1PXQubGVuZ3RoO249LTE7aWYodSYmcCh0KSl7d2hpbGUoKytuPHUpe24rPScnO1wiK2UuZytcIjt9fWVsc2V7XCIpLExlLmVudW1Qcm90b3R5cGVzJiYocis9XCJ2YXIgRz10eXBlb2YgdD09J2Z1bmN0aW9uJztcIiksTGUuZW51bUVycm9yUHJvcHMmJihyKz1cInZhciBGPXQ9PT1rfHx0IGluc3RhbmNlb2YgRXJyb3I7XCIpO1xudmFyIHU9W107aWYoTGUuZW51bVByb3RvdHlwZXMmJnUucHVzaCgnIShHJiZuPT1cInByb3RvdHlwZVwiKScpLExlLmVudW1FcnJvclByb3BzJiZ1LnB1c2goJyEoRiYmKG49PVwibWVzc2FnZVwifHxuPT1cIm5hbWVcIikpJyksZS5qJiZlLmYpcis9XCJ2YXIgQz0tMSxEPUJbdHlwZW9mIHRdJiZ2KHQpLHU9RD9ELmxlbmd0aDowO3doaWxlKCsrQzx1KXtuPURbQ107XCIsdS5sZW5ndGgmJihyKz1cImlmKFwiK3Uuam9pbihcIiYmXCIpK1wiKXtcIikscis9ZS5nK1wiO1wiLHUubGVuZ3RoJiYocis9XCJ9XCIpLHIrPVwifVwiO2Vsc2UgaWYocis9XCJmb3IobiBpbiB0KXtcIixlLmomJnUucHVzaChcIm0uY2FsbCh0LCBuKVwiKSx1Lmxlbmd0aCYmKHIrPVwiaWYoXCIrdS5qb2luKFwiJiZcIikrXCIpe1wiKSxyKz1lLmcrXCI7XCIsdS5sZW5ndGgmJihyKz1cIn1cIikscis9XCJ9XCIsTGUubm9uRW51bVNoYWRvd3Mpe2ZvcihyKz1cImlmKHQhPT1BKXt2YXIgaT10LmNvbnN0cnVjdG9yLHI9dD09PShpJiZpLnByb3RvdHlwZSksZj10PT09Sj9JOnQ9PT1rP2o6TC5jYWxsKHQpLHg9eVtmXTtcIixrPTA7Nz5rO2srKylyKz1cIm49J1wiK2UuaFtrXStcIic7aWYoKCEociYmeFtuXSkmJm0uY2FsbCh0LG4pKVwiLGUuanx8KHIrPVwifHwoIXhbbl0mJnRbbl0hPT1BW25dKVwiKSxyKz1cIil7XCIrZS5nK1wifVwiO1xucis9XCJ9XCJ9cmV0dXJuKGUuYnx8TGUubm9uRW51bUFyZ3MpJiYocis9XCJ9XCIpLHIrPWUuYytcIjtyZXR1cm4gRVwiLG4oXCJkLGosayxtLG8scCxxLHMsdixBLEIseSxJLEosTFwiLHQrcitcIn1cIikodHQscSxjZSx3ZSxkLGR0LHFlLGt0LFEuZixwZSxYLCRlLE0sc2UsaGUpfWZ1bmN0aW9uIGd0KG4pe3JldHVybiBWZVtuXX1mdW5jdGlvbiBodCgpe3ZhciB0PSh0PXYuaW5kZXhPZik9PT16dD9uOnQ7cmV0dXJuIHR9ZnVuY3Rpb24gdnQobil7cmV0dXJuIHR5cGVvZiBuPT1cImZ1bmN0aW9uXCImJnZlLnRlc3Qobil9ZnVuY3Rpb24geXQobil7dmFyIHQsZTtyZXR1cm4hbnx8aGUuY2FsbChuKSE9R3x8KHQ9bi5jb25zdHJ1Y3RvcixqdCh0KSYmISh0IGluc3RhbmNlb2YgdCkpfHwhTGUuYXJnc0NsYXNzJiZkdChuKXx8IUxlLm5vZGVDbGFzcyYmZihuKT9mYWxzZTpMZS5vd25MYXN0PyhucihuLGZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gZT13ZS5jYWxsKHIsdCksZmFsc2V9KSxmYWxzZSE9PWUpOihucihuLGZ1bmN0aW9uKG4sdCl7ZT10XG59KSx0eXBlb2YgZT09XCJ1bmRlZmluZWRcInx8d2UuY2FsbChuLGUpKX1mdW5jdGlvbiBtdChuKXtyZXR1cm4gSGVbbl19ZnVuY3Rpb24gZHQobil7cmV0dXJuIG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZ0eXBlb2Ygbi5sZW5ndGg9PVwibnVtYmVyXCImJmhlLmNhbGwobik9PVR8fGZhbHNlfWZ1bmN0aW9uIGJ0KG4sdCxlKXt2YXIgcj1XZShuKSx1PXIubGVuZ3RoO2Zvcih0PXR0KHQsZSwzKTt1LS0mJihlPXJbdV0sZmFsc2UhPT10KG5bZV0sZSxuKSk7KTtyZXR1cm4gbn1mdW5jdGlvbiBfdChuKXt2YXIgdD1bXTtyZXR1cm4gbnIobixmdW5jdGlvbihuLGUpe2p0KG4pJiZ0LnB1c2goZSl9KSx0LnNvcnQoKX1mdW5jdGlvbiB3dChuKXtmb3IodmFyIHQ9LTEsZT1XZShuKSxyPWUubGVuZ3RoLHU9e307Kyt0PHI7KXt2YXIgbz1lW3RdO3VbbltvXV09b31yZXR1cm4gdX1mdW5jdGlvbiBqdChuKXtyZXR1cm4gdHlwZW9mIG49PVwiZnVuY3Rpb25cIn1mdW5jdGlvbiB4dChuKXtyZXR1cm4hKCFufHwhWFt0eXBlb2Ygbl0pXG59ZnVuY3Rpb24gQ3Qobil7cmV0dXJuIHR5cGVvZiBuPT1cIm51bWJlclwifHxuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmaGUuY2FsbChuKT09V3x8ZmFsc2V9ZnVuY3Rpb24ga3Qobil7cmV0dXJuIHR5cGVvZiBuPT1cInN0cmluZ1wifHxuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmaGUuY2FsbChuKT09TXx8ZmFsc2V9ZnVuY3Rpb24gRXQobil7Zm9yKHZhciB0PS0xLGU9V2Uobikscj1lLmxlbmd0aCx1PVp0KHIpOysrdDxyOyl1W3RdPW5bZVt0XV07cmV0dXJuIHV9ZnVuY3Rpb24gT3Qobix0LGUpe3ZhciByPS0xLHU9aHQoKSxvPW4/bi5sZW5ndGg6MCxhPWZhbHNlO3JldHVybiBlPSgwPmU/QmUoMCxvK2UpOmUpfHwwLHFlKG4pP2E9LTE8dShuLHQsZSk6dHlwZW9mIG89PVwibnVtYmVyXCI/YT0tMTwoa3Qobik/bi5pbmRleE9mKHQsZSk6dShuLHQsZSkpOlhlKG4sZnVuY3Rpb24obil7cmV0dXJuKytyPGU/dm9pZCAwOiEoYT1uPT09dCl9KSxhfWZ1bmN0aW9uIFN0KG4sdCxlKXt2YXIgcj10cnVlO2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMykscWUobikpe2U9LTE7XG5mb3IodmFyIHU9bi5sZW5ndGg7KytlPHUmJihyPSEhdChuW2VdLGUsbikpOyk7fWVsc2UgWGUobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHI9ISF0KG4sZSx1KX0pO3JldHVybiByfWZ1bmN0aW9uIEF0KG4sdCxlKXt2YXIgcj1bXTtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHFlKG4pKXtlPS0xO2Zvcih2YXIgdT1uLmxlbmd0aDsrK2U8dTspe3ZhciBvPW5bZV07dChvLGUsbikmJnIucHVzaChvKX19ZWxzZSBYZShuLGZ1bmN0aW9uKG4sZSx1KXt0KG4sZSx1KSYmci5wdXNoKG4pfSk7cmV0dXJuIHJ9ZnVuY3Rpb24gSXQobix0LGUpe2lmKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksIXFlKG4pKXt2YXIgcjtyZXR1cm4gWGUobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQobixlLHUpPyhyPW4sZmFsc2UpOnZvaWQgMH0pLHJ9ZT0tMTtmb3IodmFyIHU9bi5sZW5ndGg7KytlPHU7KXt2YXIgbz1uW2VdO2lmKHQobyxlLG4pKXJldHVybiBvfX1mdW5jdGlvbiBEdChuLHQsZSl7aWYodCYmdHlwZW9mIGU9PVwidW5kZWZpbmVkXCImJnFlKG4pKXtlPS0xO1xuZm9yKHZhciByPW4ubGVuZ3RoOysrZTxyJiZmYWxzZSE9PXQobltlXSxlLG4pOyk7fWVsc2UgWGUobix0LGUpO3JldHVybiBufWZ1bmN0aW9uIE50KG4sdCxlKXt2YXIgcj1uLHU9bj9uLmxlbmd0aDowO2lmKHQ9dCYmdHlwZW9mIGU9PVwidW5kZWZpbmVkXCI/dDp0dCh0LGUsMykscWUobikpZm9yKDt1LS0mJmZhbHNlIT09dChuW3VdLHUsbik7KTtlbHNle2lmKHR5cGVvZiB1IT1cIm51bWJlclwiKXZhciBvPVdlKG4pLHU9by5sZW5ndGg7ZWxzZSBMZS51bmluZGV4ZWRDaGFycyYma3QobikmJihyPW4uc3BsaXQoXCJcIikpO1hlKG4sZnVuY3Rpb24obixlLGEpe3JldHVybiBlPW8/b1stLXVdOi0tdSx0KHJbZV0sZSxhKX0pfXJldHVybiBufWZ1bmN0aW9uIEJ0KG4sdCxlKXt2YXIgcj0tMSx1PW4/bi5sZW5ndGg6MCxvPVp0KHR5cGVvZiB1PT1cIm51bWJlclwiP3U6MCk7aWYodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxxZShuKSlmb3IoOysrcjx1OylvW3JdPXQobltyXSxyLG4pO2Vsc2UgWGUobixmdW5jdGlvbihuLGUsdSl7b1srK3JdPXQobixlLHUpXG59KTtyZXR1cm4gb31mdW5jdGlvbiBQdChuLHQsZSl7dmFyIHU9LTEvMCxvPXU7aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIiYmZSYmZVt0XT09PW4mJih0PW51bGwpLG51bGw9PXQmJnFlKG4pKXtlPS0xO2Zvcih2YXIgYT1uLmxlbmd0aDsrK2U8YTspe3ZhciBpPW5bZV07aT5vJiYobz1pKX19ZWxzZSB0PW51bGw9PXQmJmt0KG4pP3I6di5jcmVhdGVDYWxsYmFjayh0LGUsMyksWGUobixmdW5jdGlvbihuLGUscil7ZT10KG4sZSxyKSxlPnUmJih1PWUsbz1uKX0pO3JldHVybiBvfWZ1bmN0aW9uIFJ0KG4sdCxlLHIpe3ZhciB1PTM+YXJndW1lbnRzLmxlbmd0aDtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxyLDQpLHFlKG4pKXt2YXIgbz0tMSxhPW4ubGVuZ3RoO2Zvcih1JiYoZT1uWysrb10pOysrbzxhOyllPXQoZSxuW29dLG8sbil9ZWxzZSBYZShuLGZ1bmN0aW9uKG4scixvKXtlPXU/KHU9ZmFsc2Usbik6dChlLG4scixvKX0pO3JldHVybiBlfWZ1bmN0aW9uIEZ0KG4sdCxlLHIpe3ZhciB1PTM+YXJndW1lbnRzLmxlbmd0aDtcbnJldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxyLDQpLE50KG4sZnVuY3Rpb24obixyLG8pe2U9dT8odT1mYWxzZSxuKTp0KGUsbixyLG8pfSksZX1mdW5jdGlvbiBUdChuKXt2YXIgdD0tMSxlPW4/bi5sZW5ndGg6MCxyPVp0KHR5cGVvZiBlPT1cIm51bWJlclwiP2U6MCk7cmV0dXJuIER0KG4sZnVuY3Rpb24obil7dmFyIGU9bHQoMCwrK3QpO3JbdF09cltlXSxyW2VdPW59KSxyfWZ1bmN0aW9uICR0KG4sdCxlKXt2YXIgcjtpZih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHFlKG4pKXtlPS0xO2Zvcih2YXIgdT1uLmxlbmd0aDsrK2U8dSYmIShyPXQobltlXSxlLG4pKTspO31lbHNlIFhlKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiEocj10KG4sZSx1KSl9KTtyZXR1cm4hIXJ9ZnVuY3Rpb24gTHQobix0LGUpe3ZhciByPTAsdT1uP24ubGVuZ3RoOjA7aWYodHlwZW9mIHQhPVwibnVtYmVyXCImJm51bGwhPXQpe3ZhciBvPS0xO2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpOysrbzx1JiZ0KG5bb10sbyxuKTspcisrXG59ZWxzZSBpZihyPXQsbnVsbD09cnx8ZSlyZXR1cm4gbj9uWzBdOmg7cmV0dXJuIHMobiwwLFBlKEJlKDAsciksdSkpfWZ1bmN0aW9uIHp0KHQsZSxyKXtpZih0eXBlb2Ygcj09XCJudW1iZXJcIil7dmFyIHU9dD90Lmxlbmd0aDowO3I9MD5yP0JlKDAsdStyKTpyfHwwfWVsc2UgaWYocilyZXR1cm4gcj1LdCh0LGUpLHRbcl09PT1lP3I6LTE7cmV0dXJuIG4odCxlLHIpfWZ1bmN0aW9uIHF0KG4sdCxlKXtpZih0eXBlb2YgdCE9XCJudW1iZXJcIiYmbnVsbCE9dCl7dmFyIHI9MCx1PS0xLG89bj9uLmxlbmd0aDowO2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpOysrdTxvJiZ0KG5bdV0sdSxuKTspcisrfWVsc2Ugcj1udWxsPT10fHxlPzE6QmUoMCx0KTtyZXR1cm4gcyhuLHIpfWZ1bmN0aW9uIEt0KG4sdCxlLHIpe3ZhciB1PTAsbz1uP24ubGVuZ3RoOnU7Zm9yKGU9ZT92LmNyZWF0ZUNhbGxiYWNrKGUsciwxKTpIdCx0PWUodCk7dTxvOylyPXUrbz4+PjEsZShuW3JdKTx0P3U9cisxOm89cjtcbnJldHVybiB1fWZ1bmN0aW9uIFd0KG4sdCxlLHIpe3JldHVybiB0eXBlb2YgdCE9XCJib29sZWFuXCImJm51bGwhPXQmJihyPWUsZT10eXBlb2YgdCE9XCJmdW5jdGlvblwiJiZyJiZyW3RdPT09bj9udWxsOnQsdD1mYWxzZSksbnVsbCE9ZSYmKGU9di5jcmVhdGVDYWxsYmFjayhlLHIsMykpLGZ0KG4sdCxlKX1mdW5jdGlvbiBHdCgpe2Zvcih2YXIgbj0xPGFyZ3VtZW50cy5sZW5ndGg/YXJndW1lbnRzOmFyZ3VtZW50c1swXSx0PS0xLGU9bj9QdChhcihuLFwibGVuZ3RoXCIpKTowLHI9WnQoMD5lPzA6ZSk7Kyt0PGU7KXJbdF09YXIobix0KTtyZXR1cm4gcn1mdW5jdGlvbiBKdChuLHQpe3ZhciBlPS0xLHI9bj9uLmxlbmd0aDowLHU9e307Zm9yKHR8fCFyfHxxZShuWzBdKXx8KHQ9W10pOysrZTxyOyl7dmFyIG89bltlXTt0P3Vbb109dFtlXTpvJiYodVtvWzBdXT1vWzFdKX1yZXR1cm4gdX1mdW5jdGlvbiBNdChuLHQpe3JldHVybiAyPGFyZ3VtZW50cy5sZW5ndGg/cHQobiwxNyxzKGFyZ3VtZW50cywyKSxudWxsLHQpOnB0KG4sMSxudWxsLG51bGwsdClcbn1mdW5jdGlvbiBWdChuLHQsZSl7dmFyIHIsdSxvLGEsaSxsLGYsYz0wLHA9ZmFsc2Uscz10cnVlO2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7aWYodD1CZSgwLHQpfHwwLHRydWU9PT1lKXZhciBnPXRydWUscz1mYWxzZTtlbHNlIHh0KGUpJiYoZz1lLmxlYWRpbmcscD1cIm1heFdhaXRcImluIGUmJihCZSh0LGUubWF4V2FpdCl8fDApLHM9XCJ0cmFpbGluZ1wiaW4gZT9lLnRyYWlsaW5nOnMpO3ZhciB2PWZ1bmN0aW9uKCl7dmFyIGU9dC0oaXIoKS1hKTswPGU/bD1DZSh2LGUpOih1JiZtZSh1KSxlPWYsdT1sPWY9aCxlJiYoYz1pcigpLG89bi5hcHBseShpLHIpLGx8fHV8fChyPWk9bnVsbCkpKX0seT1mdW5jdGlvbigpe2wmJm1lKGwpLHU9bD1mPWgsKHN8fHAhPT10KSYmKGM9aXIoKSxvPW4uYXBwbHkoaSxyKSxsfHx1fHwocj1pPW51bGwpKX07cmV0dXJuIGZ1bmN0aW9uKCl7aWYocj1hcmd1bWVudHMsYT1pcigpLGk9dGhpcyxmPXMmJihsfHwhZyksZmFsc2U9PT1wKXZhciBlPWcmJiFsO2Vsc2V7dXx8Z3x8KGM9YSk7XG52YXIgaD1wLShhLWMpLG09MD49aDttPyh1JiYodT1tZSh1KSksYz1hLG89bi5hcHBseShpLHIpKTp1fHwodT1DZSh5LGgpKX1yZXR1cm4gbSYmbD9sPW1lKGwpOmx8fHQ9PT1wfHwobD1DZSh2LHQpKSxlJiYobT10cnVlLG89bi5hcHBseShpLHIpKSwhbXx8bHx8dXx8KHI9aT1udWxsKSxvfX1mdW5jdGlvbiBIdChuKXtyZXR1cm4gbn1mdW5jdGlvbiBVdChuLHQsZSl7dmFyIHI9dHJ1ZSx1PXQmJl90KHQpO3QmJihlfHx1Lmxlbmd0aCl8fChudWxsPT1lJiYoZT10KSxvPXksdD1uLG49dix1PV90KHQpKSxmYWxzZT09PWU/cj1mYWxzZTp4dChlKSYmXCJjaGFpblwiaW4gZSYmKHI9ZS5jaGFpbik7dmFyIG89bixhPWp0KG8pO0R0KHUsZnVuY3Rpb24oZSl7dmFyIHU9bltlXT10W2VdO2EmJihvLnByb3RvdHlwZVtlXT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX19jaGFpbl9fLGU9dGhpcy5fX3dyYXBwZWRfXyxhPVtlXTtpZihqZS5hcHBseShhLGFyZ3VtZW50cyksYT11LmFwcGx5KG4sYSkscnx8dCl7aWYoZT09PWEmJnh0KGEpKXJldHVybiB0aGlzO1xuYT1uZXcgbyhhKSxhLl9fY2hhaW5fXz10fXJldHVybiBhfSl9KX1mdW5jdGlvbiBRdCgpe31mdW5jdGlvbiBYdChuKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHRbbl19fWZ1bmN0aW9uIFl0KCl7cmV0dXJuIHRoaXMuX193cmFwcGVkX199ZT1lP3V0LmRlZmF1bHRzKFouT2JqZWN0KCksZSx1dC5waWNrKFosUikpOlo7dmFyIFp0PWUuQXJyYXksbmU9ZS5Cb29sZWFuLHRlPWUuRGF0ZSxlZT1lLkZ1bmN0aW9uLHJlPWUuTWF0aCx1ZT1lLk51bWJlcixvZT1lLk9iamVjdCxhZT1lLlJlZ0V4cCxpZT1lLlN0cmluZyxsZT1lLlR5cGVFcnJvcixmZT1bXSxjZT1lLkVycm9yLnByb3RvdHlwZSxwZT1vZS5wcm90b3R5cGUsc2U9aWUucHJvdG90eXBlLGdlPWUuXyxoZT1wZS50b1N0cmluZyx2ZT1hZShcIl5cIitpZShoZSkucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csXCJcXFxcJCZcIikucmVwbGFjZSgvdG9TdHJpbmd8IGZvciBbXlxcXV0rL2csXCIuKj9cIikrXCIkXCIpLHllPXJlLmNlaWwsbWU9ZS5jbGVhclRpbWVvdXQsZGU9cmUuZmxvb3IsYmU9ZWUucHJvdG90eXBlLnRvU3RyaW5nLF9lPXZ0KF9lPW9lLmdldFByb3RvdHlwZU9mKSYmX2Usd2U9cGUuaGFzT3duUHJvcGVydHksamU9ZmUucHVzaCx4ZT1wZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxDZT1lLnNldFRpbWVvdXQsa2U9ZmUuc3BsaWNlLEVlPWZlLnVuc2hpZnQsT2U9ZnVuY3Rpb24oKXt0cnl7dmFyIG49e30sdD12dCh0PW9lLmRlZmluZVByb3BlcnR5KSYmdCxlPXQobixuLG4pJiZ0XG59Y2F0Y2gocil7fXJldHVybiBlfSgpLFNlPXZ0KFNlPW9lLmNyZWF0ZSkmJlNlLEFlPXZ0KEFlPVp0LmlzQXJyYXkpJiZBZSxJZT1lLmlzRmluaXRlLERlPWUuaXNOYU4sTmU9dnQoTmU9b2Uua2V5cykmJk5lLEJlPXJlLm1heCxQZT1yZS5taW4sUmU9ZS5wYXJzZUludCxGZT1yZS5yYW5kb20sVGU9e307VGVbJF09WnQsVGVbTF09bmUsVGVbel09dGUsVGVbS109ZWUsVGVbR109b2UsVGVbV109dWUsVGVbSl09YWUsVGVbTV09aWU7dmFyICRlPXt9OyRlWyRdPSRlW3pdPSRlW1ddPXtjb25zdHJ1Y3Rvcjp0cnVlLHRvTG9jYWxlU3RyaW5nOnRydWUsdG9TdHJpbmc6dHJ1ZSx2YWx1ZU9mOnRydWV9LCRlW0xdPSRlW01dPXtjb25zdHJ1Y3Rvcjp0cnVlLHRvU3RyaW5nOnRydWUsdmFsdWVPZjp0cnVlfSwkZVtxXT0kZVtLXT0kZVtKXT17Y29uc3RydWN0b3I6dHJ1ZSx0b1N0cmluZzp0cnVlfSwkZVtHXT17Y29uc3RydWN0b3I6dHJ1ZX0sZnVuY3Rpb24oKXtmb3IodmFyIG49Ri5sZW5ndGg7bi0tOyl7dmFyIHQsZT1GW25dO1xuZm9yKHQgaW4gJGUpd2UuY2FsbCgkZSx0KSYmIXdlLmNhbGwoJGVbdF0sZSkmJigkZVt0XVtlXT1mYWxzZSl9fSgpLHkucHJvdG90eXBlPXYucHJvdG90eXBlO3ZhciBMZT12LnN1cHBvcnQ9e307IWZ1bmN0aW9uKCl7dmFyIG49ZnVuY3Rpb24oKXt0aGlzLng9MX0sdD17MDoxLGxlbmd0aDoxfSxyPVtdO24ucHJvdG90eXBlPXt2YWx1ZU9mOjEseToxfTtmb3IodmFyIHUgaW4gbmV3IG4pci5wdXNoKHUpO2Zvcih1IGluIGFyZ3VtZW50cyk7TGUuYXJnc0NsYXNzPWhlLmNhbGwoYXJndW1lbnRzKT09VCxMZS5hcmdzT2JqZWN0PWFyZ3VtZW50cy5jb25zdHJ1Y3Rvcj09b2UmJiEoYXJndW1lbnRzIGluc3RhbmNlb2YgWnQpLExlLmVudW1FcnJvclByb3BzPXhlLmNhbGwoY2UsXCJtZXNzYWdlXCIpfHx4ZS5jYWxsKGNlLFwibmFtZVwiKSxMZS5lbnVtUHJvdG90eXBlcz14ZS5jYWxsKG4sXCJwcm90b3R5cGVcIiksTGUuZnVuY0RlY29tcD0hdnQoZS5XaW5SVEVycm9yKSYmQi50ZXN0KGcpLExlLmZ1bmNOYW1lcz10eXBlb2YgZWUubmFtZT09XCJzdHJpbmdcIixMZS5ub25FbnVtQXJncz0wIT11LExlLm5vbkVudW1TaGFkb3dzPSEvdmFsdWVPZi8udGVzdChyKSxMZS5vd25MYXN0PVwieFwiIT1yWzBdLExlLnNwbGljZU9iamVjdHM9KGZlLnNwbGljZS5jYWxsKHQsMCwxKSwhdFswXSksTGUudW5pbmRleGVkQ2hhcnM9XCJ4eFwiIT1cInhcIlswXStvZShcInhcIilbMF07XG50cnl7TGUubm9kZUNsYXNzPSEoaGUuY2FsbChkb2N1bWVudCk9PUcmJiEoe3RvU3RyaW5nOjB9K1wiXCIpKX1jYXRjaChvKXtMZS5ub2RlQ2xhc3M9dHJ1ZX19KDEpLHYudGVtcGxhdGVTZXR0aW5ncz17ZXNjYXBlOi88JS0oW1xcc1xcU10rPyklPi9nLGV2YWx1YXRlOi88JShbXFxzXFxTXSs/KSU+L2csaW50ZXJwb2xhdGU6SSx2YXJpYWJsZTpcIlwiLGltcG9ydHM6e186dn19LFNlfHwobnQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7fXJldHVybiBmdW5jdGlvbih0KXtpZih4dCh0KSl7bi5wcm90b3R5cGU9dDt2YXIgcj1uZXcgbjtuLnByb3RvdHlwZT1udWxsfXJldHVybiByfHxlLk9iamVjdCgpfX0oKSk7dmFyIHplPU9lP2Z1bmN0aW9uKG4sdCl7VS52YWx1ZT10LE9lKG4sXCJfX2JpbmREYXRhX19cIixVKX06UXQ7TGUuYXJnc0NsYXNzfHwoZHQ9ZnVuY3Rpb24obil7cmV0dXJuIG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZ0eXBlb2Ygbi5sZW5ndGg9PVwibnVtYmVyXCImJndlLmNhbGwobixcImNhbGxlZVwiKSYmIXhlLmNhbGwobixcImNhbGxlZVwiKXx8ZmFsc2Vcbn0pO3ZhciBxZT1BZXx8ZnVuY3Rpb24obil7cmV0dXJuIG4mJnR5cGVvZiBuPT1cIm9iamVjdFwiJiZ0eXBlb2Ygbi5sZW5ndGg9PVwibnVtYmVyXCImJmhlLmNhbGwobik9PSR8fGZhbHNlfSxLZT1zdCh7YTpcInpcIixlOlwiW11cIixpOlwiaWYoIShCW3R5cGVvZiB6XSkpcmV0dXJuIEVcIixnOlwiRS5wdXNoKG4pXCJ9KSxXZT1OZT9mdW5jdGlvbihuKXtyZXR1cm4geHQobik/TGUuZW51bVByb3RvdHlwZXMmJnR5cGVvZiBuPT1cImZ1bmN0aW9uXCJ8fExlLm5vbkVudW1BcmdzJiZuLmxlbmd0aCYmZHQobik/S2Uobik6TmUobik6W119OktlLEdlPXthOlwiZyxlLEtcIixpOlwiZT1lJiZ0eXBlb2YgSz09J3VuZGVmaW5lZCc/ZTpkKGUsSywzKVwiLGI6XCJ0eXBlb2YgdT09J251bWJlcidcIix2OldlLGc6XCJpZihlKHRbbl0sbixnKT09PWZhbHNlKXJldHVybiBFXCJ9LEplPXthOlwieixILGxcIixpOlwidmFyIGE9YXJndW1lbnRzLGI9MCxjPXR5cGVvZiBsPT0nbnVtYmVyJz8yOmEubGVuZ3RoO3doaWxlKCsrYjxjKXt0PWFbYl07aWYodCYmQlt0eXBlb2YgdF0pe1wiLHY6V2UsZzpcImlmKHR5cGVvZiBFW25dPT0ndW5kZWZpbmVkJylFW25dPXRbbl1cIixjOlwifX1cIn0sTWU9e2k6XCJpZighQlt0eXBlb2YgdF0pcmV0dXJuIEU7XCIrR2UuaSxiOmZhbHNlfSxWZT17XCImXCI6XCImYW1wO1wiLFwiPFwiOlwiJmx0O1wiLFwiPlwiOlwiJmd0O1wiLCdcIic6XCImcXVvdDtcIixcIidcIjpcIiYjMzk7XCJ9LEhlPXd0KFZlKSxVZT1hZShcIihcIitXZShIZSkuam9pbihcInxcIikrXCIpXCIsXCJnXCIpLFFlPWFlKFwiW1wiK1dlKFZlKS5qb2luKFwiXCIpK1wiXVwiLFwiZ1wiKSxYZT1zdChHZSksWWU9c3QoSmUse2k6SmUuaS5yZXBsYWNlKFwiO1wiLFwiO2lmKGM+MyYmdHlwZW9mIGFbYy0yXT09J2Z1bmN0aW9uJyl7dmFyIGU9ZChhWy0tYy0xXSxhW2MtLV0sMil9ZWxzZSBpZihjPjImJnR5cGVvZiBhW2MtMV09PSdmdW5jdGlvbicpe2U9YVstLWNdfVwiKSxnOlwiRVtuXT1lP2UoRVtuXSx0W25dKTp0W25dXCJ9KSxaZT1zdChKZSksbnI9c3QoR2UsTWUse2o6ZmFsc2V9KSx0cj1zdChHZSxNZSk7XG5qdCgveC8pJiYoanQ9ZnVuY3Rpb24obil7cmV0dXJuIHR5cGVvZiBuPT1cImZ1bmN0aW9uXCImJmhlLmNhbGwobik9PUt9KTt2YXIgZXI9X2U/ZnVuY3Rpb24obil7aWYoIW58fGhlLmNhbGwobikhPUd8fCFMZS5hcmdzQ2xhc3MmJmR0KG4pKXJldHVybiBmYWxzZTt2YXIgdD1uLnZhbHVlT2YsZT12dCh0KSYmKGU9X2UodCkpJiZfZShlKTtyZXR1cm4gZT9uPT1lfHxfZShuKT09ZTp5dChuKX06eXQscnI9Y3QoZnVuY3Rpb24obix0LGUpe3dlLmNhbGwobixlKT9uW2VdKys6bltlXT0xfSksdXI9Y3QoZnVuY3Rpb24obix0LGUpeyh3ZS5jYWxsKG4sZSk/bltlXTpuW2VdPVtdKS5wdXNoKHQpfSksb3I9Y3QoZnVuY3Rpb24obix0LGUpe25bZV09dH0pLGFyPUJ0LGlyPXZ0KGlyPXRlLm5vdykmJmlyfHxmdW5jdGlvbigpe3JldHVybihuZXcgdGUpLmdldFRpbWUoKX0sbHI9OD09UmUoaitcIjA4XCIpP1JlOmZ1bmN0aW9uKG4sdCl7cmV0dXJuIFJlKGt0KG4pP24ucmVwbGFjZShELFwiXCIpOm4sdHx8MCl9O1xucmV0dXJuIHYuYWZ0ZXI9ZnVuY3Rpb24obix0KXtpZighanQodCkpdGhyb3cgbmV3IGxlO3JldHVybiBmdW5jdGlvbigpe3JldHVybiAxPi0tbj90LmFwcGx5KHRoaXMsYXJndW1lbnRzKTp2b2lkIDB9fSx2LmFzc2lnbj1ZZSx2LmF0PWZ1bmN0aW9uKG4pe3ZhciB0PWFyZ3VtZW50cyxlPS0xLHI9b3QodCx0cnVlLGZhbHNlLDEpLHQ9dFsyXSYmdFsyXVt0WzFdXT09PW4/MTpyLmxlbmd0aCx1PVp0KHQpO2ZvcihMZS51bmluZGV4ZWRDaGFycyYma3QobikmJihuPW4uc3BsaXQoXCJcIikpOysrZTx0Oyl1W2VdPW5bcltlXV07cmV0dXJuIHV9LHYuYmluZD1NdCx2LmJpbmRBbGw9ZnVuY3Rpb24obil7Zm9yKHZhciB0PTE8YXJndW1lbnRzLmxlbmd0aD9vdChhcmd1bWVudHMsdHJ1ZSxmYWxzZSwxKTpfdChuKSxlPS0xLHI9dC5sZW5ndGg7KytlPHI7KXt2YXIgdT10W2VdO25bdV09cHQoblt1XSwxLG51bGwsbnVsbCxuKX1yZXR1cm4gbn0sdi5iaW5kS2V5PWZ1bmN0aW9uKG4sdCl7cmV0dXJuIDI8YXJndW1lbnRzLmxlbmd0aD9wdCh0LDE5LHMoYXJndW1lbnRzLDIpLG51bGwsbik6cHQodCwzLG51bGwsbnVsbCxuKVxufSx2LmNoYWluPWZ1bmN0aW9uKG4pe3JldHVybiBuPW5ldyB5KG4pLG4uX19jaGFpbl9fPXRydWUsbn0sdi5jb21wYWN0PWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD0tMSxlPW4/bi5sZW5ndGg6MCxyPVtdOysrdDxlOyl7dmFyIHU9blt0XTt1JiZyLnB1c2godSl9cmV0dXJuIHJ9LHYuY29tcG9zZT1mdW5jdGlvbigpe2Zvcih2YXIgbj1hcmd1bWVudHMsdD1uLmxlbmd0aDt0LS07KWlmKCFqdChuW3RdKSl0aHJvdyBuZXcgbGU7cmV0dXJuIGZ1bmN0aW9uKCl7Zm9yKHZhciB0PWFyZ3VtZW50cyxlPW4ubGVuZ3RoO2UtLTspdD1bbltlXS5hcHBseSh0aGlzLHQpXTtyZXR1cm4gdFswXX19LHYuY29uc3RhbnQ9ZnVuY3Rpb24obil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIG59fSx2LmNvdW50Qnk9cnIsdi5jcmVhdGU9ZnVuY3Rpb24obix0KXt2YXIgZT1udChuKTtyZXR1cm4gdD9ZZShlLHQpOmV9LHYuY3JlYXRlQ2FsbGJhY2s9ZnVuY3Rpb24obix0LGUpe3ZhciByPXR5cGVvZiBuO2lmKG51bGw9PW58fFwiZnVuY3Rpb25cIj09cilyZXR1cm4gdHQobix0LGUpO1xuaWYoXCJvYmplY3RcIiE9cilyZXR1cm4gWHQobik7dmFyIHU9V2Uobiksbz11WzBdLGE9bltvXTtyZXR1cm4gMSE9dS5sZW5ndGh8fGEhPT1hfHx4dChhKT9mdW5jdGlvbih0KXtmb3IodmFyIGU9dS5sZW5ndGgscj1mYWxzZTtlLS0mJihyPWF0KHRbdVtlXV0sblt1W2VdXSxudWxsLHRydWUpKTspO3JldHVybiByfTpmdW5jdGlvbihuKXtyZXR1cm4gbj1uW29dLGE9PT1uJiYoMCE9PWF8fDEvYT09MS9uKX19LHYuY3Vycnk9ZnVuY3Rpb24obix0KXtyZXR1cm4gdD10eXBlb2YgdD09XCJudW1iZXJcIj90Oit0fHxuLmxlbmd0aCxwdChuLDQsbnVsbCxudWxsLG51bGwsdCl9LHYuZGVib3VuY2U9VnQsdi5kZWZhdWx0cz1aZSx2LmRlZmVyPWZ1bmN0aW9uKG4pe2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7dmFyIHQ9cyhhcmd1bWVudHMsMSk7cmV0dXJuIENlKGZ1bmN0aW9uKCl7bi5hcHBseShoLHQpfSwxKX0sdi5kZWxheT1mdW5jdGlvbihuLHQpe2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7dmFyIGU9cyhhcmd1bWVudHMsMik7XG5yZXR1cm4gQ2UoZnVuY3Rpb24oKXtuLmFwcGx5KGgsZSl9LHQpfSx2LmRpZmZlcmVuY2U9ZnVuY3Rpb24obil7cmV0dXJuIHJ0KG4sb3QoYXJndW1lbnRzLHRydWUsdHJ1ZSwxKSl9LHYuZmlsdGVyPUF0LHYuZmxhdHRlbj1mdW5jdGlvbihuLHQsZSxyKXtyZXR1cm4gdHlwZW9mIHQhPVwiYm9vbGVhblwiJiZudWxsIT10JiYocj1lLGU9dHlwZW9mIHQhPVwiZnVuY3Rpb25cIiYmciYmclt0XT09PW4/bnVsbDp0LHQ9ZmFsc2UpLG51bGwhPWUmJihuPUJ0KG4sZSxyKSksb3Qobix0KX0sdi5mb3JFYWNoPUR0LHYuZm9yRWFjaFJpZ2h0PU50LHYuZm9ySW49bnIsdi5mb3JJblJpZ2h0PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj1bXTtucihuLGZ1bmN0aW9uKG4sdCl7ci5wdXNoKHQsbil9KTt2YXIgdT1yLmxlbmd0aDtmb3IodD10dCh0LGUsMyk7dS0tJiZmYWxzZSE9PXQoclt1LS1dLHJbdV0sbik7KTtyZXR1cm4gbn0sdi5mb3JPd249dHIsdi5mb3JPd25SaWdodD1idCx2LmZ1bmN0aW9ucz1fdCx2Lmdyb3VwQnk9dXIsdi5pbmRleEJ5PW9yLHYuaW5pdGlhbD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9MCx1PW4/bi5sZW5ndGg6MDtcbmlmKHR5cGVvZiB0IT1cIm51bWJlclwiJiZudWxsIT10KXt2YXIgbz11O2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpO28tLSYmdChuW29dLG8sbik7KXIrK31lbHNlIHI9bnVsbD09dHx8ZT8xOnR8fHI7cmV0dXJuIHMobiwwLFBlKEJlKDAsdS1yKSx1KSl9LHYuaW50ZXJzZWN0aW9uPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPVtdLHI9LTEsdT1hcmd1bWVudHMubGVuZ3RoLGE9aSgpLGw9aHQoKSxmPWw9PT1uLHM9aSgpOysrcjx1Oyl7dmFyIGc9YXJndW1lbnRzW3JdOyhxZShnKXx8ZHQoZykpJiYoZS5wdXNoKGcpLGEucHVzaChmJiZnLmxlbmd0aD49XyYmbyhyP2Vbcl06cykpKX12YXIgZj1lWzBdLGg9LTEsdj1mP2YubGVuZ3RoOjAseT1bXTtuOmZvcig7KytoPHY7KXt2YXIgbT1hWzBdLGc9ZltoXTtpZigwPihtP3QobSxnKTpsKHMsZykpKXtmb3Iocj11LChtfHxzKS5wdXNoKGcpOy0tcjspaWYobT1hW3JdLDA+KG0/dChtLGcpOmwoZVtyXSxnKSkpY29udGludWUgbjt5LnB1c2goZylcbn19Zm9yKDt1LS07KShtPWFbdV0pJiZwKG0pO3JldHVybiBjKGEpLGMocykseX0sdi5pbnZlcnQ9d3Qsdi5pbnZva2U9ZnVuY3Rpb24obix0KXt2YXIgZT1zKGFyZ3VtZW50cywyKSxyPS0xLHU9dHlwZW9mIHQ9PVwiZnVuY3Rpb25cIixvPW4/bi5sZW5ndGg6MCxhPVp0KHR5cGVvZiBvPT1cIm51bWJlclwiP286MCk7cmV0dXJuIER0KG4sZnVuY3Rpb24obil7YVsrK3JdPSh1P3Q6blt0XSkuYXBwbHkobixlKX0pLGF9LHYua2V5cz1XZSx2Lm1hcD1CdCx2Lm1hcFZhbHVlcz1mdW5jdGlvbihuLHQsZSl7dmFyIHI9e307cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksdHIobixmdW5jdGlvbihuLGUsdSl7cltlXT10KG4sZSx1KX0pLHJ9LHYubWF4PVB0LHYubWVtb2l6ZT1mdW5jdGlvbihuLHQpe2lmKCFqdChuKSl0aHJvdyBuZXcgbGU7dmFyIGU9ZnVuY3Rpb24oKXt2YXIgcj1lLmNhY2hlLHU9dD90LmFwcGx5KHRoaXMsYXJndW1lbnRzKTpiK2FyZ3VtZW50c1swXTtyZXR1cm4gd2UuY2FsbChyLHUpP3JbdV06clt1XT1uLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxufTtyZXR1cm4gZS5jYWNoZT17fSxlfSx2Lm1lcmdlPWZ1bmN0aW9uKG4pe3ZhciB0PWFyZ3VtZW50cyxlPTI7aWYoIXh0KG4pKXJldHVybiBuO2lmKFwibnVtYmVyXCIhPXR5cGVvZiB0WzJdJiYoZT10Lmxlbmd0aCksMzxlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0W2UtMl0pdmFyIHI9dHQodFstLWUtMV0sdFtlLS1dLDIpO2Vsc2UgMjxlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0W2UtMV0mJihyPXRbLS1lXSk7Zm9yKHZhciB0PXMoYXJndW1lbnRzLDEsZSksdT0tMSxvPWkoKSxhPWkoKTsrK3U8ZTspaXQobix0W3VdLHIsbyxhKTtyZXR1cm4gYyhvKSxjKGEpLG59LHYubWluPWZ1bmN0aW9uKG4sdCxlKXt2YXIgdT0xLzAsbz11O2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCImJmUmJmVbdF09PT1uJiYodD1udWxsKSxudWxsPT10JiZxZShuKSl7ZT0tMTtmb3IodmFyIGE9bi5sZW5ndGg7KytlPGE7KXt2YXIgaT1uW2VdO2k8byYmKG89aSl9fWVsc2UgdD1udWxsPT10JiZrdChuKT9yOnYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLFhlKG4sZnVuY3Rpb24obixlLHIpe2U9dChuLGUsciksZTx1JiYodT1lLG89bilcbn0pO3JldHVybiBvfSx2Lm9taXQ9ZnVuY3Rpb24obix0LGUpe3ZhciByPXt9O2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpe3ZhciB1PVtdO25yKG4sZnVuY3Rpb24obix0KXt1LnB1c2godCl9KTtmb3IodmFyIHU9cnQodSxvdChhcmd1bWVudHMsdHJ1ZSxmYWxzZSwxKSksbz0tMSxhPXUubGVuZ3RoOysrbzxhOyl7dmFyIGk9dVtvXTtyW2ldPW5baV19fWVsc2UgdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxucihuLGZ1bmN0aW9uKG4sZSx1KXt0KG4sZSx1KXx8KHJbZV09bil9KTtyZXR1cm4gcn0sdi5vbmNlPWZ1bmN0aW9uKG4pe3ZhciB0LGU7aWYoIWp0KG4pKXRocm93IG5ldyBsZTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdD9lOih0PXRydWUsZT1uLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxuPW51bGwsZSl9fSx2LnBhaXJzPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD0tMSxlPVdlKG4pLHI9ZS5sZW5ndGgsdT1adChyKTsrK3Q8cjspe3ZhciBvPWVbdF07dVt0XT1bbyxuW29dXX1yZXR1cm4gdVxufSx2LnBhcnRpYWw9ZnVuY3Rpb24obil7cmV0dXJuIHB0KG4sMTYscyhhcmd1bWVudHMsMSkpfSx2LnBhcnRpYWxSaWdodD1mdW5jdGlvbihuKXtyZXR1cm4gcHQobiwzMixudWxsLHMoYXJndW1lbnRzLDEpKX0sdi5waWNrPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj17fTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiKWZvcih2YXIgdT0tMSxvPW90KGFyZ3VtZW50cyx0cnVlLGZhbHNlLDEpLGE9eHQobik/by5sZW5ndGg6MDsrK3U8YTspe3ZhciBpPW9bdV07aSBpbiBuJiYocltpXT1uW2ldKX1lbHNlIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksbnIobixmdW5jdGlvbihuLGUsdSl7dChuLGUsdSkmJihyW2VdPW4pfSk7cmV0dXJuIHJ9LHYucGx1Y2s9YXIsdi5wcm9wZXJ0eT1YdCx2LnB1bGw9ZnVuY3Rpb24obil7Zm9yKHZhciB0PWFyZ3VtZW50cyxlPTAscj10Lmxlbmd0aCx1PW4/bi5sZW5ndGg6MDsrK2U8cjspZm9yKHZhciBvPS0xLGE9dFtlXTsrK288dTspbltvXT09PWEmJihrZS5jYWxsKG4sby0tLDEpLHUtLSk7XG5yZXR1cm4gbn0sdi5yYW5nZT1mdW5jdGlvbihuLHQsZSl7bj0rbnx8MCxlPXR5cGVvZiBlPT1cIm51bWJlclwiP2U6K2V8fDEsbnVsbD09dCYmKHQ9bixuPTApO3ZhciByPS0xO3Q9QmUoMCx5ZSgodC1uKS8oZXx8MSkpKTtmb3IodmFyIHU9WnQodCk7KytyPHQ7KXVbcl09bixuKz1lO3JldHVybiB1fSx2LnJlamVjdD1mdW5jdGlvbihuLHQsZSl7cmV0dXJuIHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyksQXQobixmdW5jdGlvbihuLGUscil7cmV0dXJuIXQobixlLHIpfSl9LHYucmVtb3ZlPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0tMSx1PW4/bi5sZW5ndGg6MCxvPVtdO2Zvcih0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpOysrcjx1OyllPW5bcl0sdChlLHIsbikmJihvLnB1c2goZSksa2UuY2FsbChuLHItLSwxKSx1LS0pO3JldHVybiBvfSx2LnJlc3Q9cXQsdi5zaHVmZmxlPVR0LHYuc29ydEJ5PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj0tMSxvPXFlKHQpLGE9bj9uLmxlbmd0aDowLGY9WnQodHlwZW9mIGE9PVwibnVtYmVyXCI/YTowKTtcbmZvcihvfHwodD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSksRHQobixmdW5jdGlvbihuLGUsdSl7dmFyIGE9ZlsrK3JdPWwoKTtvP2EubT1CdCh0LGZ1bmN0aW9uKHQpe3JldHVybiBuW3RdfSk6KGEubT1pKCkpWzBdPXQobixlLHUpLGEubj1yLGEubz1ufSksYT1mLmxlbmd0aCxmLnNvcnQodSk7YS0tOyluPWZbYV0sZlthXT1uLm8sb3x8YyhuLm0pLHAobik7cmV0dXJuIGZ9LHYudGFwPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHQobiksbn0sdi50aHJvdHRsZT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9dHJ1ZSx1PXRydWU7aWYoIWp0KG4pKXRocm93IG5ldyBsZTtyZXR1cm4gZmFsc2U9PT1lP3I9ZmFsc2U6eHQoZSkmJihyPVwibGVhZGluZ1wiaW4gZT9lLmxlYWRpbmc6cix1PVwidHJhaWxpbmdcImluIGU/ZS50cmFpbGluZzp1KSxILmxlYWRpbmc9cixILm1heFdhaXQ9dCxILnRyYWlsaW5nPXUsVnQobix0LEgpfSx2LnRpbWVzPWZ1bmN0aW9uKG4sdCxlKXtuPS0xPChuPStuKT9uOjA7dmFyIHI9LTEsdT1adChuKTtcbmZvcih0PXR0KHQsZSwxKTsrK3I8bjspdVtyXT10KHIpO3JldHVybiB1fSx2LnRvQXJyYXk9ZnVuY3Rpb24obil7cmV0dXJuIG4mJnR5cGVvZiBuLmxlbmd0aD09XCJudW1iZXJcIj9MZS51bmluZGV4ZWRDaGFycyYma3Qobik/bi5zcGxpdChcIlwiKTpzKG4pOkV0KG4pfSx2LnRyYW5zZm9ybT1mdW5jdGlvbihuLHQsZSxyKXt2YXIgdT1xZShuKTtpZihudWxsPT1lKWlmKHUpZT1bXTtlbHNle3ZhciBvPW4mJm4uY29uc3RydWN0b3I7ZT1udChvJiZvLnByb3RvdHlwZSl9cmV0dXJuIHQmJih0PXYuY3JlYXRlQ2FsbGJhY2sodCxyLDQpLCh1P1hlOnRyKShuLGZ1bmN0aW9uKG4scix1KXtyZXR1cm4gdChlLG4scix1KX0pKSxlfSx2LnVuaW9uPWZ1bmN0aW9uKCl7cmV0dXJuIGZ0KG90KGFyZ3VtZW50cyx0cnVlLHRydWUpKX0sdi51bmlxPVd0LHYudmFsdWVzPUV0LHYud2hlcmU9QXQsdi53aXRob3V0PWZ1bmN0aW9uKG4pe3JldHVybiBydChuLHMoYXJndW1lbnRzLDEpKX0sdi53cmFwPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHB0KHQsMTYsW25dKVxufSx2Lnhvcj1mdW5jdGlvbigpe2Zvcih2YXIgbj0tMSx0PWFyZ3VtZW50cy5sZW5ndGg7KytuPHQ7KXt2YXIgZT1hcmd1bWVudHNbbl07aWYocWUoZSl8fGR0KGUpKXZhciByPXI/ZnQocnQocixlKS5jb25jYXQocnQoZSxyKSkpOmV9cmV0dXJuIHJ8fFtdfSx2LnppcD1HdCx2LnppcE9iamVjdD1KdCx2LmNvbGxlY3Q9QnQsdi5kcm9wPXF0LHYuZWFjaD1EdCx2LmVhY2hSaWdodD1OdCx2LmV4dGVuZD1ZZSx2Lm1ldGhvZHM9X3Qsdi5vYmplY3Q9SnQsdi5zZWxlY3Q9QXQsdi50YWlsPXF0LHYudW5pcXVlPVd0LHYudW56aXA9R3QsVXQodiksdi5jbG9uZT1mdW5jdGlvbihuLHQsZSxyKXtyZXR1cm4gdHlwZW9mIHQhPVwiYm9vbGVhblwiJiZudWxsIT10JiYocj1lLGU9dCx0PWZhbHNlKSxZKG4sdCx0eXBlb2YgZT09XCJmdW5jdGlvblwiJiZ0dChlLHIsMSkpfSx2LmNsb25lRGVlcD1mdW5jdGlvbihuLHQsZSl7cmV0dXJuIFkobix0cnVlLHR5cGVvZiB0PT1cImZ1bmN0aW9uXCImJnR0KHQsZSwxKSl9LHYuY29udGFpbnM9T3Qsdi5lc2NhcGU9ZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PW4/XCJcIjppZShuKS5yZXBsYWNlKFFlLGd0KVxufSx2LmV2ZXJ5PVN0LHYuZmluZD1JdCx2LmZpbmRJbmRleD1mdW5jdGlvbihuLHQsZSl7dmFyIHI9LTEsdT1uP24ubGVuZ3RoOjA7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7KytyPHU7KWlmKHQobltyXSxyLG4pKXJldHVybiByO3JldHVybi0xfSx2LmZpbmRLZXk9ZnVuY3Rpb24obix0LGUpe3ZhciByO3JldHVybiB0PXYuY3JlYXRlQ2FsbGJhY2sodCxlLDMpLHRyKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiB0KG4sZSx1KT8ocj1lLGZhbHNlKTp2b2lkIDB9KSxyfSx2LmZpbmRMYXN0PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcjtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxOdChuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gdChuLGUsdSk/KHI9bixmYWxzZSk6dm9pZCAwfSkscn0sdi5maW5kTGFzdEluZGV4PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj1uP24ubGVuZ3RoOjA7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7ci0tOylpZih0KG5bcl0scixuKSlyZXR1cm4gcjtcbnJldHVybi0xfSx2LmZpbmRMYXN0S2V5PWZ1bmN0aW9uKG4sdCxlKXt2YXIgcjtyZXR1cm4gdD12LmNyZWF0ZUNhbGxiYWNrKHQsZSwzKSxidChuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gdChuLGUsdSk/KHI9ZSxmYWxzZSk6dm9pZCAwfSkscn0sdi5oYXM9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj93ZS5jYWxsKG4sdCk6ZmFsc2V9LHYuaWRlbnRpdHk9SHQsdi5pbmRleE9mPXp0LHYuaXNBcmd1bWVudHM9ZHQsdi5pc0FycmF5PXFlLHYuaXNCb29sZWFuPWZ1bmN0aW9uKG4pe3JldHVybiB0cnVlPT09bnx8ZmFsc2U9PT1ufHxuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmaGUuY2FsbChuKT09THx8ZmFsc2V9LHYuaXNEYXRlPWZ1bmN0aW9uKG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcIiYmaGUuY2FsbChuKT09enx8ZmFsc2V9LHYuaXNFbGVtZW50PWZ1bmN0aW9uKG4pe3JldHVybiBuJiYxPT09bi5ub2RlVHlwZXx8ZmFsc2V9LHYuaXNFbXB0eT1mdW5jdGlvbihuKXt2YXIgdD10cnVlO2lmKCFuKXJldHVybiB0O3ZhciBlPWhlLmNhbGwobikscj1uLmxlbmd0aDtcbnJldHVybiBlPT0kfHxlPT1NfHwoTGUuYXJnc0NsYXNzP2U9PVQ6ZHQobikpfHxlPT1HJiZ0eXBlb2Ygcj09XCJudW1iZXJcIiYmanQobi5zcGxpY2UpPyFyOih0cihuLGZ1bmN0aW9uKCl7cmV0dXJuIHQ9ZmFsc2V9KSx0KX0sdi5pc0VxdWFsPWZ1bmN0aW9uKG4sdCxlLHIpe3JldHVybiBhdChuLHQsdHlwZW9mIGU9PVwiZnVuY3Rpb25cIiYmdHQoZSxyLDIpKX0sdi5pc0Zpbml0ZT1mdW5jdGlvbihuKXtyZXR1cm4gSWUobikmJiFEZShwYXJzZUZsb2F0KG4pKX0sdi5pc0Z1bmN0aW9uPWp0LHYuaXNOYU49ZnVuY3Rpb24obil7cmV0dXJuIEN0KG4pJiZuIT0rbn0sdi5pc051bGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PT1ufSx2LmlzTnVtYmVyPUN0LHYuaXNPYmplY3Q9eHQsdi5pc1BsYWluT2JqZWN0PWVyLHYuaXNSZWdFeHA9ZnVuY3Rpb24obil7cmV0dXJuIG4mJlhbdHlwZW9mIG5dJiZoZS5jYWxsKG4pPT1KfHxmYWxzZX0sdi5pc1N0cmluZz1rdCx2LmlzVW5kZWZpbmVkPWZ1bmN0aW9uKG4pe3JldHVybiB0eXBlb2Ygbj09XCJ1bmRlZmluZWRcIlxufSx2Lmxhc3RJbmRleE9mPWZ1bmN0aW9uKG4sdCxlKXt2YXIgcj1uP24ubGVuZ3RoOjA7Zm9yKHR5cGVvZiBlPT1cIm51bWJlclwiJiYocj0oMD5lP0JlKDAscitlKTpQZShlLHItMSkpKzEpO3ItLTspaWYobltyXT09PXQpcmV0dXJuIHI7cmV0dXJuLTF9LHYubWl4aW49VXQsdi5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGUuXz1nZSx0aGlzfSx2Lm5vb3A9UXQsdi5ub3c9aXIsdi5wYXJzZUludD1scix2LnJhbmRvbT1mdW5jdGlvbihuLHQsZSl7dmFyIHI9bnVsbD09bix1PW51bGw9PXQ7cmV0dXJuIG51bGw9PWUmJih0eXBlb2Ygbj09XCJib29sZWFuXCImJnU/KGU9bixuPTEpOnV8fHR5cGVvZiB0IT1cImJvb2xlYW5cInx8KGU9dCx1PXRydWUpKSxyJiZ1JiYodD0xKSxuPStufHwwLHU/KHQ9bixuPTApOnQ9K3R8fDAsZXx8biUxfHx0JTE/KGU9RmUoKSxQZShuK2UqKHQtbitwYXJzZUZsb2F0KFwiMWUtXCIrKChlK1wiXCIpLmxlbmd0aC0xKSkpLHQpKTpsdChuLHQpfSx2LnJlZHVjZT1SdCx2LnJlZHVjZVJpZ2h0PUZ0LHYucmVzdWx0PWZ1bmN0aW9uKG4sdCl7aWYobil7dmFyIGU9blt0XTtcbnJldHVybiBqdChlKT9uW3RdKCk6ZX19LHYucnVuSW5Db250ZXh0PWcsdi5zaXplPWZ1bmN0aW9uKG4pe3ZhciB0PW4/bi5sZW5ndGg6MDtyZXR1cm4gdHlwZW9mIHQ9PVwibnVtYmVyXCI/dDpXZShuKS5sZW5ndGh9LHYuc29tZT0kdCx2LnNvcnRlZEluZGV4PUt0LHYudGVtcGxhdGU9ZnVuY3Rpb24obix0LGUpe3ZhciByPXYudGVtcGxhdGVTZXR0aW5ncztuPWllKG58fFwiXCIpLGU9WmUoe30sZSxyKTt2YXIgdSxvPVplKHt9LGUuaW1wb3J0cyxyLmltcG9ydHMpLHI9V2Uobyksbz1FdChvKSxpPTAsbD1lLmludGVycG9sYXRlfHxOLGY9XCJfX3ArPSdcIixsPWFlKChlLmVzY2FwZXx8Tikuc291cmNlK1wifFwiK2wuc291cmNlK1wifFwiKyhsPT09ST9POk4pLnNvdXJjZStcInxcIisoZS5ldmFsdWF0ZXx8Tikuc291cmNlK1wifCRcIixcImdcIik7bi5yZXBsYWNlKGwsZnVuY3Rpb24odCxlLHIsbyxsLGMpe3JldHVybiByfHwocj1vKSxmKz1uLnNsaWNlKGksYykucmVwbGFjZShQLGEpLGUmJihmKz1cIicrX19lKFwiK2UrXCIpKydcIiksbCYmKHU9dHJ1ZSxmKz1cIic7XCIrbCtcIjtcXG5fX3ArPSdcIiksciYmKGYrPVwiJysoKF9fdD0oXCIrcitcIikpPT1udWxsPycnOl9fdCkrJ1wiKSxpPWMrdC5sZW5ndGgsdFxufSksZis9XCInO1wiLGw9ZT1lLnZhcmlhYmxlLGx8fChlPVwib2JqXCIsZj1cIndpdGgoXCIrZStcIil7XCIrZitcIn1cIiksZj0odT9mLnJlcGxhY2UoeCxcIlwiKTpmKS5yZXBsYWNlKEMsXCIkMVwiKS5yZXBsYWNlKEUsXCIkMTtcIiksZj1cImZ1bmN0aW9uKFwiK2UrXCIpe1wiKyhsP1wiXCI6ZStcInx8KFwiK2UrXCI9e30pO1wiKStcInZhciBfX3QsX19wPScnLF9fZT1fLmVzY2FwZVwiKyh1P1wiLF9faj1BcnJheS5wcm90b3R5cGUuam9pbjtmdW5jdGlvbiBwcmludCgpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKX1cIjpcIjtcIikrZitcInJldHVybiBfX3B9XCI7dHJ5e3ZhciBjPWVlKHIsXCJyZXR1cm4gXCIrZikuYXBwbHkoaCxvKX1jYXRjaChwKXt0aHJvdyBwLnNvdXJjZT1mLHB9cmV0dXJuIHQ/Yyh0KTooYy5zb3VyY2U9ZixjKX0sdi51bmVzY2FwZT1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbD09bj9cIlwiOmllKG4pLnJlcGxhY2UoVWUsbXQpfSx2LnVuaXF1ZUlkPWZ1bmN0aW9uKG4pe3ZhciB0PSsrbTtyZXR1cm4gaWUobnVsbD09bj9cIlwiOm4pK3Rcbn0sdi5hbGw9U3Qsdi5hbnk9JHQsdi5kZXRlY3Q9SXQsdi5maW5kV2hlcmU9SXQsdi5mb2xkbD1SdCx2LmZvbGRyPUZ0LHYuaW5jbHVkZT1PdCx2LmluamVjdD1SdCxVdChmdW5jdGlvbigpe3ZhciBuPXt9O3JldHVybiB0cih2LGZ1bmN0aW9uKHQsZSl7di5wcm90b3R5cGVbZV18fChuW2VdPXQpfSksbn0oKSxmYWxzZSksdi5maXJzdD1MdCx2Lmxhc3Q9ZnVuY3Rpb24obix0LGUpe3ZhciByPTAsdT1uP24ubGVuZ3RoOjA7aWYodHlwZW9mIHQhPVwibnVtYmVyXCImJm51bGwhPXQpe3ZhciBvPXU7Zm9yKHQ9di5jcmVhdGVDYWxsYmFjayh0LGUsMyk7by0tJiZ0KG5bb10sbyxuKTspcisrfWVsc2UgaWYocj10LG51bGw9PXJ8fGUpcmV0dXJuIG4/blt1LTFdOmg7cmV0dXJuIHMobixCZSgwLHUtcikpfSx2LnNhbXBsZT1mdW5jdGlvbihuLHQsZSl7cmV0dXJuIG4mJnR5cGVvZiBuLmxlbmd0aCE9XCJudW1iZXJcIj9uPUV0KG4pOkxlLnVuaW5kZXhlZENoYXJzJiZrdChuKSYmKG49bi5zcGxpdChcIlwiKSksbnVsbD09dHx8ZT9uP25bbHQoMCxuLmxlbmd0aC0xKV06aDoobj1UdChuKSxuLmxlbmd0aD1QZShCZSgwLHQpLG4ubGVuZ3RoKSxuKVxufSx2LnRha2U9THQsdi5oZWFkPUx0LHRyKHYsZnVuY3Rpb24obix0KXt2YXIgZT1cInNhbXBsZVwiIT09dDt2LnByb3RvdHlwZVt0XXx8KHYucHJvdG90eXBlW3RdPWZ1bmN0aW9uKHQscil7dmFyIHU9dGhpcy5fX2NoYWluX18sbz1uKHRoaXMuX193cmFwcGVkX18sdCxyKTtyZXR1cm4gdXx8bnVsbCE9dCYmKCFyfHxlJiZ0eXBlb2YgdD09XCJmdW5jdGlvblwiKT9uZXcgeShvLHUpOm99KX0pLHYuVkVSU0lPTj1cIjIuNC4xXCIsdi5wcm90b3R5cGUuY2hhaW49ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fX2NoYWluX189dHJ1ZSx0aGlzfSx2LnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBpZSh0aGlzLl9fd3JhcHBlZF9fKX0sdi5wcm90b3R5cGUudmFsdWU9WXQsdi5wcm90b3R5cGUudmFsdWVPZj1ZdCxYZShbXCJqb2luXCIsXCJwb3BcIixcInNoaWZ0XCJdLGZ1bmN0aW9uKG4pe3ZhciB0PWZlW25dO3YucHJvdG90eXBlW25dPWZ1bmN0aW9uKCl7dmFyIG49dGhpcy5fX2NoYWluX18sZT10LmFwcGx5KHRoaXMuX193cmFwcGVkX18sYXJndW1lbnRzKTtcbnJldHVybiBuP25ldyB5KGUsbik6ZX19KSxYZShbXCJwdXNoXCIsXCJyZXZlcnNlXCIsXCJzb3J0XCIsXCJ1bnNoaWZ0XCJdLGZ1bmN0aW9uKG4pe3ZhciB0PWZlW25dO3YucHJvdG90eXBlW25dPWZ1bmN0aW9uKCl7cmV0dXJuIHQuYXBwbHkodGhpcy5fX3dyYXBwZWRfXyxhcmd1bWVudHMpLHRoaXN9fSksWGUoW1wiY29uY2F0XCIsXCJzbGljZVwiLFwic3BsaWNlXCJdLGZ1bmN0aW9uKG4pe3ZhciB0PWZlW25dO3YucHJvdG90eXBlW25dPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyB5KHQuYXBwbHkodGhpcy5fX3dyYXBwZWRfXyxhcmd1bWVudHMpLHRoaXMuX19jaGFpbl9fKX19KSxMZS5zcGxpY2VPYmplY3RzfHxYZShbXCJwb3BcIixcInNoaWZ0XCIsXCJzcGxpY2VcIl0sZnVuY3Rpb24obil7dmFyIHQ9ZmVbbl0sZT1cInNwbGljZVwiPT1uO3YucHJvdG90eXBlW25dPWZ1bmN0aW9uKCl7dmFyIG49dGhpcy5fX2NoYWluX18scj10aGlzLl9fd3JhcHBlZF9fLHU9dC5hcHBseShyLGFyZ3VtZW50cyk7cmV0dXJuIDA9PT1yLmxlbmd0aCYmZGVsZXRlIHJbMF0sbnx8ZT9uZXcgeSh1LG4pOnVcbn19KSx2fXZhciBoLHY9W10seT1bXSxtPTAsZD17fSxiPStuZXcgRGF0ZStcIlwiLF89NzUsdz00MCxqPVwiIFxcdFxceDBCXFxmXFx4YTBcXHVmZWZmXFxuXFxyXFx1MjAyOFxcdTIwMjlcXHUxNjgwXFx1MTgwZVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBhXFx1MjAyZlxcdTIwNWZcXHUzMDAwXCIseD0vXFxiX19wXFwrPScnOy9nLEM9L1xcYihfX3BcXCs9KScnXFwrL2csRT0vKF9fZVxcKC4qP1xcKXxcXGJfX3RcXCkpXFwrJyc7L2csTz0vXFwkXFx7KFteXFxcXH1dKig/OlxcXFwuW15cXFxcfV0qKSopXFx9L2csUz0vXFx3KiQvLEE9L15cXHMqZnVuY3Rpb25bIFxcblxcclxcdF0rXFx3LyxJPS88JT0oW1xcc1xcU10rPyklPi9nLEQ9UmVnRXhwKFwiXltcIitqK1wiXSowKyg/PS4kKVwiKSxOPS8oJF4pLyxCPS9cXGJ0aGlzXFxiLyxQPS9bJ1xcblxcclxcdFxcdTIwMjhcXHUyMDI5XFxcXF0vZyxSPVwiQXJyYXkgQm9vbGVhbiBEYXRlIEVycm9yIEZ1bmN0aW9uIE1hdGggTnVtYmVyIE9iamVjdCBSZWdFeHAgU3RyaW5nIF8gYXR0YWNoRXZlbnQgY2xlYXJUaW1lb3V0IGlzRmluaXRlIGlzTmFOIHBhcnNlSW50IHNldFRpbWVvdXRcIi5zcGxpdChcIiBcIiksRj1cImNvbnN0cnVjdG9yIGhhc093blByb3BlcnR5IGlzUHJvdG90eXBlT2YgcHJvcGVydHlJc0VudW1lcmFibGUgdG9Mb2NhbGVTdHJpbmcgdG9TdHJpbmcgdmFsdWVPZlwiLnNwbGl0KFwiIFwiKSxUPVwiW29iamVjdCBBcmd1bWVudHNdXCIsJD1cIltvYmplY3QgQXJyYXldXCIsTD1cIltvYmplY3QgQm9vbGVhbl1cIix6PVwiW29iamVjdCBEYXRlXVwiLHE9XCJbb2JqZWN0IEVycm9yXVwiLEs9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLFc9XCJbb2JqZWN0IE51bWJlcl1cIixHPVwiW29iamVjdCBPYmplY3RdXCIsSj1cIltvYmplY3QgUmVnRXhwXVwiLE09XCJbb2JqZWN0IFN0cmluZ11cIixWPXt9O1xuVltLXT1mYWxzZSxWW1RdPVZbJF09VltMXT1WW3pdPVZbV109VltHXT1WW0pdPVZbTV09dHJ1ZTt2YXIgSD17bGVhZGluZzpmYWxzZSxtYXhXYWl0OjAsdHJhaWxpbmc6ZmFsc2V9LFU9e2NvbmZpZ3VyYWJsZTpmYWxzZSxlbnVtZXJhYmxlOmZhbHNlLHZhbHVlOm51bGwsd3JpdGFibGU6ZmFsc2V9LFE9e2E6XCJcIixiOm51bGwsYzpcIlwiLGQ6XCJcIixlOlwiXCIsdjpudWxsLGc6XCJcIixoOm51bGwsc3VwcG9ydDpudWxsLGk6XCJcIixqOmZhbHNlfSxYPXtcImJvb2xlYW5cIjpmYWxzZSxcImZ1bmN0aW9uXCI6dHJ1ZSxvYmplY3Q6dHJ1ZSxudW1iZXI6ZmFsc2Usc3RyaW5nOmZhbHNlLHVuZGVmaW5lZDpmYWxzZX0sWT17XCJcXFxcXCI6XCJcXFxcXCIsXCInXCI6XCInXCIsXCJcXG5cIjpcIm5cIixcIlxcclwiOlwiclwiLFwiXFx0XCI6XCJ0XCIsXCJcXHUyMDI4XCI6XCJ1MjAyOFwiLFwiXFx1MjAyOVwiOlwidTIwMjlcIn0sWj1YW3R5cGVvZiB3aW5kb3ddJiZ3aW5kb3d8fHRoaXMsbnQ9WFt0eXBlb2YgZXhwb3J0c10mJmV4cG9ydHMmJiFleHBvcnRzLm5vZGVUeXBlJiZleHBvcnRzLHR0PVhbdHlwZW9mIG1vZHVsZV0mJm1vZHVsZSYmIW1vZHVsZS5ub2RlVHlwZSYmbW9kdWxlLGV0PXR0JiZ0dC5leHBvcnRzPT09bnQmJm50LHJ0PVhbdHlwZW9mIGdsb2JhbF0mJmdsb2JhbDtcbiFydHx8cnQuZ2xvYmFsIT09cnQmJnJ0LndpbmRvdyE9PXJ0fHwoWj1ydCk7dmFyIHV0PWcoKTt0eXBlb2YgZGVmaW5lPT1cImZ1bmN0aW9uXCImJnR5cGVvZiBkZWZpbmUuYW1kPT1cIm9iamVjdFwiJiZkZWZpbmUuYW1kPyhaLl89dXQsIGRlZmluZShmdW5jdGlvbigpe3JldHVybiB1dH0pKTpudCYmdHQ/ZXQ/KHR0LmV4cG9ydHM9dXQpLl89dXQ6bnQuXz11dDpaLl89dXR9KS5jYWxsKHRoaXMpO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgY29va2llcyA9IHJlcXVpcmUoJy4uL2xpYi9jb29raWVzJyk7XG52YXIgJCA9IHdpbmRvdy5qUXVlcnk7XG52YXIgZGVmX29wdCA9IHtcbiAgICBjYWNoZSA6IGZhbHNlLFxuICAgIGRhdGFUeXBlIDogXCJqc29uXCJcbn07XG5cbnZhciBhamF4ID0gZnVuY3Rpb24ob3B0KXtcbiAgICBvcHQgPSAkLmV4dGVuZChkZWZfb3B0ICwgb3B0ICk7XG4gICAgdmFyIGRhdGEgPSBvcHQuZGF0YSB8fCB7fTtcbiAgICBkYXRhLmNzcmZ0b2tlbiA9IGNvb2tpZXMuZ2V0SXRlbShcImNzcmZ0b2tlblwiKTtcbiAgICBvcHQuZGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuICQuYWpheChvcHQpO1xufVxuXG52YXIgaHR0cCA9IHtcbiAgICBnZXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBvcHQudHlwZSA9IFwiZ2V0XCI7XG4gICAgICAgIHJldHVybiBhamF4KG9wdCk7XG4gICAgfSxcbiAgICBwb3N0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgb3B0LnR5cGUgPSBcInBvc3RcIjtcbiAgICAgICAgcmV0dXJuIGFqYXgob3B0KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGh0dHA7XG4iLCJ2YXIgcHJkX2xpc3QgPSByZXF1aXJlKCcuL3Nob3Bfc3lzL3ByZF9saXN0LmpzJyk7XG5cbiQoZnVuY3Rpb24oKXtcbiAgICBwcmRfbGlzdC5pbml0KCk7XG59KTtcbiIsInJlcXVpcmUoXCIuLi8uLi9saWIvanVpY2VyLmpzXCIpO1xudmFyIF8gPSByZXF1aXJlKFwiLi4vLi4vbGliL2xvZGFzaC5jb21wYXQubWluLmpzXCIpOyBcbnZhciAkID0gcmVxdWlyZShcIi4uLy4uL2xpYi9qcXVlcnkuanNcIik7XG52YXIgaHR0cCA9IHJlcXVpcmUoXCIuLi8uLi9tb2QvaHR0cC5qc1wiKTtcbnZhciBwYWdlciA9IHJlcXVpcmUoXCIuLi8uLi9saWIvaXBhZ2VyLmpzXCIpO1xudmFyIGl0ZW1fdHBsID0gcmVxdWlyZShcIi4vdG1wbC9wcmRfaXRlbS5qc1wiKTtcblxudmFyIExpbWl0ID0gMjA7XG5cblxudmFyIFByZF9MaXN0ID0ge1xuXG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX2RvbSA9ICQoXCIjbS1saXN0XCIpO1xuICAgICAgICB0aGlzLl9jdXJfcGFyYW1zID0ge1xuICAgICAgICAgICAgcG4gOiAxXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuXyRsaXN0ID0gdGhpcy5fZG9tLmZpbmQoXCIuYWktbGlzdFwiKTsgXG4gICAgICAgIHRoaXMuXyRwYWdlID0gdGhpcy5fZG9tLmZpbmQoXCIuYWktcGFnZVwiKTtcbiAgICAgICAgdGhpcy5fJGxpc3RfY3QgPSAkKFwiI2xpc3QtY3RcIik7XG4gICAgICAgIHRoaXMuXyRub3Jlc3VsdCA9ICQoXCIjbm8tcmVzdWx0XCIpO1xuICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgdGhpcy5saXN0ZW4oKTtcbiAgICB9LFxuICAgIGxpc3RlbiA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciAkcGFnZV9kb20gPSB0aGlzLl8kcGFnZTsgXG4gICAgICAgICRwYWdlX2RvbS5kZWxlZ2F0ZShcIi5qcy1wblwiLFwiY2xpY2tcIixmdW5jdGlvbihlKXtcbiAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICB2YXIgcGcgPSB0aGlzLmdldEF0dHJpYnV0ZShcInBnXCIpICogMTtcbiAgICAgICAgICAgbWUuZ29fcGFnZShwZyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkcGFnZV9kb20uZGVsZWdhdGUoXCIuanMtcC1uZXh0XCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHZhciBwZyA9IG1lLl9jdXJfcGFyYW1zLnBuICsgMTtcbiAgICAgICAgICAgbWUuZ29fcGFnZShwZyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkcGFnZV9kb20uZGVsZWdhdGUoXCIuanMtcC1wcmV2XCIsXCJjbGlja1wiLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHZhciBwZyA9IG1lLl9jdXJfcGFyYW1zLnBuIC0xO1xuICAgICAgICAgICBtZS5nb19wYWdlKHBnKTtcbiAgICAgICAgfSk7ICBcbiAgICAgICAgdmFyICRzZiA9ICQoXCIjc3RhdHVzLWZpbHRlclwiKTtcbiAgICAgICAgJHNmLmZpbmQoXCJsaSBhXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdGF0dXNcIik7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuaW5uZXJIVE1MO1xuICAgICAgICAgICAgJHNmLmZpbmQoXCJidXR0b25cIikuaHRtbCgnJyt0ZXh0Kyc8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJhbGxcIikge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZS5fY3VyX3BhcmFtcy5zdGF0dXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLl9jdXJfcGFyYW1zLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9LFxuICAgIHJlbmRlciA6IGZ1bmN0aW9uKHNob3BfbGlzdCl7XG4gICAgICAgIHZhciAkbHMgPSB0aGlzLl8kbGlzdC5lbXB0eSgpO1xuICAgICAgICBfLmZvckVhY2goc2hvcF9saXN0LGZ1bmN0aW9uKGl0ZW0saSl7XG4gICAgICAgICAgIHZhciBodG1sID0gaXRlbV90cGwoe1xuICAgICAgICAgICAgICAgIGluZF90eHQgOiBpICsgMSxcbiAgICAgICAgICAgICAgICBuYW1lIDogaXRlbS5uYW1lLFxuICAgICAgICAgICAgICAgIGNyZWF0ZV90aW1lIDogaXRlbS5jcmVhdGVUaW1lLFxuICAgICAgICAgICAgICAgIHByZF9pZCA6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3IgOiBpdGVtLm9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIHN0YXR1cyA6IGl0ZW0uY2hlY2tTdGF0dXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgIHZhciAkZCA9ICQoaHRtbCk7IFxuICAgICAgICAgICAkZC5kYXRhKFwiaXRlbVwiLGl0ZW0pO1xuICAgICAgICAgICAkbHMuYXBwZW5kKCRkKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZW5kZXJfcGFnZSA6IGZ1bmN0aW9uKHBnLHRvdGFsKXtcbiAgICAgICAgcGFnZXIucmVuZGVyKHRoaXMuXyRwYWdlLHBnLHRvdGFsLExpbWl0KTtcbiAgICB9LFxuICAgIGxvYWQgOiBmdW5jdGlvbihwZyl7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHBnID0gcGcgPT0gdm9pZCAwID8gMSA6IHBnO1xuICAgICAgICBxdWVyeV9saXN0KCQuZXh0ZW5kKHt9LG1lLl9jdXJfcGFyYW1zLHtwbjpwZ30pKS5kb25lKGZ1bmN0aW9uKHJzKXtcbiAgICAgICAgICAgIGlmIChycy5yZXQgPT09IDEgJiYgcnMudG90YWxOdW0pIHtcbiAgICAgICAgICAgICAgICBtZS5fJG5vcmVzdWx0LmhpZGUoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2hvcF9saXN0ID0gcnMucHJvZHVjdExpc3Q7XG4gICAgICAgICAgICAgICAgbWUucmVuZGVyKHNob3BfbGlzdCk7XG4gICAgICAgICAgICAgICAgbWUuX2N1cl9wYXJhbXMucG4gPSBwZztcbiAgICAgICAgICAgICAgICBtZS5yZW5kZXJfcGFnZShwZyxycy50b3RhbE51bSk7XG4gICAgICAgICAgICAgICAgbWUuXyRsaXN0X2N0LnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWUuXyRub3Jlc3VsdC5odG1sKFwiPHA+5rKh5pyJ5p+l6K+i5Yiw57uT5p6cPC9wPlwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG1lLl8kbm9yZXN1bHQuaHRtbChcIjxwPuWQjuWPsOmUmeivrzwvcD5cIikuc2hvdygpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdvX3BhZ2UgOiBmdW5jdGlvbihwZyl7XG4gICAgICAgIHRoaXMubG9hZChwZyk7IFxuICAgIH1cbn1cblxuZnVuY3Rpb24gcXVlcnlfbGlzdChkYXRhKSB7XG4gICAgcmV0dXJuIGh0dHAuZ2V0KHtcbiAgICAgICAgdXJsIDogXCIvYXBpL2dldFByb2R1Y3RMaXN0Lmh0bVwiLFxuICAgICAgICBkYXRhIDogJC5leHRlbmQoe1xuICAgICAgICAgICAgcG4gOiBkYXRhLnBuLFxuICAgICAgICAgICAgcHMgOiBMaW1pdFxuICAgICAgICB9LGRhdGEgfHwge30pXG4gICAgfSk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQcmRfTGlzdDtcblxuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgdGVtcGxhdGUgPSBqdWljZXIudGVtcGxhdGUsIHRlbXBsYXRlcyA9IGp1aWNlci50ZW1wbGF0ZXMgPSBqdWljZXIudGVtcGxhdGVzIHx8IHt9O1xudmFyIHRwbCA9IHRlbXBsYXRlc1sncHJkX2l0ZW0udG1wbCddID0gZnVuY3Rpb24oXywgX21ldGhvZCkge19tZXRob2QgPSBqdWljZXIub3B0aW9ucy5fbWV0aG9kO1xuJ3VzZSBzdHJpY3QnO3ZhciBfPV98fHt9O3ZhciBfb3V0PScnO19vdXQrPScnOyB0cnkgeyBfb3V0Kz0nJzsgdmFyIGluZF90eHQ9Xy5pbmRfdHh0O3ZhciBuYW1lPV8ubmFtZTt2YXIgY3JlYXRlX3RpbWU9Xy5jcmVhdGVfdGltZTt2YXIgb3BlcmF0b3I9Xy5vcGVyYXRvcjt2YXIgcHJkX2lkPV8ucHJkX2lkO3ZhciBzdGF0dXM9Xy5zdGF0dXM7dmFyIHRyPV8udHI7dmFyIHRkPV8udGQ7dmFyIGE9Xy5hO3ZhciBtPV8ubTt2YXIgcHJkPV8ucHJkO3ZhciBpZD1fLmlkO3ZhciBwZW5jaWw9Xy5wZW5jaWw7IF9vdXQrPScgPHRyPiAgICAgPHRkPiAgICAgICAgICc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihpbmRfdHh0KSkgO19vdXQrPScgICAgIDwvdGQ+ICAgICA8dGQ+ICAgICAgICAgJztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKG5hbWUpKSA7X291dCs9JyAgICAgPC90ZD4gICAgICAgICA8dGQ+ICAgICAgICAgJztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKGNyZWF0ZV90aW1lKSkgO19vdXQrPScgICAgIDwvdGQ+ICAgICA8dGQ+ICAgICAgICAgJztfb3V0Kz0gX21ldGhvZC5fX2VzY2FwZWh0bWwuZXNjYXBpbmcoX21ldGhvZC5fX2VzY2FwZWh0bWwuZGV0ZWN0aW9uKG9wZXJhdG9yKSkgO19vdXQrPScgICAgIDwvdGQ+ICAgICA8dGQ+ICAgICAgICAgJzsgaWYoc3RhdHVzID09IDAgKSB7IF9vdXQrPScgICAgICAgICAgICAg5pyq5a6h5qC4ICAgICAgICAgJzsgfSBlbHNlIGlmKHN0YXR1cyA9PSAxICkgeyBfb3V0Kz0nICAgICAgICAgICAgIOWuoeaguOmAmui/hyAgICAgICAgICc7IH0gZWxzZSBpZihzdGF0dXMgPT0gMykgeyBfb3V0Kz0nICAgICAgICAgICAgIOWuoeaguOacqumAmui/hyAgICAgICAgICc7IH0gX291dCs9JyAgICAgPC90ZD4gICAgIDx0ZD4gICAgICAgICA8YSBocmVmPVwiL20vcHJkP2lkPSc7X291dCs9IF9tZXRob2QuX19lc2NhcGVodG1sLmVzY2FwaW5nKF9tZXRob2QuX19lc2NhcGVodG1sLmRldGVjdGlvbihwcmRfaWQpKSA7X291dCs9J1wiIGNsYXNzPSBcImdseXBoaWNvbiBnbHlwaGljb24tcGVuY2lsXCI+PC9hPiAgICAgPC90ZD4gPC90cj4gICc7IH0gY2F0Y2goZSkge19tZXRob2QuX190aHJvdyhcIkp1aWNlciBSZW5kZXIgRXhjZXB0aW9uOiBcIitlLm1lc3NhZ2UpO30gX291dCs9Jyc7cmV0dXJuIF9vdXQ7XG59O1xufSkoKTtcbm1vZHVsZS5leHBvcnRzID0ganVpY2VyLnRlbXBsYXRlc1sncHJkX2l0ZW0udG1wbCddOyJdfQ==
