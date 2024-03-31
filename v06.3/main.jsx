import React from "./core/React.js"
import ReactDom from "./core/ReactDom.js"
import App from './App.jsx'

//注意这个文件名main.js一定需要是jsx，不能是js;
//而且一旦改成jsx， 就意味着将来会被babel默认采用pragma方式，默认使用React.createElement去解析，因此头部必须有引入React.
//babel会把const app = <div>hi-mini-react</div> 解析成const app = CReact.createElement("div", null, "hi-mini-react");
ReactDom.createRoot(document.querySelector('#app')).render(<App></App>)