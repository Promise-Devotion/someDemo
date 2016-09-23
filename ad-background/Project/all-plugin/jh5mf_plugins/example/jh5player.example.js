"use strict";
(function(JH5player) {

    var _mode,
        _trackEvent;

    var DIMESION_UNITS = "px";

    /**
     * example JH5player plug-in
     * author: john.k.ch2012@gmail.com, 11/10/2015
     *
     * Example:
     **/
    JH5player.plugin("example", {

        manifest: {
            about: {
                name: "JH5player example plugin",
                version: "0.1",
                author: "john.k.ch2012@gmail.com", website: "http://www.h5cld.cn"
            },
            options: {
                applyclass: {
                    default: { 
                        in: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: "none",
                        },
                        emphasis: {
                            effect: 'none', delay: 1.5, duration: 1, count: 1, direct: "none",
                        },
                        out: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: "none",
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
                    elem: "input", type: "number", default: 300, units: DIMESION_UNITS, hidden: true
                },
                height: {
                    elem: "input", type: "number", default: 50, units: DIMESION_UNITS, hidden: true
                },
                top: {
                    elem: "input", type: "number", default: 0, units: DIMESION_UNITS, hidden: true
                },
                left: {
                    elem: "input", type: "number", default: 25, units: DIMESION_UNITS, hidden: true
                },
                start: {
                    elem: "input", type: "text", label: "Start", units: "seconds", hidden: true,
                },
                end: {
                    elem: "input", type: "text", label: "End", units: "seconds", hidden: true,
                },
                zindex: {
                    hidden: true
                },
                /* the example optionss **/
                hello: {
                    elem: "input", type: "text", label: "Text", default: "This is example for JH5MF."
                },
                color: {
                    elem: "color",  type: "array", label: "Color", default: "#000000",
                },
                colors: {
                    elem: "colors",  type: "array", label: "Color", default: ["#000000","ff0000","00ff00"],
                },
                background: {
                    elem: "color",  type: "text", label: "Background", default: "transparent"
                },
                size: {
                    elem: "input",  type: "number", min: 7, max: 128, label: "Size", default: 7, units: "px", step: 1,
                },
                alignStyle: {
                    elem: "radio-material" /* radio **/,  type: "text", label: "Align style", default: "center",
                    options: ['<i class="fa fa-align-left"></i>', '<i class="fa fa-align-center"></i>', '<i class="fa fa-align-right"></i>'],
                    values: ["left", "center", "right"],
                    binds: [], /* FIXME@the binds are not supported in the new version. **/
                },
                decoration: {
                    elem: "checkbox-group-material" /* checkbox-group **/,  type: "boolean", label: "Decoration",
                    checkboxs: {
                        bold: '<i class="fa fa-bold"></i>',
                        italic: '<i class="fa fa-italic"></i>',
                        underline: '<i class="fa fa-underline"></i>',
                    },
                    default: {
                        bold: true,
                        italic: false,
                        underline: false,
                    }
                },
                opacity: {
                    elem: "slider",  type: "number", min: 0, max: 1, step: 0.01, label: "Opacity", default: 1, units: "%", step: 0.01,
                },
                rotation: {
                    elem: "slider",  type: "number", min: 0, max: 360, step: 1, label: "Rotation", default: 0, units: "deg", step: 1,
                },
                borderEnabled: {
                    elem: "checkbox",  type: "boolean", label: "Border", checkboxLabel: "Border enabled", default: false,
                    binds: ["borderColor", "borderWidth", "borderStyle", "borderRadius"],
                },
                borderColor: {
                    elem: "color",  type: "text", label: "Color", default: "#000000"
                },
                borderWidth: {
                    elem: "input",  type: "number", min: 0, max: 20, label: "Width", default: 0, units: "px", step: 1,
                },
                borderStyle: {
                    elem: "select", type: "text", label: "Style", default: "none",
                    values: ["none", "solid", "dashed"],
                    options: ["None", "Solid", "Dashed"],
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
                },
            }
        },

        _setup: function(options, mode, trackEvent) {
            /*
             * it's a private container for holding the player element.
             **/
            var _container;
            /*
             * trackEvent has a dispatch() method from EventManager of TrackEvent.
             * it can trigger event to the trackEvent's listener.
             *
             * example: _trackEvent.dispatch("eventName", eventData);
             *
             **/
            _mode = mode;
            _trackEvent = trackEvent;
            // for example only. pls remove the below setTimeout() calling.
            if (_mode === 'editor') {
                setTimeout(function() {
                    _trackEvent.dispatch("colorchanged.example", ["ab00cc","443322"]);
                }, 500);
            }

            // to create jh5player element container, it's for private used only.
            options._container = _container = $("<div></div>")[0];

            _container.classList.add("jh5player-example");
            // and set the container properties by OPT.
            _container.innerHTML = options.hello;

            // to add jh5player element to presentation container.
            _trackEvent.appendJH5playerElement(_container, options);

            // to implement toString() method.
            options.toString = function() {
                // use the default option if it doesn't exist
                return options.hello || options._natives.manifest.options.hello["default"];
            };
        },

        _update: function(options, updates) {
            // it updates the common properties, such as: color, 
            // background, font, shadow, border, opacity, rotation, etc.
            // you just care your special only.
            _trackEvent.updateJH5playerElement(options, updates);

            // TODO@...

            console.log(updates);
        },

        start: function(event, options) {
            $(options._containerWithWrapper).removeClass('off');
        },

        end: function(event, options) {
            // don't handle the container's display ON/OFF here.
            // it will be handled in effects plugin.
        },

        frame: function(event, options, time) {},

        _teardown: function(options) {
            // TODO@do something here.
            // ...
            
            // to remove jh5player element from presentation container.
            _trackEvent.removeJH5playerElement(options);
        },
    });
}(window.JH5player));
