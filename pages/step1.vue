<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item">Day {{ parseInt(route.query.index) + 1 }}</li>
        <li class="breadcrumb-item active" aria-current="page">Step 1: Listening Practice</li>
      </ol>
    </nav>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- 主要内容 -->
    <div v-else>
      <audio v-if="sentence" :src="sentence.audio" controls></audio>
      
      <div v-if="!showSentence">
        <p>Can you hear this sentence?</p>
        <div class="btn-group">
          <button @click="handleYes" class="btn btn-success">Yes</button>
          <button @click="handleNo" class="btn btn-danger">No</button>
        </div>
      </div>

      <div v-else>
        <p v-if="sentence">{{ sentence.sentence }}</p>
        <p v-if="sentence">{{ sentence.translation }}</p>
        <p v-else>Invalid sentence index.</p>
        <div style="margin-top: 20px;">
          <div class="btn-group">
            <a :href="`/step2?index=${route.query.index}`" class="btn btn-primary">Next</a>
            <a href="/complete" class="btn btn-outline-primary">Complete</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSentence } from '~/composables/useSentence'

const route = useRoute()
const router = useRouter()
const { sentence, loading, error } = useSentence()
const showSentence = ref(false)
const encouragement = ref('')

const handleYes = () => {
  encouragement.value = 'Great job! Keep it up!'
  showSentence.value = true
  router.push({ path: '/step2', query: { index: route.query.index } })
}

const handleNo = () => {
  showSentence.value = true
}
</script>
