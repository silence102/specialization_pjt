/// <reference types="vite/client" />

// CSS 모듈 타입 선언
declare module '*.css';

// CSS 모듈 타입 선언 (scoped styles)
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

// SCSS 모듈 타입 선언
declare module '*.scss';

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

// 이미지 에셋들은 Vite가 자동으로 처리하므로 제거
// *.png, *.jpg, *.jpeg, *.gif, *.webp 등은 vite/client에서 자동 처리됨
