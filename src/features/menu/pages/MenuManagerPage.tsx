import { PageChanger } from '@/features/menu/components/PageChanger';
import { GroupLabelButton } from '@/features/menu/components/GroupLabelButton';
import { ViewSelector } from '@/features/menu/components/ViewSelector';
import { MenuDisplay } from '@/features/menu/components/MenuDisplay';
import { SupportFrame } from '@/features/menu/components/SupportFrame';
import { DishChart } from '@/features/menu/components/DishChart';

export function MenuManagerPage() {
  return (
    <div className="w-full h-full flex gap-6 items-stretch overflow-hidden bg-brand-background select-none">
      
      {/* COLUMN 1: LEFT COMPACT OPERATIONS COLUMN (Sits below sidebar action zone footprint) */}
      <div className="w-16 flex flex-col gap-4 pt-20 shrink-0 h-full items-center">
        {/* Component 1: Page Changer */}
        <PageChanger 
          onPageUp={() => console.log('Inject code: Page Increment')} 
          onPageDown={() => console.log('Inject code: Page Decrement')}
        />
        {/* Component 2: Group Label Button */}
        <GroupLabelButton 
          onClick={() => console.log('Inject code: Shift layout to page 2 view state')} 
        />
      </div>

      {/* COLUMN 2: CENTRAL INTERACTIVE VIEWPORT COLUMN */}
      <div className="flex-1 flex flex-col items-stretch h-full min-w-[320px]">
        {/* Component 3: View Selector (Touches extreme top bounds) */}
        <div className="h-16 shrink-0 flex justify-center">
          <ViewSelector 
            onToggleView={(mode) => console.log(`Inject code: Switch grid viewport profile to ${mode}`)}
          />
        </div>
        {/* Component 4: Menu Display (Takes all remaining fluid vertical layout context) */}
        <div className="flex-1 pb-4 pt-4">
          <MenuDisplay 
            onImageClick={(coords) => console.log(`Inject code: Capture mapping tag at coordinate X: ${coords.x} Y: ${coords.y}`)}
          />
        </div>
      </div>

      {/* COLUMN 3: RIGHT ANALYTICS & RECTIFICATION DATA COLUMN */}
      <div className="w-112.5 lg:w-130 flex flex-col items-stretch h-full shrink-0">
        {/* Component 5: Support Frame (Touches extreme top bounds) */}
        <div className="h-16 shrink-0 flex justify-center">
          <SupportFrame 
            onUndo={() => console.log('Inject code: Revert operation history queue')}
            onRedo={() => console.log('Inject code: Re-apply operation history queue')}
          />
        </div>
        {/* Component 6: Dish Chart Data Table Matrix Grid Wrapper */}
        <div className="flex-1 pb-4 pt-4">
          <DishChart 
            onEditItem={(id) => console.log(`Inject code: Open cell-editor inline context overlay for element id ${id}`)}
          />
        </div>
      </div>

    </div>
  );
}