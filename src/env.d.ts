/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string
  readonly VITE_GOOGLE_REDIRECT_URI: string
  readonly VITE_FRONTEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// had no idea how to get the types for the Google API, so: thank you Cursor!
declare global {
  interface Window {
    gapi: any;
    google: any;
    gapiLoaded?: () => void;
    gisLoaded?: () => void;
  }
}

declare namespace gapi {
  namespace client {
    function init(config: { discoveryDocs: string[] }): Promise<void>;
    function getToken(): { access_token: string } | null;
    function setToken(token: string | null): void;
    namespace drive {
      namespace files {
        function list(params: {
          pageSize?: number;
          fields?: string;
          q?: string;
          orderBy?: string;
        }): Promise<{
          result: {
            files: Array<{
              id: string;
              name: string;
              mimeType: string;
            }>;
          };
        }>;
      }
    }
  }
  function load(api: string, callback: () => void): void;
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      function initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: { error?: any; access_token?: string }) => void;
      }): {
        requestAccessToken: (options?: { prompt?: string }) => void;
        callback: (response: { error?: any; access_token?: string }) => void;
      };
      function revoke(token: string): void;
    }
  }
}

