# About
IMPORTANT:
This is NOT a standard method of integrating Google Drive authentication. In a production app, you should use your own backend service to call this API.
This is a Vue 3 TypeScript application for navigating and displaying the folder contents of a Google Account's Google Drive.

## How was this built?

Initially I was uncomfortable with the Google Drive API, as it seemed pretty complicated and I have never used it before. Therefore, I started by building the app with static data. I then wrote my own schema (which seemed pretty straightforward) and used that to create a mock service that returned data according to that schema.

Next, I added E2E tests. In a production application, you might run these on commit, or on build in your code repository (depending on workflow).

Lastly, I integrated the real API.


## Project Setup

```sh
npm install
```

### Environment Variables

Each developer needs to set up their own Google OAuth credentials:

1. **Create a Google Cloud Project** (or use existing):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Drive API**:
   - Navigate to **APIs & Services** > **Library**
   - Search for "Google Drive API" and enable it

3. **Configure OAuth Consent Screen**:
   - Go to **APIs & Services** > **OAuth consent screen**
   - Select **External** user type
   - Fill in required fields (App name, User support email, etc.)
   - Set Publishing status to **Testing**
   - Add your Google account email to **Test users**

4. **Create OAuth 2.0 Client ID**:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: "GDrive Navigator" (or any name)
   - **Authorized JavaScript origins**: Add `http://localhost:5173`
   - Click **Create**
   - Copy the **Client ID**

5. **Set up local environment**:
   ```sh
   cp .env.example .env
   ```
   Then edit `.env` and add your Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

**Note**: The `.env` file is gitignored, so each developer maintains their own credentials.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Run tests

```sh
npm run test:e2e
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Project Structure

- Components use Vue Options API with script, template, and style tags in that order
- Global SASS styles are configured via `src/styles/global.scss`
- SASS variables are available globally via `src/styles/variables.scss`
- TypeScript is configured for strict type checking

