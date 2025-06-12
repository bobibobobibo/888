// 初始化所有代理
document.addEventListener('DOMContentLoaded', () => {
    // 創建代理實例
    window.uiAgent = new UIAgent();
    window.dataAgent = new DataAgent();
    window.mapAgent = new MapAgent();
    window.analyticsAgent = new AnalyticsAgent();
    window.chartAgent = new ChartAgent();

    // 錯誤處理
    window.addEventListener('error', (event) => {
        console.error('Application Error:', event.error);
        uiAgent.showMessage('發生錯誤，請重新整理頁面或聯絡管理員', 'error');
    });

    // 離線支援
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.error('ServiceWorker registration failed:', err);
            });
    }
});
