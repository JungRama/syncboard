'use-client';

import {
  Editor,
  TLStore,
  TLUiOverrides,
  Tldraw,
  menuItem,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useRouter } from 'next/navigation';

import { mutateUpdateFile } from '@/services/file.service';
import { setEditor } from '@/store/file.store';
import { RootState } from '@/store/index.store';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'underscore';
import { useYjsStore } from './useYjs';

export default function Whiteboard({
  roomId,
  defaultValue,
  isReadOnly,
  useRealtime = true,
}) {
  const router = useRouter();
  const [updateFile] = mutateUpdateFile();

  const editorTL = useSelector((state: RootState) => state.file.editor);

  const dispatch = useDispatch();

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

  let store;
  if (useRealtime) {
    store = useYjsStore({
      roomId: roomId,
      hostUrl: process.env.NEXT_PUBLIC_WS_URL,
      defaultWhiteboard: defaultValue,
      onUpdate: _.debounce((store: TLStore) => {
        // Do something
      }, 3000),
    });
  }

  const handleMount = (editor: Editor) => {
    dispatch(setEditor(editor));

    if (editorTL) {
      if (isReadOnly) {
        editorTL.updateInstanceState({ isReadonly: true });
      }
      editorTL.zoomToFit();
    }
  };

  return (
    <>
      <Tldraw
        overrides={overideUI}
        onMount={(editor) => {
          handleMount(editor);
        }}
        store={store}
        persistenceKey={!store ? 'whiteboard' : undefined}
      ></Tldraw>
    </>
  );
}
