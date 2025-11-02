import React from 'react'

function Privacy() {
  return (
    <div class="flex items-center justify-center min-h-screen">
        
        <div class="h-120 w-150 md:h-auto bg-card text-white flex flex-col items-center justify-center rounded-2xl shadow-lg border border-amber-50 gap-1">
            <h1 className='text-2xl font-bold mt-2'>Privacy Policy</h1>
            <p className='text-sm font-bold text-gray-400'>Last Updated: <span className='text-xs text-gray-300'>2-Nov-2025</span></p>
            <div className='flex flex-col items-start gap-1 p-6'>
                <p>1. When you visit our website or use our app, our servers may automatically collect standard technical information sent by your device or browser. This includes your IP address, browser type and version, device and operating system details, pages visited, visit time and duration, and general diagnostic data used to improve performance and security.</p>
                <p>2. We do not require users to create an account or log in to use our app. However, if you contact us for feedback or support, we may collect limited personal information such as your name, email address, and any message you choose to send. This information is used solely to respond to your inquiries and improve our service.</p>
                <p>3. We may update this Privacy Policy from time to time. Any updates will be posted here, and the “Last Updated” date will be revised accordingly.</p>
            </div>
        </div>
    </div>

  )
}

export default Privacy
