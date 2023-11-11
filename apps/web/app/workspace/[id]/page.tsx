'use client'
import { type Editor, Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import {useState, useCallback, useEffect} from 'react'
import jsonSnapshot from './snapshot.json'

export default function Page(): JSX.Element {
  const [editor, setEditor] = useState<Editor>()
  
  const setAppToState = useCallback((editorElement: Editor) => {
    setEditor(editorElement)
  }, [])

	const [storeEvents, setStoreEvents] = useState<string[]>([])
	
	const defaultValue = [{"gridSize":10,"name":"","meta":{},"id":"document:document","typeName":"document"},{"id":"pointer:pointer","typeName":"pointer","x":256,"y":384.0000305175781,"lastActivityTimestamp":1699709190832,"meta":{}},{"meta":{},"id":"page:page","name":"Page 1","index":"a1","typeName":"page"},{"x":0,"y":0,"z":1,"meta":{},"id":"camera:page:page","typeName":"camera"},{"editingShapeId":null,"croppingShapeId":null,"selectedShapeIds":["shape:vz5kg_kh77BiAZRyhWFGP"],"hoveredShapeId":null,"erasingShapeIds":[],"hintingShapeIds":[],"focusedGroupId":null,"meta":{},"id":"instance_page_state:page:page","pageId":"page:page","typeName":"instance_page_state"},{"followingUserId":null,"opacityForNextShape":1,"stylesForNextShape":{},"brush":null,"scribble":null,"cursor":{"type":"cross","rotation":0},"isFocusMode":false,"exportBackground":true,"isDebugMode":true,"isToolLocked":false,"screenBounds":{"x":0,"y":0,"w":1035.2000732421875,"h":653.6000366210938},"zoomBrush":null,"isGridMode":false,"isPenMode":false,"chatMessage":"","isChatting":false,"highlightedUserIds":[],"canMoveCamera":true,"isFocused":true,"devicePixelRatio":1.25,"isCoarsePointer":false,"isHoveringCanvas":true,"openMenus":[],"isChangingStyle":false,"isReadonly":false,"meta":{},"id":"instance:instance","currentPageId":"page:page","typeName":"instance"},{"x":256,"y":384.0000305175781,"rotation":0,"isLocked":false,"opacity":1,"meta":{},"id":"shape:vz5kg_kh77BiAZRyhWFGP","type":"arrow","parentId":"page:page","index":"a1","props":{"dash":"draw","size":"m","fill":"none","color":"black","labelColor":"black","bend":0,"start":{"type":"point","x":0,"y":0},"end":{"type":"point","x":2,"y":0},"arrowheadStart":"none","arrowheadEnd":"arrow","text":"","font":"draw"},"typeName":"shape"}]
	const defaultVal = {
		store: {
			...defaultValue
		}
	}


	useEffect(() => {
		
		
		const logChangeEvent = (eventName: string): void => {
			setStoreEvents((events) => [eventName, ...events])
    }
    
		editor?.on('change', (change) => {
			
			if (change.source === 'user') {
				// Added
				for (const record of Object.values(change.changes.added)) {
					console.log(JSON.stringify(editor?.store.allRecords()));
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
    <div className='h-[100vh]'>
    
    {/* {JSON.stringify(editor)} */}
    <Tldraw snapshot={jsonSnapshot} onMount={setAppToState} />
    </div>
  )
}