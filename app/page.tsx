
'use client';

import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Input, Spacer, Chip } from '@nextui-org/react';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useNotesStore } from '@/lib/store';

export default function HomePage(){
  const {notes, createNote, deleteNote} = useNotesStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(()=>{
    return notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase())).sort((a,b)=> b.updatedAt - a.updatedAt);
  }, [notes, query]);

  return (
    <div className="container">
      <header style={{display:'flex', alignItems:'center', gap:12}}>
        <h1 style={{fontSize:28, fontWeight:700}}>Collaborative Notes</h1>
        <div style={{marginLeft:'auto', display:'flex', gap:12}}>
          <Button color="primary" onPress={()=>createNote()}>New Note</Button>
        </div>
      </header>

      <Spacer y={4} />
      <Input placeholder="Search notes…" value={query} onValueChange={setQuery} variant="bordered" />
      <Spacer y={4} />

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16}}>
        {filtered.map(n => (
          <Card key={n.id} isHoverable>
            <CardHeader className="flex justify-between">
              <Link href={`/note/${n.id}`}><b>{n.title || 'Untitled Note'}</b></Link>
              <Button size="sm" variant="light" onPress={()=>deleteNote(n.id)}>Delete</Button>
            </CardHeader>
            <CardBody>
              <div style={{opacity:.8, fontSize:13, marginBottom:8}}>
                Updated {dayjs(n.updatedAt).format('MMM D, YYYY HH:mm')}
              </div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <Chip size="sm" variant="flat">versions: {n.versions.length}</Chip>
                <Chip size="sm" variant="flat">{n.content.length} chars</Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
