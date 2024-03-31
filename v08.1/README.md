## 目标：实现 useEffect

useEffect 执行时机是在 React 完成对 DOM 的渲染之后，并且在浏览器的绘制之前
cleanup 在调用 useEffect 之前进行调用，当 deps 为空的时候不会调用返回的 cleanup
当 deps 的 length 为 0 的时候，cleanup 是不会执行的

注意思考 cleanup 应该如何实现

### 思考

为什么 hooks 也必须保持顺序？
是因为源码里面是通过 index 去找到之前老的 fiber 上的 hooks， 然后去对比查看 deps 有没有更新，有更新才去执行 hooks 的 callBack;
通过 index 去找的，所以当然顺序必须固定，不能写在条件里面
