import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { EmailInput } from '@/auth/components/inputs/EmailInput';
import { EmailVerificationInput } from '@/auth/components/inputs/EmailVerificationInput';
import { PasswordInput } from '@/auth/components/inputs/PasswordInput';
import { ConfirmPasswordInput } from '@/auth/components/inputs/ConfirmPasswordInput';
import {
  passwordResetStep1Schema,
  passwordResetStep2Schema,
  type PasswordResetStep1Values,
  type PasswordResetStep2Values,
} from '@/auth/schemas/auth.schemas';
const UI_TEXTS = {
  TITLE: '비밀번호 재생성',
  DESCRIPTION_STEP1: '이메일 인증을 통해 본인 확인을 진행해주세요.',
  DESCRIPTION_STEP2: '새로운 비밀번호를 입력해주세요.',
  EMAIL_VERIFICATION_BUTTON: '인증번호 확인',
  PASSWORD_RESET_BUTTON: '비밀번호 재생성',
  BACK_TO_PREVIOUS_STEP_BUTTON: '이전 단계로',
  EMAIL_VERIFICATION_SENT_MESSAGE: '{email}로 인증번호를 전송했습니다.',
  EMAIL_VERIFICATION_RESEND_BUTTON: '인증번호 재전송',
  PASSWORD_RESET_PROGRESS_ARIA_LABEL: '비밀번호 재생성 진행 상황: {currentStep}단계 중 2단계',
  REMEMBER_PASSWORD_TEXT: '비밀번호를 기억하시나요?',
  LOGIN_LINK: '로그인',
  LOGIN_PAGE_LINK_ARIA_LABEL: '로그인 페이지로 이동',
} as const;

type CurrentStep = 1 | 2;

export const PasswordResetForm = () => {
  const [currentStep, setCurrentStep] = useState<CurrentStep>(1);
  const [step1Data, setStep1Data] = useState<PasswordResetStep1Values | null>(null);

  const step1Form = useForm<PasswordResetStep1Values>({
    resolver: zodResolver(passwordResetStep1Schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    delayError: 500,
    defaultValues: {
      email: '',
      emailVerification: '',
    },
  });

  const step2Form = useForm<PasswordResetStep2Values>({
    resolver: zodResolver(passwordResetStep2Schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    delayError: 500,
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleStep1Submit = (data: PasswordResetStep1Values): void => {
    // 1단계 로직을 여기에 구현하세요
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (): void => {
    // 2단계 로직을 여기에 구현하세요
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleResendVerificationCode = () => {
    // 인증번호 재전송 로직을 여기에 구현하세요
  };

  return (
    <Card className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-soft-2xl backdrop-blur-md">
      <CardHeader className="space-y-1">
        <CardTitle className="gradient-text text-glow text-center text-4xl font-bold">
          {UI_TEXTS.TITLE}
        </CardTitle>
        <CardDescription className="text-center text-white/80">
          {currentStep === 1 ? UI_TEXTS.DESCRIPTION_STEP1 : UI_TEXTS.DESCRIPTION_STEP2}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 단계 표시기 */}
        <div
          className="flex items-center justify-center space-x-2"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={2}
          aria-label={UI_TEXTS.PASSWORD_RESET_PROGRESS_ARIA_LABEL.replace(
            '{currentStep}',
            currentStep.toString(),
          )}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              currentStep >= 1
                ? 'border border-white/30 bg-white/20 text-white'
                : 'border border-white/10 bg-white/5 text-white/50'
            }`}
            aria-current={currentStep === 1 ? 'step' : undefined}
          >
            1
          </div>
          <div
            className={`h-1 w-8 transition-colors ${currentStep >= 2 ? 'bg-white/30' : 'bg-white/10'}`}
            aria-hidden="true"
          />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              currentStep >= 2
                ? 'border border-white/30 bg-white/20 text-white'
                : 'border border-white/10 bg-white/5 text-white/50'
            }`}
            aria-current={currentStep === 2 ? 'step' : undefined}
          >
            2
          </div>
        </div>

        {/* 1단계: 이메일 인증 */}
        {currentStep === 1 && (
          <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
            <Controller
              name="email"
              control={step1Form.control}
              render={({ field }) => (
                <EmailInput {...field} error={step1Form.formState.errors.email} />
              )}
            />
            <Controller
              name="emailVerification"
              control={step1Form.control}
              render={({ field }) => (
                <EmailVerificationInput
                  {...field}
                  error={step1Form.formState.errors.emailVerification}
                />
              )}
            />
            <Button type="submit" className="btn-cta-primary h-12 w-full rounded-full text-base">
              {UI_TEXTS.EMAIL_VERIFICATION_BUTTON}
            </Button>
          </form>
        )}

        {/* 2단계: 새 비밀번호 설정 */}
        {currentStep === 2 && (
          <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
            <Controller
              name="password"
              control={step2Form.control}
              render={({ field }) => (
                <PasswordInput {...field} error={step2Form.formState.errors.password} />
              )}
            />
            <Controller
              name="confirmPassword"
              control={step2Form.control}
              render={({ field }) => (
                <ConfirmPasswordInput
                  {...field}
                  error={step2Form.formState.errors.confirmPassword}
                />
              )}
            />
            <div className="space-y-2">
              <Button type="submit" className="btn-cta-primary h-12 w-full rounded-full text-base">
                {UI_TEXTS.PASSWORD_RESET_BUTTON}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-full border-white/20 bg-white/5 text-base text-white hover:bg-white/10"
                onClick={handleBackToStep1}
              >
                {UI_TEXTS.BACK_TO_PREVIOUS_STEP_BUTTON}
              </Button>
            </div>
            {step1Data?.email && (
              <div className="text-center">
                <p className="text-sm text-white/80">
                  {UI_TEXTS.EMAIL_VERIFICATION_SENT_MESSAGE.replace('{email}', step1Data.email)}
                </p>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleResendVerificationCode}
                  className="text-xs text-white hover:text-white/80"
                >
                  {UI_TEXTS.EMAIL_VERIFICATION_RESEND_BUTTON}
                </Button>
              </div>
            )}
          </form>
        )}

        {/* 로그인 페이지로 돌아가기 링크 */}
        <div className="text-center">
          <p className="text-sm text-white/80">
            {UI_TEXTS.REMEMBER_PASSWORD_TEXT}{' '}
            <Link
              to="/login"
              className="font-medium text-white transition-colors hover:text-white/80"
              aria-label={UI_TEXTS.LOGIN_PAGE_LINK_ARIA_LABEL}
            >
              {UI_TEXTS.LOGIN_LINK}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
