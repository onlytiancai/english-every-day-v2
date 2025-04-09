<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="card-subtitle text-muted mb-1">{{ title }}</h6>
          <h3 class="card-title mb-0">{{ value }}</h3>
        </div>
        <component :is="iconComponent" class="fs-4 text-primary" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FileTextOutlined,
  HeartOutlined
} from '@ant-design/icons-vue';

const props = defineProps<{
  title: string;
  value: number;
  icon: string;
}>();

const iconMap = {
  'FileTextOutlined': FileTextOutlined,
  'HeartOutlined': HeartOutlined,
};

const iconComponent = computed(() => iconMap[props.icon] || BookOutlined);
</script>
