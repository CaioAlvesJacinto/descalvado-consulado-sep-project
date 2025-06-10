
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
  label?: string;
}

export const ImageUpload = ({ 
  value = [], 
  onChange, 
  maxFiles = 5, 
  className,
  label = "Imagens"
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      // Simulate file upload - in a real app, this would upload to Lovable or another service
      const newUrls = Array.from(files).map(file => {
        return URL.createObjectURL(file);
      });
      
      const updatedUrls = [...value, ...newUrls].slice(0, maxFiles);
      onChange(updatedUrls);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlAdd = () => {
    if (urlInput.trim() && value.length < maxFiles) {
      onChange([...value, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Cole a URL da imagem..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleUrlAdd}
          disabled={!urlInput.trim() || value.length >= maxFiles}
        >
          Adicionar
        </Button>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
        
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Arraste imagens aqui ou clique para selecionar
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || value.length >= maxFiles}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Enviando..." : "Selecionar Arquivos"}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Máximo {maxFiles} imagens. Formatos: JPG, PNG, GIF
        </p>
      </div>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
