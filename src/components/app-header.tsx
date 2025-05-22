
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusSquare, LayoutGrid } from "lucide-react";
import Link from 'next/link';

interface AppHeaderProps {
  onOpenAddHabitDialog: () => void;
}

export function AppHeader({ onOpenAddHabitDialog }: AppHeaderProps) {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-4xl font-bold text-primary">
          Habitual
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/heatmap" passHref>
            <Button variant="outline" size="lg">
              <LayoutGrid className="mr-2 h-5 w-5" />
              Heatmap
            </Button>
          </Link>
          <Button onClick={onOpenAddHabitDialog} variant="default" size="lg">
            <PlusSquare className="mr-2 h-5 w-5" />
            Add New Habit
          </Button>
        </div>
      </div>
    </header>
  );
}
