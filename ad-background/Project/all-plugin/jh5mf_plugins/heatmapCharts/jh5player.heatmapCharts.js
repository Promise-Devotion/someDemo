(function (JH5player) {

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
     * heatmapCharts JH5player plug-in
     * author: jiangb
     *
     * heatmapCharts:
     **/
    JH5player.plugin("heatmapCharts", {

        manifest: {
            about: {
                name: "JH5player heatmapCharts plugin",
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
                /* the heatmapCharts optionss **/
                title: {
                    elem: "input", type: "text", label: "Title", default: "Daily sales in a week."
                },
                chartTextColor: {
                    elem: "color", type: "text", label: "Title Color", default: "black"
                },
                spreadsheetData: {
                    default: {
                        rows: [
                            {
                                cells: [
                                    {value: "", textAlign: "center", bold: "true"},
                                    {value: "Sunday", textAlign: "center", bold: "true"},
                                    {value: "Monday", textAlign: "center", bold: "true"},
                                    {value: "Tuesday", textAlign: "center", bold: "true"},
                                    {value: "Wednesday", textAlign: "center", bold: "true"},
                                    {value: "Thursday", textAlign: "center", bold: "true"},
                                    {value: "Friday", textAlign: "center", bold: "true"},
                                    {value: "Saturday", textAlign: "center", bold: "true"}
                                ]
                            },

                            {
                                cells: [
                                    {value: "morning"},
                                    {value: 100},
                                    {value: 20},
                                    {value: 55},
                                    {value: 20},
                                    {value: 50},
                                    {value: 60},
                                    {value: 150}
                                ]
                            },

                            {
                                cells: [
                                    {value: "noon"},
                                    {value: 60},
                                    {value: 56},
                                    {value: 20},
                                    {value: 15},
                                    {value: 25},
                                    {value: 15},
                                    {value: 100}
                                ]
                            },

                            {
                                cells: [
                                    {value: "afternoon"},
                                    {value: 200},
                                    {value: 60},
                                    {value: 100},
                                    {value: 55},
                                    {value: 65},
                                    {value: 20},
                                    {value: 155}
                                ]
                            },

                            {
                                cells: [
                                    {value: "night"},
                                    {value: 165},
                                    {value: 90},
                                    {value: 60},
                                    {value: 100},
                                    {value: 150},
                                    {value: 60},
                                    {value: 150}
                                ]
                            }
                        ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

                        ["morning", "noon", "afternoon", "night"],

                        [
                            [0, 0, 100], [1, 0, 20], [2, 0, 55], [3, 0, 20], [4, 0, 50], [5, 0, 60], [6, 0, 150],
                            [0, 1, 60], [1, 1, 56], [2, 1, 20], [3, 1, 15], [4, 1, 25], [5, 1, 15], [6, 1, 100],
                            [0, 2, 200], [1, 2, 60], [2, 2, 100], [3, 2, 55], [4, 2, 65], [5, 2, 20], [6, 2, 155],
                            [0, 3, 165], [1, 3, 90], [2, 3, 60], [3, 3, 100], [4, 3, 150], [5, 3, 60], [6, 3, 150]
                        ]
                    ],
                    hidden: true
                },
                opacity: {
                    elem: "slider", type: "number", min: 0, max: 1, step: 0.01, label: "Opacity", default: 1, units: "%"
                },
                rotation: {
                    elem: "slider",
                    type: "number",
                    min: 0,
                    max: 360,
                    step: 1,
                    label: "Rotation",
                    default: 0,
                    units: "deg"
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

            options._heatmapChartsData = {};

            options._heatmapChartsData.option = {};

            //设置数据
            options._heatmapChartsData.chartX = options.seriesData[0];
            options._heatmapChartsData.chartY = options.seriesData[1];
            options._heatmapChartsData.chartsData = options.seriesData[2];

            // 设置最大最小值
            var minBox = [];
            var maxBox = [];
            $.each(options._heatmapChartsData.chartsData, function (i, item) {
                minBox.push(Math.min.apply(null, item));
                maxBox.push(Math.max.apply(null, item));
            });

            options._heatmapChartsData.minData = Math.min.apply(null, minBox);
            options._heatmapChartsData.minData > 0 ? 0 : options._heatmapChartsData.minData;
            options._heatmapChartsData.maxData = Math.max.apply(null, maxBox);

            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-heatmapCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._heatmapCharts = $('<div></div>')[0];

            $(options._heatmapCharts).css({width: "100%", height: "100%"}).appendTo($(options._container));

            // 初始化myChart
            options._myChart = echarts.init(options._heatmapCharts);

            // 设置chart基本属性
            options._heatmapChartsData.option = {
                title: {
                    text: options.title,
                    top: "10px",
                    left: "center",
                    textStyle: {
                        color: options.chartTextColor
                    }
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: options._heatmapChartsData.chartX,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: options._heatmapChartsData.chartY,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: options._heatmapChartsData.minData,
                    max: options._heatmapChartsData.maxData,
                    calculable: true,
                    orient: 'vertical',
                    right: '2px',
                    bottom: '20px'
                },
                series: [{
                    type: 'heatmap',
                    data: options._heatmapChartsData.chartsData,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            options._myChart.setOption(options._heatmapChartsData.option);


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
                options._heatmapChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._heatmapChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._heatmapChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._heatmapChartsData.option);
            }


            // seriesData数据更新
            if ("seriesData" in updates) {
                options._heatmapChartsData.chartX = updates["seriesData"][0];
                options._heatmapChartsData.chartY = updates["seriesData"][1];
                options._heatmapChartsData.chartsData = updates["seriesData"][2];

                // 设置最大最小值
                var minBox = [];
                var maxBox = [];
                $.each(options._heatmapChartsData.chartsData, function (i, item) {
                    minBox.push(Math.min.apply(null, item));
                    maxBox.push(Math.max.apply(null, item));
                });

                options._heatmapChartsData.minData = Math.min.apply(null, minBox);
                options._heatmapChartsData.minData > 0 ? 0 : options._heatmapChartsData.minData;
                options._heatmapChartsData.maxData = Math.max.apply(null, maxBox);


                options._heatmapChartsData.option.visualMap.min = options._heatmapChartsData.minData;
                options._heatmapChartsData.option.visualMap.max = options._heatmapChartsData.maxData;

                options._heatmapChartsData.option.xAxis.data = options._heatmapChartsData.chartX;
                options._heatmapChartsData.option.yAxis.data = options._heatmapChartsData.chartY;

                options._heatmapChartsData.option.series[0].data = options._heatmapChartsData.chartsData;

                options._myChart = echarts.init(options._heatmapCharts);
                options._myChart.setOption(options._heatmapChartsData.option);
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

        frame: function (event, options, time) {
        },

        _teardown: function (options) {
            // TODO@do something here.
            // ...

            // to remove jh5player element from presentation container.
            _trackEvent.removeJH5playerElement(options);
        },
    });
}(window.JH5player));
