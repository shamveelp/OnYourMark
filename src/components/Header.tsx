'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Bookmark } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
    const { user, signOut } = useAuth()

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                        <Bookmark className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Smart Bookmarks</h1>
                        <p className="text-sm text-gray-600">Your personal bookmark manager</p>
                    </div>
                </div>

                {user && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user.user_metadata?.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                                    {getInitials(user.user_metadata?.full_name || user.email || 'U')}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700 hidden sm:inline">
                                {user.user_metadata?.full_name || user.email}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={signOut}
                            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}