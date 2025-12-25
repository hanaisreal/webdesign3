document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotationY = 0;
    let startRotationX = -16;
    let currentRotationY = 0;
    let currentRotationX = -16;


    // Particle effect configurations for each image
    const particleEffects = [
        { type: 'bird', count: 15, class: 'bird-particle' },
        { type: 'sparkle', count: 20, class: 'sparkle-particle' },
        { type: 'heart', count: 12, class: 'heart-particle' },
        { type: 'star', count: 18, class: 'star-particle' },
        { type: 'bubble', count: 25, class: 'bubble-particle' },
        { type: 'leaf', count: 15, class: 'leaf-particle' },
        { type: 'snow', count: 30, class: 'snow-particle' },
        { type: 'fire', count: 20, class: 'fire-particle' },
        { type: 'butterfly', count: 10, class: 'butterfly-particle' }
    ];

    // Handle image click effects
    const items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();

            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            createParticleEffect(centerX, centerY, particleEffects[index]);
        });
    });

    function createParticleEffect(x, y, config) {
        const container = document.getElementById('particle-container');
        const particles = [];

        console.log('Creating particle effect:', config.type);
        console.log('GSAP loaded:', typeof gsap !== 'undefined');

        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${config.class}`;
            particle.style.left = (x - 10) + 'px';  // Center the particle
            particle.style.top = (y - 10) + 'px';   // Center the particle
            particle.style.zIndex = '1000';
            container.appendChild(particle);
            particles.push(particle);
        }

        console.log(`Created ${particles.length} particles`);

        // Different animations for different particle types
        particles.forEach((particle, i) => {
            const angle = (i / config.count) * Math.PI * 2;
            const radius = gsap.utils.random(50, 150);

            let animation = {};

            switch (config.type) {
                case 'bird':
                    // Birds fly up in a spiral pattern
                    animation = {
                        x: Math.cos(angle + i * 0.2) * radius,
                        y: -gsap.utils.random(200, 400),
                        rotation: gsap.utils.random(-45, 45),
                        scale: 0,
                        duration: gsap.utils.random(1.5, 2.5),
                        ease: "power2.out"
                    };
                    break;

                case 'sparkle':
                    // Sparkles explode outward and fade
                    animation = {
                        x: Math.cos(angle) * radius * 2,
                        y: Math.sin(angle) * radius * 2,
                        scale: 0,
                        rotation: 360,
                        duration: 1.5,
                        ease: "power3.out"
                    };
                    break;

                case 'heart':
                    // Hearts float up with a wobble
                    animation = {
                        x: Math.sin(i * 0.5) * 50,
                        y: -gsap.utils.random(150, 300),
                        rotation: gsap.utils.random(-30, 30),
                        scale: 0,
                        duration: 2,
                        ease: "power1.out"
                    };
                    break;

                case 'star':
                    // Stars burst and rotate
                    animation = {
                        x: Math.cos(angle) * radius * 1.5,
                        y: Math.sin(angle) * radius * 1.5,
                        rotation: 720,
                        scale: 0,
                        duration: 1.8,
                        ease: "back.out(1.7)"
                    };
                    break;

                case 'bubble':
                    // Bubbles float up with physics
                    animation = {
                        x: gsap.utils.random(-50, 50),
                        y: -gsap.utils.random(200, 350),
                        scale: gsap.utils.random(0.5, 1.5),
                        duration: gsap.utils.random(2, 3),
                        ease: "sine.out"
                    };
                    break;

                case 'leaf':
                    // Leaves fall and sway
                    animation = {
                        x: Math.sin(i * 0.3) * 100,
                        y: gsap.utils.random(150, 300),
                        rotation: gsap.utils.random(-180, 180),
                        scale: 0,
                        duration: gsap.utils.random(2, 3),
                        ease: "sine.inOut"
                    };
                    break;

                case 'snow':
                    // Snowflakes drift down
                    animation = {
                        x: gsap.utils.random(-100, 100),
                        y: gsap.utils.random(150, 250),
                        rotation: gsap.utils.random(-180, 180),
                        scale: 0,
                        duration: gsap.utils.random(2.5, 3.5),
                        ease: "power1.inOut"
                    };
                    break;

                case 'fire':
                    // Fire particles rise with flicker
                    animation = {
                        x: gsap.utils.random(-30, 30),
                        y: -gsap.utils.random(100, 250),
                        scale: 0,
                        duration: gsap.utils.random(1, 1.5),
                        ease: "power2.out"
                    };
                    break;

                case 'butterfly':
                    // Butterflies flutter away
                    animation = {
                        x: Math.cos(angle + Math.sin(i)) * radius * 2,
                        y: Math.sin(angle + Math.cos(i)) * radius,
                        rotation: gsap.utils.random(-90, 90),
                        scale: 0,
                        duration: gsap.utils.random(2, 2.5),
                        ease: "sine.inOut"
                    };
                    break;
            }

            // Animate from center
            gsap.set(particle, { scale: 0.5, opacity: 1 });

            gsap.to(particle, {
                ...animation,
                opacity: 0,
                onComplete: () => {
                    console.log('Animation complete for particle');
                    particle.remove();
                }
            });
        });
    }


    function getCurrentRotations() {
        const transform = window.getComputedStyle(slider).transform;
        if (transform === 'none') {
            return { rotX: -16, rotY: 0 };
        }

        const matrix = new DOMMatrix(transform);

        const rotY = Math.atan2(-matrix.m13, matrix.m33) * (180 / Math.PI);
        const rotX = Math.asin(matrix.m23) * (180 / Math.PI);

        return { rotX: rotX || -16, rotY: rotY || 0 };
    }

    function handleStart(e) {
        // Only start dragging if clicking on empty space, not on images
        if (e.target.closest('.item')) {
            return;
        }

        isDragging = true;
        slider.style.animationPlayState = 'paused';
        slider.classList.add('dragging');
        document.body.style.cursor = 'grabbing';

        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        const currentRotations = getCurrentRotations();
        currentRotationX = currentRotations.rotX;
        currentRotationY = currentRotations.rotY;
        startRotationX = currentRotationX;
        startRotationY = currentRotationY;

        e.preventDefault();
    }

    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        const rotationSpeed = 0.5;
        const newRotationY = startRotationY - (deltaX * rotationSpeed);
        const newRotationX = Math.max(-90, Math.min(90, startRotationX + (deltaY * rotationSpeed * 0.3)));

        slider.style.transform = `perspective(1000px) rotateX(${newRotationX}deg) rotateY(${newRotationY}deg)`;
        currentRotationY = newRotationY;
        currentRotationX = newRotationX;

        e.preventDefault();
    }

    function handleEnd() {
        if (!isDragging) return;

        isDragging = false;
        slider.classList.remove('dragging');
        document.body.style.cursor = '';

        slider.style.animation = 'none';

        const normalizedRotationY = currentRotationY % 360;
        slider.style.transform = `perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${normalizedRotationY}deg)`;

        void slider.offsetHeight;

        slider.style.animation = `continueRotation 20s linear infinite`;
        slider.style.animationDelay = '0s';

        const keyframes = `
            @keyframes continueRotation {
                from {
                    transform: perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${normalizedRotationY}deg);
                }
                to {
                    transform: perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${normalizedRotationY + 360}deg);
                }
            }
        `;

        let styleSheet = document.getElementById('dynamic-rotation');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'dynamic-rotation';
            document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = keyframes;
    }

    // Listen on the entire banner for drag events, not just the slider
    const banner = document.querySelector('.banner');

    banner.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    banner.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    document.addEventListener('mouseleave', handleEnd);
});