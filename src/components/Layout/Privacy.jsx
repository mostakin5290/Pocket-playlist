import React from 'react'
import Header from './Header'
import Footer from './Footer'

function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-[100px] md:pt-[120px] pb-12">
        <Header />
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card text-foreground rounded-xl md:rounded-2xl shadow-xl border border-border p-6 md:p-10 fade-up">
                <h1 className='text-2xl md:text-3xl font-bold mb-2 text-center'>Privacy Policy</h1>
                <p className='text-sm font-medium text-muted-foreground mb-6 text-center'>Last Updated: <span className='text-xs text-foreground/80'>2-Nov-2025</span></p>
                <div className='flex flex-col items-start gap-4 text-sm'>
                    <p><strong>1. Technical Data Collection:</strong> When you visit our website or use our app, our servers may automatically collect standard technical information sent by your device or browser. This includes your IP address, browser type and version, device and operating system details, pages visited, visit time and duration, and general diagnostic data used to improve performance and security.</p>
                    <p><strong>2. Personal Information:</strong> We do not require users to create an account or log in to use our app. All playlist data is stored locally in your browser's storage (localStorage). If you contact us for feedback or support, we may collect limited personal information such as your name, email address, and any message you choose to send. This information is used solely to respond to your inquiries.</p>
                    <p><strong>3. YouTube API Usage:</strong> Pocket Playlist uses the YouTube Data API to fetch video and playlist metadata (titles, thumbnails, channel names) and the YouTube Iframe API to embed the player. Your interactions with the player are subject to YouTube's Terms of Service and Privacy Policy.</p>
                    <p><strong>4. Changes to Policy:</strong> We may update this Privacy Policy from time to time. Any updates will be posted here, and the <span className='font-mono'>"Last Updated"</span> date will be revised accordingly. We encourage you to review this policy periodically.</p>
                </div>
            </div>
        </div>
        <Footer />
    </div>

  )
}

export default Privacy