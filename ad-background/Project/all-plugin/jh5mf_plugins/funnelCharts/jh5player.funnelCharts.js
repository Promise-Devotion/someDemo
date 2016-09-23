
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
     * funnelCharts JH5player plug-in
     * author: jiangb
     *
     * funnelCharts:
     **/
    JH5player.plugin("funnelCharts", {

        manifest: {
            about: {
                name: "JH5player funnelCharts plugin",
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
                /* the funnelCharts optionss **/
                title: {
                     elem: "input", type: "text", label: "Title", default: "This is funnel charts."
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
                pyramid: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Pyramid", default: false, binds: []
                },
                spreadsheetData:  {
                    default: {
                        rows: [
                                { cells: [ { value: "", textAlign: "center", bold: "true" }, 
                                           { value: "name1", textAlign: "center", bold: "true", background: "#2AB4C0" },
                                           { value: "name2", textAlign: "center", bold: "true", background: "#EF4836" },
                                           { value: "name3", textAlign: "center", bold: "true", background: "#8775A7" },
                                           { value: "name4", textAlign: "center", bold: "true", background: "#5C9BD1" },
                                           { value: "name5", textAlign: "center", bold: "true", background: "#95A5A6" } ]
                                },
                                { cells: [ { value: "实际" }, 
                                           { value: "30" },
                                           { value: "10" },
                                           { value: "5" },
                                           { value: "50" },
                                           { value: "80" } ]
                                },
                                { cells: [ { value: "预期" }, 
                                           { value: "60" },
                                           { value: "40" },
                                           { value: "20" },
                                           { value: "80" },
                                           { value: "100" } ]
                                }
                        ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                                [{ value: 30, name: 'name1', color: '#2AB4C0' },
                                 { value: 10, name: 'name2', color: '#EF4836' },
                                 { value: 5, name: 'name3', color: '#8775A7' },
                                 { value: 50, name: 'name4', color: '#5C9BD1' },
                                 { value: 80, name: 'name5', color: '#95A5A6' }],

                                [{ value: 60, name: 'name1', color: '#2AB4C0' },
                                 { value: 40, name: 'name2', color: '#EF4836' },
                                 { value: 20, name: 'name3', color: '#8775A7' },
                                 { value: 80, name: 'name4', color: '#5C9BD1' },
                                 { value: 100, name: 'name5', color: '#95A5A6' }],
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

            options._funnelChartsData = {};

            options._funnelChartsData.legendData = [];
            options._funnelChartsData.chartColor = [];
            options._funnelChartsData.chartData = [];
            options._funnelChartsData.consultData = [];

            options._funnelChartsData.option = {};


            //设置数据
            $.each(options.seriesData[0], function (i, item) {
                // 遍历设置legend属性name值
                options._funnelChartsData.legendData.push(item.name);

                // 遍历设置color值
                 options._funnelChartsData.chartColor.push(item.color);

                // 遍历series属性data的值
                options._funnelChartsData.chartData[i] = {};
                options._funnelChartsData.chartData[i]["value"] = item.value;
                options._funnelChartsData.chartData[i]["name"] = item.name;
            });
           
           if (options.seriesData.length > 1) {
                $.each(options.seriesData[1], function (i, item) {
                    options._funnelChartsData.consultData[i] = {};
                    options._funnelChartsData.consultData[i]["value"] = item.value;
                    options._funnelChartsData.consultData[i]["name"] = item.name; 
                });
           }

            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-funnelCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._funnelCharts = $('<div></div>')[0];

            $(options._funnelCharts).css({ width: "100%", height: "100%" }).appendTo($(options._container));

            // 初始化myChart
            options._myChart = echarts.init(options._funnelCharts);

            // 设置chart基本属性
            options._funnelChartsData.option = {
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

                color: options._funnelChartsData.chartColor,

                series: [
                    {   
                        type: 'funnel',
                        left: '12%',
                        width: '80%',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            },
                            emphasis: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                opacity: 0.9
                            }
                        },
                        data: options._funnelChartsData.chartData,
                    }
                ]
            };
            
    
            if (options.showLegend) {
                options._funnelChartsData.option.legend = {
                    orient: "vertical",
                    left: "10px",
                    data: options._funnelChartsData.legendData
                };
            }

            if (options.showToolbox) {
                options._funnelChartsData.option.toolbox = {
                    feature: {
                        dataView: {readOnly: false},
                        restore: {}
                    }
                }
            }

            if (options.seriesData.length > 1) {
                options._funnelChartsData.option.series = [
                    {
                        name: '实际',
                        type: 'funnel',
                        left: '12%',
                        width: '80%',
                        maxSize: '80%',
                        label: {
                            normal: {
                                position: 'inside',
                                formatter: '{c}',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            emphasis: {
                                position:'inside',
                                formatter: '{c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                opacity: 0.9,
                                borderColor: '#fff',
                                borderWidth: 2
                            }
                        },
                        data: options._funnelChartsData.chartData
                    },
                    {
                        name: '预期',
                        type: 'funnel',
                        left: '12%',
                        width: '80%',
                        label: {
                            normal: {
                                formatter: '{b}预期'
                            },
                            emphasis: {
                                position:'inside',
                                formatter: '{b}预期: {c}',
                                textStyle: {
                                    color: "#222"
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                opacity: 0.4
                            }
                        },
                        data: options._funnelChartsData.consultData
                    }
                ]
            }

            if (options.pyramid) {
                $.each(options._funnelChartsData.option.series, function(i, item) {
                    item.sort = 'ascending';
                });
            }


            options._myChart.setOption(options._funnelChartsData.option);

        
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
                options._funnelChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._funnelChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._funnelChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._funnelChartsData.option);
            }

            if ("showLegend" in updates) {
                if (updates["showLegend"]) {
                    options._funnelChartsData.option.legend = {
                        orient: "vertical",
                        left: "10px",
                        data: options._funnelChartsData.legendData
                    }     
                }
                else {
                    options._funnelChartsData.option.legend = null;
                }

                options._myChart = echarts.init(options._funnelCharts);
                options._myChart.setOption(options._funnelChartsData.option);
            }

            if ("showToolbox" in updates) {
                if(updates["showToolbox"]) {
                    options._funnelChartsData.option.toolbox = {
                        feature: {
                            dataView: {readOnly: false},
                            restore: {}
                        }
                    }
                }
                else {
                    options._funnelChartsData.option.toolbox = null;
                }

                options._myChart = echarts.init(options._funnelCharts);
                options._myChart.setOption(options._funnelChartsData.option);
            }

            if ("pyramid" in updates) {
                if (updates["pyramid"]) {
                    $.each(options._funnelChartsData.option.series, function(i, item) {
                        item.sort = 'ascending';
                    });
                }
                else {
                    $.each(options._funnelChartsData.option.series, function(i, item) {
                        item.sort = null;
                    });
                }

                options._myChart = echarts.init(options._funnelCharts);
                options._myChart.setOption(options._funnelChartsData.option);
            }

            
            // seriesData数据更新
            if ("seriesData" in updates) {
                options._funnelChartsData.legendData = [];
                options._funnelChartsData.chartData = [];
                options._funnelChartsData.chartColor = [];
                options._funnelChartsData.consultData = [];

                $.each(updates["seriesData"][0], function (i, item) {
                    // 遍历设置legend属性name值
                    options._funnelChartsData.legendData.push(item.name);

                    // 遍历设置color值
                    options._funnelChartsData.chartColor.push(item.color);

                    // 遍历设置series属性data的值
                    options._funnelChartsData.chartData[i] = {};
                    options._funnelChartsData.chartData[i]["value"] = item.value;
                    options._funnelChartsData.chartData[i]["name"] = item.name;
                });

                if (updates["seriesData"].length > 1) {
                    $.each(updates["seriesData"][1], function (i, item) {
                        options._funnelChartsData.consultData[i] = {};
                        options._funnelChartsData.consultData[i]["value"] = item.value;
                        options._funnelChartsData.consultData[i]["name"] = item.name; 
                    });
                }

                // 数据变化更新相应的值，保持最新
                options._funnelChartsData.option.color = options._funnelChartsData.chartColor;

                if (options._optHolder.showLegend) {
                    options._funnelChartsData.option.legend.data = options._funnelChartsData.legendData;
                }
                

                $.each(options._funnelChartsData.option.series, function (i, item) {
                    if (i == 0) {
                        item.data = options._funnelChartsData.chartData
                    }

                    if (i == 1) {
                        item.data = options._funnelChartsData.consultData;
                    }

                });

                options._myChart = echarts.init(options._funnelCharts);
                options._myChart.setOption(options._funnelChartsData.option);
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
