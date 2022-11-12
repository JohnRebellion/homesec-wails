<script>
  import Cookies from "js-cookie"
  let password = ""
  let alertMessage = ""

  async function submitResetPassword() {
    await fetch(
      `http://localhost:8765/api/v1/user/auth/resetPassword?username=${Cookies.get(
        "username"
      )}&resetToken=${Cookies.get("resetToken")}`,
      {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          value: password,
        }),
      }
    )
      .then((r) => r.json())
      .then(async (d) => {
        if (d.status == "success") {
          Cookies.remove("token")
          Cookies.remove("resetToken")
          document.location.href = "/#home"
          document.location.reload()
        } else {
          alertMessage = d.message
        }
      })
  }
</script>

<main class="d-flex w-100" id="loginMain">
  <div class="container d-flex flex-column">
    <div class="row vh-100">
      <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
        <div class="d-table-cell align-middle">
          <div class="card">
            <div class="card-body">
              <div class="m-sm-4">
                <form>
                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input
                      bind:value={password}
                      id="password"
                      type="password"
                      class="form-control form-control-lg"
                      placeholder="Password"
                      required={true}
                    />
                  </div>
                  <div class="text-center mt-3">
                    <button
                      on:click={async (e) => {
                        e.preventDefault()
                        await submitResetPassword()
                      }}
                      class="btn btn-lg btn-primary">Reset</button
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
