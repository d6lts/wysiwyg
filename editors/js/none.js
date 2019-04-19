(function($) {

/**
 * Attach this editor to a target element.
 *
 * @param context
 *   A DOM element, supplied by Drupal.attachBehaviors().
 * @param params
 *   An object containing input format parameters. Default parameters are:
 *   - editor: The internal editor name.
 *   - theme: The name/key of the editor theme/profile to use.
 *   - field: The CSS id of the target element.
 * @param settings
 *   An object containing editor settings for all enabled editor themes.
 */
Drupal.wysiwyg.editor.attach.none = function(context, params, settings) {
  var $field = this.$field;
  if (params.resizable) {
    $field.addClass('resizable').css({display: ''});
    if (Drupal.behaviors.textarea) {
      Drupal.behaviors.textarea(context);
    }
  }
  // This helper looks for changes on the supplied element and notifies Wysiwyg
  // when contents have changed. If the editor provides equivalent events it is
  // sufficient to call this.contentsChanged() directly on such events. Multiple
  // helpers may be added and can put conditions on when the notification is
  // actually passed along to Wysiwyg. All watchers are removed automatically
  // after an instance is destroyed, or by calling this.stopWatching().
  this.startWatching($field);
};

/**
 * Detach a single or all editors.
 *
 * The editor syncs its contents back to the original field before its instance
 * is removed.
 *
 * @param context
 *   A DOM element, supplied by Drupal.attachBehaviors().
 * @param params
 *   (optional) An object containing input format parameters. If defined,
 *   only the editor instance in params.field should be detached. Otherwise,
 *   all editors should be detached and saved, so they can be submitted in
 *   AJAX/AHAH applications.
 * @param trigger
 *   A string describing why the editor is being detached.
 *   Possible triggers are:
 *   - unload: (default) Another or no editor is about to take its place.
 *   - move: Currently expected to produce the same result as unload.
 *   - serialize: The form is about to be serialized before an AJAX request or
 *     a normal form submission. If possible, perform a quick detach and leave
 *     the editor's GUI elements in place to avoid flashes or scrolling issues.
 * @see Drupal.detachBehaviors
 */
Drupal.wysiwyg.editor.detach.none = function (context, params, trigger) {
  if (trigger != 'serialize') {
    // This will be called before any editor instances exist.
    var $field = $('#' + params.field, context);
    // Store the unaltered content so it can be restored if no changes
    // intentionally made by the user were detected, such as those caused by
    // WYSIWYG editors when initially parsing and loading content.
    $field.attr('data-wysiwyg-value-original', $field.val()).attr('data-wysiwyg-value-is-changed', 'false');
    // Switch to using any pre-filtered content if it exists.
    if ($field.attr('data-wysiwyg-value-filtered')) {
      // Pre-filtered content is only valid once.
      $field.val($field.attr('data-wysiwyg-value-filtered')).removeAttr('data-wysiwyg-value-filtered');
    }
    $field.removeClass('textarea-processed').removeClass('resizable');
    var $div = $field.parents('div.resizable-textarea');
    $div.before($field);
    $div.remove();
  }
};

/**
 * Instance methods for plain text areas.
 */
Drupal.wysiwyg.editor.instance.none = {
  insert: function(content) {
    var editor = document.getElementById(this.field);

    // IE support.
    if (document.selection) {
      editor.focus();
      var sel = document.selection.createRange();
      sel.text = content;
    }
    // Mozilla/Firefox/Netscape 7+ support.
    else if (editor.selectionStart || editor.selectionStart == '0') {
      var startPos = editor.selectionStart;
      var endPos = editor.selectionEnd;
      editor.value = editor.value.substring(0, startPos) + content + editor.value.substring(endPos, editor.value.length);
    }
    // Fallback, just add to the end of the content.
    else {
      editor.value += content;
    }
  },

  setContent: function (content) {
    $('#' + this.field).val(content);
  },

  getContent: function () {
    return $('#' + this.field).val();
  }
};

})(jQuery);
