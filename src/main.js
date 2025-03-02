import { TransactionService } from './services/transactionService.js';
import { UIController } from './controllers/uiController.js';
import { TransactionController } from './controllers/transactionController.js';
import { ReminderController } from './controllers/reminderController.js';
import { SearchController } from './controllers/searchController.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  // Show loading indicator
  const uiController = new UIController();
  uiController.showLoading();
  
  try {
    // Initialize services
    const transactionService = new TransactionService();
    
    // Initialize controllers
    const transactionController = new TransactionController(transactionService, uiController);
    const reminderController = new ReminderController(transactionService, uiController);
    const searchController = new SearchController(transactionService, uiController);
    
    // Share controller instances
    reminderController.transactionController = transactionController;
    
    // Set up event listeners
    setupEventListeners(uiController, transactionController, reminderController, searchController);
    
    // Set up custom event listeners
    setupCustomEventListeners(transactionController, reminderController);
    
    // Load initial data
    await transactionService.loadTransactions();
    await transactionController.loadTransactions();
    
    // Hide loading indicator
    uiController.hideLoading();
  } catch (error) {
    console.error("Error initializing application:", error);
    uiController.hideLoading();
    uiController.showToast("Failed to load application. Please refresh the page.", "error");
  }
});

function setupEventListeners(ui, transactionCtrl, reminderCtrl, searchCtrl) {
  // Navigation
  document.getElementById('showTransactionsBtn')?.addEventListener('click', async () => {
    ui.showTransactions();
    await transactionCtrl.loadTransactions();
  });
  
  document.getElementById('showRemindersBtn')?.addEventListener('click', async () => {
    ui.showReminders();
    await reminderCtrl.loadReminders();
  });
  
  // Transaction form
  document.getElementById('addTransactionBtn')?.addEventListener('click', () => {
    transactionCtrl.showAddTransactionModal();
  });
  
  document.getElementById('mobileAddBtn')?.addEventListener('click', () => {
    transactionCtrl.showAddTransactionModal();
  });
  
  document.getElementById('transactionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await transactionCtrl.saveTransaction();
    
    // Also refresh reminders if needed
    if (!ui.remindersSection.classList.contains('hidden')) {
      await reminderCtrl.loadReminders();
    }
  });
  
  document.getElementById('paymentStatus')?.addEventListener('change', () => {
    ui.togglePaymentDueDate();
  });
  
  // Modal controls
  document.querySelector('.close-btn')?.addEventListener('click', () => {
    ui.closeModal('transactionModal');
  });
  
  document.getElementById('closeDeleteModal')?.addEventListener('click', () => {
    ui.closeModal('deleteConfirmModal');
  });
  
  document.getElementById('cancelTransactionBtn')?.addEventListener('click', () => {
    ui.closeModal('transactionModal');
  });
  
  document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => {
    ui.closeModal('deleteConfirmModal');
  });
  
  // Search and filters
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    searchCtrl.handleSearch(e.target.value);
  });
  
  document.getElementById('advancedSearchBtn')?.addEventListener('click', () => {
    ui.toggleAdvancedSearch();
  });
  
  document.getElementById('applyFiltersBtn')?.addEventListener('click', async () => {
    await searchCtrl.applyFilters();
  });
  
  document.getElementById('resetFiltersBtn')?.addEventListener('click', async () => {
    await searchCtrl.resetFilters();
  });
}

function setupCustomEventListeners(transactionCtrl, reminderCtrl) {
  // Custom events for card actions
  document.addEventListener('edit-transaction', async (e) => {
    await transactionCtrl.editTransaction(e.detail.id);
  });
  
  document.addEventListener('delete-transaction', async (e) => {
    transactionCtrl.showDeleteConfirmation(e.detail.id);
  });
  
  document.addEventListener('mark-paid', async (e) => {
    await reminderCtrl.markAsPaid(e.detail.id);
  });
  
  document.addEventListener('edit-reminder', async (e) => {
    await reminderCtrl.editReminder(e.detail.id);
  });
}
