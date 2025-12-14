import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Candy, ShoppingBag, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-20">
        <div className="absolute inset-0 bg-[url('/abstract-candy-pattern.jpg')] opacity-10 bg-cover bg-center" />
        <div className="relative max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Candy className="h-12 w-12 text-pink-600" />
            <h1 className="text-5xl font-bold text-balance bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Sweet Shop
            </h1>
          </div>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Your one-stop destination for the finest sweets and candies. Discover, browse, and indulge in our delicious
            collection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Button asChild size="lg" className="gap-2">
              <Link href="/auth/signup">
                <ShoppingBag className="h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <Candy className="h-8 w-8 text-pink-600 mb-3" />
              <h3 className="font-semibold mb-2">Wide Selection</h3>
              <p className="text-sm text-muted-foreground">Browse through our extensive collection of premium sweets</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <ShoppingBag className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Easy Purchasing</h3>
              <p className="text-sm text-muted-foreground">Simple and secure checkout process for all your favorites</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <Shield className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Admin Control</h3>
              <p className="text-sm text-muted-foreground">Comprehensive management system for inventory and orders</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
