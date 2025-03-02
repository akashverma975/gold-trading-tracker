document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const showTransactionsBtn = document.getElementById('showTransactionsBtn');
  const showRemindersBtn = document.getElementById('showRemindersBtn');
  const transactionsSection = document.getElementById('transactionsSection');
  const remindersSection = document.getElementById('remindersSection');
  const addTransactionBtn = document.getElementById('addTransactionBtn');
  const transactionModal = document.getElementById('transactionModal');
  const modalTitle = document.getElementById('modalTitle');
  const transactionForm = document.getElementById('transactionForm');
  const closeBtn = document.querySelector('.close-btn');
  const cancelTransactionBtn = document.getElementById('cancelTransactionBtn');
  const transactionsTableBody = document.getElementById('transactionsTableBody');
  const remindersTableBody = document.getElementById('remindersTableBody');
  const noTransactionsMessage = document.getElementById('noTransactionsMessage');
  const noRemindersMessage = document.getElementById('noRemindersMessage');
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const searchInput = document.getElementById('searchInput');
  const advancedSearchBtn = document.getElementById('advancedSearchBtn');
  const advancedSearchPanel = document.getElementById('advancedSearchPanel');
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const paymentStatus = document.getElementById('paymentStatus');
  const paymentDueDate = document.getElementById('paymentDueDate');
  const paymentDueContainer = document.querySelector('.payment-due-container');

  // State
  let transactions = [];
  let reminders = [];
  let currentTransactionId = null;
  let ornamentTypes = new Set();
  let retailers = new Set();
  
  // Initialize
  loadTransactions();
  loadReminders();
  
  // Event Listeners
  showTransactionsBtn.addEventListener('click', showTransactions);
  showRemindersBtn.addEventListener('click', showReminders);
  addTransactionBtn.addEventListener('click', showAddTransactionModal);
  closeBtn.addEventListener('click', closeModal);
  cancelTransactionBtn.addEventListener('click', closeModal);
  transactionForm.addEventListener('submit', handleTransactionSubmit);
  cancelDeleteBtn.addEventListener('click', () => {
    deleteConfirmModal.classList.add('hidden');
  });
  searchInput.addEventListener('input', handleSearch);
  advancedSearchBtn.addEventListener('click', toggleAdvancedSearch);
  applyFiltersBtn.addEventListener('click', applyFilters);
  resetFiltersBtn.addEventListener('click', resetFilters);
  paymentStatus.addEventListener('change', togglePaymentDueDate);
  
  // Functions
  function showTransactions() {
    showTransactionsBtn.classList.add('active');
    showRemindersBtn.classList.remove('active');
    transactionsSection.classList.remove('hidden');
    remindersSection.classList.add('hidden');
  }
  
  function showReminders() {
    showRemindersBtn.classList.add('active');
    showTransactionsBtn.classList.remove('active');
    remindersSection.classList.remove('hidden');
    transactionsSection.classList.add('hidden');
    loadReminders();
  }
  
  function showAddTransactionModal() {
    modalTitle.textContent = 'Add New Transaction';
    transactionForm.reset();
    document.getElementById('transactionId').value = '';
    document.getElementById('transactionDate').valueAsDate = new Date();
    currentTransactionId = null;
    transactionModal.classList.remove('hidden');
    togglePaymentDueDate();
  }
  
  function showEditTransactionModal(transaction) {
    modalTitle.textContent = 'Edit Transaction';
    document.getElementById('transactionId').value = transaction.id;
    document.getElementById('ornamentType').value = transaction.ornament_type;
    document.getElementById('weight').value = transaction.weight;
    document.getElementById('purity').value = transaction.purity;
    document.getElementById('margin').value = transaction.margin;
    document.getElementById('ratePerGram').value = transaction.rate_per_gram;
    document.getElementById('transactionDate').value = transaction.transaction_date;
    document.getElementById('retailer').value = transaction.retailer;
    document.getElementById('paymentStatus').value = transaction.payment_status;
    document.getElementById('paymentDueDate').value = transaction.payment_due_date || '';
    document.getElementById('notes').value = transaction.notes || '';
    
    currentTransactionId = transaction.id;
    transactionModal.classList.remove('hidden');
    togglePaymentDueDate();
