# Octo_Fragment
章鱼片段。
> 目前仍是DEMO版本，所以，欢迎大家用的开心，提出使用建议

目前支持功能：

1. 同步snippets代码到vscode，你可以把代码片段寄存在各个可以读到的地方，
然后在项目里可以快速生成模板代码。

## snippets功能

`version： 0.1`

安装插件后，在你的项目根目录中创建一个`octo.json`，虽然我很想用dwt的后缀，然后按住你的`Command + Shift + P`,输入`pull snippets` ,它会有很温馨的反馈的～

配置文件：
``` json
// octo.json的格式, 所以列个demo
{
  "url": "",  // 网址前缀
  "headers": {
    // 用于请求拉代码
    "cookie": ""
  },
  "path": [""], // 片段的path
}
```

代码片段格式：
```js
// ls_table 第一行注释用于解析prefix指令，可以理解成快捷，下面是可用的代码
console.log('....代码');
```
