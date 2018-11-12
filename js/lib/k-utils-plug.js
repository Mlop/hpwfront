/**
 * @description 定义一些通用的插件函数
 * @author mlop 2015.04.13
 * @version v0.1
 */

/**
 * 简短的模板引擎
 * @link http://www.liaoxuefeng.com/article/001426512790239f83bfb47b1134b63b09a57548d06e5c5000
 * @param {Object} tpl 模板字符串
 * 调用方式：定义模板
 * <script id="tpl" type="text/plain">
 *   <p>Today: { date }</p>
 *   <a href="/{ user.id|safe }">{ user.company }</a>
 *  </script>
 *	使用：
 * var tpl = new Template($('#tpl').html());
 *	var s = tpl.render({
 *	    date: 20150101,
 *	    user: {
 *	        id: 'A-000&001',
 *	        company: 'AT&T'
 *	    }
 *	});
 *	$('#other').html(s);
 */
function Template(tpl) {
	var
		fn,
		match,
		// code = ['var r=[];\nvar _html = function (str) { str=Object.prototype.toString.call(str) ===\'[object String]\'?str:String(str); return str.replace(/&/g, \'&amp;\').replace(/"/g, \'&quot;\').replace(/\'/g, \'&#39;\').replace(/</g, \'&lt;\').replace(/>/g, \'&gt;\'); };'],
        code = ['var r=[];\nvar _html = function (str) { str=Object.prototype.toString.call(str) ===\'[object String]\'?str:String(str); return str.replace(/&/g, \'&amp;\'); };'],
		re = /\{\s*([a-zA-Z\.\_0-9()]+)(\s*\|\s*safe)?\s*\}/m,
		addLine = function(text) {
			code.push('r.push(\'' + text.replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '\');');
		};
	while (match = re.exec(tpl)) {
		if (match.index > 0) {
			addLine(tpl.slice(0, match.index));
		}
		console.log('while ',match[1]);
		if (match[2]) {
			code.push('r.push(String(this.' + match[1] + '));');
		} else {
			code.push('r.push(_html(this.' + match[1] + '));');
		}
		tpl = tpl.substring(match.index + match[0].length);
	}
	addLine(tpl);
	code.push('return r.join(\'\');');
	fn = new Function(code.join('\n'));
	this.render = function(model) {
		return fn.apply(model);
	};
}