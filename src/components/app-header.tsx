
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusSquare, LayoutGrid, LogOut, LogIn, UserPlus } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

interface AppHeaderProps {
  onOpenAddHabitDialog: () => void;
}

export function AppHeader({ onOpenAddHabitDialog }: AppHeaderProps) {
  const { user, logOut, loading } = useAuth();

  return (
    <header className="py-3 border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile Header */}
      <div className="md:hidden container mx-auto flex flex-col items-center gap-3 px-4 py-2">
        <Link href="/" className="text-2xl font-bold text-primary">
          Habitual
        </Link>
        <div className="flex flex-wrap justify-center items-center gap-2 w-full">
          {loading ? (
            <Button variant="outline" size="sm" disabled>Loading...</Button>
          ) : user ? (
            <>
              <Link href="/heatmap" passHref>
                <Button variant="outline" size="sm">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Heatmap
                </Button>
              </Link>
              <Button
                onClick={onOpenAddHabitDialog}
                size="sm"
                className="bg-[#ADFF2F] hover:bg-[#98e61a] text-black"
              >
                <PlusSquare className="mr-2 h-4 w-4" />
                Add Habit
              </Button>
              <Button onClick={logOut} variant="outline" size="icon" title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="outline" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button size="sm" className="bg-[#ADFF2F] hover:bg-[#98e61a] text-black">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:grid container mx-auto grid-cols-4 gap-6 items-center px-6">
        {/* Column 1: Habitual Title */}
        <div className="col-span-1 flex justify-center">
          <Link href="/" className="text-3xl font-bold text-primary">
            Habitual
          </Link>
        </div>

        {/* Column 2: Spacer (aligns with first habit column on page) */}
        <div className="col-span-1"></div>

        {/* Column 3: Heatmap / Auth Buttons */}
        <div className="col-span-1 flex justify-center items-center gap-2">
          {loading ? (
            <Button variant="outline" size="lg" disabled>Loading...</Button>
          ) : user ? (
            <>
              <Link href="/heatmap" passHref>
                <Button variant="outline" size="lg">
                  <LayoutGrid className="mr-2 h-5 w-5" />
                  Heatmap
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login" passHref>
              <Button variant="outline" size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Column 4: Add New Habit / Auth Buttons */}
        <div className="col-span-1 flex justify-center items-center gap-2">
          {loading ? (
             <Button variant="outline" size="lg" disabled>Loading...</Button>
          ) : user ? (
            <>
              <Button
                onClick={onOpenAddHabitDialog}
                size="lg"
                className="bg-[#ADFF2F] hover:bg-[#98e61a] text-black"
              >
                <PlusSquare className="mr-2 h-5 w-5" />
                Add New Habit
              </Button>
              <Button onClick={logOut} variant="outline" size="icon" title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link href="/signup" passHref>
              <Button size="lg" className="bg-[#ADFF2F] hover:bg-[#98e61a] text-black">
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
