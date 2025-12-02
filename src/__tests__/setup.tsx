import "@testing-library/jest-dom"

import { vi } from "vitest"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(() => null),
}
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(() => null),
}
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
  writable: true,
})

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
})

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  root = null
  rootMargin = ""
  thresholds = []
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
})

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
})

// Mock requestAnimationFrame
Object.defineProperty(window, "requestAnimationFrame", {
  writable: true,
  value: (callback: FrameRequestCallback) => setTimeout(callback, 0),
})

// Mock cancelAnimationFrame
Object.defineProperty(window, "cancelAnimationFrame", {
  writable: true,
  value: (id: number) => clearTimeout(id),
})

// Suppress console errors in tests (optional)
// vi.spyOn(console, "error").mockImplementation(() => {})
