import {getTranslations} from 'next-intl/server';
import {Badge} from '@/shared/ui/badge';
import {IngredientPreview} from './ingredient-preview';

export async function IngredientSection() {
  const t = await getTranslations('content.ingredients');

  return (
    <section
      id="ingredients"
      className="border-y border-primary/20 bg-card/50"
      aria-labelledby="ingredients-title"
    >
      <div className="site-container py-16 sm:py-20 lg:py-24">
        <header className="mx-auto mb-10 max-w-2xl space-y-4 text-center">
          <Badge>{t('preview')}</Badge>
          <p className="text-eyebrow text-primary">02 / THE INGREDIENT ATELIER</p>
          <h2 id="ingredients-title" className="text-heading">
            {t('title')}
          </h2>
          <p className="text-body text-muted-foreground">{t('description')}</p>
        </header>
        <IngredientPreview />
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-muted-foreground">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
