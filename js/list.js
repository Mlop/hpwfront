$(function() {
    $('.container-fluid').css({
        'height': window.screen.height - 96 + 'px'
    });
    fillTemplate();
});
function fillTemplate() {
    $.ajax({
        data:{api_token: API_TOKEN},
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
                        bill: {
                            total: d['total'],
                            owe: 0,
                            income: 0
                        }
                    };
                    console.log(row);
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