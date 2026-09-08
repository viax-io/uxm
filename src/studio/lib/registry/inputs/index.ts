import { checkboxDef } from './checkbox';
import { codeEditorDef } from './code-editor';
import { colorInputDef } from './color-input';
import { currencyInputDef } from './currency-input';
import { dateInputDef } from './date-input';
import { editableCellDef } from './editable-cell';
import { fileUploadDef } from './file-upload';
import { inputTextDef } from './input-text';
import { inputWithIconDef } from './input-with-icon';
import { listboxDef } from './listbox';
import { menuDef } from './menu';
import { numberInputDef } from './number-input';
import { numberStepperDef } from './number-stepper';
import { passwordInputDef } from './password-input';
import { phoneInputDef } from './phone-input';
import { radioGroupDef } from './radio-group';
import { searchDropdownDef } from './search-dropdown';
import { selectDropdownDef } from './select-dropdown';
import { sliderDef } from './slider';
import { textareaDef } from './textarea';
import { timeInputDef } from './time-input';
import { toggleSwitchDef } from './toggle-switch';

import type { ComponentDef } from '../../types';

// One file per atom (`<id>.ts`), assembled here in sidebar order — the order
// is the only thing this file owns. Add a new def as a new file + one line
// here; `scripts/check-state-var-drift.mjs` globs the folder.
export const inputsDefs: ComponentDef[] = [
  // ── Inputs ──
  inputTextDef,
  editableCellDef,
  inputWithIconDef,
  passwordInputDef,
  colorInputDef,
  dateInputDef,
  timeInputDef,
  phoneInputDef,
  sliderDef,
  numberStepperDef,
  numberInputDef,
  currencyInputDef,
  textareaDef,
  codeEditorDef,
  fileUploadDef,
  selectDropdownDef,
  searchDropdownDef,
  listboxDef,
  menuDef,
  checkboxDef,
  toggleSwitchDef,
  radioGroupDef,
];
