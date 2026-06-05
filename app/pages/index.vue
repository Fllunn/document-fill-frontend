<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const audience = [
  {
    title: 'Для юристов',
    text: 'Быстрое создание договоров и шаблонных документов.',
    icon: 'mdi-scale-balance'
  },
  {
    title: 'Для HR',
    text: 'Автоматизация кадровых документов.',
    icon: 'mdi-account-group'
  },
  {
    title: 'Для бухгалтеров',
    text: 'Работа со счетами и актами.',
    icon: 'mdi-calculator'
  },
  {
    title: 'Для бизнеса',
    text: 'Экономия времени сотрудников.',
    icon: 'mdi-briefcase'
  },
  {
    title: 'Для стартапов',
    text: 'Быстрое масштабирование документооборота.',
    icon: 'mdi-rocket-launch'
  },
  {
    title: 'Для менеджеров',
    text: 'Меньше рутины и ручного заполнения.',
    icon: 'mdi-chart-line'
  }
]

const steps = [
  {
    number: '01',
    title: 'Создайте шаблон',
    text: 'Подготовьте документ, который будете использовать многократно.'
  },
  {
    number: '02',
    title: 'Добавьте поля [ ]',
    text: 'Отметьте места для автоматического заполнения данными.'
  },
  {
    number: '03',
    title: 'Загрузите шаблон',
    text: 'Сохраните шаблон в системе Doctemp.'
  },
  {
    number: '04',
    title: 'Заполните данные',
    text: 'Введите необходимые значения в подготовленные поля.'
  },
  {
    number: '05',
    title: 'Получите документ',
    text: 'Выгрузите готовый файл в PDF или DOCX.'
  }
]
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

        <v-row>
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
            </v-col>
        </v-row>

        <v-row justify="center">
            <h2 class="section-title mt-10">
              Какие возможности мы предоставляем?
            </h2>
        </v-row>
            
        <v-row >
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
          
      </v-container>
    </section>

    <section class="steps-section">
      <v-container>

        <v-row>
          <v-col cols="12">
            <h2 class="section-title">
              Как создать документ?
            </h2>

            <div class="timeline">
              <div
                v-for="step in steps"
                :key="step.number"
                class="timeline-item"
              >
                <div class="timeline-marker">
                  {{ step.number }}
                </div>

                <div class="timeline-content">
                  <div class="timeline-title">
                    {{ step.title }}
                  </div>

                  <div class="timeline-text">
                    {{ step.text }}
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="audience-section">
      <v-container>

        <v-row justify="center">
          <h2 class="section-title">
            Кому подходит Doctemp?
          </h2>
        </v-row>

        <v-row>
          <v-col
            v-for="(item, index) in audience.slice(0, 3)"
            :key="index"
            cols="12"
            md="4"
          >
            <v-card class="audience-card pa-8 text-center h-100">

              <v-icon
                :icon="item.icon"
                size="56"
                color="#7C4DFF"
              />

              <div class="audience-title mt-4">
                {{ item.title }}
              </div>

              <div class="audience-text mt-3">
                {{ item.text }}
              </div>

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
    

    <section class="audience-section">
      <v-container>

        <v-row justify="center">
          <h2 class="section-title">
            Кому подходит Doctemp?
          </h2>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-card class="audience-card pa-8 text-center h-100">
              Быстрое создание договоров и шаблонных документов.
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="audience-card pa-8 text-center h-100">
              Автоматизация кадровых документов.
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="audience-card pa-8 text-center h-100">
              Работа со счетами и актами.
            </v-card>
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

@media (max-width: 600px) {
  .brand-title {
    font-size: 40px;
  }}

.page-wrapper {
  min-height: 100vh;
}
.feature-item {
  display: flex;
  align-items: center; 
  gap: 12px;
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 500;
}

.section-title {
  margin-top: 16px;
  margin-bottom: 16px;
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

.audience-section {
  overflow: hidden;
}

.audience-swiper {
  width: 100%;
  padding: 40px 0;
  overflow: hidden;
}


.audience-card {
  border-radius: 28px;
  border: 2px solid #7C4DFF;
  min-height: 260px;

  transition: all 0.3s ease;
}

.audience-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(124, 77, 255, 0.15);
}

.audience-title {
  font-size: 28px;
  font-weight: 700;
}

.steps-section {
  padding: 80px 0;
}

.timeline {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 23px;
  top: 20px;
  bottom: 20px;

  width: 3px;
  background: #7C4DFF;
}

.timeline-item {
  position: relative;

  display: flex;
  align-items: flex-start;
  gap: 24px;

  margin-bottom: 32px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  flex-shrink: 0;

  width: 48px;
  height: 48px;

  border-radius: 50%;

  background: #7C4DFF;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: 700;

  position: relative;
  z-index: 2;
}

.timeline-content {
  flex: 1;

  padding: 20px 24px;

  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 16px;

  transition: .2s ease;
}

.timeline-content:hover {
  border-color: #7C4DFF;
  box-shadow: 0 8px 20px rgba(124, 77, 255, 0.1);
}

.timeline-title {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.3;
}

.timeline-text {
  margin-top: 8px;

  font-size: 16px;
  line-height: 1.6;

  color: #6B7280;
}

@media (max-width: 768px) {
  .timeline::before {
    left: 19px;
  }

  .timeline-marker {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .timeline-content {
    padding: 16px;
  }

  .timeline-title {
    font-size: 18px;
  }

  .timeline-text {
    font-size: 14px;
  }
}
</style>