'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import BreakingNews from '@/components/BreakingNews'
import NewsCard from '@/components/NewsCard'
import BlogStatus from '@/components/BlogStatus'
import { fetchWordPressPosts, getFeaturedImage, getPostCategories, formatDate, cleanHtmlContent } from '@/lib/wordpress'

// Fallback news data if WordPress is not available
const fallbackNewsData = [
  {
    id: 1,
    title: "अमेरिका को ग्रीनलैंड पर कब्जा करने से रोक पाएगा यूरोप: हमला हुआ तो नाटो का क्या होगा, डेनमार्क की तैयारी कैसी?",
    excerpt: "ग्रीनलैंड को लेकर अमेरिका किस तरह की तैयारियां कर रहा है? ग्रीनलैंड के बचाव के लिए यूरोप ने किस तरह से कमर कसी है, उसकी ताकत कितनी है? अगर ग्रीनलैंड को लेकर टकराव की स्थिति बनती है तो क्या भविष्य हो सकता है? इसके अलावा विश्लेषण इस मुद्दे पर क्या कहते हैं? आगे जानते हैं...",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop",
    category: "World",
    publishedAt: "19 Jan 2026",
    isMainStory: true
  },
  {
    id: 2,
    title: "अविनेश यादव बोले- भाजपा नेता अपराधियों और गुंडाचारियों से मिले, इस सरकार में नहीं खत्म होगा अपराध",
    excerpt: "लखनऊ में समाजवादी पार्टी के नेता अविनेश यादव ने भाजपा सरकार पर निशाना साधा है।",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop",
    category: "Lucknow",
    publishedAt: "19 Jan 2026"
  },
  {
    id: 3,
    title: "झाबुआ मेले में बड़ा हादसा: भगदड़ से अधिक सवारियों से झूला गिरा, 15 छात्राएं घायल, मौके पर अफरा-तफरी",
    excerpt: "झाबुआ जिले में आयोजित मेले में एक बड़ा हादसा हुआ है जिसमें कई लोग घायल हुए हैं।",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    category: "Jhabua",
    publishedAt: "19 Jan 2026"
  }
]

export default function Home() {
  const [newsData, setNewsData] = useState<any[]>([])
  const [wordPressPosts, setWordPressPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const posts = await fetchWordPressPosts(6)
        setWordPressPosts(posts)
        
        // Convert WordPress posts to our news format
        const convertedData = posts.length > 0 
          ? posts.map((post, index) => ({
              id: post.id,
              title: post.title.rendered,
              excerpt: cleanHtmlContent(post.excerpt.rendered),
              image: getFeaturedImage(post),
              category: getPostCategories(post)[0] || 'सामान्य',
              publishedAt: formatDate(post.date),
              isMainStory: index === 0,
              slug: post.slug
            }))
          : fallbackNewsData.map((post, index) => ({
              ...post,
              isMainStory: index === 0,
              slug: `fallback-${post.id}`
            }))
        
        setNewsData(convertedData)
      } catch (error) {
        console.error('Error loading posts:', error)
        setNewsData(fallbackNewsData.map((post, index) => ({
          ...post,
          isMainStory: index === 0,
          slug: `fallback-${post.id}`
        })))
        setWordPressPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-gray-600 hindi-text">लोड हो रहा है...</p>
          </div>
        </div>
      </div>
    )
  }

  const mainStory = newsData[0]
  const sideStories = newsData.slice(1, 3)

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Blog Status Indicator */}
      <BlogStatus 
        postsCount={wordPressPosts.length} 
        isWordPressConnected={wordPressPosts.length > 0} 
      />
      
      {/* Main Content Container - Exact Screenshot Layout */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-0">
            
            {/* Left Vertical Advertisement */}
            <div className="col-span-1 bg-gray-300 min-h-screen flex flex-col items-center justify-center">
              <div className="transform -rotate-90 whitespace-nowrap">
                <span className="text-gray-600 font-bold text-lg tracking-widest mukta-font">ADVERTISEMENT</span>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="col-span-10 bg-white">
              
              {/* Top News Ticker */}
              <div className="bg-yellow-400 px-4 py-2 flex items-center space-x-4">
                <div className="flex space-x-2">
                  <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded">ND vs NZ Live</span>
                  <span className="bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded">UP Board Result</span>
                  <span className="bg-yellow-600 text-white px-2 py-1 text-xs font-bold rounded">Gold Price Today</span>
                </div>
                <div className="ml-auto bg-yellow-500 text-black px-3 py-1 text-xs font-bold rounded hindi-text">
                  आज की ताज़ा खबरें
                </div>
              </div>

              {/* Main Story Section */}
              <div className="p-6">
                {mainStory && (
                  <div className="bg-white">
                    {/* Main Story Header */}
                    <div className="mb-4">
                      <h1 className="text-2xl font-bold hindi-text text-gray-900 leading-tight mb-2">
                        {mainStory.title}
                      </h1>
                      <p className="text-sm text-gray-600 hindi-text mb-4">
                        यूरोप: हमला हुआ तो नाटो का क्या होगा, डेनमार्क की तैयारी कैसी?
                      </p>
                    </div>

                    {/* Main Story Image and Content */}
                    <div className="mb-6">
                      <div className="relative mb-4">
                        <img
                          src={mainStory.image}
                          alt={mainStory.title}
                          className="w-full h-80 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
                          <h2 className="text-xl font-bold hindi-text">ग्रीनलैंड पर होगा...</h2>
                          <p className="text-lg hindi-text">अमेरिका vs यूरोप</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700 hindi-text leading-relaxed mb-4">
                        <p>ग्रीनलैंड को लेकर अमेरिका किस तरह की तैयारियां कर रहा है?</p>
                        <p>ग्रीनलैंड के बचाव के लिए यूरोप ने किस तरह से कमर कसी है, उसकी ताकत कितनी है, उसकी</p>
                        <p>ताकत कितनी है? अगर ग्रीनलैंड को लेकर टकराव की स्थिति बनती है तो क्या भविष्य हो सकता है? इसके अलावा विश्लेषण</p>
                        <p>इस मुद्दे पर क्या कहते हैं? <strong>आगे जानते हैं...</strong></p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <div className="flex items-center space-x-4">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{mainStory.category}</span>
                          <span className="text-xs text-gray-500">{mainStory.publishedAt}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="text-yellow-500 hover:text-yellow-600">
                            <span className="text-lg">😊</span>
                          </button>
                          <button className="text-blue-600 hover:text-blue-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Side Stories */}
                    <div className="space-y-4">
                      {sideStories.map((story) => (
                        <div key={story.id} className="border-t border-gray-200 pt-4">
                          <div className="flex gap-4">
                            <img
                              src={story.image}
                              alt={story.title}
                              className="w-20 h-16 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h3 className="text-sm font-bold hindi-text text-gray-900 line-clamp-2 mb-1">
                                {story.title}
                              </h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{story.category}</span>
                                  <span className="text-xs text-gray-500">{story.publishedAt}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className="text-yellow-500">
                                    <span className="text-sm">😊</span>
                                  </button>
                                  <button className="text-blue-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                  </button>
                                  <button className="text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                  </button>
                                  <button className="text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Vertical Advertisement */}
            <div className="col-span-1 bg-gray-300 min-h-screen flex flex-col items-center justify-center">
              <div className="transform rotate-90 whitespace-nowrap">
                <span className="text-gray-600 font-bold text-lg tracking-widest mukta-font">ADVERTISEMENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Podcast Section - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm font-bold hindi-text">Latest Podcast</span>
        </div>
      </div>
    </div>
  )
}