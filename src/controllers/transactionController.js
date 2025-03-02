export class TransactionController {
  constructor(transactionService, uiController) {
    this.transactionService = transactionService;
    this.ui = uiController;
    this.currentTransactionId = null;
  }
  
  async loadTransactions() {
    try {
      this.ui.showLoading();
      const transactions = await this.transactionService.getAllTransactions();
      this.ui.renderTransactions(transactions);
      await this.updateFilterOptions();
      this.ui.hideLoading();
    } catch (error) {
      console.error("Error loading transactions:", error);
      this.ui.hideLoading();
      this.ui.showToast("Failed to load transactions", "error");
    }
  }
  
  async updateFilterOptions() {
    try {
      const ornamentTypes = await this.transactionService.getUniqueOrnamentTypes();
      const retailers = await this.transactionService.getUniqueRetailers();
      this.ui.updateFilterOptions(ornamentTypes, retailers);
    } catch (error) {
      console.error("Error updating filter options:", error);
    }
  }
  
  showAddTransactionModal() {
    this.currentTransactionId = null;
    this.ui.setFormForNewTransaction();
  }
  
  async editTransaction(id) {
    try {
      this.ui.showLoading();
      const transaction = await this.transactionService.getTransactionById(id);
      if (transaction) {
        this.currentTransactionId = id;
        this.ui.setFormForEditTransaction(transaction);
      }
      this.ui.hideLoading();
    } catch (error) {
      console.error("Error editing transaction:", error);
      this.ui.hideLoading();
      this.ui.showToast("Failed to load transaction details", "error");
    }
  }
  
  async saveTransaction() {
    const formData = this.ui.getFormData();
    
    try {
      this.ui.showLoading();
      if (this.currentTransactionId) {
        // Update existing transaction
        await this.transactionService.updateTransaction(this.currentTransactionId, formData);
        this.ui.showToast('Transaction updated successfully');
      } else {
        // Create new transaction
        await this.transactionService.addTransaction(formData);
        this.ui.showToast('Transaction added successfully');
      }
      
      this.ui.closeModal('transactionModal');
      await this.loadTransactions();
      this.ui.hideLoading();
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      this.ui.hideLoading();
      this.ui.showToast('Failed to save transaction', 'error');
    }
  }
  
  showDeleteConfirmation(id) {
    this.ui.showDeleteConfirmation(id, (id) => this.deleteTransaction(id));
  }
  
  async deleteTransaction(id) {
    try {
      this.ui.showLoading();
      const success = await this.transactionService.deleteTransaction(id);
      
      if (success) {
        await this.loadTransactions();
        this.ui.showToast('Transaction deleted successfully');
      } else {
        this.ui.showToast('Transaction not found', 'error');
      }
      this.ui.hideLoading();
      
    } catch (error) {
      console.error('Error deleting transaction:', error);
      this.ui.hideLoading();
      this.ui.showToast('Failed to delete transaction', 'error');
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
      await this.loadTransactions();
      this.ui.showToast('Payment marked as paid');
      this.ui.hideLoading();
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      this.ui.hideLoading();
      this.ui.showToast('Failed to update payment status', 'error');
    }
  }
}
