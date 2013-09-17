## 综述

sapper是勤奋的挖掘工，帮您快速查找页面入口。

## 快速使用

### 初始化组件

    S.use('gallery/sapper/1.0/index', function (S, Sapper) {
         var sapper = new Sapper({
         position:{
             left:10,
             top:10
             }
         }
         });
    })

## config参数

* position {object} 定位位置。 default ：{  "right": 20,"bottom": 20}
* scope  {KISSY selector} 查找范围。default 'body'
*  triggerSel { KISSY selector}   事件触发选择器。   default:'#J_Sapper_Trigger'
* fireFn {function}  定位到查找的链接后，需要触发的函数。default:null

## API说明

* search（text{string}） 搜索字符text，为空时搜索输入框中的内容
* reset 重置搜索结果
* findNext 查找下一个
* findPrev 查找上一个
* hide 隐藏搜索框并清除搜索结果
* show 展示搜索框
* setPosition(position{object}) 设置定位