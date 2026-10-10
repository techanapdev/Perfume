import {Button} from '@/shared/ui/button';
import {signOut} from '../actions';

export function SignOutButton({label}: {label: string}) {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline">
        {label}
      </Button>
    </form>
  );
}
