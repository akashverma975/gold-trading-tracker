export class SearchController {
  constructor(transactionService, uiController) {
    this.transactionService = transactionService;
    this.ui = uiController;
  }
  
  async handleSearch(query) {
    try {
      if (!query) {
        const transactions = await this.transactionService.getAllTransactions();
        this.ui.renderTransactions(transactions);
        return;
      }
      
      const filtered = await this.transactionService.searchTransactions({ query });
      this.ui.renderTransactions(filtered);
    } catch (error) {
      console.error("Error searching transactions:", error);
      this.ui.showToast("Failed to search transactions", "error");
    }
  }
  
  async applyFilters() {
    try {
      const filterData = this.ui.getFilterData();
      const filteredTransactions = await this.transactionService.searchTransactions(filterData);
      this.ui.renderTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error applying filters:", error);
      this.ui.showToast("Failed to apply filters", "error");
    }
  }
  
  async resetFilters() {
    try {
      this.ui.resetFilters();
      const transactions = await this.transactionService.getAllTransactions();
      this.ui.renderTransactions(transactions);
    } catch (error) {
      console.error("Error resetting filters:", error);
      this.ui.showToast("Failed to reset filters", "error");
    }
  }
}
