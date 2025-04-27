<template>
  <q-card style="min-width: 300px">
    <q-card-section class="text-h6">Sensor Counts by Continent</q-card-section>

    <q-card-section>
      <q-list bordered padding>
        <q-item v-for="(sensor, continent) in sensors" :key="continent">
          <q-item-section>
            <q-item-label>{{ continent }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-badge color="primary" align="top">{{ sensor }}</q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Close" color="primary" @click="$emit('close')" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// Define reactive sensor counts
const sensors = reactive({
  'North America': 5,
  'South America': 2,
  Europe: 8,
  Africa: 3,
  Asia: 10,
  Australia: 1,
})
</script>
