import { useEffect, useRef } from 'react'
import { useThemeStore } from '../../../../../store/themeStore'

export const BirdsBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null)
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    if (!vantaRef.current) return

    const isLight = theme === 'light'
    const bgColor = isLight ? 0xffffff : 0x0f172a
    const c1 = isLight ? 0x1e3a8a : 0x3b82f6
    const c2 = isLight ? 0x4c1d95 : 0x8b5cf6

    // @ts-ignore
    if (!window.VANTA || !window.VANTA.BIRDS) {
      console.warn('Vanta Birds is not loaded yet or failed to load from CDN');
      return;
    }

    // @ts-ignore
    const effect = window.VANTA.BIRDS({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      backgroundColor: bgColor,
      color1: c1,
      color2: c2,
      birdSize: 0.5,
      speedLimit: 4,
    })

    return () => {
      if (effect) effect.destroy()
    }
  }, [theme])

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'absolute',
        inset: 0,
      }}
    />
  )
}