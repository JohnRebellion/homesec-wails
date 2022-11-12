<script>
  import { onMount } from "svelte"
  import { getDefaultHeaders } from "./utils.js"
  let blockWebsites = []
  let id = 0
  let name = ""
  let alertMessage = ""

  onMount(async () => {
    await refreshRules()
  })
  export async function refreshRules() {
    blockWebsites = await fetch("http://localhost:8765/api/v1/firewall", {
      headers: getDefaultHeaders(),
    }).then((r) => r.json())
  }
  export async function addRule() {
    await fetch("http://localhost:8765/api/v1/firewall", {
      method: "POST",
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        name,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status == "success") {
          refreshRules()
        } else {
          alertMessage = d.message
        }
      })
  }
  export async function updateRule() {
    await fetch("http://localhost:8765/api/v1/firewall", {
      method: "PUT",
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        id,
        name,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status == "success") {
          refreshRules()
        } else {
          alertMessage = d.message
        }
      })
  }
  export async function deleteRule(selectedID) {
    await fetch(`http://localhost:8765/api/v1/firewall/${selectedID}`, {
      method: "DELETE",
      headers: getDefaultHeaders(),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status == "success") {
          refreshRules()
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
        {#if id != 0}
          <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
              bind:value={id}
              id="id"
              type="text"
              class="form-control form-control-lg"
              placeholder="ID"
              readonly
            />
          </div>
        {/if}
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
        <div class="text-center mt-3">
          {#if id != 0}
            <button
              class="btn btn-lg btn-primary"
              on:click={() => {
                id = 0
                name = ""
              }}>Cancel</button
            >
          {/if}
          <button
            on:click={async (e) => {
              e.preventDefault()
              id == 0 ? await addRule() : await updateRule()
            }}
            class="btn btn-lg btn-primary"
            >{id == 0 ? "Create new Rule" : `Update #${id} Rule`}</button
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

{#if blockWebsites.length > 0}
  <table class="table table-striped">
    <thead>
      <tr>
        <td>Name</td>
        <td>Action</td>
      </tr>
    </thead>
    <tbody>
      {#each blockWebsites as blockWebsite}
        <tr>
          <td>{blockWebsite.name}</td>
          <td
            ><button
              class="btn btn-lg btn-primary"
              on:click={() => {
                id = blockWebsite.id
                name = blockWebsite.name
              }}>Select</button
            ><button
              class="btn btn-lg btn-primary"
              on:click={async () => await deleteRule(blockWebsite.id)}
              >Delete</button
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

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
