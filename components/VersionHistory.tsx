
'use client';

import { Card, CardBody, CardHeader, Button, Spacer } from '@nextui-org/react';
import dayjs from 'dayjs';
import { useNotesStore } from '@/lib/store';

export function VersionHistory({noteId}:{noteId:string}){
  const {getNote, restoreVersion, deleteVersion} = useNotesStore();
  const note = getNote(noteId);
  if(!note) return null;

  const list = note.versions.slice().sort((a,b)=> b.timestamp - a.timestamp);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <b>Version History</b>
        <div style={{opacity:.8}}>{list.length} versions</div>
      </CardHeader>
      <CardBody>
        <div style={{display:'grid', gap:12}}>
          {list.map(v => (
            <div key={v.id} className="version-item" style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between'}}>
              <div>
                <div><b>{dayjs(v.timestamp).format('MMM D, YYYY HH:mm:ss')}</b></div>
                <div style={{opacity:.8, fontSize:13}}>
                  {v.summary || (v.content.slice(0,80) + (v.content.length>80 ? '…' : ''))}
                </div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <Button size="sm" onPress={()=>restoreVersion(noteId, v.id)} color="primary">Restore</Button>
                <Button size="sm" variant="bordered" onPress={()=>deleteVersion(noteId, v.id)} color="danger">Delete</Button>
              </div>
            </div>
          ))}
          {list.length===0 && (
            <div style={{opacity:.7}}>No versions yet. Click <b>Save Version</b> to snapshot the current note.</div>
          )}
        </div>
        <Spacer y={1} />
        <div style={{opacity:.7, fontSize:12}}>Versions are local to your browser and synced across open tabs.</div>
      </CardBody>
    </Card>
  );
}
