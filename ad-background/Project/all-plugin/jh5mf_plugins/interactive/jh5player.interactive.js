
(function(JH5player) {

    var _mode,
        _trackEvent;

    var DIMESION_UNITS = "px";

    var optionHolderInit = function (options) {
        var manifest = options._natives.manifest.options,
            opt = {};

        for (var k in manifest) {
            if ('default' in manifest[k]) {
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
     * interactive JH5player plug-in
     * author: jiangb
     *
     * interactive:
     **/
    JH5player.plugin("interactive", {

        manifest: {
            about: {
                name: "JH5player interactive plugin",
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
                    elem: "input", type: "number", default: 128, units: DIMESION_UNITS, hidden: true
                },
                height: {
                    elem: "input", type: "number", default: 128, units: DIMESION_UNITS, hidden: true
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
                /* the interactive optionss **/
                icon: {
                    default: "",
                    hidden: true
                },
                iconFontSize: {
                    elem: "slider",  type: "number", min: 10, max: 200, step: 1, label: "Font Size", default: 20, units: "px"
                },
                color: {
                    elem: "color",  type: "text", label: "Color", default: "skyblue"
                },
                background: {
                    elem: "color",  type: "text", label: "Background", default: "transparent"
                },
                opacity: {
                    elem: "slider",  type: "number", min: 0, max: 1, step: 0.01, label: "Opacity", default: 1, units: "%"
                },
                rotation: {
                    elem: "slider",  type: "number", min: 0, max: 360, step: 1, label: "Rotation", default: 0, units: "deg"
                },
                borderRadius: {
                    elem: "input",  type: "number", min: 0, max: 50, label: "Radius", default: 0, units: "px", step: 1,
                },
                shadowEnabled: {
                    elem: "checkbox",  type: "boolean", label: "Shadow", checkboxLabel: "Shadow enabled", default: true,
                    binds: ["shadowColor", "shadowWidth"],
                },
                shadowColor: {
                    elem: "color",  type: "text", label: "Color", default: "#000000"
                },
                shadowWidth: {
                    elem: "input",  type: "number", min: 0, max: 20, label: "Width", default: 0, units: "px", step: 1,
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

            /*
             * 对容器添加元素
             **/
            options._container = _container = $('<div></div>')[0];
            _container.classList.add("jh5player-interactive");

            _trackEvent.appendJH5playerElement(_container, options);

            options._interactiveBox = $('<span></span>')[0];
            $(options._interactiveBox).css({ 
                "padding":"5px", 
                "font-size": options.iconFontSize
            }).appendTo($(options._container));

            var h = $(options._container).parent().parent().height();
            $(options._container).css({ "line-height": h + "px" });


            if (options.icon != "") {
                $(options._interactiveBox).empty();

                options._interactiveIcon = $('<i></i>')[0];
                $(options._interactiveIcon).addClass(options.icon.style).appendTo($(options._interactiveBox));

                options._interactiveText = $('<span>0</span>')[0];
                $(options._interactiveText).css({ "margin-left": "5px" }).appendTo($(options._interactiveBox));

                // ajax请求
                if (_mode == 'player') {
                    $.ajax({
                        type: "GET",
                        url: "http://123.56.29.158:4004/dist/editor/resources/data/jiangb/count.json",
                        dataType: "json",
                        success: function (data) {
                            $(options._interactiveText).html(data.count);
                        }
                    });
                }

                // 绑定点击事件
                $(options._interactiveIcon).on("click", function () {
                    var count = parseInt($(this).siblings('span').html()); 

                    count++;

                    if ($(this).hasClass('fa-heart')) {
                        $.post("url", {data: count, name: "heart"}, function () {
                            $(this).siblings('span').html(count);
                        });
                    }
                    else if ($(this).hasClass('fa-thumbs-o-up')) {
                        $.post("url", {data: count, name: "praise"}, function () {
                            $(this).siblings('span').html(count);
                        });
                    }
                    else if ($(this).hasClass('fa-gift')) {
                        $.post("url", {data: count, name: "gift"}, function () {
                            $(this).siblings('span').html(count);
                        });
                    }
                    else if ($(this).hasClass('fa-sticky-note')) {
                        $.post("url", {data: count, name: "vote"}, function () {
                            $(this).siblings('span').html(count);
                        });
                    }
                });

            }
            else {
                $('<b>No Icon</b>').appendTo($(options._interactiveBox));
            }

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

            // 每次更新居中对齐
            var h = $(options._container).parent().parent().height();
            $(options._container).css({ "line-height": h + "px" });

            if ("icon" in updates) {
                $(options._interactiveBox).empty();

                options._interactiveIcon = $('<i></i>')[0];
                $(options._interactiveIcon).addClass(updates["icon"].style).appendTo($(options._interactiveBox));

                options._interactiveText = $('<span>0</span>')[0];
                $(options._interactiveText).css({ "margin-left": "5px" }).appendTo($(options._interactiveBox));
            }

            if ("iconFontSize" in updates) {
                $(options._interactiveBox).css({ "font-size": updates["iconFontSize"] });
            }

            if ("color" in updates) {
                $(options._interactiveBox).css({ "color": updates["color"] });
            }
                     
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
