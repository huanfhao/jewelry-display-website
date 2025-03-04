// 不良词汇列表（可以根据需要扩展）
const INAPPROPRIATE_WORDS = [
  'fuck', 'shit', 'damn', 'bitch',
  '傻逼', '狗屎', '混蛋', '白痴',
  // 可以继续添加其他不良词汇
];

// 垃圾评论特征
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|porn|xxx)\b/i,
  /(http|https|www\.)\S+/i,  // 链接
  /\$\d+/,  // 金额
];

interface ModerationResult {
  isValid: boolean;
  reason?: string;
}

export function moderateComment(content: string): ModerationResult {
  // 检查长度
  if (content.length < 2) {
    return {
      isValid: false,
      reason: 'Comment is too short'
    };
  }

  if (content.length > 1000) {
    return {
      isValid: false,
      reason: 'Comment is too long (max 1000 characters)'
    };
  }

  // 检查不良词汇
  const hasInappropriateWords = INAPPROPRIATE_WORDS.some(word => 
    content.toLowerCase().includes(word.toLowerCase())
  );
  if (hasInappropriateWords) {
    return {
      isValid: false,
      reason: 'Comment contains inappropriate language'
    };
  }

  // 检查垃圾信息特征
  const hasSpamPatterns = SPAM_PATTERNS.some(pattern => pattern.test(content));
  if (hasSpamPatterns) {
    return {
      isValid: false,
      reason: 'Comment appears to be spam'
    };
  }

  // 检查重复字符
  const repeatedCharsPattern = /(.)\1{4,}/;
  if (repeatedCharsPattern.test(content)) {
    return {
      isValid: false,
      reason: 'Comment contains too many repeated characters'
    };
  }

  // 检查全大写
  if (content === content.toUpperCase() && content.length > 10) {
    return {
      isValid: false,
      reason: 'Please do not use all capital letters'
    };
  }

  return { isValid: true };
} 