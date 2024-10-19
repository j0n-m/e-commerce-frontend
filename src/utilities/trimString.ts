export function trimString(str: string, cap: number = 55) {
  return str.length > cap ? str.substring(0, cap - 3) + "..." : str;
}
