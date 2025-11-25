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
    checkExpanded(folderId: string): boolean {
      return (this as any).isExpanded(folderId)
    },
  },
})
</script>

<template>
  <button class="file-item" :class="{ 'is-folder': file.type === 'folder', 'is-file': file.type === 'file' }"
      @keydown.enter="handleToggleFolder(file)">
    <div
      v-if="file.type === 'folder'"
      class="folder-item"
      tabindex="0"
      @click="handleToggleFolder(file)"
    >
      <span class="arrow" :class="{ expanded: checkExpanded(file.id) }">
        {{ checkExpanded(file.id) ? '▼' : '▶' }}
      </span>
      <svg class="folder-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H5.5L6.5 3.5H13.5C14.0523 3.5 14.5 3.94772 14.5 4.5V13.5C14.5 14.0523 14.0523 14.5 13.5 14.5H2.5C1.94772 14.5 1.5 14.0523 1.5 13.5V2.5Z" fill="#FDB62F" stroke="#E39F1E" stroke-width="1"/>
      </svg>
      <span class="filename">{{ file.filename }}</span>
    </div>
    <div v-else class="file-item-content">
      <svg class="file-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 1.5C2.44772 1.5 2 1.94772 2 2.5V13.5C2 14.0523 2.44772 14.5 3 14.5H13C13.5523 14.5 14 14.0523 14 13.5V5.5L9.5 1.5H3Z" fill="white" stroke="#666" stroke-width="1"/>
        <path d="M9.5 1.5V5.5H14" stroke="#666" stroke-width="1" stroke-linejoin="round"/>
      </svg>
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
  </button>
</template>

<style lang="scss" scoped>
.file-item {
  display: block;
  width: 100%;
  text-align: left;
  background: unset;
  border: 1px solid transparent;
  &:focus {
    border-color: $secondary-color;
  }
    margin: 0.5rem 0;
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

.folder-icon {
    margin-right: 0.5rem;
    flex-shrink: 0;
}

.file-icon {
    margin-right: 0.5rem;
    flex-shrink: 0;
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

