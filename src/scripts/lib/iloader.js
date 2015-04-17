var QF = {};
(function(Q) {
	//动态加载资源
	//var Q = {};
	var _loaded = {}; // 已经加载的静态文件
	var _loading = {}; // 正在加载中的静态文件
	var _callbacks = []; // 静态文件加载的回调列表
	var _links = []; // 加载中的css列表
	var _timer; // 轮询css加载状态的定时器
	var slice = [].slice;

	var mix = function(obj, cp_obj) {
		for (var key in cp_obj) {
			if (cp_obj.hasOwnProperty(key)) {
				obj[key] = cp_obj[key];
			}
		}
	}
	var isArray = function(o) {
		return Object.prototype.toString.call(o) === "[object Array]";
	}
	var proxy = function(func, context) {
		var extArgs = slice.call(arguments, 2);
		return function() {
			var args = slice.call(arguments, 0);
			args = extArgs.concat(args);
			return func.apply(context, args);
		}
	};

	var isEmpty = function(o) {
		if (isArray[o]) {
			return ! o.length;
		}
		var empty = true;
		for (var i in o) {
			if (o.hasOwnProperty(i)) {
				empty = false;
				break;
			}
		}
		return empty;
	}
	var canonicalURI = function(src) {
		if (/^\/\/\/?/.test(src)) {
			src = location.protocol + src;
		}
		return src;
	};

	//只检测一次
	var _initResourceMap = function() {
		var allTags = document.getElementsByTagName('link'),
		len = allTags.length,
		tag;
		while (len) {
			tag = allTags[--len];
			if ((tag.rel == 'stylesheet' || tag.type == 'text/css') && tag.href) {
				_loaded[canonicalURI(tag.href)] = true;
			}
		}

		allTags = document.getElementsByTagName('script');
		len = allTags.length;
		while (len) {
			tag = allTags[--len];
			if ((!tag.type || tag.type == "text/javascript") && tag.src) {
				_loaded[canonicalURI(tag.src)] = true;
			}
		}

		_initResourceMap = function() {};
	};

	var _complete = function(uri) {
		var list = _callbacks,
		item, i;

		delete _loading[uri];
		_loaded[uri] = true;

		for (i = 0; i < list.length; i++) {
			item = list[i];
			delete item.resources[uri];
			if (isEmpty(item.resources)) {
				item.callback && item.callback();
				list.splice(i--, 1);
			}
		}
	};

	var _poll = function() {
		var sheets = document.styleSheets,
		i = sheets.length,
		links = _links;

		while (i--) {
			var link = sheets[i],
			owner = link.ownerNode || link.owningElement,
			j = links.length;
			if (owner) {
				while (j--) {
					if (owner == links[j]) {
						_complete(links[j]['data-href']);
						links.splice(j, 1);
					}
				}
			}
		}

		if (!links.length) {
			clearInterval(_timer);
			_timer = null;
		}
	};

	var _injectJS = function(uri) {
		var script = document.createElement('script');
		var callback = function() {
			script.onload = script.onerror = script.onreadystatechange = null;
			_complete(uri);
		};

		mix(script, {
			type: 'text/javascript',
			src: uri
		},
		true);
		script.onload = script.onerror = callback;
		script.onreadystatechange = function() {
			var state = this.readyState;
			if (state == 'complete' || state == 'loaded') {
				callback();
			}
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	};

	var _injectCSS = function(uri) {
		var link = document.createElement('link');
		mix(link, {
			type: 'text/css',
			rel: 'stylesheet',
			href: uri,
			'data-href': uri
		},
		true);
		document.getElementsByTagName('head')[0].appendChild(link);

		if (link.attachEvent) {
			var callback = function() {
				_complete(uri);
			};
			link.onload = callback;
		} else {
			_links.push(link);
			if (!_timer) {
				_timer = setInterval(_poll, 20);
			}
		}
	};

	var _load = function(list, callback) {
		var resources = {},
		uri, path, type, ret;

		_initResourceMap();

		list = isArray(list) ? list: [list];
		for (var i = 0, j = list.length; i < j; i++) {
			uri = canonicalURI(list[i]);
			resources[uri] = true;

			if (_loaded[uri]) {
				setTimeout(proxy(_complete, null, uri), 0);
			} else if (!_loading[uri]) {
				_loading[uri] = true;
				//if (uri.indexOf('.css') > -1) {
				if (uri.match(/[\?\.]css$/)) {
					_injectCSS(uri);
				} else {
					_injectJS(uri);
				}
			}
		}

		if (callback) {
			_callbacks.push({
				resources: resources,
				callback: callback
			});
		}
	};

	/**
            * 加载JS文件
            * @param {mixed} src JS文件绝对地址
            * @param {function} callback js加载完成后回调函数
            */
	Q.loadJS = function(src, callback) {
		_load(src, callback);
	};
	/**
            * 加载CSS文件
            * @param {mixed} uri css文件绝对地址
            * @param {function} callback todo: 文件加载完成后回调函数
            */
	Q.loadCSS = function(uri, callback) {
		_load(uri, callback);
	};
	Q.loadListJs = Q.loadSource = function(list, callback) {
		_load(list, callback);
	};
})(QF);


module.exports = QF;

