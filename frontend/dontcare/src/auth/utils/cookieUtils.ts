/**
 * 쿠키 관리 유틸리티
 *
 * @description
 * - httpOnly 쿠키는 JavaScript에서 접근할 수 없으므로 서버에서 설정
 * - CSRF 토큰과 같은 보안 쿠키 관리
 * - SameSite, Secure 속성 지원
 */

/**
 * 쿠키 옵션 인터페이스
 */
interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

/**
 * 쿠키 설정 함수 (서버에서 사용)
 *
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param options 쿠키 옵션
 * @returns Set-Cookie 헤더 값
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): string {
  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = true,
    sameSite = 'strict',
    httpOnly = true,
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; Expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; Max-Age=${maxAge}`;
  }

  cookieString += `; Path=${path}`;

  if (domain) {
    cookieString += `; Domain=${domain}`;
  }

  if (secure) {
    cookieString += '; Secure';
  }

  cookieString += `; SameSite=${sameSite}`;

  if (httpOnly) {
    cookieString += '; HttpOnly';
  }

  return cookieString;
}

/**
 * CSRF 토큰을 위한 쿠키 설정
 *
 * @param csrfToken CSRF 토큰 값
 * @returns Set-Cookie 헤더 값
 */
export function setCSRFCookie(csrfToken: string): string {
  return setCookie('csrftoken', csrfToken, {
    maxAge: 60 * 60 * 24 * 7, // 7일
    secure: true,
    sameSite: 'strict',
    httpOnly: false, // CSRF 토큰은 JavaScript에서 접근 가능해야 함
  });
}

/**
 * 리프레시 토큰을 위한 httpOnly 쿠키 설정
 *
 * @param refreshToken 리프레시 토큰 값
 * @returns Set-Cookie 헤더 값
 */
export function setRefreshTokenCookie(refreshToken: string): string {
  return setCookie('refresh_token', refreshToken, {
    maxAge: 60 * 60 * 24 * 30, // 30일
    secure: true,
    sameSite: 'strict',
    httpOnly: true, // XSS 공격으로부터 보호
  });
}

/**
 * 쿠키 삭제를 위한 헤더 생성
 *
 * @param name 삭제할 쿠키 이름
 * @param options 쿠키 옵션 (도메인, 경로 등)
 * @returns Set-Cookie 헤더 값 (삭제용)
 */
export function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {},
): string {
  const { path = '/', domain } = options;

  let cookieString = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}`;

  if (domain) {
    cookieString += `; Domain=${domain}`;
  }

  return cookieString;
}

/**
 * CSRF 토큰 쿠키 삭제
 */
export function deleteCSRFCookie(): string {
  return deleteCookie('csrftoken');
}

/**
 * 리프레시 토큰 쿠키 삭제
 */
export function deleteRefreshTokenCookie(): string {
  return deleteCookie('refresh_token');
}

/**
 * 쿠키에서 CSRF 토큰 읽기 (JavaScript에서 접근 가능한 쿠키만)
 *
 * @returns CSRF 토큰 또는 null
 */
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * 쿠키가 설정되었는지 확인
 *
 * @param name 쿠키 이름
 * @returns 쿠키 존재 여부
 */
export function hasCookie(name: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${name}=`));
}

/**
 * 모든 인증 관련 쿠키 삭제
 */
export function clearAuthCookies(): string[] {
  return [deleteCSRFCookie(), deleteRefreshTokenCookie()];
}

/**
 * 보안 쿠키 설정을 위한 기본 옵션
 */
export const SECURE_COOKIE_OPTIONS: CookieOptions = {
  secure: true,
  sameSite: 'strict',
  httpOnly: true,
  path: '/',
};

/**
 * CSRF 토큰 쿠키 설정을 위한 옵션
 */
export const CSRF_COOKIE_OPTIONS: CookieOptions = {
  secure: true,
  sameSite: 'strict',
  httpOnly: false, // JavaScript에서 접근 가능해야 함
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7일
};
