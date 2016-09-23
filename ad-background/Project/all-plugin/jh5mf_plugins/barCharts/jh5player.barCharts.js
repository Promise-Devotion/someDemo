
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
     * barCharts JH5player plug-in
     * author: jiangb
     *
     * barCharts:
     **/
    JH5player.plugin("barCharts", {

        manifest: {
            about: {
                name: "JH5player barCharts plugin",
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
                        }
                    },
                    hidden: true
                },
                animate: {
                    label: "Animate",
                    elem: "listview",
                    type: "json",
                    group: "trigger",
                    default: []
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
                        hoverOut: []
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
                /* the barCharts optionss **/
                title: {
                     elem: "input", type: "text", label: "Title", default: "This is bar charts."
                },
                chartTextColor: {
                    elem: "color",  type: "text", label: "Title Color", default: "black"
                },
                showLegend: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Legend", default: false, binds: [] 
                },
                showBrush: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Brush", default: false, binds: [] 
                },
                showVisualMap: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show VisualMap", default: false, binds: []
                },
                changeAxis: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Change Axis", default: false, binds: []
                },
                spreadsheetData:  {
                    default: {
                        rows: [
                                { cells: [ { value: "X-AXIS", textAlign: "center", bold: "true" }, 
                                           { value: "NAME1", textAlign: "center", bold: "true", background: "#00addc" },
                                           { value: "NAME2", textAlign: "center", bold: "true", background: "#1ab39f" },
                                           { value: "NAME3", textAlign: "center", bold: "true", background: "#ea157a" }]
                                },
                                { cells: [ { value: "a" }, 
                                           { value: "1" },
                                           { value: "2" },
                                           { value: "9" }]
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
                                }
                        ],
                        name: "Sheet1"
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                            { xAxis: ["a", "b", "c"] },
                            { value: [[1, 2, 4], [2, 5, 1], [9, 2, 5]] },
                            { name: ['NAME1', 'NAME2', 'NAME3'] },
                            { color: ['#00addc', '#1ab39f', '#ea157a'] }
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

            options._barChartsData = {};

            options._barChartsData.axis = [];
            options._barChartsData.values = [];
            options._barChartsData.legendData = [];
            options._barChartsData.chartColor = [];
            options._barChartsData.stack = [];

            options._barChartsData.option = {};

            options._barChartsData.minData = '';
            options._barChartsData.maxData = '';


            
            options._barChartsData.axis = options.seriesData[0].xAxis;
            options._barChartsData.values = options.seriesData[1].value;
            options._barChartsData.legendData = options.seriesData[2].name;
            options._barChartsData.chartColor = options.seriesData[3].color;

            if (options.seriesData.length > 4) {
                options._barChartsData.stack = options.seriesData[4].stack;
            }

            
            // 设置最大最小值
            var minBox = [];
            var maxBox = [];
            $.each(options._barChartsData.values, function (i, item) {
                minBox.push(Math.min.apply(null, item));
                maxBox.push(Math.max.apply(null, item));
            });

            options._barChartsData.minData = Math.min.apply(null, minBox) - 2;
            options._barChartsData.maxData = Math.max.apply(null, maxBox) + 2;


            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-barCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._barChart = $('<div></div>')[0];

            $(options._barChart).css({ width: "100%", height: "100%" }).appendTo($(options._container));


            // 初始化myChart
            options._myChart = echarts.init(options._barChart);

            // 设置chart基本属性
            options._barChartsData.option = {
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
                    axisPointer : {            
                        type : 'shadow'        
                    }
                },
                color: options._barChartsData.chartColor,
                grid: {
                    left: '8%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type : 'category',
                        data : options._barChartsData.axis
                    }
                ],
                yAxis: [
                    {
                        type : 'value'
                    }
                ]
            };

            // 设置初始状态serie
            options._barChartsData.option.series = [];
            $.each(options._barChartsData.legendData, function (i, item) {
                if (options.seriesData.length > 4) {
                    var seriesItem = {
                        name: item,
                        type: 'bar',
                        stack: options._barChartsData.stack[i],
                        data: options._barChartsData.values[i],
                        animationDelay: function (idx) {
                            return idx * 10 * i;
                        }
                    };
                }
                else {
                    var seriesItem = {
                        name: item,
                        type: 'bar',
                        data: options._barChartsData.values[i],
                        animationDelay: function (idx) {
                            return idx * 10 * i;
                        }
                    };
                }
                
                options._barChartsData.option.series.push(seriesItem);
            });



            // 设置legend
            if (options.showLegend) {
                options._barChartsData.option.legend = {
                    data: options._barChartsData.legendData,
                    align: 'left',
                    left: 10
                };
            }

            // 设置brush
            if (options.showBrush) {
                options._barChartsData.option.brush = {
                    toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
                    xAxisIndex: 0
                };

                options._barChartsData.option.toolbox = {
                    feature: {
                        magicType: {
                            type: ['stack', 'tiled']
                        },
                        dataView: {}
                    }
                }
            }

            // 设置visualMap
            if (options.showVisualMap) {
                options._barChartsData.option.visualMap = {
                    type: 'continuous',
                    dimension: 1,
                    text: ['High', 'Low'],
                    inverse: true,
                    itemHeight: 200,
                    calculable: true,
                    min: options._barChartsData.minData,
                    max: options._barChartsData.maxData,
                    top: 20,
                    left: 10,
                    inRange: {
                        colorLightness: [0.4, 0.8]
                    },
                    outOfRange: {
                        color: '#bbb'
                    },
                    controller: {
                        inRange: {
                            color: '#2f4554'
                        }
                    }
                };
            }

            // 设置坐标轴方向 
            if (options.changeAxis) {
                var box = options._barChartsData.option.xAxis;
                options._barChartsData.option.xAxis = options._barChartsData.option.yAxis;
                options._barChartsData.option.yAxis = box;
            }

            options._myChart.setOption(options._barChartsData.option);


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
                options._barChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._barChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._barChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._barChartsData.option);
            }

            if ("showLegend" in updates) {
                if (updates["showLegend"]) {
                    options._barChartsData.option.legend = {
                        data: options._barChartsData.legendData,
                        align: 'left',
                        left: 10
                    };
                }
                else {
                    options._barChartsData.option.legend = null;
                }

                options._myChart = echarts.init(options._barChart);
                options._myChart.setOption(options._barChartsData.option);
            }

            if ("showBrush" in updates) {
                if (updates["showBrush"]) {
                    options._barChartsData.option.brush = {
                        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
                        xAxisIndex: 0
                    };

                    options._barChartsData.option.toolbox = {
                        feature: {
                            magicType: {
                                type: ['stack', 'tiled']
                            },
                            dataView: {}
                        }
                    }
                }
                else {
                    options._barChartsData.option.brush = null;
                    options._barChartsData.option.toolbox = null;
                }

                options._myChart = echarts.init(options._barChart);
                options._myChart.setOption(options._barChartsData.option);
            }

            if ("showVisualMap" in updates) {
                if (updates["showVisualMap"]) {
                    options._barChartsData.option.visualMap = {
                        type: 'continuous',
                        dimension: 1,
                        text: ['High', 'Low'],
                        inverse: true,
                        itemHeight: 200,
                        calculable: true,
                        min: options._barChartsData.minData,
                        max: options._barChartsData.maxData,
                        top: 20,
                        left: 10,
                        inRange: {
                            colorLightness: [0.4, 0.8]
                        },
                        outOfRange: {
                            color: '#bbb'
                        },
                        controller: {
                            inRange: {
                                color: '#2f4554'
                            }
                        }
                    };
                }
                else {
                   options._barChartsData.option.visualMap = null; 
                }

                options._myChart = echarts.init(options._barChart);
                options._myChart.setOption(options._barChartsData.option);
            }


            if ("changeAxis" in updates) {
                if (updates["changeAxis"]) {
                    var box = options._barChartsData.option.xAxis;
                    options._barChartsData.option.xAxis = options._barChartsData.option.yAxis;
                    options._barChartsData.option.yAxis = box;
                }
                else {
                   options._barChartsData.option.xAxis = [
                        {
                            type : 'category',
                            data : options._barChartsData.axis
                        }
                    ];

                   options._barChartsData.option.yAxis = [{ type : 'value' }];
                }

                options._myChart = echarts.init(options._barChart);
                options._myChart.setOption(options._barChartsData.option);
            }


            // 数据更新
            if ("seriesData" in updates) {
                options._barChartsData.axis = updates["seriesData"][0].xAxis;
                options._barChartsData.values = updates["seriesData"][1].value;
                options._barChartsData.legendData = updates["seriesData"][2].name;
                options._barChartsData.chartColor = updates["seriesData"][3].color;

                if (updates["seriesData"].length > 4) {
                    options._barChartsData.stack = updates["seriesData"][4].stack;
                }


                options._myChart = echarts.init(options._barChart);

                options._barChartsData.option = {
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
                        axisPointer : {            
                            type : 'shadow'        
                        }
                    },
                    color: options._barChartsData.chartColor,
                    grid: {
                        left: '8%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type : 'category',
                            data : options._barChartsData.axis
                        }
                    ],
                    yAxis: [
                        {
                            type : 'value'
                        }
                    ]
                };

                options._barChartsData.option.series = [];
                $.each(options._barChartsData.legendData, function (i, item) {
                    if (updates["seriesData"].length > 4) {
                        var seriesItem = {
                            name: item,
                            type: 'bar',
                            stack: options._barChartsData.stack[i],
                            data: options._barChartsData.values[i],
                            animationDelay: function (idx) {
                                return idx * 10 * i;
                            }
                        };
                    }
                    else {
                        var seriesItem = {
                            name: item,
                            type: 'bar',
                            data: options._barChartsData.values[i],
                            animationDelay: function (idx) {
                                return idx * 10 * i;
                            }
                        };
                    }
                    
                    options._barChartsData.option.series.push(seriesItem);
                });

                if (options._optHolder.showLegend) {
                    options._barChartsData.option.legend = {
                        data: options._barChartsData.legendData,
                        align: 'left',
                        left: 10
                    };
                }

                if (options._optHolder.showBrush) {
                    options._barChartsData.option.brush = {
                        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
                        xAxisIndex: 0
                    };

                    options._barChartsData.option.toolbox = {
                        feature: {
                            magicType: {
                                type: ['stack', 'tiled']
                            },
                            dataView: {}
                        }
                    }
                }

                var minBox = [];
                var maxBox = [];
                $.each(options._barChartsData.values, function (i, item) {
                    minBox.push(Math.min.apply(null, item));
                    maxBox.push(Math.max.apply(null, item));
                });

                options._barChartsData.minData = Math.min.apply(null, minBox) - 2;
                options._barChartsData.maxData = Math.max.apply(null, maxBox) + 2;

                if (options._optHolder.showVisualMap) {
                    options._barChartsData.option.visualMap = {
                        type: 'continuous',
                        dimension: 1,
                        text: ['High', 'Low'],
                        inverse: true,
                        itemHeight: 200,
                        calculable: true,
                        min: options._barChartsData.minData,
                        max: options._barChartsData.maxData,
                        top: 20,
                        left: 10,
                        inRange: {
                            colorLightness: [0.4, 0.8]
                        },
                        outOfRange: {
                            color: '#bbb'
                        },
                        controller: {
                            inRange: {
                                color: '#2f4554'
                            }
                        }
                    };
                }

                // 设置坐标轴方向 
                if (options._optHolder.changeAxis) {
                    var box = options._barChartsData.option.xAxis;
                    options._barChartsData.option.xAxis = options._barChartsData.option.yAxis;
                    options._barChartsData.option.yAxis = box;
                }

                options._myChart.setOption(options._barChartsData.option);
                
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
