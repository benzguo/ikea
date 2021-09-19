import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { Flex, Text } from 'theme-ui';

const HomePage = (props) => {
  return (
    <>
      <Layout>
        <Flex>
          <Text sx={{ fontSize: 100 }}>❌</Text>
        </Flex>
      </Layout>
    </>
  );
};

export default HomePage;
