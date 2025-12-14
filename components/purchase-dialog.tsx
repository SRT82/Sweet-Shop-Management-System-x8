"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Sweet } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface PurchaseDialogProps {
  sweet: Sweet
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export function PurchaseDialog({ sweet, userId, onClose, onSuccess }: PurchaseDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const totalPrice = (Number(sweet.price) * quantity).toFixed(2)

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > sweet.stock) {
      toast({
        title: "Invalid quantity",
        description: `Please enter a quantity between 1 and ${sweet.stock}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Insert purchase
      const { error: purchaseError } = await supabase.from("purchases").insert({
        user_id: userId,
        sweet_id: sweet.id,
        quantity,
        total_price: Number.parseFloat(totalPrice),
      })

      if (purchaseError) {
        console.error("[v0] Purchase error:", purchaseError)
        toast({
          title: "Purchase failed",
          description: purchaseError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Update stock
      const { error: updateError } = await supabase
        .from("sweets")
        .update({ stock: sweet.stock - quantity })
        .eq("id", sweet.id)

      if (updateError) {
        console.error("[v0] Stock update error:", updateError)
        toast({
          title: "Stock update failed",
          description: updateError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Purchase successful!",
        description: `You purchased ${quantity} ${sweet.name}(s) for $${totalPrice}`,
      })

      setLoading(false)
      onClose()
      onSuccess()
    } catch (err) {
      console.error("[v0] Purchase exception:", err)
      toast({
        title: "Purchase failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {sweet.name}</DialogTitle>
          <DialogDescription>Enter the quantity you want to purchase</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={sweet.stock}
              autoComplete="off"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
            />
            <p className="text-sm text-muted-foreground">Available: {sweet.stock}</p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="font-semibold">Total Price:</span>
            <span className="text-2xl font-bold text-pink-600">${totalPrice}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={loading}>
            {loading ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
