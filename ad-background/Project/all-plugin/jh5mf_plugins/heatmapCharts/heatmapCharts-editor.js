(function (JH5MF) {
    JH5MF.Editor.register("heatmapCharts",
        "", /*"l10n!/layouts/views/plugins/heatmapCharts-editor.tmpl",**/
        function (rootElement, jh5mf, baseLayout) {
            var _this = this,
                _rootElement = baseLayout.cloneNode(true),
                _trackEvent,
                _jh5playerOptions,
                _addBtn;


            // TODO@ you should decide how insert your private container element into base layout.
            // The codes here is heatmapCharts only. 
            // YOU SHOULD CHANGE IT FOR YOUR DESIGN MAYBE.
            if (rootElement)
                _rootElement.querySelector('.editor-options').appendChild(rootElement);

            var setup = function (trackEvent) {
                var pluginOptions = {};

                function callback(elementType, element, trackEvent, name) {
                    pluginOptions[name] = {
                        element: element,
                        trackEvent: trackEvent,
                        elementType: elementType
                    };
                }

                var attachHandlers = function () {
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

            function onAreaCountChange(e) {
                _trackEvent.updateSilently({
                    'seriesData': e.data
                });
            }

            JH5MF.Editor.TrackEventEditor.extend(_this, jh5mf, _rootElement, {
                open: function (parentElement, trackEvent) {
                    _trackEvent = trackEvent;
                    _jh5playerOptions = _trackEvent.jh5playerOptions;

                    trackEvent.listen("dataChange.heatmapCharts", onAreaCountChange);
                    trackEvent.listen("trackeventupdated", onTrackEventUpdated);
                    // to setup property UI.
                    setup(trackEvent);
                },
                close: function () {
                    _trackEvent.unlisten("dataChange.heatmapCharts", onAreaCountChange);
                    _trackEvent.unlisten("trackeventupdated", onTrackEventUpdated);
                    // WARNING@the below codes must be called for kendo UI.
                    _this.destroyPropertiesFromManifestWithKendoUI({
                        trackEvent: _trackEvent
                    });
                }
            });

            function addSource(addBtn) {
                $(addBtn).on("click", function () {
                    datasheet = JH5MF.app.dialog.spawn("datasheet-editor", {
                        data: {
                            callback: function (data) {
                                _trackEvent.updateSilently({
                                    'spreadsheetData': data
                                });

                                var chartX = [];
                                var chartY = [];
                                var series = [];
                                var seriesData = [];

                                $.each(data.rows, function (i, item) {
                                    if (i == 0) {
                                        $.each(item.cells, function (j, dom) {
                                            if (j != 0) {
                                                chartX.push(dom.value);
                                            }
                                        });
                                    }
                                    else {
                                        $.each(item.cells, function (j, dom) {
                                            if (j == 0) {
                                                chartY.push(dom.value);
                                            }
                                            else {
                                                var data = [];
                                                data.push(j - 1);
                                                data.push(i - 1);
                                                data.push(dom.value);
                                                series.push(data);
                                            }
                                        });
                                    }
                                });

                                seriesData.push(chartX);
                                seriesData.push(chartY);
                                seriesData.push(series);

                                _this.updateTrackEventSafe(_trackEvent, {"seriesData": seriesData});
                            },

                            sheets: _trackEvent.jh5playerOptions.spreadsheetData  // YOUR SHEET DATA HERE.
                        },

                    });

                    datasheet.open();
                });
            }
        });
}(window.JH5MF));
