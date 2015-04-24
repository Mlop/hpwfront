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
            switch(result.error) {
                case 0:
                    var user = result.msg;
                    window.localStorage['user-id'] = user.user_id;
                    window.localStorage['user-name'] = user.name;
                    window.localStorage['phone'] = user.phone;
                    window.location.href = 'index.html';
                    break;
                case 1:
                    var error = "";
                    for(var field in result.msg) {
                        var errorMsg = result.msg[field];
                        for(var i=0; i < errorMsg.length; i++) {
                            error += errorMsg[i];
                        }
                        alert(field + "  " + error);
                    }
                    break;
                case 2:
                    alert(result.msg);
                    break;
            }
        },
        //获取所有借入，借出列表
        createRecord: function() {
            var controller = ($("#selType").val() == "borrow") ? "incount" : "outcount";
            var postData = globalModule.getJsonDataFromSeriaArr($("#account-form").serializeArray());
            postData["Account[user_id]"] = window.localStorage['user-id'];

            globalModule.jsonp(controller, 'create', postData, function(res){
                window.location.href = 'record.html';
            });
        }
    }

	return userModule;
}());