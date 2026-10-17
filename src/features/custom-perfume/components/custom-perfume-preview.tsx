import {ArrowLeft, ArrowUpRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {Badge} from '@/shared/ui/badge';
import {Button} from '@/shared/ui/button';
import {IngredientPreview} from './ingredient-preview';

export async function CustomPerfumePreview() {
  const [t, ingredients] = await Promise.all([
    getTranslations('content.customize'),
    getTranslations('content.ingredients')
  ]);

  return (
    <>
      <section className="site-container py-10 sm:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex min-h-11 items-center gap-2 text-label text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('back')}
        </Link>
        <header className="mx-auto max-w-3xl space-y-5 text-center">
          <Badge>{ingredients('preview')}</Badge>
          <p className="text-eyebrow text-primary">THE PERSONAL ATELIER</p>
          <h1 className="text-heading">{t('title')}</h1>
          <p className="mx-auto max-w-2xl text-body text-muted-foreground">{t('description')}</p>
        </header>
      </section>
      <section
        className="border-y border-primary/20 bg-card/50"
        aria-labelledby="composition-title"
      >
        <div className="site-container py-12 sm:py-16">
          <h2 id="composition-title" className="mb-8 text-center text-xl font-normal">
            {t('workbench')}
          </h2>
          <IngredientPreview />
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-muted-foreground">
            {ingredients('disclaimer')}
          </p>
        </div>
      </section>
      <div className="site-container flex justify-center py-10">
        <Button asChild variant="outline" size="lg">
          <Link href="/#collection">
            {t('explore')}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </>
  );
}
