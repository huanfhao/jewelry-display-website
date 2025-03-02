import { Metadata } from 'next'
import { ClientPage } from '@/components/home/ClientPage'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to SY Jewelry Display - Your trusted partner for professional jewelry display solutions.',
  openGraph: {
    title: 'SY Jewelry Display - Home',
    description: 'Welcome to SY Jewelry Display - Your trusted partner for professional jewelry display solutions.'
  }
}

export default function HomePage() {
  return <ClientPage />
}
