<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

// 定义组件props
interface Props {
  modelValue: string
  language?: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  debounceTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  language: 'html',
  theme: 'vs-dark',
  debounceTime: 300,
  options: () => ({
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineNumbers: 'on',
    folding: true,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    renderWhitespace: 'boundary',
    tabSize: 2,
    insertSpaces: true,
  })
})

// 定义emits
interface Emits {
  'update:modelValue': [value: string]
  'change': [value: string, event: monaco.editor.IModelContentChangedEvent]
  'ready': [editor: monaco.editor.IStandaloneCodeEditor]
  'render-request': [content: string]
}

const emit = defineEmits<Emits>()

// 组件状态
const editorContainer = ref<HTMLDivElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let debounceTimer: number | null = null

// 防抖渲染函数
const debounceRender = (content: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = window.setTimeout(() => {
    emit('render-request', content)
  }, props.debounceTime)
}

// 初始化Monaco Editor
const initEditor = async () => {
  if (!editorContainer.value) return

  // 配置Monaco Editor的worker (简化版本)
  self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      // 使用CDN版本以确保兼容性
      const BASE_URL = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'

      if (label === 'json') {
        return `${BASE_URL}/language/json/json.worker.js`
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return `${BASE_URL}/language/css/css.worker.js`
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return `${BASE_URL}/language/html/html.worker.js`
      }
      if (label === 'typescript' || label === 'javascript') {
        return `${BASE_URL}/language/typescript/ts.worker.js`
      }
      return `${BASE_URL}/editor/editor.worker.js`
    }
  }

  // 创建editor实例
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    ...props.options,
  })

  // 监听内容变化
  editor.onDidChangeModelContent((event) => {
    const value = editor!.getValue()
    emit('update:modelValue', value)
    emit('change', value, event)

    // 触发防抖渲染
    debounceRender(value)
  })

  // 设置HTML语言的特殊配置
  if (props.language === 'html') {
    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 80,
        unformatted: 'default',
        indentInnerHtml: false,
        preserveNewLines: true,
        maxPreserveNewLines: null,
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: 'head, body, /html',
        wrapAttributes: 'auto'
      },
      suggest: {
        html5: true,
        angular1: false,
        ionic: false
      }
    })
  }

  // 触发ready事件
  emit('ready', editor)

  // 初始渲染
  if (props.modelValue) {
    debounceRender(props.modelValue)
  }
}

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

// 监听语言变化
watch(() => props.language, (newLanguage) => {
  if (editor) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, newLanguage)
    }
  }
})

// 监听主题变化
watch(() => props.theme, (newTheme) => {
  if (editor) {
    monaco.editor.setTheme(newTheme)
  }
})

// 暴露方法给父组件
const focus = () => {
  editor?.focus()
}

const getEditor = () => {
  return editor
}

const setValue = (value: string) => {
  editor?.setValue(value)
}

const getValue = () => {
  return editor?.getValue() || ''
}

const triggerRender = () => {
  const content = getValue()
  emit('render-request', content)
}

defineExpose({
  focus,
  getEditor,
  setValue,
  getValue,
  triggerRender
})

// 生命周期
onMounted(async () => {
  await nextTick()
  await initEditor()
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  if (editor) {
    editor.dispose()
    editor = null
  }
})
</script>

<template>
  <div ref="editorContainer" class="monaco-editor-container" />
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

/* 修复Monaco Editor在玻璃效果容器中的显示问题 */
:deep(.monaco-editor) {
  background: transparent !important;
}

:deep(.monaco-editor .margin) {
  background: rgba(0, 0, 0, 0.2) !important;
}

:deep(.monaco-editor .monaco-editor-background) {
  background: rgba(0, 0, 0, 0.3) !important;
}

:deep(.monaco-editor .current-line) {
  background: rgba(255, 255, 255, 0.05) !important;
}

:deep(.monaco-editor .line-numbers) {
  color: var(--text-muted) !important;
}

:deep(.monaco-editor .monaco-placeholder) {
  color: var(--text-secondary) !important;
}
</style>