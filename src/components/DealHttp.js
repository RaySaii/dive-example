import dive, {fromHttp, HttpComponent} from 'divejs'
import {merge, of} from 'rxjs'
import {map, mapTo, switchMap, debounceTime, filter, distinctUntilChanged} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const DealHttp = dive({
  state: { repos: {} },
})(({ state$, eventHandle }) => {
  const fetchRepos = (q) => fromHttp(
      fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&`)
          .then(res => res.json()),
  )
  return {
    DOM: state$.pipe(
        map(state => {
          return (
              <div className={styles.git_box}>
                <div>git repository:</div>
                <input onChange={e => eventHandle.handle('change')(e.target.value)}/>
                <HttpComponent
                    status={state.repos.status}
                    loading={<div>Loading...</div>}
                    data={state.repos.data}
                    render={data => data.items.slice(0, 12).map((item, index) => (
                        <div key={index}>{item.name}</div>
                    ))}
                />
              </div>
          )
        }),
    ),
    reducer: eventHandle.event('change').pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(val => val ? fetchRepos(val) : of({})),
        map(repos => state => ({ ...state, repos })),
    ),
  }
})
export default DealHttp
