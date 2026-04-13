import { useState, useRef } from 'react';
import { User, Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SweetAlert } from '@/components/ui/sweet-alert';

interface PhotoUploadProps {
    value?: File | string | null;
    onChange: (file: File | null) => void;
    error?: string;
    className?: string;
}

export function PhotoUpload({ value, onChange, error, className }: PhotoUploadProps) {
    const [preview, setPreview] = useState<string | null>(
        typeof value === 'string' ? value : null
    );
    const [alert, setAlert] = useState<{ show: boolean, title: string, message: string }>({
        show: false,
        title: '',
        message: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Front-end Validation: PNG and JPG only
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setAlert({
                show: true,
                title: 'Invalid File Type',
                message: 'Please upload a JPG or PNG image only.'
            });
            return;
        }

        // Front-end Validation: 1MB limit
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            setAlert({
                show: true,
                title: 'File Too Large',
                message: 'The selected image exceeds the 1MB size limit.'
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        onChange(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <SweetAlert
                show={alert.show}
                type="error"
                title={alert.title}
                message={alert.message}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />
            
            <div className="flex items-center gap-6">
                <div 
                    onClick={triggerUpload}
                    className="relative group cursor-pointer"
                >
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full overflow-hidden bg-neutral-100 border-2 border-dashed transition-all duration-200 
                        ${error ? 'border-red-400 bg-red-50' : 'border-neutral-300 hover:border-blue-400 hover:bg-blue-50/30'} 
                        dark:bg-neutral-900/50 dark:border-neutral-700 dark:hover:border-blue-500/50`}
                    >
                        {preview ? (
                            <img src={preview} alt="Avatar Preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-neutral-400 group-hover:text-blue-500">
                                <User className="size-8" />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Upload className="size-5 text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={triggerUpload}
                            className="h-9 px-4 text-[13px] font-bold rounded-xl border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                            {preview ? 'Change Photo' : 'Upload Photo'}
                        </Button>
                        
                        {preview && (
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={handleRemove}
                                className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full"
                            >
                                <X className="size-4" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                        <ImageIcon className="size-3" />
                        <span>JPG, PNG. 1MB max.</span>
                    </div>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
            />
            
            {error && (
                <p className="text-[12px] font-bold text-red-500 animate-in slide-in-from-top-1">
                    ⚠ {error}
                </p>
            )}
        </div>
    );
}
