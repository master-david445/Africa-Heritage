"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProverb } from "@/app/actions/proverbs"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Plus, X, BookOpen, HelpCircle } from "lucide-react"
import { toast } from "sonner"

export default function SharePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeMode, setActiveMode] = useState<"share" | "ask">("share")
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

    // Authentication check based on mode
    if (activeMode === "ask" && !user) {
      toast.error("You must be logged in to ask a question")
      return
    }

    if (activeMode === "share" && !user) {
      // Allow anonymous sharing - will need to modify createProverb action
      // For now, require login
      toast.error("You must be logged in to share wisdom")
      return
    }

    if (!formData.proverb.trim()) {
      toast.error("Please enter the proverb text")
      return
    }

    if (activeMode === "share" && !formData.meaning.trim()) {
      toast.error("Please provide the meaning for sharing knowledge")
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

      const successMessage = activeMode === "share"
        ? "Wisdom shared successfully!"
        : "Question asked successfully!"

      toast.success(successMessage)
      router.push("/explore")
    } catch (error) {
      console.error("Error creating proverb:", error)
      toast.error("Failed to post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Authentication check for ask mode
  if (activeMode === "ask" && !user) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to ask questions about African proverbs.</p>
            <Button onClick={() => router.push("/auth/login")}>
              Login to Share Proverbs
            </Button>
          </div>
        </main>
      </>
    )
  }

  const cardTitle = activeMode === "share" ? "Share Your Knowledge" : "Ask a Question"
  const cardDescription = activeMode === "share"
    ? "Share an African proverb with its meaning"
    : "Ask the community about an African proverb"
  const proverbLabel = activeMode === "share" ? "The Proverb" : "The Proverb/Question"
  const meaningLabel = activeMode === "share" ? "Meaning" : "Your Interpretation (Optional)"
  const meaningPlaceholder = activeMode === "share"
    ? "Explain the meaning of this proverb..."
    : "Leave blank for community help"
  const submitText = activeMode === "share" ? "Share Wisdom" : "Share Proverb"
  const isMeaningRequired = activeMode === "share"

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share African Wisdom</h1>
          <p className="text-lg text-gray-600">
            Share your knowledge or ask the community about African proverbs
          </p>
        </div>

        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as "share" | "ask")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Share Knowledge
            </TabsTrigger>
            <TabsTrigger value="ask" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Share Proverb
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share">
            <Card>
              <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Proverb Text */}
                  <div>
                    <Label htmlFor="proverb">{proverbLabel}</Label>
                    <Textarea
                      id="proverb"
                      placeholder="Enter the African proverb you want to share..."
                      value={formData.proverb}
                      onChange={(e) => handleInputChange("proverb", e.target.value)}
                      className="min-h-24"
                      required
                    />
                  </div>

                  {/* Meaning */}
                  <div>
                    <Label htmlFor="meaning">{meaningLabel}</Label>
                    <Textarea
                      id="meaning"
                      placeholder={meaningPlaceholder}
                      value={formData.meaning}
                      onChange={(e) => handleInputChange("meaning", e.target.value)}
                      className="min-h-20"
                      required={isMeaningRequired}
                    />
                    {activeMode === "ask" && (
                      <p className="text-sm text-gray-500 mt-1">
                        Leave this blank if you want the community to provide the meaning
                      </p>
                    )}
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
                      disabled={isLoading || !formData.proverb.trim() || (isMeaningRequired && !formData.meaning.trim())}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        submitText
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ask">
            <Card>
              <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Proverb Text */}
                  <div>
                    <Label htmlFor="proverb">{proverbLabel}</Label>
                    <Textarea
                      id="proverb"
                      placeholder="Enter the African proverb you want to ask about..."
                      value={formData.proverb}
                      onChange={(e) => handleInputChange("proverb", e.target.value)}
                      className="min-h-24"
                      required
                    />
                  </div>

                  {/* Meaning */}
                  <div>
                    <Label htmlFor="meaning">{meaningLabel}</Label>
                    <Textarea
                      id="meaning"
                      placeholder={meaningPlaceholder}
                      value={formData.meaning}
                      onChange={(e) => handleInputChange("meaning", e.target.value)}
                      className="min-h-20"
                      required={isMeaningRequired}
                    />
                    {activeMode === "ask" && (
                      <p className="text-sm text-gray-500 mt-1">
                        Leave this blank if you want the community to provide the meaning
                      </p>
                    )}
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
                      disabled={isLoading || !formData.proverb.trim() || (isMeaningRequired && !formData.meaning.trim())}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        submitText
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}