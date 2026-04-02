document.addEventListener('DOMContentLoaded', function() {

    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }
    }

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    const customPlayBtn = document.getElementById('custom-play-btn');

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            videoId: '_zGmPl2HQWE',
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'disablekb': 1,
                'iv_load_policy': 3
            },
            events: {
                'onStateChange': (event) => {
                    const state = event.data;
                    if (state === YT.PlayerState.PLAYING) {
                        customPlayBtn.classList.add('playing');
                    } else {
                        customPlayBtn.classList.remove('playing');
                    }
                }
            }
        });
    };

    if (customPlayBtn) {
        customPlayBtn.addEventListener('click', () => {
            if (player && typeof player.getPlayerState === 'function') {
                const state = player.getPlayerState();
                if (state !== YT.PlayerState.PLAYING) {
                    player.playVideo();
                } else {
                    player.pauseVideo();
                }
            }
        });
    }

    const pricingToggle = document.getElementById('pricing-toggle');
    const priceVals = document.querySelectorAll('.price-val');
    const perUnits = document.querySelectorAll('.per-unit');

    if (pricingToggle) {
        const buttons = pricingToggle.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const type = btn.getAttribute('data-type');
                priceVals.forEach(price => {
                    const value = price.getAttribute(`data-${type}`);
                    price.textContent = value;
                    
                    gsap.from(price, {
                        duration: 0.4,
                        opacity: 0,
                        y: 10,
                        ease: "power2.out"
                    });
                });

                perUnits.forEach(unit => {
                    unit.textContent = type === 'monthly' ? '/month' : '/year';
                });
            });
        });
    }

    
    // 1. Hero Reveal (Page Load)
    const heroTimeline = gsap.timeline();
    heroTimeline.from('.top-pill, .hero-title, .hero-subtext, .hero-cta, .hero-image-box', {
        duration: 1.2,
        y: 60,
        opacity: 0,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2,
        onComplete: () => {
            // 3. Continuous Floating Animation for Hero Dashboard
            gsap.to('.hero-image-box', {
                y: -15,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
    });

    // 2. Section Headings Reveal (ScrollTrigger)
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const elementsToReveal = section.querySelectorAll('h2, .section-desc, .section-title-center');
        
        if (elementsToReveal.length > 0) {
            gsap.from(elementsToReveal, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                duration: 1,
                y: 40,
                opacity: 0,
                stagger: 0.15,
                ease: "power3.out"
            });
        }
    });

    // 3. Why Choose Cards Reveal (Staggered)
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-section',
            start: "top 70%",
            toggleActions: "play none none none"
        },
        duration: 1,
        y: 40,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all" // Clear GSAP props after animation to prevent layout issues
    });

    // 4. Pricing Cards Reveal (Staggered)
    gsap.from('.pricing-card', {
        scrollTrigger: {
            trigger: '.pricing-section',
            start: "top 70%",
            toggleActions: "play none none none"
        },
        duration: 1,
        y: 40,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out",
        clearProps: "all"
    });

    // GSAP Service Stacking Animation
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const cards = gsap.utils.toArray('.service-card');
        
        cards.forEach((card, i) => {
            if (i < cards.length - 1) { // Apply to all but the last card
                gsap.to(card, {
                    scale: 0.92, // Subtle scale down
                    scrollTrigger: {
                        trigger: cards[i + 1], // Trigger when next card starts overlapping
                        start: "top 70%", // When next card is near
                        end: "top 120px", // Ending pinpoint
                        scrub: true,
                        // markers: true,
                    }
                });
            }
        });
    }
});
