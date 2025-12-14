"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Sweet } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search } from "lucide-react"
import { PurchaseDialog } from "./purchase-dialog"
import Image from "next/image"

interface SweetsListProps {
  userId: string
}

export function SweetsList({ userId }: SweetsListProps) {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchSweets()
  }, [])

  useEffect(() => {
    filterSweets()
  }, [searchQuery, selectedCategory, sweets])

  const fetchSweets = async () => {
    const { data, error } = await supabase.from("sweets").select("*").order("name")

    if (!error && data) {
      setSweets(data)
      setFilteredSweets(data)
    }
    setLoading(false)
  }

  const filterSweets = () => {
    let filtered = sweets

    if (searchQuery) {
      filtered = filtered.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sweet.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((sweet) => sweet.category === selectedCategory)
    }

    setFilteredSweets(filtered)
  }

  const categories = ["all", ...Array.from(new Set(sweets.map((s) => s.category)))]

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading sweets...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Sweets Grid */}
      {filteredSweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sweets found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSweets.map((sweet) => (
            <Card key={sweet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                <Image
                  src={sweet.image_url || "/placeholder.svg?height=200&width=200"}
                  alt={sweet.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{sweet.name}</CardTitle>
                  <Badge variant="secondary">{sweet.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{sweet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">${sweet.price.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">
                    {sweet.stock > 0 ? `${sweet.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2" disabled={sweet.stock === 0} onClick={() => setSelectedSweet(sweet)}>
                  <ShoppingCart className="h-4 w-4" />
                  {sweet.stock === 0 ? "Out of Stock" : "Purchase"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedSweet && (
        <PurchaseDialog
          sweet={selectedSweet}
          userId={userId}
          onClose={() => setSelectedSweet(null)}
          onSuccess={fetchSweets}
        />
      )}
    </div>
  )
}
