
"use client";

import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Habit, HabitFrequency } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea"; // Removed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as LucideIcons from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, Palette, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

const habitFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(50, "Title too long."),
  // description: z.string().max(200, "Description too long.").optional(), // Removed
  frequency: z.enum(["daily", "weekly", "monthly"], {
    required_error: "Please select a frequency.",
  }),
  icon: z.string().min(1, "Please select an icon."),
  color: z.string().min(1, "Please select a color."),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;

interface HabitFormProps {
  onSubmit: (values: HabitFormValues, existingHabitId?: string) => Promise<void>;
  initialData?: Partial<Habit>;
  isSubmitting: boolean;
}

const PREDEFINED_ICONS: string[] = [
  'Activity', 'Anchor', 'Apple', 'Award', 'Bed', 'Bike', 'BookOpen', 'Brain', 
  'Briefcase', 'Calendar', 'Camera', 'Carrot', 'CheckCircle', 'ClipboardList', 
  'Cloud', 'Coffee', 'CookingPot', 'Cpu', 'CupSoda', 'DollarSign', 'Dumbbell', 
  'Feather', 'Film', 'Fish', 'Flag', 'Flame', 'Footprints', 'ForkKnife', 'Gift', 
  'Globe', 'Grape', 'Heart', 'HeartPulse', 'Home', 'Image', 'Laptop', 'Leaf', 
  'Lightbulb', 'Link', 'List', 'Lock', 'MapPin', 'Medal', 'Mic', 'Moon', 
  'Mountain', 'Music', 'Package', 'PenTool', 'Plane', 'Rocket', 'Run', 'Salad', 
  'Sandwich', 'Save', 'Scale', 'Search', 'Settings', 'Share2', 'Shield', 
  'ShoppingBag', 'Smile', 'Speaker', 'Sprout', 'Star', 'Sun', 'Sunrise', 
  'Sunset', 'Tablet', 'Tag', 'Target', 'ThumbsUp', 'Trophy', 'Tv', 'User', 
  'Users', 'Utensils', 'Video', 'Watch', 'Waves', 'Wind', 'Yoga', 'Zap'
].sort();


const COLOR_PALETTE: { name: string; class: string; textColor: string }[] = [
  { name: 'Red', class: 'bg-red-500', textColor: 'text-white' },
  { name: 'Orange', class: 'bg-orange-500', textColor: 'text-white' },
  { name: 'Amber', class: 'bg-amber-500', textColor: 'text-black' },
  { name: 'Yellow', class: 'bg-yellow-400', textColor: 'text-black' },
  { name: 'Lime', class: 'bg-lime-500', textColor: 'text-black' },
  { name: 'Green', class: 'bg-green-500', textColor: 'text-white' },
  { name: 'Emerald', class: 'bg-emerald-500', textColor: 'text-white' },
  { name: 'Teal', class: 'bg-teal-500', textColor: 'text-white' },
  { name: 'Cyan', class: 'bg-cyan-500', textColor: 'text-black' },
  { name: 'Sky', class: 'bg-sky-500', textColor: 'text-white' },
  { name: 'Blue', class: 'bg-blue-500', textColor: 'text-white' }, // Default
  { name: 'Indigo', class: 'bg-indigo-500', textColor: 'text-white' },
  { name: 'Violet', class: 'bg-violet-500', textColor: 'text-white' },
  { name: 'Purple', class: 'bg-purple-500', textColor: 'text-white' },
  { name: 'Fuchsia', class: 'bg-fuchsia-500', textColor: 'text-white' },
  { name: 'Pink', class: 'bg-pink-500', textColor: 'text-white' },
  { name: 'Rose', class: 'bg-rose-500', textColor: 'text-white' },
];
const DEFAULT_COLOR_CLASS = 'bg-blue-500';

export function HabitForm({ onSubmit, initialData, isSubmitting }: HabitFormProps) {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      // description: initialData?.description || "", // Removed
      frequency: initialData?.frequency || "daily",
      icon: initialData?.icon || "Target",
      color: initialData?.color || DEFAULT_COLOR_CLASS,
    },
  });

  const [iconSearch, setIconSearch] = React.useState("");
  const [isIconPopoverOpen, setIsIconPopoverOpen] = React.useState(false);

  const filteredIcons = PREDEFINED_ICONS.filter(iconName => 
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(values => onSubmit(values, initialData?.id))} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Morning Run" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field Removed */}

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Icon</FormLabel>
              <Popover open={isIconPopoverOpen} onOpenChange={setIsIconPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className="w-full justify-start">
                      {field.value && (LucideIcons as any)[field.value] ? (
                        <>
                          {React.createElement((LucideIcons as any)[field.value], { className: "mr-2 h-4 w-4" })}
                          {field.value}
                        </>
                      ) : (
                        <> <Smile className="mr-2 h-4 w-4" /> Select icon </>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                   <Input 
                      placeholder="Search icons..." 
                      value={iconSearch} 
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="m-2 w-[calc(100%-1rem)] border-input"
                    />
                  <ScrollArea className="h-[200px]">
                    <div className="grid grid-cols-4 gap-1 p-2">
                    {filteredIcons.map(iconName => {
                      const IconComponent = (LucideIcons as any)[iconName];
                      if (!IconComponent || typeof IconComponent === 'string') return null; // Ensure it's a component
                      return (
                        <Button
                          type="button"
                          key={iconName}
                          variant="ghost"
                          className="flex flex-col items-center justify-center h-16 p-1"
                          onClick={() => {
                            field.onChange(iconName);
                            setIsIconPopoverOpen(false);
                          }}
                        >
                          <IconComponent className="h-5 w-5 mb-1" />
                          <span className="text-xs truncate w-full text-center">{iconName}</span>
                        </Button>
                      );
                    })}
                    {filteredIcons.length === 0 && <p className="p-2 text-sm text-muted-foreground col-span-4 text-center">No icons found.</p>}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Choose an icon that represents your habit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="grid grid-cols-6 gap-2 p-1 border rounded-md">
                  {COLOR_PALETTE.map((colorOption) => (
                    <Button
                      type="button"
                      key={colorOption.class}
                      variant="outline"
                      className={cn(
                        "h-10 w-10 rounded-md p-0 border-2",
                        colorOption.class,
                        field.value === colorOption.class ? 'border-ring ring-2 ring-ring ring-offset-2' : 'border-transparent'
                      )}
                      onClick={() => field.onChange(colorOption.class)}
                      aria-label={colorOption.name}
                    >
                      {field.value === colorOption.class && <Check className={cn("h-5 w-5", colorOption.textColor)} />}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Select a color for your habit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (initialData?.id ? "Save Changes" : "Create Habit")}
        </Button>
      </form>
    </Form>
  );
}

