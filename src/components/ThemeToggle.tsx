import type { MouseEvent } from 'react'
import { toggleTheme, useTheme } from '../lib/theme'

// A square split in two: the half that is filled shows which theme is on.
// The ripple starts where you clicked; from the keyboard it starts at the button.
export function ThemeToggle({ className = '', withLabel = false }: { className?: string; withLabel?: boolean }) {
  const theme = useTheme()
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const fromKeyboard = e.detail === 0
    toggleTheme(fromKeyboard ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: e.clientX, y: e.clientY })
  }
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button type="button" onClick={onClick} aria-label={`Switch to ${next} theme`} className={className}>
      <span aria-hidden className="relative block size-3 border border-current">
        <span
          className={`absolute inset-y-0 left-0 w-1/2 bg-current transition-transform duration-500 ease-soft ${theme === 'light' ? 'translate-x-full' : ''}`}
        />
      </span>
      {withLabel && <span>{theme === 'light' ? 'Light' : 'Dark'}</span>}
      {!withLabel && (
        <span className="dock-tip t-label text-[0.6875rem]" aria-hidden>
          {next} theme
        </span>
      )}
    </button>
  )
}
