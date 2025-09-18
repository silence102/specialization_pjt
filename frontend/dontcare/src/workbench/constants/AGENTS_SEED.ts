import type { Agent } from '@/workbench/types/agents';

export const AGENTS_SEED: Agent[] = [
  {
    id: 'news',
    name: '뉴스 비서',
    icon: 'Newspaper',
    description: '오늘 종목 핵심 뉴스 3줄 요약',
    presets: [{ label: '핵심 뉴스 3줄', prompt: '오늘 종목 핵심 뉴스 3줄로 요약해줘.' }],
  },
  {
    id: 'fundamentals',
    name: '재무 비서',
    icon: 'LibraryBig',
    description: '최근 분기 요약/밸류에이션',
    presets: [{ label: '최근 분기 요약', prompt: '최근 분기 실적과 밸류에이션을 요약해줘.' }],
  },
  {
    id: 'technical',
    name: '기술 비서',
    icon: 'Activity',
    description: '추세/지표 간단 리포트',
    presets: [{ label: '기술 요약', prompt: '추세/지표를 기준으로 간단 리포트를 작성해줘.' }],
  },
  {
    id: 'backtest',
    name: '백테스트 비서',
    icon: 'FlaskConical',
    description: '모멘텀(12-1) 5년 성능',
    presets: [{ label: '모멘텀 12-1', prompt: '모멘텀(12-1) 전략의 5년 성능을 요약해줘.' }],
  },
  {
    id: 'strategy',
    name: '전략 비서',
    icon: 'Layers',
    description: '종합 전략 메모 3줄',
    presets: [{ label: '전략 메모', prompt: '종합 전략 메모를 3줄로 적어줘.' }],
  },
  {
    id: 'report',
    name: '리포트 비서',
    icon: 'FileChartColumn',
    description: '투자의견/헤드라인 생성',
    presets: [{ label: '종목 리포트', prompt: '투자의견, 헤드라인, 핵심 포인트를 정리해줘.' }],
  },
];
