import React, { useState } from 'react';
import {
  Button,
  VStack,
  Input,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';

const MergePDFs = () => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleMerge = async () => {
    if (!files || files.length < 2) {
      toast({
        title: 'Error',
        description: 'Please upload at least two PDF files.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('pdfs', file));

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/merge_pdfs',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged.pdf');
      document.body.appendChild(link);
      link.click();

      toast({
        title: 'Success',
        description: 'PDFs merged successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to merge PDFs.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} w="100%">
      <Input type="file" multiple accept=".pdf" onChange={handleFileChange} />
      <Button
        onClick={handleMerge}
        colorScheme="teal"
        isDisabled={loading}
        isLoading={loading}
        loadingText="Merging"
      >
        Merge PDFs
      </Button>
    </VStack>
  );
};

export default MergePDFs;
