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
import { FaFilePowerpoint, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

const ConvertPptToPdf = () => {
  const [pptFile, setPptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPptFile(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!pptFile) {
      toast({
        title: 'Error',
        description: 'Please select a PowerPoint file to convert.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!pptFile.name.toLowerCase().endsWith('.ppt') && !pptFile.name.toLowerCase().endsWith('.pptx')) {
      toast({
        title: 'Error',
        description: 'Only PowerPoint files (.ppt, .pptx) are supported.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('ppt', pptFile);

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/convert_ppt_to_pdf',
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
        description: 'File converted to PDF successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to convert PowerPoint to PDF.',
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
        <Heading as="h1" size="xl" fontWeight="extrabold" color="black.600" letterSpacing={1.5}>
          Convert PowerPoint to PDF
        </Heading>
        <Text color="gray.600" fontSize="md" mb={4} fontStyle="italic">
          Upload a PowerPoint file and convert it to a PDF instantly!
        </Text>

        {!pptFile && (
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
              <FormLabel htmlFor="ppt-upload" fontWeight="semibold" fontSize="lg" color="gray.700">
                Choose PowerPoint file to Convert
              </FormLabel>
              <Flex align="center" justify="space-between" gap={4}>
                <Button
                  as="label"
                  htmlFor="ppt-upload"
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
                  id="ppt-upload"
                  type="file"
                  accept=".ppt,.pptx"
                  display="none"
                  onChange={handleFileChange}
                />
              </Flex>
            </FormControl>
          </Box>
        )}

        {pptFile && (
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
              {pptFile.name}
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
          leftIcon={<FaFilePdf />}
          fontWeight="bold"
          borderRadius="lg"
          isDisabled={loading || !pptFile}
        >
          {loading ? <Spinner size="lg" /> : 'Convert to PDF'}
        </Button>
      </VStack>
    </Container>
  );
};

export default ConvertPptToPdf;
