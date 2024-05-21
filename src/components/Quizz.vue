<template>
  <Scoreboard
    :score="appStore.score(category.id)"
    :isQuizzOver="appStore.isQuizzOver"
  />
  <div
    class="bg-gray-200 min-h-screen flex flex-col items-center justify-start pt-1 rounded-md"
  >
    <div
      id="quiz-container"
      class="w-full px-4 max-w-2xl flex flex-col items-center"
    >
      <QuestionDisplay
        v-if="currentQuestion"
        :currentQuestion="currentQuestion"
        :selectedAnswer="selectedAnswer"
        @select-answer="selectAnswer"
      />
      <div v-else-if="appStore.isQuizzOver" class="flex flex-col items-center">
        <button
          @click="restartQuizz"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          Restart Quizz
        </button>
      </div>
      <p v-else>Loading questions...</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import Scoreboard from './subcomponents/Scoreboard.vue';
  import QuestionDisplay from './subcomponents/QuestionDisplay.vue';
  import { useAppStore } from '../stores/app';

  const props = defineProps({
    category: {
      required: true,
      type: Object,
    },
  });

  const appStore = useAppStore();

  const questions = ref([]);
  const selectedAnswer = ref(null);
  const currentQuestionIndex = ref(0);

  const currentQuestion = computed(() => {
    return questions.value.length > 0
      ? questions.value[currentQuestionIndex.value]
      : null;
  });

  const logQuestion = () => {
    if (currentQuestion.value) {
      console.log('Current Question:', currentQuestion.value);
    }
  };

  const selectAnswer = (answer) => {
    selectedAnswer.value = answer;
    setTimeout(() => {
      const isCorrect = answer.option === currentQuestion.value.correctAnswer;
      const updatedScore = {
        category: props.category.id,
        questionId: currentQuestion.value.id,
        isCorrect,
      };
      appStore.updateScore(updatedScore);
      nextQuestion();

      if (currentQuestionIndex.value >= questions.value.length) {
        console.log('OVER: ');
        endQuiz();
      } else {
        // logQuestion();
      }
      selectedAnswer.value = null;
    }, 750);
  };

  function endQuiz() {
    appStore.setIsQuizzOver(true);
    appStore.saveScoreToHistory(props.category.id);
  }

  function nextQuestion() {
    currentQuestionIndex.value++;
  }

  function restartQuizz() {
    appStore.restartQuizz(props.category.id);
    loadQuestions().then(() => {
      console.log('restarted');
      currentQuestionIndex.value = 0;
    });
  }

  async function loadQuestions() {
    try {
      let allQuestions;
      if (import.meta.env.MODE === 'development') {
        const jsonData = await import(
          /* @vite-ignore */ props.category.jsonPath
        );
        allQuestions = jsonData.default;
      } else {
        const basePath = import.meta.env.BASE_URL;
        const jsonPath = `${basePath}${props.category.jsonPath}`;
        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        allQuestions = await response.json();
      }

      appStore.setTotal({
        total: allQuestions.length,
        categoryId: props.category.id,
      });

      const answeredQuestions = appStore.getQuestionsAnswered(
        props.category.id
      );
      questions.value = shuffleArray(
        allQuestions.filter((q) => !answeredQuestions.includes(q.id))
      );
    } catch (error) {
      console.error('Error loading questions!', error);
    }
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  /*
  keyboard shortcut
*/
  const handleKeyDown = (event) => {
    const key = parseInt(event.key);
    if (
      !isNaN(key) &&
      key >= 1 &&
      key <= currentQuestion.value.answers.length
    ) {
      selectAnswer(currentQuestion.value.answers[key - 1]);
    }
  };

  onMounted(() => {
    appStore.createScoreState(props.category.id);
    loadQuestions();
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>
