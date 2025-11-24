import { File } from '../types/files';

// Discovery doc URL for APIs used
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
// Authorization scopes required by the API
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

let tokenClient: any = null;
let gapiInited = false;
let gisInited = false;

// Callback after api.js is loaded.
export function gapiLoaded() {
  if (typeof window !== 'undefined' && window.gapi) {
    window.gapi.load('client', initializeGapiClient);
  }
}

// Callback after the API client is loaded. Loads the discovery doc to initialize the API.
function initializeGapiClient() {
  if (typeof window !== 'undefined' && window.gapi) {
    window.gapi.client.init({
      discoveryDocs: [DISCOVERY_DOC],
    }).then(() => {
      gapiInited = true;
    });
  }
}

// Callback after Google Identity Services are loaded.
export function gisLoaded() {
  if (typeof window !== 'undefined' && window.google) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID is not set');
      return;
    }

    try {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: () => {}, // defined later in handleAuthClick
      });
      gisInited = true;
    } catch (error) {
      console.error('Error initializing Google Identity Services:', error);
    }
  }
}

// Enables user interaction after all libraries are loaded.
export function isReady(): boolean {
  return gapiInited && gisInited;
}

// Sign in the user upon button click.
export function handleAuthClick(
  onSuccess: () => void,
  onError: (error: any) => void
): void {
  if (!isReady()) {
    onError(new Error('Google APIs not initialized'));
    return;
  }

  tokenClient.callback = (resp: any) => {
    if (resp.error !== undefined) {
      onError(resp);
      return;
    }
    onSuccess();
  };

  if (typeof window !== 'undefined' && window.gapi?.client) {
    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }
}

// Sign out the user upon button click.
export function handleSignoutClick(): void {
  if (typeof window !== 'undefined' && window.gapi?.client) {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      if (window.google?.accounts?.oauth2) {
        window.google.accounts.oauth2.revoke(token.access_token);
      }
      window.gapi.client.setToken('');
    }
  }
}

// Checks if user is authenticated.
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined' || !window.gapi?.client) {
    return false;
  }
  return window.gapi.client.getToken() !== null;
}

// Convert Google Drive file object to our File type.
export function mapDriveFileToFile(driveFile: any): File {
  const isFolder = driveFile.mimeType === 'application/vnd.google-apps.folder';
  return {
    id: driveFile.id,
    filename: driveFile.name,
    type: isFolder ? 'folder' : 'file',
    contents: null,
  };
}

// List files from Google Drive.
export function listFiles(
  onSuccess: (files: File[]) => void,
  onError: (error: any) => void
): void {
  if (typeof window === 'undefined' || !window.gapi?.client?.drive?.files) {
    onError(new Error('Google API not initialized'));
    return;
  }

  window.gapi.client.drive.files.list({
    pageSize: 100,
    fields: 'files(id, name, mimeType)',
    q: "'root' in parents and trashed = false",
    orderBy: 'folder, name',
  }).then((response: any) => {
    const driveFiles = response.result.files;
    if (!driveFiles || driveFiles.length === 0) {
      onSuccess([]);
      return;
    }

    const files = driveFiles.map(mapDriveFileToFile);
    onSuccess(files);
  }).catch((err: any) => {
    onError(err);
  });
}

// Get folder contents from Google Drive.
export function getFolderContents(
  folderId: string,
  onSuccess: (files: File[]) => void,
  onError: (error: any) => void
): void {
  if (typeof window === 'undefined' || !window.gapi?.client?.drive?.files) {
    onError(new Error('Google API not initialized'));
    return;
  }

  window.gapi.client.drive.files.list({
    pageSize: 100,
    fields: 'files(id, name, mimeType)',
    q: `'${folderId}' in parents and trashed = false`,
    orderBy: 'folder, name',
  }).then((response: any) => {
    const driveFiles = response.result.files;
    if (!driveFiles || driveFiles.length === 0) {
      onSuccess([]);
      return;
    }

    const files = driveFiles.map(mapDriveFileToFile);
    onSuccess(files);
  }).catch((err: any) => {
    onError(err);
  });
}

