/**
 * Formats a number into a YouTube-style string (e.g., 1K, 1.5M).
 * 
 * @param count The number to format
 * @returns A formatted string
 */
export const formatCount = (count: number): string => {
  if (!count || isNaN(count)) return '0';
  
  if (count >= 1000000) {
    const millions = count / 1000000;
    return millions % 1 === 0 
      ? `${Math.floor(millions)}M` 
      : `${millions.toFixed(1)}M`;
  }

  if (count >= 1000) {
    const thousands = count / 1000;
    return thousands % 1 === 0 
      ? `${Math.floor(thousands)}K` 
      : `${thousands.toFixed(1)}K`;
  }

  return count.toString();
};
