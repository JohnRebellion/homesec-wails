<script>
  import { createEventDispatcher, onMount } from "svelte"
  const dispatch = new createEventDispatcher()
  export let id
  export let type = "text"
  export let value
  export let inputElement
  export let options
  export let label

  let i = 0

  function getValue() {
    if (type === "radio") {
      for (let j = 0; j < i; j++) {
        if (document.getElementById(`${id}Input${j}`).checked) {
          value = document.getElementById(`${id}Input${j}`).value
        }
      }
    }

    return
  }

  onMount(() => M.AutoInit())
</script>

{#if type === "text"}
  <div class="input-field">
    <input id={`${id}Input`} type="text" bind:value bind:this={inputElement} />
    <label for={`${id}Input`}>{label}</label>
  </div>
{:else if type == "number"}
  <div class="input-field">
    <input
      id={`${id}Input`}
      type="number"
      bind:value
      bind:this={inputElement}
    />
    <label for={`${id}Input`}>{label}</label>
  </div>
{:else if type == "password"}
  <div class="input-field">
    <input
      id={`${id}Input`}
      type="password"
      bind:value
      bind:this={inputElement}
    />
    <label for={`${id}Input`}>{label}</label>
  </div>
{:else if type == "email"}
  <div class="input-field">
    <input id={`${id}Input`} type="email" bind:value bind:this={inputElement} />
    <label for={`${id}Input`}>{label}</label>
  </div>
{:else if type == "date"}
  <div class="input-field">
    <input
      id={`${id}Input`}
      type="text"
      class="datepicker"
      bind:value
      bind:this={inputElement}
    />
    <label for={`${id}Input`}>{label}</label>
  </div>
{:else if type == "select"}
  <div class="input-field">
    <select id={`${id}Input`} bind:value bind:this={inputElement}>
      {#each options as option}
        <option value={option.value}>{option.title}</option>
      {/each}
    </select>
    <label for={`${id}Input`}>{label}</label>
  </div>
{:else if type == "checkbox"}
  <div class="input-field m-3">
    <input
      id={`${id}Input`}
      type="checkbox"
      bind:value
      bind:this={inputElement}
    />
    <label for={`${id}Input`}>{label}</label>
  </div>
{:else if type == "radio"}
  {#each options as option}
    <input
      id={`${id}Input${i++}`}
      type="radio"
      value={option}
      bind:this={inputElement}
    />
    <label for={`${id}Input${i++}`}>{label}</label>
  {/each}
{/if}
