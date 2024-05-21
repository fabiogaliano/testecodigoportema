<template>
  <div class="text-center">
    <div class="space-y-4">
      <div class="text-lg font-semibold space-y-2">
<span class="has-tooltip flex justify-end">
      <span class="tooltip p-1 rounded bg-blue-100 text-sm"
        >Clicar na questão abre-a no bomcondutor </span
      >
      <QuestionMarkCircleIcon
        class="block h-6 w-6 text-blue-700"
        aria-hidden="true"
      />
    </span>
        <p>
          
          Total: <span class="text-blue-400">{{ score.answered }}</span>/<span class="text-blue-600">{{ score.total
            }}</span>
        <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 shadow">
          <div class="bg-blue-600 h-4 rounded-full relative" :style="'width:' + progress + '%'">
            <!-- <span
              class="absolute inset-y-0 left-0 right-0 flex justify-center items-center text-white text-sm"
              >{{ progress }}%</span
            > -->
          </div>
        </div>
        <span class="text-red-600">{{ score.wrong.value }}</span> | <span class="text-green-600">{{ score.correct.value
          }}</span>
          <br/>
        </p>
      </div>

      <div class="text-right space-y-1" v-if="isQuizzOver">
        <p class="font-medium text-blue-500">
          Correct answers: {{ correctPercentage.toFixed(2) }}%
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import { defineProps, computed } from 'vue';

const props = defineProps({
  score: {
    type: Object,
    required: true,
    default: () => {
      return {
        right: 1,
        wrong: 2,
        total: 2,
        answered: 2,
      };
    },
  },
  isQuizzOver: { type: Boolean, default: false },
});

const progress = computed(
  () => (props.score.answered / props.score.total) * 100
);
const correctPercentage = computed(() => {
  return props.score.answered === 0
    ? 0
    : (props.score.correct.value / props.score.answered) * 100;
});
</script>
<style>
  .tooltip {
    @apply invisible absolute;
  }

  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
</style>
