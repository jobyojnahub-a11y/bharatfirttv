import Header from '@/components/Header'
import BreakingNews from '@/components/BreakingNews'
import BlogStatus from '@/components/BlogStatus'
import { fetchWordPressPosts, getFeaturedImage, getPostCategories, formatDate, cleanHtmlContent } from '@/lib/wordpress'
import Image from 'next/image'
import Link from 'next/link'

export default async function BlogPage() {
  // Fetch all WordPress posts
  const wordPressPosts = await fetchWordPressPosts(20)
  
  // Convert WordPress posts to our format
  const blogPosts = wordPressPosts.map(post => ({
    id: post.id,
    title: post.title.rendered,
    excerpt: cleanHtmlContent(post.excerpt.rendered),
    content: post.content.rendered,
    image: getFeaturedImage(post),
    category: getPostCategories(post)[0] || 'सामान्य',
    publishedAt: formatDate(post.date),
    slug: post.slug
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BreakingNews />
      
      {/* Blog Status Indicator */}
      <BlogStatus 
        postsCount={wordPressPosts.length} 
        isWordPressConnected={wordPressPosts.length > 0} 
      />
      
      {/* Blog Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 hindi-text">
              ब्लॉग
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              भारत फर्स्ट टीवी के सभी लेख और समसामयिक विषयों पर विस्तृत जानकारी
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {blogPosts.length === 0 ? (
          /* No Posts Available */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hindi-text">
                कोई ब्लॉग पोस्ट उपलब्ध नहीं है
              </h3>
              <p className="text-gray-600 mb-6">
                फिलहाल कोई ब्लॉग पोस्ट उपलब्ध नहीं है। कृपया बाद में दोबारा देखें।
              </p>
              <div className="space-y-3">
                <a 
                  href="https://blog.bharatfirsttv.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  WordPress Blog पर जाएं
                </a>
                <div className="text-sm text-gray-500">
                  या <Link href="/" className="text-primary-500 hover:underline">होमपेज पर वापस जाएं</Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Blog Posts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="font-bold text-xl text-gray-900 mb-3 hindi-text leading-tight line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 hindi-text leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.publishedAt}</span>
                    <a 
                      href={`https://blog.bharatfirsttv.com/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 font-medium text-sm"
                    >
                      पूरा पढ़ें →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Section */}
        {blogPosts.length > 0 && (
          <div className="text-center mt-12">
            <a 
              href="https://blog.bharatfirsttv.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              और भी पोस्ट देखें
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-primary-500 text-white px-4 py-2 font-bold text-xl inline-block mb-4">
              भारत<br />FIRST
            </div>
            <p className="text-gray-400 hindi-text">
              भारत की सबसे विश्वसनीय न्यूज वेबसाइट
            </p>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Bharat First TV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}