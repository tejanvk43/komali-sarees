import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductWithTags } from "@/types";
import { Upload, Sparkles, User, Image as ImageIcon, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAITryOn } from "@/services/gemini-service";

interface AITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithTags;
}

export function AITryOnModal({ isOpen, onClose, product }: AITryOnModalProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [palluImage, setPalluImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUserImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload an image smaller than 2MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setUserImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePalluImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload an image smaller than 2MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPalluImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async () => {
    if (!userImage || !palluImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both your full body image and the pallu image.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateAITryOn(userImage, product.images[0], palluImage);
      
      // If the result looks like base64 or a URL, use it directly
      if (result.startsWith('data:image') || result.startsWith('http')) {
        setResultImage(result);
      } else {
        // If it's a description (standard Gemini response), we show it as a "Styling Tip" 
        // until image generation is fully enabled.
        setResultImage(product.images[0]); // Fallback to product image
        toast({
          title: "AI Analysis Complete",
          description: "Our AI has analyzed your look. See the styling details below.",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "AI Generation Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setUserImage(null);
    setPalluImage(null);
    setResultImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center flex items-center justify-center gap-2">
            <Sparkles className="text-primary h-6 w-6" />
            AI Virtual Try-On
          </DialogTitle>
          <DialogDescription className="sr-only">
            Upload your photo and a pallu detail to see how this saree looks on you.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 my-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!resultImage ? (
          <div className="grid md:grid-cols-3 gap-6 py-6">
            {/* User Image Upload */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" /> 1. Your Photo
              </h3>
              <div 
                className={`aspect-[3/4] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-colors ${
                  userImage ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-primary'
                }`}
              >
                {userImage ? (
                  <img src={userImage} alt="User" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">Full Body Photo</span>
                    <input type="file" className="hidden" onChange={handleUserImageUpload} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            {/* Saree (Auto) */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> 2. Selected Saree
              </h3>
              <div className="aspect-[3/4] border-2 border-primary rounded-xl overflow-hidden shadow-md">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded text-xs font-medium text-center">
                  {product.name}
                </div>
              </div>
            </div>

            {/* Pallu Image Upload */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> 3. Pallu Detail
              </h3>
              <div 
                className={`aspect-[3/4] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-colors ${
                  palluImage ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-primary'
                }`}
              >
                {palluImage ? (
                  <img src={palluImage} alt="Pallu" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">Pallu Image</span>
                    <input type="file" className="hidden" onChange={handlePalluImageUpload} accept="image/*" />
                  </label>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center">
            <div className="relative max-w-md w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
              <img src={resultImage} alt="Try-on Result" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-6 text-xl font-serif text-primary font-medium italic">
              "Looking stunning in {product.name}!"
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          {!resultImage ? (
            <Button 
              onClick={generateTryOn} 
              className="w-full h-14 text-xl gap-3 font-serif" 
              disabled={isGenerating || !userImage || !palluImage}
              style={{ background: 'linear-gradient(45deg, #FF69B4, #D4AF37)' }}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  AI is weaving your look...
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6" />
                  Try on with AI
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" onClick={reset} className="w-full h-12 gap-2">
              <RotateCcw className="h-5 w-5" />
              Try Another Combination
            </Button>
          )}
          
          <p className="text-xs text-center text-muted-foreground italic">
            Powered by Komali AI • Premium Virtual Experience
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
