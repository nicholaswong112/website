/** Hash function taken from GeeksForGeeks */
export default function hash(s) {
  let hash = 0;
  if (s.length == 0) return hash;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
