"use strict";

function smoothScroll(target, duration, offset = 0) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, targetPosition - startPosition, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

document.addEventListener('DOMContentLoaded', function() {
  // 01. BROWSER AGENT FUNCTION
  //==================================================================================
  function detectBrowser() {
    const ua = window.navigator.userAgent;
    return {
      isChromeMobile: (device.tablet() || device.mobile()) && (ua.indexOf("Chrome") > 0 || ua.indexOf("CriOS") > 0),
      isIOS: /iPhone|iPad|iPod/.test(ua),
      isFirefox: ua.toLowerCase().indexOf("firefox") > -1,
      isIE: ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident\/7\./),
      isIE11: !!ua.match(/Trident\/7\./),
      isIE11desktop: !!ua.match(/Trident\/7\./) && ua.indexOf("Windows Phone") < 0,
      isIE10: ua.indexOf("MSIE 10.0") > 0,
      isIE9: ua.indexOf("MSIE 9.0") > 0,
      isSafari: ua.indexOf("Safari") != -1 && ua.indexOf("Mac") != -1
    };
  }

  const browser = detectBrowser();

  // 02. FULLSCREEN CLASS
  //==================================================================================
  function fullscreen() {
    const fheight = window.innerHeight;
    document.querySelectorAll(".fullscreen").forEach(el => {
      el.style.height = `${fheight}px`;
    });
  }

  fullscreen();
  window.addEventListener('resize', fullscreen);

  // 03. HIDDEN ALL ANIMATION CLASS
  //==================================================================================
  if (!device.tablet() && !device.mobile() && !browser.isIE9) {
    document.querySelectorAll(".animation").forEach(el => {
      el.style.visibility = "hidden";
    });
  }

  // 04. PACE PRELOADER
  //==================================================================================
  Pace.on("done", function () {
    setTimeout(() => {
      document.getElementById("preloader").style.display = "none";
    }, 500);
  });

  Pace.on("hide", function () {


    // 04.2 Nav Header Position (Mobile)
    //------------------------------------------------------------------------------
    if ((device.tablet() || device.mobile()) && document.getElementById("nav-bar").classList.contains("sticky-nav")) {
      document.getElementById("nav-header").style.position = "relative";
    }

    // 04.3 IntersectionObserver Sticky Navbar
    //------------------------------------------------------------------------------
    const navBar = document.getElementById("nav-bar");
    if (navBar && navBar.classList.contains("sticky-nav") && navBar.classList.contains("bottom-bar")) {
      const navHeader = document.getElementById("nav-header");
      let lastScrollY = window.scrollY;
      let isFirstScroll = true;

      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const currentScrollY = window.scrollY;
          const direction = currentScrollY > lastScrollY ? 'down' : 'up';

          if (isFirstScroll && currentScrollY > navHeader.offsetTop) {
            navBar.classList.add("stick-it");
            isFirstScroll = false;
          } else if (direction === 'down' && !entry.isIntersecting) {
            if (!device.tablet() && !device.mobile()) {
              navBar.classList.add("stick-it", "animate__animated", "animate__fadeInDownBig");
            } else {
              navBar.classList.add("stick-it");
            }
          } else if (direction === 'up' && entry.isIntersecting) {
            navBar.classList.remove("stick-it", "animate__animated", "animate__fadeInDownBig");
          }
          
          lastScrollY = currentScrollY;
        });
      }, {
        threshold: 0,
      });
  
      navObserver.observe(navHeader);
    }

    // 04.5 IntersectionObserver Animate CSS
    //------------------------------------------------------------------------------
    if (!device.tablet() && !device.mobile() && !browser.isIE9) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animations = ["bounce", "fadeIn", "fadeInLeft", "fadeInRight", "fadeInUp"];
            animations.forEach(animation => {
              if (element.classList.contains(animation)) {
                element.classList.add("animate__animated", `animate__${animation}`);
                element.style.visibility = "visible";
              }
            });

            if (element.id === "welcome-text") {
              setTimeout(() => {
                document.getElementById("slide-arrow-a").classList.add("animate__animated", "animate__fadeIn");
              }, 1000);
            }


            observer.unobserve(element);
          }
        });
      }, {
        threshold: 0.1 
      });

      document.querySelectorAll(".animation").forEach(el => {
        observer.observe(el);
      });
    }

    // 04.6 Stellar Parallax
    //------------------------------------------------------------------------------
    if (!device.tablet() && !device.mobile() && !browser.isIE9 && !browser.isIE10 && !browser.isSafari) {
      const parallaxElements = document.querySelectorAll(".image-divider");
      let ticking = false;
  
      function updateParallax() {
        const scrollY = window.pageYOffset;
  
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + scrollY;
          const windowHeight = window.innerHeight;
  
          if (scrollY + windowHeight > elTop && scrollY < elTop + rect.height) {
            const yPos = (scrollY - elTop) * speed;
            el.style.backgroundPosition = `center ${yPos}px`;
          }
        });
  
        ticking = false;
      }
  
      function requestTick() {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }
  
      function onScroll() {
        requestTick();
      }
  
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', updateParallax, { passive: true });
  
      updateParallax();
    }
  });

  // 05. PRELOADER HEART ANIMATION (IE10 / 11)
  //==================================================================================
  if (browser.isIE10 || browser.isIE11) {
    document.querySelector(".heart-animation").style.letterSpacing = "normal";
  }

  // 08. MOBILE MENU
  //==================================================================================
  document.getElementById("mobile-nav").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("nav-menu").classList.toggle("open");
  });

  document.querySelectorAll("#nav-menu li a").forEach(el => {
    el.addEventListener("click", function() {
      if (this.getAttribute("href") !== "#") {
        document.getElementById("nav-menu").classList.remove("open");
      }
    });
  });

  // 10. TINY SLIDER
  //==================================================================================
  const wishSlider = document.querySelector(".wish-slider");
  if (wishSlider) {
    tns({
      container: wishSlider,
      items: 1,
      autoplay: true,
      autoplayTimeout: 5000,
      nav: false,
      controls: false
    });
  }

  // 12. SMOOTH SCROLL
  //=========================================================================
  document.querySelectorAll('a.smooth-scroll').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScroll(target, 300);
    });
  });
  
  document.querySelectorAll('.nav-smooth-scroll a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScroll(target, 300, 80);
    });
  });

  // 14. DISALBE TRANSITION (Mobile / Tablet)
  //==================================================================================
  if (device.tablet() || device.mobile()) {
    if (!browser.isIE11desktop) {
      document.querySelectorAll(".photo-item img.hover-animation, .photo-item .layer.hover-animation").forEach(el => {
        el.style.transition = "none";
      });
    }
  }

  // 15. AUDIO
  //==================================================================================
  const audioElm = document.getElementById("audioID");
  const muteButton = document.getElementById("mute-audio");

  if (audioElm && muteButton) {
    // 15.1 Reset Mute Control (Chrome and Safari Mobile)
    if (browser.isChromeMobile || browser.isIOS) {
      audioElm.muted = true;
      const muteIcon = muteButton.dataset.muteIcon;
      const unmuteIcon = muteButton.dataset.unmuteIcon;
      muteButton.dataset.start = "mute";
      muteButton.dataset.muteIcon = unmuteIcon;
      muteButton.dataset.unmuteIcon = muteIcon;
      muteButton.querySelector("i").className = muteIcon;
    }

    // 15.2 On toggle mute button
    muteButton.addEventListener("click", function(e) {
      e.preventDefault();
      const onStart = this.dataset.start;
      const muteIcon = this.dataset.muteIcon;
      const unmuteIcon = this.dataset.unmuteIcon;
      const iconElement = this.querySelector("i");

      if (onStart === "unmute") {
        if (iconElement.classList.contains(unmuteIcon)) {
          iconElement.classList.remove(unmuteIcon);
          iconElement.classList.add(muteIcon);
          if (browser.isIOS) {
            audioElm.pause();
          } else {
            audioElm.muted = true;
          }
        } else {
          iconElement.classList.remove(muteIcon);
          iconElement.classList.add(unmuteIcon);
          audioElm.play();
          audioElm.muted = false;
        }
      } else if (onStart === "mute") {
        if (iconElement.classList.contains(muteIcon)) {
          iconElement.classList.remove(muteIcon);
          iconElement.classList.add(unmuteIcon);
          audioElm.play();
          audioElm.muted = false;
        } else {
          iconElement.classList.remove(unmuteIcon);
          iconElement.classList.add(muteIcon);
          if (browser.isIOS) {
            audioElm.pause();
          } else {
            audioElm.muted = true;
          }
        }
      }
    });
  }
});

// 07. COUNTDOWN
//===================================================================================


document.addEventListener('DOMContentLoaded', function() {
  const countdownElement = document.getElementById('date-countdown');
  const weddingDate = new Date('2024-11-30T18:36:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      <div>${days} 天</div>
      <div>${hours} 小時</div>
      <div>${minutes} 分鐘</div>
      <div>${seconds} 秒</div>
    `;

    if (difference < 0) {
      clearInterval(timer);
      countdownElement.innerHTML = "婚禮開始了！";
    }
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
});