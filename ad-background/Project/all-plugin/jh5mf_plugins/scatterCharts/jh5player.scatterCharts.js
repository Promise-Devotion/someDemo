
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
     * scatterCharts JH5player plug-in
     * author: jiangb
     *
     * scatterCharts:
     **/
    JH5player.plugin("scatterCharts", {

        manifest: {
            about: {
                name: "JH5player scatterCharts plugin",
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
                /* the scatterCharts optionss **/
                title: {
                     elem: "input", type: "text", label: "Title", default: "Height and weight ratio of man and Woman."
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
                                { cells: [ 
                                           { value: "Man", textAlign: "center", bold: "true", background: "#2AB4C0" },
                                           { value: "data" },
                                           { value: "count" },
                                           { value: "Woman", textAlign: "center", bold: "true", background: "#EF4836" },
                                           { value: "data" },
                                           { value: "count" }
                                        ]
                                },
                                { cells: [ { value: "175" }, 
                                           { value: "86" },
                                           { value: "200" },
                                           { value: "156" },
                                           { value: "46" },
                                           { value: "100" } ]
                                },
                                { cells: [ { value: "170" }, 
                                           { value: "80" },
                                           { value: "300" },
                                           { value: "158" },
                                           { value: "50" },
                                           { value: "150" } ]
                                },
                                { cells: [ { value: "166" }, 
                                           { value: "65" },
                                           { value: "160" },
                                           { value: "165" },
                                           { value: "50" },
                                           { value: "300" } ]
                                },
                                { cells: [ { value: "172" }, 
                                           { value: "60" },
                                           { value: "130" },
                                           { value: "170" },
                                           { value: "65" },
                                           { value: "200" } ]
                                },
                                { cells: [ { value: "168" }, 
                                           { value: "82" },
                                           { value: "500" },
                                           { value: "175" },
                                           { value: "70" },
                                           { value: "80" } ]
                                },
                                { cells: [ { value: "158" }, 
                                           { value: "55" },
                                           { value: "100" },
                                           { value: "172" },
                                           { value: "66" },
                                           { value: "155" } ]
                                },
                                { cells: [ { value: "190" }, 
                                           { value: "76" },
                                           { value: "60" },
                                           { value: "166" },
                                           { value: "56" },
                                           { value: "220" } ]
                                }       
                            ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                                [
                                    { name: 'Man', color: '#2AB4C0' },
                                    { name: 'Woman', color: '#EF4836' }
                                ],

                                [
                                    [[175, 86, 200], [170, 80, 300], [166, 65, 160], [172, 60, 130], [168, 82, 500], [158, 55, 100], [190, 76, 60]],
                                    [[156, 46, 100], [158, 50, 150], [165, 50, 300], [170, 65, 200], [175, 70, 80], [172, 66, 155], [166, 56, 220]]
                                ]
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

            options._scatterChartsData = {};

            options._scatterChartsData.legendData = [];
            options._scatterChartsData.chartColor = [];
            options._scatterChartsData.chartsData = [];

            options._scatterChartsData.option = {};

            options._scatterChartsData.compareBox = [];

            
            //设置数据
            $.each(options.seriesData[0], function (i, item) {
                // 遍历设置color值
                 options._scatterChartsData.chartColor.push(item.color);

                // 遍历设置legend属性name值
                options._scatterChartsData.legendData.push(item.name);
            });

            $.each(options.seriesData[1], function (i, item) {
                options._scatterChartsData.chartsData[i] = item;
            });

            //取最大值
            $.each(options.seriesData[1], function(i, item) {
                $.each(item, function (j, dom) {
                    options._scatterChartsData.compareBox.push(dom[2]); 
                });
            });

            options._scatterChartsData.maxData = Math.max.apply(null, options._scatterChartsData.compareBox);


            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-scatterCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._scatterCharts = $('<div></div>')[0];

            $(options._scatterCharts).css({ width: "100%", height: "100%" }).appendTo($(options._container));

            // 初始化myChart
            options._myChart = echarts.init(options._scatterCharts);

            // 设置chart基本属性
            options._scatterChartsData.option = {
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
                color: options._scatterChartsData.chartColor,
                xAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                    
                }
            };
            
    
            if (options.showLegend) {
                options._scatterChartsData.option.legend = {
                    left: 10,
                    data: options._scatterChartsData.legendData
                };
            }

            if (options.showToolbox) {
                options._scatterChartsData.option.toolbox = {
                    feature: {
                        dataView: {readOnly: false},
                        restore: {}
                    }
                }
            }

            options._scatterChartsData.option.series = [];

            $.each(options._scatterChartsData.chartsData, function (i, item) {
                var dataItem = {
                    name: options._scatterChartsData.legendData[i],
                    data: item,
                    type: 'scatter',
                    symbolSize: function anonymous(data) {
                        var radius = (data[2] / options._scatterChartsData.maxData) * 80 + 10;
                        return Math.max(Math.round(radius), 10) || 10;
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: '#666',
                            shadowOffsetY: 5, 
                        }
                    }
                };

                options._scatterChartsData.option.series.push(dataItem);
            });

            options._myChart.setOption(options._scatterChartsData.option);

        
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
                options._scatterChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._scatterChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._scatterChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._scatterChartsData.option);
            }

            if ("showLegend" in updates) {
                if (updates["showLegend"]) {
                    options._scatterChartsData.option.legend = {
                        left: 10,
                        data: options._scatterChartsData.legendData
                    }     
                }
                else {
                    options._scatterChartsData.option.legend = null;
                }

                options._myChart = echarts.init(options._scatterCharts);
                options._myChart.setOption(options._scatterChartsData.option);
            }

            if ("showToolbox" in updates) {
                if(updates["showToolbox"]) {
                    options._scatterChartsData.option.toolbox = {
                        feature: {
                            dataView: {readOnly: false},
                            restore: {}
                        }
                    }
                }
                else {
                    options._scatterChartsData.option.toolbox = null;
                }

                options._myChart = echarts.init(options._scatterCharts);
                options._myChart.setOption(options._scatterChartsData.option);
            }

            
            // seriesData数据更新
            if ("seriesData" in updates) {
                options._scatterChartsData.legendData = [];
                options._scatterChartsData.chartColor = [];
                options._scatterChartsData.chartsData = [];

                $.each(updates["seriesData"][0], function (i, item) {
                    options._scatterChartsData.chartColor.push(item.color);
                    options._scatterChartsData.legendData.push(item.name);
                });

                $.each(updates["seriesData"][1], function (i, item) {
                    options._scatterChartsData.chartsData[i] = item;
                });

                //取最大值
                $.each(updates["seriesData"][1], function(i, item) {
                    $.each(item, function (j, dom) {
                        options._scatterChartsData.compareBox.push(dom[2]); 
                    });
                });

                options._scatterChartsData.maxData = Math.max.apply(null, options._scatterChartsData.compareBox);

                // 数据变化更新相应的值，保持最新
                options._scatterChartsData.option.color = options._scatterChartsData.chartColor;

                if (options._optHolder.showLegend) {
                    options._scatterChartsData.option.legend.data = options._scatterChartsData.legendData;
                }

                options._scatterChartsData.option.series = [];
                $.each(options._scatterChartsData.chartsData, function (i, item) {
                    var dataItem = {
                        name: options._scatterChartsData.legendData[i],
                        data: item,
                        type: 'scatter',
                        symbolSize: function anonymous(data) {
                            var radius = (data[2] / options._scatterChartsData.maxData) * 80 + 10;
                            return Math.max(Math.round(radius), 10) || 10;
                            
                        },
                        itemStyle: {
                            normal: {
                                shadowBlur: 10,
                                shadowColor: '#666',
                                shadowOffsetY: 5,
                                
                            }
                        }
                    };

                    options._scatterChartsData.option.series.push(dataItem);
                });

                options._myChart = echarts.init(options._scatterCharts);
                options._myChart.setOption(options._scatterChartsData.option);
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
