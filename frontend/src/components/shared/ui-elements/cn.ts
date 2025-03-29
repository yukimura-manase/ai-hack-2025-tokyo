import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * tailwindのクラスをマージするためのユーティリティ関数
 * @param inputs クラス名の配列
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
