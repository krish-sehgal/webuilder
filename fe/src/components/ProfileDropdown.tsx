import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext";
import { ChevronDown, LogOut } from "lucide-react";

function ProfileDropdown() {
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false)
    const { user, logout } = useAuth()
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownVisible(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>

            {/* Trigger */}
            <button
                onClick={() => setIsDropdownVisible((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition"
            >
                <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xs font-medium text-purple-600 dark:text-purple-400">
                    {user?.email[0].toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Dropdown */}
            {isDropdownVisible && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-1.5 z-50">

                    {/* User info */}
                    <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-gray-100 dark:border-gray-800 mb-1 pb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400 shrink-0">
                            {user?.email[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email.split('@')[0]}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                    </button>

                </div>
            )}
        </div>
    )
}

export default ProfileDropdown