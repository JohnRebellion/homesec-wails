<script>
  import Home from "./Home.svelte"
  import ResetPassword from "./ResetPassword.svelte"
  import Settings from "./Settings.svelte"
  import Rules from "./Rules.svelte"

  import Footer from "./shared/Footer.svelte"
  import Container from "./shared/Container.svelte"
  import NavBar from "./shared/NavBar.svelte"
  import { onMount } from "svelte"
  import Cookies from "js-cookie"
  import {
    getCurrentUser,
    getDecodedToken,
    getDefaultHeaders,
  } from "./utils.js"
  let user
  let username = ""
  let requestResetUsername = ""
  let password = ""
  let alertMessage = ""
  let isLoggedOn = false
  let showRequestOTP = false
  let sendOTPBy = "sms"
  let otp = ""
  let showRequestReset = false
  let sendRequestResetBy = "sms"
  let devices = []

  async function getDevices() {
    devices = await fetch("http://localhost:8765/api/v1/devices", {
      headers: getDefaultHeaders(),
    }).then((r) => r.json())
  }

  async function submitRequestReset() {
    await fetch(
      `http://localhost:8765/api/v1/user/auth/sendResetRequest/${sendRequestResetBy}?username=${requestResetUsername}`,
      {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
      }
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.status == "success") {
          Cookies.set("username", requestResetUsername)
          const getApproveRequest = setInterval(async () => {
            await fetch(
              `http://localhost:8765/api/v1/user/auth/getApproveRequest?username=${requestResetUsername}`
            )
              .then((ra) => ra.json())
              .then((da) => {
                if (da.status == "success") {
                  Cookies.set("resetToken", da.data.resetToken)
                  activeLink = "resetPassword"
                  clearInterval(getApproveRequest)
                } else {
                  alertMessage = da.message
                }
              })
          }, 1000)
          setTimeout(() => clearInterval(getApproveRequest), 60 * 5 * 1000)
          activeLink = "home"
        } else {
          alertMessage = d.message
        }
      })
  }

  async function authenticate(uname, pword) {
    let error = ""
    await fetch("http://localhost:8765/api/v1/user/auth", {
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
      body: JSON.stringify({
        username: uname,
        password: pword,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status == "success") {
          Cookies.set("username", d.data.username)
          showRequestOTP = true
        } else {
          alertMessage = d.message
        }
      })
      .catch((err) => {
        error = err

        if (err == "SyntaxError: Unexpected end of JSON input") {
          alertMessage = "User does not exist"
        }
      })
  }

  async function submitCredentials() {
    Cookies.remove("token")
    await authenticate(username, password)

    links = [
      { class: "home", title: "Home" },
      { class: "resetPassword", title: "Reset Password" },
      { class: "requestReset", title: "Request Reset" },
      { class: "settings", title: "Settings" },
      { class: "rules", title: "Rules" },
    ]
    tabChange({ detail: "home" })
  }

  async function submitOTPRequestBy() {
    await fetch(
      `http://localhost:8765/api/v1/user/auth/sendOTPBy/${sendOTPBy}?username=${username}`,
      {
        method: "POST",
      }
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.status == "success") {
        } else {
          alertMessage = d.message
        }
      })
  }

  async function submitOTP() {
    await fetch(
      `http://localhost:8765/api/v1/user/auth/2fa?username=${Cookies.get(
        "username"
      )}`,
      {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          value: otp,
        }),
      }
    )
      .then((r) => r.json())
      .then(async (d) => {
        if (d.status == "success") {
          Cookies.set("token", d.data.token)
          await checkCookie()
          document.location.reload()
        } else {
          alertMessage = d.message
        }
      })

    if (!Cookies.get("token")) {
      alertMessage = "Incorrect OTP"
    }
  }

  async function submitFromEnter(e) {
    if (e.key == "Enter") {
      return submitCredentials()
    }
  }

  function logOut() {
    Cookies.remove("token")
    isLoggedOn = false
  }

  async function checkCookie() {
    user = getCurrentUser()

    if (user) {
      var decoded = getDecodedToken()
      var exp = decoded?.exp
      isLoggedOn = new Date(exp * 1000) >= new Date()
    } else {
      isLoggedOn = false
    }
  }

  onMount(async () => {
    setTimeout(async () => await checkCookie(), 15 * 60 * 1000)
    await checkCookie()
    let filteredLink = links.filter(
      (i) => i.class == document.location.hash.substr(1)
    )[0]?.class
    tabChange({ detail: "home" })

    if (filteredLink != undefined) {
      activeLink = filteredLink
    }
    getDevices()
  })

  let links = [
    { class: "home", title: "Home" },
    { class: "resetPassword", title: "Reset Password" },
    { class: "requestReset", title: "Request Reset" },
    { class: "settings", title: "Settings" },
    { class: "rules", title: "Rules" },
  ]
  const roleViews = [
    { view: "home", roles: ["Admin", "User"] },
    { view: "resetPassword", roles: [""] },
    { view: "requestReset", roles: [""] },
    { view: "settings", roles: ["Admin"] },
    { view: "rules", roles: ["Admin"] },
  ]
  let activeLink

  const tabChange = async (e) => {
    activeLink = e.detail
    await checkCookie()

    links = links.filter(
      (l) =>
        roleViews.filter(
          (r) => r.view == l.class && r.roles.includes(user?.role)
        ).length > 0
    )
  }

  const viewByRoles = () =>
    roleViews.filter((r) => r.view == activeLink)[0]?.roles.includes(user?.role)
</script>

{#if activeLink == "resetPassword"}
  <ResetPassword />
{:else if isLoggedOn}
  <div class="wrapper">
    <NavBar {links} on:tabChange={tabChange} on:logOut={logOut} />
    <div class="main">
      <nav class="navbar navbar-expand navbar-light navbar-bg">
        <a href={`#${activeLink}`} class="sidebar-toggle js-sidebar-toggle">
          <i class="hamburger align-self-center" />
        </a>
        <a
          href={`#home`}
          on:click={(e) => {
            e.preventDefault()
            document.location.href = "/#home"
            document.location.reload()
          }}
          class="sidebar-toggle js-sidebar-toggle"
        >
          <!-- <img
            src="images/261892287_437857561206292_1928170292514647455_n.gif"
            alt="logo"
          /> -->
        </a>
        <div class="navbar-collapse collapse">
          <ul class="navbar-nav navbar-align">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle d-none d-sm-inline-block"
                href={`#${activeLink}`}
                data-bs-toggle="dropdown"
                ><span class="text-dark">{user?.name}</span>
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <a
                  on:click={(e) => {
                    e.preventDefault()
                    logOut()
                  }}
                  class="dropdown-item"
                  href={`#${activeLink}`}>Log out</a
                >
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <Container>
        {#if viewByRoles() && activeLink == "settings"}
          <Settings />
        {:else if viewByRoles() && activeLink == "rules"}
          <Rules />
        {:else}
          <Home />
        {/if}
      </Container>
      <Footer />
    </div>
  </div>
{:else}
  <main class="d-flex w-100" id="loginMain">
    <div class="container d-flex flex-column">
      <div class="row vh-100">
        <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
          <div class="d-table-cell align-middle">
            <div class="card">
              <div class="card-body">
                <div class="m-sm-4">
                  <form>
                    {#if showRequestOTP}
                      <div class="mb-3">
                        <label for="by" class="form-label">By</label>
                        Send OTP by:
                        <select
                          bind:value={sendOTPBy}
                          id="by"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="By"
                          required={true}
                        >
                          <option value="sms" selected>SMS</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                      <div class="text-center mt-3">
                        <button
                          on:click={async (e) => {
                            e.preventDefault()
                            await submitOTPRequestBy()
                          }}
                          class="btn btn-lg btn-primary">Send OTP</button
                        >
                      </div>
                      <div class="mb-3">
                        <label for="otp" class="form-label">OTP</label>
                        <input
                          bind:value={otp}
                          id="otp"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="OTP"
                          required={true}
                        />
                      </div>
                      <div class="text-center mt-3">
                        <button
                          on:click={async (e) => {
                            e.preventDefault()
                            await submitOTP()
                          }}
                          class="btn btn-lg btn-primary">Submit</button
                        >
                      </div>
                    {/if}
                    {#if showRequestReset}
                      <div class="mb-3">
                        <label for="username" class="form-label">Username</label
                        >
                        <input
                          bind:value={requestResetUsername}
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="Username"
                          required={true}
                        />
                      </div>
                      <div class="mb-3">
                        <label for="by" class="form-label">By</label>
                        Send Request Reset Password by:
                        <select
                          bind:value={sendRequestResetBy}
                          id="by"
                          type="text"
                          class="form-control form-control-lg"
                          required={true}
                        >
                          <option value="sms" selected>SMS</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                      <div class="text-center mt-3">
                        <button
                          on:click={async (e) => {
                            e.preventDefault()
                            await submitRequestReset()
                          }}
                          class="btn btn-lg btn-primary"
                          >Send Request Reset Password</button
                        >
                      </div>
                    {/if}
                    {#if !showRequestOTP && !showRequestReset}
                      {#if devices.length > 0}
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <td>Device Name</td>
                              <td>IP address</td>
                              <td>MAC address</td>
                            </tr>
                          </thead>
                          <tbody>
                            {#each devices as device}
                              <tr>
                                <td>{device.name}</td>
                                <td>{device.ip}</td>
                                <td>{device.mac}</td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      {/if}
                      <div class="mb-3">
                        <label for="username" class="form-label">Username</label
                        >
                        <input
                          on:keypress={submitFromEnter}
                          bind:value={username}
                          id="username"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="Username"
                          required={true}
                        />
                      </div>
                      <div class="mb-3">
                        <label for="password" class="form-label">Password</label
                        >
                        <input
                          on:keypress={submitFromEnter}
                          bind:value={password}
                          id="password"
                          type="password"
                          class="form-control form-control-lg"
                          placeholder="Password"
                          required={true}
                        />
                      </div>
                      <div class="text-right mt-3">
                        <a
                          on:click={(e) => {
                            e.preventDefault()
                            showRequestReset = true
                          }}
                          href={`#resetPassword`}>Reset Password</a
                        >
                      </div>
                      <div class="text-center mt-3">
                        <button
                          on:click={async (e) => {
                            e.preventDefault()
                            await submitCredentials()
                          }}
                          class="btn btn-lg btn-primary">Sign in</button
                        >
                      </div>
                      {#if alertMessage != ""}
                        <div
                          class="text-center mt-3 alert alert-danger alert-dismissible"
                          role="alert"
                        >
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          />
                          <div class="alert-message">
                            <strong>{alertMessage}</strong>
                          </div>
                        </div>
                      {/if}
                    {/if}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
{/if}
