$(function() {
    $('.container-fluid').css({
        'height': window.screen.height - 96 + 'px'
    });
    $("#btnSearch").click(function () {
        fillTemplate($("#txtSearchKey").val());
    });
    $("#txtSearchKey").keyup(function () {
        fillTemplate($(this).val());
    });
    $("#btnSpeech").click(function(){
        startRecognize();
    });
    // loadMore();
    fillTemplate('');
});
function fillTemplate(keywords) {
    $.ajax({
        data:{api_token: API_TOKEN, k: keywords},
        url: apiUrl + "report/worker/list",
        success: function(result) {
            if (result.code) {
                var data = result.data;
                var tpl = new Template($('#tpl').html()),
                    htmls = [], row,d;
                for (var i = 0; i < data.length; i++) {
                    d = data[i];
                    row = {
                        url: '',//'img/headimg/' + headimgs[K.getRandomByM(0, 6)],
                        // user_id: d['id'],
                        username: d['name'],
                        iphone: d['phone'],
                        // salary: d['salary'],
                        str: JSON.stringify(d),
                        strHtml:d['url']?('<img src="'+d['url']+'">'):('<i class="first-name '+['yellow','pink','green'][parseInt(Math.random() *10) %3]+'">'+d['name'].slice(0,1)+'</i>'),

                            total: d['total_salary'],
                        //     owe: 0,
                        //     income: 0
                        // }
                    };
                    htmls.push('<li>' + tpl.render(row) + '</li>');
                }
                $('.list-form ul').empty().html(htmls.join(''));

                //存储点击的工人信息
                $(".user-bill").click(function () {
                    localStorage.setItem('worker_str', $(this).attr("str"));
                    window.location.href = "workerDetail.html";
                });

                $('.glyphicon-earphone ~ em').on('click',function(e){
                    var tar = $(e.target),phone=tar.html();
                    APP.showActionSheet(phone);
                });
            }
        }
    });
}

function startRecognize () {
    var options = {engine: 'iFly', punctuation: false},
        txtSpeech = $("#txtSearchKey");

    txtSpeech.attr('placeholder', '开始语音输入...').val('');
    plus.speech.startRecognize( options, function ( s ) {
        txtSpeech.val(s);
        fillTemplate(s);
    }, function ( e ) {
        outSet( "语音识别失败："+e.message );
    } );
}

function loadMore()
{
    var page = 0, size = 10;
    $('.list-form').dropload({
        scrollArea : window,
        loadDownFn : function(me){
            $.ajax({
                type: 'GET',
                url: apiUrl + 'report/worker/list',
                data: {api_token: API_TOKEN, page: page, size: size},
                success: function(res){
                    if (res && res.code && res.data.length > 0) {
                        var data = res.data;
                        var tpl = new Template($('#tpl').html()),
                            htmls = "", row,d;
                        for (var i = 0; i < data.length; i++) {
                            d = data[i];
                            row = {
                                username: d['name'],
                                iphone: d['phone'],
                                str: JSON.stringify(d),
                                strHtml:d['url']?('<img src="'+d['url']+'">'):('<i class="first-name '+['yellow','pink','green'][parseInt(Math.random() *10) %3]+'">'+d['name'].slice(0,1)+'</i>'),
                                total: d['total']
                            };
                            htmls += '<li>' + tpl.render(row) + '</li>';
                        }
                        // 插入数据到页面，放到最后面
                        $('.list-form ul').append(htmls);
                        // 每次数据插入，必须重置
                        me.resetload();

                        //存储点击的工人信息
                        $(".user-bill").click(function () {
                            localStorage.setItem('worker_str', $(this).attr("str"));
                            window.location.href = "workerDetail.html";
                        });

                        $('.glyphicon-earphone ~ em').on('click',function(e){
                            var tar = $(e.target),phone=tar.html();
                            APP.showActionSheet(phone);
                        });
                    } else {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                        me.resetload();
                    }
                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    // me.resetload();
                }
            });
            page++;
        }
    });
}