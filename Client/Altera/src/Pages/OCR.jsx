import React, { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  useToast,
  Spinner,
  Box,
  FormControl,
  FormLabel,
  Flex,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const OcrPdfToText = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPdfFile(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file to process.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!pdfFile.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: 'Error',
        description: 'Only PDF files are supported.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/ocr',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'text_extracted.pdf');
      document.body.appendChild(link);
      link.click();

      toast({
        title: 'Success',
        description: 'Text extracted and PDF created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process the PDF.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="xl" centerContent mt="50px">
      <VStack spacing={8} w="100%" textAlign="center" p={6} borderRadius="lg" shadow="xl" bg="white">
        <Heading as="h1" size="xl" fontWeight="extrabold" color="teal.600" letterSpacing={1.5}>
          OCR PDF to Extracted Text
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Upload a PDF file, extract the text, and download a new PDF with the extracted content.
        </Text>

        {!pdfFile && (
          <Box
            w="100%"
            p={6}
            borderRadius="md"
            shadow="lg"
            bg="gray.50"
            borderWidth="1px"
            transition="all 0.3s ease-in-out"
            _hover={{ bg: 'gray.100' }}
          >
            <FormControl>
              <FormLabel htmlFor="pdf-upload" fontWeight="semibold" fontSize="lg" color="gray.700">
                Choose PDF file for OCR
              </FormLabel>
              <Flex align="center" justify="space-between" gap={4}>
                <Button
                  as="label"
                  htmlFor="pdf-upload"
                  colorScheme="teal"
                  size="lg"
                  variant="solid"
                  width={{ base: 'full', md: 'auto' }}
                  _hover={{ bg: 'teal.500' }}
                  _active={{ bg: 'teal.600' }}
                >
                  Select File
                </Button>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  display="none"
                  onChange={handleFileChange}
                />
              </Flex>
            </FormControl>
          </Box>
        )}

        {pdfFile && (
          <Box
            w="100%"
            p={6}
            mt={6}
            borderRadius="md"
            shadow="lg"
            bg="gray.50"
            borderWidth="1px"
            transition="all 0.3s ease-in-out"
            _hover={{ bg: 'gray.100' }}
          >
            <Heading as="h4" size="md" fontWeight="semibold" color="gray.700" mb={4}>
              Selected File:
            </Heading>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {pdfFile.name}
            </Text>
          </Box>
        )}

        <Button
          onClick={handleConvert}
          isLoading={loading}
          loadingText="Processing"
          colorScheme="red"
          size="lg"
          width={300}
          height={75}
          mt={6}
          boxShadow="lg"
          _hover={{ bg: 'red.500' }}
          _active={{ bg: 'red.600' }}
          leftIcon={<FaDownload />}
          fontWeight="bold"
          borderRadius="lg"
          isDisabled={loading || !pdfFile}
        >
          {loading ? <Spinner size="lg" /> : 'Extract Text from PDF'}
        </Button>
      </VStack>
    </Container>
  );
};

export default OcrPdfToText;
