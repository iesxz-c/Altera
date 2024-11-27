import React, { useState } from 'react';
import {
  Button,
  VStack,
  Input,
  Text,
  useToast,
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { FaGoogleDrive, FaDropbox, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

const ConvertDocToPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
        description: 'Please select a .docx file to convert.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!file.name.endsWith('.docx')) {
      toast({
        title: 'Error',
        description: 'Only .docx files are supported.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('doc', file);

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/convert_doc_to_pdf',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf');
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
      <VStack spacing={8} w="100%" textAlign="center" p={6} borderRadius="lg" shadow="xl" bg="white" maxW="800px">
        <Heading as="h1" size="xl" fontWeight="extrabold" color="black.600" letterSpacing={1.5}>
          Convert DOCX to PDF
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Upload a .docx file and convert it to PDF effortlessly.
        </Text>

        {!file && (
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
                Choose a DOCX File
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
                  accept=".docx"
                  display="none"
                  onChange={handleFileChange}
                />
              </Flex>
            </FormControl>
            <Flex gap={4} mt={5} justify="center">
              <IconButton
                aria-label="Select from Google Drive"
                icon={<FaGoogleDrive />}
                colorScheme="blue"
                size="lg"
                onClick={handleGoogleDriveSelect}
                _hover={{ bg: 'blue.500' }}
                _active={{ bg: 'blue.600' }}
                boxShadow="lg"
              />
              <IconButton
                aria-label="Select from Dropbox"
                icon={<FaDropbox />}
                colorScheme="purple"
                size="lg"
                onClick={handleDropboxSelect}
                _hover={{ bg: 'purple.500' }}
                _active={{ bg: 'purple.600' }}
                boxShadow="lg"
              />
            </Flex>
          </Box>
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

        {file && (
          <Button
            onClick={handleConvert}
            colorScheme="red"
            size="lg"
            isDisabled={loading}
            isLoading={loading}
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
            {loading ? <Spinner size="lg" /> : 'Convert to PDF'}
          </Button>
        )}
      </VStack>
    </Container>
  );
};

export default ConvertDocToPdf;
