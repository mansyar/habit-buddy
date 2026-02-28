export const validateChildName = (name: string): string | null => {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 20) {
    return 'Name must be between 2 and 20 characters';
  }
  return null;
};

export const validateCouponTitle = (title: string): string | null => {
  const trimmed = title.trim();
  if (trimmed.length < 2 || trimmed.length > 20) {
    return 'Title must be between 2 and 20 characters';
  }
  return null;
};

export const validateBoltCost = (cost: string | number): string | null => {
  const numericCost = typeof cost === 'string' ? parseInt(cost, 10) : cost;
  if (isNaN(numericCost) || numericCost < 1 || numericCost > 200) {
    return 'Bolt cost must be between 1 and 200';
  }
  return null;
};
