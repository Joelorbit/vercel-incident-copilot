'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (isDeleting) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-50"
      title="Delete incident"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
