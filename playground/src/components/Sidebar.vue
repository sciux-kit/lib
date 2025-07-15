<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { InstanceItem, InstanceGroup } from '../config/instance'

defineProps<{
  items: (InstanceItem | InstanceGroup)[]
}>()

const router = useRouter()
const expandedGroups = ref<Set<string>>(new Set())
const isCollapsed = ref(false)

const isGroup = (item: InstanceItem | InstanceGroup): item is InstanceGroup => {
  return 'children' in item
}

const toggleGroup = (groupName: string) => {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName)
  } else {
    expandedGroups.value.add(groupName)
  }
}

const selectItem = (item: InstanceItem) => {
  router.push(`/${item.id}`)
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="sidebar glass" :class="{ 'collapsed': isCollapsed }">
    <!-- 切换按钮 -->
    <button class="sidebar-toggle glass-hover" @click="toggleSidebar"
      :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'">
      <svg :class="{ 'rotate-180': !isCollapsed }" class="toggle-icon" width="14" height="14" viewBox="0 0 16 16"
        fill="none">
        <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>

    <div class="sidebar-header" v-show="!isCollapsed">
      <h2 class="sidebar-title">Preview</h2>
      <div class="sidebar-subtitle">Playground</div>
    </div>

    <div class="sidebar-content" v-show="!isCollapsed">
      <div class="sidebar-items">
        <template v-for="item in items" :key="isGroup(item) ? item.name : item.id">
          <!-- Group Item -->
          <div v-if="isGroup(item)" class="sidebar-group">
            <button class="sidebar-group-header glass-hover" @click="toggleGroup(item.name)">
              <div class="group-icon">
                <svg :class="{ 'rotate-90': expandedGroups.has(item.name) }" class="group-chevron" width="12"
                  height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <span class="group-name">{{ item.name }}</span>
            </button>

            <div v-if="expandedGroups.has(item.name)" class="sidebar-group-items fade-in">
              <button v-for="child in item.children" :key="child.id" class="sidebar-item glass-hover"
                @click="selectItem(child)">
                <div class="item-content">
                  <div class="item-name">{{ child.name }}</div>
                  <div class="item-description">{{ child.description }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Single Item -->
          <button v-else class="sidebar-item glass-hover" @click="selectItem(item)">
            <div class="item-content">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-description">{{ item.description }}</div>
            </div>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  border-left: none;
  border-top: none;
  border-bottom: none;
  position: relative;
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 16px;
  overflow: hidden;
}

.sidebar-toggle {
  position: absolute;
  top: 20px;
  right: -8px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.1);
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.sidebar-header {
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--glass-border);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.sidebar-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.sidebar-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-items {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.sidebar-group {
  margin-bottom: 8px;
}

.sidebar-group-header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  margin: 0 6px;
  text-align: left;
}

.group-icon {
  margin-right: 6px;
  display: flex;
  align-items: center;
}

.group-chevron {
  transition: transform 0.2s ease;
  color: var(--text-secondary);
}

.rotate-90 {
  transform: rotate(90deg);
}

.group-name {
  font-weight: 500;
}

.sidebar-group-items {
  margin-left: 16px;
  border-left: 1px solid var(--glass-border);
  padding-left: 12px;
  margin-top: 6px;
}

.sidebar-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 6px;
  margin: 2px 6px;
  text-align: left;
}

.sidebar-group-items .sidebar-item {
  margin-left: 0;
  margin-right: 6px;
}

.item-content {
  flex: 1;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.item-description {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}
</style>