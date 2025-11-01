export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          bio: string | null
          country: string | null
          avatar_url: string | null
          points: number
          is_admin: boolean
          is_verified: boolean
          is_suspended: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>
      }
      proverbs: {
        Row: {
          id: string
          user_id: string
          proverb: string
          meaning: string
          context: string | null
          country: string
          language: string
          categories: string[]
          audio_url: string | null
          created_at: string
          updated_at: string
          is_verified: boolean
          is_featured: boolean
          views: number
          shares: number
        }
        Insert: Omit<Database["public"]["Tables"]["proverbs"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["proverbs"]["Row"]>
      }
      comments: {
        Row: {
          id: string
          proverb_id: string
          user_id: string
          text: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["comments"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["comments"]["Row"]>
      }
      likes: {
        Row: {
          id: string
          proverb_id: string
          user_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["likes"]["Row"], "id" | "created_at">
        Update: never
      }
      bookmarks: {
        Row: {
          id: string
          proverb_id: string
          user_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["bookmarks"]["Row"], "id" | "created_at">
        Update: never
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["follows"]["Row"], "id" | "created_at">
        Update: never
      }
      collections: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cover_image: string | null
          is_public: boolean
          is_collaborative: boolean
          contributors: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["collections"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>
      }
      collection_items: {
        Row: {
          id: string
          collection_id: string
          proverb_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["collection_items"]["Row"], "id" | "created_at">
        Update: never
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string
          requirement_type: string | null
          requirement_value: number | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["badges"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["badges"]["Row"]>
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["user_badges"]["Row"], "id" | "earned_at">
        Update: never
      }
    }
  }
}
