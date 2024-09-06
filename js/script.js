"use strict";


$(document).ready(function () {
  // 01. BROWSER AGENT FUNCTION
  //==================================================================================

  // 01.1 Check Chrome (Mobile / Tablet)
  //----------------------------------------------------------------------------------
  var isChromeMobile = function isChromeMobile() {
    if (device.tablet() || device.mobile()) {
      if (window.navigator.userAgent.indexOf("Chrome") > 0 || window.navigator.userAgent.indexOf("CriOS") > 0) {
        return 1;
      }
    }
  };

  // 01.2 Check IOS
  //----------------------------------------------------------------------------------
  var isIOS = function isIOS() {
    if (
      window.navigator.userAgent.indexOf("iPhone") > 0 ||
      window.navigator.userAgent.indexOf("iPad") > 0 ||
      window.navigator.userAgent.indexOf("iPod") > 0
    ) {
      return 1;
    }
  };

  // 01.3 Check FIREFOX
  //----------------------------------------------------------------------------------
  var is_firefox = function is_firefox() {
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
      return 1;
    }
  };

  // 01.4 Check IE (< IE10)
  //----------------------------------------------------------------------------------
  var isIE = function isIE() {
    if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident\/7\./)) {
      return 1;
    }
  };

  // 01.5 Check IE11
  //----------------------------------------------------------------------------------
  var isIE11 = function isIE11() {
    if (!!navigator.userAgent.match(/Trident\/7\./)) {
      return 1;
    }
  };

  // 01.6 Check IE11 (Not Windows Phone)
  ///----------------------------------------------------------------------------------
  var isIE11desktop = function isIE11desktop() {
    if (!!navigator.userAgent.match(/Trident\/7\./) && window.navigator.userAgent.indexOf("Windows Phone") < 0) {
      return 1;
    }
  };

  // 01.7 Check IE10
  //----------------------------------------------------------------------------------
  var isIE10 = function isIE10() {
    if (window.navigator.userAgent.indexOf("MSIE 10.0") > 0) {
      return 1;
    }
  };

  // 01.8 Check IE9
  //----------------------------------------------------------------------------------
  var isIE9 = function isIE9() {
    if (window.navigator.userAgent.indexOf("MSIE 9.0") > 0) {
      return 1;
    }
  };

  // 01.9 Check Safari/Chrome Mac
  //----------------------------------------------------------------------------------
  var isSafari = function isSafari() {
    if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Mac") != -1) {
      return 1;
    }
  };

  // 02. FULLSCREEN CLASS
  //==================================================================================
  var fullscreen = function () {
    var fheight = $(window).height();
    $(".fullscreen").css("height", fheight);
  };

  //Execute on load
  fullscreen();

  //Execute on window resize
  $(window).resize(function () {
    fullscreen();
  });

  // 03. HIDDEN ALL ANIMATION CLASS
  //==================================================================================
  // Waypoint will animate it later (04.5 Waypoint Animate CSS)
  if (!device.tablet() && !device.mobile() && !isIE9()) {
    $(".animation").css({
      visibility: "hidden",
    });
  }

  // 04. PACE PRELOADER
  //==================================================================================
  Pace.on("done", function () {
    $("#preloader").hide();
  });

  Pace.on("hide", function () {
    // 04.1 Gallery - Masonry
    //------------------------------------------------------------------------------
    var $gallery = $("#masonry-gallery");

    if (device.tablet() || device.mobile()) {
      $gallery.masonry({
        columnWidth: ".grid-sizer",
        itemSelector: ".masonry-col",
        gutter: ".gutter-sizer",
        transitionDuration: 0,
      });
    } else {
      $gallery.masonry({
        columnWidth: ".grid-sizer",
        itemSelector: ".masonry-col",
        gutter: ".gutter-sizer",
        transitionDuration: "1s",
      });
    }

    // 04.2 Nav Header Position (Mobile)
    //------------------------------------------------------------------------------
    if (device.tablet() || device.mobile()) {
      if ($("#nav-bar").hasClass("sticky-nav")) {
        $("#nav-header").css("position", "relative");
      }
    }

    // 04.3 Waypoint Sticky Navbar
    //------------------------------------------------------------------------------
    if ($("#nav-bar").hasClass("sticky-nav")) {
      if ($("#nav-bar").hasClass("bottom-bar")) {
        var waypoints = $("#nav-header").waypoint(
          function (direction) {
            if (direction === "down") {
              if (!device.tablet() && !device.mobile()) {
                $("#nav-bar").addClass("stick-it animate__animated animate__fadeInDownBig");
              } else {
                $("#nav-bar").addClass("stick-it");
              }
            } else if (direction === "up") {
              $("#nav-bar").removeClass("stick-it animate__animated animate__fadeInDownBig");
            }
          },
          {
            offset: "-145px",
          }
        );
      }
    }

    // 04.5 Waypoint Animate CSS
    //------------------------------------------------------------------------------
    if (!device.tablet() && !device.mobile() && !isIE9()) {
      $(document).ready(function () {
        // Set up Waypoint to trigger at 90% offset for each .animation element
        $(".animation").waypoint({
          handler: function (direction) {
            if (direction === "down" && !$(this.element).hasClass("animate__animated")) {
              const animations = ["bounce", "fadeIn", "fadeInLeft", "fadeInRight", "fadeInUp"];

              // Function to apply animation
              const applyAnimation = (element, animation) => {
                return new Promise((resolve) => {
                  element
                    .removeClass(`${animation}`)
                    .addClass(`animate__animated animate__${animation}`)
                    .css({ visibility: "visible" });
                  element.on("animationend", () => {
                    resolve();
                  });
                });
              };

              // Sequentially apply animations
              const applyAnimationsSequentially = async () => {
                for (const animation of animations) {
                  if ($(this.element).hasClass(animation)) {
                    await applyAnimation($(this.element), animation);
                  }
                }

                // Additional animations after "You're Invited" animation
                if ($(this.element).attr("id") === "welcome-text") {
                  // Apply additional animations here
                  await applyAnimation($("#slide-arrow-a"), "fadeIn");
                }
              };

              applyAnimationsSequentially();
            }
          },
          offset: "120%",
        });
      });
    }

    // 04.6 Stellar Parallax
    //------------------------------------------------------------------------------
    if (!device.tablet() && !device.mobile() && !isIE9() && !isIE10() && !isSafari()) {
      $(".image-divider").css("background-attachment", "fixed");
      $(window).stellar({
        horizontalScrolling: false,
        responsive: true,
      });
    }

    // 04.7 Reach thank you will show Install Dialog
    //------------------------------------------------------------------------------
    $("#thank-you").waypoint(
      function (direction) {
        if (direction === "down") {
          var pwaInstall = document.getElementsByTagName("pwa-install")[0];
          pwaInstall.showDialog();
          // run only once
          this.destroy();
        }
      },
      {
        offset: "80%",
      }
    );
  }); // END of Pace on Hide

  // 05. PRELOADER HEART ANIMATION (IE10 / 11)
  //==================================================================================
  if (isIE10() || isIE11()) {
    $(".heart-animation").css("letter-spacing", "normal");
  }

  // 05. IMAGE DIVIDER (Mobile / Tablet)
  //==================================================================================
  /*if (device.tablet() || device.mobile() || isIE9() || isIE10() ||isSafari()) {
		$(".image-divider").addClass("mobile");
	}*/

  // 06. BIND TOUCH FOR PHOTO ITEM (Mobile / Tablet)
  //==================================================================================
  $(".photo-item").bind("touchstart touchend", function (e) {});

  // 08. MOBILE MENU
  //==================================================================================
  $("#mobile-nav").click(function (e) {
    e.preventDefault();
    $("#nav-menu").toggleClass("open");
  });

  // Hide Menu After Click It. Will be used on onepage version.
  $("#nav-menu li a").click(function () {
    if ($(this).attr("href") !== "#") {
      $("#nav-menu").removeClass("open");
    }
  });


  // 10. TINY SLIDER
  //==================================================================================
  if ($(".wish-slider").length) {
    $(".wish-slider").ajax_wishes();
  }

  // 12. SMOOTH SCROLL
  //=========================================================================
  $("a.smooth-scroll").smoothScroll({
    speed: 1000,
  });

  $(".nav-smooth-scroll a").smoothScroll({
    speed: 1000,
    offset: -80,
  });

  // 13. MAGNIFIC POPUP
  //==================================================================================

  // 13.1 Magnific Zoom
  //----------------------------------------------------------------------------------
  $(".magnific-zoom").magnificPopup({
    type: "image",
    image: {
      // options for image content type
      titleSrc: "title",
    },
    //fixedContentPos:true,
    callbacks: {
      open: function () {
        $("body").css("overflow", "hidden");
      },
      afterClose: function () {
        $("body").css("overflow", "");
      },
    },
  });

  // 13.2 Magnific Zoom Gallery
  //----------------------------------------------------------------------------------
  $(".magnific-zoom-gallery").magnificPopup({
    type: "image",
    image: {
      // options for image content type
      titleSrc: "title",
    },
    gallery: {
      enabled: true,
    },
    //fixedContentPos:true,
    callbacks: {
      open: function () {
        $("body").css("overflow", "hidden");
      },
      afterClose: function () {
        $("body").css("overflow", "");
      },
    },
  });

  // 14. DISALBE TRANSITION (Mobile / Tablet)
  //==================================================================================
  if (device.tablet() || device.mobile()) {
    if (!isIE11desktop()) {
      // Photo-item
      $(".photo-item img.hover-animation").css("transition", "none");
      $(".photo-item .layer.hover-animation").css("transition", "none");
    }
  }

  // 15. AUDIO
  //==================================================================================

  // 15.1 Reset Mute Control (Chrome and Safari Mobile)
  //----------------------------------------------------------------------------------
  //	Chrome and Safari IOS not cannot autoplay audio.
  //	Default audio will reset to mute
  if (isChromeMobile() || isIOS()) {
    var audioElm = document.getElementById("audioID");

    if (audioElm != null) {
      audioElm.muted = true;

      var mute_icon = $("#mute-audio").data("mute-icon");
      var unmute_icon = $("#mute-audio").data("unmute-icon");

      $("#mute-audio").removeAttr("data-start").attr({ "data-start": "mute" });
      $("#mute-audio").removeAttr("data-mute-icon").attr({ "data-mute-icon": unmute_icon });
      $("#mute-audio").removeAttr("data-unmute-icon").attr({ "data-unmute-icon": mute_icon });
      $("#mute-audio i").removeClass();
      $("#mute-audio i").addClass(mute_icon);
    }
  }

  // 15.2 On toggle mute button
  //----------------------------------------------------------------------------------
  $("#mute-audio").click(function (e) {
    e.preventDefault();
    var audioElm = document.getElementById("audioID");

    var on_start = $(this).data("start");
    var mute_icon = $(this).data("mute-icon");
    var unmute_icon = $(this).data("unmute-icon");

    if (on_start == "unmute") {
      if ($("#mute-audio i").hasClass(unmute_icon)) {
        $("#mute-audio i").removeClass(unmute_icon);
        $("#mute-audio i").addClass(mute_icon);
        if (isIOS()) {
          //Because of IOS cannot mute by script, then change it to pause.
          audioElm.pause();
        } else {
          audioElm.muted = true;
        }
      } else {
        $("#mute-audio i").removeClass(mute_icon);
        $("#mute-audio i").addClass(unmute_icon);
        audioElm.play();
        audioElm.muted = false;
      }
    } else if (on_start == "mute") {
      if ($("#mute-audio i").hasClass(mute_icon)) {
        $("#mute-audio i").removeClass(mute_icon);
        $("#mute-audio i").addClass(unmute_icon);
        audioElm.play();
        audioElm.muted = false;
      } else {
        $("#mute-audio i").removeClass(unmute_icon);
        $("#mute-audio i").addClass(mute_icon);
        if (isIOS()) {
          //Because of IOS cannot mute by script, then change it to pause.
          audioElm.pause();
        } else {
          audioElm.muted = true;
        }
      }
    }
  });
  // Confetti Setting
  //----------------------------------------------------------------------------------

  // 效果2 - 滾動時觸發
  // 變數，用於追踪上一個滾動位置
  var lastScrollPosition = 0;

  // 變數，用於標記是否可以觸發confetti
  var canTriggerConfetti = true;

  // 註冊滾動事件監聽器
  window.addEventListener("scroll", function () {
    // 獲取當前滾動位置
    var currentScrollPosition = window.scrollY || window.pageYOffset;

    // 判斷是否在持續滑動
    if (currentScrollPosition !== lastScrollPosition) {
      // 更新上一個滾動位置
      lastScrollPosition = currentScrollPosition;
      // 判斷是否可以觸發 confetti
      if (canTriggerConfetti) {
        // 觸發 confetti
        if (device.tablet() || device.mobile()) {
          confetti({
            angle: Math.random() * 70 + 55,
            particleCount: Math.random() * 50 + 30,
            startVelocity: 30,
            spread: Math.random() * 20 + 50,
            origin: { y: 0.5 },
          });
        } else {
          confetti({
            particleCount: 200,
            startVelocity: 25,
            spread: 360,
            origin: { x: Math.random() * 0.7 + 0.15, y: Math.random() * 0.5 },
          });
        }

        // 設定一秒後再次可以觸發 confetti
        canTriggerConfetti = false;
        setTimeout(function () {
          canTriggerConfetti = true;
        }, 5000);
      }
    }
  });
});

// 07. COUNTDOWN
//===================================================================================
function handleTickInit(tick) {
  var counter = Tick.count.down("2024-11-30T12:00:00+08:00", { format: ["d", "h", "m", "s"] });

  counter.onupdate = function (value) {
    tick.value = value;
  };

  //counter.onended = function () {
  // redirect, uncomment the next line
  // window.location = 'my-location.html'

  // hide counter, uncomment the next line
  // tick.root.style.display = 'none';

  // show message, uncomment the next line
  // document.querySelector('.tick-onended-message').style.display = '';
  //};
}
