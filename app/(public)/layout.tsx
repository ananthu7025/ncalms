import React from 'react'
import type { Metadata } from 'next'
import PublicLayoutClient from '@/components/public/PublicLayoutClient'

export const metadata: Metadata = {
  title: 'NCA - Online Learning Platform',
  description: 'Best Online Platform to Learn NCA Courses',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>
}