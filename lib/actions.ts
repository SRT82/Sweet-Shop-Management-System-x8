"use server"

import { createClient } from "./supabase/server"
import { revalidatePath } from "next/cache"

export async function makeAdmin(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin")
  revalidatePath("/dashboard")
}

export async function searchSweets(query: string, category?: string) {
  const supabase = await createClient()

  let queryBuilder = supabase.from("sweets").select("*").order("name")

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category && category !== "all") {
    queryBuilder = queryBuilder.eq("category", category)
  }

  const { data, error } = await queryBuilder

  if (error) {
    throw new Error(error.message)
  }

  return data
}
