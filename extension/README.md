# Kairo Browser Extension

Save any webpage directly to your Kairo dashboard with one click!

## Features

- 🚀 Save current page to Favorites, History, or Collections
- 📁 Choose which collection to save to
- ⚡ One-click access from any webpage
- 🎨 Beautiful popup interface matching Kairo design

## Installation Instructions

### Chrome / Edge / Brave

1. **Open Extension Settings**
   - Chrome: Go to `chrome://extensions/`
   - Edge: Go to `edge://extensions/`
   - Brave: Go to `brave://extensions/`

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to your Kairo project folder
   - Select the `extension` folder
   - Click "Select Folder"

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in your browser toolbar
   - Find "Kairo - Save Links"
   - Click the pin icon to keep it visible

## How to Use

1. **Make sure Kairo is running**
   - Your Kairo server should be running on `http://localhost:3000`
   - You should be logged in to Kairo

2. **Visit any webpage you want to save**

3. **Click the Kairo extension icon** in your browser toolbar

4. **Choose where to save**
   - Favorites: Quick access starred items
   - History: Track visited pages
   - Collection: Organize in a specific collection

5. **Click Save**
   - The page will be saved to your Kairo dashboard
   - You'll see a success message

## Troubleshooting

**"Please log in to Kairo first" message?**
- Make sure your Kairo server is running
- Log in to Kairo at `http://localhost:3000/login`
- Then try the extension again

**Can't see collections?**
- Create at least one collection in Kairo first
- Refresh the extension popup

**Extension not working?**
- Make sure Kairo server is running on port 3000
- Check if you're logged in to Kairo
- Try reloading the extension in `chrome://extensions/`

## Future Improvements

- Custom keyboard shortcuts
- Right-click context menu option
- Bulk save multiple tabs
- Quick notes while saving
- Tag suggestions

## Notes

- This extension only works with a locally running Kairo server
- For production use, update the `host_permissions` in manifest.json to your deployed URL
- Extension requires cookies to work (for session authentication)

## Icon Placeholder

The extension currently uses a simple "K" icon. To add a custom icon:
1. Create PNG images: icon16.png, icon48.png, icon128.png
2. Place them in the `extension/icons/` folder
3. Reload the extension
