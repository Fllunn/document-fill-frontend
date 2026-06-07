import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ScrollRevealOptions {
  y?: number
  duration?: number
  start?: string
  ease?: string
}

export function useScrollReveal() {
  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
  })

  function reveal(selector: string, options: ScrollRevealOptions = {}) {
    const { y = 100, duration = 1.2, start = 'top 70%', ease = 'power2.out' } = options
    gsap.from(selector, {
      y,
      opacity: 0,
      duration,
      ease,
      scrollTrigger: {
        trigger: selector,
        start,
      },
    })
  }

  return { reveal }
}
