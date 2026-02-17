'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BookmarkForm } from '@/components/BookmarkForm'
import { BookmarkCard } from '@/components/BookmarkCard'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/hooks//useBookmarks'
import { Loader as Loader2, BookmarkX } from 'lucide-react'

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth()
  const { bookmarks, loading: bookmarksLoading, error, addBookmark, deleteBookmark } = useBookmarks()
  const router = useRouter()
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleAddBookmark = async (url: string, title: string) => {
    try {
      await addBookmark(url, title)
      setNotification('Bookmark added successfully!')
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      throw error // Re-throw to let the form handle it
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      await deleteBookmark(id)
      setNotification('Bookmark deleted successfully!')
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification('Failed to delete bookmark')
      setTimeout(() => setNotification(null), 3000)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-8">
        {notification && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
            {notification}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
            {error}
          </div>
        )}

        {/* Add Bookmark Form */}
        <div className="mb-8">
          <BookmarkForm onSubmit={handleAddBookmark} />
        </div>

        {/* Bookmarks List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Bookmarks ({bookmarks.length})
          </h2>

          {bookmarksLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <BookmarkX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
              <p className="text-gray-600 mb-6">
                Add your first bookmark using the form above to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}