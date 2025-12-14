"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const createSuperAdmin = async () => {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const supabase = createClient()

      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: "shubhamtawale98@gmail.com",
        password: "Iamtheshubhamtawale",
        options: {
          data: {
            full_name: "Shubham Rajanand Tawale",
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (signUpData.user) {
        // Update the profile to admin role
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            role: "admin",
            full_name: "Shubham Rajanand Tawale",
          })
          .eq("id", signUpData.user.id)

        if (updateError) {
          setError(updateError.message)
          return
        }

        setMessage("Super admin account created successfully! Check your email to confirm.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Super Admin</CardTitle>
          <CardDescription>Create super admin account for Shubham Rajanand Tawale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Email:</strong> shubhamtawale98@gmail.com
            </p>
            <p>
              <strong>Name:</strong> Shubham Rajanand Tawale
            </p>
            <p>
              <strong>Role:</strong> Admin
            </p>
          </div>

          <Button onClick={createSuperAdmin} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Super Admin Account"}
          </Button>

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <p className="text-xs text-muted-foreground">
            Note: If the user already exists, you'll need to manually update the role in the database.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
