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

  // const [editor, setEditor] = useState<Editor>();

  // const setAppToState = useCallback((editorElement: Editor) => {
  //   setEditor(editorElement);
  // }, []);

  // const [storeEvents, setStoreEvents] = useState<string[]>([]);

  // useEffect(() => {
  //   const logChangeEvent = (eventName: string): void => {
  //     setStoreEvents((events) => [eventName, ...events]);
  //   };

  //   editor?.on('change', (change) => {
  //     if (change.source === 'user') {
  //       // Added
  //       for (const record of Object.values(change.changes.added)) {
  //         if (record.typeName === 'shape') {
  //           logChangeEvent(`created shape (${record.type})`);
  //         }
  //       }

  //       // Updated
  //       for (const [from, to] of Object.values(change.changes.updated)) {
  //         if (
  //           from.typeName === 'instance' &&
  //           to.typeName === 'instance' &&
  //           from.currentPageId !== to.currentPageId
  //         ) {
  //           logChangeEvent(
  //             `changed page (${from.currentPageId}, ${to.currentPageId})`,
  //           );
  //         }
  //       }

  //       // Removed
  //       for (const record of Object.values(change.changes.removed)) {
  //         if (record.typeName === 'shape') {
  //           logChangeEvent(`deleted shape (${record.type})`);
  //         }
  //       }
  //     }
  //   });
  // }, [editor]);

  // const getSnap = () => {
  //   console.log(JSON.stringify(editor?.store.getSnapshot()));
  // };

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
      // alert('123');
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
