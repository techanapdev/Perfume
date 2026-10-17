'use client';

import {useId, useReducer, useRef} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Check, Plus, X, RotateCcw} from 'lucide-react';
import {cn} from '@/shared/lib/cn';
import {Button} from '@/shared/ui/button';
import {
  ingredientIds,
  ingredientPreviewReducer,
  initialIngredientPreviewState,
  maxPreviewIngredients,
  type IngredientId
} from '../preview-selection';
import {IngredientBottle} from './ingredient-bottle';
import styles from './ingredient-preview.module.css';

export function IngredientPreview() {
  const t = useTranslations('content.ingredients');
  const helpId = useId();
  const optionRefs = useRef<Partial<Record<IngredientId, HTMLButtonElement | null>>>({});
  const [state, dispatch] = useReducer(ingredientPreviewReducer, initialIngredientPreviewState);
  const complete = state.selectedIds.length === maxPreviewIngredients;

  return (
    <div className={styles.layout}>
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center lg:justify-between lg:text-left">
          <h3 className="text-lg">{t('choose')}</h3>
          <span className="text-label text-primary">
            {t('count', {count: state.selectedIds.length, max: maxPreviewIngredients})}
          </span>
        </div>
        <div
          className={styles.options}
          role="group"
          aria-label={t('choose')}
          aria-describedby={helpId}
        >
          {ingredientIds.map((id) => {
            const selected = state.selectedIds.includes(id);

            return (
              <Button
                key={id}
                ref={(element) => {
                  optionRefs.current[id] = element;
                }}
                variant="outline"
                className={cn(styles.option, selected && styles.optionSelected)}
                aria-pressed={selected}
                disabled={complete && !selected}
                onClick={() => dispatch({type: 'toggle', id})}
              >
                <span className={styles.ingredientImage}>
                  <Image
                    src={`/images/ingredients/${id}-v1.webp`}
                    alt=""
                    fill
                    sizes="(max-width: 479px) 40px, 56px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-medium">{t(`choices.${id}.name`)}</span>
                  <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">
                    {t(`choices.${id}.mood`)}
                  </span>
                </span>
                <span className="shrink-0 text-primary">
                  {selected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                </span>
              </Button>
            );
          })}
        </div>
        <p id={helpId} className="text-center text-xs leading-6 text-muted-foreground">
          {complete ? t('limit') : t('help')}
        </p>
        <div className="flex justify-center">
          <Button
            variant="ghost"
            disabled={state.selectedIds.length === 0}
            onClick={() => {
              const first = state.selectedIds[0];
              dispatch({type: 'reset'});
              if (first) optionRefs.current[first]?.focus();
            }}
          >
            <RotateCcw aria-hidden="true" />
            {t('reset')}
          </Button>
        </div>
      </div>
      <div className={styles.previewPanel} data-complete={complete}>
        <p className="text-center text-eyebrow text-primary">THE SCENT COMPOSITION</p>
        <IngredientBottle
          selectedCount={state.selectedIds.length}
          animationKey={state.animationKey}
          hasNewDrop={state.lastAddedId !== null}
          complete={complete}
        />
        <p
          className="mb-5 flex min-h-12 items-center justify-center text-center text-sm text-primary"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {complete
            ? t('ready')
            : state.selectedIds.length > 0
              ? t('building', {count: state.selectedIds.length})
              : t('empty')}
        </p>
        <ol className={styles.slots} aria-label={t('selected')}>
          {Array.from({length: maxPreviewIngredients}, (_, index) => {
            const id = state.selectedIds[index];

            return (
              <li key={index} className={styles.slot} data-filled={Boolean(id)}>
                {id ? (
                  <>
                    <span className="min-w-0 truncate text-xs">{t(`choices.${id}.name`)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      aria-label={t('remove', {name: t(`choices.${id}.name`)})}
                      onClick={() => {
                        dispatch({type: 'toggle', id});
                        optionRefs.current[id]?.focus();
                      }}
                    >
                      <X aria-hidden="true" />
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {t('slot', {number: index + 1})}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
