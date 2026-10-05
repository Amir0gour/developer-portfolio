type RateLimitConfig = {
  max: number;
  windowMs: number;
};

const store = new Map<string, { count: number; resetTime: number }>();

export const RATE_LIMITS = {
  login: { max: 5, windowMs: 15 * 60 * 1000 },
  contact: { max: 3, windowMs: 60 * 60 * 1000 },
  api: { max: 60, windowMs: 60 * 1000 },
  upload: { max: 20, windowMs: 60 * 1000 },
};

export function checkRateLimit(key: string, config: RateLimitConfig) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1 };
  }

  if (record.count >= config.max) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  store.set(key, record);
  return { allowed: true, remaining: config.max - record.count };
}

export function getRateLimitKey(identifier: string, action: string) {
  return `${action}:${identifier}`;
}
