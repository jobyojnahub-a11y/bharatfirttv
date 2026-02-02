'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import { fetchWordPressPostBySlug, getFeaturedImage, getPostCategories, formatDate, cleanHtmlContent, getPostAuthor } from '@/lib/wordpress'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import Link from 'next/link'
import { Calendar, User, MessageCircle, Share2, Heart, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    async function loadPost() {
      try {
        const postData = await fetchWordPressPostBySlug(params.slug)
        if (!postData) {
          notFound()
        }
        setPost(postData)
      } catch (error) {
        console.error('Error loading post:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params.slug])

  const handleAuthRequired = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true)
      return false
    }
    return true
  }

  const handleLike = () => {
    if (handleAuthRequired()) {
      // Add like functionality here
      alert('पोस्ट को लाइक कर दिया गया!')
    }
  }

  const handleDislike = () => {
    if (handleAuthRequired()) {
      // Add dislike functionality here
      alert('पोस्ट को डिसलाइक कर दिया गया!')
    }
  }

  const handleComment = () => {
    if (handleAuthRequired()) {
      // Add comment functionality here
      alert('कमेंट सेक्शन जल्द ही आएगा!')
    }
  }

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
            <Link href="/" className="text-primary-red hover:underline">होम</Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-primary-red hover:underline">ब्लॉग</Link>
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
              
              {/* Blog Title in Red */}
              <div className="bg-primary-red text-white p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold hindi-text leading-tight">
                  {post.title.rendered}
                </h1>
              </div>

              {/* Featured Image Banner */}
              {featuredImage && (
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={featuredImage}
                    alt={post.title.rendered}
                    width={800}
                    height={384}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
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

                {/* Blog Content Preview */}
                <div className="prose prose-lg max-w-none hindi-text mb-8">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {post.excerpt ? cleanHtmlContent(post.excerpt.rendered).substring(0, 300) + '...' : content.substring(0, 300) + '...'}
                  </p>
                </div>

                {/* Like/Dislike and Comment Buttons */}
                <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleLike}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium">लाइक करें</span>
                    </button>
                    <button 
                      onClick={handleDislike}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span className="font-medium">डिसलाइक करें</span>
                    </button>
                    <button 
                      onClick={handleComment}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">कमेंट करें</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>शेयर करें</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <Bookmark className="w-4 h-4" />
                      <span>सेव करें</span>
                    </button>
                  </div>
                </div>

                {/* Login Status Message */}
                {!isLoggedIn && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 hindi-text">
                          <strong>ध्यान दें:</strong> लाइक, डिसलाइक और कमेंट करने के लिए कृपया लॉगिन करें।
                        </p>
                        <button 
                          onClick={() => setShowAuthModal(true)}
                          className="mt-3 bg-primary-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                        >
                          लॉगिन करें
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Content */}
                <div className="mt-8 prose prose-lg max-w-none hindi-text">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-3 hindi-text">टैग्स:</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            {/* Related Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 hindi-text text-primary-red border-b-2 border-primary-red pb-2">संबंधित समाचार</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <Image
                      src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=80&h=60&fit=crop`}
                      alt="Related news"
                      width={80}
                      height={60}
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
            <div className="bg-gradient-to-br from-primary-red to-red-800 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 hindi-text">न्यूज़लेटर</h3>
              <p className="text-red-100 mb-4 hindi-text">
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
                  className="w-full bg-white text-primary-red py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  सब्सक्राइब करें
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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