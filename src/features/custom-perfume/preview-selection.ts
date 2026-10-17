export const ingredientIds = ['bergamot', 'rose', 'jasmine', 'cedar', 'vanilla', 'amber'] as const;
export type IngredientId = (typeof ingredientIds)[number];
export const maxPreviewIngredients = 3;

export type IngredientPreviewState = {
  readonly selectedIds: readonly IngredientId[];
  readonly animationKey: number;
  readonly lastAddedId: IngredientId | null;
};

type IngredientPreviewAction = {type: 'toggle'; id: IngredientId} | {type: 'reset'};

export const initialIngredientPreviewState: IngredientPreviewState = {
  selectedIds: [],
  animationKey: 0,
  lastAddedId: null
};

// Three selections are a preview interaction limit, not a production recipe rule.
export function ingredientPreviewReducer(
  state: IngredientPreviewState,
  action: IngredientPreviewAction
): IngredientPreviewState {
  if (action.type === 'reset') {
    return {...initialIngredientPreviewState, animationKey: state.animationKey + 1};
  }
  if (state.selectedIds.includes(action.id)) {
    return {
      selectedIds: state.selectedIds.filter((id) => id !== action.id),
      animationKey: state.animationKey + 1,
      lastAddedId: null
    };
  }
  if (state.selectedIds.length >= maxPreviewIngredients) return state;
  return {
    selectedIds: [...state.selectedIds, action.id],
    animationKey: state.animationKey + 1,
    lastAddedId: action.id
  };
}
