import type React from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Loading from "../pages/Loading"

function GuestRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) return <Loading />
    if (user) return <Navigate to="/" />

    return children
}

export default GuestRoute
