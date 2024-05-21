<template>
  <div class="flex items-center justify-center min-h-screen">
    <ul role="list" class="divide-y divide-gray-100">
      <li
        v-for="category in categories"
        :key="category.jsonPath"
        class="relative py-2 hover:bg-gray-50"
        @click="handleClick(category)"
      >
        <div
          class="mx-auto flex max-w-2xl justify-between gap-x-6 px-4 sm:px-6 lg:px-8 items-center border-solid border-2 border-indigo-600 relative inline-block hover:bg-violet-500 hover:bg-opacity-20 p-1"
        >
          <div class="flex gap-x-1 items-center">
            <div class="min-w-0 flex-auto">
              <p class="text-m font-semibold leading-6 text-gray-900">
                <a class="">
                  {{ category.name }}
                </a>
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
  const props = defineProps({
    categories: {
      required: true,
      type: Object,
    },
  });

  const emit = defineEmits(['select']);

  const handleClick = (jsonPath) => {
    emit('select', jsonPath);
  };
</script>
<style></style>
