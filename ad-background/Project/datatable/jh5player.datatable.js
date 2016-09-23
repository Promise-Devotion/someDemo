/**
 * Created by jian on 2016/8/15.
 */

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
     * datatable JH5player plug-in
     * author: wangsj
     *
     * datatable:
     **/
    JH5player.plugin("datatable", {

        manifest: {
            about: {
                name: "JH5player datatable plugin",
                version: "0.1",
                author: "wangsj", website: "http://www.h5cld.cn"
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
                rotation: {
                    elem: "slider",
                    type: "number",
                    min: 0,
                    max: 360,
                    step: 1,
                    label: "Rotation",
                    default: 0,
                    units: "deg"
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
                /* the datatable options **/
                spreadsheetData:  {
                    default: {
                        rows: [
                                { cells: [ { value: "productName" }, 
                                           { value: "category" }]
                                },
                                { cells: [ { value: "Tea" }, 
                                           { value: "Beverages" } ]
                                },
                                { cells: [ { value: "Coffee" }, 
                                           { value: "Beverages" } ]
                                }
                        ],
                        name: "Sheet1",
                    },
                    hidden: true
                },
                seriesData: {
                    default: {
                        data: [
                            { productName: "Tea", category: "Beverages" },
                            { productName: "Coffee", category: "Beverages" }                            
                        ],
                        columns: [
                            { field: "productName" },
                            { field: "category" }
                        ]
                    },
                    hidden: true
                },
                opacity: {
                    elem: "slider", type: "number", min: 0, max: 1, step: 0.01, label: "Opacity", default: 1, units: "%"
                },
                background: {
                    elem: "color", type: "text", label: "Background", default: "transparent"
                },
                borderEnabled: {
                    elem: "checkbox", type: "boolean", label: "Border", checkboxLabel: "Border enabled", default: false,
                    binds: ["borderColor", "borderWidth", "borderStyle", "borderRadius"]
                },
                borderColor: {
                    elem: "color", type: "text", label: "Color", default: "#000000"
                },
                borderWidth: {
                    elem: "input", type: "number", min: 0, max: 20, label: "Width", default: 0, units: "px", step: 1
                },
                borderStyle: {
                    elem: "select", type: "text", label: "Style", default: "none",
                    values: ["none", "solid", "dashed"],
                    options: ["None", "Solid", "Dashed"]
                },
                borderRadius: {
                    elem: "input",  type: "number", min: 0, max: 50, label: "Radius", default: 0, units: "px", step: 1,
                },
                displayMode: {
                    elem: "select", type: "text", label: "DisplayMode", default: "static",
                    values: ["scrolling", "static", "pager"],
                    options: ["Scrolling", "Static", "Pager"]
                }
            }
        },

        _setup: function (options, mode, trackEvent) {
            /*
             * this is a private container for holding the player element
             */
            var _container,
                _myTable;
            _mode = mode;
            _trackEvent = trackEvent;
            options._dataTableData = {};
            options._dataTableData.option = {};
            /*
             设置数据
             */

            /*
             对容器添加元素
             */
            options._container = _container = $('<div></div>')[0];
            options._myTable = _myTable = $('<div></div>')[0];

            _container.classList.add('jh5player-datatable');
            $(_container).append($(_myTable));
            //$(options._myTable).css({width: "100%", height: "100%"});
            _trackEvent.appendJH5playerElement(_container, options);

            /*
             ** 初始化kendogrid
             */
            options._myTable = $(options._myTable).kendoGrid(options._myTable);
            /*
             设置dataTable基本属性
             */
            options._dataTableData.option = {
                groupable: false,
                sortable: false,
                pageable: false,
                selectable: false,
                scrollable: false,

                dataSource: options.seriesData.data,
                columns: options.seriesData.columns
            };

            $(options._myTable).kendoGrid(options._dataTableData.option);

            //将更新的数据保存
            options._optHolder = optionHolderInit(options);
        },

        _update: function (options, updates) {
            // it updates the common properties, such as: color,
            // background, font, shadow, border, opacity, rotation, etc.
            // you just care your special only.
            _trackEvent.updateJH5playerElement(options, updates);
            //to update the value with new, and sync holder
            optionHolderUpdate(options._optHolder, updates);

            if("displayMode" in updates){
                if(updates["scrolling"]){
                    options._dataTableData.option = {
                        groupable: true,
                        sortable: true,
                        pageable: false,
                        selectable: false,
                        scrollable: true,

                        dataSource: options.seriesData.data,
                        
                        columns: options.seriesData.columns
                    }
                }
                else if(updates["static"]){
                    options._dataTableData.option = {
                        groupable: false,
                        sortable: false,
                        pageable: false,
                        selectable: false,
                        scrollable: false,

                        dataSource: options.seriesData.data,
                        columns: options.seriesData.columns
                    }
                }
                else {
                    options._dataTableData.option = {
                        groupable: false,
                        sortable: false,
                        pageable: false,
                        selectable: false,
                        scrollable: false,

                        dataSource: options.seriesData.data,

                        columns: options.seriesData.columns
                    }
                }
                options._myTable = kendoGrid(options._myTable);
                options._myTable.kendoGrid(options._dataTableData.option);
            }
            //seriesData数据发生了变化
            if("seriesData" in updates){
                options._dataTableData.tableData = updates["seriesData"].data;
                options._dataTableData.option.dataSource = options._dataTableData.tableData;

                options._myTable = kendoGrid(options._myTable);
                options._myTable.kendoGrid(options._dataTableData.option);
            }
            //尺寸发生变化，重新绘图
            options._myTable.resize();
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
        }
    });
}(window.JH5player));
