<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import config from '../config/instance'
import { activeContext, globals, reactive as sciuxReactive, render, applyTheme, animationManager } from 'sciux'
import init from 'sciux'

const route = useRoute()

// 编辑器内容 - 初始为空
const editorCode = ref('')

// 渲染的HTML内容
const renderedHtml = ref('')

// 设置面板状态
const isSettingsPanelOpen = ref(false)

// 动画设置
const animationSettings = ref({
  curve: 'ease-in-out',
  autoExecute: true,
  duration: 300
})

// 编辑器选项
const editorOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  lineNumbers: 'on' as const,
  folding: true,
  wordWrap: 'on' as const,
  scrollBeyondLastLine: false,
  renderWhitespace: 'boundary' as const,
  tabSize: 2,
  insertSpaces: true,
  formatOnPaste: true,
  formatOnType: true,
}

// Monaco Editor引用
const monacoEditorRef = ref<InstanceType<typeof MonacoEditor>>()

// Cookie操作函数
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// 保存设置到cookie
const saveSettings = () => {
  setCookie('animation_settings', JSON.stringify(animationSettings.value))
}

// 从cookie加载设置
const loadSettings = () => {
  const saved = getCookie('animation_settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      animationSettings.value = {
        curve: parsed.curve || 'ease-in-out',
        autoExecute: parsed.autoExecute !== undefined ? parsed.autoExecute : true,
        duration: parsed.duration || 300
      }
    } catch (e) {
      console.warn('Failed to parse animation settings from cookie')
    }
  }
}

// 监听设置变化并保存
watch(animationSettings, saveSettings, { deep: true })

// 根据路由ID查找对应的内容
const findContentById = (id: string): string => {
  for (const item of config.items) {
    if ('children' in item && item.children) {
      // 这是一个组
      for (const child of item.children) {
        if (child.id === id) {
          return child.content
        }
      }
    } else if ('id' in item) {
      // 这是一个单独的项目
      if (item.id === id) {
        return item.content
      }
    }
  }
  return ''
}

const loadContent = (newId: string | string[]) => {
  if (typeof newId === 'string') {
    const content = findContentById(newId)
    if (content) {
      editorCode.value = content
      renderedHtml.value = content
    }
    nextTick(() => {
      applyTheme('#sciux-preview')
    })
  }
}
// 监听路由变化，自动加载对应的代码内容
watch(() => route.params.ins, loadContent, { immediate: true })

// 处理编辑器内容变化
const handleEditorChange = (value: string) => {
  console.log('Editor content changed:', value.length, 'characters')
}

const preview = ref<HTMLDivElement>()

onMounted(() => {
  init()
  nextTick(() => {
    triggerManualRender()
    animationManager.init()
  })
})

// 处理渲染请求（防抖后触发）- 现在包含动画设置参数
const handleRenderRequest = (content: string) => {
  if (preview.value) {
    preview.value.innerHTML = ''
    const [ast, update] = render(content, preview.value)
    animationManager.init()
  }
}

// 处理编辑器准备就绪
const handleEditorReady = (editor: any) => {
  console.log('Monaco Editor is ready', editor)
  // 可以在这里添加快捷键等功能
  editor.addCommand(editor.KeyMod.CtrlCmd | editor.KeyCode.KeyS, () => {
    console.log('Save triggered')
    // 可以添加保存功能
  })
}

// 手动触发渲染
const triggerManualRender = () => {
  monacoEditorRef.value?.triggerRender()
}

// 切换设置面板
const toggleSettingsPanel = () => {
  isSettingsPanelOpen.value = !isSettingsPanelOpen.value
}

// 获取iframe的安全HTML
const safeHtml = computed(() => {
  // 这里可以添加HTML清理逻辑，确保安全性
  return renderedHtml.value
})

watch(animationSettings, (settings) => {
  console.log(settings)
  if (settings.autoExecute) {
    console.log(animationManager.getIn())
    animationManager.enableAutoExecute()
    animationManager.setAutoIn('creation', settings.duration)
  }
  else {
    animationManager.disableAutoExecute()
  }
}, { deep: true, immediate: true })

// 预定义的动画曲线选项
const animationCurves = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
  'cubic-bezier(0.25, 0.1, 0.25, 1)',
  'cubic-bezier(0.42, 0, 0.58, 1)',
  'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
]

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="preview-container">
    <Sidebar :items="config.items" />

    <div class="main-content">
      <!-- Monaco Editor Area -->
      <div class="editor-section glass">
        <div class="editor-content">
          <MonacoEditor ref="monacoEditorRef" v-model="editorCode" language="html" theme="vs-dark"
            :options="editorOptions" :debounce-time="300" @change="handleEditorChange"
            @render-request="handleRenderRequest" @ready="handleEditorReady" />
        </div>
      </div>

      <!-- Preview/Render Area -->
      <div class="preview-section glass">
        <div class="preview-content">
          <div class="preview-frame glass">
            <!-- HTML 预览iframe -->
            <div v-if="safeHtml" class="preview-iframe" id="sciux-preview" ref="preview"></div>
            <!-- 无内容时的占位符 -->
            <div v-else class="preview-placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <h3 class="placeholder-title">Select an Item</h3>
                <p class="placeholder-description">
                  Choose an item from the sidebar to see its preview here.
                </p>
              </div>
            </div>

            <!-- 设置按钮 -->
            <button class="settings-btn glass-hover" @click="toggleSettingsPanel" title="Animation Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2583 9.77251 19.9887C9.5799 19.7191 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74168 9.96512 4.01127 9.77251C4.28087 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <!-- 设置面板 -->
            <div v-if="isSettingsPanelOpen" class="settings-panel glass fade-in">
              <div class="settings-header">
                <h3 class="settings-title">Animation Settings</h3>
                <button class="settings-close" @click="toggleSettingsPanel">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </button>
              </div>

              <div class="settings-content">
                <!-- Animation Curve -->
                <div class="setting-group">
                  <label class="setting-label">Default Animation Curve</label>
                  <select v-model="animationSettings.curve" class="setting-select">
                    <option v-for="curve in animationCurves" :key="curve" :value="curve">
                      {{ curve }}
                    </option>
                  </select>
                </div>

                <!-- Auto Execute -->
                <div class="setting-group">
                  <label class="setting-label checkbox-label">
                    <input type="checkbox" v-model="animationSettings.autoExecute" class="setting-checkbox">
                    <span class="checkbox-text">Auto Execute Entry Animation</span>
                  </label>
                </div>

                <!-- Duration (only show if autoExecute is true) -->
                <div v-if="animationSettings.autoExecute" class="setting-group">
                  <label class="setting-label">Entry Animation Duration (ms)</label>
                  <div class="duration-controls">
                    <input type="number" v-model.number="animationSettings.duration" min="50" max="3000" step="50"
                      class="setting-input">
                    <input type="range" v-model.number="animationSettings.duration" min="50" max="3000" step="50"
                      class="setting-range">
                  </div>
                  <div class="duration-value">{{ animationSettings.duration }}ms</div>
                </div>
              </div>
            </div>

            <!-- 浮动重渲染按钮 -->
            <button v-if="safeHtml" class="floating-render-btn glass-hover" @click="triggerManualRender"
              title="Re-render Preview">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 2.5L1 5.5L4 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M16 17.5L19 14.5L16 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M19 14.5H7C5.5 14.5 4 13 4 11.5V5.5" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1 5.5H13C14.5 5.5 16 7 16 8.5V14.5" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  display: flex;
  height: 100vh;
  background: transparent;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 1px;
  overflow: hidden;
  min-width: 0;
}

.editor-section {
  flex: 0 0 35%;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  border-left: none;
  border-top: none;
  border-bottom: none;
  min-width: 300px;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  border-right: none;
  border-top: none;
  border-bottom: none;
  min-width: 400px;
}

.editor-content {
  flex: 1;
  overflow: hidden;
}

.preview-content {
  flex: 1;
  padding: 12px;
  overflow: hidden;
}

.preview-frame {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
  border-radius: 8px;
}

.preview-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.placeholder-content {
  max-width: 300px;
}

.placeholder-icon {
  margin-bottom: 16px;
  color: var(--text-muted);
  opacity: 0.6;
}

.placeholder-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.placeholder-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.settings-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
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
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 15;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.05);
}

.settings-panel {
  position: absolute;
  top: 70px;
  left: 16px;
  width: 280px;
  border-radius: 12px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 20;
  overflow: hidden;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--glass-border);
}

.settings-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.settings-close {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.settings-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.settings-content {
  padding: 20px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0;
}

.setting-checkbox {
  margin-right: 8px;
  accent-color: var(--accent-color);
}

.checkbox-text {
  font-size: 13px;
  color: var(--text-primary);
}

.setting-select,
.setting-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  font-size: 13px;
  transition: border-color 0.2s ease;
}

.setting-select:focus,
.setting-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.setting-select option {
  background: #2a2a2a;
  color: white;
}

.duration-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
}

.duration-controls .setting-input {
  flex: 0 0 80px;
}

.setting-range {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.setting-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.setting-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.duration-value {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.floating-render-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
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
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.floating-render-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.floating-render-btn:active {
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .editor-section {
    flex: 0 0 40%;
    min-width: 250px;
  }

  .settings-panel {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .editor-section,
  .preview-section {
    flex: 1;
    min-width: unset;
  }

  .settings-panel {
    width: 240px;
  }
}
</style>