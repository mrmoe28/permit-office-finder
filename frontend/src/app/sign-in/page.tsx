"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your permit office dashboard
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "border border-gray-200 hover:bg-gray-50 text-gray-700",
                formFieldInput: 
                  "border border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                footerActionLink: "text-blue-600 hover:text-blue-700"
              }
            }}
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a 
              href="/sign-up" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
