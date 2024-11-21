import { Box, Heading, VStack } from '@chakra-ui/react';

const Layout = ({ children }) => (
  <Box p={5}>
    console.log('Rendering Layout component');
    <VStack spacing={5}>{children}</VStack>
  </Box>
);

export default Layout;
