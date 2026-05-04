<script setup lang="ts">

defineProps(['blocks'])

</script>

<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(block, index) in blocks"
        :key="index"
        cols="12"
      >
        <h1 v-if="block.type === 'title'">
          {{ block.text }}
        </h1>

        <h2 v-else-if="block.type === 'heading'">
          {{ block.text }}
        </h2>

        <v-row v-else-if="block.type === 'list'">
          <v-col
            v-for="(item, itemIndex) in block.items"
            :key="itemIndex"
            cols="12"
            class="d-flex"
          >
            <v-icon
              icon="mdi-circle-small"
            />

            <v-responsive>
              <template v-if="typeof item === 'string'">
                {{ item }}
              </template>

              <template v-else>
                <template
                  v-for="(part, partIndex) in item"
                  :key="partIndex"
                >
                  <NuxtLink
                    v-if="typeof part !== 'string' && 'href' in part"
                    :to="part.href"
                    class="text-decoration-none text-high-emphasis"
                  >
                    {{ part.text }}
                  </NuxtLink>

                  <template v-else-if="typeof part !== 'string'">
                    {{ part.text }}
                  </template>

                  <template v-else>
                    {{ part }}
                  </template>
                </template>
              </template>
            </v-responsive>
          </v-col>
        </v-row>

        <v-row v-else-if="block.type === 'text'">
          <v-col cols="12">
            <template
              v-for="(part, partIndex) in block.parts"
              :key="partIndex"
            >
              <NuxtLink
                v-if="typeof part !== 'string' && 'href' in part"
                :to="part.href"
                class="text-decoration-none text-high-emphasis"
              >
                {{ part.text }}
              </NuxtLink>

              <template v-else-if="typeof part !== 'string'">
                {{ part.text }}
              </template>

              <template v-else>
                {{ part }}
              </template>
            </template>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
