
'use client';
import type { Note } from './types';

const STORAGE_KEY = 'collab_notes_frontend_only_v1';

export function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    return JSON.parse(raw) as Note[];
  } catch { return []; }
}

export function saveNotes(notes: Note[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch {}
}
