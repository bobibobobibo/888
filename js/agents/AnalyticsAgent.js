class AnalyticsAgent {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        this.todayStatsElement = document.getElementById('todayStats');
        this.weekStatsElement = document.getElementById('weekStats');
        this.updateStats();
    }

    bindEvents() {
        document.addEventListener('dataUpdate', this.handleDataUpdate.bind(this));
    }

    handleDataUpdate() {
        this.updateStats();
    }

    updateStats() {
        const today = new Date();
        const todayStr = today.toDateString();
        
        // 獲取今日資料
        const todayData = this.getCheckInsForDate(todayStr);
        this.updateTodayStats(todayData);

        // 獲取本週資料
        const weekData = this.getWeekStats();
        this.updateWeekStats(weekData);
    }

    getCheckInsForDate(dateStr) {
        const records = JSON.parse(localStorage.getItem('checkInRecords') || '[]');
        return records.filter(record => {
            const recordDate = new Date(record.timestamp).toDateString();
            return recordDate === dateStr;
        });
    }

    getWeekStats() {
        const records = JSON.parse(localStorage.getItem('checkInRecords') || '[]');
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        return records.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate >= weekAgo && recordDate <= today;
        });
    }

    updateTodayStats(todayData) {
        const stats = this.calculateStats(todayData);
        this.todayStatsElement.innerHTML = `
            <h3>今日統計</h3>
            <p>總簽到人數：${stats.total}</p>
            <p>各校區分布：</p>
            <ul>
                ${Object.entries(stats.byUniversity)
                    .map(([uni, count]) => `<li>${uni}: ${count}人</li>`)
                    .join('')}
            </ul>
            <p>各讀書會分布：</p>
            <ul>
                ${Object.entries(stats.byStudyGroup)
                    .map(([group, count]) => `<li>${group}: ${count}人</li>`)
                    .join('')}
            </ul>
        `;
    }

    updateWeekStats(weekData) {
        const stats = this.calculateStats(weekData);
        this.weekStatsElement.innerHTML = `
            <h3>本週統計</h3>
            <p>本週總簽到人數：${stats.total}</p>
            <p>平均每日：${Math.round(stats.total / 7)} 人</p>
            <p>各校區分布：</p>
            <ul>
                ${Object.entries(stats.byUniversity)
                    .map(([uni, count]) => `<li>${uni}: ${count}人</li>`)
                    .join('')}
            </ul>
        `;
    }

    calculateStats(data) {
        const stats = {
            total: data.length,
            byUniversity: {},
            byStudyGroup: {}
        };

        data.forEach(record => {
            // 統計各大學
            if (!stats.byUniversity[record.university]) {
                stats.byUniversity[record.university] = 0;
            }
            stats.byUniversity[record.university]++;

            // 統計各讀書會
            if (!stats.byStudyGroup[record.studyGroup]) {
                stats.byStudyGroup[record.studyGroup] = 0;
            }
            stats.byStudyGroup[record.studyGroup]++;
        });

        return stats;
    }
}
