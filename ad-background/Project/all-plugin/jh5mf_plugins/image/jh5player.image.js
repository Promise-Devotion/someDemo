"use strict";
(function(JH5player) {/*
define("image-plugin", ["jh5player", "jquery"], function(JH5player) {**/

    var _mode,
        _trackEvent;

    var DIMESION_UNITS = "px";

    JH5player.plugin("image", {
        _setup: function(options, mode, trackEvent) {

            var _container;

            _mode = mode;
            _trackEvent = trackEvent;

            options._container = _container = $(  '<div>'
                                                + (options.src && options.src.length > 1 ? ('<img src="' + options.src + '" style="width:100%;height:100%;" />') : '') 
                                                + '</div>')[0];
            _container.classList.add("jh5player-image");

            _trackEvent.appendJH5playerElement(_container, options);

            options.toString = function() {
                var _splitSource = [];
                if (options.title) {
                    return options.title;
                } else if (/^data:/.test(options.src)) {
                    // might ba a data URI
                    return options.src.substring(0, 30) + "...";
                } else if (options.src) {
                    _splitSource = options.src.split("/");
                    return _splitSource[_splitSource.length - 1];
                }
                return "Image Plugin";
            };
        },

        _update: function(options, updates) {
            // it updates the common properties, such as: color, 
            // background, font, shadow, border, opacity, rotation, etc.
            // you just care your special only.
            _trackEvent.updateJH5playerElement(options, updates);

            if ("src" in updates) {
                var imageContainer = $(options._containerWithWrapper).find(".jh5player-image img");

                if (imageContainer.length > 0) {
                    imageContainer[0].src = updates.src;
                }
                else {
                    $(options._containerWithWrapper).find(".jh5player-image")
                                                    .append('<img src="' + updates.src + '" style="width:100%;height:100%" />');
                }
            }
        },

        start: function(event, options) {
            $(options._containerWithWrapper).removeClass('off');
        },

        end: function(event, options) {
        },

        _teardown: function(options) {
            // TODO@do something here.
            // ...
            
            // to remove jh5player element from presentation container.
            _trackEvent.removeJH5playerElement(options);
        },

        manifest: {
            about: {
                name: "JH5player image Plugin",
                version: "0.2",
                author: "john.k.ch2012@gmail.com",
                website: "http://h5prezi.me"
            },
            options: {
                aspectRatio: {
                    default: true, hidden: true,
                },
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
                left: {
                    elem: "input", type: "number", label: "Left", units: DIMESION_UNITS, default: 0, hidden: true
                },
                top: {
                    elem: "input", type: "number", label: "Top", units: DIMESION_UNITS, default: 0, hidden: true
                },
                width: {
                    elem: "input", type: "number", units: DIMESION_UNITS, label: "Width", default: -1, hidden: true
                },
                height: {
                    elem: "input", type: "number", units: DIMESION_UNITS, label: "Height", default: -1, hidden: true
                },
                zindex: {
                    hidden: true
                },
                start: {
                    elem: "input", type: "text", label: "In", units: "seconds", hidden: true
                },
                end: {
                    elem: "input", type: "text", label: "Out", units: "seconds", hidden: true
                },
                src: {
                    elem: "input",
                    type: "text",
                    label: "Source URL",
                    default: "",
                    hidden: true, 
                },
                background: {
                    elem: "color",  type: "text", label: "Background", default: "rgba(0,0,0,0)"
                },
                opacity: {
                    elem: "slider",  type: "number", min: 0, max: 1, step: 0.01, label: "Opacity", default: 1, units: "%"
                },
                rotation: {
                    elem: "slider",  type: "number", min: 0, max: 360, step: 1, label: "Rotation", default: 0, units: "deg"
                },
                title: {
                    elem: "input",
                    type: "text",
                    label: "Image Title",
                    default: "",
                    hidden: true,
                },
                borderStyle: {
                    elem: "select", type: "text", label: "Border style", default: "none",
                    values:  ["none", "solid", "dashed"], 
                    options: ["None", "Solid", "Dashed"], 
                    disableOptions: ["borderColor", "borderWidth", "borderRadius"], 
                    disable: "none",
                },
                borderColor: {
                    elem: "color",  type: "text", label: "Border color", default: "#000000"
                },
                borderWidth: {
                    elem: "input",  type: "number", min: 1, max: 20, label: "Border width", default: 1, units: "px", step: 1,
                },
                borderRadius: {
                    elem: "input",  type: "number", min: 0, max: 50, label: "Border radius", default: 0, units: "px", step: 1,
                },/*
                shadowColor: {
                    elem: "color",  type: "text", label: "Shadow color", default: "#000000"
                },
                shadowWidth: {
                    elem: "input",  type: "number", min: 0, max: 20, label: "Shadow width", default: 0, units: "px", step: 1,
                },*/
            }
        }
    });
}(window.JH5player));/*    
});**/
//}( window.JH5player ));
