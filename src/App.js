import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import ShoppingCart from './components/ShoppingCart';

function App() {
  return (
    <ChakraProvider theme={theme}>
       <ShoppingCart />
      </ChakraProvider>
  );
}

export default App;
