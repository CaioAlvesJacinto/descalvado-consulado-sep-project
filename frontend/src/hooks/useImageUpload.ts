
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseImageUploadOptions {
  maxFiles?: number;
  maxFileSize?: number; // em MB
  allowedTypes?: string[];
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const {
    maxFiles = 5,
    maxFileSize = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  } = options;
  
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: `Apenas ${allowedTypes.join(', ')} são permitidos.`,
        variant: "destructive"
      });
      return false;
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${maxFileSize}MB.`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadFiles = async (files: FileList): Promise<string[]> => {
    setIsUploading(true);
    
    try {
      const validFiles = Array.from(files)
        .slice(0, maxFiles)
        .filter(validateFile);

      if (validFiles.length === 0) {
        return [];
      }

      // Simulate upload process - replace with actual upload logic
      const uploadPromises = validFiles.map(async (file) => {
        // In a real implementation, this would upload to Lovable or another service
        // For now, we'll create object URLs as placeholders
        return new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(URL.createObjectURL(file));
          }, 1000);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      toast({
        title: "Upload concluído",
        description: `${uploadedUrls.length} imagem(ns) enviada(s) com sucesso.`,
      });

      return uploadedUrls;
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar as imagens. Tente novamente.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFromUrl = async (url: string): Promise<string | null> => {
    try {
      // Validate URL format
      new URL(url);
      
      // In a real implementation, you might want to validate the image URL
      // by checking if it loads successfully
      
      return url;
    } catch (error) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    isUploading,
    uploadFiles,
    uploadFromUrl,
    validateFile
  };
};
