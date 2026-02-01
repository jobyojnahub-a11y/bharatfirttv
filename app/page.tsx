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

export default async function Home() {
  // Fetch WordPress posts
  const wordPressPosts = await fetchWordPressPosts(6)
  
  // Convert WordPress posts to our news format
  const newsData = wordPressPosts.length > 0 
    ? wordPressPosts.map((post, index) => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: cleanHtmlContent(post.excerpt.rendered),
        image: getFeaturedImage(post),
        category: getPostCategories(post)[0] || 'सामान्य',
        publishedAt: formatDate(post.date),
        isMainStory: index === 0
      }))
    : fallbackNewsData

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BreakingNews />
      
      {/* Blog Status Indicator */}
      <BlogStatus 
        postsCount={wordPressPosts.length} 
        isWordPressConnected={wordPressPosts.length > 0} 
      />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Latest News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900 hindi-text">आज की ताजा खबरें</h2>
              <div className="ml-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                {wordPressPosts.length > 0 ? `${wordPressPosts.length} नई खबरें` : 'Latest Podcast'}
              </div>
            </div>
            <a 
              href="https://blog.bharatfirsttv.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 underline"
            >
              Blog पर जाएं →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.map((news, index) => (
              <NewsCard
                key={news.id}
                title={news.title}
                excerpt={news.excerpt}
                image={news.image}
                category={news.category}
                publishedAt={news.publishedAt}
                isMainStory={index === 0}
              />
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 hindi-text">ट्रेंडिंग न्यूज</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsData.slice(1, 5).map((news) => (
              <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden news-card">
                <div className="relative h-32">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-primary-500 text-white px-2 py-1 rounded text-xs">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-900 hindi-text line-clamp-3">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">{news.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
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