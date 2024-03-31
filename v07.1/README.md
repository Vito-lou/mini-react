## 目标：实现批量执行 action, 并且 useState 的 action 支持不传函数形式进来

### 目标

react 中如果使用 useState 的时候，连续多次 setCount； react 不会每次都触发更新，而是会收集起来，最后一次性提交
