var mapModule = (function() {
	'use strict';
	var mapModule = {
        mapLevel: 12,
        mapAutocomplete:false,
        mapLocal: false,
        //初始化地图
        initMap: function(mapID, suggestInputID) {
            var map = new BMap.Map(mapID);        //在container容器中创建一个地图,参数container为div的id属性;
//            map.centerAndZoom("北京", mapModule.mapLevel);
            mapModule.mapAutocomplete = new BMap.Autocomplete({"input" : suggestInputID});//建立一个自动完成的对象

            mapModule.locationCurrentCity(map);

            map.enableScrollWheelZoom();                //激活滚轮调整大小功能
            map.addControl(new BMap.NavigationControl());    //添加控件：缩放地图的控件，默认在左上角；

            map.addControl(new BMap.MapTypeControl());        //添加控件：地图类型控件，默认在右上方；

            map.addControl(new BMap.ScaleControl());        //添加控件：地图显示比例的控件，默认在左下方；
            // 添加带有定位的导航控件
            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 启用显示定位
                enableGeolocation: true
            });
            map.addControl(navigationControl);
            // 添加定位控件
            var geolocationControl = new BMap.GeolocationControl();
            geolocationControl.addEventListener("locationSuccess", function(e){
                // 定位成功事件
                var address = '';
                address += e.addressComponent.province;
                address += e.addressComponent.city;
                address += e.addressComponent.district;
                address += e.addressComponent.street;
                address += e.addressComponent.streetNumber;
                alert("当前定位地址为：" + address);
            });
            geolocationControl.addEventListener("locationError",function(e){
                // 定位失败事件
                alert(e.message);
            });
            map.addControl(geolocationControl);

            //add search
//            mapModule.mapLocal = new BMap.LocalSearch(map, {
//                renderOptions:{map: map},
//                onSearchComplete:function(){
//                    console.log('complete');
//                }
//            });

            return map;
        },
        locationCurrentCity: function(map) {
            var myCity = new BMap.LocalCity();
            var cityName = "北京市";
            function getCity(result) {
                if (result && result.name) {
                    cityName = result.name;

                    console.log(cityName);
                }

                map.centerAndZoom(cityName, mapModule.mapLevel);
                if (mapModule.mapAutocomplete) {
                    mapModule.mapAutocomplete.setLocation(cityName);
                }
            }
            myCity.get(getCity);
            return myCity;
        },
        // 百度地图API功能
        G: function(id) {
            return document.getElementById(id);
        },
        autoCompleteHighlightEvent: function(e) {

        },
        autoCompleteEvent: function(map, suggestInputID, searchResultPanelID) {
            var ac = mapModule.mapAutocomplete ? mapModule.mapAutocomplete : new BMap.Autocomplete({"input" : suggestInputID});

            ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                mapModule.G(searchResultPanelID).innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                mapModule.G(searchResultPanelID).innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                setPlace();
            });
            function setPlace(){
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun(result){
                    var resultPoi = mapModule.mapLocal.getResults().getPoi(0);
                    var pp = resultPoi.point;    //获取第一个智能搜索的结果
                    console.log(resultPoi);
                    map.centerAndZoom(pp, mapModule.mapLevel + 4);
                    map.addOverlay(new BMap.Marker(pp));    //添加标注
                }
                if (!mapModule.mapLocal) {
                    mapModule.mapLocal = new BMap.LocalSearch(map, { //智能搜索
                        renderOptions:{map: map},
                        onSearchComplete: myFun
                    });
                }
                mapModule.mapLocal.search(myValue);
            }

            return ac;
        },
        searchMap: function(map) {
            if (!mapModule.mapLocal) {
                mapModule.mapLocal = new BMap.LocalSearch(map, {
                    renderOptions:{map: map},
                });
            }
            var keywords = $("#inpSuggestDestination").val().trim();
            mapModule.mapLocal.search(keywords);
        }
    }

	return mapModule;
}());