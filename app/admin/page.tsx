import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"
import { AdminSweets } from "@/components/admin-sweets"
import { AdminPurchases } from "@/components/admin-purchases"
import { Candy, ShoppingBag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] Admin page - User:", user?.id, user?.email)

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin with better error handling
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  console.log("[v0] Admin page - Profile query result:", { profile, error })

  if (error) {
    console.error("[v0] Error fetching profile:", error)
    // Try to create profile if it doesn't exist
    if (error.code === "PGRST116") {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email!.split("@")[0],
        role: "user",
      })

      if (insertError) {
        console.error("[v0] Error creating profile:", insertError)
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Database Error</h1>
              <p className="text-muted-foreground mb-4">Failed to load your profile. Error: {insertError.message}</p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        )
      }

      // Redirect to dashboard since new users are not admin by default
      redirect("/dashboard")
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Database Error</h1>
          <p className="text-muted-foreground mb-4">Error querying profile: {error.message}</p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!profile || profile.role !== "admin") {
    console.log("[v0] User is not admin, redirecting")
    redirect("/dashboard")
  }

  console.log("[v0] Admin authenticated successfully")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Candy className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">User Dashboard</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="sweets" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="sweets" className="gap-2">
              <Candy className="h-4 w-4" />
              Manage Sweets
            </TabsTrigger>
            <TabsTrigger value="purchases" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              All Purchases
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sweets">
            <AdminSweets />
          </TabsContent>
          <TabsContent value="purchases">
            <AdminPurchases />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
