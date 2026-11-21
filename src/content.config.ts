import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Etap Wielkiej Pętli (Produkt A). Każdy plik w src/content/etapy to jeden etap.
const etapy = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/etapy' }),
  schema: z.object({
    title: z.string(),
    sezon: z.number(),
    kolejnosc: z.number(),
    typ: z.enum(['baltyk', 'polnoc', 'ocean']),
    portStart: z.string(),
    portKoniec: z.string(),
    termin: z.string(),
    dni: z.number(),
    cena: z.number(),
    koje: z.number().default(6),
    doswiadczenie: z.string(),
    status: z.enum(['zapowiedz', 'zapisy', 'ostatnie', 'pelny', 'zakonczony']),
    skrot: z.string(),
  }),
});

export const collections = { etapy };
