import Image from 'next/image';
import {ArrowDown, ArrowRight, ArrowUpRight, Sparkle} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {IngredientSection} from '@/features/custom-perfume/components/ingredient-section';
import {Button} from '@/shared/ui/button';
import {Badge} from '@/shared/ui/badge';
import {Card, CardContent} from '@/shared/ui/card';
import styles from './landing-preview.module.css';

const families = ['citrus', 'floral', 'woody'] as const;

export function LandingPreview() {
  return (
    <>
      <HeroSection />
      <SignatureStrip />
      <CollectionSection />
      <IngredientSection />
      <AtelierSection />
      <ClosingSection />
    </>
  );
}

async function HeroSection() {
  const t = await getTranslations('content');

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroImage}>
        <Image
          src="/images/perfume-gold-hero.webp"
          alt={t('heroImageAlt')}
          fill
          preload
          sizes="(min-width: 1600px) 1600px, 100vw"
          className="object-cover"
        />
      </div>
      <div className={styles.heroShade} />
      <div className="site-container relative z-10 flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
        <div className={styles.heroCopy}>
          <p className="mb-6 flex items-center justify-center gap-3 text-eyebrow text-primary">
            <span className="h-px w-6 shrink-0 bg-primary" />
            {t('eyebrow')}
          </p>
          <h1 id="hero-title" className={styles.heroTitle}>
            <span>{t('title')}</span>
            <em>{t('titleAccent')}</em>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-body text-muted-foreground">{t('subtitle')}</p>
          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button asChild size="lg" className="w-full max-w-sm whitespace-normal sm:w-auto">
              <a href="#collection">
                {t('explore')}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full max-w-sm whitespace-normal px-3 sm:w-auto"
            >
              <a href="#atelier">
                {t('meetAtelier')}
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-12 flex w-full flex-col items-center justify-center gap-5 border-t border-foreground/15 pt-6 text-center sm:flex-row sm:gap-12 lg:mt-16">
          <a
            href="#collection"
            className="flex items-center gap-3 text-eyebrow text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowDown className="size-4" aria-hidden="true" />
            {t('scroll')}
          </a>
          <p className="text-eyebrow text-foreground/70">
            THE FRAGRANCE ATELIER
            <span className="mt-1 block text-primary">SCENT / MEMORY / YOU</span>
          </p>
        </div>
      </div>
      <span className={styles.edition} aria-hidden="true">
        01 — THE GOLDEN EDIT
      </span>
    </section>
  );
}

function SignatureStrip() {
  return (
    <div
      className="overflow-hidden border-y border-primary/20 bg-primary py-5 text-primary-foreground"
      aria-hidden="true"
    >
      <div className="site-container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center font-display text-lg italic sm:text-2xl">
        {['A scent to remember', 'An expression of you'].map((phrase) => (
          <span key={phrase} className="flex items-center justify-center gap-4">
            {phrase}
            <Sparkle className="size-5 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

async function CollectionSection() {
  const t = await getTranslations('content');

  return (
    <section
      id="collection"
      className="site-container py-16 sm:py-20 lg:py-28"
      aria-labelledby="collection-title"
    >
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-5 text-center lg:mb-14">
        <div>
          <p className="mb-4 text-eyebrow text-primary">01 / {t('collectionLabel')}</p>
          <h2 id="collection-title" className="text-heading">
            {t('collectionTitle')}
          </h2>
        </div>
        <p className="max-w-2xl text-body text-muted-foreground">{t('collectionDescription')}</p>
      </div>
      <div className="grid justify-items-center gap-10 md:grid-cols-3 md:gap-6">
        {families.map((family, index) => (
          <FragranceCard key={family} family={family} index={index} />
        ))}
      </div>
      <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">{t('placeholder')}</p>
    </section>
  );
}

async function FragranceCard({family, index}: {family: (typeof families)[number]; index: number}) {
  const t = await getTranslations('content');

  return (
    <Card className="group w-full min-w-0 max-w-sm overflow-hidden rounded-none border-0 bg-transparent text-center shadow-none">
      <div className="relative aspect-4/5 overflow-hidden bg-card">
        <Image
          src={`/images/perfume-${family}.webp`}
          alt={t(`families.${family}.imageAlt`)}
          fill
          sizes="(max-width: 767px) 384px, (min-width: 1440px) 384px, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <Badge className="border-foreground/20 bg-overlay/60 text-foreground">0{index + 1}</Badge>
          <span className="text-eyebrow text-foreground/80">{family}</span>
        </div>
      </div>
      <CardContent className="px-0 pt-6 pb-0">
        <div className="flex items-center justify-center gap-3">
          <h3 className="text-2xl font-normal">{t(`families.${family}.title`)}</h3>
          <Sparkle className="size-4 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t(`families.${family}.description`)}
        </p>
        <p className="mt-5 border-t pt-4 text-label text-primary">{t(`families.${family}.mood`)}</p>
      </CardContent>
    </Card>
  );
}

async function AtelierSection() {
  const t = await getTranslations('content');

  return (
    <section id="atelier" className="border-y bg-card" aria-labelledby="atelier-title">
      <div className="site-container grid min-w-0 items-center gap-8 py-10 md:grid-cols-2 lg:gap-12 lg:py-16">
        <div className={styles.atelierVisual}>
          <Image
            src="/images/perfume-gold-hero.webp"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-4 flex items-end justify-center border border-primary/30 p-4 text-center sm:inset-5 sm:p-6">
            <p className="text-eyebrow text-primary">EVERY NOTE, A LITTLE MORE YOU.</p>
          </div>
        </div>
        <div className="mx-auto flex w-full min-w-0 max-w-xl flex-col items-center justify-center py-6 text-center sm:py-10">
          <p className="mb-6 text-eyebrow text-primary">03 / THE PERSONAL ATELIER</p>
          <h2 id="atelier-title" className="text-heading whitespace-pre-line">
            {t('customTitle')}
          </h2>
          <p className="mt-6 text-body text-muted-foreground">{t('customDescription')}</p>
          <div className="mt-8 mb-9 w-full max-w-sm divide-y border-y">
            {(['memory', 'character', 'signature'] as const).map((key, index) => (
              <div key={key} className="flex items-center justify-center gap-4 py-4">
                <span className="shrink-0 font-display text-lg italic text-primary">
                  0{index + 1}
                </span>
                <p className="text-sm">{t(`atelier.${key}`)}</p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="lg" className="max-w-full whitespace-normal">
            <Link href="/customize">
              {t('customExplore')}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

async function ClosingSection() {
  const t = await getTranslations('content');

  return (
    <section className="site-container py-16 text-center sm:py-20 lg:py-28">
      <Sparkle className="mx-auto mb-7 size-7 text-primary" aria-hidden="true" />
      <p className="text-eyebrow text-muted-foreground">YOUR PRESENCE, REMEMBERED.</p>
      <p className="mx-auto mt-5 max-w-3xl font-display text-heading whitespace-pre-line italic text-primary">
        {t('closing')}
      </p>
      <p className="mt-8 text-xs leading-6 text-muted-foreground">{t('note')}</p>
    </section>
  );
}
