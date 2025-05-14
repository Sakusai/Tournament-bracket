import { LoginForm } from './form';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="relative h-screen w-full">
            <div className="absolute inset-0">
                <img
                    src="/background.jpg"
                    alt="Background"
                    className="w-full h-full object-cover blur-sm"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                <h1 className="text-4xl font-bold text-white mb-10 drop-shadow-lg">
                    Brackement
                </h1>

                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
                        <p className="text-gray-500 mt-1">
                            Enter your email below to login to your account
                        </p>
                    </div>

                    <LoginForm />

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline text-indigo-600 hover:text-indigo-800">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}