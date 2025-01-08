import React from 'react'
import { Metadata } from 'next'
import CategoriesContent from '../../components/categories/CategoriesContent'

export const metadata: Metadata = {
  title: 'Categories - SY Jewelry',
  description: 'Browse our jewelry categories including rings, necklaces, and earrings',
}

export default function CategoriesPage() {
  return <CategoriesContent />
} 