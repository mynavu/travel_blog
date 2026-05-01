// U11

export function Login() {
  // Logs in
  const logIn = () => {
    const result = axios.post(
      url,
      { email: "a@b.com", password: "123456" }, // body (second arg)
      { headers: { "X-Authorization": token } }, // config (third arg)
    );
    setCookie("token", response.data.token);
    setCookie("userId", response.data.userId);
  };
  return <></>;
}
