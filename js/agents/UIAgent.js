class UIAgent {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        // 初始化表單元素
        this.form = document.getElementById('signInForm');
        this.themeToggle = document.getElementById('themeToggle');
        this.targetUni = document.getElementById('targetUni');
        this.targetDept = document.getElementById('targetDept');
        this.scoreInfo = document.getElementById('scoreInfo');
        
        // 檢查元素是否存在
        if (!this.targetUni || !this.targetDept || !this.scoreInfo) {
            console.error('無法找到必要的頁面元素');
            return;
        }

        this.initializeTheme();
        this.initializeUniversityOptions();
        this.initializeSubjectOptions();
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        this.targetUni.addEventListener('change', this.handleUniversityChange.bind(this));
        this.targetDept.addEventListener('change', this.handleDepartmentChange.bind(this));
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    initializeUniversityOptions() {
        // 清空並初始化大學選項
        this.targetUni.innerHTML = '<option value="">請選擇大學</option>';
        
        // 填充大學選項
        CONFIG.UNIVERSITIES.forEach(uni => {
            const option = document.createElement('option');
            option.value = uni.name;
            option.textContent = uni.name;
            this.targetUni.appendChild(option);
        });
    }

    initializeSubjectOptions() {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.innerHTML = '<option value="">請選擇科目</option>';
            CONFIG.SUBJECTS.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        }
    }

    handleUniversityChange() {
        const selectedUni = this.targetUni.value;
        this.targetDept.innerHTML = '<option value="">請選擇科系</option>';
        this.scoreInfo.innerHTML = ''; // 清空分數資訊
        
        if (selectedUni) {
            const university = CONFIG.UNIVERSITIES.find(uni => uni.name === selectedUni);
            if (university) {
                university.departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.name;
                    option.textContent = dept.name;
                    this.targetDept.appendChild(option);
                });
            }
        }
    }

    handleDepartmentChange() {
        const selectedUni = this.targetUni.value;
        const selectedDept = this.targetDept.value;
        
        if (selectedUni && selectedDept) {
            const university = CONFIG.UNIVERSITIES.find(uni => uni.name === selectedUni);
            const department = university?.departments.find(dept => dept.name === selectedDept);
            
            if (department) {
                this.displayDepartmentInfo(department);
            }
        } else {
            this.scoreInfo.innerHTML = '';
        }
    }

    displayDepartmentInfo(department) {
        const requirements = department.requirements;
        let html = `
            <div class="alert alert-info">
                <h5 class="alert-heading">${department.name} 入學參考</h5>
                <hr>
                <p class="mb-1">學測要求：${requirements.學測}</p>
                <p class="mb-2">分科測驗：</p>
                <ul class="list-unstyled mb-3">
        `;
        
        Object.entries(requirements.分科測驗).forEach(([subject, score]) => {
            html += `<li><strong>${subject}：</strong>${score} 級分</li>`;
        });
        
        html += `
                </ul>
                <small class="text-muted">※ 以上分數僅供參考，實際錄取分數可能因年度而異</small>
            </div>
        `;
        
        this.scoreInfo.innerHTML = html;
    }    handleSubmit(event) {
        event.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            school: document.getElementById('school').value,
            grade: document.getElementById('grade').value,
            subject: document.getElementById('subject').value,
            targetUniversity: this.targetUni.value,
            targetDepartment: this.targetDept.value,
            timestamp: new Date().toISOString()
        };

        // 觸發簽到事件
        const checkInEvent = new CustomEvent('checkIn', { detail: formData });
        document.dispatchEvent(checkInEvent);
        
        // 清空表單
        event.target.reset();
        
        // 顯示成功訊息
        this.showMessage('簽到成功！', 'success');
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    showMessage(message, type = 'info') {
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 
                          'alert-info';
                          
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // 創建一個臨時容器來顯示提示訊息
        const messageContainer = document.createElement('div');
        messageContainer.style.position = 'fixed';
        messageContainer.style.top = '20px';
        messageContainer.style.right = '20px';
        messageContainer.style.zIndex = '9999';
        messageContainer.innerHTML = alertHtml;
        
        document.body.appendChild(messageContainer);
        
        // 3秒後自動移除提示
        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    }
}
