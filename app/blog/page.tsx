import Header from '@/components/Header'
import Link from 'next/link'
import BlogStatus from '@/components/BlogStatus'
import { fetchWordPressPosts, getFeaturedImage, getPostCategories, formatDate, cleanHtmlContent, getPostAuthor } from '@/lib/wordpress'

export default async function BlogPage() {
  // Fetch all WordPress posts for blog page
  const wordPressPosts = await fetchWordPressPosts(12)
  
  // Convert WordPress posts to our news format
  const blogPosts = wordPressPosts.length > 0 
    ? wordPressPosts.map((post) => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: cleanHtmlContent(post.excerpt.rendered),
        image: getFeaturedImage(post),
        category: getPostCategories(post)[0] || 'सामान्य',
        publishedAt: formatDate(post.date),
        author: getPostAuthor(post),
        slug: post.slug
      }))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Blog Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold hindi-text mb-4">ब्लॉग सेक्शन</h1>
            <p className="text-red-100 text-lg hindi-text max-w-2xl mx-auto">
              भारत की सबसे विश्वसनीय न्यूज़, गहरे विश्लेषण और ताज़ा अपडेट्स
            </p>
            <div className="mt-6">
              <Link 
                href="/"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                होम पेज पर वापस जाएं
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog Status Indicator */}
      <div className="container mx-auto px-4 py-4">
        <BlogStatus 
          postsCount={wordPressPosts.length} 
          isWordPressConnected={wordPressPosts.length > 0} 
        />
      </div>
      
      {/* Blog Posts */}
      <main className="container mx-auto px-4 py-8">
        {blogPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            {blogPosts[0] && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 hindi-text mb-8">मुख्य समाचार</h2>
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto">
                      <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {blogPosts[0].category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 hindi-text mb-4 leading-tight">
                        {blogPosts[0].title}
                      </h3>
                      <p className="text-gray-600 hindi-text mb-6 leading-relaxed">
                        {blogPosts[0].excerpt.substring(0, 200)}...
                      </p>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>लेखक: {blogPosts[0].author}</span>
                          <span>•</span>
                          <span>{blogPosts[0].publishedAt}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${blogPosts[0].slug}`}
                        className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        पूरा आर्टिकल पढ़ें
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Posts Grid */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 hindi-text mb-8">अन्य समाचार</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(1).map((post) => (
                  <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 hindi-text mb-3 line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 hindi-text text-sm mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs text-gray-500">
                          <span className="block">लेखक: {post.author}</span>
                          <span className="block mt-1">{post.publishedAt}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-semibold group"
                      >
                        पूरा पढ़ें
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 hindi-text mb-4">कोई पोस्ट उपलब्ध नहीं</h2>
              <p className="text-gray-600 hindi-text mb-6">
                फिलहाल कोई ब्लॉग पोस्ट उपलब्ध नहीं है। कृपया बाद में फिर से देखें।
              </p>
              <a 
                href="https://blog.bharatfirsttv.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                मुख्य ब्लॉग पर जाएं
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="bg-red-600 text-white px-4 py-2 font-bold text-xl inline-block mb-4">
                भारत<br />FIRST
              </div>
              <p className="text-gray-400 hindi-text">
                भारत की सबसे विश्वसनीय न्यूज वेबसाइट
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 hindi-text">श्रेणियां</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">देश</Link></li>
                <li><Link href="#" className="hover:text-white">दुनिया</Link></li>
                <li><Link href="#" className="hover:text-white">खेल</Link></li>
                <li><Link href="#" className="hover:text-white">मनोरंजन</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
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