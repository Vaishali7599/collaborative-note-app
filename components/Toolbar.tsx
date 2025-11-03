
'use client';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useCallback } from 'react';

type Props = { value: string; onChange: (next: string) => void; };

export function Toolbar({value, onChange}: Props){
  const surround = useCallback((left: string, right = left) => {
    return () => { onChange(value + (value.endsWith('\n') || value.length===0 ? '' : '\n') + left + 'text' + right); };
  }, [value, onChange]);

  const addLine = useCallback((prefix: string) => {
    return () => onChange(value + (value.endsWith('\n') || value.length===0 ? '' : '\n') + prefix);
  }, [value, onChange]);

  return (
    <div className="toolbar" style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap'}}>
      <Button size="sm" variant="flat" onPress={surround("**")}>Bold</Button>
      <Button size="sm" variant="flat" onPress={surround("_")}>Italics</Button>
      <Button size="sm" variant="flat" onPress={surround("`")}>Code</Button>
      <Button size="sm" variant="flat" onPress={addLine("- ")}>List</Button>
      <Button size="sm" variant="flat" onPress={addLine("1. ")}>Numbered</Button>
      <Button size="sm" variant="flat" onPress={addLine("```\ncode\n```")}>Code Block</Button>

      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" variant="bordered">Headings</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Headings">
          {["#", "##", "###", "####"].map(h => (
            <DropdownItem key={h} onPress={addLine(h + " ")}>{h.replace(/#/g,'# ')}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
