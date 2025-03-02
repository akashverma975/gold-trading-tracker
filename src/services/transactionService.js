import { db } from './firebaseConfig.js';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

export class TransactionService {
  constructor() {
    this.transactionsCollection = collection(db, 'transactions');
    this.transactions = [];
    this.isLoaded = false;
  }
  
  async loadTransactions() {
    if (!this.isLoaded) {
      try {
        const querySnapshot = await getDocs(
          query(this.transactionsCollection, orderBy('transaction_date', 'desc'))
        );
        
        this.transactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp to Date string if needed
          transaction_date: doc.data().transaction_date,
          payment_due_date: doc.data().payment_due_date
        }));
        
        this.isLoaded = true;
      } catch (error) {
        console.error("Error loading transactions:", error);
        throw error;
      }
    }
    
    return this.transactions;
  }
  
  async getAllTransactions() {
    await this.loadTransactions();
    return [...this.transactions].sort((a, b) => 
      new Date(b.transaction_date) - new Date(a.transaction_date)
    );
  }
  
  async getTransactionById(id) {
    await this.loadTransactions();
    return this.transactions.find(t => t.id === id);
  }
  
  async getReminders() {
    await this.loadTransactions();
    return this.transactions
      .filter(t => t.payment_status === 'pending' && t.payment_due_date)
      .sort((a, b) => new Date(a.payment_due_date) - new Date(b.payment_due_date));
  }
  
  async addTransaction(transaction) {
    try {
      // Add document to Firestore
      const docRef = await addDoc(this.transactionsCollection, transaction);
      
      // Add to local cache
      const newTransaction = { id: docRef.id, ...transaction };
      this.transactions.push(newTransaction);
      
      return newTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }
  
  async updateTransaction(id, updatedData) {
    try {
      // Update document in Firestore
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, updatedData);
      
      // Update in local cache
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.transactions[index] = { ...this.transactions[index], ...updatedData };
        return this.transactions[index];
      }
      
      return null;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }
  
  async deleteTransaction(id) {
    try {
      // Delete document from Firestore
      const docRef = doc(db, 'transactions', id);
      await deleteDoc(docRef);
      
      // Remove from local cache
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.transactions.splice(index, 1);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
  
  async searchTransactions(params = {}) {
    await this.loadTransactions();
    
    const { query, startDate, endDate, ornamentType, retailer, paymentStatus } = params;
    
    return this.transactions.filter(transaction => {
      // Text search
      if (query) {
        const searchTerm = query.toLowerCase();
        const matchesQuery = 
          transaction.ornament_type.toLowerCase().includes(searchTerm) ||
          transaction.retailer.toLowerCase().includes(searchTerm) ||
          (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm));
          
        if (!matchesQuery) return false;
      }
      
      // Date range
      if (startDate && endDate) {
        const transactionDate = new Date(transaction.transaction_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        
        if (transactionDate < start || transactionDate > end) return false;
      } else if (startDate) {
        const transactionDate = new Date(transaction.transaction_date);
        const start = new Date(startDate);
        
        if (transactionDate < start) return false;
      } else if (endDate) {
        const transactionDate = new Date(transaction.transaction_date);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        
        if (transactionDate > end) return false;
      }
      
      // Ornament type
      if (ornamentType && transaction.ornament_type !== ornamentType) return false;
      
      // Retailer
      if (retailer && transaction.retailer !== retailer) return false;
      
      // Payment status
      if (paymentStatus && transaction.payment_status !== paymentStatus) return false;
      
      return true;
    }).sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
  }
  
  async getUniqueOrnamentTypes() {
    await this.loadTransactions();
    return [...new Set(this.transactions.map(t => t.ornament_type))];
  }
  
  async getUniqueRetailers() {
    await this.loadTransactions();
    return [...new Set(this.transactions.map(t => t.retailer))];
  }
  
  // Helper method to refresh data from Firestore
  async refreshData() {
    this.isLoaded = false;
    await this.loadTransactions();
  }
}
