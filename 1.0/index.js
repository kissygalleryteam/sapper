/*
 combined files :

 gallery/Sapper/1.0/index

 */
/**
 * @fileoverview
 * @author kissy-team<kissy-team@gmail.com>
 * @module found
 **/
KISSY.add(function (S, Node, Base, Anim) {
    var EMPTY = '';
    var $ = Node.all;

    /**
     *
     * @class Sapper
     * @constructor
     * @extends Base
     */
    function Sapper(comConfig) {
        var self = this;
        //调用父类构造函数
        Sapper.superclass.constructor.call(self, comConfig);
        self.init();
    }

    S.extend(Sapper, Base, /** @lends Sapper.prototype*/{
        init: function () {
            var self = this;
            self._createUI();
            self._bindUI();
            self._bindModelChange();
        },
        _createUI: function () {
            var self = this;
            var node = S.DOM.create('<div >' +
                '<div class="Sapper-icowrap J_Sapper_Ico" data-action="search" ><span class="Sapper-ico"  data-action="search">&nbsp;</span></div>' +
                '<span class="J_Sapper_Click Sapper-des" data-action="search">我要找入口</span>' +
                '<div class="J_Sapper_Search Sapper-noresult Sapper-search  hidden" >' +
                '<input class="J_Sapper_Input Sapper-input" id="Sapper-input" placeholder="在首页找入口"/>' +
                '<label class="Sapper-numbers" for="Sapper-input">' +
                '第<span class="J_Sapper_Index">0</span>条，共<span class="J_Sapper_Total">0</span>条' +
                '</label>' +
                '<a href="jasvasript:void(0);"  class="Sapper-down J_Sapper_Down J_Sapper_Click" data-action="down">&nbsp;</a>' +
                '<a href="jasvasript:void(0);" class="Sapper-up  J_Sapper_Up J_Sapper_Click" data-action="up">&nbsp;</a>' +
                '<a href="jasvasript:void(0);"  class="Sapper-close J_Sapper_Close  J_Sapper_Click" data-action="close">&nbsp;</a>' +
                '</div>' +
                '</div>', {
                "href": '#',
                "id": S.guid('J_Sapper_'),
                "title": '通过这个功能，您不仅能快速找到需要的链接，还能找到被“深藏”的入口哦~',
                "class": 'Sapper-container'
            });
            var focusIco = S.DOM.create('<div></div>', {
                href: '#',
                title: '找到了',
                id: S.guid('J_Sapper_'),
                "class": 'Sapper-ico'
            });
            var body = S.one('body');
            body.append(node);
            body.append(focusIco);
            var container = S.one(node);
            container.css('top', self.get('top'));
            var search = container.one('.J_Sapper_Search');
            var click = container.one('.J_Sapper_Click');
            var hover = container.one('.J_Sapper_Hover');
            var input = container.one('.J_Sapper_Input');
            var ico = container.one('.J_Sapper_Ico');
            var index = container.one('.J_Sapper_Index');
            var total = container.one('.J_Sapper_Total');
            var up = container.one('.J_Sapper_Up');
            var down = container.one('.J_Sapper_Down');
            self.set('doms', {
                "container": container,
                "search": search,
                "click": click,
                "hover": hover,
                "input": input,
                "ico": ico,
                "focusIco": S.one(focusIco),
                "total": total,
                "index": index,
                "up": up,
                "down": down
            });
        },

        _bindUI: function () {
            var self = this;
            var doms = self.get('doms');
            var container = doms.container;
            container.delegate('mouseover', '.J_Sapper_Ico', self._handleIcoHover, self);
            container.delegate('click', '.J_Sapper_Click', self._handleClick, self);
            container.delegate('keyup', '.J_Sapper_Input', self._handleKeyup, self);
            container.delegate('keydown', '.J_Sapper_Input', self._handleKeydown, self);
            if (S.UA.ie == 6) {
                var win = S.one(window);
                win.on('scroll', function (e) {
                    container.css('top', S.DOM.scrollTop(win) + self.get('top'));
                });
            }
        },
        _bindModelChange: function () {
            var self = this;
            self.on('afterResultChange', function () {
                self._showAllResults();
                self._setTotalNumber();
                self._setIndexNumber();
                self._setBtnState();

            });
            self.on('beforeResultChange', function () {
                self.set('focusNode', null);
                self._hideAllResults();
            });
            self.on('beforeIndexChange', function () {
                self.set('prevIndex', self.get('index'));
            });
            self.on('afterIndexChange', function () {
                self._setIndexNumber();
                self._setBtnState();
            });
            self.on('beforeFocusNodeChange', function () {
                self._unFocusNode();
            });

        },
        _handleIcoHover: function () {
            var self = this;
            self._toggleClick(true);
            var container = self.get('doms.container');
            container.undelegate('mouseover', '.J_Sapper_Ico', self._handleIcoHover, self);
            container.delegate('click', '.J_Sapper_Ico', self._handleClick, self);
        },
        _handleClick: function (e) {
            e.halt();
            var self = this;
            var target = S.one(e.target);
            var action = target.attr('data-action');
            switch (action) {
                case 'search':
                    self._toggleClick(false);
                    self._toggleSearch(true);
                    break;
                case 'close':
                    self._toggleClick(false);
                    self._toggleSearch(false);
                    self.set('result', null);
                    break;
                case 'up':
                    self.findPrev();
                    break;
                case 'down':
                    self.findNext();
                    break;
                default:
                    break;
            }

        },
        _handleKeyup: function (e) {
            var self = this;
            var target = S.one(e.target);
            var keyCode = e.keyCode;
            if (keyCode == 13 || keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
                return;
            }
            var text = target.val();
            self.search(text);
        },
        _handleKeydown: function (e) {
            var self = this;
            var keyCode = e.keyCode;
            if (keyCode == 13 || keyCode == 40) {
                self.findNext();
            }
            if (keyCode == 38) {
                self.findPrev();
            }
        },
        search: function (text) {
            var self = this;
            self._setSearchText(text);
            self._findResult();
        },
        _setSearchText: function (text) {
            var self = this;
            var input = self.get('doms.input');
            var text = typeof (text) === 'undefined' ? S.trim(input.val()) : S.trim(text);
            if (text === EMPTY) {
                self.set('result', null);
                self.set('total', 0);
                self.set('index', 0);
                self._setTotalNumber();
                self._setIndexNumber();
                self._setBtnState();
                return;
            }
            var selector = 'body a:contains("' + text + '")';
            var result = $(selector);
            self.set('total', result.length);
            self.set('result', result);
            self.set('index', 0);
        },
        _findResult: function () {
            var self = this;
            var result = self.get('result');
            var index = self.get('index');
            var isFind = false;
            if (!result) {
                self._setSearchText();
                result = self.get('result');
            }
            if (result) {
                var node = result.item(index);
                if (node) {
                    var href = node.attr('href');
                    var isLink = !href.match(/javascript/gi);
                    if (isLink) {
                        self._showFocusResult(node);
                    } else {
                        self._filterShowResult();
                    }

                } else {
                    index--;
                    self.set('index', index);
                }
            }
        },
        _filterShowResult: function () {
            var self = this;
            var index = self.get('index');
            var prevIndex = self.get('prevIndex');
            if (prevIndex <= index) {
                self.findNext();
            } else {
                self.findPrev();
            }

        },
        findPrev: function () {
            var self = this;
            var index = self.get('index');
            index--;
            self.set('index', index);
            self._findResult();
        },
        findNext: function () {
            var self = this;
            var index = self.get('index');
            index++;
            self.set('index', index);
            self._findResult();
        },
        _showFocusResult: function (node) {
            var self = this;
            self._focusNode(node);
        },
        _showAllResults: function () {
            var self = this;
            var result = self.get('result');
            if (result && result.addClass) {
                result.addClass('Sapper-href');
            }
        },
        _hideAllResults: function () {
            var self = this;
            var result = self.get('result');
            if (result && result.addClass) {
                result.removeClass('Sapper-href');
            }
            self._hideIco();
            self._unFocusNode();
        },
        _setTotalNumber: function () {
            var self = this;
            var node = self.get('doms.total');
            var total = self.get('total');
            node.html(total);
        },
        _setIndexNumber: function () {
            var self = this;
            var node = self.get('doms.index');
            var index = self.get('index');
            var total = self.get('total');
            var showindex = total > 0 ? index + 1 : 0;
            node.html(showindex);
        },
        _setBtnState: function () {
            var self = this;
            var search = self.get('doms.search');
            var up = self.get('doms.up');
            var down = self.get('doms.down');
            var total = self.get('total');
            var index = self.get('index');
            if (total === 0) {
                search.addClass('Sapper-noresult');
            } else {
                search.removeClass('Sapper-noresult');
            }
            if (index === 0) {
                up.addClass('Sapper-noupresult');

            } else {
                up.removeClass('Sapper-noupresult');
            }
            if (index === total - 1) {
                down.addClass('Sapper-nodownresult');

            } else {
                down.removeClass('Sapper-nodownresult');
            }
        },
        _scrollTo: function (position) {
            var self = this;
            window.scrollTo(0, position.top - 30);
        },
        _focusNode: function (node) {
            var self = this;

            var fireFn = self.get('fireFn');
            if (fireFn) {
                try {
                    fireFn(node);
                } catch (e) {
                    S.log('执行触发事件失败');
                }
            }
            var position = self._findPosition(node);
            node.addClass('Sapper-unvisibility');
            node.addClass('Sapper-href-now');
            self.set('focusNode', node);
            var cloneNode = node.clone(true);
            var lineHeight = node.css('lineHeight');
            var top = position.top;
            var left = position.left;
            var height = node.css('height');
            var width = node.css('width');
            var ttop = (parseInt(lineHeight) - parseInt(height)) / 2;
            top = (ttop > 0 && top - ttop > 0) ? top - ttop : top;

            self._scrollTo({
                "left":left,
                "top":top
            });

            self._showIco({
                "left": left,
                "top": top
            });
            var styles = {
                "position": 'absolute',
                "left": left,
                "top": top,
                "fontSize": node.css('fontSize'),
                "padding": node.css('padding'),
                "minHeight": height == '0px' ? 'auto' : height,
                "minWidth": width == '0px' ? 'auto' : width,
                "textAlign": node.css('textAlign'),
                "lineHeight": lineHeight
            }
            if (S.UA.ie === 6) {
                S.mix(styles, {
                    "height": height == '0px' ? 'auto' : height,
                    "width": width == '0px' ? 'auto' : width
                });
            }
            cloneNode.css(styles);
            cloneNode.addClass('Sapper-href-focus');
            cloneNode.appendTo('body');
            cloneNode.show();
            self.set('cloneNode', cloneNode);
        },
        _findPosition: function (node) {
            var self = this;
            var position = node.offset();
            var left = position.left;
            var top = position.top;
            if (left <= 0) {
                var parentNode = node.parent();
                if (parentNode && parentNode.prop('tagName') && parentNode.prop('tagName') !== 'BODY') {
                    position = self._findPosition(parentNode);
                }
            }
            return position;
        },
        _showIco: function (position) {
            var self = this;
            var focusIco = self.get('doms.focusIco');
            var left = position.left - 8;
            var top = position.top - 21;
            top = top < 0 ? position.top : top;
            left = top < 0 ? position.left : left - 10;
            focusIco.css({
                "left": left,
                "top": top,
                "display": 'block'
            });
        },
        _hideIco: function () {
            var self = this;
            var focusIco = self.get('doms.focusIco');
            focusIco.hide();
        },
        _unFocusNode: function () {
            var self = this;
            var cloneNode = self.get('cloneNode');
            var focusNode = self.get('focusNode');
            if (cloneNode) {
                cloneNode.remove();
            }
            if (focusNode) {
                focusNode.removeClass('Sapper-href-now');
                focusNode.removeClass('Sapper-unvisibility');
            }
        },
        _handleSearch: function () {
            var self = this;
            var doms = self.get('doms');
            var container = doms.container;
        },
        _toggleClick: function (isShow) {
            var self = this;
            var doms = self.get('doms');
            var container = doms.container;
            var click = doms.click;

            function show() {
                click.fadeIn(0.3);
                container.on('mouseleave', function () {
                    self._toggleClick(false);
                });
            }

            function hide() {
                click.fadeOut(0.5);
                container.detach('mouseleave');
                container.delegate('mouseover', '.J_Sapper_Ico', self._handleIcoHover, self);
            }

            isShow ? show() : hide();
        },
        _toggleSearch: function (isShow) {
            var self = this;
            var doms = self.get('doms');
            var container = doms.container;
            var search = doms.search;
            if (isShow) {
                search.show();
            } else {
                search.fadeOut(0.5);
                S.later(function () {
                    container.delegate('mouseover', '.J_Sapper_Ico', self._handleIcoHover, self);
                    container.undelegate('click', '.J_Sapper_Ico', self._handleClick, self);
                }, 1000);
            }
        }

    }, {ATTRS: /** @lends Sapper*/{
        "doms": {
            "value": null
        },
        "result": {
            "value": null
        },
        "index": {
            "value": 0,
            "setter": function (index) {
                if (index < 0)index = 0;
                return index;
            }
        },
        "prevIndex": {
            "value": 0
        },
        "total": {
            "value": 0
        },
        "cloneNode": {
            "value": null
        },
        "focusNode": {
            "value": null
        },
        "top": {
            "value": 278
        },
        "fireFn": {
            "value": null
        }

    }});
    return Sapper;
}, {requires: ['node', 'base', 'anim', 'event', 'sizzle', 'ua', './index.css']});




