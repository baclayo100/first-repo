// In-memory data store
let accounts = [
    { id: 1, title: 'Mr', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'Admin', status: 'Active' },
    { id: 2, title: 'Ms', firstName: 'Normal', lastName: 'User', email: 'user@example.com', role: 'User', status: 'Active' },
    { id: 3, title: 'Dr', firstName: 'Inactive', lastName: 'Person', email: 'inactive@example.com', role: 'User', status: 'Inactive' }
];

let employees = [
    { id: 1, employeeId: 'EMP001', userId: 1, position: 'Developer', departmentId: 1, hireDate: '2025-01-01', status: 'Active' },
    { id: 2, employeeId: 'EMP002', userId: 2, position: 'Designer', departmentId: 2, hireDate: '2025-02-01', status: 'Active' }
];

let departments = [
    { id: 1, name: 'Engineering', description: 'Software development team' },
    { id: 2, name: 'Marketing', description: 'Marketing team' }
];

let requests = [
    { id: 1, employeeId: 2, type: 'Equipment', requestItems: [{ name: 'Laptop', quantity: 1 }], status: 'Pending' },
    { id: 2, employeeId: 1, type: 'Leave', requestItems: [{ name: 'Vacation', quantity: 5 }], status: 'Approved' }
];

let currentEditId = null;
let alertTimeout = null;

// Helper function to show alerts
function showGlobalAlert(message, type = 'success') {
    const placeholder = document.getElementById('global-alert-placeholder');
    const alertType = type === 'info' ? 'alert-info' : (type === 'error' ? 'alert-danger' : 'alert-success');
    
    placeholder.innerHTML = `
        <div class="alert ${alertType}">
            ${message}
        </div>
    `;

    // Clear previous timeout if exists
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }

    // Auto-dismiss after 5 seconds
    alertTimeout = setTimeout(() => {
        placeholder.innerHTML = '';
    }, 5000);
}

// Navigation function
function showSection(section) {
    // Clear any existing global alert when changing sections
    const placeholder = document.getElementById('global-alert-placeholder');
    if (placeholder) placeholder.innerHTML = '';
    if (alertTimeout) clearTimeout(alertTimeout);

    // Hide all sections
    document.querySelectorAll('.section').forEach(div => div.classList.add('hidden'));
    
    // Show the requested section
    document.getElementById(`${section}-section`).classList.remove('hidden');
    
    // Render data for specific sections
    if (section === 'accounts') renderAccounts();
    if (section === 'employees') renderEmployees();
    if (section === 'departments') renderDepartments();
    if (section === 'requests') renderRequests();
}

// Accounts functions
function renderAccounts() {
    const tbody = document.getElementById('accounts-table-body');
    tbody.innerHTML = '';
    
    accounts.forEach(account => {
        tbody.innerHTML += `
            <tr>
                <td>${account.title}</td>
                <td>${account.firstName}</td>
                <td>${account.lastName}</td>
                <td>${account.email}</td>
                <td>${account.role}</td>
                <td><span class="badge ${account.status === 'Active' ? 'bg-success' : 'bg-danger'}">${account.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary action-btn" onclick="showAccountForm(${account.id})">Edit</button>
                </td>
            </tr>
        `;
    });
}

function showAccountForm(id) {
    currentEditId = id;
    document.getElementById('account-form-title').textContent = id ? 'EDIT ACCOUNT' : 'ADD ACCOUNT';
    const account = id ? accounts.find(a => a.id === id) : null;

    document.getElementById('account-id').value = account ? account.id : '';
    document.getElementById('account-title').value = account ? account.title : 'Mr';
    document.getElementById('account-firstName').value = account ? account.firstName : '';
    document.getElementById('account-lastName').value = account ? account.lastName : '';
    document.getElementById('account-email').value = account ? account.email : '';
    document.getElementById('account-role').value = account ? account.role : 'User';
    document.getElementById('account-status').value = account ? account.status : 'Active';
    
    document.getElementById('account-form-error').classList.add('hidden');
    showSection('account-form');
}

function saveAccount() {
    const id = currentEditId;
    const title = document.getElementById('account-title').value;
    const firstName = document.getElementById('account-firstName').value;
    const lastName = document.getElementById('account-lastName').value;
    const email = document.getElementById('account-email').value;
    const role = document.getElementById('account-role').value;
    const status = document.getElementById('account-status').value;
    const error = document.getElementById('account-form-error');

    if (!firstName || !lastName || !email) {
        error.textContent = 'First Name, Last Name, and Email are required.';
        error.classList.remove('hidden');
        return;
    }

    if (id) {
        // Editing existing account
        const account = accounts.find(a => a.id === id);
        if (account) {
            account.title = title;
            account.firstName = firstName;
            account.lastName = lastName;
            account.email = email;
            account.role = role;
            account.status = status;
        }
    } else {
        // Adding new account
        const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
        accounts.push({
            id: newId,
            title,
            firstName,
            lastName,
            email,
            role,
            status
        });
    }

    currentEditId = null;
    showSection('accounts');
}

// Employees functions
function renderEmployees() {
    const tbody = document.getElementById('employees-table-body');
    tbody.innerHTML = '';
    
    employees.forEach(emp => {
        const account = accounts.find(account => account.id === emp.userId);
        const dept = departments.find(d => d.id === emp.departmentId);
        tbody.innerHTML += `
            <tr>
                <td>${emp.employeeId}</td>
                <td>${account ? account.email : 'N/A'}</td>
                <td>${emp.position}</td>
                <td>${dept ? dept.name : 'N/A'}</td>
                <td>${new Date(emp.hireDate).toLocaleDateString()}</td>
                <td><span class="badge ${emp.status === 'Active' ? 'bg-success' : 'bg-danger'}">${emp.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-info action-btn" onclick="viewRequests(${emp.id})">Requests</button>
                    <button class="btn btn-sm btn-primary action-btn" onclick="showEmployeeForm(${emp.id})">Edit</button>
                </td>
            </tr>
        `;
    });
}

function showEmployeeForm(id) {
    currentEditId = id;
    document.getElementById('employee-form-title').textContent = id ? 'EDIT EMPLOYEE' : 'ADD EMPLOYEE';
    const employee = id ? employees.find(e => e.id === id) : null;
    
    document.getElementById('employee-id').value = employee ? employee.employeeId : `EMP${String(employees.length + 1).padStart(3, '0')}`;
    document.getElementById('employee-id').disabled = !!id;

    // Populate accounts dropdown
    const userSelect = document.getElementById('employee-user');
    let accountsToShow = accounts.filter(account => account.status === 'Active');
    
    if (employee && employee.userId) {
        const currentAssignedAccount = accounts.find(account => account.id === employee.userId);
        if (currentAssignedAccount && currentAssignedAccount.status === 'Inactive' && !accountsToShow.some(a => a.id === currentAssignedAccount.id)) {
            accountsToShow.push(currentAssignedAccount);
        }
    }
    
    userSelect.innerHTML = accountsToShow.map(account => {
        const displayText = `${account.email} (${account.firstName} ${account.lastName})${account.status === 'Inactive' ? ' [Inactive]' : ''}`;
        const isSelected = employee && employee.userId === account.id;
        return `<option value="${account.id}" ${isSelected ? 'selected' : ''}>${displayText}</option>`;
    }).join('');

    document.getElementById('employee-position').value = employee ? employee.position : '';
    
    // Populate departments dropdown
    const deptSelect = document.getElementById('employee-department');
    deptSelect.innerHTML = departments.map(d => `<option value="${d.id}" ${employee && employee.departmentId === d.id ? 'selected' : ''}>${d.name}</option>`).join('');
    
    document.getElementById('employee-hire-date').value = employee ? employee.hireDate : '';
    document.getElementById('employee-status').value = employee ? employee.status : 'Active';
    document.getElementById('employee-form-error').classList.add('hidden');
    showSection('employee-form');
}

function saveEmployee() {
    const employeeId = document.getElementById('employee-id').value;
    const userId = parseInt(document.getElementById('employee-user').value);
    const position = document.getElementById('employee-position').value;
    const departmentId = parseInt(document.getElementById('employee-department').value);
    const hireDate = document.getElementById('employee-hire-date').value;
    const status = document.getElementById('employee-status').value;
    const error = document.getElementById('employee-form-error');

    if (!employeeId || !userId || !position || !departmentId || !hireDate || !status) {
        error.textContent = 'All fields are required';
        error.classList.remove('hidden');
        return;
    }

    if (currentEditId) {
        const employee = employees.find(e => e.id === currentEditId);
        employee.employeeId = employeeId;
        employee.userId = userId;
        employee.position = position;
        employee.departmentId = departmentId;
        employee.hireDate = hireDate;
        employee.status = status;
    } else {
        const newEmployeeInternalId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        employees.push({
            id: newEmployeeInternalId,
            employeeId: employeeId,
            userId,
            position,
            departmentId,
            hireDate,
            status
        });
    }
    
    currentEditId = null;
    showSection('employees');
}

// Departments functions
function renderDepartments() {
    const tbody = document.getElementById('departments-table-body');
    tbody.innerHTML = '';
    
    departments.forEach(dept => {
        const employeeCount = employees.filter(e => e.departmentId === dept.id).length;
        tbody.innerHTML += `
            <tr>
                <td>${dept.name}</td>
                <td>${dept.description}</td>
                <td>${employeeCount}</td>
                <td>
                    <button class="btn btn-sm btn-primary action-btn" onclick="showDepartmentForm(${dept.id})">Edit</button>
                </td>
            </tr>
        `;
    });
}

function showDepartmentForm(id) {
    currentEditId = id;
    document.getElementById('department-form-title').textContent = id ? 'EDIT DEPARTMENT' : 'ADD DEPARTMENT';
    const department = id ? departments.find(d => d.id === id) : null;
    
    document.getElementById('department-name').value = department ? department.name : '';
    document.getElementById('department-description').value = department ? department.description : '';
    document.getElementById('department-form-error').classList.add('hidden');
    showSection('department-form');
}

function saveDepartment() {
    const name = document.getElementById('department-name').value;
    const description = document.getElementById('department-description').value;
    const error = document.getElementById('department-form-error');

    if (!name || !description) {
        error.textContent = 'All fields are required';
        error.classList.remove('hidden');
        return;
    }

    if (currentEditId) {
        const department = departments.find(d => d.id === currentEditId);
        department.name = name;
        department.description = description;
    } else {
        departments.push({
            id: departments.length + 1,
            name,
            description
        });
    }
    
    currentEditId = null;
    showSection('departments');
}

// Requests functions
function renderRequests() {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '';
    
    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No requests found.</td></tr>';
        return;
    }
    
    requests.forEach(req => {
        const employee = employees.find(e => e.id === req.employeeId);
        const account = employee ? accounts.find(acc => acc.id === employee.userId) : null;
        const employeeDisplay = account ? `${account.email} (${account.firstName} ${account.lastName})` : (employee ? employee.employeeId : 'N/A');
        
        let statusClass = 'bg-secondary';
        let statusTextClass = '';
        switch (req.status) {
            case 'Pending':
                statusClass = 'bg-warning';
                statusTextClass = 'text-dark';
                break;
            case 'Approved':
                statusClass = 'bg-success';
                break;
            case 'Rejected':
                statusClass = 'bg-danger';
                break;
        }
        
        tbody.innerHTML += `
            <tr>
                <td>${req.type}</td>
                <td>${employeeDisplay}</td>
                <td>
                    <ul class="list-unstyled">
                        ${req.requestItems.map(item => `<li>${item.name} (x${item.quantity})</li>`).join('')}
                    </ul>
                </td>
                <td>
                    <span class="badge ${statusClass} ${statusTextClass}">${req.status}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary action-btn" onclick="showRequestForm(${req.id})">Edit</button>
                </td>
            </tr>
        `;
    });
}

function showRequestForm(id) {
    currentEditId = id;
    document.getElementById('request-form-title').textContent = id ? 'EDIT REQUEST' : 'ADD REQUEST';
    const request = id ? requests.find(r => r.id === id) : null;
    
    document.getElementById('request-type').value = request ? request.type : 'Equipment';
    
    const employeeSelect = document.getElementById('request-employee');
    employeeSelect.innerHTML = employees.map(e => `<option value="${e.id}" ${request && request.employeeId === e.id ? 'selected' : ''}>${e.employeeId}</option>`).join('');
    
    const itemsDiv = document.getElementById('request-items');
    itemsDiv.innerHTML = '';
    if (request) {
        request.requestItems.forEach((item, index) => addRequestItem(item.name, item.quantity));
    } else {
        addRequestItem();
    }
    
    document.getElementById('request-form-error').classList.add('hidden');
    showSection('request-form');
}

function addRequestItem(name = '', quantity = 1) {
    const itemsDiv = document.getElementById('request-items');
    const index = itemsDiv.children.length;
    itemsDiv.innerHTML += `
        <div class="border p-2 mb-2" id="request-item-${index}">
            <div class="row">
                <div class="col-md-5">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control request-item-name" value="${name}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Quantity</label>
                    <input type="number" class="form-control request-item-quantity" value="${quantity}" min="1">
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-danger" onclick="removeRequestItem(${index})">Remove</button>
                </div>
            </div>
        </div>
    `;
}

function removeRequestItem(index) {
    document.getElementById(`request-item-${index}`).remove();
}

function saveRequest() {
    const type = document.getElementById('request-type').value;
    const employeeId = parseInt(document.getElementById('request-employee').value);
    const items = Array.from(document.querySelectorAll('#request-items > div')).map(div => ({
        name: div.querySelector('.request-item-name').value,
        quantity: parseInt(div.querySelector('.request-item-quantity').value)
    }));
    const error = document.getElementById('request-form-error');

    if (!type || !employeeId || items.length === 0 || items.some(item => !item.name || !item.quantity)) {
        error.textContent = 'All fields are required';
        error.classList.remove('hidden');
        return;
    }

    if (currentEditId) {
        const request = requests.find(r => r.id === currentEditId);
        request.type = type;
        request.employeeId = employeeId;
        request.requestItems = items;
    } else {
        const newRequestId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
        requests.push({
            id: newRequestId,
            employeeId,
            type,
            requestItems: items,
            status: 'Pending'
        });
    }
    
    currentEditId = null;
    showSection('requests');
}

// View requests function
function viewRequests(employeeId) {
    showSection('requests');
}

// Initial render
showSection('accounts');