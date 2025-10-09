# Vue Auth SDK Setup Instructions

## 🚀 Quick Setup

### 1. Install Node.js Dependencies

Run the following commands in your terminal:

```bash
# Install dependencies
npm install

# If you encounter any issues, try clearing cache first
npm cache clean --force
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application should open automatically at `http://localhost:3000`

### 3. If You See TypeScript/Vue Errors

The errors you're seeing are related to Vue language server not finding the node_modules. Here's how to fix them:

**Option 1: Install dependencies first**
```bash
npm install
```

**Option 2: If errors persist, restart VS Code/IDE**
- Close your IDE completely
- Reopen the project folder
- The Vue language server should now recognize the installed dependencies

**Option 3: Manual fix in IDE**
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Vue: Restart Vue and TS servers"
- Select and run this command

### 4. Project Structure

After installation, your project should have:
```
vue-auth-sdk/
├── node_modules/          # Dependencies (created after npm install)
├── src/                   # Source code
├── package.json           # Project configuration
├── vite.config.js         # Vite configuration
├── jsconfig.json          # JavaScript/Vue configuration
└── README.md              # Documentation
```

### 5. Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### 6. Testing the SDK

Once running, you can test:
- Login form with validation
- Registration with password strength indicator
- Forgot password flow
- OTP verification
- Theme switching (light/dark)
- Responsive design on different screen sizes

### 7. Common Issues & Solutions

**Issue: "Failed to write global types file"**
- Solution: Run `npm install` to create node_modules directory

**Issue: Components not found**
- Solution: Make sure all files are saved and restart the dev server

**Issue: SCSS compilation errors**
- Solution: Check that all SCSS files exist in the styles directory

**Issue: Port 3000 already in use**
- Solution: The config will automatically find another available port

### 8. Next Steps

After successful setup:
1. Explore the authentication flow
2. Customize the theme colors in `src/styles/_variables.scss`
3. Modify API endpoints in `src/store/modules/auth.js`
4. Add your own components using the existing patterns

## 🎯 Ready to Go!

Your Vue Auth SDK should now be running successfully. Check the browser console for any remaining issues and refer to the main README.md for detailed usage instructions.
