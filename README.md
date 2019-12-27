### protal
* vue cli3.0创建
* 微前端入口项目
* 安装依赖
    - yarn add eslint-plugin-html -D
    - yarn add husky lint-staged @commitlint/cli @commitlint/config-conventional -D //提交校验
    - yarn add single-spa-vue -S

### 添加提交lint规则
* upd：更新某功能（不是 feat, 不是 fix）
* feat：新功能（feature）
* fix：修补bug
* docs：文档（documentation）
* style： 格式（不影响代码运行的变动）
* refactor：重构（即不是新增功能，也不是修改bug的代码变动）
* test：增加测试
* chore：构建过程或辅助工具的变动
```
* git commit -m "upd：新增发货功能" //:后面有个空格