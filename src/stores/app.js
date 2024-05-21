import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore(
  'app',
  () => {
    const isQuizzOver = ref(false);
    const scores = ref({});
    const pastScores = ref({});

    const score = computed(() => (category) => {
      return {
        ...getScore(category),
        total: scores.value[category].total,
        answered: getQuestionsAnswered(category).length,
      };
    });

    function createScoreState(category) {
      if (!scores.value[category]) {
        scores.value[category] = {
          correct: {
            value: 0,
            ids: [],
          },
          wrong: {
            value: 0,
            ids: [],
          }
        };
      }
    }

    function getScore(category) {
      if (!scores.value[category]) createScoreState(category);
      return scores.value[category];
    }

    function updateScore(scoreData) {
      const { category, questionId, isCorrect } = scoreData;

      if (isCorrect) {
        scores.value[category].correct.value++;
        scores.value[category].correct.ids.push(questionId);
      } else {
        scores.value[category].wrong.value++;
        scores.value[category].wrong.ids.push(questionId);
      }
    }

    function restartQuizz(category) {
      setIsQuizzOver(false)
      delete scores.value[category]
    }

    const getQuestionsAnswered = (category) => {
      if (scores.value[category]) {
        return [
          ...scores.value[category].wrong.ids,
          ...scores.value[category].correct.ids,
        ];
      }
      return [];
    };

    function setTotal(data) {
      const { total, categoryId } = data;

      scores.value[categoryId].total = total;
    }

    function setIsQuizzOver(value) {
      isQuizzOver.value = value;
    }

    function saveScoreToHistory(category) {
      if (!pastScores.value[category]) {
        pastScores.value[category] = [];
      }

      pastScores.value[category].push({
        ...scores.value[category],
        date: new Date().toISOString(),
        correctPercentage: (scores.value[category].correct.value / getQuestionsAnswered(category).length) * 100
      });
    }

    return {
      score,
      createScoreState,
      getQuestionsAnswered,
      updateScore,
      setTotal,
      scores,
      setIsQuizzOver,
      isQuizzOver,
      saveScoreToHistory,
      pastScores,
      restartQuizz
    };
  },
  { persist: true }
);
