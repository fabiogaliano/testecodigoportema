<template>
  <button
    class="bg-white text-gray-800 px-4 py-2 rounded shadow text-left w-full"
    :class="{ correct: correct && selected, incorrect: !correct && selected }"
    @click="handleClick"
  >
    <span class="cursor-pointer text-left px-2">
      <slot /> {{ answer.text }}
    </span>
  </button>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    answer: {
      type: Object,
      required: true,
    },
    correct: {
      type: Boolean,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['select']);

  const handleClick = () => {
    emit('select', props.answer);
  };
</script>

<style scoped>
  .correct {
    background-color: rgb(121, 180, 121);
    color: white;
  }

  .incorrect {
    background-color: rgb(184, 61, 61);
    color: white;
  }
</style>
