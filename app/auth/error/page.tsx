import { redirect } from 'next/navigation'

export default function AuthError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was an error during the authentication process. Please try again.
        </p>
        <a 
          href="/login" 
          className="inline-block rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
