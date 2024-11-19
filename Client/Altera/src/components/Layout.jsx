import { Box, Heading, VStack } from '@chakra-ui/react';

const Layout = ({ children }) => (
  <Box p={5}>
    <VStack spacing={5}>{children}</VStack>
  </Box>
);

export default Layout;
