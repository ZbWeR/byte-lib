import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { CategoryDetail } from "@/components/category/category-detail"
import { categories, categoryBySlug } from "@/lib/data/library"

export const dynamicParams = false

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = categoryBySlug.get(slug)
  if (!category) {
    return { title: "未收录" }
  }
  return {
    title: category.name,
    description: category.description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!categoryBySlug.has(slug)) {
    notFound()
  }

  return (
    <Suspense>
      <CategoryDetail slug={slug} />
    </Suspense>
  )
}
