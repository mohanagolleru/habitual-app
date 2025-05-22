
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
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/" className="text-3xl font-bold text-primary">
          Habitual
        </Link>
        <div className="flex items-center gap-4 pr-12">
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
    </header>
  );
}
