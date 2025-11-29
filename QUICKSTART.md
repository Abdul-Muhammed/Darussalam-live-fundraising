# 🚀 Quick Start Guide

Get your fundraising display up and running in **2 minutes**!

## 🎯 What You'll Get

- 📺 **Display Page**: Beautiful fundraising counter for your big screen
- 🎮 **Control Panel**: Private page to add donations
- 🎉 **Live Sync**: Changes appear instantly with celebration effects

## 📦 Option 1: Deploy to Netlify (Easiest)

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up for free (GitHub, GitLab, or email)

### Step 2: Deploy Your Site
1. Click **"Add new site"** → **"Deploy manually"**
2. **Drag and drop** this entire folder into Netlify
3. Wait 30 seconds... Done! 🎉

### Step 3: Get Your URLs
Netlify will give you a URL like: `https://amazing-site-123.netlify.app`

- **Display Page**: `https://amazing-site-123.netlify.app/`
- **Control Panel**: `https://amazing-site-123.netlify.app/control.html`

### Step 4: Customize Your URL (Optional)
1. Go to **Site settings** → **Change site name**
2. Make it memorable: `https://our-fundraiser.netlify.app`

## 💻 Option 2: Run Locally

### Method A: Just Open the Files
1. Find `index.html` in your folder
2. **Double-click** to open in your browser
3. Open `control.html` in another tab
4. Done! (Works for testing, but sync won't work across different devices)

### Method B: Use a Local Server
```bash
# If you have Python
python -m http.server 8000

# If you have Node.js
npx serve
```

Then open in your browser:
- Display: `http://localhost:8000/`
- Control: `http://localhost:8000/control.html`

## 🎬 Using It Live

### For a Livestream (OBS/Streamlabs):

1. **In OBS**: Add **Browser Source**
2. **URL**: `https://your-site.netlify.app/`
3. **Size**: 1920 x 1080 (or match your canvas)
4. **Add to scene** and position as overlay

5. **On your phone/tablet**: Open control panel
6. **Add donations** as they come in
7. **Watch** the stream update automatically! ✨

### For In-Person Events:

1. **Big Screen/Projector**: Open display page, press **F11** for fullscreen
2. **Your Laptop/Tablet**: Open control panel (keep it private!)
3. **Add donations** through the control panel
4. **Audience sees** instant updates with confetti! 🎊

## 🎨 First-Time Setup

### 1. Set Your Goal
- Open **control.html**
- Find "Set Goal Amount"
- Enter your target (e.g., 100000 for $100,000)
- Click **"Update Goal"**

### 2. Test It Out
- Click a **quick donate button** (e.g., $100)
- Watch the display page update
- See confetti! 🎉
- Check the progress bar moves

### 3. Fix Mistakes Easily
- Made an error? No problem!
- Each donation has **Edit** ✏️ and **Delete** 🗑️ buttons
- Click **Edit** to change the amount
- Click **Delete** to remove it completely
- Total updates automatically

### 4. Reset for Your Event
- When ready, click **"Reset All Data"**
- Confirm the reset
- You're at $0 and ready to go!

## 📱 Pro Setup Tips

### For Best Results:

✅ **Two Devices**:
- Device 1 (big screen): Display page in fullscreen
- Device 2 (tablet/laptop): Control panel for operator

✅ **Bookmark Both Pages**:
- Save time with quick access
- Name them "Fundraiser Display" and "Fundraiser Control"

✅ **Test Your Internet**:
- Both pages must be from the **same domain**
- If using locally, open both from `localhost`
- If using Netlify, open both from your Netlify URL

✅ **Practice Run**:
- Do a test session before going live
- Add some donations and reset
- Get comfortable with the controls

## 🆘 Quick Troubleshooting

**Display not updating?**
- Refresh both pages
- Make sure both are from the same URL (both local OR both online)

**No confetti?**
- Try Chrome or Edge browser
- Disable ad blockers temporarily

**Made a mistake on a donation?**
- Each donation has Edit and Delete buttons
- Click the pencil icon to edit the amount
- Click the trash icon to delete it

**Want to start over completely?**
- Click "Reset All Data" in control panel
- Refreshes everything to $0

## 🎯 Your First Event Checklist

- [ ] Deploy to Netlify (or run locally)
- [ ] Open display page on big screen
- [ ] Open control panel on your device
- [ ] Set your fundraising goal
- [ ] Do a test donation
- [ ] Watch for confetti and animations
- [ ] Test editing a donation amount
- [ ] Test deleting a donation
- [ ] Reset data to $0
- [ ] **Go live!** 🚀

## 💡 Next Steps

Once comfortable, check out **README.md** for:
- Customization options (colors, amounts, etc.)
- Advanced features
- Troubleshooting
- OBS integration details

---

**Ready? Let's raise some funds!** 💚🌙✨

**بارك الله فيكم** - May Allah bless your efforts!

