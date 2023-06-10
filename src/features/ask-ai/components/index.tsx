import ArrowUpIcon from "@assets/up-round-arrow.svg";
import AutoGrowTextArea from "@lib/AutoGrowTextArea";
import ElectricBrainIcon from "@assets/brain-electricity.svg";

import { makeRenderResourcesForUiComponent } from "@core/index";

function AIInput() {
  return (
    <div className='ai-input-container'>
      <form className='ai-input-content'>
        <span className='ai-input-icon'>
          <ElectricBrainIcon />
        </span>
        <AutoGrowTextArea autoFocus rows={1} placeholder='Ask AI' />
        <button type='submit'>
          <ArrowUpIcon />
        </button>
      </form>
    </div>
  );
}

export const makeRenderResourcesForAIInputElem =
  makeRenderResourcesForUiComponent(AIInput);
