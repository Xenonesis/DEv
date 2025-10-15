'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Trophy, Calendar, Users, BookOpen, ChevronDown, Info, Mail, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      label: 'Competitions',
      href: '#',
      icon: Trophy,
      dropdown: [
        { label: 'Hackathons', href: '/hackathons', icon: Trophy },
        { label: 'AI Challenges', href: '/ai-challenges', icon: BookOpen },
        { label: 'Web Dev Contests', href: '/web-contests', icon: Calendar },
        { label: 'Mobile Innovation', href: '/mobile-innovation', icon: Users },
      ]
    },
    {
      label: 'Events',
      href: '#',
      icon: Calendar,
      dropdown: [
        { label: 'Upcoming Events', href: '/events', icon: Calendar },
        { label: 'Tech Conferences', href: '/conferences', icon: Users },
        { label: 'Workshops', href: '/workshops', icon: BookOpen },
        { label: 'Meetups', href: '/meetups', icon: Users },
      ]
    },
    {
      label: 'Learning',
      href: '#',
      icon: BookOpen,
      dropdown: [
        { label: 'Courses', href: '/courses', icon: BookOpen },
        { label: 'Tutorials', href: '/tutorials', icon: Calendar },
        { label: 'Resources', href: '/resources', icon: Users },
        { label: 'Mentorship', href: '/mentorship', icon: Trophy },
      ]
    },
    {
      label: 'Community',
      href: '#',
      icon: Users,
      dropdown: [
        { label: 'Forums', href: '/forums', icon: Users },
        { label: 'Teams', href: '/teams', icon: Trophy },
        { label: 'Leaderboard', href: '/leaderboard', icon: Calendar },
        { label: 'Success Stories', href: '/success-stories', icon: BookOpen },
      ]
    },
    {
      label: 'About',
      href: '/about',
      icon: Info,
      dropdown: null
    },
    {
      label: 'Contact',
      href: '#contact',
      icon: Mail,
      dropdown: null
    }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
        : 'bg-background/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <Trophy className="text-white" size={20} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NeoFest
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeDropdown === item.label
                          ? 'text-purple-600 bg-purple-50 dark:bg-purple-950/20'
                          : 'text-foreground hover:text-purple-600 hover:bg-accent'
                      }`}
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className={`absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-lg overflow-hidden transition-all duration-200 ${
                        activeDropdown === item.label 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                              <dropdownItem.icon size={14} className="text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">{dropdownItem.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {dropdownItem.label === 'Hackathons' && 'Compete and win prizes'}
                                {dropdownItem.label === 'AI Challenges' && 'Test your AI skills'}
                                {dropdownItem.label === 'Web Dev Contests' && 'Showcase your expertise'}
                                {dropdownItem.label === 'Mobile Innovation' && 'Build amazing apps'}
                                {dropdownItem.label === 'Upcoming Events' && 'Join live events'}
                                {dropdownItem.label === 'Tech Conferences' && 'Learn from experts'}
                                {dropdownItem.label === 'Workshops' && 'Hands-on learning'}
                                {dropdownItem.label === 'Meetups' && 'Network with peers'}
                                {dropdownItem.label === 'Courses' && 'Structured learning paths'}
                                {dropdownItem.label === 'Tutorials' && 'Step-by-step guides'}
                                {dropdownItem.label === 'Resources' && 'Helpful materials'}
                                {dropdownItem.label === 'Mentorship' && 'Learn from pros'}
                                {dropdownItem.label === 'Forums' && 'Join discussions'}
                                {dropdownItem.label === 'Teams' && 'Form teams'}
                                {dropdownItem.label === 'Leaderboard' && 'Top performers'}
                                {dropdownItem.label === 'Success Stories' && 'Get inspired'}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-purple-600 hover:bg-accent transition-all duration-200"
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            {status === 'loading' ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/20"
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button 
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-purple-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 px-3 py-2 text-purple-600 font-medium">
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:text-purple-600 hover:bg-accent rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <dropdownItem.icon size={14} />
                            <span>{dropdownItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-purple-600 hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                {session ? (
                  <>
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-muted-foreground text-xs">{session.user?.email}</p>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;