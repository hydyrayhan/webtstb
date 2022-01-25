
tinymce.init({
  selector: 'textarea#image-tools',
  height: 500,
  cleanup_on_startup: false,
  trim_span_elements: false,
  verify_html: false,
  cleanup: false,

  valid_elements: '*[*]',
  height: "480",
  relative_urls: false,
  remove_script_host: true,
  convert_urls: true,
  image_advtab: true,
  plugins: 'print preview code searchreplace autolink directionality visualblocks visualchars image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount  imagetools  contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
  file_browser_callback_types: 'file image media',
  toolbar: "forecolor backcolor toc charmap",
  templates: [
      { title: 'Standart content', content: '<div class="container"><div class="row"></div></div>' }
  ],
  file_picker_types: 'file image media',
  file_picker_callback: function (cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');


    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  },
});



//--------------------------------------------------------------------------------------------
tinymce.init({
  selector: 'textarea#image-tools2',
  height: 500,
  cleanup_on_startup: false,
  trim_span_elements: false,
  verify_html: false,
  cleanup: false,

  valid_elements: '*[*]',
  height: "480",
  relative_urls: false,
  remove_script_host: true,
  convert_urls: true,
  image_advtab: true,
  plugins: 'print preview code searchreplace autolink directionality visualblocks visualchars image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount  imagetools  contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
  file_browser_callback_types: 'file image media',
  toolbar: "forecolor backcolor toc charmap",
  templates: [
      { title: 'Standart content', content: '<div class="container"><div class="row"></div></div>' }
  ],
  file_picker_types: 'file image media',
  file_picker_callback: function (cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');


    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  },
});



//===============================================================================================================


tinymce.init({
  selector: 'textarea#image-tools3',
  height: 500,
  cleanup_on_startup: false,
  trim_span_elements: false,
  verify_html: false,
  cleanup: false,

  valid_elements: '*[*]',
  height: "480",
  relative_urls: false,
  remove_script_host: true,
  convert_urls: true,
  image_advtab: true,
  plugins: 'print preview code searchreplace autolink directionality visualblocks visualchars image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount  imagetools  contextmenu colorpicker textpattern help',
  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
  file_browser_callback_types: 'file image media',
  toolbar: "forecolor backcolor toc charmap",
  templates: [
      { title: 'Standart content', content: '<div class="container"><div class="row"></div></div>' }
  ],
  file_picker_types: 'file image media',
  file_picker_callback: function (cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');


    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  },
});