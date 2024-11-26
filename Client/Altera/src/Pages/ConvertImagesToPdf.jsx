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
import { FaFileImage } from 'react-icons/fa';
import axios from 'axios';

const ConvertImagesToPdf = () => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setIsFileSelected(true);
  };

  const handleConvert = async () => {
    if (!files || files.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one image.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/convert_images_to_pdf', // backend URL
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted_images.pdf');
      document.body.appendChild(link);
      link.click();

      toast({
        title: 'Success',
        description: 'Images converted to PDF successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to convert images to PDF.',
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
        <Heading as="h1" size="xl" fontWeight="extrabold" color="Black.600" letterSpacing={1.5}>
          Convert Images to PDF
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Create pdfs using the images
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
              <FormLabel htmlFor="file-upload" fontWeight="semibold" fontSize="md" color="gray.700">
                Choose Images to Convert
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
                  accept="image/*"
                  display="none"
                  onChange={handleFileChange}
                />
              </Flex>
            </FormControl>
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
            leftIcon={<FaFileImage />}
            fontWeight="bold"
            borderRadius="lg"
          >
            {loading ? <Spinner size="lg" /> : 'Convert Images to PDF'}
          </Button>
        )}
      </VStack>
    </Container>
  );
};

export default ConvertImagesToPdf;
