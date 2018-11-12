$(function() {
	var apiDomain = "http://jz.api.com";
	// $.ajax({
	// 	url: "http://jz.api.com/test?name=vvveee",
	// 	success: function(result) {
	// 		console.log(result);
	// 	}
	// });
	FastClick&&FastClick.attach(document.body);//调用fastClick加快手机端的click事件时间
	$('.footer li').on('click', function(e) {
		var tar = $(e.target),
			url = tar.data('target');
		$('.footer li').removeClass('selected');
		tar.addClass('selected');
		url ? location.href = url : '';
	});
});