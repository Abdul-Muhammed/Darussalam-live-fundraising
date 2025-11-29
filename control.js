// ===================================
// CONTROL PANEL - Donation Management
// ===================================

class FundraisingControl {
    constructor() {
        this.data = {
            totalRaised: 0,
            goal: 100000,
            donations: [],
            donationCount: 0
        };
        
        this.elements = {
            // Display elements
            controlAmount: document.getElementById('controlAmount'),
            controlPercentage: document.getElementById('controlPercentage'),
            donationCount: document.getElementById('donationCount'),
            
            // Input elements
            goalInput: document.getElementById('goalInput'),
            customAmountInput: document.getElementById('customAmountInput'),
            
            // Button elements
            updateGoalBtn: document.getElementById('updateGoalBtn'),
            addDonationBtn: document.getElementById('addDonationBtn'),
            resetBtn: document.getElementById('resetBtn'),
            
            // List elements
            recentDonations: document.getElementById('recentDonations')
        };
        
        this.init();
    }
    
    init() {
        // Load data from localStorage
        this.loadData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
    }
    
    loadData() {
        const stored = localStorage.getItem('fundraising_data');
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                this.elements.goalInput.value = this.data.goal;
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
    }
    
    saveData() {
        localStorage.setItem('fundraising_data', JSON.stringify(this.data));
        
        // Trigger storage event manually for same-tab communication
        window.dispatchEvent(new CustomEvent('fundraising_update', {
            detail: this.data
        }));
    }
    
    setupEventListeners() {
        // Goal update
        this.elements.updateGoalBtn.addEventListener('click', () => {
            this.updateGoal();
        });
        
        this.elements.goalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.updateGoal();
        });
        
        // Custom amount donation
        this.elements.addDonationBtn.addEventListener('click', () => {
            this.addCustomDonation();
        });
        
        this.elements.customAmountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCustomDonation();
        });
        
        // Quick donate buttons
        document.querySelectorAll('.donate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseFloat(btn.dataset.amount);
                this.addDonation(amount);
            });
        });
        
        // Reset button
        this.elements.resetBtn.addEventListener('click', () => {
            this.resetData();
        });
    }
    
    updateGoal() {
        const newGoal = parseFloat(this.elements.goalInput.value);
        
        if (!newGoal || newGoal <= 0) {
            alert('Please enter a valid goal amount');
            return;
        }
        
        this.data.goal = newGoal;
        this.saveData();
        this.render();
        
        this.showNotification('Goal updated successfully! 🎯');
    }
    
    addCustomDonation() {
        const amount = parseFloat(this.elements.customAmountInput.value);
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid donation amount');
            return;
        }
        
        this.addDonation(amount);
        this.elements.customAmountInput.value = '';
    }
    
    addDonation(amount) {
        // Add to total
        this.data.totalRaised += amount;
        this.data.donationCount += 1;
        
        // Add to donations list
        const donation = {
            amount: amount,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        this.data.donations.unshift(donation);
        
        // Keep only last 50 donations
        if (this.data.donations.length > 50) {
            this.data.donations = this.data.donations.slice(0, 50);
        }
        
        // Save and render
        this.saveData();
        this.render();
        
        // Visual feedback
        this.flashButton();
    }
    
    deleteDonation(donationId) {
        const donation = this.data.donations.find(d => d.id === donationId);
        
        if (!donation) return;
        
        const confirmed = confirm(`Delete donation of $${this.formatNumber(donation.amount)}?`);
        
        if (!confirmed) return;
        
        // Remove from total
        this.data.totalRaised -= donation.amount;
        this.data.donationCount -= 1;
        
        // Remove from array
        this.data.donations = this.data.donations.filter(d => d.id !== donationId);
        
        // Save and render
        this.saveData();
        this.render();
        
        this.showNotification(`Deleted $${this.formatNumber(donation.amount)} donation ✓`);
    }
    
    editDonation(donationId) {
        const donation = this.data.donations.find(d => d.id === donationId);
        
        if (!donation) return;
        
        const newAmount = prompt(
            `Edit donation amount:\nCurrent: $${this.formatNumber(donation.amount)}`,
            donation.amount
        );
        
        if (newAmount === null) return; // User cancelled
        
        const parsedAmount = parseFloat(newAmount);
        
        if (!parsedAmount || parsedAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Update total (subtract old, add new)
        this.data.totalRaised -= donation.amount;
        this.data.totalRaised += parsedAmount;
        
        // Update donation
        donation.amount = parsedAmount;
        donation.edited = true;
        donation.editedAt = new Date().toISOString();
        
        // Save and render
        this.saveData();
        this.render();
        
        this.showNotification(`Updated to $${this.formatNumber(parsedAmount)} ✓`);
    }
    
    resetData() {
        const confirmed = confirm('Are you sure you want to reset all data? This cannot be undone.');
        
        if (!confirmed) return;
        
        const doubleCheck = confirm('This will clear all donations and reset to $0. Are you absolutely sure?');
        
        if (!doubleCheck) return;
        
        this.data = {
            totalRaised: 0,
            goal: this.data.goal,
            donations: [],
            donationCount: 0
        };
        
        this.saveData();
        this.render();
        
        this.showNotification('All data has been reset 🔄');
    }
    
    render() {
        // Update stats
        this.elements.controlAmount.textContent = this.formatNumber(this.data.totalRaised);
        
        const percentage = (this.data.totalRaised / this.data.goal) * 100;
        this.elements.controlPercentage.textContent = percentage.toFixed(1);
        
        this.elements.donationCount.textContent = this.data.donationCount;
        
        // Render recent donations
        this.renderDonations();
    }
    
    renderDonations() {
        const container = this.elements.recentDonations;
        
        if (this.data.donations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎁</div>
                    <p>No donations yet. Start adding donations to see them here!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.data.donations.map(donation => {
            const time = this.formatTime(donation.timestamp);
            return `
                <div class="donation-item">
                    <div class="donation-info">
                        <div class="donation-amount">$${this.formatNumber(donation.amount)}</div>
                        <div class="donation-time">${time}</div>
                    </div>
                    <div class="donation-actions">
                        <button class="btn-icon btn-edit" data-id="${donation.id}" title="Edit amount">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="btn-icon btn-delete" data-id="${donation.id}" title="Delete donation">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners to delete and edit buttons
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteDonation(id);
            });
        });
        
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.editDonation(id);
            });
        });
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // Less than 1 minute
        if (diff < 60000) {
            return 'Just now';
        }
        
        // Less than 1 hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        
        // Less than 24 hours
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        
        // Format as date
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    flashButton() {
        const btn = this.elements.addDonationBtn;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }
    
    showNotification(message) {
        // Simple notification (could be enhanced with a toast library)
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--teal-600), var(--teal-500));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(26, 181, 181, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize control panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FundraisingControl();
});

