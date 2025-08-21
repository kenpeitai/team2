export type FieldErrors = Record<string, string>;
export type RuleFn = (value: any, allValues?: Record<string, any>) => string | null;

export function isNonEmpty(value: string | undefined | null): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateRequired(value: string | undefined | null, message = '必須です'): string | null {
  return isNonEmpty(value) ? null : message;
}

export function validateMinLength(value: string | undefined | null, min: number, message?: string): string | null {
  if (!isNonEmpty(value)) return null;
  return (value as string).length >= min ? null : (message ?? `${min}文字以上で入力してください`);
}

export function validateEmail(value: string | undefined | null, message = 'メールアドレスの形式が正しくありません'): string | null {
  if (!isNonEmpty(value)) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string) ? null : message;
}

export function validatePhone(value: string | undefined | null, message = '電話番号の形式が正しくありません'): string | null {
  if (!isNonEmpty(value)) return null;
  return /^\d[\d-]*$/.test(value as string) ? null : message;
}

export function collectErrors(rules: Array<{ key: string; error: string | null }>): FieldErrors {
  const errs: FieldErrors = {};
  for (const { key, error } of rules) {
    if (error) errs[key] = error;
  }
  return errs;
}

export function runValidation<T extends Record<string, any>>(
  values: T,
  schema: Record<string, RuleFn[]>
): FieldErrors {
  const errs: FieldErrors = {};
  for (const key of Object.keys(schema)) {
    const rules = schema[key] || [];
    for (const rule of rules) {
      const msg = rule((values as any)[key], values as any);
      if (msg) {
        errs[key] = msg;
        break;
      }
    }
  }
  return errs;
}

// カリー化ルール（ページ側の記述を最小化）
export const required = (message?: string): RuleFn => (v) => validateRequired(v, message);
export const minLengthN = (min: number, message?: string): RuleFn => (v) => validateMinLength(v, min, message);
export const emailFmt = (message?: string): RuleFn => (v) => validateEmail(v, message);
export const phoneFmt = (message?: string): RuleFn => (v) => validatePhone(v, message);
export const sameAs = (otherKey: string, message: string): RuleFn => (v, all) => {
  if (!all) return null;
  return v === (all as any)[otherKey] ? null : message;
};


