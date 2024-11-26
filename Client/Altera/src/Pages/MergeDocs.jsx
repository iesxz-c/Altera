import React, { useState } from 'react';
import {
  Button,
  VStack,
  Input,
  Text,
  useToast,
  Box,
  IconButton,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { FaFileWord, FaDropbox, FaGoogleDrive } from 'react-icons/fa';
import axios from 'axios';

const MergeDocs = () => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setIsFileSelected(true);
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

  const handleMerge = async () => {
    if (!files || files.length < 2) {
      toast({
        title: 'Error',
        description: 'Please upload at least two .docx files.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('docs', file));

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/merge_docs',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged.docx');
      document.body.appendChild(link);
      link.click();

      toast({
        title: 'Success',
        description: 'Docs merged successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to merge Docs.',
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
          Merge Documents
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Easily combine DOCX files with the most user-friendly merger tool available.
        </Text>

        {!isFileSelected && (
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
                Choose DOCX Files to Merge
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
                  Select Files
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
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

        {isFileSelected && (
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
              Selected Files:
            </Heading>
            <VStack align="center">
              {Array.from(files).map((file, index) => (
                <Text key={index} fontSize="sm" color="gray.600" fontWeight="medium">
                  {file.name}
                </Text>
              ))}
            </VStack>
          </Box>
        )}

        {isFileSelected && (
          <Button
            onClick={handleMerge}
            colorScheme="red"
            size="lg"
            isDisabled={loading}
            isLoading={loading}
            loadingText="Merging"
            width={300}
            height={75}
            mt={6}
            boxShadow="lg"
            _hover={{ bg: 'red.500' }}
            _active={{ bg: 'red.600' }}
            leftIcon={<FaFileWord />}
            fontWeight="bold"
            borderRadius="lg"
          >
            {loading ? <Spinner size="lg" /> : 'Merge DOCX Files'}
          </Button>
        )}
      </VStack>
    </Container>
  );
};

export default MergeDocs;
