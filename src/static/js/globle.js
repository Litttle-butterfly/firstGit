export function InitiateSideMenu() {
	$(".sidebar-toggler").on("click",
	function() {
		return $("#sidebar").toggleClass("hide"),
		$(".sidebar-toggler").toggleClass("active"),
		!1
	});
	var n = $("#sidebar").hasClass("menu-compact");
	$("#sidebar-collapse").on("click",
	function() {
		$("#sidebar").is(":visible") || $("#sidebar").toggleClass("hide");
		$("#sidebar").toggleClass("menu-compact");
		$(".sidebar-collapse").toggleClass("active");
		n = $("#sidebar").hasClass("menu-compact");
		n && $(".open > .submenu").removeClass("open")
	});
	$(".sidebar-menu").on("click",
	function(t) {
		var i = $(t.target).closest("a"),u,r,f;
		i.hasClass("menu-dropdown")?$(".sidebar-menu .menu-dropdown").removeClass('active'):''
		$(".mo").removeClass("active"),$(".su").removeClass("active")
		$(i).toggleClass("active")
		if (i && i.length != 0) {
			if (!i.hasClass("menu-dropdown")) return n && i.get(0).parentNode.parentNode == this && (u = i.find(".menu-text").get(0), t.target != u && !$.contains(u, t.target)) ? !1 : void 0;
			if (r = i.next().get(0), !$(r).is(":visible")) {
				if (f = $(r.parentNode).closest("ul"), n && f.hasClass("sidebar-menu")) return;
				f.find("> .open > .submenu").each(function() {
					this == r || $(this.parentNode).hasClass("active") || $(this).slideUp(200).parent().removeClass("open")
				})
			}
			return n && $(r.parentNode.parentNode).hasClass("sidebar-menu") ? !1 : ($(r).slideToggle(200).parent().toggleClass("open"), !1)
		}
	})
}


//写Cookie
export function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

//读Cookie
export function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}
//删除cookie
export function delCookie (name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//日期格式化录入
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//日期天数更改
export function Redate(day,aday){
  var a = new Date(day)
  a = a.valueOf()
  a = a + aday * 24 * 60 * 60 * 1000
  a = new Date(a).Format('yyyy/MM/dd');
  return a;
}

export function mymouse(ev){
   return $(ev.target).focus()
 }