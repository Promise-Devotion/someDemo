
(function(JH5player) {

    var _mode,
        _trackEvent;

    var DIMESION_UNITS = "px";

    var optionHolderInit = function (options) {
        var manifest = options._natives.manifest.options,
            opt = {};

        for (var k in manifest) {
            if (k in options) {
                opt[k] = options[k];
            }
            else if ('default' in manifest[k]) {
                opt[k] = manifest[k]['default'];
            }
        }

        return opt;
    };

    var optionHolderUpdate = function (holder, updates) {
        for (var k in updates) {
            if (k in holder) {
                holder[k] = updates[k];
            }
        }
    };
    /**
     * radarCharts JH5player plug-in
     * author: jiangb
     *
     * radarCharts:
     **/
    JH5player.plugin("radarCharts", {

        manifest: {
            about: {
                name: "JH5player radarCharts plugin",
                version: "0.1",
                author: "jiangb", website: "http://www.h5cld.cn"
            },
            options: {
                applyclass: {
                    default: { 
                        in: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: "none"
                        },
                        emphasis: {
                            effect: 'none', delay: 1.5, duration: 1, count: 1, direct: "none"
                        },
                        out: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: "none"
                        },
                    },
                    hidden: true,
                },
                animate: {
                    label: "Animate",
                    elem: "listview",
                    type: "json",
                    group: "trigger",
                    default: [],
                },
                trigger: {
                    label: "Trigger",
                    elem: "panelbar",
                    type: "json",
                    group: "trigger",
                    default: {
                        click: [],
                        longPressStart: [],
                        longPressStop: [],
                        hoverIn: [],
                        hoverOut: [],
                    }
                },
                width: {
                    elem: "input", type: "number", default: 480, units: DIMESION_UNITS, hidden: true
                },
                height: {
                    elem: "input", type: "number", default: 360, units: DIMESION_UNITS, hidden: true
                },
                top: {
                    elem: "input", type: "number", default: 0, units: DIMESION_UNITS, hidden: true
                },
                left: {
                    elem: "input", type: "number", default: 25, units: DIMESION_UNITS, hidden: true
                },
                start: {
                    elem: "input", type: "text", label: "Start", units: "seconds", hidden: true
                },
                end: {
                    elem: "input", type: "text", label: "End", units: "seconds", hidden: true
                },
                zindex: {
                    hidden: true
                },
                /* the radarCharts optionss **/
                title: {
                     elem: "input", type: "text", label: "Title", default: "Sales of phones."
                },
                chartTextColor: {
                    elem: "color",  type: "text", label: "Title Color", default: "black"
                },
                showLegend: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Legend", default: true, binds: [] 
                },
                showToolbox: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Toolbox", default: false, binds: []
                },
                spreadsheetData:  {
                    default: {
                        rows: [
                                { cells: [ { value: "", textAlign: "center", bold: "true" }, 
                                           { value: "Apple", textAlign: "center", bold: "true", background: "#2AB4C0" },
                                           { value: "Huawei", textAlign: "center", bold: "true", background: "#EF4836" },
                                           { value: "Samsung", textAlign: "center", bold: "true", background: "#8775A7" },
                                           { value: "Xiaomi", textAlign: "center", bold: "true", background: "#5C9BD1" },
                                           { value: "Lenovo", textAlign: "center", bold: "true", background: "#95A5A6" } ]
                                },
                                { cells: [ { value: "max" }, 
                                           { value: "2500" },
                                           { value: "2200" },
                                           { value: "1500" },
                                           { value: "2000" },
                                           { value: "1600" } ]
                                },
                                { cells: [ { value: "January" }, 
                                           { value: "2000" },
                                           { value: "1600" },
                                           { value: "500" },
                                           { value: "1000" },
                                           { value: "900" } ]
                                },
                                { cells: [ { value: "February" }, 
                                           { value: "1600" },
                                           { value: "1900" },
                                           { value: "1000" },
                                           { value: "1500" },
                                           { value: "1100" } ]
                                },
                                { cells: [ { value: "March" }, 
                                           { value: "2200" },
                                           { value: "2000" },
                                           { value: "900" },
                                           { value: "1600" },
                                           { value: "1000" } ]
                                }
                        ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                                [{ name: 'Apple', max: 2500, color: '#2AB4C0' },
                                 { name: 'Huawei', max: 2200, color: '#EF4836' },
                                 { name: 'Samsung', max: 1500, color: '#8775A7' },
                                 { name: 'Xiaomi', max: 2000, color: '#5C9BD1' },
                                 { name: 'Lenovo', max: 1600, color: '#95A5A6' }],

                                [{ name: 'January', value: [2000, 1600, 500, 1000, 900] },
                                 { name: 'February', value: [1600, 1900, 1000, 1500, 1100] },
                                 { name: 'March', value: [2200, 2000, 900, 1600, 1000] }]
                        ],
                    hidden: true
                },
                opacity: {
                    elem: "slider",  type: "number", min: 0, max: 1, step: 0.01, label: "Opacity", default: 1, units: "%"
                },
                rotation: {
                    elem: "slider",  type: "number", min: 0, max: 360, step: 1, label: "Rotation", default: 0, units: "deg"
                }   
            }
        },

        _setup: function (options, mode, trackEvent) {
            /*
             * it's a private container for holding the player element.
             **/
            var _container;
            
            _mode = mode;
            _trackEvent = trackEvent;

            options._radarChartsData = {};

            options._radarChartsData.legendData = [];
            options._radarChartsData.chartColor = [];
            options._radarChartsData.radarData = [];
            options._radarChartsData.chartsData = [];

            options._radarChartsData.option = {};

            
            //设置数据
            $.each(options.seriesData[0], function (i, item) {
                // 遍历设置color值
                 options._radarChartsData.chartColor.push(item.color);

                // 遍历series属性data的值
                options._radarChartsData.radarData[i] = {};
                options._radarChartsData.radarData[i]["max"] = item.max;
                options._radarChartsData.radarData[i]["name"] = item.name;
            });

            $.each(options.seriesData[1], function (i, item) {
                // 遍历设置legend属性name值
                options._radarChartsData.legendData.push(item.name);

                options._radarChartsData.chartsData[i] = {};
                options._radarChartsData.chartsData[i]["value"] = item.value;
                options._radarChartsData.chartsData[i]["name"] = item.name; 
            });


            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-radarCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._radarCharts = $('<div></div>')[0];

            $(options._radarCharts).css({ width: "100%", height: "100%" }).appendTo($(options._container));

            // 初始化myChart
            options._myChart = echarts.init(options._radarCharts);

            // 设置chart基本属性
            options._radarChartsData.option = {
                title: {
                    text: options.title,
                    top: "10px",
                    left: "center",
                    textStyle: {
                        color: options.chartTextColor
                    }
                },

                tooltip: {
                           
                },

                color: options._radarChartsData.chartColor,

                radar: {
                    indicator: options._radarChartsData.radarData
                },

                series: [{
                    type: 'radar',
                    data : options._radarChartsData.chartsData
                }]
            };
            
    
            if (options.showLegend) {
                options._radarChartsData.option.legend = {
                    orient: "vertical",
                    left: "10px",
                    data: options._radarChartsData.legendData
                };
            }

            if (options.showToolbox) {
                options._radarChartsData.option.toolbox = {
                    feature: {
                        dataView: {readOnly: false},
                        restore: {}
                    }
                }
            }

            options._myChart.setOption(options._radarChartsData.option);

        
            // 将更新后的数据保存
            options._optHolder = optionHolderInit(options);
        },


        _update: function (options, updates) {
            // it updates the common properties, such as: color, 
            // background, font, shadow, border, opacity, rotation, etc.
            // you just care your special only.
            _trackEvent.updateJH5playerElement(options, updates);

            // to update the values with new, and sync holder.
            optionHolderUpdate(options._optHolder, updates);

            if ("title" in updates) {
                options._radarChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._radarChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._radarChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._radarChartsData.option);
            }

            if ("showLegend" in updates) {
                if (updates["showLegend"]) {
                    options._radarChartsData.option.legend = {
                        orient: "vertical",
                        left: "10px",
                        data: options._radarChartsData.legendData
                    }     
                }
                else {
                    options._radarChartsData.option.legend = null;
                }

                options._myChart = echarts.init(options._radarCharts);
                options._myChart.setOption(options._radarChartsData.option);
            }

            if ("showToolbox" in updates) {
                if(updates["showToolbox"]) {
                    options._radarChartsData.option.toolbox = {
                        feature: {
                            dataView: {readOnly: false},
                            restore: {}
                        }
                    }
                }
                else {
                    options._radarChartsData.option.toolbox = null;
                }

                options._myChart = echarts.init(options._radarCharts);
                options._myChart.setOption(options._radarChartsData.option);
            }

            
            // seriesData数据更新
            if ("seriesData" in updates) {
                options._radarChartsData.legendData = [];
                options._radarChartsData.radarData = [];
                options._radarChartsData.chartColor = [];
                options._radarChartsData.chartsData = [];

                $.each(updates["seriesData"][0], function (i, item) {
                    // 遍历设置color值
                    options._radarChartsData.chartColor.push(item.color);

                    // 遍历series属性data的值
                    options._radarChartsData.radarData[i] = {};
                    options._radarChartsData.radarData[i]["max"] = item.max;
                    options._radarChartsData.radarData[i]["name"] = item.name;
                });

                $.each(updates["seriesData"][1], function (i, item) {
                    // 遍历设置legend属性name值
                    options._radarChartsData.legendData.push(item.name);

                    options._radarChartsData.chartsData[i] = {};
                    options._radarChartsData.chartsData[i]["value"] = item.value;
                    options._radarChartsData.chartsData[i]["name"] = item.name; 
                });

                // 数据变化更新相应的值，保持最新
                options._radarChartsData.option.color = options._radarChartsData.chartColor;

                if (options._optHolder.showLegend) {
                    options._radarChartsData.option.legend.data = options._radarChartsData.legendData;
                }
                
                options._radarChartsData.option.radar.indicator = options._radarChartsData.radarData;

                $.each(options._radarChartsData.option.series, function (i, item) {
                    item.data = options._radarChartsData.chartsData;
                });

                options._myChart = echarts.init(options._radarCharts);
                options._myChart.setOption(options._radarChartsData.option);
            }

            // 尺寸发生变化，重新画图
            options._myChart.resize();       
        },

        start: function (event, options) {
            $(options._containerWithWrapper).removeClass('off');
        },

        end: function (event, options) {
            // don't handle the container's display ON/OFF here.
            // it will be handled in effects plugin.
        },

        frame: function (event, options, time) {},

        _teardown: function (options) {
            // TODO@do something here.
            // ...
            
            // to remove jh5player element from presentation container.
            _trackEvent.removeJH5playerElement(options);
        }, 
    });
}(window.JH5player));
