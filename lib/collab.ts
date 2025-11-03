
'use client';
import { useEffect } from 'react';
import { useNotesStore } from './store';

type CollabMessage = { type: 'note:update' };
const channelName = 'collab-notes-frontend-only';

export function useCollabChannel(noteId?: string){
  const syncFromStorage = useNotesStore(s => s.syncFromStorage);
  useEffect(()=>{
    const bc = typeof window !== 'undefined' ? new BroadcastChannel(channelName) : null;
    if(!bc) return;
    const onMessage = (ev: MessageEvent<CollabMessage>) => {
      if(ev.data.type === 'note:update'){ syncFromStorage(); }
    };
    bc.addEventListener('message', onMessage);
    // Ask others to sync us on mount
    try { bc.postMessage({type:'note:update'}); } catch {}
    return () => { bc.removeEventListener('message', onMessage); bc.close(); };
  }, [noteId, syncFromStorage]);
}

export function broadcastNoteUpdate(){
  try {
    const bc = new BroadcastChannel(channelName);
    bc.postMessage({type:'note:update'});
    bc.close();
  } catch {}
}
