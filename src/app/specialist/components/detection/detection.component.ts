import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { DetectionService } from '../../../services/detection.service';
import { AuthService } from '../../../services/auth.service';
import { IPatient } from '../../../models/patient.model';
import { IDetection } from '../../../models/detection.model';
import $ from 'jquery';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-detection',
    templateUrl: './detection.component.html',
    styleUrls: ['./detection.component.css'],
    standalone: false
})
export class DetectionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage') previewImage!: ElementRef;
  
  patients: IPatient[] = [];
  selectedPatientId: string = '';
  detectionResult: any = null;
  isProcessing: boolean = false;
  patientDetections: IDetection[] = [];
  selectedDetection: IDetection | null = null;
  selectedFile: File | null = null;
  selectedImageUrl: string | null = null;
  uploadMethod: 'upload' | 'url' = 'upload';
  previewImageUrl: SafeUrl | null = null;

  constructor(
    private patientService: PatientService,
    private detectionService: DetectionService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.initializeFormHandlers();
    this.retrieveDefaultValuesFromLocalStorage();
    this.setupButtonListeners();
    this.setupEventListeners();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => this.patients = data,
      (error) => console.error('Error loading patients:', error)
    );
  }

  loadPatientDetections(patientId: string): void {
    this.detectionService.getDetectionsByPatient(patientId).subscribe(
      (detections) => {
        this.patientDetections = detections;
        // Sort detections by date, most recent first
        this.patientDetections.sort((a, b) => 
          new Date(b.detectionDate).getTime() - new Date(a.detectionDate).getTime()
        );
      },
      (error) => console.error('Error loading patient detections:', error)
    );
  }

  initializeFormHandlers(): void {
    const form = document.getElementById('inputForm') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (event) => this.handleSubmit(event));
    }
  }

  onPatientChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPatientId = select.value;
    // Reset detection result when patient changes
    this.detectionResult = null;
    this.selectedDetection = null;
    const outputElement = document.getElementById('output');
    if (outputElement) {
      outputElement.textContent = 'Select a patient and run detection to see results';
    }
    // Load patient's detection history
    if (this.selectedPatientId) {
      this.loadPatientDetections(this.selectedPatientId);
    } else {
      this.patientDetections = [];
    }
  }

  viewDetectionDetails(detection: IDetection): void {
    this.selectedDetection = detection;
    const outputElement = document.getElementById('output');
    if (outputElement) {
      outputElement.textContent = JSON.stringify(detection, null, 2);
    }
    // Update PDF viewer if available
    const pdfEmbed = document.querySelector('.result__pdf embed') as HTMLEmbedElement;
    if (pdfEmbed && detection.results?.imageResult) {
      pdfEmbed.src = detection.results.imageResult;
    }
  }

  toggleJsonResult(detection: IDetection) {
    detection.showJson = !detection.showJson;
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.selectedPatientId) {
      alert('Please select a patient first');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser._id) {
      alert('User not authenticated');
      return;
    }

    // Check if we have either a file or URL
    if (!this.selectedFile && !this.selectedImageUrl) {
      alert('Please provide an image either by uploading a file or entering a URL');
      return;
    }

    this.isProcessing = true;

    try {
      const formData = new FormData();
      const confidenceInput = document.getElementById('confidence') as HTMLInputElement;
      const overlapInput = document.getElementById('overlap') as HTMLInputElement;
      const classesInput = document.getElementById('classes') as HTMLInputElement;

      // Handle file upload
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      } 
      // Handle URL input
      else if (this.selectedImageUrl) {
        formData.append('imageUrl', this.selectedImageUrl);
      }

      const confidence = confidenceInput?.value || '50';
      const overlap = overlapInput?.value || '50';
      const classes = classesInput?.value ? classesInput.value.split(',').map((c: string) => c.trim()) : [];

      formData.append('patient', this.selectedPatientId);
      formData.append('specialist', currentUser._id);
      formData.append('confidence', confidence);
      formData.append('overlap', overlap);
      formData.append('classes', classesInput?.value || '');
      // Add result as JSON string for backend
      formData.append('result', JSON.stringify({ confidence: Number(confidence), overlap: Number(overlap), classes }));

      const detectionResult = await this.detectionService.createDetection(formData).toPromise();
      if (!detectionResult) {
        throw new Error('No detection result received');
      }
      
      this.detectionResult = detectionResult;
      this.selectedDetection = null;
      
      // Update the result display
      const outputElement = document.getElementById('output');
      if (outputElement) {
        outputElement.textContent = JSON.stringify(detectionResult, null, 2);
      }

      // Update the PDF viewer if available
      const pdfEmbed = document.querySelector('.result__pdf embed') as HTMLEmbedElement;
      if (pdfEmbed && detectionResult.results?.imageResult) {
        pdfEmbed.src = detectionResult.results.imageResult;
      }

      // Reload patient detections to include the new one
      this.loadPatientDetections(this.selectedPatientId);

      // Reset form after successful submission
      this.resetForm();

    } catch (error) {
      console.error('Error during detection:', error);
      alert('An error occurred during detection. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.selectedImageUrl = null;
    this.previewImageUrl = null;
    const fileNameInput = document.getElementById('fileName') as HTMLInputElement;
    if (fileNameInput) {
      fileNameInput.value = '';
    }
    const urlInput = document.getElementById('url') as HTMLInputElement;
    if (urlInput) {
      urlInput.value = '';
    }
    const fileInput = this.fileInput.nativeElement;
    if (fileInput) {
      fileInput.value = '';
    }
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

  private setupEventListeners(): void {
    // Handle URL input
    const urlInput = document.getElementById('url') as HTMLInputElement;
    if (urlInput) {
      urlInput.addEventListener('input', (event) => {
        const input = event.target as HTMLInputElement;
        this.selectedImageUrl = input.value;
        this.selectedFile = null; // Clear file if URL is entered
        this.previewImageUrl = this.selectedImageUrl ? this.sanitizer.bypassSecurityTrustUrl(this.selectedImageUrl) : null;
      });
    }

    // Handle upload method toggle
    const computerButton = document.getElementById('computerButton');
    const urlButton = document.getElementById('urlButton');
    const fileSelectionContainer = document.getElementById('fileSelectionContainer');
    const urlContainer = document.getElementById('urlContainer');

    if (computerButton && urlButton && fileSelectionContainer && urlContainer) {
      computerButton.addEventListener('click', () => {
        this.uploadMethod = 'upload';
        computerButton.classList.add('active');
        urlButton.classList.remove('active');
        fileSelectionContainer.style.display = 'block';
        urlContainer.style.display = 'none';
        // Clear URL when switching to file upload
        this.selectedImageUrl = null;
        const urlInput = document.getElementById('url') as HTMLInputElement;
        if (urlInput) urlInput.value = '';
      });

      urlButton.addEventListener('click', () => {
        this.uploadMethod = 'url';
        urlButton.classList.add('active');
        computerButton.classList.remove('active');
        urlContainer.style.display = 'block';
        fileSelectionContainer.style.display = 'none';
        // Clear file when switching to URL
        this.selectedFile = null;
        this.previewImageUrl = null;
        const fileNameInput = document.getElementById('fileName') as HTMLInputElement;
        if (fileNameInput) fileNameInput.value = '';
        if (this.fileInput) this.fileInput.nativeElement.value = '';
      });
    }
  }

  private createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.previewImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  private updateFileNameDisplay(fileName: string) {
    const fileNameInput = document.getElementById('fileName') as HTMLInputElement;
    if (fileNameInput) {
      fileNameInput.value = fileName;
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.selectedPatientId) {
      alert('Please select a patient first');
      return;
    }

    if (this.uploadMethod === 'upload' && !this.selectedFile) {
      alert('Please select an image file');
      return;
    }

    if (this.uploadMethod === 'url' && !this.selectedImageUrl) {
      alert('Please enter an image URL');
      return;
    }

    this.isProcessing = true;

    try {
      const formData = new FormData();
      formData.append('patient', this.selectedPatientId);

      if (this.uploadMethod === 'upload' && this.selectedFile) {
        formData.append('image', this.selectedFile);
      } else if (this.uploadMethod === 'url' && this.selectedImageUrl) {
        formData.append('imageUrl', this.selectedImageUrl);
      }

      // Add other detection parameters
      const confidence = (document.getElementById('confidence') as HTMLInputElement)?.value || '50';
      const overlap = (document.getElementById('overlap') as HTMLInputElement)?.value || '50';
      const classes = (document.getElementById('classes') as HTMLInputElement)?.value || '';

      formData.append('confidence', confidence);
      formData.append('overlap', overlap);
      if (classes) {
        formData.append('classes', classes);
      }

      const detection = await this.detectionService.createDetection(formData).toPromise();
      if (detection) {
        this.loadPatientDetections(this.selectedPatientId);
        this.resetForm();
      }
    } catch (error) {
      console.error('Error creating detection:', error);
      alert('Error creating detection. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  getImageUrl(imagePath: string | null): SafeUrl {
    if (!imagePath) return '';
    return this.sanitizer.bypassSecurityTrustUrl(imagePath);
  }

  // Méthode pour ouvrir le sélecteur de fichier depuis le bouton Browse
  openFileDialog() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
      this.fileInput.nativeElement.click();
    }
  }

  // Handler pour la sélection de fichier
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.selectedImageUrl = null; // Clear URL if file is selected
      this.createImagePreview(this.selectedFile);
      this.updateFileNameDisplay(this.selectedFile.name);
    }
  }

  // Méthode pour envoyer le fichier au backend
  uploadFile() {
    if (!this.selectedFile) {
      alert('Aucun fichier sélectionné');
      return;
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile); // 'image' doit matcher le backend

    this.http.post('http://localhost:3000/api/upload', formData).subscribe({
      next: (res) => {
        alert('Fichier envoyé avec succès !');
        // ... autres actions si besoin
      },
      error: (err) => {
        alert('Erreur lors de l\'upload');
        console.error(err);
      }
    });
  }

  async downloadDetectionPDF(detection: IDetection): Promise<void> {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Detection Report', 14, 20);
      
      // Add patient information
      doc.setFontSize(12);
      const patient = this.patients.find(p => p._id === detection.patient);
      if (patient) {
        doc.text(`Patient: ${patient.fullName}`, 14, 30);
        doc.text(`Age: ${patient.age} years`, 14, 37);
        doc.text(`Gender: ${patient.sexe}`, 14, 44);
      }
      
      // Add detection details
      doc.text(`Detection Date: ${new Date(detection.detectionDate).toLocaleString()}`, 14, 54);
      
      // Add detection results
      if (detection.results) {
        doc.text('Detection Results:', 14, 64);
        
        // Create table for results
        const tableData = [
          ['Parameter', 'Value'],
          ['Confidence', `${detection.results.confidence}%`],
          ['Overlap', `${detection.results.overlap}%`],
        ];
        
        // Add detected classes if any
        if (detection.results.classes && detection.results.classes.length > 0) {
          tableData.push(['Detected Classes', detection.results.classes.join(', ')]);
        }
        
        autoTable(doc, {
          startY: 70,
          head: [tableData[0]],
          body: tableData.slice(1),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
        });
        
        // Add JSON result if available
        if (detection.results.jsonResult) {
          const finalY = (doc as any).lastAutoTable.finalY || 100;
          doc.text('Detailed JSON Result:', 14, finalY + 10);
          doc.setFontSize(8);
          doc.text(JSON.stringify(detection.results.jsonResult, null, 2), 14, finalY + 20);
        }
      }
      
      // Generate filename
      const fileName = `detection_report_${patient?.fullName.replace(/\s+/g, '_')}_${new Date(detection.detectionDate).toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  }
}
