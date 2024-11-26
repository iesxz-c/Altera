import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Input,
  Text,
  useToast,
  Container,
  Heading,
  Spinner,
  FormControl,
  FormLabel,
  Flex,
} from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';

const PdfToImages = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: 'No file selected.',
        description: 'Please upload a PDF file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/convert_pdf_to_images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pdf_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Success!',
        description: 'Your images have been converted and downloaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error converting PDF.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxW="xl" centerContent mt="50px">
      <VStack spacing={8} w="100%" textAlign="center" p={6} borderRadius="lg" shadow="xl" bg="white" maxW="800px">
        <Heading as="h1" size="xl" fontWeight="extrabold" color="gray.600" letterSpacing={1.5}>
          Convert PDF to Images
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Upload your PDF and easily convert it to downloadable images.
        </Text>

        {!selectedFile && (
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
              <FormLabel htmlFor="file-upload" fontWeight="semibold" fontSize="lg" color="gray.700">
                Choose a PDF File to Convert
              </FormLabel>
              <Flex align="center" justify="space-between" direction={{ base: 'column', md: 'row' }} gap={4}>
                <Button
                  as="label"
                  htmlFor="file-upload"
                  colorScheme="teal"
                  size="lg"
                  variant="solid"
                  width={{ base: 'full', md: 'auto' }}
                  _hover={{ bg: 'teal.500' }}
                  _active={{ bg: 'teal.600' }}
                  boxShadow="lg"
                >
                  Select File
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  display="none"
                  onChange={handleFileChange}
                />
              </Flex>
            </FormControl>
          </Box>
        )}

        {selectedFile && (
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
              {selectedFile.name}
            </Text>
          </Box>
        )}

        {selectedFile && (
          <Button
            onClick={handleSubmit}
            colorScheme="red"
            size="lg"
            isDisabled={isUploading}
            isLoading={isUploading}
            loadingText="Converting"
            width={300}
            height={75}
            mt={6}
            boxShadow="lg"
            _hover={{ bg: 'red.500' }}
            _active={{ bg: 'red.600' }}
            leftIcon={<FaFilePdf />}
            fontWeight="bold"
            borderRadius="lg"
          >
            Convert PDF to Images
          </Button>
        )}
      </VStack>
    </Container>
  );
};

export default PdfToImages;
