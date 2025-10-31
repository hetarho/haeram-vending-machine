# 기술 스택

## 프레임워크 & 라이브러리

### Next.js 15+
- App Router
- Server Components
- Server Actions (초기 데이터 로딩)

### React 19+
- 클라이언트 컴포넌트 (상태 관리)
- Hooks

### TypeScript
- 타입 안정성
- 명확한 인터페이스 정의

### xstate v5
- 상태 머신 관리
- 이벤트 기반 상태 전환
- Guard 조건 처리

```bash
pnpm add xstate
```

### Tailwind CSS
- 스타일링
- 반응형 디자인
- 버튼 상태별 스타일

## 개발 도구

### ESLint
- 코드 품질 관리

### TypeScript Compiler
- 타입 체크

## 아키텍처 패턴

### 상태 관리
**xstate 단일 머신**
- 모든 자판기 상태를 하나의 머신에서 관리
- Context로 데이터 관리
- Guard로 조건부 전환

### 데이터 페칭
**Server Actions**
- 초기 데이터만 서버에서 로드
- 이후는 클라이언트 상태로만 관리
- 새로고침 시 초기화

### 컴포넌트 패턴
**Presentational/Container 분리**
- Container: 상태 관리 및 로직
- Presentational: UI 렌더링

## 프로젝트 구조

```
studio_xid/
├── app/
│   ├── api/
│   │   └── listProducts.ts       # 서버 액션
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # 메인 페이지
├── src/
│   ├── components/               # React 컴포넌트
│   ├── machines/                 # xstate 머신
│   ├── hooks/                    # Custom hooks
│   ├── types/                    # TypeScript 타입
│   └── utils/                    # 유틸 함수
├── specs/                        # 스펙 문서
│   ├── requirement/
│   ├── design/
│   └── task/
└── package.json
```

## 의존성 목록

### 필수
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "xstate": "^5.18.0"
  }
}
```

### 개발
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "eslint": "^9.0.0"
  }
}
```

## 설치 명령

```bash
# xstate 추가 설치
pnpm add xstate

# 개발 서버 실행
pnpm dev
```

## 성능 고려사항

### 최적화 전략
- Server Components로 초기 렌더링 최적화
- xstate로 불필요한 리렌더링 방지
- Tailwind CSS로 빠른 스타일링

### 제약사항
- 브라우저 새로고침 시 상태 초기화 (의도된 동작)
- 실제 결제/서버 연동 없음 (프로토타입)

