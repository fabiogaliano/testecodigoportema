<template>
  <div v-if="currentQuestion">
    <img
      :src="currentQuestion.questionImageURL"
      alt="Question"
      class="w-full h-auto mt-8 mb-4"
    />
    <p class="text-lg font-semibold mb-4">
      <a target="_blank" :href="currentQuestion.href">{{
        currentQuestion.text
      }}</a>
    </p>
    <div class="flex flex-col space-y-2 mb-8">
      <QuizzButton
        v-for="(answer, i) in currentQuestion.answers"
        :key="answer.option"
        :answer="answer"
        :correct="isCorrectAnswer(answer)"
        :selected="selectedAnswer === answer"
        @select="selectAnswer"
        >{{ i + 1 }}.</QuizzButton
      >
    </div>
    <br />
  </div>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';

  import QuizzButton from './QuizzButton.vue';

  const props = defineProps({
    currentQuestion: {
      type: Object,
      required: true,
    },
    selectedAnswer: Object,
  });

  const isCorrectAnswer = (answer) => {
    return answer.option === props.currentQuestion.correctAnswer;
  };
  const emit = defineEmits(['select-answer']);

  const selectAnswer = (answer) => {
    emit('select-answer', answer);
  };
</script>
