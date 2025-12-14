export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Sweet {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  user_id: string
  sweet_id: string
  quantity: number
  total_price: number
  purchase_date: string
  sweet?: Sweet
}
