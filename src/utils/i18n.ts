const translations = {
  en: {
    chat: {
      title: "Online Support",
      welcome: "Welcome! How can I help you today?",
      inputPlaceholder: "Type your message...",
      send: "Send message",
      openChat: "Open chat",
      closeChat: "Close chat",
      messageInput: "Message input"
    }
  },
  zh: {
    chat: {
      title: "在线客服",
      welcome: "您好！请问有什么可以帮您？",
      inputPlaceholder: "输入您的问题...",
      send: "发送消息",
      openChat: "打开聊天",
      closeChat: "关闭聊天",
      messageInput: "消息输入"
    }
  }
}

export function useTranslation(locale: string = 'en') {
  const t = (key: string) => {
    const keys = key.split('.')
    let current: any = translations[locale as keyof typeof translations]
    
    for (const k of keys) {
      if (current[k] === undefined) {
        return key
      }
      current = current[k]
    }
    
    return current
  }

  return { t }
} 