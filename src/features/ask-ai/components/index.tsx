import { makeRenderResourcesForUiComponent } from "src/core";
import AutoGrowTextArea from "src/lib/AutoGrowTextArea";

function AIInput() {
  return (
    <div className='ai-input-container'>
      <div className='ai-input-content'>
        <AutoGrowTextArea autoFocus rows={1} placeholder='Ask AI' />
      </div>
    </div>
  );
}

export const makeRenderResourcesForAIInputElem =
  makeRenderResourcesForUiComponent(AIInput);
