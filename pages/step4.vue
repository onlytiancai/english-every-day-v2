<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item">Day {{ parseInt(route.query.index) + 1 }}</li>
        <li class="breadcrumb-item active" aria-current="page">Step 4: Grammar Study</li>
      </ol>
    </nav>
    <p v-if="sentence">{{ sentence.sentence }}</p>
    <p v-else>Invalid sentence index.</p>
    <p v-if="sentence" style="text-align: left;">{{ sentence.grammar }}</p>
    <div style="margin-top: 20px;">
      <div class="btn-group">
        <a :href="`/step5?index=${route.query.index}`" class="btn btn-primary">Next</a>
        <a :href="`/step3?index=${route.query.index}`" class="btn btn-outline-primary">Previous</a>
        <a href="/complete" class="btn btn-outline-primary">Complete</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSentence } from '~/composables/useSentence'

const route = useRoute()
const { sentence, loading, error } = useSentence()
</script>