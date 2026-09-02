import {
  Atom01Icon,
  BookOpen02Icon,
  Briefcase01Icon,
  CpuIcon,
  Dna01Icon,
  Globe02Icon,
  Grid02Icon,
  LibraryIcon,
  MicrochipIcon,
  Robot01Icon,
  SignalIcon,
  SourceCodeIcon,
  StethoscopeIcon,
} from "@hugeicons/core-free-icons"

const categoryIcons = {
  general: BookOpen02Icon,
  cs: CpuIcon,
  medicine: StethoscopeIcon,
  software: SourceCodeIcon,
  glasgow: Globe02Icon,
  automation: Robot01Icon,
  microelectronics: MicrochipIcon,
  infocomm: SignalIcon,
  optoelectronics: Atom01Icon,
  management: Briefcase01Icon,
  others: Grid02Icon,
  life: Dna01Icon,
} as const

export function categoryIcon(slug: string) {
  return categoryIcons[slug as keyof typeof categoryIcons] ?? LibraryIcon
}
