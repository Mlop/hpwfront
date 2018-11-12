$(function() {
    $('#feeModal').on('shown.bs.modal', function () {
        $('#txtMeals').trigger('focus')
    });
    $('#fundModal').on('shown.bs.modal', function () {
        $('#txtFund').trigger('focus')
    })

    $('.user-info').on('click', function(e) {
        APP.alert('程序开发中','友情提示');
    });
    $('.settings label').on('click', function(e) {
        var tar = $(e.target),
            tarFor = tar.attr('for'),
            check = $('#' + tarFor),
            p = $('#' + tarFor).parent();
        check.is(":checked") ? p.removeClass('on') : p.addClass('on');
    });
    $.ajax({
        data:{api_token: API_TOKEN},
        url: apiUrl + "user/get",
        success: function(result) {
            if (result.code) {
                //餐费
                var fee = result.data.meals_fee;
                $("#spMeals").text(fee);
                $("#txtMeals").val(fee);
                //用户信息
                var tpl = new Template($('#tpl').html());
                $('.user-info').empty().html(tpl.render(result.data));
            }
        }
    });
    $("#btnSaveFee").click(function () {
        $.ajax({
            type: "post",
            data:{api_token: API_TOKEN, value: $("#txtMeals").val()},
            url: apiUrl + "settings/update/meals",
            success: function(result) {
                console.log(result);
                if (result.code) {
                    $('#feeModal').modal('hide');
                    //餐费
                    $("#spMeals").text(result.data.value);
                }
            }
        });
    });
    $("#btnSaveFund").click(function () {
        $.ajax({
            type: "post",
            data:{api_token: API_TOKEN, cash: $("#txtFund").val()},
            url: apiUrl + "user/fund",
            success: function(result) {
                console.log(result);
                if (result.code) {
                    $('#fundModal').modal('hide');
                    //餐费
                    // $("#spMeals").text(result.data.value);
                }
            }
        });
    });
});