
(function(JH5player) {

    var _mode,
        _trackEvent;

    var DIMESION_UNITS = "px";

    var optionHolderInit = function (options) {
        var manifest = options._natives.manifest.options,
            opt = {};

        for (var k in manifest) {
            if (k in options) {
                opt[k] = options[k];
            }
            else if ('default' in manifest[k]) {
                opt[k] = manifest[k]['default'];
            }
        }

        return opt;
    };

    var optionHolderUpdate = function (holder, updates) {
        for (var k in updates) {
            if (k in holder) {
                holder[k] = updates[k];
            }
        }
    }
    /**
     * myslider JH5player plug-in
     * author: jiangb
     *
     * myslider:
     **/
    JH5player.plugin("myslider", {

        manifest: {
            about: {
                name: "JH5player myslider plugin",
                version: "0.1",
                author: "jiangb", website: "http://www.h5cld.cn"
            },
            options: {
                applyclass: {
                    default: { 
                        in: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: "none"
                        },
                        emphasis: {
                            effect: 'none', delay: 1.5, duration: 1, count: 1, direct: "none"
                        },
                        out: {
                            effect: 'none', delay: 0, duration: 1.5, count: 1, direct: "none"
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
                trigger: {
                    label: "Trigger",
                    elem: "panelbar",
                    type: "json",
                    group: "trigger",
                    default: {
                        click: [],
                        longPressStart: [],
                        longPressStop: [],
                        hoverIn: [],
                        hoverOut: [],
                    }
                },
                width: {
                    elem: "input", type: "number", default: 480, units: DIMESION_UNITS, hidden: true
                },
                height: {
                    elem: "input", type: "number", default: 360, units: DIMESION_UNITS, hidden: true
                },
                top: {
                    elem: "input", type: "number", default: 0, units: DIMESION_UNITS, hidden: true
                },
                left: {
                    elem: "input", type: "number", default: 25, units: DIMESION_UNITS, hidden: true
                },
                start: {
                    elem: "input", type: "text", label: "Start", units: "seconds", hidden: true
                },
                end: {
                    elem: "input", type: "text", label: "End", units: "seconds", hidden: true
                },
                zindex: {
                    hidden: true
                },
                prompting: {
                    elem: "input", type: "text", label: "Prompting", default: "No Slides", hidden: true
                },
                autoplay: {
                    default: true,
                    hidden: true
                },
                /* the myslider optionss **/
                sources: {
                    elem: "listview", 
                    type: "json", 
                    label: "Images List", 
                    template: ''
                        + '<div class="item-slide">'
                        + '  <div class="ico-slide" style="background: url(#=thumbnail#) no-repeat;background-size:cover">'
                        + '  </div>'
                        + '  <span class="fa fa-fw fa-list handler imgHandler"></span>'
                        + '  <i class= "fa fa-fw fa-trash-o imgRemove"></i>'
                        + '  <i class= "ti ti-eye imgPreview"></i>'
                        + '</div>',
                    htmlClass: 'slider-listview-wrapper',
                    default: []
                },
                stretchMode: {
                    elem: "select", options: ["Fit", "Fill", "Stretch"], values: ["fit", "fill", "stretch"], label: "Stretch Mode", default: "fit"
                },
                playDuration: {
                    elem: "slider", type: "number", min: 1000, max: 10000, step: 1000, label: "Duration", default: 3000, units: "ms"
                },
                spaceBetween: {
                    elem: "slider", type: "number", min: 0, max: 40, step: 1, label: "Space Between", default: 0, units: "px", step: 1
                },
                slideDirection: {
                    elem: "select", options: ["Horizontal", "Vertical"], values: ["horizontal", "vertical"], label: "Direction", default: "horizontal"
                },
                slideEffect: {
                    elem: "select", options: ["Slide", "Fade", "Cube", "Coverflow", "Flip"], values: ["slide", "fade", "cube", "coverflow", "flip"], label: "Slides Effect", default: "slide"
                },
                freeMode: {
                    elem: "checkbox", type: "boolean", label: "Free", checkboxLabel: "Free", default: false, binds: []  
                },
                swiperPagination: {
                    elem: "checkbox", type: "boolean", label: "Pagination", checkboxLabel: "Pagination", default: false, binds: []
                },
                swiperScrollbar: {
                    elem: "checkbox", type: "boolean", label: "Scrollbar", checkboxLabel: "Scrollbar", default: false, binds: []
                },
                navigationButtons: {
                    elem: "checkbox", type: "boolean", label: "Navigation Buttons", checkboxLabel: "Navigation Buttons", default: false, binds: []
                },
                loop: {
                    elem: "checkbox", type: "boolean", label: "Loop", checkboxLabel: "Loop", default: false, binds: []
                }
            }
        },

        _setup: function (options, mode, trackEvent) {
            /*
             * it's a private container for holding the player element.
             **/
            var _container;
            /*
             * trackEvent has a dispatch() method from EventManager of TrackEvent.
             * it can trigger event to the trackEvent's listener.
             *
             * myslider: _trackEvent.dispatch("eventName", eventData);
             *
             **/
            _mode = mode;
            _trackEvent = trackEvent;

            if (_mode === 'player' && options.sources.length < 1) {
                // we did nothing if no slides here.
                return; 
            }

            /*=========================
                初始化变量
              =========================*/
            options._mySlideParams = {};

            options._mySlideParams.freeModeParams = options.freeMode;

            if (options.swiperPagination) {
                options._mySlideParams.paginationCount = 2;
                options._mySlideParams.paginationParams = ".swiper-pagination";
            }
            else {
                options._mySlideParams.paginationCount = 1;
                options._mySlideParams.paginationParams = null;
            }

            if (options.swiperScrollbar) {
                options._mySlideParams.scrollbarCount = 2;
                options._mySlideParams.scrollbarParams = ".swiper-scrollbar";
            }
            else {
                options._mySlideParams.scrollbarCount = 1;
                options._mySlideParams.scrollbarParams = null;
            }

            if (options.navigationButtons) {
                options._mySlideParams.navigationButtonsCount = 2;
                options._mySlideParams.prevButtonParams = ".swiper-button-prev";
                options._mySlideParams.nextButtonParams = ".swiper-button-next";
            }
            else {
                options._mySlideParams.navigationButtonsCount = 1;
                options._mySlideParams.prevButtonParams = null;
                options._mySlideParams.nextButtonParams = null;
            }

            options._mySlideParams.playDurationTime = options.playDuration;
            options._mySlideParams.spaceBetweenParams = options.spaceBetween;
            options._mySlideParams.directionParams = options.slideDirection;
            options._mySlideParams.effectParams = options.slideEffect;

            if (options.loop) {
                options._mySlideParams.loopChange = 2;
                options._mySlideParams.loopParams = options.loop;
            }
            else {
                options._mySlideParams.loopChange = 1;
                options._mySlideParams.loopParams = options.loop;
            }

            if (options.autoplay) {
                options._mySlideParams.autoStart = options._mySlideParams.playDurationTime;
            }
            else {
                 options._mySlideParams.autoStart = 0;
            }

            if (options.stretchMode == "fit") {
                options._mySlideParams.stretchMode = 1;
            }
            else if (options.stretchMode == "fill") {
                options._mySlideParams.stretchMode = 2;
            }
            else if (options.stretchMode == "stretch") {
                options._mySlideParams.stretchMode = 3;
            }


            /*=========================
                初始化DOM操作
              =========================*/
            options._container = _container = $('<div></div>')[0];
            _container.classList.add("jh5player-myslider");

            _trackEvent.appendJH5playerElement(_container, options);

            options._swiper = _swiper = $('<div class = "swiper-container"></div>')[0];
            options._wrapper = _wrapper = $('<div class = "swiper-wrapper"></div>')[0];

            if (_swiper) {
                $(_swiper).css({
                    width: "100%",
                    height: "100%",
                    overflow: "hidden"
                }).appendTo($(options._container));
            }

            if(_wrapper) {
                $(_wrapper).addClass("jh5player-wrapper").appendTo($(_swiper));
            }

            if (options.sources == '') {
                // 添加初始状态提示信息
                $('<h1 style = "color: #0F8EC7;"></h1>').text(options.prompting).appendTo($(_wrapper));
            }
            else {
                $(options._wrapper).empty().removeClass("jh5player-wrapper");

                for (var i = 0, j = options.sources.length; i < j; i++) {
                    var slide = $('<div class = "swiper-slide"></div>')[0];

                    $(slide).css({ width: "100%" }).appendTo($(options._wrapper));

                    if (options.sources[i].type === 0) {
                        var slideImg = $("<img/>")[0];
                        slideImg.src = options.sources[i].src;
                        $(slideImg).appendTo($(slide));
                    }
                    else if (options.sources[i].type === 1) {
                        var $slideVideo = $('<video src =' + options.sources[i].src + '></video>');
                        $slideVideo.appendTo($(slide));

                        var boxHeight = $(options._container).height();
                        var boxWidth = $(options._container).width();

                        var $btnDiv = $('<div class="playMedia"></div>');
                        var $playIcon = $('<i class = "glyphicon glyphicon-play"></i>');
                        $playIcon.appendTo($btnDiv);
                        $btnDiv.css({ "cursor": "pointer" }).appendTo($(slide));

                        // 给播放按钮绑定事件
                        $btnDiv.on("click", function () {
                            var $media = $(this).siblings();
                            if ($media[0].paused) {
                                $media[0].play();
                                $(this).children().hide();
                            }
                            else {
                                $media[0].pause();
                                $(this).children().show();
                            } 
                        });

                        // 视频播放完后按钮显示
                        $slideVideo[0].addEventListener("ended", function() {
                            $playIcon.show();
                        });
                    }
                }
            }
            
            if (options.stretchMode == "fit") {
                var $slides = $(options._container).find('.swiper-slide');
                for (var i = 0; i < $slides.length; i++) {
                    var $media = $slides.eq(i).children();

                    var hratio = $(options._container).width() / options.sources[i].width; 
                    var vratio = $(options._container).height() / options.sources[i].height;
                    var ratio = hratio < vratio ? hratio : vratio;
                    var imgWidth = Math.ceil(options.sources[i].width * ratio, 10);
                    var imgHeight = Math.ceil(options.sources[i].height * ratio, 10);
                                    
                    var boxHeight = $(options._container).height();
                    var boxWidth = $(options._container).width();
                               
                    $media.css({
                        "margin-left": (boxWidth - imgWidth) / 2 + "px",
                        "margin-top": (boxHeight - imgHeight) / 2 + "px",
                        "width": imgWidth,
                        "height": imgHeight,
                        "min-width": 0,
                        "min-height": 0
                    });

                    // 更新自定义播放按钮的位置
                    var $btnDiv = $media = $slides.eq(i).children('.playMedia');
                    $btnDiv.css({
                        "position": "absolute",
                        "width": "100px",
                        "height": "100px",
                        "font-size": 40,
                        "left": boxWidth / 2 - 50 + "px",
                        "top": boxHeight / 2 - 50 + "px",
                        "color": "#fff",
                        "text-align": "center",
                        "line-height": "100px",
                        "margin": 0
                    });
                }
            }
            else if (options.stretchMode == "fill") {
                var $slides = $(options._container).find('.swiper-slide');
                for (var i = 0; i < $slides.length; i++) {
                    var $media = $slides.eq(i).children();
                                    
                    var boxHeight = $(options._container).height();
                    var boxWidth = $(options._container).width();
                               
                    $media.css({
                        "min-width": boxWidth,
                        "min-height": boxHeight,
                        "margin-top": 0,
                        "margin-left": 0
                    });

                    // 更新自定义播放按钮的位置
                    var $btnDiv = $media = $slides.eq(i).children('.playMedia');
                    $btnDiv.css({
                        "position": "absolute",
                        "width": "100px",
                        "height": "100px",
                        "font-size": 40,
                        "left": boxWidth / 2 - 50 + "px",
                        "top": boxHeight / 2 - 50 + "px",
                        "color": "#fff",
                        "text-align": "center",
                        "line-height": "100px",
                        "margin": 0
                    });
                }
            }
            else if (options.stretchMode == "stretch") {
                var $slides = $(options._container).find('.swiper-slide');
                for (var i = 0; i < $slides.length; i++) {
                    var $media = $slides.eq(i).children();
                                    
                    var boxHeight = $(options._container).height();
                    var boxWidth = $(options._container).width();
                               
                    $media.css({
                        "width": boxWidth,
                        "height": boxHeight,
                        "margin-top": 0,
                        "margin-left": 0,
                        "min-width": 0,
                        "min-height": 0
                    });

                    // 更新自定义播放按钮的位置
                    var $btnDiv = $media = $slides.eq(i).children('.playMedia');
                    $btnDiv.css({
                        "position": "absolute",
                        "width": "100px",
                        "height": "100px",
                        "font-size": 40,
                        "left": boxWidth / 2 - 50 + "px",
                        "top": boxHeight / 2 - 50 + "px",
                        "color": "#fff",
                        "text-align": "center",
                        "line-height": "100px",
                        "margin": 0
                    });
                }
            }

            /*=========================
                初始化swiper
              =========================*/ 
            if (options._mySlideParams.scrollbarCount === 2) { 
                $('<div class = "swiper-scrollbar"></div>').appendTo($(options._container).find('.swiper-container'));
            }

            if (options._mySlideParams.navigationButtonsCount === 2) {
                $('<div class = "swiper-button-prev"></div><div class = "swiper-button-next"></div>').appendTo($(options._container).find('.swiper-container'));
            }

            if (options._mySlideParams.paginationCount === 2) {
                $('<div class = "swiper-pagination"></div>').appendTo($(options._container).find('.swiper-container'));
            }

            // 清除fade效果下的bug
            if (options.slideEffect == "fade" ) {
                $(options._container).find('.swiper-slide').addClass("fade-opacity");
            }
            else {
                $(options._container).find('.swiper-slide').removeClass("fade-opacity");
            }

            options._mySwiper = new Swiper ($(options._container).find('.swiper-container'), {
                autoplay: options._mySlideParams.autoStart,
                freeMode: options._mySlideParams.freeModeParams,
                freeModeSticky : true,
                spaceBetween: options._mySlideParams.spaceBetweenParams,
                loop: options._mySlideParams.loopParams,
                direction: options._mySlideParams.directionParams,
                effect: options._mySlideParams.effectParams,
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                grabCursor: true,
                observer: true,
                observeParents: true,
                pagination: options._mySlideParams.paginationParams,
                prevButton: options._mySlideParams.prevButtonParams,
                nextButton: options._mySlideParams.nextButtonParams,
                scrollbar: options._mySlideParams.scrollbarParams,

                onTransitionEnd: function (swiper) {
                    var $slides = $(options._container).find('.swiper-wrapper').children('.swiper-slide');

                    for (var i = 0; i < $slides.length; i++) {
                        var video = $slides.eq(i).children('video')[0];
                        if (video) {
                            if (!video.paused) {
                                video.pause();
                                $slides.eq(i).children('.playMedia').children().show();
                            }
                        }
                    }
                }
            });

            // 将更新后的数据保存
            options._optHolder = optionHolderInit(options);
        },

        _update: function (options, updates) {
            // it updates the common properties, such as: color, 
            // background, font, shadow, border, opacity, rotation, etc.
            // you just care your special only.
            _trackEvent.updateJH5playerElement(options, updates);

            // to update the values with new, and sync holder.
            optionHolderUpdate(options._optHolder, updates);

            // 每次更新要重设swiper高，因为垂直下有影响
            $(options._container).find('.swiper-container').css({ height: $(options._container).height() });
            
            // 控制是否自由模式
            if ("freeMode" in updates) {
                options._mySwiper.params.freeMode = updates["freeMode"];
                options._mySlideParams.freeModeParams = updates["freeMode"];
            }


            /*================================
                paginnation的添加与删除的方法
              ================================*/
            if ("swiperPagination" in updates) {
                if (updates["swiperPagination"]) {
                    resetAll(options);

                    if (options._mySlideParams.scrollbarCount === 2) { 
                        newScrollbar(options); options._mySlideParams.scrollbarParams = ".swiper-scrollbar"; 
                    }

                    (options._mySlideParams.navigationButtonsCount === 2) && newNavigationButtons(options);

                    newPagination(options);
                    options._mySlideParams.paginationCount = 2;

                    options._mySlideParams.paginationParams = ".swiper-pagination";
                    newSwiper(options);
                }
                else {
                    resetAll(options);

                    if (options._mySlideParams.scrollbarCount === 2) { 
                        newScrollbar(options); options._mySlideParams.scrollbarParams = ".swiper-scrollbar"; 
                    }

                    (options._mySlideParams.navigationButtonsCount === 2) && newNavigationButtons(options);

                    options._mySlideParams.paginationCount = 1;

                    options._mySlideParams.paginationParams = null;
                    newSwiper(options);
                }
            }


            /*=========================
                scrollbar 增加与删除方法
              =========================*/
            if ("swiperScrollbar" in updates) {
                if (updates["swiperScrollbar"]) {
                    resetAll(options);

                    (options._mySlideParams.navigationButtonsCount === 2) && newNavigationButtons(options);
                    (options._mySlideParams.paginationCount === 2) && newPagination(options);
                    newScrollbar(options);
                    options._mySlideParams.scrollbarCount = 2;

                    options._mySlideParams.scrollbarParams = ".swiper-scrollbar";
                    newSwiper(options);
                }
                else {
                    resetAll(options);
                    (options._mySlideParams.navigationButtonsCount === 2) && newNavigationButtons(options);
                    (options._mySlideParams.paginationCount === 2) && newPagination(options);
                    options._mySlideParams.scrollbarCount = 1;

                    options._mySlideParams.scrollbarParams = null;
                    newSwiper(options);
                }
            }


            /*==================================
                navigationButtons增加与删除方法
              ==================================*/
            if ("navigationButtons" in updates) {
                if (updates["navigationButtons"] && (options._mySlideParams.directionParams == "horizontal") ) {
                    resetAll(options);

                    if (options._mySlideParams.scrollbarCount === 2) { 
                        newScrollbar(options); options._mySlideParams.scrollbarParams = ".swiper-scrollbar"; 
                    }

                    (options._mySlideParams.paginationCount === 2) && newPagination(options);

                    newNavigationButtons(options);
                    options._mySlideParams.navigationButtonsCount = 2;

                    options._mySlideParams.prevButtonParams = ".swiper-button-prev";
                    options._mySlideParams.nextButtonParams = ".swiper-button-next";
                    newSwiper(options);
                }
                else {
                    resetAll(options);

                    if (options._mySlideParams.scrollbarCount === 2) { 
                        newScrollbar(options); options._mySlideParams.scrollbarParams = ".swiper-scrollbar"; 
                    }

                    (options._mySlideParams.paginationCount === 2) && newPagination(options);

                    options._mySlideParams.navigationButtonsCount = 1;

                    options._mySlideParams.prevButtonParams = null;
                    options._mySlideParams.nextButtonParams = null;
                    newSwiper(options);
                }
            }

            /*=========================
                控制自动播放
              =========================*/
              if ("autoplay" in updates) {
                if (updates["autoplay"]) {
                    options._mySlideParams.autoStart = options._mySlideParams.playDurationTime;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }
                else {
                    options._mySlideParams.autoStart = 0;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }
              }

            /*=========================
                控制自动播放时间
              =========================*/
            if ("playDuration" in updates) {
                options._mySlideParams.playDurationTime = updates["playDuration"];
                options._mySlideParams.autoStart = options._mySlideParams.playDurationTime;

                resetAll(options);
                updataSlideAll(options);
                newSwiper(options);
            }


            /*============================
                spaceBetween调整slide间距
              ============================*/
            if ("spaceBetween" in updates) {
                options._mySlideParams.spaceBetweenParams = updates["spaceBetween"];

                resetAll(options);
                updataSlideAll(options);
                newSwiper(options);
            }


            /*===============
                loop模式
              ===============*/          
            if ("loop" in updates) {
                if (updates["loop"]) {
                    options._mySlideParams.loopParams = updates["loop"];

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);

                    options._mySlideParams.loopChange = 2;
                }
                else {
                    options._mySlideParams.loopParams = updates["loop"];

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);

                    options._mySlideParams.loopChange = 1;
                }
            }


            /*====================
                调整slide方向
              ====================*/
            if ("slideDirection" in updates) {
                if (updates["slideDirection"] == "vertical") {
                    options._mySlideParams.navigationButtonsCount = 1;
                    options._mySlideParams.prevButtonParams = null;
                    options._mySlideParams.nextButtonParams = null;

                    _trackEvent.dispatch("directionChange", false);
                }

                options._mySlideParams.directionParams = updates["slideDirection"];

                resetAll(options);
                updataSlideAll(options);
                newSwiper(options);
            }


            /*=========================
                slide切换effect效果
              =========================*/
            if ("slideEffect" in updates) {
                options._mySlideParams.effectParams = updates["slideEffect"];

                // 清除fade效果下的bug
                if (updates["slideEffect"] == "fade" ) {
                    $(options._container).find('.swiper-slide').addClass("fade-opacity");
                }
                else {
                    $(options._container).find('.swiper-slide').removeClass("fade-opacity");
                }

                resetAll(options);
                updataSlideAll(options);
                newSwiper(options);
            }


            /*=================
                sources变化
              =================*/
            if("sources" in updates) {
                // loop模式的bug操作
                if (options._mySlideParams.loopParams) {
                    options._mySlideParams.loopParams = false;
                    options._mySlideParams.loopChange = 2;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }

                // 先清空wrapper里的内容
                $(options._wrapper).empty().removeClass('jh5player-wrapper');

                if (options._optHolder.sources.length == 0) {
                    // 添加初始状态提示信息
                    $(options._wrapper).addClass("jh5player-wrapper")
                    $('<h1 style= "color: #0F8EC7;"></h1>').text(options.prompting).appendTo($(options._wrapper));
                }

                for (var i = 0, j = options._optHolder.sources.length; i < j; i++) {
                    var slide = $('<div class = "swiper-slide"></div>')[0];

                    $(slide).css({ width: "100%" }).appendTo($(options._wrapper));

                    if (options._optHolder.sources[i].type === 0) {
                        var slideImg = $('<img/>')[0];
                        slideImg.src = options._optHolder.sources[i].src;
                        $(slideImg).appendTo($(slide));
                    }
                    else if (options._optHolder.sources[i].type === 1) {
                        var $slideVideo = $('<video src =' + options._optHolder.sources[i].src + '></video>');
                        $slideVideo.appendTo($(slide));

                        var boxHeight = $(options._container).height();
                        var boxWidth = $(options._container).width();

                        var $btnDiv = $('<div class = "playMedia"></div>');
                        var $playIcon = $('<i class = "glyphicon glyphicon-play"></i>');

                        $playIcon.appendTo($btnDiv);
                        $btnDiv.css({ "cursor": "pointer" }).appendTo($(slide));

                        $btnDiv.on("click", function () {
                            var $media = $(this).siblings();
                            if ($media[0].paused) {
                                $media[0].play();
                                $(this).children().hide();
                            }
                            else {
                                $media[0].pause();
                                $(this).children().show();
                            } 
                        });

                        $slideVideo[0].addEventListener("ended", function () {
                            $playIcon.show();
                        });
                    }
                }

                resetAll(options);
                updataSlideAll(options);
                newSwiper(options);     
            }


            /*=========================
                stretchMode 操作 
              =========================*/
            if ("stretchMode" in updates) {
                if (updates["stretchMode"] == "fit") {
                    if (options._mySlideParams.loopParams) {
                        options._mySlideParams.loopParams = false;
                        options._mySlideParams.loopChange = 2;

                        resetAll(options);
                        updataSlideAll(options);
                        newSwiper(options);
                    }

                    fitMode(options);
                    options._mySlideParams.stretchMode = 1;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }
                else if (updates["stretchMode"] == "fill") {
                    if (options._mySlideParams.loopParams) {
                        options._mySlideParams.loopParams = false;
                        options._mySlideParams.loopChange = 2;

                        resetAll(options);
                        updataSlideAll(options);
                        newSwiper(options);
                    }

                    fillMode(options);
                    options._mySlideParams.stretchMode = 2;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }
                else if (updates["stretchMode"] == "stretch") {
                    if (options._mySlideParams.loopParams) {
                        options._mySlideParams.loopParams = false;
                        options._mySlideParams.loopChange = 2;

                        resetAll(options);
                        updataSlideAll(options);
                        newSwiper(options);
                    }
                    
                    stretchMode(options);
                    options._mySlideParams.stretchMode = 3;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }
            }


            if (options._mySlideParams.stretchMode == 1) {
                if (options._mySlideParams.loopParams) {
                    options._mySlideParams.loopParams = false;
                    options._mySlideParams.loopChange = 2;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }

                fitMode(options);
            }
            else if (options._mySlideParams.stretchMode == 2) {
                if (options._mySlideParams.loopParams) {
                    options._mySlideParams.loopParams = false;
                    options._mySlideParams.loopChange = 2;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }

                fillMode(options);
            }
            else if (options._mySlideParams.stretchMode == 3) {
                if (options._mySlideParams.loopParams) {
                    options._mySlideParams.loopParams = false;
                    options._mySlideParams.loopChange = 2;

                    resetAll(options);
                    updataSlideAll(options);
                    newSwiper(options);
                }

                stretchMode(options);
            }


            /*=========================
                loop模式的bug操作 
              =========================*/           
            if (options._mySlideParams.loopChange === 2) {
                options._mySlideParams.loopParams = true;
                options._mySlideParams.loopChange = 1;

                resetAll(options);
                updataSlideAll(options);
                newSwiper(options);
            }

        },

        start: function (event, options) {
            $(options._containerWithWrapper).removeClass('off');
        },

        end: function (event, options) {
            // don't handle the container's display ON/OFF here.
            // it will be handled in effects plugin.
        },

        frame: function (event, options, time) {},

        _teardown: function (options) {
            // TODO@do something here.
            // ...
            options._mySwiper.destroy(true, true);
            options._mySlideParams.scrollbarParams = null;
            // to remove jh5player element from presentation container.
            _trackEvent.removeJH5playerElement(options);
        },
    });


    /*=========================
        重置swiper的方法       
      =========================*/    
    function resetAll (options) {
        options._mySwiper.destroy(true, true); 

        var $pagination = $(options._container).find('.swiper-container .swiper-pagination');
        var $scrollbar = $(options._container).find('.swiper-container .swiper-scrollbar');
        var $prevButton = $(options._container).find('.swiper-container .swiper-button-prev');
        var $nextButton = $(options._container).find('.swiper-container .swiper-button-next');

        if ($scrollbar) {
            $scrollbar.remove();
            options._mySlideParams.scrollbarParams = null;
        }

        if($pagination) {
            $pagination.remove();
        }

        if($prevButton) {
            $prevButton.remove();
        }

        if($nextButton) {
            $nextButton.remove();
        }

        // 每次更新要重设swiper高，因为垂直下有影响
        $(options._container).find('.swiper-container').css({ height: $(options._container).height() });
    }
 

    /*==============================
        重置navigationButtons的方法    
      ==============================*/
    function newNavigationButtons (options) {
        $('<div class = "swiper-button-prev"></div><div class = "swiper-button-next"></div>').appendTo($(options._swiper));
    }


    /*===========================
        重置scrollbar的方法       
    =============================*/
    function newScrollbar (options) {
        $('<div class = "swiper-scrollbar"></div>').appendTo($(options._swiper));
    }


    /*=========================
        重置pagination的方法       
      =========================*/
    function newPagination (options) {
        $('<div class = "swiper-pagination"></div>').appendTo($(options._swiper));
    }


    /*===============================================================
        同时判断scrollbar、pagination、navigationButtons，重置后更新       
      ===============================================================*/
    function updataSlideAll (options) {
        if (options._mySlideParams.scrollbarCount === 2) { 
            newScrollbar(options); options._mySlideParams.scrollbarParams = ".swiper-scrollbar"; 
        }

        (options._mySlideParams.navigationButtonsCount === 2) && newNavigationButtons(options);
        (options._mySlideParams.paginationCount === 2) && newPagination(options);
    }


    /*=========================
        重新实例swiper      
      =========================*/
    function newSwiper (options) {
        options._mySwiper = new Swiper ($(options._container).find('.swiper-container'), {
            autoplay: options._mySlideParams.autoStart,
            freeMode: options._mySlideParams.freeModeParams,
            freeModeSticky : true,
            spaceBetween: options._mySlideParams.spaceBetweenParams,
            loop: options._mySlideParams.loopParams,
            direction: options._mySlideParams.directionParams,
            effect: options._mySlideParams.effectParams,
            paginationClickable: true,
            autoplayDisableOnInteraction: false,
            grabCursor: true,
            observer: true,
            observeParents: true,
            pagination: options._mySlideParams.paginationParams,
            prevButton: options._mySlideParams.prevButtonParams,
            nextButton: options._mySlideParams.nextButtonParams,
            scrollbar: options._mySlideParams.scrollbarParams
        });
    }

    /*=========================
        图片显示模式     
      =========================*/
    function fitMode (options) {
        var $slides = $(options._container).find('.swiper-slide');
        for (var i = 0; i < $slides.length; i++) {
            var $media = $slides.eq(i).children();

            var hratio = $(options._container).width() / options._optHolder.sources[i].width; 
            var vratio = $(options._container).height() / options._optHolder.sources[i].height;
            var ratio = hratio < vratio ? hratio : vratio;
            var imgWidth = Math.ceil(options._optHolder.sources[i].width * ratio, 10);
            var imgHeight = Math.ceil(options._optHolder.sources[i].height * ratio, 10);
                        
            var boxHeight = $(options._container).height();
            var boxWidth = $(options._container).width();
                   
            $media.css({
                "margin-left": (boxWidth - imgWidth) / 2 + "px",
                "margin-top": (boxHeight - imgHeight) / 2 + "px",
                "width": imgWidth,
                "height": imgHeight,
                "min-height": 0,
                "min-width": 0
            });

            // 更新自定义播放按钮的位置
            var $btnDiv = $media = $slides.eq(i).children('.playMedia');
            $btnDiv.css({
                "position": "absolute",
                "width": "100px",
                "height": "100px",
                "font-size": 40,
                "left": boxWidth / 2 - 50 + "px",
                "top": boxHeight / 2 - 50 + "px",
                "color": "#fff",
                "text-align": "center",
                "line-height": "100px",
                "margin": 0
            });
        }
    } 

    function fillMode (options) {
        var $slides = $(options._container).find('.swiper-slide');
        for (var i = 0; i < $slides.length; i++) {
            var $media = $slides.eq(i).children();
                        
            var boxHeight = $(options._container).height();
            var boxWidth = $(options._container).width();
                   
            $media.css({
                "margin-left": 0,
                "margin-top": 0,
                "min-width": boxWidth,
                "min-height": boxHeight
            });

            // 更新自定义播放按钮的位置
            var $btnDiv = $media = $slides.eq(i).children('.playMedia');
            $btnDiv.css({
                "position": "absolute",
                "width": "100px",
                "height": "100px",
                "font-size": 40,
                "left": boxWidth / 2 - 50 + "px",
                "top": boxHeight / 2 - 50 + "px",
                "color": "#fff",
                "text-align": "center",
                "line-height": "100px",
                "margin": 0
            });
        }
    }

    function stretchMode (options) {
        var $slides = $(options._container).find('.swiper-slide');
        for (var i = 0; i < $slides.length; i++) {
            var $media = $slides.eq(i).children();
                        
            var boxHeight = $(options._container).height();
            var boxWidth = $(options._container).width();
                   
            $media.css({
                "margin-left": 0,
                "margin-top": 0,
                "width": boxWidth,
                "height": boxHeight,
                "min-height": 0,
                "min-width": 0
            });

            // 更新自定义播放按钮的位置
            var $btnDiv = $media = $slides.eq(i).children('.playMedia');
            $btnDiv.css({
                "position": "absolute",
                "width": "100px",
                "height": "100px",
                "font-size": 40,
                "left": boxWidth / 2 - 50 + "px",
                "top": boxHeight / 2 - 50 + "px",
                "color": "#fff",
                "text-align": "center",
                "line-height": "100px",
                "margin": 0
            });
        }
    }


}(window.JH5player));
