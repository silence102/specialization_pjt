// 1. React & built-ins
import { memo } from 'react';

// 2. External libs
import { Button } from '@/shared/components/ui/button';

// 3. Internal modules
// (none)

interface ContextBarProps {
  ticker?: string;              // 예: 'AAPL'
  periodLabel?: string;         // 예: '최근 6개월'
  attachmentsCount?: number;    // 예: 2
  onEditTicker?: () => void;
  onEditPeriod?: () => void;
  onOpenAttachments?: () => void;
}

export const ContextBar = memo(function ContextBar({
  ticker,
  periodLabel,
  attachmentsCount = 0,
  onEditTicker,
  onEditPeriod,
  onOpenAttachments,
}: ContextBarProps) {
  const hasTicker = typeof ticker === 'string' && ticker.trim().length > 0;
  const hasPeriod = typeof periodLabel === 'string' && periodLabel.trim().length > 0;
  const hasFiles = attachmentsCount > 0;

  return (
    <section
      aria-label="세션 컨텍스트"
      className="mb-3 rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] px-3 py-2 backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* 티커 칩 */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onEditTicker}
          aria-label="티커 설정"
          className="h-7 rounded-full"
        >
          {hasTicker ? `티커: ${ticker}` : '티커 미설정'}
        </Button>

        {/* 기간 칩 */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onEditPeriod}
          aria-label="기간 설정"
          className="h-7 rounded-full"
        >
          {hasPeriod ? `기간: ${periodLabel}` : '기간 미설정'}
        </Button>

        {/* 첨부 칩 */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onOpenAttachments}
          aria-label="첨부 파일 열기"
          className="h-7 rounded-full"
        >
          {hasFiles ? `첨부: ${attachmentsCount}개` : '첨부 없음'}
        </Button>

        {/* 설명 텍스트(우측 정렬) */}
        <p className="ml-auto truncate text-xs text-muted-foreground">
          컨텍스트는 프리셋/질문에 맞춰 자동 제안됩니다.
        </p>
      </div>
    </section>
  );
});
