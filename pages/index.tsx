import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import NumberFormat from 'react-number-format';
import { Box, Card, Button, Text, Flex, Input, Badge, Textarea } from 'theme-ui';
import BlockTextarea from '../components/BlockTextarea';
import fetchJson from '../lib/fetchJson';

const HomePage = (props) => {
  const [account, setAccount] = useState<object | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [amount, setAmount] = useState(0.5);

  const isValidSecretKey = (key: string): boolean => {
    return key && key.startsWith('sk_') && key.length > 12;
  };

  const isValidAccountId = (id: string): boolean => {
    return id && id.startsWith('acct_') && id.length > 12;
  };

  useEffect(() => {
    setAccountId(localStorage.getItem('account_id'));
    if (isValidAccountId(accountId)) {
      fetchAccount();
    }
    setSecretKey(localStorage.getItem('secret_key'));
  }, []);

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

  useEffect(() => {
    if (isValidAccountId(accountId)) {
      fetchAccount();
      localStorage.setItem('account_id', accountId);
    }
    if (isValidSecretKey(secretKey)) {
      localStorage.setItem('secret_key', secretKey);
    }
    if (!accountId || accountId.length === 0) {
      localStorage.setItem('account_id', '');
    }
    if (!secretKey || secretKey.length === 0) {
      localStorage.setItem('secret_key', '');
    }
  }, [accountId, secretKey]);

  const handleCheckout = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const body = { amount: amount, message: inputRef.current.value, secret_key: secretKey, account_id: accountId };
    let checkoutSessionUrl = null;
    try {
      const response = await fetchJson('/api/create_checkout_session', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      checkoutSessionUrl = response.url;
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

  return (
    <>
      <Layout>
        <Card variant="card_dotted_gray" sx={{ my: 4, textAlign: 'center', fontSize: 35 }}>
          💡
        </Card>
        <Card variant="card_dotted_gray" sx={{ my: 4 }}>
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
            <BlockTextarea
              id={props.id}
              px={16}
              py={10}
              defaultValue={secretKey}
              placeholder="secret key"
              onChange={(t) => {
                setSecretKey(t.target.value);
              }}
            />
            {isValidSecretKey(secretKey) && (
              <Box>
                {!isValidAccountId(accountId) && (
                  <Button
                    variant="button_med"
                    mx={3}
                    onClick={async () => {
                      try {
                        const body = { secret_key: secretKey };
                        const response = await fetchJson('/api/create_account', {
                          method: 'POST',
                          body: JSON.stringify(body),
                        });
                        console.log(response);
                        setAccountId(response.account_id);
                      } catch (e) {
                        // TODO: handle error
                        console.error(e);
                        return;
                      }
                    }}
                  >
                    Create account
                  </Button>
                )}
                {isValidAccountId(accountId) && <Badge mx={3}>{accountId}</Badge>}
                <BlockTextarea
                  id={props.id}
                  px={16}
                  py={10}
                  defaultValue={accountId}
                  placeholder="or enter account id"
                  onChange={(t) => {
                    setAccountId(t.target.value);
                  }}
                />
                {account && (
                  <Textarea
                    rows={15}
                    value={JSON.stringify(account, null, 2)}
                    sx={{ borderColor: 'lightGray', bg: 'lightBlue' }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Card>
        {isValidAccountId(accountId) && (
          <Card variant="card_dotted_gray" sx={{ my: 4 }}>
            <Box sx={{ mb: 3 }}>
              {account && !account['charges_enabled'] && (
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
                          const body = { secret_key: secretKey, account_id: accountId };
                          const response = await fetchJson('/api/create_account_link', {
                            method: 'POST',
                            body: JSON.stringify(body),
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
                      Open Express Onboarding
                    </Button>
                    <Text variant="text_xs" sx={{ fpt: 2, color: 'gray' }}>
                      ^ creates an account_link
                    </Text>
                  </>
                </Box>
              )}
              {account && account['charges_enabled'] && (
                <>
                  <Box
                    sx={{
                      my: 2,
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
                            const body = { secret_key: secretKey, account_id: accountId };
                            const response = await fetchJson('/api/create_login_link', {
                              method: 'POST',
                              body: JSON.stringify(body),
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
                  <Box
                    sx={{
                      my: 3,
                      p: 2,
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: `1px dashed lightBlue`,
                      bg: 'offWhite',
                    }}
                    as="form"
                    onSubmit={handleCheckout}
                  >
                    <Flex sx={{ justifyContent: 'space-between' }}>
                      <Button variant="button_med" type="submit">
                        Process payment
                      </Button>
                    </Flex>
                    <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <NumberFormat
                          name="amount"
                          id="amount"
                          decimalScale={2}
                          allowEmptyFormatting={true}
                          allowNegative={false}
                          type="tel"
                          prefix="$"
                          displayType={'input'}
                          customInput={Input}
                          value={amount as number}
                          renderText={(value) => <Input value={value}></Input>}
                          onValueChange={(values) => setAmount(values.floatValue)}
                        />
                      </Box>
                    </Flex>
                    <Input
                      variant="input_payment_message"
                      name="message"
                      id="message"
                      placeholder="Message"
                      my={1}
                      ref={inputRef}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Card>
        )}
      </Layout>
    </>
  );
};

export default HomePage;
