// Cloud Storage App - Main JavaScript
class CloudStorage {
    constructor() {
        this.storageKey = 'cloudStorageData';
        this.init();
    }

    init() {
        this.loadItems();
        this.attachEventListeners();
        this.updateStats();
    }

    attachEventListeners() {
        const form = document.getElementById('storageForm');
        const searchInput = document.getElementById('searchInput');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        searchInput.addEventListener('input', (e) => {
            this.filterItems(e.target.value);
        });
    }

    saveItem() {
        const keyInput = document.getElementById('itemKey');
        const valueInput = document.getElementById('itemValue');
        
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();

        if (!key || !value) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Get existing data
        const data = this.getData();
        
        // Add new item with metadata
        const item = {
            key: key,
            value: value,
            timestamp: new Date().toISOString(),
            id: Date.now() + Math.random()
        };

        data.push(item);

        // Save to storage
        this.setData(data);

        // Clear form
        keyInput.value = '';
        valueInput.value = '';

        // Refresh display
        this.loadItems();
        this.updateStats();

        // Show success message
        this.showNotification('Item saved successfully!');
    }

    deleteItem(id) {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        let data = this.getData();
        data = data.filter(item => item.id !== id);
        this.setData(data);
        this.loadItems();
        this.updateStats();
        this.showNotification('Item deleted successfully!');
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    setData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadItems(filter = '') {
        const itemsList = document.getElementById('itemsList');
        const data = this.getData();

        if (data.length === 0) {
            itemsList.innerHTML = '<p class="empty-message">No items stored yet. Add your first item above!</p>';
            return;
        }

        const filteredData = filter 
            ? data.filter(item => 
                item.key.toLowerCase().includes(filter.toLowerCase()) ||
                item.value.toLowerCase().includes(filter.toLowerCase())
              )
            : data;

        if (filteredData.length === 0) {
            itemsList.innerHTML = '<p class="empty-message">No items match your search.</p>';
            return;
        }

        itemsList.innerHTML = filteredData
            .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
            .map(item => this.createItemCard(item))
            .join('');

        // Attach delete button listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteItem(id);
            });
        });
    }

    createItemCard(item) {
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleString();

        return `
            <div class="item-card">
                <div class="item-header">
                    <span class="item-key">${this.escapeHtml(item.key)}</span>
                    <button class="btn btn-delete" data-id="${item.id}">Delete</button>
                </div>
                <div class="item-value">${this.escapeHtml(item.value)}</div>
                <div class="item-meta">Saved on: ${formattedDate}</div>
            </div>
        `;
    }

    filterItems(searchTerm) {
        this.loadItems(searchTerm);
    }

    updateStats() {
        const data = this.getData();
        const totalItems = data.length;
        const storageData = JSON.stringify(data);
        const storageSize = new Blob([storageData]).size;
        const storageSizeKB = (storageSize / 1024).toFixed(2);

        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('storageUsed').textContent = `${storageSizeKB} KB`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'success') {
        // Simple notification (you can enhance this with a toast library)
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification notification-${type}`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CloudStorage();
});
