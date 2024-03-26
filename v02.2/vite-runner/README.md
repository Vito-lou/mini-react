## 本节目标：

如何结合任务调度器，去控制任务的渲染: 如何做到每次只渲染几个节点，下次执行的时候依然从之前的位置执行？

### 解决思路：

把树结构转换成链表结构：child, sibling, parent

### 实现 performUnitOfWork

1. 常见 dom
2. 把 dom 添加到父容器内
3. 设置 dom 的 props
4. 建立关系 child sibling parent
5. 返回下一个节点

## 本节思考问题

利用 requestIdleCallback 会在浏览器空闲时执行任务，但是如果当执行到第 3 个任务时浏览器一直不空闲，不就导致一直不渲染吗？ 怎么解决？
