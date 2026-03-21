import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "../pages/Loading"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) return <Loading />
    if (!user) return <Navigate to="/login" />

    return children;
}

export default ProtectedRoute
