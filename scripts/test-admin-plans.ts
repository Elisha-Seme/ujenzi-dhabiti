async function main() {
  const url = "http://localhost:3001";
  console.log("Testing /api/admin/plans...");

  try {
    // 1. Get CSRF token
    const csrfRes = await fetch(`${url}/api/auth/csrf`);
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;
    const setCookie = csrfRes.headers.get("set-cookie");

    // 2. Perform credentials login to get the session token
    const loginRes = await fetch(`${url}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(setCookie ? { Cookie: setCookie } : {}),
      },
      body: new URLSearchParams({
        email: "admin@ujenzidhabiti.co.ke",
        password: "Admin@UjenziDhabiti2025!",
        csrfToken: csrfToken,
      }),
      redirect: "manual",
    });

    const loginCookies = loginRes.headers.get("set-cookie");
    const cookiesArray = loginCookies ? loginCookies.split(/,(?=\s*[a-zA-Z0-9_.-]+=)/) : [];
    const sessionCookie = cookiesArray.find(c => c.trim().startsWith("authjs.session-token="));

    if (!sessionCookie) {
      console.log("No session cookie set!");
      return;
    }

    const cookieHeader = sessionCookie.split(";")[0];
    console.log("Session Cookie parsed successfully.");

    // 3. Fetch admin plans
    console.log("Fetching /api/admin/plans...");
    const plansRes = await fetch(`${url}/api/admin/plans`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    console.log("Plans response status:", plansRes.status);
    const text = await plansRes.text();
    console.log("Plans response length:", text.length);
    console.log("Plans response body (first 500 chars):", text.slice(0, 500));

  } catch (err) {
    console.error("Test failed with error:", err);
  }
  process.exit(0);
}

main();
