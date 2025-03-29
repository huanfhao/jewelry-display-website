import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const normalizedMessage = message.toLowerCase().trim()

    // 这里可以接入实际的 AI 服务
    // 目前使用简单的回复示例
    const responses = {
      '你好': '您好！我是 AI 客服助手，很高兴为您服务。',
      'hello': '您好！我是 AI 客服助手，很高兴为您服务。',
      'hi': '您好！我是 AI 客服助手，很高兴为您服务。',
      '价格': '我们的产品价格根据具体型号和规格有所不同，您可以访问我们的商城页面查看详细价格信息。',
      '多少钱': '我们的产品价格根据具体型号和规格有所不同，您可以访问我们的商城页面查看详细价格信息。',
      '报价': '我们的产品价格根据具体型号和规格有所不同，您可以访问我们的商城页面查看详细价格信息。',
      '联系': '您可以通过以下方式联系我们：\n1. 电话：+86 153 9578 7004\n2. 邮箱：SYJewelryDisplay@outlook.com',
      '电话': '您可以拨打我们的客服热线：+86 153 9578 7004',
      '邮箱': '您可以发送邮件至：SYJewelryDisplay@outlook.com',
      '发货': '我们通常在确认订单后 2-3 个工作日内发货，具体到货时间取决于您的收货地址。',
      '物流': '我们通常在确认订单后 2-3 个工作日内发货，具体到货时间取决于您的收货地址。',
      '快递': '我们通常在确认订单后 2-3 个工作日内发货，具体到货时间取决于您的收货地址。',
      '定制': '我们提供专业的珠宝展示架定制服务，您可以提供您的具体需求，我们的设计师会为您量身定制。',
      '订制': '我们提供专业的珠宝展示架定制服务，您可以提供您的具体需求，我们的设计师会为您量身定制。',
      '客制': '我们提供专业的珠宝展示架定制服务，您可以提供您的具体需求，我们的设计师会为您量身定制。',
      '材质': '我们主要使用亚克力、木材、金属等优质材料，可以根据您的需求选择合适的材质。',
      '尺寸': '我们可以根据您的具体需求定制各种尺寸的展示架，请告诉我您需要的具体尺寸。',
      '样品': '我们可以提供样品展示，您可以通过邮件或电话与我们联系获取更多信息。',
      '批发': '我们提供批发服务，数量越多优惠越大，具体价格请联系我们的销售团队。',
      '优惠': '我们定期会推出优惠活动，建议您关注我们的官网或联系客服了解最新优惠信息。',
      '售后': '我们提供完善的售后服务，如果您在使用过程中遇到任何问题，都可以随时联系我们。',
      '产品': '我们提供各种珠宝展示架产品，包括：\n1. 戒指展示架\n2. 项链展示架\n3. 手镯展示架\n4. 耳环展示架\n5. 手表展示架',
      '展示架': '我们提供各种珠宝展示架产品，包括：\n1. 戒指展示架\n2. 项链展示架\n3. 手镯展示架\n4. 耳环展示架\n5. 手表展示架',
      '质量': '我们的产品采用优质材料制作，经过严格的质量控制，确保每件产品都符合国际标准。',
      '保修': '我们为所有产品提供一年保修服务，如有质量问题，我们会免费维修或更换。',
      '支付': '我们支持多种支付方式，包括：\n1. 支付宝\n2. 微信支付\n3. 银行转账\n4. PayPal',
      '运费': '订单满3000元免运费，不满3000元的订单收取适当的运费，具体费用将根据收货地址计算。',
      '退换': '我们支持7天无理由退换货，但产品必须保持原样且不影响二次销售。',
      '颜色': '我们的展示架有多种颜色可选，常见的包括：透明、黑色、白色、金色、银色等。',
      '库存': '大部分产品都有现货，特殊定制款需要7-15天的生产周期。',
      '批发价': '批发价格根据订购数量会有不同优惠，建议您联系我们的销售团队获取详细报价。'
    }

    // 简单的关键词匹配
    const defaultResponse = '抱歉，我可能没有完全理解您的问题。您可以：\n1. 换个方式描述您的问题\n2. 直接拨打客服热线：+86 153 9578 7004\n3. 发送邮件至：SYJewelryDisplay@outlook.com'
    let response = defaultResponse
    let matched = false

    for (const [keyword, reply] of Object.entries(responses)) {
      if (normalizedMessage.includes(keyword.toLowerCase())) {
        response = reply
        matched = true
        break
      }
    }

    // 如果没有匹配到关键词，尝试智能推测意图
    if (!matched) {
      if (normalizedMessage.match(/多少|价格|价钱|费用/)) {
        response = responses['价格']
      } else if (normalizedMessage.match(/时间|多久|几天/)) {
        response = responses['发货']
      } else if (normalizedMessage.match(/材料|用料|做工/)) {
        response = responses['材质']
      } else if (normalizedMessage.match(/大小|规格|长|宽|高/)) {
        response = responses['尺寸']
      } else if (message.length < 5) {
        response = '请详细描述您的问题，这样我才能更好地帮助您。'
      } else if (message.includes('?') || message.includes('？')) {
        response = '这是一个好问题！为了更准确地回答，建议您直接联系我们的客服团队获取专业解答。'
      }
    }

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
} 