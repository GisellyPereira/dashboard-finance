<script setup lang="ts">
defineProps<{ name: string; size?: number }>();
const paths: Record<string, string[]> = {
  overview: ["M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"],
  transactions: ["M4 7h16M4 12h10M4 17h16", "m17 10 3 2-3 2"],
  reports: ["M4 20V10M10 20V4M16 20v-7M22 20H2"],
  plus: ["M12 5v14M5 12h14"],
  close: ["m6 6 12 12M6 18 18 6"],
  calendar: [
    "M7 3v4M17 3v4M3 10h18",
    "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  ],
  chevron: ["m7 10 5 5 5-5"],
  search: ["M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z", "m16 16 5 5"],
  eye: [
    "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z",
    "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  ],
  "eye-off": [
    "m3 3 18 18M9 5.4A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 4M6 6C3.4 8.2 2 12 2 12s3.5 7 10 7a12 12 0 0 0 6-1.6",
  ],
  download: ["M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"],
  edit: ["m15 4 5 5M4 20l4-1L21 6a2.8 2.8 0 0 0-4-4L4 15v5Z"],
  trash: ["M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"],
  check: ["m5 12 4 4L19 6"],
  storage: ["M5 3h12l3 3v15H4V3h1Z", "M8 3v6h8V3M8 21v-8h8v8"],
  info: ["M12 11v6M12 7h.01", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"],
  home: ["m3 10 9-7 9 7v11h-7v-7h-4v7H3V10Z"],
  food: [
    "M6 3v7M3 3v5a3 3 0 0 0 6 0V3M6 11v10M17 3c-3 3-3 7 0 8h3V3h-3Zm3 8v10",
  ],
  car: ["m4 10 2-6h12l2 6M3 10h18v8H3zM5 18v3M19 18v3M6 14h2M16 14h2"],
  work: ["M8 6V3h8v3M3 6h18v15H3zM3 12c6 3 12 3 18 0M10 12h4v4h-4z"],
  coffee: [
    "M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 9h2a3 3 0 0 1 0 6h-2M7 3v2M12 3v2",
  ],
  subscription: ["M4 5h16v14H4zM4 9h16M7 14h4"],
  book: ["M12 5v16M3 3c4 0 7 1 9 2 2-1 5-2 9-2v16c-4 0-7 1-9 2-2-1-5-2-9-2V3Z"],
  health: ["M12 3v18M3 12h18"],
  other: ["M4 4h16v16H4zM8 8h8M8 12h8M8 16h4"],
};
</script>
<template>
  <svg
    :width="size || 20"
    :height="size || 20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="(path, i) in paths[name] || paths.other" :key="i" :d="path" />
  </svg>
</template>
