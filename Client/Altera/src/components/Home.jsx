import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  HStack,
  VStack,
  Grid,
  GridItem,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { FaFilePdf, FaCompress, FaEdit } from 'react-icons/fa';

const Home = () => {
  return (
    <Box>
      {/* Header */}
      <Flex bg="gray.100" p={4} align="center">
        <Heading size="md" color="teal.500">
          MyPDFTools
        </Heading>
        <Spacer />
        <HStack spacing={4}>
          <Button variant="link" color="teal.500">
            All PDF Tools
          </Button>
          <Button variant="outline" colorScheme="teal">
            Login
          </Button>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box p={8}>
        <Heading size="lg" mb={4}>
          Select a Tool
        </Heading>

        {/* Categories */}
        <Box mb={8}>
          <Heading size="md" mb={4}>
            Organize PDF
          </Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={6}>
            <GridItem>
              <VStack
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="sm"
                bg="white"
                align="center"
                spacing={2}
              >
                <IconButton
                  icon={<FaFilePdf />}
                  aria-label="Merge PDF"
                  isRound
                  size="lg"
                  colorScheme="teal"
                />
                <Text fontSize="sm" fontWeight="bold">
                  Merge PDF
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="sm"
                bg="white"
                align="center"
                spacing={2}
              >
                <IconButton
                  icon={<FaCompress />}
                  aria-label="Compress PDF"
                  isRound
                  size="lg"
                  colorScheme="orange"
                />
                <Text fontSize="sm" fontWeight="bold">
                  Compress PDF
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="sm"
                bg="white"
                align="center"
                spacing={2}
              >
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Edit PDF"
                  isRound
                  size="lg"
                  colorScheme="purple"
                />
                <Text fontSize="sm" fontWeight="bold">
                  Edit PDF
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
