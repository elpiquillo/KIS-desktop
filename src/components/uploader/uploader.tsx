// UploadBox.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { grey } from 'src/theme/palette';
import Label from '../label';

interface UploadBoxProps {
  onDrop: (acceptedFiles: File[]) => void;
  placeholder: React.ReactNode;
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
  accept?: { [key: string]: string[] };
  maxFiles?: number;
}

function UploadBox({ onDrop, placeholder, sx, fullWidth, accept, maxFiles }: UploadBoxProps) {
  const [file, setFile] = React.useState<File | null>(null);

  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept, // Use the accept prop passed from the parent component
    maxFiles, // Limit to the number of files specified
  });

  const renderPreview = () => {
    if (!file) return null;

    const isCSV = file.type === 'text/csv';
    const isImage = file.type.startsWith('image/');

    if (isImage) {
      return (
        <Box mt={2} textAlign="center">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            style={{ maxHeight: 200, maxWidth: '100%' }}
          />
        </Box>
      );
    }

    if (isCSV) {
      return (
        <Box mt={2} textAlign="center" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Box
            component="img"
            alt="csv file"
            src="/assets/icons/files/ic_excel.svg"
            sx={{ width: 1, maxWidth: 40 }}
          />
          <Label color="info" sx={{ mt: 1 }}>
            {file.name}
          </Label>
        </Box>
      );
    }

    return (
      <Box mt={2} textAlign="center">
        <Typography variant="body2">{file.name}</Typography>
      </Box>
    );
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        border: '1px dashed',
        borderColor: grey[400],
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? 'rgba(0, 0, 0, 0.1)' : grey[200],
        '&:hover': {
          backgroundColor: alpha(grey[300], 0.8),
        },
        ...sx,
      }}
    >
      <input {...getInputProps()} />
      {file ? renderPreview() : placeholder}
    </Box>
  );
};

export default UploadBox;
