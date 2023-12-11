'use-client';

import {
  Editor,
  Tldraw,
  TLUiOverrides,
  findMenuItem,
  menuItem,
  track,
  useEditor,
  TLStore,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';
import { useYjsStore } from './useYjs';
import _ from 'underscore';
import { mutateUpdateFile } from '@/services/file.service';

export default function Whiteboard({ roomId, defaultValue }) {
  const router = useRouter();
  const [updateFile] = mutateUpdateFile();

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
    roomId: roomId,
    hostUrl: 'ws://localhost:1234',
    defaultWhiteboard: defaultValue,
    onUpdate: _.debounce((store: TLStore) => {
      console.log(store.getSnapshot());

      updateFile({
        variables: {
          input: {
            id: roomId,
            whiteboard: JSON.stringify(store.getSnapshot()),
          },
        },
      });
    }, 3000),
  });

  const handleEvent = (name, data) => {
    console.log(name, data);
  };

  return (
    <>
      {/* <NameEditor></NameEditor> */}
      <Tldraw
        // acceptedImageMimeTypes={['null']}
        // acceptedVideoMimeTypes={['null']}
        // maxAssetSize={100}
        overrides={overideUI}
        autoFocus
        store={store}
        onUiEvent={handleEvent}
      />
    </>
  );
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
