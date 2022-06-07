import '../style/index.css';

import { Widget } from '@lumino/widgets';
import { IRenderMime, renderText } from '@jupyterlab/rendermime';
import { Clipboard } from '@jupyterlab/apputils/lib/clipboard';

const BTN_BASE_CLASS = 'minimal jp-Button';
const COPY_CLASS = `fa fa-fw fa-copy ${BTN_BASE_CLASS} right-align`;
const TOGGLE_CLOSED_CLASS = `fa fa-caret-right jp-ToolbarButtonComponent ${BTN_BASE_CLASS}`;
const TOGGLE_OPENED_CLASS = `fa fa-caret-down jp-ToolbarButtonComponent ${BTN_BASE_CLASS}`;
const SHORT_ERROR_CLASS = 'short-error';
const RED_BOLD_TEXT_CLASS = 'red-bold-text';

// Defined via: https://nbformat.readthedocs.io/en/latest/format_description.html#error
interface IError {
  output_type: string;
  ename: string; // Exception name, as a string
  evalue: string; // Exception value, as a string
  traceback: string[]; // The traceback will contain a list of frames, represented each as a string.
}

const messageInCollapsedState = (data: IError) => {
  return `<span class="${RED_BOLD_TEXT_CLASS}">${data.ename}</span>: ${data.evalue}`;
};

// prettier-ignore
export default class SkipTracebackWidget
  extends Widget
  implements IRenderMime.IRenderer {
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this._sanitizer = options.sanitizer;
  }

  private static _defaults = {
    collapsed: true,
  };

  static setDefaults(newDefaults: Record<string, unknown>): void {
    SkipTracebackWidget._defaults = {
      ...SkipTracebackWidget._defaults,
      ...newDefaults,
    };
  }

  _toggleTraceback(): void {
    if (this._toggleBtn && this._tracebackNode) {
      const isToggled = this._toggleBtn.className === TOGGLE_CLOSED_CLASS;
      if (isToggled) {
        this._toggleBtn.className = TOGGLE_OPENED_CLASS;
        this._shortError.innerHTML = '';
        this.node.appendChild(this._tracebackNode);
      } else {
        this._toggleBtn.className = TOGGLE_CLOSED_CLASS;
        this._shortError.innerHTML = messageInCollapsedState(this._data);
        this.node.removeChild(this._tracebackNode);
      }
    }
  }

  _copyTraceback(): void {
    if (this._tracebackNode) {
      Clipboard.copyToSystem(this._tracebackNode.textContent || '');
    }
  }

  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    this._data = model.data[this._mimeType] as unknown as IError;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = TOGGLE_CLOSED_CLASS;
    toggleBtn.onclick = this._toggleTraceback.bind(this);
    this._toggleBtn = toggleBtn;

    const shortError = document.createElement('pre');
    shortError.className = SHORT_ERROR_CLASS;
    shortError.innerHTML = messageInCollapsedState(this._data);
    shortError.onclick = this._toggleTraceback.bind(this);
    this._shortError = shortError;

    const copyBtn = document.createElement('button');
    copyBtn.className = COPY_CLASS;
    copyBtn.onclick = this._copyTraceback.bind(this);
    copyBtn.title = 'Copy full traceback to clipboard';

    const span = document.createElement('div');
    span.className = 'skip-traceback';
    span.appendChild(copyBtn);
    span.appendChild(toggleBtn);
    span.appendChild(shortError);

    const traceback = document.createElement('pre');
    const rt = renderText({
      host: traceback,
      sanitizer: this._sanitizer,
      // It should look like stderr
      source:
        (model.data['application/vnd.jupyter.stderr'] as string) ||
        this._data.traceback.join('\n'),
    });
    const tbDiv = document.createElement('div');
    tbDiv.className = 'jp-RenderedText';
    tbDiv.setAttribute('data-mime-type', 'application/vnd.jupyter.stderr');
    tbDiv.appendChild(traceback);
    // End hack due to issue
    this._tracebackNode = tbDiv;

    this.node.appendChild(span);

    if (!SkipTracebackWidget._defaults.collapsed) {
      this._toggleTraceback();
    }
    // Don't finish until we render the text
    return rt;
  }

  private _toggleBtn?: HTMLButtonElement;
  private _tracebackNode?: HTMLDivElement;
  private _sanitizer: IRenderMime.ISanitizer;
  private _data?: IError;
  private _mimeType: string;
  private _shortError?: HTMLPreElement;
}
