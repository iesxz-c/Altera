import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  Icon,
  Button
} from '@chakra-ui/react';
import { FaFilePdf, FaCompress, FaFileWord, FaFilePowerpoint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const tools = [
  { name: 'Merge PDF', description: 'Combine PDFs in the order you want.', icon: FaFilePdf, path: '/merge-pdf' },
  { name: 'Docs to PDF', description: 'Convert documents into PDF format.', icon: FaFilePdf, path: '/docs-to-pdf' },
  { name: 'PDF to Doc', description: 'Convert PDFs into editable Word documents.', icon: FaCompress, path: '/pdf-to-doc' },
  { name: 'Merge Docs', description: 'Combine multiple Word documents into one.', icon: FaFileWord, path: '/merge-docs' },
  { name: 'PDF to PowerPoint', description: 'Convert PDFs into editable PowerPoint slides.', icon: FaFilePowerpoint, path: '/pdf-to-powerpoint' },
  { name: 'PDF to Images', description: 'Convert PDFs into images.', icon: FaFilePdf, path: '/pdf-to-images' },
  { name: 'Images to PDF', description: 'Convert images into PDF format.', icon: FaFilePdf, path: '/images-to-pdf' },
  { name: 'PowerPoint to PDF', description: 'Convert PowerPoint presentations into PDF format.', icon: FaFilePowerpoint, path: '/powerpoint-to-pdf' },
  { name: 'OCR PDF', description: 'Extract text from scanned PDFs using OCR technology.', icon: FaFilePdf, path: '/ocr-pdf' },
];

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Box textAlign="center" p="8">
        <Heading as="h1" size="2xl" mb="4" color="gray.700">
          You Say Documents  We Hear Altera
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Merge, split, compress, convert, and more with just a few clicks.
        </Text>
      </Box>

      <Grid
        templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap="6"
        p="8"
        maxW="1200px"
        mx="auto"
      >
        {tools.map((tool, index) => (
          <GridItem
            key={index}
            p="6"
            borderWidth="1px"
            borderRadius="md"
            bg="white"
            shadow="md"
            _hover={{ transform: "scale(1.05)", shadow: "lg", transition: "0.3s ease-in-out" }}
            cursor="pointer"
            onClick={() => handleNavigation(tool.path)}
          >
            <Flex align="center" mb="4">
              <Icon as={tool.icon} w="6" h="6" color="red.500" mr="4" aria-label={tool.name} />
              <Heading as="h3" size="md" color="gray.700">{tool.name}</Heading>
            </Flex>
            <Text color="gray.600">{tool.description}</Text>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
