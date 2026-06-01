<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { nextTick, ref } from 'vue'

interface ChatMessage {
  id: string
  content: string
  type: 'send' | 'receive'
  time: string
}
const router = useRouter()

/** 消息列表 */
const messageList = ref<ChatMessage[]>([])
/** 输入框内容 */
const inputText = ref('')
/** 消息列表容器 ref */
const messageContainerRef = ref<HTMLDivElement>()
/** 是否正在加载历史消息 */
const loadingHistory = ref(false)
/** 是否正在发送 */
const sending = ref(false)
/** 当前正在显示打字机效果的消息索引 */
const typingIndex = ref(-1)
/** 打字机显示文本 */
const typingText = ref('')

apiGetConfig()

/**
 * 滚动到底部
 */
function scrollToBottom() {
  nextTick(() => {
    const container = messageContainerRef.value
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

/**
 * 获取当前时间字符串
 */
function getCurrentTime(): string {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * 渲染 Markdown 为安全 HTML
 */
function renderMarkdown(content: string): string {
  const html = marked.parse(content, { async: false }) as string
  return DOMPurify.sanitize(html)
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * 打字机效果
 */
function typeWriter(text: string, onDone: () => void) {
  typingText.value = ''
  let i = 0
  const speed = 30

  function type() {
    if (i < text.length) {
      typingText.value += text.charAt(i)
      i++
      scrollToBottom()
      setTimeout(type, speed)
    }
    else {
      onDone()
    }
  }
  type()
}

const id = Math.random() * 100

/**
 * 发送消息
 * TODO: 后端接口完成后替换为真实 API
 */
async function handleSend() {
  const text = inputText.value.trim()
  if (!text || sending.value) return

  // 添加本地发送消息
  const sendMessage: ChatMessage = {
    id: generateId(),
    content: text,
    type: 'send',
    time: getCurrentTime(),
  }
  messageList.value.push(sendMessage)
  inputText.value = ''
  scrollToBottom()

  // 调用后端接口
  sending.value = true
  try {
    const res = await apiChat({ message: text, id: `${id}` })

    const reply: ChatMessage = {
      id: generateId(),
      content: res,
      type: 'receive',
      time: getCurrentTime(),
    }
    messageList.value.push(reply)
    typingIndex.value = messageList.value.length - 1
    typeWriter(res, () => {
      typingIndex.value = -1
    })
    scrollToBottom()
  }
  finally {
    sending.value = false
  }
}

/**
 * 回车发送
 */
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="chat-page h-[var(--screen-height)] flex flex-col relative overflow-hidden">
    <!-- 动态背景层 -->
    <div class="absolute inset-0 bg-gradient" />
    <div class="absolute inset-0 grid-overlay" />
    <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow" />
    <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

    <!-- 顶部标题栏 -->
    <div class="relative z-10 h-48px md:h-56px flex items-center justify-center glass-header border-b border-white/10 flex-shrink-0">
      <div class="flex items-center gap-6px md:gap-8px">
        <div class="w-6px h-6px md:w-8px md:h-8px rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse" />
        <span class="text-16 md:text-18 font-bold text-white tracking-wider neon-text">AI简历助手</span>
        <div class="w-6px h-6px md:w-8px md:h-8px rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse" />
      </div>
    </div>

    <!-- 消息列表 -->
    <div ref="messageContainerRef" class="relative z-10 flex-1 overflow-y-auto p-12px md:p-16px">
      <!-- 加载中 -->
      <div v-if="loadingHistory" class="flex items-center justify-center py-16px md:py-20px">
        <div class="flex items-center gap-6px md:gap-8px">
          <div class="w-6px h-6px md:w-8px md:h-8px rounded-full bg-[#00f0ff] animate-bounce" />
          <div class="w-6px h-6px md:w-8px md:h-8px rounded-full bg-[#00f0ff] animate-bounce delay-100" />
          <div class="w-6px h-6px md:w-8px md:h-8px rounded-full bg-[#00f0ff] animate-bounce delay-200" />
        </div>
      </div>

      <!-- 消息项 -->
      <TransitionGroup name="msg">
        <div
          v-for="(msg, idx) in messageList"
          :key="msg.id"
          class="mb-16px md:mb-20px"
        >
          <!-- 时间 -->
          <div class="flex justify-center mb-8px md:mb-10px">
            <span class="time-badge text-12 text-white/60 px-12px py-4px rounded-full">{{ msg.time }}</span>
          </div>

          <!-- 接收消息（左侧） -->
          <div v-if="msg.type === 'receive'" class="flex items-start">
            <!-- 头像 -->
            <div class="avatar-glow w-36px h-36px md:w-44px md:h-44px rounded-12px flex items-center justify-center flex-shrink-0 mr-10px md:mr-14px overflow-hidden border border-white/20">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=AI" class="w-full h-full" alt="avatar">
            </div>
            <!-- 气泡 -->
            <div class="max-w-[82%] md:max-w-[70%] glass-bubble px-12px py-10px md:px-14px md:py-12px rounded-16px rounded-tl-4px relative text-13 md:text-14 text-white/90 leading-relaxed shadow-lg">
              <!-- <div class="absolute top-16px left-[-8px] w-0 h-0 border-t-8px border-t-transparent border-r-10px border-r-white/10 border-b-8px border-b-transparent" /> -->
              <template v-if="idx === typingIndex">
                {{ typingText }}<span class="typing-cursor">|</span>
              </template>
              <template v-else>
                <div class="markdown-body" v-html="renderMarkdown(msg.content)" />
              </template>
            </div>
          </div>

          <!-- 发送消息（右侧） -->
          <div v-else class="flex items-start justify-end">
            <!-- 气泡 -->
            <div class="max-w-[82%] md:max-w-[70%] send-bubble px-12px py-10px md:px-14px md:py-12px rounded-16px rounded-tr-4px relative text-13 md:text-14 text-white leading-relaxed shadow-lg shadow-blue-500/30">
              <!-- <div class="absolute top-16px right-[-8px] w-0 h-0 border-t-8px border-t-transparent border-l-10px border-l-[#356EFF] border-b-8px border-b-transparent" /> -->
              {{ msg.content }}
            </div>
            <!-- 头像 -->
            <div class="w-36px h-36px md:w-44px md:h-44px rounded-12px bg-gradient-to-br from-[#356EFF] to-[#00f0ff] flex items-center justify-center flex-shrink-0 ml-10px md:ml-14px overflow-hidden border border-white/20 shadow-lg shadow-blue-500/30">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" class="w-full h-full" alt="avatar">
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- 发送中提示 -->
      <div v-if="sending" class="flex justify-end mb-12px md:mb-16px">
        <div class="max-w-[82%] md:max-w-[70%] send-bubble px-12px py-10px md:px-14px md:py-12px rounded-16px text-13 md:text-14 text-white/70">
          <div class="flex items-center gap-6px">
            <span>思考中</span>
            <div class="flex gap-3px">
              <div class="w-5px h-5px rounded-full bg-white/70 animate-bounce" />
              <div class="w-5px h-5px rounded-full bg-white/70 animate-bounce delay-100" />
              <div class="w-5px h-5px rounded-full bg-white/70 animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div class="relative z-10 glass-input border-t border-white/10 px-12px py-10px md:px-16px md:py-14px flex-shrink-0">
      <div class="flex items-end gap-8px md:gap-12px">
        <textarea
          v-model="inputText"
          class="chat-input flex-1 min-h-40px max-h-100px md:min-h-44px md:max-h-120px rounded-12px px-12px py-10px md:px-14px md:py-12px text-13 md:text-14 text-white resize-none border-none outline-none placeholder:text-white/30"
          placeholder="输入消息，与 AI 对话..."
          rows="1"
          @keydown="handleKeyDown"
        />
        <button
          class="send-btn h-40px px-16px md:h-44px md:px-28px text-white text-13 md:text-14 rounded-12px font-medium flex-shrink-0 flex items-center gap-6px"
          :disabled="!inputText.trim() || sending"
          @click="handleSend"
        >
          <span class="hidden md:inline">发送</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 动态渐变背景 */
.bg-gradient {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f4b 50%, #0d1235 100%);
}

/* 网格背景 */
.grid-overlay {
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 毛玻璃头部 */
.glass-header {
  background: rgba(10, 14, 39, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 霓虹文字 */
.neon-text {
  text-shadow:
    0 0 10px rgba(0, 240, 255, 0.5),
    0 0 20px rgba(0, 240, 255, 0.3),
    0 0 40px rgba(0, 240, 255, 0.1);
}

/* 时间标签 */
.time-badge {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* AI 头像发光 */
.avatar-glow {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
}

/* 接收消息毛玻璃气泡 */
.glass-bubble {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 发送消息渐变气泡 */
.send-bubble {
  background: linear-gradient(135deg, #356EFF 0%, #00c6ff 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 底部输入区毛玻璃 */
.glass-input {
  background: rgba(10, 14, 39, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 输入框样式 */
.chat-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.chat-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 240, 255, 0.4);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
}

/* 发送按钮 */
.send-btn {
  background: linear-gradient(135deg, #356EFF 0%, #00c6ff 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(53, 110, 255, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(53, 110, 255, 0.5);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 打字机光标 */
.typing-cursor {
  display: inline-block;
  animation: blink 1s step-end infinite;
  color: #00f0ff;
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 消息进入动画 */
.msg-enter-active,
.msg-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.msg-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.4);
}

/* 缓慢脉冲动画 */
.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .glass-input {
    padding-bottom: max(10px, env(safe-area-inset-bottom));
  }

  /* iOS 防止聚焦时自动缩放 */
  .chat-input {
    font-size: 16px;
  }
}

/* Markdown 内容样式 */
.markdown-body {
  line-height: 1.6;
}

.markdown-body :first-child {
  margin-top: 0;
}

.markdown-body :last-child {
  margin-bottom: 0;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin: 12px 0 8px;
  font-weight: 600;
  line-height: 1.4;
  color: inherit;
}

.markdown-body h1 { font-size: 1.25em; }
.markdown-body h2 { font-size: 1.15em; }
.markdown-body h3 { font-size: 1.1em; }
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 { font-size: 1em; }

.markdown-body p {
  margin: 8px 0;
}

.markdown-body ul,
.markdown-body ol {
  margin: 8px 0;
  padding-left: 1.5em;
}

.markdown-body li {
  margin: 4px 0;
}

.markdown-body code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.9em;
}

.markdown-body pre {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.markdown-body pre code {
  background: none;
  padding: 0;
  font-size: 0.85em;
}

.markdown-body blockquote {
  margin: 8px 0;
  padding-left: 12px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.markdown-body a {
  color: #00f0ff;
  text-decoration: underline;
}

.markdown-body hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: 12px 0;
}

.markdown-body table {
  border-collapse: collapse;
  margin: 8px 0;
  width: 100%;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 10px;
  text-align: left;
}

.markdown-body th {
  background: rgba(255, 255, 255, 0.08);
}

.markdown-body img {
  max-width: 100%;
  border-radius: 6px;
}
</style>
