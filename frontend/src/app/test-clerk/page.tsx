"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function TestClerkPage() {
  const { user, isLoaded } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Clerk Authentication Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <SignedOut>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Please sign in to continue</h2>
            <p className="text-gray-600">Use the sign in button in the header to authenticate.</p>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Welcome! You are signed in.</h2>
            
            {isLoaded && user && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">User Information:</h3>
                <ul className="space-y-1 text-sm">
                  <li><strong>ID:</strong> {user.id}</li>
                  <li><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</li>
                  <li><strong>Name:</strong> {user.fullName}</li>
                  <li><strong>Created:</strong> {user.createdAt?.toLocaleDateString()}</li>
                </ul>
              </div>
            )}

            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <span className="text-sm text-gray-600">Click the user button to manage your account</span>
            </div>
          </div>
        </SignedIn>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Clerk Integration Status:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ ClerkProvider configured in layout.tsx</li>
          <li>✅ Middleware.ts created with clerkMiddleware()</li>
          <li>✅ Authentication components imported</li>
          <li>⚠️ Environment variables need to be set</li>
        </ul>
      </div>
    </div>
  );
}
