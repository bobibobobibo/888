// Chart.js 視覺化代理
class ChartAgent {
    constructor() {
        this.init();
    }

    init() {
        this.charts = new Map();
        this.createDepartmentScoreChart();
        this.createSubjectDistributionChart();
    }

    createDepartmentScoreChart() {
        const ctx = document.getElementById('departmentScoreChart');
        if (!ctx) return;

        const topDepartments = this.getTopDepartments();
        
        this.charts.set('departmentScore', new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topDepartments.map(dept => `${dept.uni} ${dept.name}`),
                datasets: [{
                    label: '最低錄取分數',
                    data: topDepartments.map(dept => this.calculateAverageScore(dept.requirements['分科測驗'])),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '熱門科系錄取分數比較'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 16
                    }
                }
            }
        }));
    }

    createSubjectDistributionChart() {
        const ctx = document.getElementById('subjectDistributionChart');
        if (!ctx) return;

        const subjectCounts = this.getSubjectDistribution();
        
        this.charts.set('subjectDistribution', new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(subjectCounts),
                datasets: [{
                    data: Object.values(subjectCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '讀書會科目分布'
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        }));
    }

    getTopDepartments() {
        const allDepts = [];
        CONFIG.UNIVERSITIES.forEach(uni => {
            uni.departments.forEach(dept => {
                if (dept.requirements['分科測驗']) {
                    allDepts.push({
                        uni: uni.name,
                        name: dept.name,
                        requirements: dept.requirements
                    });
                }
            });
        });

        return allDepts
            .sort((a, b) => this.calculateAverageScore(b.requirements['分科測驗']) - 
                           this.calculateAverageScore(a.requirements['分科測驗']))
            .slice(0, 10);
    }

    calculateAverageScore(scores) {
        if (!scores || typeof scores !== 'object') return 0;
        const values = Object.values(scores);
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }

    getSubjectDistribution() {
        // 這裡實際應用中應該從 DataAgent 獲取真實數據
        // 目前使用模擬數據
        return {
            '國文': 25,
            '英文': 30,
            '數學': 35,
            '物理': 20,
            '化學': 15,
            '生物': 10
        };
    }

    updateCharts(newData) {
        // 提供給其他代理調用的更新方法
        if (newData.departmentScores) {
            const chart = this.charts.get('departmentScore');
            if (chart) {
                chart.data.datasets[0].data = newData.departmentScores;
                chart.update();
            }
        }

        if (newData.subjectDistribution) {
            const chart = this.charts.get('subjectDistribution');
            if (chart) {
                chart.data.datasets[0].data = Object.values(newData.subjectDistribution);
                chart.update();
            }
        }
    }
}
