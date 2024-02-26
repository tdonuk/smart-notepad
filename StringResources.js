import Environment from "./Environment"

const english = {
    "note.create": "Create",
    "note.edit": "Update",
    "note.new": "New",
    "note.title": "Title",
    "note.tags": "Tags",
    "title.notes": "My Notes",
    "title.create": "New Note",
    "title.edit": "Edit Note",
    "title.confirm": "Confirm",
    "title.confirmation": "Confirmation",
    "title.cancel": "Cancel",
    "dialog.note.delete": "Selected note will be deleted permanently",
    "dialog.note.saveSuccess": "Succesfully saved",
    "placeholder.note.title": "Title",
    "placeholder.note.note": "Your note...",
    "placeholder.note.tags": "school, food, people",
    "placeholder.search": "Search",
    "error.note.tagEmpty": "At least 1 tag is required to proceed",
    "error.note.invalidTag": "Please enter a valid tag name",
    "error.note.titleEmpty": "Title is required to proceed",
    "error.note.noteEmpty": "Note content is required to proceed",
    "label.add": "Add",
    "label.addTag": "Add Tag",
    "label.clear": "Clear"
}

const turkish = {
    "note.create": "Oluştur",
    "note.edit": "Güncelle",
    "note.new": "Yeni",
    "note.title": "Başlık",
    "note.tags": "Etiketler",
    "title.notes": "Notlarım",
    "title.create": "Yeni Not",
    "title.edit": "Not Düzenle",
    "title.confirm": "Onayla",
    "title.confirmation": "Onay",
    "title.cancel": "Vazgeç",
    "dialog.note.delete": "Seçtiğiniz not kalıcı olarak silinecektir",
    "dialog.note.saveSuccess": "Başarıyla kaydedildi",
    "placeholder.note.title": "Başlık",
    "placeholder.note.note": "Not içeriği...",
    "placeholder.note.tags": "okul, yemek, sosyal",
    "placeholder.search": "Ara",
    "error.note.tagEmpty": "Not kaydetme işlemi için en az 1 etiket girilmelidir",
    "error.note.invalidTag": "Lütfen geçerli bir değer giriniz",
    "error.note.titleEmpty": "Not kaydetme işlemi için başlık girilmesi zorunludur",
    "error.note.noteEmpty": "Not kaydetme işlemi için not içeriği girilmesi zorunludur",
    "label.add": "Ekle",
    "label.addTag": "Etiket Ekle",
    "label.clear": "Temizle"
}

const localizations = {
    "tr_TR": turkish,
    "en_US": english,
};

function getDefault() {
    return localizations[Environment.locale] ?? localizations.en_US;
}

export default {
    ...localizations,
    getDefault: () => getDefault,
    get: (key) => getDefault()[key] ?? "???"
}