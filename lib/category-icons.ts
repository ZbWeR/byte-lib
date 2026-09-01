import {
  Book02Icon,
  Building06Icon,
  GraduationScrollIcon,
  LibraryIcon,
  SearchVisualIcon,
  SourceCodeIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"

const categoryIcons = {
  campus: Building06Icon,
  learn: Book02Icon,
  research: SearchVisualIcon,
  code: SourceCodeIcon,
  tools: Wrench01Icon,
  future: GraduationScrollIcon,
} as const

export function categoryIcon(slug: string) {
  return categoryIcons[slug as keyof typeof categoryIcons] ?? LibraryIcon
}
