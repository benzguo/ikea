import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import { Box, Card, Button, Text, Flex, Image, Badge, Textarea, Radio, Label, Link } from 'theme-ui';
import fetchJson from '../lib/fetchJson';

const HomePage = (props) => {
  const [account, setAccount] = useState<object | null>(null);
  const [platform, setPlatform] = useState<object | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<object | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [flow, setFlow] = useState<string>('direct');
  const [accountLink, setAccountLink] = useState<string | null>(null);
  const [loginLink, setLoginLink] = useState<string | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement | null>(null);
  const [amount, setAmount] = useState(0.5);

  const isValidSecretKey = (key: string): boolean => {
    return key && key.startsWith('sk_') && key.length > 12;
  };

  const isValidAccountId = (id: string): boolean => {
    return id && id.startsWith('acct_') && id.length > 12;
  };

  useEffect(() => {
    setCheckoutSessionId(localStorage.getItem('checkout_session_id'));
    setAccountId(localStorage.getItem('account_id'));
    setSecretKey(localStorage.getItem('secret_key'));
  }, []);

  useEffect(() => {
    if (isValidSecretKey(secretKey) && isValidAccountId(accountId)) {
      fetchAccount();
      localStorage.setItem('account_id', accountId);
    }
    if (isValidSecretKey(secretKey)) {
      fetchPlatform();
      localStorage.setItem('secret_key', secretKey);
    }
    if (isValidSecretKey(secretKey) && checkoutSessionId) {
      fetchCheckoutSession();
      localStorage.setItem('checkout_session_id', checkoutSessionId);
    }
    // no nulls in localStorage
    if (!accountId) {
      localStorage.setItem('account_id', '');
    }
    if (!secretKey) {
      localStorage.setItem('secret_key', '');
    }
  }, [accountId, secretKey, checkoutSessionId]);

  const handleCheckout = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const body = {
      amount: amount,
      message: descriptionInputRef.current.value,
      secret_key: secretKey,
      account_id: accountId,
      flow: flow,
    };
    console.log(body);
    let checkoutSessionUrl = null;
    try {
      const response = await fetchJson('/api/create_checkout_session', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      checkoutSessionUrl = response.url;
      localStorage.setItem('checkout_session_id', checkoutSessionId);
      setCheckoutSessionId(response.id);
    } catch (e) {
      // TODO: handle errors (in this entire function)
      console.error(e);
      return;
    }

    if (!checkoutSessionUrl) {
      console.error('create checkout session failed');
      return;
    }

    window.location.assign(checkoutSessionUrl);
  };

  const fetchPlatform = async () => {
    try {
      let url = `/api/accounts/${secretKey}`;
      const response = await fetchJson(url, {
        method: 'GET',
      });
      setPlatform(response.account);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const fetchAccount = async () => {
    try {
      let url = `/api/accounts/${secretKey}/${accountId}`;
      const response = await fetchJson(url, {
        method: 'GET',
      });
      setAccount(response.account);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const fetchCheckoutSession = async () => {
    try {
      let url = `/api/checkout_sessions/${secretKey}/${checkoutSessionId}`;
      const response = await fetchJson(url, {
        method: 'GET',
      });
      setCheckoutSession(response.session);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  return (
    <>
      <Layout>
        <Head>
          <title>Deliverly</title>
        </Head>
        <Flex sx={{ alignItems: 'center', my: 3 }}>
          <Image src={'favicon.png'} variant="avatar" />
          <Text sx={{ fontSize: 5, pl: 2, pb: 2, pt: 2, my: 0, fontWeight: 'bold' }}> Deliverly Driver Portal</Text>
        </Flex>
        <Card variant="card_payment_form" sx={{ p: 2, my: 2 }}>
          <Flex>
            <Flex sx={{ flex: '1 1 auto' }}>
              <Box>
                <Text sx={{ fontSize: 3 }}>Your location:</Text>
                <Text sx={{ fontSize: 3, fontWeight: 'bold' }}>San Francisco, CA 🌁</Text>
              </Box>
            </Flex>
            <Button variant="button_emphasis_blue">Schedule a drive</Button>
          </Flex>
        </Card>
        <Card variant="card_dotted_gray" sx={{ p: 3, my: 4 }}>
          <Text sx={{ fontSize: 2, pb: 3 }}>
            Deliverly partners with Stripe for payouts. Go to your Stripe Express dashboard to view payout information
            and manage your Stripe account.
          </Text>
          <Button
            variant="button_emphasis"
            mr={2}
            onClick={async () => {
              let url = null;
              try {
                const body = {
                  secret_key:
                    'sk_test_51JWgt8JYChxmpOh2DGndLkvIN7ycMPuQaZvSoDGFPnQ4e4znjzG4icEC0rGckG5m6A1RJG8PoJYNqZWbud8L9yIM00zU6epima',
                  account_id: 'acct_1JrY6iQp5q3RBDxe',
                };
                const response = await fetchJson('/api/create_login_link', {
                  method: 'POST',
                  body: JSON.stringify(body),
                });
                console.log(response);
                url = response.url;
                setAccountLink(url);
              } catch (e) {
                // TODO: handle error
                console.error(e);
                return;
              }
              setTimeout(function () {
                window.location.assign(url);
              }, 0);
            }}
          >
            → Stripe Express dashboard
          </Button>
        </Card>
      </Layout>
    </>
  );
};

export default HomePage;
