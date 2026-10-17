import {maxPreviewIngredients} from '../preview-selection.ts';

export const liquidBounds = {top: 137, height: 172} as const;

// These coordinates show selection progress, not ingredient quantities or a recipe.
export function getIngredientLiquidLevel(selectedCount: number) {
  const count = Math.max(0, Math.min(maxPreviewIngredients, selectedCount));
  const offset =
    count === 0
      ? liquidBounds.height + 10
      : liquidBounds.height * (1 - count / maxPreviewIngredients);
  return {offset, surfaceY: liquidBounds.top + offset};
}
