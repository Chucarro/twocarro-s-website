document.addEventListener('DOMContentLoaded', () => {
    // Hero Section Background Video Speed
    const heroVideo = document.querySelector('.hero-video-background');
    if (heroVideo) heroVideo.playbackRate = 0.40;

    // Marquee Content Setup
    const root = document.documentElement;
    const marqueeElementsDisplayed = parseInt(getComputedStyle(root).getPropertyValue("--marquee-elements-displayed"), 10);
    const marqueeContent = document.querySelector("ul.marquee-content");

    if (marqueeContent) {
        root.style.setProperty("--marquee-elements", marqueeContent.children.length);

        for (let i = 0; i < marqueeElementsDisplayed; i++) {
            marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
        }
    }

    // Scroll-based Header Swap and Scroll Spy
    const headerElements = {
        container: document.getElementById('header'),
        logo: document.getElementById('header-logo'),
        list: document.getElementById('header-list'),
        flags: document.getElementById('flags'),
        mobileFlags: document.getElementById('mobile-flags')
    };

    const updateHeaderStyles = () => {
        const mediaQuery = window.matchMedia("(min-width: 992px)").matches;
        const isScrolled = window.scrollY > 100;

        if (mediaQuery) {
            if (isScrolled) {
                headerElements.container.style.fontSize = ".8rem";
                headerElements.container.style.backgroundColor = "#000";
                headerElements.container.style.paddingBottom = ".8rem";
                headerElements.container.style.paddingTop = ".8rem";
                headerElements.list.style.marginRight = "10rem";
                headerElements.logo.style.marginLeft = "5rem";
                if (headerElements.flags) headerElements.flags.style.width = "40px";
                if (headerElements.mobileFlags) headerElements.mobileFlags.style.width = "40px";
            } else {
                headerElements.container.style.fontSize = "1rem";
                headerElements.container.style.backgroundColor = "transparent";
                headerElements.container.style.paddingBottom = "1.8rem";
                headerElements.container.style.paddingTop = "1.5rem";
                headerElements.list.style.marginRight = "6rem";
                headerElements.logo.style.marginLeft = "1.8rem";
                if (headerElements.flags) headerElements.flags.style.width = "75px";
                if (headerElements.mobileFlags) headerElements.mobileFlags.style.width = "75px";
            }
        } else {
            // Reset styles if the screen width is less than 992px
            headerElements.container.style.fontSize = "1rem";
            headerElements.container.style.backgroundColor = "transparent";
            headerElements.container.style.paddingBottom = "1.8rem";
            headerElements.container.style.paddingTop = "1.5rem";
            headerElements.list.style.marginRight = "6rem";
            headerElements.logo.style.marginLeft = "1.8rem";
            if (headerElements.flags) headerElements.flags.style.width = "75px";
            if (headerElements.mobileFlags) headerElements.mobileFlags.style.width = "75px";
        }
    };

    const scrollFunction = () => {
        updateHeaderStyles();

        // Scroll Spy logic
        const sections = document.querySelectorAll('section:not(#home)');
        const links = document.querySelectorAll('.nav-list .nav-links');

        let currentSectionId = '';
        sections.forEach(section => {
            const top = window.scrollY;
            const offset = section.offsetTop - 60;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (top >= offset && top < offset + height) currentSectionId = id;
        });

        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === currentSectionId);
        });
    };

    window.addEventListener('scroll', scrollFunction);

    // Language Toggle
    const flagsElements = [document.getElementById('flags'), document.getElementById('mobile-flags')];
    const textsToChange = document.querySelectorAll('[data-section]');

    const changeLanguage = async (language) => {
        try {
            const response = await fetch(`./js/langs/${language}.json`);
            const texts = await response.json();

            textsToChange.forEach(textToChange => {
                const section = textToChange.dataset.section;
                const value = textToChange.dataset.value;

                if (texts[section] && texts[section][value]) {
                    textToChange.innerHTML = texts[section][value];
                }
            });
        } catch (error) {
            console.error('Error fetching language data:', error);
        }
    };

    const updateFlagStyles = (activeFlag) => {
        flagsElements.forEach(flagsElement => {
            if (flagsElement) {
                const allFlags = flagsElement.querySelectorAll('img');
                allFlags.forEach(flag => {
                    flag.classList.toggle('active', flag === activeFlag);
                    flag.classList.toggle('inactive', flag !== activeFlag);
                });
            }
        });
    };

    flagsElements.forEach(flagsElement => {
        if (flagsElement) {
            flagsElement.addEventListener('click', (e) => {
                const clickedFlag = e.target;
                if (clickedFlag.tagName === 'IMG') {
                    const language = clickedFlag.parentElement.dataset.language;
                    if (language) {
                        changeLanguage(language);
                        updateFlagStyles(clickedFlag);
                    }
                }
            });
        }
    });

    // Mobile Menu Handling
    const mobileMenuButton = document.querySelector('.icon-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#mobile-menu .link-button');
    const body = document.body;

    const toggleMobileMenu = () => {
        if (mobileMenu) {
            const isActive = mobileMenu.classList.toggle('show');
            mobileMenuButton.classList.toggle('is-active', isActive);
            body.classList.toggle('no-scroll', isActive);
        }
    };

    if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // Close Mobile Menu on Nav Link Click
    if (navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu) {
                    mobileMenu.classList.remove('show');
                    mobileMenuButton.classList.remove('is-active');
                    body.classList.remove('no-scroll');
                }
            });
        });
    }

    // Close Mobile Menu on Larger Screens
    const mediaQuery = window.matchMedia("(min-width: 992px)");

    const handleResize = () => {
        if (mobileMenu && mediaQuery.matches) {
            mobileMenu.classList.remove('show');
            mobileMenuButton.classList.remove('is-active');
            body.classList.remove('no-scroll');
        }
        updateHeaderStyles(); // Ensure header styles are updated on resize
    };

    mediaQuery.addEventListener('change', handleResize);
    handleResize(); // Initial check
});
