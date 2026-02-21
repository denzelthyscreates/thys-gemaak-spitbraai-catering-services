

# 2026 Menu Price Update Plan

## Summary
Update all menu prices, names, and descriptions to match the 2026 pricing from your uploaded menu images. This includes price changes to existing items, new menu options, and two entirely new categories.

---

## 1. Price and Name Updates (existing items)

The following changes will be made in `src/data/menuData.ts`:

| Menu Item | Field | Old Value | New Value |
|-----------|-------|-----------|-----------|
| Essential Celebration (birthday) | withoutCutlery | R149 | R159 |
| Deluxe Celebration (birthday) | withoutCutlery | R165 | R175 |
| Ultimate Birthday Feast | price | R195 | R200 |
| Ultimate Birthday Feast | withoutCutlery | R175 | R195 |
| Luxury Wedding Experience | price | R195 | R220 |
| Luxury Wedding Experience | withoutCutlery | R175 | R200 |
| Classic Wedding Celebration | withoutCutlery | R149 | R159 |
| Classic Spitbraai (standard) | withoutCutlery | R149 | R159 |
| Year-End Celebration | price | R160 | R170 |
| Year-End Celebration | withoutCutlery | R140 | R160 |
| Matric Farewell Essential | name | "...2025" | "...2026" |
| Matric Farewell Essential | withoutCutlery | R149 | R159 |
| Matric Farewell Premium | name | "...2025" | "...2026" |
| Matric Farewell Premium | withoutCutlery | R175 | R185 |
| Cheese Table | price | R1900 | R2500 |
| Fruit Table | price | R900 | R1500 |

---

## 2. New Standard Menu Variants

The 2026 menu shows the Standard Menu now has Classic Menu 1/2/3 (each R169 with different sides) plus a Deluxe option at R185. Currently there's only one standard option.

New items to add to `menuData.ts` under `eventType: 'standard'`:

- **Classic Menu 1** -- R169 (without cutlery R159): Lamb Spit main with Garlic Bread, Curry Noodle and Green Salad
- **Classic Menu 2** -- R169 (without cutlery R159): Lamb Spit main with Garlic Bread, Three Bean and Green Salad
- **Classic Menu 3** -- R169 (without cutlery R159): Lamb Spit main with Garlic Bread, Baby Potatoes and Baby Carrots
- **Deluxe Celebration Experience** -- R185 (without cutlery R175): Lamb Spit Main, Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads/Sides

The existing single "Classic Spitbraai Selection" will be replaced by these 4 options.

---

## 3. New: Braai Only Catering

Add a new event type `braaionly` with one menu option:

- **Braai Only Catering** -- R160: Lamb Chop, Drumstick and Sausage with Garlic Bread, Two Salads (Potato or Green Salad or Curry Noodle Salad)

This requires:
- Adding the event type in `EventTypeSelector.tsx` (with a suitable icon like `Flame`)
- Adding the menu option in `menuData.ts`

---

## 4. New: Platter Menu

Add a new event type `platters` with all platter items. These are flat-priced items (not per-person), so they work more like the current "extras" but as standalone orders:

| Platter | Price |
|---------|-------|
| Mixed Fruit Platter | R390 |
| Savory Platter | R450 |
| Mixed Meat Platter | R580 |
| Cheese Platter | R480 |
| Cold Meat Platter | R450 |
| Chicken Platter | R480 |
| Custom Platter - Cocktail Burgers (20 guests) | R350 |
| Custom Platter - Chicken Wraps (20 guests) | R350 |
| Cheese Table (30 guests) | R2500 |
| Fruit Table (30 guests) | R1500 |

This requires:
- Adding the event type in `EventTypeSelector.tsx`
- Adding all platter menu items in `menuData.ts`

---

## 5. New Extra: Chicken Drumstick

Add a new extra option:
- **Chicken Drumstick** -- R15 per person

---

## 6. Label Updates

- In `MenuPackages.tsx`: Update "Matric Farewell 2025 Packages" to "Matric Farewell 2026 Packages"

---

## Files to Modify

1. **`src/data/menuData.ts`** -- All price updates, new menu items, new platter items, new braai-only item, new chicken drumstick extra
2. **`src/components/menu/EventTypeSelector.tsx`** -- Add "Braai Only Catering" and "Platters" event types
3. **`src/components/menu/MenuPackages.tsx`** -- Add group configs for new event types, update matric label to 2026
4. **`src/types/menu.ts`** -- Update `eventType` union type to include `'braaionly'` and `'platters'`

