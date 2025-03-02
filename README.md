# Gold Trading Tracker

A sleek, minimalist web application for tracking gold trading transactions. Built with Vite and Firebase.

## Features

- Track gold ornament transactions with detailed information
- Record weight (up to 4 decimal places), purity, margin, and rate per gram in rupees
- Payment reminder system for pending payments
- Advanced search and filtering capabilities
- Responsive design for both desktop and mobile
- Mobile-friendly interface with intuitive navigation

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Firebase account
- GitHub account

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database in your project
3. Go to Project Settings > General > Your apps > Web app
4. Register a new web app and get your Firebase configuration
5. Update the `firebaseConfig` object in `src/services/firebaseConfig.js` with your credentials

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Deployment to GitHub Pages

1. Create a GitHub repository for your project
2. Initialize git in your project folder (if not already done):
   ```
   git init
   ```
3. Add your GitHub repository as remote:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/gold-trading-tracker.git
   ```
4. Commit your changes:
   ```
   git add .
   git commit -m "Initial commit"
   ```
5. Push to GitHub:
   ```
   git push -u origin main
   ```
6. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```
7. Your app will be available at: `https://YOUR_USERNAME.github.io/gold-trading-tracker/`

## Usage

- **Add Transaction**: Click the "+" button to add a new gold transaction
- **Edit/Delete**: Use the action buttons on each transaction card
- **Payment Reminders**: Switch to the "Reminders" tab to view pending payments
- **Search**: Use the search box or advanced filters to find specific transactions

## License

MIT
