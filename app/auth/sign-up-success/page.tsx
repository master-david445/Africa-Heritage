import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription className="text-green-50">We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                Please check your email and click the confirmation link to verify your account. Once confirmed, you can
                log in and start sharing proverbs.
              </p>

              <div className="pt-4">
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                    Go to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
