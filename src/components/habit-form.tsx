
"use client";

import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Habit, HabitFrequency } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Smile } from 'lucide-react';

const habitFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(50, "Title too long."),
  description: z.string().max(200, "Description too long.").optional(),
  frequency: z.enum(["daily", "weekly", "monthly"], {
    required_error: "Please select a frequency.",
  }),
  icon: z.string().min(1, "Please select an icon."),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;

interface HabitFormProps {
  onSubmit: (values: HabitFormValues, existingHabitId?: string) => Promise<void>;
  initialData?: Partial<Habit>;
  isSubmitting: boolean;
}

const iconBlacklist: string[] = ['Icon','LucideIcon', 'LucideProps', 'IconNode', 'IconWeight', 'Eraser'];
const availableIcons = Object.keys(LucideIcons)
    .filter(key => /^[A-Z]/.test(key) && 
                   (LucideIcons as any)[key].displayName && // Check if it's a ForwardRefExoticComponent (typical for icons)
                   !iconBlacklist.includes(key));


export function HabitForm({ onSubmit, initialData, isSubmitting }: HabitFormProps) {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      frequency: initialData?.frequency || "daily",
      icon: initialData?.icon || "Target",
    },
  });

  const [iconSearch, setIconSearch] = React.useState("");
  const [isIconPopoverOpen, setIsIconPopoverOpen] = React.useState(false);

  const filteredIcons = availableIcons.filter(iconName => iconName.toLowerCase().includes(iconSearch.toLowerCase()));


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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of your habit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                      if (!IconComponent) return null;
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
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (initialData?.id ? "Save Changes" : "Create Habit")}
        </Button>
      </form>
    </Form>
  );
}
