'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Loader as Loader2 } from 'lucide-react'

interface BookmarkFormProps {
  onSubmit: (url: string, title: string) => Promise<void>
}

export function BookmarkForm({ onSubmit }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !title.trim()) return

    setLoading(true)
    setError(null)

    try {
      await onSubmit(url.trim(), title.trim())
      setUrl('')
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Enter URL (https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
            <Input
              type="text"
              placeholder="Enter bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !url.trim() || !title.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Bookmark
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}