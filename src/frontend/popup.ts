import { CustomFields, CustomFieldType } from './types.js';

export class PopupElement extends HTMLElement {
  private saveFunc: (fields: CustomFields) => void = () => {};
  private cancelFunc: (fields: CustomFields) => void = () => {};
  private fields: CustomFields = {};

  connectedCallback() {
    this.loadPopup(this.innerHTML);
  }

  public loadFromStruct(
    title: string,
    fields: CustomFields,
    saveFunc: (fields: CustomFields) => void,
    cancelFunc: (fields: CustomFields) => void,
  ): void {
    this.fields = fields;
    this.saveFunc = saveFunc;
    this.cancelFunc = cancelFunc;

    // Reconstruct the popup fields based of the data
    let inner: string = `<h1>${title}</h1>`;

    const id: string = this.getId();
    for (const name in this.fields) {
      const field = this.fields[name];
      inner += `
        <div class="popup-row">
          <p>${field.displayName}</p>
          <input type="${this.typeToInputType(field.type)}" value="${field.value.toString()}" id="${id}-${name}">
        </div>
      `;
    }

    // Load the new fields into the popup
    this.loadPopup(inner);

    // Bind functionality of each field to the data structure
    for (const name in this.fields) {
      const field = this.fields[name];
      const input: HTMLInputElement | null = document.getElementById(
        `${id}-${name}`,
      ) as HTMLInputElement;
      if (!input) return; // Should never be true
      input.addEventListener('input', () => {
        const val: string = input.value.trim();
        switch (field.type) {
          case CustomFieldType.string:
            this.fields[name].value = val;
            break;
          case CustomFieldType.number:
            this.fields[name].value = parseFloat(val);
            break;
        }
      });
    }
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

  private typeToInputType(type: CustomFieldType): string {
    switch (type) {
      case CustomFieldType.string:
        return 'text';
      case CustomFieldType.number:
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
          <input type="button" style="background-color: #ef5350;" value="Cancel" id="cancel-${id}">
          <input type="button" style="background-color: #56ae57;" value="Save" id="save-${id}">
        </div>
      </div>
    `;

    const cancel = document.getElementById(`cancel-${id}`);
    if (cancel) cancel.onclick = () => this.cancelFunc(this.fields);
    const save = document.getElementById(`save-${id}`);
    if (save) save.onclick = () => this.saveFunc(this.fields);
  }

  private getId(): string {
    return this.getAttribute('id') || 'popup';
  }
}

customElements.define('popup-modal', PopupElement);
