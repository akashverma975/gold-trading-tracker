# Deploying to GitHub Pages

Follow these steps to deploy your Gold Trading Tracker app to GitHub Pages:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository `gold-trading-tracker`
4. Choose whether to make it public or private
5. Click "Create repository"

## Step 2: Push Your Code to GitHub

1. Open your terminal/command prompt in your project directory
2. Initialize a git repository (if not already done):
   ```
   git init
   ```
3. Add your GitHub repository as remote:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/gold-trading-tracker.git
   ```
4. Add all files to git:
   ```
   git add .
   ```
5. Commit your changes:
   ```
   git commit -m "Initial commit"
   ```
6. Push to GitHub:
   ```
   git push -u origin main
   ```
   (If your default branch is `master` instead of `main`, use that instead)

## Step 3: Deploy to GitHub Pages

1. Make sure you've installed the gh-pages package:
   ```
   npm install gh-pages --save-dev
   ```
2. Run the deploy command:
   ```
   npm run deploy
   ```
3. Wait for the deployment to complete. This will:
   - Build your application
   - Create a gh-pages branch in your repository
   - Push the built files to that branch

## Step 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. You should see a message saying "Your site is published at https://YOUR_USERNAME.github.io/gold-trading-tracker/"
5. If not, make sure the Source is set to "gh-pages" branch

## Step 5: Access Your Deployed App

Your app should now be available at:
```
https://YOUR_USERNAME.github.io/gold-trading-tracker/
```

## Updating Your Deployed App

Whenever you make changes to your app and want to update the deployed version:

1. Commit your changes to git:
   ```
   git add .
   git commit -m "Your update message"
   git push
   ```
2. Run the deploy command again:
   ```
   npm run deploy
   ```

## Troubleshooting

- If you see a blank page, check the browser console for errors. You might need to update the base path in your app.
- Make sure your Firebase configuration is correct and that you've set up the proper security rules.
- If you're using environment variables, make sure they're properly configured for production.
