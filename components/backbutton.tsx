'use client'

import { useRouter } from 'next/navigation'

export default function() {
  const router = useRouter()

    return(
        <header className="z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center ">
          <div className="flex items-center gap-4 ">
            <button
              onClick={() => router.back()}
              className="p-2 flex hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className='text-xl font-bold'>Back</span>
            </button>
          </div>
        </div>
      </header>
)}