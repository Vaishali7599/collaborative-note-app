
'use client';

import { create } from 'zustand';
import type { Note, Version } from './types';
import { loadNotes, saveNotes } from './storage';
import { v4 as uuidv4 } from 'uuid';
import { broadcastNoteUpdate } from './collab';

type NotesState = {
  notes: Note[];
  createNote: () => string;
  getNote: (id: string) => Note | undefined;
  updateNote: (id: string, patch: Partial<Pick<Note, 'title'|'content'>>) => void;
  saveVersion: (id: string) => void;
  restoreVersion: (id: string, versionId: string) => void;
  deleteVersion: (id: string, versionId: string) => void;
  deleteNote: (id: string) => void;
  syncFromStorage: () => void;
};

function persistAndBroadcast(getNotes:()=>Note[]){
  const notes = getNotes();
  saveNotes(notes);
  broadcastNoteUpdate();
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: (() => {
    const initial = loadNotes();
    if (initial.length === 0) {
      const now = Date.now();
      const welcome: Note = {
        id: uuidv4(),
        title: "Welcome to Collaborative Notes",
        content: `# 👋 Welcome!

This is a **frontend-only** collaborative note app.

- Markdown editing with toolbar
- Live sync across open tabs (BroadcastChannel)
- Version history with restore
- Fast localStorage (no backend required)

## Tips
- Use **Bold**, _Italics_, \`Code\`, lists, headings.
- Click **Save Version** to snapshot your work.
`,
        createdAt: now,
        updatedAt: now,
        versions: []
      };
      saveNotes([welcome]);
      return [welcome];
    }
    return initial;
  })(),

  createNote: () => {
    const now = Date.now();
    const id = uuidv4();
    const newNote: Note = { id, title: "", content: "", createdAt: now, updatedAt: now, versions: [] };
    set(s => ({ notes: [newNote, ...s.notes] }));
    persistAndBroadcast(()=>get().notes);
    return id;
  },

  getNote: (id) => get().notes.find(n => n.id === id),

  updateNote: (id, patch) => {
    set(state => ({ notes: state.notes.map(n => n.id === id ? ({...n, ...patch, updatedAt: Date.now()}) : n) }));
    persistAndBroadcast(()=>get().notes);
  },

  saveVersion: (id) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    const version: Version = { id: uuidv4(), timestamp: Date.now(), content: note.content, summary: note.title || undefined };
    set(state => ({ notes: state.notes.map(n => n.id === id ? ({...n, versions: [...n.versions, version], updatedAt: Date.now()}) : n) }));
    persistAndBroadcast(()=>get().notes);
  },

  restoreVersion: (id, versionId) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;
    const v = note.versions.find(v => v.id === versionId);
    if (!v) return;
    set(state => ({ notes: state.notes.map(n => n.id === id ? ({...n, content: v.content, updatedAt: Date.now()}) : n) }));
    persistAndBroadcast(()=>get().notes);
  },

  deleteVersion: (id, versionId) => {
    set(state => ({ notes: state.notes.map(n => n.id === id ? ({...n, versions: n.versions.filter(v => v.id !== versionId), updatedAt: Date.now()}) : n) }));
    persistAndBroadcast(()=>get().notes);
  },

  deleteNote: (id) => {
    set(state => ({ notes: state.notes.filter(n => n.id !== id) }));
    persistAndBroadcast(()=>get().notes);
  },

  syncFromStorage: () => {
    const latest = loadNotes();
    set({ notes: latest });
  },
}));
