## 目标：优化更新，较少不必要的计算

### 问题

更新子组件的时候，其他不相关的组件也会重新执行，造成了浪费

核心思路是： 只更新当前组件的整颗树

难点是：如何去找到开始点和结束点
看当前项目的如何避免计算浪费.jpg 这张图

## 思考

可以看到 react 是做到了组件内部更新，不影响别的组件更新；
那么也就意味着，我们在使用的时候，如果需要涉及到更新的，应该单独抽离成一个小组件，这样将来更新，范围是可以做到局部收拢，影响面最小，性能好；
所以，写 react 一定要拆组件，一定要拆细；
