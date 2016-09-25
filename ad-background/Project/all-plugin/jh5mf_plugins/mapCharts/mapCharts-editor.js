

(function(JH5MF) {
    JH5MF.Editor.register("mapCharts",
        "", /*"l10n!/layouts/views/plugins/mapCharts-editor.tmpl",**/
        function(rootElement, jh5mf, baseLayout) {
            var _this = this,
                _rootElement = baseLayout.cloneNode(true),
                _trackEvent,
                _jh5playerOptions,
                _addBtn;
                

            // TODO@ you should decide how insert your private container element into base layout.
            // The codes here is mapCharts only. 
            // YOU SHOULD CHANGE IT FOR YOUR DESIGN MAYBE.
            if (rootElement)
                _rootElement.querySelector('.editor-options').appendChild(rootElement);

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

                 _addBtn = $('<button class = "btn btn-success btn-block" type = "button">Edit Data</button>')[0];
                _rootElement.querySelector('.editor-options').appendChild(_addBtn);

                addSource(_addBtn);

            };

            function onTrackEventUpdated(e) {
                _trackEvent = e.target;
                _this.updatePropertiesFromManifestWithKendoUI(_trackEvent);
            }

            function onAreaCountChange (e) {
                _trackEvent.updateSilently({
                    'seriesData': e.data
                });
            }

            JH5MF.Editor.TrackEventEditor.extend(_this, jh5mf, _rootElement, {
                open: function(parentElement, trackEvent) {
                    _trackEvent = trackEvent;
                    _jh5playerOptions = _trackEvent.jh5playerOptions;

                    trackEvent.listen("dataChange.mapCharts", onAreaCountChange);
                    trackEvent.listen("trackeventupdated", onTrackEventUpdated);
                    // to setup property UI.
                    setup(trackEvent);
                },
                close: function() {
                    _trackEvent.unlisten("dataChange.mapCharts", onAreaCountChange);
                    _trackEvent.unlisten("trackeventupdated", onTrackEventUpdated);
                    // WARNING@the below codes must be called for kendo UI.
                    _this.destroyPropertiesFromManifestWithKendoUI({
                        trackEvent: _trackEvent
                    });
                }
            });

            function addSource (addBtn) {
                 $(addBtn).on("click", function() {
                    datasheet = JH5MF.app.dialog.spawn("datasheet-editor",{
                      data: {
                        callback: function(data) {
                            _trackEvent.updateSilently({
                                'spreadsheetData': data
                            });

                            var legend = [];
                            var seriesData = [];

                            $.each(data.rows, function (i, item) {
                                if (i == 0) {
                                    $.each(item.cells, function (j, item2) {
                                        if (j != 0) {
                                            var legendObj = {};
                                            legendObj["product"] = item2.value;
                                            legendObj["color"] = item2.background;
                                            legend.push(legendObj);
                                        }
                                    });

                                    seriesData.push(legend);

                                    $.each(legend, function () {
                                        seriesData.push([]);
                                    });
                                }
                                else {
                                    $.each(legend, function (k, item3) {
                                        if(item.cells[k + 1].value != "-") {
                                            var obj = {};
                                            obj["name"] = item.cells[0].value;
                                            obj["value"] = item.cells[k + 1].value;
                                            seriesData[k + 1].push(obj);
                                        }
                                    });
                                }
                            });

                            _this.updateTrackEventSafe(_trackEvent, { "seriesData": seriesData});
                        },

                        sheets: _trackEvent.jh5playerOptions.spreadsheetData  // YOUR SHEET DATA HERE.
                    },
                         
                });

                datasheet.open();
            });
        }
    });
}(window.JH5MF));
