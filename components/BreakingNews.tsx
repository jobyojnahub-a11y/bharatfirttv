'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const breakingNews = [
  "अमेरिका को ग्रीनलैंड पर कब्जा करने से रोक पाएगा यूरोप: हमला हुआ तो नाटो का क्या होगा, डेनमार्क की तैयारी कैसी?",
  "अविनेश यादव बोले- भाजपा नेता अपराधियों और गुंडाचारियों से मिले, इस सरकार में नहीं खत्म होगा अपराध",
  "झाबुआ मेले में बड़ा हादसा: भगदड़ से अधिक सवारियों से झूला गिरा, 15 छात्राएं घायल, मौके पर अफरा-तफरी"
]

export default function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % breakingNews.length)
  }

  const prevNews = () => {
    setCurrentIndex((prev) => (prev - 1 + breakingNews.length) % breakingNews.length)
  }

  return (
    <div className="bg-primary-500 text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="bg-white text-primary-500 px-4 py-2 font-bold text-sm rounded mr-4 animate-pulse">
            BREAKING
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center">
              <button
                onClick={prevNews}
                className="p-1 hover:bg-primary-600 rounded mr-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex-1 overflow-hidden">
                <p className="text-sm hindi-text animate-fade-in whitespace-nowrap overflow-hidden text-ellipsis">
                  {breakingNews[currentIndex]}
                </p>
              </div>
              
              <button
                onClick={nextNews}
                className="p-1 hover:bg-primary-600 rounded ml-2"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-4">
            {breakingNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}