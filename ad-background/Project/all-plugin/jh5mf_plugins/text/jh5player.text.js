// PLUGIN: text
(function(JH5player) {/*
define("text-plugin", ["jh5player", "jquery"], function(JH5player) {*/
    /**
     * text JH5player plug-in
     * Based on jh5player.text.js by @humph
     * @param {Object} options
     *
     * Example:
     **/

    var _mode,
        _trackEvent;

    var DIMESION_UNITS = "px";

    var DEFAULT_FONT_COLOR = "#000000",
        DEFAULT_SHADOW_COLOR = "#444444",
        DEFAULT_BACKGROUND_COLOR = "#888888";

    function newlineToBreak(string) {
        // Deal with both \r\n and \n
        return string.replace(/\r?\n/gm, "<br>");
    }

    JH5player.plugin("text", {
        manifest: {
            about: {
                name: "JH5player text Plugin",
                version: "0.2",
                author: "john.k.ch2012@gmail.com"
            },
            options: {
                editable: {
                    hidden: true,
                    holder: ".text-inner-div",
                },
                resizable: {
                    options: {
                        minWidth: 0,
                        handlePositions: "e,w",
                    },
                    hidden: true,
                },
                applyclass: {
                    default: { 
                        in : {
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
                left: {
                    elem: "input", type: "number", label: "Left", units: DIMESION_UNITS, default: 32, hidden: true
                },
                top: {
                    elem: "input", type: "number", label: "Top", units: DIMESION_UNITS, default: 32, hidden: true
                },
                width: {
                    elem: "input", type: "number", units: DIMESION_UNITS, label: "Width", default: 300, hidden: true
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
                text: {
                    elem: "textarea",
                    label: "Text",
                    default: "Click here to edit",
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
                },/*
                borderEnabled: {
                    elem: "checkbox",  type: "boolean", label: "Border", checkboxLabel: "Border enabled", default: false,
                    binds: ["borderColor", "borderWidth", "borderStyle", "borderRadius"],
                },*/
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
                shadowEnabled: {
                    elem: "checkbox",  type: "boolean", label: "Shadow", checkboxLabel: "Shadow enabled", default: true,
                    binds: ["shadowColor", "shadowWidth"],
                },**/
                shadowColor: {
                    elem: "color",  type: "text", label: "Shadow color", default: "#000000"
                },
                shadowWidth: {
                    elem: "input",  type: "number", min: 0, max: 20, label: "Shadow width", default: 0, units: "px", step: 1,
                },
            }
        },

        _setup: function(options, mode, trackEvent) {

            _mode = mode;
            _trackEvent = trackEvent;
            /*
             * it's a private container for holding the player element.
             **/
            var _container;

            // to create jh5player element container, it's for private used only.
            options._container = _container = $('<div><div id="editor" class="text-inner-div"></div></div>')[0];

            _container.classList.add("jh5player-text");

            
            $(_container).find('.text-inner-div')[0].innerHTML = options.text;

            // to add jh5player element to presentation container.
            _trackEvent.appendJH5playerElement(_container, options);

            options.toString = function() {
                // use the default option if it doesn't exist
                return options.text || options._natives.manifest.options.text["default"];
            };
        },

        _update: function(options, updates) {
            // it updates the common properties, such as: color, 
            // background, font, shadow, border, opacity, rotation, etc.
            // you just care your special only.
            _trackEvent.updateJH5playerElement(options, updates);

            // TODO@...
            if ("text" in updates) {
                $(options._containerWithWrapper).find(".text-inner-div")[0].innerHTML = updates["text"];
            }

            console.log(updates);
        },

        start: function(event, options) {
            $(options._containerWithWrapper).removeClass('off');
        },

        end: function(event, options) {
            // don't handle the container's display ON/OFF here.
            // it will be handled in effects plugin.
        },

        _teardown: function(options) {
            // TODO@do something here.
            // ...
            
            // to remove jh5player element from presentation container.
            _trackEvent.removeJH5playerElement(options);
        }
    });
}(window.JH5player));/*
});**/
