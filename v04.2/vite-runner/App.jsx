/** @jsx CReact.createElement */
import CReact from "./core/React.js"

let count = 10;
//注意不能写成小写，jsx只会把大写字母开头的标签当作组件调用，小写字母开头的就是html标签
function Counter({ num }) {
    function handleClick() {
        console.log('click trigger')
        count++
        console.log('now count', count)
        CReact.update()
    }
    return <div>
        count: {count}
        <button onClick={handleClick}>click here</button>
    </div>
}
function CounterContainer() {
    return <Counter></Counter>
}


// const App = (
//     <div id='test'>
//         hi-mini-react
//         {/* <Counter></Counter> */}
//         <CounterContainer></CounterContainer>
//     </div>
// )
function App() {
    return (
        <div id='test'>
            hi-mini-react
            <Counter num={10}></Counter>
            {/* <Counter num={20}></Counter> */}
            {/* <CounterContainer></CounterContainer> */}
        </div>
    )
}
export default App;
