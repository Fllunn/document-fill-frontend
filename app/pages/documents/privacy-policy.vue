<script setup lang="ts">

import { getPrivacyPolicy } from '~/data/privacyPolicy'

const config = useRuntimeConfig()

const privacyPolicy = getPrivacyPolicy(config.public.siteUrl)

</script>

<template>
  <DocumentContent :blocks="privacyPolicy" />
</template>
