/**
 * Utility Functions
 * 
 * Common utility functions used throughout the application.
 * 
 * @module lib/utils/utils
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * 
 * Merges Tailwind CSS classes intelligently, resolving conflicts
 * by keeping the last conflicting class.
 * 
 * @param {...ClassValue} inputs - Class names or conditional class objects
 * @returns {string} Merged class string
 * @example
 * cn('foo', 'bar') // 'foo bar'
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4' (px-2 is overridden by px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




