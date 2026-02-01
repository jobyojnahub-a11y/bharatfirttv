// WordPress API integration for blog.bharatfirsttv.com

export interface WordPressPost {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  slug: string
  featured_media: number
  categories: number[]
  tags: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
}

export interface WordPressCategory {
  id: number
  name: string
  slug: string
}

const WORDPRESS_API_URL = 'https://blog.bharatfirsttv.com/wp-json/wp/v2'

// Fetch posts from WordPress
export async function fetchWordPressPosts(limit: number = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?per_page=${limit}&_embed=true&orderby=date&order=desc`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const posts: WordPressPost[] = await response.json()
    return posts
  } catch (error) {
    console.error('Error fetching WordPress posts:', error)
    return []
  }
}

// Fetch single post by slug
export async function fetchWordPressPost(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed=true`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const posts: WordPressPost[] = await response.json()
    return posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.error('Error fetching WordPress post:', error)
    return null
  }
}

// Fetch categories
export async function fetchWordPressCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`)

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const categories: WordPressCategory[] = await response.json()
    return categories
  } catch (error) {
    console.error('Error fetching WordPress categories:', error)
    return []
  }
}

// Helper function to clean HTML content
export function cleanHtmlContent(html: string): string {
  // Remove HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim()
}

// Helper function to get featured image
export function getFeaturedImage(post: WordPressPost): string {
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url
  }
  // Fallback image
  return 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop'
}

// Helper function to get categories
export function getPostCategories(post: WordPressPost): string[] {
  if (post._embedded?.['wp:term']?.[0]) {
    return post._embedded['wp:term'][0].map(term => term.name)
  }
  return ['सामान्य']
}

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('hi-IN', options)
}