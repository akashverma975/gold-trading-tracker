export class UIController {
  constructor() {
    // DOM Elements
    this.transactionsSection = document.getElementById('transactionsSection');
    this.remindersSection = document.getElementById('remindersSection');
    this.transactionsCardView = document.getElementById('transactionsCardView');
    this.remindersCardView = document.getElementById('remindersCardView');
    this.noTransactionsMessage = document.getElementById('noTransactionsMessage');
    this.noRemindersMessage = document.getElementById('noRemindersMessage');
    this.advancedSearchPanel = document.getElementById('advancedSearchPanel');
    this.transactionModal = document.getElementById('transactionModal');
    this.deleteConfirmModal = document.getElementById('deleteConfirmModal');
    this.toast = document.getElementById('toast');
    this.toastMessage = document.getElementById('toastMessage');
    this.toastIcon = document.getElementById('toastIcon');
    this.loadingIndicator = document.getElementById('loadingIndicator');
    
    // Form elements
    this.transactionForm = document.getElementById('transactionForm');
    this.transactionId = document.getElementById('transactionId');
    this.ornamentType = document.getElementById('ornamentType');
    this.weight = document.getElementById('weight');
    this.purity = document.getElementById('purity');
    this.margin = document.getElementById('margin');
    this.ratePerGram = document.getElementById('ratePerGram');
    this.transactionDate = document.getElementById('transactionDate');
    this.retailer = document.getElementById('retailer');
    this.paymentStatus = document.getElementById('paymentStatus');
    this.paymentDueDate = document.getElementById('paymentDueDate');
    this.notes = document.getElementById('notes');
    this.modalTitle = document.getElementById('modalTitle');
    
    // Filter elements
    this.searchInput = document.getElementById('searchInput');
    this.startDate = document.getElementById('startDate');
    this.endDate = document.getElementById('endDate');
    this.ornamentTypeFilter = document.getElementById('ornamentTypeFilter');
    this.retailerFilter = document.getElementById('retailerFilter');
    this.paymentStatusFilter = document.getElementById('paymentStatusFilter');
    
    // Navigation buttons
    this.showTransactionsBtn = document.getElementById('showTransactionsBtn');
    this.showRemindersBtn = document.getElementById('showRemindersBtn');
    this.mobileTransactionsBtn = document.getElementById('mobileTransactionsBtn');
    this.mobileRemindersBtn = document.getElementById('mobileRemindersBtn');
    this.mobileAddBtn = document.getElementById('mobileAddBtn');
    
    // Set up mobile navigation
    this.setupMobileNavigation();
  }
  
  setupMobileNavigation() {
    if (this.mobileTransactionsBtn) {
      this.mobileTransactionsBtn.addEventListener('click', () => {
        this.showTransactions();
        this.updateMobileNavActiveState('transactions');
      });
    }
    
    if (this.mobileRemindersBtn) {
      this.mobileRemindersBtn.addEventListener('click', () => {
        this.showReminders();
        this.updateMobileNavActiveState('reminders');
      });
    }
  }

  updateMobileNavActiveState(activeSection) {
    const allButtons = [this.mobileTransactionsBtn, this.mobileRemindersBtn];
    allButtons.forEach(btn => btn?.classList?.remove('active'));

    if (activeSection === 'transactions') {
      this.mobileTransactionsBtn?.classList?.add('active');
    } else if (activeSection === 'reminders') {
      this.mobileRemindersBtn?.classList?.add('active');
    }
  }

  showTransactions() {
    this.showTransactionsBtn?.classList.add('active');
    this.showRemindersBtn?.classList.remove('active');
    this.transactionsSection.classList.remove('hidden');
    this.remindersSection.classList.add('hidden');
  }

  showReminders() {
    this.showRemindersBtn?.classList.add('active');
    this.showTransactionsBtn?.classList.remove('active');
    this.remindersSection.classList.remove('hidden');
    this.transactionsSection.classList.add('hidden');
  }
  
  // Loading indicator methods
  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('hidden');
    }
  }
  
  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('hidden');
    }
  }
  
  // Toast notification methods
  showToast(message, type = 'success') {
    if (!this.toast || !this.toastMessage || !this.toastIcon) return;
    
    this.toastMessage.textContent = message;
    
    if (type === 'success') {
      this.toastIcon.className = 'fas fa-check-circle';
      this.toast.classList.add('toast-success');
      this.toast.classList.remove('toast-error');
    } else {
      this.toastIcon.className = 'fas fa-exclamation-circle';
      this.toast.classList.add('toast-error');
      this.toast.classList.remove('toast-success');
    }
    
    this.toast.classList.remove('hidden');
    this.toast.classList.add('show');
    
    setTimeout(() => {
      this.toast.classList.remove('show');
      setTimeout(() => {
        this.toast.classList.add('hidden');
      }, 300);
    }, 3000);
  }
  
  // Modal methods
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  
  // Form methods
  setFormForNewTransaction() {
    if (!this.transactionModal || !this.transactionForm || !this.modalTitle) return;
    
    this.modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Transaction';
    this.transactionForm.reset();
    this.transactionId.value = '';
    this.transactionDate.valueAsDate = new Date();
    this.transactionModal.classList.remove('hidden');
    this.togglePaymentDueDate();
  }
  
  setFormForEditTransaction(transaction) {
    if (!this.transactionModal || !this.modalTitle) return;
    
    this.modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Transaction';
    this.transactionId.value = transaction.id;
    this.ornamentType.value = transaction.ornament_type;
    this.weight.value = transaction.weight;
    this.purity.value = transaction.purity;
    this.margin.value = transaction.margin;
    this.ratePerGram.value = transaction.rate_per_gram;
    this.transactionDate.value = transaction.transaction_date;
    this.retailer.value = transaction.retailer;
    this.paymentStatus.value = transaction.payment_status;
    this.paymentDueDate.value = transaction.payment_due_date || '';
    this.notes.value = transaction.notes || '';
    
    this.transactionModal.classList.remove('hidden');
    this.togglePaymentDueDate();
  }
  
  getFormData() {
    return {
      ornament_type: this.ornamentType.value,
      weight: parseFloat(this.weight.value),
      purity: this.purity.value,
      margin: parseFloat(this.margin.value),
      rate_per_gram: parseFloat(this.ratePerGram.value),
      transaction_date: this.transactionDate.value,
      retailer: this.retailer.value,
      payment_status: this.paymentStatus.value,
      payment_due_date: this.paymentStatus.value === 'pending' ? this.paymentDueDate.value : null,
      notes: this.notes.value
    };
  }
  
  togglePaymentDueDate() {
    const paymentDueContainer = document.querySelector('.payment-due-container');
    if (paymentDueContainer && this.paymentStatus) {
      if (this.paymentStatus.value === 'pending') {
        paymentDueContainer.classList.remove('hidden');
      } else {
        paymentDueContainer.classList.add('hidden');
      }
    }
  }
  
  // Transaction rendering
  renderTransactions(transactions) {
    if (!this.transactionsCardView || !this.noTransactionsMessage) return;
    
    if (transactions.length === 0) {
      this.transactionsCardView.innerHTML = '';
      this.noTransactionsMessage.classList.remove('hidden');
      return;
    }
    
    this.noTransactionsMessage.classList.add('hidden');
    this.transactionsCardView.innerHTML = transactions.map(transaction => this.createTransactionCard(transaction)).join('');
    
    // Add event listeners to action buttons
    this.addTransactionCardEventListeners();
  }
  
  createTransactionCard(transaction) {
    const totalAmount = (transaction.weight * transaction.rate_per_gram * (1 + transaction.margin / 100)).toFixed(2);
    const formattedDate = new Date(transaction.transaction_date).toLocaleDateString();
    
    return `
      <div class="transaction-card" data-id="${transaction.id}">
        <div class="transaction-card-header">
          <h3>${transaction.ornament_type}</h3>
          <div class="transaction-date">
            <i class="far fa-calendar-alt"></i> ${formattedDate}
          </div>
        </div>
        <div class="transaction-card-body">
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-weight"></i> Weight</div>
            <div class="detail-value">${transaction.weight} g</div>
          </div>
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-certificate"></i> Purity</div>
            <div class="detail-value">${transaction.purity}</div>
          </div>
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-rupee-sign"></i> Rate/g</div>
            <div class="detail-value">₹${transaction.rate_per_gram}</div>
          </div>
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-percentage"></i> Margin</div>
            <div class="detail-value">${transaction.margin}%</div>
          </div>
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-money-bill-wave"></i> Total</div>
            <div class="detail-value">₹${totalAmount}</div>
          </div>
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-store"></i> Retailer</div>
            <div class="detail-value">${transaction.retailer}</div>
          </div>
          ${transaction.payment_due_date && transaction.payment_status === 'pending' ? `
          <div class="transaction-detail">
            <div class="detail-label"><i class="far fa-calendar-alt"></i> Due Date</div>
            <div class="detail-value ${this.isOverdue(transaction.payment_due_date) ? 'text-danger' : ''}">
              ${new Date(transaction.payment_due_date).toLocaleDateString()}
              ${this.isOverdue(transaction.payment_due_date) ? ' (Overdue)' : ''}
            </div>
          </div>
          ` : ''}
        </div>
        <div class="transaction-card-footer">
          <div class="status-badge ${transaction.payment_status === 'pending' ? 'status-pending' : 'status-paid'}">
            <i class="fas ${transaction.payment_status === 'pending' ? 'fa-clock' : 'fa-check-circle'}"></i>
            ${transaction.payment_status === 'pending' ? 'Pending' : 'Paid'}
          </div>
          <div class="card-actions">
            ${transaction.payment_status === 'pending' ? `
            <button class="mark-paid-btn" data-id="${transaction.id}">
              <i class="fas fa-check"></i> Mark Paid
            </button>
            ` : ''}
            <button class="action-btn edit-btn" data-id="${transaction.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-id="${transaction.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  isOverdue(dateString) {
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today;
  }
  
  addTransactionCardEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('edit-transaction', { detail: { id } }));
      });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('delete-transaction', { detail: { id } }));
      });
    });
    
    // Mark as paid buttons
    document.querySelectorAll('.mark-paid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('mark-paid', { detail: { id } }));
      });
    });
  }
  
  // Reminders rendering
  renderReminders(reminders) {
    if (!this.remindersCardView || !this.noRemindersMessage) return;
    
    if (reminders.length === 0) {
      this.remindersCardView.innerHTML = '';
      this.noRemindersMessage.classList.remove('hidden');
      return;
    }
    
    this.noRemindersMessage.classList.add('hidden');
    this.remindersCardView.innerHTML = reminders.map(reminder => this.createReminderCard(reminder)).join('');
    
    // Add event listeners to action buttons
    this.addReminderCardEventListeners();
  }
  
  createReminderCard(reminder) {
    const totalAmount = (reminder.weight * reminder.rate_per_gram * (1 + reminder.margin / 100)).toFixed(2);
    const dueDate = new Date(reminder.payment_due_date).toLocaleDateString();
    const isOverdue = this.isOverdue(reminder.payment_due_date);
    
    return `
      <div class="transaction-card ${isOverdue ? 'overdue' : ''}" data-id="${reminder.id}">
        <div class="transaction-card-header">
          <h3>${reminder.ornament_type}</h3>
          <div class="transaction-date ${isOverdue ? 'text-danger' : ''}">
            <i class="far fa-calendar-alt"></i> Due: ${dueDate}
            ${isOverdue ? ' (Overdue)' : ''}
          </div>
        </div>
        <div class="transaction-card-body">
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-store"></i> Retailer</div>
            <div class="detail-value">${reminder.retailer}</div>
          </div>
          <div class="transaction-detail">
            <div class="detail-label"><i class="fas fa-money-bill-wave"></i> Amount</div>
            <div class="detail-value">₹${totalAmount}</div>
          </div>
          <div class="transaction-detail">
            <div class="detail-label"><i class="far fa-calendar-alt"></i> Transaction Date</div>
            <div class="detail-value">${new Date(reminder.transaction_date).toLocaleDateString()}</div>
          </div>
        </div>
        <div class="transaction-card-footer">
          <div class="status-badge status-pending">
            <i class="fas fa-clock"></i> Payment Pending
          </div>
          <div class="card-actions">
            <button class="mark-paid-btn" data-id="${reminder.id}">
              <i class="fas fa-check"></i> Mark Paid
            </button>
            <button class="action-btn edit-btn" data-id="${reminder.id}">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  addReminderCardEventListeners() {
    // Mark as paid buttons
    document.querySelectorAll('.mark-paid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('mark-paid', { detail: { id } }));
      });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('edit-reminder', { detail: { id } }));
      });
    });
  }
  
  // Search and filter methods
  toggleAdvancedSearch() {
    if (this.advancedSearchPanel) {
      this.advancedSearchPanel.classList.toggle('hidden');
    }
  }
  
  getFilterData() {
    return {
      query: this.searchInput?.value || '',
      startDate: this.startDate?.value || '',
      endDate: this.endDate?.value || '',
      ornamentType: this.ornamentTypeFilter?.value || '',
      retailer: this.retailerFilter?.value || '',
      paymentStatus: this.paymentStatusFilter?.value || ''
    };
  }
  
  resetFilters() {
    if (this.searchInput) this.searchInput.value = '';
    if (this.startDate) this.startDate.value = '';
    if (this.endDate) this.endDate.value = '';
    if (this.ornamentTypeFilter) this.ornamentTypeFilter.value = '';
    if (this.retailerFilter) this.retailerFilter.value = '';
    if (this.paymentStatusFilter) this.paymentStatusFilter.value = '';
  }
  
  updateFilterOptions(ornamentTypes, retailers) {
    // Update ornament type filter options
    if (this.ornamentTypeFilter) {
      const currentValue = this.ornamentTypeFilter.value;
      let options = '<option value="">All</option>';
      
      ornamentTypes.forEach(type => {
        options += `<option value="${type}">${type}</option>`;
      });
      
      this.ornamentTypeFilter.innerHTML = options;
      this.ornamentTypeFilter.value = currentValue;
    }
    
    // Update retailer filter options
    if (this.retailerFilter) {
      const currentValue = this.retailerFilter.value;
      let options = '<option value="">All</option>';
      
      retailers.forEach(retailer => {
        options += `<option value="${retailer}">${retailer}</option>`;
      });
      
      this.retailerFilter.innerHTML = options;
      this.retailerFilter.value = currentValue;
    }
  }
  
  // Delete confirmation
  showDeleteConfirmation(id, deleteCallback) {
    if (!this.deleteConfirmModal) return;
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // Remove any existing event listeners
    const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
      this.closeModal('deleteConfirmModal');
      deleteCallback(id);
    });
    
    this.deleteConfirmModal.classList.remove('hidden');
  }
}
