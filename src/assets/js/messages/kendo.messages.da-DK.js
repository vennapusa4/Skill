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
/* Filter cell operator messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.operators =
$.extend(true, kendo.ui.FilterCell.prototype.options.operators,{
  "date": {
    "eq": "Er lig med",
    "gte": "Er senere end eller lig med",
    "gt": "Er senere end",
    "lte": "Er f??r eller lig med",
    "lt": "Er f??r",
    "neq": "Er ikke lig med"
  },
  "number": {
    "eq": "Er lig med",
    "gte": "Er st??rre end eller lig med",
    "gt": "Er st??rre end",
    "lte": "Er mindre end eller lig med",
    "lt": "Er mindre end",
    "neq": "Er forskellig fra"
  },
  "string": {
    "endswith": "Slutter med",
    "eq": "Er lig med",
    "neq": "Er forskellig fra",
    "startswith": "Begynder med",
    "contains": "Indeholder",
    "doesnotcontain": "Ikke indeholder"
  },
  "enums": {
    "eq": "Er lig med",
    "neq": "Er ikke lig med"
  }
});
}

/* Filter menu operator messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.operators =
$.extend(true, kendo.ui.FilterMenu.prototype.options.operators,{
  "date": {
    "eq": "Er lig med",
    "gte": "Er senere end eller lig med",
    "gt": "Er senere end",
    "lte": "Er f??r eller lig med",
    "lt": "Er f??r",
    "neq": "Er forskellig fra"
  },
  "number": {
    "eq": "Er lig med",
    "gte": "Er st??rre end eller lig med",
    "gt": "Er st??rre end",
    "lte": "Er mindre end eller lig med",
    "lt": "Er mindre end",
    "neq": "Er forskellig fra"
  },
  "string": {
    "endswith": "Slutter med",
    "eq": "Er lig med",
    "neq": "Er forskellig fra",
    "startswith": "Begynder med",
    "contains": "Indeholder",
    "doesnotcontain": "Ikke indeholder"
  },
  "enums": {
    "eq": "Er lig med",
    "neq": "Er ikke lig med"
  }
});
}

/* FilterMultiCheck messages */

if (kendo.ui.FilterMultiCheck) {
kendo.ui.FilterMultiCheck.prototype.options.messages =
$.extend(true, kendo.ui.FilterMultiCheck.prototype.options.messages,{
  "search": "S??g"
});
}

/* ColumnMenu messages */

if (kendo.ui.ColumnMenu) {
kendo.ui.ColumnMenu.prototype.options.messages =
$.extend(true, kendo.ui.ColumnMenu.prototype.options.messages,{
  "columns": "??olonner",
  "sortAscending": "Sorter Stigende",
  "sortDescending": "Sorter Faldende",
  "settings": "Kolonneindstillinger",
  "done": "Udf??rt",
  "lock": "L??s",
  "unlock": "L??s op"
});
}

/* RecurrenceEditor messages */

if (kendo.ui.RecurrenceEditor) {
kendo.ui.RecurrenceEditor.prototype.options.messages =
$.extend(true, kendo.ui.RecurrenceEditor.prototype.options.messages,{
  "daily": {
    "interval": "days(s)",
    "repeatEvery": "Gentag hver:"
  },
  "end": {
    "after": "Efter",
    "occurrence": "forekomst(er)",
    "label": "Slut:",
    "never": "Aldrig",
    "on": "Den",
    "mobileLabel": "Slutter"
  },
  "frequencies": {
    "daily": "Daglig",
    "monthly": "M??nedlig",
    "never": "Aldrig",
    "weekly": "Ugentlig",
    "yearly": "??rlig"
  },
  "monthly": {
    "day": "Dag",
    "interval": "m??ned(er)",
    "repeatEvery": "Gentag hver:",
    "repeatOn": "Gentag den:"
  },
  "offsetPositions": {
    "first": "f??rste",
    "fourth": "fjerde",
    "last": "sidste",
    "second": "anden",
    "third": "tredje"
  },
  "weekly": {
    "repeatEvery": "Gentag hver:",
    "repeatOn": "Gentag den:",
    "interval": "uge(r)"
  },
  "yearly": {
    "of": "of",
    "repeatEvery": "Gentag hvert:",
    "repeatOn": "Gentag den:",
    "interval": "??r"
  },
  "weekdays": {
    "day": "dag",
    "weekday": "ugedag",
    "weekend": "weekend dag"
  }
});
}

/* Grid messages */

if (kendo.ui.Grid) {
kendo.ui.Grid.prototype.options.messages =
$.extend(true, kendo.ui.Grid.prototype.options.messages,{
  "commands": {
    "create": "Inds??t",
    "destroy": "Slet",
    "canceledit": "Fortryd",
    "update": "Opdat??r",
    "edit": "Redig??r",
    "excel": "Eksport??r til Excel",
    "pdf": "Eksport??r til PDF",
    "select": "V??lg",
    "cancel": "Fortryd ??ndringer",
    "save": "Gem ??ndringer"
  },
  "editable": {
    "confirmation": "Er du sikker p??, at du ??nsker at slette denne r??kke?",
    "cancelDelete": "Annull??r",
    "confirmDelete": "Slet"
  }
});
}

/* Pager messages */

if (kendo.ui.Pager) {
kendo.ui.Pager.prototype.options.messages =
$.extend(true, kendo.ui.Pager.prototype.options.messages,{
  "allPages": "All",
  "page": "Side",
  "display": "Viser r??kker {0} - {1} af {2}",
  "of": "af {0}",
  "empty": "Ingen r??kker at vise.",
  "refresh": "Opdat??r",
  "first": "G?? til f??rste side",
  "itemsPerPage": "emner pr side",
  "last": "G?? til sidste side",
  "next": "G?? til n??ste side",
  "previous": "G?? til forrige side",
  "morePages": "Flere sider"
});
}

/* FilterCell messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.messages =
$.extend(true, kendo.ui.FilterCell.prototype.options.messages,{
  "filter": "Filter",
  "clear": "Nulstil",
  "isFalse": "er falskt",
  "isTrue": "er sandt",
  "operator": "Operat??r"
});
}

/* FilterMenu messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.messages =
$.extend(true, kendo.ui.FilterMenu.prototype.options.messages,{
  "filter": "Filter",
  "and": "Og",
  "clear": "Nulstil",
  "info": "Vis r??kker som",
  "selectValue": "-V??lg v??rdi-",
  "isFalse": "er falskt",
  "isTrue": "er sandt",
  "cancel": "Annuller",
  "operator": "Operator",
  "value": "Value",
  "or": "Eller"
});
}

/* Groupable messages */

if (kendo.ui.Groupable) {
kendo.ui.Groupable.prototype.options.messages =
$.extend(true, kendo.ui.Groupable.prototype.options.messages,{
  "empty": "Tr??k en kolonneoverskrift herover for at grupp??re p?? den kolonne"
});
}

/* Editor messages */

if (kendo.ui.Editor) {
kendo.ui.Editor.prototype.options.messages =
$.extend(true, kendo.ui.Editor.prototype.options.messages,{
  "bold": "Fed",
  "createLink": "Inds??t link",
  "fontName": "V??lg font",
  "fontNameInherit": "(nedarvet font)",
  "fontSize": "V??lg font st??rrelse",
  "fontSizeInherit": "(nedarvet st??rrelse)",
  "formatBlock": "V??lg blok type",
  "indent": "Indryk",
  "insertHtml": "Inds??t HTML",
  "insertImage": "Inds??t billede",
  "insertOrderedList": "Inds??t ordnet liste",
  "insertUnorderedList": "Inds??t uordnet liste",
  "italic": "Kursiv",
  "justifyCenter": "Centr??r tekst",
  "justifyFull": "Just??r",
  "justifyLeft": "Venstrejust??r tekst",
  "justifyRight": "H??jrejust??r tekst",
  "outdent": "Ryk ud",
  "strikethrough": "Gennemstreget",
  "styles": "Stilarter",
  "subscript": "S??nket skrift",
  "superscript": "H??vet skrift",
  "underline": "Understreget",
  "unlink": "Fjern link",
  "deleteFile": "Er du sikker p??, at du ??nsker at slette \"{0}\"?",
  "directoryNotFound": "En mappe med dette navn blev ikke fundet",
  "emptyFolder": "Tom mappe",
  "invalidFileType": "Den valgte fil \"{0}\" er ugyldig. Underst??ttede filtyper er {1}.",
  "orderBy": "Arrang??r efter:",
  "orderByName": "Navn",
  "orderBySize": "St??rrelse",
  "overwriteFile": "'En fil ved navn \"{0}\" eksisterer allerede i den aktuelle mappe. ??nsker du at overskrive den?",
  "uploadFile": "Upload",
  "backColor": "Baggrundsfarve",
  "foreColor": "Farve",
  "dialogButtonSeparator": "eller",
  "dialogCancel": "Fortryd",
  "dialogInsert": "Ins??t",
  "imageAltText": "Alternativ tekst",
  "imageWebAddress": "Web adresse",
  "linkOpenInNewWindow": "??ben link i nyt vindue",
  "linkText": "Tekst",
  "linkToolTip": "Tooltip",
  "linkWebAddress": "Web adresse",
  "search": "S??g",
  "addColumnLeft": "Tilf??j kolonne til venstre",
  "addColumnRight": "Tilf??j kolonne til h??jre",
  "addRowAbove": "Tilf??j kolonne over",
  "addRowBelow": "Tilf??j kolonne under",
  "deleteColumn": "Slet kolonne",
  "deleteRow": "Slet r??kke",
  "createTable": "Opret tabel",
  "dropFilesHere": "tr??k og slip filer for at uploade",
  "formatting": "Format??r",
  "viewHtml": "Vis HTML",
  "dialogUpdate": "Opdater",
  "insertFile": "Inds??t fil"
});
}

/* Upload messages */

if (kendo.ui.Upload) {
kendo.ui.Upload.prototype.options.localization =
$.extend(true, kendo.ui.Upload.prototype.options.localization,{
  "cancel": "Fortryd",
  "dropFilesHere": "Tr??k filer herover for at uploade dem",
  "remove": "Fjern",
  "retry": "Fors??g igen",
  "select": "V??lg...",
  "statusFailed": "fejlet",
  "statusUploaded": "uploadet",
  "statusUploading": "uploader",
  "uploadSelectedFiles": "Upload filer",
  "headerStatusUploaded": "F??rdig",
  "headerStatusUploading": "Uploader..."
});
}

/* Scheduler messages */

if (kendo.ui.Scheduler) {
kendo.ui.Scheduler.prototype.options.messages =
$.extend(true, kendo.ui.Scheduler.prototype.options.messages,{
  "allDay": "hele dagen",
  "cancel": "Fortryd",
  "editable": {
    "confirmation": "Er du sikker p?? at du vil slette denne begivenhed?"
  },
  "date": "Dato",
  "destroy": "Slet",
  "editor": {
    "allDayEvent": "Hele dagen",
    "description": "Beskrivelse",
    "editorTitle": "Begivenhed",
    "end": "Slut",
    "endTimezone": "Slut tidszone",
    "repeat": "Gentag",
    "separateTimezones": "Brug forskellige start og slut tidszoner",
    "start": "Start",
    "startTimezone": "Start tidszone",
    "timezone": " ",
    "timezoneEditorButton": "Tidszone",
    "timezoneEditorTitle": "Tidszoner",
    "title": "Titel",
    "noTimezone": "Ingen tidszone"
  },
  "event": "Begivenhed",
  "recurrenceMessages": {
    "deleteRecurring": "Vil du kun slette denne h??ndelse eller hele serien?",
    "deleteWindowOccurrence": "Slet denne h??ndelse",
    "deleteWindowSeries": "Slet hele serien",
    "deleteWindowTitle": "Slet tilbagevendende h??ndelse",
    "editRecurring": "Vil du kun redigere denne h??ndelse eller hele serien?",
    "editWindowOccurrence": "Rediger denne h??ndelse",
    "editWindowSeries": "Rediger hele serien",
    "editWindowTitle": "Rediger tilbagevendende h??ndelse"
  },
  "save": "Gem",
  "time": "Tid",
  "today": "I dag",
  "views": {
    "agenda": "Agenda",
    "day": "Dag",
    "month": "M??ned",
    "week": "Uge",
    "workWeek": "Arbejdsuge",
    "timeline": "Tidslinie"
  },
  "deleteWindowTitle": "Slet begivenhed",
  "showFullDay": "Vis hel dag",
  "showWorkDay": "Vis arbejdsdag"
});
}

/* Dialog */

if (kendo.ui.Dialog) {
kendo.ui.Dialog.prototype.options.messages =
$.extend(true, kendo.ui.Dialog.prototype.options.localization,{
  "close": "Lukke"
});
}

/* Alert */

if (kendo.ui.Alert) {
kendo.ui.Alert.prototype.options.messages =
$.extend(true, kendo.ui.Alert.prototype.options.localization,{
  "okText": "Okay"
});
}

/* Confirm */

if (kendo.ui.Confirm) {
kendo.ui.Confirm.prototype.options.messages =
$.extend(true, kendo.ui.Confirm.prototype.options.localization,{
  "okText": "Okay",
  "cancel": "Annuller"
});
}

/* Prompt */
if (kendo.ui.Prompt) {
kendo.ui.Prompt.prototype.options.messages =
$.extend(true, kendo.ui.Prompt.prototype.options.localization,{
  "okText": "Okay",
  "cancel": "Annuller"
});
}

})(window.kendo.jQuery);
}));