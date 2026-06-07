<script setup lang="ts">
const features = [
  { title: 'Создание документов', icon: 'mdi-file-document-outline' },
  { title: 'Хранение шаблонов', icon: 'mdi-folder-outline' },
  { title: 'Экспорт в PDF или DOCX', icon: 'mdi-file-pdf-box' },
  { title: 'Удобное заполнение', icon: 'mdi-form-textbox' },
]

const steps = [
  { title: 'Загрузите шаблон', description: 'Создайте документ в Microsoft Word с полями для заполнения и загрузите его на сайт' },
  { title: 'Заполните шаблон', description: 'Введите нужные данные в удобную форму заполнения на сайте' },
  { title: 'Скачайте готовый документ', description: 'Скачайте заполненный документ в формате DOCX или PDF' },
]

</script>

<template>

  <v-container class="overflow-hidden">
    <v-row align="center" style="padding: clamp(3rem, 5vw, 6rem) 0;">
      <v-col cols="12" md="6" class="pl-md-10">
        <h1 class="hero-title">Создавайте Word и PDF документы быстро</h1>

        <h2 class="py-4">Загрузите файл Word расширения DOCX с полями для заполнения вида {НазваниеПоля}, заполните форму на сайте и скачайте готовый документ в DOCX или PDF</h2>

        <v-btn size="x-large" color="primary" class="mt-4 hero-btn" to="/register">НАЧАТЬ</v-btn>
      </v-col>

      <v-col cols="12" md="6">
        <ImageMain src="/images/template-example.webp" alt="Template Image" title="Пример шаблона документа" cover></ImageMain>
      </v-col>
      
    </v-row>
  </v-container>

  <v-container class="demo-section">
    <h1 class="text-center bold">Демонстрация работы</h1>
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8">
        <div class="demo-video-placeholder">
          <VideoMain src="/videos/demo.mp4" image="/images/demo-preview.png" />
        </div>
      </v-col>
    </v-row>
  </v-container>

  <HowItWorks :steps="steps" />

</template>

<style scoped>
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