## 综述

sapper是勤奋的挖掘工，帮您快速查找页面入口。

## 快速使用

### 初始化组件

    S.use('kg/sapper/2.0.0/index', function (S, Sapper) {
         var sapper = new Sapper({
         position:{
             left:10,
             top:10
             }
         }
         });
    })

## config参数

<table>
<tr>
<td>字段</td>
<td>数据类型</td>
<td>含义</td>
<td>默认值</td>
</tr>
<tr>
<td>position</td>
<td>object</td>
<td>获取元素位置,请传人left或right，bottom或top,必须是数字</td>
<td> {  "right": 20,"bottom": 20}</td>
</tr>
<tr>
<td>scope</td>
<td>KISSY selector</td>
<td>查找范围</td>
<td>'body a'</td>
</tr>
<tr>
<td>triggerSel</td>
<td>KISSY selector</td>
<td>显示搜索框事件触发选择器</td>
<td>'#J_Sapper_Trigger'</td>
</tr>
<tr>
<td>fireFn</td>
<td>function</td>
<td>定位到查找的链接后，需要触发的函数</td>
<td>null</td>
</tr>
</table>
  

## API说明
<table>
<tr>
<td>方法</td>
<td>参数</td>
<td>含义</td>
<td>返回值</td>
</tr>
<tr>
<td>search</td>
<td>text{string}</td>
<td>搜索字符text，为空时搜索输入框中的内容</td>
<td></td>
</tr>
<tr>
<td>reset</td>
<td></td>
<td>查找范围</td>
<td></td>
</tr>
<tr>
<td>findNext</td>
<td> </td>
<td>查找下一个</td>
<td> </td>
</tr>
<tr>
<td>findPrev</td>
<td></td>
<td>查找上一个</td>
<td> </td>
</tr>
<tr>
<td>hide</td>
<td> </td>
<td>隐藏搜索框并清除标记结果</td>
<td> </td>
</tr>
<tr>
<td>show</td>
<td></td>
<td>展示搜索框</td>
<td> </td>
</tr>
<tr>
<td>setPosition</td>
<td> position {object} <br/>请传人left或right，bottom或top,必须是数字</td>
<td>设置定位</td>
<td> </td>
</tr>

</table>
