<template>
  <div class="flex flex-col items-center space-y-4 mb-6">
    <div class="flex justify-center space-x-4">
      <button
        @click="exportState"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Export State
      </button>
      <label
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
      >
        Import State
        <input
          type="file"
          @change="handleFileUpload"
          accept=".json"
          class="hidden"
        />
      </label>
    </div>
    <div v-if="notification" :class="notificationClass" class="px-4 py-2 rounded-md text-sm">
      {{ notification }}
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAppStore } from '@/stores/app';

  const appStore = useAppStore();
  const notification = ref('');
  const notificationClass = ref('');

  function showNotification(message, isSuccess) {
    notification.value = message;
    notificationClass.value = isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    setTimeout(() => {
      notification.value = '';
    }, 3000);
  }

  function exportState() {
    appStore.exportState();
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      try {
        appStore.loadState(file);
        showNotification('State imported successfully', true);
      } catch (error) {
        showNotification('Failed to import state', false);
      }
    }
  }
</script>
