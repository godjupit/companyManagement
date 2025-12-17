document.addEventListener('DOMContentLoaded', () => {
    // API URLs
    const DEPT_API_URL = 'http://localhost:8080/depts';
    const EMP_API_URL = 'http://localhost:8080/emps';

    // ==================== 标签页切换功能 ====================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // 移除所有活动状态
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加活动状态到当前标签
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // 如果切换到部门标签，加载部门数据
            if (targetTab === 'dept') {
                fetchDepartments();
            } else if (targetTab === 'emp') {
                fetchEmployees();
            }
        });
    });

    // ==================== 员工查询模块 ====================
    const empTableBody = document.querySelector('#emps-table tbody');
    const empLoadingMessage = document.getElementById('emp-loading-message');
    const empErrorMessage = document.getElementById('emp-error-message');
    const empActionFeedback = document.getElementById('emp-action-feedback');
    const empSearchInput = document.getElementById('emp-search-input');
    const empSearchBtn = document.getElementById('emp-search-btn');
    const empRefreshBtn = document.getElementById('emp-refresh-btn');
    const empGenderSelect = document.getElementById('emp-gender-select');
    const empDeptSelect = document.getElementById('emp-dept-select');
    
    // 分页相关元素
    const empPagination = document.getElementById('emp-pagination');
    const empPageInfo = document.getElementById('emp-page-info');
    const empPrevBtn = document.getElementById('emp-prev-btn');
    const empNextBtn = document.getElementById('emp-next-btn');
    const empPageNumbers = document.getElementById('emp-page-numbers');
    const empPageSizeSelect = document.getElementById('emp-page-size-select');

    // 查询状态
    let currentPage = 1;
    let pageSize = 10;
    let totalRecords = 0;
    let totalPages = 0;
    let selectedGender = ''; // 选中的性别筛选
    let selectedDeptId = ''; // 选中的部门ID筛选
    let searchName = ''; // 搜索的姓名
    let departments = []; // 部门列表

    // 显示员工反馈消息
    function showEmpFeedback(message, isError = false) {
        empActionFeedback.textContent = message;
        empActionFeedback.className = `feedback-msg ${isError ? 'error' : 'success'}`;
        empActionFeedback.style.display = 'block';
        setTimeout(() => {
            empActionFeedback.style.display = 'none';
        }, 3000);
    }

    // 获取并渲染员工列表
    async function fetchEmployees(page = 1, size = pageSize, gender = selectedGender, deptId = selectedDeptId, name = searchName) {
        try {
            empLoadingMessage.style.display = 'block';
            empErrorMessage.style.display = 'none';
            empTableBody.innerHTML = '';
            empPagination.style.display = 'none';

            // 构建查询参数（使用小写的参数名，Spring会自动绑定到empQuery对象）
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('pageSize', size);
            if (gender && gender !== '') {
                params.append('gender', gender);
            }
            if (deptId && deptId !== '') {
                params.append('deptId', deptId);
            }
            if (name && name.trim() !== '') {
                params.append('name', name.trim());
            }

            const response = await fetch(`${EMP_API_URL}?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            const result = await response.json();

            if (result.code === 1 && result.data) {
                const pageData = result.data;
                if (pageData.records && Array.isArray(pageData.records)) {
                    // 更新查询状态
                    currentPage = page;
                    pageSize = size;
                    selectedGender = gender || '';
                    selectedDeptId = deptId || '';
                    searchName = name || '';
                    totalRecords = pageData.total || 0;
                    totalPages = Math.ceil(totalRecords / pageSize);
                    
                    // 渲染员工列表
                    renderEmployees(pageData.records);
                    
                    // 更新分页控件
                    updatePagination();
                    empPagination.style.display = 'block';
                } else {
                    throw new Error('从服务器接收到的数据格式无效。');
                }
            } else {
                throw new Error(result.message || '从服务器接收到的数据格式无效。');
            }
        } catch (error) {
            showEmpError(error.message);
        } finally {
            empLoadingMessage.style.display = 'none';
        }
    }

    // 渲染员工列表
    function renderEmployees(employees) {
        empTableBody.innerHTML = '';
        if (employees.length === 0) {
            empTableBody.innerHTML = '<tr><td colspan="9">未找到员工数据。</td></tr>';
            return;
        }

        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.id || 'N/A'}</td>
                <td>${emp.username || 'N/A'}</td>
                <td>${emp.name || 'N/A'}</td>
                <td>${formatGender(emp.gender)}</td>
                <td>${formatJob(emp.job)}</td>
                <td>${formatDate(emp.entrydate)}</td>
                <td>${emp.deptId || 'N/A'}</td>
                <td>${formatDateTime(emp.createTime)}</td>
                <td>${formatDateTime(emp.updateTime)}</td>
            `;
            empTableBody.appendChild(row);
        });
    }

    // 搜索员工（使用后端搜索）
    function searchEmployees() {
        const searchTerm = empSearchInput.value.trim();
        // 使用后端搜索，回到第一页
        fetchEmployees(1, pageSize, selectedGender, selectedDeptId, searchTerm);
    }

    // 更新分页控件
    function updatePagination() {
        // 更新分页信息
        empPageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页，总计 ${totalRecords} 条记录`;
        
        // 更新上一页/下一页按钮状态
        empPrevBtn.disabled = currentPage <= 1;
        empNextBtn.disabled = currentPage >= totalPages;
        
        // 生成页码按钮
        empPageNumbers.innerHTML = '';
        
        if (totalPages === 0) {
            return;
        }
        
        // 计算显示的页码范围
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        
        // 如果当前页靠近开头，显示更多后面的页码
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }
        
        // 如果当前页靠近结尾，显示更多前面的页码
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }
        
        // 添加第一页和省略号
        if (startPage > 1) {
            createPageButton(1);
            if (startPage > 2) {
                createEllipsis();
            }
        }
        
        // 添加页码按钮
        for (let i = startPage; i <= endPage; i++) {
            createPageButton(i);
        }
        
        // 添加最后一页和省略号
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                createEllipsis();
            }
            createPageButton(totalPages);
        }
    }
    
    // 创建页码按钮
    function createPageButton(pageNum) {
        const btn = document.createElement('button');
        btn.className = `page-number ${pageNum === currentPage ? 'active' : ''}`;
        btn.textContent = pageNum;
        btn.addEventListener('click', () => {
            if (pageNum !== currentPage) {
                fetchEmployees(pageNum, pageSize, selectedGender, selectedDeptId, searchName);
            }
        });
        empPageNumbers.appendChild(btn);
    }
    
    // 创建省略号
    function createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-number ellipsis';
        ellipsis.textContent = '...';
        empPageNumbers.appendChild(ellipsis);
    }
    
    // 加载部门列表
    async function loadDepartments() {
        try {
            const response = await fetch(DEPT_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            const result = await response.json();
            
            if (result.code === 1 && Array.isArray(result.data)) {
                departments = result.data;
                // 填充部门下拉框
                empDeptSelect.innerHTML = '<option value="">全部部门</option>';
                departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.id;
                    option.textContent = dept.name;
                    empDeptSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('加载部门列表失败:', error);
        }
    }
    
    // 事件监听
    empSearchBtn.addEventListener('click', searchEmployees);
    empSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchEmployees();
        }
    });
    empRefreshBtn.addEventListener('click', () => {
        empSearchInput.value = '';
        selectedGender = '';
        selectedDeptId = '';
        searchName = '';
        empGenderSelect.value = '';
        empDeptSelect.value = '';
        fetchEmployees(1, pageSize, '', '', '');
    });
    
    // 性别筛选事件监听
    empGenderSelect.addEventListener('change', (e) => {
        selectedGender = e.target.value;
        // 改变性别筛选时，回到第一页并重新加载数据
        fetchEmployees(1, pageSize, selectedGender, selectedDeptId, searchName);
    });
    
    // 部门筛选事件监听
    empDeptSelect.addEventListener('change', (e) => {
        selectedDeptId = e.target.value;
        // 改变部门筛选时，回到第一页并重新加载数据
        fetchEmployees(1, pageSize, selectedGender, selectedDeptId, searchName);
    });
    
    // 分页控件事件监听
    empPrevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchEmployees(currentPage - 1, pageSize, selectedGender, selectedDeptId, searchName);
        }
    });
    
    empNextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchEmployees(currentPage + 1, pageSize, selectedGender, selectedDeptId, searchName);
        }
    });
    
    empPageSizeSelect.addEventListener('change', (e) => {
        const newPageSize = parseInt(e.target.value);
        fetchEmployees(1, newPageSize, selectedGender, selectedDeptId, searchName); // 改变每页大小时回到第一页
    });

    // 显示员工错误消息
    function showEmpError(message) {
        empErrorMessage.textContent = `加载员工数据失败: ${message}`;
        empErrorMessage.style.display = 'block';
    }

    // ==================== 部门查询模块 ====================
    const deptTableBody = document.querySelector('#depts-table tbody');
    const deptLoadingMessage = document.getElementById('dept-loading-message');
    const deptErrorMessage = document.getElementById('dept-error-message');
    const addDeptForm = document.getElementById('add-dept-form');
    const deptNameInput = document.getElementById('dept-name-input');
    const deptActionFeedback = document.getElementById('dept-action-feedback');

    // 显示部门反馈消息
    function showDeptFeedback(message, isError = false) {
        deptActionFeedback.textContent = message;
        deptActionFeedback.className = `feedback-msg ${isError ? 'error' : 'success'}`;
        deptActionFeedback.style.display = 'block';
        setTimeout(() => {
            deptActionFeedback.style.display = 'none';
        }, 3000);
    }

    // 获取并渲染部门列表
    async function fetchDepartments() {
        try {
            deptLoadingMessage.style.display = 'block';
            deptErrorMessage.style.display = 'none';
            deptTableBody.innerHTML = '';

            const response = await fetch(DEPT_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }
            const result = await response.json();

            if (result.code === 1 && Array.isArray(result.data)) {
                renderDepartments(result.data);
            } else {
                throw new Error(result.message || '从服务器接收到的数据格式无效。');
            }
        } catch (error) {
            showDeptError(error.message);
        } finally {
            deptLoadingMessage.style.display = 'none';
        }
    }

    // 渲染部门列表
    function renderDepartments(departments) {
        deptTableBody.innerHTML = '';
        if (departments.length === 0) {
            deptTableBody.innerHTML = '<tr><td colspan="5">未找到部门数据。</td></tr>';
            return;
        }

        departments.forEach(dept => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dept.id}</td>
                <td>${dept.name}</td>
                <td>${formatDateTime(dept.createTime)}</td>
                <td>${formatDateTime(dept.updateTime)}</td>
                <td><button class="delete-btn" data-id="${dept.id}">删除</button></td>
            `;
            deptTableBody.appendChild(row);
        });
    }

    // 处理添加部门
    addDeptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const deptName = deptNameInput.value.trim();
        if (!deptName) {
            showDeptFeedback('部门名称不能为空。', true);
            return;
        }

        try {
            const response = await fetch(DEPT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: deptName })
            });
            const result = await response.json();

            if (result.code === 1) {
                showDeptFeedback('部门添加成功！');
                deptNameInput.value = '';
                fetchDepartments(); // 刷新列表
            } else {
                showDeptFeedback(result.message || '添加部门失败。', true);
            }
        } catch (error) {
            showDeptFeedback(`错误: ${error.message}`, true);
        }
    });

    // 处理删除部门（使用事件委托）
    deptTableBody.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('delete-btn')) {
            const deptId = e.target.dataset.id;
            if (confirm(`确定要删除部门 ID ${deptId} 吗？`)) {
                try {
                    const response = await fetch(`${DEPT_API_URL}/${deptId}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();

                    if (result.code === 1) {
                        showDeptFeedback('部门删除成功！');
                        fetchDepartments(); // 刷新列表
                    } else {
                        showDeptFeedback(result.message || '删除部门失败。', true);
                    }
                } catch (error) {
                    showDeptFeedback(`错误: ${error.message}`, true);
                }
            }
        }
    });

    // 显示部门错误消息
    function showDeptError(message) {
        deptErrorMessage.textContent = `加载部门数据失败: ${message}`;
        deptErrorMessage.style.display = 'block';
    }

    // ==================== 工具函数 ====================
    // 格式化日期时间
    function formatDateTime(dateTimeString) {
        if (!dateTimeString) {
            return 'N/A';
        }
        try {
            return new Date(dateTimeString).toLocaleString('zh-CN');
        } catch (e) {
            return dateTimeString;
        }
    }

    // 格式化日期
    function formatDate(dateString) {
        if (!dateString) {
            return 'N/A';
        }
        try {
            return new Date(dateString).toLocaleDateString('zh-CN');
        } catch (e) {
            return dateString;
        }
    }

    // 格式化性别
    function formatGender(gender) {
        if (gender === null || gender === undefined) {
            return 'N/A';
        }
        return gender === 1 ? '男' : gender === 2 ? '女' : '未知';
    }

    // 格式化职位
    function formatJob(job) {
        if (job === null || job === undefined) {
            return 'N/A';
        }
        // 可以根据实际业务需求映射职位编号到职位名称
        const jobMap = {
            1: '经理',
            2: '主管',
            3: '员工',
            4: '实习生'
        };
        return jobMap[job] || `职位${job}`;
    }

    // 初始化：加载部门列表和员工数据（默认显示员工查询标签页）
    loadDepartments();
    fetchEmployees(1, 10, '', '', '');
});
