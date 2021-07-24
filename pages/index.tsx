import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import PaymentBlock from '../components/PaymentBlock';
import { Box, Card, Button, Text } from 'theme-ui';
import fetchJson from '../lib/fetchJson';

const UserPage = (props) => {
  return (
    <>
      <Layout>
        <PaymentBlock stripeAccount={{ id: process.env.LOCAL_CONNECTED_ACCOUNT_ID }} />
        <Card variant="card_dotted_gray" sx={{ my: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px dashed lightBlue`,
                bg: 'offWhite',
              }}
            >
              <>
                <Button
                  variant="button_med"
                  mr={2}
                  onClick={async () => {
                    let url = null;
                    try {
                      const response = await fetchJson('/api/connect_stripe', {
                        method: 'POST',
                      });
                      console.log(response);
                      url = response.url;
                    } catch (e) {
                      // TODO: handle error
                      console.error(e);
                      return;
                    }
                    window.location.assign(url);
                  }}
                >
                  Open Express Onbboarding
                </Button>
                <Text variant="text_xs" sx={{ fpt: 2, color: 'gray' }}>
                  ^ creates an account_link
                </Text>
              </>
            </Box>
            <Box
              sx={{
                mt: 4,
                p: 2,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px dashed lightBlue`,
                bg: 'offWhite',
              }}
            >
              <>
                <Button
                  variant="button_med"
                  onClick={async () => {
                    try {
                      const response = await fetchJson('/api/login_link', {
                        method: 'POST',
                      });
                      const url = response.url;
                      window.location.assign(url);
                    } catch (e) {
                      // TODO: handle error
                    }
                  }}
                >
                  Open Express Dashboard
                </Button>
                <Text variant="text_xs" sx={{ fpt: 2, color: 'gray' }}>
                  ^ creates a login_link
                </Text>
              </>
            </Box>
          </Box>
        </Card>
      </Layout>
    </>
  );
};

export default UserPage;
