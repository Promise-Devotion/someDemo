
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
     * mapCharts JH5player plug-in
     * author: jiangb
     *
     * mapCharts:
     **/
    JH5player.plugin("mapCharts", {

        manifest: {
            about: {
                name: "JH5player mapCharts plugin",
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
                /* the mapCharts optionss **/
                title: {
                     elem: "input", type: "text", label: "Title", default: "Mobile phone sales."
                },
                chartTextColor: {
                    elem: "color",  type: "text", label: "Title Color", default: "black"
                },
                showLegend: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Legend", default: false, binds: [] 
                },
                showToolbox: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Toolbox", default: false, binds: [] 
                },
                showVisualMap: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show VisualMap", default: false, binds: []
                },
                spreadsheetData:  {
                    default: {
                        rows: [
                                { cells: [ { value: "", textAlign: "center", bold: "true" }, 
                                           { value: "iPhone", textAlign: "center", bold: "true", background: "#2AB4C0" },
                                           { value: "Huawei", textAlign: "center", bold: "true", background: "#EF4836" },
                                           { value: "Samsung", textAlign: "center", bold: "true", background: "#8775A7" }]
                                },
                                { cells: [ { value: "北京" }, 
                                           { value: "85" },
                                           { value: "100" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "天津" }, 
                                           { value: "45" },
                                           { value: "-" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "上海" }, 
                                           { value: "25" },
                                           { value: "92" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "安徽" }, 
                                           { value: "45" },
                                           { value: "-" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "重庆" }, 
                                           { value: "45" },
                                           { value: "-" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "江苏" }, 
                                           { value: "-" },
                                           { value: "60" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "甘肃" }, 
                                           { value: "-" },
                                           { value: "30" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "河南" }, 
                                           { value: "-" },
                                           { value: "65" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "浙江" }, 
                                           { value: "-" },
                                           { value: "20" },
                                           { value: "-" } ]
                                },
                                { cells: [ { value: "湖南" }, 
                                           { value: "-" },
                                           { value: "-" },
                                           { value: "100" } ]
                                },
                                { cells: [ { value: "四川" }, 
                                           { value: "-" },
                                           { value: "-" },
                                           { value: "60" } ]
                                },
                                { cells: [ { value: "内蒙古" }, 
                                           { value: "-" },
                                           { value: "-" },
                                           { value: "30" } ]
                                }
                            ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                                [{ product: 'iPhone', color: '#2AB4C0' },
                                 { product: 'Huawei', color: '#EF4836' },
                                 { product: 'Samsung', color: '#8775A7' }],

                                [{ value: 85, name: '北京' },
                                 { value: 45, name: '天津' },
                                 { value: 25, name: '上海' },
                                 { value: 45, name: '安徽' },
                                 { value: 45, name: '重庆' }],

                                [{ value: 100, name: '北京' },
                                 { value: 92, name: '上海' },
                                 { value: 60, name: '江苏' },
                                 { value: 30, name: '甘肃' },
                                 { value: 65, name: '河南' },
                                 { value: 20, name: '浙江' }],

                                [{ value: 100, name: '湖南' },
                                 { value: 60, name: '四川' },
                                 { value: 30, name: '内蒙古' }]
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

            options._mapChartsData = {};

            options._mapChartsData.legendData = [];
            options._mapChartsData.chartColor = [];
            options._mapChartsData.chartData = [];

            options._mapChartsData.option = {};


            //设置数据
            $.each(options.seriesData, function (i, item) {
                if (i == 0) {
                    $.each(item, function (j, dom) {
                        options._mapChartsData.legendData.push(dom.product);
                        options._mapChartsData.chartColor.push(dom.color);
                    });
                }
                else {
                    options._mapChartsData.chartData[i - 1] = item;
                }
            });

            
            // 设置最大最小值
            var dataBox = [],
                minBox = [],
                maxBox = [];
            $.each(options._mapChartsData.chartData, function (i, item) {
                dataBox = [];
                $.each(item, function (j, dom) { 
                    dataBox.push(dom.value);
                });
                minBox.push(Math.min.apply(null, dataBox));
                maxBox.push(Math.max.apply(null, dataBox));
            });

            options._mapChartsData.minData = Math.min.apply(null, minBox);

            options._mapChartsData.maxData = 0;
            $.each(maxBox, function (i, item) {
                options._mapChartsData.maxData += parseInt(item);
            });
            


            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-mapCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._mapCharts = $('<div></div>')[0];

            $(options._mapCharts).css({ width: "100%", height: "100%" }).appendTo($(options._container));


            // 初始化myChart
            options._myChart = echarts.init(options._mapCharts);

            // 设置chart基本属性
            options._mapChartsData.option = {
                title: {
                    text: options.title,
                    top: "10px",
                    left: "center",
                    textStyle: {
                        color: options.chartTextColor
                    }
                },
                tooltip : {
                    trigger: 'item'
                },
                color: options._mapChartsData.chartColor,
            };

            // 设置初始状态serie
            options._mapChartsData.option.series = [];
            $.each(options._mapChartsData.legendData, function (i, item) {
                var seriesItem = {
                    name: item,
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: options._mapChartsData.chartData[i],
                };
                
                options._mapChartsData.option.series.push(seriesItem);
            });


            // 设置legend
            if (options.showLegend) {
                options._mapChartsData.option.legend = {
                    data: options._mapChartsData.legendData,
                    left: 'left',
                    orient: 'vertical'
                };
            }

            // 设置toolbox
            if (options.showToolbox) {
                options._mapChartsData.option.toolbox = {
                    show: true,
                    feature: {
                        dataView: {readOnly: false},
                        restore: {}
                    }
                }
            }

            // 设置visualMap
            if (options.showVisualMap) {
                options._mapChartsData.option.visualMap = {
                    min: options._mapChartsData.minData,
                    max: options._mapChartsData.maxData,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],           
                    calculable: true
                };
            }

            options._myChart.setOption(options._mapChartsData.option);


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
                options._mapChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._mapChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._mapChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._mapChartsData.option);
            }

            if ("showLegend" in updates) {
                if (updates["showLegend"]) {
                   options._mapChartsData.option.legend = {
                        data: options._mapChartsData.legendData,
                        left: 'left',
                        orient: 'vertical'
                    };
                }
                else {
                    options._mapChartsData.option.legend = null;
                }

                options._myChart = echarts.init(options._mapCharts);
                options._myChart.setOption(options._mapChartsData.option);
            }

            if ("showToolbox" in updates) {
                if (updates["showToolbox"]) {
                    options._mapChartsData.option.toolbox = {
                        show: true,
                        feature: {
                            dataView: {readOnly: false},
                            restore: {}
                        }
                    };
                }
                else {
                    options._mapChartsData.option.toolbox = null;
                }

                options._myChart = echarts.init(options._mapCharts);
                options._myChart.setOption(options._mapChartsData.option);
            }

            if ("showVisualMap" in updates) {
                if (updates["showVisualMap"]) {
                    options._mapChartsData.option.visualMap = {
                        min: options._mapChartsData.minData,
                        max: options._mapChartsData.maxData,
                        left: 'left',
                        top: 'bottom',
                        text: ['高','低'],           
                        calculable: true
                    };
                }
                else {
                   options._mapChartsData.option.visualMap = null; 
                }

                options._myChart = echarts.init(options._mapCharts);
                options._myChart.setOption(options._mapChartsData.option);
            }


            // 数据更新
            if ("seriesData" in updates) {
                options._mapChartsData.legendData = [];
                options._mapChartsData.chartColor = [];
                options._mapChartsData.chartData = [];

                $.each(updates["seriesData"], function (i, item) {
                    if (i == 0) {
                        $.each(item, function (j, dom) {
                            options._mapChartsData.legendData.push(dom.product);
                            options._mapChartsData.chartColor.push(dom.color);
                        });
                    }
                    else {
                        options._mapChartsData.chartData[i - 1] = item;
                    }
                });

                options._myChart = echarts.init(options._mapCharts);

                options._mapChartsData.option.color = options._mapChartsData.chartColor;

                if (options._optHolder.showLegend) {
                    options._mapChartsData.option.legend.data = options._mapChartsData.legendData;
                }

                options._mapChartsData.option.series = [];
                $.each(options._mapChartsData.legendData, function (i, item) {
                    var seriesItem = {
                        name: item,
                        type: 'map',
                        mapType: 'china',
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data: options._mapChartsData.chartData[i],
                    };
                    
                    options._mapChartsData.option.series.push(seriesItem);
                });

                var dataBox = [],
                    minBox = [],
                    maxBox = [];

                $.each(options._mapChartsData.chartData, function (i, item) {
                    dataBox = [];
                    $.each(item, function (j, dom) { 
                        dataBox.push(dom.value);
                    });
                    minBox.push(Math.min.apply(null, dataBox));
                    maxBox.push(Math.max.apply(null, dataBox));
                });

                options._mapChartsData.minData = Math.min.apply(null, minBox);

                options._mapChartsData.maxData = 0;
                $.each(maxBox, function (i, item) {
                    options._mapChartsData.maxData += parseInt(item);
                });

                if (options._optHolder.showVisualMap) {
                    options._mapChartsData.option.visualMap.min = options._mapChartsData.minData;
                    options._mapChartsData.option.visualMap.max = options._mapChartsData.maxData;
                }

                options._myChart.setOption(options._mapChartsData.option);
                
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
