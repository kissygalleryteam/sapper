/*! sapper - v2.0.0 - 2013-11-06 5:20:37 PM
* Copyright (c) 2013 迟伤; Licensed  */
KISSY.add("kg/sapper/2.0.0/index",function(a,b,c,d){var e="",f=b.all,g=c.extend({initializer:function(){var a=this;a._setScope(),a._createUI(),a._bindUI(),a._bindModelChange()},_setScope:function(){var a=this,b=a.get("scope"),c=f(b);a.set("localdata",c)},_createUI:function(){var b=this,c=a.DOM.create('<div class="sapper-noresult sapper-container  hidden" ><input class="J_Sapper_Input sapper-input" id="sapper-input" placeholder="\u5728\u9996\u9875\u627e\u5165\u53e3"/><label class="sapper-numbers" for="sapper-input">\u7b2c<span class="J_Sapper_Index">0</span>\u6761\uff0c\u5171<span class="J_Sapper_Total">0</span>\u6761</label><a href="jasvasript:void(0);"  style="text-decoration: none" class="sapper-down J_Sapper_Down">&nbsp;</a><a href="jasvasript:void(0);"   style="text-decoration: none" class="sapper-up  J_Sapper_Up">&nbsp;</a><a href="jasvasript:void(0);"   style="text-decoration: none"  class="sapper-close J_Sapper_Close">&nbsp;</a></div>',{id:a.guid("J_Sapper_")}),d=a.DOM.create("<div></div>",{href:"#",title:"\u627e\u5230\u4e86",id:a.guid("J_Sapper_"),"class":"sapper-ico"}),e=a.one("body");e.append(c),e.append(d);var f=a.one(c),g=f.one(".J_Sapper_Input"),h=f.one(".J_Sapper_Index"),i=f.one(".J_Sapper_Total"),j=f.one(".J_Sapper_Up"),k=f.one(".J_Sapper_Down");b.set("doms",{container:f,input:g,focusIco:a.one(d),total:i,index:h,up:j,down:k});var l=b.get("position");l&&b.setPosition(l)},_bindUI:function(){var b=this,c=b.get("doms"),d=c.container,e=b.get("triggerSel"),f=a.all(e);f.on("click",b.show,b),d.delegate("click",".J_Sapper_Close",function(a){a.preventDefault(),b.hide()}),d.delegate("click",".J_Sapper_Down",function(a){a.preventDefault(),b.findNext()}),d.delegate("click",".J_Sapper_Up",function(a){a.preventDefault(),b.findPrev()}),d.delegate("keyup",".J_Sapper_Input",function(a){b._handleKeyup(a)}),d.delegate("keydown",".J_Sapper_Input",function(a){b._handleKeydown(a)})},setPosition:function(a){var b=this,c=b.get("doms.container"),a=a||b.get("position");c.css(a)},_bindModelChange:function(){var a=this;a.on("afterResultChange",function(){null!==a.get("result")&&a._showAllResults(),a._setTotalNumber(),a._setIndexNumber(),a._setBtnState()}),a.on("beforeResultChange",function(){a.set("focusNode",null),a._hideAllResults()}),a.on("beforeIndexChange",function(){a.set("prevIndex",a.get("index"))}),a.on("afterIndexChange",function(){a._setIndexNumber(),a._setBtnState()}),a.on("beforeFocusNodeChange",function(){a._unFocusNode()})},_handleKeyup:function(b){var c=this,d=a.one(b.target),e=b.keyCode;if(13!=e&&37!=e&&38!=e&&39!=e&&40!=e){var f=d.val();c.search(f)}},_handleKeydown:function(a){var b=this,c=a.keyCode;(13==c||40==c)&&b.findNext(),38==c&&b.findPrev(),27==c&&b.hide()},search:function(a){var b=this;b._searchText(a),b._findLink()},_searchText:function(b){var c=this,d=c.get("doms.input"),b="undefined"==typeof b?a.trim(d.val()):a.trim(b);if(b===e)return c.reset(),void 0;var f=c.get("localdata");result=c._filterResult(f,b),c.set("total",result.length),c.set("result",result),c.set("index",0)},reset:function(){var a=this;a.set("result",null),a.set("total",0),a.set("index",0),a._setTotalNumber(),a._setIndexNumber(),a._setBtnState()},_filterResult:function(a,b){var c=[];return a.each(function(a){var d=a.attr("href"),e=!d.match(/javascript/gi),f=a.html(),g=-1!==f.search(b);e&&g&&c.push(a)}),c},_findLink:function(){var a=this,b=a.get("result"),c=a.get("index");b||(a._searchText(),b=a.get("result"));var d=a.get("total");if(!(0>c||c>d-1)&&b){var e=b[c];a._focusNode(e)}},_filterShowResult:function(){var a=this,b=a.get("index"),c=a.get("prevIndex");b>=c?a.findNext():a.findPrev()},findPrev:function(){var a=this,b=a.get("index");0>=b||(b--,a.set("index",b),a._findLink())},findNext:function(){var a=this,b=a.get("index"),c=a.get("total");b>=c-1||(b++,a.set("index",b),a._findLink())},_showAllResults:function(){var b=this,c=b.get("result");a.each(c,function(a){a.addClass("sapper-href")})},_hideAllResults:function(){var b=this,c=b.get("result");a.each(c,function(a){a.removeClass("sapper-href")}),b._hideIco(),b._unFocusNode()},_setTotalNumber:function(){var a=this,b=a.get("doms.total"),c=a.get("total");b.html(c)},_setIndexNumber:function(){var a=this,b=a.get("doms.index"),c=a.get("index"),d=a.get("total"),e=d>0?c+1:0;b.html(e)},_setBtnState:function(){var a=this,b=a.get("doms.container"),c=a.get("doms.up"),d=a.get("doms.down"),e=a.get("total"),f=a.get("index");0===e?b.addClass("sapper-noresult"):b.removeClass("sapper-noresult"),0===f?c.addClass("sapper-noupresult"):c.removeClass("sapper-noupresult"),f===e-1?d.addClass("sapper-nodownresult"):d.removeClass("sapper-nodownresult")},_scrollTo:function(a){window.scrollTo(0,a.top-30)},_focusNode:function(b){var c=this;if(b){var e=c.get("fireFn");if(e)try{e(b)}catch(f){a.log("\u6267\u884c\u89e6\u53d1\u4e8b\u4ef6\u5931\u8d25")}var g=c._findPosition(b);b.addClass("sapper-unvisibility"),b.addClass("sapper-href-now"),c.set("focusNode",b);var h=b.clone(!0),i=b.css("lineHeight"),j=g.top,k=g.left,l=b.css("height"),m=b.css("width"),n=(parseInt(i)-parseInt(l))/2;j=n>0&&j-n>0?j-n:j;var o=a.DOM.viewportHeight(),p=a.DOM.scrollTop(window);(j>o+p||p>j)&&c._scrollTo({left:k,top:j}),c._showIco({left:k,top:j});var q={position:"absolute",left:k,top:j,fontSize:b.css("fontSize"),padding:b.css("padding"),minHeight:"0px"==l?"auto":l,minWidth:"0px"==m?"auto":m,textAlign:b.css("textAlign"),lineHeight:i};6===d.ie&&a.mix(q,{height:"0px"==l?"auto":l,width:"0px"==m?"auto":m}),h.css(q),h.addClass("sapper-href-focus"),h.appendTo("body"),h.show(),c.set("cloneNode",h)}},_findPosition:function(a){var b=this,c=a.offset(),d=c.left;if(c.top,0>=d){var e=a.parent();e&&e.prop("tagName")&&"BODY"!==e.prop("tagName")&&(c=b._findPosition(e))}return c},_showIco:function(a){var b=this,c=b.get("doms.focusIco"),d=a.left-8,e=a.top-21;e=0>e?a.top:e,d=0>e?a.left:d-10,c.css({left:d,top:e,display:"block"})},_hideIco:function(){var a=this,b=a.get("doms.focusIco");b.hide()},_unFocusNode:function(){var a=this,b=a.get("cloneNode"),c=a.get("focusNode");b&&b.remove(),c&&(c.removeClass("sapper-href-now"),c.removeClass("sapper-unvisibility"))},show:function(){var a=this,b=a.get("doms"),c=b.container,d=b.input;c.fadeIn(.3,function(){d.fire("focus")})},hide:function(){var a=this,b=a.get("doms"),c=b.container;b.input,c.fadeOut(.5,function(){c.hide(),a.set("result",null)})}},{ATTRS:{doms:{value:{}},result:{value:null},index:{value:0,setter:function(a){var b=this.get("total");return a>b-1&&(a=b-1),0>a&&(a=0),a}},prevIndex:{value:0},total:{value:0},cloneNode:{value:null},focusNode:{value:null},fireFn:{value:null},triggerSel:{value:"#J_Sapper_Trigger"},position:{value:{right:20,bottom:20}},scope:{value:"body a"}}});return g},{requires:["node","base","ua","./index.css"]});