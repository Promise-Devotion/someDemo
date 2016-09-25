'use strict';
(function (JH5player) {

    var _mode,
        _trackEvent;

    var DIMESION_UNITS = 'px';

    /**
     * myvideo JH5player plug-in
     * author: jnvfgfs@gmail.com 18/07/2016
     *
     * myvideo:
     */
    JH5player.plugin('myvideo', {

        _setup: function (options, mode, trackEvent) {
            /*
             * it's a private container for holding the player element.
             **/
            var _container,
                _myvideo,
                _videoarea,
                _overlay,
                _eventTester,
                _videoPoster;
            /*
             * trackEvent has a dispatch() method from EventManager of TrackEvent.
             * it can trigger event to the trackEvent's listener.
             *
             * myvideo: _trackEvent.dispatch('eventName', eventData);
             *
             **/
            _mode = mode;
            _trackEvent = trackEvent;

            // to create jh5player element container, it's for private used only.
            options._container = _container = $('<div></div>')[0];
            options._myvideo = _myvideo = $('<video></video>')[0];

            $(options._myvideo).css({
                'width': options.width + 'px',
                'height': options.height + 'px',
            });
            _container.classList.add('jh5player-myvideo');

            $(_container).append($(_myvideo));

            // to add jh5player element to presentation container.
            _trackEvent.appendJH5playerElement(_container, options);

            // 设置video属性
            $(_myvideo).attr({
                'src': options.src,
            });

            _myvideo.autoplay = options.autoplay;
            _myvideo.controls = options.controls;
            _myvideo.loop = options.loop;

            options.toString = function () {
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
                return "Video Plugin";
            };
        },

        _update: function (options, updates) {
            // it updates the common properties, such as: color, 
            // background, font, shadow, border, opacity, rotation, etc.
            // you just care your special only.
            _trackEvent.updateJH5playerElement(options, updates);

            // video settings
            if ('src' in updates) {
                $(options._myvideo).attr({
                    'src': updates.src,
                });
            }

            // 设置video属性
            if ('autoplay' in updates) {
                options._myvideo.autoplay = updates.autoplay;
            }

            if ('controls' in updates) {
                options._myvideo.controls = updates.controls;
            }

            if ('loop' in updates) {
                options._myvideo.loop = updates.loop;
            }

            if ('width' in updates) {
                $(options._myvideo).css('width', updates.width + 'px');
            }
            if ('height' in updates) {
                $(options._myvideo).css('height', updates.height + 'px');
            }
        },

        start: function (event, options) {
            $(options._containerWithWrapper).removeClass('off');
        },

        end: function (event, options) {
            // don't handle the container's display ON/OFF here.
            // it will be handled in effects plugin.
        },

        frame: function (event, options, time) {
        },

        _teardown: function (options) {
            // to remove jh5player element from presentation container.
            _trackEvent.removeJH5playerElement(options);

        },

        manifest: {
            about: {
                name: 'JH5player myvideo plugin',
                version: '0.1',
                author: 'jnvfgfs@gmail.com',
                website: 'http://www.h5cld.cn'
            },
            options: {
                aspectRatio: {
                    default: true, hidden: true,
                },
                applyclass: {
                    default: {
                        in: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: 'none',
                        },
                        emphasis: {
                            effect: 'none', delay: 1.5, duration: 1, count: 1, direct: 'none',
                        },
                        out: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: 'none',
                        },
                    },
                    hidden: true,
                },
                width: {
                    elem: 'input', type: 'number', default: 634, units: DIMESION_UNITS, hidden: true
                },
                height: {
                    elem: 'input', type: 'number', default: 264, units: DIMESION_UNITS, hidden: true
                },
                top: {
                    elem: 'input', type: 'number', default: 0, units: DIMESION_UNITS, hidden: true
                },
                left: {
                    elem: 'input', type: 'number', default: 25, units: DIMESION_UNITS, hidden: true
                },
                start: {
                    elem: 'input', type: 'text', label: 'Start', units: 'seconds', hidden: true,
                },
                end: {
                    elem: 'input', type: 'text', label: 'End', units: 'seconds', hidden: true,
                },
                zindex: {
                    hidden: true
                },
                /* the myvideo options **/
                autoplay: {
                    elem: 'checkbox',
                    type: 'boolean',
                    label: 'Autoplay',
                    checkboxLabel: 'Autoplay',
                    default: false,
                    binds: []
                },
                controls: {
                    elem: 'checkbox',
                    type: 'boolean',
                    label: 'controls',
                    checkboxLabel: 'controls',
                    default: true,
                    binds: []
                },
                loop: {
                    elem: 'checkbox',
                    type: 'boolean',
                    label: 'Loop',
                    checkboxLabel: 'Loop',
                    default: true,
                    binds: []
                },
                src: {
                    elem: "input",
                    type: "text",
                    label: "Source URL",
                    default: '',
                    hidden: true,
                },
            }
        },
    });

}(window.JH5player));
