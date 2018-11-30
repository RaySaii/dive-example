import dive from 'divejs'
import {map, mapTo, switchMap, takeUntil} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'
import {fromEvent, merge} from 'rxjs'

export default dive({
  state: { prevX: 0, prevY: 0 },
})(({ state$, eventHandle }) => {
  const drag$ = eventHandle.event('down').pipe(
      switchMap(e => {
        const downX = e.clientX
        const downY = e.clientY
        return fromEvent(window, 'mousemove').pipe(
            map(moveEvent => [moveEvent.clientX - downX, moveEvent.clientY - downY]),
            takeUntil(fromEvent(window, 'mouseup')),
        )
      }),
  ).pipe(
      map(([moveX, moveY]) => state => ({ ...state, x: moveX + state.prevX, y: moveY + state.prevY })),
  )
  const prev$ = fromEvent(window, 'mouseup').pipe(
      mapTo(state => ({ ...state, prevX: state.x||0, prevY: state.y||0 })),
  )
  state$.update(merge(drag$, prev$))
  const mouseDown = eventHandle.handle('down')
  return state$.pipe(
      map((state) => {
        const { x, y }=state
        return (
            <div className={styles.drag_panel}>
              <div className={styles.drag_box} onClick={() => console.log('drag')} onMouseDown={mouseDown}
                   style={{ left: x, top: y }}>
                drag me
              </div>
            </div>
        )
      }),
  )
})
