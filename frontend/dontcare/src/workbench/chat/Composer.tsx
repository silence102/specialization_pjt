// 1. React & built-ins
import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useComposerStore } from '@/workbench/stores/useComposerStore';

// 2. External libs
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea'

// 3. Internal modules
// (none)

export interface ComposerHandle {
  focus: () => void;
  clear: () => void;
  insert: (value: string) => void;
}

interface ComposerProps {
  onSubmit?: (value: string) => void;
}

export const Composer = forwardRef<ComposerHandle, ComposerProps>(function Composer(
  { onSubmit },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const draft = useComposerStore((s) => s.draft);
  const focusTick = useComposerStore((s) => s.focusTick);
  const setDraft = useComposerStore((s) => s.setDraft);
  const clearDraft = useComposerStore((s) => s.clear);

  const [value, setValue] = useState('');

  useEffect(() => { setValue(draft); }, [draft]);        // 외부 드래프트 반영
  useEffect(() => { textareaRef.current?.focus(); }, [focusTick]); // 포커스 신호

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    clear: () => { setValue(''); clearDraft(); },
    insert: (v: string) => { setValue(v); setDraft(v); setTimeout(() => textareaRef.current?.focus(), 0); },
  }));

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
    }
  }

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setValue('');
    clearDraft();
  }

  return (
    <form
      aria-label="프롬프트 작성"
      className="mt-3 rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] p-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <label htmlFor="composer-textarea" className="mb-2 block text-sm text-muted-foreground">
        질문을 입력하세요 (Enter 실행, Shift+Enter 줄바꿈)
      </label>
      <Textarea
        id="composer-textarea"
        ref={textareaRef}
        value={value}
        onChange={(e) => { setValue(e.target.value); setDraft(e.target.value); }}
        onKeyDown={handleKeyDown}
        aria-label="프롬프트 입력창"
        className="min-h-[64px]"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button type="submit">실행</Button>
      </div>
    </form>
  );
});
