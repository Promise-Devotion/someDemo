

(function(JH5MF) {
    JH5MF.Editor.register("interactive",
        "", /*"l10n!/layouts/views/plugins/interactive-editor.tmpl",**/
        function(rootElement, jh5mf, baseLayout) {
            var _this = this,
                _rootElement = baseLayout.cloneNode(true),
                _trackEvent,
                _jh5playerOptions,
                _kendodropdownlist;

            // TODO@ you should decide how insert your private container element into base layout.
            // The codes here is interactive only. 
            // YOU SHOULD CHANGE IT FOR YOUR DESIGN MAYBE.
            if (rootElement)
                _rootElement.querySelector('.editor-options').appendChild(rootElement);

            var setup = function(trackEvent) {
                var pluginOptions = {};

                /*
                 * init dropdownlist
                 **/
                _kendodropdownlist = $('<input id="interactiveGroup" style="width: 100%;"/>');
                _rootElement.querySelector('.editor-options').appendChild(_kendodropdownlist[0]);
                _kendodropdownlist.kendoDropDownList({
                    dataTextField: "interactiveName",
                    dataValueField: "style",
                    valueTemplate: '<span>Interactive Menu</span>',
                    template: '<span class="#:data.style#" style="font-size: 24px; vertical-align: middle;"></span><span style="margin-left: 30px;">#:data.content#</span>',
                    dataSource: {
                        data: [
                            { interactiveName: "name1", interactiveId: 1, style: "fa fa-heart", content: "heart" }, 
                            { interactiveName: "name2", interactiveId: 2, style: "fa fa-thumbs-o-up", content: "praise" }, 
                            { interactiveName: "name3", interactiveId: 3, style: "fa fa-gift", content: "gift" }, 
                            { interactiveName: "name4", interactiveId: 4, style: "fa fa-sticky-note", content: "vote" }
                        ],
                    },
                    height: 200,
                    change: interactiveChange,
                    close: interactiveChange
                });

                function interactiveChange (e) {
                    var dataChange = this.dataSource.data().toJSON()[this.selectedIndex];
                    _this.updateTrackEventSafe(trackEvent, { "icon": { style: dataChange.style, content: dataChange.content }});
                }
                

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

                    trackEvent.listen("hello.interactive", function(e) {
                        // demo only here.
                        // trackEvent.updateSilently({
                        //     'hello': "I changed it silently."
                        // });
                    });
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
