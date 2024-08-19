let highestZ = 1;
let isAudioPlayed = false;
const audio = document.getElementById('audio');

class Paper {
    holdingPaper = false;
    startX = 0;
    startY = 0;
    moveX = 0;
    moveY = 0;
    prevX = 0;
    prevY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;

    init(paper) {
        const moveHandler = (e) => {
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            if (!this.rotating) {
                this.moveX = clientX;
                this.moveY = clientY;

                this.velX = this.moveX - this.prevX;
                this.velY = this.moveY - this.prevY;
            }

            const dirX = clientX - this.startX;
            const dirY = clientY - this.startY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;

            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;

            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevX = this.moveX;
                this.prevY = this.moveY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        };

        const startHandler = (e) => {
            if (this.holdingPaper) return;
            this.holdingPaper = true;

            paper.style.zIndex = highestZ;
            highestZ += 1;

            this.startX = e.clientX || (e.touches && e.touches[0].clientX);
            this.startY = e.clientY || (e.touches && e.touches[0].clientY);
            this.prevX = this.startX;
            this.prevY = this.startY;

            if (e.button === 2 || (e.touches && e.touches.length > 1)) {
                this.rotating = true;
            }

            // Play audio on the first drag
            if (!isAudioPlayed) {
                audio.play().catch(error => {
                    console.error('Audio play failed:', error);
                });
                isAudioPlayed = true;
            }
        };

        const endHandler = () => {
            this.holdingPaper = false;
            this.rotating = false;
        };

        paper.addEventListener('mousemove', moveHandler);
        paper.addEventListener('touchmove', moveHandler);
        paper.addEventListener('mousedown', startHandler);
        paper.addEventListener('touchstart', startHandler);
        window.addEventListener('mouseup', endHandler);
        paper.addEventListener('touchend', endHandler);

        // Optional: For two-finger rotation on touch screens
        paper.addEventListener('gesturestart', (e) => {
            e.preventDefault();
            this.rotating = true;
        });
        paper.addEventListener('gestureend', () => {
            this.rotating = false;
        });
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
