import dive, {xhrWithStatus} from 'divejs'
import {merge, of} from 'rxjs'
import {
  map,
  mapTo,
  switchMap,
  debounceTime,
  filter,
  distinctUntilChanged,
} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const DealHttp = dive({
  state: { repos: {} },
})(({ state$, eventHandle }) => {
  const fetchRepos = q => fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&`)
      .then(res => res.json())

  eventHandle.event('change').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      xhrWithStatus(val => val.length > 0 ? fetchRepos(val) : []),
  )
      .reduce(([repos, loading]) => state => {
        state.repos = repos
        state.loading = loading
      })

  return state$.pipe(
      map(state => {
        return (
            <div className={styles.git_box}>
              <div>git repository:</div>
              <input onChange={e => eventHandle.handle('change')(e.target.value)}/>
              {state.loading && <div>Loading...</div>}
              {(state.repos && state.repos.items) && state.repos.items
                  .slice(0, 12)
                  .map((item, index) => <div key={index}>{item.name}</div>)}
            </div>
        )
      }),
  )
})
export default DealHttp
