<template>
  <div class="sensor-count">
    <p>Active Sensors: {{ count }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SensorCount',
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style scoped>
.sensor-count {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
}
</style>
