
/* CONFIG */
const page = document.body.dataset.page;

gsap.registerPlugin(ScrollTrigger);

/* GENERAL CODE */

/* Check section for navbar color change */
function initCheckSectionThemeScroll() {

  // Get detection offset, in this case the navbar
  const navBarHeight = document.querySelector("[data-nav-bar-height]")
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;

  function checkThemeSection() {
    const themeSections = document.querySelectorAll("[data-theme-section]");

    themeSections.forEach(function(themeSection) {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      // If the offset is between the top & bottom of the current section
      if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
        // Check [data-theme-section]
        const themeSectionActive = themeSection.getAttribute("data-theme-section");
        document.querySelectorAll("[data-theme-nav]").forEach(function(elem) {
          if (elem.getAttribute("data-theme-nav") !== themeSectionActive) {
            elem.setAttribute("data-theme-nav", themeSectionActive);
          }
        });

        // Check [data-bg-section]
        const bgSectionActive = themeSection.getAttribute("data-bg-section");
        document.querySelectorAll("[data-bg-nav]").forEach(function(elem) {
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

/* HOMEPAGE */
if (page === "home") {

}

/* OUR PRODUCTS */
if (page === "products") {

}

/* MANUFACTURING */
if (page === "manufacturing") {

    const slides = document.querySelectorAll('.section_tabs .slide')

    slides.forEach(slide => {
        const contentWrapper = slide.querySelector('.content-wrapper')
        const content = slide.querySelector('.content')

        gsap.to(content, {
            //rotationZ: (Math.random() - 0.5) * 10, // RotationZ between -5 and 5 degrees
            rotationZ: 0.5, 
            scale: 0.7, // Slight reduction of the content
            rotationX: 40,
            startAt: { filter: 'brightness(100%) contrast(100%)' },
            filter:  'brightness(75%) contrast(135%)',
            ease: 'power1.in', // Starts gradually
            scrollTrigger: {
                pin: contentWrapper, // contentWrapper is pinned during the animation
                trigger: slide, // Listens to the slide’s position
                start: 'top 0%', // Starts when its top reaches the top of the viewport
                end: '+=' + window.innerHeight, // Ends 100vh later
                scrub: true // Progresses with the scroll
            }
        })

        gsap.to(content, {
            autoAlpha: 0, // Ends at opacity: 0 and visibility: hidden
            ease: 'power1.in', // Starts gradually
            scrollTrigger: {
                trigger: content, // Listens to the position of content
                start: 'top -80%', // Starts when the top exceeds 80% of the viewport
                end: '+=' + 0.2 * window.innerHeight, // Ends 20% later
                scrub: true // Progresses with the scroll
            }
        })
    })

/* Capabilities Accordion */
    function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      
      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}

  initAccordionCSS();

}

/* CONTACTS */
if (page === "contacts") {

}