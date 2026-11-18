export const PENANGGUNG_JAWAB = [
  "kasir", "sherly", "rahma", "febi", "tari", "keyla",
  "heni", "via", "siti", "dimas", "hendri", "josua",
] as const;

export type PenanggungJawab = (typeof PENANGGUNG_JAWAB)[number];