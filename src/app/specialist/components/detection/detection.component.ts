import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.css']
})
export class DetectionComponent implements OnInit {

  ngOnInit(): void {
    this.retrieveDefaultValuesFromLocalStorage();
    this.setupButtonListeners();
  }

  infer(): void {
    $('#output').html("Inferring...");
    $("#resultContainer").show();
    $('html').scrollTop(100000);

    this.getSettingsFromForm((settings: any) => {
      settings.error = (xhr: any) => {
        $('#output').html("").append([
          "Error loading response.",
          "",
          "Check your API key, model, version,",
          "and other parameters",
          "then try again."
        ].join("\n"));
      };

      $.ajax(settings).then((response: any) => {
        if (settings.format === "json") {
          const pretty = $('<pre>');
          const formatted = JSON.stringify(response, null, 4);

          pretty.html(formatted);
          $('#output').html("").append(pretty);
          $('html').scrollTop(100000);
        } else {
          const arrayBufferView = new Uint8Array(response);
          const blob = new Blob([arrayBufferView], { 'type': 'image/jpeg' });
          const base64image = window.URL.createObjectURL(blob);

          const img = $('<img/>');
          const imgElement = img.get(0);
          if (imgElement) {
            imgElement.onload = () => {
              $('html').scrollTop(100000);
            };
          }
          img.attr('src', base64image);
          $('#output').html("").append(img);
        }
      });
    });
  }

  retrieveDefaultValuesFromLocalStorage(): void {
    try {
      const api_key = localStorage.getItem("rf.api_key");
      const model = localStorage.getItem("rf.model");
      const format = localStorage.getItem("rf.format");

      if (api_key) $('#api_key').val(api_key);
      if (model) $('#model').val(model);
      if (format) $('#format').val(format);
    } catch (e) {
      // localStorage disabled
    }

    $('#model').change(function() {
      localStorage.setItem('rf.model', $(this).val() as string);
    });

    $('#api_key').change(function() {
      localStorage.setItem('rf.api_key', $(this).val() as string);
    });

    $('#format').change(function() {
      localStorage.setItem('rf.format', String($(this).val()));
    });
  }

  setupButtonListeners(): void {
    $('#inputForm').submit(() => {
      this.infer();
      return false;
    });

    $('.bttn').click(function() {
      $(this).parent().find('.bttn').removeClass('active');
      $(this).addClass('active');

      if ($('#computerButton').hasClass('active')) {
        $('#fileSelectionContainer').show();
        $('#urlContainer').hide();
      } else {
        $('#fileSelectionContainer').hide();
        $('#urlContainer').show();
      }

      if ($('#jsonButton').hasClass('active')) {
        $('#imageOptions').hide();
      } else {
        $('#imageOptions').show();
      }

      return false;
    });

    $('#fileMock').click(function() {
      $('#file').click();
    });

    $("#file").change(function() {
      const path = $(this).val();
      if (path && typeof path === 'string') {
        const sanitizedPath = path.replace(/\\/g, "/");
        const parts = sanitizedPath.split("/");
        const filename = parts.pop();
        if (filename) {
          $('#fileName').val(filename);
        }
      }
    });
  }

  getSettingsFromForm(cb: (settings: any) => void): void {
    const settings: any = {
      method: "POST",
    };

    const parts: string[] = [
      "https://detect.roboflow.com/",
      $('#model').val() as string,
      "/",
      $('#version').val() as string,
      "?api_key=" + $('#api_key').val()
    ];

    const classes = $('#classes').val();
    if (classes) parts.push("&classes=" + classes);

    const confidence = $('#confidence').val();
    if (confidence) parts.push("&confidence=" + confidence);

    const overlap = $('#overlap').val();
    if (overlap) parts.push("&overlap=" + overlap);

    const format = $('#format .active').attr('data-value');
    parts.push("&format=" + format);
    settings.format = format;

    if (format === "image") {
      const labels = $('#labels .active').attr('data-value');
      if (labels) parts.push("&labels=on");

      const stroke = $('#stroke .active').attr('data-value');
      if (stroke) parts.push("&stroke=" + stroke);

      settings.xhr = function() {
        const override = new XMLHttpRequest();
        override.responseType = 'arraybuffer';
        return override;
      }
    }

    const method = $('#method .active').attr('data-value');
    if (method === "upload") {
      const fileInput = $('#file').get(0) as HTMLInputElement;
      const file = fileInput?.files?.item(0);
      if (!file) return alert("Please select a file.");

      this.getBase64fromFile(file).then((base64image: string) => {
        settings.url = parts.join("");
        settings.data = base64image;

        console.log(settings);
        cb(settings);
      });
    } else {
      const url = $('#url').val() as string;
      if (!url) return alert("Please enter an image URL");

      parts.push("&image=" + encodeURIComponent(url));

      settings.url = parts.join("");
      console.log(settings);
      cb(settings);
    }
  }

  getBase64fromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  resizeImage(base64Str: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1500;
        const MAX_HEIGHT = 1500;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 1.0));
        } else {
          reject(new Error("Failed to get 2D context"));
        }
      };
    });
  }
}
