

(function(JH5MF) {
    JH5MF.Editor.register("radarCharts",
        "", /*"l10n!/layouts/views/plugins/radarCharts-editor.tmpl",**/
        function(rootElement, jh5mf, baseLayout) {
            var _this = this,
                _rootElement = baseLayout.cloneNode(true),
                _trackEvent,
                _jh5playerOptions,
                _addBtn;
                

            // TODO@ you should decide how insert your private container element into base layout.
            // The codes here is radarCharts only. 
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

                    trackEvent.listen("dataChange.radarCharts", onAreaCountChange);
                    trackEvent.listen("trackeventupdated", onTrackEventUpdated);
                    // to setup property UI.
                    setup(trackEvent);
                },
                close: function() {
                    _trackEvent.unlisten("dataChange.radarCharts", onAreaCountChange);
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

                            var seriesData = [],
                                outputName = [],
                                outputColor = [],
                                maxData = [],
                                radarData = [],
                                radarName = [];

                            var chartData = [],
                                radar = [],
                                mainData = [];

                            $.each(data.rows, function (i, item) {
                                if (i == 0) {
                                    $.each(item.cells, function (j, item2) {
                                        if (j != 0) {
                                            outputName.push(item2.value);
                                            outputColor.push(item2.background);
                                        }
                                    });
                                }
                                else if (i == 1) {
                                    $.each(item.cells, function (j, item2) {
                                        if (j != 0) {
                                            maxData.push(item2.value);
                                        }
                                    });
                                }
                                else {
                                    radarData = [];
                                    $.each(item.cells, function (j, item2) {
                                        if (j == 0) {
                                            radarName.push(item2.value);
                                        }
                                        else {
                                            radarData.push(item2.value);
                                        }
                                    });
                                    chartData.push(radarData);
                                }
                                
                            });

                            for (var i = 0; i < outputName.length; i++) {
                                radar.push({ max: maxData[i], name: outputName[i], color: outputColor[i] });
                            }

                            for (var i= 0; i < radarName.length; i++ ) {
                                mainData.push({ name: radarName[i], value: chartData[i]});
                            }

                            
                            seriesData.push(radar);
                            seriesData.push(mainData);

                            _this.updateTrackEventSafe(_trackEvent, { "seriesData": seriesData });
                        },

                        sheets: _trackEvent.jh5playerOptions.spreadsheetData  // YOUR SHEET DATA HERE.
                    },
                         
                });

                datasheet.open();
            });
        }
    });
}(window.JH5MF));
