<template>
  <div class="q-pa-md">
    <!-- <q-toolbar>
      <q-toolbar-title>Map App</q-toolbar-title>

      <q-btn flat label="Open Count Menu" @click="countMenuOpen = true" />
    </q-toolbar> -->

    <!-- The actual map -->
    <open-layers-map></open-layers-map>
    <!-- Toolbar -->

    <!-- Count Menu inside a Dialog -->
    <q-dialog v-model="countMenuOpen">
      <CountMenu @close="countMenuOpen = false" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import type { Todo, Meta } from 'components/models'
// import ExampleComponent from 'components/ExampleComponent.vue'
// import { defineComponent } from 'vue'
import CountMenu from 'src/components/CountMenu.vue'
import OpenLayersMap from './OpenLayersMap.vue'

const countMenuOpen = ref(false)
</script>
