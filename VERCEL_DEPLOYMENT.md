# Vercel Deployment Configuration

## Important: Root Directory Setup Required

For this monorepo structure, you **MUST** configure the Root Directory in Vercel Dashboard:

### Steps to Fix Deployment:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **General**

2. **Find "Root Directory"** section

3. **Click "Edit"** and set it to: `clients`

4. **Save** the settings

5. **Redeploy** your project

### Alternative: Manual Build Settings

If Root Directory doesn't work, configure these manually in **Settings** → **Build & Development Settings**:

- **Framework Preset**: `Create React App`
- **Root Directory**: `clients` (IMPORTANT!)
- **Build Command**: `npm run build` (leave as default)
- **Output Directory**: `build` (leave as default)
- **Install Command**: `npm install` (leave as default)

### Why This is Needed:

The project structure is:
```
instamart/
├── clients/          ← React app is here
│   ├── package.json  ← Contains react-scripts
│   └── src/
├── server/           ← Backend (not needed for frontend deploy)
└── package.json      ← Root package.json
```

Vercel needs to know to treat `clients/` as the root directory so it can:
- Find `package.json` with `react-scripts` dependency
- Install dependencies in the correct location
- Run build commands from the correct directory

### After Configuration:

Once Root Directory is set to `clients`, Vercel will:
1. Change to `clients/` directory
2. Run `npm install` (installs react-scripts)
3. Run `npm run build` (builds the React app)
4. Serve files from `clients/build/`
