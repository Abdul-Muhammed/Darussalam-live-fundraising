// ===================================
// DISPLAY PAGE - Live Fundraising Display
// ===================================

class FundraisingDisplay {
    constructor() {
        this.currentAmount = 0;
        this.targetAmount = 0; // Track the actual target (non-animated) amount
        this.goalAmount = 100000;
        this.animationDuration = 1000;
        this.countingInterval = null;
        
        this.elements = {
            amount: document.getElementById('displayAmount'),
            goal: document.getElementById('displayGoal'),
            percentage: document.getElementById('progressPercentage'),
            progressBar: document.getElementById('progressBar'),
            card: document.querySelector('.fundraising-card'),
            celebrationOverlay: document.getElementById('celebrationOverlay'),
            celebrationAmount: document.getElementById('celebrationAmount')
        };
        
        this.init();
    }
    
    init() {
        // Load initial data from localStorage
        this.loadData();
        
        // Listen for storage changes (from control panel)
        window.addEventListener('storage', (e) => {
            if (e.key === 'fundraising_data') {
                this.handleDataUpdate(e.newValue);
            }
        });
        
        // Also listen for custom events (same-tab updates)
        window.addEventListener('fundraising_update', (e) => {
            this.handleDataUpdate(JSON.stringify(e.detail));
        });
        
        // Initial render
        this.updateDisplay(false);
    }
    
    loadData() {
        const data = localStorage.getItem('fundraising_data');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.currentAmount = parsed.totalRaised || 0;
                this.targetAmount = parsed.totalRaised || 0;
                this.goalAmount = parsed.goal || 100000;
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
    }
    
    handleDataUpdate(newDataString) {
        if (!newDataString) return;
        
        try {
            const newData = JSON.parse(newDataString);
            const oldAmount = this.targetAmount; // Use target amount, not animated amount
            const newAmount = newData.totalRaised || 0;
            const donationAmount = newAmount - oldAmount;
            
            this.goalAmount = newData.goal || this.goalAmount;
            
            // If there's a new donation, trigger celebration
            if (donationAmount > 0) {
                this.targetAmount = newAmount; // Update target immediately
                this.animateToAmount(newAmount, donationAmount);
                this.triggerCelebration(donationAmount);
            } else {
                this.currentAmount = newAmount;
                this.targetAmount = newAmount;
                this.updateDisplay(false);
            }
        } catch (e) {
            console.error('Error handling data update:', e);
        }
    }
    
    animateToAmount(targetAmount, donationAmount) {
        const startAmount = this.currentAmount;
        const difference = targetAmount - startAmount;
        const startTime = Date.now();
        const duration = Math.min(this.animationDuration, 2000);
        
        // Add counting class
        this.elements.amount.classList.add('counting');
        this.elements.card.classList.add('celebration');
        this.elements.progressBar.classList.add('animating');
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            this.currentAmount = startAmount + (difference * easeProgress);
            this.updateDisplay(true);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentAmount = targetAmount;
                this.updateDisplay(true);
                
                // Remove animation classes
                setTimeout(() => {
                    this.elements.amount.classList.remove('counting');
                    this.elements.card.classList.remove('celebration');
                    this.elements.progressBar.classList.remove('animating');
                }, 300);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    updateDisplay(animating = false) {
        // Update amount with number formatting
        this.elements.amount.textContent = this.formatNumber(Math.floor(this.currentAmount));
        
        // Update goal
        this.elements.goal.textContent = this.formatNumber(this.goalAmount);
        
        // Calculate and update percentage
        const percentage = (this.currentAmount / this.goalAmount) * 100;
        const cappedPercentage = Math.min(percentage, 100);
        this.elements.percentage.textContent = percentage.toFixed(1) + '%';
        
        // Update progress bar
        this.elements.progressBar.style.width = cappedPercentage + '%';
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    triggerCelebration(amount) {
        // Show celebration overlay with rounded amount
        const cleanAmount = Math.round(amount);
        this.elements.celebrationAmount.textContent = '+$' + this.formatNumber(cleanAmount);
        this.elements.celebrationOverlay.classList.add('active');
        
        // Launch confetti
        this.launchConfetti();
        
        // Hide celebration after animation
        setTimeout(() => {
            this.elements.celebrationOverlay.classList.remove('active');
        }, 2000);
    }
    
    launchConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confettiCount = 150;
        const confetti = [];
        
        // Darussalam-themed colors (teal, green, coral, white)
        const colors = [
            '#4aa9a9', '#5fbfbf', '#80dbdb', // Teal shades
            '#00a859', '#00c76a', '#33d68b', // Green shades
            '#ff7043', '#ff8a65', '#ffa38a', // Coral shades
            '#ffffff', '#f3f4f6' // White shades
        ];
        
        // Create confetti particles
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: Math.random() * 3 + 2
                },
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.5 ? 'circle' : 'square',
                opacity: 1
            });
        }
        
        let animationId;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let activeConfetti = 0;
            
            confetti.forEach((particle) => {
                if (particle.opacity <= 0) return;
                
                activeConfetti++;
                
                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation * Math.PI / 180);
                
                ctx.fillStyle = particle.color;
                
                if (particle.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                }
                
                ctx.restore();
                
                // Update position
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.rotation += particle.rotationSpeed;
                
                // Gravity
                particle.velocity.y += 0.1;
                
                // Fade out near the bottom
                if (particle.y > canvas.height * 0.8) {
                    particle.opacity -= 0.02;
                }
            });
            
            if (activeConfetti > 0) {
                animationId = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        
        animate();
    }
}

// Initialize display when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FundraisingDisplay();
});

// Handle window resize for confetti canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

