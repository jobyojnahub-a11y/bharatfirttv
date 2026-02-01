// OpenAI API integration for image generation

export interface ImageGenerationRequest {
  prompt: string
  size?: '256x256' | '512x512' | '1024x1024'
  n?: number
}

export interface ImageGenerationResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  // OpenAI disabled - using fallback images only
  console.log('OpenAI disabled, using fallback images')
  return {
    success: false,
    error: 'OpenAI disabled - using fallback images'
  }
}

// Helper function to get category-based fallback images
export async function generateNewsImage(title: string, category: string): Promise<string> {
  // Always use fallback images - no OpenAI needed
  const fallbackImages = {
    'World': 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
    'देश': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    'दुनिया': 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
    'खेल': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
    'मनोरंजन': 'https://images.unsplash.com/photo-1489599904472-af35ff2c7c3d?w=800&h=400&fit=crop',
    'राजनीति': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    'तकनीक': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    'व्यापार': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    'स्वास्थ्य': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    'Politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
    'Entertainment': 'https://images.unsplash.com/photo-1489599904472-af35ff2c7c3d?w=800&h=400&fit=crop',
    'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    'Business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
  }

  return fallbackImages[category as keyof typeof fallbackImages] || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop'
}