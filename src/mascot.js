/* ============================================
   FXbuddy Mascot Logic
   Reusable class — supports multiple instances
   ============================================ */

class Mascot {
    /**
     * @param {Object} config
     * @param {HTMLElement} config.container - Root element for this mascot
     * @param {string}  config.eyesSelector      - Selector for the eyes wrapper (default '.eyes')
     * @param {string}  config.eyeOvalSelector    - Selector for eye ovals (default '.eye-oval')
     * @param {string}  config.eyePathSelector    - Selector for eye paths (default '.eye-path')
     * @param {string}  config.zzzSelector        - Selector for sleeping Zzz's (default '.mascot-zzz')
     * @param {boolean} config.hasZzz             - Whether this mascot has Zzz elements (default true)
     * @param {boolean} config.hasPhysicsBody     - Apply squash/stretch/rotation to the inner body element (default true)
     * @param {string}  config.bodySelector       - Selector for the inner body element (default '.mascot-body')
     * @param {number}  config.maxMove            - Max eye travel in px (default 10)
     * @param {number}  config.springStiffness    - Spring constant (default 0.08)
     * @param {number}  config.damping            - Velocity damping (default 0.82)
     */
    constructor(config = {}) {
        // DOM Elements
        this.container = config.container;
        if (!this.container) return;

        const eyesSel = config.eyesSelector || '.eyes';
        const ovalSel = config.eyeOvalSelector || '.eye-oval';
        const pathSel = config.eyePathSelector || '.eye-path';

        this.eyesContainer = this.container.querySelector(eyesSel);
        this.eyeOvals = Array.from(this.container.querySelectorAll(ovalSel));
        this.eyePaths = Array.from(this.container.querySelectorAll(pathSel));

        this.hasZzz = config.hasZzz !== undefined ? config.hasZzz : true;
        this.zzz = this.hasZzz ? this.container.querySelector(config.zzzSelector || '.mascot-zzz') : null;

        this.hasPhysicsBody = config.hasPhysicsBody !== undefined ? config.hasPhysicsBody : true;

        // Inner body element — physics transforms are applied here (not the container),
        // so the scroll handler can control container positioning without conflicts.
        const bodySel = config.bodySelector || '.mascot-body';
        this.bodyElement = this.container.querySelector(bodySel) || null;

        // State
        this.status = 'idle';
        this.blinkState = false;

        // Physics State
        this.targetPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.scale = { x: 1, y: 1 };
        this.rotation = 0;

        // Constants
        this.SPRING_STIFFNESS = config.springStiffness || 0.08;
        this.DAMPING = config.damping || 0.82;
        this.MAX_MOVE = config.maxMove || 10;
        this.IDLE_LOOK_INTERVAL = 2500;

        // Timers
        this.lastMouseMoveTime = Date.now();
        this.idleInterval = null;
        this.blinkTimeout = null;

        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Click anywhere on the mascot → shake + happy eyes
        this.container.addEventListener('click', () => this.triggerClickReaction());

        this.startPhysicsLoop();
        this.startIdleLoop();
        this.scheduleBlink();
    }

    setStatus(newStatus) {
        if (this.status === newStatus) return;

        this.container.classList.remove(this.status);
        this.status = newStatus;
        this.container.classList.add(this.status);

        // Reset Zzzs
        if (this.zzz && this.status !== 'sleeping') {
            this.zzz.classList.add('hidden');
        }

        this.updateEyes(newStatus);

        switch (newStatus) {
            case 'idle':
            case 'typing':
            case 'anticipation':
            case 'surprised':
            case 'waiting':
                break;
            case 'success':
                this.triggerBounce();
                break;
            case 'error':
                this.targetPos = { x: 0, y: 0 };
                break;
        }
    }

    updateEyes(status) {
        const ovals = this.eyeOvals;
        const paths = this.eyePaths;

        // Always clear loading animation when leaving waiting state
        ovals.forEach(o => {
            o.classList.remove('eye-loading');
            o.style.animationDelay = '';
        });

        switch (status) {
            case 'idle':
                ovals.forEach(o => { o.style.opacity = '1'; o.style.transform = 'scale(1.15)'; });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;

            case 'typing':
                ovals.forEach(o => { o.style.opacity = '1'; o.style.transform = 'scaleY(0.65)'; });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;

            case 'anticipation':
            case 'surprised':
                ovals.forEach(o => { o.style.opacity = '1'; o.style.transform = 'scale(1.15)'; });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;

            case 'waiting':
                ovals.forEach((o, i) => {
                    o.style.opacity = '1';
                    o.style.transform = '';
                    o.style.animationDelay = i * 0.18 + 's';
                    o.classList.add('eye-loading');
                });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;

            case 'success':
                ovals.forEach(o => { o.style.opacity = '0'; });
                paths.forEach(p => {
                    p.setAttribute('d', 'M 3 12 Q 9 0 15 12');
                    p.style.opacity = '1';
                });
                break;

            case 'error':
                ovals.forEach(o => { o.style.opacity = '0'; });
                paths.forEach(p => {
                    p.setAttribute('d', 'M 4 4 L 14 20 M 14 4 L 4 20');
                    p.style.opacity = '1';
                });
                break;

            default:
                ovals.forEach(o => { o.style.opacity = '1'; o.style.transform = ''; });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;
        }
    }

    handleMouseMove(e) {
        this.lastMouseMoveTime = Date.now();

        const trackable = ['idle', 'typing', 'anticipation', 'surprised', 'waiting'];
        if (!trackable.includes(this.status)) return;

        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        const moveX = (dx / window.innerWidth) * this.MAX_MOVE * 3;
        const moveY = (dy / window.innerHeight) * this.MAX_MOVE * 3;

        const clampedX = Math.max(-this.MAX_MOVE, Math.min(this.MAX_MOVE, moveX));
        const clampedY = Math.max(-this.MAX_MOVE, Math.min(this.MAX_MOVE, moveY));

        this.targetPos = { x: clampedX, y: clampedY };
    }

    startPhysicsLoop() {
        const animate = () => {
            const dx = this.targetPos.x - this.currentPos.x;
            const dy = this.targetPos.y - this.currentPos.y;

            const ax = dx * this.SPRING_STIFFNESS;
            const ay = dy * this.SPRING_STIFFNESS;

            this.velocity.x += ax;
            this.velocity.y += ay;

            this.velocity.x *= this.DAMPING;
            this.velocity.y *= this.DAMPING;

            this.currentPos.x += this.velocity.x;
            this.currentPos.y += this.velocity.y;

            // Squash and Stretch
            const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            const stretch = Math.min(speed * 0.02, 0.1);
            this.scale = { x: 1 - stretch, y: 1 + stretch };

            // Rotation (subtle head tilt)
            this.rotation = this.currentPos.x * 0.5;

            // Apply body transform (squash/stretch/rotation) to the inner body element.
            // The outer container is left alone so the scroll handler can position it freely.
            if (this.hasPhysicsBody && this.bodyElement) {
                this.bodyElement.style.transform = `rotate(${this.rotation}deg) scale(${this.scale.x}, ${this.scale.y})`;
            }

            // Eyes follow cursor — unless in a static state
            const trackable = ['idle', 'typing', 'anticipation', 'surprised', 'waiting'];
            if (this.eyesContainer) {
                if (trackable.includes(this.status)) {
                    this.eyesContainer.style.transform = `translate(${this.currentPos.x}px, ${this.currentPos.y}px)`;
                } else {
                    this.eyesContainer.style.transform = 'translate(0px, 0px)';
                }
            }

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    startIdleLoop() {
        this.idleInterval = setInterval(() => {
            const timeSinceMove = Date.now() - this.lastMouseMoveTime;

            if (timeSinceMove > 1000 && this.status === 'idle') {
                const randomX = (Math.random() - 0.5) * this.MAX_MOVE * 1.8;
                const randomY = (Math.random() - 0.5) * this.MAX_MOVE * 1.8;
                this.targetPos = { x: randomX, y: randomY };
            }
        }, this.IDLE_LOOK_INTERVAL);
    }

    scheduleBlink() {
        const nextBlinkTime = Math.random() * 8000 + 6000; // 6-14s

        this.blinkTimeout = setTimeout(() => {
            if (this.status === 'idle') {
                this.blink();

                // Occasional double blink (5% chance)
                if (Math.random() > 0.95) {
                    setTimeout(() => this.blink(), 250);
                }
            }
            this.scheduleBlink();
        }, nextBlinkTime);
    }

    blink() {
        if (this.status !== 'idle') return;

        this.eyeOvals.forEach(o => { o.style.transform = 'scaleY(0.1)'; });

        setTimeout(() => {
            if (this.status === 'idle') {
                this.eyeOvals.forEach(o => { o.style.transform = ''; });
            }
        }, 150);
    }

    triggerBounce() {
        const target = this.bodyElement || this.container;
        target.classList.remove('mascot-bounce');
        void target.offsetWidth;
        target.classList.add('mascot-bounce');
        setTimeout(() => {
            target.classList.remove('mascot-bounce');
        }, 400);
    }

    /** Quick shake — a short, subtle tremor before something begins. */
    triggerShake() {
        this.container.classList.remove('shake');
        void this.container.offsetWidth;        // reflow to restart animation
        this.container.classList.add('shake');
        setTimeout(() => {
            this.container.classList.remove('shake');
        }, 350);
    }

    /**
     * Excited wiggle — playful side-to-side with a brief eye pop.
     * Eyes stay idle (open) the whole time; they just do a quick
     * widen → blink → back-to-normal sequence for personality.
     */
    triggerExcitedWiggle() {
        // Target the inner body element so CSS animation isn't overridden by
        // inline transforms on the container (e.g. scroll handler).
        const wiggleTarget = this.bodyElement || this.container;
        wiggleTarget.classList.remove('mascot-wiggle');
        void wiggleTarget.offsetWidth;
        wiggleTarget.classList.add('mascot-wiggle');
        setTimeout(() => {
            wiggleTarget.classList.remove('mascot-wiggle');
        }, 500);

        // Eye reaction: quick blink for personality
        this.eyeOvals.forEach(o => {
            o.style.transition = 'transform 0.08s ease-in';
            o.style.transform = 'scaleY(0.1)';
        });

        // Back to normal idle eyes
        setTimeout(() => {
            this.eyeOvals.forEach(o => {
                o.style.transition = 'transform 0.15s ease-out';
                o.style.transform = 'scale(1.15)';
            });
        }, 150);

        // Clean up inline transition so physics loop isn't fighting it
        setTimeout(() => {
            this.eyeOvals.forEach(o => { o.style.transition = ''; });
        }, 400);
    }

    /** Click reaction — shake + fun eye reaction, then back to current state. */
    triggerClickReaction() {
        // Don't interrupt active generation states
        if (this.status === 'waiting') return;

        // Shake the inner body element so we don't conflict with the physics
        // loop's transform or the scroll handler's transform on the container.
        const shakeTarget = (this.hasPhysicsBody && this.bodyElement)
            ? this.bodyElement
            : this.container;

        shakeTarget.classList.remove('shake');
        void shakeTarget.offsetWidth;
        shakeTarget.classList.add('shake');
        setTimeout(() => shakeTarget.classList.remove('shake'), 350);

        // Brief excited eyes → return to current state
        const currentStatus = this.status;

        // If already happy, flash wide-open surprised eyes as the reaction
        // If idle/other, flash happy arc eyes
        const flashTo = (currentStatus === 'success') ? 'surprised' : 'success';
        this.updateEyes(flashTo);

        setTimeout(() => {
            this.updateEyes(currentStatus);
        }, 800);
    }
}

export { Mascot };
