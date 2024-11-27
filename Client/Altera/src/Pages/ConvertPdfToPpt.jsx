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
import { FaFilePdf, FaFilePowerpoint } from 'react-icons/fa';
import axios from 'axios';

const ConvertPdfToPpt = () => {
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
        description: 'Please select a PDF file to convert.',
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
    formData.append('pdf', pdfFile);

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/convert_pdf_to_ppt',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pptx');
      document.body.appendChild(link);
      link.click();

      toast({
        title: 'Success',
        description: 'PDF converted to PowerPoint successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to convert PDF to PowerPoint.',
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
        <Heading as="h1" size="xl" fontWeight="extrabold" color="Black.600" letterSpacing={1.5}>
          Convert PDF to PowerPoint
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Upload a PDF file and convert it to PowerPoint format instantly!
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
                Choose PDF file to Convert
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
          loadingText="Converting"
          colorScheme="red"
          size="lg"
          width={300}
          height={75}
          mt={6}
          boxShadow="lg"
          _hover={{ bg: 'red.500' }}
          _active={{ bg: 'red.600' }}
          leftIcon={<FaFilePowerpoint />}
          fontWeight="bold"
          borderRadius="lg"
          isDisabled={loading || !pdfFile}
        >
          {loading ? <Spinner size="lg" /> : 'Convert to PowerPoint'}
        </Button>
      </VStack>
    </Container>
  );
};

export default ConvertPdfToPpt;
