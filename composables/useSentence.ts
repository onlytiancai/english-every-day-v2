import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Sentence {
  sentence: string
  translation: string
  audio: string
  keywords?: Array<{
    word: string
    translation: string
    phonetic: string
    part_of_speech: string
  }>
  grammar?: string
  related_sentences?: string[]
}

export function useSentence() {
  const route = useRoute()
  const router = useRouter()
  const sentence = ref<Sentence | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSentence = async (index: string | string[]) => {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch(`/api/sentences/${index}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          router.push('/')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      sentence.value = data.sentence || null
    } catch (err) {
      console.error('获取句子失败:', err)
      error.value = '获取句子失败'
      sentence.value = null
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    watch(() => route.query.index, (newIndex) => {
      if (newIndex !== undefined) {
        fetchSentence(newIndex)
      }
    }, { immediate: true })
  })

  return {
    sentence,
    loading,
    error
  }
} 