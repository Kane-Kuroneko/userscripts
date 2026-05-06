---
trigger: always_on
description: 代码规范
---

- 编写代码时使用Tab缩进,但在markdown等文档中的示例则使用3空格缩进
	- ESM Import以及TS types声明一律放在模块底部,重要程度依次排序:
		- 相对路径的业务ESM Import(`import { User } from '../user.ts'`)
		- 绝对路径的业务ESM Import(`import { User } from '#src/reaxels/user.ts'`)
		- node_modules包(`import _ from 'lodash'`)
		- CSS/Less模块(`import './user.css'`)
		- Types/Interfaces声明:
		  ```ts
		  type User = { name: string }

		  interface Example {
			  age: number
		  }
		  ```
- 编写代码时优先参考其他相似的代码,确保代码风格,编程范式和使用的库与原有部分保持一致;
