// Extend or customize this as needed
export function getTailwindHex(bgClass: string): string {
  switch (bgClass) {
    case 'bg-teal-900':
      return '#134e4a';
    case 'bg-blue-600':
      return '#2563eb';
    case 'bg-yellow-900':
      return '#713f12';
    case 'bg-blue-900':
      return '#1e3a8a';
    case 'bg-emerald-900':
      return '#064e3b';
    case 'bg-emerald-600':
      return '#059669';
    case 'bg-sky-800':
      return '#075985';
    case 'bg-sky-500':
      return '#0ea5e9';
    case 'bg-lime-900':
      return '#365314';
    case 'bg-lime-700':
      return '#4d7c0f';
    case 'bg-yellow-600':
      return '#ca8a04';
    case 'bg-zinc-900':
      return '#18181b';
    case 'bg-cyan-400':
      return '#22d3ee';
    case 'bg-orange-900':
      return '#7c2d12';
    case 'bg-neutral-900':
      return '#171717';
    case 'bg-neutral-700':
      return '#404040';
    case 'bg-emerald-700':
      return '#047857';
    case 'bg-green-800':
      return '#166534';
    default:
      // Fallback color:
      return '#888888';
  }
}
