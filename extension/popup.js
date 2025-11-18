// Get current tab information
async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');
    
    if (type === 'success') {
        setTimeout(() => {
            window.close();
        }, 1500);
    }
}

// Check if user is logged in
async function checkSession() {
    try {
        const response = await fetch('http://localhost:3000/api/session-check', {
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        console.error('Session check failed:', error);
        return false;
    }
}

// Load collections for dropdown
async function loadCollections() {
    try {
        const response = await fetch('http://localhost:3000/collections/api', {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to load collections');
        
        const collections = await response.json();
        const select = document.getElementById('collectionSelect');
        
        if (collections.length === 0) {
            select.innerHTML = '<option value="">No collections yet</option>';
        } else {
            select.innerHTML = collections.map(col => 
                `<option value="${col._id}">${col.icon || '📁'} ${col.name}</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading collections:', error);
        document.getElementById('collectionSelect').innerHTML = 
            '<option value="">Error loading collections</option>';
    }
}

// Save to Favorites
async function saveToFavorites(title, url) {
    const response = await fetch('http://localhost:3000/favorites/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, url })
    });
    
    if (!response.ok) throw new Error('Failed to save to favorites');
    return await response.json();
}

// Save to History
async function saveToHistory(title, url) {
    const response = await fetch('http://localhost:3000/history/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            action: 'visited',
            itemType: 'url',
            itemName: title,
            details: url
        })
    });
    
    if (!response.ok) throw new Error('Failed to save to history');
    return await response.json();
}

// Save to Collection
async function saveToCollection(collectionId, title, url) {
    const response = await fetch(`http://localhost:3000/collections/api/${collectionId}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, url })
    });
    
    if (!response.ok) throw new Error('Failed to save to collection');
    return await response.json();
}

// Initialize popup
async function init() {
    const loading = document.getElementById('loading');
    const loginPrompt = document.getElementById('loginPrompt');
    const saveForm = document.getElementById('saveForm');
    
    // Get current tab
    const tab = await getCurrentTab();
    
    // Check session
    const isLoggedIn = await checkSession();
    
    loading.classList.add('hidden');
    
    if (!isLoggedIn) {
        loginPrompt.classList.remove('hidden');
        return;
    }
    
    // Show form
    saveForm.classList.remove('hidden');
    
    // Fill in page info
    document.getElementById('title').value = tab.title || '';
    document.getElementById('url').value = tab.url || '';
    
    // Load collections
    await loadCollections();
    
    // Handle save location change
    const saveLocation = document.getElementById('saveLocation');
    const collectionGroup = document.getElementById('collectionGroup');
    
    saveLocation.addEventListener('change', () => {
        if (saveLocation.value === 'collection') {
            collectionGroup.classList.remove('hidden');
        } else {
            collectionGroup.classList.add('hidden');
        }
    });
    
    // Handle form submit
    saveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value.trim();
        const url = document.getElementById('url').value.trim();
        const location = saveLocation.value;
        
        if (!title || !url) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        try {
            if (location === 'favorites') {
                await saveToFavorites(title, url);
                showMessage('Saved to Favorites! ⭐', 'success');
            } else if (location === 'history') {
                await saveToHistory(title, url);
                showMessage('Saved to History! 📝', 'success');
            } else if (location === 'collection') {
                const collectionId = document.getElementById('collectionSelect').value;
                if (!collectionId) {
                    showMessage('Please select a collection', 'error');
                    return;
                }
                await saveToCollection(collectionId, title, url);
                showMessage('Saved to Collection! 📁', 'success');
            }
        } catch (error) {
            console.error('Save error:', error);
            showMessage('Failed to save. Please try again.', 'error');
        }
    });
    
    // Handle cancel
    document.getElementById('cancelBtn').addEventListener('click', () => {
        window.close();
    });
}

// Run when popup opens
init();
