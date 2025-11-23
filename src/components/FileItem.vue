<script lang="ts">
import { defineComponent } from 'vue'
import { File } from '../types/files'

export default defineComponent({
  name: 'FileItem',
  props: {
    file: {
      type: Object as () => File,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  inject: ['toggleFolder', 'isExpanded'],
  methods: {
    handleToggleFolder(folder: File) {
      (this as any).toggleFolder(folder)
    },
    checkExpanded(folderId: number): boolean {
      return (this as any).isExpanded(folderId)
    },
  },
})
</script>

<template>
  <div class="file-item" :class="{ 'is-folder': file.type === 'folder', 'is-file': file.type === 'file' }">
    <div
      v-if="file.type === 'folder'"
      class="folder-item"
      @click="handleToggleFolder(file)"
    >
      <span class="arrow" :class="{ expanded: checkExpanded(file.id) }">
        {{ checkExpanded(file.id) ? '▼' : '▶' }}
      </span>
      <span class="filename">{{ file.filename }}</span>
    </div>
    <div v-else class="file-item-content">
      <span class="filename">{{ file.filename }}</span>
    </div>
    
    <div
      v-if="file.type === 'folder' && checkExpanded(file.id) && file.contents"
      class="nested-files"
    >
      <FileItem
        v-for="nestedFile in file.contents"
        :key="nestedFile.id"
        :file="nestedFile"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-item {
    margin: 0.25rem 0;
    cursor: default;
    
    &.is-folder {
        .folder-item {
            cursor: pointer;
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border-radius: 4px;
            transition: background-color 0.2s;
            
            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
        }
    }
    
    &.is-file {
        .file-item-content {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            padding-left: 1.5rem;
        }
    }
    
    &.nested {
        margin-left: 0;
    }
}

.arrow {
    display: inline-block;
    width: 1rem;
    margin-right: 0.5rem;
    font-size: 0.75rem;
    transition: transform 0.2s;
}

.filename {
    user-select: none;
}

.nested-files {
    margin-left: 1rem;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 0.5rem;
}
</style>

