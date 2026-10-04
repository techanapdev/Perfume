import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Button} from '@/shared/ui/button';

export async function LandingPreview() {
  const t = await getTranslations('content');
  return <>
    <section className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-secondary sm:min-h-[42rem]">
      <Image src="/images/fragrance-placeholder.svg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="relative z-10 w-full px-6 py-14 text-center md:py-20">
        <p className="mb-5 text-xs tracking-[0.2em] uppercase">{t('eyebrow')}</p>
        <h1 className="whitespace-pre-line text-4xl leading-tight font-normal tracking-tight sm:text-6xl">{t('title')}</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7">{t('subtitle')}</p>
        <Button asChild variant="outline" className="mt-7 rounded-none border-foreground bg-background/80"><a href="#collection">{t('explore')}</a></Button>
      </div>
    </section>
    <p className="px-6 py-4 text-center text-xs text-muted-foreground">{t('note')}</p>
    <section id="collection" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-14 max-w-xl text-center">
        <p className="mb-5 text-xs tracking-[0.15em] uppercase">{t('collectionLabel')}</p>
        <h2 className="whitespace-pre-line text-3xl leading-snug sm:text-4xl">{t('collectionTitle')}</h2>
        <p className="mt-6 text-sm leading-8 text-muted-foreground">{t('collectionDescription')}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {(['familyOne', 'familyTwo', 'familyThree'] as const).map((key, index) => <figure key={key}>
          <div className="relative aspect-[4/5] bg-muted">
            <Image src="/images/fragrance-placeholder.svg" alt="" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" style={{objectPosition: `${20 + index * 30}% center`}} />
          </div>
          <figcaption className="mt-5 text-center text-sm">{t(key)}<span className="mt-2 block text-xs text-muted-foreground">{t('placeholder')}</span></figcaption>
        </figure>)}
      </div>
    </section>
    <section className="bg-muted px-6 py-24 text-center">
      <p className="mb-5 text-xs tracking-[0.15em] uppercase">{t('customLabel')}</p>
      <h2 className="text-3xl sm:text-4xl">{t('customTitle')}</h2>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-muted-foreground">{t('customDescription')}</p>
    </section>
  </>;
}
