<script lang="ts">
import { defineComponent } from 'vue'
import { File } from './types/files'
import { getMockData } from './services/getMockData'
import FileItem from './components/FileItem.vue'

export default defineComponent({
  name: 'App',
  components: {
    FileItem,
  },
  data() {
    return {
      files: [] as File[],
      expandedFolders: new Set<number>(),
    }
  },
  mounted() {
    this.files = getMockData()
  },
  methods: {
    toggleFolder(folder: File) {
      if (folder.type !== 'folder') return
      
      if (folder.contents === null) {
        folder.contents = getMockData()
      }
      
      if (this.expandedFolders.has(folder.id)) {
        this.expandedFolders.delete(folder.id)
      } else {
        this.expandedFolders.add(folder.id)
      }
    },
    isExpanded(folderId: number): boolean {
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
    <h1>GDrive Navigator</h1>
    <div class="file-list">
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

.file-list {
    width: 100%;
    max-width: 800px;
    border-radius: 1rem;
    border: 1px solid $secondary-color;
    padding: 1rem;
}

</style>

