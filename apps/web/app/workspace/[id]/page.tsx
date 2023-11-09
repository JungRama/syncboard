'use client'
import { type Editor, Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import {useState, useCallback, useEffect} from 'react'

export default function Page() {
  const [editor, setEditor] = useState<Editor>()
  
  const setAppToState = useCallback((editor: Editor) => {
    setEditor(editor)
  }, [])

  const [storeEvents, setStoreEvents] = useState<string[]>([])

  useEffect(() => {

      function logChangeEvent(eventName: string) {
			setStoreEvents((events) => [eventName, ...events])
    }
    
    editor?.on('change', (change) => {
      		if (change.source === 'user') {
				// Added
				for (const record of Object.values(change.changes.added)) {
					if (record.typeName === 'shape') {
						logChangeEvent(`created shape (${record.type})`)
					}
				}

				// Updated
				for (const [from, to] of Object.values(change.changes.updated)) {
					if (
						from.typeName === 'instance' &&
						to.typeName === 'instance' &&
						from.currentPageId !== to.currentPageId
					) {
						logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`)
					}
				}

				// Removed
				for (const record of Object.values(change.changes.removed)) {
					if (record.typeName === 'shape') {
						logChangeEvent(`deleted shape (${record.type})`)
					}
				}
			}
    })
  }, [editor])

  return (
    <>
    
    {storeEvents}
    <Tldraw onMount={setAppToState} />
    </>
  )
}