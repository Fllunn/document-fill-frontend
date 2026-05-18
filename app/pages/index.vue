<script setup lang="ts">
</script>
<template>
  <v-container fluid class="pa-0 page-wrapper">
    <!-- <v-row > -->

    <section class="hero">
      <v-container>
        <v-row align="center" style="min-height: 60vh;">

          <v-col cols="12" md="7" class="pa-10">
      
             <div class="brand-title mb-4">
                Doctemp
             </div>

             <h1 class="font-weight-bold">
                Автоматизация документов <br>
                без головной боли
             </h1>
          </v-col>

          <v-col cols="12" md="5" class="d-flex justify-center align-center">
            <v-img
              src="/images/first-section2.jpg"
              max-width="600"
              cover
              
              class="rounded-xl hero-img"
            />
          </v-col>

        </v-row>
      </v-container>
    </section>

    
    <section class="features-section">
      <v-container>

        <v-row >
          <v-col cols="12" md="9">

            <h2 class="section-title">
              Почему Doctemp?
            </h2>

            <div class="feature-box">

            <div class="feature-item">
              <v-icon icon="mdi-check" color="#7c4dff" />
              <div class="feature-text">Экономит время при заполнении документов</div>
            </div>

            <div class="feature-item">
              <v-icon icon="mdi-check" color="#7c4dff" />
              <div class="feature-text">Снижает количество ошибок при вводе данных</div>
            </div>

            <div class="feature-item">
              <v-icon icon="mdi-check" color="#7c4dff" />
              <div class="feature-text">Бесплатная альтернатива платным сервисам</div>
            </div>

            </div>

            <h2 class="section-title mt-10">
              Какие возможности мы предоставляем?
            </h2>

        <v-row  class="mt-8" dense>
  
          <v-col cols="12" sm="6" md="3">
            <v-card class="feature-card pa-6 text-center" variant="outlined">
              <v-icon size="48">mdi-file-document-outline</v-icon>
              <div class="mt-4 feature-title">
                Создание шаблонных документов
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="feature-card pa-6 text-center" variant="outlined">
              <v-icon size="48">mdi-folder-outline</v-icon>
              <div class="mt-4 feature-title">
                Хранение шаблонов
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="feature-card pa-6 text-center" variant="outlined">
              <v-icon size="48">mdi-file-pdf-box</v-icon>
              <div class="mt-4 feature-title">
                Экспорт в PDF / DOCX
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="feature-card pa-6 text-center" variant="outlined">
              <v-icon size="48">mdi-form-textbox</v-icon>
              <div class="mt-4 feature-title">
                Удобное заполнение
              </div>
            </v-card>
          </v-col>

        </v-row>

          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>


<style scoped>
.hero {
  min-height: 60vh;
  background: linear-gradient(135deg, #e9e4ff, #cfc8ff);
  display: flex;
} 
.feature-box {
  border: 2px solid #7c4dff;
  border-radius: 16px;
  padding: 16px 20px;
  background: transparent;

  max-width: 700px;
  width: 100%;
}

.feature-box .v-list,
.feature-box .v-list-item {
  background: transparent !important;
}


.brand-title {
  font-size: clamp(48px, 6vw, 84px);
  font-weight: 900;
  color: #4E36FF;
  letter-spacing: -1px;
}

/* адаптив под мобилки */
@media (max-width: 600px) {
  .brand-title {
    font-size: 40px;
  }}
  /* убираем белые поля страницы */
.page-wrapper {
  min-height: 100vh;
}
.feature-item {
  display: flex;
  align-items: center; /* ВАЖНО */
  gap: 12px;
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 500;
}

.section-title {
  margin-top: 16px;
  margin-bottom: 16px; /* или 24px */
}

.feature-text {
  font-size: 22px;
  font-weight: 500;
  line-height: 1.4;
  color: #2c2c2c;
}

.hero-img {
  box-shadow: 0 20px 50px rgba(124, 77, 255, 0.35);
}


.feature-card {
  transition: all 0.2s ease;
  border-color: #000000 !important;
  background: white;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #7C4DFF !important;
  box-shadow: 0 8px 20px rgba(124, 77, 255, 0.1);
}
</style>