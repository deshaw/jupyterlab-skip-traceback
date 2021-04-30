import { IRenderMime, IRenderMimeRegistry } from '@jupyterlab/rendermime';
import SkipTracebackWidget from './SkipTracebackWidget';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/vnd.jupyter.error';
const PLUGIN_NAME = 'jupyterlab-skip-traceback';

/**
 * A mime renderer factory for jupyter_exec_error data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: (options: IRenderMime.IRendererOptions) =>
    new SkipTracebackWidget(options),
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: 'jupyterlab-skip-traceback:rendermime',
  rendererFactory,
  rank: 0,
  dataType: 'json',
};

const extensionSettings: JupyterFrontEndPlugin<void> = {
  id: `${PLUGIN_NAME}:plugin`,
  autoStart: true,
  requires: [IRenderMimeRegistry, ISettingRegistry],
  activate: function (
    app: JupyterFrontEnd,
    rendermime: IRenderMimeRegistry,
    settingRegistry: ISettingRegistry
  ) {
    function updateSettings(settings: ISettingRegistry.ISettings) {
      const enabled = settings.get('enabled').composite;
      if (enabled) {
        // Safe to do multiple times as the code replaces the current one
        rendermime.addFactory(extension.rendererFactory, extension.rank);
      } else {
        // We assume we were the only mime render ever installed and nothing removed us already
        extension.rendererFactory.mimeTypes.forEach((type) =>
          rendermime.removeMimeType(type)
        );
      }
      const collapsed = settings.get('collapsed').composite;
      SkipTracebackWidget.setDefaults({ collapsed });
    }

    settingRegistry.load(`${PLUGIN_NAME}:settings`).then(
      (settings: ISettingRegistry.ISettings) => {
        updateSettings(settings);
        settings.changed.connect(updateSettings);
      },
      (err: Error) => {
        console.error(
          `Could not load settings, so did not active ${PLUGIN_NAME}: ${err}`
        );
      }
    );
    // eslint-disable-next-line no-console
    console.log('JupyterLab extension jupyterlab-skip-traceback is activated!');
  },
};

export default extensionSettings;
