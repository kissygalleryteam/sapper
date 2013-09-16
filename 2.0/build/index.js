/*
combined files : 

gallery/sapper/2.0/index

*/
/*
 combined files : 

 gallery/sapper/1.0/index

 */
/*
 combined files :

 gallery/sapper/1.0/index

 */
/**
 * @fileoverview
 * @author kissy-team<kissy-team@gmail.com>
 * @module found
 **/
KISSY.add('gallery/sapper/2.0/index',function (S, Node, Base, Anim) {
    var EMPTY = '';
    var $ = Node.all;

    /**
     *
     * @class sapper
     * @constructor
     * @extends Base
     */
    function Sapper(comConfig) {
        var self = this;
        //调用父类构造函数
        Sapper.superclass.constructor.call(self, comConfig);
        self.init();
    }

    S.extend(Sapper, Base, /** @lends sapper.prototype*/{
        init: function () {
            var self = this;
            self._createUI();
            self._bindUI();
            self._bindModelChange();
        },
        _createUI: function () {
            var self = this;
            var node = S.DOM.create('<div class="sapper-noresult sapper-container  hidden" >' +
                '<input class="J_sapper_Input sapper-input" id="sapper-input" placeholder="在首页找入口"/>' +
                '<label class="sapper-numbers" for="sapper-input">' +
                '第<span class="J_sapper_Index">0</span>条，共<span class="J_sapper_Total">0</span>条' +
                '</label>' +
                '<a href="jasvasript:void(0);"  style="text-decoration: none" class="sapper-down J_sapper_Down">&nbsp;</a>' +
                '<a href="jasvasript:void(0);"   style="text-decoration: none" class="sapper-up  J_sapper_Up">&nbsp;</a>' +
                '<a href="jasvasript:void(0);"   style="text-decoration: none"  class="sapper-close J_sapper_Close">&nbsp;</a>' +
                '</div>', {
                "id": S.guid('J_sapper_')
            });

            var focusIco = S.DOM.create('<div></div>', {
                href: '#',
                title: '找到了',
                id: S.guid('J_sapper_'),
                "class": 'sapper-ico'
            });
            var body = S.one('body');
            body.append(node);
            body.append(focusIco);
            var container = S.one(node);
            var input = container.one('.J_sapper_Input');
            var index = container.one('.J_sapper_Index');
            var total = container.one('.J_sapper_Total');
            var up = container.one('.J_sapper_Up');
            var down = container.one('.J_sapper_Down');

            self.set('doms', {
                "container": container,
                "input": input,
                "focusIco": S.one(focusIco),
                "total": total,
                "index": index,
                "up": up,
                "down": down
            });
            var position = self.get('position');
            if (position) {
                self.setPosition(position);
            }
        },
        _bindUI: function () {
            var self = this;
            var doms = self.get('doms');
            var container = doms.container;
            var triggerSel = self.get('triggerSel');
            var triggerNode = S.all(triggerSel);
            triggerNode.on('click', self.show, self);
            container.delegate('click', '.J_sapper_Close', function (e) {
                e.preventDefault();
                self.hide();
            }, self);
            container.delegate('click', '.J_sapper_Down', function (e) {
                e.preventDefault();
                self.findNext();
            }, self);
            container.delegate('click', '.J_sapper_Up', function (e) {
                e.preventDefault();
                self.findPrev();
            }, self);
            container.delegate('keyup', '.J_sapper_Input', self._handleKeyup, self);
            container.delegate('keydown', '.J_sapper_Input', self._handleKeydown, self);

        },
        setPosition: function (position) {
            var self = this;
            var container = self.get('doms.container');
            var position = position || self.get('position');
            container.css(position);
        },
        _bindModelChange: function () {
            var self = this;
            self.on('afterResultChange', function () {
                if (self.get('result') !== null) {
                    self._showAllResults();
                }
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
            self._searchText(text);
            self._findLink();
        },
        _searchText: function (text, scope) {
            var self = this;
            var input = self.get('doms.input');
            var text = typeof (text) === 'undefined' ? S.trim(input.val()) : S.trim(text);
            if (text === EMPTY) {
                self.reset();
                return;
            }
            var scope = scope || self.get('scope');
            var selector = 'a:contains("' + text + '")';
            var content = $(scope);
            var result = content.all(selector);
            result = self._filterResult(result);
            self.set('total', result.length);
            self.set('result', result);
            self.set('index', 0);
        },
        /**
         * 重置结果
         */
        reset:function(){
            var self = this;
            self.set('result', null);
            self.set('total', 0);
            self.set('index', 0);
            self._setTotalNumber();
            self._setIndexNumber();
            self._setBtnState();
        },
        /**
         * 过滤不需要的结果
         * @private
         */
        _filterResult:function(nodeList){
            var self = this;
            var success = false;
            var result = [];
            console.time('过滤节点');
            nodeList.each(function(node){
                var href = node.attr('href');
                var isLink = !href.match(/javascript/gi);
                if(isLink) {
                    result.push(node);
                }
            });
            console.timeEnd('过滤节点');
            return result;
        },
        _findLink: function () {
            var self = this;
            var result = self.get('result');
            var index = self.get('index');
            var isFind = false;
            if (!result) {
                self._searchText();
                result = self.get('result');
            }
            var total = self.get('total');
            if(index<0 || index>total-1){
                return;
            }
            if (result) {
                var node = result[index];
                self._focusNode(node);
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
            if(index<=0){
                return;
            }
            index--;
            self.set('index', index);
            self._findLink();
        },
        findNext: function () {
            var self = this;
            var index = self.get('index');
            var total = self.get('total');
            if(index>=total-1){
                return;
            }
            index++;
            self.set('index', index);
            self._findLink();
        },
        _showAllResults: function () {
            var self = this;
            var result = self.get('result');
            S.each(result,function(node){
                node.addClass('sapper-href');
            });
        },
        _hideAllResults: function () {
            var self = this;
            var result = self.get('result');
            S.each(result,function(node){
                node.removeClass('sapper-href');
            });
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
            var container = self.get('doms.container');
            var up = self.get('doms.up');
            var down = self.get('doms.down');
            var total = self.get('total');
            var index = self.get('index');
            if (total === 0) {
                container.addClass('sapper-noresult');
            } else {
                container.removeClass('sapper-noresult');
            }
            if (index === 0) {
                up.addClass('sapper-noupresult');

            } else {
                up.removeClass('sapper-noupresult');
            }
            if (index === total - 1) {
                down.addClass('sapper-nodownresult');

            } else {
                down.removeClass('sapper-nodownresult');
            }
        },
        _scrollTo: function (position) {
            var self = this;
            window.scrollTo(0, position.top - 30);
        },
        _focusNode: function (node) {
            var self = this;
            if(!node){
                return;
            }
            var fireFn = self.get('fireFn');
            if (fireFn) {
                try {
                    fireFn(node);
                } catch (e) {
                    S.log('执行触发事件失败');
                }
            }
            var position = self._findPosition(node);
            node.addClass('sapper-unvisibility');
            node.addClass('sapper-href-now');
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
                "left": left,
                "top": top
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
            cloneNode.addClass('sapper-href-focus');
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
                focusNode.removeClass('sapper-href-now');
                focusNode.removeClass('sapper-unvisibility');
            }
        },
        show: function () {
            var self = this;
            var doms = self.get('doms');
            var container = doms.container;
            var input = doms.input;
            container.fadeIn(0.3, function () {
                input.fire('focus');
            });
        },
        hide: function () {
            var self = this;
            var doms = self.get('doms');
            var container = doms.container;
            var input = doms.input;
            container.fadeOut(0.5,function(){
                container.hide();
                self.set('result', null);
            });

        }


    }, {ATTRS: /** @lends sapper*/{
        "doms": {
            "value": {

            }
        },
        "result": {
            "value": null
        },
        "index": {
            "value": 0,
            "setter": function (index) {
                var total = this.get('total');
                if(index>total-1){
                    index = total-1;
                }
                if (index < 0){
                    index = 0;
                }
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
        "fireFn": { /*选中元素后的回调函数，用来处理诸如打开、展开等操作*/
            "value": null
        },
        "triggerSel": {   /*触发显示输入框选择器，格式参照KISSY selector*/
            "value": '#J_Sapper_Trigger'
        },
        "position": {/*获取元素位置,请传人left或right，bottom或top,必须是数字*/
            "value": {
                "right": 20,
                "bottom": 20
            }
        },
        "scope": {  /*查找范围，按selector方式给出,默认为body*/
            "value": 'body'
        }

    }});
    return Sapper;
}, {requires: ['node', 'base', 'anim', 'event', 'sizzle', 'ua', './index.css']});
