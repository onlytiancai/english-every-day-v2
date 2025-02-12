<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item">Day {{ parseInt(route.query.index) + 1 }}</li>
        <li class="breadcrumb-item active" aria-current="page">Step 2: Speaking Practice</li>
      </ol>
    </nav>

    <!-- 加载状态和错误提示 -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else>
      <p v-if="sentence">{{ sentence.sentence }}</p>
      <p v-else>Invalid sentence index.</p>
      <audio v-if="sentence" :src="sentence.audio" controls></audio>
      
      <div style="margin-top: 20px;">
        <button @click="toggleRecording" class="btn" :class="isRecording ? 'btn-danger' : 'btn-primary'">
          {{ isRecording ? '停止录音' : '开始录音' }}
        </button>
        <p v-if="recordingMessage" class="mt-2">{{ recordingMessage }}</p>
        <audio v-if="recordedAudio" :src="recordedAudio" controls class="mt-2"></audio>
      </div>

      <div style="margin-top: 20px;">
        <div class="btn-group">
          <a :href="`/step3?index=${route.query.index}`" class="btn btn-primary">Next</a>
          <a :href="`/step1?index=${route.query.index}`" class="btn btn-outline-primary">Previous</a>
          <a href="/complete" class="btn btn-outline-primary">Complete</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSentence } from '~/composables/useSentence'

const route = useRoute()
const { sentence, loading, error } = useSentence()

const isRecording = ref(false)
const recordedAudio = ref(null)
const recordingMessage = ref('')
let mediaRecorder = null
let audioChunks = []

const startRecording = async () => {
  try {
    // 检查浏览器是否支持录音
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('浏览器不支持录音功能')
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      recordedAudio.value = URL.createObjectURL(audioBlob)
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.start()
    isRecording.value = true
    recordingMessage.value = '正在录音...'
  } catch (err) {
    console.error('录音失败:', err)
    recordingMessage.value = '无法访问麦克风: ' + err.message
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
    recordingMessage.value = '录音已完成'
  }
}

const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    await startRecording()
  }
}
</script>