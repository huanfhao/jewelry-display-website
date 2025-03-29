import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Business Registration</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <RegisterForm />
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
} 