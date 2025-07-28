'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import AIAgent from '@/components/AIAgent'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Glass morphism background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-10 right-10 w-64 h-64 bg-pink-500/3 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <FeaturesSection />
      </div>

      {/* AI Agent - Fixed at bottom center */}
      <AIAgent />
    </main>
  )
}
