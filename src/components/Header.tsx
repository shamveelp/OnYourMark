'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import { LogOut, Bookmark } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function Header() {
    const { user, signOut } = useAuth()
    const [isScrolled, setIsScrolled] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Determine if we should shrink/expand based on direction and position
            if (currentScrollY < 10) {
                // At the very top
                setIsScrolled(false)
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down
                setIsScrolled(true)
            } else if (currentScrollY < lastScrollY - 10) {
                // Scrolling up (with a small buffer to avoid flickering)
                setIsScrolled(false)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header
            className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out w-[95%] max-w-5xl",
                "bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl",
                isScrolled ? "py-2 px-4 translate-y-0" : "py-4 px-6 translate-y-2"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "relative flex items-center justify-center transition-all duration-300",
                        isScrolled ? "scale-95 w-10 h-10" : "scale-100 w-12 h-12"
                    )}>
                        <Image
                            src="/OnYourMark/logo.png"
                            alt="OnYourMark Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className={cn(
                            "font-bold text-gray-900 transition-all duration-300",
                            isScrolled ? "text-lg" : "text-xl"
                        )}>
                            OnYourMark
                        </h1>
                        {!isScrolled && (
                            <p className="text-xs text-gray-500 font-medium">Bookmark Manager</p>
                        )}
                    </div>
                </div>

                {user && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex flex-col items-end mr-1">
                                <span className="text-sm font-semibold text-gray-900 leading-none">
                                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                                </span>
                                <span className="text-[10px] text-gray-500">Premium User</span>
                            </div>
                            <Avatar className={cn(
                                "border-2 border-white shadow-sm transition-all duration-300",
                                isScrolled ? "w-8 h-8" : "w-10 h-10"
                            )}>
                                <AvatarImage src={user.user_metadata?.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                                    {getInitials(user.user_metadata?.full_name || user.email || 'U')}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={signOut}
                            className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}
