
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
     * lineCharts JH5player plug-in
     * author: jiangb
     *
     * lineCharts:
     **/
    JH5player.plugin("lineCharts", {

        manifest: {
            about: {
                name: "JH5player lineCharts plugin",
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
                /* the lineCharts optionss **/
                title: {
                     elem: "input", type: "text", label: "Title", default: "This is line charts."
                },
                chartTextColor: {
                    elem: "color",  type: "text", label: "Title Color", default: "black"
                },
                showLegend: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Legend", default: false, binds: [] 
                },
                areaStyle: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Area Style", default: false, binds: []
                },
                spreadsheetData:  {
                    default: {
                        rows: [
                                { cells: [ { value: "X-AXIS", textAlign: "center", bold: "true" }, 
                                           { value: "NAME1", textAlign: "center", bold: "true", background: "#ea157a" },
                                           { value: "NAME2", textAlign: "center", bold: "true", background: "#1ab39f" },
                                           { value: "NAME3", textAlign: "center", bold: "true", background: "#00addc" }]
                                },
                                { cells: [ { value: "a" }, 
                                           { value: "1" },
                                           { value: "2" },
                                           { value: "5" }]
                                },
                                { cells: [ { value: "b" }, 
                                           { value: "2" },
                                           { value: "5" },
                                           { value: "2" }]
                                },
                                { cells: [ { value: "c" }, 
                                           { value: "4" },
                                           { value: "1" },
                                           { value: "5" }]
                                },
                                { cells: [ { value: "d" }, 
                                           { value: "2" },
                                           { value: "6" },
                                           { value: "3" }]
                                },
                                { cells: [ { value: "e" }, 
                                           { value: "5" },
                                           { value: "1" },
                                           { value: "3" }]
                                }
                        ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                            { xAxis: ["a", "b", "c", "d", "e"] },
                            { value: [[1, 2, 4, 2, 5], [2, 5, 1, 6, 1], [5, 2, 5, 3, 3]] },
                            { name: ['NAME1', 'NAME2', 'NAME3'] },
                            { color: ['#ea157a', '#1ab39f', '#00addc'] }
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

            options._lineChartsData = {};

            options._lineChartsData.axis = [];
            options._lineChartsData.values = [];
            options._lineChartsData.legendData = [];
            options._lineChartsData.chartColor = [];
            options._lineChartsData.stack = [];

            options._lineChartsData.option = {};

            
            options._lineChartsData.axis = options.seriesData[0].xAxis;
            options._lineChartsData.values = options.seriesData[1].value;
            options._lineChartsData.legendData = options.seriesData[2].name;
            options._lineChartsData.chartColor = options.seriesData[3].color;

            if (options.seriesData.length > 4) {
                options._lineChartsData.stack = options.seriesData[4].stack;
            }



            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-lineCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._lineChart = $('<div></div>')[0];

            $(options._lineChart).css({ width: "100%", height: "100%" }).appendTo($(options._container));


            // 初始化myChart
            options._myChart = echarts.init(options._lineChart);

            // 设置chart基本属性
            options._lineChartsData.option = {
                title: {
                    text: options.title,
                    top: "10px",
                    left: "center",
                    textStyle: {
                        color: options.chartTextColor
                    }
                },
                tooltip : {
                    trigger: 'axis',
                },
                color: options._lineChartsData.chartColor,
                grid: {
                    left: '3%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : options._lineChartsData.axis
                    }
                ],
                yAxis: [
                    {
                        type : 'value'
                    }
                ]
            };

            // 设置初始状态serie
            options._lineChartsData.option.series = [];
            $.each(options._lineChartsData.legendData, function (i, item) {
                if (options.seriesData.length > 4) {
                    if (options.areaStyle) {
                        var seriesItem = {
                            name: item,
                            type: 'line',
                            areaStyle: {normal: {}},
                            stack: options._lineChartsData.stack[i],
                            data: options._lineChartsData.values[i],
                            animationDelay: function (idx) {
                                return idx * 10 * i;
                            }
                        };
                    }
                    else {
                        var seriesItem = {
                            name: item,
                            type: 'line',
                            stack: options._lineChartsData.stack[i],
                            data: options._lineChartsData.values[i],
                            animationDelay: function (idx) {
                                return idx * 10 * i;
                            }
                        };
                    }
                }
                else {
                    if (options.areaStyle) {
                        var seriesItem = {
                            name: item,
                            type: 'line',
                            areaStyle: {normal: {}},
                            data: options._lineChartsData.values[i],
                            animationDelay: function (idx) {
                                return idx * 10 * i;
                            }
                        };
                    }
                    else {
                        var seriesItem = {
                            name: item,
                            type: 'line',
                            data: options._lineChartsData.values[i],
                            animationDelay: function (idx) {
                                return idx * 10 * i;
                            }
                        };
                    }
                }
                
                options._lineChartsData.option.series.push(seriesItem);
            });



            // 设置legend
            if (options.showLegend) {
                options._lineChartsData.option.legend = {
                    data: options._lineChartsData.legendData,
                    align: 'left',
                    left: 10
                };
            }


            options._myChart.setOption(options._lineChartsData.option);


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
                options._lineChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._lineChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._lineChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._lineChartsData.option);
            }

            if ("showLegend" in updates) {
                if (updates["showLegend"]) {
                    options._lineChartsData.option.legend = {
                        data: options._lineChartsData.legendData,
                        align: 'left',
                        left: 10
                    };
                }
                else {
                    options._lineChartsData.option.legend = null;
                }

                options._myChart = echarts.init(options._lineChart);
                options._myChart.setOption(options._lineChartsData.option);
            }

            if ("areaStyle" in updates) {
                if (updates["areaStyle"]) {
                    $.each(options._lineChartsData.option.series, function (i, item) {
                        item["areaStyle"] = {normal: {}};
                    });
                }
                else {
                    $.each(options._lineChartsData.option.series, function (i, item) {
                        item["areaStyle"] = null;
                    });
                }

                options._myChart = echarts.init(options._lineChart);
                options._myChart.setOption(options._lineChartsData.option);
            }


            // 数据更新
            if ("seriesData" in updates) {
                options._lineChartsData.axis = updates["seriesData"][0].xAxis;
                options._lineChartsData.values = updates["seriesData"][1].value;
                options._lineChartsData.legendData = updates["seriesData"][2].name;
                options._lineChartsData.chartColor = updates["seriesData"][3].color;

                if (updates["seriesData"].length > 4) {
                    options._lineChartsData.stack = updates["seriesData"][4].stack;
                }

                options._myChart = echarts.init(options._lineChart);

                options._lineChartsData.option = {
                    title: {
                        text: options._optHolder.title,
                        top: "10px",
                        left: "center",
                        textStyle: {
                            color: options._optHolder.chartTextColor
                        }
                    },
                    tooltip : {
                        trigger: 'axis',
                    },
                    color: options._lineChartsData.chartColor,
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : options._lineChartsData.axis
                        }
                    ],
                    yAxis: [
                        {
                            type : 'value'
                        }
                    ]
                };

                options._lineChartsData.option.series = [];
                $.each(options._lineChartsData.legendData, function (i, item) {
                    if (updates["seriesData"].length > 4) {
                        if (options._optHolder.areaStyle) {
                            var seriesItem = {
                                name: item,
                                type: 'line',
                                areaStyle: {normal: {}},
                                stack: options._lineChartsData.stack[i],
                                data: options._lineChartsData.values[i],
                                animationDelay: function (idx) {
                                    return idx * 10 * i;
                                }
                            };
                        }
                        else {
                            var seriesItem = {
                                name: item,
                                type: 'line',
                                stack: options._lineChartsData.stack[i],
                                data: options._lineChartsData.values[i],
                                animationDelay: function (idx) {
                                    return idx * 10 * i;
                                }
                            };
                        }
                    }
                    else {
                        if (options._optHolder.areaStyle) {
                            var seriesItem = {
                                name: item,
                                type: 'line',
                                areaStyle: {normal: {}},
                                data: options._lineChartsData.values[i],
                                animationDelay: function (idx) {
                                    return idx * 10 * i;
                                }
                            };
                        }
                        else {
                            var seriesItem = {
                                name: item,
                                type: 'line',
                                data: options._lineChartsData.values[i],
                                animationDelay: function (idx) {
                                    return idx * 10 * i;
                                }
                            };
                        }
                    }
                    
                    options._lineChartsData.option.series.push(seriesItem);
                });

                if (options._optHolder.showLegend) {
                    options._lineChartsData.option.legend = {
                        data: options._lineChartsData.legendData,
                        align: 'left',
                        left: 10
                    };
                }

                options._myChart.setOption(options._lineChartsData.option);
                
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
