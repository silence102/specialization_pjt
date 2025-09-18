// 1. React & built-ins
import { useMemo } from 'react';

// 2. External libs
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';

// 3. Internal modules
import {
  PROGRESS_MIN,
  PROGRESS_MAX,
  NOWBAR_DEFAULT_TITLE,
  NOWBAR_DEFAULT_DESC,
} from '@/workbench/constants/UI_CONSTANTS';

interface NowBarProps {
  title?: string;
  description?: string;
  progress?: number; // 0..100(미지정 = indeterminate)
  isPaused?: boolean;
  onPause?: () => void;
  onSkip?: () => void;
  onCancel?: () => void;
}

export function NowBar({
  title = NOWBAR_DEFAULT_TITLE,
  description = NOWBAR_DEFAULT_DESC,
  progress,
  isPaused,
  onPause,
  onSkip,
  onCancel,
}: NowBarProps) {
  const safeProgress = useMemo(() => {
    if (typeof progress !== 'number' || Number.isNaN(progress)) return undefined;
    return Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, Math.round(progress)));
  }, [progress]);

  return (
    <header
      aria-live="polite"
      className="mb-3 rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] p-4 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-[color:var(--dc-text)]">
            {title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onPause}
            aria-pressed={!!isPaused}
            aria-label="일시정지 또는 재개"
          >
            {isPaused ? '재개' : '일시정지'}
          </Button>
          <Button type="button" variant="secondary" onClick={onSkip} aria-label="현재 단계 건너뛰기">
            건너뛰기
          </Button>
          <Button type="button" variant="destructive" onClick={onCancel} aria-label="실행 취소">
            취소
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <div
          role="progressbar"
          aria-valuemin={PROGRESS_MIN}
          aria-valuemax={PROGRESS_MAX}
          aria-valuenow={typeof safeProgress === 'number' ? safeProgress : undefined}
        >
          <Progress value={safeProgress} />
        </div>
      </div>
    </header>
  );
}
