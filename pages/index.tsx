import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import NumberFormat from 'react-number-format';
import { Box, Card, Button, Text, Flex, Input, Badge, Textarea, Radio, Label, Link } from 'theme-ui';
import BlockTextarea from '../components/BlockTextarea';
import fetchJson from '../lib/fetchJson';

const HomePage = (props) => {
  const [account, setAccount] = useState<object | null>(null);
  const [platform, setPlatform] = useState<object | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<object | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [flow, setFlow] = useState<string>('direct');
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
    if (!accountId || accountId.length === 0) {
      localStorage.setItem('account_id', '');
    }
    if (!secretKey || secretKey.length === 0) {
      localStorage.setItem('secret_key', '');
    }
  }, [accountId, secretKey, checkoutSessionId]);

  const handleCheckout = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const body = {
      amount: amount,
      message: inputRef.current.value,
      secret_key: secretKey,
      account_id: accountId,
      flow: flow
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
        <Text sx={{ fontSize: 2, pb: 1, pt: 2, my: 0 }}>💡 lightbulb</Text>
        <Link sx={{ fontSize: 1, pb: 1, py: 0, my: 0 }} href="https://github.com/benzguo/lightbulb">
          github.com/benzguo/lightbulb
        </Link>
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
            {account && <Link sx={{fontSize: 1}} href={`https://dashboard.stripe.com/apikeys`}>dashboard.stripe.com/apikeys</Link>}
            <Input
              type="password"
              id={props.id}
              px={16}
              py={10}
              defaultValue={secretKey}
              placeholder="secret key"
              onChange={(t) => {
                setSecretKey(t.target.value);
              }}
            />
            {platform && platform['business_profile'] && (
              <Badge mx={0} bg={'blue'}>
                {platform['business_profile']['name']}
              </Badge>
            )}
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
                {account && <Badge mx={0} sx={{bg: 'purple'}}>{account["email"]}</Badge>}
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
                {account && <Link sx={{fontSize: 1}} href={`https://dashboard.stripe.com/connect/accounts/overview`}>dashboard.stripe.com/connect/accounts/overview</Link>}
                {account && (
                  <Textarea
                    rows={15}
                    defaultValue={JSON.stringify(account, null, 2)}
                    sx={{ borderColor: 'lightGray', bg: 'lightBlue' }}
                  />
                )}
                {account && <Link sx={{fontSize: 1}} href={`https://dashboard.stripe.com/connect/accounts/${accountId}`}>{`dashboard.stripe.com/connect/accounts/${accountId}`}</Link>}
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
                            console.log(url)
                            // window.location.assign(url);
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
                    <Flex sx={{ justifyContent: 'space-between', mb: 1 }}>
                      <Button variant="button_med" type="submit">
                        Pay with Stripe Checkout
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
                    <Input name="message" id="message" placeholder="Description" my={1} ref={inputRef} />
                    <Label>
                      <Radio name="flow" value="direct" defaultChecked={true} onChange={(event) => {setFlow(event.target.value)}} />
                      Direct
                    </Label>
                    <Label>
                      <Radio name="flow" value="destination" onChange={(event) => {setFlow(event.target.value)}} />
                      Destination
                    </Label>
                    <Label>
                      <Radio name="flow" value="destination_obo" onChange={(event) => {setFlow(event.target.value)}} />
                      Destination On behalf of
                    </Label>
                    <Label>
                      <Radio name="flow" value="sct" onChange={(event) => {setFlow(event.target.value)}} />
                      Separate Charge (and Transfer with cURL)
                    </Label>
                    {checkoutSession && <Box> 
                      <Badge sx={{bg: 'green'}}>{checkoutSession['payment_intent']['id']}</Badge> 
                      <Link href={`https://dashboard.stripe.com/payments/${checkoutSession['payment_intent']['id']}`} sx={{pl: 2, fontSize: 1}}>{`view last payment in Stripe Dashboard`}</Link>
                    </Box>}
                    {checkoutSession && checkoutSession['payment_intent'] && checkoutSession['payment_intent']['charges'] && checkoutSession['payment_intent']['charges']['data'] && (
                      <>
                        <Text mt={3}>⚠️ Run this to send a transfer after Separate Charge</Text>
                        {
                          <Textarea
                            rows={7}
                            sx={{ borderColor: 'lightGray', bg: 'lightBlue' }}
                            defaultValue={`curl https://api.stripe.com/v1/transfers \\
-u ${secretKey}: \\
-d amount=${checkoutSession['payment_intent']['charges']['data'][0]['amount']} \\
-d currency="usd" \\
-d description="transfer description" \\
-d source_transaction="${checkoutSession['payment_intent']['charges']['data'][0]['id']}" \\
-d destination="${accountId}"`}
                          />
                        }
                      </>
                    )}
                    <Link
                      sx={{ fontSize: 1 }}
                      href="https://stripe.com/docs/connect/creating-a-payments-page?platform=web&ui=checkout#accept-a-payment"
                    >
                      Checkout + Connect docs
                    </Link>
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
