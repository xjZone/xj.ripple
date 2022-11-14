/** xj.ripple(点击波纹特效) | V0.4.0 | Apache Licence 2.0 | 2018-2022 © XJ.Chen | https://github.com/xjZone/xj.ripple/ */
;(function(global, factory){
	if(typeof(define) === 'function' && (define.amd !== undefined || define.cmd !== undefined)){ define(factory) }
	else if(typeof(module) !== 'undefined' && typeof(exports) === 'object'){ module.exports = factory() }
	else{ global = (global||self), global.xj||(global.xj = {}), global.xj.ripple = factory() };
}(this, function(){ 'use strict';



// Polyfill : closest & matches | V3.0.2
// jonathantneal - https://github.com/jonathantneal/closest，实际上这插件还统一了 matches() 方法
!function(){var a=window.Element.prototype;"function"!=typeof a.matches&&(a.matches=a.msMatchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||function(a){for(var b=this,c=(b.document||b.ownerDocument).querySelectorAll(a),d=0;c[d]&&c[d]!==b;)++d;return Boolean(c[d])}),"function"!=typeof a.closest&&(a.closest=function(a){for(var b=this;b&&1===b.nodeType;){if(b.matches(a))return b;b=b.parentNode}return null})}();



// ---------------------------------------------------------------------------------------------
// globalThis | window | self | global
var pub_global = (typeof(globalThis) !== 'undefined') ? globalThis : (typeof(window) !== 'undefined') ? window : (typeof(self) !== 'undefined') ? self : global;

// public nothing, version, keyword
var pub_nothing = function(){}, pub_version = '0.4.0', pub_keyword = 'ripple';

// public config, advance set
var pub_config = {
	
	// 要添加 existClass 类名参数的目标节点，默认是 document.documentElement，也就是 html 标签，不选用 body 标签，是因为初始化时 body 可能还未被加载，不推荐修改
	classTarget : document.documentElement,
	
	// 初始化 classTarget 节点参数将会被添加的类名，默认是 'xj-ripple-exist'，这个可用于在样式中判断是否存在 xj.ripple 插件，XJ 系列插件只响应该参数，不推荐修改
	existClass : 'xj-ripple-exist',
	
	// 在引入插件后，页面中的任意元素节点被点击时，只要符合下面这个参数中的任意一个选择器，那么在点击的时候就会响应波纹效果，默认是 '.xj-ripple, .xj-ripple-out'
	// .xj-ripple 类名与 .xj-ripple-out 类名，它们的区别在于，前者所产生的波纹不会溢出，后者所产生的波纹会溢出，一般来说溢出只是用于测试，正式环境中很少会用到的
	// 如果你希望某些元素如 button 初始就自带这种波纹效果，可将 'button' 这个选择器添加到这个分组选择器中，这样就无需手动为每个 button 都设置 xj-ripple 的类名了
	// 当然你还是得先为 button 标签设置 position:relative; 或 position:absolute; 的样式，否则 button 中的波纹就无法正常定位，而 overflow:hidden 设置则不是必须的
	defaultSelector : '.xj-ripple, .xj-ripple-out',
	
	// 下面的这个 specialSelector 参数和上面的那个 defaultSelector 参数类似，只是点击所产生的波纹将会被水平垂直居中，默认是 '.xj-ripple-mid, .xj-ripple-out-mid'
	// '.xj-ripple-mid' 类名与 '.xj-ripple-out-mid' 类名，它们的区别在于，前者的波纹不会溢出，后者的波纹将会溢出，其实就是样式有没有设置 overflow:hidden; 的区别
	// 如果你希望某些元素如 button 初始就自带这种波纹效果，可将选择器以分组选择器的形式追加到参数中，注意该元素不能是 position:static;，否则波纹将无法准确的定位
	specialSelector : '.xj-ripple-mid, .xj-ripple-out-mid',
	
	// 符合下面这个 preventSelector 参数的标签节点，即使添加了相关的类名也不会响应 ripple，默认是 'img, area, input, textarea, select, audio, video, track, map'
	// 单标签的 img, area, input 无法插入子标签，特殊元素的 textarea, select, audio, video, track, map 无法插入普通的元素节点作为子标签，ripple 无法在它们中显示
	preventSelector : 'img, area, input, textarea, select, audio, video, track, map',
	
};

// public option(32 items)
var pub_option = {
	
	debug : false,				// 进入调试模式，默认是 false，设置为 true 则触发 mouseup 或 touchend 事件之后，不会自动删除插件生成的节点，这样方便进行开发调试
	append : true,				// 波纹追加模式，默认是 true，波纹标签将会被写入到目标容器里的最后面，如果设置改为 false，波纹标签将会被写入到目标容器里的最前面
	
	mouse : [0],				// 响应鼠标按键，默认是 [0]，也就是只有点击左键才响应，数值 012 分别代表鼠标左键中键右键，希望中键右键也响应，可将数值添加进数组
	forbid : true,				// 自动禁止响应，默认是 true，当目标所在上层标签有 disabled 属性或 xj-ripple-disabled 类名或 cursor:not-allowed 样式，那就不响应
	inherit : true,				// 自动继承属性，默认是 true，如果元素的上层标签设置了 xj-ripple="{}" 属性，那么该属性会被子元素继承，除非子元素自己也设置了属性
	
	nodeName : 'xj-ripple',		// 波纹标签名称，默认是 'xj-ripple'，使用自定义的标签名称来生成节点，是为了避免节点被常规的标签选择器样式影响到
	
	classString : '',			// 设置波纹标签额外的类名，默认是 '' (空字符串)，存在多个值时可用空格隔开，例如 'col-success bg-warning rad4px'
	styleObject : null,			// 设置波纹标签额外的样式，默认是 null，使用对象键值对的形式来编写样式值，例如 {borderTop:'2px', color:'red', }
	
	radius : '50%',				// 设置波纹的圆角(border-radius)，默认是 '50%'，此时波纹就是圆的，如果小于 50% 会变成圆角矩形，为 0% 时就是矩形
	opacity : '0.375',			// 设置波纹透明度(opacity)，默认是 '0.375'，不强求是 String，这里其实用 Number 类型值也行的，结果并没有什么区别
	color : 'currentColor',		// 设置波纹的颜色(background-color)，默认是 'currentColor' 既 xj-ripple 标签的 color 属性，支持所有颜色值的写法
	bg : '',					// 设置波纹的背景(background)，默认是 ''，也就是不设置，该参数被设置时会覆盖 color 参数，可用图片或渐变做波纹了
	
	top : 'auto',				// 波纹在 Y 轴的圆心位置，默认是 'auto'，既鼠标或触屏点击处的 Y，这里支持 'px' 和 '%' 的单位
	left : 'auto',				// 波纹在 X 轴的圆心位置，默认是 'auto'，既鼠标或触屏点击处的 X，这里支持 'px' 和 '%' 的单位
	
	offsetLeft : '0px',			// 波纹在 X 轴的定位偏移，默认是 '0px'，正数往右偏移，负数往左偏移，这里支持 'px' 和 '%' 单位
	offsetTop : '0px',			// 波纹在 Y 轴的定位偏移，默认是 '0px'，正数往下偏移，负数往上偏移，这里支持 'px' 和 '%' 单位
	
	width : 'auto',				// 波纹的宽度，默认是 'auto'，'auto' 的默认值将会覆盖到容器的边缘，这里支持 'px' 和 '%' 的单位
	height : 'auto',			// 波纹的高度，默认是 'auto'，'auto' 的默认值将会覆盖到容器的边缘，这里支持 'px' 和 '%' 的单位
	
	minWidth : '0px',			// 波纹的最小宽度，默认是 '0px'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要大于 maxWidth
	minHeight : '0px',			// 波纹的最小高度，默认是 '0px'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要大于 maxHeight
	
	maxWidth : 'none',			// 波纹的最大宽度，默认是 'none'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要小于 minWidth
	maxHeight : 'none',			// 波纹的最大高度，默认是 'none'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要小于 minHeight
	
	extraWidth : '0px',			// 波纹的额外宽度，默认是 '0px'，也可以是负值，这里支持 'px' 和 '%' 单位，用于额外的添加或减去尺寸
	extraHeight : '0px',		// 波纹的额外高度，默认是 '0px'，也可以是负值，这里支持 'px' 和 '%' 单位，用于额外的添加或减去尺寸
	
	insertBefore : pub_nothing,			// 波纹插入文档前执行的函数，event 参数是触发波纹的事件对象，ripple 参数是将被插入的波纹节点
	insertAfter : pub_nothing,			// 波纹插入文档后执行的函数，event 参数是触发波纹的事件对象，ripple 参数是已被插入的波纹节点
	
	destroyCallback : pub_nothing,		// 波纹移除文档前执行的回调，event 参数是触发移除的事件对象，ripple 参数是已被移除的波纹节点
	
	transitionProperty : 'transform, opacity',		// 波纹过渡动画的属性值，默认是 'transform, opacity'
	transitionDuration : '500ms',					// 波纹过渡动画的时长值，默认是 '500ms'
	transitionTimingFunction : 'ease-out',			// 波纹过渡动画的缓动值，默认是 'ease-out'
	transitionDelay : '0ms, 125ms',					// 波纹过渡动画的延迟值，默认是 '0ms, 125ms'
	
	// 波纹要插入的目标位置，默认是 'auto'，也就是波纹将作为被点击的目标节点的子元素，但是波纹也可以通过设置该参数来插入到其它位置去
	// 这里也可以接受一个 function，参数是触发波纹的 target 节点，你可以使用这个参数自行找到要插入的目标，然后在函数中返回找到的节点
	// 如果参数不是以 :self 或者 :parent 开头，将会使用 document.querySelector( ) 方法选择元素节点，然后将波纹插入到选中的目标节点中
	// 如果参数以 :parent 开头，例如 ':parent div button'，将转成 target.parentElement.querySelect('div button')
	// 如果参数以 :self 开头，例如 ':self div button'，将转成 target.querySelector('div button')
	insertTarget : 'auto',
	
};



// ---------------------------------------------------------------------------------------------
// 如果已经存在了就直接返回目标对象
if(pub_global.xj === undefined){ pub_global.xj = {} };
if(pub_global.xj.rippleReturn === undefined){ pub_global.xj.rippleReturn = {} };
if(pub_global.xj.rippleReturn[pub_version] !== undefined){ return pub_global.xj.rippleReturn[pub_version] };



// 创建并合并 config 和 option 参数
if(pub_global.xj.rippleConfig === undefined){ pub_global.xj.rippleConfig = {} };
if(pub_global.xj.rippleOption === undefined){ pub_global.xj.rippleOption = {} };
if(pub_global.xj.rippleConfig[pub_version] !== undefined){ Object.keys(pub_global.xj.rippleConfig[pub_version]).forEach(function(key){ pub_config[key] = pub_global.xj.rippleConfig[pub_version][key] }) };
if(pub_global.xj.rippleOption[pub_version] !== undefined){ Object.keys(pub_global.xj.rippleOption[pub_version]).forEach(function(key){ pub_option[key] = pub_global.xj.rippleOption[pub_version][key] }) };



// 创建页面最顶层四个全局节点的变量
var pub_win = pub_global;
var pub_doc = pub_win.document;
var pub_html = pub_doc.documentElement;
var pub_body = pub_doc.body;



// 判断浏览器，触屏变量，单位的尾缀
var pub_is_ie_or_ff = (pub_doc.documentMode || /edge|firefox/i.test(navigator.userAgent));
var pub_is_touchable = 'ontouchstart' in pub_doc, pub_is_touchmove = false;
var pub_is_pixel_unit = function(s){ return /px$/i.test(s) };



// 用于获取 offsetLeft | Top 的变量
var pub_offsetNode = pub_doc.createElement('xj-ripple-temporary');
pub_offsetNode.id = 'xj-ripple-temporary';



// ---------------------------------------------------------------------------------------------
// 创建波纹的函数，第二个参数是容器
var createRipple = function(event, target, special, options){
	
	
	
	// 每个波纹都要需要重新生成配置，因为它们都是独立的，不能修改 pub_option，否则会相互影响到的
	// 将 pub_option | options | inlineOption 三个对象都推入 optionList 数组中，最后遍历合并对象
	var option = {};								// 最终的参数对象
	var optionList = [];							// 承载参数的数组
	
	var evalNode = target;							// xj-ripple="{}"
	var evalText = '';								// {objectString}
	
	var disabledNode = target.parentElement;		// target.parentElement
	var disabledFlag = false;						// prevent ripple respond
	
	var targetWidth = 0;							// target width，width + padding
	var targetHeight = 0;							// target height, height + padding
	
	var rippleLeft = 0;								// ripple left
	var rippleTop = 0;								// ripple top
	
	var rippleWidth = 0;							// ripple width
	var rippleHeight = 0;							// ripple height
	
	var maxWidth = 0;								// ripple maxWidth
	var maxHeight = 0;								// ripple maxHeight
	
	var minWidth = 0;								// ripple minWidth
	var minHeight = 0;								// ripple minHeight
	
	var offsetRect = null;							// offsetNode DOMRect
	var rippleNode = null;							// ripple element Node
	
	var mouseleave = pub_nothing;					// target mouseleave callback
	var mouseenter = pub_nothing;					// target mouseleave callback
	var mouseup = pub_nothing;						// document mouseup callback
	
	
	
	// IE10 的 SVG 标签似乎没有 getAttribute 属性，所以遇到 SVG 的时候下面的遍历循环逻辑就会出错
	// 更重要的是 SVG 标签无法容纳普通标签为子元素，所以波纹也无法配合 SVG，只能遇到就直接返回了
	if(evalNode.closest('svg') !== null){ return };
	
	// 获取目标节点以及所有节点父元素的 xj-ripple 内联属性，用 eval 命令解析成对象，也推入到数组
	// 由于 evalNode 必定是元素节点，所以遍历中也不需要再使用进行 evalNode.nodeType === 1 的判断
	while(evalNode !== null){
		
		// 获取节点的内联属性解析成参数对象，eval 参数中加括号是为了让引擎识别为对象而不是代码块
		// 使用 unshift 方法添加到数组的左侧，是为了降低优先级，该数组的元素，将从左到右遍历覆盖
		evalText = evalNode.getAttribute('xj-ripple') ;
		if(evalText !== '' 
		&& evalText !== null 
		&& evalText !== undefined){ 
		optionList.unshift(eval('('+ evalText +')')) };
		
		// 如果没 xj-ripple 内联属性，或是有内联属性且允许自动继承，就继续往上查找父节点内联属性
		// 如果 inhreit 参数为 false，那就是属性不再继承，那么就不再继续往上查找了，清空节点变量
		if(evalNode.hasAttribute('xj-ripple') === false 
		|| optionList[0].inherit === void 0 
		|| optionList[0].inherit === true){
		evalNode = evalNode.parentElement }
		else{ evalNode = null };
		
	};
	
	// 使用 unshift 方法将 options & pub_option 对象参数推入到 optionList 前端，因为它们权重最低
	// 遍历数组 optionList，将数组中的对象合并到 option 对象中，之后创建波纹就用 option 进行操作
	if(options){ optionList.unshift(options) };
	optionList.unshift(pub_option);
	optionList
	.forEach(function(obj){
		Object.keys(obj).forEach(function(key){ option[key] = obj[key] });
	});
	
	
	
	// 如果有 event 对象，并且事件是 mousedown，但点击的并不是需要响应的那个鼠标键，则返回不响应
	// 移动端绑定的是 touchend 事件，所以并不需要检测 event.button，所以只有鼠标按下时才需要检测
	if(event 
	&& event.type === 'mousedown' 
	&& option.mouse.indexOf(event.button) === -1){ return };
	
	// insertTarget 不为 auto 那波纹就是要插入到其它容器，那么尝试获取目标容器并更新 target 变量
	// insertTarget 可以是函数或者是前缀 :self 或 :parent 的选择器，找不到 target 节点则直接返回
	if(option.insertTarget !== 'auto'){
		if(typeof(option.insertTarget) === 'function'){ target = option.insertTarget(target) }else 
		if(option.insertTarget.indexOf(':parent') === 0){ target = target.parentElement.querySelector(option.insertTarget.replace(/^:parent\s*/, '')) }else 
		if(option.insertTarget.indexOf(':self') === 0){ target = target.querySelector(option.insertTarget.replace(/^:self\s*/, '')) }else 
		if(/^:(self|parent)/.test(option.insertTarget) === false){ target = pub_doc.querySelector(option.insertTarget) };
		if(target === null || target === undefined || (target instanceof Element) === false){ return };
	};
	
	// 单标签和 audio 等标签不支持插入子元素，直接不响应更好，免得还得用 .button:not(input) 写法
	// 在响应后如果标签的 position 是 static，则波纹定位会不准，所以得排除 position:static; 情况
	if(target.matches(pub_config.preventSelector) === true){ return }else 
	if(pub_win.getComputedStyle(target).position === 'static'){ return };
	
	// createRipple 函数在执行之前已经检测 target 不是 disabled 状态，之后应该检测上层节点的状态
	// 判断 target 节点的上级元素是否处于 disabled 状态，是否有 disabled 类名或 not-allowed 样式
	if(option.forbid === true){
		while(disabledNode !== null && disabledFlag !== true){
			if(disabledNode.disabled === true 
			|| disabledNode.hasAttribute('disabled') === true 
			|| disabledNode.classList.contains('xj-ripple-disabled') === true 
			|| pub_win.getComputedStyle(disabledNode).cursor === 'not-allowed'){ disabledFlag = true }
			else{ disabledNode = disabledNode.parentElement };
		};
		if(disabledFlag === true){ return };
	};
	
	
	
	// 获取容器尺寸和波纹圆心，容器尺寸向上取整且能被 2 整除，这样波纹才能尽量覆盖到容器的边缘去
	targetWidth = Math.ceil(target.clientWidth);
	targetHeight = Math.ceil(target.clientHeight);
	if(targetWidth % 2 !== 0){ targetWidth += 1 };
	if(targetHeight % 2 !== 0){ targetHeight += 1 };
	rippleLeft = targetWidth / 2;
	rippleTop = targetHeight / 2;
	
	// 如果不是特殊波纹也不是要把波纹插入到其它位置去响应，那么波纹的圆心就是 tap 点击的那个位置
	if(special === false && option.insertTarget === 'auto'){
		
		// 添加 pub_offsetNode 节点到容器中，定位在容器的左上角，用于获取 offsetLeft & offsetTop
		if(option.append === true){ target.appendChild(pub_offsetNode) }
		else{ target.insertBefore(pub_offsetNode, target.firstChild) };
		
		// 添加 pub_offsetNode 节点到容器中计算，可解决左上角存在 border 和 scrollbar 的计算问题
		offsetRect = pub_offsetNode.getBoundingClientRect();
		rippleLeft = (event.clientX ? event.clientX : 
		event.changedTouches[0].clientX) - offsetRect.left;
		rippleTop = (event.clientY ? event.clientY : 
		event.changedTouches[0].clientY) - offsetRect.top;
		
		// 如果正处于 debug 模式，就不要移除位于 target 容器左上角用于计算位置的 offset 临时节点
		if(option.debug !== true){ target.removeChild(pub_offsetNode) };
		
	};
	
	// 如果有设置 left 或 top 参数，就用这两个参数代替上面计算的结果，这里分像素或百分比两种情况
	if(option.left !== 'auto'){ rippleLeft = pub_is_pixel_unit(option.left) ? 
	parseFloat(option.left) : (parseFloat(option.left)*targetWidth/100) };
	if(option.top !== 'auto'){ rippleTop = pub_is_pixel_unit(option.top) ? 
	parseFloat(option.top) : (parseFloat(option.top)*targetHeight/100) };
	
	// 如果有设置 offsetLeft 或 offsetTop 参数，就在这对圆心进行偏移，现在偏移会影响到波纹宽高度
	if(option.offsetLeft !== '0px'){ rippleLeft += (pub_is_pixel_unit(option.offsetLeft) ? 
	parseFloat(option.offsetLeft) : (parseFloat(option.offsetLeft)*targetWidth/100)) };
	if(option.offsetTop !== '0px'){ rippleTop += (pub_is_pixel_unit(option.offsetTop) ? 
	parseFloat(option.offsetTop) : (parseFloat(option.offsetTop)*targetHeight/100)) };
	
	
	
	// 波纹的宽高是 tap 点击那个位置距离所在容器最远那个点的距离，需要求出四条边，然后用最大那条
	rippleWidth = rippleHeight = (Math.ceil(													// 向上取整
		Math.sqrt(																				// 勾股定理开方
			Math.max(																			// 或取最大的那个值
				Math.pow(rippleLeft, 2) + Math.pow(rippleTop, 2),								// 左上角到点击处的距离
				Math.pow(targetWidth-rippleLeft, 2) + Math.pow(rippleTop, 2),					// 左上角到点击处的距离
				Math.pow(targetWidth-rippleLeft, 2) + Math.pow(targetHeight-rippleTop, 2),		// 右下角到点击处的距离
				Math.pow(rippleLeft, 2) + Math.pow(targetHeight-rippleTop, 2)					// 左下角到点击处的距离
			)
		)
	) * 2);
	
	// 根据参数重新设置波纹的尺寸，min & max 尺寸没有做相悖运算的判断，如果起了冲突以 min 为准？
	if(option.width  !== 'auto'){ rippleWidth  = pub_is_pixel_unit(option.width ) ? parseFloat(option.width ) : (parseFloat(option.width )*targetWidth /100) };
	if(option.height !== 'auto'){ rippleHeight = pub_is_pixel_unit(option.height) ? parseFloat(option.height) : (parseFloat(option.height)*targetHeight/100) };
	
	if(option.extraWidth  !== '0px'){ rippleWidth  += (pub_is_pixel_unit(option.extraWidth ) ? parseFloat(option.extraWidth ) : (parseFloat(option.extraWidth )*targetWidth /100)) };
	if(option.extraHeight !== '0px'){ rippleHeight += (pub_is_pixel_unit(option.extraHeight) ? parseFloat(option.extraHeight) : (parseFloat(option.extraHeight)*targetHeight/100)) };
	
	if(option.maxWidth  !== 'none'){ maxWidth  = pub_is_pixel_unit(option.maxWidth ) ? parseFloat(option.maxWidth ) : (parseFloat(option.maxWidth )*targetWidth /100); if(rippleWidth  > maxWidth ){ rippleWidth  = maxWidth  }; };
	if(option.maxHeight !== 'none'){ maxHeight = pub_is_pixel_unit(option.maxHeight) ? parseFloat(option.maxHeight) : (parseFloat(option.maxHeight)*targetHeight/100); if(rippleHeight > maxHeight){ rippleHeight = maxHeight }; };
	
	if(option.minWidth  !== '0px' ){ minWidth  = pub_is_pixel_unit(option.minWidth ) ? parseFloat(option.minWidth ) : (parseFloat(option.minWidth )*targetWidth /100); if(rippleWidth  < minWidth ){ rippleWidth  = minWidth  }; };
	if(option.minHeight !== '0px' ){ minHeight = pub_is_pixel_unit(option.minHeight) ? parseFloat(option.minHeight) : (parseFloat(option.minHeight)*targetHeight/100); if(rippleHeight < minHeight){ rippleHeight = minHeight }; };
	
	
	
	// 创建波纹节点并设置样式，定位还得减去波纹宽尺寸的一半，也就是将左上角定位变成 circleCenter
	rippleNode = pub_doc.createElement(option.nodeName);
	rippleNode.setAttribute('class', 'xj-ripple-element' + 
	(option.classString ? ' '+option.classString : ''));
	
	if(option.styleObject !== null){ Object.keys(option.styleObject).
	forEach(function(key){ rippleNode.style[key] = option.styleObject[key] }) };
	
	if(option.radius  !== '50%'         ){ rippleNode.style.borderRadius = option.radius   };
	if(option.opacity !== '0.375'       ){ rippleNode.style.opacity = option.opacity       };
	if(option.color   !== 'currentColor'){ rippleNode.style.backgroundColor = option.color };
	if(option.bg      !== ''            ){ rippleNode.style.background = option.bg         };
	
	if(option.transitionProperty       !== 'transform, opacity'){ rippleNode.style.transitionProperty       = option.transitionProperty       };
	if(option.transitionDuration       !== '500ms'             ){ rippleNode.style.transitionDuration       = option.transitionDuration       };
	if(option.transitionTimingFunction !== 'ease-out'          ){ rippleNode.style.transitionTimingFunction = option.transitionTimingFunction };
	if(option.transitionDelay          !== '0ms, 125ms'        ){ rippleNode.style.transitionDelay          = option.transitionDelay          };
	
	rippleNode.style.width  = rippleWidth  + 'px'; 
	rippleNode.style.height = rippleHeight + 'px';
	
	rippleNode.style.left = (rippleLeft - (rippleWidth  / 2)) + 'px'; 
	rippleNode.style.top  = (rippleTop  - (rippleHeight / 2)) + 'px';
	
	
	
	// 鼠标按下后未放开，挪开时波纹缩回去，IE & Firefox 不支持鼠标按下后绑定这些事件，就不响应了
	mouseleave = function(){ if(pub_is_ie_or_ff === false && pub_is_touchable === false){ rippleNode.style.transform = 'scale(0)' } };
	mouseenter = function(){ if(pub_is_ie_or_ff === false && pub_is_touchable === false){ rippleNode.style.transform = 'scale(1)' } };
	
	// 鼠标抬起，解除鼠标进入,退出,抬起这三个事件的绑定，绑定 transitionend 以移除波纹节点并回调
	mouseup = function(){
		
		if(event !== null){
			target.removeEventListener('mouseleave', mouseleave, true);
			target.removeEventListener('mouseenter', mouseenter, true);
			pub_doc.removeEventListener('mouseup', mouseup, true);
		};
		
		rippleNode.addEventListener('transitionend', function(event){
			if(event.propertyName == 'opacity'){
				if(option.debug === false){ 
				target.removeChild(rippleNode) };
				option.destroyCallback(event, rippleNode);
			};
		}, true);
		
		rippleNode.style.opacity = '0';
		
	};
	
	// event 对象存在时就是真实事件触发了波纹效果，那么在 target & document 上绑定鼠标的相关事件
	if(event !== null){
		target.addEventListener('mouseleave', mouseleave, true);
		target.addEventListener('mouseenter', mouseenter, true);
		pub_doc.addEventListener('mouseup', mouseup, true);
	};
	
	// 将 ripple 波纹标签写到 target 容器中，并在写入之前和写入之后执行 before 回调和 after 回调
	option.insertBefore(event, rippleNode);
	if(option.append === true){ target.appendChild(rippleNode) }
	else{ target.insertBefore(rippleNode, target.firstChild) };
	option.insertAfter(event, rippleNode);
	
	// 通过调用 clientWidth 属性强制渲染，设置 scale 缩放属性，是触屏操作或 create，那就自动销毁
	rippleNode.clientWidth;
	rippleNode.style.transform = 'scale(1)';
	if(event === null || event.type === 'touchend'){ mouseup() };
	
	
	
};



// ---------------------------------------------------------------------------------------------
// IOS 不支持 mousedown，干脆触屏设备都改用 touchend，没触发 touchmove 的 touchend，就会触发波纹
if(pub_is_touchable === true){
	pub_doc.addEventListener('touchstart', function(){ pub_is_touchmove = false }, true);
	pub_doc.addEventListener('touchmove', function(){ pub_is_touchmove = true }, true);
};

// 在 document 上绑定事件，非触屏使用 mousedown 事件，触屏则使用 touchend 事件，执行 create 函数
pub_doc.addEventListener(pub_is_touchable === true ? 'touchend' : 'mousedown', function(event) {
	
	var closest = null;
	var special = undefined;
	
	if(pub_is_touchable === true && pub_is_touchmove === true){ return }
	else if(event.isTrusted === false || event.target.nodeType !== 1){ return };
	
	if(closest = event.target.closest(pub_config.specialSelector)){ special = true }
	else if(closest = event.target.closest(pub_config.defaultSelector)){ special = false };
	
	if(closest === null || special === undefined){ return };
	
	if(closest.disabled === true 
	|| closest.hasAttribute('disabled') === true 
	|| closest.classList.contains('xj-ripple-disabled') === true 
	|| pub_win.getComputedStyle(closest).cursor === 'not-allowed'){ return };
	
	createRipple(event, closest, special, null);
	
}, true);



// ---------------------------------------------------------------------------------------------
// 添加 existClass 类名
if(pub_config.classTarget !== null && pub_config.existClass !== ''
){ pub_config.classTarget.classList.add( pub_config.existClass ) };

// 设置并且返回结果对象
return (pub_global.xj[pub_keyword+'Return'][pub_version] = { version:pub_version, 
create:function(target, options){ createRipple(null, target, true, options) }, });



})); // 插件结束


