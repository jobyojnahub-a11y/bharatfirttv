'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, MessageCircle, Share2, Bookmark } from 'lucide-react'

interface NewsCardProps {
  title: string
  excerpt: string
  image: string
  category: string
  publishedAt: string
  readTime?: string
  isMainStory?: boolean
  slug?: string
}

export default function NewsCard({
  title,
  excerpt,
  image,
  category,
  publishedAt,
  readTime = '2 मिनट',
  isMainStory = false,
  slug
}: NewsCardProps) {
  const cardContent = (
    <>
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={isMainStory ? 800 : 400}
          height={isMainStory ? 400 : 250}
          className="w-full h-48 md:h-56 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className={`font-bold text-gray-900 mb-3 hindi-text leading-tight ${isMainStory ? 'text-2xl' : 'text-lg'}`}>
          {title}
        </h2>
        
        <p className="text-gray-600 mb-4 hindi-text leading-relaxed">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{publishedAt}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )

  if (slug) {
    return (
      <Link href={`/blog/${slug}`}>
        <article className={`news-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${isMainStory ? 'col-span-2 row-span-2' : ''}`}>
          {cardContent}
        </article>
      </Link>
    )
  }

  return (
    <article className={`news-card bg-white rounded-lg shadow-md overflow-hidden ${isMainStory ? 'col-span-2 row-span-2' : ''}`}>
      {cardContent}
    </article>
  )
}