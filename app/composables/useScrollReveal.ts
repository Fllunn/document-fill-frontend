import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ScrollRevealOptions {
  y?: number
  duration?: number
  start?: string
  ease?: string
  stagger?: number
  perElement?: boolean
}

export function useScrollReveal() {
  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
  })

  function reveal(selector: string, options: ScrollRevealOptions = {}) {
    const { y = 100, duration = 1.2, start = 'top 70%', ease = 'power2.out', stagger = 0, perElement = false } = options

    if (perElement) {
      gsap.utils.toArray<Element>(selector).forEach(el => {
        gsap.from(el, {
          y,
          opacity: 0,
          duration,
          ease,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play reverse restart reverse',
          },
        })
      })
    } else {
      gsap.from(selector, {
        y,
        opacity: 0,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: selector,
          start,
          toggleActions: 'play reverse restart reverse',
        },
      })
    }
  }

  return { reveal }
}
