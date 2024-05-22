<template>
  <Topbar
    @selectTopbar="handleSelect"
    :isWrongAnswersActive="isWrongAnswersActive"
  />
  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <Menu
        :categories="categories"
        @select="handleSelect"
        v-show="!menuStore.selectedCategory"
      />
      <Quizz
        v-if="menuStore.selectedCategory"
        :category="menuStore.selectedCategory"
      />
    </div>
  </main>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import Quizz from './components/Quizz.vue';
  import Menu from './components/Menu.vue';
  import Topbar from './components/Topbar.vue';

  import { useMenuStore } from './stores/menu';
  import { useAppStore } from './stores/app';

  const menuStore = useMenuStore();
  const appStore = useAppStore();
  const isWrongAnswersActive = computed(() =>
    categories.value.some((cat) => cat.id == 0)
  );

  const handleSelect = (category) => {
    if (category === '0') {
      category = categories.value.filter((cat) => cat.id === 0)[0];
    }
    menuStore.setSelectedCategory(category);
  };

  const categories = ref([]);

  if (import.meta.env.MODE === 'development') {
    categories.value.push(
      {
        id: 18,
        name: '2Questions',
        jsonPath: '../assets/teste2.json',
      },
      {
        id: 17,
        name: '10Questions',
        jsonPath: '../assets/teste10.json',
      }
    );
  }
  categories.value.push(
    {
      id: 1,
      name: 'Cedência de Passagem',
      jsonPath: '../assets/cedencia_de_passagem.json',
    },
    {
      id: 2,
      name: 'Circulação, segurança e veículos em missão urgente de socorro',
      jsonPath:
        '../assets/circulacao_seguranca_e_veiculos_em_missao_urgente_de_socorro.json',
    },
    {
      id: 3,
      name: 'Classificação, constituintes, inspecções, pesos e dimensões, protecção de ambiente, equipamentos de segurança, acidente',
      jsonPath:
        '../assets/classificacao_constituintes_inspeccoes_pesos_e_dimensoes_proteccao_de_ambiente_equipamentos_de_seguranca_acidente.json',
    },
    {
      id: 4,
      name: 'Estado físico do condutor, alcool, drogas e medicamentos, sinais de obrigação',
      jsonPath:
        '../assets/estado_fisico_do_condutor_alcool_drogas_e_medicamentos_sinais_de_obrigacao.json',
    },
    {
      id: 5,
      name: 'Iluminação, passageiros e carga, condução defensiva e peões',
      jsonPath:
        '../assets/iluminacao_passageiros_e_carga_conducao_defensiva_e_peoes.json',
    },
    {
      id: 6,
      name: 'Outras Manobras',
      jsonPath: '../assets/outras_manobras.json',
    },
    {
      id: 7,
      name: 'Paragem, estacionamento e cruzamento de veículos',
      jsonPath:
        '../assets/paragem_estacionamento_e_cruzamento_de_veiculos.json',
    },
    {
      id: 8,
      name: 'Sinais de Indicação',
      jsonPath: '../assets/sinais_de_indicacao.json',
    },
    {
      id: 9,
      name: 'Sinais de Perigo',
      jsonPath: '../assets/sinais_de_perigo.json',
    },
    {
      id: 10,
      name: 'Sinais de prescrição específica, sinais de cedência de passagem',
      jsonPath:
        '../assets/sinais_de_prescricao_especifica_sinais_de_cedencia_de_passagem.json',
    },
    {
      id: 11,
      name: 'Sinais de proibição',
      jsonPath: '../assets/sinais_de_proibicao.json',
    },
    {
      id: 12,
      name: 'Sinalização luminosa, marcas no pavimento e outra sinalização',
      jsonPath:
        '../assets/sinalizacao_luminosa_marcas_no_pavimento_e_outra_sinalizacao.json',
    },
    {
      id: 13,
      name: 'Títulos de condução, obtenção, revalidação, responsabilidade civil e criminal, contra-ordenações, cassação',
      jsonPath:
        '../assets/titulos_de_conducao_obtencao_revalidacao_responsabilidade_civil_e_criminal_contra-ordenacoes_cassacao.json',
    },
    {
      id: 14,
      name: 'Ultrapassagem',
      jsonPath: '../assets/ultrapassagem.json',
    },
    { id: 15, name: 'Velocidade', jsonPath: '../assets/velocidade.json' },
    {
      id: 16,
      name: 'Vias de trânsito, condições ambientais adversas',
      jsonPath: '../assets/vias_de_transito_condicoes_ambientais_adversas.json',
    }
  );

  async function loadAndFilterWrongAnswers(allWrongAnswers) {
    async function loadJson(category) {
      let allQuestions;
      if (import.meta.env.MODE === 'development') {
        const jsonData = await import(
          /* @vite-ignore */ category.jsonPath.slice(1)
        );
        allQuestions = jsonData.default;
      } else {
        const basePath = import.meta.env.BASE_URL;
        const jsonPath = `${basePath}${category.jsonPath.slice(2)}`;
        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        allQuestions = await response.json();
      }
      return allQuestions;
    }

    function filterWrongAnswers(questions, wrongAnswerIds) {
      return questions.filter((question) =>
        wrongAnswerIds.includes(String(question.id))
      );
    }

    const result = {};

    for (const categoryKey in allWrongAnswers) {
      if (allWrongAnswers.hasOwnProperty(categoryKey)) {
        const wrongAnswerIds = allWrongAnswers[categoryKey];

        // Find the category in the categories array
        const category = categories.value.find(
          (cat) => cat.id === parseInt(categoryKey, 10)
        );

        if (category) {
          try {
            const allQuestions = await loadJson(category);
            const filteredQuestions = filterWrongAnswers(
              allQuestions,
              wrongAnswerIds
            );
            result[categoryKey] = filteredQuestions;
          } catch (error) {
            console.error(
              `Error loading or filtering questions for category ${category.name}:`,
              error
            );
          }
        } else {
          console.warn(
            `Category with id ${categoryKey} not found in categories array.`
          );
        }
      }
    }

    return result;
  }

  const allPastWrongAnswers = appStore.getAllPastWrongAnswers();

  if (Object.keys(allPastWrongAnswers).length !== 0) {
    loadAndFilterWrongAnswers(allPastWrongAnswers).then((pastWrongAnswers) => {
      const allQuestions = Object.values(pastWrongAnswers).reduce(
        (acc, question) => acc.concat(question),
        []
      );

      const wrongAnswersCategory = {
        id: 0,
        name: 'Questões Erradas',
        jsonPath: null,
        questions: allQuestions,
      };

      categories.value.push(wrongAnswersCategory);
    });
  }
</script>
