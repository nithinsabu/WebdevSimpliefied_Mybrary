FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageFileEncode,
    FilePondPluginImageResize
)
FilePond.setOptions({
    stylePanelAspectRatio: 1.5
})

FilePond.parse(document.body);