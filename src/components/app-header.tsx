
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusSquare, LayoutGrid } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  onOpenAddHabitDialog: () => void;
}

export function AppHeader({ onOpenAddHabitDialog }: AppHeaderProps) {
  return (
    <header className="py-3 border-b">
      <div className="container mx-auto flex items-center">
        <div className="flex-1">
          {/* Left spacer, can be used for other elements in the future */}
        </div>
        <Link href="/" className="text-3xl font-bold text-primary text-center">
          Habitual
        </Link>
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-4">
            <Link href="/heatmap" passHref>
              <Button variant="outline" size="lg">
                <LayoutGrid className="mr-2 h-5 w-5" />
                Heatmap
              </Button>
            </Link>
            <Button 
              onClick={onOpenAddHabitDialog} 
              size="lg"
              className="bg-[#ADFF2F] hover:bg-[#98e61a] text-black"
            >
              <PlusSquare className="mr-2 h-5 w-5" />
              Add New Habit
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
