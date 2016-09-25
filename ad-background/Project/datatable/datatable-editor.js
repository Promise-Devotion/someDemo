/**
 * Created by jian on 2016/8/15.
 */

(function (JH5MF) {
    JH5MF.Editor.register("datatable",
        "", /*"l10n!/layouts/views/plugins/example-editor.tmpl",**/
        function (rootElement, jh5mf, baseLayout) {
            var _this = this,
                _rootElement = baseLayout.cloneNode(true),
                _trackEvent,
                _jh5playerOptions,
                _addBtn;

            // TODO@ you should decide how insert your private container element into base layout.
            // The codes here is datatable only.
            // YOU SHOULD CHANGE IT FOR YOUR DESIGN MAYBE.
            if (rootElement)
                _rootElement.querySelector(".editor-options").appendChild(rootElement);

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

                /*
                 * add editor data button
                 *
                 */
                _addBtn = $('<button class = "btn btn-success btn-block" type = "button">Edit Data</button>')[0];
                _rootElement.querySelector('.editor-options').appendChild(_addBtn);

                addSource(_addBtn);
            };

            function onTrackEventUpdated(e) {
                _trackEvent = e.target;
                _this.updatePropertiesFromManifestWithKendoUI(_trackEvent);
            }

            JH5MF.Editor.TrackEventEditor.extend(_this, jh5mf, _rootElement, {
                open: function (parentElement, trackEvent) {
                    _trackEvent = trackEvent;
                    _jh5playerOptions = _trackEvent.jh5playerOptions;


                    trackEvent.listen("trackeventupdated", onTrackEventUpdated);
                    // to setup property UI.
                    setup(trackEvent);
                },
                close: function () {
                    _trackEvent.unlisten("trackeventupdated", onTrackEventUpdated);
                    // WARNING@the below codes must be called for kendo UI.
                    _this.destroyPropertiesFromManifestWithKendoUI({
                        trackEvent: _trackEvent
                    });
                }
            });
            /*
             * addSOurce
             */
            function addSource(addBtn) {
                $(addBtn).on("click", function () {
                    datasheet = JH5MF.app.dialog.spawn("datasheet-editor", {
                        data: {
                            callback: (function (data) {
                                _trackEvent.updateSilently({
                                    'spreadsheetData': data
                                });
                                var seriesData = { columns:[], data:[]};
                                data.rows.map(function (d) {
                                    if (0 === d.index) {
                                        d.cells.map(function (e) {
                                            seriesData.columns.push({
                                                field: e.value
                                            });
                                        });
                                    }
                                    else {
                                        var val = {};

                                        d.cells.map(function (e) {
                                            val[seriesData.columns[e.index]["field"]] = e.value;
                                        });
                                        seriesData.data.push(val);
                                    }
                                });

                                _this.updateTrackEventSafe(_trackEvent, {"seriesData": seriesData});
                            }),
                            sheets: _trackEvent.jh5playerOptions.spreadsheetData  // YOUR SHEET DATA HERE.
                        }
                    });
                    datasheet.open();

                });
            }
            });
        }(window.JH5MF));
