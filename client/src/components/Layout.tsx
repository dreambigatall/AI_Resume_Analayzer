// src/components/Layout.tsx
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Add avatar if not added: npx shadcn-ui@latest add avatar

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login'); // Redirect to login after sign out
  };

  // Get user initials for Avatar Fallback
  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="text-lg font-semibold">
            Resume Analyzer
          </Link>
          <nav className="flex items-center space-x-4">
            {isLoading ? (
              <span>Loading...</span>
            ) : user ? (
              <>
                <Link to="/jobs">
                  <Button variant="ghost">Jobs</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <Avatar className="h-8 w-8">
                          {/* <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} /> */}
                          <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Add other items like Profile, Settings if needed */}
                    <DropdownMenuItem onClick={handleSignOut}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="default">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6">
        {children}
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto py-4 px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Resume Analyzer Inc.
        </div>
      </footer>
    </div>
  );
};

export default Layout;