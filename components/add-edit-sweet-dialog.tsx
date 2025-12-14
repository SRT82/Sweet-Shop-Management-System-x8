"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface AddEditSweetDialogProps {
  sweet: Sweet | null
  onClose: () => void
  onSuccess: () => void
}

export function AddEditSweetDialog({ sweet, onClose, onSuccess }: AddEditSweetDialogProps) {
  const [formData, setFormData] = useState({
    name: sweet?.name || "",
    description: sweet?.description || "",
    price: sweet?.price.toString() || "",
    stock: sweet?.stock.toString() || "",
    category: sweet?.category || "",
    image_url: sweet?.image_url || "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const sweetData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      category: formData.category,
      image_url: formData.image_url || null,
    }

    let error

    if (sweet) {
      // Update existing sweet
      const result = await supabase.from("sweets").update(sweetData).eq("id", sweet.id)
      error = result.error
    } else {
      // Create new sweet
      const result = await supabase.from("sweets").insert(sweetData)
      error = result.error
    }

    if (error) {
      toast({
        title: "Operation failed",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
    } else {
      toast({
        title: sweet ? "Sweet updated" : "Sweet added",
        description: sweet ? `${formData.name} has been updated` : `${formData.name} has been added to inventory`,
      })
      onSuccess()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sweet ? "Edit Sweet" : "Add New Sweet"}</DialogTitle>
          <DialogDescription>
            {sweet ? "Update sweet information" : "Add a new sweet to your inventory"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                autoComplete="off"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                autoComplete="off"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  autoComplete="off"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  autoComplete="off"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                autoComplete="off"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="/placeholder.svg?height=200&width=200"
                autoComplete="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : sweet ? "Update Sweet" : "Add Sweet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
