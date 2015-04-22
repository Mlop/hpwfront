var userModule = (function() {
	'use strict';
	var userModule = {
        //页面初始化
        register: function() {
            $("#register-form").on('submit', function(){
                if ($("#txtPasswordRetry").val() != $("#txtPassword").val()) {
                    return false;
                }
                var postData = globalModule.getJsonDataFromSeriaArr($(this).serializeArray());
                globalModule.jsonp('user', 'register', postData, userModule.afterLogin);
                return false;
            });
        },
        afterRegister: function(result) {
            console.log(result);
        },
        //页面初始化
        login: function(phone, pwd) {
            globalModule.jsonp('user', 'login', {'User[phone]':phone, 'User[password]':pwd}, userModule.afterLogin);
        },
        afterLogin: function(result) {
            if (result.error == 0) {
                var user = result.msg;
                window.localStorage['user-id'] = user.user_id;
                window.localStorage['user-name'] = user.name;
                window.localStorage['phone'] = user.phone;
                window.location.href = 'index.html';
            } else {

            }
        },
    }

	return userModule;
}());