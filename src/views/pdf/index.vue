<script setup lang="ts">
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()

/** 文件列表 */
const fileList = ref<UploadFileInfo[]>([])
/** 上传结果 */
const uploadResult = ref('')
/** 是否正在上传 */
const uploading = ref(false)

/**
 * 允许的文件类型校验
 */
function beforeUpload({ file }: { file: UploadFileInfo }) {
  const allowedExts = ['.pdf', '.txt', '.md']
  const allowedMimes = ['application/pdf', 'text/plain', 'text/markdown']

  const fileName = file.name || ''
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))
  const mime = file.type || ''

  if (!allowedMimes.includes(mime) && !allowedExts.includes(ext)) {
    message.error(`不支持的文件类型：${mime || ext}。仅允许上传 PDF、TXT、MD 文件。`)
    return false
  }
  return true
}

/**
 * 自定义上传请求
 */
async function customRequest({ file, onProgress, onFinish, onError }: UploadCustomRequestOptions) {
  if (!file.file) {
    onError()
    return
  }

  uploading.value = true
  uploadResult.value = ''

  try {
    const result = await uploadFile(file.file, (percent) => {
      onProgress({ percent })
    })
    uploadResult.value = result
    message.success('上传成功')
    onFinish()
  }
  catch (error: any) {
    message.error(error?.message || '上传失败')
    onError()
  }
  finally {
    uploading.value = false
  }
}

/**
 * 文件变化回调
 */
function handleChange({ fileList: list }: { fileList: UploadFileInfo[] }) {
  fileList.value = list
  if (list.length === 0) {
    uploadResult.value = ''
  }
}
</script>

<template>
  <div class="min-h-[var(--screen-height)] flex flex-col bg-[#f5f7fa]">
    <!-- 主内容区 -->
    <div class="flex-1 flex items-center justify-center p-24px">
      <div class="w-full max-w-560px bg-white rounded-16px shadow-lg p-40px">
        <h1 class="text-24 font-bold text-[#333] text-center mb-8px">
          文件上传
        </h1>
        <p class="text-14 text-[#999] text-center mb-32px">
          支持 PDF、TXT、MD 格式文件
        </p>

        <!-- naive-ui 上传组件 -->
        <n-upload
          v-model:file-list="fileList"
          :max="1"
          accept=".pdf,.txt,.md"
          :default-upload="true"
          :custom-request="customRequest"
          :on-before-upload="beforeUpload"
          @change="handleChange"
        >
          <n-upload-dragger>
            <div class="flex flex-col items-center py-20px">
              <div class="w-64px h-64px rounded-full bg-[#f0f5ff] flex items-center justify-center mb-16px">
                <span class="i-carbon:upload text-32px text-[#356EFF]" />
              </div>
              <p class="text-16 text-[#333] font-medium mb-8px">
                点击或拖拽文件到此处上传
              </p>
              <p class="text-12 text-[#999]">
                支持格式：PDF、TXT、MD，单次只能上传一个文件
              </p>
            </div>
          </n-upload-dragger>
        </n-upload>

        <!-- 上传结果 -->
        <div v-if="uploadResult" class="mt-24px p-12px bg-[#f6ffed] border border-[#b7eb8f] rounded-8px">
          <p class="text-14 text-[#52c41a] font-medium mb-4px">
            上传成功
          </p>
          <p class="text-12 text-[#666] break-all">
            {{ uploadResult }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
