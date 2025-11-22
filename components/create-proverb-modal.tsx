"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createProverbSchema, type CreateProverbInput } from "@/lib/validations"
import { createProverb } from "@/app/actions/proverbs"

interface CreateProverbModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function CreateProverbModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateProverbModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateProverbInput>({
        resolver: zodResolver(createProverbSchema),
        defaultValues: {
            proverb: "",
            meaning: "",
            context: "",
            country: "",
            language: "",
            categories: [],
        },
    })

    const onSubmit = async (data: CreateProverbInput) => {
        setIsSubmitting(true)
        try {
            await createProverb(data)
            toast.success("Proverb shared successfully!")
            form.reset()
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error("Error creating proverb:", error)
            toast.error("Failed to share proverb. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Share a Proverb</DialogTitle>
                    <DialogDescription>
                        Share wisdom from your heritage with the community.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="proverb"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proverb</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the proverb text..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="meaning"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meaning</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="What does this proverb mean?"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country of Origin</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Nigeria" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Original Language</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Yoruba" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="context"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Context (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="When is this proverb usually used?"
                                            className="min-h-[60px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categories (Comma separated)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Wisdom, Family, Life"
                                            value={field.value?.join(", ") || ""}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                const categories = val.split(",").map((c) => c.trim()).filter(Boolean)
                                                field.onChange(categories)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Add up to 10 tags to help others find your proverb.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sharing...
                                    </>
                                ) : (
                                    "Share Proverb"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
