<template>
  <div >
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item">Day {{ parseInt(route.query.index) + 1 }}</li>
        <li class="breadcrumb-item active" aria-current="page">Step 5: Extended Practice</li>
      </ol>
    </nav>
    <p v-if="sentence">{{ sentence.sentence }}</p>
    <p v-else>Invalid sentence index.</p>
    <ul v-if="sentence">
      <li v-for="related in sentence.related_sentences" :key="related">{{ related }}</li>
    </ul>
    <div style="margin-top: 20px;">
      <div class="btn-group">
        <a href="/complete" class="btn btn-primary">Complete</a>
        <a :href="`/step4?index=${route.query.index}`" class="btn btn-outline-primary">Previous</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSentence } from '~/composables/useSentence'
const route = useRoute()
const { sentence, loading, error } = useSentence()
</script>
<style scoped>


ul {
  text-align: left;
}
</style>