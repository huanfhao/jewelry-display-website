import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SignInForm />
        <p className="text-sm text-gray-500 text-center mt-4">
          Don&apos;t have an account?{' '}
          <a href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
} 