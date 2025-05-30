
"use client";

import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Habit, HabitFrequency } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import * as LucideIcons from 'lucide-react'; // Use * as import
import { Smile, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const habitFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(50, "Title too long."),
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
  { name: 'Blue', class: 'bg-blue-500', textColor: 'text-white' },
  { name: 'Indigo', class: 'bg-indigo-500', textColor: 'text-white' },
  { name: 'Violet', class: 'bg-violet-500', textColor: 'text-white' },
  { name: 'Purple', class: 'bg-purple-500', textColor: 'text-white' },
  { name: 'Fuchsia', class: 'bg-fuchsia-500', textColor: 'text-white' },
  { name: 'Pink', class: 'bg-pink-500', textColor: 'text-white' },
  { name: 'Rose', class: 'bg-rose-500', textColor: 'text-white' },
];
const DEFAULT_COLOR_CLASS = 'bg-blue-500';

// More comprehensive list of known non-icon exports from lucide-react
const LUCIDE_EXCLUDED_KEYS = [
  'createElement',
  'IconNode',
  'LucideProps',
  'LucideProvider',
  'toPascalCase',
  'default',
  'icons',
  'createLucideIcon',
  'ICON_NAMES',
  'version',
];

// Curated list of predefined icons
const PREDEFINED_ICONS: string[] = [
  'Activity',        // General activity, exercise
  'AlarmClockCheck', // Waking up, time management
  'Apple',           // Healthy eating
  'Archive',         // Decluttering, organizing
  'Award',           // Achievements, goals
  'Ban',             // Quitting bad habits (smoking, alcohol)
  'Banknote',        // Saving money, budgeting
  'BeanOff',         // Limiting caffeine/sugar
  'Bed',             // Sleep, going to bed early
  'Bike',            // Exercise
  'BookOpen',        // Reading
  'BookOpenText',    // Journaling, learning
  'Brain',           // Learning new skills, mental wellness
  'Briefcase',       // Work, prioritizing tasks
  'Calculator',      // Tracking expenses, budgeting
  'CalendarDays',    // Meal planning, setting goals
  'CandyOff',        // Reducing sugar intake
  'Cat',             // Pet care
  'CheckCircle2',    // Completing tasks, small victories
  'ChefHat',         // Cooking at home
  'CigaretteOff',    // Quitting smoking
  'ClipboardList',   // Prioritizing tasks, to-do lists
  'Clock',           // Managing time effectively
  'CookingPot',      // Meal planning, cooking
  'CreditCard',      // Paying bills on time, avoiding impulse purchases
  'Dental',          // Flossing, brushing teeth
  'Dog',             // Pet care
  'Dumbbell',        // Exercising daily
  'Ear',             // Listening actively
  'FastForward',     // Avoiding procrastination
  'Footprints',      // Walking more
  'GlassWater',      // Drinking enough water
  'Goal',            // Setting realistic goals
  'GraduationCap',   // Learning new skills, lifelong learning
  'Handshake',       // Networking, building relationships
  'HeartHandshake',  // Forgiving others, empathy, quality time with loved ones
  'HeartPulse',      // Getting regular check-ups, managing stress
  'HelpingHand',     // Helping others, volunteering
  'Home',            // Making your bed, doing dishes, cleaning up
  'Hourglass',       // Practicing patience, time management
  'Languages',       // Learning a new language
  'Laptop',          // Limiting screen time, work/study
  'Leaf',            // Spending time in nature, recycling, conserving energy
  'Lightbulb',       // Practicing gratitude, positive self-talk
  'ListTodo',        // Completing tasks on time
  'Lotus',           // Meditating, practicing self-compassion
  'MonitorOff',      // Limiting screen time
  'Moon',            // Going to bed early
  'Move',            // Stretching regularly, taking the stairs
  'Paintbrush',      // Engaging in creative hobbies
  'PartyPopper',     // Celebrating small victories
  'PawPrint',        // Responsible pet owner
  'PenTool',         // Journaling, writing
  'PersonStanding',  // Improving posture
  'Phone',           // Calling family regularly
  'PiggyBank',       // Saving money
  'Pill',            // Taking vitamins
  'Recycle',         // Recycling
  'Run',             // Exercising daily
  'Salad',           // Eating a balanced diet, mindful eating
  'Sandwich',        // Packing lunches
  'ShieldCheck',     // Setting boundaries, saying "no"
  'Shirt',           // Planning outfits
  'Smile',           // Saying "please" and "thank you", sincere compliments
  'SprayCan',        // Cleaning, decluttering
  'Sprout',          // Practicing self-care, personal growth
  'Star',            // Achieving goals
  'Sunrise',         // Waking up early
  'Target',          // Setting goals
  'Timer',           // Managing time
  'Trash2',          // Decluttering
  'TrendingUp',      // Investing, tracking expenses
  'Trophy',          // Celebrating achievements
  'Users',           // Building strong relationships
  'Utensils',        // Eating a balanced diet, cooking at home
  'Vote',            // Voting, civic engagement
  'Waves',           // Deep breathing exercises
  'Yoga',            // Meditating, stretching
  'Zap'              // Quick tasks, energy
].sort();


export function HabitForm({ onSubmit, initialData, isSubmitting }: HabitFormProps) {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      frequency: initialData?.frequency || "daily",
      icon: initialData?.icon || "Target",
      color: initialData?.color || DEFAULT_COLOR_CLASS,
    },
  });

  const [iconSearch, setIconSearch] = React.useState("");
  const [isIconPopoverOpen, setIsIconPopoverOpen] = React.useState(false);

  const availableIcons = React.useMemo(() => {
    console.log("[HabitForm] Using PREDEFINED_ICONS list.");
    const verifiedIcons = PREDEFINED_ICONS.filter(key => {
        const potentialIcon = (LucideIcons as any)[key];
        const isForwardRef = typeof potentialIcon === 'object' &&
                             potentialIcon !== null &&
                             (potentialIcon as any).$$typeof === Symbol.for('react.forward_ref');
        if (!isForwardRef) {
            console.warn(`[HabitForm DIAGNOSTIC] Hardcoded icon '${key}' is NOT a valid ForwardRef component. Type: ${typeof potentialIcon}`);
        }
        return isForwardRef;
    });
    console.log("[HabitForm DIAGNOSTIC] Verified hardcoded icons:", verifiedIcons.length, verifiedIcons);
    return verifiedIcons;
  }, []);

  const filteredIcons = availableIcons.filter(iconName =>
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  React.useEffect(() => {
    if(isIconPopoverOpen) {
      console.log("[HabitForm] Icon Popover Opened. availableIcons count (from effect):", availableIcons.length);
      if (availableIcons.length > 0) {
        console.log("[HabitForm] First 5 availableIcons (from effect):", availableIcons.slice(0,5));
      }
      console.log("[HabitForm] filteredIcons count (from effect):", filteredIcons.length);
      if (filteredIcons.length > 0) {
        console.log("[HabitForm] First 5 filteredIcons (from effect):", filteredIcons.slice(0,5));
      }
    }
  }, [isIconPopoverOpen, availableIcons, filteredIcons]);

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
                    <Button variant="outline" role="combobox" className="w-full justify-start text-popover-foreground">
                      {field.value && (LucideIcons as any)[field.value] && typeof (LucideIcons as any)[field.value] === 'object' && (LucideIcons as any)[field.value].$$typeof === Symbol.for('react.forward_ref') ? (
                        React.createElement((LucideIcons as any)[field.value], { className: "mr-2 h-4 w-4" })
                      ) : (
                        <Smile className="mr-2 h-4 w-4" />
                      )}
                      {field.value && (LucideIcons as any)[field.value] && typeof (LucideIcons as any)[field.value] === 'object' && (LucideIcons as any)[field.value].$$typeof === Symbol.for('react.forward_ref') ? field.value : "Select icon"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
                   <Input
                      placeholder="Search icons..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="m-2 mb-0 w-[calc(100%-1rem)] border-input"
                    />
                    <ScrollArea className="h-[250px] p-2">
                        <div className="grid grid-cols-4 gap-1">
                        {filteredIcons.map(iconName => {
                          const IconComponent = (LucideIcons as any)[iconName];

                          if (!IconComponent || typeof IconComponent !== 'object' || (IconComponent as any).$$typeof !== Symbol.for('react.forward_ref')) {
                            console.warn(`[HabitForm] IconComponent for '${iconName}' is undefined or not a valid ForwardRef component in map loop and was skipped. Value:`, IconComponent);
                            return null;
                          }

                          try {
                            return (
                              <div
                                key={iconName}
                                className="p-1 flex flex-col items-center justify-center cursor-pointer hover:bg-accent rounded-sm"
                                onClick={() => {
                                  field.onChange(iconName);
                                  setIsIconPopoverOpen(false);
                                  setIconSearch("");
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        field.onChange(iconName);
                                        setIsIconPopoverOpen(false);
                                        setIconSearch("");
                                    }
                                }}
                              >
                                {React.createElement(IconComponent, { size: 24, className: "text-black" })}
                                <span className="text-xs mt-1 text-center truncate w-full text-black">{iconName}</span>
                              </div>
                            );
                          } catch (e) {
                            console.error(`[HabitForm] Error rendering icon ${iconName}:`, e, "Component was:", IconComponent);
                            return <div key={iconName + "-error"} className="p-2 text-xs text-red-500">Error: {iconName}</div>;
                          }
                        })}
                        </div>
                        {availableIcons.length === 0 && (
                            <p className="p-2 text-sm text-muted-foreground text-center col-span-4">No icons available to display. Ensure Lucide-React is correctly installed and imported.</p>
                        )}
                        {availableIcons.length > 0 && filteredIcons.length === 0 && iconSearch && (
                            <p className="p-2 text-sm text-muted-foreground text-center col-span-4">No icons found for "{iconSearch}".</p>
                        )}
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
