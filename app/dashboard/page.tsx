import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"
import { SweetsList } from "@/components/sweets-list"
import { PurchaseHistory } from "@/components/purchase-history"
import { Candy, History } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError || !profile) {
    const { error: createError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || "",
      role: "user",
    })

    if (createError) {
      console.error("[v0] Dashboard profile creation error:", createError)
    }

    // Fetch the newly created profile
    const { data: newProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!newProfile) {
      // If still no profile, redirect to setup
      redirect("/setup-admin")
    }
  }

  const userProfile = profile || { full_name: "", role: "user" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Candy className="h-6 w-6 text-pink-600" />
            <h1 className="text-xl font-bold">Sweet Shop</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {userProfile.full_name || user.email}
            </span>
            {userProfile.role === "admin" && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
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
              Browse Sweets
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Purchase History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sweets">
            <SweetsList userId={user.id} />
          </TabsContent>
          <TabsContent value="history">
            <PurchaseHistory userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
