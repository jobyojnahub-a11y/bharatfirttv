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
  },
  {
    id: 4,
    title: "सुप्रीम कोर्ट का बड़ा फैसला: दिल्ली प्रदूषण पर सख्त दिशा-निर्देश",
    excerpt: "सुप्रीम कोर्ट ने दिल्ली के बढ़ते प्रदूषण को लेकर सरकार को सख्त निर्देश दिए हैं।",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    category: "Delhi",
    publishedAt: "19 Jan 2026"
  },
  {
    id: 5,
    title: "IPL 2026: नई टीमों की नीलामी आज, कई बड़े खिलाड़ी हो सकते हैं शामिल",
    excerpt: "आईपीएल 2026 सीजन के लिए आज नई टीमों की नीलामी होगी जिसमें कई स्टार खिलाड़ी भाग लेंगे।",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=250&fit=crop",
    category: "Sports",
    publishedAt: "19 Jan 2026"
  },
  {
    id: 6,
    title: "बॉलीवुड की नई फिल्म ने तोड़े सभी रिकॉर्ड, पहले दिन ही 100 करोड़ का कलेक्शन",
    excerpt: "बॉलीवुड की इस नई फिल्म ने रिलीज के पहले ही दिन बॉक्स ऑफिस पर धमाल मचाया है।",
    image: "https://images.unsplash.com/photo-1489599904472-af35ff2c7c3d?w=400&h=250&fit=crop",
    category: "Entertainment",
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BreakingNews />
      
      {/* Blog Status Indicator */}
      <BlogStatus 
        postsCount={wordPressPosts.length} 
        isWordPressConnected={wordPressPosts.length > 0} 
      />
      
      {/* Main Content Layout */}
      <main className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-12 gap-4">
            
            {/* Left Content - Main Story + Side Stories */}
            <div className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-12 gap-3">
                
                {/* Main Story */}
                <div className="col-span-12 md:col-span-7">
                  {mainStory && (
                    <NewsCard
                      id={mainStory.id}
                      title={mainStory.title}
                      excerpt={mainStory.excerpt}
                      image={mainStory.image}
                      category={mainStory.category}
                      publishedAt={mainStory.publishedAt}
                      isMainStory={true}
                      slug={mainStory.slug}
                    />
                  )}
                </div>
                
                {/* Side Stories */}
                <div className="col-span-12 md:col-span-5 space-y-3">
                  {sideStories.map((story) => (
                    <NewsCard
                      key={story.id}
                      id={story.id}
                      title={story.title}
                      excerpt={story.excerpt}
                      image={story.image}
                      category={story.category}
                      publishedAt={story.publishedAt}
                      isMainStory={false}
                      slug={story.slug}
                    />
                  ))}
                </div>
              </div>
              
              {/* Social Share Buttons */}
              <div className="mt-4 flex items-center justify-center space-x-3 py-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 hindi-text font-medium text-sm">हमें फॉलो करें:</span>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors hover-scale">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="bg-blue-800 text-white p-1.5 rounded-full hover:bg-blue-900 transition-colors hover-scale">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="bg-pink-500 text-white p-1.5 rounded-full hover:bg-pink-600 transition-colors hover-scale">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </button>
                  <button className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors hover-scale">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar - Advertisements */}
            <div className="col-span-12 lg:col-span-4">
              <div className="space-y-4">
                
                {/* आज की ताज़ा खबरें */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-bold mb-3 hindi-text text-primary-red border-b-2 border-primary-red pb-2">
                    आज की ताज़ा खबरें
                  </h3>
                  <div className="space-y-3">
                    {newsData.slice(3, 6).map((news) => (
                      <div key={news.id} className="flex gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold hindi-text line-clamp-2 mb-1">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-500">{news.publishedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vertical Advertisement 1 */}
                <div className="bg-gray-300 h-80 flex flex-col items-center justify-center text-gray-600 text-center border rounded-lg">
                  <div className="text-base font-bold advertisement-text mb-2">
                    ADVERTISEMENT
                  </div>
                  <div className="text-sm">(300x320)</div>
                </div>

                {/* Latest Podcast */}
                <div className="bg-gradient-to-br from-primary-red to-red-800 text-white rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 hindi-text">Latest Podcast</h3>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <h4 className="font-semibold mb-2 hindi-text text-sm">आज का पॉडकास्ट</h4>
                    <p className="text-xs text-red-100 mb-3">
                      नवीनतम समाचार और विश्लेषण
                    </p>
                    <button className="bg-white text-primary-red px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors btn-animate">
                      सुनें
                    </button>
                  </div>
                </div>
                
                {/* Vertical Advertisement 2 */}
                <div className="bg-gray-300 h-64 flex flex-col items-center justify-center text-gray-600 text-center border rounded-lg">
                  <div className="text-base font-bold advertisement-text mb-2">
                    ADVERTISEMENT
                  </div>
                  <div className="text-sm">(300x256)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Popular Blogs Section */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6 hindi-text text-primary-red">
            Popular Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsData.slice(0, 6).map((blog) => (
              <div key={blog.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover-scale news-card">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-red text-white px-2 py-1 rounded-full text-xs font-medium">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-xs">{blog.publishedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold mb-2 hindi-text line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                    {blog.excerpt}
                  </p>
                  <button className="text-primary-red font-semibold hover:underline text-xs">
                    पूरा पढ़ें →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Blogs Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6 hindi-text text-primary-red">
            Recently Added Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {newsData.slice(2, 6).map((blog) => (
              <div key={blog.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover-scale news-card">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {blog.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold mb-1 hindi-text line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-xs">{blog.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="bg-primary-red text-white px-4 py-2 font-bold text-xl inline-block mb-4">
                भारत<br />FIRST
              </div>
              <p className="text-gray-400 hindi-text">
                भारत की सबसे विश्वसनीय न्यूज वेबसाइट
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 hindi-text">श्रेणियां</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">देश</a></li>
                <li><a href="#" className="hover:text-white">दुनिया</a></li>
                <li><a href="#" className="hover:text-white">खेल</a></li>
                <li><a href="#" className="hover:text-white">मनोरंजन</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 hindi-text">संपर्क</h3>
              <p className="text-gray-400">
                Email: info@bharatfirsttv.com<br />
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Bharat First TV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}