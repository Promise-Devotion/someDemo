/**
 * the myslider for plugin editor
 * created by jiangb
 *
 **/

(function(JH5MF) {
    JH5MF.Editor.register("myslider", "", 
        function(rootElement, jh5mf, baseLayout) {
            var _this = this,
                _rootElement = baseLayout.cloneNode(true),
                _trackEvent,
                _jh5playerOptions,
                _sliderAdd, _sliderListviewCurr,
                _sliderPlayback, _sliderListview;

            // TODO@ you should decide how insert your private container element into base layout.
            // The codes here is myslider only. 
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

                            // FIXME@duzk's ugly codes here.
                            if ('sources' === key) {
                                var listviewActionContainer = option.element.parent().find(".listview-actions");

                                listviewActionContainer.append(''
                                    + '<div class="btn-group btn-group-justified">'
                                    + '  <a style="font-size:14px" class="btn btn-sm dark" href="javascript:;" id="slider-add"> '
                                    + '    <i class="fa fa-fw fa-plus"></i> '
                                    + '  </a>'
                                    + '  <a style="font-size:14px" class="btn btn-sm dark" href="javascript:;" id="slider-playback"> '
                                    + '    <i class="fa fa-fw fa-pause"></i> '
                                    + '  </a>'
                                    + '</div>');

                                _sliderAdd = listviewActionContainer.find("#slider-add");
                                _sliderPlayback = listviewActionContainer.find("#slider-playback");

                                _sliderListview = option.element.data("kendoListView");

                                _sliderListviewCurr = option.element;

                                // 
                                _sliderListview.bind('dataBound', function (e) {
                                    var ds = this.dataSource,
                                        items = this.items();

                                    for (var i = 0, l = items.length; i < l; i++) {
                                        $(items[i]).find('i.imgPreview').bind('click', function (e) {
                                            var uid = $(this).closest('.item-slide').attr('data-uid'),
                                                slideData = ds.getByUid(uid).toJSON();

                                            var clipreview = JH5MF.app.dialog.spawn('clip-preview', {
                                                data: slideData
                                            });

                                            clipreview.open();
                                        });

                                        $(items[i]).find('i.imgRemove').bind('click', function (e) {
                                            var uid = $(this).closest('.item-slide').attr('data-uid');

                                            ds.remove(ds.getByUid(uid));

                                            _this.updateTrackEventSafe(_trackEvent, {
                                                sources: ds.data().toJSON()
                                            });

                                            //销毁滚动条 
                                            var L = ds.data().toJSON().length;
                                            if (L <= 6 ) {
                                                _sliderListviewCurr.slimScroll({ destroy: true }).css({ height: L * 46, 'min-height': 28 });     
                                            }

                                        });
                                    }
                                });

                                _sliderListview.trigger('dataBound');
                            }
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

                sliderAddSourceHandler(_sliderAdd, _sliderListviewCurr);
                sliderPreviewHandler(_sliderPlayback, trackEvent);
            };

            function onTrackEventUpdated(e) {
                _trackEvent = e.target;
                _this.updatePropertiesFromManifestWithKendoUI(_trackEvent);
            }

            function onDirectionChange (e) {
                _trackEvent.updateSilently({ 'navigationButtons': e.data });
                _this.updatePropertiesFromManifestWithKendoUI(_trackEvent);
            }

            JH5MF.Editor.TrackEventEditor.extend(_this, jh5mf, _rootElement, {
                open: function(parentElement, trackEvent) {
                    _trackEvent = trackEvent;
                    _jh5playerOptions = _trackEvent.jh5playerOptions;

                    trackEvent.listen("trackeventupdated", onTrackEventUpdated);
                    _trackEvent.listen("directionChange", onDirectionChange);
                    // to setup property UI.
                    setup(trackEvent);
                },
                close: function() {
                    _trackEvent.unlisten("trackeventupdated", onTrackEventUpdated);
                    _trackEvent.unlisten("directionChange", onDirectionChange);
                    // WARNING@the below codes must be called for kendo UI.
                    _this.destroyPropertiesFromManifestWithKendoUI({
                        trackEvent: _trackEvent
                    });
                }
            });

            function sliderAddSourceHandler (addBtn, sliderListviewCurr) {
                addBtn.on("click", function() {
                    var dialog = JH5MF.app.dialog.spawn('file-dialog', {
                        data: {
                            callback: function(clip) {
                                _this.updateTrackEventSafe(_trackEvent, { 
                                    sources: _trackEvent.jh5playerOptions.sources.concat(clip.map(function(d) { return { 
                                        src: d.clip__localfile, thumbnail: d.clip__thumbnail,
                                        type: d.clip__cliptype,
                                        width: d.clip__extend_attr__width, height: d.clip__extend_attr__height,
                                    }}))
                                });

                                var ds = _sliderListview.dataSource;

                                ds.data(ds.data().toJSON().concat(clip.map(function(d){return { 
                                    src: d.clip__localfile, thumbnail: d.clip__thumbnail,
                                    type: d.clip__cliptype,
                                    width: d.clip__extend_attr__width, height: d.clip__extend_attr__height,
                                }})));

                                //判断滚动条
                                var L = ds.data().toJSON().length;
                                if (L > 6 ) {
                                    sliderListviewCurr.css({ height: 278 });
                                    sliderListviewCurr.slimScroll({ height: "278px" });     
                                }
                                else {
                                    sliderListviewCurr.css({ height: L * 46 });
                                }

                            },
                            filter: {
                                logic: "and",
                                filters: [{ field:'clip__cliptype', operator: 'in', value: [0, 1] }], // 0 - image, 1 - video
                            },
                            selectable: 'multiple',
                        }
                    });
                    dialog.open();
                });
            }

            //对自定义UI进行相关操作的方法
            function sliderPreviewHandler (playerbackBtn, trackEvent) {
                //开始与暂停
                playerbackBtn.on("click", function() {
                    var mySwiper = trackEvent.jh5playerTrackEvent._mySwiper;
                    if (trackEvent.jh5playerOptions.autoplay) {
                        playerbackBtn.find("i").removeClass("fa-pause").addClass("fa-play");
                        _this.updateTrackEventSafe(_trackEvent, { "autoplay": false });
                    }else {
                        playerbackBtn.find("i").removeClass("fa-play").addClass("fa-pause");
                        _this.updateTrackEventSafe(_trackEvent, { "autoplay": true });
                    }
                });
            }
        });
}(window.JH5MF));
