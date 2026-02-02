// Hardcoded database configuration and mock data

// Interfaces
export interface User {
  id: number
  email: string
  name: string
  password?: string
  role: 'user' | 'admin'
  createdAt: string
  isVerified: boolean
}

export interface OTPSession {
  email: string
  otp: string
  expiresAt: Date
  attempts: number
  createdAt: Date
}

export const DATABASE_CONFIG = {
  // Mock database - in production, use actual database
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@bharatfirsttv.com',
      password: 'admin123', // In production, use hashed passwords
      role: 'admin',
      createdAt: '2026-01-01T00:00:00Z',
      isVerified: true
    }
  ] as User[],
  
  // OTP sessions storage
  otpSessions: [] as OTPSession[],
  
  posts: [
    {
      id: 1,
      title: 'नमूना ब्लॉग पोस्ट',
      content: 'यह एक नमूना ब्लॉग पोस्ट है। यहाँ आप अपना कंटेंट लिख सकते हैं।',
      excerpt: 'यह एक नमूना ब्लॉग पोस्ट का अंश है।',
      category: 'सामान्य',
      author: 'Admin User',
      featured: true,
      status: 'published',
      createdAt: '2026-01-01T00:00:00Z',
      image: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop'
    }
  ],
  
  categories: [
    { id: 1, name: 'देश', slug: 'desh' },
    { id: 2, name: 'दुनिया', slug: 'duniya' },
    { id: 3, name: 'खेल', slug: 'khel' },
    { id: 4, name: 'मनोरंजन', slug: 'manoranjan' },
    { id: 5, name: 'राजनीति', slug: 'rajniti' },
    { id: 6, name: 'तकनीक', slug: 'taknik' },
    { id: 7, name: 'व्यापार', slug: 'vyapar' }
  ],

  featuredSections: {
    todayNews: [1], // Post IDs for आज की ताज़ा खबरें
    latestPodcast: {
      title: 'आज का पॉडकास्ट',
      description: 'नवीनतम समाचार और विश्लेषण',
      url: '#'
    }
  },

  comments: [],
  likes: [],
  
  // Site settings
  settings: {
    siteName: 'भारत FIRST',
    siteDescription: 'भारत की सबसे विश्वसनीय न्यूज वेबसाइट',
    adminEmail: 'admin@bharatfirsttv.com',
    postsPerPage: 6
  }
}

// Mock API functions
export const mockAPI = {
  // User authentication
  login: async (email: string, password: string) => {
    const user = DATABASE_CONFIG.users.find(u => u.email === email && u.password === password)
    if (user) {
      return { success: true, user: { ...user, password: undefined } }
    }
    return { success: false, error: 'Invalid credentials' }
  },

  register: async (name: string, email: string, password: string) => {
    const existingUser = DATABASE_CONFIG.users.find(u => u.email === email)
    if (existingUser) {
      return { success: false, error: 'User already exists' }
    }
    
    const newUser = {
      id: DATABASE_CONFIG.users.length + 1,
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    
    DATABASE_CONFIG.users.push(newUser)
    return { success: true, user: { ...newUser, password: undefined } }
  },

  // Posts management
  getPosts: () => DATABASE_CONFIG.posts,
  
  createPost: (postData: any) => {
    const newPost = {
      id: DATABASE_CONFIG.posts.length + 1,
      ...postData,
      createdAt: new Date().toISOString()
    }
    DATABASE_CONFIG.posts.push(newPost)
    return newPost
  },

  updatePost: (id: number, postData: any) => {
    const index = DATABASE_CONFIG.posts.findIndex(p => p.id === id)
    if (index !== -1) {
      DATABASE_CONFIG.posts[index] = { ...DATABASE_CONFIG.posts[index], ...postData }
      return DATABASE_CONFIG.posts[index]
    }
    return null
  },

  deletePost: (id: number) => {
    const index = DATABASE_CONFIG.posts.findIndex(p => p.id === id)
    if (index !== -1) {
      DATABASE_CONFIG.posts.splice(index, 1)
      return true
    }
    return false
  },

  // Categories management
  getCategories: () => DATABASE_CONFIG.categories,
  
  createCategory: (name: string, slug: string) => {
    const newCategory = {
      id: DATABASE_CONFIG.categories.length + 1,
      name,
      slug
    }
    DATABASE_CONFIG.categories.push(newCategory)
    return newCategory
  },

  // Featured sections management
  updateFeaturedSection: (section: string, data: any) => {
    if (section === 'todayNews') {
      DATABASE_CONFIG.featuredSections.todayNews = data
    } else if (section === 'latestPodcast') {
      DATABASE_CONFIG.featuredSections.latestPodcast = data
    }
    return true
  },

  getFeaturedSections: () => DATABASE_CONFIG.featuredSections,

  // OTP Management
  createOTPSession: (email: string, otp: string) => {
    // Remove any existing OTP session for this email
    DATABASE_CONFIG.otpSessions = DATABASE_CONFIG.otpSessions.filter(session => session.email !== email)
    
    const newSession: OTPSession = {
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
      createdAt: new Date()
    }
    
    DATABASE_CONFIG.otpSessions.push(newSession)
    return newSession
  },

  verifyOTP: (email: string, otp: string) => {
    const session = DATABASE_CONFIG.otpSessions.find(s => s.email === email)
    
    if (!session) {
      return { success: false, error: 'OTP session not found' }
    }
    
    if (session.expiresAt < new Date()) {
      // Remove expired session
      DATABASE_CONFIG.otpSessions = DATABASE_CONFIG.otpSessions.filter(s => s.email !== email)
      return { success: false, error: 'OTP expired' }
    }
    
    session.attempts++
    
    if (session.attempts > 3) {
      // Remove session after too many attempts
      DATABASE_CONFIG.otpSessions = DATABASE_CONFIG.otpSessions.filter(s => s.email !== email)
      return { success: false, error: 'Too many attempts' }
    }
    
    if (session.otp !== otp) {
      return { success: false, error: 'Invalid OTP' }
    }
    
    // OTP verified successfully - remove session
    DATABASE_CONFIG.otpSessions = DATABASE_CONFIG.otpSessions.filter(s => s.email !== email)
    return { success: true }
  },

  // Enhanced user functions
  findUserByEmail: (email: string) => {
    return DATABASE_CONFIG.users.find(u => u.email === email)
  },

  createUserWithOTP: (email: string, name: string, password?: string) => {
    const existingUser = DATABASE_CONFIG.users.find(u => u.email === email)
    if (existingUser) {
      return { success: false, error: 'User already exists' }
    }
    
    const newUser: User = {
      id: DATABASE_CONFIG.users.length + 1,
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
      isVerified: true
    }
    
    DATABASE_CONFIG.users.push(newUser)
    return { success: true, user: { ...newUser, password: undefined } }
  },

  loginWithOTP: (email: string) => {
    const user = DATABASE_CONFIG.users.find(u => u.email === email)
    if (user) {
      return { success: true, user: { ...user, password: undefined } }
    }
    return { success: false, error: 'User not found' }
  }
}