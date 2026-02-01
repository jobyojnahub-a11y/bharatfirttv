import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import { fetchWordPressPostBySlug, getFeaturedImage, getPostCategories, formatDate, cleanHtmlContent, getPostAuthor } from '@/lib/wordpress'
import Link from 'next/link'
import { Calendar, User, MessageCircle, Share2, Heart, Bookmark } from 'lucide-react'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await fetchWordPressPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const featuredImage = getFeaturedImage(post)
  const categories = getPostCategories(post)
  const author = getPostAuthor(post)
  const publishedDate = formatDate(post.date)
  const content = cleanHtmlContent(post.content.rendered)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">होम</Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-blue-600 hover:text-blue-800">ब्लॉग</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{post.title.rendered}</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Article */}
          <article className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              {featuredImage && (
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={featuredImage}
                    alt={post.title.rendered}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              <div className="p-8">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 hindi-text leading-tight mb-6">
                  {post.title.rendered}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">{author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">{publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">12 टिप्पणियां</span>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>पसंद करें</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>शेयर करें</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <Bookmark className="w-5 h-5" />
                      <span>सेव करें</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none hindi-text">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-3 hindi-text">टैग्स:</h3>
                  <div className="flex flex-wrap gap-2">
                    {['राजनीति', 'समाचार', 'भारत', 'अंतर्राष्ट्रीय'].map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg mt-8 p-8">
              <h3 className="text-2xl font-bold mb-6 hindi-text">टिप्पणियां (12)</h3>
              
              {/* Comment Form */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 hindi-text">अपनी राय दें</h4>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="आपका नाम"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="ईमेल पता"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    rows={4}
                    placeholder="अपनी टिप्पणी लिखें..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    टिप्पणी पोस्ट करें
                  </button>
                </form>
              </div>

              {/* Sample Comments */}
              <div className="space-y-6">
                {[1, 2, 3].map((comment) => (
                  <div key={comment} className="border-l-4 border-blue-500 pl-6 py-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">राहुल शर्मा</h5>
                        <p className="text-sm text-gray-500">2 घंटे पहले</p>
                      </div>
                    </div>
                    <p className="text-gray-700 hindi-text">
                      बहुत ही अच्छा लेख है। इस विषय पर और जानकारी चाहिए। धन्यवाद!
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-sm text-blue-600 hover:text-blue-800">जवाब दें</button>
                      <button className="text-sm text-gray-600 hover:text-gray-800">👍 5</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            {/* Related Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 hindi-text">संबंधित समाचार</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex gap-3">
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=80&h=60&fit=crop`}
                      alt="Related news"
                      className="w-20 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold hindi-text line-clamp-2 mb-1">
                        संबंधित समाचार का शीर्षक यहां होगा
                      </h4>
                      <p className="text-xs text-gray-500">2 घंटे पहले</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 hindi-text">न्यूज़लेटर</h3>
              <p className="text-blue-100 mb-4 hindi-text">
                रोज़ाना की ताज़ा खबरें सीधे अपने ईमेल में पाएं
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="आपका ईमेल"
                  className="w-full px-4 py-2 rounded-lg text-gray-900"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  सब्सक्राइब करें
                </button>
              </form>
            </div>
          </aside>
        </div>
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