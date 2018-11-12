//定义全局变量
var apiUrl = "http://jz.api.com/";
// var apiUrl = "http://119.27.163.89:8081/";
var API_TOKEN = localStorage.getItem('api_token');
var CLIENTSTATUS = {
    login: false,
    uid: 0,
    name: 'jizhang'
};
var globalModule = (function() {
    'use strict';
    var globalModule = {
        /**
         * 发送JSONP请求数据
         * @param controller api规定的控制器
         * @param action api规定的方法名
         * @param postData 提交的数据，JSON格式
         */
        jsonp: function(controller, action, postData, afterFun) {
            var base64 = new Base64();
            var code = CLIENTSTATUS.uid + "_" + CLIENTSTATUS.name + "_qfkong#" + Math.ceil(Math.random() * 1000);
            var sign = base64.encode(code);
            var sourceData = {'sign':sign, 'controller':controller, 'action':action};
            $.extend(sourceData, postData);

            $.ajax({
                url: apiUrl + 'api/callback',
                dataType: 'jsonp',
                jsonpCallback:"success_callback",
                data: sourceData,
                success: function(data){
                    //处理data数据
                    console.log(data);
                    if (afterFun != undefined) {
                        afterFun(data);
                    }
                },
                error:function(error, errorMsg, statusText){
                    console.log(errorMsg);
                }
            });
        },
        /**
         * 从$.serializeArray()中获取的JSON对象，获取JSON数据
         * @param seriaArr $.serializeArray()返回值
         * @returns JSON对象
         */
        getJsonDataFromSeriaArr: function(seriaArr) {
            var postJson = {};
            for(var key in seriaArr) {
                postJson[seriaArr[key]["name"]] = seriaArr[key]["value"];
            }
            return postJson;
        }
    }
    return globalModule;
}());