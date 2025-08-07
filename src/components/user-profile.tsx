'use client'
import { UserCircle, LogOut, Home } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu'
import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserProfile() {
    const supabase = createClient()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover-target interactive-element"
                    data-interactive="true"
                    data-user-menu="true"
                >
                    <UserCircle className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Account</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href="/"
                        className="hover-target interactive-element"
                        data-interactive="true"
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}