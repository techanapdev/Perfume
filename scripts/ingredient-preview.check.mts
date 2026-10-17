import assert from 'node:assert/strict';
import {
  getIngredientLiquidLevel,
  liquidBounds
} from '../src/features/custom-perfume/components/ingredient-liquid.ts';
import {
  ingredientIds,
  ingredientPreviewReducer,
  initialIngredientPreviewState,
  maxPreviewIngredients
} from '../src/features/custom-perfume/preview-selection.ts';

const first = ingredientPreviewReducer(initialIngredientPreviewState, {type: 'toggle', id: 'rose'});
assert.deepEqual(first.selectedIds, ['rose']);
assert.equal(first.lastAddedId, 'rose');
assert.deepEqual(
  initialIngredientPreviewState.selectedIds,
  [],
  'Do not mutate shared initial state'
);

const removed = ingredientPreviewReducer(first, {type: 'toggle', id: 'rose'});
assert.deepEqual(removed.selectedIds, [], 'Selecting a base twice removes it');
assert.equal(removed.lastAddedId, null, 'Removing must not start a pour animation');

const second = ingredientPreviewReducer(first, {type: 'toggle', id: 'cedar'});
const third = ingredientPreviewReducer(second, {type: 'toggle', id: 'amber'});
assert.deepEqual(third.selectedIds, ['rose', 'cedar', 'amber']);
assert.equal(third.selectedIds.length, maxPreviewIngredients);
assert.equal(
  ingredientPreviewReducer(third, {type: 'toggle', id: 'vanilla'}),
  third,
  'A fourth base must be rejected without restarting the animation'
);

const freed = ingredientPreviewReducer(third, {type: 'toggle', id: 'cedar'});
const replaced = ingredientPreviewReducer(freed, {type: 'toggle', id: 'vanilla'});
assert.deepEqual(replaced.selectedIds, ['rose', 'amber', 'vanilla']);
assert.deepEqual(third.selectedIds, ['rose', 'cedar', 'amber'], 'Keep previous state immutable');
assert.equal(replaced.animationKey, third.animationKey + 2);

const reset = ingredientPreviewReducer(replaced, {type: 'reset'});
assert.deepEqual(reset.selectedIds, []);
assert.equal(reset.lastAddedId, null);
assert.ok(reset.animationKey > replaced.animationKey, 'Reset must not reuse an animation key');

let state = initialIngredientPreviewState;
for (let round = 0; round < 10; round++) {
  for (const id of ingredientIds) {
    state = ingredientPreviewReducer(state, {type: 'toggle', id});
    assert.ok(state.selectedIds.length <= maxPreviewIngredients);
    assert.equal(new Set(state.selectedIds).size, state.selectedIds.length);
  }
}
assert.deepEqual(initialIngredientPreviewState.selectedIds, []);
const levels = [0, 1, 2, 3].map(getIngredientLiquidLevel);
assert.ok(
  levels[0].surfaceY > liquidBounds.top + liquidBounds.height,
  'Empty liquid including its wave must be outside the bottle'
);
assert.equal(
  levels[3].surfaceY,
  liquidBounds.top,
  'Three bases must fill the visible bottle interior'
);
for (let index = 1; index < levels.length; index++) {
  assert.ok(
    levels[index].surfaceY < levels[index - 1].surfaceY,
    'Each base must raise the liquid surface'
  );
}
assert.equal(getIngredientLiquidLevel(freed.selectedIds.length).offset, levels[2].offset);
assert.equal(getIngredientLiquidLevel(reset.selectedIds.length).offset, levels[0].offset);
assert.deepEqual(getIngredientLiquidLevel(-1), levels[0]);
assert.deepEqual(getIngredientLiquidLevel(4), levels[3]);
console.log(
  'Ingredient preview assertions passed: selection cap, removal, replacement, reset, immutability, animation keys and progressive liquid levels.'
);
