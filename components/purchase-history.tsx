"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Purchase } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package } from "lucide-react"

interface PurchaseHistoryProps {
  userId: string
}

export function PurchaseHistory({ userId }: PurchaseHistoryProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select("*, sweet:sweets(*)")
      .eq("user_id", userId)
      .order("purchase_date", { ascending: false })

    if (!error && data) {
      setPurchases(data as Purchase[])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading purchase history...</p>
      </div>
    )
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">You haven't made any purchases yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Purchases</h2>
        <Badge variant="secondary">{purchases.length} total</Badge>
      </div>
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Card key={purchase.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{purchase.sweet?.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(purchase.purchase_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
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
                  <p className="text-2xl font-bold text-pink-600">${purchase.total_price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
