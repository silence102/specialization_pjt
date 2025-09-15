import { useEffect, useRef, useCallback } from 'react';

/**
 * AbortController를 관리하는 커스텀 훅
 * 컴포넌트가 언마운트되거나 의존성이 변경될 때 자동으로 요청을 취소합니다.
 */
export const useAbortController = (dependencies: ReadonlyArray<unknown> = []) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // 새로운 AbortController 생성
  const createAbortController = useCallback(() => {
    // 기존 컨트롤러가 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 컨트롤러 생성
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  // 현재 AbortController의 signal 반환
  const getSignal = useCallback(() => {
    if (!abortControllerRef.current) {
      createAbortController();
    }
    return abortControllerRef.current!.signal;
  }, [createAbortController]);

  // 요청 취소
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // 의존성이 변경되면 새로운 AbortController 생성
  useEffect(() => {
    // 기존 컨트롤러가 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 컨트롤러 생성
    abortControllerRef.current = new AbortController();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    signal: getSignal(),
    cancel,
    createNew: createAbortController,
  };
};

/**
 * 여러 요청을 동시에 관리할 수 있는 AbortController 훅
 */
export const useMultipleAbortControllers = () => {
  const controllersRef = useRef<Map<string, AbortController>>(new Map());

  // 특정 키로 AbortController 생성
  const createController = useCallback((key: string) => {
    // 기존 컨트롤러가 있다면 취소
    const existingController = controllersRef.current.get(key);
    if (existingController) {
      existingController.abort();
    }

    // 새로운 컨트롤러 생성
    const newController = new AbortController();
    controllersRef.current.set(key, newController);
    return newController;
  }, []);

  // 특정 키의 signal 반환
  const getSignal = useCallback(
    (key: string) => {
      const controller = controllersRef.current.get(key);
      if (!controller) {
        return createController(key).signal;
      }
      return controller.signal;
    },
    [createController],
  );

  // 특정 키의 요청 취소
  const cancel = useCallback((key: string) => {
    const controller = controllersRef.current.get(key);
    if (controller) {
      controller.abort();
      controllersRef.current.delete(key);
    }
  }, []);

  // 모든 요청 취소
  const cancelAll = useCallback(() => {
    controllersRef.current.forEach((controller) => {
      controller.abort();
    });
    controllersRef.current.clear();
  }, []);

  // 컴포넌트 언마운트 시 모든 요청 취소
  useEffect(() => {
    return () => {
      cancelAll();
    };
  }, [cancelAll]);

  return {
    createController,
    getSignal,
    cancel,
    cancelAll,
  };
};
