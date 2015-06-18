$(function() {
	FastClick && FastClick.attach(document.body); //调用fastClick加快手机端的click事件时间
	$('.footer li').on('click', function(e) {
		var tar = $(e.target);
		tar = K.getTarparanetByClass(tar, 'glyphicon');
		var url = tar.data('target');
		$('.footer li').removeClass('selected');
		tar.addClass('selected');
		url ? location.href = url : '';
	});
});