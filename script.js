/* CONFIG */
const page = document.body.dataset.page;

gsap.registerPlugin(
  ScrollTrigger,
  Draggable,
  DrawSVGPlugin,
  InertiaPlugin,
  SplitText
);

/* GLOBAL CODE */

/* Loader Reveal */
function initRevealLoader() {
  const loader = document.querySelector(".loader");
  if (!loader) return;

  const hasVisited = sessionStorage.getItem("loaderPlayed");

  if (hasVisited) {
    loader.style.display = "none";
    document.querySelector(".section_home-hero")?.style.setProperty("padding", "1.25em");
    document.querySelector(".home-hero-container")?.style.setProperty("border-radius", "1.25em");
    document.querySelector(".video-holder")?.style.setProperty("transform", "scale(1)");
    return;
  }

  sessionStorage.setItem("loaderPlayed", "true");

  const progressBar = loader.querySelector(".loader__bg-bar");
  const heroSection = document.querySelector(".section_home-hero");
  const heroContainer = document.querySelector(".home-hero-container");
  const heroVideo = document.querySelector(".video-holder");
  const nav = document.querySelector(".nav-container");
  const heading = document.querySelector(".home-hero-heading");
  const paragraph = document.querySelector(".home-hero-p");
  const button = document.querySelector("[data-button-hero]");

  // Defensive checks
  if (!heading) console.warn(".home-hero-heading not found");
  if (!paragraph) console.warn(".home-hero-p not found");
  if (!nav) console.warn(".navbar not found");

  // Split text once
  const splitHeading = SplitText.create(heading, {
    type: "lines",
    autoSplit: true,
    mask: "lines",
  });

  const splitParagraph = SplitText.create(paragraph, {
    type: "lines",
    autoSplit: true,
    mask: "lines",
  });

  // Main loader timeline
  const loadTimeline = gsap.timeline({
    defaults: { ease: "expo.inOut", duration: 1.75 },
  });

  loadTimeline
    .set(heroSection, { padding: 0 })
    .set(heroContainer, { borderRadius: 0 })
    .set(heroVideo, { scale: 1.75 })
    .set(loader, { display: "block" })
    .to(progressBar, { scaleX: 1, transformOrigin: "left center" })
    .to(progressBar, { scaleX: 0, transformOrigin: "right center", duration: 0.5 }, "<")
    .add("hideContent")
    .to(heroSection, { padding: "1.25em" })
    .to(heroContainer, { borderRadius: "1.25em" }, "<")
    .to(heroVideo, { scale: 1 }, "<")

    .add("headingStart", "<+0.75")
    .from(
      splitHeading.lines,
      { duration: 0.8, yPercent: 110, stagger: 0.1, ease: "expo.out" },
      "headingStart"
    )
    .add("paraStart", "headingStart+=0.1")
    .from(
      splitParagraph.lines,
      { duration: 0.8, yPercent: 110, stagger: 0.05, ease: "expo.out" },
      "paraStart"
    )
    .fromTo(
      nav,
      { yPercent: -100, opacity: 0 },
      { duration: 0.75, yPercent: 0, opacity: 1, ease: "expo.Out" },
      "headingStart"
    )
    .fromTo(
      button,
      { yPercent: 100, opacity: 0 },
      { duration: 0.5, yPercent: 0, opacity: 1, ease: "expo.Out" },
      "headingStart"
    )
    .to(loader, { yPercent: 101, duration: 1 }, "hideContent")
    .set(loader, { display: "none" });
}

initRevealLoader();

/* Page Transition */


/* Global Text Reveals */
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
}

function initMaskTextScrollReveal() {
  document.querySelectorAll('[data-split="heading"]').forEach(heading => {
    const type = heading.dataset.splitReveal || 'lines'
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines','words'] :
      ['lines','words','chars']
    
    SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit: function(instance) {
        const targets = instance[type]
        const config = splitConfig[type]
        
        return gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'clamp(top 80%)',
            once: true
          }
        });
      }
    })
  })
}

  let headings = document.querySelectorAll('[data-split="heading"]')
  
  headings.forEach(heading => {
    gsap.set(heading, { autoAlpha: 1 })
  });

initMaskTextScrollReveal()

/* Product Reveal Animation */
const productRevealConfig = {
  duration: 0.8,
  stagger: 0.1,
  ease: 'expo.out'
}

function initProductReveal() {
  const products = document.querySelectorAll('[data-product-reveal]')

  products.forEach(product => {
    gsap.set(product, {
      //autoAlpha: 0,
      scale: 0,
      transformOrigin: 'center center'
    })

    gsap.to(product, {
      //autoAlpha: 1,
      scale: 1,
      duration: productRevealConfig.duration,
      stagger: productRevealConfig.stagger,
      ease: productRevealConfig.ease,
      scrollTrigger: {
        trigger: product,
        start: 'top 90%',
        //markers: true,
        once: true
      }
    })
  })
}

initProductReveal()

/* Check section for navbar color change */
function initCheckSectionThemeScroll() {
  // Get detection offset, in this case the navbar
  const navBarHeight = document.querySelector("[data-nav-bar-height]");
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;

  function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");

    themeSections.forEach(function (themeSection) {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      // If the offset is between the top & bottom of the current section
      if (
        themeSectionTop <= themeObserverOffset &&
        themeSectionBottom >= themeObserverOffset
      ) {
        // Check [data-theme-section]
        const themeSectionActive =
          themeSection.getAttribute("data-theme-section");
        document.querySelectorAll("[data-theme-nav]").forEach(function (elem) {
          if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
            elem.setAttribute("data-theme-nav", themeSectionActive);
          }
        });

        // Check [data-bg-section]
        const bgSectionActive = themeSection.getAttribute("data-bg-section");
        document.querySelectorAll("[data-bg-nav]").forEach(function (elem) {
          if (elem.getAttribute("data-bg-nav") !== bgSectionActive) {
            elem.setAttribute("data-bg-nav", bgSectionActive);
          }
        });
      }
    });
  }

  function startThemeCheck() {
    document.addEventListener("scroll", checkThemeSection);
  }

  checkThemeSection();
  startThemeCheck();
}

initCheckSectionThemeScroll();

/* Scroll Direction Detecting */
//if (window.matchMedia('(min-width: 991px)').matches) {
function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 10; // Minimal scroll distance to switch to up/down
  const thresholdTop = 50; // Minimal scroll distance from top of window to start

  window.addEventListener("scroll", () => {
    const nowScrollTop = window.scrollY;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      // Update Scroll Direction
      const direction = nowScrollTop > lastScrollTop ? "down" : "up";
      document
        .querySelectorAll("[data-scrolling-direction]")
        .forEach((el) =>
          el.setAttribute("data-scrolling-direction", direction)
        );

      // Update Scroll Started
      const started = nowScrollTop > thresholdTop;
      document
        .querySelectorAll("[data-scrolling-started]")
        .forEach((el) =>
          el.setAttribute("data-scrolling-started", started ? "true" : "false")
        );

      lastScrollTop = nowScrollTop;
    }
  });
}

initDetectScrollingDirection();
//}

/* Draw Random Line on hover */
function initDrawRandomUnderline() {
  const svgVariants = [
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 20.9999C26.7762 16.2245 49.5532 11.5572 71.7979 14.6666C84.9553 16.5057 97.0392 21.8432 109.987 24.3888C116.413 25.6523 123.012 25.5143 129.042 22.6388C135.981 19.3303 142.586 15.1422 150.092 13.3333C156.799 11.7168 161.702 14.6225 167.887 16.8333C181.562 21.7212 194.975 22.6234 209.252 21.3888C224.678 20.0548 239.912 17.991 255.42 18.3055C272.027 18.6422 288.409 18.867 305 17.9999" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 24.2592C26.233 20.2879 47.7083 16.9968 69.135 13.8421C98.0469 9.5853 128.407 4.02322 158.059 5.14674C172.583 5.69708 187.686 8.66104 201.598 11.9696C207.232 13.3093 215.437 14.9471 220.137 18.3619C224.401 21.4596 220.737 25.6575 217.184 27.6168C208.309 32.5097 197.199 34.281 186.698 34.8486C183.159 35.0399 147.197 36.2657 155.105 26.5837C158.11 22.9053 162.993 20.6229 167.764 18.7924C178.386 14.7164 190.115 12.1115 201.624 10.3984C218.367 7.90626 235.528 7.06127 252.521 7.49276C258.455 7.64343 264.389 7.92791 270.295 8.41825C280.321 9.25056 296 10.8932 305 13.0242" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.0039 32.6826C32.2307 32.8412 47.4552 32.8277 62.676 32.8118C67.3044 32.807 96.546 33.0555 104.728 32.0775C113.615 31.0152 104.516 28.3028 102.022 27.2826C89.9573 22.3465 77.3751 19.0254 65.0451 15.0552C57.8987 12.7542 37.2813 8.49399 44.2314 6.10216C50.9667 3.78422 64.2873 5.81914 70.4249 5.96641C105.866 6.81677 141.306 7.58809 176.75 8.59886C217.874 9.77162 258.906 11.0553 300 14.4892" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99805 20.9998C65.6267 17.4649 126.268 13.845 187.208 12.8887C226.483 12.2723 265.751 13.2796 304.998 13.9998" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.8857C52.3147 26.9322 99.4329 21.6611 146.503 17.1765C151.753 16.6763 157.115 15.9505 162.415 15.6551C163.28 15.6069 165.074 15.4123 164.383 16.4275C161.704 20.3627 157.134 23.7551 153.95 27.4983C153.209 28.3702 148.194 33.4751 150.669 34.6605C153.638 36.0819 163.621 32.6063 165.039 32.2029C178.55 28.3608 191.49 23.5968 204.869 19.5404C231.903 11.3436 259.347 5.83254 288.793 5.12258C294.094 4.99476 299.722 4.82265 305 5.45025" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
  ];

  // Add attributes to <svg> elements
  function decorateSVG(svgEl) {
    svgEl.setAttribute("class", "text-draw__box-svg");
    svgEl.setAttribute("preserveAspectRatio", "none");
    svgEl.querySelectorAll("path").forEach((path) => {
      path.setAttribute("stroke", "currentColor");
    });
  }

  let nextIndex = null;

  document.querySelectorAll("[data-draw-line]").forEach((container) => {
    const box = container.querySelector("[data-draw-line-box]");
    if (!box) return;

    let enterTween = null;
    let leaveTween = null;

    container.addEventListener("mouseenter", () => {
      // Don't restart if still playing
      if (enterTween && enterTween.isActive()) return;
      if (leaveTween && leaveTween.isActive()) leaveTween.kill();

      // Random Start
      if (nextIndex === null) {
        nextIndex = Math.floor(Math.random() * svgVariants.length);
      }

      // Animate Draw
      box.innerHTML = svgVariants[nextIndex];
      const svg = box.querySelector("svg");
      if (svg) {
        decorateSVG(svg);
        const path = svg.querySelector("path");
        if (path) {
          gsap.set(path, { drawSVG: "0%" });
          enterTween = gsap.to(path, {
            duration: 0.5,
            drawSVG: "100%",
            ease: "power2.inOut",
            onComplete: () => {
              enterTween = null;
            },
          });
        }
      }

      // Advance for next hover across all items
      nextIndex = (nextIndex + 1) % svgVariants.length;
    });

    container.addEventListener("mouseleave", () => {
      const path = box.querySelector("path");
      if (!path) return;

      const playOut = () => {
        // Don't restart if still drawing out
        if (leaveTween && leaveTween.isActive()) return;
        leaveTween = gsap.to(path, {
          duration: 0.5,
          drawSVG: "100% 100%",
          ease: "power2.inOut",
          onComplete: () => {
            leaveTween = null;
            box.innerHTML = ""; // remove SVG when done
          },
        });
      };

      if (enterTween && enterTween.isActive()) {
        // Wait until draw-in finishes
        enterTween.eventCallback("onComplete", playOut);
      } else {
        playOut();
      }
    });
  });
}

initDrawRandomUnderline();

/* Global Parallax Setup */
function initGlobalParallax() {
  const ctx = gsap.context(() => {
    document
      .querySelectorAll('[data-parallax="trigger"]')
      .forEach((trigger) => {
        // Optional: you can target an element inside a trigger if necessary
        const target =
          trigger.querySelector('[data-parallax="target"]') || trigger;

        // Get the direction value to decide between xPercent or yPercent tween
        const direction =
          trigger.getAttribute("data-parallax-direction") || "vertical";
        const prop = direction === "horizontal" ? "xPercent" : "yPercent";

        // Get the scrub value, default is 'true'
        const scrubAttr = trigger.getAttribute("data-parallax-scrub");
        const scrub = scrubAttr ? parseFloat(scrubAttr) : true;

        // Get the start position in %
        const startAttr = trigger.getAttribute("data-parallax-start");
        const startVal = startAttr !== null ? parseFloat(startAttr) : 20;

        // Get the end position in %
        const endAttr = trigger.getAttribute("data-parallax-end");
        const endVal = endAttr !== null ? parseFloat(endAttr) : -20;

        // Get the start value of the ScrollTrigger
        const scrollStartRaw =
          trigger.getAttribute("data-parallax-scroll-start") || "top bottom";
        const scrollStart = `clamp(${scrollStartRaw})`;

        // Get the end value of the ScrollTrigger
        const scrollEndRaw =
          trigger.getAttribute("data-parallax-scroll-end") || "bottom top";
        const scrollEnd = `clamp(${scrollEndRaw})`;

        gsap.fromTo(
          target,
          { [prop]: startVal },
          {
            [prop]: endVal,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: scrollStart,
              end: scrollEnd,
              scrub,
            },
          }
        );
      });
  });

  return () => ctx.revert();
}

initGlobalParallax();

/* MOBILE MENU */
function initMobileMenu() {
  if (window.matchMedia("(max-width: 991px)").matches) {
    const menuBtn = document.querySelector(".menu-btn");
    const menuBg = document.querySelector(".menu-bg");
    const navMobile = document.querySelector(".nav-mobile");

    if (!menuBtn || !menuBg || !navMobile) return; // safety check

    // Ensure initial states
    gsap.set(menuBg, { height: "0%" });

    // Create timeline (paused initially)
    const tl = gsap.timeline({ paused: true, reversed: true });

    tl.to(menuBg, {
      display: "block",
      height: "100svh",
      duration: 0.5,
      ease: "power2.inOut",
    }).to(
      navMobile,
      {
        display: "flex",
        duration: 0,
      },
      "-=0.3"
    ); // overlap slightly

    // Toggle timeline on button click
    menuBtn.addEventListener("click", () => {
      if (tl.reversed()) {
        tl.play();
      } else {
        tl.reverse();
      }
    });
  }
}

initMobileMenu();

/* Basic GSAP Slider */
function initBasicGSAPSlider() {
  document.querySelectorAll("[data-gsap-slider-init]").forEach((root) => {
    if (root._sliderDraggable) root._sliderDraggable.kill();

    const collection = root.querySelector("[data-gsap-slider-collection]");
    const track = root.querySelector("[data-gsap-slider-list]");
    const items = Array.from(root.querySelectorAll("[data-gsap-slider-item]"));
    const controls = Array.from(
      root.querySelectorAll("[data-gsap-slider-control]")
    );

    // Inject aria attributes
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carousel");
    root.setAttribute("aria-label", "Slider");
    collection.setAttribute("role", "group");
    collection.setAttribute("aria-roledescription", "Slides List");
    collection.setAttribute("aria-label", "Slides");
    items.forEach((slide, i) => {
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "Slide");
      slide.setAttribute("aria-label", `Slide ${i + 1} of ${items.length}`);
      slide.setAttribute("aria-hidden", "true");
      slide.setAttribute("aria-selected", "false");
      slide.setAttribute("tabindex", "-1");
    });
    controls.forEach((btn) => {
      const dir = btn.getAttribute("data-gsap-slider-control");
      btn.setAttribute("role", "button");
      btn.setAttribute(
        "aria-label",
        dir === "prev" ? "Previous Slide" : "Next Slide"
      );
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
    });

    // Determine if slider runs
    const styles = getComputedStyle(root);
    const statusVar = styles.getPropertyValue("--slider-status").trim();
    let spvVar = parseFloat(styles.getPropertyValue("--slider-spv"));
    const rect = items[0].getBoundingClientRect();
    const marginRight = parseFloat(getComputedStyle(items[0]).marginRight);
    const slideW = rect.width + marginRight;
    if (isNaN(spvVar)) {
      spvVar = collection.clientWidth / slideW;
    }
    const spv = Math.max(1, Math.min(spvVar, items.length));
    const sliderEnabled = statusVar === "on" && spv < items.length;
    root.setAttribute(
      "data-gsap-slider-status",
      sliderEnabled ? "active" : "not-active"
    );

    if (!sliderEnabled) {
      // Teardown when disabled
      track.removeAttribute("style");
      track.onmouseenter = null;
      track.onmouseleave = null;
      track.removeAttribute("data-gsap-slider-list-status");
      root.removeAttribute("role");
      root.removeAttribute("aria-roledescription");
      root.removeAttribute("aria-label");
      collection.removeAttribute("role");
      collection.removeAttribute("aria-roledescription");
      collection.removeAttribute("aria-label");
      items.forEach((slide) => {
        slide.removeAttribute("role");
        slide.removeAttribute("aria-roledescription");
        slide.removeAttribute("aria-label");
        slide.removeAttribute("aria-hidden");
        slide.removeAttribute("aria-selected");
        slide.removeAttribute("tabindex");
        slide.removeAttribute("data-gsap-slider-item-status");
      });
      controls.forEach((btn) => {
        btn.disabled = false;
        btn.removeAttribute("role");
        btn.removeAttribute("aria-label");
        btn.removeAttribute("aria-disabled");
        btn.removeAttribute("data-gsap-slider-control-status");
      });
      return;
    }

    // Track hover state
    track.onmouseenter = () => {
      track.setAttribute("data-gsap-slider-list-status", "grab");
    };
    track.onmouseleave = () => {
      track.removeAttribute("data-gsap-slider-list-status");
    };

    //Ccalculate bounds and snap points
    const vw = collection.clientWidth;
    const tw = track.scrollWidth;
    const maxScroll = Math.max(tw - vw, 0);
    const minX = -maxScroll;
    const maxX = 0;
    const maxIndex = maxScroll / slideW;
    const full = Math.floor(maxIndex);
    const snapPoints = [];
    for (let i = 0; i <= full; i++) {
      snapPoints.push(-i * slideW);
    }
    if (full < maxIndex) {
      snapPoints.push(-maxIndex * slideW);
    }

    let activeIndex = 0;
    const setX = gsap.quickSetter(track, "x", "px");
    let collectionRect = collection.getBoundingClientRect();

    function updateStatus(x) {
      if (x > maxX || x < minX) {
        return;
      }

      // Clamp and find closest snap
      const calcX = x > maxX ? maxX : x < minX ? minX : x;
      let closest = snapPoints[0];
      snapPoints.forEach((pt) => {
        if (Math.abs(pt - calcX) < Math.abs(closest - calcX)) {
          closest = pt;
        }
      });
      activeIndex = snapPoints.indexOf(closest);

      // Update Slide Attributes
      items.forEach((slide, i) => {
        const r = slide.getBoundingClientRect();
        const leftEdge = r.left - collectionRect.left;
        const slideCenter = leftEdge + r.width / 2;
        const inView = slideCenter > 0 && slideCenter < collectionRect.width;
        const status =
          i === activeIndex ? "active" : inView ? "inview" : "not-active";

        slide.setAttribute("data-gsap-slider-item-status", status);
        slide.setAttribute(
          "aria-selected",
          i === activeIndex ? "true" : "false"
        );
        slide.setAttribute("aria-hidden", inView ? "false" : "true");
        slide.setAttribute("tabindex", i === activeIndex ? "0" : "-1");
      });

      // Update Controls
      controls.forEach((btn) => {
        const dir = btn.getAttribute("data-gsap-slider-control");
        const can =
          dir === "prev"
            ? activeIndex > 0
            : activeIndex < snapPoints.length - 1;

        btn.disabled = !can;
        btn.setAttribute("aria-disabled", can ? "false" : "true");
        btn.setAttribute(
          "data-gsap-slider-control-status",
          can ? "active" : "not-active"
        );
      });
    }

    controls.forEach((btn) => {
      const dir = btn.getAttribute("data-gsap-slider-control");
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const delta = dir === "next" ? 1 : -1;
        const target = activeIndex + delta;
        gsap.to(track, {
          duration: 0.4,
          x: snapPoints[target],
          onUpdate: () => updateStatus(gsap.getProperty(track, "x")),
        });
      });
    });

    // Initialize Draggable
    root._sliderDraggable = Draggable.create(track, {
      type: "x",
      // cursor: 'inherit',
      // activeCursor: 'inherit',
      inertia: true,
      bounds: { minX, maxX },
      throwResistance: 2000,
      dragResistance: 0.05,
      maxDuration: 0.6,
      minDuration: 0.2,
      edgeResistance: 0.75,
      snap: { x: snapPoints, duration: 0.4 },
      onPress() {
        track.setAttribute("data-gsap-slider-list-status", "grabbing");
        collectionRect = collection.getBoundingClientRect();
      },
      onDrag() {
        setX(this.x);
        updateStatus(this.x);
      },
      onThrowUpdate() {
        setX(this.x);
        updateStatus(this.x);
      },
      onThrowComplete() {
        setX(this.endX);
        updateStatus(this.endX);
        track.setAttribute("data-gsap-slider-list-status", "grab");
      },
      onRelease() {
        setX(this.x);
        updateStatus(this.x);
        track.setAttribute("data-gsap-slider-list-status", "grab");
      },
    })[0];

    // Initial state
    setX(0);
    updateStatus(0);
  });
}

// Debouncer: For resizing the window
function debounceOnWidthChange(fn, ms) {
  let last = innerWidth,
    timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        last = innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

window.addEventListener(
  "resize",
  debounceOnWidthChange(initBasicGSAPSlider, 200)
);

initBasicGSAPSlider();

/* HOMEPAGE */
if (page === "home") {
}

/* OUR PRODUCTS */
if (page === "products") {

  // Sorts .products-select-item elements by their data-sort attribute (ascending)
  function sortProductsByOrder() {
    /* Sort products by order */
    const wrapper = document.querySelector(".products-select");
    if (!wrapper) return;

    const items = Array.from(wrapper.querySelectorAll(".products-select-item"));

    items.sort((a, b) => {
      const aValue = parseFloat(a.getAttribute("data-sort")) || 0;
      const bValue = parseFloat(b.getAttribute("data-sort")) || 0;
      return aValue - bValue; // ascending
    });

    items.forEach(item => wrapper.appendChild(item));
  }
  sortProductsByOrder();


  /* Horizontal Scroll Section */
  const initHorizontal = () => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
      const horizontal = document.querySelector(".section_products");
      const horizontalContent = horizontal.querySelector(".products-list-wrap");

      if (horizontal && horizontalContent) {
        // main horizontal scroll timeline
        const tl = gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: horizontal,
              start: "top top",
              end: () =>
                "+=" + (horizontalContent.scrollWidth - window.innerWidth),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(horizontalContent, {
            x: () => -(horizontalContent.scrollWidth - window.innerWidth),
            ease: "none",
          });

        // --- PARALLAX ITEMS ---
        document.querySelectorAll("[data-parallax-step]").forEach((el) => {
          const distance = el.dataset.distance || -50; // move in % (positive or negative)
          const startPercent = el.dataset.start || 25; // optional: where it begins
          const endPercent = el.dataset.end || distance; // optional: custom end
          gsap.fromTo(
            el,
            { xPercent: startPercent },
            {
              xPercent: endPercent,
              ease: "none",
              scrollTrigger: {
                containerAnimation: tl, // ties to horizontal scroll
                trigger: el,
                start: "center 99%", // adjust as needed
                end: "center left",
                scrub: true,
              },
            }
          );
        });
      }
    });

    mm.add("(max-width: 991px)", () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    });
  };

  initHorizontal();



/* Filter Products */
function initFilterBasic() {
  const groups = document.querySelectorAll("[data-filter-group]");

  groups.forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter-target]");
    const items = group.querySelectorAll("[data-filter-name]");
    const transitionDelay = 600;

    const updateStatus = (element, shouldBeActive) => {
      element.setAttribute("data-filter-status", shouldBeActive ? "active" : "not-active");
      element.setAttribute("aria-hidden", !shouldBeActive);
    };

    const handleFilter = (target) => {
      const itemsToFilter = group.querySelectorAll(".products-select-item");

      itemsToFilter.forEach((item) => {
        const shouldBeActive = target === "all" || item.getAttribute("data-filter-target") === target;
        const currentStatus = item.getAttribute("data-filter-status");

        if (currentStatus === "active") {
          item.setAttribute("data-filter-status", "transition-out");
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      buttons.forEach((button) => {
        const isActive = button.getAttribute("data-filter-target") === target;
        button.setAttribute("data-filter-status", isActive ? "active" : "not-active");
        button.setAttribute("aria-pressed", isActive);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-filter-target");
        if (button.getAttribute("data-filter-status") === "active") return;
        handleFilter(target);
      });
    });
  });
}

function initProductSync() {
  const productSelectors = document.querySelectorAll(".products-select-item");
  const modal = document.querySelector('[data-modal-name="product-info"]');
  if (!modal || !productSelectors.length) return;

  productSelectors.forEach((selector) => {
    selector.addEventListener("click", function () {
      const productName = this.getAttribute("data-filter-target");
      if (!productName) return;

      modal.querySelectorAll(".w-dyn-item").forEach((item) => {
        item.setAttribute("data-filter-status", "not-active");
      });

      const targetModalItem = modal.querySelector(
        `.w-dyn-item[data-product-name="${productName}"]`
      );

      if (targetModalItem) {
        targetModalItem.setAttribute("data-filter-status", "active");
      }
    });
  });
}

function initModalBasic() {
  const modalGroup = document.querySelector("[data-modal-group-status]");
  const modals = document.querySelectorAll("[data-modal-name]");
  const modalTargets = document.querySelectorAll("[data-modal-target]");
  const productInfoModal = document.querySelector('[data-modal-name="product-info"]');

  function initModalTabs() {
    if (!productInfoModal) return;
    const modalTabs = productInfoModal.querySelectorAll(".modal-tabs-item");

    modalTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const targetType = this.getAttribute("data-info-target");
        if (!targetType) return;

        modalTabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        const visibleProduct = productInfoModal.querySelector(".w-dyn-item.product-visible");
        if (!visibleProduct) return;

        visibleProduct.querySelectorAll(".modal-cms").forEach((cms) => cms.classList.remove("active"));

        const targetCMS = visibleProduct.querySelector(
          `.modal-cms[data-info-type="${targetType}"]`
        );
        if (targetCMS) targetCMS.classList.add("active");
      });
    });
  }

  function updateProductInfoModal(clickedBtn) {
    if (!productInfoModal || !clickedBtn) return;

    const productWrapper = clickedBtn.closest(".products-item");
    const targetType = clickedBtn.getAttribute("data-info-target");
    if (!productWrapper || !targetType) return;

    const clickedCategoryId = productWrapper.getAttribute("data-category-id");
    if (!clickedCategoryId) return;

    productInfoModal.querySelectorAll(".w-dyn-item").forEach((item) =>
      item.classList.remove("product-visible")
    );
    productInfoModal.querySelectorAll(".modal-cms").forEach((info) =>
      info.classList.remove("active")
    );

    const targetProduct = productInfoModal.querySelector(
      `.w-dyn-item[data-category-id="${clickedCategoryId}"][data-filter-status="active"]`
    );

    if (targetProduct) {
      targetProduct.classList.add("product-visible");

      const targetInfoSection = targetProduct.querySelector(
        `.modal-cms[data-info-type="${targetType}"]`
      );
      if (targetInfoSection) targetInfoSection.classList.add("active");

      const modalTabs = productInfoModal.querySelectorAll(".modal-tabs-item");
      modalTabs.forEach((tab) => {
        const tabType = tab.getAttribute("data-info-target");
        tab.classList.toggle("active", tabType === targetType);
      });
    }
  }

  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener("click", function () {
      const modalTargetName = this.getAttribute("data-modal-target");

      modalTargets.forEach((target) =>
        target.setAttribute("data-modal-status", "not-active")
      );
      modals.forEach((modal) =>
        modal.setAttribute("data-modal-status", "not-active")
      );

      document
        .querySelector(`[data-modal-target="${modalTargetName}"]`)
        ?.setAttribute("data-modal-status", "active");
      document
        .querySelector(`[data-modal-name="${modalTargetName}"]`)
        ?.setAttribute("data-modal-status", "active");

      if (modalGroup) modalGroup.setAttribute("data-modal-group-status", "active");
      if (modalTargetName === "product-info") updateProductInfoModal(this);
    });
  });

  function closeAllModals() {
    modalTargets.forEach((target) =>
      target.setAttribute("data-modal-status", "not-active")
    );
    modals.forEach((modal) =>
      modal.setAttribute("data-modal-status", "not-active")
    );

    if (modalGroup) modalGroup.setAttribute("data-modal-group-status", "not-active");

    if (productInfoModal) {
      productInfoModal.querySelectorAll(".w-dyn-item").forEach((item) =>
        item.classList.remove("product-visible")
      );
      productInfoModal.querySelectorAll(".modal-cms").forEach((info) =>
        info.classList.remove("active")
      );
      productInfoModal.querySelectorAll(".modal-tabs-item").forEach((tab) =>
        tab.classList.remove("active")
      );
    }
  }

  document.querySelectorAll("[data-modal-close]").forEach((closeBtn) =>
    closeBtn.addEventListener("click", closeAllModals));

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAllModals();
  });

  initModalTabs();
}

initFilterBasic();
initProductSync();
initModalBasic();



}

/* MANUFACTURING */
if (page === "manufacturing") {
  if (window.matchMedia("(min-width: 991px)").matches) {
    function initTabsScroll() {
      const slides = document.querySelectorAll(".section_tabs .slide");

      slides.forEach((slide) => {
        const contentWrapper = slide.querySelector(".content-wrapper");
        const content = slide.querySelector(".content");

        gsap.to(content, {
          //rotationZ: (Math.random() - 0.5) * 10, // RotationZ between -5 and 5 degrees
          rotationZ: 0.5,
          scale: 0.7, // Slight reduction of the content
          rotationX: 40,
          startAt: { filter: "brightness(100%) contrast(100%)" },
          filter: "brightness(75%) contrast(135%)",
          ease: "power1.in", // Starts gradually
          scrollTrigger: {
            pin: contentWrapper, // contentWrapper is pinned during the animation
            trigger: slide, // Listens to the slide’s position
            start: "top 0%", // Starts when its top reaches the top of the viewport
            end: "+=" + window.innerHeight, // Ends 100vh later
            scrub: true, // Progresses with the scroll
          },
        });

        gsap.to(content, {
          autoAlpha: 0, // Ends at opacity: 0 and visibility: hidden
          ease: "power1.in", // Starts gradually
          scrollTrigger: {
            trigger: content, // Listens to the position of content
            start: "top -80%", // Starts when the top exceeds 80% of the viewport
            end: "+=" + 0.2 * window.innerHeight, // Ends 20% later
            scrub: true, // Progresses with the scroll
          },
        });
      });
    }

    initTabsScroll();
  }

  /* Capabilities Accordion */
  function initAccordionCSS() {
    document
      .querySelectorAll("[data-accordion-css-init]")
      .forEach((accordion) => {
        const closeSiblings =
          accordion.getAttribute("data-accordion-close-siblings") === "true";

        accordion.addEventListener("click", (event) => {
          const toggle = event.target.closest("[data-accordion-toggle]");
          if (!toggle) return; // Exit if the clicked element is not a toggle

          const singleAccordion = toggle.closest("[data-accordion-status]");
          if (!singleAccordion) return; // Exit if no accordion container is found

          const isActive =
            singleAccordion.getAttribute("data-accordion-status") === "active";
          singleAccordion.setAttribute(
            "data-accordion-status",
            isActive ? "not-active" : "active"
          );

          // When [data-accordion-close-siblings="true"]
          if (closeSiblings && !isActive) {
            accordion
              .querySelectorAll('[data-accordion-status="active"]')
              .forEach((sibling) => {
                if (sibling !== singleAccordion)
                  sibling.setAttribute("data-accordion-status", "not-active");
              });
          }
        });
      });
  }

  initAccordionCSS();

  /* Polaroid Scatter */
  function initPolaroidScatter() {
    const section = document.querySelector(".section_polaroid");
    const items = document.querySelectorAll(".polaroid-item");

    const sectionBounds = section.getBoundingClientRect();

    // Initial scattered state
    items.forEach((item, i) => {
      gsap.set(item, {
        x: gsap.utils.random(-40, 40), // small initial scatter
        y: gsap.utils.random(-40, 40),
        rotation: gsap.utils.random(-15, 15),
        scale: 1,
        zIndex: i,
      });
    });

    // Animate to full scatter on scroll
    const padding = 50;

    gsap.to(items, {
      x: () =>
        gsap.utils.random(
          -(sectionBounds.width / 2.3) + padding,
          sectionBounds.width / 2.3 - padding
        ),
      y: () =>
        gsap.utils.random(
          -sectionBounds.height / 2.6,
          sectionBounds.height / 2.6
        ),
      rotation: () => gsap.utils.random(-30, 30),
      duration: 1,
      ease: "expo.out",
      stagger: 0.03,
      scrollTrigger: {
        trigger: section,
        start: "15% center",
        end: "bottom center",
        scrub: false,
      },
    });
  }

  initPolaroidScatter();

  /* Draggable Polaroid */
  function initDraggableStickers() {
    const wrapper = document.querySelector('[data-sticker="wrap"]');
    const stickers = document.querySelectorAll('[data-sticker="item"]');
    if (!wrapper || !stickers.length) return;

    stickers.forEach((sticker) => {
      Draggable.create(sticker, {
        bounds: wrapper, // you could change this to the full window for example
        dragResistance: 0.1, // number between 0-1, the higher this is, the harder the sticker resists
        onPress() {
          // Scale and rotate the sticker slightly as soon as user 'grabs' it
          gsap.to(this.target, {
            scale: 1.2,
            rotation: gsap.utils.random(-30, 30),
            filter: "drop-shadow(0px 10px 8px rgba(0,0,0,0.3))",
            duration: 0.1,
          });
        },
        onRelease() {
          // Once user lets go, remove styling changes
          gsap.to(this.target, {
            scale: 1,
            rotation: 0,
            ease: "back.out(3)",
            filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
            duration: 0.2,
          });
        },
      });
    });
  }

  initDraggableStickers();

  /* Horizontal Scroll Section */
  if (window.matchMedia("(min-width: 991px)").matches) {
    const initHorizontal = () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 992px)", () => {
        const horizontal = document.querySelector(".section_hsteps");
        const horizontalContent = horizontal.querySelector(".hsteps-container");

        if (horizontal && horizontalContent) {
          // main horizontal scroll timeline
          const tl = gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: horizontal,
                start: "top top",
                end: () =>
                  "+=" + (horizontalContent.scrollWidth - window.innerWidth),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            })
            .to(horizontalContent, {
              x: () => -(horizontalContent.scrollWidth - window.innerWidth),
              ease: "none",
            });

          // --- PARALLAX ITEMS ---
          document.querySelectorAll("[data-parallax-step]").forEach((el) => {
            const distance = el.dataset.distance || -50; // move in % (positive or negative)
            const startPercent = el.dataset.start || 25; // optional: where it begins
            const endPercent = el.dataset.end || distance; // optional: custom end
            gsap.fromTo(
              el,
              { xPercent: startPercent },
              {
                xPercent: endPercent,
                ease: "none",
                scrollTrigger: {
                  containerAnimation: tl, // ties to horizontal scroll
                  trigger: el,
                  start: "left 99%", // adjust as needed
                  end: "left left",
                  scrub: true,
                },
              }
            );
          });
        }
      });

      mm.add("(max-width: 991px)", () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      });
    };

    initHorizontal();
  }
}

/* CONTACTS */
if (page === "contacts") {
  function initMomentumBasedHover() {
    // If this device can’t hover with a fine pointer, stop here
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    // Configuration (tweak these for feel)
    const xyMultiplier = 15; // multiplies pointer velocity for x/y movement
    const rotationMultiplier = 20; // multiplies normalized torque for rotation speed
    const inertiaResistance = 90; // higher = stops sooner

    // Pre-build clamp functions for performance
    const clampXY = gsap.utils.clamp(-1080, 1080);
    const clampRot = gsap.utils.clamp(-60, 60);

    // Initialize each root container
    document.querySelectorAll("[data-momentum-hover-init]").forEach((root) => {
      let prevX = 0,
        prevY = 0;
      let velX = 0,
        velY = 0;
      let rafId = null;

      // Track pointer velocity (throttled to RAF)
      root.addEventListener("mousemove", (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          velX = e.clientX - prevX;
          velY = e.clientY - prevY;
          prevX = e.clientX;
          prevY = e.clientY;
          rafId = null;
        });
      });

      // Attach hover inertia to each child element
      root.querySelectorAll("[data-momentum-hover-element]").forEach((el) => {
        el.addEventListener("mouseenter", (e) => {
          const target = el.querySelector("[data-momentum-hover-target]");
          if (!target) return;

          // Compute offset from center to pointer
          const { left, top, width, height } = target.getBoundingClientRect();
          const centerX = left + width / 2;
          const centerY = top + height / 2;
          const offsetX = e.clientX - centerX;
          const offsetY = e.clientY - centerY;

          // Compute raw torque (px²/frame)
          const rawTorque = offsetX * velY - offsetY * velX;

          // Normalize torque so rotation ∝ pointer speed (deg/sec)
          const leverDist = Math.hypot(offsetX, offsetY) || 1;
          const angularForce = rawTorque / leverDist;

          // Calculate and clamp velocities
          const velocityX = clampXY(velX * xyMultiplier);
          const velocityY = clampXY(velY * xyMultiplier);
          const rotationVelocity = clampRot(angularForce * rotationMultiplier);

          // Apply GSAP inertia tween
          gsap.to(target, {
            inertia: {
              x: { velocity: velocityX, end: 0 },
              y: { velocity: velocityY, end: 0 },
              rotation: { velocity: rotationVelocity, end: 0 },
              resistance: inertiaResistance,
            },
          });
        });
      });
    });
  }

  initMomentumBasedHover();
}

/* BLOG */
if (page === "blog") {

function initSwiperSlider() {  
  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group]");
  
  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if(!swiperSliderWrap) return;
    
    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    
    const swiper = new Swiper(swiperSliderWrap, {
      slidesPerView: 1,
      speed: 600,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        // when window width is >= 480px
        480: {
          slidesPerView: 1,
        },
        // when window width is >= 992px
        992: {
          slidesPerView: 1,
        }
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },    
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },      
    });    
    
  });
}

initSwiperSlider();

  function initFilterBasic() {
  // Find all filter groups on the page
  const groups = document.querySelectorAll('[data-filter-group]');

  groups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter-target]');
    const items = group.querySelectorAll('[data-filter-name]');
    const transitionDelay = 300; // Delay for transition effect (in milliseconds)

    // Function to update the status and accessibility attributes of items
    const updateStatus = (element, shouldBeActive) => {
      // If the item should be active, set it to "active", otherwise "not-active"
      element.setAttribute('data-filter-status', shouldBeActive ? 'active' : 'not-active');
      element.setAttribute('aria-hidden', shouldBeActive ? 'false' : 'true');
    };

    // Function to handle filtering logic when a button is clicked
    const handleFilter = (target) => {
      // Loop through all items and ensure every item transitions out first
      items.forEach((item) => {
        const shouldBeActive = target === 'all' || item.getAttribute('data-filter-name') === target;
        const currentStatus = item.getAttribute('data-filter-status');

        // Only transition items currently visible (status: active)
        if (currentStatus === 'active') {
          item.setAttribute('data-filter-status', 'transition-out');
          // After the transition delay, set the final status
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          // For items not currently visible, simply update their status after the delay
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      // Update the active status for all buttons
      buttons.forEach((button) => {
        const isActive = button.getAttribute('data-filter-target') === target;
        button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false'); // Accessibility: indicate active state
      });
    };

    // Attach click event listeners to each button
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-filter-target');

        // If the button is already active, do nothing
        if (button.getAttribute('data-filter-status') === 'active') return;

        // Trigger the filter logic with the selected target
        handleFilter(target);
      });
    });
  });
}

initFilterBasic();

}
