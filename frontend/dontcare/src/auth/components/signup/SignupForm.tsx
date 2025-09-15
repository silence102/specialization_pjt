import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { signupSchema, type SignupFormValues } from '@/auth/schemas/auth.schemas';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { EmailInput } from '@/auth/components/inputs/EmailInput';
import { EmailVerificationInput } from '@/auth/components/inputs/EmailVerificationInput';
import { NameInput } from '@/auth/components/inputs/NameInput';
import { PasswordInput } from '@/auth/components/inputs/PasswordInput';
import { ConfirmPasswordInput } from '@/auth/components/inputs/ConfirmPasswordInput';

const UI_TEXTS = {
  TITLE: '회원가입',
  DESCRIPTION: '계정을 생성하여 서비스를 이용해보세요',
  BUTTON: '회원가입',
  HAVE_ACCOUNT_TEXT: '이미 계정이 있으신가요?',
  LOGIN_LINK: '로그인',
} as const;

export const SignupForm = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    delayError: 500,
    defaultValues: {
      email: '',
      emailVerification: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (data: SignupFormValues): void => {
    // 회원가입 로직을 여기에 구현하세요
    console.log('Signup form submitted:', data);
  };

  return (
    <Card className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-soft-2xl backdrop-blur-md">
      <CardHeader className="space-y-1">
        <CardTitle className="gradient-text text-glow text-center text-4xl">
          {UI_TEXTS.TITLE}
        </CardTitle>
        <CardDescription className="text-center text-white/80">
          {UI_TEXTS.DESCRIPTION}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 입력 필드 섹션 */}
          <div className="space-y-1">
            <Controller
              name="email"
              control={control}
              render={({ field }) => <EmailInput {...field} error={errors.email} />}
            />
            <Controller
              name="emailVerification"
              control={control}
              render={({ field }) => (
                <EmailVerificationInput {...field} error={errors.emailVerification} />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => <NameInput {...field} error={errors.name} />}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => <PasswordInput {...field} error={errors.password} />}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <ConfirmPasswordInput {...field} error={errors.confirmPassword} />
              )}
            />
          </div>

          {/* 회원가입 버튼 */}
          <div className="mt-6">
            <Button type="submit" className="btn-cta-primary h-12 w-full rounded-full text-base">
              {UI_TEXTS.BUTTON}
            </Button>
          </div>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/80">
            {UI_TEXTS.HAVE_ACCOUNT_TEXT}{' '}
            <Link
              to="/login"
              className="font-medium text-white transition-colors hover:text-white/80"
            >
              {UI_TEXTS.LOGIN_LINK}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
