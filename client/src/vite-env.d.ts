/// <reference types="vite/client" />

declare module '@/components/*' {
  import type { ComponentType } from 'react'
  const component: ComponentType
  export default component
}

declare module '@/lib/*' {
  const value: any
  export default value
}

declare module '@/services/*' {
  const service: any
  export default service
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
