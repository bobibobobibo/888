class DataAgent {
    constructor() {
        this.init();
        this.bindEvents();
    }    init() {
        // 初始化本地存儲
        this.storageKey = 'highSchoolStudyRecords';
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        
        // 初始化使用者資料
        this.userKey = 'userProfile';
        if (!localStorage.getItem(this.userKey)) {
            localStorage.setItem(this.userKey, JSON.stringify({}));
        }
    }

    bindEvents() {
        document.addEventListener('checkIn', this.handleCheckIn.bind(this));
    }

    handleCheckIn(event) {
        const checkInData = event.detail;
        this.saveCheckIn(checkInData);
        
        // 觸發數據更新事件
        const updateEvent = new CustomEvent('dataUpdate', { detail: this.getAllCheckIns() });
        document.dispatchEvent(updateEvent);
    }

    saveCheckIn(data) {
        const records = this.getAllCheckIns();
        records.push({
            ...data,
            id: this.generateId()
        });
        localStorage.setItem(this.storageKey, JSON.stringify(records));
    }

    getAllCheckIns() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    getCheckInsByDate(date) {
        const records = this.getAllCheckIns();
        return records.filter(record => {
            const recordDate = new Date(record.timestamp).toDateString();
            return recordDate === date.toDateString();
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 數據備份功能
    exportData() {
        const data = localStorage.getItem(this.storageKey);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `checkin-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 數據還原功能
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (Array.isArray(data)) {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    }
}
