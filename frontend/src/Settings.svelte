<script>
  import { onMount } from "svelte"
  import Cookies from "js-cookie"
  let id = 1
  let username = ""
  let password = ""
  let name = ""
  let contactNumber = ""
  let email = ""
  let role = "Admin"
  let alertMessage = ""

  onMount(async () => {
    await fetch("http://localhost:8765/api/v1/user/1", {
      headers: getDefaultHeaders(),
    })
      .then((r) => r.json())
      .then(async (d) => {
        username = d.username
        name = d.name
        contactNumber = d.contactNumber
        email = d.email
      })
  })

  async function saveSettings() {
    await fetch("http://localhost:8765/api/v1/user/", {
      method: "PUT",
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        id,
        username,
        password,
        name,
        contactNumber,
        email,
        role,
      }),
    })
      .then((r) => r.json())
      .then(async (d) => {
        if (d.status == "success") {
          Cookies.remove("token")
          document.location.href = "/#home"
          document.location.reload()
        } else {
          alertMessage = d.message
        }
      })
  }
</script>

<div class="card">
  <div class="card-body">
    <div class="m-sm-4">
      <form>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            bind:value={username}
            id="username"
            type="text"
            class="form-control form-control-lg"
            placeholder="Username"
            required={true}
          />
        </div>
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
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            bind:value={name}
            id="name"
            type="text"
            class="form-control form-control-lg"
            placeholder="Name"
            required={true}
          />
        </div>
        <div class="mb-3">
          <label for="contactNumber" class="form-label">Contact number</label>
          <input
            bind:value={contactNumber}
            id="contactNumber"
            type="text"
            class="form-control form-control-lg"
            placeholder="Contact number"
            required={true}
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            bind:value={email}
            id="email"
            type="email"
            class="form-control form-control-lg"
            placeholder="Email"
            required={true}
          />
        </div>
        <div class="text-center mt-3">
          <button
            on:click={async (e) => {
              e.preventDefault()
              await saveSettings()
            }}
            class="btn btn-lg btn-primary">Save</button
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

<style>
  .alert-message {
    box-sizing: border-box;
    padding: 0.95rem;
    width: 100%;
  }

  .alert-dismissible .btn-close {
    padding: 1.1875rem 0.95rem;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }

  .alert {
    display: flex;
    padding: 0;
  }

  .alert-danger {
    background-color: #f8d7da;
    border-color: #f5c2c7;
    color: #842029;
  }
  .alert-dismissible {
    padding-right: 2.85rem;
  }
  .alert {
    border: 0 solid transparent;
    border-radius: 0.2rem;
    margin-bottom: 1rem;
    padding: 0.95rem;
    position: relative;
  }
</style>
