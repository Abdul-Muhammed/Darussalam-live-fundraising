// ===================================
// CONTROL PANEL - Donation Management
// ===================================

class FundraisingControl {
    constructor() {
        this.maxVisibleDonations = 50;

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
            customPhoneInput: document.getElementById('customPhoneInput'),
            
            // Button elements
            updateGoalBtn: document.getElementById('updateGoalBtn'),
            addDonationBtn: document.getElementById('addDonationBtn'),
            exportCsvBtn: document.getElementById('exportCsvBtn'),
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
                const parsed = JSON.parse(stored);
                const storedDonations = Array.isArray(parsed.donations) ? parsed.donations : [];
                const donationCount = Number.isInteger(parsed.donationCount)
                    ? parsed.donationCount
                    : storedDonations.length;

                this.data = {
                    totalRaised: Number(parsed.totalRaised) || 0,
                    goal: Number(parsed.goal) || 100000,
                    donations: storedDonations.map(donation => ({
                        ...donation,
                        phoneNumber: donation.phoneNumber ? this.sanitizePhone(donation.phoneNumber) : ''
                    })),
                    donationCount
                };
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

        this.elements.customPhoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCustomDonation();
        });
        
        // Quick donate buttons
        document.querySelectorAll('.donate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseFloat(btn.dataset.amount);
                this.addDonation(amount);
            });
        });

        // Export pledges
        this.elements.exportCsvBtn.addEventListener('click', () => {
            this.exportPledgesToCsv();
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
        const phoneNumber = this.sanitizePhone(this.elements.customPhoneInput.value);
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid donation amount');
            return;
        }
        
        this.addDonation(amount, { phoneNumber });
        this.elements.customAmountInput.value = '';
        this.elements.customPhoneInput.value = '';
    }
    
    addDonation(amount, options = {}) {
        // Add to total
        this.data.totalRaised += amount;
        this.data.donationCount += 1;
        
        // Add to donations list
        const donation = {
            amount: amount,
            timestamp: new Date().toISOString(),
            id: Date.now(),
            phoneNumber: options.phoneNumber || ''
        };
        
        this.data.donations.unshift(donation);
        
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
        const phonePrompt = prompt(
            'Edit phone number (optional):',
            donation.phoneNumber || ''
        );
        if (phonePrompt !== null) {
            donation.phoneNumber = this.sanitizePhone(phonePrompt);
        }
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
        const visibleDonations = this.data.donations.slice(0, this.maxVisibleDonations);
        
        if (visibleDonations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎁</div>
                    <p>No donations yet. Start adding donations to see them here!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = visibleDonations.map(donation => {
            const time = this.formatTime(donation.timestamp);
            const phoneLine = donation.phoneNumber
                ? `<div class="donation-phone">${this.escapeHtml(donation.phoneNumber)}</div>`
                : '';
            return `
                <div class="donation-item">
                    <div class="donation-info">
                        <div class="donation-amount">$${this.formatNumber(donation.amount)}</div>
                        ${phoneLine}
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

    sanitizePhone(phoneInput) {
        if (!phoneInput) return '';
        return phoneInput.replace(/[^\d+\-\s()]/g, '').replace(/\s+/g, ' ').trim();
    }

    escapeHtml(value) {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    escapeCsvValue(value) {
        if (value === null || value === undefined) return '""';
        const safeValue = String(value).replace(/"/g, '""');
        return `"${safeValue}"`;
    }

    exportPledgesToCsv() {
        if (!Array.isArray(this.data.donations) || this.data.donations.length === 0) {
            this.showNotification('No pledges available to export yet.', 'error');
            return;
        }

        const headers = [
            'Donation ID',
            'Amount',
            'Phone Number',
            'Created At',
            'Edited',
            'Edited At'
        ];

        const rows = [...this.data.donations]
            .reverse()
            .map(donation => [
                donation.id || '',
                Number(donation.amount || 0).toFixed(2),
                donation.phoneNumber || '',
                donation.timestamp || '',
                donation.edited ? 'Yes' : 'No',
                donation.editedAt || ''
            ]);

        const csvContent = [
            headers.map(value => this.escapeCsvValue(value)).join(','),
            ...rows.map(row => row.map(value => this.escapeCsvValue(value)).join(','))
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const now = new Date();
        const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

        const link = document.createElement('a');
        link.href = url;
        link.download = `pledges-${stamp}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showNotification('Pledge export downloaded successfully.', 'success');
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
    
    showNotification(message, type = 'success') {
        const isError = type === 'error';
        // Simple notification (could be enhanced with a toast library)
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError
                ? 'linear-gradient(135deg, #b91c1c, #ef4444)'
                : 'linear-gradient(135deg, var(--emerald-700), var(--emerald-500))'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: ${isError
                ? '0 4px 12px rgba(239, 68, 68, 0.35)'
                : '0 4px 12px rgba(47, 149, 209, 0.34)'};
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

