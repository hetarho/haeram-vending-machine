# Spec 문서 사용 가이드

## 개요
이 프로젝트는 **Spec Driven Development (SDD)** 방법론을 따릅니다.

## 문서 구조

```
specs/
├── requirement/    # 요구사항 정의
├── design/         # 설계 문서
└── task/           # 구현 작업 목록
```

## 사용 방법

### 1단계: Requirement (요구사항)
**목적**: 무엇을 만들지 명확히 정의

```
requirement/
├── 01-overview.md        # 전체 개요 및 대원칙
├── 02-payment.md         # 결제 요구사항
├── 03-product.md         # 음료 요구사항
├── 04-exceptions.md      # 예외 상황 요구사항
└── 05-ui.md              # UI/UX 요구사항
```

**읽는 순서**: 01 → 02 → 03 → 04 → 05

### 2단계: Design (설계)
**목적**: 요구사항을 어떻게 구현할지 설계

```
design/
├── 01-state-machine.md       # xstate 상태 머신 설계 (Mermaid)
├── 02-domain-model.md        # DDD 도메인 모델
├── 03-component-structure.md # React 컴포넌트 구조
└── 04-tech-stack.md          # 기술 스택 및 아키텍처
```

**읽는 순서**: 01 → 02 → 03 → 04

### 3단계: Task (작업)
**목적**: 실제 구현할 작업 목록

```
task/
├── README.md             # Task 개요 및 진행 순서
├── 01-setup.md           # 프로젝트 설정
├── 02-types.md           # 타입 정의
├── 03-state-machine.md   # xstate 머신 구현
├── 04-utils.md           # 유틸 함수
├── 05-server-action.md   # 서버 액션
├── 06-hooks.md           # Custom Hooks
├── 07-components.md      # 컴포넌트
├── 08-page.md            # 페이지 통합
├── 09-styling.md         # 스타일링
└── 10-testing.md         # 테스트
```

**실행 순서**: 01 → 02 → ... → 10 (순차적으로)

## 구현 프로세스

### Step 1: 요구사항 이해
1. `requirement/` 폴더의 문서를 순서대로 읽기
2. 무엇을 만들어야 하는지 명확히 이해
3. 의문사항이 있으면 요구사항 문서 수정

### Step 2: 설계 검토
1. `design/` 폴더의 문서를 순서대로 읽기
2. 어떻게 구현할지 이해
3. Mermaid 다이어그램으로 전체 흐름 파악
4. 필요시 설계 문서 수정

### Step 3: 구현
1. `task/README.md`에서 전체 작업 흐름 파악
2. Task 01번부터 순차적으로 구현
3. 각 Task 완료 후 검증
   - TypeScript 컴파일 에러 없음
   - 린트 에러 없음
   - 개발 서버 정상 실행

## 문서 작성 원칙

### Requirement
- **구현 방식에 독립적**으로 작성
- "무엇"을 만들지만 정의
- 실제 자판기의 동작을 설명

### Design
- 요구사항을 **어떻게** 구현할지 정의
- 기술 스택, 아키텍처, 구조 명시
- 다이어그램 활용

### Task
- 실제 구현할 **코드 수준**의 작업 정의
- 코드 예시 포함
- 완료 조건 명확히 명시

## 문서 업데이트

### 요구사항 변경 시
1. `requirement/` 문서 수정
2. 영향받는 `design/` 문서 수정
3. 영향받는 `task/` 문서 수정

### 설계 변경 시
1. `design/` 문서 수정
2. 영향받는 `task/` 문서 수정

## 팁

### 빠르게 시작하기
1. `requirement/01-overview.md` 읽기
2. `design/01-state-machine.md`의 Mermaid 다이어그램 보기
3. `task/README.md`에서 작업 흐름 파악
4. Task 01번부터 구현 시작

### 특정 기능만 확인하기
- 결제 관련: `requirement/02-payment.md` + `design/01-state-machine.md` (결제 상태)
- UI 관련: `requirement/05-ui.md` + `design/03-component-structure.md`
- 예외 처리: `requirement/04-exceptions.md` + `design/01-state-machine.md` (error 상태)

### 코드 구현 시
각 Task 문서에는:
- 구현할 파일 경로
- 코드 예시
- 완료 조건

이 정보를 참고하여 순차적으로 구현하세요.

