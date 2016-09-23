
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
     * pieCharts JH5player plug-in
     * author: jiangb
     *
     * pieCharts:
     **/
    JH5player.plugin("pieCharts", {

        manifest: {
            about: {
                name: "JH5player pieCharts plugin",
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
                /* the pieCharts optionss **/
                title: {
                     elem: "input", type: "text", label: "Title", default: "This is pie charts."
                },
                chartTextColor: {
                    elem: "color",  type: "text", label: "Title Color", default: "black"
                },
                pieChartsType: {
                     elem: "select", options: ["Normal", "Customized", "Dount", "NestDount", "Texture", "Nightingale"], values: ["normal", "customized", "dount", "nestDount", "texture", "nightingale"], label: "Charts Type", default: "normal"
                },
                showLegend: {
                    elem: "checkbox", type: "boolean", checkboxLabel: "Show Legend", default: true, binds: [] 
                },
                spreadsheetData:  {
                    default: {
                        rows: [
                                { cells: [ { value: "X-AXIS", textAlign: "center", bold: "true" }, 
                                           { value: "name1", textAlign: "center", bold: "true", background: "#2AB4C0" },
                                           { value: "name2", textAlign: "center", bold: "true", background: "#EF4836" },
                                           { value: "name3", textAlign: "center", bold: "true", background: "#8775A7" },
                                           { value: "name4", textAlign: "center", bold: "true", background: "#5C9BD1" },
                                           { value: "name5", textAlign: "center", bold: "true", background: "#95A5A6" },]
                                },
                                { cells: [ { value: "a" }, 
                                           { value: "50" },
                                           { value: "35" },
                                           { value: "30" },
                                           { value: "15" },
                                           { value: "25" } ]
                                }
                        ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: [
                                [{ value: 50, name: 'name1', color: '#2AB4C0' },
                                 { value: 35, name: 'name2', color: '#EF4836' },
                                 { value: 30, name: 'name3', color: '#8775A7' },
                                 { value: 15, name: 'name4', color: '#5C9BD1' },
                                 { value: 25, name: 'name5', color: '#95A5A6' }],

                                [{value: 85, name: 'contact1'},
                                 {value: 45, name: 'contact2'},
                                 {value: 25, name: 'contact3'}]
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

            options._pieChartsData = {};

            options._pieChartsData.legendData = [];
            options._pieChartsData.chartColor = [];
            options._pieChartsData.chartData = [];
            options._pieChartsData.stackData = [];

            options._pieChartsData.option = {};


            //设置数据
            
            $.each(options.seriesData[0], function (i, item) {
                // 遍历设置legend属性name值
                options._pieChartsData.legendData.push(item.name);

                // 遍历设置color值
                 options._pieChartsData.chartColor.push(item.color);

                // 遍历series属性data的值
                options._pieChartsData.chartData[i] = {};
                options._pieChartsData.chartData[i]["value"] = item.value;
                options._pieChartsData.chartData[i]["name"] = item.name;
            });
           
           if (options.seriesData.length > 1) {
                $.each(options.seriesData[1], function (i, item) {
                    options._pieChartsData.stackData[i] = {};
                    options._pieChartsData.stackData[i]["value"] = item.value;
                    options._pieChartsData.stackData[i]["name"] = item.name; 
                });
           }

            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];

            _container.classList.add("jh5player-pieCharts");

            _trackEvent.appendJH5playerElement(_container, options);

            options._pieChart = $('<div></div>')[0];

            $(options._pieChart).css({ width: "100%", height: "100%" }).appendTo($(options._container));

            // 初始化myChart
            options._myChart = echarts.init(options._pieChart);

            // 设置chart基本属性
            if (options.pieChartsType == "normal") {
                options._pieChartsData.option = {
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

                    color: options._pieChartsData.chartColor,

                    series: [
                        {   
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            data: options._pieChartsData.chartData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
            }
            else if (options.pieChartsType == "customized") {
                options._pieChartsData.option = {
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

                    color: options._pieChartsData.chartColor,

                    series: [
                        {   
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            data: options._pieChartsData.chartData.sort(function (a, b) { return a.value - b.value }),
                            roseType: 'angle',
                            itemStyle: {
                                normal: {
                                    shadowBlur: 200,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
            }
            else if (options.pieChartsType == "dount") {
                options._pieChartsData.option = {
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

                    color: options._pieChartsData.chartColor,

                    series: [
                        {   
                            type: 'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            
                            data: options._pieChartsData.chartData,
                        }
                    ]
                };
            }
            else if (options.pieChartsType == "nestDount") {
                options._pieChartsData.option = {
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

                    color: options._pieChartsData.chartColor,

                    series: [
                        {   
                            type: 'pie',
                            radius : ['40%', '55%'],

                            data: options._pieChartsData.chartData,
                        },

                        {   
                            type: 'pie',
                            radius : [0, '30%'],
                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },

                            data: options._pieChartsData.stackData,
                        }
                    ]
                };
            }
            else if (options.pieChartsType == "texture") {
                var piePatternImg = new Image();
                piePatternImg.src = "/dist/editor/resources/img/jiangb/texture_bg.jpg";

                var itemStyle = {
                    normal: {
                        opacity: 0.7,
                        color: {
                            image: piePatternImg,
                            repeat: 'repeat'
                        },
                        borderWidth: 3,
                        borderColor: '#235894'
                    }
                };

                options._pieChartsData.option = {
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

                    color: options._pieChartsData.chartColor,

                    series: [
                        {   
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],

                            data: options._pieChartsData.chartData,
                        }
                    ],

                    itemStyle: itemStyle
                };

            }
            else if (options.pieChartsType == "nightingale") {
                options._pieChartsData.option = {
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

                    color: options._pieChartsData.chartColor,

                    series: [
                        {   
                            type: 'pie',
                            radius : ["10%", "60%"],
                            center: ['50%', '50%'],
                            roseType: 'area',

                            data: options._pieChartsData.chartData,
                        }
                    ]
                };
            }

            if (options.showLegend) {
                options._pieChartsData.option.legend = {
                    orient: "horizontal",
                    left: "center",
                    bottom: "10px",
                    data: options._pieChartsData.legendData
                };
            }

            options._myChart.setOption(options._pieChartsData.option);

        
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
                options._pieChartsData.option.title.text = updates["title"];
                options._myChart.setOption(options._pieChartsData.option);
            }

            if ("chartTextColor" in updates) {
                options._pieChartsData.option.title.textStyle.color = updates["chartTextColor"];
                options._myChart.setOption(options._pieChartsData.option);
            }

            if ("showLegend" in updates) {
                if (updates["showLegend"]) {
                    options._pieChartsData.option.legend = {
                        orient: "horizontal",
                        left: "center",
                        bottom: "10px",
                        data: options._pieChartsData.legendData
                    };
                }
                else {
                    options._pieChartsData.option.legend = null;
                }

                options._myChart = echarts.init(options._pieChart);
                options._myChart.setOption(options._pieChartsData.option);
            }


            /*
             *设置饼图类型
             **/
            if ("pieChartsType" in updates) {
                if (updates["pieChartsType"] == "normal") {
                    options._myChart = echarts.init(options._pieChart);

                    options._pieChartsData.option = {
                        title: {
                            text: options._optHolder.title,
                            top: "10px",
                            left: "center",
                            textStyle: {
                                color: options._optHolder.chartTextColor
                            }
                        },

                        tooltip: {
                           
                        },

                        series: [
                            {   
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '50%'],
                                data: options._pieChartsData.chartData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };

                    if (options._optHolder.showLegend) {
                        options._pieChartsData.option.legend = {
                            orient: "horizontal",
                            left: "center",
                            bottom: "10px",
                            data: options._pieChartsData.legendData
                        };
                    }

                    if (options._pieChartsData.chartColor.length > 0) {
                        options._pieChartsData.option.color = options._pieChartsData.chartColor;
                    }

                    options._myChart.setOption(options._pieChartsData.option);
                }
                else if (updates["pieChartsType"] == "customized") {
                    options._myChart = echarts.init(options._pieChart);

                    options._pieChartsData.option = {
                        title: {
                            text: options._optHolder.title,
                            top: "10px",
                            left: "center",
                            textStyle: {
                                color: options._optHolder.chartTextColor
                            }
                        },

                        tooltip: {
                               
                        },

                        series: [
                            {   
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '50%'],
                                data: options._pieChartsData.chartData.sort(function (a, b) { return a.value - b.value }),
                                roseType: 'angle',
                                itemStyle: {
                                    normal: {
                                        shadowBlur: 200,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };

                    if (options._optHolder.showLegend) {
                        options._pieChartsData.option.legend = {
                            orient: "horizontal",
                            left: "center",
                            bottom: "10px",
                            data: options._pieChartsData.legendData
                        };
                    }

                    if (options._pieChartsData.chartColor.length > 0) {
                        options._pieChartsData.option.color = options._pieChartsData.chartColor;
                    }

                    options._myChart.setOption(options._pieChartsData.option);
                }
                else if (updates["pieChartsType"] == "dount") {
                    options._myChart = echarts.init(options._pieChart);

                    options._pieChartsData.option = {
                        title: {
                            text: options._optHolder.title,
                            top: "10px",
                            left: "center",
                            textStyle: {
                                color: options._optHolder.chartTextColor
                            }
                        },

                        tooltip: {
                           
                        },

                        series: [
                            {   
                                type: 'pie',
                                radius: ['50%', '70%'],
                                center: ['50%', '50%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                
                                data: options._pieChartsData.chartData,
                            }
                        ]
                    };

                    if (options._optHolder.showLegend) {
                        options._pieChartsData.option.legend = {
                            orient: "horizontal",
                            left: "center",
                            bottom: "10px",
                            data: options._pieChartsData.legendData
                        };
                    }

                    if (options._pieChartsData.chartColor.length > 0) {
                        options._pieChartsData.option.color = options._pieChartsData.chartColor;
                    }

                    options._myChart.setOption(options._pieChartsData.option);
                }
                else if (updates["pieChartsType"] == "nestDount") {
                    options._myChart = echarts.init(options._pieChart);

                    options._pieChartsData.option = {
                        title: {
                            text: options._optHolder.title,
                            top: "10px",
                            left: "center",
                            textStyle: {
                                color: options._optHolder.chartTextColor
                            }
                        },

                        tooltip: {
                           
                        },

                        series: [
                            {   
                                type: 'pie',
                                radius : ['40%', '55%'],

                                data: options._pieChartsData.chartData,
                            },

                            {   
                                type: 'pie',
                                radius : [0, '30%'],
                                label: {
                                    normal: {
                                        position: 'inner'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },

                                data: options._pieChartsData.stackData,
                            }

                        ]
                    };

                    if (options._optHolder.showLegend) {
                        options._pieChartsData.option.legend = {
                            orient: "horizontal",
                            left: "center",
                            bottom: "10px",
                            data: options._pieChartsData.legendData
                        };
                    }

                    if (options._pieChartsData.chartColor.length > 0) {
                        options._pieChartsData.option.color = options._pieChartsData.chartColor;
                    }

                    options._myChart.setOption(options._pieChartsData.option);
                }
                else if (updates["pieChartsType"] == "texture") {
                    options._myChart = echarts.init(options._pieChart);

                    var piePatternImg = new Image();
                    piePatternImg.src = "/dist/editor/resources/img/jiangb/texture_bg.jpg";

                    var itemStyle = {
                        normal: {
                            opacity: 0.7,
                            color: {
                                image: piePatternImg,
                                repeat: 'repeat'
                            },
                            borderWidth: 3,
                            borderColor: '#235894'
                        }
                    };

                    options._pieChartsData.option = {
                        title: {
                            text: options._optHolder.title,
                            top: "10px",
                            left: "center",
                            textStyle: {
                                color: options._optHolder.chartTextColor
                            }
                        },

                        tooltip: {
                               
                        },

                        series: [
                            {   
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '50%'],

                                data: options._pieChartsData.chartData,
                            }
                        ],

                        itemStyle: itemStyle
                    };

                    if (options._optHolder.showLegend) {
                        options._pieChartsData.option.legend = {
                            orient: "horizontal",
                            left: "center",
                            bottom: "10px",
                            data: options._pieChartsData.legendData
                        };
                    }

                    if (options._pieChartsData.chartColor.length > 0) {
                        options._pieChartsData.option.color = options._pieChartsData.chartColor;
                    }

                    options._myChart.setOption(options._pieChartsData.option);
                }
                else if (updates["pieChartsType"] == "nightingale") {
                    options._myChart = echarts.init(options._pieChart);

                    options._pieChartsData.option = {
                        title: {
                            text: options._optHolder.title,
                            top: "10px",
                            left: "center",
                            textStyle: {
                                color: options._optHolder.chartTextColor
                            }
                        },

                        tooltip: {
                           
                        },

                        series: [
                            {   
                                type: 'pie',
                                radius : ["10%", "60%"],
                                center: ['50%', '50%'],
                                roseType: 'area',

                                data: options._pieChartsData.chartData,
                            }
                        ]
                    };

                    if (options._optHolder.showLegend) {
                        options._pieChartsData.option.legend = {
                            orient: "horizontal",
                            left: "center",
                            bottom: "10px",
                            data: options._pieChartsData.legendData
                        };
                    }

                    if (options._pieChartsData.chartColor.length > 0) {
                        options._pieChartsData.option.color = options._pieChartsData.chartColor;
                    }

                    options._myChart.setOption(options._pieChartsData.option);
                }
            }
            
            // seriesData数据更新
            if ("seriesData" in updates) {
                options._pieChartsData.legendData = [];
                options._pieChartsData.chartData = [];
                options._pieChartsData.chartColor = [];
                options._pieChartsData.stackData = [];

                $.each(updates["seriesData"][0], function (i, item) {
                    // 遍历设置legend属性name值
                    options._pieChartsData.legendData.push(item.name);

                    // 遍历设置color值
                    options._pieChartsData.chartColor.push(item.color);

                    // 遍历设置series属性data的值
                    options._pieChartsData.chartData[i] = {};
                    options._pieChartsData.chartData[i]["value"] = item.value;
                    options._pieChartsData.chartData[i]["name"] = item.name;
                });

                if (updates["seriesData"].length > 1) {
                    $.each(updates["seriesData"][1], function (i, item) {
                        options._pieChartsData.stackData[i] = {};
                        options._pieChartsData.stackData[i]["value"] = item.value;
                        options._pieChartsData.stackData[i]["name"] = item.name; 
                    });
                }

                // 数据变化更新相应的值，保持最新
                options._pieChartsData.option.color = options._pieChartsData.chartColor;

                if (options._optHolder.showLegend) {
                    options._pieChartsData.option.legend.data = options._pieChartsData.legendData;
                }
                

                $.each(options._pieChartsData.option.series, function (i, item) {
                    if (i == 0) {
                        if (options._optHolder.pieChartsType == "customized") {
                            item.data = options._pieChartsData.chartData.sort(function (a, b) { return a.value - b.value });
                        }
                        else {
                            item.data = options._pieChartsData.chartData; 
                        }
                    }

                    if (i == 1) {
                        item.data = option._pieChartsData.stackData;
                    }

                });

                options._myChart = echarts.init(options._pieChart);
                options._myChart.setOption(options._pieChartsData.option);
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
