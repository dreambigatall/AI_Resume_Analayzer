// export default Layout;
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Assuming this path is correct
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup, // Added for grouping items
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"; // For mobile menu
import {
  LogOut,
  Briefcase,
  LogIn,
  UserPlus,
  Menu,
  XIcon,
  FileText,
} from "lucide-react";

// Mock useAuth for standalone example (Remove in your actual project)
/*
const useAuth = () => ({
  user: { email: 'test@example.com', user_metadata: { full_name: 'Test User', avatar_url: 'https://placehold.co/100x100/E0E0E0/333?text=TU' } },
  // user: null, // Test logged out state
  signOut: async () => { console.log('Signed out'); return Promise.resolve(); },
  isLoading: false,
});
*/

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email ? email.slice(0, 2).toUpperCase() : "U";
  };

  const commonNavLinks = (isMobile: boolean = false) => (
    <>
      <Link to="/jobs" className={isMobile ? "block py-2 px-3 rounded-md hover:bg-slate-100" : ""}>
        <Button variant={isMobile ? "link" : "ghost"} className={isMobile ? "w-full justify-start text-base text-slate-700" : "text-slate-600 hover:text-slate-900"}>
          <Briefcase className="mr-2 h-4 w-4" />
          Jobs
        </Button>
      </Link>
      {/* Add other common navigation links here if any */}
      {/* Example:
      <Link to="/dashboard" className={isMobile ? "block py-2 px-3 rounded-md hover:bg-slate-100" : ""}>
        <Button variant={isMobile ? "link" : "ghost"} className={isMobile ? "w-full justify-start text-base text-slate-700" : "text-slate-600 hover:text-slate-900"}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      */}
    </>
  );


  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 hover:text-indigo-600 transition-colors">
            <FileText className="h-7 w-7 text-indigo-600" />
            <span>Resume Analyzer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200"></div>
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200"></div>
              </div>
            ) : user ? (
              <>
                {commonNavLinks()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                      <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-indigo-500 transition-all">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User Avatar'} />
                        <AvatarFallback className="bg-indigo-500 text-white font-semibold">
                          {getInitials(user.user_metadata?.full_name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 rounded-xl shadow-lg border-slate-200 mt-2 p-2" align="end" forceMount>
                    <DropdownMenuLabel className="px-2 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-slate-800">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuGroup>
                       {/* Example additional items:
                       <DropdownMenuItem asChild className="cursor-pointer hover:!bg-slate-100">
                        <Link to="/profile" className="flex items-center w-full">
                          <UserCircle className="mr-2 h-4 w-4 text-slate-600" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:!bg-slate-100">
                        <Link to="/settings" className="flex items-center w-full">
                          <Settings className="mr-2 h-4 w-4 text-slate-600" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      */}
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:!bg-red-50 text-red-600 hover:!text-red-700 focus:!bg-red-50 focus:!text-red-700">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 shadow-sm hover:shadow-md transition-all">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0 bg-white">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-slate-200">
                     <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-slate-800" onClick={() => setIsMobileMenuOpen(false)}>
                        <FileText className="h-6 w-6 text-indigo-600" />
                        <span>Resume Analyzer</span>
                      </Link>
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100">
                          <XIcon className="h-5 w-5" />
                          <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetClose>
                  </div>
                  
                  <nav className="flex-grow p-6 space-y-3">
                    {isLoading ? (
                       <div className="space-y-3">
                          <div className="h-8 w-full animate-pulse rounded-md bg-slate-200"></div>
                          <div className="h-8 w-full animate-pulse rounded-md bg-slate-200"></div>
                       </div>
                    ) : user ? (
                      <>
                        <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                           <p className="text-sm font-medium leading-none text-slate-800">
                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                          </p>
                          <p className="text-xs leading-none text-slate-500 mt-1">
                            {user.email}
                          </p>
                        </div>
                        {commonNavLinks(true)}
                        {/* Example additional mobile links:
                        <Link to="/profile" className="block py-2 px-3 rounded-md hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="link" className="w-full justify-start text-base text-slate-700">
                                <UserCircle className="mr-2 h-4 w-4" /> Profile
                            </Button>
                        </Link>
                        <Link to="/settings" className="block py-2 px-3 rounded-md hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="link" className="w-full justify-start text-base text-slate-700">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </Button>
                        </Link>
                        */}
                        <div className="pt-4 border-t border-slate-200">
                            <Button variant="ghost" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="w-full justify-start text-base text-red-600 hover:bg-red-50 hover:text-red-700">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full text-base border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                            <LogIn className="mr-2 h-4 w-4" /> Login
                          </Button>
                        </Link>
                        <Link to="/signup" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full text-base bg-indigo-600 hover:bg-indigo-700 text-white">
                            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-8 text-center sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Resume Analyzer Inc. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy-policy" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


