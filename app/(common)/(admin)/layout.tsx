import React from 'react'
import auth from "@/auth"
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <DashboardLayout user={session?.user}>
      {children}
    </DashboardLayout>
  )
}
