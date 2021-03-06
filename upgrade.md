<!-- --------------------------------------------------------------------------------------- -->
# 版本更新



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
去掉多于的 ignore 参数  
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


