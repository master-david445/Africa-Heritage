"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createProverb } from "@/app/actions/proverbs"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

export default function AskPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    proverb: "",
    meaning: "",
    context: "",
    country: "",
    language: "",
    categories: [] as string[],
  })
  const [newCategory, setNewCategory] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }))
      setNewCategory("")
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in to ask a question")
      return
    }

    if (!formData.proverb.trim()) {
      toast.error("Please enter the proverb text")
      return
    }

    if (!formData.country.trim()) {
      toast.error("Please enter the country of origin")
      return
    }

    if (!formData.language.trim()) {
      toast.error("Please enter the language")
      return
    }

    setIsLoading(true)
    try {
      await createProverb({
        proverb: formData.proverb.trim(),
        meaning: formData.meaning.trim(),
        context: formData.context.trim(),
        country: formData.country.trim(),
        language: formData.language.trim(),
        categories: formData.categories,
      })

      toast.success("Your proverb question has been posted!")
      router.push("/explore")
    } catch (error) {
      console.error("Error creating proverb:", error)
      toast.error("Failed to post your question. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to ask questions about African proverbs.</p>
            <Button onClick={() => router.push("/auth/login")}>
              Login to Ask Questions
            </Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask About African Proverbs</h1>
          <p className="text-lg text-gray-600">
            Share a proverb and ask the community for its meaning and interpretation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post Your Proverb Question</CardTitle>
            <CardDescription>
              Share an African proverb and ask the community to help interpret its meaning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Proverb Text */}
              <div>
                <Label htmlFor="proverb">The Proverb</Label>
                <Textarea
                  id="proverb"
                  placeholder="Enter the African proverb you want to ask about..."
                  value={formData.proverb}
                  onChange={(e) => handleInputChange("proverb", e.target.value)}
                  className="min-h-24"
                  required
                />
              </div>

              {/* Meaning/Question */}
              <div>
                <Label htmlFor="meaning">What do you think it means? (Optional)</Label>
                <Textarea
                  id="meaning"
                  placeholder="Share your interpretation or ask for help understanding this proverb..."
                  value={formData.meaning}
                  onChange={(e) => handleInputChange("meaning", e.target.value)}
                  className="min-h-20"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave this blank if you want the community to provide the meaning
                </p>
              </div>

              {/* Context */}
              <div>
                <Label htmlFor="context">Context (Optional)</Label>
                <Textarea
                  id="context"
                  placeholder="Any additional context about when or how you heard this proverb..."
                  value={formData.context}
                  onChange={(e) => handleInputChange("context", e.target.value)}
                  className="min-h-16"
                />
              </div>

              {/* Country and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country of Origin</Label>
                  <Input
                    id="country"
                    placeholder="e.g., Nigeria, Ghana, Kenya"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    placeholder="e.g., Yoruba, Twi, Swahili"
                    value={formData.language}
                    onChange={(e) => handleInputChange("language", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <Label>Categories/Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                  />
                  <Button type="button" onClick={addCategory} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="hover:bg-orange-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.proverb.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Question"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}