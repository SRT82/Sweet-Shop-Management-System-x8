"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Purchase, Profile } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface PurchaseWithProfile extends Purchase {
  profile?: Profile
}

export function AdminPurchases() {
  const [purchases, setPurchases] = useState<PurchaseWithProfile[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<PurchaseWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchPurchases()
  }, [])

  useEffect(() => {
    filterPurchases()
  }, [searchQuery, purchases])

  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select("*, sweet:sweets(*), profile:profiles(*)")
      .order("purchase_date", { ascending: false })

    if (!error && data) {
      setPurchases(data as PurchaseWithProfile[])
      setFilteredPurchases(data as PurchaseWithProfile[])
    }
    setLoading(false)
  }

  const filterPurchases = () => {
    if (!searchQuery) {
      setFilteredPurchases(purchases)
      return
    }

    const filtered = purchases.filter(
      (purchase) =>
        purchase.sweet?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.profile?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setFilteredPurchases(filtered)
  }

  const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.total_price), 0)
  const totalOrders = purchases.length

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading purchases...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by sweet name or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No purchases found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{purchase.sweet?.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {purchase.profile?.full_name || purchase.profile?.email}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(purchase.purchase_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{purchase.sweet?.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quantity: {purchase.quantity}</p>
                    <p className="text-sm text-muted-foreground">Unit Price: ${purchase.sweet?.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-indigo-600">${purchase.total_price.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
