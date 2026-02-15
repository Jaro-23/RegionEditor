import { PopupStruct, PopupDefinition, PopupDefType } from './types.js';

export class PopupElement extends HTMLElement {
  private saveFunc: (data: PopupStruct) => void = () => {};
  private data: PopupStruct = {};

  connectedCallback() {
    this.loadPopup(this.innerHTML);
  }

  public loadFromStruct(
    title: string,
    definition: PopupDefinition,
    saveFunc: (data: PopupStruct) => void,
  ): void {
    this.data = {};
    this.saveFunc = saveFunc;

    // Reconstruct the popup fields based of the data
    let inner: string = `<h1>${title}</h1>`;

    const id: string = this.getId();
    definition.forEach((field) => {
      this.data[field.fieldName] = field.value;
      inner += `
        <div class="popup-row">
          <p>${field.displayName}:</p>
          <input type="${this.typeToInputType(field.type)}" value="${field.value.toString()}" id="${id}-${field.fieldName}">
        </div>
      `;
    });

    // Load the new fields into the popup
    this.loadPopup(inner);

    // Bind functionality of each field to the data structure
    definition.forEach((field) => {
      const input: HTMLInputElement | null = document.getElementById(
        `${id}-${field.fieldName}`,
      ) as HTMLInputElement;
      if (!input) return; // Should never be true
      input.addEventListener('input', () => {
        const val: string = input.value.trim();
        switch (field.type) {
          case PopupDefType.string:
            this.data[field.fieldName] = val;
            break;
          case PopupDefType.number:
            this.data[field.fieldName] = parseFloat(val);
            break;
        }
      });
    });
  }

  public showError(error: string): void {
    const id: string = this.getId();
    const errorBox = document.getElementById(`popup-error-${id}`);
    if (!errorBox) return; // Should never happen
    errorBox.innerHTML = error;
    errorBox.style.display = 'block';
  }

  public show(): void {
    this.style.display = 'flex';
  }

  public hide(): void {
    this.style.display = 'none';
  }

  private typeToInputType(type: PopupDefType): string {
    switch (type) {
      case PopupDefType.string:
        return 'text';
      case PopupDefType.number:
        return 'number';
    }
    return 'text';
  }

  private loadPopup(inner: string): void {
    const id = this.getId();
    this.innerHTML = `
      <div class="popup-background"></div>
      <div class="popup">
        <p class="popup-error" id="popup-error-${id}"></p>
        ${inner}
        <div class="popup-final-row">
          <input type="button" value="Cancel" id="cancel-${id}">
          <input type="button" value="Save" id="save-${id}">
        </div>
      </div>
    `;

    const cancel = document.getElementById(`cancel-${id}`);
    if (cancel)
      cancel.onclick = () => {
        this.hide();
      };
    const save = document.getElementById(`save-${id}`);
    if (save)
      save.onclick = () => {
        this.saveFunc(this.data);
      };
  }

  private getId(): string {
    return this.getAttribute('id') || 'popup';
  }
}

customElements.define('popup-modal', PopupElement);
