'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Bookmark, Chrome, Zap, Shield, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/bookmarks')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to bookmarks
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 transition-transform hover:scale-110 duration-300">
              <Image
                src="/OnYourMark/logo.png"
                alt="OnYourMark Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            OnYourMark
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal, secure, and real-time bookmark manager. Save, organize, and access your favorite links from anywhere.
          </p>
          <Button
            onClick={signInWithGoogle}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg px-8 py-3 text-lg"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
            <CardHeader className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Real-time Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Changes sync instantly across all your devices and browser tabs
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
            <CardHeader className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Private & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your bookmarks are completely private with enterprise-level security
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
            <CardHeader className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                <Chrome className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Easy Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple Google sign-in gets you started in seconds
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
            <CardHeader className="text-center">
              <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">User Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Clean, intuitive interface designed for everyday use
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to get started?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of users who trust OnYourMark to keep their favorite links organized and accessible.
              </p>
              <Button
                onClick={signInWithGoogle}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg px-8 py-3"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}