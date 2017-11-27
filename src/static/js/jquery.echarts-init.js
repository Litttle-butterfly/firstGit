/**
 * 快捷配置echats图表
 *by lrc
 */
(function ($) {
    let echarts=require('echarts');
    /*获取x轴项目名*/
    let getAxis = function (data) {
        var axissArray = [];
        for (var i = 0, len = data.length; i < len; i++) {
            axissArray.push(data[i].name)
        }
        return axissArray;
    }

    /*获取分类*/
    let getLegend = function (data) {
        var legendArray = [];
        for (var i = 0, len = data.length; i < len; i++) {
            legendArray.push(data[i].name);
        }
        return legendArray;
    }

    /*获取series数据*/
    let getSeries = function (types, data, stack) {
        var seriesArray = [];
        if (types && data)
            for (var i = 0, len = types.length; i < len; i++) {
                var series = {itemStyle: {normal: {color: ""}}};
                series.type = types[i];
                series.name = data[i].name;
                series.smooth=true;
                stack ? series.stack = len : "";
                if (len > 1) {
                    // if (types[0] == "bar") {
                    //     series.itemStyle.normal.color = function (params) {
                    //         var colorList = [
                    //             '#2EC7C9', '#FFB980', '#5AB1EF', '#B6A2DE',
                    //             '#D87A80', '#8D98B3', '#E5CF0D', '#97B552'
                    //         ];
                    //         return colorList[params.dataIndex]
                    //     }
                    // }
                    series.data = data[i].value;
                } else {
                    series.data = data[i].value;
                }
                seriesArray.push(series);
            }
        return seriesArray;
    }

    /*获取地图数据*/
    let getMapSeries = function (data) {
        var defaults = {
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [],
            },
            series: []
        };
        if (data)
            for (var i = 0, len = data.length; i < len; i++) {
                defaults.legend.data.push(data[i].seriesMapName);
                var series = {
                    type: 'map',
                    roam: false,
                    showLegendSymbol:false,
                    label: {
                        normal: {
                            show: data[i].seriesLabel
                        }
                    }
                };
                series.name = data[i].seriesMapName;
                series.mapType = data[i].seriesMapType;
                series.data = data[i].seriesMapData;
                defaults.series.push(series);

            }
        return defaults;
    }

    let setLoading = function (ec) {
        ec.showLoading();
    }

    let hideLoading = function (ec) {
        ec.hideLoading();
    }

    /*初始化图表loading*/
    $.fn.echartsInitLoading = function () {
        var myChart = echarts.init($(this)[0]);
        myChart.showLoading();
    }

    /*使用传递参数作为options*/
    $.fn.echartsInitByOptions = function (options) {
        var myChart = echarts.init($(this)[0], "macarons");
        myChart.setOption(options);
    }

    /*根据配置项加载线图和柱图--支持多图*/
    $.fn.echartsSetDataForLineBar = function (options) {
        var myChart = echarts.init($(this)[0], "macarons");
        // 指定图表的配置项和数据
        var defaults = {
            title: {},
            tooltip: {trigger: 'axis',confine:true},
            legend: {},
            toolbox: {right:20,feature: {saveAsImage: {pixelRatio: 2,name:options.imgname}}},
            grid: {},
            xAxis: {},
            yAxis: {},
            series: []
        };
        //解析数据，生成options
        defaults.title.text = options.title;
        if (options.seriesTypes && options.seriesTypes.length > 0) {
            defaults.legend.data = options.legend && options.legend.length > 1 ? options.legend : getLegend(options.seriesData);
        }
        defaults.grid = options.grid ? options.grid : {};
        options.dataZoom?defaults.dataZoom=options.dataZoom:'';
        options.axisDirec && options.axisDirec == "y" ?
            (defaults.yAxis.data = options.axis && options.axis.length > 0 ? options.axis : getAxis(options.seriesData)) :
            (defaults.xAxis.data = options.axis && options.axis.length > 0 ? options.axis : getAxis(options.seriesData));
        defaults.series = getSeries(options.seriesTypes, options.seriesData, options.stack)
        myChart.clear();
        myChart.setOption(defaults);
    }

    $.fn.echartsSetDataSpecialForLineBar = function (options) {
        var myChart = echarts.init($(this)[0], "macarons");
         // 指定图表的配置项和数据
        var defaults = {
            xAxis: {type: 'category',boundaryGap: false,data: options.axis,show:false},
            yAxis: {type: 'value',show:false,boundaryGap: [0, '100%']},
            //grid:{height:40},
            series: [
                {
                    name:options.title,
                    type:options.seriesTypes,
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }])
                        }
                    },
                    data: options.seriesData
                }
            ]
        };
        myChart.clear();
        myChart.setOption(defaults);

    }

    $.fn.echartsSetDataDateZoomForLineBar = function (options) {
        var myChart = echarts.init($(this)[0], "macarons");
         // 指定图表的配置项和数据
        var defaults = {
            grid:{height:0,},
            dataZoom: [{show: true,realtime: true,start: 65,end: 85}],
            xAxis : [{type : 'category',boundaryGap : false,show:false,data : options.axis}],
            yAxis: [{name: '',show:false,type: 'value',}],
            series: [{name:'',type:'line',symbol:'none',
                    lineStyle:{normal:{show:false,opacity:0,}},
                    data:[]}]};
        defaults.series = getSeries(options.seriesTypes, options.seriesData, options.stack)
        myChart.clear();
        myChart.setOption(defaults);

    }

    /*根据配置项加载饼图*/
    $.fn.echartsSetDataForPie = function (options) {
        var myChart = echarts.init($(this)[0], "macarons");
        // 指定图表的配置项和数据
        var defaults = {
            title: {
                show:false,
                x: 'center'
            },
            tooltip: {
                confine:true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: { show: true,right:20, feature: { saveAsImage: {name:options.imgname} } },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [{
                type: 'pie',
                center: ['50%', '60%']
            }]
        };

        //解析数据，生成options
        defaults.title.text = options.title;
        defaults.legend.data = options.legend && options.legend.length > 0 ? options.legend : getLegend(options.seriesData);
        options.legendShow?defaults.legend.show=true:defaults.legend.show=false;
        defaults.series[0].radius = options.seriesRadius, defaults.series[0].data = options.seriesData;
        defaults.series[0].name=options.seriesname;
        myChart.clear();
        myChart.setOption(defaults);
    }

    /*根据配置项加载地图*/
    $.fn.echartsSetDataForMap = function (options) {
        var myChart = echarts.init($(this)[0], "macarons");
        // 指定图表的配置项和数据
        var defaults = {
            title: {
                x: 'center'
            },
            tooltip: {confine:true},
            legend: {},
            toolbox: {right:20,feature: {saveAsImage: {pixelRatio: 2,name:options.imgname}}},
            visualMap: {
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],
                calculable: true
            },
            series: []
        };

        //解析数据，生成options
        defaults.title.text = options.title;
        defaults.visualMap.min = options.visualMapMin ? options.visualMapMin : 0;
        defaults.visualMap.max = options.visualMapMax==0?100:options.visualMapMax;
        defaults = $.extend({}, defaults, getMapSeries(options.series));
        myChart.clear();
        myChart.setOption(defaults);
    }

})(jQuery)
