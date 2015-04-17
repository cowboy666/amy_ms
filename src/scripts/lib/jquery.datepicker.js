/**
	Event:
		q-datepicker-show
		q-datepicker-hide
		q-datepicker-dispose
		q-datepicker-change
		q-datepicker-select
    	q-datepicker-error
*/
(function($) {
    $.qdatepicker = {};
    var ROOT_KEY = $.qdatepicker.ROOT_KEY = 'q-datepicker';
    var calcTime;
    var gInd = 0;
    var HolidayData = {
        "2013-01-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "元旦",
            "holidayClass": "yuandan"
        },
        "2013-02-09": {
            "afterTime": 0,
            "beforeTime": 0,
            "dayindex": 0,
            "holidayName": "除夕",
            "holidayClass": "chuxi"
        },
        "2013-02-10": {
            "afterTime": 0,
            "beforeTime": 0,
            "dayindex": 0,
            "holidayName": "春节",
            "holidayClass": "chunjie"
        },
        "2013-02-11": {
            "afterTime": 0,
            "beforeTime": 0,
            "dayindex": 0,
            "holidayName": "正月初二",
            "holidayClass": "chunjie"
        },
        "2013-02-12": {
            "afterTime": 0,
            "beforeTime": 0,
            "dayindex": 0,
            "holidayName": "正月初三",
            "holidayClass": "chunjie"
        },
        "2013-02-24": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "元宵",
            "holidayClass": "yuanxiao"
        },
        "2013-04-04": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "清明",
            "holidayClass": "qingming"
        },
        "2013-05-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "五一",
            "holidayClass": "laodong"
        },
        "2013-06-12": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "端午",
            "holidayClass": "duanwu"
        },
        "2013-09-10": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "教师"
        },
        "2013-09-19": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "中秋",
            "holidayClass": "zhongqiu"
        },
        "2013-10-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "国庆",
            "holidayClass": "guoqing"
        },
        "2013-12-25": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "圣诞",
            "holidayClass": "shengdan"
        },
        "2014-01-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "元旦",
            "holidayClass": "yuandan"
        },
        "2014-01-30": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "除夕",
            "holidayClass": "chuxi"
        },
        "2014-01-31": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "春节",
            "holidayClass": "chunjie"
        },
        "2014-02-14": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "元宵",
            "holidayClass": "yuanxiao"
        },
        "2014-04-05": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "清明",
            "holidayClass": "qingming"
        },
        "2014-05-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "五一",
            "holidayClass": "laodong"
        },
        "2014-06-02": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "端午",
            "holidayClass": "duanwu"
        },
        "2014-09-08": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "中秋",
            "holidayClass": "zhongqiu"
        },
        "2014-10-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "国庆",
            "holidayClass": "guoqing"
        },
        "2014-12-25": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "圣诞",
            "holidayClass": "shengdan"
        },
        "2015-01-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "元旦",
            "holidayClass": "yuandan"
        },
        "2015-02-18": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "除夕",
            "holidayClass": "chuxi"
        },
        "2015-02-19": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "春节",
            "holidayClass": "chunjie"
        },
        "2015-03-05": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "元宵",
            "holidayClass": "yuanxiao"
        },
        "2015-04-05": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "清明",
            "holidayClass": "qingming"
        },
        "2015-05-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "五一",
            "holidayClass": "laodong"
        },
        "2015-06-20": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "端午",
            "holidayClass": "duanwu"
        },
        "2015-09-27": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "中秋",
            "holidayClass": "zhongqiu"
        },
        "2015-10-01": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "国庆",
            "holidayClass": "guoqing"
        },
        "2015-12-25": {
            "afterTime": 3,
            "beforeTime": 3,
            "dayindex": 0,
            "holidayName": "圣诞",
            "holidayClass": "shengdan"
        }
    };
    var TransDateEx = {
        week: "周",
        day: "天",
        before: "前",
        after: "后"
    };
    var defArgs = {
        LANG: {
            prev: '',
            next: '',
            day_names: ['日', '一', '二', '三', '四', '五', '六'],
            OUT_OF_RANGE: '超出范围',
            ERR_FORMAT: '格式错误'
        },
        CLASS: {
            group: 'g',
            header: 'h',
            calendar: 'c',
            next: 'n',
            prev: 'p',
            title: 't',
            week: 'w',
            month: 'cm_',
            day_default: 'st',
            day_selected: 'st-a',
            day_othermonth: 'st-s',
            day_today: 'st-t',
            day_hover: 'st-h',
            day_disabled: 'st-d',
            day_round: 'st-a-r',
            day_holiday: 'st-holi-',
            day_area_bg: 'st-area'
        },
        WEEKDAYS: 7,
        STARTDAY: 1,
        showOtherMonths: false,
        defaultDay: '',
        disabledDays: '',
        customClass: '',
        customActiveClass: '',
        multi: 2,
        showTip: true,
        linkTo: null,
        // defaultspan , mindate , maxdate 
        linkRules: '',
        refObj: null, //add for round select @kangjia
        forceCorrect: true,
        formatTitle: function(date) {
            return date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
        },
        showOnInit: false,
        showOnFocus: false,
        container: null,
        minDate: null,
        maxDate: null,
        ui: null,
        sDay: null,
        endDay: null,
        pos: "",
        parseDate: function(str) {
            var x = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
            return x ? new Date(x[1], x[2] * 1 - 1, x[3]) : null;
        },
        formatDate: function(date) {
            return date.getFullYear() + "-" + _formatNum(date.getMonth() + 1, 2) + "-" + _formatNum(date.getDate(), 2);
        },
        minuteDate: function(date) {
            //结束时间与今天的相差天数
            var today = window.SERVER_TIME || new Date();
            today = new Date(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
            return (date - today) / (24 * 60 * 60 * 1000);
        }
    };
    var implement = function() {
        var self = this;
        for (var i = 0, len = arguments.length; i < len; i++)
            $.each(arguments[i], function(k, v) {
                var old;
                if (self.prototype[k] && jQuery.isFunction(self.prototype[k]))
                    old = self.prototype[k];
                self.prototype[k] = v;
                if (old)
                    self.prototype[k]['_PARENT_'] = old;
            });
        if (!self.prototype['parent'])
            self.prototype['parent'] = function() {
                return arguments.callee.caller['_PARENT_'].apply(this, arguments);
            };
    };

    function _formatNum(n, length) {
        n = n == null ? "" : n + "";
        for (var i = 0, len = length - n.length; i < len; i++)
            n = "0" + n;
        return n;
    }
    var holidayDate = parseSpeciaDate(HolidayData);

    function parseStrToDate(dateStr) {
        var datas = dateStr.split("-");
        return new Date(datas[0], datas[1] - 1, datas[2]);
    }
    // validate the input value
    function parseSpeciaDate(HolidayData) {
        var speciaDateTable = {};
        for (var key in HolidayData) {
            var _speciaDay = key;
            var _speciaDayEx = HolidayData[key];
            speciaDateTable[key] = _speciaDayEx;
            var _sDay = "";
            var _sName = "";
            if (_speciaDayEx.beforeTime > 0) {
                for (var i = 1; i <= _speciaDayEx.beforeTime; i++) {
                    var _dex = {};
                    var _beforDay = new Date(parseStrToDate(_speciaDay).getTime() - i * 24 * 3600 * 1000);
                    var _beforDayStr = format(_beforDay);
                    _dex.holidayName = _speciaDayEx.holidayName + TransDateEx.before + i + TransDateEx.day;
                    _dex.dayindex = _speciaDayEx.dayindex;
                    if (!speciaDateTable[_beforDayStr]) {
                        speciaDateTable[_beforDayStr] = _dex;
                    } else {
                        if ((_speciaDayEx.dayindex > speciaDateTable[_beforDayStr].dayindex) && speciaDateTable[_beforDayStr].beforeTime == null) {
                            speciaDateTable[_beforDayStr] = _dex;
                        }
                    }
                }
            }
            if (_speciaDayEx.afterTime > 0) {
                for (var i = 1; i <= _speciaDayEx.afterTime; i++) {
                    var _dex = {};
                    var _afterDay = new Date(parseStrToDate(_speciaDay).getTime() + i * 24 * 3600 * 1000);
                    var _afterDayStr = format(_afterDay);
                    _dex.holidayName = _speciaDayEx.holidayName + TransDateEx.after + i + TransDateEx.day;
                    _dex.dayindex = _speciaDayEx.dayindex;
                    if (!speciaDateTable[_afterDayStr]) {
                        speciaDateTable[_afterDayStr] = _dex;
                    } else {
                        if ((_speciaDayEx.dayindex > speciaDateTable[_afterDayStr].dayindex) && speciaDateTable[format(new Date(_beforDay))].afterTime == null) {
                            speciaDateTable[_afterDayStr] = _dex;
                        }
                    }
                }
            }
        }
        return speciaDateTable;
    }

    function format(date) {
        if (typeof date == "number") {
            date = new Date(date);
        }
        return date.getFullYear() + "-" + convert2digit(date.getMonth() + 1) + "-" + convert2digit(date.getDate());
    }

    function convert2digit(str) {
        return str < 10 ? "0" + str : str;
    }

    function _clearDate(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    function _calcPos(el) {
        var of = el.offset();
        of['top'] += el.outerHeight();
        return of;
    }

    function _getQDP(obj) {
        var root;
        if (obj && !obj.nodeType)
            root = jQuery.event.fix(obj || window.event).target;
        else
            root = obj;

        if (!root)
            return null;

        var p = $(root).parents('.' + ROOT_KEY);
        return p.size() > 0 ? p.eq(0).data(ROOT_KEY) : null;
    }

    function DefaultQDatePickerUI() {};
    DefaultQDatePickerUI.implement = implement;
    $.extend(DefaultQDatePickerUI.prototype, {
        isUI: 1,
        init: function() {
            var self = this,
                picker = this.picker,
                ns = picker.ns;
            self.attachedEl = self.attachedEl || new $;
            $(document).bind('mousedown.' + ns, function(evt) {
                var a;
                if ((picker.activeEl[0] === evt.target && (a = 1)) || (self.attachedEl.index(evt.target) != -1 && (a = 2))) {
                    if (!picker.visible()) {
                        picker.show(self.getDate());
                    } else {
                        picker.hide();
                    }
                    if (a == 2)
                        picker.activeEl.focus();
                    return;
                }
                var qdp;
                if ((qdp = _getQDP(evt)) && qdp.key === picker.key)
                    return;
                else
                    picker.hide();
            });
            var resetPosition = function() {
                if (!picker.get('container'))
                    picker.getContainer().css(_calcPos(picker.activeEl));
            }
            resetPosition();
            $(window).bind('load.' + ns + ' resize.' + ns, resetPosition);

            picker.activeEl.bind('focus.' + ns, function(evt) {
                if (picker.get('showOnFocus'))
                    picker.show(self.getDate());
            });

            picker.activeEl.bind('keydown.' + ns, function(evt) {
                switch (evt.keyCode) {
                    case 40:
                        self.setDate(new Date(self.getDate().getTime() + 24 * 60 * 60 * 1000));
                        var rlt = self.validate();
                        if (!rlt.success) {
                            return;
                        }
                        picker.show(self.getDate());
                        break;
                    case 38:
                        self.setDate(new Date(self.getDate().getTime() - 24 * 60 * 60 * 1000));
                        var rlt = self.validate();
                        if (!rlt.success) {
                            return;
                        }
                        picker.show(self.getDate());
                        break;
                    case 9:
                    case 27:
                        picker.hide();
                        break;
                    default:
                        self.onKeyDown(evt);
                }
            });
        },
        _init: function(picker) {
            this.picker = picker;
        },
        select: function(date) {
            this.picker.activeEl.val(this.picker.args.formatDate(date));
        },
        change: function(sdate, tdate, desc) {
            this.draw(tdate);
        },
        posHandler: function(date, args) {
            //日历框左右定位
            var pos = this.picker.activeEl.attr('data-pos'),
                tmptime = date,
                time,
                month = args.parseDate(this.picker.activeEl.val()).getMonth();
            if (pos === 'right') {
                // 固定在右处理
                if ((this.picker.activeEl.attr("data-prefix") === '返' || this.picker.activeEl.attr("data-prefix") === '离店') && date.getMonth() == month) {
                    tmptime = tmptime.getTime() - tmptime.getDate() * 24 * 3600 * 1000;
                }
            }
            if (pos === 'left' && (this.picker.activeEl.attr("data-prefix") === '返' || this.picker.activeEl.attr("data-prefix") === '离店') && date.getMonth() != args.minDate.getMonth()) {
                tmptime = tmptime.getTime() - tmptime.getDate() * 24 * 3600 * 1000;
            }
            time = new Date(tmptime);
            time.setDate(1);
            return time;
        },
        draw: function(date, args) {
            //绘制日历框
            this.drawDate = date;
            _clearDate(date);
            var picker = this.picker,
                args = $.extend({}, picker.args, args || {}),
                multi = args.multi,
                CLASS = args['CLASS'];
            args.activeDate = args.activeDate || args.parseDate(picker.activeEl.val());
            var x = [],
                time;
            args['count'] = multi;
            time = this.posHandler(date, args);
            x.push('<div class="' + CLASS['group'] + ' ' + CLASS['group'] + multi + '">');
            for (var i = 0; i < multi; i++) {
                x.push('<div class="' + CLASS['calendar'] + '" data-index="' + i + '">');
                args['index'] = i;
                x.push(this._drawTitle(time, args));
                x.push(this._drawBody(time, args));
                x.push('<div class="' + CLASS['month'], time.getMonth() + 1, '">' + (time.getMonth() + 1) + '</div>');
                x.push('</div>');
                time.setMonth(time.getMonth() + 1);
            }
            x.push('</div>');
            $(x.join('')).appendTo(picker.getContainer().empty());
            this.picker.selectUi();
        },
        dispose: function() {
            var ns = '.' + this.picker.ns;
            $(document).unbind(ns);
            $(window).unbind(ns);
        },
        getDate: function() {
            var date = this.picker.get('parseDate')(this.picker.activeEl.val());
            return date != date ? null : date;
        },
        setDate: function(date) {
            this.picker.activeEl.val(this.picker.get('formatDate')(date));
        },
        onBeforeDraw: function(date) {
            var _compareMonth = function(d1, d2) {
                if (d1.getFullYear() > d2.getFullYear())
                    return 1;
                else
                if (d1.getFullYear() === d2.getFullYear())
                    return (d1.getMonth() - d2.getMonth()) / (Math.abs(d1.getMonth() - d2.getMonth()) || 1);
                else
                    return -1;
            }
            if (this.selectedDate && this.drawDate)
                date.setTime(this.drawDate.getTime());
            else {
                var picker = this.picker,
                    minDate = picker.get('minDate'),
                    maxDate = picker.get('maxDate'),
                    multi = picker.get('multi');
                var nD = new Date(date.getFullYear(), date.getMonth() + multi - 1, 1);
                if (maxDate && _compareMonth(nD, maxDate) > 0)
                    for (var i = 1; maxDate && multi && multi > 1 && multi - i > 0; i++) {
                        nD = new Date(date.getFullYear(), date.getMonth() + multi - i - 1, 1);
                        if (_compareMonth(nD, maxDate) <= 0) {
                            nD.setMonth(nD.getMonth() - multi + 1);
                            break;
                        }
                    } else
                        nD = null;

                if (nD && (!minDate || nD.getTime() >= minDate.getTime()))
                    date.setTime(nD.getTime());
            }
        },
        onKeyDown: function(date) {},
        onSet: function() {
            this.selectedDate = null;
        },
        _drawTitle: function(date, args) {
            //日历的标题
            var LANG = args['LANG'],
                CLASS = args['CLASS'];
            var x = [];
            var minDate = args.minDate,
                maxDate = args.maxDate;
            var right = args['index'] === 0;
            var left = args['count'] === args['index'] + 1;
            x.push('<div class="' + CLASS['header'] + '">');
            x.push('<span href="#" class="' + CLASS['next'] + '"', (!maxDate || maxDate.getFullYear() > date.getFullYear() || (maxDate.getFullYear() === date.getFullYear() && maxDate.getMonth() > date.getMonth())) && left ? '' : ' style="display:none;"', ' onclick="QDP.change( event , \'+1M\' );return false;">', LANG['next'], '</span>');

            x.push('<span href="#" class="' + CLASS['prev'] + '"', (!minDate || minDate.getFullYear() < date.getFullYear() || (minDate.getFullYear() === date.getFullYear() && minDate.getMonth() < date.getMonth())) && right ? '' : ' style="display:none;"', ' onclick="QDP.change( event , \'-1M\' );return false;">', LANG['prev'], '</span>');

            x.push('<div class="' + CLASS['title'] + '">', args.formatTitle(date), '</div>');
            x.push('</div>');
            return x.join('');
        },
        _drawBody: function(date, args) {
            //创建日历table
            var STARTDAY = args['STARTDAY'],
                WEEKDAYS = args['WEEKDAYS'];
            var LANG = args['LANG'],
                CLASS = args['CLASS'];

            var activeDate = args.activeDate;
            var minDate = args.minDate,
                maxDate = args.maxDate;
            if (activeDate && activeDate != activeDate)
                activeDate = null;

            var now = window.SERVER_TIME || new Date();
            var x = ['<table>', '<thead>', '<tr>'];
            for (var i = 0; i < WEEKDAYS; i++) {
                var k = (STARTDAY + i) % WEEKDAYS;
                x.push('<th class="' + CLASS['week'] + k + '">', LANG['day_names'][k] || '', '</th>');
            }
            x.push('</tr>', '</thead>');
            x.push('<tbody>');

            // draw tbody
            var xx = [];
            var year = date.getFullYear(),
                month = date.getMonth() + 1;
            var start = new Date(year, month - 1, 1);
            var ds = 1,
                de = new Date(year, month, 0).getDate();
            var _h = start.getDay() - STARTDAY;
            while (_h < 0) _h += WEEKDAYS;
            var rds = ds - _h;
            var rde = (WEEKDAYS - (((1 - rds + de) % WEEKDAYS) || WEEKDAYS)) + de;
            for (var i = rds, j = 0; i <= rde; i++, j++) {
                var time = new Date(year, month - 1, i);
                if (j % WEEKDAYS == 0)
                    xx.push('</tr>', '<tr>');
                var k = (STARTDAY + j) % WEEKDAYS;
                xx.push('<td class="' + CLASS['week'] + k + ' ' + CLASS['day_default']);

                var disabled = false;
                if ($.grep(['getFullYear', 'getMonth', 'getDate'], function(k) {
                    return time[k]() == now[k]()
                }).length == 3)
                    xx.push(' ' + CLASS['day_today']);
                if (activeDate != null && activeDate.getTime() == time.getTime()) //delete [else] for today @kangjia
                    xx.push(' ' + CLASS['day_selected']);

                var isOtherMonth = false;
                if (i < 1 || i > de) {
                    xx.push(' ' + CLASS['day_othermonth']);
                    isOtherMonth = true;
                }
                if (minDate && time.getTime() < minDate.getTime() || maxDate && time.getTime() > maxDate.getTime() || ~args.disabledDays.toString().indexOf(args.formatDate(time))) {
                    if (!isOtherMonth) { //for otherMonther style @kangjia
                        xx.push(' ' + CLASS['day_disabled']);
                    }
                    disabled = true;
                }
                var appendClass = this._getDateClass(time);
                if (appendClass && !isOtherMonth)
                    xx.push(' ' + appendClass);

                xx.push('"');
                if (!disabled) {
                    //xx.push(' onmouseover="jQuery(this).addClass(\'' , CLASS['day_hover'] , '\');" onmouseout="jQuery(this).removeClass(\' ' , CLASS['day_hover'] , ' \');"');
                    xx.push(' onclick="QDP.select(event,new Date(' + time.getFullYear() + ',' + time.getMonth() + ',' + time.getDate() + '));', 'return false;"');
                }
                if (!disabled && !isOtherMonth) {
                    xx.push(' data-sort=' + args.minuteDate(time) + '>');
                } else {
                    xx.push('data-info = "disable">');
                }
                if (!isOtherMonth || args.showOtherMonths) {
                    xx.push('<span class="');
                    var holiday = HolidayData[args.formatDate(time)];
                    dateText = time.getDate();
                    if (!disabled && holiday && holiday.holidayClass) {
                        xx.push(' ' + CLASS['day_holiday'] + "default");
                        xx.push(' ' + CLASS['day_holiday'] + holiday.holidayClass);
                        dateText = holiday.holidayName;
                    }
                    xx.push('">');
                    var today = window.SERVER_TIME || new Date();
                    if (dateText === today.getDate() && args.minuteDate(time) === 0) {
                        dateText = "今天";
                    }
                    xx.push(dateText);
                    xx.push('</span>');
                } else {
                    xx.push('&nbsp;');
                }

                xx.push('</td>');
            }
            x.push(xx.length > 0 ? xx.slice(1, -1).join('') : '');
            x.push('</tbody>', '</table>');
            return x.join('');
        },
        _getDateClass: function(date) {
            //设置默认的时间区域样式
            var getDate = this.picker.args.formatDate(date);
            var backInfo = '';
            var curDate = parseInt(this.picker.activeEl.val().replace(/-/g, ""));
            var showDate = parseInt(getDate.replace(/-/g, ""));
            //'single'标识单个日历框，机票多程搜索
            if (this.picker.get('linkTo') && !this.picker.get('single')) {
                this.picker.args.sDay = this.picker.activeEl.val();
                if (linkedQDP = this.picker.get('linkTo').data($.qdatepicker.ROOT_KEY)) {
                    if (typeof(linkedQDP.activeEl.val()) != 'undefined' && getDate == linkedQDP.activeEl.val()) {
                        backInfo = this.addRoundClass('BACK');
                        this.picker.args.endDay = linkedQDP.activeEl.val();
                    }
                }
                if (showDate < parseInt(linkedQDP.activeEl.val().replace(/-/g, "")) && showDate > curDate) {
                    backInfo = this.addRoundClass('AREAR');
                }
            } else if (this.picker.get('refObj')) {
                if (typeof(this.picker.activeEl.val()) != 'undefined' && getDate == this.picker.activeEl.val()) {
                    backInfo = this.addRoundClass('BACK');
                    this.picker.args.endDay = this.picker.activeEl.val();
                }
                if (refQDP = this.picker.get('refObj').data($.qdatepicker.ROOT_KEY)) {
                    if (typeof(refQDP.activeEl.val()) != 'undefined' && getDate == refQDP.activeEl.val()) {
                        backInfo = this.addRoundClass('FROM');
                        this.picker.args.sDay = refQDP.activeEl.val();
                    }
                }
                if (showDate > parseInt(refQDP.activeEl.val().replace(/-/g, "")) && showDate < curDate) {

                    backInfo = this.addRoundClass('AREAR');
                }
            }
            if (HolidayData[getDate])
                backInfo += ' ' + 'holi';

            return $.trim(backInfo);
        }
    });

    function QDatePicker(el, args) {
        if (!this.init)
            return new QDatePicker(el, args);
        else
            return this.init(el, args);
    }

    window.QDP = {};
    $.each(['select', 'change', '_trigger'], function(ind, v) {
        window.QDP[v] = function() {
            if (!arguments[0])
                return;
            var oQDP = _getQDP(arguments[0]);
            if (oQDP && oQDP[v]) {
                if (v === "select") {
                    return oQDP[v].apply(oQDP, Array.prototype.slice.call(arguments));
                } else {
                    return oQDP[v].apply(oQDP, Array.prototype.slice.call(arguments, 1));
                }
            }
        };
    });

    $.extend(QDatePicker.prototype, {
        init: function(aEl, args) {
            args = args || {};
            if (args['ui']) {
                if (args['ui']['isUI'])
                    this.ui = args['ui'];
                else if (typeof args['ui'] == 'string' && $.qdatepicker.uis[args['ui']])
                    this.ui = new $.qdatepicker.uis[args['ui']];
            }
            if (!this.ui)
                this.ui = new DefaultQDatePickerUI();
            this.ui._init(this);

            args = this.args = $.extend(true, {}, defArgs, args || {});
            this.key = ++gInd;
            var ns = this.ns = ROOT_KEY + this.key;
            var activeEl = this.activeEl = $(aEl);
            this.el = $('<div class="' + ROOT_KEY + (args.customClass ? ' ' + args.customClass : '') + '"></div>').appendTo(this.args['container'] || document.body).hide();
            $(this.el).data(ROOT_KEY, this);

            this.ui.init();
            this.lastShowedDate = null;
            this.showedDate = null;
            if (args['showOnInit'])
                this.show();

            $.each(args['on'] || {}, function(k, v) {
                activeEl.bind(k + '.' + ns, v);
            });
            return this;
        },
        _trigger: function() {
            this.activeEl.triggerHandler.apply(this.activeEl, arguments);
        },
        select: function() {
            //根据index定位左右
            if (arguments.length > 1) {
                var e = arguments[0] || window.event;
                date = arguments[1];
            } else {
                var e = e || window.event;
                date = arguments[0];
            }
            if (e) {
                var _this = e.srcElement ? e.srcElement : e.target;
                if ($(_this).parents("." + this.args.CLASS["calendar"]).data("index") === 1) {
                    this.activeEl.attr("data-pos", "right");
                }
                if ($(_this).parents("." + this.args.CLASS["calendar"]).data("index") === 0) {
                    this.activeEl.attr("data-pos", "left");
                }
            }
            this.ui.select(date);
            this.hide();
            this._trigger('q-datepicker-select', [date]);
        },
        _selectTd: function(from, to, ele) {
            //选择色块区域
            for (var k = parseInt(from); k < parseInt(to); k++) {
                $("td[data-sort='" + k + "']:not('.st-d')").addClass(defArgs.CLASS['day_area_bg']);
            }
        },
        selectUi: function() {
            //日历框色块选择
            var that = this,
                currEle, sEle, eEle, tEle, args, $oneWayP;
            var activeEl = that.args.minuteDate(new Date(that.activeEl.val().replace(/-/g, "/")));
            var activeElId = that.activeEl[0]['id'];
            args = this.args;
            if (args.sDay)
                sEle = args.minuteDate(new Date(args.sDay.replace(/-/g, "/")));
            if (args.endDay)
                eEle = args.minuteDate(new Date(args.endDay.replace(/-/g, "/")));
            $('.q-datepicker td:not(".st_d")').bind('mouseover', function(item) {
                if ($(this).data("info") === "disable") {
                    return;
                }
                $(this).addClass(args.CLASS['day_hover']);
                $oneWayP = $(this).parents(".ch_sch_form");
                if ($oneWayP.find("[data-type = 'oneWay']").length < 1) {
                    currEle = parseInt($(this).attr("data-sort"));
                    if (sEle === eEle && activeEl === sEle && that.activeEl.attr("data-prefix") === "往" && currEle > eEle) {
                        return;
                    }
                    if (currEle < eEle + 1 && activeEl === sEle) {
                        $(".q-datepicker td").removeClass(args.CLASS['day_area_bg']);
                        $(".q-datepicker td[data-sort='" + sEle + "']").removeClass(args.CLASS['day_selected']);
                        if (currEle === eEle) {
                            that._selectTd(currEle, eEle);
                        } else {
                            that._selectTd(currEle + 1, eEle);
                        }
                    }
                    if (currEle > eEle && activeEl === sEle) {
                        $(".q-datepicker td").removeClass(args.CLASS['day_area_bg']);
                        $(".q-datepicker td[data-sort='" + eEle + "']").removeClass(args.CLASS['day_selected'] + ' ' + defArgs.CLASS['day_round']);
                    }
                    if (currEle > sEle - 1 && activeEl === eEle) {
                        $(".q-datepicker td").removeClass(args.CLASS['day_area_bg']);
                        $(".q-datepicker td[data-sort='" + eEle + "']").removeClass(args.CLASS['day_selected'] + ' ' + defArgs.CLASS['day_round']);
                        if (currEle === sEle) {
                            that._selectTd(sEle, currEle);
                        } else {
                            that._selectTd(sEle + 1, currEle);
                        }
                    }
                    if (sEle === eEle && activeEl === sEle && that.activeEl.attr("data-prefix") === "返") {
                        $(".q-datepicker td[data-sort='" + eEle + "']").addClass(args.CLASS['day_selected'] + ' ' + defArgs.CLASS['day_round']);
                    }
                }
            }).mouseout(function() {
                if ($(this).data("info") === "disable") {
                    return;
                }
                $(this).removeClass(args.CLASS['day_hover']);
                if ($oneWayP.find("[data-type = 'oneWay']").length < 1) {
                    $(".q-datepicker td").removeClass(args.CLASS['day_area_bg']);
                    $(".q-datepicker td[data-sort='" + sEle + "']").addClass(args.CLASS['day_selected']);
                    $(".q-datepicker td[data-sort='" + eEle + "']").addClass(args.CLASS['day_round']);
                    that._selectTd(sEle + 1, eEle);
                }
            });
        },
        set: function(key, value, refresh) {
            if (!this.ui.onSet || this.ui.onSet(key, value, refresh) === false)
                return;

            if (typeof key === 'string') {
                var handled = false;
                switch (key) {
                    case 'container':
                        this.el.appendTo(value || document.body);
                        this.el.css({
                            top: '',
                            left: ''
                        });
                        break;
                }
                for (var i = 0, w = key.split('.'), len = w.length, z = this.args; i < len && (i !== len - 1 && (z[w[i]] || (z[w[i]] = {})) || (z[w[i]] = value)); z = z[w[i]], i++) {}
            }
            if (refresh && this.visible()) {
                this._show(this.showedDate);
            }
        },
        get: function(key) {
            for (var i = 0, z = this.args, w = key.split("."), len = w.length; i < len && (z = z[w[i]]); i++) {}
            return z;
        },
        change: function(desc) {
            var tdate = typeof desc === 'string' ? calcTime(desc, this.showedDate) : desc;
            var sdate = this.showedDate;
            this.lastShowedDate = this.showedDate;
            this.showedDate = tdate;
            this.ui.change(sdate, tdate, desc);
            this._trigger('q-datepicker-change', [sdate, tdate, desc]);
        },
        show: function(date) {
            var time, minDate = this.get('minDate'),
                maxDate = this.get('maxDate');
            if (!date)
                time = window.SERVER_TIME || new Date();
            else
                time = date;

            if (minDate && time.getTime() < minDate.getTime())
                time.setTime(minDate.getTime());
            else if (maxDate && time.getTime() > maxDate.getTime())
                time.setTime(maxDate.getTime());
            this.ui.onBeforeDraw(time);
            this._show.call(this, time);
            this._trigger('q-datepicker-show', [date]);
        },
        _show: function(date) {
            this.lastShowedDate = this.showedDate;
            this.showedDate = date;

            if (this.ui.draw(date) !== false);
            this.el.show();
        },
        hide: function() {
            if (this.visible()) {
                this.el.hide();
                this._trigger('q-datepicker-hide');
            }
        },
        dispose: function() {
            this.ui.dispose();
            this.el.remove();
            this.activeEl.unbind('.' + this.ns);
            this._trigger('q-datepicker-dispose');
        },
        visible: function() {
            return this.el.is(":visible");
        },
        getContainer: function() {
            return this.el;
        }
    });
    var _c = {
        '+M': function(time, n) {
            var _d = time.getDate();
            time.setMonth(time.getMonth() + n);
            if (time.getDate() !== _d) time.setDate(0);
        },
        '-M': function(time, n) {
            var _d = time.getDate();
            time.setMonth(time.getMonth() - n);
            if (time.getDate() !== _d) {
                time.setDate(0)
            };
        },
        '+D': function(time, n) {
            time.setDate(time.getDate() + n)
        },
        '-D': function(time, n) {
            time.setDate(time.getDate() - n)
        },
        '+Y': function(time, n) {
            time.setFullYear(time.getFullYear() + n)
        },
        '-Y': function(time, n) {
            time.setFullYear(time.getFullYear() - n)
        }
    };

    $.extend($.qdatepicker, {
        uis: [],
        createUI: function(name, basename) {
            var base = basename && $.qdatepicker.uis[basename] ? $.qdatepicker.uis[basename] : DefaultQDatePickerUI;
            var x = function() {};
            $.extend(x, base);
            $.extend(x.prototype = {}, base.prototype);
            if (name) {
                $.qdatepicker.uis[name] = x;
                x.prototype.name = name;
            }
            return x;
        },
        calcTime: function(desc, date) {
            desc = (desc || "").toString();
            var time;
            if (date)
                time = new Date(date.getTime());
            else {
                time = new Date();
                var d = desc.match(/^\d+/);
                if (d)
                    time.setTime(d[0] * 1);
            }
            var re = /([+-])(\d+)([MDY])/g,
                arr;
            while (arr = re.exec(desc)) {
                var key = arr[1] + arr[3];
                if (_c[key])
                    _c[key](time, arr[2] * 1);
            }
            return time;
        }
    });
    $.qdatepicker.createUI('qunar').implement({
        init: function() {
            this.parent.apply(this, arguments);
            var self = this,
                picker = this.picker;
            var customClass = picker.get("customActiveClass");
            var triggerEl = this.triggerEl = picker.activeEl.wrap('<div class="qunar-dp' + (customClass ? ' ' + customClass : '') + '"></div>').before('<div class="dp-prefix"></div><div class="dp-info"><b/><span class="dp-text"></span></div>').parent();

            var prefix_txt = this.picker.args.prefix || picker.activeEl.data("prefix");
            if (prefix_txt) {
                triggerEl.find(".dp-prefix").text(prefix_txt);
                picker.activeEl.css({
                    'left': triggerEl.find(".dp-prefix").outerWidth(true) + 'px'
                })
            } else {
                triggerEl.find(".dp-prefix").remove();
            }

            //triggerEl.width( picker.activeEl.outerWidth(true) + triggerEl.find(".dp-info").outerWidth(true) + ( triggerEl.find(".dp-prefix").outerWidth(true) || 0 ) );

            picker.set('container', triggerEl[0]);
            this.attachedEl = this.attachedEl.add(triggerEl.find('.dp-info > b , .dp-info')).add(triggerEl.find('.dp-info > b , .dp-info > .dp-text '));
            picker.activeEl.attr('maxlength', 10);
            picker.activeEl.addClass('textbox');
            picker.activeEl.bind('keyup.' + picker.ns, function(evt) {
                self.updateTip(self.validate.call(self));
            }).bind('blur.' + picker.ns, function(evt) {
                self.autoCheck.call(self);
            });

            if (picker.get('defaultDay') != null)
                this.setDate(this.getDefaultDate());
            this.updateTip(this.validate());
            this.selectedDate = null;
            this.checkLinked();
            this.forIframe(picker);
        },
        forIframe: function(picker) {
            $(window).bind('blur.' + picker.ns, function() {
                picker.hide();
            });
        },
        getDefaultDate: function() {
            var picker = this.picker;
            var date = calcTime(picker.get('defaultDay'));
            var minDate = picker.get('minDate'),
                maxDate = picker.get('maxDate');
            if (minDate && minDate.getTime() > date.getTime() || maxDate && maxDate.getTime() < date.getTime())
                date = minDate || maxDate;
            return date;
        },
        // check linked item and correct it
        checkLinked: function(posData) {
            var picker = this.picker,
                linkedQDP;
            if (!picker.get('linkTo') || !(linkedQDP = picker.get('linkTo').data($.qdatepicker.ROOT_KEY)) || linkedQDP.ui.name.indexOf('qunar') !== 0)
                return;
            var linkRules = (picker.get('linkRules') || "").split(",");
            var date = this.getDate();
            if (date == null)
                return;
            if (posData) {
                if (posData.restPos && posData.pos || posData.restPos && !linkedQDP.activeEl.attr("data-pos")) {
                    linkedQDP.activeEl.attr("data-pos", posData.restPos);
                }
            }

            var df = {};
            $.each(['ds', 'mind', 'maxd'], function(ind, v) {
                if (linkRules[ind])
                    df[v] = calcTime(linkRules[ind], date)
            });
            var minDate = linkedQDP.get('strictMinDate'),
                maxDate = linkedQDP.get('strictMaxDate');

            if (df['mind'] || minDate) {
                var _t = (df['mind'] ? df['mind'].getTime() : -1) > (minDate ? minDate.getTime() : -1) ? df['mind'] : minDate;
                linkedQDP.set('minDate', _t, false);
            }
            if (df['maxd'] || maxDate) {
                var _t = (df['maxd'] ? df['maxd'].getTime() : Number.MAX_VALUE) > (maxDate ? maxDate.getTime() : Number.MAX_VALUE) ? maxDate : df['maxd'];
                linkedQDP.set('maxDate', _t, false);
            }
            linkedQDP.set(null, null, true);
            var rlt = linkedQDP.ui.validate();
            if (!rlt['success'] && picker.get('forceCorrect')) {
                linkedQDP.select(df['ds']);
                linkedQDP.ui.drawDate = null;
                rlt = linkedQDP.ui.validate();
            }
            linkedQDP.ui.updateTip(rlt);
            var linkedFlag = 'Y';
            return linkedFlag;
        },
        select: function(date, nocheck) {
            var picker = this.picker;
            this.parent.apply(this, arguments);
            this.selectedDate = date;
            if (!nocheck)
                this.autoCheck();
        },
        // show tip in the trigger box
        showText: function(text) {
            var tip = this.triggerEl.find('.dp-text');
            tip.removeClass('errtext').html(text);
        },
        // show error tip in the trigger box
        showErrText: function(text) {
            var tip = this.triggerEl.find('.dp-text');
            tip.addClass('errtext').html(text);
        },
        // fire it automatically to check its value
        autoCheck: function() {
            var picker = this.picker;
            var rlt = this.validate();
            var restPos = picker.activeEl.attr("data-pos");
            if (!rlt['success'] && picker.get('forceCorrect')) {
                this.setDate(this.getDefaultDate());
                this.updateTip(this.validate());
            } else {
                if (rlt['formatted'])
                    picker.activeEl.val(rlt['formatted']);
                this.updateTip(rlt);
            }
            this.checkLinked({
                "pos": picker.args.pos,
                "restPos": restPos
            });
            picker.args.pos = "";
            //auto set date
        },
        // show the tip , the argument comes from this.validate()
        updateTip: function(rlt) {
            if (!this.picker.get('showTip'))
                return;

            if (!rlt.success)
                this.showErrText(rlt.errmsg);
            else
                this.showText(rlt.daytip);
        },
        validate: function() {
            var picker = this.picker;
            var val = this.picker.activeEl.val();
            var date = this.getDate();
            var self = this;
            //remove last selected date if user type the date .
            if (this.selectedDate && this.selectedDate.getTime() != date.getTime())
                this.selectedDate = null;

            var errmsg = '';
            if (date == null) {
                errmsg = picker.get('LANG.ERR_FORMAT');
                picker._trigger('q-datepicker-error', ['FORMAT', val]);
            } else {
                var minDate = picker.get('minDate'),
                    maxDate = picker.get('maxDate');
                if (minDate && minDate.getTime() > date.getTime() || maxDate && maxDate.getTime() < date.getTime()) {
                    errmsg = picker.get('LANG.OUT_OF_RANGE');
                    picker.args.pos = "change"; //当选择超出时间范围的时间标记
                    picker._trigger('q-datepicker-error', ['RANGE', val]);
                }

            }
            var rlt = {
                success: !errmsg,
                errmsg: errmsg,
                formatted: null,
                daytip: null
            };
            if (rlt['success']) {
                var ds = picker.get('formatDate')(date),
                    showText;
                switch (picker.args.minuteDate(date)) {
                    case 0:
                        showText = "今天";
                        break;
                    case 1:
                        showText = "明天";
                        break;
                    case 2:
                        showText = "后天";
                        break;
                    default:
                        showText = '周' + picker.get('LANG.day_names')[date.getDay()];
                        break;
                }
                rlt['daytip'] = holidayDate[ds] ? holidayDate[ds]['holidayName'] : showText;
                rlt['formatted'] = ds;
            }

            return rlt;
        },
        addRoundClass: function(type) {
            if (type == 'FROM')
                return this.picker.get('CLASS')['day_selected'];
            else if (type == 'BACK') {
                return this.picker.get('CLASS')['day_round'];
            } else if (type == 'AREAR') {
                return this.picker.get('CLASS')['day_area_bg'];
            }

        }
    });
    $.fn.qdatepicker = function() {
        if (this[0]) {
            //set or get option
            if (arguments.length > 1 && this.data(ROOT_KEY)) {
                var qdp = this.data(ROOT_KEY);
                if (arguments[0] === 'option' || arguments[0] === 'setting')
                    return arguments.length > 2 ? qdp.set(arguments[1], arguments[2]) : qdp.get(arguments[1]);
                //init a datepicker
            } else if (arguments.length <= 1) {
                if (this.data(ROOT_KEY)) {
                    this.data(ROOT_KEY).dispose();
                    this.removeData(ROOT_KEY);
                }
                var qdk = new QDatePicker(this[0], arguments[0]);
                this.data(ROOT_KEY, qdk);
            }
        }
        return this;
    };
    calcTime = $.qdatepicker.calcTime;
})(jQuery);
