'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase, Bookmark } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  useEffect(() => {
    if (!user) return

    // Set up real-time subscription
    const channel = supabase.channel('bookmarks_changes', {
      config: {
        broadcast: { self: false }, // Don't send broadcast to self, we update local state manually
      },
    })

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            setBookmarks((prev) => {
              if (prev.some((b) => b.id === newBookmark.id)) return prev
              return [newBookmark, ...prev]
            })
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            const updatedBookmark = payload.new as Bookmark
            setBookmarks((prev) =>
              prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
            )
          }
        }
      )
      // Add broadcast for instant tab-to-tab sync
      .on('broadcast', { event: 'sync' }, ({ payload }) => {
        if (payload.type === 'INSERT') {
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === payload.data.id)) return prev
            return [payload.data, ...prev]
          })
        } else if (payload.type === 'DELETE') {
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.id))
        }
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null // Clear the ref after removal
      }
    }
  }, [user])

  const addBookmark = async (url: string, title: string) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ url, title, user_id: user.id }])
      .select()
      .single()

    if (error) throw error

    if (data) {
      const newBookmark = data as Bookmark
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === newBookmark.id)) return prev
        return [newBookmark, ...prev]
      })

      // Broadcast to other tabs immediately
      channelRef.current?.send({
        type: 'broadcast',
        event: 'sync',
        payload: { type: 'INSERT', data: newBookmark },
      })
    }
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) throw error

    setBookmarks((prev) => prev.filter((b) => b.id !== id))

    // Broadcast to other tabs immediately
    channelRef.current?.send({
      type: 'broadcast',
      event: 'sync',
      payload: { type: 'DELETE', id },
    })
  }

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    refetch: fetchBookmarks,
  }
}