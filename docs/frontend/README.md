# 前端开发文档

## 概述
本文档详细说明了前端项目的架构设计、开发规范和技术实现。

## 技术栈
- 框架：React + Next.js
- 样式：Tailwind CSS
- 状态管理：Zustand
- UI组件：Shadcn UI
- 类型检查：TypeScript
- 包管理器：pnpm

## 项目结构
```
src/
├── app/              # Next.js 13+ App Router
├── components/       # 可复用组件
├── hooks/           # 自定义Hooks
├── lib/             # 工具函数
├── store/           # 状态管理
└── types/           # TypeScript类型定义
```

## 开发规范

### 组件开发规范
```typescript
// 组件示例
import { FC } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {label}
    </button>
  );
};
```

### 状态管理
```typescript
// Zustand store示例
import create from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## 路由设计
- `/` - 首页
- `/products` - 产品列表
- `/products/[id]` - 产品详情
- `/cart` - 购物车
- `/account` - 用户中心

## 组件库
详见 [组件文档](./components.md)

## 性能优化
- 图片优化
- 代码分割
- 缓存策略
- SSR/SSG

## 开发流程
1. 分支开发
2. 代码审查
3. 测试
4. 部署

## 调试指南
```bash
# 开发环境
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 更新日志
- 2024-01-03: 初始化前端文档 