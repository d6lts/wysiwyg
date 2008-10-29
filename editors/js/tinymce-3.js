// $Id$

/**
 * Initialize editor instances.
 *
 * @todo Is the following note still valid for 3.x?
 * This function needs to be called before the page is fully loaded, as
 * calling tinyMCE.init() after the page is loaded breaks IE6.
 *
 * @param editorSettings
 *   An object containing editor settings for each enabled editor theme.
 */
Drupal.wysiwyg.editor.init.tinymce = function(editorSettings) {
  // If JS compression is enabled, TinyMCE is unable to find its own base path
  // and exec mode, hence we need to define it manually.
  // @todo Move global library settings somewhere else.
  tinyMCE.baseURL = Drupal.settings.wysiwyg.editorBasePath;
  tinyMCE.srcMode = (Drupal.settings.wysiwyg.execMode == 'src' ? '_src' : '');
  tinyMCE.gzipMode = (Drupal.settings.wysiwyg.execMode == 'gzip');

  // Initialize editor configurations.
  for (var theme in editorSettings) {
    tinyMCE.init(editorSettings[theme]);
  }
  for (var plugin in Drupal.settings.wysiwyg.plugins.tinymce) {
    tinymce.PluginManager.load(plugin, Drupal.settings.wysiwyg.plugins.tinymce[plugin]);
  }
};

/**
 * Attach this editor to a target element.
 *
 * See Drupal.wysiwyg.editor.attach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.attach.tinymce = function(context, params, editorSettings) {
  // Configure settings for this theme.
  for (var setting in editorSettings[params.theme]) {
    tinyMCE.settings[setting] = editorSettings[params.theme][setting];
  }
  // Attach editor control if default is on.
  if (Drupal.settings.wysiwyg.status) {
    tinyMCE.execCommand('mceAddControl', true, params.field);
  }
};

/**
 * Detach a single or all editors.
 *
 * See Drupal.wysiwyg.editor.detach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.detach.tinymce = function(context, params) {
  if (typeof params != 'undefined') {
    var editor = tinyMCE.get(params.field);
    if (editor) {
      editor.save();
      editor.remove();
    }
  }
  else {
    // Save contents of all editors back into textareas.
    tinyMCE.triggerSave();
    // Remove all editor instances.
    for (var instanceId in tinyMCE.editors) {
      tinyMCE.editors[instanceId].remove();
    }
  }
};
