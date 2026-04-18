/* FXbuddy Mascot Logic — Reusable class */
class Mascot {
    constructor(config = {}) {
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
        const bodySel = config.bodySelector || '.mascot-body';
        this.bodyElement = this.container.querySelector(bodySel) || null;
        this.status = 'idle';
        this.blinkState = false;
        this.targetPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.scale = { x: 1, y: 1 };
        this.rotation = 0;
        this.SPRING_STIFFNESS = config.springStiffness || 0.08;
        this.DAMPING = config.damping || 0.82;
        this.MAX_MOVE = config.maxMove || 10;
        this.IDLE_LOOK_INTERVAL = 2500;
        this.lastMouseMoveTime = Date.now();
        this.idleInterval = null;
        this.blinkTimeout = null;
        this.init();
    }
    init() {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
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
        if (this.zzz && this.status !== 'sleeping') this.zzz.classList.add('hidden');
        this.updateEyes(newStatus);
        if (newStatus === 'success') this.triggerBounce();
        if (newStatus === 'error') this.targetPos = { x: 0, y: 0 };
    }
    updateEyes(status) {
        const ovals = this.eyeOvals;
        const paths = this.eyePaths;
        ovals.forEach(o => { o.classList.remove('eye-loading'); o.style.animationDelay = ''; });
        switch (status) {
            case 'idle':
                ovals.forEach(o => { o.style.opacity = '1'; o.style.transform = 'scale(1.15)'; });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;
            case 'typing':
                ovals.forEach(o => { o.style.opacity = '1'; o.style.transform = 'scaleY(0.65)'; });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;
            case 'anticipation': case 'surprised':
                ovals.forEach(o => { o.style.opacity = '1'; o.style.transform = 'scale(1.15)'; });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;
            case 'waiting':
                ovals.forEach((o, i) => { o.style.opacity = '1'; o.style.transform = ''; o.style.animationDelay = i * 0.18 + 's'; o.classList.add('eye-loading'); });
                paths.forEach(p => { p.style.opacity = '0'; });
                break;
            case 'success':
                ovals.forEach(o => { o.style.opacity = '0'; });
                paths.forEach(p => { p.setAttribute('d', 'M 3 12 Q 9 0 15 12'); p.style.opacity = '1'; });
                break;
            case 'error':
                ovals.forEach(o => { o.style.opacity = '0'; });
                paths.forEach(p => { p.setAttribute('d', 'M 4 4 L 14 20 M 14 4 L 4 20'); p.style.opacity = '1'; });
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
        this.targetPos = {
            x: Math.max(-this.MAX_MOVE, Math.min(this.MAX_MOVE, moveX)),
            y: Math.max(-this.MAX_MOVE, Math.min(this.MAX_MOVE, moveY))
        };
    }
    startPhysicsLoop() {
        const animate = () => {
            const dx = this.targetPos.x - this.currentPos.x;
            const dy = this.targetPos.y - this.currentPos.y;
            this.velocity.x = (this.velocity.x + dx * this.SPRING_STIFFNESS) * this.DAMPING;
            this.velocity.y = (this.velocity.y + dy * this.SPRING_STIFFNESS) * this.DAMPING;
            this.currentPos.x += this.velocity.x;
            this.currentPos.y += this.velocity.y;
            const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            const stretch = Math.min(speed * 0.02, 0.1);
            this.scale = { x: 1 - stretch, y: 1 + stretch };
            this.rotation = this.currentPos.x * 0.5;
            if (this.hasPhysicsBody && this.bodyElement) {
                this.bodyElement.style.transform = `rotate(${this.rotation}deg) scale(${this.scale.x}, ${this.scale.y})`;
            }
            const trackable = ['idle', 'typing', 'anticipation', 'surprised', 'waiting'];
            if (this.eyesContainer) {
                this.eyesContainer.style.transform = trackable.includes(this.status)
                    ? `translate(${this.currentPos.x}px, ${this.currentPos.y}px)` : 'translate(0px, 0px)';
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
    startIdleLoop() {
        this.idleInterval = setInterval(() => {
            if (Date.now() - this.lastMouseMoveTime > 1000 && this.status === 'idle') {
                this.targetPos = {
                    x: (Math.random() - 0.5) * this.MAX_MOVE * 1.8,
                    y: (Math.random() - 0.5) * this.MAX_MOVE * 1.8
                };
            }
        }, this.IDLE_LOOK_INTERVAL);
    }
    scheduleBlink() {
        this.blinkTimeout = setTimeout(() => {
            if (this.status === 'idle') {
                this.blink();
                if (Math.random() > 0.95) setTimeout(() => this.blink(), 250);
            }
            this.scheduleBlink();
        }, Math.random() * 8000 + 6000);
    }
    blink() {
        if (this.status !== 'idle') return;
        this.eyeOvals.forEach(o => { o.style.transform = 'scaleY(0.1)'; });
        setTimeout(() => {
            if (this.status === 'idle') this.eyeOvals.forEach(o => { o.style.transform = ''; });
        }, 150);
    }
    triggerBounce() {
        const target = this.bodyElement || this.container;
        target.classList.remove('mascot-bounce');
        void target.offsetWidth;
        target.classList.add('mascot-bounce');
        setTimeout(() => target.classList.remove('mascot-bounce'), 400);
    }
    triggerShake() {
        this.container.classList.remove('shake');
        void this.container.offsetWidth;
        this.container.classList.add('shake');
        setTimeout(() => this.container.classList.remove('shake'), 350);
    }
    triggerClickReaction() {
        if (this.status === 'waiting') return;
        const shakeTarget = (this.hasPhysicsBody && this.bodyElement) ? this.bodyElement : this.container;
        shakeTarget.classList.remove('shake');
        void shakeTarget.offsetWidth;
        shakeTarget.classList.add('shake');
        setTimeout(() => shakeTarget.classList.remove('shake'), 350);
        const currentStatus = this.status;
        const flashTo = (currentStatus === 'success') ? 'surprised' : 'success';
        this.updateEyes(flashTo);
        setTimeout(() => this.updateEyes(currentStatus), 800);
    }
}
