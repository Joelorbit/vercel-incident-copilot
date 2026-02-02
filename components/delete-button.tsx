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
      console.log('[v0] Deleting incident:', id)
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      console.log('[v0] Delete response:', data)

      if (res.ok) {
        router.refresh()
      } else {
        console.error('[v0] Delete failed:', data)
      }
    } catch (error) {
      console.error('[v0] Failed to delete:', error)
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
