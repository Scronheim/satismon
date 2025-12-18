<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import ru from 'element-plus/es/locale/lang/ru'

import { useStore } from './stores/store'

import Players from './components/Players.vue'
import Session from './components/Session.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const store = useStore()

const currentTheme = ref('light')

onMounted(async () => {
  await store.connectToSocket()
  store.subscribeAll()
})
</script>

<template>
  <el-config-provider :locale="ru">
    <el-container>
      <el-header class="flex items-center bg-zinc-200 font-bold dark:bg-zinc-800">
        <div class="flex grow items-center justify-end">
          <el-switch
            inactive-text="Тёмная"
            inactive-value="light"
            active-text="Светлая"
            active-value="dark"
            v-model="currentTheme"
            @change="toggleDark()"
          />
        </div>
      </el-header>
      <el-container>
        <el-aside width="250px" class="mt-5 ml-5 flex flex-col gap-2">
          <Session />
          <Players />
        </el-aside>
        <el-container>
          <el-main><router-view /></el-main>
        </el-container>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped></style>
