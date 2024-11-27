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
  FormControl,
  FormLabel,
  Tooltip,
} from '@chakra-ui/react';
import { FaGoogleDrive, FaDropbox, FaFileWord } from 'react-icons/fa';
import axios from 'axios';

const ConvertPdfToDoc = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usingDriveOrDropbox, setUsingDriveOrDropbox] = useState(false); 
  const toast = useToast();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUsingDriveOrDropbox(false); 
    }
  };

  const handleGoogleDriveSelect = () => {
    setUsingDriveOrDropbox(true); 
    toast({
      title: 'Google Drive',
      description: 'This feature is under development.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDropboxSelect = () => {
    setUsingDriveOrDropbox(true); 
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

    if (!file.name.toLowerCase().endsWith('.pdf')) {
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
        { responseType: 'blob' }
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
    <Container maxW="xl" centerContent mt="50px">
      <VStack
        spacing={8}
        w="100%"
        textAlign="center"
        p={6}
        borderRadius="lg"
        shadow="xl"
        bg="white"
        maxW="800px"
      >
        <Heading as="h1" size="xl" fontWeight="extrabold" color="black.600" letterSpacing={1.5}>
          Convert PDF to DOCX
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Upload a PDF file and convert it to a Word document instantly!
        </Text>

        {!file && !usingDriveOrDropbox && (
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
                Choose PDF to Convert
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
                  accept=".pdf"
                  display="none"
                  onChange={handleFileChange}
                />
              </Flex>
            </FormControl>
          </Box>
        )}

        {!file && !usingDriveOrDropbox && (
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
                boxShadow="lg"
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
                boxShadow="lg"
              />
            </Tooltip>
          </Flex>
        )}

        {file && (
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
              {file.name}
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
          leftIcon={<FaFileWord />}
          fontWeight="bold"
          borderRadius="lg"
          isDisabled={loading || !file}
        >
          {loading ? <Spinner size="lg" /> : 'Convert to DOCX'}
        </Button>
      </VStack>
    </Container>
  );
};

export default ConvertPdfToDoc;
