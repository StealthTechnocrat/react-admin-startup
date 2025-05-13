'use client';

import { useCallback, useEffect, useState } from 'react';
import { CrossIcon, UploadIcon } from 'lucide-react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn, formatBytes } from '@/shared/lib/utils';

interface FileUploaderProps {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps['accept'];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileUploader({
  value = [],
  onValueChange,
  onUpload,
  progresses,
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  multiple = false,
  disabled = false,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>(value);

  useEffect(() => {
    onValueChange?.(files);
  }, [files, onValueChange]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      );
      setFiles([...files, ...newFiles]);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }
      if (onUpload) {
        toast.promise(onUpload(newFiles), {
          loading: 'Uploading...',
          success: 'Upload successful',
          error: 'Upload failed',
        });
      }
    },
    [files, maxFiles, multiple, onUpload],
  );

  const onRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if ('preview' in file) URL.revokeObjectURL(file?.preview as string);
      });
    };
  }, [files]);

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
              'hover:bg-muted/25',
              isDragActive && 'border-muted-foreground/50',
              disabled && 'pointer-events-none opacity-60',
              className,
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <div className="rounded-full border border-dashed p-3">
                <UploadIcon
                  className="size-7 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="font-medium text-muted-foreground">
                {isDragActive
                  ? 'Drop files here'
                  : "Drag 'n' drop files here, or click to select files"}
              </p>
              <p className="text-sm text-muted-foreground/70">
                {maxFiles > 1
                  ? `Upload up to ${maxFiles} files (max ${formatBytes(
                      maxSize,
                    )} each)`
                  : `Upload a file (max ${formatBytes(maxSize)})`}
              </p>
            </div>
          </div>
        )}
      </Dropzone>
      {files.length > 0 && (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {'preview' in file ? (
          <img
            src={file?.preview as string}
            alt={file.name}
            width={48}
            height={48}
            className="aspect-square rounded-md object-cover"
          />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <p className="line-clamp-1 text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)}
          </p>
          {progress && <Progress value={progress} />}
        </div>
      </div>
      <Button type="button" variant="outline" size="icon" onClick={onRemove}>
        <CrossIcon className="size-4" />
      </Button>
    </div>
  );
}
