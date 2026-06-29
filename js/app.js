/**
 * MANGAMMA RUCHULU
 * CORE JAVASCRIPT & GSAP ANIMATION CONTROLLER
 * Premium editorial, smooth motion, high visual performance.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check if library dependencies are available
  const hasGSAP = typeof gsap !== "undefined";
  const hasScrollTrigger = typeof ScrollTrigger !== "undefined";
  const hasLenis = typeof Lenis !== "undefined";

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ==========================================================================
     01. CUSTOM CURSOR
     ========================================================================== */
  const cursor = document.getElementById("js-custom-cursor");
  if (cursor) {
    document.addEventListener("mousemove", (e) => {
      // Smooth movement using GSAP quickSetter for high performance
      if (hasGSAP) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out",
        });
      } else {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    });

    // Hover state selectors
    const hoverElements = document.querySelectorAll(
      "a, button, .category-btn, input, select, textarea",
    );
    hoverElements.forEach((elem) => {
      elem.addEventListener("mouseenter", () => {
        cursor.classList.add("hovering");
      });
      elem.addEventListener("mouseleave", () => {
        cursor.classList.remove("hovering");
      });
    });
  }

  /* ==========================================================================
     02. STICKY HEADER & MOBILE NAVIGATION
     ========================================================================== */
  const header = document.getElementById("js-site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  const menuToggle = document.getElementById("js-menu-toggle");
  const mobileMenu = document.getElementById("js-mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (menuToggle && mobileMenu) {
    const toggleMenu = () => {
      const isOpen = mobileMenu.classList.contains("open");
      menuToggle.classList.toggle("active");
      mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", !isOpen);

      // Stop body scrolling when menu is open
      if (!isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    menuToggle.addEventListener("click", toggleMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ==========================================================================
     03. LENIS SMOOTH SCROLL INTEGRATION
     ========================================================================== */
  let lenisInstance = null;
  if (hasLenis) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Request Animation Frame loop for Lenis
    const raf = (time) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Synchronize ScrollTrigger with Lenis
    if (hasScrollTrigger) {
      lenisInstance.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth scroll for nav anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") {
          lenisInstance.scrollTo(0, { duration: 1.5, immediate: false });
          return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          lenisInstance.scrollTo(targetElement, {
            offset: -90, // Accounts for header height
            duration: 1.5,
            immediate: false,
          });
        }
      });
    });
  }

  /* ==========================================================================
     04. GSAP ENTRANCE ANIMATIONS (HERO SECTION 01)
     ========================================================================== */
  if (hasGSAP) {
    const heroTl = gsap.timeline();

    // Animate hero text reveal
    heroTl.from(".hero-tag", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.2,
    });

    heroTl.from(
      ".hero-title .word",
      {
        yPercent: 100,
        stagger: 0.08,
        duration: 0.8,
        ease: "power4.out",
      },
      "-=0.4",
    );

    heroTl.from(
      ".hero-subheadline",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4",
    );

    heroTl.from(
      ".hero-actions",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4",
    );

    // Setup Hero Slider GSAP Cross-Fade & Ken Burns
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length > 0) {
      let currentSlide = 0;
      const slideDuration = 6000; // 6 seconds per slide

      // Set initial states
      gsap.set(slides, { opacity: 0, scale: 1.12 });
      gsap.set(slides[0], { opacity: 1, scale: 1.0 });

      const playNextSlide = () => {
        const next = (currentSlide + 1) % slides.length;

        // Outgoing slide: fade out & continue scaling up slowly
        gsap.to(slides[currentSlide], {
          opacity: 0,
          scale: 1.15,
          duration: 1.5,
          ease: "power2.inOut",
        });

        // Incoming slide: reset scale, fade in & scale down
        gsap.fromTo(
          slides[next],
          { opacity: 0, scale: 1.15 },
          { opacity: 1, scale: 1.0, duration: 1.8, ease: "power2.out" },
        );

        currentSlide = next;
      };

      setInterval(playNextSlide, slideDuration);
    }

    // Parallax Scroll trigger on slider
    if (hasScrollTrigger && document.getElementById("js-hero-slider")) {
      gsap.to("#js-hero-slider", {
        yPercent: 15, // Smooth parallax shift
        ease: "none",
        scrollTrigger: {
          trigger: ".section-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Floating spices subtle parallax
    if (document.getElementById("js-spice-bg")) {
      window.addEventListener("mousemove", (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 40;
        const y = (e.clientY - window.innerHeight / 2) / 40;
        gsap.to(".spice-particle.p1", {
          x: x * 1.5,
          y: y * 1.5,
          duration: 0.8,
        });
        gsap.to(".spice-particle.p2", { x: -x * 2, y: -y * 2, duration: 0.8 });
        gsap.to(".spice-particle.p3", {
          x: x * 0.8,
          y: -y * 0.8,
          duration: 0.8,
        });
        gsap.to(".spice-particle.p4", {
          x: -x * 1.2,
          y: y * 1.2,
          duration: 0.8,
        });
      });
    }
  }

  /* ==========================================================================
     05. OUR STORY PARALLAX & TEXT STAGGER (SECTION 02)
     ========================================================================== */
  if (hasGSAP && hasScrollTrigger) {
    // Parallax on story image
    gsap.to(".story-img", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".section-story",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Content reveal stagger
    gsap.from(".text-reveal-trigger > *", {
      opacity: 0,
      y: 35,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".text-reveal-trigger",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Image Container Slide-in
    gsap.from(".story-visual", {
      scale: 0.95,
      opacity: 0.8,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".story-visual",
        start: "top 80%",
      },
    });
  }

  /* ==========================================================================
     06. SIGNATURE SPECIALTIES: ANIMATED SLIDER (SECTION 03)
     ========================================================================== */
  const initSpecialtiesSlider = () => {
    const textBlocks = document.querySelectorAll(
      ".sticky-scroller-text .text-block",
    );
    const imageWrappers = document.querySelectorAll(
      ".image-viewer-frame .specialty-image-wrapper",
    );
    const prevBtn = document.getElementById("js-specialty-prev");
    const nextBtn = document.getElementById("js-specialty-next");
    const currentNumElem = document.getElementById("js-specialty-current");
    const progressBar = document.getElementById("js-specialty-progress");
    const section = document.getElementById("specialties");

    if (!textBlocks.length || !imageWrappers.length) return;

    let currentIndex = 0;
    const totalSlides = textBlocks.length;
    const slideDuration = 4.0; // 4 seconds per slide
    let progressTween = null;
    let isTransitioning = false;

    // Helper to format number (e.g., 1 -> "01")
    const formatNumber = (num) => String(num).padStart(2, "0");

    // Initialize initial state
    const init = () => {
      // Deactivate all slides except the first one
      textBlocks.forEach((block, idx) => {
        if (idx === 0) {
          block.classList.add("active");
          gsap.set(block, { opacity: 1, visibility: "visible", y: 0 });
        } else {
          block.classList.remove("active");
          gsap.set(block, { opacity: 0, visibility: "hidden", y: 30 });
        }
      });

      imageWrappers.forEach((imgWrap, idx) => {
        if (idx === 0) {
          imgWrap.classList.add("active");
          gsap.set(imgWrap, { opacity: 1, scale: 1 });
        } else {
          imgWrap.classList.remove("active");
          gsap.set(imgWrap, { opacity: 0, scale: 1.1 });
        }
      });

      if (currentNumElem) {
        currentNumElem.innerText = formatNumber(1);
      }

      startAutoplay();
    };

    // Start autoplay progress bar & timer
    const startAutoplay = () => {
      if (!progressBar) return;

      // Kill existing tween if any
      if (progressTween) progressTween.kill();

      // Reset progress bar scale/width
      gsap.set(progressBar, { width: "0%" });

      // Animate progress bar and transition on complete
      progressTween = gsap.to(progressBar, {
        width: "100%",
        duration: slideDuration,
        ease: "none",
        onComplete: () => {
          goToSlide((currentIndex + 1) % totalSlides);
        },
      });
    };

    // Go to a specific slide
    const goToSlide = (index) => {
      if (index === currentIndex || isTransitioning) return;
      isTransitioning = true;

      const outgoingText = textBlocks[currentIndex];
      const incomingText = textBlocks[index];
      const outgoingImg = imageWrappers[currentIndex];
      const incomingImg = imageWrappers[index];

      // Update current slide index
      currentIndex = index;

      // Update slide number display
      if (currentNumElem) {
        currentNumElem.innerText = formatNumber(currentIndex + 1);
      }

      // Update active classes for fallback styles
      textBlocks.forEach((block, idx) => {
        block.classList.toggle("active", idx === currentIndex);
      });
      imageWrappers.forEach((img, idx) => {
        img.classList.toggle("active", idx === currentIndex);
      });

      // GSAP Animations: Text blocks
      // Fade out outgoing text
      gsap.to(outgoingText, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(outgoingText, { visibility: "hidden" });
        },
      });

      // Fade/slide in incoming text
      gsap.set(incomingText, { visibility: "visible", y: 30 });
      // Stagger child elements of incoming text block
      const childElements = incomingText.querySelectorAll(
        ".specialty-label, .specialty-title, .specialty-description, .btn",
      );
      if (childElements.length > 0) {
        gsap.fromTo(
          childElements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.1,
          },
        );
        gsap.to(incomingText, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.1,
        });
      } else {
        gsap.fromTo(
          incomingText,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 },
        );
      }

      // GSAP Animations: Image wrappers
      // Scale up and fade out outgoing image
      gsap.to(outgoingImg, {
        opacity: 0,
        scale: 1.12,
        duration: 0.8,
        ease: "power2.inOut",
      });

      // Fade in and scale down incoming image
      gsap.fromTo(
        incomingImg,
        { opacity: 0, scale: 1.12 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          onComplete: () => {
            isTransitioning = false;
            startAutoplay();
          },
        },
      );
    };

    // Next/Prev button click handlers
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide((currentIndex + 1) % totalSlides);
      });
    }

    // Hover to Pause on Desktop devices (only when hovering on text or the progress bar)
    const textContainer = document.querySelector(".sticky-scroller-text");
    const progressTrack = document.querySelector(".slider-progress-track");

    const pauseAutoplay = () => {
      if (progressTween && !progressTween.paused()) {
        progressTween.pause();
      }
    };

    const resumeAutoplay = () => {
      const textHovered = textContainer && textContainer.matches(":hover");
      const progressHovered = progressTrack && progressTrack.matches(":hover");
      if (!textHovered && !progressHovered) {
        if (progressTween && progressTween.paused()) {
          progressTween.play();
        }
      }
    };

    if (window.matchMedia("(pointer: fine)").matches) {
      if (textContainer) {
        textContainer.addEventListener("mouseenter", pauseAutoplay);
        textContainer.addEventListener("mouseleave", resumeAutoplay);
      }
      if (progressTrack) {
        progressTrack.addEventListener("mouseenter", pauseAutoplay);
        progressTrack.addEventListener("mouseleave", resumeAutoplay);
      }
    }

    // Touch Swipe Event Handlers for Mobile Devices
    let touchStartX = 0;
    let touchEndX = 0;

    section.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    section.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true },
    );

    const handleSwipe = () => {
      const swipeThreshold = 50; // pixels
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left -> Next slide
        goToSlide((currentIndex + 1) % totalSlides);
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right -> Prev slide
        goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
      }
    };

    init();
  };

  if (hasGSAP) {
    initSpecialtiesSlider();
  }

  /* ==========================================================================
     07. MENU EXPERIENCE DISCOVERY (SECTION 04)
     ========================================================================== */
  const categoryBtns = document.querySelectorAll(".category-btn");
  const categoryPanes = document.querySelectorAll(".menu-category-pane");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-category");

      // Update active nav button
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Transition pane visibility
      categoryPanes.forEach((pane) => {
        if (pane.id === `menu-${selectedCategory}`) {
          pane.style.display = "block";
          // Force layout recalculation
          pane.offsetHeight;
          pane.classList.add("active");

          // Refresh ScrollTrigger as height might have changed
          if (hasScrollTrigger) {
            ScrollTrigger.refresh();
          }
        } else {
          pane.classList.remove("active");
          pane.style.display = "none";
        }
      });
    });
  });

  /* ==========================================================================
     07B. PREMIUM SCROLL-DRIVEN HERO VIDEO REVEAL (GSAP + SCROLLTRIGGER)
     ========================================================================== */
  (function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var heroEl       = document.getElementById("heroVideoReveal");
    var videoWrapEl  = document.getElementById("videoWrap");
    var videoFloatEl = document.getElementById("videoFloat");
    var videoEl      = document.getElementById("heroVideo");
    var scrollCueEl  = document.getElementById("scrollCue");
    var toggleBtn    = document.getElementById("videoToggle");
    var toggleLabel  = document.getElementById("videoToggleLabel");

    if (!heroEl || !videoWrapEl || !videoEl) return;

    /* Force play on load / user interaction */
    const attemptPlay = function () {
      if (videoEl.paused) {
        videoEl.play().catch(function () {});
      }
    };
    attemptPlay();
    document.addEventListener("touchstart", attemptPlay, { once: true });
    document.addEventListener("click", attemptPlay, { once: true });

    /* Decorative-video pause control */
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var paused = toggleBtn.classList.toggle("is-paused");
        toggleBtn.setAttribute("aria-pressed", String(paused));
        if (toggleLabel) {
          toggleLabel.textContent = paused ? "Play background video" : "Pause background video";
        }
        if (paused) { videoEl.pause(); } else { videoEl.play().catch(function(){}); }
      });
    }

    /* Reduced motion check */
    if (prefersReducedMotion) {
      if (videoFloatEl) videoFloatEl.style.transform = "none";
      videoWrapEl.style.cssText =
        "position:relative;width:100vw;height:100vh;border-radius:0;box-shadow:none;";
      if (scrollCueEl) scrollCueEl.style.display = "none";
      return;
    }

    function isMobile() {
      return window.innerWidth <= 768;
    }

    function getStageOneTarget() {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      if (isMobile()) {
        return { width: vw * 0.88, height: vh * 0.5, radius: 28 };
      }
      return { width: Math.min(vw * 0.72, 980), height: vh * 0.58, radius: 48 };
    }

    function getStageTwoTarget() {
      return { width: window.innerWidth, height: window.innerHeight, radius: 0 };
    }

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: function () { return "+=" + window.innerHeight * (isMobile() ? 1.4 : 2); },
          scrub: isMobile() ? true : 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      if (scrollCueEl) {
        tl.to(scrollCueEl, { opacity: 0, duration: 0.06, ease: "power1.out" }, 0);
      }

      /* Gradually decrease video transparency (opacity 0.4 -> 1.0) on scroll */
      tl.to(videoEl, { opacity: 1.0, ease: "none", duration: 1 }, 0);

      tl.to(videoWrapEl, {
        width: function () { return getStageOneTarget().width + "px"; },
        height: function () { return getStageOneTarget().height + "px"; },
        borderRadius: function () { return getStageOneTarget().radius + "px"; },
        boxShadow: "0 40px 110px -30px rgba(0,0,0,0.22), 0 10px 28px -10px rgba(0,0,0,0.12)",
        ease: "power4.out",
        duration: 0.55
      }, 0)
      .to(videoEl, { scale: 1.0, ease: "power4.out", duration: 0.55 }, 0)

      .to(videoWrapEl, {
        width: function () { return getStageTwoTarget().width + "px"; },
        height: function () { return getStageTwoTarget().height + "px"; },
        borderRadius: function () { return getStageTwoTarget().radius + "px"; },
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        ease: "expo.inOut",
        duration: 0.45
      }, 0.55);

      var resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          ScrollTrigger.refresh();
        }, 150);
      });
    }
  })();

  /* ==========================================================================
     08. LUXURY METRICS COUNTERS (SECTION 05)
     ========================================================================== */
  if (hasGSAP && hasScrollTrigger) {
    const metricNumbers = document.querySelectorAll(".metric-number");

    metricNumbers.forEach((num) => {
      const targetVal = parseFloat(num.getAttribute("data-target"));
      const isDecimal = num.getAttribute("data-decimal") === "true";

      gsap.fromTo(
        num,
        {
          innerText: 0,
        },
        {
          innerText: targetVal,
          duration: 2.2,
          ease: "power2.out",
          snap: { innerText: isDecimal ? 0.1 : 1 },
          scrollTrigger: {
            trigger: num,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: function () {
            if (isDecimal) {
              num.innerText = parseFloat(num.innerText).toFixed(1);
            }
          },
        },
      );
    });

    // Metric cards stagger entrance
    gsap.from(".metric-card", {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".metrics-grid",
        start: "top 80%",
      },
    });
  }

  /* ==========================================================================
     09. GALLERY EXPERIENCE: HORIZONTAL PIN SCROLL (SECTION 06)
     ========================================================================== */
  if (hasGSAP && hasScrollTrigger) {
    const track = document.getElementById("js-gallery-track");

    if (track) {
      let galleryMm = gsap.matchMedia();

      galleryMm.add("(min-width: 1025px)", () => {
        // Calculate how far the track needs to scroll to reveal all photos
        const getScrollAmount = () => {
          let trackWidth = track.scrollWidth;
          let paddingLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
          return -(trackWidth - window.innerWidth + paddingLeft);
        };

        const galleryTween = gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: ".section-gallery",
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Subtle scale effect on images when scrolling through gallery
        gsap.utils.toArray(".gallery-img").forEach((img) => {
          gsap.fromTo(
            img,
            {
              scale: 1.05,
            },
            {
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                start: "left right",
                end: "right left",
                scrub: true,
                containerAnimation: galleryTween,
              },
            },
          );
        });
      });
    }
  }

  /* ==========================================================================
     10. RESERVATION FORM CONTROLLER (SECTION 07)
     ========================================================================== */
  const reservationForm = document.getElementById("js-reservation-form");
  const formFeedback = document.getElementById("js-form-feedback");

  if (reservationForm && formFeedback) {
    // Initialize Flatpickr for cross-platform date picker
    const dateInput = document.getElementById("res-date");
    let flatpickrInstance = null;
    if (dateInput && typeof flatpickr !== "undefined") {
      flatpickrInstance = flatpickr(dateInput, {
        dateFormat: "Y-m-d",        // value submitted to backend
        altInput: true,              // show a human-friendly format
        altFormat: "d-m-Y",          // what the user sees (dd-mm-yyyy)
        minDate: "today",
        disableMobile: true,         // force Flatpickr UI on all devices
        allowInput: false,
        placeholder: "dd-mm-yyyy",
      });
    }

    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Select input elements
      const nameVal = document.getElementById("res-name").value.trim();
      const phoneVal = document.getElementById("res-phone").value.trim();
      const guestsVal = document.getElementById("res-guests").value;
      const dateVal = document.getElementById("res-date").value;
      const timeVal = document.getElementById("res-time").value;

      formFeedback.innerHTML = "Sending reservation request...";
      formFeedback.className = "form-feedback";

      // Simulate network request
      setTimeout(() => {
        formFeedback.innerHTML = `Table for ${guestsVal} requested successfully for ${dateVal} at ${timeVal}. We will message you at ${phoneVal} to confirm.`;
        formFeedback.className = "form-feedback success";
        reservationForm.reset();
        if (flatpickrInstance) flatpickrInstance.clear();
      }, 1500);
    });
  }

  /* ==========================================================================
     10B. BRAND STATEMENT & THALI SHOWCASE SCROLL ANIMATIONS
     ========================================================================== */
  if (hasGSAP && hasScrollTrigger) {
    // Brand Statement: Heading fade up
    const brandHeading = document.getElementById("brand-heading");
    if (brandHeading) {
      gsap.from(brandHeading, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-brand-statement",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    // Brand Statement: Description fade up with delay
    const brandDesc = document.getElementById("brand-desc");
    if (brandDesc) {
      gsap.from(brandDesc, {
        opacity: 0,
        y: 35,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-brand-statement",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    // Thali Showcase: Image fade in from left
    const thaliVisual = document.getElementById("thali-visual");
    if (thaliVisual) {
      gsap.from(thaliVisual, {
        opacity: 0,
        x: -40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-thali-showcase",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }

    // Thali Showcase: Content stagger in
    const thaliContent = document.getElementById("thali-content");
    if (thaliContent) {
      const thaliChildren = thaliContent.querySelectorAll(
        ".thali-heading, .thali-desc, .thali-badge"
      );
      if (thaliChildren.length > 0) {
        gsap.from(thaliChildren, {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-thali-showcase",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    }
  }

  /* ==========================================================================
     11. SECTION 07 REVEAL ANIMATION (CONTACT SECTION TRANSITION)
     ========================================================================== */
  if (hasGSAP && hasScrollTrigger) {
    gsap.from(".contact-cta-block", {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".section-contact",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    gsap.from(".reservation-card", {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".section-contact",
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });
  }

  /* ==========================================================================
     12. SCROLL PROGRESS BAR & BACK TO TOP BUTTON
     ========================================================================== */
  const progressBar = document.getElementById("js-scroll-progress");
  const backToTopBtn = document.getElementById("js-back-to-top");
  const progressCircle = document.querySelector(".progress-ring__circle");

  if (progressBar || backToTopBtn) {
    let circumference = 0;

    // Function to initialize circumference dynamically (useful on resize)
    const initCircumference = () => {
      if (progressCircle) {
        circumference = progressCircle.getTotalLength();
        progressCircle.style.strokeDasharray = circumference;
      }
    };

    initCircumference();
    window.addEventListener("resize", initCircumference);

    const updateScrollProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress =
        scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      // Update horizontal progress bar width
      if (progressBar) {
        progressBar.style.width = `${scrollProgress * 100}%`;
      }

      // Update circular progress ring stroke-dashoffset
      if (progressCircle && circumference > 0) {
        const offset = circumference - scrollProgress * circumference;
        progressCircle.style.strokeDashoffset = offset;
      }

      // Show back to top button after scrolling down 300px
      if (backToTopBtn) {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
      }
    };

    window.addEventListener("scroll", updateScrollProgress);

    // Initial run to sync state
    setTimeout(updateScrollProgress, 100);

    // Click handler to return to top smoothly (uses Lenis if available)
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        if (lenisInstance) {
          lenisInstance.scrollTo(0, {
            duration: 1.5,
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });
    }
  }

  /* ==========================================================================
     GSAP TEXT REVEAL & FLOAT HOVER FOR SECTION MANAGAMMA_RUCHULU
     ========================================================================== */
  if (hasGSAP && hasScrollTrigger) {
    // Reveal letters of the brand title
    const brandChars = document.querySelectorAll("#js-reveal-brand .char-span");
    if (brandChars.length > 0) {
      gsap.from(brandChars, {
        y: 120,
        opacity: 0,
        color: "var(--color-gold)",
        rotation: 10,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: "#managamma_ruchulu",
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });
      
      // Transition color to maroon during reveal
      gsap.to(brandChars, {
        color: "var(--color-maroon)",
        delay: 0.3,
        duration: 1.0,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: "#managamma_ruchulu",
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });
    }

    // Scale and rotate in the 4 floating icons
    gsap.from("#managamma_ruchulu .floating-icon", {
      scale: 0,
      opacity: 0,
      rotation: -60,
      duration: 1.5,
      ease: "back.out(1.7)",
      stagger: 0.15,
      scrollTrigger: {
        trigger: "#managamma_ruchulu",
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Parallax mouse move effect on floating icons in the section
    const revealSection = document.getElementById("managamma_ruchulu");
    if (revealSection) {
      revealSection.addEventListener("mousemove", (e) => {
        const rect = revealSection.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to("#float-icon-1", { x: x * 0.06, y: y * 0.06, rotation: x * 0.03, duration: 0.6, ease: "power2.out" });
        gsap.to("#float-icon-2", { x: x * -0.05, y: y * -0.05, rotation: y * -0.04, duration: 0.6, ease: "power2.out" });
        gsap.to("#float-icon-3", { x: x * 0.04, y: y * -0.04, rotation: x * -0.03, duration: 0.6, ease: "power2.out" });
        gsap.to("#float-icon-4", { x: x * -0.06, y: y * 0.05, rotation: y * 0.04, duration: 0.6, ease: "power2.out" });
      });
      
      // Reset position when mouse leaves
      revealSection.addEventListener("mouseleave", () => {
        gsap.to("#managamma_ruchulu .floating-icon", { x: 0, y: 0, rotation: 0, duration: 1.0, ease: "power3.out" });
      });
    }
  }

  /* ==========================================================================
     13. PDF MENU MODAL CONTROLLER
     ========================================================================== */
  const pdfModal = document.getElementById("js-pdf-modal");
  const pdfOpenBtn = document.getElementById("js-open-menu-pdf");
  const pdfCloseBtn = document.getElementById("js-close-menu-pdf");
  const pdfIframe = document.getElementById("js-pdf-iframe");
  const pdfSrc = "files/MGM_Menu.pdf";

  if (pdfModal && pdfOpenBtn) {
    const openPdfModal = () => {
      // Lazy-load PDF into iframe on first open
      if (pdfIframe && !pdfIframe.src.includes(pdfSrc)) {
        pdfIframe.src = pdfSrc;
      }
      pdfModal.classList.add("open");
      document.body.style.overflow = "hidden";
      // Pause Lenis smooth scroll while modal is open
      if (lenisInstance) lenisInstance.stop();
    };

    const closePdfModal = () => {
      pdfModal.classList.remove("open");
      document.body.style.overflow = "";
      // Resume Lenis smooth scroll
      if (lenisInstance) lenisInstance.start();
      // Clear iframe after transition to free memory
      setTimeout(() => {
        if (pdfIframe && !pdfModal.classList.contains("open")) {
          pdfIframe.src = "";
        }
      }, 500);
    };

    pdfOpenBtn.addEventListener("click", openPdfModal);

    if (pdfCloseBtn) {
      pdfCloseBtn.addEventListener("click", closePdfModal);
    }

    // Close on backdrop click (outside the container)
    pdfModal.addEventListener("click", (e) => {
      if (e.target === pdfModal) {
        closePdfModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && pdfModal.classList.contains("open")) {
        closePdfModal();
      }
    });
  }
});
