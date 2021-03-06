/** 
 * Kendo UI v2017.1.223 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2017 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/

(function(f){
    if (typeof define === 'function' && define.amd) {
        define(["kendo.core"], f);
    } else {
        f();
    }
}(function(){
(function ($, undefined) {
/* Filter menu operator messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.operators =
$.extend(true, kendo.ui.FilterCell.prototype.options.operators,{
  "date": {
    "eq": "??????????",
    "gte": "?????????? ?????? ??????????",
    "gt": "??????????",
    "lte": "???? ?????? ??????????",
    "lt": "????",
    "neq": "???? ??????????"
  },
  "number": {
    "eq": "??????????",
    "gte": "???????????? ?????? ??????????",
    "gt": "????????????",
    "lte": "???????????? ?????? ??????????",
    "lt": "????????????",
    "neq": "???? ??????????"
  },
  "string": {
    "endswith": "???????????????????????? ????",
    "eq": "??????????",
    "neq": "???? ??????????",
    "startswith": "?????????????????????????? ????",
    "contains": "??????????????????????",
    "doesnotcontain": "???? ????????????????"
  },
  "enums": {
    "eq": "??????????",
    "neq": "???? ??????????"
  }
});
}

/* Filter menu operator messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.operators =
$.extend(true, kendo.ui.FilterMenu.prototype.options.operators,{
  "date": {
    "eq": "??????????",
    "gte": "?????????? ?????? ??????????",
    "gt": "??????????",
    "lte": "???? ?????? ??????????",
    "lt": "????",
    "neq": "???? ??????????"
  },
  "number": {
    "eq": "??????????",
    "gte": "???????????? ?????? ??????????",
    "gt": "????????????",
    "lte": "???????????? ?????? ??????????",
    "lt": "????????????",
    "neq": "???? ??????????"
  },
  "string": {
    "endswith": "???????????????????????? ????",
    "eq": "??????????",
    "neq": "???? ??????????",
    "startswith": "?????????????????????????? ????",
    "contains": "??????????????????????",
    "doesnotcontain": "???? ????????????????"
  },
  "enums": {
    "eq": "??????????",
    "neq": "???? ??????????"
  }
});
}

/* ColumnMenu messages */

if (kendo.ui.ColumnMenu) {
kendo.ui.ColumnMenu.prototype.options.messages =
$.extend(true, kendo.ui.ColumnMenu.prototype.options.messages,{
  "columns": "??????????????",
  "sortAscending": "???????????????????? ???? ??????????????????????",
  "sortDescending": "???????????????????? ???? ????????????????",
  "settings": "?????????????????? ????????????????",
  "done": "C????????????????",
  "lock": "????????????????",
  "unlock": "????????????????",
  "filter": "??????????????????????"
});
}

/* RecurrenceEditor messages */

if (kendo.ui.RecurrenceEditor) {
kendo.ui.RecurrenceEditor.prototype.options.messages =
$.extend(true, kendo.ui.RecurrenceEditor.prototype.options.messages,{
  "daily": {
    "interval": "days(s)",
    "repeatEvery": "Repeat every:"
  },
  "end": {
    "after": "After",
    "occurrence": "occurrence(s)",
    "label": "End:",
    "never": "Never",
    "on": "On",
    "mobileLabel": "Ends"
  },
  "frequencies": {
    "daily": "Daily",
    "monthly": "Monthly",
    "never": "Never",
    "weekly": "Weekly",
    "yearly": "Yearly"
  },
  "monthly": {
    "day": "Day",
    "interval": "month(s)",
    "repeatEvery": "Repeat every:",
    "repeatOn": "Repeat on:"
  },
  "offsetPositions": {
    "first": "first",
    "fourth": "fourth",
    "last": "last",
    "second": "second",
    "third": "third"
  },
  "weekly": {
    "repeatEvery": "Repeat every:",
    "repeatOn": "Repeat on:",
    "interval": "week(s)"
  },
  "yearly": {
    "of": "of",
    "repeatEvery": "Repeat every:",
    "repeatOn": "Repeat on:",
    "interval": "year(s)"
  },
  "weekdays": {
    "day": "day",
    "weekday": "weekday",
    "weekend": "weekend day"
  }
});
}

/* Grid messages */

if (kendo.ui.Grid) {
kendo.ui.Grid.prototype.options.messages =
$.extend(true, kendo.ui.Grid.prototype.options.messages,{
  "commands": {
    "create": "????????????????",
    "destroy": "??????????????",
    "canceledit": "????????????",
    "update": "????????????????",
    "edit": "????????????????",
    "excel": "Export to Excel",
    "pdf": "Export to PDF",
    "select": "??????????????",
    "cancel": "???????????????? ??????????????????",
    "save": "?????????????????? ??????????????????"
  },
  "editable": {
    "confirmation": "???? ??????????????, ?????? ???????????? ?????????????? ?????? ?????????????",
    "cancelDelete": "????????????",
    "confirmDelete": "??????????????"
  },
  "noRecords": "?????? ?????????????? ????????????????."
});
}

/* Pager messages */

if (kendo.ui.Pager) {
kendo.ui.Pager.prototype.options.messages =
$.extend(true, kendo.ui.Pager.prototype.options.messages,{
  "allPages": "All",
  "page": "????????????????",
  "display": "???????????????????? ???????????? {0} - {1} ???? {2}",
  "of": "???? {0}",
  "empty": "?????? ?????????????? ?????? ??????????????????????",
  "refresh": "????????????????",
  "first": "?????????????????? ???? ???????????? ????????????????",
  "itemsPerPage": "?????????????????? ???? ????????????????",
  "last": "?? ?????????????????? ????????????????",
  "next": "?????????????????? ???? ?????????????????? ????????????????",
  "previous": "?????????????? ???? ???????????????????? ????????????????",
  "morePages": "???????????? ??????????????"
});
}

/* FilterCell messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.messages =
$.extend(true, kendo.ui.FilterCell.prototype.options.messages,{
  "filter": "??????????????????????",
  "clear": "????????????????",
  "isFalse": "????????",
  "isTrue": "????????????",
  "operator": "????????????????"
});
}

/* FilterMenu messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.messages =
$.extend(true, kendo.ui.FilterMenu.prototype.options.messages,{
  "filter": "??????????????????????",
  "and": "??",
  "clear": "????????????????",
  "info": "???????????? ???? ????????????????????",
  "selectValue": "-????????????????-",
  "isFalse": "????????",
  "isTrue": "????????????",
  "or": "??????",
  "cancel": "????????????",
  "operator": "????????????????",
  "value": "????????????????"
});
}

/* FilterMultiCheck messages */

if (kendo.ui.FilterMultiCheck) {
kendo.ui.FilterMultiCheck.prototype.options.messages =
$.extend(true, kendo.ui.FilterMultiCheck.prototype.options.messages,{
  "search": "??????????"
});
}

/* Groupable messages */

if (kendo.ui.Groupable) {
kendo.ui.Groupable.prototype.options.messages =
$.extend(true, kendo.ui.Groupable.prototype.options.messages,{
  "empty": "?????????????????????? ???????? ?????????????????? ??????????????, ?????????? ???????????????????????? ???????????? ???? ???????? ??????????????"
});
}

/* Editor messages */

if (kendo.ui.Editor) {
kendo.ui.Editor.prototype.options.messages =
$.extend(true, kendo.ui.Editor.prototype.options.messages,{
  "bold": "????????????????????",
  "createLink": "???????????????? ??????????????????????",
  "fontName": "??????????",
  "fontNameInherit": "(?????????? ?????? ?? ??????????????????)",
  "fontSize": "?????????????? ???????????? ????????????",
  "fontSizeInherit": "(???????????? ?????? ?? ??????????????????)",
  "formatBlock": "?????????? ??????????????????????",
  "indent": "?????????????????? ????????????",
  "insertHtml": "???????????????? HTML",
  "insertImage": "??????????????????????",
  "insertOrderedList": "???????????????????????? ????????????",
  "insertUnorderedList": "??????????????????????????????????????",
  "italic": "????????????",
  "justifyCenter": "???? ????????????",
  "justifyFull": "???? ????????????",
  "justifyLeft": "??????????",
  "justifyRight": "????????????",
  "outdent": "?????????????????? ????????????",
  "strikethrough": "??????????????????????",
  "styles": "??????????",
  "subscript": "?????? ??????????????",
  "superscript": "?????? ??????????????",
  "underline": "????????????????????????",
  "unlink": "?????????????? ??????????????????????",
  "dialogButtonSeparator": "??????",
  "dialogCancel": "????????????",
  "dialogInsert": "????????????????",
  "imageAltText": "Alternate text",
  "imageWebAddress": "?????? ??????????",
  "linkOpenInNewWindow": "?????????????? ?? ?????????? ????????",
  "linkText": "??????????",
  "linkToolTip": "?????????????????????? ??????????????????",
  "linkWebAddress": "?????? ??????????",
  "search": "??????????",
  "createTable": "???????????????? ??????????????",
  "addColumnLeft": "Add column on the left",
  "addColumnRight": "Add column on the right",
  "addRowAbove": "Add row above",
  "addRowBelow": "Add row below",
  "deleteColumn": "Delete column",
  "deleteRow": "Delete row",
  "backColor": "Background color",
  "deleteFile": "Are you sure you want to delete \"{0}\"?",
  "directoryNotFound": "A directory with this name was not found.",
  "dropFilesHere": "drop files here to upload",
  "emptyFolder": "Empty Folder",
  "foreColor": "Color",
  "invalidFileType": "The selected file \"{0}\" is not valid. Supported file types are {1}.",
  "orderBy": "Arrange by:",
  "orderByName": "Name",
  "orderBySize": "Size",
  "overwriteFile": "'A file with name \"{0}\" already exists in the current directory. Do you want to overwrite it?",
  "uploadFile": "Upload",
  "formatting": "Format",
  "viewHtml": "View HTML",
  "dialogUpdate": "Update",
  "insertFile": "Insert file"
});
}

/* Upload messages */

if (kendo.ui.Upload) {
kendo.ui.Upload.prototype.options.localization =
$.extend(true, kendo.ui.Upload.prototype.options.localization,{
  "cancel": "???????????????? ????????????????",
  "dropFilesHere": "???????????????????? ???????? ?????????? ?????? ????????????????",
  "remove": "??????????????",
  "retry": "??????????????????",
  "select": "??????????????...",
  "statusFailed": "???????????????? ????????????????",
  "statusUploaded": "??????????????????",
  "statusUploading": "??????????????????????",
  "uploadSelectedFiles": "?????????????????? ?????????????????? ??????????",
  "headerStatusUploaded": "????????????",
  "headerStatusUploading": "??????????????????????..."
});
}

/* Scheduler messages */

if (kendo.ui.Scheduler) {
kendo.ui.Scheduler.prototype.options.messages =
$.extend(true, kendo.ui.Scheduler.prototype.options.messages,{
  "allDay": "all day",
  "cancel": "????????????",
  "editable": {
    "confirmation": "Are you sure you want to delete this event?"
  },
  "date": "Date",
  "destroy": "Delete",
  "editor": {
    "allDayEvent": "All day event",
    "description": "Description",
    "editorTitle": "Event",
    "end": "End",
    "endTimezone": "End timezone",
    "repeat": "Repeat",
    "separateTimezones": "Use separate start and end time zones",
    "start": "Start",
    "startTimezone": "Start timezone",
    "timezone": " ",
    "timezoneEditorButton": "Time zone",
    "timezoneEditorTitle": "Timezones",
    "title": "Title",
    "noTimezone": "No timezone"
  },
  "event": "Event",
  "recurrenceMessages": {
    "deleteRecurring": "Do you want to delete only this event occurrence or the whole series?",
    "deleteWindowOccurrence": "Delete current occurrence",
    "deleteWindowSeries": "Delete the series",
    "deleteWindowTitle": "Delete Recurring Item",
    "editRecurring": "Do you want to edit only this event occurrence or the whole series?",
    "editWindowOccurrence": "Edit current occurrence",
    "editWindowSeries": "Edit the series",
    "editWindowTitle": "Edit Recurring Item"
  },
  "save": "Save",
  "time": "Time",
  "today": "Today",
  "views": {
    "agenda": "Agenda",
    "day": "Day",
    "month": "Month",
    "week": "Week",
    "workWeek": "Work Week"
  },
  "deleteWindowTitle": "Delete event",
  "showFullDay": "Show full day",
  "showWorkDay": "Show business hours"
});
}

/* Validator messages */

if (kendo.ui.Validator) {
kendo.ui.Validator.prototype.options.messages =
$.extend(true, kendo.ui.Validator.prototype.options.messages,{
  "required": "{0} ????????????????????",
  "pattern": "{0} ???? ??????????",
  "min": "{0} ???????????? ???????? ???????????? ?????? ?????????? {1}",
  "max": "{0} ???????????? ???????? ???????????? ?????? ?????????? {1}",
  "step": "{0} ???? ??????????",
  "email": "{0} ???? ???????????????????? email",
  "url": "{0} ???? ???????????????????? URL",
  "date": "{0} ???? ???????????????????? ????????"
});
}

/* Dialog */

if (kendo.ui.Dialog) {
kendo.ui.Dialog.prototype.options.messages =
$.extend(true, kendo.ui.Dialog.prototype.options.localization, {
  "close": "??????????????"
});
}

/* Alert */

if (kendo.ui.Alert) {
kendo.ui.Alert.prototype.options.messages =
$.extend(true, kendo.ui.Alert.prototype.options.localization, {
  "okText": "????"
});
}

/* Confirm */

if (kendo.ui.Confirm) {
kendo.ui.Confirm.prototype.options.messages =
$.extend(true, kendo.ui.Confirm.prototype.options.localization, {
  "okText": "????",
  "cancel": "????????????"
});
}

/* Prompt */
if (kendo.ui.Prompt) {
kendo.ui.Prompt.prototype.options.messages =
$.extend(true, kendo.ui.Prompt.prototype.options.localization, {
  "okText": "????",
  "cancel": "????????????"
});
}

})(window.kendo.jQuery);
}));