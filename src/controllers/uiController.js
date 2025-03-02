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
  
  updateMobileNavActiveState(active) {
    if (this.mobileTransactionsBtn) {
      this.mobileTransactionsBtn.classList.toggle('active', active === 'transactions');
    }
    
    if (this.mobileRemindersBtn) {
      this.mobileRemindersBtn.classList.toggle('active', active === 'reminders');
    }
  }
  
  showTransactions() {
    if (this.showTransactionsBtn) this.showTransactionsBtn.classList.add('active');
    if (this.showRemindersBtn) this.showRemindersBtn.classList.remove('active');
    this.transactionsSection.classList.remove('hidden');
    this.remindersSection.classList.add('hidden');
    this.updateMobileNavActiveState('transactions');
  }
  
  showReminders() {
    if (this.showRemindersBtn) this.showRemindersBtn.classList.add('active');
    if (this.showTransactionsBtn) this.showTransactionsBtn.classList.remove('active');
    this.remindersSection.classList.remove('hidden');
    this.transactionsSection.classList.add('hidden');
    this.updateMobileNavActiveState('reminders');
  }
  
  toggleAdvancedSearch() {
    this.advancedSearchPanel.classList.toggle('hidden');
  }
  
  togglePaymentDueDate() {
    const paymentDueContainer = document.querySelector('.payment-due-container');
    
    if (this.paymentStatus.value === 'pending') {
      paymentDueContainer.classList.remove('hidden');
    } else {
      paymentDueContainer.classList.add('hidden');
      this.paymentDueDate.value = '';
    }
  }
  
  openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
  }
  
  closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
  }
  
  resetTransactionForm() {
    this.transactionForm.reset();
    this.transactionId.value = '';
    this.transactionDate.valueAsDate = new Date();
    this.togglePaymentDueDate();
  }
  
  setFormForNewTransaction() {
    this.modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Transaction';
    this.resetTransactionForm();
    this.openModal('transactionModal');
  }
  
  setFormForEditTransaction(transaction) {
    this.modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Transaction';
    this.transactionId.value = transaction.id;
    this.ornamentType.value = transaction.ornament_type;
    this.weight.value = transaction.weight.toFixed(4);
    this.purity.value = transaction.purity;
    this.margin.value = transaction.margin;
    this.ratePerGram.value = transaction.rate_per_gram;
    this.transactionDate.value = transaction.transaction_date;
    this.retailer.value = transaction.retailer;
    this.paymentStatus.value = transaction.payment_status;
    this.paymentDueDate.value = transaction.payment_due_date || '';
    this.notes.value = transaction.notes || '';
    
    this.togglePaymentDueDate();
    this.openModal('transactionModal');
  }
  
  getFormData() {
    return {
      id: this.transactionId.value,
      ornament_type: this.ornamentType.value,
      weight: parseFloat(this.weight.value),
      purity: this.purity.value,
      margin: parseFloat(this.margin.value),
      rate_per_gram: parseFloat(this.ratePerGram.value),
      transaction_date: this.transactionDate.value,
      retailer: this.retailer.value,
      payment_status: this.paymentStatus.value,
      payment_due_date: this.paymentDueDate.value || null,
      notes: this.notes.value
    };
  }
  
  getFilterData() {
    return {
      query: this.searchInput.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      ornamentType: this.ornamentTypeFilter.value,
      retailer: this.retailerFilter.value,
      paymentStatus: this.paymentStatusFilter.value
    };
  }
  
  resetFilters() {
    this.searchInput.value = '';
    this.startDate.value = '';
    this.endDate.value = '';
    this.ornamentTypeFilter.value = '';
    this.retailerFilter.value = '';
    this.paymentStatusFilter.value = '';
  }
  
  renderTransactions(transactions) {
    this.transactionsCardView.innerHTML = '';
    
    if (transactions.length === 0) {
      this.noTransactionsMessage.classList.remove('hidden');
      return;
    }
    
    this.noTransactionsMessage.classList.add('hidden');
    
    transactions.forEach(transaction => {
      const totalValue = (transaction.weight * transaction.rate_per_gram * (1 + transaction.margin / 100)).toFixed(2);
      
      const card = document.createElement('div');
      card.className = 'transaction-card';
      
      card.innerHTML = `
        <div class="transaction-card-header">
          <div class="transaction-date">
            <i class="far fa-calendar-alt"></i> ${this.formatDate(transaction.transaction_date)}
          </div>
          <span class="status-badge status-${transaction.payment_status}">
            <i class="fas ${transaction.payment_status === 'paid' ? 'fa-check-circle' : 'fa-clock'}"></i>
            ${this.capitalizeFirstLetter(transaction.payment_status)}
          </span>
        </div>
        <div class="transaction-card-body">
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-gem"></i> Ornament</span>
            <span class="detail-value">${transaction.ornament_type}</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-weight"></i> Weight</span>
            <span class="detail-value">${transaction.weight.toFixed(4)} g</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-certificate"></i> Purity</span>
            <span class="detail-value">${transaction.purity}</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-rupee-sign"></i> Rate/g</span>
            <span class="detail-value">${this.formatRupees(transaction.rate_per_gram)}</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-percentage"></i> Margin</span>
            <span class="detail-value">${transaction.margin}%</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-store"></i> Retailer</span>
            <span class="detail-value">${transaction.retailer}</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-rupee-sign"></i> Total</span>
            <span class="detail-value">${this.formatRupees(totalValue)}</span>
          </div>
        </div>
        <div class="transaction-card-footer">
          <div class="card-actions">
            <button class="action-btn edit-btn" data-id="${transaction.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-id="${transaction.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      
      this.transactionsCardView.appendChild(card);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('edit-transaction', { detail: { id } }));
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('delete-transaction', { detail: { id } }));
      });
    });
  }
  
  renderReminders(reminders) {
    this.remindersCardView.innerHTML = '';
    
    if (reminders.length === 0) {
      this.noRemindersMessage.classList.remove('hidden');
      return;
    }
    
    this.noRemindersMessage.classList.add('hidden');
    
    reminders.forEach(reminder => {
      const totalValue = (reminder.weight * reminder.rate_per_gram * (1 + reminder.margin / 100)).toFixed(2);
      const isPastDue = new Date(reminder.payment_due_date) < new Date();
      
      const card = document.createElement('div');
      card.className = 'transaction-card';
      
      card.innerHTML = `
        <div class="transaction-card-header">
          <div class="transaction-date ${isPastDue ? 'text-danger' : ''}">
            <i class="far fa-calendar-alt"></i> Due: ${this.formatDate(reminder.payment_due_date)}
          </div>
          <span class="status-badge status-pending">
            <i class="fas fa-clock"></i> Pending
          </span>
        </div>
        <div class="transaction-card-body">
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-store"></i> Retailer</span>
            <span class="detail-value">${reminder.retailer}</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-gem"></i> Ornament</span>
            <span class="detail-value">${reminder.ornament_type}</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-weight"></i> Weight</span>
            <span class="detail-value">${reminder.weight.toFixed(4)} g</span>
          </div>
          <div class="transaction-detail">
            <span class="detail-label"><i class="fas fa-rupee-sign"></i> Amount</span>
            <span class="detail-value">${this.formatRupees(totalValue)}</span>
          </div>
        </div>
        <div class="transaction-card-footer">
          <button class="mark-paid-btn" data-id="${reminder.id}">
            <i class="fas fa-check"></i> Mark Paid
          </button>
          <button class="action-btn edit-btn" data-id="${reminder.id}">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      `;
      
      this.remindersCardView.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.mark-paid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('mark-paid', { detail: { id } }));
      });
    });
    
    document.querySelectorAll('#remindersCardView .edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.dispatchEvent(new CustomEvent('edit-reminder', { detail: { id } }));
      });
    });
  }
  
  updateFilterOptions(ornamentTypes, retailers) {
    // Update ornament type filter
    this.ornamentTypeFilter.innerHTML = '<option value="">All</option>';
    
    ornamentTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      this.ornamentTypeFilter.appendChild(option);
    });
    
    // Update retailer filter
    this.retailerFilter.innerHTML = '<option value="">All</option>';
    
    retailers.forEach(retailer => {
      const option = document.createElement('option');
      option.value = retailer;
      option.textContent = retailer;
      this.retailerFilter.appendChild(option);
    });
  }
  
  showDeleteConfirmation(id, callback) {
    this.openModal('deleteConfirmModal');
    
    document.getElementById('confirmDeleteBtn').onclick = () => {
      callback(id);
      this.closeModal('deleteConfirmModal');
    };
  }
  
  showToast(message, type = 'success') {
    this.toastMessage.textContent = message;
    this.toast.className = 'toast toast-' + type;
    
    if (type === 'success') {
      this.toastIcon.className = 'fas fa-check-circle';
    } else {
      this.toastIcon.className = 'fas fa-exclamation-circle';
    }
    
    this.toast.classList.add('show');
    
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }
  
  showLoading() {
    this.loadingIndicator.classList.remove('hidden');
  }
  
  hideLoading() {
    this.loadingIndicator.classList.add('hidden');
  }
  
  // Utility methods
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  formatRupees(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN');
  }
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
