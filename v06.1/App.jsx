import React from "./core/React.js"

let showBar = false
function Counter() {
    //注意，foo和bar的type不一样，一个是div,一个是p；
    //如果type一样就没有问题了；type不一样，导致每次点击，页面都是新创建了一个出来
    // const foo = <div id='foo-id'>foo</div>
    function Foo() {
        return <div id='foo-id'>foo</div>
    }
    const bar = <p id='bar-id'>bar</p>

    function handleShowBar() {
        showBar = !showBar
        React.update()
    }
    return (
        <div>
            Counter
            <div>{showBar ? bar : <Foo />}</div>
            <button onClick={handleShowBar}>showBar</button>
        </div>
    )
}
function App() {
    return (
        <div>
            hi-mini-react
            <Counter></Counter>
        </div>
    )
}
export default App