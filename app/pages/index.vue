<script setup lang="ts">
const steps = [
  { title: 'Загрузите шаблон', description: 'Создайте документ в Microsoft Word с полями для заполнения и загрузите его на сайт' },
  { title: 'Заполните шаблон', description: 'Введите нужные данные в удобную форму заполнения на сайте' },
  { title: 'Скачайте готовый документ', description: 'Скачайте заполненный документ в формате DOCX или PDF' },
]

const h1Done = ref(false)

const { reveal } = useScrollReveal()

onMounted(() => {
  reveal('.demo-section')
})
</script>

<template>

  <v-container class="overflow-hidden hero-section">
    <v-row align="center" style="padding: clamp(3rem, 5vw, 6rem) 0;">
      <v-col cols="12" md="6" class="pl-md-10">
        <TypeWriter tag="h1" class="hero-title py-2 font-bold"  :strings="['Создавайте Word документы быстро']" :loop="false" @complete="h1Done = true"/>

        <TypeWriter v-if="h1Done" tag="h2" class="py-4" :strings="['Загрузите файл Word расширения DOCX с полями для заполнения вида {НазваниеПоля}, заполните форму на сайте и скачайте готовый документ в DOCX или PDF']" :loop="false"/>

        <v-row justify="center" justify-sm="start" class="mt-4">
          <v-col cols="auto">
            <v-btn size="x-large" color="primary" class="hero-btn" to="/register">НАЧАТЬ</v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <ImageMain src="/images/template-example.webp" alt="Template Image" title="Пример шаблона документа" cover></ImageMain>
      </v-col>
      
    </v-row>
  </v-container>

  <v-container class="demo-section">
    <TypeWriter tag="h2" class="text-center font-bold" :strings="['Демонстрация работы']" :loop="false" />
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8">
        <div class="demo-video-placeholder">
          <VideoMain src="/videos/demo.mp4" image="/images/demo-preview.webp" />
        </div>
      </v-col>
    </v-row>
  </v-container>

  <HowItWorks :steps="steps" />

</template>

<style scoped>
.hero-section {
  min-height: calc(100vh - var(--v-layout-top, 64px));
  display: flex;
  align-items: center;
}

.hero-title {
  font-size: clamp(1.25rem, 6vw, 4.5rem);
  line-height: 1.2;
}

.hero-btn {
  font-size: clamp(1.25rem, 0.7528rem + 1.4205vw, 1.875rem);
}

.demo-video-placeholder :deep(.work-img) {
  max-height: 70vh;
  height: auto;
  object-fit: contain;
}
</style>