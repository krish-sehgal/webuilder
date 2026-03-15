import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const eNotify = (msg: string) => toast.error(msg)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password }, { withCredentials: true })
            setUser(response.data.user)
            navigate('/')
        } catch (error: any) {
            eNotify(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 w-full max-w-sm shadow-sm">

                {/* Icon + heading */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                        <UserIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-xl font-medium text-gray-900 dark:text-white">Welcome back</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleLogin}>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                                Password
                            </label>
                            <a href="#" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 w-full py-2.5 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Don't have an account?{" "}
                    <a href="/register" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
            <Toaster />
        </div>
    )
}

export default Login
