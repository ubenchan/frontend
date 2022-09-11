import { Sotore } from 'lib/sotore'
import { createContext } from 'react'

export const Context = createContext<Sotore<Record<string, any>>>(null!)
