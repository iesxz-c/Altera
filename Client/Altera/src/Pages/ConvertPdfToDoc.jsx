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
  IconButton,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { FaGoogleDrive, FaDropbox, FaFileWord } from 'react-icons/fa';
import axios from 'axios';

const ConvertPdfToDoc = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleGoogleDriveSelect = () => {
    toast({
      title: 'Google Drive',
      description: 'This feature is under development.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDropboxSelect = () => {
    toast({
      title: 'Dropbox',
      description: 'This feature is under development.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file to convert.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!file.name.endsWith('.pdf')) {
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
    formData.append('pdf', file);

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/convert_pdf_to_doc',
        formData,
        { responseType: 'blob' } // Ensures we handle binary data
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.docx');
      document.body.appendChild(link);
      link.click();

      toast({
        title: 'Success',
        description: 'File converted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to convert the file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="lg" centerContent mt="50px">
      <VStack
        spacing={6}
        w="100%"
        textAlign="center"
        p={6}
        borderRadius="lg"
        shadow="xl"
        bg="white"
        maxW="500px"
      >
        <Heading as="h1" size="xl" color="teal.600">
          Convert PDF to DOCX
        </Heading>
        <Text color="gray.600" fontSize="md">
          Upload a PDF file and convert it to a Word document instantly!
        </Text>

        {!file && (
          <Box w="100%" textAlign="center">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              size="lg"
              borderRadius="md"
              variant="outline"
            />
          </Box>
        )}

        {file && (
          <Box w="100%" textAlign="center">
            <Text mt={2} fontSize="sm" color="gray.500">
              Selected file: {file.name}
            </Text>
          </Box>
        )}

        <Flex gap={4} justify="center" mt={4}>
          <Tooltip label="Select from Google Drive" aria-label="Google Drive">
            <IconButton
              aria-label="Select from Google Drive"
              icon={<FaGoogleDrive />}
              colorScheme="blue"
              size="lg"
              onClick={handleGoogleDriveSelect}
              _hover={{ bg: 'blue.500' }}
              _active={{ bg: 'blue.600' }}
              boxSize="50px"
              fontSize="2xl"
            />
          </Tooltip>

          <Tooltip label="Select from Dropbox" aria-label="Dropbox">
            <IconButton
              aria-label="Select from Dropbox"
              icon={<FaDropbox />}
              colorScheme="purple"
              size="lg"
              onClick={handleDropboxSelect}
              _hover={{ bg: 'purple.500' }}
              _active={{ bg: 'purple.600' }}
              boxSize="50px"
              fontSize="2xl"
            />
          </Tooltip>
        </Flex>

        <Button
          onClick={handleConvert}
          isLoading={loading}
          loadingText="Converting"
          colorScheme="teal"
          size="lg"
          w="100%"
          disabled={loading || !file}
          leftIcon={<FaFileWord />}
          _hover={{ bg: 'teal.500' }}
          _active={{ bg: 'teal.600' }}
        >
          {loading ? <Spinner size="md" /> : 'Convert to DOCX'}
        </Button>
      </VStack>
    </Container>
  );
};

export default ConvertPdfToDoc;
