'use client'

import { ArrowRight, Shield, Zap, Users } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Banking
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            AVEN is building the future of banking. Join us in creating a more inclusive, 
            transparent, and intelligent financial system.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="group glass-button px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 hover:shadow-2xl">
            <span>Join the Waitlist</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="glass-button px-8 py-4 rounded-full text-lg font-semibold border-2 border-white/30">
            Learn More
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-feature-card p-6 hover:scale-105 transition-transform duration-300">
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Inclusive</h3>
            <p className="text-white/70">Building a financial system that works for everyone</p>
          </div>
          
          <div className="glass-feature-card p-6 hover:scale-105 transition-transform duration-300">
            <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transparent</h3>
            <p className="text-white/70">Clear, honest, and straightforward financial services</p>
          </div>
          
          <div className="glass-feature-card p-6 hover:scale-105 transition-transform duration-300">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Intelligent</h3>
            <p className="text-white/70">AI-powered insights and personalized financial guidance</p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/60 mb-4">Building the future, together</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold">Coming Soon</div>
            <div className="text-sm">Join the Revolution</div>
            <div className="text-sm">AI-Powered</div>
            <div className="text-sm">Built for You</div>
          </div>
        </div>
      </div>
    </section>
  )
}
