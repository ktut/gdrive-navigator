<script lang="ts">
import { defineComponent } from 'vue'
import { File } from './types/files'
import { getMockData } from './services/getMockData'
import FileItem from './components/FileItem.vue'
import {
  gapiLoaded,
  gisLoaded,
  isReady,
  handleAuthClick,
  handleSignoutClick,
  listFiles,
  getFolderContents,
  mapDriveFileToFile,
} from './services/googleDrive'

export default defineComponent({
  name: 'App',
  components: {
    FileItem,
  },
  data() {
    return {
      files: [] as File[],
      expandedFolders: new Set<string>(),
      isAuthenticated: false,
      isLoading: false,
    }
  },
  mounted() {
    this.files = getMockData().map(mapDriveFileToFile)
    
    if (typeof window !== 'undefined') {
      if (window.gapi) {
        gapiLoaded()
      }
      if (window.google) {
        gisLoaded()
      }
    }
  },
  methods: {
    onAuthClick() {
      this.isLoading = true
      handleAuthClick(
        () => {
          this.isAuthenticated = true
          this.loadDriveFiles()
        },
        (error) => {
          console.error('Authentication error:', error)
          this.isLoading = false
          let errorMessage = 'Failed to authenticate. Please try again.'
          if (error?.error === 'access_denied') {
            errorMessage = 'Access denied.'
          }
          alert(errorMessage)
        }
      )
    },
    onSignoutClick() {
      handleSignoutClick()
      this.isAuthenticated = false
      this.files = getMockData().map(mapDriveFileToFile)
      this.expandedFolders.clear()
    },
    loadDriveFiles() {
      if (!isReady()) {
        this.isLoading = false
        return
      }

      this.isLoading = true
      listFiles(
        (files) => {
          this.files = files
          this.isLoading = false
        },
        (error) => {
          console.error('Error loading files:', error)
          this.isLoading = false
          alert('Failed to load files from Google Drive.')
        }
      )
    },
    toggleFolder(folder: File) {
      if (folder.type !== 'folder') return
      
      if (this.expandedFolders.has(folder.id)) {
        this.expandedFolders.delete(folder.id)
      } else {
        this.expandedFolders.add(folder.id)
        
        if (folder.contents === null) {
          if (this.isAuthenticated && isReady()) {
            this.isLoading = true
            getFolderContents(
              folder.id,
              (files) => {
                folder.contents = files
                this.isLoading = false
              },
              (error) => {
                console.error('Error loading folder contents:', error)
                this.isLoading = false
                alert('Failed to load folder contents.')
              }
            )
          } else {
            folder.contents = getMockData().map(mapDriveFileToFile)
          }
        }
      }
    },
    isExpanded(folderId: string): boolean {
      return this.expandedFolders.has(folderId)
    },
  },
  provide() {
    return {
      toggleFolder: this.toggleFolder,
      isExpanded: this.isExpanded,
    }
  },
})
</script>

<template>
  <div id="app">
    <nav class="header">
      <h1>GDrive Navigator</h1>
      <div class="auth-controls">
        <button
          v-if="!isAuthenticated"
          @click="onAuthClick"
          :disabled="isLoading"
          class="auth-button"
        >
          {{ isLoading ? 'Loading...' : 'Authenticate with Google' }}
        </button>
        <button
          v-else
          @click="onSignoutClick"
          class="auth-button signout-button"
        >
          Sign Out
        </button>
      </div>
    </nav>
    <div v-if="isLoading && files.length === 0" class="loading">
      Loading files...
    </div>
    <div v-else class="file-list">
      <FileItem
        v-for="file in files"
        :key="file.id"
        :file="file"
        :depth="0"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 2rem;
    scroll-behavior: smooth;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 800px;
    margin-bottom: 1rem;
}

.auth-controls {
    display: flex;
    align-items: center;
}

.auth-button {
    padding: 0.5rem 1rem;
    border: 1px solid $secondary-color;
    border-radius: 0.5rem;
    background-color: white;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        background-color: rgba(0, 0, 0, 0.05);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.signout-button {
    background-color: #f5f5f5;
}

.loading {
    padding: 2rem;
    text-align: center;
    color: #666;
}

.config-warning {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 0.5rem;
    color: #856404;
    max-width: 800px;
    width: 100%;

    p {
        margin: 0;
        font-size: 0.875rem;
    }

    code {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-family: monospace;
    }
}

.file-list {
    width: 100%;
    max-width: 800px;
    border-radius: 1rem;
    border: 1px solid $secondary-color;
    padding: 1rem;
}

</style>

