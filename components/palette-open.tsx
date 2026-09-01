"use client"

import { createContext, useContext } from "react"

export const PaletteOpenContext = createContext(false)

export function usePaletteOpen() {
  return useContext(PaletteOpenContext)
}
