import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';

import { FaFilePdf, FaCompress, FaFileWord, FaFilePowerpoint } from 'react-icons/fa';
const tools = [
  { name: 'Merge PDF', description: 'Combine PDFs in the order you want.', icon: FaFilePdf, path: '/merge-pdf' },
  { name: 'Docs to PDF', description: 'Convert documents into PDF format.', icon: FaFilePdf, path: '/docs-to-pdf' },
  { name: 'PDF to Doc', description: 'Convert PDFs into editable Word documents.', icon: FaCompress, path: '/pdf-to-doc' },
  { name: 'Merge Docs', description: 'Combine multiple Word documents into one.', icon: FaFileWord, path: '/merge-docs' },
  { name: 'PDF to PowerPoint', description: 'Convert PDFs into editable PowerPoint slides.', icon: FaFilePowerpoint, path: '/pdf-to-powerpoint' },
  { name: 'PDF to Images', description: 'Convert PDFs into images.', icon: FaFilePdf, path: '/pdf-to-images' },
  { name: 'Images to PDF', description: 'Convert images into PDF format.', icon: FaFilePdf, path: '/images-to-pdf' },
  { name: 'PowerPoint to PDF', description: 'Convert PowerPoint presentations into PDF format.', icon: FaFilePowerpoint, path: '/powerpoint-to-pdf' },
  { name: 'OCR PDF', description: 'Extract text from PDFs using OCR.', icon: FaFilePdf, path: '/ocr-pdf' },
];
const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Flex as="header" justify="space-between" align="center" p="4" bg="white" shadow="lg">
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="red.500"
          cursor="pointer"
          _hover={{ color: 'red.900', transform: 'scale(1.05)' }}
          onClick={() => navigate('/')}
        >
          Altera
        </Text>


        <Flex gap="4" align="center">

          <Menu isOpen={isOpen}>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="none"
              variant="ghost"
              color="gray.500"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => {
                setTimeout(() => setIsOpen(false), 3000); 
              }}
            >
              Tools
            </MenuButton>
            <MenuList>
              {tools.map((tool, index) => (
                <MenuItem
                  key={index}
                  icon={<Icon as={tool.icon} />}
                  onClick={() => handleNavigation(tool.path)}
                >
                  {tool.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

 
          <Button
            leftIcon={<FaSignInAlt />}
            colorScheme="teal"
            variant="ghost"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            leftIcon={<FaUserPlus />}
            colorScheme="red"
            variant="ghost"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Flex>
      </Flex>

      <Box as="main" p="4">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
