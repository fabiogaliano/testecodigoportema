import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  const scores = ref({});
  const currentQuestionIndex = ref({});
  const questionsAnswered = ref({});

  const getScore = (category) => {
    if (!scores.value[category]) {
      scores.value[category] = { right: 0, wrong: 0, total: 0 };
    }
    return scores.value[category];
  };

  const getCurrentQuestionIndex = (category) => {
    if (currentQuestionIndex.value[category] === undefined) {
      currentQuestionIndex.value[category] = 0;
    }
    return currentQuestionIndex.value[category];
  };

  const getQuestionsAnswered = (category) => {
    if (!questionsAnswered.value[category]) {
      questionsAnswered.value[category] = [];
    }
    return questionsAnswered.value[category];
  };

  const score = computed(() => (category) => getScore(category));
  const currentIndex = computed(() => (category) => getCurrentQuestionIndex(category));

  function updateScore(category, isCorrect) {
    if (!scores.value[category]) {
      scores.value[category] = { right: 0, wrong: 0, total: 0 };
    }
    if (isCorrect) {
      scores.value[category].right++;
    } else {
      scores.value[category].wrong++;
    }
    currentQuestionIndex.value[category]++;
  }

  function resetScore(category) {
    scores.value[category] = { right: 0, wrong: 0, total: 0 };
    currentQuestionIndex.value[category] = 0;
    questionsAnswered.value[category] = [];
  }

  function setTotal(category, total) {
    if (!scores.value[category]) {
      scores.value[category] = { right: 0, wrong: 0, total };
    } else {
      scores.value[category].total = total;
    }
  }

  function addQuestionAnswered(category, id) {
    if (!questionsAnswered.value[category]) {
      questionsAnswered.value[category] = [];
    }
    questionsAnswered.value[category].push(id);
  }

  function nextQuestion(category) {
    currentQuestionIndex.value[category]++;
  }

  return {
    score,
    currentIndex,
    updateScore,
    resetScore,
    setTotal,
    addQuestionAnswered,
    nextQuestion,
    getQuestionsAnswered,
  };
}, {
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ['scores', 'currentQuestionIndex', 'questionsAnswered'] }
    ]
  }
});
