'use client'

import { useState } from 'react'
import { Menu, X, CreditCard, Home, Phone, Mail } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-20 w-full">
      <nav className="glass-card border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                HELOC Solutions
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>
              <a href="#products" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Credit Products
              </a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                About Us
              </a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </a>
              <button className="glass-button px-6 py-2 rounded-full text-white font-medium">
                Join Waitlist
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass-button-outline p-2 rounded-lg"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass-effect border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-white/80 hover:text-white transition-colors">
                Home
              </a>
              <a href="#products" className="block px-3 py-2 text-white/80 hover:text-white transition-colors">
                Banking
              </a>
              <a href="#about" className="block px-3 py-2 text-white/80 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#contact" className="block px-3 py-2 text-white/80 hover:text-white transition-colors">
                Contact
              </a>
              <button className="w-full mt-4 glass-button px-6 py-2 rounded-full text-white font-medium">
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
