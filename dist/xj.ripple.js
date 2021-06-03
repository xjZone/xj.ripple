/** xj.ripple(点击波纹特效) | V0.3.0 | Apache Licence 2.0 | 2018-2021 © XJ.Chen | https://github.com/xjZone/xj.ripple */
;(function(global, factory){
	if(typeof(define) === 'function' && (define.amd !== undefined || define.cmd !== undefined)){ define(factory) }
	else if(typeof(module) !== 'undefined' && typeof(exports) === 'object'){ module.exports = factory() }
	else{ global = (global||self), global.xj||(global.xj = {}), global.xj.ripple = factory(); };
}(this, function(){ 'use strict';



// Polyfill : closest V3.0.2
// jonathantneal - https://github.com/jonathantneal/closest，实际上插件还统一了 matches 方法
!function(){var a=window.Element.prototype;"function"!=typeof a.matches&&(a.matches=a.msMatchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||function(a){for(var b=this,c=(b.document||b.ownerDocument).querySelectorAll(a),d=0;c[d]&&c[d]!==b;)++d;return Boolean(c[d])}),"function"!=typeof a.closest&&(a.closest=function(a){for(var b=this;b&&1===b.nodeType;){if(b.matches(a))return b;b=b.parentNode}return null})}();

// Polyfill : classList V0.1.1
// 源自 xj.operate，解决 IE10 的 SVG 标签不支持 classList 对象的 3 个方法 : pub_hasClass() / pub_addClass() / pub_delClass()
var pub_hasClass,pub_addClass,pub_delClass;!function(){pub_hasClass=function(a,b){var c,d;return a.classList?a.classList.contains(b):(c=a.getAttribute("class"),d=c?c.split(/\s+/):[],-1===d.indexOf(b)?!1:!0)},pub_addClass=function(a,b){var c,d;return a.classList?a.classList.add(b):(c=a.getAttribute("class"),d=c?c.split(/\s+/):[],0===d.length?a.setAttribute("class",b):-1===d.indexOf(b)&&a.setAttribute("class",d.join(" ")+" "+b),void 0)},pub_delClass=function(a,b){var c,d;return a.classList?a.classList.remove(b):(c=a.getAttribute("class"),d=c?c.split(/\s+/):[],c="",-1!==d.indexOf(b)&&(d.forEach(function(a){a!==b&&(c+=a+" ")}),a.setAttribute("class",c.trim())),void 0)}}();



// ---------------------------------------------------------------------------------------------
// globalThis | window | self | global
var pub_global = (typeof(globalThis) !== 'undefined' ? globalThis : typeof(window) !== 'undefined' ? window : typeof(self) !== 'undefined' ? self : global);

// public nothing, version, keyword
var pub_nothing = function(){}, pub_version = '0.3.0', pub_keyword = 'ripple';

// public config, advance set
var pub_config = {
	
	// 要添加 existClass 类名的目标节点，默认是 html 标签节点，之所以不是 body，是因为插件在初始化时 body 标签可能还未加载，不推荐修改
	classTarget : document.documentElement,
	
	// 初始化后 targetClass 元素节点会被添加这个参数的类名，默认是 'xj-ripple-exist'，这个可用于 CSS 判断环境中是否存在 xj.ripple 插件
	existClass : 'xj-ripple-exist',
	
	// 当元素节点符合 defaultClass 字符串参数中的任意一个选择器，那么点击的时候就会响应波纹效果，默认值为 '.xj-ripple, .xj-ripple-out'
	// '.xj-ripple' 与 '.xj-ripple-out' 的区别在于，前者的波纹不会溢出，而后者的波纹会溢出，溢出只用于测试，正式环境中很少会用到该效果
	// 如果希望某些元素，例如 button，默认就带波纹效果，可以将 'button' 添加到这个分组选择器中，这样就不需要对每个 button 都设置类名了
	// 当然你得为 button 标签设置 position:relative; 或 position:absolute;，否则波纹无法相对定位，而 overflow:hidden; 设置则不是必须的
	defaultClass : '.xj-ripple, .xj-ripple-out',
	
	// 与 defaultClass 参数类似，符合这个选择器的元素，点击所产生的波纹会水平垂直居中定位，默认为 '.xj-ripple-mid, .xj-ripple-out-mid'
	// 希望某元素自带这种波纹，也可以将选择器以分组选择器的形式追加到参数中，注意该元素不能是 position:static;，否则波纹将无法准确定位
	specialClass : '.xj-ripple-mid, .xj-ripple-out-mid',
	
};

// public option(32 items)
var pub_option = {
	
	debug : false,									// 进入调试模式，默认为 false，如果将该属性设置为 true 则触发 mouseup 事件或 touchend 事件之后，不会自动删除插件生成的节点，这样方便进行开发调试
	append : true,									// 波纹追加模式，默认是 true，也就是将 ripple 波纹标签写入到目标容器里的最后面，如果这个参数设置为 false，则是将波纹标签写入到目标容器里的最前面
	
	mouse : [0],									// 响应鼠标按键，默认是 [0]，也就是只有点击左键才会响应，数值 012 分别代表鼠标左键中键右键，希望中键右键也响应，可以将数值添加进数组
	forbid : true,									// 自动禁止响应，默认是 true，也就是当目标所在的上层标签有 disabled 属性或 xj-ripple-disabled 类名或 cursor:not-allowed 样式则不响应
	inherit : true,									// 自动继承属性，默认是 true，也就是如果元素的上层标签设置了 xj-ripple="{}" 属性，那么这个属性会被子元素继承，除非子元素自己也设置了
	
	nodeName : 'xj-ripple',							// 波纹标签名称，默认是 'xj-ripple'，之所以使用自定义的标签名称生成节点，是为了避免节点被常规的标签选择器样式影响到
	
	classString : '',								// 波纹标签上额外的类名，默认是空 ''，多个值可用空格隔开，例如 'col-success bg-warning rad4px'
	styleString : '',								// 波纹标签上额外的样式，默认是空 ''，类似内联样式的写法，例如 'border:2px;border-radius:4px;'
	
	opacity : '0.375',								// 设置波纹透明度(opacity)，默认是 '0.375'，这里其实用 Number 类型值也行，结果并没有什么区别的
	radius : '50%',									// 设置波纹的圆角(border-radius)，默认是 '50%'，由于标签尺寸为 1px * 1px，所以参数其实只有 '50%' 或 '0%' 两个值可选
	color : 'currentColor',							// 设置波纹的颜色(box-shadow-color)，默认是 'currentColor'，也就是使用 'xj-ripple' 标签的 'color' 属性颜色，支持所有颜色属性值的写法
	
	width : 'auto',									// 波纹的宽度，默认是 'auto'，默认的值将会覆盖到容器的边缘，可设置为 '8px' 或 '20%' 等，这里支持 'px' 和 '%' 的单位
	height : 'auto',								// 波纹的高度，默认是 'auto'，默认的值将会覆盖到容器的边缘，可设置为 '8px' 或 '20%' 等，这里支持 'px' 和 '%' 的单位
	
	minWidth : '0px',								// 波纹的最小宽度，默认是 '0px'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要大于 maxWidth
	minHeight : '0px',								// 波纹的最小高度，默认是 '0px'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要大于 maxHeight
	
	maxWidth : 'none',								// 波纹的最大宽度，默认是 'none'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要小于 minWidth
	maxHeight : 'none',								// 波纹的最大高度，默认是 'none'，也就是不设置，这里支持 'px' 和 '%' 单位，注意不要小于 minHeight
	
	extraWidth : '0px',								// 波纹的额外宽度，默认是 '0px'，也可以是负值，这里支持 'px' 和 '%' 单位，用于额外的添加或减去尺寸
	extraHeight : '0px',							// 波纹的额外高度，默认是 '0px'，也可以是负值，这里支持 'px' 和 '%' 单位，用于额外的添加或减去尺寸
	
	left : 'auto',									// 设置波纹圆心的 X 轴位置，默认是 'auto'，既点击处的 X，可以设置为 '10px' 或 '20%' 等，这里支持 'px' 和 '%' 的单位
	top : 'auto',									// 设置波纹圆心的 Y 轴位置，默认是 'auto'，既点击处的 Y，可以设置为 '10px' 或 '20%' 等，这里支持 'px' 和 '%' 的单位
	
	offsetLeft : '0px',								// 波纹定位 X 轴偏移值，默认是 '0px'，可设置为负值如 '-10px'，正数往右偏移，负数往左偏移，这里支持 'px' 和 '%' 单位
	offsetTop : '0px',								// 波纹定位 Y 轴偏移值，默认是 '0px'，可设置为负值如 '-10px'，正数往下偏移，负数往上偏移，这里支持 'px' 和 '%' 单位
	
	transitionProperty : 'transform, opacity',		// 波纹过渡动画的属性，默认是 'transform, opacity'
	transitionDuration : '500ms',					// 波纹过渡动画的时长，默认是 '500ms'
	transitionTimingFunction : 'ease-out',			// 波纹过渡动画的缓动，默认是 'ease-out'
	transitionDelay : '0ms, 125ms',					// 波纹过渡动画的延迟，默认是 '0ms, 125ms'
	
	specialRatio : 1.5,								// 当波纹以 specialClass 模式响应时尺寸的设置，默认为 1.5，也就是容器最长那条边的 1.5 倍，可确保波纹能覆盖到容器的边缘，也可根据需要设置成其它值
	
	createBefore : pub_nothing,						// 波纹写入前执行的函数，第一个参数 event 是事件对象，第二个参数是将被插入的 ripple 波纹节点 
	createAfter : pub_nothing,						// 波纹写入后执行的函数，第一个参数 event 是事件对象，第二个参数是已被插入的 ripple 波纹节点 
	
	removeCallback : pub_nothing,					// 移除波纹前执行的回调，第一个参数 event 是事件对象，第二个参数是已被移除的 ripple 波纹节点
	
	// 波纹要插入的位置，默认为 'auto' 既 ripple 波纹将会作为目标节点的直接子元素，但是 ripple 波纹也可以插入到其它位置去的
	// 这里也可以接受一个函数，函数的参数是 target 节点，你可以使用这个参数自行找到要插入的目标，然后在函数中返回找到的节点
	// 如果参数不是以 self 或 parent 开头，会用 document.querySelector() 方法选择元素节点，然后将波纹插入到选中的目标节点中
	// 参数以 parent 开头，例如 'parent div button'，将会转成 target.parentElement.querySelect('div button');
	// 参数以 self 开头，例如 'self div button'，将会转成 target.querySelector('div button');
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



// 用于获取 offsetLeft / Top 的变量
var pub_offsetNode = null;
var pub_offsetRect = null;
pub_offsetNode = pub_doc.createElement('xj-ripple-temporary');
pub_offsetNode.setAttribute('id', 'xj-ripple-temporary');



// ---------------------------------------------------------------------------------------------
// 判断浏览器以及判断触屏事件的变量
var is_ieFirefox = (pub_doc.documentMode || /edge|firefox/i.test(navigator.userAgent));
var is_touchable = 'ontouchstart' in pub_win;
var is_touchmove = false;



// 判断是否带 px 单位，判断是否移动
var is_suffix_px = function(val){ return /px$/i.test(val) ? true : false };



// 创建波纹的函数，第二个参数是容器
var createRipple = function(event, target, special, options){
	
	
	
	// 每个波纹都要需要重新生成配置，不能修改 pub_option 对象，否则会相互影响的
	// 将 pub_option / options / inlineOption 对象推入 optionList，最后遍历合并
	var option = {};								// 最终的参数对象
	var optionList = [];							// 承载参数的数组
	
	var evalNode = target;							// xj-ripple="{}"
	var evalText = '';								// {objectString}
	
	var disabledNode = target.parentElement;		// target.parentElement
	var disabledFlag = false;						// prevent ripple respond
	
	var tw = 0;										// target width，width + padding
	var th = 0;										// target height, height + padding
	
	var rl = 0;										// ripple left
	var rt = 0;										// ripple top
	
	var rw = 0;										// ripple width
	var rh = 0;										// ripple height
	
	var maxWidth = 0;								// ripple maxWidth
	var maxHeight = 0;								// ripple maxHeight
	
	var minWidth = 0;								// ripple minWidth
	var minHeight = 0;								// ripple minHeight
	
	var tag = null;									// ripple node
	var cssText = '';								// ripple styleValue
	var scaleValue = '1, 1';						// ripple transform:scale
	
	var mouseleave = pub_nothing;					// target mouseleave callback
	var mouseenter = pub_nothing;					// target mouseleave callback
	var mouseup = pub_nothing;						// document mouseup callback
	
	
	
	// IE10 的 SVG 标签似乎没有 getAttribute 属性，所以当响应这个事件时就会出错
	// SVG 标签无法容纳普通标签为子元素，所以波纹也无法配合 SVG，只能直接返回了
	if(evalNode.closest('svg') !== null){ return };
	
	// 获取节点的 xj-ripple="{}" 内联属性，用 eval 命令解析成对象，也推入到数组
	// evalNode 必定是元素节点，所以不需要再进行 evalNode.nodeType === 1 的判断
	while(evalNode !== null){
		
		// 获取节点内联属性解析成对象，加括号是为了让引擎识别为对象而不是代码块
		// 添加到数组的左侧，是为了降低优先级，该数组的元素，将从左到右遍历覆盖
		if(evalText = evalNode.getAttribute('xj-ripple')){ optionList.unshift(eval('('+ evalText +')')) };
		
		// 没内联属性或是有内联属性且允许自动继承，就继续往上查找父节点内联属性
		// 如果 inhreit 为 false 就是属性不再继承，那么就不再查找，清空节点变量
		if(evalNode.hasAttribute('xj-ripple') === false 
		|| optionList[0].inherit === undefined 
		|| optionList[0].inherit === true)
		{ evalNode = evalNode.parentElement }
		else{ evalNode = null };
		
	};
	
	// 将 options & pub_option 对象参数推入到 optionList 前端，因为它们权重最低
	// 遍历 optionList 数组，合并对象到 option 对象中，之后就用 option 进行操作
	if(options){ optionList.unshift(options) };
	optionList.unshift(pub_option);
	optionList
	.forEach(function(obj){
		Object.keys(obj).forEach(function(key){ option[key] = obj[key] });
	});
	
	
	
	// 有 event 对象，是 mousedown 事件，但不是需要响应的鼠标键，那就返回不响应
	// 移动端绑定的是 touchend 事件，并不需要进行检测，所以只有鼠标按下时才检测
	if(event && event.type === 'mousedown' && option.mouse.indexOf(event.button) === -1){ return };
	
	// 波纹要插入到其它容器，就尝试获取目标容器并更新 target 变量，找不到也返回
	// insertTarget 参数可以是一个函数，也可以是前缀 self | parent 的特殊选择器
	if(option.insertTarget !== 'auto'){
		if(typeof(option.insertTarget) === 'function'){ target = option.insertTarget(target) }else 
		if(option.insertTarget.indexOf('parent') === 0){ target = target.parentElement.querySelector(option.insertTarget.replace(/^parent\s*/, '')) }else 
		if(option.insertTarget.indexOf('self') === 0){ target = target.querySelector(option.insertTarget.replace(/^self\s*/, '')) }else 
		if(/^self|parent/i.test(option.insertTarget) === false){ target = pub_doc.querySelector(option.insertTarget) };
		if(target === null || target === undefined || (target instanceof Element) === false){ return };
	};
	
	// 执行本函数前已检测 target 不是 disabled 状态，之后应该检测上层节点的状态
	// 判断上级元素，是否处于 disabled 状态，是否有 disabled 类名或 not-allowed
	if(option.forbid === true){
		while(disabledNode !== null && disabledFlag === false){
			if(disabledNode.disabled === true 
			|| disabledNode.hasAttribute('disabled') === true 
			|| pub_hasClass(disabledNode, 'xj-ripple-disabled') === true 
			|| pub_win.getComputedStyle(disabledNode).cursor === 'not-allowed') 
			{ disabledFlag = true }else{ disabledNode = disabledNode.parentElement };
		};
		if(disabledFlag === true){ return };
	};
	
	
	
	// 获取波纹所在节点的尺寸 content+padding，和波纹的位置(默认在容器的正中间)
	tw = target.clientWidth;		// target width
	th = target.clientHeight;		// target height
	rl = tw/2;						// ripple left
	rt = th/2;						// ripple top
	
	// 如果不是特殊波纹，并且也不是要在其它的位置响应，则圆心就是鼠标点击的位置
	if(special === false && option.insertTarget === 'auto'){
		
		// 添加 pub_offsetNode 到容器的左上角，用于获取 offsetLeft 和 offsetTop
		if(option.append === true){ target.appendChild(pub_offsetNode) }
		else{ target.insertBefore(pub_offsetNode, target.firstChild) };
		pub_offsetRect = pub_offsetNode.getBoundingClientRect();
		
		// 添加 pub_offsetNode 的做法可解决左上角存在边框和滚动条的尺寸计算问题
		rl = (event.clientX ? event.clientX : event.changedTouches[0].clientX) - pub_offsetRect.left;
		rt = (event.clientY ? event.clientY : event.changedTouches[0].clientY) - pub_offsetRect.top;
		if(option.debug === false){ target.removeChild(pub_offsetNode) };
		
	};
	
	// 根据 left / top 参数重设 rl / rt，偏移要到后面设置，否则将影响到波纹尺寸
	if(option.left !== 'auto'){ if(is_suffix_px(option.left) === true){ rl = parseFloat(option.left) }else{ rl = parseFloat(option.left)*tw/100 } };
	if(option.top  !== 'auto'){ if(is_suffix_px(option.top ) === true){ rt = parseFloat(option.top ) }else{ rt = parseFloat(option.top )*th/100 } };
	
	
	
	// 特殊波纹或其它位置，波纹宽高是最长边*1.5，否则是点击处和最远那个点的距离
	if(special === true || option.insertTarget !== 'auto'){
		rw = rh = (Math.ceil(Math.max(tw,th)) * 
			option.specialRatio);
	}else{
		rw = rh = (Math.ceil(									// 向上取整
			Math.sqrt(											// 勾股定理开方
				Math.max(										// 或取最大的那个值
					Math.pow(rl,2) + Math.pow(rt,2),			// 左上角到点击处的距离
					Math.pow(tw-rl,2) + Math.pow(rt,2),			// 左上角到点击处的距离
					Math.pow(tw-rl,2) + Math.pow(th-rt,2),		// 右下角到点击处的距离
					Math.pow(rl,2) + Math.pow(th-rt,2)			// 左下角到点击处的距离
				)
			)
		)*2);
	};
	
	// 根据参数重设波纹的尺寸，min 和 max 没有做相悖运算，起了冲突以 min 为准？
	if(option.width  !== 'auto'){ if(is_suffix_px(option.width )){ rw = parseFloat(option.width ) }else{ rw = parseFloat(option.width )*tw/100 } };
	if(option.height !== 'auto'){ if(is_suffix_px(option.height)){ rh = parseFloat(option.height) }else{ rh = parseFloat(option.height)*th/100 } };
	
	if(option.extraWidth  !== '0px'){ if(is_suffix_px(option.extraWidth )){ rw += parseFloat(option.extraWidth ) }else{ rw += parseFloat(option.extraWidth )*tw/100 }; };
	if(option.extraHeight !== '0px'){ if(is_suffix_px(option.extraHeight)){ rh += parseFloat(option.extraHeight) }else{ rh += parseFloat(option.extraHeight)*th/100 }; };
	
	if(option.maxWidth  !== 'none'){ if(is_suffix_px(option.maxWidth )){ maxWidth  = parseFloat(option.maxWidth ) }else{ maxWidth  = parseFloat(option.maxWidth )*tw/100 }; if(rw > maxWidth ){ rw = maxWidth  }; };
	if(option.maxHeight !== 'none'){ if(is_suffix_px(option.maxHeight)){ maxHeight = parseFloat(option.maxHeight) }else{ maxHeight = parseFloat(option.maxHeight)*th/100 }; if(rh > maxHeight){ rh = maxHeight }; };
	
	if(option.minWidth  !== '0px' ){ if(is_suffix_px(option.minWidth )){ minWidth  = parseFloat(option.minWidth ) }else{ minWidth  = parseFloat(option.minWidth )*tw/100 }; if(rw < minWidth ){ rw = minWidth  }; };
	if(option.minHeight !== '0px' ){ if(is_suffix_px(option.minHeight)){ minHeight = parseFloat(option.minHeight) }else{ minHeight = parseFloat(option.minHeight)*th/100 }; if(rh < minHeight){ rh = minHeight }; };
	
	// 定位偏移在这里才设置，以免影响到波纹的尺寸，因为定位会影响到波纹的宽高度
	if(option.offsetLeft !== '0px'){ if(is_suffix_px(option.offsetLeft)){ rl += parseFloat(option.offsetLeft) }else{ rl += parseFloat(option.offsetLeft)*tw/100 } };
	if(option.offsetTop  !== '0px'){ if(is_suffix_px(option.offsetTop )){ rt += parseFloat(option.offsetTop ) }else{ rt += parseFloat(option.offsetTop )*th/100 } };
	
	// absolute 可能导致出现滚动条，所以 rl 不能大于 tw - 1，rt 不能大于 th - 1
	if(rl > tw - 1){ rl = tw - 1 };
	if(rt > th - 1){ rt = th - 1 };
	
	// 当点击在左上角的边框或滚动条时，定位将会小于 padding 原点(0, 0)，也要纠正
	if(rl < 0){ rl = 0 };
	if(rt < 0){ rt = 0 };
	
	
	
	// 创建 ripple，使用 box-shadow 实现 ripple 尺寸，就不怕溢出导致出现滚动条了
	tag = pub_doc.createElement(option.nodeName);
	tag.setAttribute('class', 'xj-ripple-element' + (option.classString ? ' '+option.classString : ''));
	
	cssText = option.styleString;
	
	if(option.opacity !== '0.375'){ cssText += 'opacity:' + option.opacity + ';' };
	if(option.radius !== '50%'){ cssText += 'border-radius:' + option.radius + ';' };
	if(option.color !== 'currentColor'){ cssText += 'color:' + option.color + ';' };
	
	if(option.transitionProperty !== 'transform, opacity'){ cssText += 'transition-property:' + option.transitionProperty + ';' };
	if(option.transitionDuration !== '500ms'){ cssText += 'transition-duration:' + option.transitionDuration + ';' };
	if(option.transitionTimingFunction !== 'ease-out'){ cssText += 'transition-timing-function:' + option.transitionTimingFunction + ';' };
	if(option.transitionDelay !== '0ms, 125ms'){ cssText += 'transition-delay:' + option.transitionDelay + ';' };
	
	cssText += ('box-shadow:0 0 0 ' + Math.max(rw, rh)/2 + 'px currentColor;');
	cssText += ('left:'+ rl +'px;' + 'top:'+ rt +'px;');
	tag.setAttribute('style', cssText);
	
	
	
	// 设置宽高比例，有 width / height 参数时可能波纹是椭圆的，用 scale 实现椭圆
	if(rw > rh){ scaleValue = '1, ' + rh/rw };
	if(rw < rh){ scaleValue = rw/rh + ', 1' };
	
	// 鼠标挪开波纹缩回去，IE & Firefox 不支持鼠标按下后绑定这些事件，就不响应了
	mouseleave = function(){ if(is_ieFirefox === false && is_touchable === false){ tag.style.transform = 'scale(0, 0)' } };
	mouseenter = function(){ if(is_ieFirefox === false && is_touchable === false){ tag.style.transform = 'scale('+ scaleValue +')' } };
	
	// 鼠标抬起时，解除这些事件的绑定，绑定 transitionend 事件，移除 tag 并回调
	mouseup = function(){
		
		if(event !== null){
			target.removeEventListener('mouseleave', mouseleave, true);
			target.removeEventListener('mouseenter', mouseenter, true);
			pub_doc.removeEventListener('mouseup', mouseup, true);
		};
		
		tag.addEventListener('transitionend', function(event){
			if(event.propertyName == 'opacity'){
				if(option.debug === false){ target.removeChild(tag) };
				option.removeCallback(event, tag);
			};
		}, true);
		
		tag.style.opacity = '0';
		
	};
	
	// 真实的事件，存在 event 对象，就在 target & document 上绑定鼠标的相关事件
	if(event !== null){
		target.addEventListener('mouseleave', mouseleave, true);
		target.addEventListener('mouseenter', mouseenter, true);
		pub_doc.addEventListener('mouseup', mouseup, true);
	};
	
	// 将 tag 既 ripple 波纹标签写到 target 中，并在此之前和之后执行回调的参数
	option.createBefore(event, tag);
	if(option.append === true){ target.appendChild(tag) }
	else{ target.insertBefore(tag, target.firstChild) };
	option.createAfter(event, tag);
	
	// 强制渲染 tag，设置 scale 缩放属性，如果是触屏操作或 create，那就自动销毁
	tag.clientWidth;
	tag.style.transform = 'scale('+ scaleValue +')';
	if(event === null || (typeof(event) === 'object' && event.type === 'touchend')){ mouseup() };
	
	
	
};



// ---------------------------------------------------------------------------------------------
// IOS 不支持 mousedown，干脆触屏设备都改用 touchend，没触发 touchmove 的 touchend，就会触发波纹
if(is_touchable === true){
	pub_doc.addEventListener('touchstart', function(){ is_touchmove = false }, true);
	pub_doc.addEventListener('touchmove', function(){ is_touchmove = true }, true);
};

// 在 document 上绑定事件，非触屏使用 mousedown 事件，触屏则使用 touchend 事件，执行 create 函数
pub_doc.addEventListener(is_touchable === true ? 'touchend' : 'mousedown', function(event){
	
	var closest = null;
	var special = undefined;
	
	if(is_touchable === true && is_touchmove === true){ return }
	if(event.isTrusted === false || event.target.nodeType !== 1){ return };
	
	if(closest = event.target.closest(pub_config.specialClass)){ special = true }
	else if(closest = event.target.closest(pub_config.defaultClass)){ special = false };
	
	if(closest === null || special === undefined){ return };
	
	if(closest.disabled === true 
	|| closest.hasAttribute('disabled') === true 
	|| pub_hasClass(closest, 'xj-ripple-disabled') === true
	|| pub_win.getComputedStyle(closest).cursor === 'not-allowed'){ return };
	
	createRipple(event, closest, special, null);
	
}, true);



// ---------------------------------------------------------------------------------------------
// 添加 existClass 类名
if(pub_config.classTarget !== null && pub_config.existClass !== ''){ pub_addClass(pub_config.classTarget, pub_config.existClass) };

// 设置并且返回对象
return (pub_global.xj.rippleReturn[pub_version] = {version:pub_version, create:function(target, options){ createRipple(null, target, true, options) } });



})); // 插件结束


