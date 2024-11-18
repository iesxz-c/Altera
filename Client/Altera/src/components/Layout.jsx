import { Box, Heading, VStack } from '@chakra-ui/react';

const Layout = ({ children }) => (
  <Box p={5}>
    <Heading textAlign="center" mb={6}>
      File Converter & Merger
    </Heading>
    <VStack spacing={5}>{children}</VStack>
  </Box>
);

export default Layout;
