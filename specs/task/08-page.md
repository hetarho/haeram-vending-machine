# Task 8: 페이지 통합

## 목표
메인 페이지에 자판기 컴포넌트 통합

## 작업 파일
`app/page.tsx`

## 작업 내용

### 8.1 page.tsx 수정
```typescript
import { listProducts } from './api/listProducts';
import { VendingMachineContainer } from '@/components/VendingMachineContainer';

export default async function Home() {
  const initialData = await listProducts();

  return (
    <main className="min-h-screen p-8">
      <VendingMachineContainer initialData={initialData} />
    </main>
  );
}
```

### 8.2 layout.tsx 확인
- 기본 레이아웃 유지
- Tailwind CSS 적용 확인

## 완료 조건
- 페이지 렌더링 성공
- 서버 컴포넌트 → 클라이언트 컴포넌트 데이터 전달 확인
- 빌드 에러 없음
- 개발 서버 실행 성공

