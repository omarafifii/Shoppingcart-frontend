import React, { Fragment } from 'react';
import { MyContext } from '../App';

import {
  Center,
  ArrowForwardIcon,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Text,
  Stack,
  Link,
  Button,
  ButtonGroup,
  Heading,
  Divider,
  Th,
  Tr,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Image,
  A,
  HStack,
} from '@chakra-ui/react';

const ShoppingCart = props => {
  const initialState = {
    products: null,
    coupon: null,
    sub_total: null,
    total: null,
  };
  const [state, setState] = React.useState(initialState);
  const api_url = process.env.REACT_APP_API_URL;

  const [couponValue, setValue] = React.useState('');
  const handleCouponInput = event => setValue(event.target.value);

  // this function is called when the coupon apply button is clicked
  const handleCouponSubmit = () => {
    fetch(api_url + `coupon?code=${couponValue}`, {})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then(resJson => {
        console.log('resJson', resJson);
        let data = {
          ...state,
          coupon: resJson.coupons[0],
        };
        setState(data);
      })
      .catch(error => {
        // console.log(error);
      });
  };

  // this function is called when the user clicks the remove product button
  const handleDelete = myID => {
    // console.log('delete id', myID);
    fetch(api_url + `product?id=${myID}`, {
      method: 'delete',
    })
      .then(res => {
        if (res.ok) {
          getItems();
          return;
        } else {
          throw res;
        }
      })
      // .then(resJson => {
      //   // console.log(resJson);

      // })
      .catch(error => {
        // console.log(error);
      });
  };

  // This function is used to get the list of products from the database
  const getItems = () => {
    fetch(api_url + 'product', {})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then(resJson => {
        console.log('resJson', resJson);
        let data = {
          ...state,
          products: resJson.products,
        };
        setState(data);
      })
      .catch(error => {
        // console.log(error);
      });
  };

  React.useEffect(() => {
    getItems();
  }, []);

  React.useEffect(() => {
    calcSubTotal();
  }, [state.products]);

  React.useEffect(() => {
    calcTotal();
  }, [state.coupon]);

  // This function is used to calculate the total before applying the coupon.
  const calcSubTotal = () => {
    if (state.products) {
      let subTotal = 0;
      for (const prod of state.products) {
        subTotal = subTotal + prod.price;
      }
      setState({
        ...state,
        sub_total: subTotal,
      });
    }
  };

  // This function is used to calculate the total after applying the coupon.
  const calcTotal = () => {
    if (state.coupon) {
      if (state.coupon.type === 'percent') {
        let myTotal = state.sub_total * (1 - state.coupon.value / 100);
        setState({
          ...state,
          total: myTotal,
        });
      }
      if (state.coupon.type === 'fixed') {
        let myTotal = state.sub_total - state.coupon.value;
        setState({
          ...state,
          total: myTotal,
        });
      }
    }
  };

  return (
    <Fragment>
      <Heading m={8} as="h3" size="lg">
        Shopping Cart
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Items</Th>
            <Th>Price</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {state.products &&
            state.products.map(product => (
              <Tr key={product._id}>
                <Td>{product.name}</Td>
                <Td>{product.price}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDelete(product._id)}
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          <Tr>
            <Td></Td>
          </Tr>
          <Tr fontWeight="bold">
            <Td>Sub-total: </Td>
            <Td>{state.sub_total}</Td>
          </Tr>
          <Tr fontWeight="bold">
            <Td>Total: </Td>
            <Td>{state.total ? state.total : state.sub_total}</Td>
          </Tr>
        </Tbody>
      </Table>
      <br />
      <Center>
        <Stack>
          <Text fontSize="md">Have a coupon? Enter it below:</Text>
          <HStack>
            <Input
              value={couponValue}
              onChange={handleCouponInput}
              placeholder="Enter coupon here"
              size="md"
            />
            <Button onClick={handleCouponSubmit} colorScheme="teal" size="sm">
              Apply
            </Button>
          </HStack>
        </Stack>
      </Center>
    </Fragment>
  );
};

export default ShoppingCart;
