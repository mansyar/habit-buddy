import { describe, it, expect } from 'vitest';
import { validateChildName, validateCouponTitle, validateBoltCost } from '../validation';

describe('Validation Helpers', () => {
  describe('validateChildName', () => {
    it('returns null for valid names', () => {
      expect(validateChildName('Rex')).toBeNull();
      expect(validateChildName('Buddy Buddy Buddy')).toBeNull();
    });

    it('returns error for short names', () => {
      expect(validateChildName('A')).toBe('Name must be between 2 and 20 characters');
      expect(validateChildName(' ')).toBe('Name must be between 2 and 20 characters');
    });

    it('returns error for long names', () => {
      expect(validateChildName('A very long name that exceeds twenty chars')).toBe(
        'Name must be between 2 and 20 characters',
      );
    });
  });

  describe('validateCouponTitle', () => {
    it('returns null for valid titles', () => {
      expect(validateCouponTitle('Ice Cream')).toBeNull();
    });

    it('returns error for short titles', () => {
      expect(validateCouponTitle('A')).toBe('Title must be between 2 and 20 characters');
    });

    it('returns error for long titles', () => {
      expect(validateCouponTitle('This is a really long coupon title that should fail')).toBe(
        'Title must be between 2 and 20 characters',
      );
    });
  });

  describe('validateBoltCost', () => {
    it('returns null for valid costs', () => {
      expect(validateBoltCost(1)).toBeNull();
      expect(validateBoltCost('50')).toBeNull();
      expect(validateBoltCost(200)).toBeNull();
    });

    it('returns error for invalid costs', () => {
      expect(validateBoltCost(0)).toBe('Bolt cost must be between 1 and 200');
      expect(validateBoltCost(-5)).toBe('Bolt cost must be between 1 and 200');
      expect(validateBoltCost(250)).toBe('Bolt cost must be between 1 and 200');
      expect(validateBoltCost('abc')).toBe('Bolt cost must be between 1 and 200');
    });
  });
});
