import { TransactionController } from './transactionController.js';

export class ReminderController {
  constructor(transactionService, uiController) {
    this.transactionService = transactionService;
    this.ui = uiController;
    this.transactionController = null;
  }
  
  async loadReminders() {
    try {
      this.ui.showLoading();
      const reminders = await this.transactionService.getReminders();
      this.ui.renderReminders(reminders);
      this.ui.hideLoading();
    } catch (error) {
      console.error("Error loading reminders:", error);
      this.ui.hideLoading();
      this.ui.showToast("Failed to load payment reminders", "error");
    }
  }
  
  async markAsPaid(id) {
    try {
      this.ui.showLoading();
      const transaction = await this.transactionService.getTransactionById(id);
      if (!transaction) {
        this.ui.showToast('Transaction not found', 'error');
        this.ui.hideLoading();
        return;
      }
      
      await this.transactionService.updateTransaction(id, { payment_status: 'paid' });
      await this.loadReminders();
      
      // Also refresh the transactions view if it's visible
      if (!this.ui.transactionsSection.classList.contains('hidden')) {
        if (!this.transactionController) {
          this.transactionController = new TransactionController(this.transactionService, this.ui);
        }
        await this.transactionController.loadTransactions();
      }
      
      this.ui.showToast('Payment marked as paid');
      this.ui.hideLoading();
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      this.ui.hideLoading();
      this.ui.showToast('Failed to update payment status', 'error');
    }
  }
  
  async editReminder(id) {
    try {
      this.ui.showLoading();
      const transaction = await this.transactionService.getTransactionById(id);
      if (transaction) {
        // Switch to transactions view
        this.ui.showTransactions();
        
        // Open edit modal for this transaction
        if (!this.transactionController) {
          this.transactionController = new TransactionController(this.transactionService, this.ui);
        }
        await this.transactionController.editTransaction(id);
      }
      this.ui.hideLoading();
    } catch (error) {
      console.error("Error editing reminder:", error);
      this.ui.hideLoading();
      this.ui.showToast("Failed to load transaction details", "error");
    }
  }
}
