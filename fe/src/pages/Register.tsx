import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAuth()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/create`, { email, password }, { withCredentials: true })
            const data = response.data
            if (data.success) {
                console.log(data)
                setUser(data.user)
                navigate('/')
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Something went wrong');
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
                        <UserPlusIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-xl font-medium text-gray-900 dark:text-white">Create an account</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get started for free</p>
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleRegister}>

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
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                            Password
                        </label>
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
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Register
