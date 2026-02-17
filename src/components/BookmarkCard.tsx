'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Trash2, Loader as Loader2 } from 'lucide-react'
import { Bookmark } from '@/lib/supabase'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => Promise<void>
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(bookmark.id)
    } finally {
      setDeleting(false)
    }
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return url
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card className="group bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] hover:bg-white/80">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate mb-2">
              {bookmark.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span className="truncate">{formatUrl(bookmark.url)}</span>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(bookmark.created_at)}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => window.open(bookmark.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}