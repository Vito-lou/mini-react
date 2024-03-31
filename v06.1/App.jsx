import React from "./core/React.js"

let showBar = false
function Counter() {
    //注意，点删除按钮，发现foo下面的child没有被删除掉；预期是全部都删除被替换成bar
    const foo = (
        <div>
            foo
            <div> child1</div>
            <div> child2
                <div>child2 的child</div>
            </div>
        </div>
    )
    const bar = <div>bar</div>

    function handleShowBar() {
        showBar = !showBar
        React.update()
    }
    return (
        <div>
            Counter
            <div>{showBar ? bar : foo}</div>
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