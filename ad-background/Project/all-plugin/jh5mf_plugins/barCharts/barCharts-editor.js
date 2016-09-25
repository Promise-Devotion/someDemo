

(function(JH5MF) {
    JH5MF.Editor.register("barCharts",
        "", /*"l10n!/layouts/views/plugins/barCharts-editor.tmpl",**/
        function(rootElement, jh5mf, baseLayout) {
            var _this = this,
                _rootElement = baseLayout.cloneNode(true),
                _trackEvent,
                _jh5playerOptions,
                _addBtn;
                

            // TODO@ you should decide how insert your private container element into base layout.
            // The codes here is barCharts only. 
            // YOU SHOULD CHANGE IT FOR YOUR DESIGN MAYBE.
            if (rootElement)
                _rootElement.querySelector('.editor-options').appendChild(rootElement);

            var setup = function(trackEvent)  {
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

                    trackEvent.listen("dataChange.barCharts", onAreaCountChange);
                    trackEvent.listen("trackeventupdated", onTrackEventUpdated);
                    // to setup property UI.
                    setup(trackEvent);
                },
                close: function() {
                    _trackEvent.unlisten("dataChange.barCharts", onAreaCountChange);
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

                            var series = [];
                            var customName = [];
                            var seriesData = [];

                            $.each(data.rows, function (i, item) {
                                if (i == 0) {
                                    var colorObj = {};
                                    colorObj.color = [];

                                    $.each(item.cells, function (j, item2) {
                                        if (j == 0) {
                                           series[j] = {};

                                           series[j][item2.value] = [];
                                           customName.push(item2.value);
                                        }
                                        else {
                                            series[j] = {};

                                            series[j][item2.value] = [];
                                            customName.push(item2.value);

                                            colorObj.color.push(item2.background);
                                        }
                                        series.push(colorObj);  
                                    })
                                }
                                else {
                                    if (item.cells[0].value != "STACK") {
                                        $.each(series, function (k, item3) {
                                           if (k != series.length - 1) {
                                                var name = customName[k];
                                                item3[name].push(item.cells[k].value);
                                           }
                                        });
                                    }
                                    else {
                                        series[series.length] = {};
                                        series[series.length - 1].stack = [];
                                        $.each(item.cells, function (n, item4) {
                                            if (n != 0) {
                                                series[series.length - 1].stack.push(item4.value);
                                            }
                                        })
                                    }

                                    
                                }
                            });

                            
                            seriesData[0] = {};
                            seriesData[0].xAxis = series[0]['X-AXIS'];

                            seriesData[1] = {};
                            seriesData[1].value = [];

                            seriesData[2] = {};
                            seriesData[2].name = [];


                            seriesData[3] = {};
                            if (series[series.length - 1].stack) {
                                seriesData[3].color = series[series.length - 2].color; 

                                seriesData[4] = {};
                                seriesData[4].stack = series[series.length - 1].stack;   
                            }
                            else {
                              seriesData[3].color = series[series.length - 1].color;
                            }
                            

                            $.each(series, function (i, item) {
                                if (series[series.length - 1].stack) {
                                   if ((i != 0) && (i != (series.length - 2))  && (i != (series.length - 1))) {
                                        seriesData[1].value.push(item[customName[i]]);
                                    }  
                                }
                                else {
                                   if ((i != 0) && (i != (series.length - 1))) {
                                        seriesData[1].value.push(item[customName[i]]);
                                    } 
                                }
                                
                            });

                            $.each(customName, function (i, item) {
                                if (i != 0) {
                                    seriesData[2].name.push(item);
                                }
                            });

                            _this.updateTrackEventSafe(_trackEvent, { "seriesData": seriesData});
                        },

                        sheets: _trackEvent.jh5playerOptions.spreadsheetData  // YOUR SHEET DATA HERE.
                    }
                      
                      
                });

                datasheet.open();
            });
        }
    });
}(window.JH5MF));
