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
	
	const defaultValue = {
   "store":{
      "document:document":{
         "gridSize":10,
         "name":"",
         "meta":{
            
         },
         "id":"document:document",
         "typeName":"document"
      },
      "page:page":{
         "meta":{
            
         },
         "id":"page:page",
         "name":"Page 1",
         "index":"a1",
         "typeName":"page"
      },
      "shape:YpkCnpjDq2b5hmKOeafIR":{
         "x":357.8947448730469,
         "y":374.73687744140625,
         "rotation":0,
         "isLocked":false,
         "opacity":1,
         "meta":{
            
         },
         "id":"shape:YpkCnpjDq2b5hmKOeafIR",
         "type":"arrow",
         "parentId":"page:page",
         "index":"a1",
         "props":{
            "dash":"draw",
            "size":"m",
            "fill":"none",
            "color":"black",
            "labelColor":"black",
            "bend":0,
            "start":{
               "type":"point",
               "x":0,
               "y":0
            },
            "end":{
               "type":"point",
               "x":2,
               "y":0
            },
            "arrowheadStart":"none",
            "arrowheadEnd":"arrow",
            "text":"",
            "font":"draw"
         },
         "typeName":"shape"
      }
   },
   "schema":{
      "schemaVersion":1,
      "storeVersion":4,
      "recordVersions":{
         "asset":{
            "version":1,
            "subTypeKey":"type",
            "subTypeVersions":{
               "image":2,
               "video":2,
               "bookmark":0
            }
         },
         "camera":{
            "version":1
         },
         "document":{
            "version":2
         },
         "instance":{
            "version":21
         },
         "instance_page_state":{
            "version":5
         },
         "page":{
            "version":1
         },
         "shape":{
            "version":3,
            "subTypeKey":"type",
            "subTypeVersions":{
               "group":0,
               "text":1,
               "bookmark":1,
               "draw":1,
               "geo":7,
               "note":4,
               "line":1,
               "frame":0,
               "arrow":1,
               "highlight":0,
               "embed":4,
               "image":2,
               "video":1
            }
         },
         "instance_presence":{
            "version":5
         },
         "pointer":{
            "version":1
         }
      }
   }
}
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
	
	const getSnap = () => {
		console.log(JSON.stringify(editor?.store.getSnapshot()));
	}

  return (
		<div className='h-[100vh]'>
			<div>
				asdad
				<button onClick={getSnap}>get snap</button>
			</div>
    
			{/* {JSON.stringify(editor)} */}
			{/* snapshot={jsonSnapshot} */}
    <Tldraw snapshot={jsonSnapshot}  onMount={setAppToState} />
    </div>
  )
}