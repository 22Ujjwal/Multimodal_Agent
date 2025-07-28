'use client'

import { Calculator, Clock, DollarSign, FileText, Smartphone, TrendingUp } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Calculator,
      title: "AI-Powered Insights",
      description: "Get personalized financial insights and recommendations powered by advanced AI"
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "24/7 access to your finances with intelligent automation and support"
    },
    {
      icon: DollarSign,
      title: "Fair & Transparent",
      description: "No hidden fees, no surprises. Just clear, honest financial services"
    },
    {
      icon: FileText,
      title: "Financial Education",
      description: "Learn and grow with personalized financial education and guidance"
    },
    {
      icon: Smartphone,
      title: "Seamless Experience",
      description: "Banking that adapts to your life, not the other way around"
    },
    {
      icon: TrendingUp,
      title: "Future-Ready",
      description: "Built for the future with cutting-edge technology and innovation"
    }
  ]

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Why AVEN?
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We're not just building another bank. We're creating a financial system that works for everyone.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-feature-card p-8 hover:scale-105 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="glass-feature-card p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Join the Future?
            </h3>
            <p className="text-white/80 mb-8 text-lg">
              Be part of the revolution. Join the waitlist and be among the first to experience the future of banking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="glass-button px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl">
                Join Waitlist
              </button>
              <button className="glass-button px-8 py-4 rounded-full text-lg font-semibold border-2 border-white/30">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
