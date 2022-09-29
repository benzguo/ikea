import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import NumberFormat from 'react-number-format';
import { Box, Card, Button, Text, Flex, Input, Badge, Textarea, Radio, Label, Link } from 'theme-ui';
import fetchJson from '../lib/fetchJson';

const HomePage = (props) => {
  const [account, setAccount] = useState<object | null>(null);
  const [balance, setBalance] = useState<object | null>(null);
  const [platform, setPlatform] = useState<object | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<object | null>(null);
  const [createAccountError, setCreateAccountError] = useState<object | null>(null);
  const [actionError, setActionError] = useState<object | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [chargeId, setChargeId] = useState<string | null>(null);
  const [payoutId, setPayoutId] = useState<string | null>(null);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [flow, setFlow] = useState<string>('destination');
  const [xpType, setXpType] = useState<string>('express');
  const [bizType, setBizType] = useState<string>('individual');
  const [capabilities, setCapabilities] = useState<string>('payments_transfers');
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
      flow: 'destination',
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
      setActionError(null);
    } catch (e) {
      setActionError(e);
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
      let response = await fetchJson(url, {
        method: 'GET',
      });
      setAccount(response.account);
      url = `/api/balances/${secretKey}/${accountId}`;
      response = await fetchJson(url, {
        method: 'GET',
      });
      setBalance(response.balance);
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
        <Text sx={{ fontSize: 2, fontWeight: 'bold', pb: 1, pt: 1, my: 0 }}>Express demo:</Text>
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
                placeholder="your platform's secret key"
                value={secretKey}
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
                  setChargeId(null);
                  setTransferId(null);
                  setPayoutId(null);
                  localStorage.setItem('account_id', '');
                  localStorage.setItem('secret_key', '');
                  localStorage.setItem('checkout_session_id', '');
                }}
              >
                Clear
              </Button>
            </Flex>

            {isValidSecretKey(secretKey) && (
              <Box>
                {!isValidAccountId(accountId) && (
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
                      <Flex>
                        <Box>
                          <Label>experience type</Label>
                          <Box>
                            <Label>
                              <Radio
                                name="xptype"
                                value="express"
                                defaultChecked={true}
                                onChange={(event) => {
                                  setXpType(event.target.value);
                                }}
                              />
                              Express
                            </Label>
                            <Label>
                              <Radio
                                name="xptype"
                                value="custom"
                                onChange={(event) => {
                                  setXpType(event.target.value);
                                }}
                              />
                              Custom
                            </Label>
                            <Label>
                              <Radio
                                name="xptype"
                                value="standard"
                                onChange={(event) => {
                                  setXpType(event.target.value);
                                }}
                              />
                              Standard
                            </Label>
                            <Input
                              placeholder="email"
                              sx={{ fontSize: 0, mt: 2 }}
                              value={email}
                              onChange={(t) => {
                                setEmail(t.target.value);
                              }}
                            />
                            <Button
                              variant="button_med"
                              mt={2}
                              onClick={async () => {
                                try {
                                  const body = {
                                    secret_key: secretKey,
                                    biz_type: bizType,
                                    xp_type: xpType,
                                    capabilities: capabilities,
                                    email: email,
                                  };
                                  const response = await fetchJson('/api/create_account', {
                                    method: 'POST',
                                    body: JSON.stringify(body),
                                  });
                                  console.log(response);
                                  setAccountId(response.account_id);
                                  setCreateAccountError(null);
                                } catch (e) {
                                  console.error(e);
                                  setCreateAccountError(e);
                                  return;
                                }
                              }}
                            >
                              🪄 Create account
                            </Button>
                          </Box>
                        </Box>
                        <Box sx={{ pl: 3 }}>
                          <Label>business type</Label>
                          <Box>
                            <Label>
                              <Radio
                                name="biztype"
                                value="individual"
                                defaultChecked={true}
                                onChange={(event) => {
                                  setBizType(event.target.value);
                                }}
                              />
                              individual
                            </Label>
                            <Label>
                              <Radio
                                name="biztype"
                                value="company"
                                onChange={(event) => {
                                  setBizType(event.target.value);
                                }}
                              />
                              company
                            </Label>
                            <Label>capabilities</Label>
                            <Box>
                              <Label>
                                <Radio
                                  name="capabilities"
                                  value="payments_transfers"
                                  defaultChecked={true}
                                  onChange={(event) => {
                                    setCapabilities(event.target.value);
                                  }}
                                />
                                payments+transfers
                              </Label>
                              <Label>
                                <Radio
                                  name="capabilities"
                                  value="transfers_only"
                                  onChange={(event) => {
                                    setCapabilities(event.target.value);
                                  }}
                                />
                                transfers only
                              </Label>
                            </Box>
                          </Box>
                        </Box>
                      </Flex>
                    </Box>
                    {capabilities === 'transfers_only' && (
                      <Text sx={{ fontSize: 0 }}>⚠️ Your platform must be approved to create payee accounts</Text>
                    )}
                  </Card>
                )}
                <Flex>
                  <Input
                    id={props.id}
                    px={16}
                    py={10}
                    sx={{ fontSize: 3, color: 'white', bg: 'black' }}
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
                      setChargeId(null);
                      setTransferId(null);
                      setPayoutId(null);
                      localStorage.setItem('secret_key', '');
                      localStorage.setItem('checkout_session_id', '');
                    }}
                  >
                    Clear
                  </Button>
                </Flex>
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
                      {account['email'] ?? 'no email'}
                    </Badge>
                  </Flex>
                )}
                {createAccountError && (
                  <Box>
                    <Textarea
                      rows={8}
                      defaultValue={JSON.stringify(createAccountError['data'], null, 2)}
                      sx={{ fontSize: 0, borderColor: 'lightRed', bg: 'lightRed' }}
                    />
                  </Box>
                )}
                {balance && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bg: 'lightGray',
                    }}
                  >
                    <Text sx={{ fontSize: 1 }}>available balance: {balance['available'][0]['amount']}</Text>
                    <Text sx={{ fontSize: 1 }}>pending balance: {balance['pending'][0]['amount']}</Text>
                  </Box>
                )}
                {account && (
                  <Box>
                    <Textarea
                      rows={15}
                      defaultValue={JSON.stringify(account, null, 2)}
                      sx={{ fontSize: 0, borderColor: 'lightGray', bg: 'lightBlue' }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box sx={{ p: 2 }}>
            <Text sx={{ fontSize: 0, my: 0, pr: 1, fontWeight: 'bold' }}>
              Why can't I sign into <Link href="https://express.stripe.com/">express.stripe.com</Link> or the mobile app
              after onboarding a testmode account?
            </Text>
            <Text sx={{ fontSize: 0, my: 0, pr: 1 }}>
              To persist a testmode account, first <Link href="https://dashboard.stripe.com/register">sign up</Link> for
              a direct Stripe account with the email you want to claim. Then, onboard the account to Express, using the
              same email you just used.
            </Text>
          </Box>
        </Card>
        {account && (
          <Card variant="card_dotted_gray" sx={{ my: 2 }}>
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
                    🚪 Open Connect Onboarding
                  </Button>
                  <Text sx={{ fontSize: 0 }}>
                    {accountLink ? '⏲ created account link ...' : '^ creates an account_link'}
                  </Text>
                  {accountLink && (
                    <Link sx={{ fontSize: 0 }} href={accountLink}>
                      {accountLink}
                    </Link>
                  )}
                </>
              </Box>

              {account && (
                <>
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
                    <Box>
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
                        🏠 Open Express Dashboard
                      </Button>
                      <Text sx={{ fontSize: 0 }}>
                        {loginLink ? `⏲ created login link ...` : '^ creates a login_link'}
                      </Text>
                      {loginLink && (
                        <Link sx={{ fontSize: 0 }} href={loginLink}>
                          {loginLink}
                        </Link>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
            {account && (
              <Card variant="card_dotted_green" sx={{ my: 2 }}>
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
                <Box
                  sx={{
                    mt: 0,
                    p: 2,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: `1px dashed lightBlue`,
                    bg: 'offWhite',
                  }}
                >
                  <Flex sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Button
                      variant="button_med"
                      onClick={async () => {
                        try {
                          const body = { secret_key: secretKey, account_id: accountId, amount: amount };
                          let url = `/api/send_funds`;
                          let response = await fetchJson(url, {
                            method: 'POST',
                            body: JSON.stringify(body),
                          });
                          setTransferId(response.transfer);
                          url = `/api/balances/${secretKey}/${accountId}`;
                          response = await fetchJson(url, {
                            method: 'GET',
                          });
                          setBalance(response.balance);
                          setActionError(null);
                        } catch (e) {
                          setActionError(e);
                          console.error(e);
                          return;
                        }
                      }}
                    >
                      ➡️ Send funds
                    </Button>
                  </Flex>
                  <Text sx={{ fontSize: 0 }}>
                    Create a transfer from your platform balance. Balance will be available immediately. You may need to
                    add to your platform balance in the
                    <Link sx={{ pl: 1, fontSize: 0 }} href="https://dashboard.stripe.com/test/balance/overview">
                      Stripe Dashboard
                    </Link>
                    .
                  </Text>
                  {transferId && <Text sx={{ fontSize: 0 }}>{'⏲ Created transfer: ' + transferId}</Text>}
                </Box>
                <Box
                  sx={{
                    mt: 0,
                    p: 2,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: `1px dashed lightBlue`,
                    bg: 'offWhite',
                  }}
                >
                  <Flex sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Button
                      variant="button_med"
                      onClick={async () => {
                        try {
                          const body = { secret_key: secretKey, account_id: accountId, amount: amount };
                          let url = `/api/create_payout`;
                          let response = await fetchJson(url, {
                            method: 'POST',
                            body: JSON.stringify(body),
                          });
                          setPayoutId(response.payout);
                          url = `/api/balances/${secretKey}/${accountId}`;
                          response = await fetchJson(url, {
                            method: 'GET',
                          });
                          setBalance(response.balance);
                          setActionError(null);
                        } catch (e) {
                          setActionError(e);
                          console.error(e);
                          return;
                        }
                      }}
                    >
                      💸 Create payout
                    </Button>
                  </Flex>
                  <Text sx={{ fontSize: 0 }}>Create an in-flight payout from the account's available balance.</Text>
                  {payoutId && <Text sx={{ fontSize: 0 }}>{'⏲ Created payout: ' + payoutId}</Text>}
                </Box>
                <Box
                  sx={{
                    mt: 0,
                    p: 2,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: `1px dashed lightBlue`,
                    bg: 'offWhite',
                  }}
                >
                  <Input
                    sx={{ fontSize: 2 }}
                    name="message"
                    id="message"
                    placeholder="Description"
                    my={1}
                    ref={descriptionInputRef}
                  />
                  <Flex sx={{ justifyContent: 'space-between', mt: 2, mb: 1 }}>
                    <Button
                      variant="button_med"
                      onClick={async () => {
                        try {
                          const body = {
                            secret_key: secretKey,
                            account_id: accountId,
                            amount: amount,
                            description: descriptionInputRef.current.value,
                          };
                          let url = `/api/create_charge`;
                          let response = await fetchJson(url, {
                            method: 'POST',
                            body: JSON.stringify(body),
                          });
                          setChargeId(response.charge);
                          url = `/api/balances/${secretKey}/${accountId}`;
                          response = await fetchJson(url, {
                            method: 'GET',
                          });
                          setBalance(response.balance);
                          setActionError(null);
                        } catch (e) {
                          setActionError(e);
                          console.error(e);
                          return;
                        }
                      }}
                    >
                      💳 Create charge
                    </Button>
                  </Flex>
                  {chargeId && (
                    <Box>
                      <Badge sx={{ bg: 'green' }}>{chargeId}</Badge>
                    </Box>
                  )}
                  {chargeId && <Text sx={{ fontSize: 0 }}>{'⏲ Created charge: ' + chargeId}</Text>}
                  <Text sx={{ fontSize: 0 }}>
                    Create a destination charge. The description can be displayed in the Express dashboard (opt-in by
                    platform). Balance will be pending. Testmode only.
                  </Text>
                </Box>
                <Box
                  sx={{
                    mt: 0,
                    p: 2,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: `1px dashed lightBlue`,
                    bg: 'offWhite',
                  }}
                >
                  <Flex sx={{ justifyContent: 'space-between', mt: 2, mb: 1 }}>
                    <Button
                      variant="button_med"
                      type="submit"
                      onClick={async (e) => {
                        handleCheckout(e);
                      }}
                    >
                      🖥 Pay with Stripe Checkout
                    </Button>
                  </Flex>

                  {checkoutSession && (
                    <Box>
                      <Badge sx={{ bg: 'green' }}>{checkoutSession['payment_intent']['id']}</Badge>
                    </Box>
                  )}
                  <Text sx={{ fontSize: 0 }}>
                    Create a checkout session (destination charge). Balance will be pending.
                  </Text>
                </Box>
              </Card>
            )}
            {actionError && (
              <Box>
                <Textarea
                  rows={7}
                  defaultValue={JSON.stringify(actionError['data'], null, 2)}
                  sx={{ fontSize: 0, borderColor: 'lightRed', bg: 'lightRed' }}
                />
              </Box>
            )}
          </Card>
        )}
      </Layout>
    </>
  );
};

export default HomePage;
