import type {ComponentProps} from 'react';
import {Input} from '@/shared/ui/input';
import {Label} from '@/shared/ui/label';

type AuthFieldProps = ComponentProps<typeof Input> & {id: string; label: string};

export function AuthField({id, name = id, label, ...props}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} required {...props} />
    </div>
  );
}
