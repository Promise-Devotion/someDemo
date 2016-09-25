
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
     * shape JH5player plug-in
     * author: jiangb
     *
     * shape:
     **/
    JH5player.plugin("shape", {

        manifest: {
            about: {
                name: "JH5player shape plugin",
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
                    elem: "input", type: "number", default: 64, units: DIMESION_UNITS, hidden: true
                },
                height: {
                    elem: "input", type: "number", default: 64, units: DIMESION_UNITS, hidden: true
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
                /* the shape optionss **/
                src: {
                    default: "", hidden: true
                },
                svgData: {
                    default: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><rect fill="#08A1EF" width="64" height="64"></svg>',
                    hidden: true,
                },
                colors: {
                    elem: "colors",  type: "array", label: "Color", default: ["#FFFFFF"],
                },
                background: {
                    elem: "color",  type: "text", label: "Background", default: "#f2f2f2"
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
            /*
             * trackEvent has a dispatch() method from EventManager of TrackEvent.
             * it can trigger event to the trackEvent's listener.
             *
             * shape: _trackEvent.dispatch("eventName", eventData);
             *
             **/
            _mode = mode;
            _trackEvent = trackEvent;

            var colors = [];

            /*=========================
                初始化DOM操作
              =========================*/
            options._container = _container = $('<div></div>')[0];
            
            _trackEvent.appendJH5playerElement(_container, options);

            var $svg = $(options.svgData);

            options._svg = $svg[0];
 
            $(options._container).parent().css({
                width: "100%", height: "100%"
            });
            $(options._container).css({
                width: "100%", height: "100%"
            });
            $svg.attr("width", "100%").attr("height", "100%");

            $svg.find('[fill]').each(function (i) {
                colors.push($(this).attr('fill') || 'transparent');
            });

            $(options._container).empty();
            $svg.appendTo($(options._container));

            if (_mode === 'editor') {
                setTimeout(function () {
                    _trackEvent.dispatch("colorchanged.shape", colors);
                }, 500);
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

            if ("src" in updates) {
                $.ajax({
                url: updates["src"],
                async: false,
                success : function (data) {
                        $(options._container).empty();

                        var $svg = $(data).children();
                        options._svg = $svg[0];

                        $(options._svg).attr("preserveAspectRatio", "none");

                        $(options._container).parent().css({
                            width: "100%", height: "100%"
                        });

                        $(options._container).css({
                            width: "100%", height: "100%"
                        });

                        $svg.attr("width", "100%");
                        $svg.attr("height", "100%");

                        $svg.appendTo($(options._container));

                        var colors = [];

                        $svg.find('[fill]').each(function (i) {
                            colors.push($(this).attr('fill') || 'transparent');
                        });

                        if (_mode === 'editor') {
                            _trackEvent.dispatch("colorchanged.shape", colors);
                        }
                    }
                });
            }

            if ("colors" in updates) {
                var colors = options._optHolder.colors;

                for (var i = 0; i < colors.length; i++) {
                    $(options._container).find("svg [fill]").eq(i).attr("fill", colors[i]);
                }

                options._svg = $(options._container).find("svg")[0];
            }

            if (_mode === 'editor') {
                _trackEvent.dispatch("svgchanged.shape", options._svg.outerHTML);
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
