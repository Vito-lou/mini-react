import React from "./core/React.js"

function Foo() {
    const [count, setCount] = useState(10)
    function handleClick() {
        setCount((c) => c + 1)
    }
    return (
        <div>
            <h1>foo</h1>
            {count}
            <button onClick={handleClick}>click</button>
        </div>
    )
}

function App() {
    return (
        <div>
            hi-mini-react
            <Foo></Foo>
        </div>
    )
}
export default App