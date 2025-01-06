# API 文档

## 概述
本文档详细说明了项目中所有API接口的使用方法、参数说明和返回值格式。

## API 版本控制
- 当前版本：v1
- 基础URL：`/api/v1`

## 认证
所有API请求需要在header中包含认证token：
```
Authorization: Bearer <your-token>
```

## 错误处理
所有API错误返回统一格式：
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## API 列表
### 用户相关
- [用户认证](./auth.md)
- [用户管理](./users.md)

### 业务相关
- [产品管理](./products.md)
- [订单管理](./orders.md)
- [支付接口](./payment.md)

## 使用示例
```javascript
// 获取产品列表示例
const response = await fetch('/api/v1/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

## 更新日志
- 2024-01-03: 初始化API文档 