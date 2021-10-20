import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import NumberFormat from 'react-number-format';
import { Box, Card, Button, Text, Flex, Input, Badge, Textarea, Radio, Label, Link } from 'theme-ui';
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
        <Flex>
          <Text sx={{ fontSize: 3, pb: 1, pt: 2, my: 0 }}>💡</Text>
          <Link sx={{ fontSize: 3, pb: 1, py: 2, my: 0 }} href="https://github.com/benzguo/lightbulb">
            lightbulb
          </Link>
        </Flex>
        <Text sx={{ fontSize: 2, fontWeight: 'bold', pb: 1, pt: 1, my: 0 }}>View a demo user:</Text>
        <Card variant="card_dotted_gray" sx={{ my: 2 }}>
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
                    const body = {
                      secret_key:
                        'sk_test_51JWkRwKYE2rcCQqxoT96He2XIHGBYQXw9iZPGJeYR3A3rirJfn4glbvrKlWPo5GHTqN75OAm5efvHqlWRyUrgwrH00peSaONV9',
                      account_id: 'acct_1Jhj8OQNd6S9rWR9',
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
                bg.tests.express+demo
              </Button>
            </>
            <Box>
              <Link href="/demo" sx={{ fontSize: 2 }}>
                Deliverly Driver Portal
              </Link>
            </Box>
          </Box>
        </Card>
        <Text sx={{ fontSize: 2, fontWeight: 'bold', pb: 1, pt: 1, my: 0 }}>Or enter your own keys:</Text>
        <Text sx={{ fontSize: 0, pb: 1, pt: 1, my: 0 }}>🔒 keys are only stored locally in your browser</Text>
        <Text sx={{ fontSize: 0, pb: 1, pt: 1, my: 0 }}>🌐 open the console to see API requests & responses</Text>
        <Card variant="card_dotted_gray" sx={{ my: 2 }}>
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
            <Link sx={{ fontSize: 1 }} href={`https://dashboard.stripe.com/apikeys`}>
              dashboard.stripe.com/apikeys
            </Link>
            <Flex>
              <Input
                id={props.id}
                px={16}
                py={10}
                sx={{ fontSize: 12 }}
                value={secretKey}
                placeholder="your platform's secret key"
                onChange={(t) => {
                  setSecretKey(t.target.value);
                }}
              />
              <Button
                variant="button_small"
                mr={2}
                onClick={async () => {
                  setSecretKey('');
                  setAccountId('');
                  setCheckoutSessionId('');
                  setPlatform(null);
                  setAccount(null);
                  localStorage.setItem('account_id', '');
                  localStorage.setItem('secret_key', '');
                  localStorage.setItem('checkout_session_id', '');
                }}
              >
                Clear
              </Button>
            </Flex>
            <Text sx={{ fontSize: 0 }}>^ use a testmode key (livemode is also supported but be careful 💸)</Text>

            {isValidSecretKey(secretKey) && (
              <Box>
                {!isValidAccountId(accountId) && (
                  <Flex>
                    <Button
                      variant="button_med"
                      mx={3}
                      my={1}
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
                  </Flex>
                )}
                <Flex>
                  <Input
                    id={props.id}
                    px={16}
                    py={10}
                    sx={{ fontSize: 12 }}
                    value={accountId}
                    placeholder="or enter an existing account id"
                    onChange={(t) => {
                      setAccountId(t.target.value);
                    }}
                  />
                  <Button
                    variant="button_small"
                    mr={2}
                    onClick={async () => {
                      setAccountId('');
                      setCheckoutSessionId('');
                      setAccount(null);
                      localStorage.setItem('secret_key', '');
                      localStorage.setItem('checkout_session_id', '');
                    }}
                  >
                    Clear
                  </Button>
                </Flex>
                {!isValidAccountId(accountId) && (
                  <Flex>
                    <Text sx={{ fontSize: 0, my: 0, pr: 1 }}>don't remember the ol account ID? look it up</Text>
                    <Link
                      sx={{ fontSize: 0, my: 0, py: 0 }}
                      href={`https://dashboard.stripe.com/connect/accounts/overview`}
                    >{`in the connect dashboard`}</Link>
                  </Flex>
                )}
                <Box py={2} />
                {platform && platform['settings'] && (
                  <Flex>
                    <Text sx={{ fontSize: 1, fontWeight: 'bold', mr: 1 }}>Platform:</Text>
                    <Badge mx={0} bg={'blue'}>
                      {platform['settings']['dashboard']['display_name']}
                    </Badge>
                  </Flex>
                )}
                {account && (
                  <Flex>
                    <Text sx={{ fontSize: 1, fontWeight: 'bold', mr: 1 }}>Connected account:</Text>
                    <Badge mx={0} sx={{ bg: 'purple' }}>
                      {account['email']}
                    </Badge>
                  </Flex>
                )}
                {account && (
                  <Textarea
                    rows={15}
                    defaultValue={JSON.stringify(account, null, 2)}
                    sx={{ borderColor: 'lightGray', bg: 'lightBlue' }}
                  />
                )}
                {account && (
                  <Link
                    sx={{ fontSize: 1 }}
                    href={`https://dashboard.stripe.com/connect/accounts/${accountId}`}
                  >{`dashboard.stripe.com/connect/accounts/${accountId}`}</Link>
                )}
              </Box>
            )}
          </Box>
        </Card>
        {isValidAccountId(accountId) && (
          <Card variant="card_dotted_gray" sx={{ my: 2 }}>
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
                          setAccountLink(url);
                        } catch (e) {
                          // TODO: handle error
                          console.error(e);
                          return;
                        }
                        setTimeout(function () {
                          window.location.assign(url);
                        }, 1500);
                      }}
                    >
                      Open Express Onboarding
                    </Button>
                    <Text sx={{ fontSize: 0 }}>
                      {accountLink ? 'created account link ... redirecting ...' : '^ creates an account_link'}
                    </Text>
                    {accountLink && (
                      <Link sx={{ fontSize: 1 }} href={accountLink}>
                        {accountLink}
                      </Link>
                    )}
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
                            console.log(url);
                            setLoginLink(url);
                            setTimeout(function () {
                              window.location.assign(url);
                            }, 1500);
                          } catch (e) {
                            // TODO: handle error
                          }
                        }}
                      >
                        Open Express Dashboard
                      </Button>
                      <Text sx={{ fontSize: 0 }}>
                        {loginLink ? `created login link ... redirecting ...` : '^ creates a login_link'}
                      </Text>
                      {loginLink && (
                        <Link sx={{ fontSize: 1 }} href={loginLink}>
                          {loginLink}
                        </Link>
                      )}
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
                    <Input name="message" id="message" placeholder="Description" my={1} ref={descriptionInputRef} />
                    <Label>
                      <Radio
                        name="flow"
                        value="direct"
                        defaultChecked={true}
                        onChange={(event) => {
                          setFlow(event.target.value);
                        }}
                      />
                      Direct
                    </Label>
                    <Label>
                      <Radio
                        name="flow"
                        value="destination"
                        onChange={(event) => {
                          setFlow(event.target.value);
                        }}
                      />
                      Destination
                    </Label>
                    <Label>
                      <Radio
                        name="flow"
                        value="destination_obo"
                        onChange={(event) => {
                          setFlow(event.target.value);
                        }}
                      />
                      Destination On behalf of
                    </Label>
                    <Label>
                      <Radio
                        name="flow"
                        value="sct"
                        onChange={(event) => {
                          setFlow(event.target.value);
                        }}
                      />
                      Separate Charge (and Transfer with cURL)
                    </Label>
                    {checkoutSession && (
                      <Box>
                        <Badge sx={{ bg: 'green' }}>{checkoutSession['payment_intent']['id']}</Badge>
                        <Link
                          href={`https://dashboard.stripe.com/payments/${checkoutSession['payment_intent']['id']}`}
                          sx={{ pl: 2, fontSize: 1 }}
                        >{`view last payment in Stripe Dashboard`}</Link>
                      </Box>
                    )}
                    {flow == 'sct' &&
                      checkoutSession &&
                      checkoutSession['payment_intent'] &&
                      checkoutSession['payment_intent']['charges'] &&
                      checkoutSession['payment_intent']['charges']['data'] && (
                        <>
                          <Text sx={{ fontSize: 1, fontStyle: 'italic' }} mt={3}>
                            ℹ️ Run this command to send a transfer after creating a Separate Charge using the "Pay with
                            Stripe Checkout" button above. Janky, I know. This just looks up the last charge ID you
                            created and sets it as the source of the transfer in the curl command.
                          </Text>
                          {
                            <Textarea
                              rows={10}
                              sx={{ borderColor: 'lightGray', bg: 'lightBlue' }}
                              defaultValue={`curl https://api.stripe.com/v1/transfers \\
-u ${secretKey}: \\
-d amount=${checkoutSession['payment_intent']['charges']['data'][0]['amount']} \\
-d currency="usd" \\
-d description="TRANSFER DESCRIPTION" \\
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
