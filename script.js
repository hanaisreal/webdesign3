document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotationY = 0;
    let startRotationX = -16;
    let currentRotationY = 0;
    let currentRotationX = -16;


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