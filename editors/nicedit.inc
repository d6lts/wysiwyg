<?php

/**
 * @file
 * Editor integration functions for NicEdit.
 */

/**
 * Plugin implementation of hook_editor().
 */
function wysiwyg_nicedit_editor() {
  $editor['nicedit'] = array(
    'title' => 'NicEdit',
    'vendor url' => 'http://nicedit.com',
    'download url' => 'http://nicedit.com/download.php',
    'libraries' => array(
      '' => array(
        'title' => 'Source',
        'files' => array('nicEdit.js'),
      ),
    ),
    'verified version range' => array('0.9', '0.9'),
    'deprecation message' => t('@editor is no longer being developed and support will be dropped by Wysiwyg module after May 2022.', array('@editor' => 'NicEdit')),
    'install note callback' => 'wysiwyg_deprecation_install_note',
    'version callback' => 'wysiwyg_nicedit_version',
    'settings form callback' => 'wysiwyg_nicedit_settings_form',
    'settings callback' => 'wysiwyg_nicedit_settings',
    'plugin callback' => '_wysiwyg_nicedit_plugins',
    'versions' => array(
      '0.9' => array(
        'js files' => array('nicedit.js'),
      ),
    ),
  );
  return $editor;
}

/**
 * Detect editor version.
 *
 * @param $editor
 *   An array containing editor properties as returned from hook_editor().
 *
 * @return
 *   The installed editor version.
 */
function wysiwyg_nicedit_version($editor) {
  // @see http://nicedit.com/forums/viewtopic.php?t=425
  return '0.9';
}

/**
 * Enhances the editor profile settings form for NicEdit.
 *
 * @see http://wiki.nicedit.com/w/page/515/Configuration%20Options
 */
function wysiwyg_nicedit_settings_form(&$form, &$form_state) {
  $form['basic']['language']['#access'] = FALSE;
  // NicEdit only supports loading a single stylesheet, and only in FF2.
  // This essentially means we're dropping stylesheet support for NiceEdit.
  $form['css']['#access'] = FALSE;
}

/**
 * Return runtime editor settings for a given wysiwyg profile.
 *
 * @param $editor
 *   A processed hook_editor() array of editor properties.
 * @param $config
 *   An array containing wysiwyg editor profile settings.
 * @param $theme
 *   The name of a theme/GUI/skin to use.
 *
 * @return
 *   A settings array to be populated in
 *   Drupal.settings.wysiwyg.configs.{editor}
 */
function wysiwyg_nicedit_settings($editor, $config, $theme) {
  $settings = array(
    'iconsPath' => base_path() . $editor['library path'] . '/nicEditorIcons.gif',
  );

  // Add configured buttons or all available.
  $settings['buttonList'] = array();
  if (!empty($config['buttons'])) {
    $buttons = array();
    foreach ($config['buttons'] as $plugin) {
      $buttons = array_merge($buttons, $plugin);
    }
    $settings['buttonList'] = array_keys($buttons);
  }

  // Add editor content stylesheet.
  // @todo Drop stylsheet support since it's only used in FF2.
  if (isset($config['css_setting'])) {
    if ($config['css_setting'] == 'theme') {
      $css = path_to_theme() . '/style.css';
      if (file_exists($css)) {
        $settings['externalCSS'] = base_path() . $css;
      }
    }
    elseif ($config['css_setting'] == 'self' && isset($config['css_path'])) {
      $settings['externalCSS'] = strtr($config['css_path'], array(
        '%b' => base_path(),
        '%t' => path_to_theme(),
        '%q' => variable_get('css_js_query_string', ''),
      ));
    }
  }

  return $settings;
}

/**
 * Return internal plugins for this editor; semi-implementation of hook_wysiwyg_plugin().
 */
function _wysiwyg_nicedit_plugins($editor) {
  return array(
    'default' => array(
      'buttons' => array(
        'bold' => t('Bold'), 'italic' => t('Italic'), 'underline' => t('Underline'),
        'strikethrough' => t('Strike-through'),
        'left' => t('Align left'), 'center' => t('Align center'), 'right' => t('Align right'),
        'ul' => t('Bullet list'), 'ol' => t('Numbered list'),
        'outdent' => t('Outdent'), 'indent' => t('Indent'),
        'image' => t('Image'),
        'forecolor' => t('Forecolor'), 'bgcolor' => t('Backcolor'),
        'superscript' => t('Superscript'), 'subscript' => t('Subscript'),
        'hr' => t('Horizontal rule'),
        // @todo New challenge: Optional internal plugins packaged into editor
        //   library.
        'link' => t('Link'), 'unlink' => t('Unlink'),
        'fontFormat' => t('HTML block format'), 'fontFamily' => t('Font'), 'fontSize' => t('Font size'),
        'xhtml' => t('Source code'),
      ),
      'internal' => TRUE,
    ),
  );
}

