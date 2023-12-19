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
  TLGeoShape,
  createShapeId,
} from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useYjsStore } from './useYjs';
import _ from 'underscore';
import { mutateUpdateFile } from '@/services/file.service';
import { formatResponse, snapshot } from './snapshot';
import { useDispatch, useSelector } from 'react-redux';
import { setEditor } from '@/store/file.store';
import { RootState } from '@/store/index.store';

export default function Whiteboard({ roomId, defaultValue, isReadOnly }) {
  const router = useRouter();
  const [updateFile] = mutateUpdateFile();

  // const [editorTL, setEditorTL] = useState<Editor | null>(null);
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

  const store = useYjsStore({
    roomId: roomId,
    hostUrl: 'ws://localhost:1234',
    defaultWhiteboard: defaultValue,
    onUpdate: _.debounce((store: TLStore) => {
      console.log(JSON.stringify(store.getSnapshot()));

      // updateFile({
      //   variables: {
      //     input: {
      //       id: roomId,
      //       whiteboard: JSON.stringify(store.getSnapshot()),
      //     },
      //   },
      // });
    }, 3000),
  });

  const handleEvent = (name, data) => {
    console.log(name, data);
  };

  // useEffect(() => {
  //   formatResponse();
  // }, []);

  // const c = useMemo(() => formatResponse(editorTL), []);

  // useEffect(() => {
  //   console.log('c', editorTL);
  // }, [editorTL]);

  const handleMount = (editor: Editor) => {
    // setEditorTL(editor);
    dispatch(setEditor(editor));

    if (editorTL) {
      editorTL.zoomToFit();
    }
  };

  return (
    <>
      {/* <NameEditor></NameEditor> */}
      <Tldraw
        // acceptedImageMimeTypes={['null']}
        // acceptedVideoMimeTypes={['null']}
        // maxAssetSize={100}
        hideUi={isReadOnly}
        overrides={overideUI}
        // autoFocus
        onMount={(editor) => {
          handleMount(editor);
        }}
        // snapshot={c}
        store={store}
        // onUiEvent={handleEvent}
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
