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
/* FlatColorPicker messages */

if (kendo.ui.FlatColorPicker) {
kendo.ui.FlatColorPicker.prototype.options.messages =
$.extend(true, kendo.ui.FlatColorPicker.prototype.options.messages,{
  "apply": "Potvrdit",
  "cancel": "Zru??it"
});
}

/* ColorPicker messages */

if (kendo.ui.ColorPicker) {
kendo.ui.ColorPicker.prototype.options.messages =
$.extend(true, kendo.ui.ColorPicker.prototype.options.messages,{
  "apply": "Potvrdit",
  "cancel": "Zru??it"
});
}

/* ColumnMenu messages */

if (kendo.ui.ColumnMenu) {
kendo.ui.ColumnMenu.prototype.options.messages =
$.extend(true, kendo.ui.ColumnMenu.prototype.options.messages,{
  "sortAscending": "T????dit vzestupn??",
  "sortDescending": "T????dit sestupn??",
  "filter": "Filtr",
  "columns": "Sloupce",
  "done": "Hotovo",
  "settings": "Nastaven?? sloupc??",
  "lock": "Zamknout",
  "unlock": "Odemknout"
});
}

/* Editor messages */

if (kendo.ui.Editor) {
kendo.ui.Editor.prototype.options.messages =
$.extend(true, kendo.ui.Editor.prototype.options.messages,{
  "bold": "Tu??n??",
  "italic": "Kurz??va",
  "underline": "Podtr??en??",
  "strikethrough": "P??e??krtnut??",
  "superscript": "Horn?? index",
  "subscript": "Doln?? index",
  "justifyCenter": "Zarovnat na st??ed",
  "justifyLeft": "Zarovnat vlevo",
  "justifyRight": "Zarovnat vpravo",
  "justifyFull": "Zarovnat do bloku",
  "insertUnorderedList": "Vlo??it odr????kov?? seznam",
  "insertOrderedList": "Vlo??it ????slovan?? seznam",
  "indent": "Zv??t??it odsazen??",
  "outdent": "Zmen??it odsazen??",
  "createLink": "Vlo??it odkaz",
  "unlink": "Zru??it odkaz",
  "insertImage": "Vlo??it obr??zek",
  "insertFile": "Vlo??it soubor",
  "insertHtml": "Vlo??it HTML",
  "viewHtml": "Zobrazit HTML",
  "fontName": "Vyberte p??smo",
  "fontNameInherit": "(v??choz?? p??smo)",
  "fontSize": "Vyberte velikost p??sma",
  "fontSizeInherit": "(v??choz?? velikost)",
  "formatBlock": "Form??t",
  "formatting": "Form??tov??n??",
  "foreColor": "Barva",
  "backColor": "Barva pozad??",
  "styles": "Styly",
  "emptyFolder": "Pr??zn?? adres????",
  "uploadFile": "Nahr??t",
  "orderBy": "Se??adit dle:",
  "orderBySize": "Velikosti",
  "orderByName": "Jm??na",
  "invalidFileType": "Vybran?? soubor s p????ponou \"{0}\" nen?? podporovan??. Podporovan?? soubory jsou {1}.",
  "deleteFile": "Opravdu chcete smazat \"{0}\"?",
  "overwriteFile": "'Soubor s n??zvem \"{0}\" ji?? ve vybran??m adres????i existuje. P??ejete si jej p??epsat?",
  "directoryNotFound": "Adres???? zadan??ho n??zvu nebyl nalezen.",
  "imageWebAddress": "Odkaz",
  "imageAltText": "Alternativn?? text",
  "imageWidth": "??????ka (px)",
  "imageHeight": "V????ka (px)",
  "fileWebAddress": "Web adresa",
  "fileTitle": "N??zev",
  "linkWebAddress": "Odkaz",
  "linkText": "Text",
  "linkToolTip": "Text po najet??",
  "linkOpenInNewWindow": "Otev????t odkaz v nov??m okn??",
  "dialogUpdate": "Aktualizovat",
  "dialogInsert": "Vlo??it",
  "dialogButtonSeparator": "nebo",
  "dialogCancel": "Zru??it",
  "createTable": "Vlo??it tabulku",
  "addColumnLeft": "P??idat sloupec vlevo",
  "addColumnRight": "P??idat sloupec vpravo",
  "addRowAbove": "P??idat ????dek nad",
  "addRowBelow": "P??idat ????dek pod",
  "deleteRow": "Smazat ????dek",
  "deleteColumn": "Smazat soupec"
});
}

/* FileBrowser messages */

if (kendo.ui.FileBrowser) {
kendo.ui.FileBrowser.prototype.options.messages =
$.extend(true, kendo.ui.FileBrowser.prototype.options.messages,{
  "uploadFile": "Nahr??t",
  "orderBy": "Se??adit podle",
  "orderByName": "N??zev",
  "orderBySize": "Velikost",
  "directoryNotFound": "Adres???? s t??mto n??zvem nebyl nalezen.",
  "emptyFolder": "Pr??zdn?? slo??ka",
  "deleteFile": 'Jste si jist??, ??e chcete smazat "{0}"?',
  "invalidFileType": "Soubor \"{0}\" nen?? platn??. Pou??iteln?? typy soubor?? {1}.",
  "overwriteFile": "Soubor \"{0}\" ji?? v aktu??ln??m adres????i existuje. P??ejete si jej p??epsat?",
  "dropFilesHere": "p??et??hn??te soubory pro nahr??n??",
  "search": "Hledat"
});
}

/* FilterCell messages */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.messages =
$.extend(true, kendo.ui.FilterCell.prototype.options.messages,{
  "isTrue": "je pravda",
  "isFalse": "nen?? pravda",
  "filter": "Filtrovat",
  "clear": "Zru??it",
  "operator": "Oper??tor"
});
}

/* Filter cell operators */

if (kendo.ui.FilterCell) {
kendo.ui.FilterCell.prototype.options.operators =
$.extend(true, kendo.ui.FilterCell.prototype.options.operators,{
  "string": {
    "eq": "Je shodn?? s",
    "neq": "Je r??zn?? od",
    "startswith": "Za????n?? na",
    "contains": "Obsahuje",
    "doesnotcontain": "Neobsahuje",
    "endswith": "Kon???? na",
    "isnull": "Je null",
    "isnotnull": "Nen?? null",
    "isempty": "Je pr??zdn??",
    "isnotempty": "Nen?? pr??zdn??"
  },
  "date": {
    "eq": "Je rovno",
    "neq": "Je r??zn?? od",
    "gt": "Za????n?? po",
    "gte": "Za????n?? od",
    "lt": "Kon???? po",
    "lte": "Kon???? do",
    "isnull": "Je null",
    "isnotnull": "Nen?? null"
  },
  "number": {
    "eq": "Je rovno",
    "gt": "Je v??t???? ne??",
    "gte": "Je v??t???? nebo rovno",
    "lt": "Je men???? ne??",
    "lte": "Je men???? nebo rovno",
    "neq": "Je r??zn?? od",
    "isnull": "Je null",
    "isnotnull": "Nen?? null"
  },
  "enums": {
    "eq": "Je rovno",
    "neq": "Je r??zn?? od",
    "isnull": "Je null",
    "isnotnull": "Nen?? null"
  }
});
}

/* FilterMenu messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.messages =
$.extend(true, kendo.ui.FilterMenu.prototype.options.messages,{
  "and": "A z??rove??",
  "clear": "Zru??it",
  "filter": "Filtrovat",
  "info": "Zobrazit polo??ky s hodnotou, kter??:",
  "isFalse": "nen?? pravda",
  "isTrue": "je pravda",
  "or": "Nebo",
  "selectValue": "-Vyberte hodnotu-",
  "cancel": "Zru??it",
  "operator": "Oper??tor",
  "value": "Hodnota"
});
}

/* Filter menu operator messages */

if (kendo.ui.FilterMenu) {
kendo.ui.FilterMenu.prototype.options.operators =
$.extend(true, kendo.ui.FilterMenu.prototype.options.operators,{
  "date": {
    "eq": "Je rovno",
    "gt": "Za????n?? po",
    "gte": "Za????n?? od",
    "lt": "Kon???? po",
    "lte": "Kon???? do",
    "neq": "Je r??zn?? od"
  },
  "number": {
    "eq": "Je rovno",
    "gt": "Je v??t???? ne??",
    "gte": "Je v??t???? nebo rovno",
    "lt": "Je men???? ne??",
    "lte": "Je men???? nebo rovno",
    "neq": "Je r??zn?? od"
  },
  "string": {
    "contains": "Obsahuje",
    "doesnotcontain": "Neobsahuje",
    "endswith": "Kon???? na",
    "eq": "Je shodn?? s",
    "neq": "Je r??zn?? od",
    "startswith": "Za????n?? na"
  },
  "enums": {
    "eq": "Je rovno",
    "neq": "Je r??zn?? od"
  }
});
}

/* FilterMultiCheck messages */

if (kendo.ui.FilterMultiCheck) {
kendo.ui.FilterMultiCheck.prototype.options.messages =
$.extend(true, kendo.ui.FilterMultiCheck.prototype.options.messages,{
  "checkAll": "Zvolit v??e",
  "clear": "Vymazat",
  "filter": "Filtr",
  "search": "Hledat"
});
}

/* Gantt messages */

if (kendo.ui.Gantt) {
kendo.ui.Gantt.prototype.options.messages =
$.extend(true, kendo.ui.Gantt.prototype.options.messages,{
  "actions": {
    "addChild": "P??idat potomka",
    "append": "P??idat ??kol",
    "insertAfter": "P??idat pod",
    "insertBefore": "P??idat nad",
    "pdf": "Export do PDF"
  },
  "cancel": "Zru??it",
  "deleteDependencyWindowTitle": "Smazat z??vislost",
  "deleteTaskWindowTitle": "Smazat ??kol",
  "destroy": "Smazat",
  "editor": {
    "assingButton": "P??i??adit",
    "editorTitle": "??kol",
    "end": "Konec",
    "percentComplete": "Hotovo",
    "resources": "Zdroje",
    "resourcesEditorTitle": "Zdroje",
    "resourcesHeader": "Zdroje",
    "start": "Za????tek",
    "title": "N??zev",
    "unitsHeader": "Jednotky"
  },
  "save": "Ulo??it",
  "views": {
    "day": "Den",
    "end": "Konec",
    "month": "M??s??c",
    "start": "Za????tek",
    "week": "T??den",
    "year": "Rok"
  }
});
}

/* Grid messages */

if (kendo.ui.Grid) {
kendo.ui.Grid.prototype.options.messages =
$.extend(true, kendo.ui.Grid.prototype.options.messages,{
  "commands": {
    "cancel": "Zru??it",
    "canceledit": "Zru??it",
    "create": "P??idat nov?? z??znam",
    "destroy": "Smazat",
    "edit": "Upravit",
    "excel": "Excel export",
    "pdf": "PDF export",
    "save": "Ulo??it zm??ny",
    "select": "Vybrat",
    "update": "Ulo??it"
  },
  "editable": {
    "confirmation": "Opravdu chcete smazat tento z??znam?",
    "cancelDelete": "Zru??it",
    "confirmDelete": "Smazat"
  },
  "noRecords": "????dn?? z??znam nenalezen."
});
}

/* Groupable messages */

if (kendo.ui.Groupable) {
kendo.ui.Groupable.prototype.options.messages =
$.extend(true, kendo.ui.Groupable.prototype.options.messages,{
  "empty": "P??et??hn??te sem z??hlav?? sloupce pro seskupen?? dle vybran??ho sloupce."
});
}

/* NumericTextBox messages */

if (kendo.ui.NumericTextBox) {
kendo.ui.NumericTextBox.prototype.options =
$.extend(true, kendo.ui.NumericTextBox.prototype.options,{
  "upArrowText": "Zv??t??it",
  "downArrowText": "Zmen??it"
});
}

/* Pager messages */

if (kendo.ui.Pager) {
kendo.ui.Pager.prototype.options.messages =
$.extend(true, kendo.ui.Pager.prototype.options.messages,{
  "allPages": "All",
  "display": "{0} - {1} z {2} celkem",
  "empty": "????dn?? z??znam nenalezen",
  "first": "Na prvn?? str??nku",
  "itemsPerPage": "z??znam?? na str??nku",
  "last": "Na posledn?? str??nku",
  "next": "Na dal???? str??nku",
  "of": "z {0}",
  "page": "Strana",
  "previous": "Na p??edchoz?? str??nku",
  "refresh": "Obnovit",
  "morePages": "Dal???? str??nky"
});
}

/* PivotGrid messages */

if (kendo.ui.PivotGrid) {
kendo.ui.PivotGrid.prototype.options.messages =
$.extend(true, kendo.ui.PivotGrid.prototype.options.messages,{
  "measureFields": "Sem p??et??hn??te pole",
  "columnFields": "Sem p??et??hn??te sloupce",
  "rowFields": "Sem p??et??hn??te ????dky"
});
}

/* PivotFieldMenu messages */

if (kendo.ui.PivotFieldMenu) {
kendo.ui.PivotFieldMenu.prototype.options.messages =
$.extend(true, kendo.ui.PivotFieldMenu.prototype.options.messages,{
  "info": "Zobrazit polo??ky s hodnotou:",
  "filterFields": "Filtr",
  "filter": "Filtr",
  "include": "Zahrnout pole...",
  "title": "Pole k zahrnut??",
  "clear": "Vy??istit",
  "ok": "Ok",
  "cancel": "Zru??it",
  "operators": {
    "contains": "Obsahuje",
    "doesnotcontain": "Neobsahuje",
    "startswith": "Za????na na",
    "endswith": "Kon???? na",
    "eq": "Je rovno",
    "neq": "Nen?? rovno"
  }
});
}

/* RecurrenceEditor messages */

if (kendo.ui.RecurrenceEditor) {
kendo.ui.RecurrenceEditor.prototype.options.messages =
$.extend(true, kendo.ui.RecurrenceEditor.prototype.options.messages,{
  "frequencies": {
    "daily": "Denn??",
    "monthly": "M??s????n??",
    "never": "Nikdy",
    "weekly": "T??dn??",
    "yearly": "Ro??n??"
  },
  "hourly": {
    "repeatEvery": "Opakovat ka??d??ch: ",
    "interval": " hodin"
  },
  "daily": {
    "interval": "dn??",
    "repeatEvery": "Opakovat ka??d??:"
  },
  "weekly": {
    "repeatEvery": "Opakovat ka??d??:",
    "repeatOn": "Opakovat v:",
    "interval": "t??den(ny)"
  },
  "monthly": {
    "day": "Den",
    "interval": "m??s??c(e)",
    "repeatEvery": "Opakovat ka??d??:",
    "repeatOn": "Opakovat v:"
  },
  "yearly": {
    "of": "",
    "repeatEvery": "Opakovat ka??d??:",
    "repeatOn": "Opakovat v:",
    "interval": "rok(y)"
  },
  "end": {
    "after": "Konec po",
    "occurrence": "opakov??n??",
    "label": "Konec:",
    "never": "Nikdy",
    "on": "Dne",
    "mobileLabel": "Kon????"
  },
  "offsetPositions": {
    "first": "prvn??",
    "fourth": "??tvrt??",
    "last": "posledn??",
    "second": "druh??",
    "third": "t??et??"
  },

  "weekdays": {
    "day": "den",
    "weekday": "pracovn?? den",
    "weekend": "v??kend"
  }
});
}

/* Scheduler messages */

if (kendo.ui.Scheduler) {
kendo.ui.Scheduler.prototype.options.messages =
$.extend(true, kendo.ui.Scheduler.prototype.options.messages,{
  "allDay": "cel?? den",
  "cancel": "Zru??it",
  "save": "Ulo??it",
  "time": "??as",
  "today": "Dnes",
  "date": "Datum",
  "destroy": "Smazat",
  "event": "Ud??lost",
  "deleteWindowTitle": "Smazat ud??lost",
  "showFullDay": "Zobrazit cel?? den",
  "showWorkDay": "Zobrazit pracovn?? dobu",
  "ariaSlotLabel": "Zvoleno od {0:t} do {1:t}",
  "ariaEventLabel": "{0} dne {1:D} v {2:t}",
  "editable": {
    "confirmation": "Opravdu chcete smazat tuto ud??lost?"
  },
  "views": {
    "day": "Den",
    "week": "T??den",
    "workWeek": "Pracovn?? t??den",
    "month": "M??s??c",
    "agenda": "Agenda"
  },
  "recurrenceMessages": {
    "deleteWindowOccurrence": "Smazat vybranou ud??lost",
    "deleteWindowSeries": "Smazat v??e",
    "deleteWindowTitle": "Smazat opakovanou ud??lost",
    "editWindowOccurrence": "Upravit jen vybranou ud??lost",
    "editWindowSeries": "Upravit v??e",
    "editWindowTitle": "Upravit opakuj??c?? se ud??lost",
    "deleteRecurring": "Chcete smazat jen vybranou ud??lost, nebo i v??echna opakov??n???",
    "editRecurring": "Chcete upravit jen vybranou ud??lost, nebo i v??echna opakov??n???"
  },
  "editor": {
    "title": "Nadpis",
    "start": "Za????tek",
    "end": "Konec",
    "allDayEvent": "Celodenn??",
    "description": "Popis",
    "repeat": "Opakov??n??",
    "timezone": " ",
    "startTimezone": "??asov?? p??smo za????tku",
    "endTimezone": "??asov?? p??smo konce",
    "separateTimezones": "R??zn?? ??asov?? p??sma pro za????tek a konec",
    "timezoneEditorTitle": "??asov?? p??sma",
    "timezoneEditorButton": "??asov?? p??smo",
    "timezoneTitle": "??asov?? p??sma",
    "noTimezone": "????dn?? ??asov?? p??smo",
    "editorTitle": "Ud??lost"
  }
});
}

/* Slider messages */

if (kendo.ui.Slider) {
kendo.ui.Slider.prototype.options =
$.extend(true, kendo.ui.Slider.prototype.options,{
  "increaseButtonTitle": "Zv????it",
  "decreaseButtonTitle": "Sn????it"
});
}

/* TreeList messages */

if (kendo.ui.TreeList) {
kendo.ui.TreeList.prototype.options.messages =
$.extend(true, kendo.ui.TreeList.prototype.options.messages,{
  "noRows": "????dn?? z??znamy k zobrazen??",
  "loading": "Na????t??m...",
  "requestFailed": "Po??adavek selhal.",
  "retry": "Zkusit znovu",
  "commands": {
      "edit": "Upravit",
      "update": "Aktualizovat",
      "canceledit": "Zru??it",
      "create": "P??idat nov?? z??znam",
      "createchild": "P??idat nov?? z??znam",
      "destroy": "Smazat",
      "excel": "Excel export",
      "pdf": "PDF export"
  }
});
}

/* TreeView messages */

if (kendo.ui.TreeView) {
kendo.ui.TreeView.prototype.options.messages =
$.extend(true, kendo.ui.TreeView.prototype.options.messages,{
  "loading": "Na????t??m...",
  "requestFailed": "Po??adavek selhal.",
  "retry": "Zkusit znovu"
});
}

/* Upload messages */

if (kendo.ui.Upload) {
kendo.ui.Upload.prototype.options.localization =
$.extend(true, kendo.ui.Upload.prototype.options.localization,{
  "select": "Vyberte...",
  "cancel": "Zru??it",
  "retry": "Zkusit znova",
  "remove": "Smazat",
  "uploadSelectedFiles": "Nahr??t soubory",
  "dropFilesHere": "Pro nahr??n?? p??et??hn??te soubory sem",
  "statusUploading": "nahr??v??m",
  "statusUploaded": "nahr??no",
  "statusWarning": "varov??n??",
  "statusFailed": "chyba",
  "headerStatusUploading": "Nahr??v??m...",
  "headerStatusUploaded": "Hotovo"
});
}

/* Validator messages */

if (kendo.ui.Validator) {
kendo.ui.Validator.prototype.options.messages =
$.extend(true, kendo.ui.Validator.prototype.options.messages,{
  "required": "{0} je povinn??",
  "pattern": "{0} nen?? platn??",
  "min": "{0} mus?? b??t v??t???? ne?? rovno {1}",
  "max": "{0} mus?? b??t men???? nebo rovno {1}",
  "step": "{0} nen?? platn??",
  "email": "{0} nen?? platn?? e-mailov?? adresa",
  "url": "{0} nen?? platn?? webov?? adresa",
  "date": "{0} nen?? platn?? datum",
  "dateCompare": "Datum konce mus?? b??t vy?????? ne?? nebo rovno datumu za????tku"
});
}

/* Dialog */

if (kendo.ui.Dialog) {
kendo.ui.Dialog.prototype.options.messages =
$.extend(true, kendo.ui.Dialog.prototype.options.localization,{
  "close": "Zav????t"
});
}

/* Alert */

if (kendo.ui.Alert) {
kendo.ui.Alert.prototype.options.messages =
$.extend(true, kendo.ui.Alert.prototype.options.localization,{
  "okText": "OK"
});
}

/* Confirm */

if (kendo.ui.Confirm) {
kendo.ui.Confirm.prototype.options.messages =
$.extend(true, kendo.ui.Confirm.prototype.options.localization,{
  "okText": "OK",
  "cancel": "Zru??it"
});
}

/* Prompt */
if (kendo.ui.Prompt) {
kendo.ui.Prompt.prototype.options.messages =
$.extend(true, kendo.ui.Prompt.prototype.options.localization,{
  "okText": "OK",
  "cancel": "Zru??it"
});
}

})(window.kendo.jQuery);
}));