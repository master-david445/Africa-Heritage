"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Collection, CollectionItem, Proverb } from "@/lib/types"

export async function getUserCollections(userId: string): Promise<Collection[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .or(`user_id.eq.${userId},contributors.cs.{${userId}}`)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching user collections:", error)
      throw new Error("Failed to fetch collections")
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error in getUserCollections:", error)
    throw error
  }
}

export async function getCollectionById(collectionId: string): Promise<Collection | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("id", collectionId)
      .single()

    if (error) {
      console.error("[v0] Error fetching collection:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Error in getCollectionById:", error)
    return null
  }
}

export async function createCollection(data: {
  title: string
  description?: string
  isPublic: boolean
  isCollaborative: boolean
}): Promise<Collection> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data: collection, error } = await supabase
      .from("collections")
      .insert({
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        is_public: data.isPublic,
        is_collaborative: data.isCollaborative,
        contributors: [user.id],
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating collection:", error)
      throw new Error("Failed to create collection")
    }

    revalidatePath("/collections")
    return collection
  } catch (error) {
    console.error("[v0] Error in createCollection:", error)
    throw error
  }
}

export async function updateCollection(
  collectionId: string,
  data: {
    title?: string
    description?: string
    isPublic?: boolean
    isCollaborative?: boolean
  }
): Promise<Collection> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Check if user has permission to update
    const { data: existingCollection } = await supabase
      .from("collections")
      .select("user_id, contributors")
      .eq("id", collectionId)
      .single()

    if (!existingCollection ||
        (existingCollection.user_id !== user.id &&
         !existingCollection.contributors.includes(user.id))) {
      throw new Error("Unauthorized to update collection")
    }

    const { data: collection, error } = await supabase
      .from("collections")
      .update({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isPublic !== undefined && { is_public: data.isPublic }),
        ...(data.isCollaborative !== undefined && { is_collaborative: data.isCollaborative }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", collectionId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating collection:", error)
      throw new Error("Failed to update collection")
    }

    revalidatePath(`/collections/${collectionId}`)
    revalidatePath("/collections")
    return collection
  } catch (error) {
    console.error("[v0] Error in updateCollection:", error)
    throw error
  }
}

export async function deleteCollection(collectionId: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Check if user owns the collection
    const { data: collection } = await supabase
      .from("collections")
      .select("user_id")
      .eq("id", collectionId)
      .single()

    if (!collection || collection.user_id !== user.id) {
      throw new Error("Unauthorized to delete collection")
    }

    // Delete collection items first
    await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", collectionId)

    // Delete collection
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId)

    if (error) {
      console.error("[v0] Error deleting collection:", error)
      throw new Error("Failed to delete collection")
    }

    revalidatePath("/collections")
  } catch (error) {
    console.error("[v0] Error in deleteCollection:", error)
    throw error
  }
}

export async function addProverbToCollection(collectionId: string, proverbId: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Check if user has access to the collection
    const { data: collection } = await supabase
      .from("collections")
      .select("user_id, contributors, is_collaborative")
      .eq("id", collectionId)
      .single()

    if (!collection ||
        (collection.user_id !== user.id &&
         !collection.is_collaborative &&
         !collection.contributors.includes(user.id))) {
      throw new Error("Unauthorized to add to collection")
    }

    // Check if proverb is already in collection
    const { data: existing } = await supabase
      .from("collection_items")
      .select("id")
      .eq("collection_id", collectionId)
      .eq("proverb_id", proverbId)
      .single()

    if (existing) {
      throw new Error("Proverb already in collection")
    }

    const { error } = await supabase
      .from("collection_items")
      .insert({
        collection_id: collectionId,
        proverb_id: proverbId,
      })

    if (error) {
      console.error("[v0] Error adding proverb to collection:", error)
      throw new Error("Failed to add proverb to collection")
    }

    revalidatePath(`/collections/${collectionId}`)
  } catch (error) {
    console.error("[v0] Error in addProverbToCollection:", error)
    throw error
  }
}

export async function removeProverbFromCollection(collectionId: string, proverbId: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Check if user has access to the collection
    const { data: collection } = await supabase
      .from("collections")
      .select("user_id, contributors")
      .eq("id", collectionId)
      .single()

    if (!collection ||
        (collection.user_id !== user.id &&
         !collection.contributors.includes(user.id))) {
      throw new Error("Unauthorized to modify collection")
    }

    const { error } = await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", collectionId)
      .eq("proverb_id", proverbId)

    if (error) {
      console.error("[v0] Error removing proverb from collection:", error)
      throw new Error("Failed to remove proverb from collection")
    }

    revalidatePath(`/collections/${collectionId}`)
  } catch (error) {
    console.error("[v0] Error in removeProverbFromCollection:", error)
    throw error
  }
}

export async function getCollectionProverbs(collectionId: string): Promise<any[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("collection_items")
      .select(`
        proverb_id,
        proverbs (
          id,
          proverb,
          meaning,
          country,
          language,
          categories,
          created_at,
          is_verified,
          is_featured,
          views,
          shares,
          profiles (
            username,
            avatar_url
          )
        )
      `)
      .eq("collection_id", collectionId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching collection proverbs:", error)
      throw new Error("Failed to fetch collection proverbs")
    }

    return data?.map(item => {
      const proverb = Array.isArray(item.proverbs) ? item.proverbs[0] : item.proverbs
      return {
        ...proverb,
        userName: proverb.profiles?.[0]?.username || "Anonymous",
        userAvatar: proverb.profiles?.[0]?.avatar_url || "/placeholder-user.jpg",
      }
    }) || []
  } catch (error) {
    console.error("[v0] Error in getCollectionProverbs:", error)
    throw error
  }
}

export async function getCollectionStats(collectionId: string): Promise<{
  viewCount: number
  likeCount: number
  shareCount: number
}> {
  try {
    const supabase = await createClient()

    // For now, return mock data - in a real app, you'd track these metrics
    // This would involve additional tables for views, likes, and shares
    return {
      viewCount: Math.floor(Math.random() * 1000) + 100,
      likeCount: Math.floor(Math.random() * 200) + 10,
      shareCount: Math.floor(Math.random() * 50) + 5,
    }
  } catch (error) {
    console.error("[v0] Error in getCollectionStats:", error)
    return { viewCount: 0, likeCount: 0, shareCount: 0 }
  }
}