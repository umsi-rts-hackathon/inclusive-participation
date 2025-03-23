import { createClient } from "@supabase/supabase-js"

// Types for our database tables
export type Article = {
  id: string
  external_id: string
  title: string
  description: string
  content?: string
  source: string
  source_type: "left" | "center" | "right"
  published_at: string
  url: string
  image_url?: string
  created_at?: string
  ai_summary?: string
  political_score?: number
}

export type ArticleVote = {
  id: string
  article_id: string
  user_id: string
  vote_type: "up" | "down"
  created_at?: string
  updated_at?: string
}

export type GuestUser = {
  id: string
  guest_id: string
  created_at?: string
  last_active_at?: string
}

export type VoteCounts = {
  upvotes: number
  downvotes: number
}

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return supabaseInstance
}

// For backward compatibility
export const supabase = getSupabaseClient()

// Function to get or create a guest user ID
export const getGuestId = async (): Promise<string> => {
  let guestId = localStorage.getItem("democracy_lens_guest_id")

  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem("democracy_lens_guest_id", guestId)

    try {
      // Register the guest user in the database
      await registerGuestUser(guestId)
    } catch (error) {
      console.error("Error registering guest user:", error)
      // Continue even if registration fails
    }
  } else {
    try {
      // Update last active timestamp
      await updateGuestUserActivity(guestId)
    } catch (error) {
      console.error("Error updating guest activity:", error)
      // Continue even if update fails
    }
  }

  return guestId
}

// Register a new guest user
export const registerGuestUser = async (guestId: string): Promise<GuestUser | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("guest_users").insert({ guest_id: guestId }).select().single()

    if (error) {
      console.error("Error registering guest user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error registering guest user:", error)
    return null
  }
}

// Update guest user's last active timestamp
export const updateGuestUserActivity = async (guestId: string): Promise<void> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from("guest_users")
      .update({ last_active_at: new Date().toISOString() })
      .eq("guest_id", guestId)

    if (error) {
      console.error("Error updating guest user activity:", error)
    }
  } catch (error) {
    console.error("Unexpected error updating guest activity:", error)
  }
}

// Get guest user by guest_id
export const getGuestUserByGuestId = async (guestId: string): Promise<GuestUser | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("guest_users").select("*").eq("guest_id", guestId).single()

    if (error) {
      console.error("Error fetching guest user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching guest user:", error)
    return null
  }
}

// Article CRUD operations
export const getArticles = async (limit = 10, offset = 0): Promise<Article[]> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching articles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching articles:", error)
    return []
  }
}

export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("articles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching article:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching article:", error)
    return null
  }
}

// Change the getArticleByExternalId function to handle multiple or no rows
export const getArticleByExternalId = async (externalId: string): Promise<Article | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("articles").select("*").eq("external_id", externalId).maybeSingle() // Use maybeSingle instead of single to handle no rows

    if (error) {
      console.error("Error fetching article by external ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching article by external ID:", error)
    return null
  }
}

export const createArticle = async (article: Omit<Article, "id" | "created_at">): Promise<Article | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("articles").insert(article).select().single()

    if (error) {
      console.error("Error creating article:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error creating article:", error)
    return null
  }
}

export const updateArticle = async (id: string, updates: Partial<Article>): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from("articles").update(updates).eq("id", id)

    if (error) {
      console.error("Error updating article:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error updating article:", error)
    return false
  }
}

export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from("articles").delete().eq("id", id)

    if (error) {
      console.error("Error deleting article:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting article:", error)
    return false
  }
}

// Vote operations
export const getArticleVotes = async (articleId: string): Promise<VoteCounts> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("article_votes").select("vote_type").eq("article_id", articleId)

    if (error) {
      console.error("Error fetching article votes:", error)
      return { upvotes: 0, downvotes: 0 }
    }

    // Count votes manually
    const upvotes = data?.filter((vote) => vote.vote_type === "up").length || 0
    const downvotes = data?.filter((vote) => vote.vote_type === "down").length || 0

    return { upvotes, downvotes }
  } catch (error) {
    console.error("Unexpected error fetching article votes:", error)
    return { upvotes: 0, downvotes: 0 }
  }
}

export const getUserVote = async (articleId: string, guestId: string): Promise<"up" | "down" | null> => {
  try {
    // First get the user's UUID from the guest_id
    const user = await getGuestUserByGuestId(guestId)

    if (!user) {
      return null
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("article_votes")
      .select("vote_type")
      .eq("article_id", articleId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null
      }
      console.error("Error fetching user vote:", error)
      return null
    }

    return data?.vote_type as "up" | "down" | null
  } catch (error) {
    console.error("Unexpected error fetching user vote:", error)
    return null
  }
}

export const voteOnArticle = async (
  articleId: string,
  guestId: string,
  voteType: "up" | "down" | null,
): Promise<boolean> => {
  try {
    // First get the user's UUID from the guest_id
    const user = await getGuestUserByGuestId(guestId)

    if (!user) {
      return false
    }

    try {
      const supabase = getSupabaseClient()
      // Check if the user already has a vote for this article
      const { data: existingVote, error: checkError } = await supabase
        .from("article_votes")
        .select("id, vote_type")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing vote:", checkError)
        return false
      }

      // Case 1: User wants to remove their vote
      if (voteType === null) {
        if (existingVote) {
          const { error: deleteError } = await supabase.from("article_votes").delete().eq("id", existingVote.id)

          if (deleteError) {
            console.error("Error removing vote:", deleteError)
            return false
          }
        }
        return true
      }

      // Case 2: User already has a vote and wants to change it
      if (existingVote) {
        const { error: updateError } = await supabase
          .from("article_votes")
          .update({
            vote_type: voteType,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingVote.id)

        if (updateError) {
          console.error("Error updating vote:", updateError)
          return false
        }
        return true
      }

      // Case 3: User doesn't have a vote and wants to add one
      const { error: insertError } = await supabase.from("article_votes").insert({
        article_id: articleId,
        user_id: user.id,
        vote_type: voteType,
      })

      if (insertError) {
        console.error("Error inserting vote:", insertError)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error in voteOnArticle:", error)
      return false
    }
  } catch (error) {
    console.error("Unexpected error in voteOnArticle:", error)
    return false
  }
}

// Search cached articles
export const searchCachedArticles = async (
  query: string,
  fromDate?: string,
  sortBy = "published_at",
  limit = 10,
  offset = 0,
): Promise<Article[]> => {
  try {
    const supabase = getSupabaseClient()
    let queryBuilder = supabase.from("articles").select("*")

    // Add search conditions if query is provided
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Add date filter if provided
    if (fromDate) {
      queryBuilder = queryBuilder.gte("published_at", fromDate)
    }

    // Add sorting
    if (sortBy === "relevancy" && query) {
      // For relevancy sorting with a query, we'd ideally use full-text search
      // This is a simplified approach
      queryBuilder = queryBuilder.order("published_at", { ascending: false })
    } else if (sortBy === "popularity") {
      // For popularity, we could sort by vote count in a real implementation
      // This is a simplified approach
      queryBuilder = queryBuilder.order("published_at", { ascending: false })
    } else {
      // Default to date sorting
      queryBuilder = queryBuilder.order("published_at", { ascending: false })
    }

    // Add pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Error searching cached articles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error searching cached articles:", error)
    return []
  }
}

// Storage operations for files and images
export const uploadFile = async (bucket: string, path: string, file: File): Promise<string | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error("Unexpected error uploading file:", error)
    return null
  }
}

export const downloadFile = async (bucket: string, path: string): Promise<Blob | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).download(path)

    if (error) {
      console.error("Error downloading file:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error downloading file:", error)
    return null
  }
}

export const listFiles = async (bucket: string, path?: string): Promise<string[] | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).list(path || "")

    if (error) {
      console.error("Error listing files:", error)
      return null
    }

    return data.map((file) => file.name)
  } catch (error) {
    console.error("Unexpected error listing files:", error)
    return null
  }
}

export const deleteFile = async (bucket: string, paths: string[]): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.storage.from(bucket).remove(paths)

    if (error) {
      console.error("Error deleting files:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting files:", error)
    return false
  }
}

// User profile operations
export const getUserProfile = async (userId: string): Promise<any | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error fetching user profile:", error)
    return null
  }
}

export const updateUserProfile = async (userId: string, updates: any): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId)

    if (error) {
      console.error("Error updating user profile:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error updating user profile:", error)
    return false
  }
}

