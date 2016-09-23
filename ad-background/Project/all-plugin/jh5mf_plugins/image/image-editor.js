(function(JH5MF) {
    JH5MF.Editor.register("image", "l10n!/layouts/views/plugins/image-editor.tmpl", function(rootElement, jh5mf, baseLayout) {
        var _this = this,
            _rootElement = baseLayout.cloneNode(true),
            _trackEvent,
            _jh5playerOptions;

        // TODO@ you should decide how insert your private container element into base layout.
        // The codes here is example only. 
        // YOU SHOULD CHANGE IT FOR YOUR DESIGN MAYBE.
        if (rootElement)
            _rootElement.querySelector(".editor-options").appendChild(rootElement);

        var setup = function(trackEvent) {
            var pluginOptions = {};

            function callback(elementType, element, trackEvent, name) {
                pluginOptions[name] = {
                    element: element,
                    trackEvent: trackEvent,
                    elementType: elementType
                };
            }
            var attachHandlers = function() {
                for (key in pluginOptions) {
                    if (pluginOptions.hasOwnProperty(key)) {
                        option = pluginOptions[key];
                        _this.attachPropertyElementChangeHandlers(option.element, option.trackEvent, key, _this.updateTrackEventSafe);
                    }
                }
            };

            _this.createPropertiesFromManifestWithKendoUI({
                trackEvent: trackEvent,
                callback: callback,
                ignoreManifestKeys: ["start", "end"]
            });

            attachHandlers();
            _this.updatePropertiesFromManifestWithKendoUI(trackEvent);
        };

        function onTrackEventUpdated(e) {
            _trackEvent = e.target;
            _this.updatePropertiesFromManifestWithKendoUI(_trackEvent);
        }

        JH5MF.Editor.TrackEventEditor.extend(_this, jh5mf, _rootElement, {
            open: function(parentElement, trackEvent) {
                _trackEvent = trackEvent;
                _jh5playerOptions = _trackEvent.jh5playerOptions;

                trackEvent.listen("trackeventupdated", onTrackEventUpdated);
                // to setup property UI.
                setup(trackEvent);
            },
            close: function() {
                _trackEvent.unlisten("trackeventupdated", onTrackEventUpdated);
                // WARNING@the below codes must be called for kendo UI.
                _this.destroyPropertiesFromManifestWithKendoUI({
                    trackEvent: _trackEvent
                });
            }
        });
    });
}(window.JH5MF));
