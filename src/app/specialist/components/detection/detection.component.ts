import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { DetectionService } from '../../../services/detection.service';
import { AuthService } from '../../../services/auth.service';
import { RoboflowVisualizationService, ProcessedDetectionResult } from '../../../services/roboflow-visualization.service';
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
    private roboflowVisualization: RoboflowVisualizationService,
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
    if (!this.selectedPatientId) {
      alert('Please select a patient first');
      return;
    }

    if (!this.selectedFile && !this.selectedImageUrl) {
      alert('Please provide an image either by uploading a file or entering a URL');
      return;
    }

    this.isProcessing = true;
    $('#output').html("Inferring...");
    $("#resultContainer").show();
    $('html').scrollTop(100000);

    this.getSettingsFromForm((settings: any) => {
      settings.error = (xhr: any, status: string, error: string) => {
        console.error('❌ Roboflow API Error:');
        console.error('Status:', status);
        console.error('Error:', error);
        console.error('Response:', xhr.responseText);
        console.error('Status Code:', xhr.status);
        
        
        let errorMessage = 'Unknown error';
        if (xhr.responseText) {
          try {
            const responseData = JSON.parse(xhr.responseText);
            errorMessage = responseData.message || responseData.error || xhr.responseText;
          } catch (e) {
            errorMessage = xhr.responseText;
          }
        } else {
          errorMessage = error || status || 'Network error';
        }
        
        $('#output').html(`
          <div class="detection-error">
            <h3>❌ Roboflow API Error</h3>
            <p><strong>Error:</strong> ${errorMessage}</p>
            <details>
              <summary>Technical Details</summary>
              <pre>Status: ${xhr.status} ${status}
Error: ${error}
Response: ${xhr.responseText || 'No response'}</pre>
            </details>
            <div class="mt-3">
              <p><strong>Troubleshooting:</strong></p>
              <ul>
                <li>Verify your API key is correct</li>
                <li>Check model name: should be exactly as shown in Roboflow</li>
                <li>Verify model version number</li>
                <li>Ensure model is deployed and public</li>
              </ul>
            </div>
          </div>
        `);
        this.isProcessing = false;
      };

      // Ajouter le Content-Type correct
      settings.contentType = 'application/x-www-form-urlencoded';
      settings.processData = false;
      
      console.log('🚀 Sending request to Roboflow...', {
        url: settings.url,
        method: settings.method,
        contentType: settings.contentType,
        format: settings.format
      });
      
      // Test if the model exists first
      const modelName = ($('#model').val() as string).replace(/\s+/g, '');
      const version = $('#version').val() as string;
      const apiKey = $('#api_key').val() as string;
      
      const testUrl = `https://detect.roboflow.com/${encodeURIComponent(modelName)}?api_key=${apiKey}`;
      console.log('🧪 Testing model existence at:', testUrl);
      
      // Quick test request using Promise instead of async/await
      $.get(testUrl).fail((testError: any) => {
        if (testError.status === 404) {
          $('#output').html(`
            <div class="detection-error">
              <h3>❌ Model Not Found</h3>
              <p><strong>The model "${modelName}" version "${version}" was not found.</strong></p>
              <div class="mt-3">
                <p><strong>Please verify:</strong></p>
                <ul>
                  <li>Model name is exactly as shown in your Roboflow dashboard</li>
                  <li>Model version is deployed and accessible</li>
                  <li>Model is set to public or your API key has access</li>
                  <li>API key is correct</li>
                </ul>
                <p><strong>Current settings:</strong></p>
                <ul>
                  <li>Model: ${modelName}</li>
                  <li>Version: ${version}</li>
                  <li>API Key: ${apiKey.substring(0, 8)}...</li>
                </ul>
              </div>
            </div>
          `);
          this.isProcessing = false;
          return;
        } else if (testError.status === 403) {
          $('#output').html(`
            <div class="detection-error">
              <h3>🔒 Access Forbidden</h3>
              <p><strong>Your API key doesn't have permission to access this model.</strong></p>
              <div class="mt-3">
                <p><strong>Solutions:</strong></p>
                <ul>
                  <li>Make sure your model is set to <strong>Public</strong> in Roboflow</li>
                  <li>Check that your API key has the correct permissions</li>
                  <li>Try regenerating your API key in Roboflow settings</li>
                  <li>Verify you're the owner of the model or have been granted access</li>
                </ul>
                <p><strong>Current settings:</strong></p>
                <ul>
                  <li>Model: ${modelName}</li>
                  <li>Version: ${version}</li>
                  <li>API Key: ${apiKey.substring(0, 8)}...</li>
                </ul>
                <p><strong>🎯 Next steps:</strong></p>
                <ol>
                  <li>Go to your Roboflow dashboard</li>
                  <li>Open your model "${modelName}"</li>
                  <li>Go to Deploy → API tab</li>
                  <li>Make sure "Public" is enabled OR copy the correct API key</li>
                </ol>
              </div>
            </div>
          `);
          this.isProcessing = false;
          return;
        }
      }).done(() => {
        console.log('✅ Model exists, proceeding with inference...');
        
        $.ajax(settings).then(async (response: any) => {
        console.log('Roboflow API Response:', response);
        
        if (settings.format === "json") {
          // Process JSON response with tumor detection
          const imageUrl = this.selectedFile ? URL.createObjectURL(this.selectedFile) : this.selectedImageUrl;
          
          if (imageUrl) {
            try {
              const processedResult = this.roboflowVisualization.processRoboflowResponse(response, imageUrl);
              const detectionReport = this.roboflowVisualization.generateDetectionReport(processedResult);
              
              // Create annotated image with bounding boxes
              if (processedResult.boundingBoxes.length > 0) {
                const annotatedImageUrl = await this.roboflowVisualization.createAnnotatedImage(imageUrl, processedResult.boundingBoxes);
                
                // Display both original and annotated images with Roboflow-style interface
                const resultHtml = `
                  <div class="roboflow-detection-result">
                    <div class="detection-header">
                      <h2 class="detection-title">🔍 Brain Tumor Detection Results</h2>
                      <div class="detection-stats">
                        <div class="stat-card">
                          <span class="stat-number">${processedResult.summary.totalDetections}</span>
                          <span class="stat-label">Predictions</span>
                        </div>
                        <div class="stat-card">
                          <span class="stat-number">${processedResult.summary.highestConfidence}%</span>
                          <span class="stat-label">Max Confidence</span>
                        </div>
                        ${processedResult.summary.primaryTumorType ? `
                        <div class="stat-card primary">
                          <span class="stat-number">${processedResult.summary.primaryTumorType.replace('_tumor', '').toUpperCase()}</span>
                          <span class="stat-label">Primary Type</span>
                        </div>` : ''}
                      </div>
                    </div>
                    
                    <div class="images-comparison">
                      <div class="image-container">
                        <h4>Original MRI Scan</h4>
                        <img src="${imageUrl}" alt="Original" class="result-image" />
                      </div>
                      <div class="image-container">
                        <h4>Detected Tumors (Annotated)</h4>
                        <img src="${annotatedImageUrl}" alt="Annotated" class="result-image" />
                      </div>
                    </div>
                    
                    <div class="predictions-section">
                      <h3 class="section-title">📊 Predictions Details</h3>
                      <div class="predictions-grid">
                        ${processedResult.boundingBoxes.map((box, index) => {
                          const prediction = response.predictions[index];
                          return `
                            <div class="prediction-card">
                              <div class="prediction-header">
                                <div class="prediction-badge" style="background-color: ${box.color}">
                                  ${box.class.replace('_tumor', '').toUpperCase()}
                                </div>
                                <div class="confidence-score">
                                  <span class="confidence-value">${box.confidence}%</span>
                                  <span class="confidence-label">confidence</span>
                                </div>
                              </div>
                              <div class="prediction-details">
                                <div class="detail-row">
                                  <span class="detail-label">Class:</span>
                                  <span class="detail-value">${prediction?.class || box.class}</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Class ID:</span>
                                  <span class="detail-value">${prediction?.class_id || 'N/A'}</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Detection ID:</span>
                                  <span class="detail-value">${prediction?.detection_id || 'N/A'}</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Position (x, y):</span>
                                  <span class="detail-value">(${prediction?.x || Math.round(box.x)}, ${prediction?.y || Math.round(box.y)})</span>
                                </div>
                                <div class="detail-row">
                                  <span class="detail-label">Size (w × h):</span>
                                  <span class="detail-value">${prediction?.width || Math.round(box.width)} × ${prediction?.height || Math.round(box.height)} px</span>
                                </div>
                              </div>
                            </div>
                          `;
                        }).join('')}
                      </div>
                    </div>
                    
                    <div class="clinical-summary">
                      <h3 class="section-title">⚕️ Clinical Summary</h3>
                      <div class="clinical-content">
                        ${processedResult.boundingBoxes.map(box => {
                          const tumorType = box.class.replace('_tumor', '');
                          let clinicalNote = '';
                          switch(tumorType) {
                            case 'glioma':
                              clinicalNote = 'Glioma detected - These tumors arise from glial cells. Recommend urgent neurosurgical consultation and contrast-enhanced MRI.';
                              break;
                            case 'pituitary':
                              clinicalNote = 'Pituitary tumor detected - May affect hormone production. Recommend endocrinological evaluation and pituitary function tests.';
                              break;
                            case 'meningioma':
                              clinicalNote = 'Meningioma detected - Usually benign tumors arising from meninges. Monitor growth pattern and consider surgical evaluation if symptomatic.';
                              break;
                            default:
                              clinicalNote = `${tumorType} tumor detected - Requires specialist consultation for further evaluation.`;
                          }
                          return `<div class="clinical-note"><strong>${tumorType.toUpperCase()}:</strong> ${clinicalNote}</div>`;
                        }).join('')}
                      </div>
                    </div>
                    
                    <details class="raw-response">
                      <summary>🔧 Raw API Response (JSON)</summary>
                      <pre class="json-code">${JSON.stringify(response, null, 2)}</pre>
                    </details>
                  </div>
                `;
                
                $('#output').html(resultHtml);
              } else {
                // No tumors detected
                const noDetectionHtml = `
                  <div class="detection-result no-detection">
                    <div class="detection-summary">
                      <h3>🔍 TUMOR DETECTION RESULTS</h3>
                      <div class="summary-stats">
                        <span class="stat no-tumor">❌ No tumors detected</span>
                      </div>
                    </div>
                    
                    <div class="image-container">
                      <h4>Analyzed MRI</h4>
                      <img src="${imageUrl}" alt="Analyzed" class="result-image" />
                    </div>
                    
                    <div class="clinical-note">
                      <p>✅ No abnormalities detected in this MRI scan. Consider additional views or follow-up if clinically indicated.</p>
                    </div>
                    
                    <details class="raw-data">
                      <summary>🔧 Raw API Response</summary>
                      <pre>${JSON.stringify(response, null, 2)}</pre>
                    </details>
                  </div>
                `;
                
                $('#output').html(noDetectionHtml);
              }
              
            } catch (error) {
              console.error('Error processing detection results:', error);
              const errorHtml = `
                <div class="detection-error">
                  <h3>❌ Error Processing Results</h3>
                  <p>There was an error processing the detection results. Please try again.</p>
                  <details>
                    <summary>Raw Response</summary>
                    <pre>${JSON.stringify(response, null, 2)}</pre>
                  </details>
                </div>
              `;
              $('#output').html(errorHtml);
            }
          } else {
            // Fallback to original JSON display
            const pretty = $('<pre>');
            const formatted = JSON.stringify(response, null, 4);
            pretty.html(formatted);
            $('#output').html("").append(pretty);
          }
          
          $('html').scrollTop(100000);
        } else {
          // Handle image format response (annotated image from Roboflow)
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
          img.addClass('result-image');
          
          const imageResultHtml = `
            <div class="detection-result">
              <h3>🔍 TUMOR DETECTION RESULTS</h3>
              <div class="image-container">
                <h4>Annotated MRI (from Roboflow)</h4>
              </div>
            </div>
          `;
          
          $('#output').html(imageResultHtml).append(img);
        }
        
        // Marquer le traitement comme terminé
        this.isProcessing = false;
      }).catch((error) => {
        console.error('Error during inference:', error);
        $('#output').html(`
          <div class="detection-error">
            <h3>❌ Error During Inference</h3>
            <p>There was an error processing your request. Please check your settings and try again.</p>
            <details>
              <summary>Error Details</summary>
              <pre>${error && typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error || 'Unknown error')}</pre>
            </details>
          </div>
        `);
        this.isProcessing = false;
      });
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
    // Disable jQuery form submission and use Angular instead
    $('#inputForm').submit((event) => {
      event.preventDefault();
      // Create a native Event for Angular handler
      const nativeEvent = new Event('submit', { bubbles: true, cancelable: true });
      this.handleSubmit(nativeEvent);
      return false;
    });

    $('.bttn').click((event) => {
      $(event.target).parent().find('.bttn').removeClass('active');
      $(event.target).addClass('active');

      if ($('#computerButton').hasClass('active')) {
        $('#fileSelectionContainer').show();
        $('#urlContainer').hide();
        this.uploadMethod = 'upload';
      } else {
        $('#fileSelectionContainer').hide();
        $('#urlContainer').show();
        this.uploadMethod = 'url';
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

    const modelName = ($('#model').val() as string).replace(/\s+/g, '');
    const version = $('#version').val() as string;
    const apiKey = $('#api_key').val() as string;
    
    console.log('🔧 Roboflow Settings:');
    console.log('Model:', modelName);
    console.log('Version:', version);
    console.log('API Key:', apiKey ? apiKey.substring(0, 8) + '...' : 'Not provided');

    const parts: string[] = [
      "https://detect.roboflow.com/",
      encodeURIComponent(modelName),
      "/",
      version,
      "?api_key=" + apiKey
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
      // Use Angular variables instead of jQuery
      if (!this.selectedFile) {
        return alert("Please select a file.");
      }

      this.getBase64fromFile(this.selectedFile).then((base64image: string) => {
      settings.url = parts.join("");
      settings.data = base64image;

      console.log('🌐 Full API URL:', settings.url);
      console.log('📤 Request Settings:', {
        method: settings.method,
        url: settings.url,
        format: settings.format,
        dataLength: base64image.length
      });
      cb(settings);
      });
    } else {
      // Use Angular variables for URL as well
      if (!this.selectedImageUrl) {
        return alert("Please enter an image URL");
      }

      parts.push("&image=" + encodeURIComponent(this.selectedImageUrl));

      settings.url = parts.join("");
      
      console.log('🌐 Full API URL:', settings.url);
      console.log('📤 Request Settings:', {
        method: settings.method,
        url: settings.url,
        format: settings.format,
        imageUrl: this.selectedImageUrl
      });
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
    // Handle URL input with jQuery as well
    const urlInput = document.getElementById('url') as HTMLInputElement;
    if (urlInput) {
      urlInput.addEventListener('input', (event) => {
        const input = event.target as HTMLInputElement;
        this.selectedImageUrl = input.value;
        this.selectedFile = null; // Clear file if URL is entered
        this.previewImageUrl = this.selectedImageUrl ? this.sanitizer.bypassSecurityTrustUrl(this.selectedImageUrl) : null;
      });
    }
    
    // Also handle jQuery URL input events
    $('#url').on('input', (event) => {
      const input = event.target as HTMLInputElement;
      this.selectedImageUrl = input.value;
      this.selectedFile = null;
      this.previewImageUrl = this.selectedImageUrl ? this.sanitizer.bypassSecurityTrustUrl(this.selectedImageUrl) : null;
    });

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
      
      // Synchronize with jQuery event handler
      const fileName = this.selectedFile.name;
      $('#fileName').val(fileName);
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

    this.http.post('http://localhost:3000/api/detections', formData).subscribe({
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
