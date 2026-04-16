<script setup lang="ts">
</script>
<template>
  <v-container>
    <v-row>

      <v-col class="full-height-block" cols="12">
        <v-parallax src=" /images/first-section2.jpg" class="h-100 d-flex justify-center align-center user-select-none"
          draggable="false" cover gradient="rgba(0,0,0,0.5), rgba(0,0,0,0.5)">
>>
          <v-row class="d-flex justify-center align-center">

            <!-- <v-col cols="12" class="d-flex justify-center align-center mb-16">
              <v-img src="/icons/logo.png" height="256px" draggable="false" class="user-select-none"
                :style="{ height: 'clamp(12.5rem, 2.5568rem + 28.4091vw, 25rem)', width: 'auto', maxWidth: 'min(90vw, 400px)' }"></v-img>
            </v-col> -->

            <v-col cols="12" class="d-flex justify-center align-center mb-16">
              <h1>Лучшее веб приложение для автозаполнения документов</h1>
              <!-- <v-btn color="yellow-darken-2" size="large"> Попробовать </v-btn> -->
            </v-col>
            
          </v-row>
        </v-parallax>
      </v-col>

      <v-col cols="12" style="margin: clamp(3.125rem, -10.2083rem + 20.8333vw, 6.25rem) 0 !important;">
        <v-row class="d-flex justify-center">
          <v-col cols="11" md="9" class="justify-center align-center">
            <h1>Интерьер</h1>
            <h2>
              <br>
              Какой-то текст
            </h2>
          </v-col>
        </v-row>
      </v-col>



      <v-col cols="12">
        <h1>Добро пожаловать</h1>
      </v-col>

      <v-col cols="12">
        Информация
      </v-col>

      <v-col cols="12">
        Информация
      </v-col>
    </v-row>
  </v-container>
</template>