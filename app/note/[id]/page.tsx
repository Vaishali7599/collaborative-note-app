
'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button, Card, CardBody, CardHeader, Input, Spacer, Tab, Tabs } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { useNotesStore } from '@/lib/store';
import { Toolbar } from '@/components/Toolbar';
import { VersionHistory } from '@/components/VersionHistory';
import { useCollabChannel } from '@/lib/collab';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
import remarkGfm from 'remark-gfm';

export default function NotePage(){
  const params = useParams<{id:string}>();
  const router = useRouter();
  const {getNote, updateNote, saveVersion, deleteNote} = useNotesStore();
  const id = params.id as string;
  const note = getNote(id);
  const [selected, setSelected] = useState<'edit'|'preview'>('edit');

  useCollabChannel(id);

  useEffect(()=>{ if(!note) router.replace('/'); }, [note, router]);

  const setTitle = (t: string) => updateNote(id, {title: t});
  const setContent = (c: string) => updateNote(id, {content: c});

  const wordCount = useMemo(()=>note ? note.content.trim().split(/\s+/).filter(Boolean).length : 0, [note]);

  if(!note) return null;

  return (
    <div className="container">
      <header style={{display:'flex', alignItems:'center', gap:12}}>
        <Button size="sm" variant="flat" onPress={()=>router.push('/')}>← Back</Button>
        <h1 style={{fontSize:22, fontWeight:700}}>Edit Note</h1>
        <div style={{marginLeft:'auto', display:'flex', gap:8}}>
          <Button size="sm" onPress={()=>saveVersion(id)} color="primary">Save Version</Button>
          <Button size="sm" variant="bordered" color="danger" onPress={()=>{ deleteNote(id); router.push('/'); }}>Delete</Button>
        </div>
      </header>

      <Spacer y={3} />
      <Input size="lg" placeholder="Note title…" value={note.title} onValueChange={setTitle} variant="bordered" />
      <Spacer y={4} />

      <Tabs selectedKey={selected} onSelectionChange={(k)=>setSelected(k as any)} aria-label="Editor tabs" variant="underlined">
        <Tab key="edit" title="Editor" />
        <Tab key="preview" title="Preview" />
      </Tabs>

      <Spacer y={2} />

      <Card>
        <CardHeader className="flex justify-between">
          <div style={{opacity:.8, fontSize:13}}>
            <b>{wordCount}</b> words · <b>{note.content.length}</b> chars
          </div>
          <Toolbar value={note.content} onChange={setContent} />
        </CardHeader>
        <CardBody>
          {selected==='edit' ? (
            <textarea className="editor" value={note.content} onChange={(e)=>setContent(e.target.value)} placeholder="Write in Markdown… **bold**, _italics_, `code`, lists, headings." />
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content || "*Nothing to preview yet.*"}
              </ReactMarkdown>
            </div>
          )}
        </CardBody>
      </Card>

      <Spacer y={6} />
      <VersionHistory noteId={id} />
    </div>
  );
}
