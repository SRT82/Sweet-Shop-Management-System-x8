"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Sweet } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { AddEditSweetDialog } from "./add-edit-sweet-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AdminSweets() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [deleteSweet, setDeleteSweet] = useState<Sweet | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    const { data, error } = await supabase.from("sweets").select("*").order("name")

    if (!error && data) {
      setSweets(data)
    }
    setLoading(false)
  }

  const handleDelete = async (sweet: Sweet) => {
    const { error } = await supabase.from("sweets").delete().eq("id", sweet.id)

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Sweet deleted",
        description: `${sweet.name} has been removed from the inventory`,
      })
      fetchSweets()
    }
    setDeleteSweet(null)
  }

  const handleAddNew = () => {
    setSelectedSweet(null)
    setShowDialog(true)
  }

  const handleEdit = (sweet: Sweet) => {
    setSelectedSweet(sweet)
    setShowDialog(true)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading sweets...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Inventory</h2>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Sweet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <Card key={sweet.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{sweet.name}</CardTitle>
                <Badge variant={sweet.stock > 0 ? "default" : "destructive"}>{sweet.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{sweet.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-semibold text-indigo-600">${sweet.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-semibold">{sweet.stock}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => handleEdit(sweet)}
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => setDeleteSweet(sweet)}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showDialog && (
        <AddEditSweetDialog
          sweet={selectedSweet}
          onClose={() => setShowDialog(false)}
          onSuccess={() => {
            setShowDialog(false)
            fetchSweets()
          }}
        />
      )}

      <AlertDialog open={!!deleteSweet} onOpenChange={() => setDeleteSweet(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteSweet?.name} from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteSweet && handleDelete(deleteSweet)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
