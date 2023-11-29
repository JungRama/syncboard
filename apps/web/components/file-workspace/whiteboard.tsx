'use-client';

import {
  Editor,
  Tldraw,
  TLUiOverrides,
  findMenuItem,
  menuItem,
  track,
  useEditor,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';
import { useYjsStore } from './useYjs';
import _ from 'underscore';

export default function Whiteboard() {
  const router = useRouter();

  const overideUI: TLUiOverrides = {
    menu(_editor, menu) {
      const newMenuItem = menuItem({
        id: 'back-to-files',
        title: 'Back to all workspace',
        // @ts-expect-error
        label: 'Back to all workspace',
        readonlyOk: false,
        onSelect() {
          router.push('/files');
        },
      });
      menu.unshift(newMenuItem);
      return menu;
    },
  };

  const store = useYjsStore({
    roomId: 'example17',
    hostUrl: 'ws://localhost:1234',
    onUpdate: _.debounce((store) => {
      console.log(JSON.stringify(store.getSnapshot()));
    }, 3000),
  });

  return <Tldraw overrides={overideUI} autoFocus store={store} />;
}

const NameEditor = track(() => {
  const editor = useEditor();

  const { color, name } = editor.user;

  return (
    <div style={{ pointerEvents: 'all', display: 'flex' }}>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            color: e.currentTarget.value,
          });
        }}
      />
      <input
        value={name}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            name: e.currentTarget.value,
          });
        }}
      />
    </div>
  );
});
