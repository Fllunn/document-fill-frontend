import { joinURL } from 'ufo'

// /api/** → backend: браузер и SSR ходят на тот же адрес, что и сайт,
// поэтому наружу нужен один порт (и один SSH-туннель)
export default defineEventHandler((event) => {
  const target = useRuntimeConfig(event).apiProxyTarget as string
  const path = event.path.replace(/^\/api/, '')

  return proxyRequest(event, joinURL(target, path))
})
