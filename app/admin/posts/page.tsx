'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { mockAPI, DATABASE_CONFIG } from '@/lib/database'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function PostsPage() {
  const [posts, setPosts] = useState(DATABASE_CONFIG.posts)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'सामान्य',
    featured: false,
    status: 'published'
  })

  const categories = DATABASE_CONFIG.categories

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPost) {
      // Update post
      const updatedPost = mockAPI.updatePost(editingPost.id, formData)
      if (updatedPost) {
        setPosts(posts.map(p => p.id === editingPost.id ? updatedPost : p))
      }
      setEditingPost(null)
    } else {
      // Create new post
      const newPost = mockAPI.createPost({
        ...formData,
        author: 'Admin User',
        image: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop'
      })
      setPosts([...posts, newPost])
    }
    
    setShowCreateModal(false)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'सामान्य',
      featured: false,
      status: 'published'
    })
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      featured: post.featured,
      status: post.status
    })
    setShowCreateModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('क्या आप वाकई इस पोस्ट को डिलीट करना चाहते हैं?')) {
      mockAPI.deletePost(id)
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 hindi-text">पोस्ट मैनेजमेंट</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 btn-animate"
          >
            <Plus className="w-5 h-5" />
            <span className="hindi-text">नई पोस्ट</span>
          </button>
        </div>

        {/* Posts List */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 hindi-text">शीर्षक</th>
                  <th className="text-left py-3 px-4 hindi-text">श्रेणी</th>
                  <th className="text-left py-3 px-4 hindi-text">स्थिति</th>
                  <th className="text-left py-3 px-4 hindi-text">फीचर्ड</th>
                  <th className="text-left py-3 px-4 hindi-text">दिनांक</th>
                  <th className="text-left py-3 px-4 hindi-text">कार्य</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium hindi-text">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.excerpt.substring(0, 50)}...</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm hindi-text">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {post.featured ? (
                        <span className="text-yellow-500">⭐ हाँ</span>
                      ) : (
                        <span className="text-gray-400">नहीं</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString('hi-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="एडिट करें"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="डिलीट करें"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="देखें"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold hindi-text">
                {editingPost ? 'पोस्ट एडिट करें' : 'नई पोस्ट बनाएं'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 hindi-text mb-2">
                  शीर्षक
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 hindi-text mb-2">
                  संक्षिप्त विवरण
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 hindi-text mb-2">
                  पूरा कंटेंट
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 hindi-text mb-2">
                    श्रेणी
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 hindi-text mb-2">
                    स्थिति
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  >
                    <option value="published">प्रकाशित</option>
                    <option value="draft">ड्राफ्ट</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 hindi-text">
                  फीचर्ड पोस्ट बनाएं
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-primary-red text-white px-6 py-2 rounded-lg hover:opacity-90 btn-animate"
                >
                  {editingPost ? 'अपडेट करें' : 'पब्लिश करें'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPost(null)
                    setFormData({
                      title: '',
                      content: '',
                      excerpt: '',
                      category: 'सामान्य',
                      featured: false,
                      status: 'published'
                    })
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:opacity-90"
                >
                  रद्द करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}