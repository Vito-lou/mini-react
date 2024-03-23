/** @jsxRuntime classic */
/** @jsx CReact.createElement */
import CReact from "./core/React.js"

const AppOne = function () {
    return <div id='testid'>hahahaha</div>
}
console.log(AppOne)
const App = <div>hi-mini-react</div>

export default App;
//疑问： 编译器会根据当前jsx文件后缀判断当前是jsx语法，那么是怎么知道把<div id='testid'>hahahaha</div>
//自动转译成React.createElement的呢？ 转换过程是怎样的呢？
//render 当dom树很庞大的时候，会卡顿，原因是什么？
//收获： vite在编译jsx的时候默认会使用React.createElement语法，并从上下文中去寻找React变量及函数。如果想要修改react名称，比如叫CReact
//那么需要在jsx文件顶部设置注释修改解析规则，比如叫 /**@jsx CReact.createElement*/ 这个术语叫做js pragma 
//https://www.gatsbyjs.com/blog/2019-08-02-what-is-jsx-pragma/