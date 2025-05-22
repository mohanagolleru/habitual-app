
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
      <div className="container mx-auto grid grid-cols-4 gap-6 items-center px-6">
        {/* Column 1: Habitual Title */}
        <div className="col-span-1 flex justify-center">
          <Link href="/" className="text-3xl font-bold text-primary">
            Habitual
          </Link>
        </div>

        {/* Column 2: Spacer (aligns with first habit column on page) */}
        <div className="col-span-1"></div>

        {/* Column 3: Heatmap Button (aligns with second habit column on page) */}
        <div className="col-span-1 flex justify-center">
          <Link href="/heatmap" passHref>
            <Button variant="outline" size="lg">
              <LayoutGrid className="mr-2 h-5 w-5" />
              Heatmap
            </Button>
          </Link>
        </div>

        {/* Column 4: Add New Habit Button (aligns with third/last habit column on page) */}
        <div className="col-span-1 flex justify-center">
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
    </header>
  );
}
