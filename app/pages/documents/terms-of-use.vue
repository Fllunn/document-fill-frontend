<script setup lang="ts">

import { getTermsOfUse } from '~/data/termsOfUse'

const config = useRuntimeConfig()

const termsOfUse = getTermsOfUse(config.public.siteUrl)

</script>

<template>
  <DocumentContent :blocks="termsOfUse" />
</template>
