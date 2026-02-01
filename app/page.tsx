import Header from '@/components/Header'
import BreakingNews from '@/components/BreakingNews'
import NewsCard from '@/components/NewsCard'
import BlogStatus from '@/components/BlogStatus'
import { fetchWordPressPosts, getFeaturedImageSync, getPostCategories, formatDate, cleanHtmlContent } from '@/lib/wordpress'

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

export default async function Home() {
  // Fetch WordPress posts
  const wordPressPosts = await fetchWordPressPosts(6)
  
  // Convert WordPress posts to our news format
  const newsData = wordPressPosts.length > 0 
    ? wordPressPosts.map((post, index) => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: cleanHtmlContent(post.excerpt.rendered),
        image: getFeaturedImageSync(post),
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
      
      {/* Main Content - Exact Screenshot Layout */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Advertisement */}
          <div className="col-span-2 hidden lg:block">
            <div className="bg-gray-200 h-96 flex items-center justify-center text-gray-500 text-xs transform -rotate-90">
              ADVERTISEMENT
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 gap-4">
              {/* Main Story - Left Side */}
              <div className="col-span-12 md:col-span-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <img
                      src={mainStory.image}
                      alt={mainStory.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h1 className="text-white text-xl font-bold hindi-text leading-tight bg-black bg-opacity-50 p-3 rounded">
                        {mainStory.title}
                      </h1>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 hindi-text text-sm leading-relaxed">
                      {mainStory.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {mainStory.category}
                        </span>
                        <span className="text-gray-500 text-xs">{mainStory.publishedAt}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          😊
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Stories - Right Side */}
              <div className="col-span-12 md:col-span-4 space-y-4">
                {sideStories.map((story) => (
                  <div key={story.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="flex">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-24 h-20 object-cover"
                      />
                      <div className="p-3 flex-1">
                        <h3 className="text-sm font-semibold hindi-text line-clamp-2 mb-2">
                          {story.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {story.category}
                          </span>
                          <span className="text-gray-500 text-xs">{story.publishedAt}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            😊
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Latest Podcast Badge */}
                <div className="bg-yellow-400 text-black px-3 py-2 rounded-lg text-center font-bold text-sm">
                  Latest Podcast
                </div>
              </div>
            </div>
          </div>

          {/* Right Advertisement */}
          <div className="col-span-2 hidden lg:block">
            <div className="bg-gray-200 h-96 flex items-center justify-center text-gray-500 text-xs transform rotate-90">
              ADVERTISEMENT
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="bg-primary-500 text-white px-4 py-2 font-bold text-xl inline-block mb-4">
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