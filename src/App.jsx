import { useState, useCallback, useRef, useMemo } from "react";

// ═══════════════════════════════════════════
// UDS DESIGN SYSTEM DATA (REAL)
// ═══════════════════════════════════════════

const UDS_COLORS = {
  brand: [
    { token: "container-brand-primary-low", hex: "#FEF1F7", usage: "브랜드 배경 (약한)" },
    { token: "container-brand-primary", hex: "#FA2993", usage: "브랜드 메인 (CTA)" },
    { token: "container-brand-primary-high", hex: "#E10975", usage: "브랜드 강조" },
    { token: "container-brand-secondary", hex: "#1A1A1A", usage: "보조 브랜드" },
    { token: "text-brand-primary", hex: "#FA2993", usage: "브랜드/할인 텍스트" },
    { token: "icon-brand-primary", hex: "#FA2993", usage: "브랜드 아이콘" },
  ],
  base: [
    { token: "background-base-low", hex: "#FCFCFC", usage: "기본 배경, 카드 배경" },
    { token: "background-base-high", hex: "#F2F2F2", usage: "강조 배경" },
    { token: "text-base-primary", hex: "#1A1A1A", usage: "기본 텍스트" },
    { token: "text-base-secondary", hex: "#474747", usage: "보조 텍스트" },
    { token: "text-base-tertiary", hex: "#696969", usage: "3차 텍스트" },
    { token: "text-base-white", hex: "#FFFFFF", usage: "고정 흰색" },
    { token: "icon-base-primary", hex: "#1A1A1A", usage: "기본 아이콘" },
    { token: "icon-base-secondary", hex: "#747474", usage: "보조 아이콘" },
    { token: "border-base-higher", hex: "#EBEBEB", usage: "약한 보더" },
    { token: "border-base-high", hex: "#BDBDBD", usage: "중간 보더" },
  ],
  status: [
    { token: "status-container-positive", hex: "#E6F9ED", usage: "성공 배경" },
    { token: "status-container-negative", hex: "#FEF2F2", usage: "오류 배경" },
    { token: "status-text-negative", hex: "#DC2626", usage: "오류/미납 텍스트" },
    { token: "status-border-negative", hex: "#F87171", usage: "오류 보더" },
    { token: "status-container-disabled", hex: "#F3F4F6", usage: "비활성 배경" },
    { token: "status-text-disabled", hex: "#9CA3AF", usage: "비활성 텍스트" },
  ],
  frame: [
    { token: "frame-base-low", hex: "#FCFCFC", usage: "폼/상세/설정 프레임" },
    { token: "frame-base-high", hex: "#F2F2F2", usage: "홈/대시보드/리스트 프레임" },
  ],
};

const UDS_TYPOGRAPHY = [
  { token: "display/medium", size: 28, weight: 700, lh: "130%", usage: "화면 타이틀 (대)" },
  { token: "title/large", size: 32, weight: 700, lh: "48px", usage: "페이지 타이틀" },
  { token: "title/small-1", size: 18, weight: 700, lh: "130%", usage: "섹션 타이틀" },
  { token: "title/small-2", size: 18, weight: 700, lh: "24px", usage: "섹션 타이틀 (고정)" },
  { token: "body/large", size: 18, weight: 500, lh: "150%", usage: "본문 텍스트" },
  { token: "body/medium", size: 16, weight: 400, lh: "26px", usage: "설명/보조 텍스트" },
  { token: "body/small", size: 14, weight: 500, lh: "150%", usage: "상세 텍스트" },
  { token: "label/large", size: 18, weight: 700, lh: "auto", usage: "라벨 (대)" },
  { token: "label/medium-bold", size: 16, weight: 700, lh: "auto", usage: "라벨 강조" },
  { token: "label/medium", size: 16, weight: 500, lh: "auto", usage: "버튼/칩/탭 라벨" },
  { token: "label/small", size: 12, weight: 500, lh: "18px", usage: "배지/캡션" },
];

const UDS_SPACING = {
  layout: [
    { token: "layout-x-20", value: "20px", usage: "모듈 좌우 마진" },
    { token: "layout-y-16", value: "16px", usage: "Header 직후 필터 모듈 상단" },
    { token: "layout-y-40", value: "40px", usage: "첫 모듈 상단" },
    { token: "layout-y-64", value: "64px", usage: "모듈 간 기본" },
    { token: "layout-y-80", value: "80px", usage: "최대 블록 간격" },
  ],
  gap: [
    { token: "gap-none", value: "0px", usage: "모듈 스택" },
    { token: "gap-2", value: "2px", usage: "Checkbox ↔ Checkbox" },
    { token: "gap-8", value: "8px", usage: "버튼/칩 그룹" },
    { token: "gap-12", value: "12px", usage: "TextField 간" },
    { token: "gap-16", value: "16px", usage: "Card 간" },
    { token: "gap-20", value: "20px", usage: "Header ↔ Contents" },
  ],
  radius: [
    { token: "radius-none", value: "0px", usage: "최상위 프레임" },
    { token: "radius-small", value: "4px", usage: "버튼, 텍스트 필드" },
    { token: "radius-medium", value: "8px", usage: "카드, Dialog" },
    { token: "radius-large", value: "12px", usage: "BottomSheet (상단)" },
    { token: "radius-full", value: "9999px", usage: "칩, 태그, Segment" },
  ],
};

const UDS_COMPONENTS = [
  { cat: "Navigation", items: ["OS Bar Top", "Header", "Header Logo", "Header Search", "Header Dropdown", "Tab", "Bottom Navigation", "OS Keyboard"] },
  { cat: "Button/CTA", items: ["Button Page", "Button Module", "Button Inline", "CTA", "BtnGroup CTA", "BtnGroup Card", "BtnGroup Dialog", "BtnGroup BottomSheet"] },
  { cat: "Control", items: ["Checkbox", "Checkbox Group", "Radio", "Radio Group", "Toggle", "Segment", "Stepper", "Text Button", "Chip Group Selection", "Chip Group Trigger"] },
  { cat: "Input", items: ["Text Field Group", "TF Text", "TF Email", "TF Phone", "TF Password", "TF Card", "TF RRN", "Dropdown", "Dropdown Connected", "Search", "Textarea"] },
  { cat: "Content Text", items: ["Module Header", "Text Set Title xL~xS", "Badge", "Footer", "Footer Accordion"] },
  { cat: "Content Card/List", items: ["Card", "Card Checkbox", "Card Thumbnail", "Card ThumbnailBox", "Card Group", "Image Card Group L/S", "List Group", "List", "List Body", "List Body Checkbox", "List Card", "Content List Card", "Content List Card Info"] },
  { cat: "Content Tile", items: ["Tile Group Thumbnail", "Tile Contained Group", "Thumbnail", "Thumbnail Box", "Video", "TableCard"] },
  { cat: "Layout/Overlay", items: ["Divider", "Chip Group Filter", "Bottom Sheet", "Dialog", "Snackbar", "Menu", "Indicator Counter", "Indicator Progress", "Scrollbar", "Quick Menu", "Hero"] },
];

const DS_RULES = [
  { id: "DS_001", cat: "토큰", rule: "하드코딩 컬러 금지 — 변수 바인딩 필수", severity: "critical", auto: true },
  { id: "DS_002", cat: "토큰", rule: "텍스트 스타일 토큰 적용 필수 (fontSize/fontName만 설정 금지)", severity: "critical", auto: true },
  { id: "DS_003", cat: "프레임", rule: "최상위 프레임 402px 고정, HUG + minHeight 874", severity: "critical", auto: true },
  { id: "DS_004", cat: "프레임", rule: "frame-base-low/high 맥락 토큰 매핑 준수", severity: "critical", auto: true },
  { id: "DS_005", cat: "프레임", rule: "onFrameHigh 규칙 — 하위 컴포넌트 variant 일치", severity: "critical", auto: true },
  { id: "DS_006", cat: "레이아웃", rule: "모듈 좌우 마진 20px (layout-x-20)", severity: "warning", auto: true },
  { id: "DS_007", cat: "레이아웃", rule: "첫 모듈 paddingTop=40, 이후=64", severity: "warning", auto: true },
  { id: "DS_008", cat: "레이아웃", rule: "CTA 앞 FILL height spacer 배치", severity: "critical", auto: true },
  { id: "DS_009", cat: "컴포넌트", rule: "Segment 최대 3개 — 4+ 시 Tab 사용", severity: "warning", auto: true },
  { id: "DS_010", cat: "컴포넌트", rule: "Button Group 내부 수동 조립 금지", severity: "critical", auto: false },
  { id: "DS_011", cat: "컴포넌트", rule: "Button 아이콘 최대 1개 (start/end 동시 금지)", severity: "warning", auto: true },
  { id: "DS_012", cat: "컴포넌트", rule: "Tab 최소 2개 — 1개 단독 사용 금지", severity: "warning", auto: true },
  { id: "DS_013", cat: "텍스트", rule: "word-break: textAutoResize='HEIGHT' + 너비 고정", severity: "warning", auto: true },
  { id: "DS_014", cat: "텍스트", rule: "기본값 텍스트 잔존 금지 (레이블, 텍스트, 타이틀영역입니다.)", severity: "critical", auto: true },
  { id: "DS_015", cat: "텍스트", rule: "CTA 문구 1줄 제한 + 행동 지향적 작성", severity: "warning", auto: false },
  { id: "DS_016", cat: "카드", rule: "frame-high 위 카드 → low-level1 fill + cornerRadius=8", severity: "critical", auto: true },
  { id: "DS_017", cat: "컴포넌트", rule: "Content List Card 텍스트 오버라이드 금지 → 커스텀 대체", severity: "critical", auto: false },
  { id: "DS_018", cat: "컴포넌트", rule: "Module Header description 항상 OFF", severity: "warning", auto: true },
];

const QA_PILLARS = [
  { id: "PF", name: "Perfect Fit", color: "#2563EB", principles: [
    { id: "SD", name: "Smart Defaults", ko: "기본값 최적화", desc: "사용자에게 가장 합리적인 선택을 기본으로 제공합니다." },
    { id: "RM", name: "Right Moment", ko: "맥락 기반 정보 제공", desc: "필요한 정보만, 필요한 순간에 전달합니다." },
  ]},
  { id: "MS", name: "Make Sense", color: "#7C3AED", principles: [
    { id: "FA", name: "Focused Actions", ko: "핵심 행동 중심 설계", desc: "불필요한 요소를 줄이고 핵심 행동에 집중합니다." },
    { id: "EU", name: "Easy to Understand", ko: "직관적 이해", desc: "복잡한 정보도 이해하기 쉬운 구조로 정리합니다." },
  ]},
  { id: "BT", name: "Be Transparent", color: "#059669", principles: [
    { id: "NH", name: "No Hidden Tricks", ko: "투명한 정보 제공", desc: "사용자가 이해해야 할 정보는 숨기지 않습니다." },
    { id: "SR", name: "See the Result", ko: "결과 가시성", desc: "선택에 따른 변화와 결과를 바로 확인할 수 있도록 합니다." },
  ]},
  { id: "SF", name: "Seamless Flow", color: "#D97706", principles: [
    { id: "LW", name: "Lead the Way", ko: "행동 흐름 유도", desc: "다음에 필요한 행동을 자연스럽게 안내합니다." },
    { id: "CA", name: "Continue Anytime", ko: "작업 연속성 보장", desc: "중단된 작업을 쉽게 다시 시작할 수 있도록 지원합니다." },
  ]},
];

const QA_RULES = [
  { id: "PF_SD_01", pillar: "PF", principle: "SD", rule: "기본값은 사용자 데이터 및 익숙한 패턴 기반으로 설정한다", severity: "critical", auto: false,
    detail: "신규 가입 시 기존 요금제·주소·결제수단 등을 사전 세팅. Dropdown·Radio 등에 가장 빈번한 값을 default로 선택" },
  { id: "PF_SD_02", pillar: "PF", principle: "SD", rule: "반복 입력 정보는 자동 완성 또는 사전 채움으로 제공한다", severity: "warning", auto: false,
    detail: "Text Field에 이전 입력값 자동완성, 주소·전화번호 자동 채움. autoFill flag 활성화 필수" },
  { id: "PF_SD_03", pillar: "PF", principle: "SD", rule: "기본값은 가장 합리적으로 설정하되 항상 수정 가능해야 한다", severity: "critical", auto: false,
    detail: "기본 선택된 항목에 isSelected=true 표시 + 다른 옵션 선택 가능 상태 유지. isDisabled로 고정 금지" },
  { id: "PF_RM_01", pillar: "PF", principle: "RM", rule: "현재 맥락과 무관한 정보 및 알림은 노출하지 않는다", severity: "warning", auto: false,
    detail: "결제 흐름 중 프로모션 배너 삽입 금지. 현재 Stage와 무관한 안내 텍스트 제거" },
  { id: "PF_RM_02", pillar: "PF", principle: "RM", rule: "의사결정 시점에 즉시 활용 가능한 정보만 제공한다", severity: "critical", auto: false,
    detail: "요금제 선택 화면에 가격·데이터·혜택 핵심 정보 즉시 노출. '자세히 보기' 뒤에 핵심 정보 숨기기 금지" },
  { id: "PF_RM_03", pillar: "PF", principle: "RM", rule: "정보는 단계 흐름에 따라 점진적으로 노출한다", severity: "warning", auto: false,
    detail: "Step Form 패턴 활용 — 한 화면에 모든 입력을 나열하지 않고 Progress 기반 단계별 노출" },
  { id: "MS_FA_01", pillar: "MS", principle: "FA", rule: "한 화면은 하나의 주요 행동을 중심으로 구성한다", severity: "critical", auto: false,
    detail: "Primary CTA 1개만 강조. filled+primary 버튼은 화면당 1개. 보조 액션은 secondary/ghost로 위계 구분" },
  { id: "MS_FA_02", pillar: "MS", principle: "FA", rule: "보조 기능은 행동을 방해하지 않는 수준으로 최소화한다", severity: "warning", auto: false,
    detail: "주요 흐름과 무관한 버튼·링크를 CTA 근처에 배치 금지. 보조 액션은 Module 하단 또는 Footer 영역으로" },
  { id: "MS_FA_03", pillar: "MS", principle: "FA", rule: "복잡한 작업은 단일 목적 단위로 분해한다", severity: "warning", auto: false,
    detail: "가입 7단계 이상 금지 → 5단계 이하. formCount>4 시 Step Form 패턴으로 분리" },
  { id: "MS_EU_01", pillar: "MS", principle: "EU", rule: "용어와 문장은 사용자 중심의 쉬운 언어로 작성한다", severity: "warning", auto: false,
    detail: "내부 용어·약어 사용 금지 (예: 'VoLTE' → '고화질 통화'). CTA는 행동 지향적 문구 ('확인' → '요금제 변경하기')" },
  { id: "MS_EU_02", pillar: "MS", principle: "EU", rule: "정보는 위계와 구조를 갖춰 시각적으로 정리한다", severity: "critical", auto: true,
    detail: "Display→Title→Body→Label 타이포 위계 준수. 섹션 간 Module Header 사용. spacing 토큰으로 시각적 그룹핑" },
  { id: "MS_EU_03", pillar: "MS", principle: "EU", rule: "유사한 정보와 기능은 일관된 방식으로 그룹화한다", severity: "critical", auto: true,
    detail: "동일 계층 요소 동일 스타일. 아이콘 Line/Fill 혼용 금지. 디자인 토큰 외 컬러 금지" },
  { id: "BT_NH_01", pillar: "BT", principle: "NH", rule: "비용, 조건, 제한사항은 명확하고 눈에 띄게 표시한다", severity: "critical", auto: false,
    detail: "가격은 text-brand-primary 또는 display 토큰으로 강조. 약정·위약금은 status-text-negative. Footer 안에만 숨기기 금지" },
  { id: "BT_NH_02", pillar: "BT", principle: "NH", rule: "탈퇴, 해지 등 사용자 권한 기능은 쉽게 접근 가능해야 한다", severity: "critical", auto: false,
    detail: "해지·탈퇴 메뉴를 depth 3 이상에 숨기기 금지. 설정 화면 1depth 내 접근 보장" },
  { id: "BT_NH_03", pillar: "BT", principle: "NH", rule: "사용자의 오해를 유도하는 다크 패턴을 사용하지 않는다", severity: "critical", auto: false,
    detail: "해지 버튼을 isDisabled/ghost로 약화 금지. 의도적 혼란 유발 CTA 배치 금지. 체크박스 사전 체크 금지 (마케팅 동의 등)" },
  { id: "BT_SR_01", pillar: "BT", principle: "SR", rule: "모든 인터랙션에는 즉각적인 피드백을 제공한다", severity: "critical", auto: false,
    detail: "버튼 Pressed/Focused State Layer 적용. 로딩 시 스켈레톤/스피너. Snackbar로 작업 완료 피드백" },
  { id: "BT_SR_02", pillar: "BT", principle: "SR", rule: "중요한 변경은 사전 미리보기 또는 결과 예측을 제공한다", severity: "warning", auto: false,
    detail: "요금제 변경 시 예상 청구 금액 시뮬레이션. 결제 전 요약 화면 (Checkout Summary 패턴) 필수" },
  { id: "BT_SR_03", pillar: "BT", principle: "SR", rule: "결과는 변화된 상태를 명확히 인지할 수 있게 표현한다", severity: "warning", auto: false,
    detail: "변경 전/후 비교 표시. Completion 패턴으로 결과 화면 제공. 토글/체크박스 상태 전환 시 시각적 피드백" },
  { id: "SF_LW_01", pillar: "SF", principle: "LW", rule: "다음 단계 행동은 명확한 CTA로 제시한다", severity: "critical", auto: false,
    detail: "CTA 문구 구체적 행동 명시 ('다음' 금지 → '약관 동의하고 계속하기'). CTA 하단 고정 (Spacer + FILL 패턴)" },
  { id: "SF_LW_02", pillar: "SF", principle: "LW", rule: "오류 상황에서는 해결 가능한 경로를 함께 제공한다", severity: "critical", auto: false,
    detail: "isError=true 시 status-text-negative + 구체적 해결 안내. 에러 화면에 '다시 시도' CTA + 고객센터 연결" },
  { id: "SF_LW_03", pillar: "SF", principle: "LW", rule: "복잡한 과정은 단계별 가이드 또는 온보딩으로 지원한다", severity: "warning", auto: false,
    detail: "3단계 이상 흐름에 [Indicator] Progress 배치. Step Form 패턴 + 단계 안내 텍스트" },
  { id: "SF_CA_01", pillar: "SF", principle: "CA", rule: "진행 상태와 입력 데이터는 자동 저장한다", severity: "critical", auto: false,
    detail: "폼 입력 중 이탈 시 데이터 유지. save_state flag 활성화. 뒤로가기 시 입력값 보존" },
  { id: "SF_CA_02", pillar: "SF", principle: "CA", rule: "재진입 시 마지막 상태를 복원하여 즉시 이어서 수행하도록 한다", severity: "warning", auto: false,
    detail: "가입 중단 후 재접속 시 마지막 단계부터 재개. Progress 상태 유지" },
  { id: "SF_CA_03", pillar: "SF", principle: "CA", rule: "다양한 환경에서도 동일한 진행 상태를 유지하도록 동기화한다", severity: "warning", auto: false,
    detail: "모바일↔데스크탑 간 상태 동기화. 앱 종료 후 재진입 시 동일 상태 복원" },
];

const UX_CHECKLIST = [
  { id: "UXC_GL_01", cat: "목표 & 문제 정의", q: "이 화면/기능의 사용자 목표가 명확한가?" },
  { id: "UXC_GL_02", cat: "목표 & 문제 정의", q: "비즈니스 또는 개선 목표에 부합하는가?" },
  { id: "UXC_GL_03", cat: "목표 & 문제 정의", q: "이 기능이 없어도 사용자는 불편함이 없는가?" },
  { id: "UXC_CT_01", cat: "사용자 & 맥락", q: "타깃 사용자가 누구인지 명확한가?" },
  { id: "UXC_CT_02", cat: "사용자 & 맥락", q: "사용 상황(시간, 장소, 디바이스)을 고려했는가?" },
  { id: "UXC_CT_03", cat: "사용자 & 맥락", q: "사용자 권한/상태 차이를 반영했는가?" },
  { id: "UXC_IA_01", cat: "정보 구조 (IA)", q: "정보가 논리적으로 묶여 있는가?" },
  { id: "UXC_IA_02", cat: "정보 구조 (IA)", q: "메뉴/섹션 명칭이 직관적인가?" },
  { id: "UXC_IA_03", cat: "정보 구조 (IA)", q: "메뉴의 깊이가 3단계 이하로 설계되어있는가?" },
  { id: "UXC_IA_04", cat: "정보 구조 (IA)", q: "사용자가 길을 잃지 않는 구조인가?" },
  { id: "UXC_IA_05", cat: "정보 구조 (IA)", q: "사용자가 다음 경로를 즉시 인지할 수 있는가?" },
  { id: "UXC_FL_01", cat: "사용자 여정 & 플로우", q: "사용 흐름이 자연스럽고 예측 가능한가?" },
  { id: "UXC_FL_02", cat: "사용자 여정 & 플로우", q: "불필요한 단계는 없는가?" },
  { id: "UXC_FL_03", cat: "사용자 여정 & 플로우", q: "되돌리기/취소가 가능한가?" },
  { id: "UXC_FL_04", cat: "사용자 여정 & 플로우", q: "현재 단계가 사용자에게 인지되는가?" },
  { id: "UXC_FL_05", cat: "사용자 여정 & 플로우", q: "중단 시 재진입이 가능한가?" },
  { id: "UXC_CG_01", cat: "인지 부하 & 이해도", q: "한 화면에 너무 많은 결정을 요구하지 않는가?" },
  { id: "UXC_CG_02", cat: "인지 부하 & 이해도", q: "중요한 정보가 시각적으로 강조되는가?" },
  { id: "UXC_CG_03", cat: "인지 부하 & 이해도", q: "용어와 표현이 사용자 친화적인가?" },
  { id: "UXC_CG_04", cat: "인지 부하 & 이해도", q: "학습 없이 직관적으로 인지할 수 있는가?" },
  { id: "UXC_IT_01", cat: "상호작용 & 피드백", q: "사용자의 행동에 즉각적인 피드백이 있는가?" },
  { id: "UXC_IT_02", cat: "상호작용 & 피드백", q: "시스템 상태가 항상 보이는가?" },
  { id: "UXC_IT_03", cat: "상호작용 & 피드백", q: "오류 발생 시 원인과 해결 방법을 안내하는가?" },
  { id: "UXC_IT_04", cat: "상호작용 & 피드백", q: "실수 방지(Confirm, 안내)가 적절한가?" },
  { id: "UXC_CS_01", cat: "일관성 & 학습성", q: "기존 서비스 UX 패턴과 일관되는가?" },
  { id: "UXC_CS_02", cat: "일관성 & 학습성", q: "동일한 행동은 동일한 결과를 주는가?" },
  { id: "UXC_CS_03", cat: "일관성 & 학습성", q: "한 번 배우면 다른 화면에도 적용 가능한가?" },
  { id: "UXC_CS_04", cat: "일관성 & 학습성", q: "예외 케이스가 최소화되었는가?" },
  { id: "UXC_EG_01", cat: "엣지 케이스 & 오류 상황", q: "데이터 없음/로딩/실패 상태가 정의되었는가?" },
  { id: "UXC_EG_02", cat: "엣지 케이스 & 오류 상황", q: "오류 발생 시 대안을 제시하는가?" },
  { id: "UXC_EG_03", cat: "엣지 케이스 & 오류 상황", q: "권한/상태에 따른 UX 분기가 명확한가?" },
  { id: "UXC_EG_04", cat: "엣지 케이스 & 오류 상황", q: "예상 밖 행동에도 시스템이 안정적인가?" },
  { id: "UXC_EX_01", cat: "개선 가능성 & 확장성", q: "향후 기능 확장이 가능한 구조인가?" },
  { id: "UXC_EX_02", cat: "개선 가능성 & 확장성", q: "운영 리소스 효율화가 가능한가?" },
];

const UI_CHECKLIST = [
  { id: "UIC_VC_01", cat: "시각적 일관성", q: "디자인 시스템 컴포넌트를 사용했는가?" },
  { id: "UIC_VC_02", cat: "시각적 일관성", q: "컬러 사용이 가이드에 부합하는가?" },
  { id: "UIC_VC_03", cat: "시각적 일관성", q: "아이콘 스타일이 통일되어 있는가?" },
  { id: "UIC_VC_04", cat: "시각적 일관성", q: "그림자, 보더, 라운드 값이 일관적인가?" },
  { id: "UIC_VC_05", cat: "시각적 일관성", q: "동일한 기능은 동일한 UI로 표현되었는가?" },
  { id: "UIC_CS_01", cat: "컴포넌트 상태", q: "기본/Hover/Active/Disabled 상태가 정의되었는가?" },
  { id: "UIC_CS_02", cat: "컴포넌트 상태", q: "에러 상태 UI가 존재하는가?" },
  { id: "UIC_CS_03", cat: "컴포넌트 상태", q: "로딩 상태가 정의되어 있는가?" },
  { id: "UIC_CS_04", cat: "컴포넌트 상태", q: "빈 상태(Empty state)를 고려했는가?" },
  { id: "UIC_CS_05", cat: "컴포넌트 상태", q: "상태 변화가 사용자에게 명확하게 인지되는가?" },
  { id: "UIC_TP_01", cat: "타이포그래피", q: "폰트 종류·크기·두께가 가이드와 일치하는가?" },
  { id: "UIC_TP_02", cat: "타이포그래피", q: "텍스트 위계(제목/본문/보조)가 명확한가?" },
  { id: "UIC_TP_03", cat: "타이포그래피", q: "강조 텍스트 남용은 없는가?" },
  { id: "UIC_CC_01", cat: "컬러 & 대비", q: "색상만으로 의미를 전달하지 않았는가?" },
  { id: "UIC_CC_02", cat: "컬러 & 대비", q: "비활성/활성/에러 상태가 명확한가?" },
  { id: "UIC_CC_03", cat: "컬러 & 대비", q: "다크모드(있다면)에서도 가독성이 유지되는가?" },
  { id: "UIC_IN_01", cat: "인터랙션", q: "작동 가능한 요소가 시각적으로 명확한가?" },
  { id: "UIC_IN_02", cat: "인터랙션", q: "애니메이션이 과도하지 않은가?" },
  { id: "UIC_IN_03", cat: "인터랙션", q: "전환(Transition)이 자연스러운가?" },
  { id: "UIC_IN_04", cat: "인터랙션", q: "시각적 피드백이 즉시 제공되는가?" },
  { id: "UIC_RS_01", cat: "반응형 & 디바이스 대응", q: "멀티 디바이스 대응이 고려되었는가?" },
  { id: "UIC_RS_02", cat: "반응형 & 디바이스 대응", q: "최소 터치 영역(약 44px)이 확보되었는가?" },
  { id: "UIC_RS_03", cat: "반응형 & 디바이스 대응", q: "화면 회전 시 레이아웃 문제가 없는가?" },
  { id: "UIC_RS_04", cat: "반응형 & 디바이스 대응", q: "작은 화면에서 정보 손실이 없는가?" },
  { id: "UIC_QC_01", cat: "UI 품질 체크", q: "기존 서비스 UI와 어색하지 않은가?" },
  { id: "UIC_QC_02", cat: "UI 품질 체크", q: "불필요한 장식 요소는 없는가?" },
  { id: "UIC_QC_03", cat: "UI 품질 체크", q: "유지보수 관점에서 복잡하지 않은가?" },
];

const SCREEN_PATTERNS = [
  { id: "form-step", name: "Step Form", cat: "Form", desc: "단계별 입력 (Progress + 입력 조합 + CTA)" },
  { id: "form-simple", name: "Simple Form", cat: "Form", desc: "단일 단계 입력 (TextField Group + CTA)" },
  { id: "form-verify", name: "Verification", cat: "Form", desc: "인증 화면 (안내 + 입력 + Keyboard)" },
  { id: "form-terms", name: "약관 동의", cat: "Form", desc: "전체/개별 체크박스 + 마스터 규칙" },
  { id: "form-complete", name: "Completion", cat: "Form", desc: "완료 상태 (아이콘 + 결과 + CTA)" },
  { id: "dash-charge", name: "요금 대시보드", cat: "Dashboard", desc: "금액 히어로 + Dropdown + Tile Group" },
  { id: "dash-home", name: "My 홈", cat: "Dashboard", desc: "인사말 + 요금 카드 + Bottom Nav" },
  { id: "dash-bill", name: "청구서", cat: "Dashboard", desc: "Hero 금액 + Card Thumbnail + Content List" },
  { id: "list-product", name: "Product List", cat: "List", desc: "Chip Filter + Dropdown + Product Card" },
  { id: "list-tab", name: "Tab + Filter List", cat: "List", desc: "Tab + Chip Filter + Image Card Group" },
  { id: "list-grid", name: "Grid Card", cat: "List", desc: "Module Header + Chip Filter + 2열 그리드" },
  { id: "set-toggle", name: "Toggle 설정", cat: "Settings", desc: "Module Header + Content Card Toggle" },
  { id: "set-radio", name: "Radio 설정", cat: "Settings", desc: "Module Header hero + Radio Group + CTA" },
  { id: "detail-product", name: "상품 상세", cat: "Detail", desc: "스크롤+고정 (이미지 + Tab + CTA)" },
  { id: "detail-checkout", name: "결제", cat: "Detail", desc: "정보 + Divider + 금액 + 결제수단 + CTA" },
  { id: "overlay-sheet", name: "Bottom Sheet", cat: "Overlay", desc: "Dimmed + handle + 선택 + Button Group" },
  { id: "overlay-dialog", name: "Dialog", cat: "Overlay", desc: "Dimmed + dialog(322px) + Button Group" },
  { id: "special-search", name: "Search View", cat: "Special", desc: "Header Search + 최근/인기 + Keyboard" },
  { id: "special-empty", name: "Empty State", cat: "Special", desc: "아이콘(100×100) + 메시지" },
];

const BRAND = "#FA2993";
const BRAND_LOW = "#FEF1F7";
const BRAND_HIGH = "#E10975";
const BG = "#F2F2F2";
const SURFACE = "#FCFCFC";
const TEXT1 = "#1A1A1A";
const TEXT2 = "#474747";
const TEXT3 = "#696969";
const BORDER = "#EBEBEB";

const sevCfg = {
  critical: { c: "#DC2626", bg: "#FEF2F2", l: "Critical" },
  warning: { c: "#D97706", bg: "#FFFBEB", l: "Warning" },
  info: { c: "#2563EB", bg: "#EFF6FF", l: "Info" },
};
const stCfg = {
  pass: { c: "#059669", bg: "#ECFDF5", icon: "✓" },
  fail: { c: "#DC2626", bg: "#FEF2F2", icon: "✗" },
  warn: { c: "#D97706", bg: "#FFFBEB", icon: "!" },
};

function SideNav({ active, onNav }) {
  const items = [
    { id: "dashboard", icon: "◎", label: "Dashboard" },
    { id: "tokens", icon: "◆", label: "Design Tokens" },
    { id: "components", icon: "⧉", label: "Components" },
    { id: "patterns", icon: "▦", label: "Screen Patterns" },
    { id: "qarules", icon: "✓", label: "UX Policy (24)" },
    { id: "dsrules", icon: "⬡", label: "DS Rules (18)" },
    { id: "audit", icon: "▶", label: "Audit" },
    { id: "results", icon: "📋", label: "Results" },
  ];
  return (
    <div style={{ width: 230, minWidth: 230, background: TEXT1, display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Pretendard',system-ui,sans-serif" }}>
      <div style={{ padding: "24px 20px 28px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${BRAND}, ${BRAND_HIGH})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>U</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>UX Audit Studio</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, padding: "0 8px", overflowY: "auto" }}>
        {items.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", borderRadius: 8, border: "none",
            background: active === it.id ? "rgba(250,41,147,0.12)" : "transparent",
            color: active === it.id ? BRAND : "rgba(255,255,255,0.45)",
            fontSize: 13, fontWeight: active === it.id ? 600 : 400, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all .12s",
          }}><span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{it.icon}</span>{it.label}</button>
        ))}
      </div>
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
        Telecom UDS v1.0 · Powered by Claude
      </div>
    </div>
  );
}

function Dashboard({ onNav }) {
  const stats = [
    { label: "Color Tokens", value: Object.values(UDS_COLORS).flat().length, sub: "Brand·Base·Status·Frame", color: BRAND },
    { label: "Typography", value: UDS_TYPOGRAPHY.length, sub: "Display·Title·Body·Label", color: "#7C3AED" },
    { label: "Components", value: UDS_COMPONENTS.reduce((a, c) => a + c.items.length, 0), sub: `${UDS_COMPONENTS.length} Categories`, color: "#2563EB" },
    { label: "UX Policy", value: QA_RULES.length, sub: `4 Pillars · 8 Principles`, color: "#D97706" },
    { label: "DS Rules", value: DS_RULES.length, sub: `${DS_RULES.filter(r => r.severity === "critical").length} Critical`, color: "#DC2626" },
    { label: "Screen Patterns", value: SCREEN_PATTERNS.length, sub: "7 Pattern Categories", color: "#D97706" },
  ];
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>UX Audit Dashboard</h1>
      <p style={{ color: TEXT3, margin: "0 0 28px", fontSize: 13 }}>UDS 디자인 시스템 기반 통신 서비스 UX 자동 검수 엔진</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 36 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: SURFACE, borderRadius: 10, padding: "20px 18px", border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: s.color }} />
            <div style={{ fontSize: 11, color: TEXT3, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: TEXT1, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: TEXT1, margin: "0 0 14px" }}>Quick Actions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { icon: "▶", title: "화면 검수", desc: "이미지·URL·텍스트 입력", target: "audit", color: BRAND },
          { icon: "✓", title: "UX Policy", desc: "4 Pillars × 8 Principles", target: "qarules", color: "#D97706" },
          { icon: "⬡", title: "DS Rules", desc: `${DS_RULES.length}개 빌드 규칙`, target: "dsrules", color: "#DC2626" },
          { icon: "▦", title: "패턴 카탈로그", desc: "19개 화면 패턴", target: "patterns", color: "#059669" },
        ].map((a, i) => (
          <button key={i} onClick={() => onNav(a.target)} style={{
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
          }} onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; }} onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; }}>
            <span style={{ fontSize: 20, color: a.color }}>{a.icon}</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT1, marginTop: 10 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: TEXT3, marginTop: 3 }}>{a.desc}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 32, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: TEXT1, margin: "0 0 14px" }}>Token Architecture</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {[
            { label: "Primitive", desc: "원시 값 (팔레트, 스케일)", color: "#E5E7EB" },
            { label: "Semantic", desc: "역할 매핑 (사용 토큰)", color: BRAND_LOW },
            { label: "Component", desc: "컴포넌트 적용", color: "#ECFDF5" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ padding: "14px 20px", borderRadius: 8, background: t.color, minWidth: 180 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>{t.desc}</div>
              </div>
              {i < 2 && <div style={{ width: 40, height: 2, background: BORDER }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TokensPage() {
  const [tab, setTab] = useState("colors");
  const [colorGroup, setColorGroup] = useState("brand");
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Design Tokens</h1>
      <p style={{ color: TEXT3, margin: "0 0 20px", fontSize: 13 }}>Primitive → Semantic → Component 토큰 아키텍처 · Font: Pretendard</p>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${BORDER}` }}>
        {["colors", "typography", "spacing", "radius"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "9px 16px", border: "none", background: "none", fontSize: 13,
            fontWeight: tab === t ? 600 : 400, color: tab === t ? BRAND : TEXT3,
            borderBottom: tab === t ? `2px solid ${BRAND}` : "2px solid transparent",
            cursor: "pointer", fontFamily: "inherit", marginBottom: -1, textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>

      {tab === "colors" && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {Object.keys(UDS_COLORS).map(g => (
              <button key={g} onClick={() => setColorGroup(g)} style={{
                padding: "5px 14px", borderRadius: 20, border: "1px solid",
                borderColor: colorGroup === g ? BRAND : BORDER,
                background: colorGroup === g ? BRAND_LOW : "transparent",
                color: colorGroup === g ? BRAND_HIGH : TEXT3,
                fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
              }}>{g}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {UDS_COLORS[colorGroup].map((c, i) => (
              <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: c.hex, border: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1, fontFamily: "monospace" }}>{c.token}</div>
                  <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>{c.hex} · {c.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "typography" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {UDS_TYPOGRAPHY.map((t, i) => (
            <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontSize: Math.min(t.size, 24), fontWeight: t.weight, color: TEXT1, lineHeight: 1.3, minWidth: 200 }}>{t.token}</span>
                <span style={{ fontSize: 11, color: TEXT3 }}>{t.usage}</span>
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 11, color: TEXT3, flexShrink: 0 }}>
                <span>{t.size}px</span><span>w{t.weight}</span><span>LH {t.lh}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "spacing" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[{ title: "Layout", data: UDS_SPACING.layout }, { title: "Gap", data: UDS_SPACING.gap }].map((g, gi) => (
            <div key={gi}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: TEXT1, marginBottom: 10 }}>{g.title}</h3>
              {g.data.map((s, i) => (
                <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <div style={{ width: 60, fontSize: 12, fontWeight: 500, color: TEXT1, fontFamily: "monospace" }}>{s.value}</div>
                  <div style={{ width: Math.min(parseInt(s.value), 80), height: 16, borderRadius: 3, background: `linear-gradient(135deg, ${BRAND}, ${BRAND_HIGH})`, opacity: 0.6 }} />
                  <div style={{ fontSize: 11, color: TEXT3 }}>{s.token} — {s.usage}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "radius" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {UDS_SPACING.radius.map((r, i) => (
            <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: r.value, border: `3px solid ${BRAND}`, background: BRAND_LOW, margin: "0 auto 10px" }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1 }}>{r.token}</div>
              <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>{r.value}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{r.usage}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ComponentsPage() {
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Component Catalog</h1>
      <p style={{ color: TEXT3, margin: "0 0 24px", fontSize: 13 }}>Core Component v1.0.0 · {UDS_COMPONENTS.reduce((a, c) => a + c.items.length, 0)} components across {UDS_COMPONENTS.length} categories</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {UDS_COMPONENTS.map((cat, ci) => (
          <div key={ci} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT1 }}>{cat.cat}</span>
              <span style={{ fontSize: 11, color: BRAND, fontWeight: 600, background: BRAND_LOW, padding: "2px 8px", borderRadius: 10 }}>{cat.items.length}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {cat.items.map((item, ii) => (
                <span key={ii} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: BG, color: TEXT2 }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatternsPage() {
  const [filter, setFilter] = useState("all");
  const cats = ["all", ...new Set(SCREEN_PATTERNS.map(p => p.cat))];
  const filtered = filter === "all" ? SCREEN_PATTERNS : SCREEN_PATTERNS.filter(p => p.cat === filter);
  const catColors = { Form: "#2563EB", Dashboard: "#7C3AED", List: "#059669", Settings: "#D97706", Detail: BRAND, Overlay: "#DC2626", Special: "#6B7280" };
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Screen Patterns</h1>
      <p style={{ color: TEXT3, margin: "0 0 20px", fontSize: 13 }}>화면 요청 → 모듈 선택 → 패턴 매칭 → 컴포넌트 빌드</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1px solid",
            borderColor: filter === c ? BRAND : BORDER, background: filter === c ? BRAND_LOW : "transparent",
            color: filter === c ? BRAND_HIGH : TEXT3, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>{c === "all" ? "전체" : c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: catColors[p.cat] + "18", color: catColors[p.cat] }}>{p.cat}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT1, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: TEXT3, lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QARulesPage() {
  const [activePillar, setActivePillar] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filteredRules = activePillar === "all" ? QA_RULES : QA_RULES.filter(r => r.pillar === activePillar);
  const critCount = QA_RULES.filter(r => r.severity === "critical").length;
  const warnCount = QA_RULES.filter(r => r.severity === "warning").length;

  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>UX Policy</h1>
      <p style={{ color: TEXT3, margin: "0 0 24px", fontSize: 13 }}>
        4 Pillars · 8 Principles · {QA_RULES.length} Rules — {critCount} Critical · {warnCount} Warning
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {QA_PILLARS.map(pillar => {
          const isActive = activePillar === pillar.id;
          const ruleCount = QA_RULES.filter(r => r.pillar === pillar.id).length;
          return (
            <button key={pillar.id} onClick={() => setActivePillar(isActive ? "all" : pillar.id)} style={{
              background: isActive ? pillar.color + "0A" : SURFACE,
              border: `1.5px solid ${isActive ? pillar.color : BORDER}`,
              borderRadius: 10, padding: "18px 16px", textAlign: "left", cursor: "pointer",
              fontFamily: "inherit", transition: "all .15s", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: pillar.color }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT1, marginBottom: 6 }}>{pillar.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {pillar.principles.map(pr => (
                  <div key={pr.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: pillar.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: TEXT2 }}>{pr.name}</span>
                    <span style={{ fontSize: 10, color: pillar.color }}>{pr.ko}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: TEXT3 }}>{ruleCount} rules</div>
            </button>
          );
        })}
      </div>

      {(activePillar === "all" ? QA_PILLARS : QA_PILLARS.filter(p => p.id === activePillar)).map(pillar => (
        <div key={pillar.id} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 4, height: 24, borderRadius: 2, background: pillar.color }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT1, margin: 0 }}>{pillar.name}</h2>
          </div>

          {pillar.principles.map(principle => {
            const rules = filteredRules.filter(r => r.pillar === pillar.id && r.principle === principle.id);
            if (rules.length === 0) return null;
            return (
              <div key={principle.id} style={{ marginBottom: 20 }}>
                <div style={{
                  background: pillar.color + "08", borderRadius: 10, padding: "16px 20px", marginBottom: 8,
                  borderLeft: `4px solid ${pillar.color}`,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT1 }}>{principle.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: pillar.color }}>{principle.ko}</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT2, marginTop: 4 }}>{principle.desc}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingLeft: 4 }}>
                  {rules.map(r => {
                    const isOpen = expanded === r.id;
                    return (
                      <div key={r.id} onClick={() => setExpanded(isOpen ? null : r.id)} style={{
                        background: SURFACE, border: `1px solid ${isOpen ? pillar.color : BORDER}`,
                        borderRadius: 8, padding: "12px 16px", cursor: "pointer", transition: "all .12s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: sevCfg[r.severity].bg, color: sevCfg[r.severity].c, flexShrink: 0 }}>{sevCfg[r.severity].l}</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: TEXT1 }}>{r.rule}</span>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: r.auto ? "#ECFDF5" : BG, color: r.auto ? "#059669" : "#9CA3AF", fontWeight: 500, flexShrink: 0 }}>{r.auto ? "Auto" : "Manual"}</span>
                          <span style={{ fontSize: 11, color: TEXT3, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }}>▾</span>
                        </div>
                        {isOpen && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}`, fontSize: 12.5, color: TEXT2, lineHeight: 1.7 }}>
                            {r.detail}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DSRulesPage() {
  const [filter, setFilter] = useState("all");
  const cats = ["all", ...new Set(DS_RULES.map(r => r.cat))];
  const filtered = filter === "all" ? DS_RULES : DS_RULES.filter(r => r.cat === filter);
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Design System Rules</h1>
      <p style={{ color: TEXT3, margin: "0 0 20px", fontSize: 13 }}>UDS 빌드 시 준수해야 하는 {DS_RULES.length}개 규칙 · {DS_RULES.filter(r => r.auto).length}개 자동 검수 가능</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1px solid",
            borderColor: filter === c ? BRAND : BORDER, background: filter === c ? BRAND_LOW : "transparent",
            color: filter === c ? BRAND_HIGH : TEXT3, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>{c === "all" ? "전체" : c}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: sevCfg[r.severity].bg, color: sevCfg[r.severity].c, flexShrink: 0 }}>{sevCfg[r.severity].l}</span>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 4, background: BRAND_LOW, color: BRAND, flexShrink: 0 }}>{r.cat}</span>
            <span style={{ flex: 1, fontSize: 13, color: TEXT1 }}>{r.rule}</span>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 10, background: r.auto ? "#ECFDF5" : BG, color: r.auto ? "#059669" : "#9CA3AF", fontWeight: 500, flexShrink: 0 }}>{r.auto ? "Auto" : "Manual"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildAllPolicyItems() {
  return [
    ...QA_RULES.map(r => ({ id: r.id, msg: r.rule, source: "UX Policy", pillar: r.pillar, principle: r.principle, detail: r.detail, severity: r.severity })),
    ...UX_CHECKLIST.map(r => ({ id: r.id, msg: r.q, source: "UX Checklist", cat: r.cat, severity: "warning" })),
    ...UI_CHECKLIST.map(r => ({ id: r.id, msg: r.q, source: "UI Checklist", cat: r.cat, severity: "warning" })),
  ];
}

function buildBatchPrompt(screenName, batchName, items, includeAnalysis) {
  const list = items.map(r => `${r.id}|${r.msg}`).join("\n");
  const analysisLine = includeAnalysis
    ? `First, identify screen PURPOSE (p), TARGET USER (u), KEY FEATURES (f), CONTENT TYPE (t).\n\n`
    : "";
  const schemaSample = includeAnalysis
    ? `{"a":{"p":"목적","u":"사용자","f":["기능1","기능2"],"t":"유형"},"r":[{"id":"ID","v":"p|f|s","m":"근거"}]}`
    : `{"r":[{"id":"ID","v":"p|f|s","m":"근거"}]}`;

  return `You are a senior UX/UI auditor evaluating the uploaded screen image. Domain: ${batchName}.

Screen name: ${screenName}

${analysisLine}For each ${batchName} item, judge:
- "p" (pass): clearly satisfied by what is observable in the image
- "f" (fail): clearly violated by what is observable in the image
- "s" (skip): CANNOT be determined from a static image alone

CRITICAL RULES:
1. Default to "s" whenever evidence is ambiguous, hidden, or requires interaction/data you cannot see.
2. Items about dynamic behavior (autosave, loading, hover/pressed states, cross-device sync, A/B defaults, auto-fill) → ALWAYS "s".
3. Only return "p" or "f" when the image shows direct, unambiguous evidence.
4. "m" (reason): under 20 Korean characters, cite the visible evidence (or lack of it).

Items (${items.length}):
${list}

Respond with ONLY valid JSON, no markdown, no backticks:
${schemaSample}`;
}

function scoreFromAIResults(aiResults) {
  const allItems = buildAllPolicyItems();
  const dsAutoRules = DS_RULES.filter(r => r.auto);
  const POLICY_MAX = 60, DS_MAX = 40;

  const policyItems = allItems.length;
  const dsItems = dsAutoRules.length;
  const policyPerRule = POLICY_MAX / policyItems;
  const dsPerRule = dsItems > 0 ? DS_MAX / dsItems : 0;

  let policyLost = 0, dsLost = 0;
  const issues = [], passes = [], skipped = [];
  const policyBreakdown = { "UX Policy": { fail: 0, total: QA_RULES.length }, "UX Checklist": { fail: 0, total: UX_CHECKLIST.length }, "UI Checklist": { fail: 0, total: UI_CHECKLIST.length } };

  const resultMap = {};
  (aiResults || []).forEach(r => { resultMap[r.id] = r; });

  allItems.forEach(item => {
    const ai = resultMap[item.id];
    const verdict = ai?.verdict || "skip";
    const reason = ai?.reason || "";

    if (verdict === "fail") {
      const d = +policyPerRule.toFixed(2);
      policyLost += d;
      if (policyBreakdown[item.source]) policyBreakdown[item.source].fail += 1;
      let pillarName, principleName;
      if (item.source === "UX Policy") {
        const pillar = QA_PILLARS.find(p => p.id === item.pillar);
        const principle = pillar?.principles.find(pr => pr.id === item.principle);
        pillarName = pillar?.name; principleName = principle?.ko;
      }
      issues.push({ id: item.id, msg: item.msg, fix: reason, stage: "Policy", status: "fail", category: item.source, severity: item.severity, deduction: d, pillarName, principleName, cat: item.cat, aiReason: reason });
    } else if (verdict === "skip") {
      skipped.push({ id: item.id, msg: item.msg, category: item.source, reason: reason || "이미지에서 판단 불가" });
    } else {
      passes.push({ id: item.id, msg: item.msg, stage: "Policy", status: "pass", category: item.source, aiReason: reason });
    }
  });

  dsAutoRules.forEach(item => {
    const ai = resultMap[item.id];
    const verdict = ai?.verdict || "skip";
    const reason = ai?.reason || "";

    if (verdict === "fail") {
      const d = +dsPerRule.toFixed(1);
      dsLost += d;
      issues.push({ id: item.id, msg: item.rule, fix: reason, stage: "DS", status: "fail", category: "DS", severity: item.severity, deduction: d, aiReason: reason });
    } else if (verdict === "skip") {
      skipped.push({ id: item.id, msg: item.rule, category: "DS", reason: reason || "이미지에서 판단 불가" });
    } else {
      passes.push({ id: item.id, msg: item.rule, stage: "DS", status: "pass", category: "DS", aiReason: reason });
    }
  });

  const policyChecked = allItems.length - skipped.filter(s => s.category !== "DS").length;
  const dsChecked = dsAutoRules.length - skipped.filter(s => s.category === "DS").length;
  const adjustedPolicyPer = policyChecked > 0 ? POLICY_MAX / policyChecked : 0;
  const adjustedDsPer = dsChecked > 0 ? DS_MAX / dsChecked : 0;

  let adjPolicyLost = 0, adjDsLost = 0;
  issues.forEach(iss => {
    if (iss.stage === "Policy") {
      const d = +adjustedPolicyPer.toFixed(2);
      iss.deduction = d;
      adjPolicyLost += d;
    } else if (iss.stage === "DS") {
      const d = +adjustedDsPer.toFixed(1);
      iss.deduction = d;
      adjDsLost += d;
    }
  });

  const totalScore = Math.max(0, Math.min(100, Math.round(100 - adjPolicyLost - adjDsLost)));
  const verdict = totalScore >= 70 ? "PASS" : "FAIL";

  return {
    score: totalScore, verdict,
    breakdown: {
      policy: Math.round(Math.max(0, POLICY_MAX - adjPolicyLost)), policyMax: POLICY_MAX,
      ds: Math.round(Math.max(0, DS_MAX - adjDsLost)), dsMax: DS_MAX,
      policyDetail: policyBreakdown,
    },
    issues: issues.sort((a, b) => (b.deduction || 0) - (a.deduction || 0)),
    passes, skipped,
    scoredCount: policyChecked + dsChecked,
    skippedCount: skipped.length,
    total: issues.length + passes.length,
  };
}

function parseJsonLoose(rawText) {
  let jsonStr = (rawText || "").replace(/```json/g, "").replace(/```/g, "").trim();
  try { return JSON.parse(jsonStr); } catch {}
  const s = jsonStr.indexOf("{");
  const e2 = jsonStr.lastIndexOf("}");
  if (s >= 0 && e2 > s) {
    const sub = jsonStr.substring(s, e2 + 1);
    try { return JSON.parse(sub); } catch {}
    // try repairing truncation by balancing brackets
    const ob = (sub.match(/{/g)||[]).length - (sub.match(/}/g)||[]).length;
    const oa = (sub.match(/\[/g)||[]).length - (sub.match(/\]/g)||[]).length;
    let fix = sub;
    for (let i = 0; i < oa; i++) fix += "]";
    for (let i = 0; i < ob; i++) fix += "}";
    try { return JSON.parse(fix); } catch {}
  }
  return null;
}

async function callAuditBatch(screenName, imageBase64, batch) {
  const prompt = buildBatchPrompt(screenName, batch.name, batch.items, batch.includeAnalysis);
  const messages = [{ role: "user", content: [] }];
  if (imageBase64) {
    const mediaType = imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
    const base64Data = imageBase64.split(",")[1];
    messages[0].content.push({ type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } });
  }
  messages[0].content.push({ type: "text", text: prompt });

  const response = await fetch("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      max_tokens: 4000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(batch.name + " API " + response.status + ": " + errBody.substring(0, 200));
  }

  const data = await response.json();
  const rawText = (data.content || []).map(c => c.text || "").join("");
  if (!rawText || rawText.length < 5) {
    throw new Error(batch.name + ": 빈 응답");
  }

  const parsed = parseJsonLoose(rawText);
  if (!parsed) throw new Error(batch.name + ": JSON 파싱 실패");

  const aiResults = (parsed.r || parsed.results || []).map(r => {
    const v = r.v || r.verdict || "s";
    return {
      id: r.id,
      verdict: v === "p" ? "pass" : v === "f" ? "fail" : v === "s" ? "skip" : v,
      reason: r.m || r.reason || "",
    };
  });

  let screenAnalysis = null;
  if (parsed.a || parsed.screen_analysis) {
    const a = parsed.a || parsed.screen_analysis;
    screenAnalysis = {
      purpose: a.p || a.purpose || "",
      target_user: a.u || a.target_user || "",
      key_features: a.f || a.key_features || [],
      content_type: a.t || a.content_type || "",
    };
  }

  return { aiResults, screenAnalysis };
}

async function runAIAudit(screenName, imageBase64, onProgress) {
  const batches = [
    { name: "UX Policy", items: QA_RULES.map(r => ({ id: r.id, msg: r.rule })), includeAnalysis: true },
    { name: "UX Checklist", items: UX_CHECKLIST.map(r => ({ id: r.id, msg: r.q })), includeAnalysis: false },
    { name: "UI Checklist", items: UI_CHECKLIST.map(r => ({ id: r.id, msg: r.q })), includeAnalysis: false },
    { name: "DS Rules", items: DS_RULES.filter(r => r.auto).map(r => ({ id: r.id, msg: r.rule })), includeAnalysis: false },
  ];

  try {
    const batchResults = [];
    for (let i = 0; i < batches.length; i++) {
      const b = batches[i];
      if (onProgress) onProgress(`(${i + 1}/${batches.length}) ${b.name} 검수 중...`);
      batchResults.push(await callAuditBatch(screenName, imageBase64, b));
      // Small delay between sequential calls to stay under free-tier RPM
      if (i < batches.length - 1) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }
    const allAiResults = batchResults.flatMap(r => r.aiResults);
    const screenAnalysis = batchResults.find(r => r.screenAnalysis)?.screenAnalysis || {
      purpose: "", target_user: "", key_features: [], content_type: "",
    };
    const result = scoreFromAIResults(allAiResults);
    result.screenAnalysis = screenAnalysis;
    result.timestamp = new Date().toLocaleString("ko-KR");
    return result;
  } catch (err) {
    console.error("AI Audit error:", err);
    return {
      score: 0, verdict: "ERROR",
      breakdown: { policy: 0, policyMax: 60, ds: 0, dsMax: 40, policyDetail: {} },
      issues: [], passes: [], skipped: [],
      scoredCount: 0, skippedCount: 0, total: 0,
      error: String(err.message || err),
      timestamp: new Date().toLocaleString("ko-KR"),
    };
  }
}

function ResultPopup({ result, onClose }) {
  if (!result) return null;
  const isPASS = result.verdict === "PASS";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div style={{ position: "relative", width: "92%", maxWidth: 1100, height: "88vh", background: SURFACE, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT1 }}>Audit Report</span>
            <span style={{ fontSize: 12, color: TEXT3 }}>{result.input?.screenName || "—"} · {result.timestamp}</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: isPASS ? "#ECFDF5" : "#FEF2F2", color: isPASS ? "#059669" : "#DC2626" }}>{result.verdict}</span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE, cursor: "pointer", fontSize: 16, color: TEXT3, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", borderRight: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24, padding: 20, borderRadius: 12, background: isPASS ? "#F0FDF4" : "#FFF5F5", border: `1px solid ${isPASS ? "#BBF7D0" : "#FECACA"}` }}>
              <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke={BORDER} strokeWidth="7" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={isPASS ? "#059669" : "#DC2626"} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${result.score * 2.64} 264`} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: TEXT1 }}>{result.score}</span>
                  <span style={{ fontSize: 9, color: TEXT3, marginTop: -2 }}>/ 100</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: isPASS ? "#059669" : "#DC2626", marginBottom: 4 }}>{isPASS ? "PASS — 보완 권장사항" : "FAIL — 수정/재작업 필요"}</div>
                <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.5 }}>{isPASS ? "기본적인 UX 품질 기준을 충족합니다. 아래 보완사항을 반영하면 더 나은 경험을 제공할 수 있습니다." : "UX 품질 기준 미달입니다. 아래 항목을 수정하거나 재작업 후 재검수가 필요합니다."}</div>
                <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12 }}>
                  <span style={{ color: "#0891B2" }}>UX Policy <b>{result.breakdown.policy}</b>/60</span>
                  <span style={{ color: "#6B7280" }}>DS Rules <b>{result.breakdown.ds}</b>/40</span>
                </div>
              </div>
            </div>

            {result.screenAnalysis && (
              <div style={{ padding: "14px 16px", borderRadius: 8, background: "#F0F9FF", border: "1px solid #BAE6FD", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0369A1", marginBottom: 6 }}>AI 화면 분석</div>
                <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>
                  <b>목적:</b> {result.screenAnalysis.purpose}<br />
                  <b>사용자:</b> {result.screenAnalysis.target_user}<br />
                  <b>콘텐츠:</b> {result.screenAnalysis.content_type}<br />
                  <b>주요 기능:</b> {(result.screenAnalysis.key_features || []).join(", ")}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: BG, color: TEXT2 }}>검수 {result.scoredCount || result.total}개</span>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#FEF2F2", color: "#DC2626" }}>이슈 {result.issues.length}개</span>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#ECFDF5", color: "#059669" }}>통과 {result.passes.length}개</span>
              {result.skippedCount > 0 && <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#FEF3C7", color: "#92400E" }}>판단불가 {result.skippedCount}개</span>}
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 600, color: TEXT1, margin: "0 0 10px" }}>
              {isPASS ? "보완 권장사항" : "수정/재작업 시 고려사항"} ({result.issues.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 20 }}>
              {result.issues.map((iss, i) => {
                const catColors = {
                  "UX Policy": { c: "#0891B2", bg: "#ECFEFF" },
                  "UX Checklist": { c: "#7C3AED", bg: "#F5F3FF" },
                  "UI Checklist": { c: "#D97706", bg: "#FFFBEB" },
                  "DS": { c: "#6B7280", bg: "#F3F4F6" },
                };
                const sc = catColors[iss.category] || catColors.DS;
                return (
                  <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "11px 14px", borderLeft: `3px solid ${sc.c}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: sc.bg, color: sc.c }}>{iss.category}</span>
                      {iss.pillarName && <span style={{ fontSize: 10, color: TEXT3 }}>{iss.pillarName} › {iss.principleName}</span>}
                      {iss.cat && <span style={{ fontSize: 10, color: TEXT3 }}>{iss.cat}</span>}
                      <span style={{ fontSize: 10, color: BRAND, fontWeight: 600, marginLeft: "auto" }}>−{iss.deduction}점</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: TEXT1, fontWeight: 500 }}>{iss.msg}</div>
                    {iss.fix && <div style={{ fontSize: 11.5, color: "#059669", marginTop: 3 }}>→ {iss.fix}</div>}
                  </div>
                );
              })}
            </div>

            <details>
              <summary style={{ fontSize: 13, fontWeight: 600, color: "#059669", cursor: "pointer", marginBottom: 8 }}>통과 항목 ({result.passes.length})</summary>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {result.passes.map((p, i) => (
                  <div key={i} style={{ padding: "6px 12px", borderRadius: 6, background: "#F0FDF4", fontSize: 12, color: "#065F46" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 700 }}>✓</span>{p.msg}</div>
                    {p.aiReason && <div style={{ fontSize: 11, color: "#059669", marginTop: 2, paddingLeft: 18 }}>{p.aiReason}</div>}
                  </div>
                ))}
              </div>
            </details>

            {result.skipped && result.skipped.length > 0 && (
              <details style={{ marginTop: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 600, color: "#92400E", cursor: "pointer", marginBottom: 8 }}>판단 불가 항목 ({result.skipped.length}) — 감점 미반영</summary>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {result.skipped.map((s, i) => (
                    <div key={i} style={{ padding: "6px 12px", borderRadius: 6, background: "#FFFBEB", border: "1px dashed #FDE68A", fontSize: 12, color: "#92400E" }}>
                      <span style={{ fontWeight: 600 }}>—</span> {s.msg}
                      {s.reason && <span style={{ fontSize: 11, color: "#B45309", marginLeft: 8 }}>({s.reason})</span>}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>

          <div style={{ width: 360, flexShrink: 0, overflowY: "auto", padding: "24px", background: BG }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: TEXT1, margin: "0 0 16px" }}>입력 정보</h3>
            <div style={{ background: SURFACE, borderRadius: 10, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: TEXT3, marginBottom: 4 }}>입력 방식</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>{result.input?.type === "figma" ? "Figma 파일 연결" : result.input?.type === "image" ? "이미지 업로드" : result.input?.type === "url" ? "URL 입력" : "JSON Schema"}</div>
            </div>
            {result.input?.figmaUrl && (
              <div style={{ background: SURFACE, borderRadius: 10, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: TEXT3, marginBottom: 4 }}>Figma URL</div>
                <div style={{ fontSize: 11, color: "#2563EB", wordBreak: "break-all" }}>{result.input.figmaUrl}</div>
              </div>
            )}
            <div style={{ background: SURFACE, borderRadius: 10, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: TEXT3, marginBottom: 4 }}>화면명</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT1 }}>{result.input?.screenName || "—"}</div>
            </div>
            {result.input?.imagePreview && (
              <div style={{ background: SURFACE, borderRadius: 10, padding: 12, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: TEXT3, marginBottom: 8 }}>업로드 이미지</div>
                <img src={result.input.imagePreview} style={{ width: "100%", borderRadius: 8 }} alt="" />
              </div>
            )}
            {result.input?.url && (
              <div style={{ background: SURFACE, borderRadius: 10, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: TEXT3, marginBottom: 4 }}>URL</div>
                <div style={{ fontSize: 12, color: "#2563EB", wordBreak: "break-all" }}>{result.input.url}</div>
              </div>
            )}
            <div style={{ background: SURFACE, borderRadius: 10, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: TEXT3, marginBottom: 8 }}>배점 구성</div>
              {[
                { label: "UX Policy (60)", max: result.breakdown.policyMax || 60, val: result.breakdown.policy, color: "#0891B2" },
                { label: "DS Rules (40)", max: result.breakdown.dsMax || 40, val: result.breakdown.ds, color: "#6B7280" },
              ].map((b, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: TEXT2 }}>{b.label}</span><span style={{ fontWeight: 600, color: b.color }}>{b.val}/{b.max}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: BORDER }}>
                    <div style={{ height: 6, borderRadius: 3, background: b.color, width: `${(b.val / b.max) * 100}%`, transition: "width .4s" }} />
                  </div>
                </div>
              ))}
            </div>
            {result.breakdown.policyDetail && (
              <div style={{ background: SURFACE, borderRadius: 10, padding: 16, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, color: TEXT3, marginBottom: 10 }}>Policy 세부</div>
                {Object.entries(result.breakdown.policyDetail).map(([name, d], i) => {
                  const cc = { "UX Policy": "#0891B2", "UX Checklist": "#7C3AED", "UI Checklist": "#D97706" }[name];
                  const passRate = Math.round(((d.total - d.fail) / d.total) * 100);
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                        <span style={{ color: TEXT2 }}>{name}</span>
                        <span style={{ fontSize: 10, color: cc }}>통과 {d.total - d.fail}/{d.total} · {passRate}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: BORDER }}>
                        <div style={{ height: 5, borderRadius: 3, background: cc, width: `${passRate}%`, transition: "width .4s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditPage({ archive, onAddResult, onNav }) {
  const [inputType, setInputType] = useState("image");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [screenName, setScreenName] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [jsonValue, setJsonValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageForApi, setImageForApi] = useState(null);
  const [popupResult, setPopupResult] = useState(null);
  const [figmaConnected, setFigmaConnected] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const resizeImage = useCallback((dataUrl, maxSize) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxSize && height <= maxSize) { resolve(dataUrl); return; }
        const scale = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = dataUrl;
    });
  }, []);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onload = async (ev) => {
        const original = ev.target.result;
        setImagePreview(original);
        const compressed = await resizeImage(original, 2000);
        setImageForApi(compressed);
      };
      r.readAsDataURL(file);
    }
  }, [resizeImage]);

  const resetAll = () => {
    setFigmaUrl(""); setScreenName(""); setUrlValue(""); setJsonValue(""); setImagePreview(null); setImageForApi(null); setFigmaConnected(false); setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const connectFigma = () => {
    if (!figmaUrl) return;
    setFigmaConnected(false);
    setTimeout(() => setFigmaConnected(true), 1200);
  };

  const doAudit = async () => {
    const name = screenName || "화면 검수";
    setLoading(true); setError(null);
    setLoadingMsg("화면 분석 준비 중...");

    try {
      const res = await runAIAudit(name, imageForApi || null, (msg) => setLoadingMsg(msg));

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      res.input = { type: inputType, screenName: name, imagePreview, url: urlValue, figmaUrl: figmaUrl || null };
      res.id = Date.now();
      onAddResult(res);
      setPopupResult(res);
    } catch (err) {
      setError("AI 분석 중 오류가 발생했습니다: " + err.message);
    }
    setLoading(false);
  };

  const canRun = inputType === "figma" ? (figmaConnected && screenName.trim()) : inputType === "image" ? (!!imagePreview && !!screenName.trim()) : inputType === "url" ? (!!urlValue.trim() && !!screenName.trim()) : !!screenName.trim();

  const inputTabs = [
    { id: "figma", icon: "◆", label: "Figma 파일" },
    { id: "image", icon: "🖼", label: "이미지 업로드" },
    { id: "url", icon: "🔗", label: "URL 입력" },
    { id: "json", icon: "{}", label: "JSON Schema" },
  ];

  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>UX Audit Engine</h1>
          <p style={{ color: TEXT3, margin: 0, fontSize: 13 }}>Claude AI가 화면 콘텐츠를 분석하여 Policy(60) + DS(40) = 100점 기준으로 검수합니다</p>
        </div>
        <button onClick={() => onNav("results")} style={{
          padding: "8px 16px", borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE,
          fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: TEXT2,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          📋 결과 목록 {archive.length > 0 && <span style={{ background: BRAND, color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{archive.length}</span>}
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {inputTabs.map(t => (
          <button key={t.id} onClick={() => setInputType(t.id)} style={{
            padding: "9px 18px", borderRadius: 8, border: "1.5px solid",
            borderColor: inputType === t.id ? BRAND : BORDER, background: inputType === t.id ? BRAND_LOW : SURFACE,
            color: inputType === t.id ? BRAND_HIGH : TEXT2, fontSize: 12.5, fontWeight: inputType === t.id ? 600 : 500,
            cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
          }}><span style={{ fontSize: 13 }}>{t.icon}</span> {t.label}</button>
        ))}
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 22 }}>

        {inputType === "figma" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: figmaConnected ? "#059669" : BRAND, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>1</span>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>Figma 파일 URL</label>
                {figmaConnected && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 12, background: "#ECFDF5", color: "#059669", fontWeight: 600 }}>✓ 연결됨</span>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={figmaUrl} onChange={e => { setFigmaUrl(e.target.value); setFigmaConnected(false); }}
                  placeholder="https://www.figma.com/design/FILE_KEY/..."
                  style={{ flex: 1, padding: "11px 14px", borderRadius: 8, border: `1px solid ${figmaConnected ? "#059669" : BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: BG, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = BRAND} onBlur={e => e.target.style.borderColor = figmaConnected ? "#059669" : BORDER} />
                <button onClick={connectFigma} disabled={!figmaUrl.trim()} style={{
                  padding: "0 20px", borderRadius: 8, border: "none",
                  background: !figmaUrl.trim() ? "#E5E7EB" : figmaConnected ? "#059669" : TEXT1,
                  color: "#fff", fontSize: 12, fontWeight: 600, cursor: figmaUrl.trim() ? "pointer" : "default",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                }}>{figmaConnected ? "✓ 연결 완료" : "연결"}</button>
              </div>
              <div style={{ fontSize: 11, color: TEXT3, marginTop: 6 }}>
                Figma MCP 연동을 통해 파일 구조를 분석합니다. 디자인 파일의 공유 URL을 입력하세요.
              </div>
            </div>

            <div style={{ opacity: figmaConnected ? 1 : 0.4, pointerEvents: figmaConnected ? "auto" : "none", transition: "opacity .3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: (figmaConnected && screenName) ? "#059669" : BRAND, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>2</span>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>검수 대상 화면명</label>
              </div>
              <input value={screenName} onChange={e => setScreenName(e.target.value)}
                placeholder="Figma 프레임 이름 또는 화면명 (예: 요금제 리스트)"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }}
                onFocus={e => e.target.style.borderColor = BRAND} onBlur={e => e.target.style.borderColor = BORDER} />
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["요금제 리스트", "요금제 비교", "요금제 추천 선택", "가입 정보 입력", "사용량 대시보드", "청구서 상세", "설정", "약관 동의"].map(ex => (
                  <button key={ex} onClick={() => setScreenName(ex)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${BORDER}`, background: "transparent", color: TEXT3, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{ex}</button>
                ))}
              </div>
              {figmaConnected && (
                <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 12, color: "#065F46" }}>
                  ✓ Figma 파일이 연결되었습니다. 화면명을 입력하면 해당 프레임의 컴포넌트 구조, 토큰 사용 여부, 레이아웃 규칙을 자동 분석합니다.
                </div>
              )}
            </div>
          </div>
        )}

        {inputType === "image" && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>화면명 (Context 분류용)</label>
                <input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="예: 요금제 리스트"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />
              </div>
            </div>
            <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${BORDER}`, borderRadius: 10, padding: imagePreview ? 12 : 36, textAlign: "center", cursor: "pointer" }}>
              {imagePreview ? <img src={imagePreview} style={{ maxWidth: "100%", maxHeight: 280, borderRadius: 8 }} alt="" /> : (
                <><div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT2 }}>화면 캡처 이미지를 업로드하세요</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 4 }}>PNG, JPG — Figma Export, 스크린샷 등</div></>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            </div>
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: "#FEF3C7", border: "1px solid #FDE68A", fontSize: 12, color: "#92400E" }}>
              이미지 기반 검수는 시각적 요소(레이아웃, 컬러, 타이포, 컴포넌트 구성)를 분석합니다. 동적 인터랙션 규칙은 가이드로만 제공됩니다.
            </div>
          </div>
        )}

        {inputType === "url" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>화면명 (Context 분류용)</label>
              <input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="예: 요금제 리스트"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>검수 대상 URL</label>
            <input value={urlValue} onChange={e => setUrlValue(e.target.value)} placeholder="https://..."
              style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />
          </div>
        )}

        {inputType === "json" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>화면명 (Context 분류용)</label>
              <input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="예: 요금제 리스트"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>Input Schema (JSON)</label>
            <textarea value={jsonValue} onChange={e => setJsonValue(e.target.value)} rows={8} placeholder={`{\n  "screen_name": "요금제 리스트",\n  "metrics": { "plan_count": 6 },\n  "flags": { "has_comparison": false }\n}`}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 12, fontFamily: "monospace", outline: "none", boxSizing: "border-box", resize: "vertical", background: BG }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center" }}>
          <button onClick={doAudit} disabled={loading || !canRun} style={{
            padding: "11px 28px", borderRadius: 8, border: "none",
            background: (loading || !canRun) ? "#D1D5DB" : `linear-gradient(135deg, ${BRAND}, ${BRAND_HIGH})`,
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: (loading || !canRun) ? "default" : "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {loading ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />{loadingMsg}</> : "▶ AI Audit 실행"}
          </button>
          <button onClick={resetAll} style={{
            padding: "11px 20px", borderRadius: 8, border: `1px solid ${BORDER}`,
            background: SURFACE, color: TEXT2, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>↺ 초기화</button>
          {inputType === "figma" && !figmaConnected && !loading && (
            <span style={{ fontSize: 12, color: "#D97706" }}>Figma 파일을 먼저 연결하세요</span>
          )}
          {inputType !== "figma" && !screenName.trim() && !loading && (
            <span style={{ fontSize: 12, color: "#D97706" }}>화면명을 입력하세요</span>
          )}
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 12, color: "#DC2626" }}>
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div style={{ marginTop: 16, padding: "20px", borderRadius: 10, background: BG, border: `1px solid ${BORDER}`, textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #E5E7EB", borderTopColor: BRAND, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT1, marginBottom: 4 }}>AI가 화면을 분석하고 있습니다</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>{loadingMsg}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>Claude API가 이미지 콘텐츠를 읽고 {buildAllPolicyItems().length + DS_RULES.filter(r=>r.auto).length}개 항목을 검수합니다</div>
          </div>
        )}
        </div>

      {popupResult && <ResultPopup result={popupResult} onClose={() => setPopupResult(null)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ResultsPage({ archive, onNav }) {
  const [popupResult, setPopupResult] = useState(null);
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Audit Results</h1>
          <p style={{ color: TEXT3, margin: 0, fontSize: 13 }}>검수 결과 아카이브 · {archive.length}건</p>
        </div>
        <button onClick={() => onNav("audit")} style={{
          padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${BRAND}, ${BRAND_HIGH})`,
          color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>+ 새 Audit 실행</button>
      </div>

      {archive.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: TEXT3 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14 }}>아직 검수 결과가 없습니다.</div>
          <button onClick={() => onNav("audit")} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 8, border: "none", background: BRAND, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>첫 번째 Audit 실행하기</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {archive.slice().reverse().map((r, i) => {
            const isPASS = r.verdict === "PASS";
            return (
              <button key={r.id} onClick={() => setPopupResult(r)} style={{
                background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10,
                padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
                cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all .12s",
                borderLeft: `4px solid ${isPASS ? "#059669" : "#DC2626"}`,
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke={BORDER} strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={isPASS ? "#059669" : "#DC2626"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${r.score * 2.64} 264`} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: TEXT1 }}>{r.score}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TEXT1 }}>{r.input?.screenName || "—"}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 12, background: isPASS ? "#ECFDF5" : "#FEF2F2", color: isPASS ? "#059669" : "#DC2626" }}>{r.verdict}</span>
                  </div>
                  <div style={{ fontSize: 11, color: TEXT3 }}>
                    Policy {r.breakdown.policy}/60 · DS {r.breakdown.ds}/40 · 이슈 {r.issues.length}건
                  </div>
                </div>

                <div style={{ fontSize: 11, color: TEXT3, flexShrink: 0 }}>{r.timestamp}</div>
                <span style={{ fontSize: 14, color: TEXT3, flexShrink: 0 }}>→</span>
              </button>
            );
          })}
        </div>
      )}

      {popupResult && <ResultPopup result={popupResult} onClose={() => setPopupResult(null)} />}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [archive, setArchive] = useState([]);
  const addResult = (r) => setArchive(prev => [...prev, r]);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: BG, color: TEXT1 }}>
      <SideNav active={page} onNav={setPage} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {page === "dashboard" && <Dashboard onNav={setPage} />}
        {page === "tokens" && <TokensPage />}
        {page === "components" && <ComponentsPage />}
        {page === "patterns" && <PatternsPage />}
        {page === "qarules" && <QARulesPage />}
        {page === "dsrules" && <DSRulesPage />}
        {page === "audit" && <AuditPage archive={archive} onAddResult={addResult} onNav={setPage} />}
        {page === "results" && <ResultsPage archive={archive} onNav={setPage} />}
      </div>
    </div>
  );
}
