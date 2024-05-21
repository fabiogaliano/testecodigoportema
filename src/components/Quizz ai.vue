<template>
  <div
    class="bg-gray-200 min-h-screen flex flex-col items-center justify-center"
  >
    <Scoreboard :score="currentScore" />
    <div id="quiz-container" class="w-full px-4 max-w-lg">
      <QuestionDisplay
        v-if="currentQuestion"
        :currentQuestion="currentQuestion"
        @select-answer="selectAnswer"
      />
      <p v-else>Loading questions...</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
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

  const currentQuestion = computed(() => {
    const currentIndex = appStore.currentIndex.value[props.category.name];
    return questions.value.length > 0 && currentIndex < questions.value.length
      ? questions.value[currentIndex]
      : null;
  });

  const currentScore = computed(
    () => appStore.score.value[props.category.name]
  );

  const logQuestion = () => {
    if (currentQuestion.value) {
      console.log('Current Question:', currentQuestion.value);
    }
  };

  const selectAnswer = (answer) => {
    if (answer.option === currentQuestion.value.correctAnswer) {
      appStore.updateScore(props.category.name, true);
    } else {
      appStore.updateScore(props.category.name, false);
    }

    if (
      appStore.currentIndex.value[props.category.name] >= questions.value.length
    ) {
      endQuiz();
    } else {
      logQuestion();
    }
  };

  const loadQuestions = async () => {
    try {
      const jsonData = await import(/* @vite-ignore */ props.category.jsonPath);
      const allQuestions = jsonData.default;
      const answeredQuestions = appStore.getQuestionsAnswered(
        props.category.name
      );
      questions.value = shuffleArray(
        allQuestions.filter((q) => !answeredQuestions.includes(q.id))
      );
      appStore.setTotal(props.category.name, questions.value.length);
    } catch (error) {
      console.error('Error loading questions!');
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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
    loadQuestions();
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  watch(
    () => props.category.name,
    () => {
      loadQuestions();
    }
  );
</script>
