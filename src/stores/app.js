import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore(
  'app',
  () => {
    const scores = ref({});
    const pastScores = ref({});

    const score = computed(() => (category) => {
      return {
        ...getScore(category),
        total: scores.value[category].total,
        answered: getQuestionsAnswered(category).length,
        isQuizzOver: scores.value[category].isQuizzOver
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
          },
          isQuizzOver: false,
          total: 0
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
      // setIsQuizzOver(categfalse)
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

      if (!scores.value[categoryId]) {
        createScoreState(categoryId)
      }

      scores.value[categoryId].total = total;
    }

    function setIsQuizzOver(category, value) {
      scores.value[category].isQuizzOver = value
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

    function getAllPastWrongAnswers() {
      const wrongAnswers = {};

      Object.entries(pastScores.value).forEach(([categoryId, pastScoresData]) => {
        pastScoresData.forEach((pastScore) => {
          if (pastScore.wrong.ids.length) {
            wrongAnswers[categoryId] = wrongAnswers[categoryId] || [];
            wrongAnswers[categoryId].push(...pastScore.wrong.ids);
          }
        });
      });

      return wrongAnswers;
    }

    function getAllCurrentWrongAnswers() {
      const wrongAnswers = {};

      Object.entries(scores.value).forEach(([categoryId, scoreData]) => {
        if (scoreData.wrong.ids.length) {
          wrongAnswers[categoryId] = wrongAnswers[categoryId] || [];
          wrongAnswers[categoryId].push(...scoreData.wrong.ids);
        }
      });

      return wrongAnswers;
    }

    return {
      score,
      createScoreState,
      getQuestionsAnswered,
      updateScore,
      setTotal,
      scores,
      setIsQuizzOver,
      saveScoreToHistory,
      pastScores,
      restartQuizz,
      getAllPastWrongAnswers,
      getAllCurrentWrongAnswers
    };
  },
  { persist: true }
);
