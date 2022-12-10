<!-- --------------------------------------------------------------------------------------- -->
# 版本更新  



<!-- --------------------------------------------------------------------------------------- -->
## V0.5.X  



**V0.5.0(2022-11-30)**  

修改 `xj.ripple.create()` 方法第二个参数的优先级，现在该参数的优先级最高，方便手动创建波纹时随时调整细节  



<!-- --------------------------------------------------------------------------------------- -->
## V0.4.X  



**V0.4.0(2022-10-30)**  

新增 `bg` 参数，用于设置波纹的 `background` 样式，可以使用图片作为波纹，甚至可以使用渐变作为波纹的背景色  

删除 `specialRatio` 参数，默认特殊模式下，波纹的尺寸也是覆盖到边缘就行，需要其他尺寸可用尺寸属性重新定义  
删除 `classList` 的 Polyfill，插件本来就不支持 SVG，所以留着针对 SVG 的类名操作的 polyfill 也没意义  
删除 `specialSelector` 配置参数中的 `.xjRadio-icon, .xjCheckbox-icon, .xjSwitch-icon`，有需要再配置  
删除 `defaultSelector` 配置参数中的 `button, .button, .xjButton`，避免和其他框架配合使用时出错  

修改 `offsetLeft` 和 `offsetTop` 参数的逻辑，现在偏移也会影响到波纹的尺寸，而不是单纯的圆心偏移而已  
修改 `styleString` 参数名称为 `StyleObject`，使用对象对 style 进行赋值可避免因为覆盖而产生错误  
修改 `insertTarget` 参数对 `parent` 和 `self` 关键词的判断，现在是 `:parent` 和 `:self`  
修改 `createBefore` 和 `createAfter` 参数名称为 `insertBefore` 和 `insetAfter`  
修改 `ignoreSelector` 配置参数的名称，现在是 `preventSelector`  
修改 `removeCallback` 参数名称为 `destroyCallback`  

解决 Chrome V101 修改了 `box-shadow` 样式的圆角算法，从而导致波纹无法再显示为圆角的 BUG  
解决 `insertTarget` 参数的正则表达式的错误既 `^self|parent`，现在改为 `^:(self|parent)`  



<!-- --------------------------------------------------------------------------------------- -->
## V0.3.X  



**V0.3.2(2021-11-06)**  
为 defaultSelector 参数添加 'button, .button, .xjButton'，为 specialSelector 参数添加 .xjChecked 相关的选择器  
现在由于 button 会自动响应波纹，但 position:static 的按钮波纹会定位异常，所以不响应 position 是 static 的情况

**V0.3.1(2021-10-17)**  
将全局配置的 defaultClass 和 specialClass 改名为 defaultSelector 和 specialSelector，因为实际上并不止支持类名  
全局配置增加 ignoreSelector 参数，用于排除一些不支持 ripple 的单标签以及 shadow-dom 元素  

**V0.3.0(2021-05-11)**  
将 xj-ripple-visible 类名改为 xj-ripple-out，将 xj-ripple-special 类名改为 xj-ripple-mid  
删除了多余的 xj-ripple-default 类名，新增了 xj-ripple-out-mid 类名，允许波纹溢出并居中  
将 classTarget, existClass, defaultClass, specialClass 参数分离到 rippleConfig 对象  
改进了 insertTarget 参数，现在可以接受函数参数，自行返回插入目标  
增加了对 cursor 属性的判断，不再响应指针为 not-allowed 的点击  
提升了相关类名的权重，避免样式权重过低而无法覆盖生效的情况  



<!-- --------------------------------------------------------------------------------------- -->
## V0.2.X  



**V0.2.4(2020-05-18)**  
解决在 Safari(IOS) 中点击不响应问题，并且支持多点触屏操作  
提升 closest() 方法效率，合并参数选择器  
进一步优化代码的结构  

**V0.2.3(2020-05-17)**  
解决有 border 或滚动条时波纹定位偏差的问题  
将和节点相关的 class 操作方法独立出来  
进一步优化鼠标点击位置计算的逻辑  

**V0.2.2(2020-05-03)**  
为 css 文件添加 .xj-ripple-primary 等预设值的类名，以实现波纹颜色的预定义设置  
将背景和阴影的颜色固定为 currentColor 的设置，将会跟随 color 的设置  
将 .xj-ripple-element 的 z-index 降低为 4000 以便覆盖

**V0.2.1(2020-02-25)**  
逆转 default 和 special 的判断，设为 default 的可以再为 special  
更新 matches() 方法和 closest() 方法的 polyfill  
将 opacity 从 0.5 调整为 0.375  

**V0.2.0(2020-02-14)**  
重构了整个项目，重命名为 xj.ripple  
不再兼容 IE9，兼容从 IE10 开始  
去除了对 jQuery 库的依赖  
添加了模块设置的内容  
优化参数的内容，提升了运行时的效率  



<!-- --------------------------------------------------------------------------------------- -->
## V0.1.X  



**V0.1.4(2018-11-24)**  
添加 mouseleave 和 mouseenter 的事件  
优化绑定判断逻辑减少不必要的代码  
优化逐帧动画的 step 回调函数  

**V0.1.3(2018-11-17)**  
添加 'use strict';  
去掉多余的 ignore 参数  
解决波纹居中定位不够精准的问题  
升级 xjObject 插件，并且修改完善 demo  
在有 target 属性的时候尺寸以 target 对象为准  

**V0.1.2(2018-07-14)**  
解决 animate 动画 duration 参数无效的 bug  
去掉 text-indent 参数提升 animate 动画的效率  

**V0.1.1(2018-07-02)**  
解决触屏设备在拖动滚动时出现的错误触发问题  
优化缩放动画模式解决IE的圆角边缘渲染错误问题  

**V0.1.0(2018-06-30)**  
First Version  


