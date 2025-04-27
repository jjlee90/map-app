<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'
import CountMenu from 'src/components/CountMenu.vue'

const linksList: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
]

const leftDrawerOpen = ref(false)
const countMenuOpen = ref(false)

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleCountMenu() {
  countMenuOpen.value = !countMenuOpen.value
}

const position = ref({ top: 100, left: 100 })

function onPan({ delta }: { delta?: { x?: number; y?: number } }) {
  if (!delta || delta.x == null || delta.y == null) return

  position.value.top += delta.y
  position.value.left += delta.x
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleDrawer" />
        <q-toolbar-title> Quasar App </q-toolbar-title>
        <q-btn flat label="Count Menu" @click="toggleCountMenu" />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Floating Count Menu (Outside toolbar now) -->
    <div
      v-if="countMenuOpen"
      class="floating-count-menu"
      v-touch-pan.prevent.mouse="onPan"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    >
      <CountMenu @close="countMenuOpen = false" />
    </div>
  </q-layout>
</template>

<style scoped>
.floating-count-menu {
  position: absolute;
  z-index: 9999;
  background: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 12px;
  min-width: 250px;
  min-height: 150px;
  cursor: move;
}
</style>
