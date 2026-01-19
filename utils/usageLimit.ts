
export const AI_DAILY_LIMIT = 2;

export const getAIUsage = () => {
  const today = new Date().toDateString();
  const storedData = localStorage.getItem('halabi_ai_usage');
  
  if (!storedData) return { date: today, count: 0 };
  
  const parsed = JSON.parse(storedData);
  if (parsed.date !== today) {
    return { date: today, count: 0 };
  }
  
  return parsed;
};

export const incrementAIUsage = () => {
  const usage = getAIUsage();
  usage.count += 1;
  localStorage.setItem('halabi_ai_usage', JSON.stringify(usage));
};

export const canUseAI = () => {
  const usage = getAIUsage();
  return usage.count < AI_DAILY_LIMIT;
};

export const getRemainingUses = () => {
  const usage = getAIUsage();
  return Math.max(0, AI_DAILY_LIMIT - usage.count);
};
