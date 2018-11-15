import React, {Component} from 'react'
import './App.css'
import WithoutLens from './components/WithoutLens'
import SimpleLens from './components/SimpleLens'
import ComplexLens1 from './components/ComplexLens1'
import ComplexLens2 from './components/ComplexLens2'

class App extends Component {
  render() {
    return (
        <div className="App">
          <WithoutLens hello={333}/>
          <SimpleLens/>
          <ComplexLens1/>
          <ComplexLens2/>
        </div>
    )
  }
}

export default App
