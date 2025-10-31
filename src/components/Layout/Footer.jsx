import React from 'react'

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold">Logo</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We deliver smooth, high-quality background music experiences powered by YouTube. you enjoy the rhythm of creativity that bring music to life.
            </p>
          </div>
         
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin
                  size={16}
                  className="text-white mt-1 flex-shrink: 0"
                />
                <span className="text-gray-400 text-sm">
                  Devpukur
                  <br />
                  Barrackpur-Barasat Road
                  <br />
                  Barrackpur, West Bengal, 7000121
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-white flex-shrink: 0" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-white flex-shrink: 0" />
                <span className="text-gray-400 text-sm">pocketplaylist@123gmail.com</span>
              </div>
            </div>
          </div>

          {/* Stay Updated */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
              <div className="flex flex-row  gap-5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-3 bg-gray-800 border border-gray-700 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 "
                />
                <button className=" bg-white hover:bg-gray-700 hover:text-white text-black rounded-2xl p-0.5 transition-colors font-medium">
                  Conect us
                </button>
              </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex md:flex-row items-center justify-center ">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 pocket-playlist. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
