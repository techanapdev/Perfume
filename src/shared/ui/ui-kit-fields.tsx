'use client';

import {useMemo, type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import {Button} from './button';
import {Input} from './input';
import {Label} from './label';
import {DemoSection} from './ui-kit-demo-section';

type FieldAriaProps = {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
};

// Wires label, id and error association so each field does not repeat it.
function FormField({
  id,
  label,
  error,
  children
}: {
  id: string;
  label: string;
  error?: string;
  children: (props: FieldAriaProps) => ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined
      })}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// Local demo validation only; feature owners define real business validation.
function buildSampleSchema(t: (key: 'nameError' | 'emailError') => string) {
  return z.object({
    name: z.string().trim().min(2, t('nameError')),
    email: z.email(t('emailError'))
  });
}

type SampleForm = z.infer<ReturnType<typeof buildSampleSchema>>;

// Client because of useForm. The form validates locally and sends nothing.
export function FieldsSection() {
  const t = useTranslations('common.kit');
  const schema = useMemo(() => buildSampleSchema(t), [t]);
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<SampleForm>({
    resolver: zodResolver(schema),
    defaultValues: {name: '', email: ''}
  });

  const onSubmit = () => {
    toast.success(t('success'));
    reset();
  };

  return (
    <DemoSection id="fields" title={t('fields')} imports={{input: 'Input', label: 'Label'}}>
      <p className="text-sm text-muted-foreground">{t('localOnly')}</p>
      <div className="grid gap-8 md:grid-cols-2">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField id="sample-name" label={t('name')} error={errors.name?.message}>
            {(field) => (
              <Input placeholder={t('namePlaceholder')} {...field} {...register('name')} />
            )}
          </FormField>
          <FormField id="sample-email" label={t('email')} error={errors.email?.message}>
            {(field) => <Input type="email" {...field} {...register('email')} />}
          </FormField>
          <Button type="submit">{t('submit')}</Button>
        </form>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="error-input">aria-invalid</Label>
            <Input
              id="error-input"
              aria-invalid="true"
              aria-describedby="error-input-help"
              defaultValue="name@"
            />
            <p id="error-input-help" className="text-sm text-destructive">
              {t('errorHelp')}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-input">disabled</Label>
            <Input id="disabled-input" disabled placeholder={t('disabled')} />
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
