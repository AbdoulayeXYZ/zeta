import { Injectable } from '@angular/core';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
  color: string;
}

export interface ProcessedDetectionResult {
  originalImage: string;
  annotatedImage?: string;
  boundingBoxes: BoundingBox[];
  detectedClasses: string[];
  summary: {
    totalDetections: number;
    highestConfidence: number;
    primaryTumorType?: string;
  };
  rawResponse: any;
}

@Injectable({
  providedIn: 'root'
})
export class RoboflowVisualizationService {

  private tumorColors: { [key: string]: string } = {
    'glioma': '#FF6B6B',      // Rouge pour glioma
    'pituitary': '#4ECDC4',   // Turquoise pour pituitary
    'meningioma': '#45B7D1',  // Bleu pour meningioma
    'tumor': '#FF8C42',       // Orange pour tumeur générique
    'detected': '#95E1D3'     // Vert pour détection générique
  };

  constructor() { }

  /**
   * Traite la réponse Roboflow et crée une visualisation avec bounding boxes
   */
  processRoboflowResponse(response: any, originalImageUrl: string): ProcessedDetectionResult {
    console.log('Processing Roboflow response:', response);

    let boundingBoxes: BoundingBox[] = [];
    let detectedClasses: string[] = [];

    // Traiter différents formats de réponse Roboflow
    if (response.predictions && Array.isArray(response.predictions)) {
      console.log('Processing predictions array:', response.predictions);
      
      // Format standard avec predictions array
      boundingBoxes = response.predictions.map((prediction: any, index: number) => {
        const originalClass = prediction.class || prediction.className || 'detected';
        const className = this.normalizeTumorClass(originalClass);
        
        console.log(`Prediction ${index + 1}:`, {
          original: originalClass,
          normalized: className,
          confidence: prediction.confidence,
          coordinates: { x: prediction.x, y: prediction.y, width: prediction.width, height: prediction.height }
        });
        
        if (!detectedClasses.includes(className)) {
          detectedClasses.push(className);
        }

        return {
          x: prediction.x - (prediction.width / 2), // Convertir du centre vers coin supérieur gauche
          y: prediction.y - (prediction.height / 2),
          width: prediction.width,
          height: prediction.height,
          class: className,
          confidence: Math.round((prediction.confidence || 0) * 100),
          color: this.tumorColors[className] || this.tumorColors['detected']
        };
      });
    } else if (response.detection) {
      // Format alternatif avec objet detection
      const detection = response.detection;
      if (detection.class) {
        const className = this.normalizeTumorClass(detection.class);
        detectedClasses.push(className);
        
        boundingBoxes.push({
          x: detection.x || 0,
          y: detection.y || 0,
          width: detection.width || 0,
          height: detection.height || 0,
          class: className,
          confidence: Math.round((detection.confidence || 0) * 100),
          color: this.tumorColors[className] || this.tumorColors['detected']
        });
      }
    }

    // Calculer le résumé
    const summary = {
      totalDetections: boundingBoxes.length,
      highestConfidence: boundingBoxes.length > 0 ? Math.max(...boundingBoxes.map(bb => bb.confidence)) : 0,
      primaryTumorType: this.getPrimaryTumorType(boundingBoxes)
    };

    return {
      originalImage: originalImageUrl,
      boundingBoxes,
      detectedClasses,
      summary,
      rawResponse: response
    };
  }

  /**
   * Normalise les noms de classes pour correspondre aux types de tumeurs
   */
  private normalizeTumorClass(className: string): string {
    const normalized = className.toLowerCase().trim();
    
    // Mapping des différentes variantes de noms incluant les formats Roboflow
    const classMapping: { [key: string]: string } = {
      // Formats Roboflow avec suffixes
      'glioma_tumor': 'glioma',
      'glioma': 'glioma',
      'gliomas': 'glioma',
      'gliome': 'glioma',
      
      'pituitary_tumor': 'pituitary',
      'pituitary': 'pituitary',
      'pituitaire': 'pituitary',
      'pituitary_adenoma': 'pituitary',
      
      'meningioma_tumor': 'meningioma',
      'meningioma': 'meningioma',
      'meningiome': 'meningioma',
      'meningiomas': 'meningioma',
      
      // Formats génériques
      'tumor': 'tumor',
      'tumeur': 'tumor',
      'brain_tumor': 'tumor',
      'detected': 'detected',
      'detection': 'detected'
    };

    // Si le nom contient un des types de tumeurs, extraire le type principal
    if (normalized.includes('glioma')) return 'glioma';
    if (normalized.includes('pituitary')) return 'pituitary';
    if (normalized.includes('meningioma')) return 'meningioma';
    if (normalized.includes('tumor') || normalized.includes('tumeur')) return 'tumor';

    return classMapping[normalized] || normalized;
  }

  /**
   * Détermine le type de tumeur principal basé sur la confiance
   */
  private getPrimaryTumorType(boundingBoxes: BoundingBox[]): string | undefined {
    if (boundingBoxes.length === 0) return undefined;

    // Trier par confiance décroissante
    const sortedBoxes = boundingBoxes.sort((a, b) => b.confidence - a.confidence);
    
    // Retourner la classe avec la plus haute confiance
    return sortedBoxes[0].class;
  }

  /**
   * Crée une image annotée avec les bounding boxes
   */
  async createAnnotatedImage(imageUrl: string, boundingBoxes: BoundingBox[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Définir les dimensions du canvas
        canvas.width = img.width;
        canvas.height = img.height;

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Dessiner l'image originale
        ctx.drawImage(img, 0, 0);

        // Dessiner les bounding boxes
        boundingBoxes.forEach(box => {
          this.drawBoundingBox(ctx, box, img.width, img.height);
        });

        // Convertir en base64
        const annotatedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(annotatedImageUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });
  }

  /**
   * Dessine un bounding box sur le canvas
   */
  private drawBoundingBox(ctx: CanvasRenderingContext2D, box: BoundingBox, imageWidth: number, imageHeight: number): void {
    // Convertir les coordonnées relatives en pixels absolus si nécessaire
    const x = box.x < 1 ? box.x * imageWidth : box.x;
    const y = box.y < 1 ? box.y * imageHeight : box.y;
    const width = box.width < 1 ? box.width * imageWidth : box.width;
    const height = box.height < 1 ? box.height * imageHeight : box.height;

    // Style de la boîte
    ctx.strokeStyle = box.color;
    ctx.lineWidth = 3;
    ctx.fillStyle = box.color + '20'; // Transparence pour le fond

    // Dessiner le rectangle
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);

    // Préparer le texte du label
    const label = `${box.class} (${box.confidence}%)`;
    const fontSize = Math.max(12, Math.min(18, width * 0.05));
    ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
    
    // Mesurer le texte pour la boîte de fond
    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    
    // Dessiner le fond du label
    ctx.fillStyle = box.color;
    ctx.fillRect(x, y - textHeight - 8, textWidth + 12, textHeight + 8);
    
    // Dessiner le texte
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(label, x + 6, y - 6);
  }

  /**
   * Génère un rapport de détection pour l'affichage
   */
  generateDetectionReport(result: ProcessedDetectionResult): string {
    const { summary, detectedClasses, boundingBoxes } = result;
    
    let report = `🔍 TUMOR DETECTION REPORT\n\n`;
    
    if (summary.totalDetections === 0) {
      report += `❌ No tumors detected in this MRI scan.\n`;
      return report;
    }

    report += `✅ ${summary.totalDetections} tumor(s) detected\n`;
    report += `🎯 Highest confidence: ${summary.highestConfidence}%\n`;
    
    if (summary.primaryTumorType) {
      report += `🧠 Primary tumor type: ${summary.primaryTumorType.toUpperCase()}\n`;
    }
    
    report += `\n📊 DETAILED FINDINGS:\n`;
    
    boundingBoxes.forEach((box, index) => {
      report += `\n${index + 1}. ${box.class.toUpperCase()}\n`;
      report += `   • Confidence: ${box.confidence}%\n`;
      report += `   • Location: (${Math.round(box.x)}, ${Math.round(box.y)})\n`;
      report += `   • Size: ${Math.round(box.width)} × ${Math.round(box.height)} pixels\n`;
    });

    report += `\n⚕️ CLINICAL NOTES:\n`;
    
    // Ajouter des notes cliniques basées sur le type de tumeur
    detectedClasses.forEach(tumorClass => {
      switch (tumorClass) {
        case 'glioma':
          report += `• Glioma detected - Consider further evaluation with contrast enhancement\n`;
          break;
        case 'pituitary':
          report += `• Pituitary tumor detected - Recommend endocrine evaluation\n`;
          break;
        case 'meningioma':
          report += `• Meningioma detected - Typically benign, monitor growth pattern\n`;
          break;
        default:
          report += `• ${tumorClass} detected - Requires specialist consultation\n`;
      }
    });

    return report;
  }
}
