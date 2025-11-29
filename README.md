# 🌙 Live Fundraising Display

A stunning, real-time fundraising display with Islamic theming, perfect for charity livestreams, events, and fundraising campaigns. Features animated counters, celebratory confetti effects, and a dual-page system for seamless operation.

## ✨ Features

- **Real-time Updates**: Instant synchronization between display and control panel
- **Animated Counter**: Smooth number transitions with celebration effects
- **Islamic Design**: Beautiful emerald and gold color scheme with Islamic geometric patterns
- **Confetti Celebrations**: Particle effects when donations are added
- **Progress Tracking**: Visual progress bar with goal tracking
- **Quick Donate Buttons**: Preset amounts for fast entry ($10 - $5,000)
- **Custom Amounts**: Enter any donation amount
- **Recent Donations**: Track donation history with timestamps
- **Edit & Delete**: Correct mistakes by editing or removing individual donations
- **Responsive Design**: Works on all screen sizes
- **Broadcast Ready**: Perfect for OBS, Streamlabs, or projection

## 🚀 Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. **Click the Deploy Button:**

   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/fundraising)

2. **Or Deploy Manually:**

   - Sign up for a free account at [Netlify](https://netlify.com)
   - Drag and drop this entire folder into Netlify's deployment area
   - Your site will be live in seconds!

### Option 2: Run Locally

1. **Simply open the files:**
   - Double-click `index.html` to open the display page
   - Double-click `control.html` to open the control panel
   - No server or build process required!

2. **Or use a local server:**
   ```bash
   # If you have Python installed
   python -m http.server 8000
   
   # Or if you have Node.js installed
   npx serve
   ```

   Then open:
   - Display: `http://localhost:8000/index.html`
   - Control: `http://localhost:8000/control.html`

## 📖 How to Use

### Setup for Live Events

1. **Deploy to Netlify** (or host anywhere)
2. **Open the Display Page** on your main screen/projector:
   - Navigate to `https://your-site.netlify.app/`
   - This is the page your audience sees
   - Keep this in fullscreen mode (F11)

3. **Open the Control Panel** in a separate browser tab/device:
   - Navigate to `https://your-site.netlify.app/control.html`
   - This is your private control panel
   - Keep this tab open but NOT visible to the audience

4. **Set Your Goal**:
   - In the control panel, enter your fundraising goal
   - Click "Update Goal"

5. **Add Donations**:
   - Click quick donate buttons for preset amounts
   - Or enter custom amounts and click "Add Donation"
   - Watch the magic happen on the display page! ✨

6. **Edit or Delete Donations** (if mistakes happen):
   - In the Recent Donations section, each donation has Edit ✏️ and Delete 🗑️ buttons
   - Click **Edit** to change the amount
   - Click **Delete** to remove a donation entirely
   - The total updates automatically!

### For OBS/Streaming Software

1. Add a **Browser Source**
2. Set URL to: `https://your-site.netlify.app/`
3. Set Width: `1920`, Height: `1080` (or your stream resolution)
4. Check "Refresh browser when scene becomes active"
5. The display will update automatically when you add donations!

### For In-Person Events

1. **Display Screen**: Full-screen the display page on a projector/TV
2. **Operator Laptop/Tablet**: Open the control panel
3. As donations come in, quickly add them via the control panel
4. Audience sees instant updates with celebration effects!

## 🎨 Customization

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --emerald-500: #10b981;  /* Main green color */
    --gold: #d4af37;         /* Gold accent */
    --background: #0a0f0d;   /* Background color */
}
```

### Change Default Goal

Edit `control.html` and `display.js`:

```html
<!-- In control.html -->
<input type="number" id="goalInput" value="100000">
```

```javascript
// In display.js and control.js
this.goalAmount = 100000;  // Change this number
```

### Modify Preset Amounts

Edit the quick donate buttons in `control.html`:

```html
<button class="donate-btn" data-amount="10">$10</button>
<button class="donate-btn" data-amount="25">$25</button>
<!-- Add or modify amounts as needed -->
```

## 🔧 Technical Details

### Technology Stack

- **Pure HTML/CSS/JavaScript** - No frameworks, no build process
- **localStorage** - Data persistence across page reloads
- **Storage Events** - Real-time cross-tab synchronization
- **Canvas API** - Confetti particle effects
- **CSS Animations** - Smooth transitions and effects

### Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### File Structure

```
fundraising/
├── index.html       # Display page (public-facing)
├── control.html     # Control panel (operator only)
├── styles.css       # All styles and animations
├── display.js       # Display page logic and animations
├── control.js       # Control panel logic
├── README.md        # This file
└── netlify.toml     # Netlify configuration (optional)
```

## 📱 Mobile Support

- ✅ Display page is fully responsive
- ✅ Control panel works on tablets and phones
- 💡 Recommended: Use a tablet for the control panel for easier operation

## 🔒 Data Privacy

- All data is stored **locally** in the browser's localStorage
- No external databases or servers
- No personal information is collected
- Perfect for privacy-conscious organizations

## 🎯 Pro Tips

1. **Test Before Going Live**: Add some test donations to familiarize yourself
2. **Use Reset Carefully**: The reset button clears everything - use at the end of events
3. **Bookmark Both Pages**: Save time by bookmarking display and control URLs
4. **Dual Monitor Setup**: Display on main screen, control on secondary screen
5. **Check Volume**: Some browsers may require user interaction before playing sounds
6. **Internet Connection**: Both pages need to be from the same domain for sync to work

## 🐛 Troubleshooting

### Display not updating?
- Make sure both pages are from the **same domain** (both local or both online)
- Check that JavaScript is enabled
- Try refreshing both pages

### Numbers not smooth?
- This is normal on slower devices
- Animation adjusts automatically based on device performance

### Confetti not showing?
- Check browser console for errors
- Make sure canvas is not blocked by ad blockers
- Try a different browser

## 🌟 Credits

Built with ❤️ for charitable causes and community fundraising.

### Design Inspiration
- Modern fintech dashboards
- Charity livestream overlays
- Islamic geometric patterns

### Color Palette
- Emerald Green (Growth & Success)
- Gold/Amber (Celebration & Value)
- Deep Neutrals (Premium Feel)

## 📄 License

Free to use for charitable and non-profit purposes. If you use this for your fundraising, consider sharing your success story!

## 🤲 Islamic Values

This project incorporates Islamic design principles:
- ✦ Geometric patterns symbolizing divine order
- 🌙 Crescent moon representing Islamic identity
- 💚 Emerald green, beloved color in Islamic tradition
- 🌟 Gold accents for celebration and blessing

**بارك الله فيكم** - May Allah bless you in your fundraising efforts!

---

**Made with care for the community** 🌙💚✨

